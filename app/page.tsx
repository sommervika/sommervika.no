
"use client";

import React, { useMemo, useState } from "react";

const HERO_URL = "/sommervika-hero.webp";

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
  { id: "regler", label: "Regler for bruk" },
  { id: "praktisk", label: "Praktisk informasjon" },
  { id: "omraade", label: "Helgøya & Ny-Hellesund" },
  { id: "kalender", label: "Kalender" },
] as const;
type TabId = typeof TABS[number]["id"];

export default function Page() {
  const [tab, setTab] = useState<TabId>("regler");
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="min-h-screen w-full">
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4">
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
        </div>
      </header>

      <section className="relative">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mt-6 h-[34vh] sm:h-[46vh] w-full overflow-hidden rounded-3xl shadow-md ring-1 ring-black/5">
            <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${HERO_URL})` }}>
              <div className="h-full w-full bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <main className="py-8">
        <div className="mx-auto max-w-6xl px-4">
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
                  <Title>Regler for bruk</Title>
                </CardSection>
                <CardSection>
                  <ul className="grid sm:grid-cols-2 gap-4 list-disc pl-6 leading-relaxed">
                    <li><strong>Antall gjester:</strong> Maks 8 overnattende med forhåndsavtale.</li>
                    <li><strong>Røykfritt:</strong> Røyking kun utendørs – bruk askebeger og ta med sneiper.</li>
                    <li><strong>Husdyr:</strong> Etter avtale. Ingen dyr i møbler/senger.</li>
                    <li><strong>Støy:</strong> Vis hensyn – ro etter kl. 23:00. Ingen høy musikk utendørs.</li>
                    <li><strong>Strøm & vann:</strong> Slå av lys/varme ved avreise. Spar på vann i tørre perioder.</li>
                    <li><strong>Boss & resirk:</strong> Sortér i merkede dunker: glass/metall, plast, papp, rest.</li>
                    <li><strong>Båt & brygge:</strong> Redningsvester på vannet. Sjekk fortøyninger ved avreise.</li>
                    <li><strong>Brannvern:</strong> Se slukkeutstyr i entré/kjøkken. Ingen åpne flammer inne.</li>
                    <li><strong>Utstyr:</strong> Bruk og rydd på plass. Meld fra om noe blir ødelagt.</li>
                    <li><strong>Utvask:</strong> Følg sjekklisten – eller bestill vask på forhånd.</li>
                  </ul>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Sjekkliste ved avreise</h3>
                    <ol className="list-decimal pl-6 space-y-1">
                      <li>Rydd og vask overflater; tøm kjøleskap og søppel.</li>
                      <li>Sett på oppvaskmaskin (eco) og tøm når ferdig hvis mulig.</li>
                      <li>Rist og heng sengetøy/tepper; legg brukte håndklær i kurv.</li>
                      <li>Steng vinduer, trekk ut båten, og lås dører.</li>
                      <li>Slå av varme/lys; sett kjøleskap på lav.</li>
                    </ol>
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
                  <Title>Helgøya & Ny-Hellesund</Title>
                </CardSection>
                <CardSection>
                  <div className="space-y-6 leading-relaxed">
                    <p>
                      Ny-Hellesund er et historisk uthavn ytterst i Søgne-skjærgården, kjent for trange sund, hvite hus
                      og lune viker. Området har vært brukt som los- og handelssted i flere hundre år, og byr i dag på
                      fine turmuligheter, badeplasser og kystkultur. Hytta vender mot viken <strong>Kilen</strong> på Helgøya –
                      perfekt for korte båtturer og padling mellom holmer.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="p-4 rounded-2xl bg-slate-50">
                        <h4 className="font-semibold mb-1">Turer</h4>
                        <p>Gå stiene på Helgøya, eller ta båten til <em>Verftet</em> på Kappelløya for kaffe og tur videre.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50">
                        <h4 className="font-semibold mb-1">Bading & strender</h4>
                        <p>Små svaberg og naturlige badekulp i le for de fleste vindretninger.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50">
                        <h4 className="font-semibold mb-1">Kultur</h4>
                        <p>Sommergallerier og arrangementer i Ny-Hellesund. Følg lokale oppslag.</p>
                      </div>
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
                  <p className="text-sm text-slate-600">Bytt <code>src</code> under med deres egen offentlige Google-kalender (Innstillinger → Integrer kalender → Offentlig lenke).</p>
                  <div className="aspect-video w-full overflow-hidden rounded-2xl ring-1 ring-black/5 mt-4">
                    <iframe
                      title="Sommervika kalender"
                      className="h-full w-full"
                      src="https://calendar.google.com/calendar/embed?height=600&wkst=2&bgcolor=%23ffffff&ctz=Europe%2FOslo&src=ZW4ubm9yc2tAaG9sZGFsbGUuZXhhbXBsZS5jb20&color=%23039BE5"
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
        </div>
      </main>

      <footer className="border-t bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4">
          <div className="py-8 text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {year} Sommervika – Helgøya, Ny-Hellesund</p>
            <div className="flex items-center gap-2">
              <a className="underline" href="mailto:booking@sommervika.no">Kontakt</a>
              <span>·</span>
              <a className="underline" href="#regler" onClick={() => setTab("regler")}>Husregler</a>
            </div>
          </div>
        </div>
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
      `Navn: ${navn}
E-post: ${epost}
Telefon: ${telefon}
Dato: ${fra} – ${til}
Antall personer: ${antall}

Melding:
${melding}`
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
