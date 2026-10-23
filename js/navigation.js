/* ================= NAVIGATION ================= */
function go(id) {
  stopPath();
  $$(".screen").forEach(s => s.hidden = true);
  $("#main").hidden = true;
  const el = $("#" + id);
  el.hidden = false;
  el.scrollTop = 0;
  if (id === "s4")
    setTimeout(() => refreshMap("mapA"), 80);
  if (id === "s5")
    renderDetail();
  if (id === "s6")
    renderConfirm();
}
function openMain(tab) {
  stopPath();
  $$(".screen").forEach(s => s.hidden = true);
  $("#main").hidden = false;
  S.onboarded = true;
  save();
  renderAvatar();
  renderExplore();
  renderCommunity();
  renderSettings($("#settingsBody"));
  setTab(tab || S.tab || "avatar");
  try {
    navigator.permissions && navigator.permissions.query({ name: "geolocation" }).then(r => { if (r.state === "granted" && !me)
      askLocation(); }).catch(() => { });
  }
  catch (e) { }
}
function setTab(k) {
  if (k === "avatar" && !avRAF)
    setTimeout(() => renderAvatarStage(score()), 0);
  S.tab = k;
  save();
  $$(".tab").forEach(x => x.hidden = x.id !== "tab-" + k);
  $$(".nav [data-tab]").forEach(b => { if (b.dataset.tab === k)
    b.setAttribute("aria-current", "page");
  else
    b.removeAttribute("aria-current"); });
  $("#tab-" + k).scrollTop = 0;
  if (k === "map")
    setTimeout(() => refreshMap("mapB"), 80);
  if (k === "avatar")
    renderAvatar();
}
document.addEventListener("click", e => {
  const g = e.target.closest("[data-go]");
  if (g) {
    go(g.dataset.go);
    return;
  }
  const tb = e.target.closest("[data-tab]");
  if (tb) {
    if ($("#main").hidden)
      openMain(tb.dataset.tab);
    else
      setTab(tb.dataset.tab);
    return;
  }
  if (e.target.closest("[data-share]")) {
    share();
    return;
  }
  if (e.target.closest("[data-loc]")) {
    askLocation();
    return;
  }
  if (e.target.closest("[data-open-settings]")) {
    $("#setSheet").hidden = false;
    renderSettings($("#setSheetBody"), true);
    return;
  }
  if (e.target.closest("[data-cal]")) {
    saveIcs();
    return;
  }
  if (e.target.closest("[data-friend]")) {
    invite();
    return;
  }
  const pb = e.target.closest("[data-play],[data-play-big]");
  if (pb) {
    startPath(pb.dataset.play || pb.dataset.playBig);
    return;
  }
});
document.addEventListener("submit", e => { const f = e.target.closest("[data-plzform]"); if (f) {
  e.preventDefault();
  setPlz(f.querySelector("[data-plz]").value.trim());
} });
document.addEventListener("change", e => { if (e.target.matches("[data-radius]"))
  setRadius(+e.target.value); });
document.addEventListener("input", e => { if (e.target.matches("[data-plz]")) {
  e.target.value = e.target.value.replace(/\D/g, "");
  if (e.target.value.length === 5)
    setPlz(e.target.value);
} });
$("#setSheet").onclick = e => { if (e.target.id === "setSheet")
  $("#setSheet").hidden = true; };
$("#showPaths").onclick = () => go("s2");
$("#scanBtn").onclick = () => scanOpen();
const findGroup = () => { go("s4"); if (!me)
  askLocation(); };
$("#chooseB").onclick = findGroup;
document.addEventListener("click", e => {
  if (e.target.closest("[data-findgroup]"))
    findGroup();
  const r = e.target.closest("[data-replay]");
  if (r)
    startPath(r.dataset.replay);
});
$("#aplus").onclick = () => { S.size = S.size >= 20 ? 16 : S.size + 2; applySize(); save(); renderText(); };
function applySize() { document.documentElement.style.setProperty("--fs", S.size + "px"); }
$("#detailBack").onclick = () => { if (S.onboarded)
  openMain("map");
else
  go("s4"); };
function doJoin() {
  const v = $("#insNo").value.trim().toUpperCase().replace(/\s/g, ""), err = $("#insErr");
  if (!/^[A-Z]\d{9}$/.test(v)) {
    err.textContent = t("insErr");
    err.hidden = false;
    err.scrollIntoView({ block: "center", behavior: "smooth" });
    return;
  }
  if (!$("#consent").checked) {
    err.textContent = t("consentErr");
    err.hidden = false;
    err.scrollIntoView({ block: "center", behavior: "smooth" });
    return;
  }
  err.hidden = true;
  $("#insNo").value = v;
  /* accounts from before the sign-up asked for it: store it once, so it's never asked again */
  if (S.account && !S.account.ins)
    S.account = { ...S.account, ins: v };
  const fresh = !S.joined.includes(S.group);
  if (fresh)
    S.joined.push(S.group);
  save();
  renderGroups();
  go("s6");
  if (fresh && S.joined.length <= PTS.joinMax)
    toast(t("ptsJoined")(PTS.join));
}
$("#join").addEventListener("click", doJoin);
$("#insForm").addEventListener("submit", e => { e.preventDefault(); doJoin(); });
$("#openApp").onclick = () => openMain("avatar");
$("#checkin").onclick = () => doCheckin();
$("#avStage").onclick = () => { const L = lvlOf(score()), arr = L >= 2 ? [...t("taps")[L], t("goalTaps")[S.goal]] : t("taps")[L], m = arr[Math.floor(Math.random() * arr.length)]; const st = $("#avStage"); const old = st.querySelector(".bubble"); if (old)
  old.remove(); const d = document.createElement("div"); d.className = "bubble"; d.textContent = m; st.appendChild(d); try {
  speechSynthesis.cancel();
}
catch (e) { } say(m.replace(/[“”„]/g, ""), "adult"); setTimeout(() => d.remove(), 3800); };
$("#avStage").onkeydown = e => { if (e.key === "Enter" || e.key === " ") {
  e.preventDefault();
  $("#avStage").click();
} };
$("#simGood").onclick = () => { const n = new Date(); for (let i = 0; i < 28; i += 3) {
  const d = new Date(n);
  d.setDate(n.getDate() - i);
  const k = dayKey(d);
  if (!S.checkins.includes(k))
    S.checkins.push(k);
} if (!S.joined.length)
  S.joined.push("w"); save(); renderAvatar(); };
$("#simBad").onclick = () => { const n = new Date(); n.setDate(n.getDate() - 24); S.checkins = [dayKey(n)]; S.tracker = null; save(); renderAvatar(); };
$("#simReset").onclick = () => { S.checkins = []; save(); renderAvatar(); };
async function shareText(txt) { try {
  if (navigator.share) {
    await navigator.share({ text: txt });
    return;
  }
}
catch (e) {
  if (e && e.name === "AbortError")
    return;
} try {
  await navigator.clipboard.writeText(txt);
  toast(t("copied"));
}
catch (e) {
  toast(txt);
} }
function share() { shareText(t("shareText")); }
function invite() { const g = GR(), d = nextDate(g); shareText(t("invite")(nm(g), `${t("daysLong")[d.getDay()]} ${d.getDate()}. ${t("months")[d.getMonth()]}`, g.time)); }
async function saveIcs() {
  const g = GR(), d = nextDate(g);
  const [h, m] = g.time.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  const e = new Date(d.getTime() + 60 * 60000);
  const f = x => x.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const by = g.days.map(x => ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][x]).join(",");
  const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Two Paths//EN\r\nBEGIN:VEVENT\r\nUID:${g.id}-${Date.now()}@twopaths\r\nDTSTAMP:${f(new Date())}\r\nDTSTART:${f(d)}\r\nDTEND:${f(e)}\r\nRRULE:FREQ=WEEKLY;BYDAY=${by};COUNT=20\r\nSUMMARY:${nm(g)}\r\nLOCATION:${pl(g)}\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;
  const name = "two-paths-group.ics";
  if (window.claude && window.claude.use) {
    try {
      const dl = await window.claude.use("downloads");
      if (dl) {
        await dl.save({ filename: name, data: ics });
        toast(t("calSaved"));
        return;
      }
    }
    catch (err) {
      toast(t("calFail"));
      return;
    }
  }
  try {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast(t("calSaved"));
  }
  catch (err) {
    toast(t("calFail"));
  }
}
