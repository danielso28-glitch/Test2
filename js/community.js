/* ================= COMMUNITY ================= */
/* "Your groups" (joined on the map or here) with a page per group: leader updates, next session + RSVP, messages.
   Below: volunteering, other groups, start your own. Messages and RSVPs stay on this phone (S.posts, S.rsvp). */
let comOpen = null;
const myGroupList = () => allGroups().filter(g => S.joined.includes(g.id) || S.comJoined.includes(g.id));
const fmtDay = d => { const m = t("months")[d.getMonth()], mon = m[0] + m.slice(1).toLowerCase(); return S.lang === "de" ? `${t("days")[d.getDay()]}, ${d.getDate()}. ${mon}` : `${t("days")[d.getDay()]}, ${d.getDate()} ${mon}`; };
const agoTxt = n => n === 0 ? t("todayW") : n === 1 ? t("yesterday") : t("daysAgo")(n);
/* demo posts from the group leader and two members, same for every user */
function demoPosts(g) {
  if (g.own)
    return [{ ago: 0, by: t("com").you, lead: true, txt: t("com").ownStart }];
  const C = t("com"), lead = g.vol ? g.trainer : g.trainer.split(" ")[0];
  return [
    { ago: 0, by: lead, lead: true, demo: true, txt: C.p3 },
    { ago: 1, by: lead, lead: true, demo: true, txt: C.p2(t("daysLong")[g.days[0]], pl(g), g.time) },
    { ago: 1, by: "Peter", demo: true, txt: C.m2 },
    { ago: 2, by: "Ingrid", demo: true, txt: C.m1 },
    { ago: 3, by: lead, lead: true, demo: true, txt: C.p1(nm(g)) }
  ];
}
function renderCommunity() {
  $("#comHome").hidden = !!comOpen;
  $("#comView").hidden = !comOpen;
  if (comOpen)
    return renderComGroup(allGroups().find(g => g.id === comOpen));
  const C = t("com"), mine = myGroupList();
  $("#myGroups").innerHTML = mine.length ? mine.map(g => {
    const isNew = !(S.comSeen || []).includes(g.id);
    return `<button class="card cg mine" data-cg="${g.id}"><div class="top"><div style="min-width:0;text-align:left"><b>${esc(nm(g))}${isNew ? ` <em class="new">${C.newB}</em>` : ""}</b><span class="muted">${C.next(fmtDay(nextDate(g)) + " · " + g.time)}</span></div><span class="ic" style="background:${TINT[g.type]}">${ICON[g.type]}</span></div><span class="openline">${C.open} →</span></button>`;
  }).join("") : `<div class="card empty-g"><span class="muted">${C.none}</span><button class="btn dark small" data-tab="map">${C.findMap}</button></div>`;
  $$("[data-cg]").forEach(b => b.onclick = () => { comOpen = b.dataset.cg; S.comSeen = [...new Set([...(S.comSeen || []), comOpen])]; save(); renderCommunity(); $("#tab-community").scrollTop = 0; });
  const vb = $("#volBtn");
  vb.textContent = S.volunteer ? t("volOn") : t("volJoin");
  vb.onclick = () => { S.volunteer = !S.volunteer; save(); renderCommunity(); if (S.volunteer)
    toast(t("volMsg")); };
  const orgs = { ins: t("orgIns"), club: t("orgClub"), vol: t("orgVol") };
  $("#comList").innerHTML = allGroups().filter(g => !mine.includes(g)).map(g => `<div class="card cg"><div class="top"><div style="min-width:0"><span class="org ${g.org}">${orgs[g.org]}</span><div style="margin-top:8px"><b>${esc(nm(g))}</b></div><span class="muted">${sched(g)} · ${g.time} · ${fmtKm(gdist(g))} km · ${t("members")(g.taken)}</span></div><span class="ic" style="background:${TINT[g.type]}">${ICON[g.type]}</span></div><button class="btn small dark" data-cj="${g.id}">${t("joinG")}</button></div>`).join("");
  $$("[data-cj]").forEach(b => b.onclick = () => { S.comJoined.push(b.dataset.cj); save(); renderCommunity(); renderGroups(); renderAvatar(); toast(C.joined); });
  const ty = $("#ngType"), dy = $("#ngDay");
  const tv = ty.value, dv = dy.value;
  ty.innerHTML = ["walking", "dancing", "football", "back", "yoga", "cycling"].map(k => `<option value="${k}">${t(k)}</option>`).join("");
  dy.innerHTML = [1, 2, 3, 4, 5, 6, 0].map(d => `<option value="${d}">${t("daysLong")[d]}</option>`).join("");
  if (tv)
    ty.value = tv;
  if (dv)
    dy.value = dv;
}
function renderComGroup(g) {
  if (!g) {
    comOpen = null;
    return renderCommunity();
  }
  const C = t("com"), nd = nextDate(g), ndk = dayKey(nd), going = (S.rsvp || {})[g.id] === ndk;
  const comingN = Math.round(g.taken * .7) + (going ? 1 : 0);
  const mine = (S.posts || {})[g.id] || [];
  const posts = [...mine.map(p => ({ ago: daysSince(p.d), by: t("com").you, me: true, lead: !!g.own, txt: p.txt, ts: p.ts })), ...demoPosts(g)].sort((a, b) => a.ago - b.ago || (b.ts || 0) - (a.ts || 0));
  $("#comView").innerHTML = `<button class="link backlink" data-comback>← ${C.back}</button>
   <div class="card cghead"><span class="ic" style="background:${TINT[g.type]}">${ICON[g.type]}</span><div style="min-width:0"><h3>${esc(nm(g))}</h3><span class="muted">${sched(g)} · ${g.time} · ${esc(pl(g))}</span><span class="muted">${g.own ? C.youLead : `${C.leader}: ${esc(g.trainer)}`}</span></div></div>
   <div class="card nextcard"><div class="eyebrow">${C.nextT}</div><b class="nd">${fmtDay(nd)} · ${g.time}</b><span class="muted">${C.coming(comingN)}</span>
     <button class="btn ${going ? "out" : "lime"}" data-rsvp>${going ? C.going : C.goBtn}</button></div>
   <form class="card compose" id="comForm"><label for="comMsg" class="flabel">${g.own ? C.writeLead : C.write}</label><textarea id="comMsg" maxlength="280" rows="3"></textarea><button class="btn dark small" type="submit">${C.send}</button><p class="demo">${C.local}</p></form>
   <div class="eyebrow">${C.updates}</div>
   <div class="stack" style="padding:0">${posts.map(p => `<div class="card post-c${p.lead ? " lead" : ""}${p.me ? " me" : ""}"><div class="ph"><span class="face">${esc(initials(p.by))}</span><div style="min-width:0"><b>${esc(p.by)}</b><span class="muted">${p.lead ? C.leaderTag + " · " : ""}${agoTxt(p.ago)}${p.demo ? " · " + C.demo : ""}</span></div></div><p>${esc(p.txt)}</p></div>`).join("")}</div>
   <button class="btn out" data-leave style="border-color:var(--danger);color:var(--danger)">${g.own ? C.del : C.leave}</button>`;
  $("[data-comback]").onclick = () => { comOpen = null; renderCommunity(); };
  $("[data-rsvp]").onclick = () => { S.rsvp = { ...(S.rsvp || {}), [g.id]: going ? null : ndk }; save(); renderCommunity(); if (!going)
    toast(C.seeYou(fmtDay(nd))); };
  $("#comForm").onsubmit = e => {
    e.preventDefault();
    const txt = $("#comMsg").value.trim();
    if (!txt)
      return;
    S.posts = { ...(S.posts || {}), [g.id]: [...mine, { d: dayKey(new Date()), ts: Date.now(), txt }] };
    save();
    renderCommunity();
    toast(C.sent);
  };
  $("[data-leave]").onclick = () => {
    S.joined = S.joined.filter(x => x !== g.id);
    S.comJoined = S.comJoined.filter(x => x !== g.id);
    if (g.own)
      S.own = S.own.filter(x => x.id !== g.id);
    comOpen = null;
    save();
    renderCommunity();
    renderGroups();
    renderAvatar();
  };
}
$("#newGroup").addEventListener("submit", e => {
  e.preventDefault();
  const n = $("#ngName").value.trim(), p = $("#ngPlace").value.trim();
  if (!n || !p) {
    const er = $("#ngErr");
    er.textContent = t("ngErr");
    er.hidden = false;
    return;
  }
  $("#ngErr").hidden = true;
  const id = "own" + Date.now();
  S.own.push({ id, type: $("#ngType").value, name: n, place: p, days: [+$("#ngDay").value], time: $("#ngTime").value || "10:00", ll: offsetLL(me || S.center, [0.3, 0.2]), taken: 1, cap: 15, org: "vol" });
  S.joined.push(id);
  save();
  $("#ngName").value = "";
  $("#ngPlace").value = "";
  renderCommunity();
  renderGroups();
  toast(t("ngDone"));
});
