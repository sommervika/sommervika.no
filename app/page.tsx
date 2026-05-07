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
  // History
  historyIntro: string;
  historyDatesHeading: string;
  historyDates: string[];
  historyTracesHeading: string;
  historyTracesBody: string;
  historyProtectedHeading: string;
  historyProtectedBody: string;
  historyWarHeading: string;
  historyWarP1: React.ReactNode;
  historyWarP2: React.ReactNode;
  historyWarP3: string;
  historyMineMapHeading: string;
  historyMineMapBody: string;
  historyMineMapCaption: string;
  history1990Heading: string;
  history1990Body: string;
  // Area
  areaIntro: string;
  areaSailHeading: string;
  areaSailP1: string;
  areaSailP2: string;
  areaBuildingsHeading: string;
  areaBuildings: React.ReactNode[];
  areaModernHeading: string;
  areaModernP1: string;
  areaModernP2: string;
  areaModernLinkPre: string;
  areaModernLink: string;
  areaHikesHeading: string;
  areaHikesIntro: string;
  areaHikes: string[];
  areaHikesOutro: string;
  // Rules
  rulesHeading: string;
  rulesCabinHeading: string;
  rulesCabin: string[];
  rulesBoatHeading: string;
  rulesBoat: string[];
  rulesSwimHeading: string;
  rulesSwim: string[];
  rulesUtilityHeading: string;
  rulesUtility: string[];
  rulesGeneralHeading: string;
  rulesGeneral: string[];
  // Fleet
  fleetHeading: string;
  fleetIntro: string;
  fleetLabels: {
    type: string;
    registration: string;
    propulsion: string;
    motor: string;
    maxPersons: string;
    topSpeed: string;
    equipment: string;
    material: string;
    level: string;
    requirements: string;
    usage: string;
  };
  fleetBoats: {
    id: string;
    name: string;
    image: string;
    description: React.ReactNode;
    type: string;
    registration?: string;
    propulsion?: string;
    motor?: string;
    maxPersons: string;
    topSpeed: string;
    equipment?: string;
    material?: string;
    level?: string;
    requirements?: string;
    usage: string;
    warning?: React.ReactNode;
    protocol?: React.ReactNode;
  }[];
};

const T: Record<Lang, Dict> = {
  no: {
    subtitle: "Familiehytte – Helgøya / Ny-Hellesund",
    tabs: {
      kilevika: "Kilevika",
      praktisk: "Praktisk informasjon",
      historie: "Historien om Kilevika",
      omrade: "Området Ny-Hellesund",
      flaaten: "Flåten",
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
    historyIntro:
      "Helgøya 8 – Kilevika består av hytta Kilenstua og båthuset Sjøbua.",
    historyDatesHeading: "Viktige årstall",
    historyDates: [
      "1968 – Kilenstua og Sjøbua ble bygget som sommersted.",
      "1991 – Sjøbua ble skadet i en storm og gjenoppbygd.",
      "2013 – Kilenstua ble utvidet og modernisert, i samråd med fylkeskonservatoren.",
    ],
    historyTracesHeading: "Spor fra fortiden",
    historyTracesBody:
      "Bak hytta kan man se murrester etter et gammelt hus – et glimt inn i hverdagslivet på Helgøya før fritidsbebyggelsen.",
    historyProtectedHeading: "Fredet kulturmiljø",
    historyProtectedBody:
      "I 2016 ble Ny-Hellesund fredet ved kongelig resolusjon. Utvidelsen i 2012 ble gjort i dialog med fylkeskonservatoren for å tilpasses landskapet.",
    historyWarHeading: "Krigshistorie",
    historyWarP1: (
      <>
        Under andre verdenskrig gikk den tyske gangveien <em>Langfeldstieg</em> forbi eiendommen. Den ble anlagt sommeren og høsten 1942 som en transportvei mellom kaianlegget, leiren til Organisation Todt (ved dagens Helgøya&nbsp;10) og kystfortet.
      </>
    ),
    historyWarP2: (
      <>
        Området var dessuten svært farlig. Her lå fire minefelt (<em>Teilfeld&nbsp;L</em>) med til sammen 115 antipersonellminer.
      </>
    ),
    historyWarP3:
      "I dag er det fortsatt mulig å se enkelte trappetrinn og betongflater langs traseen som kan stamme fra krigstiden. Alle miner ble naturligvis ryddet bort etter krigen, og området er helt trygt å ferdes i.",
    historyMineMapHeading: "Minekart fra andre verdenskrig",
    historyMineMapBody:
      "Kartet viser tyske miner og sperringer i Ny-Hellesund-området under okkupasjonen.",
    historyMineMapCaption: "Kilde: Forsvarshistorisk forening i Kristiansandsregionen",
    history1990Heading: "Kilevika i 1990",
    history1990Body:
      "Bildet viser hytta slik den så ut rundt 1990, før utbygging og renovering av sjøbua.",
    areaIntro:
      "Ny-Hellesund er en av Sørlandets best bevarte uthavner, kjent for sin vakre natur og rike historie. Havnen består av øyene Helgøya, Kapelløya og Monsøya, bundet sammen av trange sund.",
    areaSailHeading: "Fra seilskutetid til kystkultur",
    areaSailP1:
      "Allerede på 1600-tallet var Ny-Hellesund en travel uthavn der seilskuter fra fjern og nær søkte ly for vær og vind. Den smale innseilingen gjorde stedet trygt, og havnen ble et viktig stoppested på leia mellom Østlandet og Vestlandet.",
    areaSailP2:
      "Gjennom tidene hadde Ny-Hellesund både tollstasjon, gjestgiveri og verft, og utviklet seg til et lite sentrum i skjærgården. Mange familier levde som loser, og losstasjonen her var blant de viktigste på Sørlandskysten. Fisket ga også livsgrunnlag, og det ble drevet både handel og småindustri knyttet til sjøen.",
    areaBuildingsHeading: "Historiske bygg og steder",
    areaBuildings: [
      "Olavsundet – et smalt sund mellom Kapelløya og Helgøya, oppkalt etter sagnet om at Olav den hellige seilte gjennom her på flukt fra fiender.",
      "Kjøbmandskjær og gjestgiveriet – på 1700- og 1800-tallet lå det et gjestgiveri her hvor sjøfolk fikk husly og proviant.",
      "Sjøbuer og uthus – mange av de gamle sjøbuene, brukt til lagring av fiskeredskaper og varer, står fortsatt langs sundet.",
      "Kapelløya – har navn etter et kapell som stod her på 1500-tallet. Ruinene er borte, men navnet lever videre.",
      "Kystfortet på Helgøya – anlagt av tyskerne i 1942–43 som del av Atlanterhavsvollen. Her finnes fortsatt kanonstillinger, tunneler og bygninger fra krigsårene.",
    ],
    areaModernHeading: "Moderne tid og vern",
    areaModernP1:
      "Etter seilskutetiden gikk aktiviteten gradvis ned, og mange av bygningene ble tatt i bruk som sommerhus. Den unike kombinasjonen av natur, kultur og historie førte til at hele Ny-Hellesund ble fredet som kulturmiljø ved kongelig resolusjon i 2016.",
    areaModernP2:
      "I dag regnes uthavnen som en levende kulturarv – et sted der man kan oppleve både naturens ro og sporene etter flere hundre års kysthistorie.",
    areaModernLinkPre: "Les mer om Ny-Hellesund på",
    areaModernLink: "Riksantikvaren sin hjemmeside",
    areaHikesHeading: "Turmuligheter rett fra hytta",
    areaHikesIntro:
      "Helgøya byr på mange fine stier og små eventyr rett utenfor døra. Fra Kilevika kan du velge flere ruter:",
    areaHikes: [
      "Vestover: Følg stien vestover fra hytta, og ta første sti til venstre over fjellet. Da kommer du ned til fergekaia og veien videre mot festningsanleggene.",
      "Østover: Gå via naboens plen til den såkalte \"Tyskerbrygga\". Herfra kan du følge grusveien opp til festningene eller ned til ferjeleiet.",
      "Snarveien nordover: For de som ikke er redd for litt småklatring – ta turen rett nordover fra hytta, gjennom hagen, over saugjerdet og forbi et par store steiner. Da kommer du rett ned til ferjeleia.",
      "Med båt til Kapelløya: Hvis du vil utforske mer av Ny-Hellesund, er det flott å ta båten bort til Verftet på Kapelløya. Her finner du en koselig sommerkafé og gode muligheter for å fortsette turen videre til fots.",
    ],
    areaHikesOutro:
      "Alle rutene gir et lite innblikk i Helgøyas natur og historie – og flere leder til de gamle tyske festningene fra andre verdenskrig, som er vel verdt et besøk.",
    rulesHeading: "Regler for lån av Kilevika",
    rulesCabinHeading: "Hytta og uteområdet",
    rulesCabin: [
      "Kilenstua, Sjøbua og båtene skal forlates i samme stand som da du kom – eller gjerne litt bedre.",
      "Alt søppel tas med hjem eller leveres i godkjent avfallsstasjon. Ikke la noe stå igjen.",
      "Kjøleskap og matskap tømmes for lett bedervelige varer.",
      "Gulv, bad og kjøkken vaskes/støvsuges før avreise.",
      "Vi setter pris på at dere tar med eget sengetøy og håndklær.",
      "Plenen klippes dersom det trengs. Å fjerne litt ugress er fint.",
      "Puter til utemøbler skal alltid ryddes inn om natta, i regnvær og når du drar.",
      "Gå ikke inn med sko.",
    ],
    rulesBoatHeading: "Båt og sjøliv",
    rulesBoat: [
      "Sørg for at båtene alltid er godt fortøyd – en fender eller to ekstra skader ingen.",
      "Pluggen for selvlensing skal stå åpen i Pepsi når du drar, men stenges ved bruk.",
      "Ta vare på årer, vester og annet utstyr – legg det på plass i Sjøbua etter bruk.",
      "Alle skal bruke redningsvest i båt.",
      "Kjør hensynsfullt. Det er mange båer og skjær i Ny-Hellesund, så ta en ekstra titt på kartet.",
    ],
    rulesSwimHeading: "Bad og fiske",
    rulesSwim: [
      "Ikke sitt i møbler med våte klær eller badetøy.",
      "Fiskeutstyr i Sjøbua kan lånes – legg det tilbake etter bruk.",
    ],
    rulesUtilityHeading: "Strøm, vann og sikkerhet",
    rulesUtility: [
      "Slå av alle lys, elektriske apparater og steng vannet ved avreise.",
      "Gi beskjed hvis det er lite gass igjen i grillen, slik at neste kan ta med seg.",
      "Hytta har pumpestasjon for avløp – kun toalettpapir i do.",
    ],
    rulesGeneralHeading: "Generelt",
    rulesGeneral: [
      "Vis hensyn til naboer og naturen.",
      "Røyking innendørs er ikke tillatt.",
      "Husdyr skal ikke tas med til Kilevika.",
      "Eventuelle skader eller mangler meldes fra så snart som mulig.",
      "Skriv gjerne noen linjer i hytteboka før du drar.",
    ],
    fleetHeading: "Flåten på Sommervika",
    fleetIntro:
      "Til Kilevika hører det med en del båter, fra familiens elskede Solo til flaggskipet HMS Farris. Alle har fått navn fra drikke-verdenen, til ære for Solo.",
    fleetLabels: {
      type: "Type",
      registration: "Registreringsnr.",
      propulsion: "Framdrift",
      motor: "Motor",
      maxPersons: "Maks personer",
      topSpeed: "Toppfart",
      equipment: "Utstyr",
      material: "Materiale",
      level: "Nivå",
      requirements: "Krav",
      usage: "Bruk",
    },
    fleetBoats: [
      {
        id: "solo",
        name: "Solo",
        image: "/solo.jpg",
        description: (
          <>
            Den gule jolla er familieklenodiet – en liten <strong>Pioner 8</strong> uten motor som har vært i familien i over 30 år. Opprinnelig fast robåt på <em>Ellingsvika</em>, Rolf og &quot;Molle&quot; Hogners familiehytte i Kragerø, hvor Eirik og de andre barna rodde rundt i skjærgården. Solo er tøff nok til å dras opp på svaberg og skjær, og passer perfekt til korte turer, bading og nostalgiske stunder.
            <br /><br />
            Hun har også en heltehistorie bak seg: under den store tordenstormen i august 2010 tjente Solo som evakueringsflåte for Eirik og Peter midt i Skagerrak.
          </>
        ),
        type: "Pioner 8 (jolle)",
        propulsion: "Årer",
        maxPersons: "2 (3 små)",
        topSpeed: "ca. 3 knop (med motiverte årer og medstrøm)",
        usage: "Robåt, lek, tåler å dras på land",
      },
      {
        id: "pepsi",
        name: "M/B Pepsi",
        image: "/pepsi.jpg",
        description: (
          <>
            Den svarte <strong>Pioner 13 </strong> er fiskebåten vår. Med 8 hk påhengsmotor kommer du deg raskt dit fisken står, men den er også fin å ro hvis du foretrekker stillheten. Et bærbart ekkolodd hører med, så du finner både dyp og fiskestim uten problemer. På godværsdager er hun også et fint alternativ for en rolig tur inn til Langenes for å handle.
          </>
        ),
        type: "Pioner 13",
        motor: "Mercruiser 8 hk (bensin 95 oktan)",
        maxPersons: "4",
        topSpeed: "ca. 10 knop (med én liten passasjer og god medvind)",
        equipment: "Bærbart ekkolodd, årer",
        usage: "Fiske, korte turer, handleturer til Langenes i fint vær",
      },
      {
        id: "farris",
        name: "HMS Farris",
        image: "/farris.jpg",
        description: (
          <>
            Flaggskipet i flåten – en <strong>Yamarin 63 DC</strong> med 150 hk Yamaha utenbordsmotor. Dette er båten for dagsturer i skjærgården, bading i yndlingsvikene og hygge om bord med venner og familie.
          </>
        ),
        protocol: (
          <>
            <strong>⚓ Protokoll om bord:</strong> Når <em>Norges Dronning</em> eller <em>Dronningen av Kilevika</em> går om bord, stiller mannskapet i rett. Flagget heises når HMS Farris er i fart! 🇳🇴
          </>
        ),
        type: "Yamarin 63 DC (daycruiser)",
        registration: "ADC 380",
        motor: "Yamaha F150 (bensin 95 oktan)",
        maxPersons: "6–8",
        topSpeed: "43 knop",
        requirements: "Gyldig båtførerbevis for alle født etter 1. januar 1980",
        usage: "Dagsturer, bading, hygge om bord",
      },
      {
        id: "urge",
        name: "K1 Urge",
        image: "/urge.jpg",
        description: (
          <>
            Den blå <strong>Riot Edge</strong> er nybegynnerkajakken vår. Stabil, tilgivende og laget i solid plast – den tåler lek, moro og en god dose hard behandling. Perfekt for de som skal lære seg å padle, eller bare vil ha det gøy i bukta. (Men prøv å unngå de hardeste kollisjonene – den er tøff, men ikke uovervinnelig.)
          </>
        ),
        type: "Riot Edge (ener-kajakk, plast)",
        maxPersons: "1",
        topSpeed: "ca. 5 knop (avhengig av padler)",
        level: "Nybegynner",
        usage: "Lek, læring, tåler en trøkk",
      },
      {
        id: "imsdal",
        name: "K1 Imsdal",
        image: "/imsdal.jpg",
        description: (
          <>
            Den hvite <strong>Wig Rapid Kevlar 522</strong> er fartskajakken i flåten. Lett og rask takket være kevlar-konstruksjonen, men også mer krevende å håndtere.
          </>
        ),
        warning: (
          <>
            <strong>⚠️ Viktig:</strong> Vær særlig forsiktig ved inn- og utstigning fra land. Kajakken skal <strong>aldri</strong> dras opp på strand eller svaberg – det ødelegger fartsegenskapene og skroget. Løft den alltid inn og ut av vannet.
          </>
        ),
        type: "Wig Rapid Kevlar 522 (ener-kajakk)",
        material: "Kevlar (lett og skjørt)",
        maxPersons: "1",
        topSpeed: "ca. 8 knop (for en trent padler)",
        level: "Øvet padler",
        usage: "Fartsorientert padling, trening",
      },
    ],
  },
  en: {
    subtitle: "Family cabin – Helgøya / Ny-Hellesund",
    tabs: {
      kilevika: "Kilevika",
      praktisk: "Practical info",
      historie: "History of Kilevika",
      omrade: "The Ny-Hellesund area",
      flaaten: "The fleet",
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
    historyIntro:
      "Helgøya 8 – Kilevika comprises the cabin Kilenstua and the boathouse Sjøbua.",
    historyDatesHeading: "Key dates",
    historyDates: [
      "1968 – Kilenstua and Sjøbua were built as a summer place.",
      "1991 – Sjøbua was damaged in a storm and rebuilt.",
      "2013 – Kilenstua was extended and modernised, in consultation with the county heritage authority.",
    ],
    historyTracesHeading: "Traces of the past",
    historyTracesBody:
      "Behind the cabin you can still see the stone foundations of an old house – a glimpse of everyday life on Helgøya before the holiday-home era.",
    historyProtectedHeading: "Protected cultural environment",
    historyProtectedBody:
      "In 2016 Ny-Hellesund was protected by royal decree. The 2012 extension was done in dialogue with the county heritage authority so it would fit the landscape.",
    historyWarHeading: "Wartime history",
    historyWarP1: (
      <>
        During World War II the German footpath <em>Langfeldstieg</em> ran past the property. It was built in the summer and autumn of 1942 as a transport route between the pier, the Organisation Todt camp (at what is today Helgøya&nbsp;10) and the coastal fort.
      </>
    ),
    historyWarP2: (
      <>
        The area was also very dangerous. Four minefields (<em>Teilfeld&nbsp;L</em>) lay here, with a total of 115 anti-personnel mines.
      </>
    ),
    historyWarP3:
      "Today you can still see individual steps and concrete surfaces along the route that likely date from the war. All mines were of course cleared after the war, and the area is completely safe to walk in.",
    historyMineMapHeading: "Minefield map from World War II",
    historyMineMapBody:
      "The map shows German mines and barriers in the Ny-Hellesund area during the occupation.",
    historyMineMapCaption:
      "Source: Forsvarshistorisk forening i Kristiansandsregionen (Defence History Association of the Kristiansand region)",
    history1990Heading: "Kilevika in 1990",
    history1990Body:
      "The photo shows the cabin as it looked around 1990, before the extension and the renovation of the boathouse.",
    areaIntro:
      "Ny-Hellesund is one of the best-preserved outports on the Sørlandet coast, known for its beautiful nature and rich history. The harbour consists of the islands Helgøya, Kapelløya and Monsøya, connected by narrow sounds.",
    areaSailHeading: "From the age of sail to coastal culture",
    areaSailP1:
      "As early as the 17th century, Ny-Hellesund was a busy outport where sailing ships from near and far sought shelter from wind and weather. The narrow entrance made it safe, and the harbour became an important stop along the coastal route between eastern and western Norway.",
    areaSailP2:
      "Over the centuries Ny-Hellesund had a customs station, an inn and a shipyard, and grew into a small centre in the archipelago. Many families made their living as pilots, and the pilot station here was among the most important on the Sørlandet coast. Fishing also provided a livelihood, and both trade and small-scale sea-related industry took place.",
    areaBuildingsHeading: "Historic buildings and sites",
    areaBuildings: [
      "Olavsundet – a narrow sound between Kapelløya and Helgøya, named after the legend that Olav the Holy sailed through here while fleeing his enemies.",
      "Kjøbmandskjær and the inn – in the 18th and 19th centuries there was an inn here where sailors found lodging and provisions.",
      "Boathouses and outbuildings – many of the old boathouses, used for storing fishing gear and goods, still stand along the sound.",
      "Kapelløya – named after a chapel that stood here in the 16th century. The ruins are gone, but the name lives on.",
      "The coastal fort on Helgøya – built by the Germans in 1942–43 as part of the Atlantic Wall. Gun emplacements, tunnels and wartime buildings can still be seen.",
    ],
    areaModernHeading: "Modern times and protection",
    areaModernP1:
      "After the age of sail, activity gradually declined and many of the buildings were taken into use as summer homes. The unique combination of nature, culture and history led to all of Ny-Hellesund being protected as a cultural environment by royal decree in 2016.",
    areaModernP2:
      "Today the outport is considered living cultural heritage – a place where you can experience both the calm of nature and traces of several hundred years of coastal history.",
    areaModernLinkPre: "Read more about Ny-Hellesund on",
    areaModernLink: "the Directorate for Cultural Heritage's website",
    areaHikesHeading: "Walks right from the cabin",
    areaHikesIntro:
      "Helgøya offers plenty of lovely paths and small adventures just outside the door. From Kilevika you can choose several routes:",
    areaHikes: [
      "Westward: Follow the path west from the cabin and take the first path on the left over the hill. It brings you down to the ferry quay and the track on toward the fortifications.",
      "Eastward: Walk via the neighbour's lawn to the so-called \"German dock\" (Tyskerbrygga). From there you can follow the gravel road up to the forts or down to the ferry landing.",
      "The shortcut north: For those not afraid of a little scrambling – head straight north from the cabin, through the garden, over the sheep fence and past a couple of large rocks. That brings you straight down to the ferry landing.",
      "By boat to Kapelløya: If you want to explore more of Ny-Hellesund, it's a treat to take the boat over to Verftet on Kapelløya. Here you'll find a cosy summer café and good options for continuing on foot.",
    ],
    areaHikesOutro:
      "All the routes give a little insight into Helgøya's nature and history – and several lead to the old German WWII fortifications, which are well worth a visit.",
    rulesHeading: "House rules for Kilevika",
    rulesCabinHeading: "The cabin and outdoor area",
    rulesCabin: [
      "Leave Kilenstua, Sjøbua and the boats in the same condition as you found them – or a little better.",
      "Take all rubbish home with you or drop it at an approved waste station. Don't leave anything behind.",
      "Empty the fridge and food cupboards of anything perishable.",
      "Floors, bathroom and kitchen should be washed/vacuumed before you leave.",
      "We appreciate it if you bring your own bed linen and towels.",
      "Mow the lawn if it needs it. Pulling a bit of weed is welcome.",
      "Outdoor cushions should always be brought in at night, in rain and when you leave.",
      "Don't walk indoors with shoes on.",
    ],
    rulesBoatHeading: "Boat and sea",
    rulesBoat: [
      "Make sure the boats are always properly moored – an extra fender or two never hurts.",
      "The self-bailing plug in Pepsi should be open when you leave, and closed when in use.",
      "Look after oars, life jackets and other gear – put it back in Sjøbua after use.",
      "Everyone must wear a life jacket in the boat.",
      "Drive considerately. There are many shallows and rocks in Ny-Hellesund, so take an extra look at the chart.",
    ],
    rulesSwimHeading: "Swimming and fishing",
    rulesSwim: [
      "Don't sit on the furniture in wet clothes or swimwear.",
      "Fishing gear in Sjøbua can be borrowed – put it back after use.",
    ],
    rulesUtilityHeading: "Electricity, water and safety",
    rulesUtility: [
      "Turn off all lights and electrical appliances and shut off the water when you leave.",
      "Let us know if the grill is low on gas so the next guest can bring some.",
      "The cabin has a pump station for sewage – only toilet paper in the toilet.",
    ],
    rulesGeneralHeading: "General",
    rulesGeneral: [
      "Be considerate of the neighbours and nature.",
      "Smoking indoors is not permitted.",
      "Pets should not be brought to Kilevika.",
      "Report any damage or defects as soon as possible.",
      "Please write a few lines in the cabin guestbook before you leave.",
    ],
    fleetHeading: "The Sommervika fleet",
    fleetIntro:
      "Kilevika comes with a number of boats, from the family's beloved Solo to the flagship HMS Farris. All are named after drinks, in honour of Solo.",
    fleetLabels: {
      type: "Type",
      registration: "Registration no.",
      propulsion: "Propulsion",
      motor: "Engine",
      maxPersons: "Max persons",
      topSpeed: "Top speed",
      equipment: "Equipment",
      material: "Material",
      level: "Level",
      requirements: "Requirements",
      usage: "Use",
    },
    fleetBoats: [
      {
        id: "solo",
        name: "Solo",
        image: "/solo.jpg",
        description: (
          <>
            The yellow dinghy is the family heirloom – a small <strong>Pioner 8</strong> without an engine that has been in the family for more than 30 years. Originally the permanent rowing boat at <em>Ellingsvika</em>, Rolf and &quot;Molle&quot; Hogner&apos;s family cabin in Kragerø, where Eirik and the other children rowed around the archipelago. Solo is tough enough to be dragged up onto rocks and skerries, and is perfect for short trips, swimming and nostalgic moments.
            <br /><br />
            She also has a tale of heroism behind her: during the great thunderstorm in August 2010 Solo served as an evacuation raft for Eirik and Peter in the middle of the Skagerrak.
          </>
        ),
        type: "Pioner 8 (dinghy)",
        propulsion: "Oars",
        maxPersons: "2 (3 small children)",
        topSpeed: "approx. 3 knots (with motivated rowers and a favourable current)",
        usage: "Rowing, play, tolerates being dragged ashore",
      },
      {
        id: "pepsi",
        name: "M/B Pepsi",
        image: "/pepsi.jpg",
        description: (
          <>
            The black <strong>Pioner 13</strong> is our fishing boat. With an 8 hp outboard you get to the fish quickly, but she also rows nicely if you prefer the quiet. A portable fishfinder is part of the kit, so finding depth and schools of fish is no problem. On fine-weather days she&apos;s also a pleasant option for a slow trip into Langenes for grocery shopping.
          </>
        ),
        type: "Pioner 13",
        motor: "Mercruiser 8 hp (95 octane petrol)",
        maxPersons: "4",
        topSpeed: "approx. 10 knots (with one small passenger and a good tailwind)",
        equipment: "Portable fishfinder, oars",
        usage: "Fishing, short trips, shopping runs to Langenes in fine weather",
      },
      {
        id: "farris",
        name: "HMS Farris",
        image: "/farris.jpg",
        description: (
          <>
            The flagship of the fleet – a <strong>Yamarin 63 DC</strong> with a 150 hp Yamaha outboard. This is the boat for day trips in the archipelago, swimming in favourite coves and good times on board with friends and family.
          </>
        ),
        protocol: (
          <>
            <strong>⚓ Protocol on board:</strong> When <em>the Queen of Norway</em> or <em>the Queen of Kilevika</em> comes on board, the crew stands at attention. The flag is hoisted whenever HMS Farris is under way! 🇳🇴
          </>
        ),
        type: "Yamarin 63 DC (day cruiser)",
        registration: "ADC 380",
        motor: "Yamaha F150 (95 octane petrol)",
        maxPersons: "6–8",
        topSpeed: "43 knots",
        requirements: "Valid boating licence required for anyone born after 1 January 1980",
        usage: "Day trips, swimming, socialising on board",
      },
      {
        id: "urge",
        name: "K1 Urge",
        image: "/urge.jpg",
        description: (
          <>
            The blue <strong>Riot Edge</strong> is our beginner kayak. Stable, forgiving and built from solid plastic – it handles play, fun and a good dose of rough treatment. Perfect for those learning to paddle, or just wanting to have fun in the bay. (That said, try to avoid the hardest collisions – it&apos;s tough, but not invincible.)
          </>
        ),
        type: "Riot Edge (single kayak, plastic)",
        maxPersons: "1",
        topSpeed: "approx. 5 knots (depending on the paddler)",
        level: "Beginner",
        usage: "Play, learning, takes a knock",
      },
      {
        id: "imsdal",
        name: "K1 Imsdal",
        image: "/imsdal.jpg",
        description: (
          <>
            The white <strong>Wig Rapid Kevlar 522</strong> is the speed kayak in the fleet. Light and fast thanks to its kevlar construction, but also more demanding to handle.
          </>
        ),
        warning: (
          <>
            <strong>⚠️ Important:</strong> Be especially careful getting in and out from shore. The kayak must <strong>never</strong> be dragged up onto a beach or rock – it ruins the speed characteristics and the hull. Always lift it in and out of the water.
          </>
        ),
        type: "Wig Rapid Kevlar 522 (single kayak)",
        material: "Kevlar (light and fragile)",
        maxPersons: "1",
        topSpeed: "approx. 8 knots (for a trained paddler)",
        level: "Experienced paddler",
        usage: "Speed paddling, training",
      },
    ],
  },
};

const TAB_IDS = [
  "kilevika",
  "praktisk",
  "historie",
  "omrade",
  "flaaten",
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

          {/* History */}
          {tab === "historie" && (
            <section className="mt-6">
              <Card>
                <CardSection>
                  <Title>{t.tabs.historie}</Title>
                </CardSection>
                <CardSection>
                  <div className="space-y-6 leading-relaxed">
                    <p>{t.historyIntro}</p>

                    <div>
                      <h3 className="font-semibold mb-2">{t.historyDatesHeading}</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        {t.historyDates.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">{t.historyTracesHeading}</h3>
                      <p>{t.historyTracesBody}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">{t.historyProtectedHeading}</h3>
                      <p>{t.historyProtectedBody}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">{t.historyWarHeading}</h3>
                      <p>{t.historyWarP1}</p>
                      <p>{t.historyWarP2}</p>
                      <p>{t.historyWarP3}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">{t.historyMineMapHeading}</h3>
                      <p className="mb-4">{t.historyMineMapBody}</p>

                      <img
                        src="/ww2.jpg"
                        alt={t.historyMineMapHeading}
                        className="w-full rounded-2xl ring-1 ring-black/5"
                        loading="lazy"
                      />
                      <p className="mt-2 text-sm text-slate-500">{t.historyMineMapCaption}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">{t.history1990Heading}</h3>
                      <p className="mb-4">{t.history1990Body}</p>

                      <img
                        src="/Kilevika1990.png"
                        alt={t.history1990Heading}
                        className="w-full rounded-2xl ring-1 ring-black/5"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </CardSection>
              </Card>
            </section>
          )}

          {/* Area */}
          {tab === "omrade" && (
            <section className="mt-6">
              <Card>
                <CardSection>
                  <Title>{t.tabs.omrade}</Title>
                </CardSection>
                <CardSection>
                  <div className="space-y-6 leading-relaxed">
                    <p>{t.areaIntro}</p>
                    <div>
                      <h3 className="font-semibold mb-2">{t.areaSailHeading}</h3>
                      <p>{t.areaSailP1}</p>
                      <p>{t.areaSailP2}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{t.areaBuildingsHeading}</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        {t.areaBuildings.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{t.areaModernHeading}</h3>
                      <p>{t.areaModernP1}</p>
                      <p>{t.areaModernP2}</p>
                      <p className="mt-2">
                        {t.areaModernLinkPre}{" "}
                        <a
                          href="https://riksantikvaren.no/kulturhistorie/ny-hellesund-med-armene-mot-verden/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-600 underline"
                        >
                          {t.areaModernLink}
                        </a>
                        .
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{t.areaHikesHeading}</h3>
                      <p>{t.areaHikesIntro}</p>
                      <ul className="list-disc pl-6 space-y-1">
                        {t.areaHikes.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                      <p>{t.areaHikesOutro}</p>
                      <img
                        src="/helgoya-stikart2.png"
                        alt={t.areaHikesHeading}
                        className="mt-4 w-full rounded-2xl ring-1 ring-black/5"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </CardSection>
              </Card>
            </section>
          )}

          {/* Fleet */}
          {tab === "flaaten" && (
            <section className="mt-6">
              <Card>
                <CardSection>
                  <Title>{t.fleetHeading}</Title>
                </CardSection>
                <CardSection>
                  <div className="space-y-8 leading-relaxed">
                    <p>{t.fleetIntro}</p>
                    {t.fleetBoats.map((boat) => (
                      <div
                        key={boat.id}
                        className="pt-6 border-t border-slate-200 first:border-t-0 first:pt-0"
                      >
                        <h3 className="text-lg font-semibold mb-3">{boat.name}</h3>
                        <img
                          src={boat.image}
                          alt={boat.name}
                          className="w-full rounded-2xl ring-1 ring-black/5 mb-4"
                          loading="lazy"
                        />
                        <p className="mb-3">{boat.description}</p>
                        {boat.protocol && (
                          <div className="my-4 rounded-2xl bg-sky-50 p-4 ring-1 ring-sky-100">
                            <p>{boat.protocol}</p>
                          </div>
                        )}
                        {boat.warning && (
                          <div className="my-4 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
                            <p>{boat.warning}</p>
                          </div>
                        )}
                        <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                          <div className="flex gap-2">
                            <dt className="font-medium text-slate-600 min-w-[7.5rem]">
                              {t.fleetLabels.type}:
                            </dt>
                            <dd>{boat.type}</dd>
                          </div>
                          {boat.registration && (
                            <div className="flex gap-2">
                              <dt className="font-medium text-slate-600 min-w-[7.5rem]">
                                {t.fleetLabels.registration}:
                              </dt>
                              <dd>{boat.registration}</dd>
                            </div>
                          )}
                          {boat.propulsion && (
                            <div className="flex gap-2">
                              <dt className="font-medium text-slate-600 min-w-[7.5rem]">
                                {t.fleetLabels.propulsion}:
                              </dt>
                              <dd>{boat.propulsion}</dd>
                            </div>
                          )}
                          {boat.motor && (
                            <div className="flex gap-2">
                              <dt className="font-medium text-slate-600 min-w-[7.5rem]">
                                {t.fleetLabels.motor}:
                              </dt>
                              <dd>{boat.motor}</dd>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <dt className="font-medium text-slate-600 min-w-[7.5rem]">
                              {t.fleetLabels.maxPersons}:
                            </dt>
                            <dd>{boat.maxPersons}</dd>
                          </div>
                          <div className="flex gap-2">
                            <dt className="font-medium text-slate-600 min-w-[7.5rem]">
                              {t.fleetLabels.topSpeed}:
                            </dt>
                            <dd>{boat.topSpeed}</dd>
                          </div>
                          {boat.equipment && (
                            <div className="flex gap-2">
                              <dt className="font-medium text-slate-600 min-w-[7.5rem]">
                                {t.fleetLabels.equipment}:
                              </dt>
                              <dd>{boat.equipment}</dd>
                            </div>
                          )}
                          {boat.material && (
                            <div className="flex gap-2">
                              <dt className="font-medium text-slate-600 min-w-[7.5rem]">
                                {t.fleetLabels.material}:
                              </dt>
                              <dd>{boat.material}</dd>
                            </div>
                          )}
                          {boat.level && (
                            <div className="flex gap-2">
                              <dt className="font-medium text-slate-600 min-w-[7.5rem]">
                                {t.fleetLabels.level}:
                              </dt>
                              <dd>{boat.level}</dd>
                            </div>
                          )}
                          {boat.requirements && (
                            <div className="flex gap-2 sm:col-span-2">
                              <dt className="font-medium text-slate-600 min-w-[7.5rem]">
                                {t.fleetLabels.requirements}:
                              </dt>
                              <dd>{boat.requirements}</dd>
                            </div>
                          )}
                          <div className="flex gap-2 sm:col-span-2">
                            <dt className="font-medium text-slate-600 min-w-[7.5rem]">
                              {t.fleetLabels.usage}:
                            </dt>
                            <dd>{boat.usage}</dd>
                          </div>
                        </dl>
                      </div>
                    ))}
                  </div>
                </CardSection>
              </Card>
            </section>
          )}

          {/* Rules */}
          {tab === "regler" && (
            <section className="mt-6">
              <Card>
                <CardSection>
                  <Title>{t.rulesHeading}</Title>
                </CardSection>
                <CardSection>
                  <div className="space-y-6 leading-relaxed">
                    <div>
                      <h3 className="font-semibold mb-2">{t.rulesCabinHeading}</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        {t.rulesCabin.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">{t.rulesBoatHeading}</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        {t.rulesBoat.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">{t.rulesSwimHeading}</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        {t.rulesSwim.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">{t.rulesUtilityHeading}</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        {t.rulesUtility.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">{t.rulesGeneralHeading}</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        {t.rulesGeneral.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
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
