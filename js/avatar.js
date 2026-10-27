/* ================= AVATAR (tab) ================= */
/* "You at 75" drawn with the same characters as the path videos (story/characters.js).
   Scene by level: 0 on the bench · 1 standing with a cane · 2 walking together · 3 full of energy.
   Follows the first goal: grandchild only for "walks with my grandchildren", otherwise a friend from the group;
   from level 2 the place fits the goal (garden, summit, old town, dance hall, café …). Props follow the activity you do most. */
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
/* who is with you: the grandchild only if that is the goal, otherwise a friend from your group (adult, so drawn bigger) */
const companion = o => S.goal === "grand" ? KID(o) : FRIEND({ ...o, s: (o.s || .5) * 1.85, y: o.y });
/* the place for an active future self, by goal */
function goalPlace(T, sun) {
  return { garden: () => bgGarden(true), hike: () => bgSummit(), travel: () => bgOldTown(), dance: () => bgHall(T), friends: () => bgCafe() }[S.goal]?.() || bgPark(T, sun);
}
function avatarSVG(L, T) {
  const act = mainActivity(), old = { pfx: PFX, now: TNOW, ref: FACE_REF };
  PFX = "av";
  TNOW = T;
  FACE_REF = S.face ? "yiAV" : null;
  let bg, back = "", people = "", front = "";
  if (L === 0) { /* the start: still on the bench, but the sun comes out and someone waves you over */
    bg = bgPark(T, { c1: "#BFD9EA", c2: "#FCE9CF", sx: 360, sy: 250 + Math.sin(T * .4) * 4 });
    back = bench(190, AV_GY);
    people = you(75, true, { x: 190, y: AV_GY, outfit: "cardigan", mood: "smile", pose: { sit: true, aR: [70 + Math.sin(T * 2) * 8, 20] } })
      + companion({ x: 318, y: AV_GY - 30, s: .42, mood: "laugh", pose: { aR: [150 + Math.sin(T * 6) * 20, 10] } });
  }
  else if (L === 1) {
    bg = bgPark(T, { sun: false, c1: "#B4C6D0", c2: "#EEF1EC" });
    people = you(75, true, { x: 200, y: AV_GY, outfit: "home", mood: "neutral", cane: true, stoop: .5 })
      + companion({ x: 320, y: AV_GY, mood: "smile", pose: { aL: [40, 20] }, flip: true });
  }
  else if (L === 2) {
    bg = goalPlace(T, {});
    const w = T * 5;
    if (act === "cycling" || S.goal === "cycle")
      back = bike(110, AV_GY - 26, .95, "#1F7A55");
    people = you(75, true, { x: 195, y: AV_GY, outfit: "sport", mood: "smile", pose: { walk: w, stride: 14, aR: [28, 6] }, holdL: S.goal === "own" ? (hx, hy) => bag(hx, hy) : null })
      + companion({ x: 290, y: AV_GY, mood: "laugh", pose: { walk: w + Math.PI, stride: 18, aL: [34, 6] } });
    if (act === "football")
      front = ball(345, AV_GY - 14);

  }
  else {
    bg = goalPlace(T, { c2: "#FFE3B0" });
    const j = -Math.abs(Math.sin(T * 3.4)) * 16, j2 = -Math.abs(Math.sin(T * 3.4 + 1.2)) * 22;
    const dancing = act === "dancing" || S.goal === "dance";
    const arms = dancing ? { aL: [150 + Math.sin(T * 3) * 15, 10], aR: [150 - Math.sin(T * 3) * 15, 10] } : { aL: [20, 8], aR: [145, 10] };
    if (act === "cycling" || S.goal === "cycle")
      back = bike(95, AV_GY - 26, .95, "#1F7A55");
    people = you(75, true, { x: 200, y: AV_GY, outfit: "sport", mood: "laugh", pose: { jump: j, ...arms } })
      + companion({ x: 305, y: AV_GY, mood: "laugh", pose: { jump: j2, aL: [150, 10], aR: [150, 10] } });
    front = act === "football" ? ball(370 + Math.sin(T * 3.4) * 8, AV_GY - 14 + j2 * .6) : dancing ? notes(T) : "";
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
  /* your face as a small aged portrait in the corner (not on the drawn figure) */
  let ap = st.querySelector(".avport");
  if (S.face) {
    if (!ap) {
      st.insertAdjacentHTML("beforeend", `<div class="avport"><img alt=""><b></b></div>`);
      ap = st.querySelector(".avport");
    }
    const img = ap.querySelector("img");
    const src = agedFace(L < 2);
    if (img.getAttribute("src") !== src)
      img.src = src;
    ap.querySelector("b").textContent = TL("You · ", "Du · ", "Tú · ") + 75;
  }
  else if (ap)
    ap.remove();
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
