/* ---------- audio ---------- */
let ACX = null;
const BUF = {};
function actx() { if (ACX)
  return ACX; const C = window.AudioContext || window.webkitAudioContext; if (!C)
  return null; try {
  ACX = new C();
}
catch (e) {
  ACX = null;
} return ACX; }
function b64buf(b) { const s = atob(b), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++)
  u[i] = s.charCodeAt(i); return u.buffer; }
function clipBytes(id) {
  if (AUD[id])
    return Promise.resolve(b64buf(AUD[id]));
  return fetch(AUDIO_BASE + id + ".mp3").then(r => r.ok ? r.arrayBuffer() : null).catch(() => null);
}
function decodeClip(id) {
  if (BUF[id])
    return BUF[id];
  const c = actx();
  if (!c || !ADUR[id])
    return Promise.resolve(null);
  BUF[id] = clipBytes(id).then(ab => ab ? new Promise(res => { try {
    const p = c.decodeAudioData(ab, b => res(b), () => res(null));
    if (p && p.catch)
      p.catch(() => res(null));
  }
  catch (e) {
    res(null);
  } }) : null);
  return BUF[id];
}
function preloadStory(kind) { const tl = buildStory(kind); tl.lines.forEach(l => l.clip && decodeClip(l.clip)); }
function note(c, dest, t, f, d, g, type = "sine") { const o = c.createOscillator(), a = c.createGain(); o.type = type; o.frequency.value = f; a.gain.setValueAtTime(0, t); a.gain.linearRampToValueAtTime(g, t + .02); a.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(a); a.connect(dest); o.start(t); o.stop(t + d + .05); }
function scheduleMusic(c, dest, t0, tl) {
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  const good = tl.kind === "good";
  const prog = good ? [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]] : [[57, 60, 64], [52, 55, 59], [53, 57, 60], [52, 56, 59]];
  const beat = good ? .5 : .9;
  let i = 0;
  for (let t = 0; t < tl.total - 1; t += beat) {
    const sh = tl.shots.find(s => t < s.start + s.dur) || tl.shots[0];
    const ch = prog[Math.floor(t / (beat * 8)) % 4];
    const opening = sh.id[0] === "O", act3 = /7|8|9|10/.test(sh.id.slice(1));
    let g = good ? (opening ? .022 : .03 + (act3 ? .012 : 0)) : (opening ? .022 : Math.max(.008, .026 - (t / tl.total) * .02));
    if (sh.id === "B9")
      g = .03;
    if (!good && sh.id !== "B9" && i % 2)
      continue;
    note(c, dest, t0 + t, hz(ch[i % 3] + 12), good ? 1.4 : 2.2, g, "triangle");
    if (i % 4 === 0)
      note(c, dest, t0 + t, hz(ch[0] - 12), beat * 4, g * .9, "sine");
    i++;
  }
  tl.shots.forEach(s => (s.sfx || []).forEach(([k, at]) => {
    const t = t0 + s.start + at;
    if (k === "ping") {
      note(c, dest, t, 1318, .25, .12);
      note(c, dest, t + .12, 1760, .35, .1);
    }
    if (k === "hang") {
      note(c, dest, t, 480, .18, .06, "square");
      note(c, dest, t + .25, 480, .18, .06, "square");
    }
    if (k === "tick") {
      for (let j = 0; j < s.dur; j += 1)
        note(c, dest, t + j, 2400, .03, .05, "square");
    }
  }));
}
function ttsLine(li) {
  try {
    if (!("speechSynthesis" in window))
      return;
    const u = new SpeechSynthesisUtterance(li.txt);
    u.lang = S.lang === "de" ? "de-DE" : "en-GB";
    const fem = li.sp === "K" || li.sp === "F" || li.sp === "D" || (li.sp[0] === "Y" && S.gender === "f");
    const v = pickVoice(fem ? "kid" : "adult", fem);
    if (v)
      u.voice = v;
    const P = { N: [1, .95], Y55: [fem ? 1 : .85, .95], Y65A: [fem ? .95 : .8, .95], Y65B: [fem ? .85 : .72, .85], Y75A: [fem ? .9 : .75, .9], Y75B: [fem ? .75 : .62, .78], K: [1.8, 1.08], F: [1.1, 1], C: [1, 1], D: [1.05, .92] }[li.sp] || [1, 1];
    u.pitch = P[0];
    u.rate = P[1];
    speechSynthesis.speak(u);
  }
  catch (e) { }
}
function pickVoice(kind, fem) {
  try {
    const vs = speechSynthesis.getVoices().filter(v => (v.lang || "").toLowerCase().startsWith(S.lang));
    if (!vs.length)
      return null;
    const F = /female|frau|anna|helena|samantha|karen|petra|katja|marlene|vicki|serena|moira|tessa/i, M = /male|mann|daniel|markus|yannick|hans|thomas|arthur|oliver/i;
    const want = fem ? F : M;
    return vs.find(v => want.test(v.name)) || vs[0];
  }
  catch (e) {
    return null;
  }
}
