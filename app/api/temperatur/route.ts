// app/api/temperatur/route.ts
//
// Returnerer aktuelle målinger for sjøvann, luft og sol-styrke til
// Kilevika-frontend. Akkurat nå:
//   - vann: SYNTETISK placeholder (10°C nå -> 22°C 15. juli 2026)
//   - luft: ekte data fra met.no (gratis, ingen API-nøkkel)
//   - sol: ekte skydekke fra met.no + beregnet sol-vinkel
//
// Når Shelly-hardware er på plass, bytt ut vann-funksjonen med en
// fetch mot Shelly Cloud (se kommentar nederst).

import { NextResponse } from "next/server";

export const revalidate = 300; // 5 min server-cache

// Helgøya, Ny-Hellesund (Søgne)
const LAT = 58.0566;
const LON = 7.8458;

// Referansepunkter for placeholder-syntese av sjøtemperatur
const T_START = new Date("2026-05-10T00:00:00Z").getTime(); // 10°C vann
const T_PEAK = new Date("2026-07-15T00:00:00Z").getTime(); // 22°C vann

function clamp(x: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, x));
}

// Sjøtemperatur: lineær 10°C -> 22°C, +/- 0.3°C dagssvingning (peak ~17:00)
function vannTemp(now: Date): number {
  const t = clamp((now.getTime() - T_START) / (T_PEAK - T_START), 0, 1);
  const base = 10 + t * 12;
  const hour = now.getHours() + now.getMinutes() / 60;
  const fluct = 0.3 * Math.sin((Math.PI * (hour - 5)) / 12);
  return base + fluct;
}

// Fallback hvis met.no er nede - syntetisk lufttemperatur
function fallbackLuftTemp(now: Date): number {
  const t = clamp((now.getTime() - T_START) / (T_PEAK - T_START), 0, 1);
  const meanDay = 13 + t * 7; // dagssnitt 13°C -> 20°C
  const hour = now.getHours() + now.getMinutes() / 60;
  const dayFluct = 6 * Math.sin((Math.PI * (hour - 5)) / 14);
  return meanDay + dayFluct;
}

// Sol-styrke 0-100% basert pa sol-vinkel og skydekke
function solStyrke(now: Date, cloudCoverPct: number): number {
  const hour = now.getHours() + now.getMinutes() / 60;
  // Sin-kurve: 0 ved soloppgang (~05), peak ~13, 0 ved solnedgang (~21)
  const sunAngle = Math.max(0, Math.sin((Math.PI * (hour - 5)) / 16));
  return clamp(sunAngle * (1 - cloudCoverPct / 100) * 100, 0, 100);
}

type MetNoResponse = {
  properties?: {
    timeseries?: Array<{
      data?: {
        instant?: {
          details?: {
            air_temperature?: number;
            cloud_area_fraction?: number;
          };
        };
      };
    }>;
  };
};

export async function GET() {
  const now = new Date();
  let luft = fallbackLuftTemp(now);
  let cloudCover = 50;
  let metSource = false;

  try {
    const r = await fetch(
      `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${LAT}&lon=${LON}`,
      {
        headers: {
          // Met.no krever en meningsfull User-Agent med kontaktinfo
          "User-Agent": "sommervika.no/1.0 github.com/sommervika",
        },
        next: { revalidate: 600 }, // cache met.no 10 min
      }
    );
    if (r.ok) {
      const j = (await r.json()) as MetNoResponse;
      const details = j.properties?.timeseries?.[0]?.data?.instant?.details;
      if (details?.air_temperature != null) {
        luft = details.air_temperature;
        metSource = true;
      }
      if (details?.cloud_area_fraction != null) {
        cloudCover = details.cloud_area_fraction;
      }
    }
  } catch {
    // bruk fallback
  }

  return NextResponse.json({
    vann: Number(vannTemp(now).toFixed(1)),
    luft: Number(luft.toFixed(1)),
    sol: Math.round(solStyrke(now, cloudCover)),
    cloudCover: Math.round(cloudCover),
    timestamp: Math.floor(now.getTime() / 1000),
    placeholder: true, // sett til false nar Shelly er live
    sources: {
      vann: "placeholder (10°C → 22°C mot 15. juli)",
      luft: metSource ? "met.no (live)" : "placeholder",
      sol: metSource ? "met.no skydekke + sol-vinkel" : "placeholder",
    },
  });
}

// =============================================================
// NÅR SHELLY ER LIVE: bytt vannTemp(now) ut med dette:
// =============================================================
//
// async function vannFromShelly(): Promise<number | null> {
//   const server = process.env.SHELLY_SERVER;
//   const deviceId = process.env.SHELLY_DEVICE_ID;
//   const authKey = process.env.SHELLY_AUTH_KEY;
//   const vannId = process.env.SHELLY_VANN_SENSOR_ID; // f.eks. "temperature:100"
//
//   if (!server || !deviceId || !authKey || !vannId) return null;
//
//   const body = new URLSearchParams({ id: deviceId, auth_key: authKey });
//   const r = await fetch(`https://${server}/device/status`, {
//     method: "POST",
//     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     body,
//     next: { revalidate: 60 },
//   });
//   if (!r.ok) return null;
//   const j = await r.json();
//   return j?.data?.device_status?.[vannId]?.tC ?? null;
// }
