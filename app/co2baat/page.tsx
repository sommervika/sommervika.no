"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  DacPurchase,
  FuelEntry,
  NewDacPurchase,
  NewFuelEntry,
  addDacPurchase,
  addFuelEntry,
  deleteDacPurchase,
  deleteFuelEntry,
  fetchDacPurchases,
  fetchFuelEntries,
  isSupabaseConfigured,
} from "./supabase";

// ----------------------------------------------------------------------------
// CO₂-logg for båt – Kilevika på Helgøya, Ny-Hellesund
// Yamarin + Pepsi: logg bensinfylling → CO₂ beregnet → DAC-kjøp som offset
// ----------------------------------------------------------------------------

type Boat = "Yamarin" | "Pepsi";

// --- Constants ----------------------------------------------------------
const CO2_PER_LITER = 2.31;                  // kg CO₂ per liter 95-oktan
const PRICE_PER_LITER_NOK = 23.9;            // indikativ prisboble
const DAC_PRICE_PER_TON_NOK = 4750;          // ≈ 500 USD/t

const LOCAL_FUEL_KEY = "sommervika:co2baat:fuel:v1";
const LOCAL_DAC_KEY = "sommervika:co2baat:dac:v1";
const PW_KEY = "sommervika:co2:pw"; // delt med /co2 – samme familiepassord

// --- Helpers ------------------------------------------------------------
const nfmt = (n: number, d = 0) =>
  n.toLocaleString("nb-NO", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtKg = (kg: number) => `${nfmt(kg, 0)} kg`;
const fmtL = (l: number) => `${nfmt(l, 1)} L`;
const fmtNok = (n: number) => `${nfmt(n, 0)} kr`;

function toLocalDateInputValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// --- Small presentational components -----------------------------------

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

// --- Page ---------------------------------------------------------------

export default function Co2BaatPage() {
  const configured = isSupabaseConfigured();

  const [fuel, setFuel] = useState<FuelEntry[]>([]);
  const [dac, setDac] = useState<DacPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");

  // Fuel form
  const [filledAt, setFilledAt] = useState<string>(() => toLocalDateInputValue(new Date()));
  const [boat, setBoat] = useState<Boat>("Yamarin");
  const [liters, setLiters] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [filler, setFiller] = useState<string>("");
  const [savingFuel, setSavingFuel] = useState(false);

  // DAC form
  const [dacDate, setDacDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [dacKg, setDacKg] = useState<string>("");
  const [dacBuyer, setDacBuyer] = useState<string>("");
  const [dacRef, setDacRef] = useState<string>("");
  const [savingDac, setSavingDac] = useState(false);

  // Filters
  const [filterBoat, setFilterBoat] = useState<"all" | Boat>("all");
  const [filterYear, setFilterYear] = useState<string>("all");

  // Collapsed year groups (per list)
  const [collapsedFuelYears, setCollapsedFuelYears] = useState<Set<string>>(new Set());
  const [collapsedDacYears, setCollapsedDacYears] = useState<Set<string>>(new Set());

  // --- Load from sessionStorage / remote -------------------------------
  useEffect(() => {
    try {
      const pw = sessionStorage.getItem(PW_KEY);
      if (pw) setPassword(pw);
    } catch {}
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        if (configured) {
          const [f, d] = await Promise.all([fetchFuelEntries(), fetchDacPurchases()]);
          if (!cancelled) {
            setFuel(f);
            setDac(d);
          }
        } else {
          const fRaw = localStorage.getItem(LOCAL_FUEL_KEY);
          const dRaw = localStorage.getItem(LOCAL_DAC_KEY);
          if (fRaw) setFuel(JSON.parse(fRaw));
          if (dRaw) setDac(JSON.parse(dRaw));
        }
        setError(null);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [configured]);

  // Persist to localStorage as fallback / backup
  useEffect(() => {
    if (!configured) localStorage.setItem(LOCAL_FUEL_KEY, JSON.stringify(fuel));
  }, [fuel, configured]);
  useEffect(() => {
    if (!configured) localStorage.setItem(LOCAL_DAC_KEY, JSON.stringify(dac));
  }, [dac, configured]);

  // --- Derived ---------------------------------------------------------
  const years = useMemo(() => {
    const set = new Set<string>();
    fuel.forEach((e) => set.add(e.filled_at.slice(0, 4)));
    dac.forEach((p) => set.add(p.purchased_at.slice(0, 4)));
    return [...set].sort().reverse();
  }, [fuel, dac]);

  const filteredFuel = useMemo(() => {
    return fuel.filter((e) => {
      if (filterBoat !== "all" && e.boat !== filterBoat) return false;
      if (filterYear !== "all" && !e.filled_at.startsWith(filterYear)) return false;
      return true;
    });
  }, [fuel, filterBoat, filterYear]);

  const filteredDac = useMemo(() => {
    return dac.filter((p) => {
      if (filterYear !== "all" && !p.purchased_at.startsWith(filterYear)) return false;
      return true;
    });
  }, [dac, filterYear]);

  const totals = useMemo(() => {
    const litersSum = filteredFuel.reduce((s, e) => s + Number(e.liters), 0);
    const co2Kg = litersSum * CO2_PER_LITER;
    const costNok = litersSum * PRICE_PER_LITER_NOK;
    const offsetKg = filteredDac.reduce((s, p) => s + Number(p.co2_kg), 0);
    const offsetPct = co2Kg > 0 ? (offsetKg / co2Kg) * 100 : 0;
    const offsetCostNok = (co2Kg / 1000) * DAC_PRICE_PER_TON_NOK;
    return { litersSum, co2Kg, costNok, offsetKg, offsetPct, offsetCostNok };
  }, [filteredFuel, filteredDac]);

  // Grouping helpers
  const fuelByYear = useMemo(() => {
    const map: Record<string, FuelEntry[]> = {};
    filteredFuel.forEach((e) => {
      const y = e.filled_at.slice(0, 4);
      (map[y] ||= []).push(e);
    });
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
  }, [filteredFuel]);

  const dacByYear = useMemo(() => {
    const map: Record<string, DacPurchase[]> = {};
    filteredDac.forEach((p) => {
      const y = p.purchased_at.slice(0, 4);
      (map[y] ||= []).push(p);
    });
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
  }, [filteredDac]);

  // On first load, collapse all years except current
  useEffect(() => {
    if (loading) return;
    const current = String(new Date().getFullYear());
    setCollapsedFuelYears((prev) => {
      if (prev.size > 0) return prev;
      const next = new Set<string>();
      fuelByYear.forEach(([y]) => {
        if (y !== current) next.add(y);
      });
      return next;
    });
    setCollapsedDacYears((prev) => {
      if (prev.size > 0) return prev;
      const next = new Set<string>();
      dacByYear.forEach(([y]) => {
        if (y !== current) next.add(y);
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const livePreview = useMemo(() => {
    const L = Number(liters) || 0;
    return {
      co2: L * CO2_PER_LITER,
      offset: (L * CO2_PER_LITER / 1000) * DAC_PRICE_PER_TON_NOK,
    };
  }, [liters]);

  const dacLivePreview = useMemo(() => {
    const kg = Number(dacKg) || 0;
    return { cost: (kg / 1000) * DAC_PRICE_PER_TON_NOK };
  }, [dacKg]);

  // --- Actions ---------------------------------------------------------

  function promptPw(): string | null {
    const pw = window.prompt("Familie-passord:");
    if (pw) {
      sessionStorage.setItem(PW_KEY, pw);
      setPassword(pw);
    }
    return pw;
  }

  async function submitFuel(e: React.FormEvent) {
    e.preventDefault();
    const litersNum = Number(liters);
    if (!litersNum || litersNum <= 0) {
      alert("Skriv inn antall liter.");
      return;
    }
    const entry: NewFuelEntry = {
      filled_at: new Date(filledAt + "T12:00:00").toISOString(),
      boat,
      liters: litersNum,
      location: location.trim() || null,
      filler: filler.trim() || null,
    };
    setSavingFuel(true);
    try {
      if (configured) {
        let pw = password || sessionStorage.getItem(PW_KEY) || "";
        if (!pw) {
          pw = promptPw() || "";
          if (!pw) return;
        }
        await addFuelEntry(pw, entry);
        sessionStorage.setItem(PW_KEY, pw);
        setPassword(pw);
        const rows = await fetchFuelEntries();
        setFuel(rows);
      } else {
        const local: FuelEntry = {
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          ...entry,
          location: entry.location,
          filler: entry.filler,
        };
        setFuel((cur) => [local, ...cur]);
      }
      setLiters("");
      setLocation("");
      setFiller("");
      setFilledAt(toLocalDateInputValue(new Date()));
      setError(null);
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      if (msg.toLowerCase().includes("passord")) {
        sessionStorage.removeItem(PW_KEY);
        setPassword("");
      } else {
        alert("Kunne ikke lagre: " + msg);
      }
    } finally {
      setSavingFuel(false);
    }
  }

  async function submitDac(e: React.FormEvent) {
    e.preventDefault();
    const kg = Number(dacKg);
    if (!kg || kg <= 0) {
      alert("Skriv inn antall kg CO₂.");
      return;
    }
    const purchase: NewDacPurchase = {
      purchased_at: dacDate,
      co2_kg: kg,
      buyer: dacBuyer.trim() || null,
      reference: dacRef.trim() || null,
    };
    setSavingDac(true);
    try {
      if (configured) {
        let pw = password || sessionStorage.getItem(PW_KEY) || "";
        if (!pw) {
          pw = promptPw() || "";
          if (!pw) return;
        }
        await addDacPurchase(pw, purchase);
        sessionStorage.setItem(PW_KEY, pw);
        setPassword(pw);
        const rows = await fetchDacPurchases();
        setDac(rows);
      } else {
        const local: DacPurchase = {
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          ...purchase,
          buyer: purchase.buyer,
          reference: purchase.reference,
        };
        setDac((cur) => [local, ...cur]);
      }
      setDacKg("");
      setDacBuyer("");
      setDacRef("");
      setDacDate(new Date().toISOString().slice(0, 10));
      setError(null);
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      if (msg.toLowerCase().includes("passord")) {
        sessionStorage.removeItem(PW_KEY);
        setPassword("");
      } else {
        alert("Kunne ikke lagre: " + msg);
      }
    } finally {
      setSavingDac(false);
    }
  }

  async function removeFuel(id: string) {
    if (!window.confirm("Slette denne fyllingen?")) return;
    try {
      if (configured) {
        let pw = password || sessionStorage.getItem(PW_KEY) || "";
        if (!pw) {
          pw = promptPw() || "";
          if (!pw) return;
        }
        await deleteFuelEntry(pw, id);
        setFuel((cur) => cur.filter((e) => e.id !== id));
      } else {
        setFuel((cur) => cur.filter((e) => e.id !== id));
      }
    } catch (err) {
      alert("Kunne ikke slette: " + (err as Error).message);
    }
  }

  async function removeDac(id: string) {
    if (!window.confirm("Slette dette DAC-kjøpet?")) return;
    try {
      if (configured) {
        let pw = password || sessionStorage.getItem(PW_KEY) || "";
        if (!pw) {
          pw = promptPw() || "";
          if (!pw) return;
        }
        await deleteDacPurchase(pw, id);
        setDac((cur) => cur.filter((p) => p.id !== id));
      } else {
        setDac((cur) => cur.filter((p) => p.id !== id));
      }
    } catch (err) {
      alert("Kunne ikke slette: " + (err as Error).message);
    }
  }

  function toggleFuelYear(y: string) {
    setCollapsedFuelYears((prev) => {
      const next = new Set(prev);
      if (next.has(y)) next.delete(y);
      else next.add(y);
      return next;
    });
  }
  function toggleDacYear(y: string) {
    setCollapsedDacYears((prev) => {
      const next = new Set(prev);
      if (next.has(y)) next.delete(y);
      else next.add(y);
      return next;
    });
  }

  // --- Render ----------------------------------------------------------

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
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">CO₂-logg · båt</h1>
                <p className="text-xs text-slate-500 -mt-0.5">Yamarin & Pepsi · delt drivstoff-logg</p>
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

          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Totalt drivstoff" value={fmtL(totals.litersSum)} />
            <StatCard label="CO₂-utslipp" value={fmtKg(totals.co2Kg)} sub={`${nfmt(CO2_PER_LITER, 2)} kg/L`} />
            <StatCard
              label="Bekreftet fjernet via DAC"
              value={fmtKg(totals.offsetKg)}
              sub={`${nfmt(totals.offsetPct, 0)} % av ${nfmt(totals.co2Kg, 0)} kg`}
            />
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-2">
            <FilterChip active={filterYear === "all"} onClick={() => setFilterYear("all")}>Alle år</FilterChip>
            {years.map((y) => (
              <FilterChip key={y} active={filterYear === y} onClick={() => setFilterYear(y)}>{y}</FilterChip>
            ))}
            <span className="mx-2 w-px bg-slate-200" />
            <FilterChip active={filterBoat === "all"} onClick={() => setFilterBoat("all")}>Begge båter</FilterChip>
            <FilterChip active={filterBoat === "Yamarin"} onClick={() => setFilterBoat("Yamarin")}>Yamarin</FilterChip>
            <FilterChip active={filterBoat === "Pepsi"} onClick={() => setFilterBoat("Pepsi")}>Pepsi</FilterChip>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fuel form */}
            <div className="lg:col-span-2">
              <Card>
                <CardSection>
                  <Title>Logg drivstoffylling</Title>
                  <p className="text-sm text-slate-500 mt-1">CO₂ beregnes automatisk: <strong>2,31 kg/L</strong>.</p>
                  <form onSubmit={submitFuel} className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Dato</label>
                        <input
                          type="date"
                          value={filledAt}
                          onChange={(e) => setFilledAt(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Båt</label>
                        <div className="flex gap-2">
                          {(["Yamarin", "Pepsi"] as Boat[]).map((b) => (
                            <button
                              type="button"
                              key={b}
                              onClick={() => setBoat(b)}
                              className={
                                "flex-1 rounded-xl px-3 py-2 text-sm border transition " +
                                (boat === b
                                  ? "bg-slate-900 text-white border-slate-900"
                                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50")
                              }
                            >
                              {b}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Liter</label>
                        <input
                          type="number"
                          inputMode="decimal"
                          step="0.1"
                          min={0}
                          value={liters}
                          onChange={(e) => setLiters(e.target.value)}
                          placeholder="0"
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Sted / marina</label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Høllen Marina"
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Fyller</label>
                        <input
                          type="text"
                          value={filler}
                          onChange={(e) => setFiller(e.target.value)}
                          placeholder="Navn"
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-100 p-4 text-sm">
                      <div className="flex flex-wrap gap-x-6 gap-y-1">
                        <span>CO₂: <strong>{fmtKg(livePreview.co2)}</strong></span>
                        <span>DAC-offset: <strong>{fmtNok(livePreview.offset)}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={savingFuel}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                      >
                        {savingFuel ? "Lagrer…" : "Logg påfylling"}
                      </button>
                      {configured && (
                        <span className="text-xs text-slate-500">
                          {password ? "Passord lagret i denne sesjonen" : "Du blir bedt om familie-passord ved lagring"}
                        </span>
                      )}
                    </div>
                  </form>
                </CardSection>
              </Card>
            </div>

            {/* DAC form */}
            <div>
              <Card>
                <CardSection>
                  <Title>Registrer DAC-kjøp</Title>
                  <p className="text-sm text-slate-500 mt-1">
                    Fjerning kjøpt hos Climeworks. Trekkes fra utslippet i oversikten.
                  </p>
                  <form onSubmit={submitDac} className="mt-4 space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Dato</label>
                      <input
                        type="date"
                        value={dacDate}
                        onChange={(e) => setDacDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">CO₂ fjernet (kg)</label>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="1"
                        min={0}
                        value={dacKg}
                        onChange={(e) => setDacKg(e.target.value)}
                        placeholder="0"
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Kjøper</label>
                      <input
                        type="text"
                        value={dacBuyer}
                        onChange={(e) => setDacBuyer(e.target.value)}
                        placeholder="Navn"
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Referanse / ordrenr</label>
                      <input
                        type="text"
                        value={dacRef}
                        onChange={(e) => setDacRef(e.target.value)}
                        placeholder="CW-2026-…"
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>

                    <div className="rounded-2xl bg-slate-100 p-4 text-sm flex items-center justify-between">
                      <span>Estimert kostnad</span>
                      <strong>{fmtNok(dacLivePreview.cost)}</strong>
                    </div>
                    <p className="text-xs text-slate-500">
                      Indikativ pris: <strong>{nfmt(DAC_PRICE_PER_TON_NOK, 0)} kr/t</strong> (≈ 500 USD/t).
                    </p>

                    <button
                      type="submit"
                      disabled={savingDac}
                      className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                      {savingDac ? "Lagrer…" : "Registrer DAC-kjøp"}
                    </button>
                  </form>
                </CardSection>
              </Card>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl bg-red-50 ring-1 ring-red-200 p-4 text-sm text-red-700">
              Feil: {error}
            </div>
          )}

          {/* Fuel history */}
          <div className="mt-8">
            <Card>
              <CardSection>
                <Title>Historikk – drivstoffyllinger</Title>
                {loading ? (
                  <p className="mt-2 text-sm text-slate-500">Laster…</p>
                ) : fuelByYear.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-500">Ingen fyllinger registrert ennå.</p>
                ) : (
                  <div className="mt-4 space-y-5">
                    {fuelByYear.map(([y, entries]) => {
                      const collapsed = collapsedFuelYears.has(y);
                      const yLiters = entries.reduce((s, e) => s + Number(e.liters), 0);
                      const yCo2 = yLiters * CO2_PER_LITER;
                      return (
                        <div key={y}>
                          <button
                            type="button"
                            onClick={() => toggleFuelYear(y)}
                            className="w-full flex items-center justify-between text-left py-2 border-b border-slate-200 hover:bg-slate-50 -mx-2 px-2 rounded-lg"
                          >
                            <span className="flex items-baseline gap-3">
                              <span className="inline-block w-4 text-slate-400 font-mono text-sm">
                                {collapsed ? "+" : "−"}
                              </span>
                              <span className="text-base font-semibold">{y}</span>
                              <span className="text-xs text-slate-500">{entries.length} {entries.length === 1 ? "fylling" : "fyllinger"}</span>
                            </span>
                            <span className="text-xs font-mono text-slate-500">
                              {fmtL(yLiters)} · {fmtKg(yCo2)}
                            </span>
                          </button>
                          {!collapsed && (
                            <div className="overflow-x-auto mt-2">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="text-xs text-slate-500 text-left">
                                    <th className="py-2 font-medium">Tidspunkt</th>
                                    <th className="py-2 font-medium">Båt</th>
                                    <th className="py-2 font-medium text-right">Liter</th>
                                    <th className="py-2 font-medium text-right">CO₂</th>
                                    <th className="py-2 font-medium">Sted · fyller</th>
                                    <th className="py-2 font-medium w-10"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {entries.map((e) => {
                                    const d = new Date(e.filled_at);
                                    const dateStr = d.toLocaleDateString("nb-NO", { day: "2-digit", month: "short" });
                                    const co2 = Number(e.liters) * CO2_PER_LITER;
                                    return (
                                      <tr key={e.id} className="border-t border-slate-100">
                                        <td className="py-2 font-mono text-xs text-slate-600">{dateStr}</td>
                                        <td className="py-2">
                                          <span className={
                                            "inline-block rounded-full px-2 py-0.5 text-xs " +
                                            (e.boat === "Yamarin"
                                              ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100"
                                              : "bg-amber-50 text-amber-800 ring-1 ring-amber-100")
                                          }>
                                            {e.boat}
                                          </span>
                                        </td>
                                        <td className="py-2 text-right font-mono">{nfmt(Number(e.liters), 1)} L</td>
                                        <td className="py-2 text-right font-mono">{nfmt(co2, 0)} kg</td>
                                        <td className="py-2 text-slate-600">
                                          {e.location || "—"}
                                          {e.filler && <span className="text-slate-400"> · {e.filler}</span>}
                                        </td>
                                        <td className="py-2 text-right">
                                          <button
                                            onClick={() => removeFuel(e.id)}
                                            className="text-xs text-slate-400 hover:text-red-600"
                                            title="Slett"
                                          >
                                            ×
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardSection>
            </Card>
          </div>

          {/* DAC history */}
          <div className="mt-6">
            <Card>
              <CardSection>
                <Title>Historikk – DAC-kjøp</Title>
                {loading ? (
                  <p className="mt-2 text-sm text-slate-500">Laster…</p>
                ) : dacByYear.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-500">Ingen DAC-kjøp registrert ennå.</p>
                ) : (
                  <div className="mt-4 space-y-5">
                    {dacByYear.map(([y, items]) => {
                      const collapsed = collapsedDacYears.has(y);
                      const yKg = items.reduce((s, p) => s + Number(p.co2_kg), 0);
                      const yCost = (yKg / 1000) * DAC_PRICE_PER_TON_NOK;
                      return (
                        <div key={y}>
                          <button
                            type="button"
                            onClick={() => toggleDacYear(y)}
                            className="w-full flex items-center justify-between text-left py-2 border-b border-slate-200 hover:bg-slate-50 -mx-2 px-2 rounded-lg"
                          >
                            <span className="flex items-baseline gap-3">
                              <span className="inline-block w-4 text-slate-400 font-mono text-sm">
                                {collapsed ? "+" : "−"}
                              </span>
                              <span className="text-base font-semibold">{y}</span>
                              <span className="text-xs text-slate-500">{items.length} {items.length === 1 ? "kjøp" : "kjøp"}</span>
                            </span>
                            <span className="text-xs font-mono text-slate-500">
                              {fmtKg(yKg)} · {fmtNok(yCost)}
                            </span>
                          </button>
                          {!collapsed && (
                            <div className="overflow-x-auto mt-2">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="text-xs text-slate-500 text-left">
                                    <th className="py-2 font-medium">Dato</th>
                                    <th className="py-2 font-medium text-right">CO₂</th>
                                    <th className="py-2 font-medium text-right">Kostnad</th>
                                    <th className="py-2 font-medium">Kjøper · referanse</th>
                                    <th className="py-2 font-medium w-10"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {items.map((p) => {
                                    const dateStr = new Date(p.purchased_at).toLocaleDateString("nb-NO", { day: "2-digit", month: "short", year: "numeric" });
                                    const cost = (Number(p.co2_kg) / 1000) * DAC_PRICE_PER_TON_NOK;
                                    return (
                                      <tr key={p.id} className="border-t border-slate-100">
                                        <td className="py-2 font-mono text-xs text-slate-600">{dateStr}</td>
                                        <td className="py-2 text-right font-mono">{nfmt(Number(p.co2_kg), 0)} kg</td>
                                        <td className="py-2 text-right font-mono">{nfmt(cost, 0)} kr</td>
                                        <td className="py-2 text-slate-600">
                                          {p.buyer || "—"}
                                          {p.reference && <span className="text-slate-400"> · {p.reference}</span>}
                                        </td>
                                        <td className="py-2 text-right">
                                          <button
                                            onClick={() => removeDac(p.id)}
                                            className="text-xs text-slate-400 hover:text-red-600"
                                            title="Slett"
                                          >
                                            ×
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardSection>
            </Card>
          </div>

          {/* About DAC */}
          <div className="mt-6">
            <Card>
              <CardSection>
                <Title>Om Direct Air Capture</Title>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  All CO₂ som logges på Yamarin og Pepsi skal fjernes fra atmosfæren — ikke kompenseres med
                  trær eller kvoter, men fysisk trukket ut av lufta og lagret permanent som stein.
                  Climeworks driver DAC-anlegg på Island som fanger CO₂ direkte fra uteluft og pumper den ned
                  i basaltberggrunn, der den mineraliserer til karbonat i løpet av noen år.
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  Indikativ pris brukt i kalkylen: <strong>{nfmt(DAC_PRICE_PER_TON_NOK, 0)} kr/tonn</strong> CO₂
                  (≈ 500 USD/tonn). Oppdateres årlig.
                </p>
              </CardSection>
            </Card>
          </div>
        </Container>
      </main>
    </div>
  );
}

// --- tiny extracted presentational components --------------------------

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full px-3 py-1 text-xs border transition " +
        (active
          ? "bg-slate-900 text-white border-slate-900"
          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50")
      }
    >
      {children}
    </button>
  );
}
