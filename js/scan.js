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
 <div class="scanhero"><svg viewBox="0 0 200 220" width="170"><g class="herotick">${ovalTicks(100, 110, 74, 92, 9)}</g><circle cx="76" cy="98" r="6" fill="#fff"/><circle cx="124" cy="98" r="6" fill="#fff"/><path d="M76 146q24 18 48 0" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/></svg></div>
 <h2>${TL("Let's meet your future self", "Lerne dein Zukunfts-Ich kennen")}</h2>
 <p class="scanp">${TL("Look straight into the camera and hold still for two seconds. The app finds your face and takes the photo by itself.", "Schau gerade in die Kamera und halt zwei Sekunden still. Die App findet dein Gesicht und macht das Foto von selbst.")}</p>
 <p class="scanp small">🔒 ${TL("Your photo stays on this phone. No upload, no server. You can delete it any time in Settings.", "Dein Foto bleibt auf diesem Handy. Kein Upload, kein Server. Du kannst es jederzeit in den Einstellungen löschen.")}</p>
 ${msg ? `<p class="scanmsg">${msg}</p>` : ""}
 ${scanHas() && !msg ? `<button class="btn lime" data-scan-cam>${TL("Start the scan", "Scan starten")}</button>` : ""}
 <label class="btn ${scanHas() && !msg ? "ghost" : "lime"} filebtn">${TL("Take or choose a photo", "Foto aufnehmen oder auswählen")}<input type="file" accept="image/*" capture="user" id="scanFile" hidden></label>`;
  $("#scanFile").onchange = e => { const f = e.target.files && e.target.files[0]; if (!f)
    return; const r = new FileReader(); r.onload = () => { const im = new Image(); im.onload = () => { SC.img = im; Promise.race([detectFace(im).catch(() => null), new Promise(ok => setTimeout(ok, 5000))]).then(b => { SC.box = b && !b.none ? b : null; scanAdjust(); }); }; im.src = r.result; }; r.readAsDataURL(f); };
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
 <div class="camstep" id="scanStep"></div></div>`;
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
  let prev = null, steady = 0, busy = false, lastBox = null;
  const NEED = 10;
  const ring = p => { const r = $("#scanRing"); if (!r)
    return; const n = Math.round(p * SCAN_TICKS); r.querySelectorAll("path").forEach((t, i) => t.classList.toggle("on", i < n)); r.closest("svg").classList.toggle("done", p >= 1); };
  const hint = s => { const h = $("#scanHint"); if (h && h.textContent !== s)
    h.textContent = s; };
  const step = s => { const h = $("#scanStep"); if (h)
    h.textContent = s; };
  step(TL("Look straight into the camera", "Schau gerade in die Kamera"));
  faceDetector();
  SC.timer = setInterval(async () => {
    if (!v.videoWidth || busy)
      return;
    busy = true;
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
    /* face position on screen: the video is mirrored and cropped to 3:4 (object-fit: cover) */
    const box = await detectFace(v).catch(() => null);
    let ok = true;
    if (lum < 55) {
      hint(TL("More light, please", "Bitte mehr Licht"));
      ok = false;
    }
    else if (box && box.none) {
      hint(TL("Put your face in the oval", "Halte dein Gesicht ins Oval"));
      ok = false;
    }
    else if (box) {
      const ar = vw / vh, fx = Math.min(1, .75 / ar), fy = Math.min(1, ar / .75);
      const cxd = (1 - box.x - box.w / 2 - (1 - fx) / 2) / fx, cyd = (box.y + box.h / 2 - (1 - fy) / 2) / fy, hd = box.h / fy;
      if (hd < .3) {
        hint(TL("Come a little closer", "Komm etwas näher"));
        ok = false;
      }
      else if (hd > .62) {
        hint(TL("A little further away", "Etwas weiter weg"));
        ok = false;
      }
      else if (Math.abs(cxd - .5) > .12 || Math.abs(cyd - .475) > .13) {
        hint(TL("Move your face into the oval", "Schieb dein Gesicht ins Oval"));
        ok = false;
      }
      else
        lastBox = { x: 1 - box.x - box.w, y: box.y, w: box.w, h: box.h }; /* in the mirrored photo */
    }
    if (ok && diff > 9) {
      hint(TL("Hold still…", "Halt still…"));
      ok = false;
    }
    if (ok) {
      hint(TL("Perfect – stay like this", "Perfekt – so bleiben"));
      steady++;
    }
    else
      steady = Math.max(0, steady - 2);
    ring(Math.min(1, steady / NEED));
    if (steady >= NEED) {
      clearInterval(SC.timer);
      scanGrab(v);
      SC.box = lastBox;
      hint(TL("Done!", "Fertig!"));
      setTimeout(() => { scanStopCam(); scanAdjust(); }, 700);
    }
    busy = false;
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
  if (SC.box)
    Object.assign(SC, autoCrop(SC.box, SC.img));
  SC.box = null;
  SC.fromCam = false;
  b.innerHTML = `<h2>${TL("Fit your face in the oval", "Passe dein Gesicht ins Oval ein")}</h2><p class="scanp">${TL("Drag to move, use the slider to zoom. Eyebrows to chin should fill the oval.", "Ziehen zum Verschieben, Regler zum Zoomen. Von den Augenbrauen bis zum Kinn sollte das Oval gefüllt sein.")}</p>
 <div class="adjwrap"><canvas id="adjCv" width="300" height="352"></canvas><svg viewBox="0 0 300 352" class="adjguide" aria-hidden="true"><defs><mask id="adjHole"><rect width="300" height="352" fill="#fff"/><ellipse cx="150" cy="176" rx="120" ry="141" fill="#000"/></mask></defs><rect width="300" height="352" fill="rgba(10,18,15,.62)" mask="url(#adjHole)"/><ellipse cx="150" cy="176" rx="120" ry="141" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/><g class="adjticks">${ovalTicks(150, 176, 126, 147, 10)}</g></svg></div>
 <input type="range" id="adjZoom" min="1" max="3.5" step=".01" value="${SC.zoom}" aria-label="${t("aria").zoom}">
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
  $("#adjOk").onclick = () => { const out = document.createElement("canvas"); out.width = 240; out.height = 282; out.getContext("2d").drawImage(cv, 30, 35, 240, 282, 0, 0, 240, 282); S.face = out.toDataURL("image/jpeg", .82); S.scanned = true; save(); SC.img = null; ageFaces().then(scanReveal); };
}
function scanReveal() {
  const b = $("#scanBody");
  const col = (src, cls, lab, sub) => `<div class="rv ${cls}"><img src="${src}" alt=""><b>${lab}</b><small>${sub}</small></div>`;
  b.innerHTML = `<h2>${TL("This is you", "Das bist du")}</h2><div class="rvrow">${col(S.face, "", TL("Today", "Heute"), TL("as you are", "so wie du bist"))}${col(agedFace(true), "rva", "75", TL("Path A · without exercise", "Weg A · ohne Bewegung"))}${col(agedFace(false), "rvb", "75", TL("Path B · with exercise", "Weg B · mit Bewegung"))}</div>
 <p class="scanp">${TL("Same person – the difference is twenty years of small choices. You'll see both paths in two short films.", "Dieselbe Person – der Unterschied sind zwanzig Jahre kleiner Entscheidungen. Beide Wege siehst du gleich in zwei kurzen Filmen.")}</p>
 <button class="btn lime" id="rvGo">${TL("Choose my goal", "Mein Ziel wählen")}</button>`;
  $("#rvGo").onclick = () => scanClose();
}
function faceRow() {
  return S.face ? `<div class="card setrow"><img src="${S.face}" alt="" style="width:52px;height:62px;border-radius:50%;object-fit:cover"><span class="muted" style="flex:1;min-width:0">${TL("Your face appears as a portrait in your films and under \"Me at 75\". Stored only on this phone.", "Dein Gesicht erscheint als Porträt in deinen Filmen und unter „Ich mit 75“. Nur auf diesem Handy gespeichert.")}</span><button class="btn small dark" data-face-scan>${TL("Scan again", "Neu scannen")}</button><button class="btn small out" data-face-del style="border-color:var(--danger);color:var(--danger)">${TL("Delete my face", "Gesicht löschen")}</button></div>`
    : `<div class="card setrow"><span class="muted" style="flex:1;min-width:0">${TL("No face scan yet – optional, for your portrait in the films.", "Noch kein Gesichtsscan – optional, für dein Porträt in den Filmen.")}</span><button class="btn small dark" data-face-scan>${TL("Scan my face", "Gesicht scannen")}</button></div>`;
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
    S.faceOld = null;
    S.scanned = false;
    save();
    renderText();
    toast(TL("Your face photo was deleted from this phone.", "Dein Gesichtsfoto wurde von diesem Handy gelöscht."));
    return;
  }
});
