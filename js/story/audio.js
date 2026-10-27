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
function preloadStory(kind) { const tl = buildStory(kind); tl.lines.forEach(l => l.clip && decodeClip(l.clip)); if (S.loggedIn)
  filmPreload(tl); }
function note(c, dest, t, f, d, g, type = "sine") { const o = c.createOscillator(), a = c.createGain(); o.type = type; o.frequency.value = f; a.gain.setValueAtTime(0, t); a.gain.linearRampToValueAtTime(g, t + .02); a.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(a); a.connect(dest); o.start(t); o.stop(t + d + .05); }
/* synthesized sound effects – no audio files needed */
function noiseBuf(c) {
  if (noiseBuf.c !== c) {
    const b = c.createBuffer(1, c.sampleRate * .6, c.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++)
      d[i] = Math.random() * 2 - 1;
    noiseBuf.c = c;
    noiseBuf.b = b;
  }
  return noiseBuf.b;
}
function thump(c, dest, t, freq, dur, g) {
  const s = c.createBufferSource(), f = c.createBiquadFilter(), a = c.createGain();
  s.buffer = noiseBuf(c);
  f.type = "lowpass";
  f.frequency.value = freq;
  a.gain.setValueAtTime(g, t);
  a.gain.exponentialRampToValueAtTime(.0001, t + dur);
  s.connect(f);
  f.connect(a);
  a.connect(dest);
  s.start(t);
  s.stop(t + dur + .05);
}
function chirp(c, dest, t, f0, f1, dur, g) {
  const o = c.createOscillator(), a = c.createGain();
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  a.gain.setValueAtTime(0, t);
  a.gain.linearRampToValueAtTime(g, t + .01);
  a.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(a);
  a.connect(dest);
  o.start(t);
  o.stop(t + dur + .02);
}
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
    if (k === "steps") /* footsteps every ~0.5 s for the whole shot */
      for (let j = 0, n = 0; j < s.dur - at - .2; j += .52, n++)
        thump(c, dest, t + j, n % 2 ? 420 : 340, .09, .1);
    if (k === "birds") /* little groups of chirps at irregular times */
      for (let j = 0, n = 1; j < s.dur - at - .3; j += .6 + ((n * .618) % 1) * .9, n++)
        for (let r = 0; r < 2 + (n % 2); r++)
          chirp(c, dest, t + j + r * .11, 2700 + (n % 3) * 300, 3700 + (n % 2) * 400, .07, .022);
    if (k === "door") { /* car door: latch click + deep thud */
      thump(c, dest, t, 2600, .03, .06);
      thump(c, dest, t + .02, 150, .35, .45);
      note(c, dest, t + .02, 68, .25, .12);
    }
    if (k === "ding") { /* lift bell */
      note(c, dest, t, 1318, 1.1, .09);
      note(c, dest, t, 2637, .6, .02);
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
    u.lang = LOC();
    const fem = li.sp === "K" || li.sp === "F" || li.sp === "D" || (li.sp[0] === "Y" && S.gender === "f");
    const v = pickVoice(fem);
    if (v)
      u.voice = v;
    /* only small pitch/speed changes: strong pitch shifting is what makes browser voices sound robotic */
    const P = { N: [1, .95], Y55: [1, .96], Y65A: [.97, .94], Y65B: [.95, .9], Y75A: [.96, .92], Y75B: [.92, .86], K: [1.25, 1.02], F: [1.04, .98], C: [1, 1], D: [1, .95] }[li.sp] || [1, .96];
    u.pitch = P[0];
    u.rate = P[1];
    speechSynthesis.speak(u);
  }
  catch (e) { }
}
/* the most natural voice the phone offers for this language (and gender) */
const VOICE_BAD = /\b(eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley|albert|bad news|bahh|bells|boing|bubbles|cellos|wobble|fred|good news|jester|junior|kathy|organ|superstar|ralph|trinoids|whisper|zarvox)\b/i;
const VOICE_F = /female|frau|anna|petra|helena|katja|marlene|vicki|amala|samantha|karen|moira|tessa|serena|kate|stephanie|martha|libby|sonia|jenny|aria|mónica|monica|marisol|paulina|elvira|lucia|lucía|google deutsch|google español|google uk english female/i;
const VOICE_M = /\bmale|mann|daniel|markus|yannick|hans|thomas|conrad|arthur|oliver|martin|ryan|guy|jorge|juan|diego|alvaro|álvaro|google uk english male/i;
function pickVoice(fem) {
  try {
    const vs = speechSynthesis.getVoices().filter(v => (v.lang || "").toLowerCase().startsWith(S.lang) && !VOICE_BAD.test(v.name));
    if (!vs.length)
      return null;
    /* Premium / Enhanced / Siri / Microsoft "Natural" / Google voices sound far less robotic than the basic ones */
    const q = v => /premium|neural|natural|siri/i.test(v.name) ? 4 : /enhanced|erweitert|mejorada|optimiert/i.test(v.name) ? 3 : /google|online/i.test(v.name) ? 2 : v.localService === false ? 1 : 0;
    const best = list => list.slice().sort((a, b) => q(b) - q(a))[0];
    const want = fem ? VOICE_F : VOICE_M, other = fem ? VOICE_M : VOICE_F;
    return best(vs.filter(v => want.test(v.name))) || best(vs.filter(v => !other.test(v.name))) || best(vs);
  }
  catch (e) {
    return null;
  }
}

