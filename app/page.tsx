"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";

const HERO_URL = "/sommervika-hero.webp";
const CAL_URL =
  "https://calendar.google.com/calendar/embed?src=a45e6e94dd613dc1f703fc885132a94aa4b7271c0fc6f5f2ae7bc5c5251fae35%40group.calendar.google.com&ctz=Europe%2FOslo&hl=no&mode=AGENDA&wkst=2&showTitle=0&showNav=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&bgcolor=%23ffffff";

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-6xl px-4">{children}</div>;
}
function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5">{children}</div>;
}
function CardSection({ children, padding = true }: { children: React.ReactNode; padding?: boolean }) {
  return <div className={padding ? "p-6" : ""}>{children}</div>;
}
function Title({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold tracking-tight">{children}</h2>;
}

const TABS = [
  { id: "praktisk", label: "Praktisk informasjon" },
  { id: "historie", label: "Historien om Sommervika" },
  { id: "omrade", label: "Området Ny-Hellesund" },
  { id: "regler", label: "Regler for lån" },
  { id: "bilder", label: "Bilder" },
  { id: "kart", label: "Kart" },
  { id: "kalender", label: "Kalender" },
] as const;
type TabId = typeof TABS[number]["id"];

export default function Page() {
  const [tab, setTab] = useState<TabId>("praktisk");
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="min-h-screen w-full">
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b">
        <Container>
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-sky-100 grid place-items-center shadow-sm">
                <span className="font-semibold">SV</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Sommervika</h1>
                <p className="text-xs text-slate-500 -mt-0.5">Familiehytte – Helgøya / Ny-Hellesund</p>
              </div>
            </div>
          </div>
        </Container>
      </header>

      <section className="relative">
        <Container>
          <div className="mt-6 h-[34vh] sm:h-[46vh] w-full overflow-hidden rounded-3xl shadow-md ring-1 ring-black/5">
            <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${HERO_URL})` }}>
              <div className="h-full w-full bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
            </div>
          </div>
        </Container>
      </section>

      <main className="py-8">
        <Container>
          <nav className="grid grid-cols-2 sm:grid-cols-7 gap-2 bg-slate-100 p-2 rounded-2xl">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`rounded-xl px-3 py-2 text-sm transition border ${
                  tab === id ? "bg-white shadow-sm" : "border-transparent hover:bg-white/60"
                }`}
                aria-current={tab === id}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Praktisk informasjon */}
          {tab === "praktisk" && (
            <section className="mt-6">
              <Card>
                <CardSection>
                  <Title>Praktisk informasjon</Title>
                </CardSection>
                <CardSection>
                  <div className="space-y-6 leading-relaxed">
                    <div>
                      <h3 className="font-semibold mb-2">Adkomst</h3>
                      <p>
                        Hytta ligger i den lune viken <strong>Kilen</strong> på Helgøya, midt i Ny-Hellesund. Vanlig
                        adkomst er med båt fra <strong>Solta Båthavn i Høllen</strong>, hvor det også finnes mulighet for
                        parkering mot betaling. <strong>Ta kontakt med oss for detaljer om båtplass og nøkler.</strong>
                      </p>
                      <p className="mt-2">
                        Det går også passasjerferge flere ganger daglig fra Høllen til Helgøya.{" "}
                        <a
                          href="https://www.akt.no/_f/p1/i84326d30-9668-4820-bc65-6ca70588fa28/92-hollen-boroya-skarpoya-ny-hellsund-fra-01072025.pdf"
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-600 underline"
                        >
                          Se rutetabell her
                        </a>
                        .
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Sengetøy og håndklær</h3>
                      <p>Vi setter pris på at dere tar med eget sengetøy og håndklær.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Båt, bad og brygge</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Alle skal bruke redningsvest i båt.</li>
                        <li>Vester og årer til <em>Solo</em> og <em>Pepsi</em> finnes i Sjøbua.</li>
                        <li>Bensinkanne og reservekanne til <em>Pepsi</em> er også i Sjøbua.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Butikker</h3>
                      <p>
                        Det finnes ingen matbutikker i Ny-Hellesund. Enkleste alternativ er å ta båten til Høllen, hvor
                        det ligger en liten kolonial. Det er også gangavstand derfra til en god Bunnpris. Alternativt kan
                        du ta båten til Langenes, hvor det ligger en stor Kiwi-butikk fem minutters gange fra
                        gjestebrygga.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Spisesteder</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>
                          På <strong>Kapelløya</strong> finner du en koselig sommerkafé med mat og drikke.{" "}
                          <a
                            href="https://www.facebook.com/cafeverftetnyhellesund/?locale=en_GB"
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-600 underline"
                          >
                            Se Facebook-siden for meny og åpningstider
                          </a>
                          .
                        </li>
                        <li>
                          Litt lenger unna finner du <strong>Geitodden Café</strong> på Flekkerøya. Turen dit går med båt
                          uttaskjærs, så det krever godt vær.{" "}
                          <a
                            href="https://www.geitodden.no/"
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-600 underline"
                          >
                            geitodden.no
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardSection>
              </Card>
            </section>
          )}

          {/* Historien */}
          {tab === "historie" && (
            <section className="mt-6">
              <Card>
                <CardSection>
                  <Title>Historien om Sommervika</Title>
                </CardSection>
                <CardSection>
                  <div className="space-y-6 leading-relaxed">
                    <p>Helgøya 8 – Sommervika består av hytta Skjærgården og båthuset Sjøbua.</p>
                    <div>
                      <h3 className="font-semibold mb-2">Viktige årstall</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>1967 – Skjærgården og Sjøbua ble bygget som sommersted.</li>
                        <li>1982 – Sjøbua ble skadet i en storm og gjenoppbygd.</li>
                        <li>2012 – Skjærgården ble utvidet og modernisert, i samråd med fylkeskonservatoren.</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Spor fra fortiden</h3>
                      <p>
                        Bak hytta kan man se murrester etter et gammelt hus – et glimt inn i hverdagslivet på Helgøya før
                        fritidsbebyggelsen.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Fredet kulturmiljø</h3>
                      <p>
                        I 2016 ble Ny-Hellesund fredet ved kongelig resolusjon. Utvidelsen i 2012 ble gjort i dialog med
                        fylkeskonservatoren for å tilpasses landskapet.
                      </p>
                    </div>
                  </div>
                </CardSection>
              </Card>
            </section>
          )}

          {/* Området Ny-Hellesund */}
          {tab === "omrade" && (
            <section className="mt-6">
              <Card>
                <CardSection>
                  <Title>Området Ny-Hellesund</Title>
                </CardSection>
                <CardSection>
                  <div className="space-y-6 leading-relaxed">
                    <p>
                      Ny-Hellesund er en av Sørlandets best bevarte uthavner. Havnen består av Helgøya, Kapelløya og
                      Monsøya, bundet sammen av trange sund.
                    </p>
                    <div>
                      <h3 className="font-semibold mb-2">Fra seilskutetid til kystkultur</h3>
                      <p>
                        Allerede på 1600-tallet var Ny-Hellesund en travel uthavn der seilskuter søkte ly. Losvirksomhet,
                        fiske, handel og småindustri har satt spor.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Historiske steder</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Olavsundet – smalt sund oppkalt etter sagnet om Olav den hellige.</li>
                        <li>Kjøbmandskjær og gjestgiveriet – historisk gjestgiveri.</li>
                        <li>Sjøbuer og uthus – gamle sjøbuer langs sundet.</li>
                        <li>Kapelløya – navnet fra et eldre kapell.</li>
                        <li>Kystfortet på Helgøya – bygget 1942–43.</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Vern</h3>
                      <p>I 2016 ble hele Ny-Hellesund fredet som kulturmiljø. Området regnes i dag som en levende kulturarv.</p>
                    </div>
                  </div>
                </CardSection>
              </Card>
            </section>
          )}

          {/* Regler for lån */}
          {tab === "regler" && (
            <section className="mt-6">
              <Card>
                <CardSection>
                  <Title>Regler for lån av Sommervik</Title>
                </CardSection>
                <CardSection>
                  <p className="mb-4 text-slate-700">
                    For at alle skal få like gode opplevelser, ber vi om at følgende regler følges når du låner hytta:
                  </p>

                  <div className="space-y-6 leading-relaxed">
                    <div>
                      <h3 className="font-semibold mb-2">Hytta og uteområdet</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Skjærgården, Sjøbua og båtene skal forlates i samme stand som da du kom – eller gjerne litt bedre.</li>
                        <li>Alt søppel tas med hjem eller leveres i godkjent avfallsstasjon. Ikke la noe stå igjen.</li>
                        <li>Kjøleskap og matskap tømmes for lett bedervelige varer.</li>
                        <li>Gulv, bad og kjøkken vaskes/støvsuges før avreise.</li>
                        <li>Har du lånt sengetøy, håndklær eller kluter fra hytta, skal de vaskes og legges på plass igjen før avreise.</li>
                        <li>Plenen klippes dersom det trengs. Å fjerne litt ugress er også godt for sjelen.</li>
                        <li>Puter til utemøbler skal alltid ryddes inn om natta, i regnvær og når du drar.</li>
                        <li>Gå ikke inn med sko.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Båt og sjøliv</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Båtene skal leveres tilbake med like mye bensin som da du kom.</li>
                        <li>Sørg for at båtene alltid er godt fortøyd – en fender eller to ekstra skader ingen.</li>
                        <li>Pluggen for selvlensing skal stå åpen i Pepsi når du drar, men stenges ved bruk.</li>
                        <li>Ta vare på årer, vester og annet utstyr – legg det på plass i Sjøbua etter bruk.</li>
                        <li>Alle skal bruke redningsvest i båt.</li>
                        <li>Kjør hensynsfullt. Det er mange båer og skjær i Ny-Hellesund, så ta en ekstra titt på kartet.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Bad og fiske</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Ikke sitt i møbler med våte klær eller badetøy.</li>
                        <li>Fiskeutstyr i Sjøbua kan lånes – legg det tilbake etter bruk.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Strøm, vann og sikkerhet</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Slå av alle lys, elektriske apparater og steng vannet ved avreise.</li>
                        <li>Gi beskjed hvis det er lite gass igjen i grillen, slik at neste kan ta med seg.</li>
                        <li>Hytta har pumpestasjon for avløp – kun toalettpapir i do.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Generelt</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Vis hensyn til naboer og naturen.</li>
                        <li>Røyking innendørs er ikke tillatt.</li>
                        <li>Husdyr skal ikke tas med til Skjærgården.</li>
                        <li>Eventuelle skader eller mangler meldes fra så snart som mulig.</li>
                        <li>Skriv gjerne noen linjer i hytteboka før du drar.</li>
                      </ul>
                    </div>
                  </div>
                </CardSection>
              </Card>
            </section>
          )}

          {/* Bilder */}
          {tab === "bilder" && (
            <section className="mt-6">
              <Card>
                <CardSection>
                  <Title>Bilder</Title>
                </CardSection>
                <CardSection>
                  <Gallery />
                </CardSection>
              </Card>
            </section>
          )}

          {/* Kart */}
          {tab === "kart" && (
            <section className="mt-6">
              <Card>
                <CardSection>
                  <Title>Kart</Title>
                </CardSection>
                <CardSection>
                  <img
                    src="/kart_helgoya.png"
                    alt="Kart Helgøya og Ny-Hellesund"
                    className="w-full rounded-2xl ring-1 ring-black/5"
                  />
                </CardSection>
              </Card>
            </section>
          )}

          {/* Kalender */}
          {tab === "kalender" && (
            <section className="mt-6" id="kalender">
              <Card>
                <CardSection>
                  <Title>Kalender</Title>
                </CardSection>
                <CardSection>
                  <div className="aspect-video w-full overflow-hidden rounded-2xl ring-1 ring-black/5 mt-2">
                    <iframe
                      title="Sommervika kalender"
                      className="h-full w-full"
                      src={CAL_URL}
                      frameBorder="0"
                      scrolling="no"
                    />
                  </div>
                </CardSection>
              </Card>
            </section>
          )}
        </Container>
      </main>

      <footer className="border-t bg-white/70 backdrop-blur">
        <Container>
          <div className="py-8 text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {year} Sommervika – Helgøya, Ny-Hellesund</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}

/* ------- Galleri med responsiv lysboks ------- */
function Gallery() {
  const images = Array.from({ length: 20 }, (_, i) => `/gallery-${i + 1}.webp`);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const close = useCallback(() => setOpen(false), []);

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

  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => openAt(i)}
            className="group block overflow-hidden rounded-2xl ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-sky-400"
            aria-label={`Åpne bilde ${i + 1}`}
          >
            <img
              src={src}
              alt="Sommervika"
              className="h-40 w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between p-3">
            <button
              onClick={close}
              aria-label="Lukk"
              className="rounded-lg px-3 py-1 bg-white/10 text-white hover:bg-white/20"
            >
              Lukk
            </button>
            <div className="text-white text-sm">
              {index + 1} / {images.length}
            </div>
          </div>

          <div className="flex-1 relative">
            <button
              onClick={prev}
              aria-label="Forrige"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 p-3 text-white"
            >
              ‹
            </button>
            <img
              src={images[index]}
              alt=""
              className="absolute inset-0 m-auto max-h-full max-w-full object-contain select-none"
            />
            <button
              onClick={next}
              aria-label="Neste"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 p-3 text-white"
            >
              ›
            </button>
          </div>

          <div className="p-3 text-center text-xs text-white/80">
            Bruk piltastene eller knappene for å navigere. Esc for å lukke.
          </div>
        </div>
      )}
    </>
  );
}
