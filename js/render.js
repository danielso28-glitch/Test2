/* ================= RENDER ================= */
const sched = g => g.days.map(x => t("days")[x]).join(" & ");
function renderText() {
  document.documentElement.lang = S.lang;
  $$("[data-t]").forEach(el => { const v = t(el.dataset.t); if (typeof v === "string")
    el.textContent = v; });
  $$("[data-aria]").forEach(el => el.setAttribute("aria-label", t("aria")[el.dataset.aria]));
  $$("[data-radius]").forEach(el => { el.innerHTML = radiusOpts(); el.setAttribute("aria-label", t("radiusL")); });
  S.scanned = !!S.face;
  $$("[data-scanlabel]").forEach(el => el.textContent = S.scanned ? t("fromScan") : t("noScan"));
  {
    const sb = $("#scanBtn");
    if (sb) {
      if (!sb.dataset.orig)
        sb.dataset.orig = sb.querySelector(".face").innerHTML;
      sb.querySelector(".face").innerHTML = S.face ? `<img src="${S.face}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">` : sb.dataset.orig;
      const tt = sb.querySelector("[data-t=scanT]");
      if (S.face && tt) {
        tt.textContent = TL("Face scanned ✓", "Gesicht gescannt ✓");
        sb.querySelector("[data-t=scanD]").textContent = TL("Tap to scan again. Your photo stays on this device.", "Tippen zum Neu-Scannen. Dein Foto bleibt auf diesem Gerät.");
      }
    }
  }
  $$("[data-goal-short]").forEach(el => el.textContent = GOALTXT[S.lang][S.goal]);
  const g = $("#goals");
  g.innerHTML = "";
  /* several goals possible; the first one (S.goal) decides the film ending */
  if (!S.goals || !S.goals.length)
    S.goals = [S.goal];
  GOALS.forEach(k => { const b = document.createElement("button"); b.className = "opt"; const on = S.goals.includes(k); b.setAttribute("aria-pressed", on); b.innerHTML = ICON[k] + `<span>${GOALTXT[S.lang][k]}</span>` + (k === S.goal && S.goals.length > 1 ? `<em class="optfilm">${t("goalFilm")}</em>` : ""); b.onclick = () => { S.goals = on ? (S.goals.length > 1 ? S.goals.filter(x => x !== k) : S.goals) : [...S.goals, k]; S.goal = S.goals[0]; save(); renderText(); }; g.appendChild(b); });
  if (!play) {
    renderStill("A");
    renderStill("B");
  }
  $$("[data-avatar]").forEach(e => e.innerHTML = chipAvatar(e.dataset.avatar));
  if (locNote)
    locMsg(locNote === "on" ? t("locOn") : locNote === "denied" ? t("locDenied") : locNote === "locating" ? t("locating") : t("locPlz")(S.plz));
  else
    locMsg(t("locPlz")(S.plz));
  renderGroups();
  renderDetail();
  renderConfirm();
  if (!$("#main").hidden) {
    renderAvatar();
    renderExplore();
    renderCommunity();
    renderSettings($("#settingsBody"));
  }
  if (!$("#setSheet").hidden)
    renderSettings($("#setSheetBody"), true);
}
function renderGroups() {
  $$("[data-chips]").forEach(ch => { ch.innerHTML = ""; ["all", "walking", "dancing", "football", "back", "yoga", "cycling"].forEach(k => { const b = document.createElement("button"); b.textContent = t(k); b.setAttribute("aria-pressed", S.filter === k); b.onclick = () => { S.filter = k; renderGroups(); }; ch.appendChild(b); }); });
  const vis = allGroups().filter(g => (S.filter === "all" || g.type === S.filter) && gdist(g) <= S.radius + 0.3).sort((a, b) => gdist(a) - gdist(b));
  $$("[data-count]").forEach(e => e.textContent = vis.length === 1 ? t("groupNear") : t("groupsNear")(vis.length));
  $$("[data-list]").forEach(l => {
    l.innerHTML = vis.length ? "" : `<p class="empty">${t("noGroups")}</p>`;
    vis.forEach(g => {
      const b = document.createElement("button");
      b.className = "grp" + (S.group === g.id ? " on" : "");
      b.innerHTML = `<span class="ic" style="background:${TINT[g.type]}">${ICON[g.type]}</span><span class="tx"><b>${esc(nm(g))}</b><span class="m">${sched(g)} · ${g.time} · ${fmtKm(gdist(g))} km</span></span><span class="free">${S.joined.includes(g.id) ? t("joined") : t("free")}</span>`;
      b.onclick = () => { if (S.group === g.id)
        go("s5");
      else {
        S.group = g.id;
        renderGroups();
        renderDetail();
      } };
      l.appendChild(b);
    });
  });
  drawMarkers();
}
const GR = () => allGroups().find(g => g.id === S.group) || GROUPS[0];
function renderDetail() {
  const g = GR();
  $("#dName").textContent = nm(g);
  $("#dWhen").textContent = `${sched(g)} · ${g.time}`;
  $("#dPlace").textContent = pl(g) + (g.own ? "" : " (demo)");
  $("#dDist").textContent = t("fromYou")(fmtKm(gdist(g)));
  $("#dLed").textContent = g.vol || g.own ? t("ledVol") : t("led");
  $("#dTrainer").textContent = g.own ? "" : g.vol ? g.trainer : `${g.trainer}, ${t("certified")}`;
  $("#dSpots").textContent = t("spots")(g.taken, g.cap);
  const inG = S.joined.includes(g.id);
  const a = $("#alreadyIn");
  a.hidden = !inG;
  a.textContent = t("alreadyIn");
  renderGroupPts(g);
  /* insurance number was given at sign-up: don't ask again, just show it */
  const known = !!(S.account && S.account.ins);
  if (known && !inG)
    $("#insNo").value = S.account.ins;
  $$("#insForm .askins").forEach(e => e.hidden = known);
  const kn = $("#insKnown");
  kn.hidden = !known;
  if (known)
    kn.textContent = t("insFromAcc")(S.account.ins.slice(0, 3) + "••••" + S.account.ins.slice(-3));
  $("#join").hidden = inG;
  $("#insForm").hidden = inG;
}
function nextDate(g) { const n = new Date(); for (let i = 1; i <= 7; i++) {
  const d = new Date(n);
  d.setDate(n.getDate() + i);
  if (g.days.includes(d.getDay()))
    return d;
} return n; }
function renderConfirm() {
  const g = GR(), d = nextDate(g);
  $("#cDay").textContent = t("days")[d.getDay()].toUpperCase();
  $("#cNum").textContent = d.getDate();
  $("#cMon").textContent = t("months")[d.getMonth()];
  $("#startsOn").textContent = t("startsOn")(t("daysLong")[d.getDay()]);
  $("#cName").textContent = nm(g);
  $("#cTime").textContent = `${g.time} · ${pl(g)}`;
  $("#cEvery").textContent = t("every")(sched(g));
  $("#plus").textContent = "+" + Math.max(1, g.taken - 3);
  $("#cPpl").textContent = t("ppl")(g.taken);
  const v = ($("#insNo").value || "").toUpperCase();
  $("#cIns").textContent = t("insMasked")(v.slice(0, 3) + "••••" + v.slice(-3));
}
function renderAvatar() {
  const s = score(), L = lvlOf(s);
  $("#avTitle").textContent = GOALTXT[S.lang][S.goal];
  $("#tab-avatar .eyebrow").textContent = S.account && S.loggedIn ? `${t("acc").hi(S.account.first)} · ${t("youAt75")}` : t("youAt75");
  renderAvatarStage(s);
  const C = 2 * Math.PI * 42, col = ["#E8743B", "#C98A0B", "#1F7A55", "#1F7A55"][L]; /* start = warm orange, not alarm red */
  $("#ring").innerHTML = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="#E9EDEA" stroke-width="10"/><circle cx="50" cy="50" r="42" fill="none" stroke="${col}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C * s / 100} ${C}"/></svg><b>${s}</b>`;
  const lv = $("#lvl");
  lv.textContent = t("lvl")[L];
  lv.style.background = ["#FFE3CC", "#FFF1C2", "#E3F1DD", "#C8F06A"][L];
  lv.style.color = ["#8A3B12", "#6B4A00", "#1F7A55", "#12201B"][L];
  $("#lvlText").textContent = t("lvlText")[L];
  const sv = statVals(s);
  $("#stats").innerHTML = Object.keys(sv).map(k => `<div class="stat"><div class="lb"><span>${t("stats")[k]}</span><span style="font-variant-numeric:tabular-nums">${sv[k]}</span></div><div class="bar"><i style="width:${sv[k]}%"></i></div><small class="statd">${t("statsD")[k]}</small></div>`).join("") + `<p class="hint statnote">${t("statsNote")}</p>`;
  $("#scoreHint").textContent = t("scoreHint");
  renderGoal();
  renderFitness();
  $("#fbAvatar").innerHTML = feedbackCard();
  bindFeedback($("#fbAvatar"));
  renderPoints();
  const last = lastAct(), d = daysSince(last);
  $("#checkinMsg").textContent = last ? t("lastAct")(d === 0 ? t("todayW") : d === 1 ? t("yesterday") : t("daysAgo")(d)) : t("never");
  checkFence();
}
/* gid: group from the geofence; otherwise today's group, else the first joined one */
function doCheckin(gid) {
  const now = new Date(), k = dayKey(now);
  if (S.checkins.includes(k)) {
    toast(t("already"));
    return;
  }
  const mine = allGroups().filter(g => S.joined.includes(g.id));
  const g = (typeof gid === "string" && gid) || (mine.find(g => g.days.includes(now.getDay())) || mine[0] || {}).id;
  S.checkins.push(k);
  S.ciLog = { ...(S.ciLog || {}), [k]: g || null };
  save();
  renderAvatar();
  toast(t("checked")(sessionPts(g)));
}
/* anonymous tester feedback: opens the external form, sends no app data */
const feedbackCard = () => `<div class="card fbcard"><b>${t("fb").title}</b><span class="muted">${t("fb").text}</span><button class="btn lime" data-feedback>${t("fb").btn}</button><span class="hint" style="margin:0">${t("fb").anon}</span></div>`;
function bindFeedback(box) {
  box.querySelectorAll("[data-feedback]").forEach(b => b.onclick = () => FEEDBACK_URL ? window.open(FEEDBACK_URL, "_blank", "noopener") : toast(t("fb").soon));
}
let resetArm = false;
function renderSettings(box, sheet) {
  box.innerHTML = `${sheet ? `<h2 class="t" style="font-size:1.6rem">${t("settings")}</h2>` : ""}
   <div class="lbl">${t("language")}</div><div class="seg"><button data-lang="en" aria-pressed="${S.lang === "en"}">English</button><button data-lang="de" aria-pressed="${S.lang === "de"}">Deutsch</button></div>
   <div class="lbl">${t("textsize")}</div><div class="seg">${[16, 18, 20].map((v, i) => `<button data-size="${v}" aria-pressed="${S.size === v}">${["A", "A+", "A++"][i]}</button>`).join("")}</div>
   ${sheet ? "" : accountRow()}
   ${sheet ? "" : faceRow()}
   ${sheet ? `<button class="btn dark" data-close-sheet>${t("done")}</button>` : `
   <div class="lbl">${t("tracker")}</div>${trackerCard()}
   <div class="lbl">${t("location")}</div><div class="card setrow"><span class="muted" style="flex:1;min-width:0">${me ? t("locStatusOn") : t("locStatusOff")}</span><button class="btn small dark" data-loc>${t("locAsk")}</button></div>
   ${feedbackCard()}
   <button class="btn out" data-restart>${t("restartIntro")}</button>
   <button class="btn out" data-reset style="border-color:var(--danger);color:var(--danger)">${resetArm ? t("resetSure") : t("resetAll")}</button>
   <p class="hint">${t("privacy")}</p>`}`;
  box.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => { S.lang = b.dataset.lang; save(); renderText(); });
  box.querySelectorAll("[data-size]").forEach(b => b.onclick = () => { S.size = +b.dataset.size; applySize(); save(); renderText(); });
  bindAccountRow(box);
  box.querySelectorAll("[data-tr]").forEach(b => b.onclick = () => openTracker(b.dataset.tr));
  const td = box.querySelector("[data-trdis]");
  if (td)
    td.onclick = () => { S.tracker = null; S.trSync = null; S.health = null; save(); renderText(); toast(TL("Disconnected. Your data was removed from this phone.", "Getrennt. Deine Daten wurden vom Handy gelöscht.")); };
  const tsy = box.querySelector("[data-trsync]");
  if (tsy)
    tsy.onclick = () => openTracker(S.tracker, true);
  const cs = box.querySelector("[data-close-sheet]");
  if (cs)
    cs.onclick = () => $("#setSheet").hidden = true;
  bindFeedback(box);
  bindHealthImport(box);
  const rs = box.querySelector("[data-restart]");
  if (rs)
    rs.onclick = () => go("s1");
  const rr = box.querySelector("[data-reset]");
  if (rr)
    rr.onclick = () => {
      if (!resetArm) {
        resetArm = true;
        renderSettings(box);
        setTimeout(() => { resetArm = false; }, 4000);
        return;
      }
      try {
        localStorage.removeItem("tp2");
      }
      catch (e) { }
      const lang = S.lang;
      S = { ...DEF, lang };
      resetArm = false;
      me = null;
      locNote = null;
      toast(t("resetDone"));
      renderText();
      openAccount("signup");
    };
}
function renderSettingsAll() { if (!$("#main").hidden)
  renderSettings($("#settingsBody")); }
