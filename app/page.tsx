
"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";

const HERO_URL = "/sommervika-hero.webp";
const CAL_URL =
  "https://calendar.google.com/calendar/embed?src=a45e6e94dd613dc1f703fc885132a94aa4b7271c0fc6f5f2ae7bc5c5251fae35%40group.calendar.google.com&ctz=Europe%2FOslo&hl=no&mode=MONTH&wkst=2&showPrint=0&showTabs=0&showCalendars=0&showTz=0&bgcolor=%23ffffff";

function Container({ children }: { children: React.ReactNode }) { return <div className="mx-auto max-w-6xl px-4">{children}</div>; }
function Card({ children }: { children: React.ReactNode }) { return <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5">{children}</div>; }
function CardSection({ children, padding = true }: { children: React.ReactNode; padding?: boolean }) { return <div className={padding ? "p-6" : ""}>{children}</div>; }
function Title({ children }: { children: React.ReactNode }) { return <h2 className="text-xl font-semibold tracking-tight">{children}</h2>; }

const TABS = [
  { id: "regler", label: "Regler for lån" },
  { id: "praktisk", label: "Praktisk informasjon" },
  { id: "historie", label: "Historien om Sommervika" },
  { id: "omrade", label: "Området Ny-Hellesund" },
  { id: "bilder", label: "Bilder" },
  { id: "kalender", label: "Kalender" },
] as const;
type TabId = typeof TABS[number]["id"];

export default function Page() {
  const [tab, setTab] = useState<TabId>("regler");
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="min-h-screen w-full">
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b">
        <Container>
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-sky-100 grid place-items-center shadow-sm"><span className="font-semibold">SV</span></div>
              <div><h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Sommervika</h1>
              <p className="text-xs text-slate-500 -mt-0.5">Familiehytte – Helgøya / Ny-Hellesund</p></div>
            </div>
          </div>
        </Container>
      </header>
      <section className="relative">
        <Container><div className="mt-6 h-[34vh] sm:h-[46vh] w-full overflow-hidden rounded-3xl shadow-md ring-1 ring-black/5">
          <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${HERO_URL})` }}>
            <div className="h-full w-full bg-gradient-to-t from-black/35 via-black/10 to-transparent" /></div></div></Container>
      </section>
      <main className="py-8">
        <Container>
          <nav className="grid grid-cols-2 sm:grid-cols-6 gap-2 bg-slate-100 p-2 rounded-2xl">
            {TABS.map(({ id, label }) => (
              <button key={id} onClick={() => setTab(id)} className={`rounded-xl px-3 py-2 text-sm transition border ${tab === id ? "bg-white shadow-sm" : "border-transparent hover:bg-white/60"}`} aria-current={tab === id}>{label}</button>
            ))}
          </nav>

          {tab === "bilder" && (<section className="mt-6"><Card><CardSection><Title>Bilder</Title></CardSection><CardSection><Gallery /></CardSection></Card></section>)}
          {tab === "kalender" && (<section className="mt-6"><Card><CardSection><Title>Kalender</Title></CardSection><CardSection><div className="aspect-video w-full overflow-hidden rounded-2xl ring-1 ring-black/5 mt-2"><iframe title="Sommervika kalender" className="h-full w-full" src={CAL_URL} frameBorder="0" scrolling="no"/></div></CardSection></Card></section>)}
        </Container>
      </main>
      <footer className="border-t bg-white/70 backdrop-blur"><Container><div className="py-8 text-sm flex flex-col sm:flex-row items-center justify-between gap-3"><p>© {year} Sommervika – Helgøya, Ny-Hellesund</p></div></Container></footer>
    </div>
  );
}

function Gallery() {
  const images = Array.from({ length: 20 }, (_, i) => `/gallery-${i + 1}.webp`);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = (i: number) => { setIndex(i); setOpen(true); };

  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const close = useCallback(() => setOpen(false), []);

  // Keyboard controls
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev, close]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = original; };
    }
  }, [open]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((src, i) => (
          <button key={src} onClick={() => openAt(i)} className="group block overflow-hidden rounded-2xl ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-sky-400">
            <img src={src} alt="Sommervika" className="h-40 w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]" loading="lazy"/>
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between p-3">
            <button onClick={close} aria-label="Lukk" className="rounded-lg px-3 py-1 bg-white/10 text-white hover:bg-white/20">Lukk</button>
            <div className="text-white text-sm">{index + 1} / {images.length}</div>
          </div>
          <div className="flex-1 relative">
            <button onClick={prev} aria-label="Forrige" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 p-3 text-white">‹</button>
            <img src={images[index]} alt="" className="absolute inset-0 m-auto max-h-full max-w-full object-contain select-none"/>
            <button onClick={next} aria-label="Neste" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 p-3 text-white">›</button>
          </div>
          <div className="p-3 text-center text-xs text-white/80">Bruk piltastene eller sveip/trykk for å navigere.</div>
        </div>
      )}
    </>
  );
}
