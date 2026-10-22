/* ================= FACE SCAN ================= */
let FACE_REF = null, FID = 0;
function faceDefs(id) { return S.face ? `<defs><image id="${id}" href="${S.face}" x="-23" y="-27" width="46" height="54" preserveAspectRatio="xMidYMid slice"/></defs>` : ""; }
const SC = { stream: null, timer: null, img: null, zoom: 1.2, dx: 0, dy: 0 };
function scanOpen() { const ov = $("#scanOv"); ov.hidden = false; scanIntro(); }
function scanClose() { scanStopCam(); $("#scanOv").hidden = true; renderText(); }
function scanStopCam() { clearInterval(SC.timer); SC.timer = null; if (SC.stream) {
  SC.stream.getTracks().forEach(t => t.stop());
  SC.stream = null;
} }
const scanHas = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
function scanIntro(msg) {
  const b = $("#scanBody");
  b.innerHTML = `<button class="round scx" data-scan-close aria-label="${TL("Close", "Schließen")}">✕</button>
 <div class="scanhero"><svg viewBox="0 0 200 220" width="170"><ellipse cx="100" cy="110" rx="74" ry="92" fill="none" stroke="#C8F06A" stroke-width="6" stroke-dasharray="14 10"/><circle cx="76" cy="98" r="6" fill="#fff"/><circle cx="124" cy="98" r="6" fill="#fff"/><path d="M76 146q24 18 48 0" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/></svg></div>
 <h2>${TL("Let's meet your future self", "Lerne dein Zukunfts-Ich kennen")}</h2>
 <p class="scanp">${TL("Look straight into the camera. We take one photo and two short head turns – like setting up Face ID. Takes about 20 seconds.", "Schau gerade in die Kamera. Wir machen ein Foto und zwei kurze Kopfdrehungen – wie beim Einrichten von Face ID. Dauert ca. 20 Sekunden.")}</p>
 <p class="scanp small">🔒 ${TL("Your photo stays on this phone. No upload, no server. You can delete it any time in Settings.", "Dein Foto bleibt auf diesem Handy. Kein Upload, kein Server. Du kannst es jederzeit in den Einstellungen löschen.")}</p>
 ${msg ? `<p class="scanmsg">${msg}</p>` : ""}
 ${scanHas() && !msg ? `<button class="btn lime" data-scan-cam>${TL("Start the scan", "Scan starten")}</button>` : ""}
 <label class="btn ${scanHas() && !msg ? "ghost" : "lime"} filebtn">${TL("Take or choose a photo", "Foto aufnehmen oder auswählen")}<input type="file" accept="image/*" capture="user" id="scanFile" hidden></label>`;
  $("#scanFile").onchange = e => { const f = e.target.files && e.target.files[0]; if (!f)
    return; const r = new FileReader(); r.onload = () => { const im = new Image(); im.onload = () => { SC.img = im; scanAdjust(); }; im.src = r.result; }; r.readAsDataURL(f); };
}
/* Face-ID style progress: short radial dashes around the face oval, lit clockwise from the top */
const SCAN_TICKS = 72;
function ovalTicks(cx, cy, rx, ry, len) {
  let s = "";
  for (let i = 0; i < SCAN_TICKS; i++) {
    const a = i / SCAN_TICKS * 2 * Math.PI, sx = Math.sin(a), sy = -Math.cos(a);
    const p = (x, y) => `${(cx + x * sx).toFixed(1)} ${(cy + y * sy).toFixed(1)}`;
    s += `<path d="M${p(rx, ry)}L${p(rx + len, ry + len)}"/>`;
  }
  return s;
}
const scanTicks = () => ovalTicks(150, 190, 110, 138, 10);
async function scanCam() {
  const b = $("#scanBody");
  b.innerHTML = `<button class="round scx" data-scan-close aria-label="${TL("Close", "Schließen")}">✕</button>
 <div class="camwrap"><video id="scanVid" playsinline autoplay muted></video>
 <svg class="cammask" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice"><defs><mask id="hole"><rect width="300" height="400" fill="#fff"/><ellipse cx="150" cy="190" rx="100" ry="128" fill="#000"/></mask></defs><rect width="300" height="400" fill="rgba(10,18,15,.72)" mask="url(#hole)"/><ellipse cx="150" cy="190" rx="104" ry="132" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1.5"/><g id="scanRing">${scanTicks()}</g><g class="scdone"><circle cx="150" cy="190" r="34" fill="#C8F06A"/><path d="M135 191l10 10 20-21" fill="none" stroke="#12201B" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g></svg>
 <div class="camhint" id="scanHint">${TL("Starting camera…", "Kamera startet…")}</div>
 <div class="camstep" id="scanStep"></div></div>
 <button class="btn ghost" id="scanSkip" hidden>${TL("Skip head turns", "Kopfdrehungen überspringen")}</button>`;
  try {
    SC.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 960 }, height: { ideal: 1280 } }, audio: false });
  }
  catch (e) {
    scanIntro(TL("The camera isn't available here (for example inside Claude, or permission was denied). Take or choose a photo instead.", "Die Kamera ist hier nicht verfügbar (z. B. in Claude, oder die Erlaubnis fehlt). Nimm stattdessen ein Foto auf oder wähle eins aus."));
    return;
  }
  const v = $("#scanVid");
  v.srcObject = SC.stream;
  try {
    await v.play();
  }
  catch (e) { }
  const cv = document.createElement("canvas");
  cv.width = 40;
  cv.height = 52;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  let prev = null, steady = 0, phase = 0, turn = 0;
  const ring = p => { const r = $("#scanRing"); if (!r)
    return; const n = Math.round(p * SCAN_TICKS); r.querySelectorAll("path").forEach((t, i) => t.classList.toggle("on", i < n)); r.closest("svg").classList.toggle("done", p >= 1); };
  const hint = s => { const h = $("#scanHint"); if (h && h.textContent !== s)
    h.textContent = s; };
  const step = s => { const h = $("#scanStep"); if (h)
    h.textContent = s; };
  step(TL("Step 1 of 3 · Front", "Schritt 1 von 3 · Vorne"));
  SC.timer = setInterval(() => {
    if (!v.videoWidth)
      return;
    const vw = v.videoWidth, vh = v.videoHeight;
    cx.drawImage(v, vw * .25, vh * .18, vw * .5, vh * .6, 0, 0, 40, 52);
    const d = cx.getImageData(0, 0, 40, 52).data;
    let lum = 0, diff = 0;
    const g = new Uint8Array(40 * 52);
    for (let i = 0, j = 0; i < d.length; i += 4, j++) {
      g[j] = (d[i] * 3 + d[i + 1] * 6 + d[i + 2]) / 10;
      lum += g[j];
      if (prev)
        diff += Math.abs(g[j] - prev[j]);
    }
    lum /= g.length;
    diff = prev ? diff / g.length : 99;
    prev = g;
    if (phase === 0) {
      if (lum < 55) {
        hint(TL("More light, please", "Bitte mehr Licht"));
        steady = Math.max(0, steady - 2);
      }
      else if (diff > 9) {
        hint(TL("Hold still…", "Halt still…"));
        steady = Math.max(0, steady - 1);
      }
      else {
        hint(TL("Perfect – stay like this", "Perfekt – so bleiben"));
        steady++;
      }
      ring(Math.min(1, steady / 8) / 3);
      if (steady >= 8) {
        scanGrab(v);
        phase = 1;
        turn = 0;
        const sk = $("#scanSkip");
        if (sk) {
          sk.hidden = false;
          sk.onclick = () => { scanStopCam(); scanAdjust(); };
        }
        step(TL("Step 2 of 3 · Turn left", "Schritt 2 von 3 · Nach links drehen"));
      }
    }
    else {
      turn += diff > 2.5 ? 1.4 : .6;
      const need = 10, p = Math.min(1, turn / need);
      hint(phase === 1 ? TL("Slowly turn your head to the left…", "Dreh den Kopf langsam nach links…") : TL("…and slowly to the right", "…und langsam nach rechts"));
      ring((1 + (phase - 1) + p) / 3);
      if (p >= 1) {
        if (phase === 1) {
          phase = 2;
          turn = 0;
          step(TL("Step 3 of 3 · Turn right", "Schritt 3 von 3 · Nach rechts drehen"));
        }
        else {
          ring(1);
          hint(TL("Done!", "Fertig!"));
          clearInterval(SC.timer);
          setTimeout(() => { scanStopCam(); scanAdjust(); }, 500);
        }
      }
    }
  }, 200);
}
function scanGrab(v) {
  const c = document.createElement("canvas"), vw = v.videoWidth, vh = v.videoHeight, s = Math.min(1, 900 / Math.max(vw, vh));
  c.width = vw * s;
  c.height = vh * s;
  const x = c.getContext("2d");
  x.translate(c.width, 0);
  x.scale(-1, 1);
  x.drawImage(v, 0, 0, c.width, c.height);
  const im = new Image();
  im.onload = () => { SC.img = im; };
  im.src = c.toDataURL("image/jpeg", .9);
  SC.fromCam = true;
}
function scanAdjust() {
  const b = $("#scanBody");
  if (!SC.img) {
    setTimeout(scanAdjust, 150);
    return;
  }
  SC.zoom = SC.fromCam ? 1.55 : 1.2;
  SC.dx = 0;
  SC.dy = SC.fromCam ? -.04 : 0;
  SC.fromCam = false;
  b.innerHTML = `<h2>${TL("Fit your face in the oval", "Passe dein Gesicht ins Oval ein")}</h2><p class="scanp">${TL("Drag to move, use the slider to zoom. Eyebrows to chin should fill the oval.", "Ziehen zum Verschieben, Regler zum Zoomen. Von den Augenbrauen bis zum Kinn sollte das Oval gefüllt sein.")}</p>
 <div class="adjwrap"><canvas id="adjCv" width="300" height="352"></canvas><svg viewBox="0 0 300 352" class="adjguide" aria-hidden="true"><defs><mask id="adjHole"><rect width="300" height="352" fill="#fff"/><ellipse cx="150" cy="176" rx="120" ry="141" fill="#000"/></mask></defs><rect width="300" height="352" fill="rgba(10,18,15,.62)" mask="url(#adjHole)"/><ellipse cx="150" cy="176" rx="120" ry="141" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/><g class="adjticks">${ovalTicks(150, 176, 126, 147, 10)}</g></svg></div>
 <input type="range" id="adjZoom" min="1" max="3.5" step=".01" value="${SC.zoom}" aria-label="Zoom">
 <button class="btn lime" id="adjOk">${TL("Looks good", "Passt so")}</button><button class="btn ghost" id="adjRedo">${TL("Try again", "Nochmal")}</button>`;
  const cv = $("#adjCv"), x = cv.getContext("2d");
  const draw = () => {
    const im = SC.img, cw = 240, ch = 282, base = Math.max(cw / im.width, ch / im.height) * SC.zoom, w = im.width * base, h = im.height * base;
    x.fillStyle = "#222";
    x.fillRect(0, 0, 300, 352);
    x.drawImage(im, 30 + (cw - w) / 2 + SC.dx * w, 35 + (ch - h) / 2 + SC.dy * h, w, h);
  };
  draw();
  let drag = null;
  cv.onpointerdown = e => { drag = [e.clientX, e.clientY, SC.dx, SC.dy]; cv.setPointerCapture(e.pointerId); };
  cv.onpointermove = e => { if (!drag)
    return; const im = SC.img, base = Math.max(240 / im.width, 282 / im.height) * SC.zoom; SC.dx = drag[2] + (e.clientX - drag[0]) / (im.width * base); SC.dy = drag[3] + (e.clientY - drag[1]) / (im.height * base); draw(); };
  cv.onpointerup = cv.onpointercancel = () => drag = null;
  $("#adjZoom").oninput = e => { SC.zoom = +e.target.value; draw(); };
  $("#adjRedo").onclick = () => { SC.img = null; scanIntro(); };
  $("#adjOk").onclick = () => { const out = document.createElement("canvas"); out.width = 240; out.height = 282; out.getContext("2d").drawImage(cv, 30, 35, 240, 282, 0, 0, 240, 282); S.face = out.toDataURL("image/jpeg", .82); S.scanned = true; save(); SC.img = null; scanReveal(); };
}
function scanReveal() {
  const b = $("#scanBody");
  FACE_REF = "yiR";
  const col = (age, good, lab, sub) => `<div class="rv"><svg viewBox="-62 -330 124 150">${fig({ ...youOpts(age, good), x: 0, y: 0, noShadow: true, mood: good ? "smile" : "neutral" })}</svg><b>${lab}</b><small>${sub}</small></div>`;
  const youOpts = (age, good) => ({ f: S.gender === "f", age, good, who: "Y", glasses: age >= 62, top: good ? "#E8743B" : "#8A7F72", bot: "#2F3A45", zip: good, belly: good ? 0 : 7 });
  b.innerHTML = `<h2>${TL("This is you", "Das bist du")}</h2><div class="rvrow">${faceDefs("yiR").replace("<defs>", "<svg width='0' height='0' style='position:absolute'><defs>").replace("</defs>", "</defs></svg>")}${col(55, true, TL("Today", "Heute"), "55")}${col(75, false, "75", TL("Path A · without exercise", "Weg A · ohne Bewegung"))}${col(75, true, "75", TL("Path B · with exercise", "Weg B · mit Bewegung"))}</div>
 <p class="scanp">${TL("Same person, same age – the difference is twenty years of small choices. Your face now appears in both path videos.", "Gleiche Person, gleiches Alter – der Unterschied sind zwanzig Jahre kleiner Entscheidungen. Dein Gesicht erscheint jetzt in beiden Weg-Videos.")}</p>
 <button class="btn lime" id="rvGo">${TL("Choose my goal", "Mein Ziel wählen")}</button>`;
  FACE_REF = null;
  $("#rvGo").onclick = () => scanClose();
}
function faceRow() {
  return S.face ? `<div class="card setrow"><img src="${S.face}" alt="" style="width:52px;height:62px;border-radius:50%;object-fit:cover"><span class="muted" style="flex:1;min-width:0">${TL("Your face scan is used for your avatar. Stored only on this phone.", "Dein Gesichtsscan wird für deinen Avatar genutzt. Nur auf diesem Handy gespeichert.")}</span><button class="btn small dark" data-face-scan>${TL("Scan again", "Neu scannen")}</button><button class="btn small out" data-face-del style="border-color:var(--danger);color:var(--danger)">${TL("Delete my face", "Gesicht löschen")}</button></div>`
    : `<div class="card setrow"><span class="muted" style="flex:1;min-width:0">${TL("No face scan yet – you see an example avatar.", "Noch kein Gesichtsscan – du siehst einen Beispiel-Avatar.")}</span><button class="btn small dark" data-face-scan>${TL("Scan my face", "Gesicht scannen")}</button></div>`;
}
document.addEventListener("click", e => {
  if (e.target.closest("[data-scan-close]")) {
    scanClose();
    return;
  }
  if (e.target.closest("[data-scan-cam]")) {
    scanCam();
    return;
  }
  if (e.target.closest("[data-face-scan]")) {
    $("#setSheet").hidden = true;
    scanOpen();
    return;
  }
  if (e.target.closest("[data-face-del]")) {
    S.face = null;
    S.scanned = false;
    save();
    renderText();
    toast(TL("Your face photo was deleted from this phone.", "Dein Gesichtsfoto wurde von diesem Handy gelöscht."));
    return;
  }
});
