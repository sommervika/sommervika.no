// Tynn Supabase-klient basert på fetch (ingen ekstra dependency).
// Bruker PostgREST og RPC for lesing og skrivende operasjoner.
//
// Env-variabler som må settes i Netlify (Build & deploy → Environment):
//   NEXT_PUBLIC_SUPABASE_URL       – f.eks. https://xyzcompany.supabase.co
//   NEXT_PUBLIC_SUPABASE_ANON_KEY  – anon/public key (trygg å eksponere)

export interface FlightLeg {
  from: string;
  to: string;
  aircraft: string;
}

export interface FlightRecord {
  id: string;
  created_at: string;
  date: string;
  traveler: string | null;
  note: string | null;
  legs: FlightLeg[];
  passengers: number;
  travel_class: "economy" | "business" | "first";
  round_trip: boolean;
}

export interface NewFlight {
  date: string;
  traveler: string | null;
  note: string | null;
  legs: FlightLeg[];
  passengers: number;
  travel_class: "economy" | "business" | "first";
  round_trip: boolean;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON);
}

function headers(extra?: Record<string, string>) {
  return {
    apikey: SUPABASE_ANON,
    Authorization: `Bearer ${SUPABASE_ANON}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

export async function fetchFlights(): Promise<FlightRecord[]> {
  if (!isSupabaseConfigured()) return [];
  const url = `${SUPABASE_URL}/rest/v1/flights?select=*&order=date.desc`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    throw new Error(`Henting feilet: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export async function addFlight(password: string, flight: NewFlight): Promise<string> {
  if (!isSupabaseConfigured()) throw new Error("Supabase er ikke konfigurert");
  const url = `${SUPABASE_URL}/rest/v1/rpc/add_flight`;
  const res = await fetch(url, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      p_password: password,
      p_date: flight.date,
      p_traveler: flight.traveler,
      p_note: flight.note,
      p_legs: flight.legs,
      p_passengers: flight.passengers,
      p_travel_class: flight.travel_class,
      p_round_trip: flight.round_trip,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    if (res.status === 400 || txt.includes("Invalid password")) {
      throw new Error("Feil passord");
    }
    throw new Error(`Lagring feilet: ${res.status} ${txt}`);
  }
  return res.json();
}

export async function deleteFlight(password: string, id: string): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase er ikke konfigurert");
  const url = `${SUPABASE_URL}/rest/v1/rpc/delete_flight`;
  const res = await fetch(url, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ p_password: password, p_id: id }),
  });
  if (!res.ok) {
    const txt = await res.text();
    if (res.status === 400 || txt.includes("Invalid password")) {
      throw new Error("Feil passord");
    }
    throw new Error(`Sletting feilet: ${res.status} ${txt}`);
  }
}
