// Tynn Supabase-klient for /co2baat.
// Matcher mønsteret fra /co2: fetch + PostgREST + RPC med familiepassord.

export interface FuelEntry {
  id: string;
  created_at: string;
  filled_at: string;
  boat: "Yamarin" | "Pepsi";
  liters: number;
  location: string | null;
  filler: string | null;
}

export interface NewFuelEntry {
  filled_at: string;
  boat: "Yamarin" | "Pepsi";
  liters: number;
  location: string | null;
  filler: string | null;
}

export interface DacPurchase {
  id: string;
  created_at: string;
  purchased_at: string;
  co2_kg: number;
  buyer: string | null;
  reference: string | null;
}

export interface NewDacPurchase {
  purchased_at: string;
  co2_kg: number;
  buyer: string | null;
  reference: string | null;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON);
}

function headers(): Record<string, string> {
  return {
    apikey: SUPABASE_ANON,
    Authorization: `Bearer ${SUPABASE_ANON}`,
    "Content-Type": "application/json",
  };
}

// --- Fuel entries ---------------------------------------------------------

export async function fetchFuelEntries(): Promise<FuelEntry[]> {
  if (!isSupabaseConfigured()) return [];
  const url = `${SUPABASE_URL}/rest/v1/fuel_entries?select=*&order=filled_at.desc`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`Henting feilet: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function addFuelEntry(password: string, entry: NewFuelEntry): Promise<string> {
  if (!isSupabaseConfigured()) throw new Error("Supabase er ikke konfigurert");
  const url = `${SUPABASE_URL}/rest/v1/rpc/add_fuel_entry`;
  const res = await fetch(url, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      p_password: password,
      p_filled_at: entry.filled_at,
      p_boat: entry.boat,
      p_liters: entry.liters,
      p_location: entry.location,
      p_filler: entry.filler,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    if (res.status === 400 || txt.includes("Invalid password")) throw new Error("Feil passord");
    throw new Error(`Lagring feilet: ${res.status} ${txt}`);
  }
  return res.json();
}

export async function deleteFuelEntry(password: string, id: string): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase er ikke konfigurert");
  const url = `${SUPABASE_URL}/rest/v1/rpc/delete_fuel_entry`;
  const res = await fetch(url, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ p_password: password, p_id: id }),
  });
  if (!res.ok) {
    const txt = await res.text();
    if (res.status === 400 || txt.includes("Invalid password")) throw new Error("Feil passord");
    throw new Error(`Sletting feilet: ${res.status} ${txt}`);
  }
}

// --- DAC purchases --------------------------------------------------------

export async function fetchDacPurchases(): Promise<DacPurchase[]> {
  if (!isSupabaseConfigured()) return [];
  const url = `${SUPABASE_URL}/rest/v1/dac_purchases?select=*&order=purchased_at.desc`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`Henting feilet: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function addDacPurchase(password: string, purchase: NewDacPurchase): Promise<string> {
  if (!isSupabaseConfigured()) throw new Error("Supabase er ikke konfigurert");
  const url = `${SUPABASE_URL}/rest/v1/rpc/add_dac_purchase`;
  const res = await fetch(url, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      p_password: password,
      p_purchased_at: purchase.purchased_at,
      p_co2_kg: purchase.co2_kg,
      p_buyer: purchase.buyer,
      p_reference: purchase.reference,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    if (res.status === 400 || txt.includes("Invalid password")) throw new Error("Feil passord");
    throw new Error(`Lagring feilet: ${res.status} ${txt}`);
  }
  return res.json();
}

export async function deleteDacPurchase(password: string, id: string): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase er ikke konfigurert");
  const url = `${SUPABASE_URL}/rest/v1/rpc/delete_dac_purchase`;
  const res = await fetch(url, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ p_password: password, p_id: id }),
  });
  if (!res.ok) {
    const txt = await res.text();
    if (res.status === 400 || txt.includes("Invalid password")) throw new Error("Feil passord");
    throw new Error(`Sletting feilet: ${res.status} ${txt}`);
  }
}
