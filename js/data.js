/* ================= DATA ================= */
/* anonymous feedback form for testers (Google Form without email collection). Empty = button says "coming soon". */
const FEEDBACK_URL = "";
/* demo groups placed around the search centre (km east, km north) */
const GROUPS = [
  { id: "w", type: "walking", name: { en: "Walking group 50+", de: "Walking-Gruppe 50+" }, days: [2, 4], time: "10:00", off: [0.6, 1.0], place: { en: "Park entrance", de: "Parkeingang" }, trainer: "Petra Lange", taken: 7, cap: 12, org: "ins" },
  { id: "d", type: "dancing", name: { en: "Dancing 50+", de: "Tanzen 50+" }, days: [3], time: "18:30", off: [-2.0, 1.5], place: { en: "Dance studio", de: "Tanzstudio" }, trainer: "Marco Ruiz", taken: 9, cap: 14, org: "club" },
  { id: "f", type: "football", name: { en: "Walking football 50+", de: "Walking Football 50+" }, days: [6], time: "11:00", off: [3.0, -2.3], place: { en: "Sports ground", de: "Sportplatz" }, trainer: "Jens Hofmann", taken: 10, cap: 16, org: "club" },
  { id: "r", type: "back", name: { en: "Strong back 50+", de: "Starker Rücken 50+" }, days: [1, 4], time: "12:15", off: [-0.5, -0.75], place: { en: "Gym", de: "Fitnessstudio" }, trainer: "Aylin Demir", taken: 6, cap: 10, org: "ins" },
  { id: "y", type: "yoga", name: { en: "Gentle yoga 50+", de: "Sanftes Yoga 50+" }, days: [1], time: "17:00", off: [1.6, -0.6], place: { en: "Community centre", de: "Stadtteilzentrum" }, trainer: "Lea Brandt", taken: 8, cap: 12, org: "ins" },
  { id: "c", type: "cycling", name: { en: "Cycling tour 50+", de: "Radtour 50+" }, days: [0], time: "10:30", off: [-1.2, -2.6], place: { en: "Lake car park", de: "Parkplatz am See" }, trainer: "Uwe Krämer", taken: 11, cap: 20, org: "vol", vol: true },
  { id: "v", type: "walking", name: { en: "Park walk buddies", de: "Park-Spazierbuddies" }, days: [5], time: "09:30", off: [-0.4, 0.8], place: { en: "Lake promenade", de: "Seepromenade" }, trainer: "Walk buddies", taken: 5, cap: 15, org: "vol", vol: true },
  /* further out (6–10 km), so a bigger search radius shows more */
  { id: "n", type: "walking", name: { en: "Nordic walking 50+", de: "Nordic Walking 50+" }, days: [3], time: "09:00", off: [5.2, 4.4], place: { en: "Forest car park", de: "Waldparkplatz" }, trainer: "Sabine Vogt", taken: 9, cap: 14, org: "ins" },
  { id: "o", type: "yoga", name: { en: "Chair yoga 50+", de: "Stuhl-Yoga 50+" }, days: [2], time: "15:00", off: [-7.5, -5.8], place: { en: "Library hall", de: "Bibliothekssaal" }, trainer: "Nina Wolff", taken: 6, cap: 12, org: "ins" },
  { id: "l", type: "dancing", name: { en: "Line dance 50+", de: "Line Dance 50+" }, days: [5], time: "19:00", off: [6.0, 6.0], place: { en: "Village hall", de: "Dorfgemeinschaftshaus" }, trainer: "Karin Schulz", taken: 12, cap: 20, org: "club" }
];
const PLZ = { "48143": [51.9625, 7.6280], "48145": [51.9600, 7.6600], "48147": [51.9800, 7.6350], "48149": [51.9650, 7.6000], "48151": [51.9480, 7.6050], "48153": [51.9450, 7.6350], "48155": [51.9550, 7.6650], "48157": [52.0000, 7.6600], "48159": [51.9950, 7.6100], "48161": [51.9800, 7.5500], "48163": [51.9150, 7.6000], "48165": [51.9050, 7.6400], "48167": [51.9300, 7.7000] };
/* offline fallback: rough centre of the first two postcode digits (big cities only) */
const PLZ2 = { "01": [51.05, 13.74], "04": [51.34, 12.37], "10": [52.52, 13.40], "12": [52.45, 13.45], "13": [52.56, 13.33], "14": [52.40, 13.06], "20": [53.55, 10.00], "21": [53.47, 10.00], "22": [53.58, 10.03], "28": [53.08, 8.80], "30": [52.37, 9.74], "40": [51.23, 6.78], "44": [51.51, 7.47], "45": [51.46, 7.01], "48": [51.96, 7.63], "50": [50.94, 6.96], "51": [50.95, 7.05], "53": [50.73, 7.10], "60": [50.11, 8.68], "70": [48.78, 9.18], "80": [48.14, 11.58], "81": [48.12, 11.60], "90": [49.45, 11.08] };
