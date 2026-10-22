/* ---------- character ---------- */
/* photo as the drawn figure's head: off (team feedback: looked odd). The photo is shown as a portrait instead (film.js, scan reveal). */
const PHOTO_HEAD = false;
let TNOW = 0, TALK = null, PFX = "";
function limb(x, y, a1, l1, a2, l2, w, col, side) {
  const sx = side || 1;
  const kx = x + Math.sin(a1 * RAD) * l1 * sx, ky = y + Math.cos(a1 * RAD) * l1, fx = kx + Math.sin((a1 + a2) * RAD) * l2 * sx, fy = ky + Math.cos((a1 + a2) * RAD) * l2;
  return { d: `<path d="M${x.toFixed(1)} ${y.toFixed(1)}L${kx.toFixed(1)} ${ky.toFixed(1)}L${fx.toFixed(1)} ${fy.toFixed(1)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`, x: fx, y: fy, kx, ky };
}
function fig(o) {
  const f = !!o.f, age = o.age || 55, good = o.good !== false, old = cl((age - 55) / 20), P = o.pose || {};
  const stoop = o.stoop != null ? o.stoop : (good ? old * .12 : cl(old * 1.1));
  let sk = o.sk || "#E5BE9E";
  if (!good)
    sk = mix(sk, "#CBB9B0", old * .5);
  const skD = mix(sk, "#6E4433", .38);
  const grey = o.grey != null ? o.grey : (good ? old * .85 : cl(old * 1.1));
  const hair = mix(o.hair || (f ? "#6B4A35" : "#4A3A30"), "#E8E9EB", grey);
  const top = o.top || "#3E7CB1", bot = o.bot || "#2F3A45", shoe = o.shoe || "#1D232A";
  const hw = (f ? 26 : 23) + (o.belly || 0), sw = (f ? 28 : 31) - stoop * 2;
  let hipY = -138, legs = "", bob = 0;
  const walk = P.walk;
  let thighs = "";
  if (P.sit) {
    hipY = -82;
    legs = [-1, 1].map(s => `<path d="M${s * 20} -74L${s * 23} -4" stroke="${bot}" stroke-width="21" stroke-linecap="round" fill="none"/><ellipse cx="${s * 25}" cy="-2" rx="13" ry="7" fill="${shoe}"/>`).join("");
    thighs = [-1, 1].map(s => `<path d="M${s * 12} ${hipY - 4}L${s * 20} -72" stroke="${bot}" stroke-width="27" stroke-linecap="round" fill="none"/><ellipse cx="${s * 20}" cy="-70" rx="12" ry="9" fill="${mix(bot, "#FFFFFF", .12)}"/>`).join("");
  }
  else if (P.kneel) {
    hipY = -72;
    legs = [-1, 1].map(s => `<path d="M${s * 11} ${hipY}L${s * 17} -8" stroke="${bot}" stroke-width="23" stroke-linecap="round" fill="none"/><ellipse cx="${s * 18}" cy="-4" rx="14" ry="7" fill="${bot}"/>`).join("");
  }
  else {
    const sp = P.spread != null ? P.spread : 4;
    let aL = sp, aR = sp, bL = 0, bR = 0;
    if (walk != null) {
      const sw2 = P.stride || 20;
      aL = sp + Math.sin(walk) * sw2;
      aR = sp - Math.sin(walk) * sw2;
      bL = Math.max(0, Math.cos(walk)) * 16;
      bR = Math.max(0, -Math.cos(walk)) * 16;
      bob = -Math.abs(Math.sin(walk)) * 4;
    }
    const Rr = limb(11, hipY, aR, 70, -bR, 68, 21, bot, 1);
    const L2 = limb(-11, hipY, aL, 70, -bL, 68, 21, bot, -1);
    legs = L2.d + Rr.d + `<ellipse cx="${(L2.x - 4).toFixed(1)}" cy="${(L2.y + 2).toFixed(1)}" rx="13" ry="7" fill="${shoe}"/><ellipse cx="${(Rr.x + 4).toFixed(1)}" cy="${(Rr.y + 2).toFixed(1)}" rx="13" ry="7" fill="${shoe}"/>`;
  }
  const jump = P.jump || 0;
  const shY = hipY - 100 + stoop * 14;
  const torso = o.coat ? `<path d="M${-sw} ${shY + 10}Q${-sw} ${shY} ${-sw + 12} ${shY}H${sw - 12}Q${sw} ${shY} ${sw} ${shY + 10}L${hw + 8} ${hipY + 40}H${-hw - 8}Z" fill="#F4F6F8" stroke="#D5DBE0" stroke-width="2"/><path d="M0 ${shY + 4}V${hipY + 40}" stroke="#D5DBE0" stroke-width="2"/><rect x="8" y="${shY + 22}" width="12" height="9" rx="2" fill="#7FB3E0"/>`
    : `<path d="M${-sw} ${shY + 11}Q${-sw} ${shY} ${-sw + 12} ${shY}H${sw - 12}Q${sw} ${shY} ${sw} ${shY + 11}L${hw + 2} ${hipY + 4}Q${hw} ${hipY + 14} ${hw - 8} ${hipY + 14}H${-hw + 8}Q${-hw} ${hipY + 14} ${-hw - 2} ${hipY + 4}Z" fill="${top}"/>` + (o.zip ? `<path d="M0 ${shY + 6}V${hipY + 12}" stroke="${mix(top, "#000000", .25)}" stroke-width="2.5"/>` : "") + (o.collar ? `<path d="M-10 ${shY}L0 ${shY + 12}L10 ${shY}" fill="${o.collar}"/>` : "");
  const neck = `<rect x="-7" y="${shY - 14}" width="14" height="18" rx="5" fill="${skD}"/>`;
  // arms (angle outward positive)
  const st = o.coat ? "#F4F6F8" : top;
  const aL = P.aL || [7 + stoop * 5, 5], aR = P.aR || [7 + stoop * 5, 5];
  const AL = limb(-sw + 5, shY + 9, aL[0], 46, aL[1], 43, 15, st, -1), AR = limb(sw - 5, shY + 9, aR[0], 46, aR[1], 43, 15, st, 1);
  const hands = `<circle cx="${AL.x.toFixed(1)}" cy="${AL.y.toFixed(1)}" r="7" fill="${sk}"/><circle cx="${AR.x.toFixed(1)}" cy="${AR.y.toFixed(1)}" r="7" fill="${sk}"/>`;
  const cane = o.cane ? `<path d="M${(AR.x + 2).toFixed(1)} ${(AR.y - 4).toFixed(1)}q2 -10 10 -6L${(AR.x + 8).toFixed(1)} 0" stroke="#5B4636" stroke-width="5" fill="none" stroke-linecap="round"/>` : "";
  const propR = o.holdR ? o.holdR(AR.x, AR.y) : "", propL = o.holdL ? o.holdL(AL.x, AL.y) : "";
  // head
  const hy = shY - 34 + stoop * 9, hx = (o.lean || 0) + stoop * 0;
  const talking = TALK && o.who && TALK === o.who, amp = talking ? Math.abs(Math.sin(TNOW * 17)) * .8 + Math.abs(Math.sin(TNOW * 7)) * .4 : 0;
  const mood = o.mood || (good ? "smile" : "neutral");
  const blink = ((TNOW + (o.ph || 0)) % 4.3) < .13;
  const eyeRy = blink ? .6 : 3.3, lx = o.lx || 0;
  let hairBack = "", hairFront = "";
  const hs = o.hs || (f ? "bob" : "short");
  if (hs === "bob") {
    hairBack = `<path d="M-28 16Q-32 -38 0 -38Q32 -38 28 16Q22 22 18 12V-6H-18V12Q-22 22 -28 16Z" fill="${hair}"/>`;
    hairFront = `<path d="M-24 -8Q-24 -32 0 -32Q24 -32 24 -8Q14 -24 -6 -22Q-16 -21 -24 -8Z" fill="${hair}"/>`;
  }
  else if (hs === "bun") {
    hairBack = `<circle cx="0" cy="-36" r="11" fill="${hair}"/>`;
    hairFront = `<path d="M-24 -4Q-25 -32 0 -32Q25 -32 24 -4Q20 -22 0 -24Q-20 -22 -24 -4Z" fill="${hair}"/>`;
  }
  else if (hs === "kid") {
    hairFront = `<path d="M-24 -6Q-26 -34 0 -34Q26 -34 24 -6Q18 -18 8 -20Q4 -12 -4 -20Q-14 -18 -24 -6Z" fill="${hair}"/>`;
  }
  else if (hs === "pony") {
    hairBack = `<path d="M18 -20Q40 -10 30 22Q26 6 18 0Z" fill="${hair}"/>`;
    hairFront = `<path d="M-24 -6Q-25 -32 0 -32Q25 -32 24 -6Q18 -22 0 -24Q-18 -22 -24 -6Z" fill="${hair}"/>`;
  }
  else {
    const thin = (!good && age > 68) ? 1 : 0;
    hairFront = thin ? `<path d="M-24 -2Q-25 -14 -19 -20L-16 -6ZM24 -2Q25 -14 19 -20L16 -6Z" fill="${hair}"/>` : `<path d="M-24 -4Q-26 -33 0 -34Q26 -33 24 -4Q21 -22 4 -24Q-14 -25 -24 -4Z" fill="${hair}"/>`;
  }
  let mouth;
  if (talking)
    mouth = `<ellipse cx="0" cy="15" rx="${6 + amp}" ry="${1.2 + amp * 3.6}" fill="#6B2A22"/>`;
  else if (mood === "laugh")
    mouth = `<path d="M-8 12Q0 24 8 12Z" fill="#6B2A22"/>`;
  else if (mood === "smile")
    mouth = `<path d="M-8 13q8 7 16 0" stroke="#7A3B2A" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  else if (mood === "sad")
    mouth = `<path d="M-7 18q7 -6 14 0" stroke="#5A3328" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  else
    mouth = `<path d="M-6 16h12" stroke="#5A3328" stroke-width="2.6" stroke-linecap="round"/>`;
  const brow = mix(hair, "#3A3029", .35), sad = mood === "sad" || (!good && old > .4);
  const brows = sad ? `<path d="M-14 -9l9 -3M14 -9l-9 -3" stroke="${brow}" stroke-width="2.6" stroke-linecap="round"/>` : `<path d="M-14 -10q5 -4 10 -1M14 -10q-5 -4 -10 -1" stroke="${brow}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  const wr = old * (good ? .5 : .95) + (o.wr || 0);
  const wrinkles = wr > .05 ? `<g stroke="${skD}" stroke-width="1.3" fill="none" stroke-linecap="round" opacity="${cl(wr).toFixed(2)}"><path d="M-10 -17q10 -3 20 0M-8 -21q8 -2 16 0"/><path d="M17 -3l5 -2M17 1l5 1M-17 -3l-5 -2M-17 1l-5 1"/><path d="M-9 6q-4 5 -1 10M9 6q4 5 1 10"/></g>` : "";
  const under = !good && old > .2 ? `<ellipse cx="-9" cy="4" rx="5" ry="2" fill="#8C6E78" opacity="${(old * .4).toFixed(2)}"/><ellipse cx="9" cy="4" rx="5" ry="2" fill="#8C6E78" opacity="${(old * .4).toFixed(2)}"/>` : "";
  const cheeks = good && mood !== "neutral" ? `<circle cx="-14" cy="9" r="4.5" fill="#F09B86" opacity=".35"/><circle cx="14" cy="9" r="4.5" fill="#F09B86" opacity=".35"/>` : "";
  const glasses = o.glasses ? `<g fill="none" stroke="#2F3438" stroke-width="1.7"><circle cx="-9" cy="-1" r="7"/><circle cx="9" cy="-1" r="7"/><path d="M-2 -1h4M-16 -2l-7 -2M16 -2l7 -2"/></g>` : "";
  const jaw = !good && old > .3 ? `<path d="M-21 8Q-20 30 0 31Q20 30 21 8" fill="${sk}"/>` : "";
  const face = `<ellipse cx="-23" cy="2" rx="5" ry="8" fill="${skD}"/><ellipse cx="23" cy="2" rx="5" ry="8" fill="${skD}"/>${hairBack}<ellipse rx="23" ry="27" fill="${sk}"/>${jaw}${hairFront}${brows}<ellipse cx="${-9 + lx}" cy="-1" rx="2.6" ry="${eyeRy}" fill="#1E2328"/><ellipse cx="${9 + lx}" cy="-1" rx="2.6" ry="${eyeRy}" fill="#1E2328"/>${under}<path d="M0 1q-3 8 0 10q2 0 3 -1" stroke="${skD}" stroke-width="2" fill="none" stroke-linecap="round"/>${cheeks}${wrinkles}${mouth}${glasses}`;
  let faceOut = face;
  if (o.who === "Y" && FACE_REF && S.face && PHOTO_HEAD) {
    const sat = good ? 1 - old * .22 : 1 - old * .72, br = good ? 1 - old * .03 : 1 - old * .16, fid = "fy" + (++FID);
    faceOut = `<filter id="${fid}"><feColorMatrix type="saturate" values="${sat.toFixed(2)}"/><feComponentTransfer><feFuncR type="linear" slope="${br.toFixed(2)}"/><feFuncG type="linear" slope="${br.toFixed(2)}"/><feFuncB type="linear" slope="${(br * (good ? 1 : 1.04)).toFixed(2)}"/></feComponentTransfer></filter><clipPath id="c${fid}"><ellipse rx="23" ry="27"/></clipPath><ellipse cx="-23" cy="2" rx="5" ry="8" fill="${skD}"/><ellipse cx="23" cy="2" rx="5" ry="8" fill="${skD}"/><g opacity="${cl(grey * 1.15).toFixed(2)}">${hairBack}</g><ellipse rx="23.5" ry="27.5" fill="${skD}"/><linearGradient id="g${fid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ECEDEF" stop-opacity="${cl(grey * .95).toFixed(2)}"/><stop offset="1" stop-color="#ECEDEF" stop-opacity="0"/></linearGradient><g clip-path="url(#c${fid})"><use href="#${FACE_REF}" filter="url(#${fid})"/><ellipse rx="23" ry="27" fill="#C9C2BA" opacity="${(old * (good ? .08 : .22)).toFixed(2)}"/><rect x="-24" y="-28" width="48" height="16" fill="url(#g${fid})"/>${!good && old > .5 ? `<g fill="#9C7B66" opacity=".35"><circle cx="-11" cy="-14" r="1.4"/><circle cx="13" cy="-9" r="1.1"/><circle cx="-15" cy="11" r="1.2"/></g>` : ""}</g><g opacity="${cl(grey * 1.15).toFixed(2)}">${hairFront}</g>${wrinkles.replace(/opacity="([\d.]+)"/, (m, v) => `opacity="${cl(+v * 1.1).toFixed(2)}"`)}${under}${glasses}`;
  }
  const head = `<g transform="translate(${hx} ${hy}) rotate(${(o.tilt || 0) + stoop * 4}) scale(${o.hsc || 1} ${(o.hsc || 1) * (1 + (talking && FACE_REF && S.face ? amp * .02 : 0))})">${faceOut}</g>`;
  const sx = (o.flip ? -1 : 1) * (o.sx == null ? 1 : o.sx), s = o.s || 1;
  const shadow = o.noShadow ? "" : `<ellipse cx="${o.x}" cy="${o.y + 2}" rx="${46 * s}" ry="${8 * s}" fill="#000" opacity=".12"/>`;
  return `${shadow}<g transform="translate(${o.x} ${o.y + bob * s + jump}) scale(${(s * sx).toFixed(3)} ${s})">${o.behind || ""}${legs}${torso}${thighs}${neck}${cane}${AL.d}${AR.d}${hands}${propL}${propR}${head}</g>`;
}
/* the user */
function you(age, good, o = {}) {
  const f = S.gender === "f";
  const outfit = o.outfit || "work";
  const tops = { work: f ? "#4F6FA8" : "#4E6E9A", sport: good ? "#E8743B" : "#E8743B", cardigan: "#8A7F72", home: f ? "#A88AA0" : "#7D8C99", smart: f ? "#B03A5B" : "#2F4F6F" };
  const bots = { work: "#2F3A45", sport: "#2B3440", cardigan: "#6D6A66", home: "#5E6670", smart: "#2A2F36" };
  return fig({ f, age, good, who: "Y", hsc: (o.s || 1) < .85 ? 1.15 : 1, glasses: age >= 62, top: tops[outfit], bot: bots[outfit], zip: outfit === "sport", collar: outfit === "work" ? "#FFFFFF" : null, belly: !good ? cl((age - 55) / 20) * 7 : 0, shoe: outfit === "cardigan" ? "#7A5A48" : "#1D232A", ...o });
}
const FRIEND = (o) => fig({ f: true, age: 62, good: true, sk: "#D9A882", hair: "#B9B2AA", grey: 0, hs: "bob", top: "#2BA58C", bot: "#33414E", who: "F", ph: 1.3, ...o });
const COACH = (o) => fig({ f: false, age: 35, good: true, sk: "#8D5A3B", hair: "#1D1D1D", grey: 0, top: "#1F7A55", bot: "#1F2A33", zip: true, who: "C", ph: 2.1, ...o });
const DOCTOR = (o) => fig({ f: true, age: 50, good: true, sk: "#F0C9A8", hair: "#7A4B2A", grey: .1, hs: "bun", coat: true, bot: "#3A4A5A", who: "D", glasses: true, ph: .7, ...o });
const KID = (o) => fig({ f: false, age: 40, good: true, sk: "#EDC9A9", hair: "#6B4226", grey: 0, hs: "kid", top: "#FF8A4C", bot: "#2E5E8C", who: "K", s: .5, hsc: 1.45, ph: .4, ...o });
const EXTRAS = [{ f: true, sk: "#C68B65", hair: "#2B211C", hs: "pony", top: "#9B59B6", bot: "#2C3E50" }, { f: false, sk: "#F1CFB3", hair: "#9A8E84", top: "#3498DB", bot: "#34495E", glasses: true }, { f: true, sk: "#EBC4A2", hair: "#D8D2CA", hs: "bob", top: "#F1C40F", bot: "#5D6D7E" }, { f: false, sk: "#7A4E35", hair: "#2A2A2A", top: "#E74C3C", bot: "#2E4053" }, { f: true, sk: "#F3D2BC", hair: "#A0522D", hs: "bun", top: "#16A085", bot: "#3B3B4F" }];
const EX = (i, o) => fig({ age: 62, good: true, grey: .3, ph: i * .9, ...EXTRAS[i % EXTRAS.length], ...o });
