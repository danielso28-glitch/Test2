/* ---------- player ---------- */
const STORY_OF = { A: "bad", B: "good" };
let play = null;
function stopPath() {
  if (!play)
    return;
  const st = play;
  filmStop(st.k);
  st.stop = true;
  cancelAnimationFrame(st.raf);
  try {
    speechSynthesis.cancel();
  }
  catch (e) { }
  try {
    st.srcs.forEach(s => { try {
      s.stop();
    }
    catch (e) { } });
    st.gain && st.gain.disconnect();
  }
  catch (e) { }
  if (ACX && ACX.state === "suspended")
    ACX.resume().catch(() => { });
  play = null;
  setPlayBtn(st.k, false);
  const bp = $("#scene" + st.k + " .bigplay");
  if (bp)
    bp.hidden = false;
}
function setPlayBtn(k, playing) { const b = $(`[data-play="${k}"]`); if (!b)
  return; b.innerHTML = playing ? PAUSE : PLAY; b.setAttribute("aria-label", t("aria")[playing ? "pause" : "play"]); }
/* end of a video: next step right on the picture */
function showEndCard(k) {
  const sc = $("#scene" + k), E = t("endCard");
  hideEndCard(k);
  const btn = (cls, attr, label) => `<button class="btn ${cls}" ${attr}>${label}</button>`;
  sc.insertAdjacentHTML("beforeend", `<div class="endcard" role="group" aria-label="${E.title[k]}"><b>${E.title[k]}</b>
   ${k === "B" ? btn("lime", "data-findgroup", E.find) + btn("ghost", `data-replay="${k}"`, E.again) : btn("lime", 'data-go="s3"', E.seeB) + btn("ghost", "data-findgroup", E.find)}</div>`);
  const bp = sc.querySelector(".bigplay");
  if (bp)
    bp.hidden = true;
  sc.querySelector(".endcard .btn").focus({ preventScroll: true });
}
function hideEndCard(k) { const e = $("#scene" + k + " .endcard"); if (e)
  e.remove(); }
function renderStill(k) {
  const tl = buildStory(STORY_OF[k]);
  const sc = $("#scene" + k);
  if (!sc)
    return;
  if (!sc.querySelector(".bigplay"))
    sc.insertAdjacentHTML("beforeend", `<button class="bigplay" data-play-big="${k}">${PLAY}</button>`);
  sc.querySelector(".bigplay").setAttribute("aria-label", t("tapPlay"));
  const sh = tl.shots.find(s => s.id.endsWith("8"));
  drawAt(k, tl, sh.start + sh.dur * .5);
  $("#who" + k).textContent = TL("Your story", "Deine Geschichte", "Tu historia") + " · " + `${Math.floor(tl.total / 60)}:${String(Math.round(tl.total % 60)).padStart(2, "0")}`;
  $("#sub" + k).textContent = TL("Tap play – with voices and subtitles.", "Tippe auf Play – mit Stimmen und Untertiteln.", "Pulsa play – con voces y subtítulos.");
  $("#sub" + k).classList.add("lit");
  setPlayBtn(k, false);
  preloadStory(STORY_OF[k]);
}
function startPath(k) {
  if (play && play.k === k) { // pause / resume
    if (play.paused) {
      play.paused = false;
      if (ACX)
        ACX.resume().catch(() => { });
      try {
        speechSynthesis.resume();
      }
      catch (e) { }
      ;
      play.p0 = performance.now() - play.pt * 1000;
      setPlayBtn(k, true);
    }
    else {
      play.paused = true;
      play.pt = play.now();
      filmStop(k);
      if (ACX)
        ACX.suspend().catch(() => { });
      try {
        speechSynthesis.pause();
      }
      catch (e) { }
      ;
      setPlayBtn(k, false);
    }
    return;
  }
  stopPath();
  hideEndCard(k);
  const tl = buildStory(STORY_OF[k]);
  /* iPhone: play as media, so the silent switch doesn't mute the voices (Safari 17+) */
  try {
    if (navigator.audioSession)
      navigator.audioSession.type = "playback";
  }
  catch (e) { }
  const c = actx();
  if (c && c.state !== "running")
    c.resume().catch(() => { });
  try {
    speechSynthesis.cancel();
    const w = new SpeechSynthesisUtterance(" ");
    w.volume = 0;
    speechSynthesis.speak(w);
  }
  catch (e) { }
  const st = { k, tl, stop: false, paused: false, srcs: [], spoken: new Set(), p0: performance.now() };
  play = st;
  setPlayBtn(k, true);
  const bp = $("#scene" + k + " .bigplay");
  if (bp)
    bp.hidden = true;
  st.now = () => { if (st.useCtx)
    return ACX.currentTime - st.t0; return st.paused ? st.pt : (performance.now() - st.p0) / 1000; };
  const begin = () => {
    if (st.stop)
      return;
    if (c && c.state === "running") {
      st.useCtx = true;
      st.t0 = c.currentTime + .08;
      st.gain = c.createGain();
      st.gain.gain.value = 1;
      st.gain.connect(c.destination);
      const mg = c.createGain();
      mg.gain.value = .9;
      mg.connect(st.gain);
      scheduleMusic(c, mg, st.t0, tl);
      st.mg = mg;
      /* recorded clips; one that couldn't load falls back to the browser voice, one that loaded late starts mid-line (was: silent) */
      tl.lines.forEach(li => { if (!li.clip)
        return; decodeClip(li.clip).then(b => { if (st.stop)
        return; if (!b) {
        li.tts = true;
        return;
      } const when = st.t0 + li.at, late = c.currentTime - when; if (late > b.duration - .3)
        return; const s = c.createBufferSource(); s.buffer = b; const vg = c.createGain(); vg.gain.value = 1.6; s.connect(vg); vg.connect(st.gain); if (late > 0)
        s.start(c.currentTime, late);
      else
        s.start(when); st.srcs.push(s); }); });
    }
    else {
      st.p0 = performance.now();
    }
    const loop = () => {
      if (st.stop)
        return;
      const T = st.now();
      if (!st.paused) {
        /* browser voice for lines without a recording – and for all lines if Web Audio couldn't start */
        tl.lines.forEach(li => { if ((!li.clip || !st.useCtx || (li.tts && T < li.at + li.d)) && T >= li.at && !st.spoken.has(li)) {
          st.spoken.add(li);
          ttsLine(li);
          /* music down while the browser voice speaks, so it is easy to understand */
          if (st.mg) {
            const g = st.mg.gain, now = ACX.currentTime;
            g.cancelScheduledValues(now);
            g.setTargetAtTime(.3, now, .08);
            g.setTargetAtTime(.9, now + li.d, .3);
          }
        } });
        drawAt(k, tl, Math.min(T, tl.total));
      }
      if (T >= tl.total) {
        play = null;
        setPlayBtn(k, false);
        const b = $("#scene" + k + " .bigplay");
        if (b)
          b.hidden = false;
        $("#who" + k).textContent = TL("The end", "Ende", "Fin");
        showEndCard(k);
        return;
      }
      st.raf = requestAnimationFrame(loop);
    };
    st.raf = requestAnimationFrame(loop);
  };
  // wait for clips (max 1.5 s) so voice and picture start together
  // and for the audio output to actually start: on the first tap browsers start it with a delay (was: no sound in the first video)
  const wait = ms => new Promise(r => setTimeout(r, ms));
  Promise.race([Promise.all(tl.lines.filter(l => l.clip).map(l => decodeClip(l.clip))), wait(1500)])
    .then(() => c && c.state !== "running" ? Promise.race([c.resume().catch(() => { }), wait(1000)]) : 0)
    .then(begin);
}
