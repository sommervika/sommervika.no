"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";

const HERO_URL = "/20250812_1200591.jpg";
const CAL_URL =
  "https://calendar.google.com/calendar/embed?src=a45e6e94dd613dc1f703fc885132a94aa4b7271c0fc6f5f2ae7bc5c5251fae35%40group.calendar.google.com&ctz=Europe%2FLondon";

const LANG_KEY = "sommervika:lang";
type Lang = "no" | "en";

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

// --- i18n ---------------------------------------------------------------
type Dict = {
  subtitle: string;
  tabs: Record<string, string>;
  kilevikaHeading: string;
  welcomeHeading: string;
  welcomeP1: string;
  welcomeP2: string;
  accessHeading: string;
  accessP1: string;
  accessP2Pre: string;
  accessLink: string;
  practicalHeading: string;
  boatHeading: string;
  boatItems: string[];
  shopsHeading: string;
  shopsBody: string;
  foodHeading: string;
  foodKapel: string;
  foodKapelLink: string;
  foodGeit: string;
  foodGeitLink: string;
  // CO2 section (under Practical)
  co2Heading: string;
  co2Intro: string;
  co2GoalHeading: string;
  co2GoalBody: string;
  co2FuelHeading: string;
  co2FuelBody: string;
  co2FuelLink: string;
  co2ElectricityHeading: string;
  co2ElectricityBody: string;
  co2WoodHeading: string;
  co2WoodBody: string;
  co2FlightsHeading: string;
  co2FlightsBody: string;
  co2LearnMore: string;
  footer: string;
};

const T: Record<Lang, Dict> = {
  no: {
    subtitle: "Familiehytte – Helgøya / Ny-Hellesund",
    tabs: {
      kilevika: "Kilevika",
      praktisk: "Praktisk informasjon",
      historie: "Historien om Kilevika",
      omrade: "Området Ny-Hellesund",
      regler: "Regler for lån",
      bilder: "Bilder",
      kart: "Kart",
      kalender: "Kalender",
    },
    kilevikaHeading: "Kilevika",
    welcomeHeading: "Velkommen til Kilevika",
    welcomeP1:
      "Kilevika ligger i den lune viken Kilen på Helgøya, i Ny-Hellesund. Her ligger Kilenstua og Sjøbua tett på sjøen, med brygga og svabergene rett utenfor døra. På denne siden finner du praktisk informasjon om bruk av hytta, regler for lån, historie og litt om området rundt.",
    welcomeP2:
      "Hytta er en privat familiehytte. Vi låner den ut til familie og nære venner, men vi driver dessverre ikke med utleie. Tomten heter offisielt Kilevika, men i dagligtale kaller vi den ofte Sommervika.",
    accessHeading: "Adkomst",
    accessP1:
      "Vanlig adkomst er med båt fra Solta Båthavn i Høllen, hvor det også finnes mulighet for parkering mot betaling. Ta kontakt med oss for detaljer om båtplass og nøkler.",
    accessP2Pre: "Det går også passasjerferge flere ganger daglig fra Høllen til Helgøya.",
    accessLink: "Se rutetabell her",
    practicalHeading: "Praktisk informasjon",
    boatHeading: "Båt, bad og brygge",
    boatItems: [
      "Alle skal bruke redningsvest i båt.",
      "Vester og årer til Solo og Pepsi finnes i Sjøbua.",
      "Bensinkanne og reservekanne til Pepsi er også i Sjøbua.",
    ],
    shopsHeading: "Butikker",
    shopsBody:
      "Det finnes ingen matbutikker i Ny-Hellesund. Enkleste alternativ er å ta båten til Høllen, hvor det ligger en liten kolonial. Det er også gangavstand derfra til en god Bunnpris. Alternativt kan du ta båten til Langenes, hvor det ligger en stor Kiwi-butikk fem minutters gange fra gjestebrygga.",
    foodHeading: "Spisesteder",
    foodKapel: "På Kapelløya finner du en koselig sommerkafé med mat og drikke.",
    foodKapelLink: "Se Facebook-siden for meny og åpningstider",
    foodGeit:
      "Litt lenger unna finner du Geitodden Café på Flekkerøya. Turen dit går med båt uttaskjærs, så det krever godt vær.",
    foodGeitLink: "Se hjemmesiden for meny og åpningstider",
    co2Heading: "CO₂ og klima",
    co2Intro:
      "Vi er glad i kysten og naturen vår, og prøver å ta noen grep for å minimere klimaavtrykket ved bruk av Kilevika.",
    co2GoalHeading: "Målet vårt",
    co2GoalBody:
      "All CO₂ vi kan spore til Kilevika — båtdrivstoff, flyreiser til og fra Kristiansand, oppvarming — skal fjernes fra atmosfæren. Vi kompenserer ikke med trær eller kvoter, men kjøper fysisk fjerning via Direct Air Capture (DAC) hos Climeworks på Island.",
    co2FuelHeading: "Fossilt drivstoff til båtene",
    co2FuelBody:
      "Hver fylling av bensin på Yamarin og Pepsi logges, og tilsvarende mengde CO₂ fjernes via DAC. Vi fører åpen logg slik at alle som bruker hytta kan se utslippene og offsetten.",
    co2FuelLink: "Se CO₂-loggen for båtene →",
    co2ElectricityHeading: "Strøm og oppvarming",
    co2ElectricityBody:
      "Strømmen på hytta er opprinnelsesgarantert fornybar, og oppvarmingen er elektrisk. Det betyr at den daglige driften i praksis er utslippsfri.",
    co2WoodHeading: "Ved",
    co2WoodBody:
      "All ved til peisen er lokal og selvhogd. Den ligger innenfor naturens kortsyklede karbonkretsløp og regnes som klimanøytral.",
    co2FlightsHeading: "Flyreiser",
    co2FlightsBody:
      "For lengre reiser til og fra Kristiansand i forbindelse med hytta offsetter vi flyutslippene på samme måte som båtdrivstoffet — gjennom DAC hos Climeworks.",
    co2LearnMore: "Les mer om Climeworks",
    footer: "Kilevika – Helgøya, Ny-Hellesund",
  },
  en: {
    subtitle: "Family cabin – Helgøya / Ny-Hellesund",
    tabs: {
      kilevika: "Kilevika",
      praktisk: "Practical info",
      historie: "History of Kilevika",
      omrade: "The Ny-Hellesund area",
      regler: "House rules",
      bilder: "Photos",
      kart: "Maps",
      kalender: "Calendar",
    },
    kilevikaHeading: "Kilevika",
    welcomeHeading: "Welcome to Kilevika",
    welcomeP1:
      "Kilevika sits in the sheltered cove of Kilen on Helgøya, in Ny-Hellesund. Kilenstua (the main cabin) and Sjøbua (the boathouse) stand right by the sea, with the dock and smooth coastal rocks just outside the door. On this page you'll find practical information about using the cabin, rules for borrowing it, history, and a bit about the surrounding area.",
    welcomeP2:
      "The cabin is a private family cabin. We lend it to family and close friends, but unfortunately we don't rent it out. The property is officially called Kilevika, but in everyday speech we often just call it Sommervika.",
    accessHeading: "Getting there",
    accessP1:
      "The usual way to reach the cabin is by boat from Solta Båthavn in Høllen, where paid parking is also available. Get in touch with us for details about boat moorings and keys.",
    accessP2Pre: "There's also a passenger ferry several times a day from Høllen to Helgøya.",
    accessLink: "See the timetable here",
    practicalHeading: "Practical information",
    boatHeading: "Boat, swimming and dock",
    boatItems: [
      "Everyone must wear a life jacket in the boat.",
      "Life jackets and oars for Solo and Pepsi are in Sjøbua.",
      "The fuel can and reserve can for Pepsi are also in Sjøbua.",
    ],
    shopsHeading: "Shops",
    shopsBody:
      "There are no grocery stores in Ny-Hellesund. The easiest option is to take the boat to Høllen, where there's a small grocery shop. There's also walking distance from there to a good Bunnpris. Alternatively, take the boat to Langenes, where a large Kiwi store sits five minutes on foot from the visitor dock.",
    foodHeading: "Places to eat",
    foodKapel: "On Kapelløya you'll find a cosy summer café with food and drink.",
    foodKapelLink: "See the Facebook page for menu and opening hours",
    foodGeit:
      "A bit further away is Geitodden Café on Flekkerøya. The trip there goes by boat on the open sea, so it needs good weather.",
    foodGeitLink: "See the website for menu and opening hours",
    co2Heading: "CO₂ and climate",
    co2Intro:
      "We care about the coast and the nature around us, and try to take a few steps to minimize the climate footprint of using Kilevika.",
    co2GoalHeading: "Our goal",
    co2GoalBody:
      "All CO₂ we can trace to Kilevika — boat fuel, flights to and from Kristiansand, heating — is removed from the atmosphere. We don't offset with trees or credits; we buy physical removal via Direct Air Capture (DAC) from Climeworks in Iceland.",
    co2FuelHeading: "Fossil fuel for the boats",
    co2FuelBody:
      "Every refill of petrol on Yamarin and Pepsi is logged, and the equivalent amount of CO₂ is removed via DAC. We keep an open log so everyone using the cabin can see both the emissions and the offset.",
    co2FuelLink: "See the boat CO₂ log →",
    co2ElectricityHeading: "Electricity and heating",
    co2ElectricityBody:
      "The cabin's electricity is guaranteed-of-origin renewable, and heating is electric. That means day-to-day operation is effectively emission-free.",
    co2WoodHeading: "Firewood",
    co2WoodBody:
      "All firewood for the stove is local and cut by us. It sits within nature's short-cycle carbon loop and is considered climate-neutral.",
    co2FlightsHeading: "Flights",
    co2FlightsBody:
      "For longer trips to and from Kristiansand in connection with the cabin we offset the flight emissions the same way as the boat fuel — through DAC at Climeworks.",
    co2LearnMore: "Read more about Climeworks",
    footer: "Kilevika – Helgøya, Ny-Hellesund",
  },
};

const TAB_IDS = [
  "kilevika",
  "praktisk",
  "historie",
  "omrade",
  "regler",
  "bilder",
  "kart",
  "kalender",
] as const;
type TabId = typeof TAB_IDS[number];

export default function Page() {
  const [lang, setLang] = useState<Lang>("no");
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANG_KEY) as Lang | null;
      if (stored === "no" || stored === "en") setLang(stored);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {}
  }, [lang]);
  const t = T[lang];

  const [tab, setTab] = useState<TabId>("kilevika");
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="min-h-screen w-full">
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b">
        <Container>
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl overflow-hidden shadow-sm ring-1 ring-black/5">
                <img src="/logo-hytte-icon-sketch.jpg" alt="Kilevika" className="h-full w-full object-cover" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Kilevika</h1>
                <p className="text-xs text-slate-500 -mt-0.5">{t.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-slate-100 p-0.5 text-xs">
              <button
                onClick={() => setLang("no")}
                className={
                  "rounded-full px-2.5 py-1 transition " +
                  (lang === "no" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")
                }
                aria-pressed={lang === "no"}
              >
                NO
              </button>
              <button
                onClick={() => setLang("en")}
                className={
                  "rounded-full px-2.5 py-1 transition " +
                  (lang === "en" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")
                }
                aria-pressed={lang === "en"}
              >
                EN
              </button>
            </div>
          </div>
        </Container>
      </header>

      <section className="relative">
        <Container>
          <div className="mt-6 h-[34vh] sm:h-[46vh] w-full overflow-hidden rounded-3xl shadow-md ring-1 ring-black/5">
            <div className="h-full w-full bg-cover bg-bottom" style={{ backgroundImage: `url(${HERO_URL})` }}>
              <div className="h-full w-full bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
            </div>
          </div>
        </Container>
      </section>

      <main className="py-8">
        <Container>
          <nav className="grid grid-cols-2 sm:grid-cols-8 gap-2 bg-slate-100 p-2 rounded-2xl">
            {TAB_IDS.map((id) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`rounded-xl px-3 py-2 text-sm transition border ${
                  tab === id ? "bg-white shadow-sm" : "border-transparent hover:bg-white/60"
                }`}
                aria-current={tab === id}
              >
                {t.tabs[id]}
              </button>
            ))}
          </nav>

          {/* Kilevika */}
          {tab === "kilevika" && (
            <section className="mt-6">
              <Card>
                <CardSection>
                  <Title>{t.kilevikaHeading}</Title>
                </CardSection>
                <CardSection>
                  <div className="space-y-6 leading-relaxed">
                    <div>
                      <h3 className="font-semibold mb-2">{t.welcomeHeading}</h3>
                      <p>{t.welcomeP1}</p>
                      <p className="mt-2">{t.welcomeP2}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">{t.accessHeading}</h3>
                      <p>{t.accessP1}</p>
                      <p className="mt-2">
                        {t.accessP2Pre}{" "}
                        <a
                          href="https://www.akt.no/_f/p1/i84326d30-9668-4820-bc65-6ca70588fa28/92-hollen-boroya-skarpoya-ny-hellsund-fra-01072025.pdf"
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-600 underline"
                        >
                          {t.accessLink}
                        </a>
                        .
                      </p>
                    </div>

                    <img
                      src="/20250812_114536.jpg"
                      alt="Kilevika"
                      className="w-full rounded-2xl ring-1 ring-black/5"
                      loading="lazy"
                    />
                  </div>
                </CardSection>
              </Card>
            </section>
          )}

          {/* Praktisk informasjon */}
          {tab === "praktisk" && (
            <section className="mt-6">
              <Card>
                <CardSection>
                  <Title>{t.practicalHeading}</Title>
                </CardSection>
                <CardSection>
                  <div className="space-y-6 leading-relaxed">
                    <div>
                      <h3 className="font-semibold mb-2">{t.boatHeading}</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        {t.boatItems.map((it, i) => (
                          <li key={i}>{it}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">{t.shopsHeading}</h3>
                      <p>{t.shopsBody}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">{t.foodHeading}</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>
                          {t.foodKapel}{" "}
                          <a
                            href="https://www.facebook.com/cafeverftetnyhellesund/?locale=en_GB"
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-600 underline"
                          >
                            {t.foodKapelLink}
                          </a>
                          .
                        </li>
                        <li>
                          {t.foodGeit}{" "}
                          <a
                            href="https://www.geitodden.no/"
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-600 underline"
                          >
                            {t.foodGeitLink}
                          </a>
                        </li>
                      </ul>
                    </div>

                    {/* CO2 and climate */}
                    <div className="pt-2 border-t border-slate-200">
                      <h3 className="font-semibold mb-2 mt-4">{t.co2Heading}</h3>
                      <p className="text-slate-700">{t.co2Intro}</p>

                      <div className="mt-4">
                        <h4 className="font-medium">{t.co2GoalHeading}</h4>
                        <p className="mt-1">{t.co2GoalBody}</p>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-medium">{t.co2FuelHeading}</h4>
                        <p className="mt-1">{t.co2FuelBody}</p>
                        <p className="mt-2">
                          <a href="/co2baat" className="text-sky-600 underline">
                            {t.co2FuelLink}
                          </a>
                        </p>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-medium">{t.co2ElectricityHeading}</h4>
                        <p className="mt-1">{t.co2ElectricityBody}</p>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-medium">{t.co2WoodHeading}</h4>
                        <p className="mt-1">{t.co2WoodBody}</p>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-medium">{t.co2FlightsHeading}</h4>
                        <p className="mt-1">{t.co2FlightsBody}</p>
                      </div>

                      <p className="mt-4 text-sm">
                        <a
                          href="https://climeworks.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 underline underline-offset-2"
                        >
                          {t.co2LearnMore}
                          <span aria-hidden="true">→</span>
                        </a>
                      </p>
                    </div>
                  </div>
                </CardSection>
              </Card>
            </section>
          )}

          {/* Historien — TODO: i18n */}
          {tab === "historie" && (
            <section className="mt-6">
              <Card>
                <CardSection>
                  <Title>{t.tabs.historie}</Title>
                </CardSection>
                <CardSection>
                  <div className="space-y-6 leading-relaxed">
                    <p>
                      Helgøya 8 – Kilevika består av hytta Kilenstua og
                      båthuset Sjøbua.
                    </p>

                    <div>
                      <h3 className="font-semibold mb-2">Viktige årstall</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>1968 – Kilenstua og Sjøbua ble bygget som sommersted.</li>
                        <li>1991 – Sjøbua ble skadet i en storm og gjenoppbygd.</li>
                        <li>2013 – Kilenstua ble utvidet og modernisert, i samråd med fylkeskonservatoren.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Spor fra fortiden</h3>
                      <p>
                        Bak hytta kan man se murrester etter et gammelt hus – et glimt inn i
                        hverdagslivet på Helgøya før fritidsbebyggelsen.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Fredet kulturmiljø</h3>
                      <p>
                        I 2016 ble Ny-Hellesund fredet ved kongelig resolusjon. Utvidelsen i 2012
                        ble gjort i dialog med fylkeskonservatoren for å tilpasses landskapet.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Krigshistorie</h3>
                      <p>
                        Under andre verdenskrig gikk den tyske gangveien <em>Langfeldstieg</em>
                        forbi eiendommen. Den ble anlagt sommeren og høsten 1942 som en
                        transportvei mellom kaianlegget, leiren til Organisation Todt (ved dagens
                        Helgøya&nbsp;10) og kystfortet.
                      </p>
                      <p>
                        Området var dessuten svært farlig. Her lå fire minefelt
                        (<em>Teilfeld&nbsp;L</em>) med til sammen 115 antipersonellminer.
                      </p>
                      <p>
                        I dag er det fortsatt mulig å se enkelte trappetrinn og betongflater
                        langs traseen som kan stamme fra krigstiden. Alle miner ble naturligvis
                        ryddet bort etter krigen, og området er helt trygt å ferdes i.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">
                        Minekart fra andre verdenskrig
                      </h3>
                      <p className="mb-4">
                        Kartet viser tyske miner og sperringer i Ny-Hellesund-området under
                        okkupasjonen.
                      </p>

                      <img
                        src="/ww2.jpg"
                        alt="Minekart fra andre verdenskrig"
                        className="w-full rounded-2xl ring-1 ring-black/5"
                        loading="lazy"
                      />
                      <p className="mt-2 text-sm text-slate-500">
                        Kilde: Forsvarshistorisk forening i Kristiansandsregionen
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">
                        Kilevika i 1990
                      </h3>
                      <p className="mb-4">
                        Bildet viser hytta slik den så ut rundt 1990, før utbygging og
                        renovering av sjøbua.
                      </p>

                      <img
                        src="/Kilevika1990.png"
                        alt="Kilevika i 1990"
                        className="w-full rounded-2xl ring-1 ring-black/5"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </CardSection>
              </Card>
            </section>
          )}

          {/* Området Ny-Hellesund — TODO: i18n */}
          {tab === "omrade" && (
            <section className="mt-6">
              <Card>
                <CardSection>
                  <Title>{t.tabs.omrade}</Title>
                </CardSection>
                <CardSection>
                  <div className="space-y-6 leading-relaxed">
                    <p>
                      Ny-Hellesund er en av Sørlandets best bevarte uthavner, kjent for sin vakre natur og rike historie. Havnen består av øyene Helgøya, Kapelløya og Monsøya, bundet sammen av trange sund.
                    </p>
                    <div>
                      <h3 className="font-semibold mb-2">Fra seilskutetid til kystkultur</h3>
                      <p>
                        Allerede på 1600-tallet var Ny-Hellesund en travel uthavn der seilskuter fra fjern og nær søkte ly for vær og vind. Den smale innseilingen gjorde stedet trygt, og havnen ble et viktig stoppested på leia mellom Østlandet og Vestlandet.
                      </p>
                      <p>
                        Gjennom tidene hadde Ny-Hellesund både tollstasjon, gjestgiveri og verft, og utviklet seg til et lite sentrum i skjærgården. Mange familier levde som loser, og losstasjonen her var blant de viktigste på Sørlandskysten. Fisket ga også livsgrunnlag, og det ble drevet både handel og småindustri knyttet til sjøen.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Historiske bygg og steder</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Olavsundet – et smalt sund mellom Kapelløya og Helgøya, oppkalt etter sagnet om at Olav den hellige seilte gjennom her på flukt fra fiender.</li>
                        <li>Kjøbmandskjær og gjestgiveriet – på 1700- og 1800-tallet lå det et gjestgiveri her hvor sjøfolk fikk husly og proviant.</li>
                        <li>Sjøbuer og uthus – mange av de gamle sjøbuene, brukt til lagring av fiskeredskaper og varer, står fortsatt langs sundet.</li>
                        <li>Kapelløya – har navn etter et kapell som stod her på 1500-tallet. Ruinene er borte, men navnet lever videre.</li>
                        <li>Kystfortet på Helgøya – anlagt av tyskerne i 1942–43 som del av Atlanterhavsvollen. Her finnes fortsatt kanonstillinger, tunneler og bygninger fra krigsårene.</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Moderne tid og vern</h3>
                      <p>
                        Etter seilskutetiden gikk aktiviteten gradvis ned, og mange av bygningene ble tatt i bruk som sommerhus. Den unike kombinasjonen av natur, kultur og historie førte til at hele Ny-Hellesund ble fredet som kulturmiljø ved kongelig resolusjon i 2016.
                      </p>
                      <p>
                        I dag regnes uthavnen som en levende kulturarv – et sted der man kan oppleve både naturens ro og sporene etter flere hundre års kysthistorie.
                      </p>
                      <p className="mt-2">
                        Les mer om Ny-Hellesund på{" "}
                        <a
                          href="https://riksantikvaren.no/kulturhistorie/ny-hellesund-med-armene-mot-verden/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-600 underline"
                        >
                          Riksantikvaren sin hjemmeside
                        </a>
                        .
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Turmuligheter rett fra hytta</h3>
                      <p>Helgøya byr på mange fine stier og små eventyr rett utenfor døra. Fra Kilevika kan du velge flere ruter:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Vestover: Følg stien vestover fra hytta, og ta første sti til venstre over fjellet. Da kommer du ned til fergekaia og veien videre mot festningsanleggene.</li>
                        <li>Østover: Gå via naboens plen til den såkalte "Tyskerbrygga". Herfra kan du følge grusveien opp til festningene eller ned til ferjeleiet.</li>
                        <li>Snarveien nordover: For de som ikke er redd for litt småklatring – ta turen rett nordover fra hytta, gjennom hagen, over saugjerdet og forbi et par store steiner. Da kommer du rett ned til ferjeleia.</li>
                        <li>Med båt til Kapelløya: Hvis du vil utforske mer av Ny-Hellesund, er det flott å ta båten bort til Verftet på Kapelløya. Her finner du en koselig sommerkafé og gode muligheter for å fortsette turen videre til fots.</li>
                      </ul>
                      <p>Alle rutene gir et lite innblikk i Helgøyas natur og historie – og flere leder til de gamle tyske festningene fra andre verdenskrig, som er vel verdt et besøk.</p>
                      <img
                        src="/helgoya-stikart2.png"
                        alt="Turkart – Helgøya"
                        className="mt-4 w-full rounded-2xl ring-1 ring-black/5"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </CardSection>
              </Card>
            </section>
          )}

          {/* Regler for lån — TODO: i18n */}
          {tab === "regler" && (
            <section className="mt-6">
              <Card>
                <CardSection>
                  <Title>Regler for lån av Kilevika</Title>
                </CardSection>
                <CardSection>
                  <div className="space-y-6 leading-relaxed">
                    <div>
                      <h3 className="font-semibold mb-2">Hytta og uteområdet</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Kilenstua, Sjøbua og båtene skal forlates i samme stand som da du kom – eller gjerne litt bedre.</li>
                        <li>Alt søppel tas med hjem eller leveres i godkjent avfallsstasjon. Ikke la noe stå igjen.</li>
                        <li>Kjøleskap og matskap tømmes for lett bedervelige varer.</li>
                        <li>Gulv, bad og kjøkken vaskes/støvsuges før avreise.</li>
                        <li>Vi setter pris på at dere tar med eget sengetøy og håndklær.</li>
                        <li>Plenen klippes dersom det trengs. Å fjerne litt ugress er fint.</li>
                        <li>Puter til utemøbler skal alltid ryddes inn om natta, i regnvær og når du drar.</li>
                        <li>Gå ikke inn med sko.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Båt og sjøliv</h3>
                      <ul className="list-disc pl-6 space-y-1">
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
                        <li>Husdyr skal ikke tas med til Kilevika.</li>
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
                  <Title>{t.tabs.bilder}</Title>
                </CardSection>
                <CardSection>
                  <Gallery lang={lang} />
                </CardSection>
              </Card>
            </section>
          )}

          {/* Kart */}
          {tab === "kart" && (
            <section className="mt-6">
              <Card>
                <CardSection>
                  <Title>{t.tabs.kart}</Title>
                </CardSection>
                <CardSection>
                  <div className="space-y-6">
                    <img
                      src="/kart_helgoya.png"
                      alt="Kart Helgøya og Ny-Hellesund"
                      className="w-full rounded-2xl ring-1 ring-black/5"
                    />
                    <img
                      src="/kart_2.png"
                      alt="Kart område 2"
                      className="w-full rounded-2xl ring-1 ring-black/5"
                    />
                    <img
                      src="/sjokart-Kilen.png"
                      alt="Sjøkart over Kilen"
                      className="mt-6 w-full rounded-2xl ring-1 ring-black/5"
                    />
                  </div>
                </CardSection>
              </Card>
            </section>
          )}

          {/* Kalender */}
          {tab === "kalender" && (
            <section className="mt-6" id="kalender">
              <Card>
                <CardSection>
                  <Title>{t.tabs.kalender}</Title>
                </CardSection>
                <CardSection>
                  <div className="aspect-video w-full overflow-hidden rounded-2xl ring-1 ring-black/5 mt-2">
                    <iframe
                      title="Kilevika kalender"
                      className="h-full w-full"
                      src={CAL_URL}
                      frameBorder={0}
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
            <p>© {year} {t.footer}</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}

/* ------- Galleri med responsiv lysboks ------- */
function Gallery({ lang }: { lang: Lang }) {
  const images = Array.from({ length: 20 }, (_, i) => `/gallery-${i + 1}.webp`);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const labels = lang === "no"
    ? { close: "Lukk", prev: "Forrige", next: "Neste", openImg: "Åpne bilde", help: "Bruk piltastene eller knappene for å navigere. Esc for å lukke." }
    : { close: "Close", prev: "Previous", next: "Next", openImg: "Open photo", help: "Use arrow keys or buttons to navigate. Esc to close." };

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
            aria-label={`${labels.openImg} ${i + 1}`}
          >
            <img
              src={src}
              alt="Kilevika"
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
              aria-label={labels.close}
              className="rounded-lg px-3 py-1 bg-white/10 text-white hover:bg-white/20"
            >
              {labels.close}
            </button>
            <div className="text-white text-sm">
              {index + 1} / {images.length}
            </div>
          </div>

          <div className="flex-1 relative">
            <button
              onClick={prev}
              aria-label={labels.prev}
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
              aria-label={labels.next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 p-3 text-white"
            >
              ›
            </button>
          </div>

          <div className="p-3 text-center text-xs text-white/80">
            {labels.help}
          </div>
        </div>
      )}
    </>
  );
}
