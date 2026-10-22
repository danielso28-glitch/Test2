/* ================= SCORE MODEL ================= */
function daysSince(iso) { if (!iso)
  return 999; return Math.round((new Date(dayKey(new Date()) + "T12:00:00") - new Date(iso + "T12:00:00")) / 864e5); }
function steps() { if (!S.tracker)
  return 0; const d = new Date(); return 4200 + ((d.getDate() * 7919 + d.getMonth() * 131) % 5200); }
const lastAct = () => S.checkins.length ? S.checkins.slice().sort().pop() : null;
/* the point rules – shown to the user in "How to earn points" */
const PTS = { start: 24, base: 28, join: 4, joinMax: 2, session: { walking: 5, dancing: 6, football: 7, back: 6, yoga: 5, cycling: 7 }, sessionDef: 6, sessionMax: 48, stepsMax: 10, volunteer: 4, community: 2, communityMax: 6, decayAfter: 3, decayDay: 1.5, decayMax: 26 };
const sessionPts = gid => { const g = gid && allGroups().find(x => x.id === gid); return g ? PTS.session[g.type] || PTS.sessionDef : PTS.sessionDef; };
/* score = sum of visible parts, clamped to 5–100 */
function scoreParts() {
  const idle = daysSince(lastAct());
  if (idle === 999 && !S.joined.length && !S.tracker)
    return [{ k: "start", pts: PTS.start }];
  const ci = S.ciLog || {};
  const parts = [
    { k: "base", pts: PTS.base },
    { k: "sessions", pts: Math.min(PTS.sessionMax, S.checkins.filter(c => daysSince(c) <= 28).reduce((a, c) => a + sessionPts(ci[c]), 0)) },
    { k: "joined", pts: Math.min(PTS.joinMax, S.joined.length) * PTS.join },
    { k: "steps", pts: S.tracker ? Math.round(steps() / 10000 * PTS.stepsMax) : 0 },
    { k: "volunteer", pts: S.volunteer ? PTS.volunteer : 0 },
    { k: "community", pts: Math.min(PTS.communityMax, (S.comJoined.length + S.own.length) * PTS.community) }
  ];
  if (idle > PTS.decayAfter && idle < 999)
    parts.push({ k: "decay", pts: -Math.round(Math.min(PTS.decayMax, (idle - PTS.decayAfter) * PTS.decayDay)), days: idle });
  return parts.filter(p => p.pts);
}
/* "Active" goal per 5-year age stage: points needed = weeks × weekly points.
   1 point ≈ 10 active minutes, so 15 points a week ≈ WHO's 150 minutes. The weekly goal gets a bit lower every 5 years
   (assumption for the prototype, to be checked with experts). */
const ACTIVE = { stage: 5, weekly: age => age < 60 ? 15 : age < 65 ? 14 : age < 70 ? 13 : age < 75 ? 12 : 11, minWeeks: 4 };
const bday = (birth, age) => { const b = new Date(birth + "T12:00:00"); b.setFullYear(b.getFullYear() + age); return b; };
function activeGoal() {
  const a = S.account;
  if (!a || !a.birth)
    return null;
  const now = new Date(), wk = 7 * 864e5, age = ageOn(a.birth, now);
  const stageAge = Math.floor(age / ACTIVE.stage) * ACTIVE.stage;
  let endAge = stageAge + ACTIVE.stage;
  if ((bday(a.birth, endAge) - now) / wk < ACTIVE.minWeeks) /* almost at the end of a stage: take the next one too */
    endAge += ACTIVE.stage;
  const end = bday(a.birth, endAge), stageStart = bday(a.birth, stageAge);
  const start = new Date(Math.max(stageStart, new Date((a.created || dayKey(now)) + "T12:00:00")));
  const weekly = ACTIVE.weekly(stageAge);
  /* points for the weeks between from and to, each stage with its own weekly goal */
  const need = to => {
    let sum = 0;
    for (let s = stageAge; s < endAge; s += ACTIVE.stage) {
      const a0 = Math.max(start, bday(a.birth, s)), a1 = Math.min(to, bday(a.birth, s + ACTIVE.stage));
      if (a1 > a0)
        sum += (a1 - a0) / wk * ACTIVE.weekly(s);
    }
    return Math.round(sum);
  };
  const target = need(end), expected = need(now);
  /* sessions since the stage began count (also simulated history from before sign-up) */
  const ci = S.checkins.filter(c => new Date(c + "T12:00:00") >= stageStart);
  const got = ci.reduce((s, c) => s + sessionPts((S.ciLog || {})[c]), 0);
  return { endAge, end, weekly, target, expected, got, weeksLeft: Math.max(0, Math.ceil((end - now) / wk)) };
}
function score() { return Math.max(5, Math.min(100, scoreParts().reduce((a, p) => a + p.pts, 0))); }
const lvlOf = s => s < 35 ? 0 : s < 60 ? 1 : s < 80 ? 2 : 3;
function statVals(s) {
  const r = S.checkins.filter(c => daysSince(c) <= 28).length;
  const c = v => Math.max(5, Math.min(100, Math.round(v)));
  return { strength: c(s + (r > 4 ? 5 : -5)), mobility: c(s + 3), energy: c(s - 4 + (S.tracker ? 8 : 0)), social: c(22 + (S.joined.length + S.comJoined.length + S.own.length) * 14 + (S.volunteer ? 15 : 0) + r * 2) };
}
function avatarScene(s) {
  const L = lvlOf(s), f = S.gender === "f", mood = L === 0 ? "sad" : L === 1 ? "ok" : "happy";
  const sky = ["#6E7880", "#C7D6D3", "#FFE6C4", "#FFDDB0"][L], ground = ["#4E5B53", "#8FB58A", "#A8D69E", "#9ED18F"][L];
  const shirt = L === 0 ? "#6C7781" : L === 1 ? (f ? "#9A7FA8" : "#5E8F78") : (f ? "#C2457A" : "#1F7A55");
  const arm = 8 + L * 3;
  let body;
  if (L === 0)
    body = `<g class="breath"><g fill="#5A4F4A"><rect x="70" y="250" width="200" height="10" rx="5"/><rect x="70" y="310" width="200" height="12" rx="6"/><rect x="82" y="322" width="10" height="50"/><rect x="250" y="322" width="10" height="50"/></g><rect x="125" y="230" width="80" height="110" rx="34" fill="${shirt}"/><path d="M195 325h55q12 0 13 14l6 46" stroke="#3B4650" stroke-width="24" stroke-linecap="round" fill="none"/><path d="M262 290q-6-14 5-16l14 118" stroke="#33302D" stroke-width="6" fill="none" stroke-linecap="round"/>${head("sad", 165, 190, .72)}</g>`;
  else if (L === 1)
    body = `<g class="breath"><path d="M155 330l-12 70M180 330l12 70" stroke="#12201B" stroke-width="18" stroke-linecap="round"/><rect x="128" y="226" width="80" height="120" rx="34" fill="${shirt}"/><path d="M134 246l-14 60M202 246l14 60" stroke="${shirt}" stroke-width="${arm * 2}" stroke-linecap="round"/>${head("ok", 168, 186, .72)}</g>`;
  else
    body = `<g class="${L === 3 ? "hop" : "breath"}"><path d="M150 330l-20 72M186 330l20 72" stroke="#12201B" stroke-width="20" stroke-linecap="round"/><rect x="124" y="224" width="88" height="124" rx="36" fill="${shirt}"/><path d="M132 244l-26 ${L === 3 ? -46 : 52}M204 244l34 32" stroke="${shirt}" stroke-width="${arm * 2}" stroke-linecap="round"/><circle cx="240" cy="278" r="8" fill="#E8C5A6"/>${head("happy", 168, 184, .74)}</g>`;
  const kid = L >= 2 ? `<g class="${L === 3 ? "hop2" : ""}" transform="translate(262 300)"><path d="M-6 30l-4 38M6 30l4 38" stroke="#12201B" stroke-width="8" stroke-linecap="round"/><rect x="-15" y="-22" width="30" height="54" rx="11" fill="#FF8A4C"/><path d="M-12 -14l-12 14" stroke="#FF8A4C" stroke-width="8" stroke-linecap="round"/><circle cy="-42" r="20" fill="#E8C5A6"/><path d="M-20 -44a20 20 0 0 1 40 0q-10-12-40 0z" fill="#6B4226"/><circle cx="-6" cy="-40" r="2.2" fill="#12201B"/><circle cx="6" cy="-40" r="2.2" fill="#12201B"/><path d="M-7 -33q7 6 14 0" fill="none" stroke="#12201B" stroke-width="2.2" stroke-linecap="round"/></g>` : "";
  const ball = L === 3 ? `<circle class="ball" cx="320" cy="380" r="13" fill="#FFCE3A" stroke="#12201B" stroke-width="3"/>` : "";
  const sun = L >= 2 ? `<circle cx="320" cy="80" r="44" fill="#FF8A4C" opacity=".9"/>` : L === 1 ? `<circle cx="320" cy="80" r="40" fill="#FFF3D6"/>` : `<ellipse cx="110" cy="70" rx="90" ry="26" fill="#7D878F"/><ellipse cx="300" cy="110" rx="100" ry="28" fill="#7D878F"/>`;
  return `<svg viewBox="0 0 400 420" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${t("youAt75")}"><rect width="400" height="420" fill="${sky}"/>${sun}<path d="M0 380 Q200 340 400 380 V420 H0z" fill="${ground}"/>${body}${kid}${ball}</svg><span class="tapme">${t("tapMe")}</span>`;
}
