// ----------------------------------------------------------------------------
// Flyplasser og flytyper for CO2-kalkulatoren
// ----------------------------------------------------------------------------

export interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
}

export const AIRPORTS: Airport[] = [
  // Norge
  { iata: "OSL", name: "Oslo Gardermoen", city: "Oslo", country: "NO", lat: 60.1939, lon: 11.1004 },
  { iata: "TRF", name: "Sandefjord Torp", city: "Sandefjord", country: "NO", lat: 59.1867, lon: 10.2586 },
  { iata: "RYG", name: "Moss Rygge", city: "Moss", country: "NO", lat: 59.379, lon: 10.785 },
  { iata: "BGO", name: "Bergen Flesland", city: "Bergen", country: "NO", lat: 60.2934, lon: 5.2181 },
  { iata: "SVG", name: "Stavanger Sola", city: "Stavanger", country: "NO", lat: 58.8767, lon: 5.6378 },
  { iata: "TRD", name: "Trondheim Værnes", city: "Trondheim", country: "NO", lat: 63.4578, lon: 10.924 },
  { iata: "KRS", name: "Kristiansand Kjevik", city: "Kristiansand", country: "NO", lat: 58.2042, lon: 8.0853 },
  { iata: "BOO", name: "Bodø", city: "Bodø", country: "NO", lat: 67.2692, lon: 14.3653 },
  { iata: "TOS", name: "Tromsø", city: "Tromsø", country: "NO", lat: 69.6833, lon: 18.9189 },
  { iata: "AES", name: "Ålesund Vigra", city: "Ålesund", country: "NO", lat: 62.5625, lon: 6.1197 },
  { iata: "MOL", name: "Molde Årø", city: "Molde", country: "NO", lat: 62.7447, lon: 7.2625 },
  { iata: "KSU", name: "Kristiansund Kvernberget", city: "Kristiansund", country: "NO", lat: 63.1118, lon: 7.8245 },
  { iata: "HAU", name: "Haugesund Karmøy", city: "Haugesund", country: "NO", lat: 59.3453, lon: 5.2083 },
  { iata: "EVE", name: "Harstad/Narvik Evenes", city: "Harstad", country: "NO", lat: 68.4914, lon: 16.6781 },
  { iata: "ALF", name: "Alta", city: "Alta", country: "NO", lat: 69.9761, lon: 23.3717 },
  { iata: "KKN", name: "Kirkenes Høybuktmoen", city: "Kirkenes", country: "NO", lat: 69.7258, lon: 29.8913 },
  { iata: "LKN", name: "Leknes", city: "Leknes", country: "NO", lat: 68.1525, lon: 13.6094 },
  { iata: "SVJ", name: "Svolvær Helle", city: "Svolvær", country: "NO", lat: 68.2433, lon: 14.6692 },
  { iata: "LYR", name: "Svalbard Longyearbyen", city: "Longyearbyen", country: "NO", lat: 78.2461, lon: 15.4656 },
  // Sverige / Danmark / Finland / Island
  { iata: "ARN", name: "Stockholm Arlanda", city: "Stockholm", country: "SE", lat: 59.6519, lon: 17.9186 },
  { iata: "BMA", name: "Stockholm Bromma", city: "Stockholm", country: "SE", lat: 59.3544, lon: 17.9417 },
  { iata: "GOT", name: "Göteborg Landvetter", city: "Göteborg", country: "SE", lat: 57.6628, lon: 12.2798 },
  { iata: "MMX", name: "Malmö Sturup", city: "Malmö", country: "SE", lat: 55.5363, lon: 13.3762 },
  { iata: "CPH", name: "København Kastrup", city: "København", country: "DK", lat: 55.6179, lon: 12.656 },
  { iata: "AAL", name: "Aalborg", city: "Aalborg", country: "DK", lat: 57.0928, lon: 9.8492 },
  { iata: "BLL", name: "Billund", city: "Billund", country: "DK", lat: 55.7403, lon: 9.1518 },
  { iata: "HEL", name: "Helsinki Vantaa", city: "Helsinki", country: "FI", lat: 60.3172, lon: 24.9633 },
  { iata: "KEF", name: "Reykjavík Keflavík", city: "Reykjavík", country: "IS", lat: 63.985, lon: -22.6056 },
  // Europa
  { iata: "LHR", name: "London Heathrow", city: "London", country: "GB", lat: 51.47, lon: -0.4543 },
  { iata: "LGW", name: "London Gatwick", city: "London", country: "GB", lat: 51.1537, lon: -0.1821 },
  { iata: "STN", name: "London Stansted", city: "London", country: "GB", lat: 51.885, lon: 0.235 },
  { iata: "LCY", name: "London City", city: "London", country: "GB", lat: 51.5053, lon: 0.0553 },
  { iata: "MAN", name: "Manchester", city: "Manchester", country: "GB", lat: 53.3537, lon: -2.275 },
  { iata: "EDI", name: "Edinburgh", city: "Edinburgh", country: "GB", lat: 55.95, lon: -3.3725 },
  { iata: "CDG", name: "Paris Charles de Gaulle", city: "Paris", country: "FR", lat: 49.0097, lon: 2.5479 },
  { iata: "ORY", name: "Paris Orly", city: "Paris", country: "FR", lat: 48.7233, lon: 2.3794 },
  { iata: "NCE", name: "Nice Côte d'Azur", city: "Nice", country: "FR", lat: 43.6584, lon: 7.2158 },
  { iata: "AMS", name: "Amsterdam Schiphol", city: "Amsterdam", country: "NL", lat: 52.3086, lon: 4.7639 },
  { iata: "BRU", name: "Brussel Zaventem", city: "Brussel", country: "BE", lat: 50.9014, lon: 4.4844 },
  { iata: "FRA", name: "Frankfurt", city: "Frankfurt", country: "DE", lat: 50.0379, lon: 8.5622 },
  { iata: "MUC", name: "München", city: "München", country: "DE", lat: 48.3538, lon: 11.7861 },
  { iata: "BER", name: "Berlin Brandenburg", city: "Berlin", country: "DE", lat: 52.3667, lon: 13.5033 },
  { iata: "HAM", name: "Hamburg", city: "Hamburg", country: "DE", lat: 53.6304, lon: 9.9882 },
  { iata: "DUS", name: "Düsseldorf", city: "Düsseldorf", country: "DE", lat: 51.2895, lon: 6.7668 },
  { iata: "ZRH", name: "Zürich", city: "Zürich", country: "CH", lat: 47.4647, lon: 8.5492 },
  { iata: "GVA", name: "Genève", city: "Genève", country: "CH", lat: 46.2381, lon: 6.1089 },
  { iata: "VIE", name: "Wien", city: "Wien", country: "AT", lat: 48.1103, lon: 16.5697 },
  { iata: "WAW", name: "Warszawa Chopin", city: "Warszawa", country: "PL", lat: 52.1657, lon: 20.9671 },
  { iata: "KRK", name: "Kraków", city: "Kraków", country: "PL", lat: 50.0777, lon: 19.7848 },
  { iata: "GDN", name: "Gdańsk", city: "Gdańsk", country: "PL", lat: 54.3776, lon: 18.4662 },
  { iata: "PRG", name: "Praha Václav Havel", city: "Praha", country: "CZ", lat: 50.1008, lon: 14.26 },
  { iata: "BUD", name: "Budapest", city: "Budapest", country: "HU", lat: 47.4369, lon: 19.2556 },
  { iata: "MAD", name: "Madrid Barajas", city: "Madrid", country: "ES", lat: 40.4983, lon: -3.5676 },
  { iata: "BCN", name: "Barcelona El Prat", city: "Barcelona", country: "ES", lat: 41.2974, lon: 2.0833 },
  { iata: "AGP", name: "Málaga", city: "Málaga", country: "ES", lat: 36.6749, lon: -4.4991 },
  { iata: "PMI", name: "Palma de Mallorca", city: "Palma", country: "ES", lat: 39.5517, lon: 2.7388 },
  { iata: "ALC", name: "Alicante", city: "Alicante", country: "ES", lat: 38.2822, lon: -0.5582 },
  { iata: "IBZ", name: "Ibiza", city: "Ibiza", country: "ES", lat: 38.8729, lon: 1.3731 },
  { iata: "TFS", name: "Tenerife South", city: "Tenerife", country: "ES", lat: 28.0445, lon: -16.5725 },
  { iata: "LPA", name: "Gran Canaria", city: "Las Palmas", country: "ES", lat: 27.9319, lon: -15.3866 },
  { iata: "FCO", name: "Roma Fiumicino", city: "Roma", country: "IT", lat: 41.8003, lon: 12.2389 },
  { iata: "MXP", name: "Milano Malpensa", city: "Milano", country: "IT", lat: 45.63, lon: 8.7231 },
  { iata: "VCE", name: "Venezia Marco Polo", city: "Venezia", country: "IT", lat: 45.505, lon: 12.3519 },
  { iata: "NAP", name: "Napoli", city: "Napoli", country: "IT", lat: 40.886, lon: 14.2908 },
  { iata: "ATH", name: "Athen Eleftherios Venizelos", city: "Athen", country: "GR", lat: 37.9364, lon: 23.9475 },
  { iata: "CHQ", name: "Chania Ioannis Daskalogiannis", city: "Chania", country: "GR", lat: 35.5317, lon: 24.1497 },
  { iata: "HER", name: "Heraklion", city: "Heraklion", country: "GR", lat: 35.3397, lon: 25.1803 },
  { iata: "LIS", name: "Lissabon", city: "Lissabon", country: "PT", lat: 38.7813, lon: -9.1359 },
  { iata: "IST", name: "Istanbul", city: "Istanbul", country: "TR", lat: 41.2753, lon: 28.7519 },
  { iata: "DUB", name: "Dublin", city: "Dublin", country: "IE", lat: 53.4213, lon: -6.2701 },
  { iata: "RIX", name: "Riga", city: "Riga", country: "LV", lat: 56.9236, lon: 23.9711 },
  { iata: "TLL", name: "Tallinn", city: "Tallinn", country: "EE", lat: 59.4133, lon: 24.8328 },
  { iata: "VNO", name: "Vilnius", city: "Vilnius", country: "LT", lat: 54.6341, lon: 25.2858 },
  // Nord-Amerika
  { iata: "JFK", name: "New York JFK", city: "New York", country: "US", lat: 40.6413, lon: -73.7781 },
  { iata: "EWR", name: "Newark", city: "New York", country: "US", lat: 40.6895, lon: -74.1745 },
  { iata: "LGA", name: "New York LaGuardia", city: "New York", country: "US", lat: 40.7769, lon: -73.874 },
  { iata: "BOS", name: "Boston Logan", city: "Boston", country: "US", lat: 42.3656, lon: -71.0096 },
  { iata: "IAD", name: "Washington Dulles", city: "Washington DC", country: "US", lat: 38.9445, lon: -77.4558 },
  { iata: "DCA", name: "Washington Reagan", city: "Washington DC", country: "US", lat: 38.8512, lon: -77.0402 },
  { iata: "ORD", name: "Chicago O'Hare", city: "Chicago", country: "US", lat: 41.9742, lon: -87.9073 },
  { iata: "ATL", name: "Atlanta", city: "Atlanta", country: "US", lat: 33.6407, lon: -84.4277 },
  { iata: "MIA", name: "Miami", city: "Miami", country: "US", lat: 25.7959, lon: -80.287 },
  { iata: "MCO", name: "Orlando", city: "Orlando", country: "US", lat: 28.4312, lon: -81.308 },
  { iata: "DFW", name: "Dallas/Fort Worth", city: "Dallas", country: "US", lat: 32.8998, lon: -97.0403 },
  { iata: "IAH", name: "Houston Intercontinental", city: "Houston", country: "US", lat: 29.9902, lon: -95.3368 },
  { iata: "DEN", name: "Denver", city: "Denver", country: "US", lat: 39.8561, lon: -104.6737 },
  { iata: "LAX", name: "Los Angeles", city: "Los Angeles", country: "US", lat: 33.9416, lon: -118.4085 },
  { iata: "SFO", name: "San Francisco", city: "San Francisco", country: "US", lat: 37.6213, lon: -122.379 },
  { iata: "SEA", name: "Seattle", city: "Seattle", country: "US", lat: 47.4502, lon: -122.3088 },
  { iata: "LAS", name: "Las Vegas", city: "Las Vegas", country: "US", lat: 36.084, lon: -115.1537 },
  { iata: "YYZ", name: "Toronto Pearson", city: "Toronto", country: "CA", lat: 43.6777, lon: -79.6248 },
  { iata: "YVR", name: "Vancouver", city: "Vancouver", country: "CA", lat: 49.1967, lon: -123.1815 },
  { iata: "YUL", name: "Montréal", city: "Montréal", country: "CA", lat: 45.4706, lon: -73.7408 },
  // Midt-Østen / Asia
  { iata: "DXB", name: "Dubai", city: "Dubai", country: "AE", lat: 25.2532, lon: 55.3657 },
  { iata: "AUH", name: "Abu Dhabi", city: "Abu Dhabi", country: "AE", lat: 24.433, lon: 54.6511 },
  { iata: "DOH", name: "Doha Hamad", city: "Doha", country: "QA", lat: 25.2736, lon: 51.6081 },
  { iata: "TLV", name: "Tel Aviv Ben Gurion", city: "Tel Aviv", country: "IL", lat: 32.0114, lon: 34.8867 },
  { iata: "BKK", name: "Bangkok Suvarnabhumi", city: "Bangkok", country: "TH", lat: 13.69, lon: 100.7501 },
  { iata: "HKT", name: "Phuket", city: "Phuket", country: "TH", lat: 8.1132, lon: 98.3169 },
  { iata: "SIN", name: "Singapore Changi", city: "Singapore", country: "SG", lat: 1.3644, lon: 103.9915 },
  { iata: "HKG", name: "Hong Kong", city: "Hong Kong", country: "HK", lat: 22.308, lon: 113.9185 },
  { iata: "NRT", name: "Tokyo Narita", city: "Tokyo", country: "JP", lat: 35.772, lon: 140.3929 },
  { iata: "HND", name: "Tokyo Haneda", city: "Tokyo", country: "JP", lat: 35.5494, lon: 139.7798 },
  { iata: "ICN", name: "Seoul Incheon", city: "Seoul", country: "KR", lat: 37.4602, lon: 126.4407 },
  { iata: "PEK", name: "Beijing Capital", city: "Beijing", country: "CN", lat: 40.0799, lon: 116.6031 },
  { iata: "PVG", name: "Shanghai Pudong", city: "Shanghai", country: "CN", lat: 31.1443, lon: 121.8083 },
  { iata: "DEL", name: "Delhi", city: "Delhi", country: "IN", lat: 28.5562, lon: 77.1 },
  { iata: "BOM", name: "Mumbai", city: "Mumbai", country: "IN", lat: 19.0896, lon: 72.8656 },
  { iata: "KUL", name: "Kuala Lumpur", city: "Kuala Lumpur", country: "MY", lat: 2.7456, lon: 101.7099 },
  { iata: "CGK", name: "Jakarta Soekarno-Hatta", city: "Jakarta", country: "ID", lat: -6.1256, lon: 106.6558 },
  { iata: "DPS", name: "Bali Denpasar", city: "Denpasar", country: "ID", lat: -8.7482, lon: 115.1672 },
  // Afrika / Oceania / Sør-Amerika
  { iata: "CAI", name: "Kairo", city: "Kairo", country: "EG", lat: 30.1114, lon: 31.4139 },
  { iata: "JNB", name: "Johannesburg O.R. Tambo", city: "Johannesburg", country: "ZA", lat: -26.1367, lon: 28.2411 },
  { iata: "CPT", name: "Cape Town", city: "Cape Town", country: "ZA", lat: -33.9649, lon: 18.6017 },
  { iata: "SYD", name: "Sydney Kingsford Smith", city: "Sydney", country: "AU", lat: -33.9399, lon: 151.1753 },
  { iata: "MEL", name: "Melbourne", city: "Melbourne", country: "AU", lat: -37.6733, lon: 144.8433 },
  { iata: "AKL", name: "Auckland", city: "Auckland", country: "NZ", lat: -37.0082, lon: 174.785 },
  { iata: "GRU", name: "São Paulo Guarulhos", city: "São Paulo", country: "BR", lat: -23.4356, lon: -46.4731 },
  { iata: "GIG", name: "Rio de Janeiro Galeão", city: "Rio de Janeiro", country: "BR", lat: -22.8089, lon: -43.2436 },
  { iata: "EZE", name: "Buenos Aires Ezeiza", city: "Buenos Aires", country: "AR", lat: -34.8222, lon: -58.5358 },
  { iata: "SCL", name: "Santiago", city: "Santiago", country: "CL", lat: -33.3928, lon: -70.7858 },
  { iata: "MEX", name: "Mexico City", city: "Mexico City", country: "MX", lat: 19.4361, lon: -99.0719 },
  { iata: "CUN", name: "Cancún", city: "Cancún", country: "MX", lat: 21.0365, lon: -86.8771 },
];

// ----------------------------------------------------------------------------
// Flytyper – fuel burn basert på flåtene til SAS, Norwegian, BA, KLM, United
// ----------------------------------------------------------------------------
//
// Tall er estimert cruise + climb/descent "block fuel" ved typisk etappelengde,
// sammensatt fra: Airbus/Boeing performance data, ICAO Aircraft Engine
// Emissions Databank, EASA type certificate data, og industri-benchmarker
// (MIT ICAT, EUROCONTROL, Jane's). Sete-antall er typiske 2-klasse
// konfigurasjoner brukt av nevnte operatører.
//
// Generasjon:
//   "ny"  = nyere drivstoffeffektiv generasjon (PW1500G/LEAP/GTF/GEnx/Trent XWB/Trent 1000)
//   "gml" = eldre generasjon (CFM56/V2500/CF6/Trent 700/GE90/PW4000)
//
// Per passasjer-km bruker antatt load factor 82 % (IATA snitt 2023-2024).

export type AircraftGen = "ny" | "gml";

export interface Aircraft {
  code: string;
  name: string;
  generation: AircraftGen;
  seats: number; // typisk 2-klasse config
  fuelKgPerKm: number; // total flymaskin, block fuel cruise-ekv.
  operators: string[]; // ikke-uttømmende
}

export const AIRCRAFT: Aircraft[] = [
  // Narrowbody ny generasjon
  { code: "A220-300", name: "Airbus A220-300", generation: "ny", seats: 140, fuelKgPerKm: 2.10, operators: ["airBaltic"] },
  { code: "A320NEO", name: "Airbus A320neo", generation: "ny", seats: 180, fuelKgPerKm: 2.30, operators: ["SAS", "BA"] },
  { code: "A321NEO", name: "Airbus A321neo", generation: "ny", seats: 220, fuelKgPerKm: 2.60, operators: ["SAS", "BA", "United"] },
  { code: "A321LR", name: "Airbus A321LR", generation: "ny", seats: 200, fuelKgPerKm: 2.70, operators: ["SAS"] },
  { code: "B737MAX8", name: "Boeing 737 MAX 8", generation: "ny", seats: 178, fuelKgPerKm: 2.20, operators: ["Norwegian", "United"] },
  { code: "B737MAX9", name: "Boeing 737 MAX 9", generation: "ny", seats: 189, fuelKgPerKm: 2.40, operators: ["United"] },
  // Narrowbody eldre
  { code: "A319", name: "Airbus A319", generation: "gml", seats: 144, fuelKgPerKm: 2.55, operators: ["BA", "United"] },
  { code: "A320CEO", name: "Airbus A320 (ceo)", generation: "gml", seats: 165, fuelKgPerKm: 2.70, operators: ["SAS", "BA", "United"] },
  { code: "A321CEO", name: "Airbus A321 (ceo)", generation: "gml", seats: 200, fuelKgPerKm: 3.00, operators: ["BA", "United"] },
  { code: "B737-700", name: "Boeing 737-700", generation: "gml", seats: 143, fuelKgPerKm: 2.30, operators: ["KLM", "United"] },
  { code: "B737-800", name: "Boeing 737-800", generation: "gml", seats: 186, fuelKgPerKm: 2.60, operators: ["Norwegian", "KLM"] },
  { code: "B737-900", name: "Boeing 737-900", generation: "gml", seats: 189, fuelKgPerKm: 2.70, operators: ["KLM", "United"] },
  { code: "B757-200", name: "Boeing 757-200", generation: "gml", seats: 199, fuelKgPerKm: 3.30, operators: ["United"] },
  // Regional / turboprop
  { code: "DH8D", name: "Bombardier Dash 8 Q400", generation: "gml", seats: 78, fuelKgPerKm: 1.05, operators: ["Widerøe"] },
  { code: "ATR72", name: "ATR 72-600", generation: "gml", seats: 72, fuelKgPerKm: 0.75, operators: ["diverse"] },
  // Widebody ny generasjon
  { code: "B787-8", name: "Boeing 787-8", generation: "ny", seats: 242, fuelKgPerKm: 4.80, operators: ["United"] },
  { code: "B787-9", name: "Boeing 787-9", generation: "ny", seats: 290, fuelKgPerKm: 5.40, operators: ["BA", "KLM", "United"] },
  { code: "B787-10", name: "Boeing 787-10", generation: "ny", seats: 330, fuelKgPerKm: 5.70, operators: ["KLM", "United"] },
  { code: "A330-900", name: "Airbus A330-900neo", generation: "ny", seats: 287, fuelKgPerKm: 5.20, operators: ["diverse"] },
  { code: "A350-900", name: "Airbus A350-900", generation: "ny", seats: 315, fuelKgPerKm: 5.80, operators: ["SAS", "United"] },
  { code: "A350-1000", name: "Airbus A350-1000", generation: "ny", seats: 350, fuelKgPerKm: 6.60, operators: ["BA"] },
  // Widebody eldre
  { code: "B767-300", name: "Boeing 767-300ER", generation: "gml", seats: 261, fuelKgPerKm: 5.10, operators: ["United"] },
  { code: "A330-200", name: "Airbus A330-200", generation: "gml", seats: 247, fuelKgPerKm: 5.60, operators: ["KLM"] },
  { code: "A330-300", name: "Airbus A330-300", generation: "gml", seats: 300, fuelKgPerKm: 5.80, operators: ["SAS", "KLM"] },
  { code: "B777-200", name: "Boeing 777-200ER", generation: "gml", seats: 314, fuelKgPerKm: 6.80, operators: ["BA", "KLM", "United"] },
  { code: "B777-300", name: "Boeing 777-300ER", generation: "gml", seats: 396, fuelKgPerKm: 7.80, operators: ["BA", "KLM", "United"] },
  { code: "A380", name: "Airbus A380-800", generation: "gml", seats: 510, fuelKgPerKm: 11.50, operators: ["BA"] },
];

// Standard (default) flytype per "ruteprofil"
export function defaultAircraftForDistance(km: number): string {
  if (km < 500) return "DH8D"; // regional
  if (km < 3700) return "B737MAX8"; // short-haul
  return "B787-9"; // long-haul
}

// ----------------------------------------------------------------------------
// Preset-reiser (standard familie-ruter)
// ----------------------------------------------------------------------------

export interface PresetLeg {
  from: string;
  to: string;
  aircraft?: string; // hvis ikke satt, velges default basert på distanse
}

export interface Preset {
  id: string;
  label: string;
  legs: PresetLeg[];
  roundTrip: boolean;
}

export const PRESETS: Preset[] = [
  { id: "osl-lhr", label: "OSL – LHR (London)", legs: [{ from: "OSL", to: "LHR", aircraft: "B737MAX8" }], roundTrip: true },
  { id: "osl-cph-krs", label: "OSL – CPH – KRS", legs: [{ from: "OSL", to: "CPH", aircraft: "A320NEO" }, { from: "CPH", to: "KRS", aircraft: "DH8D" }], roundTrip: true },
  { id: "osl-chq", label: "OSL – CHQ (Kreta)", legs: [{ from: "OSL", to: "CHQ", aircraft: "B737MAX8" }], roundTrip: true },
  { id: "lhr-chq", label: "LHR – CHQ (Kreta)", legs: [{ from: "LHR", to: "CHQ", aircraft: "A320NEO" }], roundTrip: true },
  { id: "lhr-jfk", label: "LHR – JFK (New York)", legs: [{ from: "LHR", to: "JFK", aircraft: "B787-9" }], roundTrip: true },
  { id: "lhr-lax", label: "LHR – LAX (Los Angeles)", legs: [{ from: "LHR", to: "LAX", aircraft: "A350-1000" }], roundTrip: true },
];

// ----------------------------------------------------------------------------
// Konstanter for forbrennings-kjemi
// ----------------------------------------------------------------------------

// Jet A-1 densitet ved 15 °C (kg/L)
export const JET_FUEL_DENSITY_KG_PER_L = 0.80;

// CO2-utslipp per kg drivstoff ved fullstendig forbrenning (støkiometrisk).
// Basert på karbon-innhold ~86 % i Jet A-1: CO2 = C × (44/12) ≈ 3.16 kg CO2/kg
export const CO2_PER_KG_FUEL = 3.16;

// Load factor brukt ved beregning per passasjer-km.
// IATA global load factor 2023-2024: ~82 %.
export const LOAD_FACTOR = 0.82;
