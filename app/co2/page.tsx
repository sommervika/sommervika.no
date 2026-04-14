"use client";

import React, { useEffect, useMemo, useState } from "react";

// ----------------------------------------------------------------------------
// CO2-kalkulator for familiens flyreiser
// Bruker DEFRA 2024 utslippsfaktorer (kg CO2e per passasjer-km)
// og storsirkel-avstand (haversine) mellom flyplasser.
// Data lagres i nettleseren (localStorage).
// ----------------------------------------------------------------------------

type TravelClass = "economy" | "business" | "first";

interface Trip {
  id: string;
  date: string; // YYYY-MM-DD
  from: string; // IATA
  to: string; // IATA
  passengers: number;
  travelClass: TravelClass;
  roundTrip: boolean;
  traveler?: string; // navn / familiemedlem (valgfritt)
  note?: string;
}

interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
}

// Utvalg av flyplasser (alle norske + store nordiske/europeiske/globale hubs).
// Utvid gjerne listen ved behov.
const AIRPORTS: Airport[] = [
  // Norge
  { iata: "OSL", name: "Oslo Gardermoen", city: "Oslo", country: "NO", lat: 60.1939, lon: 11.1004 },
  { iata: "TRF", name: "Sandefjord Torp", city: "Sandefjord", country: "NO", lat: 59.1867, lon: 10.2586 },
  { iata: "RYG", name: "Moss Rygge", city: "Moss", country: "NO", lat: 59.379, lon: 10.785 },
  { iata: "BGO", name: "Bergen Flesland", city: "Bergen", country: "NO", lat: 60.2934, lon: 5.2181 },
  { iata: "SVG", name: "Stavanger Sola", city: "Stavanger", country: "NO", lat: 58.8767, lon: 5.6378 },
  { iata: "TRD", name: "Trondheim Værnes", city: "Trondheim", country: "NO", lat: 63.4578, lon: 10.924 },
  { iata: "KRS", name: "Kristiansand Kjevik", city: "Kristiansand", country: "NO", lat: 58.2042, lon: 8.0853 },
  { iata: "BOO", name: "Bodø", city: "Bodø", country: "NO", lat: 67.2692, lon: 14.3653 },
  { iata: "TOS", name: "Tromsø", city: "Tromsø", country: "NO", lat: 69.6833, lon: 18.9189 },
  { iata: "AES", name: "Ålesund Vigra", city: "Ålesund", country: "NO", lat: 62.5625, lon: 6.1197 },
  { iata: "MOL", name: "Molde Årø", city: "Molde", country: "NO", lat: 62.7447, lon: 7.2625 },
  { iata: "KSU", name: "Kristiansund Kvernberget", city: "Kristiansund", country: "NO", lat: 63.1118, lon: 7.8245 },
  { iata: "HAU", name: "Haugesund Karmøy", city: "Haugesund", country: "NO", lat: 59.3453, lon: 5.2083 },
  { iata: "EVE", name: "Harstad/Narvik Evenes", city: "Harstad", country: "NO", lat: 68.4914, lon: 16.6781 },
  { iata: "ALF", name: "Alta", city: "Alta", country: "NO", lat: 69.9761, lon: 23.3717 },
  { iata: "KKN", name: "Kirkenes Høybuktmoen", city: "Kirkenes", country: "NO", lat: 69.7258, lon: 29.8913 },
  { iata: "LKN", name: "Leknes", city: "Leknes", country: "NO", lat: 68.1525, lon: 13.6094 },
  { iata: "SVJ", name: "Svolvær Helle", city: "Svolvær", country: "NO", lat: 68.2433, lon: 14.6692 },
  { iata: "LYR", name: "Svalbard Longyearbyen", city: "Longyearbyen", country: "NO", lat: 78.2461, lon: 15.4656 },
  // Sverige / Danmark / Finland / Island
  { iata: "ARN", name: "Stockholm Arlanda", city: "Stockholm", country: "SE", lat: 59.6519, lon: 17.9186 },
  { iata: "BMA", name: "Stockholm Bromma", city: "Stockholm", country: "SE", lat: 59.3544, lon: 17.9417 },
  { iata: "GOT", name: "Göteborg Landvetter", city: "Göteborg", country: "SE", lat: 57.6628, lon: 12.2798 },
  { iata: "MMX", name: "Malmö Sturup", city: "Malmö", country: "SE", lat: 55.5363, lon: 13.3762 },
  { iata: "CPH", name: "København Kastrup", city: "København", country: "DK", lat: 55.6179, lon: 12.656 },
  { iata: "AAL", name: "Aalborg", city: "Aalborg", country: "DK", lat: 57.0928, lon: 9.8492 },
  { iata: "BLL", name: "Billund", city: "Billund", country: "DK", lat: 55.7403, lon: 9.1518 },
  { iata: "HEL", name: "Helsinki Vantaa", city: "Helsinki", country: "FI", lat: 60.3172, lon: 24.9633 },
  { iata: "KEF", name: "Reykjavík Keflavík", city: "Reykjavík", country: "IS", lat: 63.985, lon: -22.6056 },
  // Europa – hubs
  { iata: "LHR", name: "London Heathrow", city: "London", country: "GB", lat: 51.47, lon: -0.4543 },
  { iata: "LGW", name: "London Gatwick", city: "London", country: "GB", lat: 51.1537, lon: -0.1821 },
  { iata: "STN", name: "London Stansted", city: "London", country: "GB", lat: 51.885, lon: 0.235 },
  { iata: "MAN", name: "Manchester", city: "Manchester", country: "GB", lat: 53.3537, lon: -2.275 },
  { iata: "EDI", name: "Edinburgh", city: "Edinburgh", country: "GB", lat: 55.95, lon: -3.3725 },
  { iata: "CDG", name: "Paris Charles de Gaulle", city: "Paris", country: "FR", lat: 49.0097, lon: 2.5479 },
  { iata: "ORY", name: "Paris Orly", city: "Paris", country: "FR", lat: 48.7233, lon: 2.3794 },
  { iata: "NCE", name: "Nice Côte d'Azur", city: "Nice", country: "FR", lat: 43.6584, lon: 7.2158 },
  { iata: "AMS", name: "Amsterdam Schiphol", city: "Amsterdam", country: "NL", lat: 52.3086, lon: 4.7639 },
  { iata: "BRU", name: "Brussel Zaventem", city: "Brussel", country: "BE", lat: 50.9014, lon: 4.4844 },
  { iata: "FRA", name: "Frankfurt", city: "Frankfurt", country: "DE", lat: 50.0379, lon: 8.5622 },
  { iata: "MUC", name: "München", city: "München", country: "DE", lat: 48.3538, lon: 11.7861 },
  { iata: "BER", name: "Berlin Brandenburg", city: "Berlin", country: "DE", lat: 52.3667, lon: 13.5033 },
  { iata: "HAM", name: "Hamburg", city: "Hamburg", country: "DE", lat: 53.6304, lon: 9.9882 },
  { iata: "DUS", name: "Düsseldorf", city: "Düsseldorf", country: "DE", lat: 51.2895, lon: 6.7668 },
  { iata: "ZRH", name: "Zürich", city: "Zürich", country: "CH", lat: 47.4647, lon: 8.5492 },
  { iata: "GVA", name: "Genève", city: "Genève", country: "CH", lat: 46.2381, lon: 6.1089 },
  { iata: "VIE", name: "Wien", city: "Wien", country: "AT", lat: 48.1103, lon: 16.5697 },
  { iata: "WAW", name: "Warszawa Chopin", city: "Warszawa", country: "PL", lat: 52.1657, lon: 20.9671 },
  { iata: "KRK", name: "Kraków", city: "Kraków", country: "PL", lat: 50.0777, lon: 19.7848 },
  { iata: "GDN", name: "Gdańsk", city: "Gdańsk", country: "PL", lat: 54.3776, lon: 18.4662 },
  { iata: "PRG", name: "Praha Václav Havel", city: "Praha", country: "CZ", lat: 50.1008, lon: 14.26 },
  { iata: "BUD", name: "Budapest", city: "Budapest", country: "HU", lat: 47.4369, lon: 19.2556 },
  { iata: "MAD", name: "Madrid Barajas", city: "Madrid", country: "ES", lat: 40.4983, lon: -3.5676 },
  { iata: "BCN", name: "Barcelona El Prat", city: "Barcelona", country: "ES", lat: 41.2974, lon: 2.0833 },
  { iata: "AGP", name: "Málaga", city: "Málaga", country: "ES", lat: 36.6749, lon: -4.4991 },
  { iata: "PMI", name: "Palma de Mallorca", city: "Palma", country: "ES", lat: 39.5517, lon: 2.7388 },
  { iata: "ALC", name: "Alicante", city: "Alicante", country: "ES", lat: 38.2822, lon: -0.5582 },
  { iata: "IBZ", name: "Ibiza", city: "Ibiza", country: "ES", lat: 38.8729, lon: 1.3731 },
  { iata: "TFS", name: "Tenerife South", city: "Tenerife", country: "ES", lat: 28.0445, lon: -16.5725 },
  { iata: "LPA", name: "Gran Canaria", city: "Las Palmas", country: "ES", lat: 27.9319, lon: -15.3866 },
  { iata: "FCO", name: "Roma Fiumicino", city: "Roma", country: "IT", lat: 41.8003, lon: 12.2389 },
  { iata: "MXP", name: "Milano Malpensa", city: "Milano", country: "IT", lat: 45.63, lon: 8.7231 },
  { iata: "VCE", name: "Venezia Marco Polo", city: "Venezia", country: "IT", lat: 45.505, lon: 12.3519 },
  { iata: "NAP", name: "Napoli", city: "Napoli", country: "IT", lat: 40.886, lon: 14.2908 },
  { iata: "ATH", name: "Athen Eleftherios Venizelos", city: "Athen", country: "GR", lat: 37.9364, lon: 23.9475 },
  { iata: "LIS", name: "Lissabon", city: "Lissabon", country: "PT", lat: 38.7813, lon: -9.1359 },
  { iata: "IST", name: "Istanbul", city: "Istanbul", country: "TR", lat: 41.2753, lon: 28.7519 },
  { iata: "DUB", name: "Dublin", city: "Dublin", country: "IE", lat: 53.4213, lon: -6.2701 },
  { iata: "RIX", name: "Riga", city: "Riga", country: "LV", lat: 56.9236, lon: 23.9711 },
  { iata: "TLL", name: "Tallinn", city: "Tallinn", country: "EE", lat: 59.4133, lon: 24.8328 },
  { iata: "VNO", name: "Vilnius", city: "Vilnius", country: "LT", lat: 54.6341, lon: 25.2858 },
  // Nord-Amerika
  { iata: "JFK", name: "New York JFK", city: "New York", country: "US", lat: 40.6413, lon: -73.7781 },
  { iata: "EWR", name: "Newark", city: "New York", country: "US", lat: 40.6895, lon: -74.1745 },
  { iata: "LGA", name: "New York LaGuardia", city: "New York", country: "US", lat: 40.7769, lon: -73.874 },
  { iata: "BOS", name: "Boston Logan", city: "Boston", country: "US", lat: 42.3656, lon: -71.0096 },
  { iata: "IAD", name: "Washington Dulles", city: "Washington DC", country: "US", lat: 38.9445, lon: -77.4558 },
  { iata: "DCA", name: "Washington Reagan", city: "Washington DC", country: "US", lat: 38.8512, lon: -77.0402 },
  { iata: "ORD", name: "Chicago O'Hare", city: "Chicago", country: "US", lat: 41.9742, lon: -87.9073 },
  { iata: "ATL", name: "Atlanta", city: "Atlanta", country: "US", lat: 33.6407, lon: -84.4277 },
  { iata: "MIA", name: "Miami", city: "Miami", country: "US", lat: 25.7959, lon: -80.287 },
  { iata: "MCO", name: "Orlando", city: "Orlando", country: "US", lat: 28.4312, lon: -81.308 },
  { iata: "DFW", name: "Dallas/Fort Worth", city: "Dallas", country: "US", lat: 32.8998, lon: -97.0403 },
  { iata: "IAH", name: "Houston Intercontinental", city: "Houston", country: "US", lat: 29.9902, lon: -95.3368 },
  { iata: "DEN", name: "Denver", city: "Denver", country: "US", lat: 39.8561, lon: -104.6737 },
  { iata: "LAX", name: "Los Angeles", city: "Los Angeles", country: "US", lat: 33.9416, lon: -118.4085 },
  { iata: "SFO", name: "San Francisco", city: "San Francisco", country: "US", lat: 37.6213, lon: -122.379 },
  { iata: "SEA", name: "Seattle", city: "Seattle", country: "US", lat: 47.4502, lon: -122.3088 },
  { iata: "LAS", name: "Las Vegas", city: "Las Vegas", country: "US", lat: 36.084, lon: -115.1537 },
  { iata: "YYZ", name: "Toronto Pearson", city: "Toronto", country: "CA", lat: 43.6777, lon: -79.6248 },
  { iata: "YVR", name: "Vancouver", city: "Vancouver", country: "CA", lat: 49.1967, lon: -123.1815 },
  { iata: "YUL", name: "Montréal", city: "Montréal", country: "CA", lat: 45.4706, lon: -73.7408 },
  // Midt-Østen / Asia
  { iata: "DXB", name: "Dubai", city: "Dubai", country: "AE", lat: 25.2532, lon: 55.3657 },
  { iata: "AUH", name: "Abu Dhabi", city: "Abu Dhabi", country: "AE", lat: 24.433, lon: 54.6511 },
  { iata: "DOH", name: "Doha Hamad", city: "Doha", country: "QA", lat: 25.2736, lon: 51.6081 },
  { iata: "TLV", name: "Tel Aviv Ben Gurion", city: "Tel Aviv", country: "IL", lat: 32.0114, lon: 34.8867 },
  { iata: "BKK", name: "Bangkok Suvarnabhumi", city: "Bangkok", country: "TH", lat: 13.69, lon: 100.7501 },
  { iata: "HKT", name: "Phuket", city: "Phuket", country: "TH", lat: 8.1132, lon: 98.3169 },
  { iata: "SIN", name: "Singapore Changi", city: "Singapore", country: "SG", lat: 1.3644, lon: 103.9915 },
  { iata: "HKG", name: "Hong Kong", city: "Hong Kong", country: "HK", lat: 22.308, lon: 113.9185 },
  { iata: "NRT", name: "Tokyo Narita", city: "Tokyo", country: "JP", lat: 35.772, lon: 140.3929 },
  { iata: "HND", name: "Tokyo Haneda", city: "Tokyo", country: "JP", lat: 35.5494, lon: 139.7798 },
  { iata: "ICN", name: "Seoul Incheon", city: "Seoul", country: "KR", lat: 37.4602, lon: 126.4407 },
  { iata: "PEK", name: "Beijing Capital", city: "Beijing", country: "CN", lat: 40.0799, lon: 116.6031 },
  { iata: "PVG", name: "Shanghai Pudong", city: "Shanghai", country: "CN", lat: 31.1443, lon: 121.8083 },
  { iata: "DEL", name: "Delhi", city: "Delhi", country: "IN", lat: 28.5562, lon: 77.1 },
  { iata: "BOM", name: "Mumbai", city: "Mumbai", country: "IN", lat: 19.0896, lon: 72.8656 },
  { iata: "KUL", name: "Kuala Lumpur", city: "Kuala Lumpur", country: "MY", lat: 2.7456, lon: 101.7099 },
  { iata: "CGK", name: "Jakarta Soekarno-Hatta", city: "Jakarta", country: "ID", lat: -6.1256, lon: 106.6558 },
  { iata: "DPS", name: "Bali Denpasar", city: "Denpasar", country: "ID", lat: -8.7482, lon: 115.1672 },
  // Afrika / Oceania / Sør-Amerika
  { iata: "CAI", name: "Kairo", city: "Kairo", country: "EG", lat: 30.1114, lon: 31.4139 },
  { iata: "JNB", name: "Johannesburg O.R. Tambo", city: "Johannesburg", country: "ZA", lat: -26.1367, lon: 28.2411 },
  { iata: "CPT", name: "Cape Town", city: "Cape Town", country: "ZA", lat: -33.9649, lon: 18.6017 },
  { iata: "SYD", name: "Sydney Kingsford Smith", city: "Sydney", country: "AU", lat: -33.9399, lon: 151.1753 },
  { iata: "MEL", name: "Melbourne", city: "Melbourne", country: "AU", lat: -37.6733, lon: 144.8433 },
  { iata: "AKL", name: "Auckland", city: "Auckland", country: "NZ", lat: -37.0082, lon: 174.785 },
  { iata: "GRU", name: "São Paulo Guarulhos", city: "São Paulo", country: "BR", lat: -23.4356, lon: -46.4731 },
  { iata: "GIG", name: "Rio de Janeiro Galeão", city: "Rio de Janeiro", country: "BR", lat: -22.8089, lon: -43.2436 },
  { iata: "EZE", name: "Buenos Aires Ezeiza", city: "Buenos Aires", country: "AR", lat: -34.8222, lon: -58.5358 },
  { iata: "SCL", name: "Santiago", city: "Santiago", country: "CL", lat: -33.3928, lon: -70.7858 },
  { iata: "MEX", name: "Mexico City", city: "Mexico City", country: "MX", lat: 19.4361, lon: -99.0719 },
  { iata: "CUN", name: "Cancún", city: "Cancún", country: "MX", lat: 21.0365, lon: -86.8771 },
];

// DEFRA 2024 utslippsfaktorer (kg CO2e per passasjer-km).
// Kilde: UK BEIS/DEFRA Greenhouse Gas Reporting - Conversion Factors 2024.
// "Innenlands"-taksten brukes for flyreiser med avreise og ankomst i samme land
// og kort rekkevidde; ellers skiller vi mellom korte (<3700 km) og lange ruter.
const FACTORS = {
  domestic: { economy: 0.24587, business: 0.24587, first: 0.24587 },
  shortHaul: { economy: 0.15102, business: 0.22652, first: 0.22652 },
  longHaul: { economy: 0.14615, business: 0.42384, first: 0.58460 },
};

// Radiative forcing-multiplikator (ikke-CO2-effekter i høye luftlag).
// DEFRA oppgir ikke dette som standard; IPCC/DLR-studier anslår 1.7–3.
const RF_MULTIPLIER = 1.9;

// ----------------------------------------------------------------------------
// Hjelpefunksjoner
// ----------------------------------------------------------------------------

function haversineKm(a: Airport, b: Airport): number {
  const R = 6371; // jordradius km
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

function emissionFactor(distanceKm: number, sameCountry: boolean, cls: TravelClass): number {
  if (sameCountry && distanceKm < 1000) return FACTORS.domestic[cls];
  if (distanceKm < 3700) return FACTORS.shortHaul[cls];
  return FACTORS.longHaul[cls];
}

interface Calc {
  distanceKm: number; // én vei
  totalDistanceKm: number; // inkl. tur-retur og passasjerer multiplisert
  kgCO2: number; // basis, uten RF
  kgCO2WithRF: number; // med radiative forcing
  factor: number; // kg CO2e/pkm
  sameCountry: boolean;
}

function calcTrip(trip: Trip): Calc | null {
  const from = findAirport(trip.from);
  const to = findAirport(trip.to);
  if (!from || !to) return null;
  const distanceKm = haversineKm(from, to);
  const sameCountry = from.country === to.country;
  const factor = emissionFactor(distanceKm, sameCountry, trip.travelClass);
  const legs = trip.roundTrip ? 2 : 1;
  const totalDistanceKm = distanceKm * legs * trip.passengers;
  const kgCO2 = totalDistanceKm * factor;
  return {
    distanceKm,
    totalDistanceKm,
    kgCO2,
    kgCO2WithRF: kgCO2 * RF_MULTIPLIER,
    factor,
    sameCountry,
  };
}

function fmtKm(v: number): string {
  return v.toLocaleString("nb-NO", { maximumFractionDigits: 0 }) + " km";
}

function fmtKg(v: number): string {
  if (v >= 1000) return (v / 1000).toLocaleString("nb-NO", { maximumFractionDigits: 2 }) + " t";
  return v.toLocaleString("nb-NO", { maximumFractionDigits: 0 }) + " kg";
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const STORAGE_KEY = "sommervika:co2:trips:v1";
const RF_KEY = "sommervika:co2:useRF:v1";

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
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  id: string;
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
        a.name.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q)
    ).slice(0, 40);
  }, [query]);

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-xs font-medium text-slate-600 mb-1">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={open ? query : selected ? `${selected.iata} — ${selected.city}` : query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Søk by, IATA-kode eller navn…"
        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl bg-white shadow-lg ring-1 ring-black/10">
          {filtered.map((a) => (
            <li
              key={a.iata}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(a.iata);
                setQuery("");
                setOpen(false);
              }}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-slate-100"
            >
              <span className="font-mono font-semibold">{a.iata}</span>
              <span className="text-slate-500"> — {a.city}, {a.country}</span>
              <span className="text-xs text-slate-400"> · {a.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// Hovedside
// ----------------------------------------------------------------------------

export default function CO2Page() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [useRF, setUseRF] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Skjema-tilstand
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<Trip>({
    id: "",
    date: today,
    from: "OSL",
    to: "",
    passengers: 1,
    travelClass: "economy",
    roundTrip: true,
    traveler: "",
    note: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Last inn fra localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTrips(JSON.parse(raw));
      const rf = localStorage.getItem(RF_KEY);
      if (rf) setUseRF(rf === "true");
    } catch (e) {
      console.error("Kunne ikke laste lagrede reiser", e);
    }
    setLoaded(true);
  }, []);

  // Lagre automatisk
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    } catch (e) {
      console.error("Kunne ikke lagre reiser", e);
    }
  }, [trips, loaded]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(RF_KEY, String(useRF));
  }, [useRF, loaded]);

  // Forhåndsvisning av aktiv skjemaberegning
  const preview = useMemo(() => calcTrip(form), [form]);

  // Årsoversikt
  const byYear = useMemo(() => {
    const map = new Map<string, { trips: Trip[]; kg: number; kgRF: number; km: number }>();
    for (const t of trips) {
      const year = t.date ? t.date.slice(0, 4) : "—";
      const c = calcTrip(t);
      const entry = map.get(year) || { trips: [], kg: 0, kgRF: 0, km: 0 };
      entry.trips.push(t);
      if (c) {
        entry.kg += c.kgCO2;
        entry.kgRF += c.kgCO2WithRF;
        entry.km += c.totalDistanceKm;
      }
      map.set(year, entry);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [trips]);

  const totals = useMemo(() => {
    let kg = 0;
    let kgRF = 0;
    let km = 0;
    for (const t of trips) {
      const c = calcTrip(t);
      if (c) {
        kg += c.kgCO2;
        kgRF += c.kgCO2WithRF;
        km += c.totalDistanceKm;
      }
    }
    return { kg, kgRF, km };
  }, [trips]);

  function resetForm() {
    setForm({
      id: "",
      date: today,
      from: "OSL",
      to: "",
      passengers: 1,
      travelClass: "economy",
      roundTrip: true,
      traveler: "",
      note: "",
    });
    setEditingId(null);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!findAirport(form.from) || !findAirport(form.to)) {
      alert("Velg både fra- og til-flyplass.");
      return;
    }
    if (form.from.toUpperCase() === form.to.toUpperCase()) {
      alert("Fra og til kan ikke være samme flyplass.");
      return;
    }
    if (editingId) {
      setTrips((prev) => prev.map((t) => (t.id === editingId ? { ...form, id: editingId } : t)));
    } else {
      setTrips((prev) => [{ ...form, id: uid() }, ...prev]);
    }
    resetForm();
  }

  function editTrip(t: Trip) {
    setForm(t);
    setEditingId(t.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteTrip(id: string) {
    if (!confirm("Slette denne reisen?")) return;
    setTrips((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) resetForm();
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify({ trips, exportedAt: new Date().toISOString() }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sommervika-co2-${today}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJson(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        const incoming: Trip[] = Array.isArray(data) ? data : data.trips;
        if (!Array.isArray(incoming)) throw new Error("Ugyldig format");
        if (!confirm(`Importere ${incoming.length} reiser? Dette erstatter eksisterende data.`)) return;
        setTrips(incoming);
      } catch (e) {
        alert("Kunne ikke importere fil: " + (e as Error).message);
      }
    };
    reader.readAsText(file);
  }

  const maxYearKg = Math.max(1, ...byYear.map(([, v]) => (useRF ? v.kgRF : v.kg)));

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
                <p className="text-xs text-slate-500 -mt-0.5">Familiens flyreiser – utslippsregnskap</p>
              </div>
            </div>
            <a href="/" className="text-sm text-slate-600 hover:text-slate-900 underline">
              ← Til Kilevika
            </a>
          </div>
        </Container>
      </header>

      <main className="py-8 space-y-6">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Skjema */}
            <div className="lg:col-span-2">
              <Card>
                <CardSection>
                  <Title>{editingId ? "Rediger reise" : "Registrer ny flyreise"}</Title>
                  <form onSubmit={submit} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="date" className="block text-xs font-medium text-slate-600 mb-1">
                        Dato
                      </label>
                      <input
                        id="date"
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="traveler" className="block text-xs font-medium text-slate-600 mb-1">
                        Reisende (valgfritt)
                      </label>
                      <input
                        id="traveler"
                        type="text"
                        value={form.traveler || ""}
                        onChange={(e) => setForm({ ...form, traveler: e.target.value })}
                        placeholder="f.eks. Familien, Eirik, barna…"
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <AirportPicker
                      id="from"
                      label="Fra"
                      value={form.from}
                      onChange={(v) => setForm({ ...form, from: v })}
                    />
                    <AirportPicker
                      id="to"
                      label="Til"
                      value={form.to}
                      onChange={(v) => setForm({ ...form, to: v })}
                    />
                    <div>
                      <label htmlFor="pax" className="block text-xs font-medium text-slate-600 mb-1">
                        Antall passasjerer
                      </label>
                      <input
                        id="pax"
                        type="number"
                        min={1}
                        max={20}
                        value={form.passengers}
                        onChange={(e) => setForm({ ...form, passengers: Math.max(1, Number(e.target.value) || 1) })}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="class" className="block text-xs font-medium text-slate-600 mb-1">
                        Klasse
                      </label>
                      <select
                        id="class"
                        value={form.travelClass}
                        onChange={(e) => setForm({ ...form, travelClass: e.target.value as TravelClass })}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                      >
                        <option value="economy">Economy</option>
                        <option value="business">Business</option>
                        <option value="first">First</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <input
                        id="rt"
                        type="checkbox"
                        checked={form.roundTrip}
                        onChange={(e) => setForm({ ...form, roundTrip: e.target.checked })}
                        className="h-4 w-4"
                      />
                      <label htmlFor="rt" className="text-sm">
                        Tur-retur
                      </label>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="note" className="block text-xs font-medium text-slate-600 mb-1">
                        Notat (valgfritt)
                      </label>
                      <input
                        id="note"
                        type="text"
                        value={form.note || ""}
                        onChange={(e) => setForm({ ...form, note: e.target.value })}
                        placeholder="f.eks. Sommerferie, konferanse…"
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>

                    {preview && (
                      <div className="sm:col-span-2 rounded-2xl bg-slate-100 p-4 text-sm">
                        <div className="flex flex-wrap gap-x-6 gap-y-1">
                          <span>
                            Avstand én vei: <strong>{fmtKm(preview.distanceKm)}</strong>
                          </span>
                          <span>
                            Total distanse: <strong>{fmtKm(preview.totalDistanceKm)}</strong>
                          </span>
                          <span>
                            Utslipp: <strong>{fmtKg(useRF ? preview.kgCO2WithRF : preview.kgCO2)}</strong> CO₂e
                          </span>
                          <span className="text-slate-500">
                            (faktor {preview.factor.toFixed(3)} kg/pkm
                            {preview.sameCountry ? ", innenlands" : preview.distanceKm < 3700 ? ", kort" : ", lang"})
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="sm:col-span-2 flex flex-wrap gap-2">
                      <button
                        type="submit"
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                      >
                        {editingId ? "Lagre endringer" : "Legg til reise"}
                      </button>
                      {editingId && (
                        <button
                          type="button"
                          onClick={resetForm}
                          className="rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
                        >
                          Avbryt
                        </button>
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
                      <dt className="text-slate-600">Flydistanse (pkm)</dt>
                      <dd className="font-semibold">{fmtKm(totals.km)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">CO₂e (DEFRA)</dt>
                      <dd className="font-semibold">{fmtKg(totals.kg)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Med RF × {RF_MULTIPLIER}</dt>
                      <dd className="font-semibold">{fmtKg(totals.kgRF)}</dd>
                    </div>
                  </dl>
                  <label className="mt-4 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={useRF}
                      onChange={(e) => setUseRF(e.target.checked)}
                      className="h-4 w-4"
                    />
                    Vis med radiative forcing
                  </label>
                </CardSection>
              </Card>

              <Card>
                <CardSection>
                  <Title>Per år</Title>
                  {byYear.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500">Ingen reiser registrert ennå.</p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {byYear.map(([year, v]) => {
                        const val = useRF ? v.kgRF : v.kg;
                        const pct = (val / maxYearKg) * 100;
                        return (
                          <div key={year}>
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{year}</span>
                              <span>
                                {fmtKg(val)} <span className="text-slate-400">· {v.trips.length} reise{v.trips.length === 1 ? "" : "r"}</span>
                              </span>
                            </div>
                            <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                              <div
                                className="h-2 rounded-full bg-emerald-600"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardSection>
              </Card>

              <Card>
                <CardSection>
                  <Title>Data</Title>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={exportJson}
                      className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
                    >
                      Eksporter JSON
                    </button>
                    <label className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 cursor-pointer">
                      Importer JSON
                      <input
                        type="file"
                        accept="application/json"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) importJson(f);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    {trips.length > 0 && (
                      <button
                        onClick={() => {
                          if (confirm("Slette alle reiser? Dette kan ikke angres.")) setTrips([]);
                        }}
                        className="rounded-xl border border-red-300 text-red-700 px-3 py-1.5 text-sm hover:bg-red-50"
                      >
                        Slett alle
                      </button>
                    )}
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    Data lagres kun i din egen nettleser (localStorage) og sendes ikke til noen server.
                  </p>
                </CardSection>
              </Card>
            </div>
          </div>

          {/* Reiseliste */}
          <div className="mt-6">
            <Card>
              <CardSection>
                <Title>Registrerte reiser</Title>
                {trips.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-500">Ingen reiser ennå. Legg til din første over.</p>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-slate-500">
                          <th className="py-2 pr-3">Dato</th>
                          <th className="py-2 pr-3">Reisende</th>
                          <th className="py-2 pr-3">Rute</th>
                          <th className="py-2 pr-3 text-right">Pax</th>
                          <th className="py-2 pr-3">Klasse</th>
                          <th className="py-2 pr-3">T/R</th>
                          <th className="py-2 pr-3 text-right">Distanse</th>
                          <th className="py-2 pr-3 text-right">CO₂e</th>
                          <th className="py-2 pr-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {trips
                          .slice()
                          .sort((a, b) => b.date.localeCompare(a.date))
                          .map((t) => {
                            const c = calcTrip(t);
                            return (
                              <tr key={t.id} className="border-b last:border-0">
                                <td className="py-2 pr-3 whitespace-nowrap">{t.date}</td>
                                <td className="py-2 pr-3">{t.traveler || "—"}</td>
                                <td className="py-2 pr-3 font-mono">
                                  {t.from} → {t.to}
                                  {t.note && <div className="font-sans text-xs text-slate-400">{t.note}</div>}
                                </td>
                                <td className="py-2 pr-3 text-right">{t.passengers}</td>
                                <td className="py-2 pr-3 capitalize">{t.travelClass}</td>
                                <td className="py-2 pr-3">{t.roundTrip ? "Ja" : "Nei"}</td>
                                <td className="py-2 pr-3 text-right">{c ? fmtKm(c.totalDistanceKm) : "—"}</td>
                                <td className="py-2 pr-3 text-right font-semibold">
                                  {c ? fmtKg(useRF ? c.kgCO2WithRF : c.kgCO2) : "—"}
                                </td>
                                <td className="py-2 pr-3 text-right whitespace-nowrap">
                                  <button
                                    onClick={() => editTrip(t)}
                                    className="text-xs text-slate-600 underline hover:text-slate-900 mr-2"
                                  >
                                    Rediger
                                  </button>
                                  <button
                                    onClick={() => deleteTrip(t.id)}
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
                <Title>Metodikk og forbehold</Title>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <p>
                    Avstand beregnes som storsirkelavstand mellom flyplasskoordinater (haversine). Reelt tilbakelagt
                    distanse er typisk 5–10 % lenger på grunn av ruteføring.
                  </p>
                  <p>
                    Utslippsfaktorer er hentet fra UK DEFRA &quot;Greenhouse Gas Reporting – Conversion Factors 2024&quot;
                    for passasjerfly. Domestic: 0,246 kg CO₂e/pkm. Short-haul (&lt; 3700 km): economy 0,151,
                    business 0,227. Long-haul (≥ 3700 km): economy 0,146, business 0,424, first 0,585.
                  </p>
                  <p>
                    &quot;Radiative forcing&quot;-multiplikatoren (× 1,9) er en forenklet måte å inkludere ikke-CO₂-effekter
                    (kondensstriper, NOₓ). DEFRA oppgir dette separat; vitenskapelige anslag ligger typisk mellom 1,7 og 3.
                  </p>
                  <p className="text-slate-500 text-xs">
                    Data lagres kun i din egen nettleser. Eksporter til JSON for å ta backup eller flytte til annen enhet.
                  </p>
                </div>
              </CardSection>
            </Card>
          </div>
        </Container>
      </main>

      <footer className="py-8 text-center text-xs text-slate-500">
        Kilevika – Sommervika.no
      </footer>
    </div>
  );
}
