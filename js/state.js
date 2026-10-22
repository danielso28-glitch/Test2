/* ================= STATE ================= */
const DEF = { face: null, trPerm: null, trSync: null, lang: null, size: 16, goal: "grand", gender: "m", filter: "all", group: "w", scanned: false, onboarded: false, joined: [], checkins: [], volunteer: false, comJoined: [], own: [], tracker: null, plz: "48149", center: [51.9650, 7.6000], useGeo: false, radius: 2, tab: "avatar", exCat: "all", liked: [], interests: [], ciLog: {}, account: null, loggedIn: false, posts: {}, rsvp: {}, comSeen: [] };
let S = { ...DEF };
try {
  const s = JSON.parse(localStorage.getItem("tp2") || "null");
  if (s)
    S = { ...DEF, ...s };
}
catch (e) { }
if (!S.lang)
  S.lang = (navigator.language || "").toLowerCase().startsWith("de") ? "de" : "en";
function save() { try {
  localStorage.setItem("tp2", JSON.stringify(S));
}
catch (e) { } }
const $ = q => document.querySelector(q), $$ = q => [...document.querySelectorAll(q)];
const t = k => I[S.lang][k];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const nm = g => typeof g.name === "string" ? g.name : g.name[S.lang];
const pl = g => typeof g.place === "string" ? g.place : g.place[S.lang];
function toast(m) { const el = $("#toast"); el.textContent = m; el.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => el.hidden = true, 2800); }
const Gname = () => S.gender === "f" ? t("gm") : t("gp");
const quote = s => S.lang === "de" ? `„${s}“` : `“${s}”`;
const line = (goal, path, i) => DLG[S.lang][goal][path][i].replace("{G}", Gname());
const dayKey = d => { const z = new Date(d.getTime() - d.getTimezoneOffset() * 6e4); return z.toISOString().slice(0, 10); };
