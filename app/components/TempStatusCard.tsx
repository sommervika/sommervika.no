// app/components/TempStatusCard.tsx
//
// Kompakt status-linje for header-plassering.
// Tre tall pa en rad, ingen header, ingen tidsstempel.

"use client";

import React, { useEffect, useState } from "react";

type TempData = {
  vann: number | null;
  luft: number | null;
  sol: number | null;
};

type Labels = {
  vann: string;
  luft: string;
  sol: string;
};

export default function TempStatusCard({ labels }: { labels: Labels }) {
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
        // stille feilhandtering
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

  return (
    <div className="flex items-center gap-4 text-xs text-slate-500">
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
  );
}
