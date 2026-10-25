/* ---------- film mode: real video clips instead of the drawn scene ---------- */
/* FILM (film-manifest.js) maps a key to a clip in assets/video/. Key lookup, most specific first:
   <shot>_<goal>_<m|f> · <shot>_<goal> · <shot>_<m|f> · <shot>   (goal only for the A8/B8 endings).
   Clips are muted (voices, music and sounds come from the timeline), trimmed to start at 0, portrait 540×960.
   No clip → the drawn scene is used, so film and drawings can be mixed while clips are added. */
const FILM_BASE = "assets/video/";
/* colour grade per mood: warm/golden for the active path, cold and grey for the other */
const GRADE = { neutral: "contrast(1.04)", warm: "saturate(1.18) sepia(.2) contrast(1.06) brightness(1.04)", c1: "saturate(.7) contrast(1.05) brightness(.95)", c2: "saturate(.5) contrast(1.08) brightness(.9) hue-rotate(-6deg)", c3: "saturate(.3) contrast(1.1) brightness(.84) hue-rotate(-10deg)", rewind: "saturate(.6) contrast(1.1)" };
function filmKey(sh) {
  if (typeof FILM === "undefined")
    return null;
  const g = S.gender === "f" ? "f" : "m", goal = /8$/.test(sh.id) ? "_" + S.goal : "";
  return [sh.id + goal + "_" + g, sh.id + goal, sh.id + "_" + g, sh.id].find(k => FILM[k]) || null;
}
/* preload: fetch every clip of a story into memory (blob URL), so scenes switch without a black gap on slow mobile data.
   Phones (iOS) ignore <video preload>, a fetched blob always plays at once. Each clip is fetched once. */
const FILM_BLOB = {}, FILM_LOADING = {};
function filmPreload(tl) {
  if (typeof FILM === "undefined")
    return;
  tl.shots.map(filmKey).filter(k => k && !FILM_BLOB[k] && !FILM_LOADING[k]).forEach(k => {
    FILM_LOADING[k] = fetch(FILM_BASE + FILM[k].src).then(r => r.ok ? r.blob() : null).then(b => { if (b)
      FILM_BLOB[k] = URL.createObjectURL(b); }).catch(() => { }).finally(() => delete FILM_LOADING[k]);
  });
}
/* one <video> per clip, created on demand; returns the layer */
function filmLayer(sc) {
  let L = sc.querySelector(".film");
  if (!L) {
    L = document.createElement("div");
    L.className = "film";
    L.innerHTML = `<div class="fv"></div><div class="fport" hidden><i><img alt=""><img alt=""></i><b></b></div><div class="fgrain"></div><div class="fvig"></div><div class="fblack"></div>`;
    sc.prepend(L);
  }
  return L;
}
function filmVideo(L, key) {
  let v = L.querySelector(`video[data-k="${key}"]`);
  if (!v) {
    v = document.createElement("video");
    v.dataset.k = key;
    v.muted = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.preload = "auto";
    v.src = FILM_BLOB[key] || FILM_BASE + FILM[key].src;
    L.querySelector(".fv").appendChild(v);
  }
  return v;
}
/* draw the film frame for time T; returns false when this shot has no clip */
function filmAt(k, tl, sh, u, T) {
  const sc = $("#scene" + k), key = filmKey(sh), L = sc.querySelector(".film");
  if (!key) {
    if (L)
      L.hidden = true;
    return false;
  }
  const lay = filmLayer(sc);
  lay.hidden = false;
  const v = filmVideo(lay, key), want = Math.min(T - sh.start, (FILM[key].dur || 99) - .05), live = play && play.k === k && !play.paused;
  lay.querySelectorAll("video").forEach(x => { if (x !== v) {
    x.classList.remove("on");
    if (!x.paused)
      x.pause();
  } });
  v.classList.add("on");
  if (Math.abs(v.currentTime - want) > (live ? .35 : .05))
    try {
      v.currentTime = Math.max(0, want);
    }
    catch (e) { }
  if (live && v.paused && want < (FILM[key].dur || 99) - .1)
    v.play().catch(() => { });
  if (!live && !v.paused)
    v.pause();
  /* preload the next clip */
  const nx = tl.shots[tl.shots.indexOf(sh) + 1], nk = nx && filmKey(nx);
  if (nk)
    filmVideo(lay, nk);
  /* slow push-in, grade, fade through black between shots */
  v.style.transform = `scale(${(1.02 + u * .07).toFixed(3)})`;
  v.style.filter = sh.fx === "rewind" ? `saturate(${lerp(.3, 1.1, u).toFixed(2)}) contrast(1.08)` : GRADE[sh.fx] || GRADE.neutral;
  const fade = Math.max(0, 1 - (T - sh.start) / .45, 1 - (sh.start + sh.dur - T) / .35);
  lay.querySelector(".fblack").style.opacity = Math.min(1, fade).toFixed(2);
  /* "this is you": the scanned face as a portrait in the age shots */
  const port = lay.querySelector(".fport"), age = sh.age ? Math.round(lerp(sh.age[0], sh.age[1], ease(cl((u - .2) / .5)))) : sh.id === "O1" ? 55 : null;
  const showP = !!(S.face && age && u > .25 && u < .92);
  port.hidden = !showP;
  if (showP) {
    /* the face as it is today, cross-fading into the aged portrait of this path (aging.js) as the age goes up */
    const [img, old] = port.querySelectorAll("img"), src = agedFace(tl.kind === "bad");
    if (img.getAttribute("src") !== S.face)
      img.src = S.face;
    if (old.getAttribute("src") !== src)
      old.src = src;
    old.style.opacity = cl((age - 55) / 20).toFixed(2);
    /* label: the age the narrator names (75), counting only while rewinding back to 55 */
    port.querySelector("b").textContent = (S.lang === "de" ? "Du · " : "You · ") + (sh.age && sh.fx !== "rewind" ? sh.age[1] : age);
    port.style.opacity = Math.min(1, (u - .25) * 6, (.92 - u) * 6).toFixed(2);
  }
  return true;
}
function filmStop(k) { const L = $("#scene" + k + " .film"); if (L)
  L.querySelectorAll("video").forEach(v => v.pause()); }
