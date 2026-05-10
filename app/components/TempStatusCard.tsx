// app/components/TempStatusCard.tsx
//
// Minimal status-linje for Kilevika med sjøvann, luft og sol.
// Kun tekst, ingen ikoner eller farger - lar seg integrere diskret.

"use client";

import React, { useEffect, useState } from "react";

type TempData = {
  vann: number | null;
  luft: number | null;
  sol: number | null;
  timestamp: number;
};

type Labels = {
  vann: string;
  luft: string;
  sol: string;
  updated: string;
};

export default function TempStatusCard({
  labels,
  locale,
}: {
  labels: Labels;
  locale: string;
}) {
  const [data, setData] = useState<TempData | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const r = await fetch("/api/temperatur", { cache: "no-store" });
        if (!r.ok) return;
        const j = (await r.json()) as TempData;
        if (!cancelled) setData(j);
      } catch {
        // stille feilhåndtering - viser bare ingenting hvis det feiler
      }
    }
    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (!data) return null;

  const fmtTemp = (v: number | null) =>
    v == null ? "–" : `${v.toFixed(1)}°C`;
  const fmtPct = (v: number | null) => (v == null ? "–" : `${v}%`);

  const updatedAt = new Date(data.timestamp * 1000).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="text-sm text-slate-600">
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        <span>
          {labels.vann}{" "}
          <span className="font-medium text-slate-900 tabular-nums">
            {fmtTemp(data.vann)}
          </span>
        </span>
        <span>
          {labels.luft}{" "}
          <span className="font-medium text-slate-900 tabular-nums">
            {fmtTemp(data.luft)}
          </span>
        </span>
        <span>
          {labels.sol}{" "}
          <span className="font-medium text-slate-900 tabular-nums">
            {fmtPct(data.sol)}
          </span>
        </span>
      </div>
      <p className="text-xs text-slate-400 mt-1">
        {labels.updated} {updatedAt}
      </p>
    </div>
  );
}
