/* ---------- player ---------- */
const STORY_OF = { A: "bad", B: "good" };
let play = null;
function stopPath() {
  if (!play)
    return;
  const st = play;
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
  $(`[data-play="${st.k}"]`).innerHTML = PLAY;
  const bp = $("#scene" + st.k + " .bigplay");
  if (bp)
    bp.hidden = false;
}
function renderStill(k) {
  const tl = buildStory(STORY_OF[k]);
  const sc = $("#scene" + k);
  if (!sc)
    return;
  if (!sc.querySelector(".bigplay"))
    sc.insertAdjacentHTML("beforeend", `<button class="bigplay" data-play-big="${k}" aria-label="${t("tapPlay")}">${PLAY}</button>`);
  const sh = tl.shots.find(s => s.id.endsWith("8"));
  drawAt(k, tl, sh.start + sh.dur * .5);
  $("#who" + k).textContent = (S.lang === "de" ? "Deine Geschichte" : "Your story") + " · " + `${Math.floor(tl.total / 60)}:${String(Math.round(tl.total % 60)).padStart(2, "0")}`;
  $("#sub" + k).textContent = S.lang === "de" ? "Tippe auf Play – mit Stimmen und Untertiteln." : "Tap play – with voices and subtitles.";
  $("#sub" + k).classList.add("lit");
  $(`[data-play="${k}"]`).innerHTML = PLAY;
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
      $(`[data-play="${k}"]`).innerHTML = PAUSE;
    }
    else {
      play.paused = true;
      play.pt = play.now();
      if (ACX)
        ACX.suspend().catch(() => { });
      try {
        speechSynthesis.pause();
      }
      catch (e) { }
      ;
      $(`[data-play="${k}"]`).innerHTML = PLAY;
    }
    return;
  }
  stopPath();
  const tl = buildStory(STORY_OF[k]);
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
  $(`[data-play="${k}"]`).innerHTML = PAUSE;
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
      tl.lines.forEach(li => { if (!li.clip)
        return; decodeClip(li.clip).then(b => { if (!b || st.stop)
        return; const s = c.createBufferSource(); s.buffer = b; const vg = c.createGain(); vg.gain.value = 1.6; s.connect(vg); vg.connect(st.gain); const when = st.t0 + li.at; if (when < c.currentTime)
        return; s.start(when); st.srcs.push(s); }); });
    }
    else {
      st.p0 = performance.now();
    }
    const loop = () => {
      if (st.stop)
        return;
      const T = st.now();
      if (!st.paused) {
        tl.lines.forEach(li => { if (!li.clip && T >= li.at && !st.spoken.has(li)) {
          st.spoken.add(li);
          ttsLine(li);
        } });
        drawAt(k, tl, Math.min(T, tl.total));
      }
      if (T >= tl.total) {
        play = null;
        $(`[data-play="${k}"]`).innerHTML = PLAY;
        const b = $("#scene" + k + " .bigplay");
        if (b)
          b.hidden = false;
        $("#who" + k).textContent = S.lang === "de" ? "Ende" : "The end";
        return;
      }
      st.raf = requestAnimationFrame(loop);
    };
    st.raf = requestAnimationFrame(loop);
  };
  // wait for clips (max 1.5 s) so voice and picture start together
  Promise.race([Promise.all(tl.lines.filter(l => l.clip).map(l => decodeClip(l.clip))), new Promise(r => setTimeout(r, 1500))]).then(begin);
}
