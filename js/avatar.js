/* ================= AVATAR (tab) ================= */
/* "You at 75" drawn with the same characters as the path videos (story/characters.js).
   Scene by level: 0 on the bench · 1 standing with a cane · 2 walking with the grandchild · 3 playing with the grandchild.
   Props follow the activity you do most. With a face scan, the head is your (aged) photo. */
const AV_GY = 560;
let avRAF = null, avLast = 0, avT0 = 0;
/* the activity with the most check-ins, else the first joined group's */
function mainActivity() {
  const cnt = {};
  Object.values(S.ciLog || {}).forEach(id => { const g = id && allGroups().find(x => x.id === id); if (g)
    cnt[g.type] = (cnt[g.type] || 0) + 1; });
  const k = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0];
  if (k)
    return k;
  const g = allGroups().find(g => S.joined.includes(g.id));
  return g ? g.type : null;
}
const bench = (x, y) => `<g fill="#6B5446"><rect x="${x - 95}" y="${y - 86}" width="190" height="14" rx="5"/><rect x="${x - 95}" y="${y - 150}" width="190" height="14" rx="5"/><rect x="${x - 85}" y="${y - 150}" width="10" height="150"/><rect x="${x + 75}" y="${y - 150}" width="10" height="150"/></g>`;
const ball = (x, y) => `<g transform="translate(${x} ${y})"><circle r="15" fill="#FFF" stroke="#22282E" stroke-width="3"/><path d="M0 -6l6 4-2 7h-8l-2-7z" fill="#22282E"/></g>`;
const notes = T => [0, 1, 2].map(i => { const p = (T * .5 + i / 3) % 1; return `<text x="${120 + i * 110 + Math.sin(T * 2 + i) * 12}" y="${AV_GY - 260 - p * 120}" font-size="34" fill="#E8743B" opacity="${(1 - p).toFixed(2)}">♪</text>`; }).join("");
function avatarSVG(L, T) {
  const act = mainActivity(), old = { pfx: PFX, now: TNOW, ref: FACE_REF };
  PFX = "av";
  TNOW = T;
  FACE_REF = S.face ? "yiAV" : null;
  let bg, back = "", people = "", front = "";
  if (L === 0) {
    bg = bgPark(T, { sun: false, c1: "#7F8A93", c2: "#C3C8CB" });
    back = `<rect x="0" y="0" width="440" height="600" fill="#5E6A72" opacity=".28"/>` + bench(220, AV_GY);
    people = you(75, false, { x: 220, y: AV_GY, outfit: "cardigan", mood: "sad", cane: true, pose: { sit: true } });
  }
  else if (L === 1) {
    bg = bgPark(T, { sun: false, c1: "#B4C6D0", c2: "#EEF1EC" });
    people = you(75, true, { x: 200, y: AV_GY, outfit: "home", mood: "neutral", cane: true, stoop: .5 })
      + KID({ x: 320, y: AV_GY, mood: "smile", pose: { aL: [40, 20] }, flip: true });
  }
  else if (L === 2) {
    bg = bgPark(T, {});
    const w = T * 5;
    if (act === "cycling")
      back = bike(110, AV_GY - 26, .95, "#1F7A55");
    people = you(75, true, { x: 195, y: AV_GY, outfit: "sport", mood: "smile", pose: { walk: w, stride: 14, aR: [28, 6] } })
      + KID({ x: 290, y: AV_GY, mood: "laugh", pose: { walk: w + Math.PI, stride: 18, aL: [34, 6] } });
    if (act === "football")
      front = ball(345, AV_GY - 14);
  }
  else {
    bg = bgPark(T, { c2: "#FFE3B0" });
    const j = -Math.abs(Math.sin(T * 3.4)) * 16, j2 = -Math.abs(Math.sin(T * 3.4 + 1.2)) * 22;
    const arms = act === "dancing" ? { aL: [150 + Math.sin(T * 3) * 15, 10], aR: [150 - Math.sin(T * 3) * 15, 10] } : { aL: [20, 8], aR: [145, 10] };
    if (act === "cycling")
      back = bike(95, AV_GY - 26, .95, "#1F7A55");
    people = you(75, true, { x: 200, y: AV_GY, outfit: "sport", mood: "laugh", pose: { jump: j, ...arms } })
      + KID({ x: 305, y: AV_GY, mood: "laugh", pose: { jump: j2, aL: [150, 10], aR: [150, 10] } });
    front = act === "football" ? ball(370 + Math.sin(T * 3.4) * 8, AV_GY - 14 + j2 * .6) : act === "dancing" ? notes(T) : "";
  }
  const out = `<svg class="scene" viewBox="10 215 420 370" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${t("youAt75")}">${bg}${back}${people}${front}</svg>`;
  PFX = old.pfx;
  TNOW = old.now;
  FACE_REF = old.ref;
  return out;
}
/* static parts once (face photo as <defs>, so it isn't re-parsed every frame), then animate the scene while the tab is visible */
function renderAvatarStage(s) {
  const st = $("#avStage"), L = lvlOf(s);
  st.dataset.lvl = L;
  if (!st.querySelector(".scene")) {
    st.innerHTML = `<svg class="pd" width="0" height="0" aria-hidden="true"></svg><svg class="scene"></svg>`;
    avT0 = performance.now();
  }
  const pd = st.querySelector(".pd"), defs = faceDefs("yiAV");
  if (pd.dataset.face !== String(S.face && S.face.length)) {
    pd.innerHTML = defs;
    pd.dataset.face = String(S.face && S.face.length);
  }
  st.querySelector(".scene").outerHTML = avatarSVG(L, (performance.now() - avT0) / 1000);
  const still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!still && !avRAF)
    avRAF = requestAnimationFrame(avLoop);
}
function avLoop(ts) {
  const st = $("#avStage");
  if ($("#main").hidden || $("#tab-avatar").hidden) {
    avRAF = null;
    return;
  }
  if (ts - avLast > 66) { /* ~15 fps is plenty for idle motion */
    avLast = ts;
    st.querySelector(".scene").outerHTML = avatarSVG(+st.dataset.lvl, (ts - avT0) / 1000);
  }
  avRAF = requestAnimationFrame(avLoop);
}
