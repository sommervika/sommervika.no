// netlify/functions/temperatur.ts
//
// Netlify Function som returnerer aktuelle målinger for Kilevika.
// Erstatter app/api/temperatur/route.ts siden siden er bygget som
// statisk eksport (next export) og dermed ikke kan kjøre dynamiske
// Next.js-routes.
//
// Funksjonen serveres automatisk på /api/temperatur takket være
// `export const config` nederst.

const LAT = 58.0566;
const LON = 7.8458;

// Referansepunkter for placeholder-syntese av sjøtemperatur
const T_START = new Date("2026-05-10T00:00:00Z").getTime();
const T_PEAK = new Date("2026-07-15T00:00:00Z").getTime();

function clamp(x: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, x));
}

function vannTemp(now: Date): number {
  const t = clamp((now.getTime() - T_START) / (T_PEAK - T_START), 0, 1);
  const base = 10 + t * 12;
  const hour = now.getHours() + now.getMinutes() / 60;
  const fluct = 0.3 * Math.sin((Math.PI * (hour - 5)) / 12);
  return base + fluct;
}

function fallbackLuftTemp(now: Date): number {
  const t = clamp((now.getTime() - T_START) / (T_PEAK - T_START), 0, 1);
  const meanDay = 13 + t * 7;
  const hour = now.getHours() + now.getMinutes() / 60;
  const dayFluct = 6 * Math.sin((Math.PI * (hour - 5)) / 14);
  return meanDay + dayFluct;
}

function solStyrke(now: Date, cloudCoverPct: number): number {
  const hour = now.getHours() + now.getMinutes() / 60;
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

// Enkel in-memory cache for met.no (overlever varm function-instans)
let metCache: { data: MetNoResponse | null; expires: number } = {
  data: null,
  expires: 0,
};

export default async (_req: Request) => {
  const now = new Date();
  let luft = fallbackLuftTemp(now);
  let cloudCover = 50;
  let metSource = false;

  try {
    let metJson = metCache.data;

    if (!metJson || Date.now() > metCache.expires) {
      const r = await fetch(
        `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${LAT}&lon=${LON}`,
        {
          headers: {
            "User-Agent": "sommervika.no/1.0 github.com/sommervika",
          },
        }
      );
      if (r.ok) {
        metJson = (await r.json()) as MetNoResponse;
        metCache = {
          data: metJson,
          expires: Date.now() + 10 * 60 * 1000, // 10 min
        };
      }
    }

    const details = metJson?.properties?.timeseries?.[0]?.data?.instant?.details;
    if (details?.air_temperature != null) {
      luft = details.air_temperature;
      metSource = true;
    }
    if (details?.cloud_area_fraction != null) {
      cloudCover = details.cloud_area_fraction;
    }
  } catch {
    // bruk fallback
  }

  const body = {
    vann: Number(vannTemp(now).toFixed(1)),
    luft: Number(luft.toFixed(1)),
    sol: Math.round(solStyrke(now, cloudCover)),
    cloudCover: Math.round(cloudCover),
    timestamp: Math.floor(now.getTime() / 1000),
    placeholder: true,
    sources: {
      vann: "placeholder (10°C → 22°C mot 15. juli)",
      luft: metSource ? "met.no (live)" : "placeholder",
      sol: metSource ? "met.no skydekke + sol-vinkel" : "placeholder",
    },
  };

  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store, no-cache, must-revalidate, max-age=0",
      "access-control-allow-origin": "*",
    },
  });
};

// Netlify Functions v2: path config gjør at denne serveres på /api/temperatur
// uten behov for redirect-regler i netlify.toml.
export const config = {
  path: "/api/temperatur",
};
