"use client";

import React, { useMemo, useState } from "react";

const HERO_URL = "/sommervika-hero.webp";
const CAL_URL =
  "https://calendar.google.com/calendar/embed?src=a45e6e94dd613dc1f703fc885132a94aa4b7271c0fc6f5f2ae7bc5c5251fae35%40group.calendar.google.com&ctz=Europe%2FOslo&hl=no&mode=MONTH&wkst=2&showPrint=0&showTabs=0&showCalendars=0&showTz=0&bgcolor=%23ffffff";

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
  { id: "regler", label: "Regler for lån" },
  { id: "praktisk", label: "Praktisk informasjon" },
  { id: "omraade", label: "Historien & Ny-Hellesund" },
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
              <div className="h-9 w-9 rounded-xl bg-sky-100 grid place-items-center shadow-sm">
                <span className="font-semibold">SV</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Sommervika</h1>
                <p className="text-xs text-slate-500 -mt-0.5">Hytta i skjærgården – Helgøya / Ny-Hellesund</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-sm">
              <a href="mailto:booking@sommervika.no" className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-slate-50">
                booking@sommervika.no
              </a>
              <a href="https://www.sommervika.no" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border hover:bg-slate-50">
                sommervika.no ↗
              </a>
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
          <nav className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 p-2 rounded-2xl">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`rounded-xl px-3 py-2 text-sm transition border ${tab === id ? "bg-white shadow-sm" : "border-transparent hover:bg-white/60"}`}
                aria-current={tab === id}
              >
                {label}
              </button>
            ))}
          </nav>

          {tab === "regler" && (
            <section className="mt-6">
              <Card>
                <CardSection>
                  <Title>Regler for lån av Sommervik</Title>
                </CardSection>
                <CardSection>
                  <p className="mb-4 text-slate-700">For at alle skal få like gode opplevelser, ber vi om at følgende regler følges når du låner hytta:</p>

                  <div className="space-y-6 leading-relaxed">
                    <div>
                      <h3 className="font-semibold mb-2">Hytta og uteområdet</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Skjærgården, Sjøbua og båtene skal forlates i samme stand som da du kom – eller gjerne litt bedre.</li>
                        <li>Alt søppel tas med hjem eller leveres i godkjent avfallsstasjon. Ikke la noe stå igjen.</li>
                        <li>Kjøleskap og matskap tømmes for lett bedervelige varer.</li>
                        <li>Gulv, bad og kjøkken vaskes/støvsuges før avreise.</li>
                        <li>Har du lånt sengetøy, håndklær eller kluter fra hytta, skal de vaskes og legges på plass igjen før avreise.</li>
                        <li>Plenen klippes dersom det trengs (og det gjør det nok). Å fjerne litt ugress er også godt for sjelen.</li>
                        <li>Puter til utemøbler skal alltid ryddes inn om natta, i regnvær og når du drar.</li>
                        <li>Gå ikke inn med sko.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Båt og sjøliv</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Båtene skal leveres tilbake med like mye bensin som da du kom (eventuelt kan du prøve å be om tilgivelse før du drar).</li>
                        <li>Sørg for at båtene alltid er godt fortøyd – en fender eller to ekstra skader ingen.</li>
                        <li>Pluggen for selvlensing skal stå åpen i Pepsi når du drar, men stenges ved bruk.</li>
                        <li>Ta vare på årer, vester og annet utstyr – legg det på plass i Sjøbua etter bruk.</li>
                        <li>Alle skal bruke redningsvest i båt.</li>
                        <li>Kjør hensynsfullt, både for miljøet, naboene og sikkerheten. Det er mange båer og skjær i Ny Hellesund, så ta en ekstra titt på kartet.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Bad og fiske</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Bad og kos dere, men ikke sitt i møbler med våte klær eller badetøy.</li>
                        <li>Det ligger fiskeutstyr i Sjøbua som kan lånes – legg det tilbake etter bruk.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Strøm, vann og sikkerhet</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Slå av alle lys, elektriske apparater og steng vannet ved avreise.</li>
                        <li>Gi beskjed hvis det er lite gass igjen i grillen, slik at neste kan ta med seg.</li>
                        <li>Hytta har pumpestasjon for avløp – derfor må kun toalettpapir kastes i do (ikke bind, våtservietter o.l.).</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Generelt</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Vis hensyn til naboer og naturen.</li>
                        <li>Røyking innendørs er ikke tillatt.</li>
                        <li>Husdyr skal ikke tas med til Skjærgården.</li>
                        <li>Eventuelle skader eller mangler meldes fra så snart som mulig.</li>
                        <li>Det er obligatorisk å skrive noen linjer i hytteboka før du drar! Håper dere har hatt det fint :-D</li>
                      </ul>
                    </div>
                  </div>
                </CardSection>
              </Card>
            </section>
          )}

          {tab === "praktisk" && (
            <section className="mt-6 grid lg:grid-cols-3 gap-6">
              <Card>
                <CardSection>
                  <Title>Praktisk informasjon</Title>
                </CardSection>
                <CardSection>
                  <div className="space-y-6 leading-relaxed">
                    <div>
                      <h3 className="font-semibold mb-2">Adkomst</h3>
                      <p>Hytta ligger i viken <strong>Kilen</strong> på Helgøya, i Ny-Hellesund. Adkomst med båt fra Høllen eller Langenes. Betalparkering på fastlandet. Ta kontakt for detaljer om båtplass og nøkler.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Innsjekk / utsjekk</h4>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Innsjekk etter kl. 15:00, utsjekk før kl. 12:00.</li>
                          <li>Nøkler hentes/leveres iht. instruks i velkomstmelding.</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Sengetøy & håndklær</h4>
                        <p>Ta med eget – med mindre leie er avtalt.</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Kjøkken</h4>
                        <p>Komfyr, kjøleskap, oppvaskmaskin og basisvarer (salt/pepper/olje).</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Varme & strøm</h4>
                        <p>Panelovner og varmepumpe. Vær varsom med strømforbruk.</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Båt, bad og brygge</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Flytevest til alle om bord; vær obs på strøm i sundet.</li>
                        <li>Kryssfortøyning anbefales ved sørvestlig vind.</li>
                        <li>Dusj ute/inne etter sesong. Skyll saltvann av utstyr.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Butikker & spisesteder</h4>
                      <p>Handel i <strong>Høllen</strong> (lokalhandel + Bunnpris), eller <strong>Langenes</strong> (Kiwi ved offentlig brygge). Sommerstid: kafé på <strong>Verftet</strong> på Kappelløya.</p>
                    </div>
                  </div>
                </CardSection>
              </Card>

              <Card>
                <CardSection>
                  <Title>Kontakt</Title>
                </CardSection>
                <CardSection>
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="font-medium">E-post</div>
                      <a className="underline" href="mailto:booking@sommervika.no">booking@sommervika.no</a>
                    </div>
                    <div>
                      <div className="font-medium">Nød / drift</div>
                      <p>Ring oppgitt kontakt i velkomstbrev.</p>
                    </div>
                    <div>
                      <div className="font-medium">Adresse</div>
                      <p>Sommervika, Helgøya – 4640 Søgne</p>
                    </div>
                    <a
                      href="#kalender"
                      onClick={() => setTab("kalender")}
                      className="inline-flex w-full items-center justify-center rounded-2xl border px-4 py-2 hover:bg-slate-50"
                    >
                      Sjekk tilgjengelighet
                    </a>
                  </div>
                </CardSection>
              </Card>
            </section>
          )}

          {tab === "omraade" && (
            <section className="mt-6">
              <Card>
                <CardSection>
                  <Title>Historien om Sommervika & Ny-Hellesund</Title>
                </CardSection>
                <CardSection>
                  <div className="space-y-6 leading-relaxed">
                    <div>
                      <h3>Historien om Sommervika</h3>
                      <p>📍 <strong>Helgøya 8 – Sommervika</strong> består av hytta <em>Skjærgården</em> og båthuset <em>Sjøbua</em>.</p>
                      <h4 className="font-semibold">🗓 Viktige årstall</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li><strong>1967</strong> – Skjærgården og Sjøbua ble bygget som sommersted.</li>
                        <li><strong>1982</strong> – Sjøbua ble skadet i en storm og gjenoppbygd.</li>
                        <li><strong>2012</strong> – Skjærgården ble utvidet og modernisert, med godkjenning fra fylkeskonservatoren.</li>
                      </ul>
                      <h4 className="font-semibold mt-4">🌲 Spor fra fortiden</h4>
                      <p>Bak hytta, inne i skogen, kan man fremdeles se murrester etter et gammelt hus – et glimt inn i hverdagslivet på Helgøya før fritidsbebyggelsen.</p>
                      <h4 className="font-semibold mt-4">🌿 Fredet kulturmiljø</h4>
                      <p>I <strong>2016 ble Ny-Hellesund fredet ved kongelig resolusjon</strong>. Utvidelsen av Skjærgården i 2012 ble gjort i dialog med fylkeskonservatoren, slik at hytta skulle passe naturlig inn i det fredede landskapet.</p>
                      <h4 className="font-semibold mt-4">🌊 Beliggenheten</h4>
                      <p>Sommervika ligger ytterst på Helgøya i Ny-Hellesund – midt i Sørlandets skjærgård. Hytta vender mot den lune viken <strong>Kilen</strong>, som i generasjoner har vært brukt som havn og tilholdssted for småbåter.</p>
                      <h4 className="font-semibold mt-4">🚶 Turmuligheter rett fra hytta</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Vestover:</strong> Sti over fjellet til fergekaia og festningsanleggene.</li>
                        <li><strong>Østover:</strong> Via naboens plen til “Tyskerbrygga” og videre til festningene.</li>
                        <li><strong>Snarveien nordover:</strong> Rett gjennom hagen og over saugjerdet til ferjeleiet.</li>
                        <li><strong>Med båt til Kapelløya:</strong> Besøk Verftet med sommerkafé og stier videre.</li>
                      </ul>
                      <h4 className="font-semibold mt-4">🛒 Handling og service</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Høllen</strong> – lokalhandel + Bunnpris.</li>
                        <li><strong>Langenes</strong> – offentlig brygge + Kiwi.</li>
                        <li><strong>Kristiansand</strong> – ca. 30 min med hurtigbåt.</li>
                      </ul>
                    </div>

                    <div>
                      <h3>⚓ Ny-Hellesund – uthavna i havgapet</h3>
                      <p>Ny-Hellesund er en av Sørlandets best bevarte uthavner, bestående av <strong>Helgøya, Kapelløya og Monsøya</strong>, bundet sammen av trange sund.</p>
                      <h4 className="font-semibold">🌍 Fra seilskutetid til kystkultur</h4>
                      <p>Allerede på 1600-tallet var Ny-Hellesund en travel uthavn der seilskuter søkte ly. Den smale innseilingen gjorde stedet trygt, og havnen ble et viktig stoppested på leia. Losvirksomhet, fiske, handel og småindustri preget stedet.</p>
                      <h4 className="font-semibold">🏛 Historiske bygg og steder</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Olavsundet</strong> – smalt sund oppkalt etter sagnet om Olav den hellige.</li>
                        <li><strong>Kjøbmandskjær og gjestgiveriet</strong> – gjestgiveri på 1700–1800-tallet.</li>
                        <li><strong>Sjøbuer og uthus</strong> – gamle sjøbuer langs sundet.</li>
                        <li><strong>Kapelløya</strong> – navnet fra et kapell på 1500-tallet.</li>
                        <li><strong>Kystfortet på Helgøya</strong> – bygget av tyskerne 1942–43.</li>
                      </ul>
                      <h4 className="font-semibold">🕰 Moderne tid og vern</h4>
                      <p>Etter seilskutetida ble mange hus sommerhus. I <strong>2016 ble hele Ny-Hellesund fredet</strong>, og i dag regnes området som en levende kulturarv.</p>
                    </div>
                  </div>
                </CardSection>
              </Card>
            </section>
          )}

          {tab === "kalender" && (
            <section className="mt-6" id="kalender">
              <Card>
                <CardSection>
                  <Title>Kalender</Title>
                </CardSection>
                <CardSection>
                  <p className="text-sm text-slate-600">Kalenderen under er lenket til vår Google-kalender. Ønsker du norsk tidssone, bytt <code>Europe/London</code> til <code>Europe/Oslo</code> i <code>CAL_URL</code>.</p>
                  <div className="aspect-video w-full overflow-hidden rounded-2xl ring-1 ring-black/5 mt-4">
                    <iframe
                      title="Sommervika kalender"
                      className="h-full w-full"
                      src={CAL_URL}
                      frameBorder="0"
                      scrolling="no"
                    />
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6 mt-6">
                    <div className="p-4 rounded-2xl bg-slate-50">
                      <h4 className="font-semibold mb-2">Ledige datoer</h4>
                      <p className="text-sm text-slate-600">Sjekk kalenderen og send forespørsel i skjemaet. Vi bekrefter på e-post.</p>
                    </div>

                    <BookingForm />
                  </div>

                  <p className="text-sm text-slate-600 mt-4">
                    Eller send e-post til <a className="underline" href="mailto:booking@sommervika.no">booking@sommervika.no</a>.
                  </p>
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
            <div className="flex items-center gap-2">
              <a className="underline" href="mailto:booking@sommervika.no">Kontakt</a>
              <span>·</span>
              <a className="underline" href="#regler" onClick={() => setTab("regler")}>Husregler</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}

function BookingForm() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const navn = (data.get("navn") as string) || "";
    const epost = (data.get("epost") as string) || "";
    const telefon = (data.get("telefon") as string) || "";
    const fra = (data.get("fra") as string) || "";
    const til = (data.get("til") as string) || "";
    const antall = (data.get("antall") as string) || "";
    const melding = (data.get("melding") as string) || "";
    const subject = encodeURIComponent(`Bookingforespørsel – Sommervika (${fra}–${til})`);
    const body = encodeURIComponent(
      `Navn: ${navn}\nE-post: ${epost}\nTelefon: ${telefon}\nDato: ${fra} – ${til}\nAntall personer: ${antall}\n\nMelding:\n${melding}`
    );
    window.location.href = `mailto:booking@sommervika.no?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={onSubmit} className="p-4 rounded-2xl bg-white ring-1 ring-black/5 space-y-3">
      <h4 className="font-semibold">Booking-forespørsel</h4>
      <div className="grid sm:grid-cols-2 gap-3">
        <input name="navn" required placeholder="Navn" className="px-3 py-2 rounded-xl border" />
        <input type="email" name="epost" required placeholder="E-post" className="px-3 py-2 rounded-xl border" />
        <input name="telefon" placeholder="Telefon" className="px-3 py-2 rounded-xl border sm:col-span-2" />
        <div className="grid grid-cols-2 gap-3 sm:col-span-2">
          <input type="date" name="fra" required className="px-3 py-2 rounded-xl border" />
          <input type="date" name="til" required className="px-3 py-2 rounded-xl border" />
        </div>
        <input name="antall" placeholder="Antall personer" className="px-3 py-2 rounded-xl border sm:col-span-2" />
        <textarea name="melding" rows={4} placeholder="Melding / evt. spørsmål" className="px-3 py-2 rounded-xl border sm:col-span-2" />
      </div>
      <button type="submit" className="w-full rounded-2xl border px-4 py-2 hover:bg-slate-50">Send forespørsel</button>
      <p className="text-xs text-slate-500 text-center">Skjemaet åpner e-postklienten din med ferdig utfylt melding til booking@sommervika.no.</p>
    </form>
  );
}
