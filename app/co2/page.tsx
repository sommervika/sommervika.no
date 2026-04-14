"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AIRCRAFT,
  AIRPORTS,
  Airport,
  CO2_PER_KG_FUEL,
  JET_FUEL_DENSITY_KG_PER_L,
  LOAD_FACTOR,
  PRESETS,
  defaultAircraftForDistance,
} from "./data";
import {
  FlightLeg,
  FlightRecord,
  NewFlight,
  addFlight,
  deleteFlight,
  fetchFlights,
  isSupabaseConfigured,
} from "./supabase";

// ----------------------------------------------------------------------------
// CO2-kalkulator v2 – familiens flyreiser, delt logg m/ passord.
// Kun forbrennings-CO2. Viser både kg CO2 og liter drivstoff.
// ----------------------------------------------------------------------------

type TravelClass = "economy" | "business" | "first";

const LOCAL_KEY = "sommervika:co2:trips:v1";
const PW_KEY = "sommervika:co2:pw";

// ----------------------------------------------------------------------------
// Beregning
// ----------------------------------------------------------------------------

function haversineKm(a: Airport, b: Airport): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

function findAirport(iata: string): Airport | undefined {
  return AIRPORTS.find((a) => a.iata === iata.toUpperCase());
}

function findAircraft(code: string) {
  return AIRCRAFT.find((a) => a.code === code);
}

// Klasse-vekting: business/first tar mer kabinplass enn economy.
// Vi justerer per-passasjer-forbruk med en enkel vektfaktor.
// (Kun for å gjøre per-pax-tallet mer rettferdig – totalt drivstoff til flyet
//  endrer seg ikke.)
const CLASS_WEIGHT: Record<TravelClass, number> = {
  economy: 1.0,
  business: 2.5,
  first: 4.0,
};

interface LegCalc {
  from: string;
  to: string;
  aircraft: string;
  distanceKm: number;
  fuelKg: number;
  fuelL: number;
  co2Kg: number;
}

interface FlightCalc {
  distanceKmTotal: number; // én vei sum etapper (per pax)
  totalDistanceKm: number; // x antall passasjerer x turretur
  fuelKg: number; // totalt for alle passasjerer
  fuelL: number;
  co2Kg: number;
  perLeg: LegCalc[];
  ok: boolean;
}

function calcFlight(
  legs: FlightLeg[],
  passengers: number,
  travelClass: TravelClass,
  roundTrip: boolean
): FlightCalc {
  const roundTripMult = roundTrip ? 2 : 1;
  const classW = CLASS_WEIGHT[travelClass];
  const perLeg: LegCalc[] = [];
  let distOneWay = 0;
  let fuelKgPerPax = 0;

  for (const leg of legs) {
    const from = findAirport(leg.from);
    const to = findAirport(leg.to);
    const ac = findAircraft(leg.aircraft);
    if (!from || !to || !ac) {
      return {
        distanceKmTotal: 0,
        totalDistanceKm: 0,
        fuelKg: 0,
        fuelL: 0,
        co2Kg: 0,
        perLeg: [],
        ok: false,
      };
    }
    const distanceKm = haversineKm(from, to);
    // fuel per etappe for HELE flyet (kg): fuelKgPerKm * distanceKm
    // Per passasjer (for valgt klasse): (fuelKgPerKm / (seats * load_factor)) * distanceKm * classWeight
    const fuelPerPaxKm = (ac.fuelKgPerKm / (ac.seats * LOAD_FACTOR)) * classW;
    const legFuelKgPerPax = fuelPerPaxKm * distanceKm;
    const legFuelKg = legFuelKgPerPax * passengers;
    const legFuelL = legFuelKg / JET_FUEL_DENSITY_KG_PER_L;
    const legCo2 = legFuelKg * CO2_PER_KG_FUEL;
    perLeg.push({
      from: leg.from,
      to: leg.to,
      aircraft: leg.aircraft,
      distanceKm,
      fuelKg: legFuelKg,
      fuelL: legFuelL,
      co2Kg: legCo2,
    });
    distOneWay += distanceKm;
    fuelKgPerPax += legFuelKgPerPax;
  }

  const totalDistanceKm = distOneWay * passengers * roundTripMult;
  const fuelKg = fuelKgPerPax * passengers * roundTripMult;
  const fuelL = fuelKg / JET_FUEL_DENSITY_KG_PER_L;
  const co2Kg = fuelKg * CO2_PER_KG_FUEL;

  return {
    distanceKmTotal: distOneWay * roundTripMult,
    totalDistanceKm,
    fuelKg,
    fuelL,
    co2Kg,
    perLeg,
    ok: true,
  };
}

// ----------------------------------------------------------------------------
// Formatering
// ----------------------------------------------------------------------------

function fmtKm(v: number): string {
  return v.toLocaleString("nb-NO", { maximumFractionDigits: 0 }) + " km";
}
function fmtKg(v: number): string {
  if (v >= 1000) return (v / 1000).toLocaleString("nb-NO", { maximumFractionDigits: 2 }) + " t";
  return v.toLocaleString("nb-NO", { maximumFractionDigits: 0 }) + " kg";
}
function fmtL(v: number): string {
  if (v >= 1000) return (v / 1000).toLocaleString("nb-NO", { maximumFractionDigits: 2 }) + " m³";
  return v.toLocaleString("nb-NO", { maximumFractionDigits: 0 }) + " L";
}

// ----------------------------------------------------------------------------
// Komponenter
// ----------------------------------------------------------------------------

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-6xl px-4">{children}</div>;
}
function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5">{children}</div>;
}
function CardSection({ children }: { children: React.ReactNode }) {
  return <div className="p-6">{children}</div>;
}
function Title({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold tracking-tight">{children}</h2>;
}

function AirportPicker({
  value,
  onChange,
  label,
  id,
  compact = false,
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  id: string;
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const selected = findAirport(value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return AIRPORTS.slice(0, 20);
    return AIRPORTS.filter(
      (a) =>
        a.iata.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q)
    ).slice(0, 40);
  }, [query]);

  return (
    <div className="relative">
      {label && <label htmlFor={id} className="block text-xs font-medium text-slate-600 mb-1">{label}</label>}
      <input
        id={id}
        type="text"
        value={open ? query : selected ? `${selected.iata} — ${selected.city}` : query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="IATA/by…"
        className={`w-full rounded-xl border border-slate-300 px-3 ${compact ? "py-1.5" : "py-2"} text-sm focus:outline-none focus:ring-2 focus:ring-slate-400`}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl bg-white shadow-lg ring-1 ring-black/10">
          {filtered.map((a) => (
            <li
              key={a.iata}
              onMouseDown={(e) => { e.preventDefault(); onChange(a.iata); setQuery(""); setOpen(false); }}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-slate-100"
            >
              <span className="font-mono font-semibold">{a.iata}</span>
              <span className="text-slate-500"> — {a.city}, {a.country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AircraftPicker({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-300 px-2 py-1.5 text-sm bg-white"
    >
      <optgroup label="Narrowbody – ny generasjon">
        {AIRCRAFT.filter((a) => a.generation === "ny" && a.seats < 250).map((a) => (
          <option key={a.code} value={a.code}>{a.name}</option>
        ))}
      </optgroup>
      <optgroup label="Narrowbody – eldre">
        {AIRCRAFT.filter((a) => a.generation === "gml" && a.seats < 250).map((a) => (
          <option key={a.code} value={a.code}>{a.name}</option>
        ))}
      </optgroup>
      <optgroup label="Widebody – ny generasjon">
        {AIRCRAFT.filter((a) => a.generation === "ny" && a.seats >= 250).map((a) => (
          <option key={a.code} value={a.code}>{a.name}</option>
        ))}
      </optgroup>
      <optgroup label="Widebody – eldre">
        {AIRCRAFT.filter((a) => a.generation === "gml" && a.seats >= 250).map((a) => (
          <option key={a.code} value={a.code}>{a.name}</option>
        ))}
      </optgroup>
    </select>
  );
}

// ----------------------------------------------------------------------------
// Hovedside
// ----------------------------------------------------------------------------

const today = () => new Date().toISOString().slice(0, 10);

export default function CO2Page() {
  const configured = isSupabaseConfigured();
  const [trips, setTrips] = useState<FlightRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");

  // Skjema-tilstand
  const [legs, setLegs] = useState<FlightLeg[]>([{ from: "OSL", to: "", aircraft: "B737MAX8" }]);
  const [date, setDate] = useState<string>(today());
  const [traveler, setTraveler] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [passengers, setPassengers] = useState<number>(1);
  const [travelClass, setTravelClass] = useState<TravelClass>("economy");
  const [roundTrip, setRoundTrip] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);

  // Last inn passord fra sessionStorage
  useEffect(() => {
    try {
      const pw = sessionStorage.getItem(PW_KEY);
      if (pw) setPassword(pw);
    } catch {}
  }, []);

  // Last reiser
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        if (configured) {
          const rows = await fetchFlights();
          setTrips(rows);
        } else {
          // Fallback til localStorage
          const raw = localStorage.getItem(LOCAL_KEY);
          if (raw) setTrips(JSON.parse(raw));
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [configured]);

  // Forhåndsvisning
  const preview = useMemo(
    () => calcFlight(legs, passengers, travelClass, roundTrip),
    [legs, passengers, travelClass, roundTrip]
  );

  // Totaler
  const totals = useMemo(() => {
    let fuelKg = 0,
      fuelL = 0,
      co2Kg = 0,
      km = 0;
    for (const t of trips) {
      const c = calcFlight(t.legs, t.passengers, t.travel_class, t.round_trip);
      fuelKg += c.fuelKg;
      fuelL += c.fuelL;
      co2Kg += c.co2Kg;
      km += c.totalDistanceKm;
    }
    return { fuelKg, fuelL, co2Kg, km };
  }, [trips]);

  const byYear = useMemo(() => {
    const map = new Map<string, { trips: FlightRecord[]; co2: number; fuelL: number }>();
    for (const t of trips) {
      const year = t.date ? t.date.slice(0, 4) : "—";
      const c = calcFlight(t.legs, t.passengers, t.travel_class, t.round_trip);
      const e = map.get(year) || { trips: [], co2: 0, fuelL: 0 };
      e.trips.push(t);
      e.co2 += c.co2Kg;
      e.fuelL += c.fuelL;
      map.set(year, e);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [trips]);

  // --------------------------------------------------------------------------
  // Skjema-handlere
  // --------------------------------------------------------------------------

  function applyPreset(presetId: string) {
    const p = PRESETS.find((x) => x.id === presetId);
    if (!p) return;
    setLegs(p.legs.map((l) => ({
      from: l.from,
      to: l.to,
      aircraft: l.aircraft || defaultAircraftForDistance(
        (() => {
          const f = findAirport(l.from); const t = findAirport(l.to);
          return f && t ? haversineKm(f, t) : 0;
        })()
      ),
    })));
    setRoundTrip(p.roundTrip);
  }

  function addLeg() {
    const last = legs[legs.length - 1];
    setLegs([...legs, { from: last?.to || "", to: "", aircraft: "B737MAX8" }]);
  }
  function removeLeg(i: number) {
    setLegs(legs.filter((_, idx) => idx !== i));
  }
  function updateLeg(i: number, patch: Partial<FlightLeg>) {
    setLegs(legs.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }

  function resetForm() {
    setLegs([{ from: "OSL", to: "", aircraft: "B737MAX8" }]);
    setDate(today());
    setTraveler("");
    setNote("");
    setPassengers(1);
    setTravelClass("economy");
    setRoundTrip(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // Validering
    for (const l of legs) {
      if (!findAirport(l.from) || !findAirport(l.to)) {
        alert("Alle etapper må ha gyldig fra og til.");
        return;
      }
      if (l.from.toUpperCase() === l.to.toUpperCase()) {
        alert("Fra og til kan ikke være samme flyplass på en etappe.");
        return;
      }
      if (!findAircraft(l.aircraft)) {
        alert("Velg flytype for hver etappe.");
        return;
      }
    }
    if (legs.length === 0) {
      alert("Legg til minst én etappe.");
      return;
    }

    const pw = password || promptPw();
    if (!pw) return;

    const newFlight: NewFlight = {
      date,
      traveler: traveler || null,
      note: note || null,
      legs,
      passengers,
      travel_class: travelClass,
      round_trip: roundTrip,
    };

    setSaving(true);
    try {
      if (configured) {
        await addFlight(pw, newFlight);
        sessionStorage.setItem(PW_KEY, pw);
        setPassword(pw);
        const rows = await fetchFlights();
        setTrips(rows);
      } else {
        // Lokal-fallback
        const rec: FlightRecord = {
          id: Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
          created_at: new Date().toISOString(),
          ...newFlight,
        };
        const next = [rec, ...trips];
        setTrips(next);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      }
      resetForm();
    } catch (e) {
      const msg = (e as Error).message;
      alert("Kunne ikke lagre: " + msg);
      if (msg.includes("passord")) {
        sessionStorage.removeItem(PW_KEY);
        setPassword("");
      }
    } finally {
      setSaving(false);
    }
  }

  function promptPw(): string | null {
    const pw = window.prompt("Familie-passord:");
    if (pw) {
      sessionStorage.setItem(PW_KEY, pw);
      setPassword(pw);
    }
    return pw;
  }

  async function onDelete(id: string) {
    if (!confirm("Slette denne reisen?")) return;
    const pw = password || promptPw();
    if (!pw) return;
    try {
      if (configured) {
        await deleteFlight(pw, id);
        setTrips(trips.filter((t) => t.id !== id));
      } else {
        const next = trips.filter((t) => t.id !== id);
        setTrips(next);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      }
    } catch (e) {
      alert("Kunne ikke slette: " + (e as Error).message);
    }
  }

  const maxYearCo2 = Math.max(1, ...byYear.map(([, v]) => v.co2));

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b">
        <Container>
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl overflow-hidden shadow-sm ring-1 ring-black/5">
                <img src="/logo-hytte-icon-sketch.jpg" alt="Kilevika" className="h-full w-full object-cover" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">CO₂-kalkulator</h1>
                <p className="text-xs text-slate-500 -mt-0.5">Familiens flyreiser – delt logg</p>
              </div>
            </div>
            <a href="/" className="text-sm text-slate-600 hover:text-slate-900 underline">← Til Kilevika</a>
          </div>
        </Container>
      </header>

      <main className="py-8 space-y-6">
        <Container>
          {!configured && (
            <div className="mb-6 rounded-2xl bg-amber-50 ring-1 ring-amber-200 p-4 text-sm text-amber-900">
              <strong>Server-lagring er ikke konfigurert.</strong> Data lagres midlertidig i din egen nettleser.
              Administrator må sette <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code> og{" "}
              <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> i Netlify.
            </div>
          )}

          {/* Presets */}
          <Card>
            <CardSection>
              <Title>Standard-ruter</Title>
              <p className="text-sm text-slate-500 mt-1">Klikk for å fylle skjemaet.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p.id)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-100"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </CardSection>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Skjema */}
            <div className="lg:col-span-2">
              <Card>
                <CardSection>
                  <Title>Registrer flyreise</Title>
                  <form onSubmit={submit} className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Dato</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Reisende</label>
                        <input
                          type="text"
                          value={traveler}
                          onChange={(e) => setTraveler(e.target.value)}
                          placeholder="f.eks. Familien, Eirik…"
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    {/* Etapper */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-600">Etapper</span>
                        <button
                          type="button"
                          onClick={addLeg}
                          className="text-xs text-slate-700 underline hover:text-slate-900"
                        >
                          + Legg til etappe
                        </button>
                      </div>
                      <div className="space-y-2">
                        {legs.map((leg, i) => (
                          <div
                            key={i}
                            className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1.4fr_auto] gap-2 items-end rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200"
                          >
                            <AirportPicker
                              id={`from-${i}`}
                              label={i === 0 ? "Fra" : undefined}
                              value={leg.from}
                              onChange={(v) => updateLeg(i, { from: v })}
                              compact
                            />
                            <AirportPicker
                              id={`to-${i}`}
                              label={i === 0 ? "Til" : undefined}
                              value={leg.to}
                              onChange={(v) => updateLeg(i, { to: v })}
                              compact
                            />
                            <div>
                              {i === 0 && <label className="block text-xs font-medium text-slate-600 mb-1">Flytype</label>}
                              <AircraftPicker
                                id={`ac-${i}`}
                                value={leg.aircraft}
                                onChange={(v) => updateLeg(i, { aircraft: v })}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeLeg(i)}
                              disabled={legs.length === 1}
                              className="rounded-xl border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-white disabled:opacity-30"
                              title="Fjern etappe"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Passasjerer</label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={passengers}
                          onChange={(e) => setPassengers(Math.max(1, Number(e.target.value) || 1))}
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Klasse</label>
                        <select
                          value={travelClass}
                          onChange={(e) => setTravelClass(e.target.value as TravelClass)}
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                        >
                          <option value="economy">Economy</option>
                          <option value="business">Business</option>
                          <option value="first">First</option>
                        </select>
                      </div>
                      <div className="flex items-end gap-2 pb-1">
                        <input
                          id="rt"
                          type="checkbox"
                          checked={roundTrip}
                          onChange={(e) => setRoundTrip(e.target.checked)}
                          className="h-4 w-4"
                        />
                        <label htmlFor="rt" className="text-sm">Tur-retur</label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Notat (valgfritt)</label>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="f.eks. Sommerferie, konferanse…"
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>

                    {preview.ok && (
                      <div className="rounded-2xl bg-slate-100 p-4 text-sm">
                        <div className="flex flex-wrap gap-x-6 gap-y-1">
                          <span>Distanse: <strong>{fmtKm(preview.totalDistanceKm)}</strong></span>
                          <span>Drivstoff: <strong>{fmtL(preview.fuelL)}</strong> ({fmtKg(preview.fuelKg)})</span>
                          <span>CO₂: <strong>{fmtKg(preview.co2Kg)}</strong></span>
                        </div>
                        {preview.perLeg.length > 1 && (
                          <div className="mt-2 text-xs text-slate-500">
                            Per etappe: {preview.perLeg.map((l) => `${l.from}→${l.to} ${fmtKm(l.distanceKm)} / ${fmtL(l.fuelL)} / ${fmtKg(l.co2Kg)}`).join(" · ")}
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                      >
                        {saving ? "Lagrer…" : "Legg til reise"}
                      </button>
                      {configured && (
                        <span className="ml-3 text-xs text-slate-500">
                          {password ? "Passord lagret i denne sesjonen" : "Du blir bedt om familie-passord ved lagring"}
                        </span>
                      )}
                    </div>
                  </form>
                </CardSection>
              </Card>
            </div>

            {/* Sammendrag */}
            <div className="space-y-6">
              <Card>
                <CardSection>
                  <Title>Totalt</Title>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Antall reiser</dt>
                      <dd className="font-semibold">{trips.length}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Distanse (pax-km)</dt>
                      <dd className="font-semibold">{fmtKm(totals.km)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Drivstoff</dt>
                      <dd className="font-semibold">{fmtL(totals.fuelL)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">CO₂ (forbrenning)</dt>
                      <dd className="font-semibold">{fmtKg(totals.co2Kg)}</dd>
                    </div>
                  </dl>
                </CardSection>
              </Card>

              <Card>
                <CardSection>
                  <Title>Per år</Title>
                  {byYear.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500">
                      {loading ? "Laster…" : "Ingen reiser registrert ennå."}
                    </p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {byYear.map(([year, v]) => {
                        const pct = (v.co2 / maxYearCo2) * 100;
                        return (
                          <div key={year}>
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{year}</span>
                              <span>
                                {fmtKg(v.co2)} <span className="text-slate-400">· {fmtL(v.fuelL)} · {v.trips.length} reise{v.trips.length === 1 ? "" : "r"}</span>
                              </span>
                            </div>
                            <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                              <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardSection>
              </Card>

              {error && (
                <Card>
                  <CardSection>
                    <p className="text-sm text-red-700">Feil: {error}</p>
                  </CardSection>
                </Card>
              )}
            </div>
          </div>

          {/* Reiseliste */}
          <div className="mt-6">
            <Card>
              <CardSection>
                <Title>Registrerte reiser</Title>
                {trips.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-500">
                    {loading ? "Laster…" : "Ingen reiser ennå."}
                  </p>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-slate-500">
                          <th className="py-2 pr-3">Dato</th>
                          <th className="py-2 pr-3">Reisende</th>
                          <th className="py-2 pr-3">Rute / fly</th>
                          <th className="py-2 pr-3 text-right">Pax</th>
                          <th className="py-2 pr-3">Klasse</th>
                          <th className="py-2 pr-3">T/R</th>
                          <th className="py-2 pr-3 text-right">Distanse</th>
                          <th className="py-2 pr-3 text-right">Drivstoff</th>
                          <th className="py-2 pr-3 text-right">CO₂</th>
                          <th className="py-2 pr-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {trips.map((t) => {
                          const c = calcFlight(t.legs, t.passengers, t.travel_class, t.round_trip);
                          return (
                            <tr key={t.id} className="border-b last:border-0 align-top">
                              <td className="py-2 pr-3 whitespace-nowrap">{t.date}</td>
                              <td className="py-2 pr-3">{t.traveler || "—"}</td>
                              <td className="py-2 pr-3 font-mono text-xs">
                                {t.legs.map((l, i) => {
                                  const ac = findAircraft(l.aircraft);
                                  return (
                                    <div key={i}>
                                      {l.from} → {l.to}{" "}
                                      <span className="text-slate-400">{ac ? ac.name : l.aircraft}</span>
                                    </div>
                                  );
                                })}
                                {t.note && <div className="font-sans text-xs text-slate-400 mt-1">{t.note}</div>}
                              </td>
                              <td className="py-2 pr-3 text-right">{t.passengers}</td>
                              <td className="py-2 pr-3 capitalize">{t.travel_class}</td>
                              <td className="py-2 pr-3">{t.round_trip ? "Ja" : "Nei"}</td>
                              <td className="py-2 pr-3 text-right">{fmtKm(c.totalDistanceKm)}</td>
                              <td className="py-2 pr-3 text-right">{fmtL(c.fuelL)}</td>
                              <td className="py-2 pr-3 text-right font-semibold">{fmtKg(c.co2Kg)}</td>
                              <td className="py-2 pr-3 text-right">
                                <button
                                  onClick={() => onDelete(t.id)}
                                  className="text-xs text-red-600 underline hover:text-red-800"
                                >
                                  Slett
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardSection>
            </Card>
          </div>

          {/* Metodikk */}
          <div className="mt-6">
            <Card>
              <CardSection>
                <Title>Metodikk og kilder</Title>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <p>
                    <strong>Kun forbrennings-CO₂.</strong> Vi regner ikke inn upstream (well-to-tank),
                    radiative forcing, NOₓ eller kondensstriper. Dette er altså
                    &quot;tank-to-wake&quot;-utslipp, det som faktisk slippes ut fra motorene.
                  </p>
                  <p>
                    <strong>Drivstofforbruk per flytype:</strong> block fuel (kg/km) basert på flåtene til
                    SAS, Norwegian, BA, KLM og United. Tall sammensatt fra Airbus/Boeing performance data,
                    ICAO Aircraft Engine Emissions Databank, EASA type certificate data og benchmarker fra MIT ICAT
                    og EUROCONTROL. Typiske 2-klasse seter hos nevnte operatører. Per-passasjer-forbruk antar
                    load factor 82 % (IATA 2023-2024).
                  </p>
                  <p>
                    <strong>Klassevekting:</strong> business ×2,5, first ×4 i forhold til economy (kabinplass
                    pluss serveringsvekt). Totalt flydrivstoff endres ikke av dette.
                  </p>
                  <p>
                    <strong>Avstand:</strong> storsirkel (haversine). Reell ruteføring er typisk 5–10 % lenger.
                  </p>
                  <p>
                    <strong>Konstanter:</strong> Jet A-1 tetthet 0,80 kg/L; CO₂ per kg drivstoff 3,16 kg
                    (karbonandel ~86 %, C×44/12 ≈ 3,16).
                  </p>
                  <p className="text-slate-500 text-xs">
                    Alle tall er modellerte estimater. Faktisk forbruk varierer med vind, lastvekt,
                    ruteføring, ATC-delays og aldring/vedlikehold av flymaskinen. Bruk for illustrasjon,
                    ikke for offisiell rapportering.
                  </p>
                </div>
              </CardSection>
            </Card>
          </div>
        </Container>
      </main>

      <footer className="py-8 text-center text-xs text-slate-500">Kilevika – Sommervika.no</footer>
    </div>
  );
}
