// app/components/TempStatusCard.tsx
//
// Live status-kort for Kilevika med sjøvann, luft og sol-styrke.
// Poller /api/temperatur hvert 5. minutt og oppdaterer i sanntid.

"use client";

import React, { useEffect, useState } from "react";

type TempData = {
  vann: number | null;
  luft: number | null;
  sol: number | null;
  timestamp: number;
  placeholder?: boolean;
};

type Labels = {
  heading: string;
  vann: string;
  luft: string;
  sol: string;
  updated: string;
  error: string;
  placeholder: string;
};

export default function TempStatusCard({
  labels,
  locale,
}: {
  labels: Labels;
  locale: string;
}) {
  const [data, setData] = useState<TempData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const r = await fetch("/api/temperatur", { cache: "no-store" });
        if (!r.ok) throw new Error();
        const j = (await r.json()) as TempData;
        if (!cancelled) {
          setData(j);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }

    load();
    const id = setInterval(load, 5 * 60 * 1000); // hver 5. min
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const fmtTemp = (v: number | null) =>
    v == null ? "–" : `${v.toFixed(1)}°`;
  const fmtPct = (v: number | null) => (v == null ? "–" : `${v}%`);

  const updatedAt = data
    ? new Date(data.timestamp * 1000).toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // Sol-emoji som endrer seg med styrke
  const solEmoji = (v: number | null) => {
    if (v == null) return "☀️";
    if (v < 15) return "🌑";
    if (v < 40) return "⛅";
    if (v < 70) return "🌤️";
    return "☀️";
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-sky-50 via-white to-amber-50 p-5 ring-1 ring-slate-200">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="font-semibold text-slate-800">{labels.heading}</h3>
        {data?.placeholder && (
          <span className="text-xs text-slate-400 italic">
            {labels.placeholder}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Sjøvann */}
        <div className="rounded-xl bg-white/70 p-3 ring-1 ring-sky-100">
          <div className="text-2xl mb-1">🌊</div>
          <div className="text-xs text-slate-500">{labels.vann}</div>
          <div className="text-xl sm:text-2xl font-semibold tabular-nums text-sky-700">
            {fmtTemp(data?.vann ?? null)}
          </div>
        </div>

        {/* Luft */}
        <div className="rounded-xl bg-white/70 p-3 ring-1 ring-amber-100">
          <div className="text-2xl mb-1">🌡️</div>
          <div className="text-xs text-slate-500">{labels.luft}</div>
          <div className="text-xl sm:text-2xl font-semibold tabular-nums text-amber-700">
            {fmtTemp(data?.luft ?? null)}
          </div>
        </div>

        {/* Sol */}
        <div className="rounded-xl bg-white/70 p-3 ring-1 ring-yellow-100">
          <div className="text-2xl mb-1">{solEmoji(data?.sol ?? null)}</div>
          <div className="text-xs text-slate-500">{labels.sol}</div>
          <div className="text-xl sm:text-2xl font-semibold tabular-nums text-yellow-700">
            {fmtPct(data?.sol ?? null)}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-3">
        {error
          ? labels.error
          : updatedAt && `${labels.updated} ${updatedAt}`}
      </p>
    </div>
  );
}
