/* ================= GEO ================= */
function offsetLL([lat, lng], [e, n]) { return [lat + n / 111.32, lng + e / (111.32 * Math.cos(lat * Math.PI / 180))]; }
function dist(a, b) { const r = x => x * Math.PI / 180, dLa = r(b[0] - a[0]), dLo = r(b[1] - a[1]); const h = Math.sin(dLa / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(dLo / 2) ** 2; return 12742 * Math.asin(Math.sqrt(h)); }
let me = null;
const allGroups = () => [...S.own.map(o => ({ ...o, own: true })), ...GROUPS];
const gpos = g => g.ll || offsetLL(S.center, g.off);
const gdist = g => dist(me || S.center, gpos(g));
const fmtKm = v => (Math.round(v * 10) / 10).toLocaleString(S.lang === "de" ? "de-DE" : "en-GB");
const maps = {};
const RADII = [1, 2, 5, 10];
if (!RADII.includes(S.radius))
  S.radius = 2;
const radiusOpts = () => RADII.map(k => `<option value="${k}"${S.radius === k ? " selected" : ""}>${t("within")(k)}</option>`).join("");
function makeMap(id) {
  const wrap = $("#" + id);
  wrap.innerHTML = `<div class="tpmap"></div>
   <div class="search">${id === "mapA" ? `<button class="round" data-mapback aria-label="Back">${ICON.arrow}</button>` : ""}<form data-plzform>${ICON.search}<input inputmode="numeric" maxlength="5" aria-label="Postcode" data-plz value="${S.plz}"><select class="rad" data-radius aria-label="${t("radiusL")}">${radiusOpts()}</select></form></div>
   <button class="locbtn" data-loc>${ICON.loc}<span data-t="useLoc">${t("useLoc")}</span></button>`;
  const mb = wrap.querySelector("[data-mapback]");
  if (mb)
    mb.onclick = () => go("s3");
  const el = wrap.querySelector(".tpmap");
  const M = { el, markers: [] };
  maps[id] = M;
  if (window.L) {
    const map = L.map(el, { zoomControl: false, zoomSnap: 0.25 }).setView(S.center, 13);
    M.map = map;
    L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);
    M.ring = L.circle(S.center, { radius: S.radius * 1000, color: "#1F7A55", weight: 2, fillColor: "#C8F06A", fillOpacity: .12, interactive: false }).addTo(map);
    fitMap(M);
    if (window.ResizeObserver)
      new ResizeObserver(() => { map.invalidateSize(); fitMap(M); }).observe(el);
    let loaded = 0, errs = 0;
    const tl = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap" }).addTo(map);
    tl.on("tileload", () => loaded++);
    tl.on("tileerror", () => { errs++; if (!loaded && errs > 2) {
      el.classList.add("notiles");
      map.removeLayer(tl);
    } });
  }
  else
    el.classList.add("notiles");
}
function drawMarkers() {
  Object.values(maps).forEach(M => {
    if (!M.map)
      return;
    M.markers.forEach(m => m.remove());
    M.markers = [];
    allGroups().filter(g => S.filter === "all" || g.type === S.filter).forEach(g => {
      const ic = L.divIcon({ className: "", html: `<div class="pin${S.group === g.id ? " on" : ""}${g.own ? " own" : ""}">${ICON[g.type]}</div>`, iconSize: [52, 52], iconAnchor: [26, 26] });
      const mk = L.marker(gpos(g), { icon: ic, title: nm(g) }).addTo(M.map);
      mk.on("click", () => { S.group = g.id; renderGroups(); renderDetail(); });
      M.markers.push(mk);
    });
    M.markers.push(L.marker(me || S.center, { icon: L.divIcon({ className: "", html: '<div class="me"></div>', iconSize: [38, 38], iconAnchor: [19, 19] }), interactive: false, zIndexOffset: -100 }).addTo(M.map));
  });
}
/* zoom so the whole search radius is visible (top padding = search bar) */
function fitMap(M) {
  if (!M.map || !M.el.offsetWidth)
    return; /* hidden map: refreshMap() fits it when shown */
  const c = L.latLng(me || S.center);
  M.ring.setLatLng(c).setRadius(S.radius * 1000);
  M.map.fitBounds(c.toBounds(S.radius * 2000), { paddingTopLeft: [16, 80], paddingBottomRight: [16, 16] });
}
function refreshMap(id) { const M = maps[id]; if (M && M.map) {
  M.map.invalidateSize();
  fitMap(M);
} }
function recenter() { Object.values(maps).forEach(fitMap); }
function setRadius(k) {
  S.radius = k;
  save();
  $$("[data-radius]").forEach(el => el.value = k);
  recenter();
  renderGroups();
}
function locMsg(m) { $$("[data-locmsg]").forEach(e => e.textContent = m); }
let locNote = null;
function askLocation() {
  if (!("geolocation" in navigator)) {
    locNote = "denied";
    locMsg(t("locDenied"));
    return;
  }
  locNote = "locating";
  locMsg(t("locating"));
  try {
    navigator.geolocation.getCurrentPosition(p => { me = [p.coords.latitude, p.coords.longitude]; S.center = me.slice(); S.useGeo = true; save(); locNote = "on"; locMsg(t("locOn")); recenter(); renderGroups(); startWatch(); renderSettingsAll(); plzFromLL(me); }, () => { me = null; S.useGeo = false; save(); locNote = "denied"; locMsg(t("locDenied")); renderSettingsAll(); }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
  }
  catch (e) {
    locNote = "denied";
    locMsg(t("locDenied"));
  }
}
/* fill in the postcode for the GPS position: online lookup, else the nearest demo postcode */
async function plzFromLL(ll) {
  let v = null;
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${ll[0]}&lon=${ll[1]}&format=json&zoom=18&addressdetails=1`);
    const j = await r.json();
    const pc = j.address && j.address.postcode;
    if (/^\d{5}$/.test(pc || ""))
      v = pc;
  }
  catch (e) { }
  if (!v) {
    const near = Object.keys(PLZ).map(k => [k, dist(ll, PLZ[k])]).sort((a, b) => a[1] - b[1])[0];
    if (near && near[1] < 5)
      v = near[0];
  }
  if (!v)
    return;
  S.plz = v;
  save();
  $$("[data-plz]").forEach(i => i.value = v);
}
async function setPlz(v) {
  if (!/^\d{5}$/.test(v))
    return;
  let ll = PLZ[v], approx = false;
  if (!ll) {
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${v}&country=de&format=json&limit=1`);
      const j = await r.json();
      if (j[0])
        ll = [+j[0].lat, +j[0].lon];
    }
    catch (e) { }
  }
  if (!ll && PLZ2[v.slice(0, 2)]) {
    ll = PLZ2[v.slice(0, 2)];
    approx = true;
  }
  if (!ll) {
    locMsg(t("plzUnknown"));
    return;
  }
  S.plz = v;
  S.center = ll;
  me = null;
  S.useGeo = false;
  save();
  $$("[data-plz]").forEach(i => i.value = v);
  locNote = "plz";
  locMsg(approx ? t("plzApprox")(v) : t("locPlz")(v));
  recenter();
  renderGroups();
}
let watchId = null;
function startWatch() { if (watchId !== null || !("geolocation" in navigator))
  return; try {
  watchId = navigator.geolocation.watchPosition(p => { me = [p.coords.latitude, p.coords.longitude]; checkFence(); }, () => { }, { enableHighAccuracy: true, maximumAge: 30000 });
}
catch (e) { } }
function checkFence() {
  const b = $("#geoBanner");
  if (!me) {
    b.hidden = true;
    return;
  }
  const near = allGroups().find(g => S.joined.includes(g.id) && dist(me, gpos(g)) < 0.15);
  if (near && !S.checkins.includes(dayKey(new Date()))) {
    b.hidden = false;
    b.innerHTML = `<div class="banner">${ICON.pin}<span style="flex:1;min-width:0">${esc(t("geoHere")(nm(near)))}</span><button class="btn small dark" id="fenceIn">${t("geoCheck")}</button></div>`;
    $("#fenceIn").onclick = () => { doCheckin(near.id); b.hidden = true; };
  }
  else
    b.hidden = true;
}
