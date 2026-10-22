/* ================= SCORE MODEL ================= */
function daysSince(iso) { if (!iso)
  return 999; return Math.round((new Date(dayKey(new Date()) + "T12:00:00") - new Date(iso + "T12:00:00")) / 864e5); }
/* the 7 days ending with the newest day of an Apple Health export: [[Date, steps], …] */
function healthWeek() {
  const ks = Object.keys(S.health.days).sort(), end = new Date(ks[ks.length - 1] + "T12:00:00"), out = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    out.push([d, S.health.days[dayKey(d)] || 0]);
  }
  return out;
}
function steps() { if (S.health)
  return Math.round(healthWeek().reduce((a, x) => a + x[1], 0) / 7); if (!S.tracker)
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
