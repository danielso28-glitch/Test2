/* ================= FITNESS TRACKER (demo connection) ================= */
const TRACKERS = ["Apple Health", "Health Connect", "Garmin", "Fitbit", "Withings"];
const TRCOL = { "Apple Health": "#E8475B", "Health Connect": "#3A7BD5", "Garmin": "#1B1B1B", "Fitbit": "#00B0B9", "Withings": "#4A5A6A" };
/* inline text in all three languages; locale for numbers and dates */
const TL = (en, de, es) => S.lang === "de" ? de : S.lang === "es" && es !== undefined ? es : en;
const LOC = () => ({ de: "de-DE", es: "es-ES" })[S.lang] || "en-GB";
function stepsOn(d) { const k = d.getDate() * 7919 + d.getMonth() * 131 + d.getDay() * 977; return 3100 + (k % 7400); }
function week() { if (S.health)
  return healthWeek(); const out = []; for (let i = 6; i >= 0; i--) {
  const d = new Date();
  d.setDate(d.getDate() - i);
  out.push([d, i === 0 ? steps() : stepsOn(d)]);
} return out; }
function barsHtml() {
  const w = week(), mx = Math.max(...w.map(x => x[1]), 8000);
  const dn = TL(["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"], ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"]);
  return `<div class="bars7" role="img" aria-label="${TL("Steps, last 7 days", "Schritte, letzte 7 Tage", "Pasos, últimos 7 días")}">${w.map(([d, v]) => `<div><small>${(v / 1000).toFixed(1)}k</small><b class="${v < 6000 ? "low" : ""}" style="height:${Math.round(v / mx * 80)}%"></b><small>${dn[d.getDay()]}</small></div>`).join("")}</div>`;
}
function trackerCard() {
  if (S.tracker) {
    const ago = S.trSync ? Math.max(0, Math.round((Date.now() - new Date(S.trSync)) / 60000)) : 0;
    return `<div class="card"><div class="trhead"><span class="trlogo" style="background:${TRCOL[S.tracker] || "#333"}">${S.tracker[0]}</span><div style="flex:1;min-width:0"><b>${S.tracker}</b> ${S.health ? `<span class="realtag">${t("health").real}</span>` : `<span class="demo">DEMO</span>`}<p class="hint">${TL("Connected", "Verbunden", "Conectado")} · ${TL("last sync", "zuletzt synchronisiert", "última sincronización")} ${ago < 1 ? TL("just now", "gerade eben", "ahora mismo") : ago + " min"}</p></div></div>
  <p style="margin:14px 0 0;font-weight:700">${steps().toLocaleString(LOC())} ${S.health ? t("health").avg : TL("steps today", "Schritte heute", "pasos hoy")}</p>${S.health ? `<p class="hint" style="margin:2px 0 0">${t("health").from(new Date(S.health.at).toLocaleDateString(S.lang === "de" ? "de-DE" : "en-GB"))}</p>` : ""}${barsHtml()}
  <p class="hint" style="margin-top:10px">${TL("Days over 6,000 steps make your future self stronger.", "Tage über 6.000 Schritten machen dein Zukunfts-Ich stärker.", "Los días con más de 6.000 pasos hacen más fuerte a tu yo del futuro.")}</p>
  <div style="display:flex;gap:10px;margin-top:14px">${S.health ? "" : `<button class="btn small dark" data-trsync>${TL("Sync now", "Jetzt synchronisieren", "Sincronizar ahora")}</button>`}<button class="btn small out" data-trdis>${TL("Disconnect", "Trennen", "Desconectar")}</button></div></div>${healthImportCard()}`;
  }
  return `<p class="hint">${t("trackerD")}</p><div class="card" style="padding:8px 16px">${TRACKERS.map(n => `<button class="perm" data-tr="${n}" style="width:100%;text-align:left"><span class="trlogo" style="background:${TRCOL[n]};width:40px;height:40px;border-radius:12px;font-size:1rem">${n[0]}</span><span><b>${n}</b><small>${n === "Apple Health" ? "iPhone, Apple Watch" : n === "Health Connect" ? "Android, Samsung, Google" : n === "Garmin" ? "Garmin watches" : n === "Fitbit" ? "Fitbit, Pixel Watch" : "Withings watches & scales"}</small></span><span aria-hidden="true">›</span></button>`).join("")}</div>${healthImportCard()}`;
}
let TRF = {};
function openTracker(name, resync) { TRF = { name, step: resync ? 2 : 1, perm: S.trPerm || { steps: true, active: true, hr: false, sleep: false } }; $("#trSheet").hidden = false; trStep(); }
function trStep() {
  const b = $("#trBody"), n = TRF.name, col = TRCOL[n] || "#333";
  if (TRF.step === 1) {
    const P = [["steps", TL("Steps", "Schritte", "Pasos"), TL("Counts towards your score", "Zählt für deinen Score", "Cuenta para tu puntuación")], ["active", TL("Active minutes", "Aktive Minuten", "Minutos activos"), TL("Walks, cycling, workouts", "Spaziergänge, Radfahren, Training", "Paseos, bici, entrenamientos")], ["hr", TL("Resting heart rate", "Ruhepuls", "Pulso en reposo"), TL("Optional, for your energy value", "Optional, für deinen Energiewert", "Opcional, para tu valor de energía")], ["sleep", TL("Sleep", "Schlaf", "Sueño"), TL("Optional", "Optional", "Opcional")]];
    b.innerHTML = `<div class="trlink"><span class="trlogo" style="background:var(--ink);color:var(--lime)">TP</span><i></i><span class="trlogo" style="background:${col}">${n[0]}</span></div>
  <h2 style="text-align:center;margin:8px 0 2px">${TL("Connect", "Verbinde", "Conectar")} ${n} <span class="demo">DEMO</span></h2>
  <p class="hint" style="text-align:center">${TL("Two Paths would like to read this data. Choose what you share.", "Two Paths möchte diese Daten lesen. Du wählst, was du teilst.", "Two Paths quiere leer estos datos. Elige qué compartes.")}</p>
  <div class="card" style="padding:4px 18px;margin-top:12px">${P.map(([k, a, c]) => `<div class="perm"><span><b>${a}</b><small>${c}</small></span><button class="sw" role="switch" aria-label="${a}" aria-checked="${!!TRF.perm[k]}" data-perm="${k}"></button></div>`).join("")}</div>
  <p class="hint" style="margin:12px 2px">🔒 ${TL("Read-only. Your data stays on this phone and is never shared with your insurer. You can disconnect any time.", "Nur lesen. Deine Daten bleiben auf dem Handy und gehen nie an deine Krankenkasse. Du kannst jederzeit trennen.", "Solo lectura. Tus datos se quedan en este móvil y nunca se comparten con tu seguro médico. Puedes desconectar cuando quieras.")}</p>
  <button class="btn dark" id="trAllow">${TL("Allow and connect", "Erlauben und verbinden", "Permitir y conectar")}</button><button class="btn" id="trCancel" style="margin-top:6px">${TL("Not now", "Nicht jetzt", "Ahora no")}</button>`;
    b.querySelectorAll("[data-perm]").forEach(x => x.onclick = () => { TRF.perm[x.dataset.perm] = !TRF.perm[x.dataset.perm]; x.setAttribute("aria-checked", TRF.perm[x.dataset.perm]); });
    $("#trAllow").onclick = () => { if (!TRF.perm.steps && !TRF.perm.active) {
      toast(TL("Please allow steps or active minutes.", "Bitte Schritte oder aktive Minuten erlauben.", "Permite al menos los pasos o los minutos activos."));
      return;
    } TRF.step = 2; trStep(); };
    $("#trCancel").onclick = () => $("#trSheet").hidden = true;
    return;
  }
  if (TRF.step === 2) {
    b.innerHTML = `<h2 style="text-align:center;margin:8px 0 0">${TL("Syncing", "Synchronisiere", "Sincronizando")} ${n}…</h2><svg class="ring" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="none" stroke="var(--line)" stroke-width="10"/><circle id="trArc" cx="60" cy="60" r="50" fill="none" stroke="var(--green)" stroke-width="10" stroke-linecap="round" stroke-dasharray="314" stroke-dashoffset="314" transform="rotate(-90 60 60)"/><text id="trPct" x="60" y="68" text-anchor="middle" font-weight="800" font-size="24" fill="var(--ink)">0%</text></svg><p class="hint" style="text-align:center" id="trMsg"></p>`;
    const msgs = [TL("Reading the last 7 days…", "Lese die letzten 7 Tage…", "Leyendo los últimos 7 días…"), TL("Counting steps…", "Zähle Schritte…", "Contando pasos…"), TL("Updating your future self…", "Aktualisiere dein Zukunfts-Ich…", "Actualizando a tu yo del futuro…")];
    const t0 = performance.now();
    const tick = now => {
      if ($("#trSheet").hidden)
        return;
      const p = Math.min(1, (now - t0) / 2600);
      $("#trArc").setAttribute("stroke-dashoffset", (314 * (1 - p)).toFixed(1));
      $("#trPct").textContent = Math.round(p * 100) + "%";
      $("#trMsg").textContent = msgs[Math.min(2, Math.floor(p * 3))];
      if (p < 1)
        requestAnimationFrame(tick);
      else {
        const before = score();
        S.tracker = n;
        S.trPerm = TRF.perm;
        S.trSync = new Date().toISOString();
        save();
        TRF.gain = Math.max(1, score() - before);
        TRF.step = 3;
        trStep();
      }
    };
    requestAnimationFrame(tick);
    return;
  }
  const tot = week().reduce((a, x) => a + x[1], 0);
  b.innerHTML = `<div style="text-align:center;font-size:2.4rem">✓</div><h2 style="text-align:center;margin:0">${n} ${TL("connected", "verbunden", "conectado")}</h2>
 <div class="card" style="margin-top:12px"><b>${tot.toLocaleString(LOC())} ${TL("steps in the last 7 days", "Schritte in den letzten 7 Tagen", "pasos en los últimos 7 días")}</b>${barsHtml()}</div>
 <p style="text-align:center;font-weight:700;margin:14px 0">${TL("Your future self got", "Dein Zukunfts-Ich bekommt", "Tu yo del futuro ha ganado")} +${TRF.gain} ${TL("points", "Punkte", "puntos")} 💪</p>
 <button class="btn dark" id="trDone">${TL("See my avatar", "Meinen Avatar ansehen", "Ver mi avatar")}</button>`;
  $("#trDone").onclick = () => { $("#trSheet").hidden = true; renderText(); openMain("avatar"); };
}
