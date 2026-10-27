/* ================= POINTS UI ================= */
const sgn = n => (n > 0 ? "+" : "−") + Math.abs(n);
/* group page: what this activity is worth */
function renderGroupPts(g) {
  const per = sessionPts(g.id), month = Math.min(PTS.sessionMax, g.days.length * 4 * per);
  $("#dPts").innerHTML = `<div class="ptsrow"><span class="pp">+${per}</span><span>${t("ptsPer")}</span></div>
   <div class="ptsrow"><span class="pp">+${PTS.join}</span><span>${t("ptsJoin")}</span></div>
   <p class="hint" style="margin:0">${t("ptsMonth")(month)}</p>
   <details class="ptsrules"><summary>${t("ptsWhatT")}</summary><p class="hint">${t("ptsWhat")}</p></details>`;
}
/* avatar tab: where the score comes from + the rules */
function renderPoints() {
  const parts = scoreParts(), total = score();
  const label = p => p.k === "decay" ? t("ptsParts").decay(p.days) : t("ptsParts")[p.k];
  const rules = [
    ...Object.keys(PTS.session).map(k => [`${t(k)} · ${t("ptsSession")}`, "+" + PTS.session[k]]),
    [t("ptsR").join(PTS.joinMax), "+" + PTS.join],
    [t("ptsR").steps, `${t("ptsUpTo")} +${PTS.stepsMax}`],
    [t("ptsR").volunteer, "+" + PTS.volunteer],
    [t("ptsR").community, `+${PTS.community} (${t("ptsMax")} ${PTS.communityMax})`]
  ];
  $("#ptsCard").innerHTML = `<div class="eyebrow" style="margin-bottom:10px">${t("ptsTitle")}</div>
   <div class="ptslist">${parts.map(p => `<div class="${p.pts < 0 ? "neg" : ""}"><span>${esc(label(p))}</span><b>${sgn(p.pts)}</b></div>`).join("")}
   <div class="sum"><span>${t("ptsTotal")}</span><b>${total}</b></div></div>
   <details class="ptsrules"><summary>${t("ptsHow")}</summary>
   <div class="ptslist">${rules.map(([a, b]) => `<div><span>${esc(a)}</span><b>${b}</b></div>`).join("")}</div>
   <p class="hint">${t("ptsNote")(PTS.decayAfter, PTS.decayDay)}</p></details>`;
}
/* avatar tab: the age-based "active" goal */
function renderGoal() {
  const G = activeGoal(), el = $("#goalCard"), C = t("goal");
  el.hidden = !S.account;
  if (!S.account)
    return;
  if (!G) { /* account from before birth date was asked: ask here */
    el.innerHTML = `<div class="eyebrow">${C.eyebrow}</div><h3>${C.needBirthT}</h3><p class="muted">${C.needBirth}</p>
     <form class="birthform" id="goalBirth"><div class="field"><label for="goalBd">${t("acc").accBirth}</label><input id="goalBd" type="date" max="${dayKey(new Date())}" min="1910-01-01"></div><p class="err" id="goalErr" hidden></p><button class="btn dark" type="submit">${C.save}</button></form>`;
    $("#goalBirth").onsubmit = e => {
      e.preventDefault();
      const v = $("#goalBd").value;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || ageOn(v) < 18 || ageOn(v) > 110) {
        $("#goalErr").textContent = t("acc").errBirth;
        $("#goalErr").hidden = false;
        return;
      }
      S.account = { ...S.account, birth: v, created: S.account.created || dayKey(new Date()) };
      save();
      renderText(); /* the target age (75/80) in tab and titles can change with the birth date */
      renderAvatar();
      renderSettingsAll();
    };
    return;
  }
  const pct = v => Math.min(100, Math.round(v / G.target * 100));
  const behind = G.expected - G.got, done = G.got >= G.target;
  const status = done ? C.done : behind <= 0 ? C.onTrack : C.behind(behind, Math.ceil(behind / PTS.sessionDef));
  const endTxt = G.end.toLocaleDateString(LOC(), { day: "numeric", month: "long", year: "numeric" });
  el.innerHTML = `<div class="eyebrow">${C.eyebrow}</div><h3>${C.title(G.endAge)}</h3>${C.stage(G.endAge) ? `<p class="muted" style="margin-top:-4px">${C.stage(G.endAge)}</p>` : ""}
   <div class="gnum"><b>${G.got.toLocaleString(LOC())}</b> <span>${C.of(G.target.toLocaleString(LOC()))}</span></div>
   <div class="bar" role="img" aria-label="${pct(G.got)}%"><i style="width:${pct(G.got)}%"></i>${done ? "" : `<s style="left:${pct(G.expected)}%" title="${C.today}"></s>`}</div>
   <p class="gstatus ${done || behind <= 0 ? "ok" : "late"}">${status}</p>
   <p class="muted">${C.pace(G.weekly)}</p>
   <p class="muted">${C.deadline(G.endAge, endTxt, G.weeksLeft)}</p>
   <details class="ptsrules"><summary>${C.whyT}</summary><p class="hint">${C.why}</p></details>`;
}
/* avatar tab: donut of the last 4 weeks vs. the weekly WHO-based goal, split by activity + comparison with people your age */
/* fixed colour per activity (validated categorical slots 1–7, light surface); colour follows the activity, never its rank */
const ACT_COL = { walking: "#2a78d6", dancing: "#eb6834", football: "#1baf7a", back: "#eda100", yoga: "#e87ba4", cycling: "#008300", other: "#6250d6" };
/* share of adults meeting the WHO aerobic recommendation (≥150 min/week), RKI GEDA 2019/2020-EHIS, Table 1 (Richter et al., J Health Monit 2021) */
const PEERS = [[18, 30, 58.9, 69.3], [30, 45, 46.2, 53.5], [45, 65, 47.3, 46.4], [65, 200, 33.3, 42.6]];
const pctTxt = n => S.lang !== "en" ? `${String(n).replace(".", ",")} %` : `${n}%`;
function fitData() {
  const ci = S.ciLog || {}, by = {};
  S.checkins.filter(c => daysSince(c) <= 28).forEach(c => {
    const g = ci[c] && allGroups().find(x => x.id === ci[c]), k = g ? g.type : "other";
    by[k] = (by[k] || 0) + sessionPts(ci[c]);
  });
  const age = S.account && S.account.birth ? ageOn(S.account.birth) : null;
  const weekly = ACTIVE.weekly(Math.floor((age || 55) / 5) * 5), target = weekly * 4;
  const total = Object.values(by).reduce((a, b) => a + b, 0);
  return { by, total, target, weekly, age, pct: Math.round(total / target * 100) };
}
function renderFitness() {
  const F = fitData(), C = t("fit"), el = $("#fitCard");
  const R = 70, W = 22, L = 2 * Math.PI * R, scale = Math.max(F.total, F.target);
  let off = 0;
  const segs = Object.keys(ACT_COL).filter(k => F.by[k]).map(k => {
    const len = F.by[k] / scale * L, gap = Math.min(2, len / 2);
    const s = `<circle r="${R}" fill="none" stroke="${ACT_COL[k]}" stroke-width="${W}" stroke-dasharray="${len - gap} ${L}" stroke-dashoffset="${-off}" transform="rotate(-90)"><title>${esc(actName(k))}: +${F.by[k]} (${pctTxt(Math.round(F.by[k] / F.target * 100))})</title></circle>`;
    off += len;
    return s;
  }).join("");
  const rest = Math.max(0, F.target - F.total);
  const legend = Object.keys(ACT_COL).filter(k => F.by[k]).map(k => `<li><i style="background:${ACT_COL[k]}"></i><span>${esc(actName(k))}</span><b>+${F.by[k]}</b><em>${pctTxt(Math.round(F.by[k] / F.target * 100))}</em></li>`).join("")
    + (rest ? `<li class="rest"><i></i><span>${C.toGo}</span><b>${rest}</b><em>${pctTxt(Math.round(rest / F.target * 100))}</em></li>` : "");
  const big = F.pct > 100 ? "100%+" : pctTxt(F.pct);
  /* people your age */
  const age = F.age, row = age ? PEERS.find(([a, b]) => age >= a && age < b) : null, f = S.gender === "f";
  let peer = "";
  if (row) {
    const p = f ? row[2] : row[3], filled = Math.round(p / 10);
    const grp = C.grp(f, row[0], row[1] > 100 ? null : row[1] - 1);
    const person = on => `<svg viewBox="0 0 24 24" class="${on ? "on" : ""}" aria-hidden="true"><circle cx="12" cy="6" r="3.5"/><path d="M5 22c0-5 3-8.5 7-8.5s7 3.5 7 8.5z"/></svg>`;
    peer = `<div class="peer"><div class="eyebrow">${C.peerT}</div>
     <div class="pplrow" role="img" aria-label="${C.peer(pctTxt(p), grp)}">${Array.from({ length: 10 }, (_, i) => person(i < filled)).join("")}</div>
     <p><b>${C.peer(pctTxt(p), grp)}</b></p>
     <p class="${F.pct >= 100 ? "gstatus ok" : "muted"}">${F.pct >= 100 ? C.youIn : C.youNot(pctTxt(F.pct))}</p>
     <p class="hint" style="margin:0">${C.src}</p></div>`;
  }
  el.innerHTML = `<div class="eyebrow">${C.eyebrow}</div><h3>${C.title}</h3>
   <div class="donutwrap"><svg viewBox="-100 -100 200 200" class="donut" role="img" aria-label="${big} ${C.ofGoal}"><circle r="${R}" fill="none" stroke="#E9EDEA" stroke-width="${W}"/>${segs}
     <text y="-2" text-anchor="middle" class="dv">${big}</text><text y="22" text-anchor="middle" class="dl">${C.ofGoal}</text></svg>
   <ul class="dlegend">${legend}</ul></div>
   <p class="muted" style="margin:0">${F.total ? C.sub(F.total, F.target, F.weekly) : C.none}</p>${peer}`;
}
const actName = k => k === "other" ? t("fit").other : t(k);
