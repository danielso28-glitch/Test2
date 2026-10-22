/* ================= APPLE HEALTH EXPORT (real steps, read on the phone) ================= */
/* iPhone: Health → profile picture → Export All Health Data → save the zip → choose it here.
   The zip (often 100+ MB) is streamed: only StepCount records of the last 60 days are kept, nothing leaves the phone.
   iPhone and Apple Watch often both count the same steps, so per day we take the source with the most steps instead of adding them up. */
const FFLATE_URL = "https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js";
const STEP_RE = /<Record type="HKQuantityTypeIdentifierStepCount"[^>]*?sourceName="([^"]*)"[^>]*?startDate="(\d{4}-\d{2}-\d{2})[^"]*"[^>]*?value="([\d.]+)"/g;
function loadFflate() {
  if (window.fflate)
    return Promise.resolve(window.fflate);
  return new Promise((ok, no) => { const s = document.createElement("script"); s.src = FFLATE_URL; s.onload = () => ok(window.fflate); s.onerror = () => no(new Error("fflate")); document.head.appendChild(s); });
}
/* text chunks in, { "YYYY-MM-DD": steps } out */
function stepCollector(since) {
  const per = {};
  let rest = "";
  return {
    push(txt) {
      const s = rest + txt, cut = s.lastIndexOf("<");
      rest = cut >= 0 ? s.slice(cut) : "";
      const body = cut >= 0 ? s.slice(0, cut) : s;
      for (const m of body.matchAll(STEP_RE)) {
        if (m[2] < since)
          continue;
        const d = per[m[2]] || (per[m[2]] = {});
        d[m[1]] = (d[m[1]] || 0) + parseFloat(m[3]);
      }
    },
    days() {
      this.push("<");
      const out = {};
      for (const [day, src] of Object.entries(per))
        out[day] = Math.round(Math.max(...Object.values(src)));
      return out;
    }
  };
}
async function importHealth(file, onProgress) {
  const since = dayKey(new Date(Date.now() - 60 * 864e5)), col = stepCollector(since), dec = new TextDecoder();
  let found = false, read = 0;
  const isZip = /\.zip$/i.test(file.name) || file.type.includes("zip");
  let unzip = null;
  if (isZip) {
    const F = await loadFflate();
    unzip = new F.Unzip(f => {
      if (!/(^|\/)export\.xml$/.test(f.name))
        return;
      found = true;
      const d2 = new TextDecoder();
      f.ondata = (err, chunk, final) => { if (!err)
        col.push(d2.decode(chunk, { stream: !final })); };
      f.start();
    });
    unzip.register(F.UnzipInflate);
  }
  const reader = file.stream().getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done)
      break;
    read += value.length;
    if (unzip)
      unzip.push(value);
    else {
      found = true;
      col.push(dec.decode(value, { stream: true }));
    }
    onProgress && onProgress(read / file.size);
  }
  if (unzip)
    unzip.push(new Uint8Array(0), true);
  const days = col.days();
  if (!found || !Object.keys(days).length)
    throw new Error(found ? "nosteps" : "noexport");
  return days;
}
/* settings: the import card under the tracker list / the connected tracker */
function healthImportCard() {
  const H = t("health");
  return `<div class="card hicard"><b>${H.title}</b><span class="muted">${H.how}</span>
   <label class="btn dark small filebtn">${S.health ? H.again : H.btn}<input type="file" accept=".zip,.xml,application/zip,text/xml" data-healthfile hidden></label>
   <div class="hiprog" hidden><i></i></div><span class="hint" style="margin:0">${H.privacy}</span></div>`;
}
function bindHealthImport(box) {
  box.querySelectorAll("[data-healthfile]").forEach(inp => inp.onchange = async () => {
    const f = inp.files && inp.files[0], H = t("health");
    if (!f)
      return;
    const card = inp.closest(".hicard"), bar = card.querySelector(".hiprog");
    bar.hidden = false;
    try {
      const days = await importHealth(f, p => bar.firstElementChild.style.width = Math.round(p * 100) + "%");
      S.health = { days, at: new Date().toISOString() };
      S.tracker = "Apple Health";
      S.trSync = S.health.at;
      save();
      renderText();
      toast(H.done(Object.keys(days).length));
    }
    catch (e) {
      bar.hidden = true;
      toast(e.message === "nosteps" ? H.errSteps : e.message === "noexport" ? H.errFile : H.errLoad);
    }
  });
}
