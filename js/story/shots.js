/* ---------- shot lists ---------- */
const STORY_CUT = { bad: ["O1", "O2", "B2", "B3", "B5", "B7", "B8", "B9"], good: ["A1", "A2", "A4", "A7", "A8", "A9"] };
/* a dancer's turn: mirror quickly instead of squashing to a paper-thin figure */
const spin = c => Math.sign(c || 1) * Math.max(.8, Math.abs(c));
function goalShot(kind, goal) {
  const g = S.gender === "f" ? "f" : "m";
  const good = kind === "good";
  const L = good ? { grand: ["K_A_" + g, "A08_grand"], travel: ["A08_travel"], cycle: ["F_cycle"], own: ["A08_own"], garden: ["A08_garden"], dance: ["F_dance", "A08_dance"], hike: ["C_hike"], friends: ["F_friends", "A08_friends"] }[goal]
    : { grand: ["K_B_" + g, "B08_grand"], travel: ["B08_travel"], cycle: ["B08_cycle"], own: ["B08_own"], garden: ["B08_garden"], dance: ["B08_dance"], hike: ["B08_hike"], friends: ["B08_friends"] }[goal];
  const A = 75;
  let draw, cam = [220, 330, 1, 220, 330, 1.12];
  if (good)
    draw = {
      grand: (u, T) => {
        const kx = 180 + u * 200, yx = 60 + u * 190;
        const kite = `<path d="M${kx + 60} ${150 + Math.sin(T * 2) * 14}l20 -26 20 26 -20 30z" fill="#E74C3C"/><path d="M${kx + 80} ${180 + Math.sin(T * 2) * 14}q-30 120 ${-60} ${230}" stroke="#555" stroke-width="1.5" fill="none"/>`;
        return bgPark(T, { lake: true }) + kite + KID({ x: kx, y: 500, pose: { walk: T * 12, stride: 28, aR: [150, 10] }, mood: "laugh" }) + you(A, true, { x: yx, y: 505, s: .85, outfit: "sport", pose: { walk: T * 11, stride: 24, aL: [40, 30], aR: [40, 30] }, mood: "laugh" });
      },
      travel: (u, T) => { const p = ease(cl(u * 1.3)), x = 90 + p * 230, y = 560 - p * 250, top = u > .75; return bgOldTown() + you(A, true, { x, y, s: .7, outfit: "sport", pose: top ? { aL: [150, 10], aR: [150, 10] } : { walk: T * 9, stride: 16 }, mood: top ? "laugh" : "smile", holdL: top ? null : (hx, hy) => "" }); },
      cycle: (u, T) => { const off = (T * 160) % 440; return bgPark(T, { lake: true }) + `<g transform="translate(${-off} 0)">${tree(500, 450, .8)}${tree(900, 445, .9)}</g>` + [[140, "F", FRIEND, "#2BA58C"], [300, "Y", null, "#E8743B"]].map(([x, w, fn, c]) => { const ph = T * 8; const rider = { x, y: 475 + Math.sin(T * 10 + x) * 1.5, s: .62, pose: { sit: true, aL: [-30, -40], aR: [-30, -40] }, mood: "laugh" }; return bike(x, 500, .85, c, T * 400) + (fn ? fn(rider) : you(A, true, { ...rider, outfit: "sport" })); }).join(""); },
      own: (u, T) => { const p = ease(cl(u * 1.25)), x = 150 + p * 170, y = 505 - p * 215; return bgStairs() + you(A, true, { x, y, s: .72, outfit: "sport", pose: p < 1 ? { walk: T * 9, stride: 14, aL: [6, 0], aR: [6, 0] } : { aL: [6, 0], aR: [6, 0] }, holdL: (hx, hy) => bag(hx, hy), holdR: (hx, hy) => bag(hx, hy), mood: "smile" }); },
      garden: (u, T) => { const pull = cl((u - .35) * 3), c = `<g transform="translate(250 ${480 - pull * 60})"><path d="M0 0l-8 50h16z" fill="#F28C28"/><path d="M0 0q-12 -26 -4 -40M0 0q10 -24 6 -42M0 0q2 -22 14 -30" stroke="#3E8E41" stroke-width="5" fill="none"/></g>`; return bgGarden(true) + c + you(A, true, { x: 205, y: 505, outfit: "home", pose: { kneel: true, aR: [-40, -60 + pull * 30], aL: [20, 10] }, mood: pull > .9 ? "laugh" : "smile" }); },
      dance: (u, T) => { const sp = spin(Math.cos(T * 1.5)); return bgHall(T) + EX(1, { x: 70, y: 500, s: .8, mood: "laugh" }) + FRIEND({ x: 380, y: 500, s: .8, pose: { aL: [20, 90] }, mood: "laugh", holdL: (hx, hy) => drink(hx, hy) }) + `<g>` + you(A, true, { x: 210 + Math.sin(T * 3.2) * 16, y: 500, sx: sp, outfit: "smart", pose: { aL: [110, 40], aR: [30, 60], walk: T * 6, stride: 10 }, mood: "laugh" }) + EX(S.gender === "f" ? 1 : 2, { x: 270 - Math.sin(T * 3.2) * 16, y: 500, sx: -sp, pose: { aR: [110, 40], aL: [30, 60], walk: T * 6 + 1.5, stride: 10 }, mood: "laugh", ph: 2 }) + `</g>`; },
      hike: (u, T) => { const flash = u > .82 && u < .88 ? .8 : 0; return bgSummit() + [EX(0, { x: 110, y: 470, s: .62, pose: { aR: [150, 10] }, mood: "laugh" }), you(A, true, { x: 190, y: 480, s: .68, outfit: "sport", pose: { aL: [150, 10], aR: [150, 10] }, mood: "laugh" }), EX(3, { x: 265, y: 476, s: .64, mood: "laugh" }), EX(2, { x: 330, y: 470, s: .6, mood: "laugh" })].join("") + COACH({ x: 220, y: 640, s: .9, pose: { aL: [160, -10], aR: [160, -10] }, holdR: (hx, hy) => `<rect x="${hx - 22}" y="${hy - 18}" width="44" height="28" rx="5" fill="#2B2B2B"/>`, mood: "laugh" }) + `<rect width="440" height="600" fill="#FFF" opacity="${flash}"/>`; },
      friends: (u, T) => bgCafe() + [EX(0, { x: 80, y: 470, s: .7, pose: { sit: true }, mood: "laugh" }), FRIEND({ x: 160, y: 470, s: .7, pose: { sit: true, aR: [60, 60] }, mood: "laugh", holdR: (hx, hy) => drink(hx, hy) }), you(A, true, { x: 250, y: 470, s: .7, outfit: "smart", pose: { sit: true }, mood: "laugh" }), EX(3, { x: 340, y: 470, s: .7, pose: { sit: true }, mood: "laugh" })].join("") + `<rect x="30" y="455" width="380" height="16" rx="6" fill="#8E6E53"/>${drink(120, 455)}${drink(220, 455)}${drink(300, 455)}`
    }[goal];
  else
    draw = {
      grand: (u, T) => { const kx = 230 + u * 230; return bgPark(T, { lake: true, sun: false, c1: "#C3D3DE", c2: "#E9E4DA" }) + `<path d="M${kx + 40} ${160 + Math.sin(T * 2) * 12}l20 -26 20 26 -20 30z" fill="#E74C3C"/>` + `<rect x="40" y="440" width="150" height="12" rx="5" fill="#7A5C45"/><rect x="50" y="452" width="10" height="50" fill="#5E4535"/><rect x="170" y="452" width="10" height="50" fill="#5E4535"/>` + you(A, false, { x: 115, y: 500, s: .9, outfit: "cardigan", pose: { sit: true }, cane: true }) + KID({ x: kx, y: 500, pose: { walk: T * 12, stride: 26, aR: [150, 10] }, mood: u < .3 ? "smile" : "neutral", flip: u < .25 }); },
      travel: (u, T) => { let ex = ""; for (let i = 0; i < 4; i++) {
        const p = cl(u * 1.2 - i * .12), x = 110 + p * 200 + i * 14, y = 550 - p * 230 - i * 10;
        ex += EX(i, { x, y, s: .55, pose: { walk: T * 9 + i, stride: 14 } });
      } return bgOldTown() + ex + `<g transform="translate(-20 0)">${car(140, 590, "#D9C24A")}</g>` + you(A, false, { x: 120, y: 580, s: 1, outfit: "cardigan", cane: true, mood: "sad" }); },
      cycle: (u, T) => bgCellar() + bike(250, 470, 1, "#E74C3C", 0, true) + `<path d="M200 420q20 -40 60 -30" stroke="#AAA" stroke-width="1" fill="none" opacity=".5"/>` + you(A, false, { x: 90, y: 500, s: .9, outfit: "cardigan", cane: true, lx: 3 }),
      own: (u, T) => bgStairs({ lift: true, wall: "#E4DED4" }) + `<rect x="40" y="420" width="190" height="14" rx="4" fill="#8E6E53"/><rect x="60" y="434" width="8" height="66" fill="#6F5640"/><rect x="200" y="434" width="8" height="66" fill="#6F5640"/><g transform="translate(120 408) rotate(-8)"><rect x="-38" y="-14" width="76" height="26" rx="3" fill="#FFF" stroke="#C9CED3"/>${TXT(0, 3, 10, "#4A6A86", TL("Care home", "Seniorenheim", "Residencia"), 800)}</g>` + you(A, false, { x: 260, y: 505, s: .9, outfit: "cardigan", pose: { sit: true }, cane: true, mood: "sad" }),
      garden: (u, T) => bgGarden(false) + `<rect width="440" height="600" fill="none" stroke="#EDE6DA" stroke-width="80"/><path d="M220 0V600M0 300H440" stroke="#EDE6DA" stroke-width="14"/>` + you(A, false, { x: 120, y: 640, s: 1.1, outfit: "cardigan", cane: true, mood: "sad", lx: 3 }),
      dance: (u, T) => { const sp = spin(Math.cos(T * 3)); return bgHall(T, { dim: true }) + EX(1, { x: 250 + Math.sin(T * 3) * 12, y: 470, s: .7, sx: sp, pose: { aL: [110, 40], walk: T * 6, stride: 10 }, mood: "laugh" }) + EX(2, { x: 310 - Math.sin(T * 3) * 12, y: 470, s: .7, sx: -sp, pose: { aR: [110, 40], walk: T * 6 + 1, stride: 10 }, mood: "laugh" }) + EX(4, { x: 380, y: 470, s: .68, pose: { walk: T * 6, stride: 8, aL: [120, 20], aR: [120, 20] }, mood: "laugh" }) + you(A, false, { x: 110, y: 520, s: .85, outfit: "smart", pose: { sit: true, aR: [60, 70] }, holdR: (hx, hy) => drink(hx, hy), cane: false }) + `<rect x="20" y="500" width="190" height="14" rx="5" fill="#5A4234"/>`; },
      hike: (u, T) => { const z = ease(cl(u * 1.5)); return bgRoom(T, { day: true, sofa: "#7D7468" }) + you(A, false, { x: 200, y: 500, outfit: "cardigan", pose: { sit: true, aR: [-20, -70] }, holdR: (hx, hy) => phone(hx, hy - 6), mood: "neutral" }) + `<g transform="translate(330 ${210}) scale(${.4 + z * .6})"><rect x="-80" y="-140" width="160" height="280" rx="20" fill="#14181C"/><g transform="translate(0 0) scale(.36)"><clipPath id="ph${PFX}"><rect x="-200" y="-360" width="400" height="720"/></clipPath><g clip-path="url(#ph${PFX})"><g transform="translate(-220 -300)">${bgSummit()}${[0, 2, 3].map((i, j) => EX(i, { x: 150 + j * 70, y: 470, s: .6, pose: { aR: [150, 10] }, mood: "laugh" })).join("")}</g></g></g></g>`; },
      friends: (u, T) => bgCafe({ awn: "#7F8C8D" }) + `<rect x="150" y="455" width="140" height="14" rx="6" fill="#8E6E53"/>${drink(240, 455)}` + you(A, false, { x: 200, y: 470, s: .8, outfit: "cardigan", pose: { sit: true, aR: [-20, -70] }, holdR: (hx, hy) => phone(hx, hy - 6), mood: "sad" }) + `<g transform="translate(330 170)"><rect x="-80" y="-30" width="160" height="60" rx="14" fill="#FFF" opacity=".92"/>${TXT(0, 6, 14, "#5A6670", TL("No new messages", "Keine neuen Nachrichten", "No hay mensajes nuevos"), 700)}</g>`
    }[goal];
  /* follow the climber so the head stays in the picture */
  if (good && goal === "own")
    cam = [185, 370, 1.12, 300, 205, 1.12];
  if (good && goal === "travel")
    cam = [160, 430, 1.1, 290, 280, 1.1];
  const sfx = (good ? { grand: [["birds", 0], ["steps", 0]], travel: [["steps", 0]], cycle: [["birds", 0]], own: [["steps", 0]], hike: [["birds", .3]] }
    : { grand: [["birds", .5]], travel: [["door", .4], ["steps", .8]], own: [["ding", 1.2]] })[goal];
  return { id: (good ? "A" : "B") + "8", L, d: 5.2, fx: good ? "warm" : "c3", cam, sfx, draw };
}
function storyShots(kind, goal) {
  const room = (T) => bgRoom(T, {});
  const open = [
    { id: "O1", L: ["O01"], d: 5.6, fx: "neutral", cam: [220, 330, 1, 220, 350, 1.3], sfx: [["tick", 0]], draw: (u, T) => room(T) + you(55, true, { x: 220, y: 508, outfit: "work", pose: { sit: true, aR: [-20, -75] }, holdR: (hx, hy) => phone(hx, hy - 6, -10), mood: "neutral", lx: 2 }) + `<path d="M330 500l40 -6v-20l-40 6z" fill="#4A3A30"/>` },
    { id: "O2", L: ["O02"], d: 3.6, fx: "neutral", sfx: [["ping", .35]], draw: (u, T) => phoneUI(T, u, {}) },
    { id: "O3", L: ["O03"], d: 4.2, fx: "neutral", draw: (u, T) => { const w = 220 * ease(cl(u * 2)); return `<defs><clipPath id="cL${PFX}"><rect width="${220}" height="600"/></clipPath><clipPath id="cR${PFX}"><rect x="220" width="220" height="600"/></clipPath></defs><g clip-path="url(#cR${PFX})" style="filter:saturate(.45) brightness(.85)">${room(T)}${you(55, false, { x: 300, y: 500, outfit: "work", pose: { sit: true }, mood: "neutral" })}</g><g clip-path="url(#cL${PFX})" opacity="${cl(u * 2)}">${bgPark(T)}${you(55, true, { x: 110, y: 500, outfit: "sport", pose: { walk: T * 9, stride: 20 }, mood: "smile" })}</g><rect x="217" width="6" height="600" fill="#FFF"/>` + `<g opacity="${cl(u * 2 - .6)}"><rect x="40" y="112" width="${130}" height="34" rx="17" fill="#C8F06A"/>${TXT(105, 135, 15, "#12201B", TL("Go", "Hingehen", "Ir"), 800)}<rect x="270" y="112" width="130" height="34" rx="17" fill="#12201B"/>${TXT(335, 135, 15, "#C8F06A", TL("Later", "Später", "Luego"), 800)}</g>`; } }
  ];
  const goodShots = [
    { id: "A1", L: ["A01"], d: 4.4, fx: "warm", sfx: [["birds", 0], ["steps", .3]], cam: [220, 320, 1, 220, 330, 1.08], draw: (u, T) => { const x = lerp(30, 170, ease(cl(u * 1.3))); return bgPark(T, { sy: 170 }) + [EX(0, { x: 250, y: 480, s: .72, pose: { aR: [150 + Math.sin(T * 8) * 15, 10] }, mood: "laugh" }), EX(1, { x: 310, y: 486, s: .74, mood: "smile", pose: { aR: [140 + Math.sin(T * 7) * 15, 10] } }), EX(2, { x: 365, y: 478, s: .7, mood: "smile" }), FRIEND({ x: 300, y: 520, s: .8, mood: "smile", pose: { aL: [150 + Math.sin(T * 8) * 15, 0] } })].join("") + you(55, true, { x, y: 520, s: .85, outfit: "sport", pose: u < .75 ? { walk: T * 9, stride: 18 } : {}, mood: "neutral", lx: 3 }); } },
    { id: "A2", L: ["A02"], d: 4, fx: "warm", cam: [220, 340, 1.25, 220, 340, 1.25], draw: (u, T) => { const off = (T * 60) % 300; return bgPark(T, { sy: 150 }) + `<g transform="translate(${-off} 0)">${tree(380, 470, .8)}${tree(680, 470, .8)}</g>` + FRIEND({ x: 170, y: 510, pose: { walk: T * 8, stride: 16 }, mood: "laugh", lx: 3 }) + you(55, true, { x: 280, y: 510, outfit: "sport", pose: { walk: T * 8 + .4, stride: 16 }, mood: "smile", lx: -3 }); } },
    { id: "A3", L: ["A03"], d: 4.6, fx: "warm", draw: (u, T) => { const i = Math.min(6, Math.floor(u * 7)), steps = Math.round(lerp(2400, 9800, ease(u))); return `<rect width="440" height="600" fill="#FDF3E3"/>` + calendarPage(220, 250, 1.15, (DAYS[S.lang] || DAYS.en)[i], true, Math.sin(u * 40) * 2) + `<g transform="translate(220 470)"><rect x="-120" y="-36" width="240" height="72" rx="36" fill="#12201B"/>${TXT(0, 10, 30, "#C8F06A", steps.toLocaleString(LOC()) + TL(" steps", " Schritte", " pasos"), 800)}</g>` + you(55, true, { x: 70, y: 600, s: .5, outfit: "sport", pose: { walk: T * 10, stride: 20 }, mood: "smile" }); } },
    { id: "A4", L: ["A04"], d: 4.6, fx: "warm", sfx: [["birds", .2]], age: [55, 65], cam: [220, 330, 1.15, 220, 330, 1.15], draw: (u, T, age) => { const sp = Math.cos(u * Math.PI * 2); return bgPark(T, { sy: 160 }) + [EX(2, { x: 70, y: 470, s: .62, pose: { walk: T * 8, stride: 14 } }), EX(4, { x: 370, y: 470, s: .62, pose: { walk: T * 8 + 1, stride: 14 } }), COACH({ x: 120, y: 480, s: .66, mood: "smile" })].join("") + you(age, true, { x: 230, y: 520, outfit: "sport", sx: Math.abs(sp) < .12 ? .12 : sp, mood: "smile" }) + `<rect width="440" height="600" fill="#FFF" opacity="${(Math.max(0, 1 - Math.abs(u - .5) * 8) * .7).toFixed(2)}"/>`; } },
    { id: "A5", L: ["A05"], d: 3.9, fx: "warm", cam: [220, 340, 1.1, 220, 340, 1.2], draw: (u, T) => bgDoctor() + DOCTOR({ x: 330, y: 500, pose: { aR: [60, 70] }, holdR: (hx, hy) => `<rect x="${hx - 14}" y="${hy - 26}" width="28" height="36" rx="3" fill="#FFF" stroke="#9FB2C3"/>`, mood: "smile", lx: -3 }) + you(65, true, { x: 140, y: 500, outfit: "sport", pose: { aR: u > .3 ? [120, -110] : [8, 5] }, mood: "laugh", lx: 3 }) },
    { id: "A6", L: ["A06"], d: 4.4, fx: "warm", sfx: [["birds", 0]], cam: [220, 330, 1, 220, 330, 1.1], draw: (u, T) => { const give = ease(cl((u - .55) * 3)); return bgPark(T, { lake: true, sy: 120 }) + [EX(0, { x: 50, y: 470, s: .6, mood: "smile" }), EX(1, { x: 400, y: 470, s: .6, mood: "smile" }), EX(3, { x: 350, y: 480, s: .62, mood: "smile", pose: u > .8 ? { aL: [90, 60], aR: [90, 60] } : {} })].join("") + COACH({ x: 290, y: 510, s: .9, pose: { aL: [lerp(10, 70, give), 20] }, holdL: (hx, hy) => `<circle cx="${hx}" cy="${hy + 6}" r="6" fill="#C0C6CC"/><path d="M${hx} ${hy}V${hy - 26}" stroke="#E74C3C" stroke-width="2"/>`, mood: "smile", lx: -3 }) + you(65, true, { x: 160, y: 510, s: .9, outfit: "sport", pose: { aR: [lerp(8, 60, give), 20] }, mood: u > .6 ? "laugh" : "smile", lx: 3 }); } },
    { id: "A7", L: ["A07"], d: 2.8, fx: "warm", sfx: [["birds", 0]], age: [65, 75], cam: [220, 320, 1, 220, 238, 2.2], draw: (u, T, age) => bgPark(T, { sy: 200, c2: "#FFD9A8" }) + you(age, true, { x: 220, y: 500, outfit: "sport", mood: "smile" }) + `<rect width="440" height="600" fill="#FFF" opacity="${(Math.max(0, 1 - Math.abs(u - .35) * 7) * .6).toFixed(2)}"/>` },
    goalShot("good", goal),
    { id: "A9", L: ["A09"], d: 5, fx: "warm", sfx: [["birds", .3]], end: true, cam: [220, 240, 2, 220, 320, 1], draw: (u, T) => bgPark(T, { sy: 200, c2: "#FFD9A8" }) + [EX(0, { x: 70, y: 450, s: .55, pose: { aR: [150 + Math.sin(T * 8) * 15, 10] }, mood: "laugh" }), FRIEND({ x: 130, y: 455, s: .56, pose: { aL: [150 + Math.sin(T * 7) * 15, 0] }, mood: "laugh" }), EX(1, { x: 310, y: 450, s: .55, pose: { aR: [150 + Math.sin(T * 6) * 15, 10] }, mood: "laugh" }), COACH({ x: 370, y: 455, s: .56, pose: { aR: [150 + Math.sin(T * 8) * 15, 10] }, mood: "laugh" })].join("") + you(75, true, { x: 220, y: 510, outfit: "sport", mood: "smile" }) }
  ];
  const badShots = [
    { id: "B1", L: ["B01"], d: 3.8, fx: "c1", cam: [220, 340, 1.2, 220, 340, 1.2], draw: (u, T) => bgRoom(T, { tv: true }) + you(55, false, { x: 220, y: 508, outfit: "work", pose: { sit: true, aR: [-20, -75] }, holdR: (hx, hy) => phone(hx, hy - 6, -10), mood: "neutral", lx: -4 }) },
    { id: "B2", L: ["B02"], d: 3.6, fx: "c1", sfx: [["steps", 0], ["door", 2.4]], draw: (u, T) => { const x = lerp(90, 215, ease(cl(u * 1.4))); return bgStreet(T) + bike(400, 470, .8, "#E74C3C", 0, false) + car(290, 490) + you(55, false, { x, y: 505, s: .8, outfit: "work", pose: u < .7 ? { walk: T * 8, stride: 16 } : {}, holdR: (hx, hy) => `<rect x="${hx - 14}" y="${hy}" width="28" height="22" rx="3" fill="#3A2E28"/>`, mood: "neutral" }); } },
    { id: "B3", L: ["B03"], d: 3, fx: "c2", draw: (u, T) => `<rect width="440" height="600" fill="#ECE7E0"/>` + [0, 1, 2, 3, 4, 5].map(i => { const p = cl(u * 2.2 - i * .25); return calendarPage(220 + p * 360, 250 - p * 120 + i * 4, 1.1, "", false, p * 60, 1 - p * .6); }).reverse().join("") },
    { id: "B4", L: ["B04"], d: 3.6, fx: "c2", age: [55, 65], cam: [220, 330, 1.15, 220, 330, 1.15], draw: (u, T, age) => { const sp = Math.cos(u * Math.PI * 2); return bgRoom(T, { tv: true }) + you(age, false, { x: 220, y: 510, outfit: "cardigan", sx: Math.abs(sp) < .12 ? .12 : sp, mood: "neutral" }) + `<rect width="440" height="600" fill="#FFF" opacity="${(Math.max(0, 1 - Math.abs(u - .5) * 8) * .5).toFixed(2)}"/>`; } },
    { id: "B5", L: ["B05"], d: 5.4, fx: "c2", cam: [220, 340, 1.1, 240, 330, 1.25], draw: (u, T) => bgDoctor() + DOCTOR({ x: 330, y: 500, pose: { aR: [60, 70] }, holdR: (hx, hy) => `<rect x="${hx - 14}" y="${hy - 26}" width="28" height="36" rx="3" fill="#FFF" stroke="#9FB2C3"/>`, mood: "neutral", lx: -3 }) + you(65, false, { x: 140, y: 505, outfit: "cardigan", pose: { sit: true }, mood: "sad", lx: 3 }) + `<rect x="70" y="415" width="140" height="10" rx="4" fill="#9AA6B1"/>` },
    { id: "B6", L: ["B06"], d: 3.8, fx: "c2", sfx: [["hang", 1]], cam: [200, 330, 1.1, 200, 330, 1.1], draw: (u, T) => bgStairs() + you(65, false, { x: 120, y: 505, outfit: "cardigan", pose: { aR: [150, -150] }, holdR: (hx, hy) => phone(hx + 2, hy - 4, 20), mood: "sad", lx: 4 }) },
    { id: "B7", L: ["B07"], d: 3.2, fx: "c3", age: [65, 75], sfx: [["tick", 0]], cam: [220, 320, 1, 220, 240, 2.1], draw: (u, T, age) => bgRoom(T, { day: true, sofa: "#7D7468" }) + you(age, false, { x: 220, y: 505, outfit: "cardigan", cane: age > 70, mood: "neutral" }) + `<rect width="440" height="600" fill="#FFF" opacity="${(Math.max(0, 1 - Math.abs(u - .35) * 7) * .45).toFixed(2)}"/>` },
    goalShot("bad", goal),
    { id: "B9", L: ["B09"], d: 4.6, fx: "rewind", age: [75, 55], draw: (u, T, age) => { let lines = ""; for (let i = 0; i < 14; i++)
        lines += `<rect x="0" y="${(i * 47 + T * 900) % 640 - 40}" width="440" height="3" fill="#FFF" opacity="${(.35 * (1 - u)).toFixed(2)}"/>`; return bgRoom(T, {}) + you(age, age < 64, { x: 220, y: 500, outfit: age < 62 ? "work" : "cardigan", pose: { sit: true, aR: [-20, -75] }, holdR: (hx, hy) => phone(hx, hy - 6, -10), mood: "neutral" }) + lines + (u < .4 ? `<g opacity=".9">${TXT(390, 60, 26, "#FFF", "◀◀", 800)}</g>` : ""); } },
    { id: "B10", L: ["B10"], d: 3.8, fx: "neutral", end: true, sfx: [["ping", .3]], draw: (u, T) => phoneUI(T, u, { bg: "#2B3440", screen: "#4F86A8" }) }
  ];
  /* short cut (team feedback: too long): the opening only once, in the first video (Path A = "bad"); remove an id to drop a scene */
  const all = kind === "good" ? goodShots : open.concat(badShots);
  return all.filter(s => STORY_CUT[kind].includes(s.id));
}
function buildStory(kind) {
  const shots = storyShots(kind, S.goal);
  let t = 0;
  const out = [];
  for (const sh of shots) {
    const ls = [];
    let o = .45;
    for (const id of sh.L) {
      const li = lineInfo(id);
      li.at = t + o;
      ls.push(li);
      o += li.d + .4;
    }
    const d = Math.max(sh.d || 0, o + .45);
    out.push({ ...sh, start: t, dur: d, lines: ls });
    t += d;
  }
  return { shots: out, total: t, lines: out.flatMap(s => s.lines), kind };
}
const FX = { neutral: "none", warm: "saturate(1.12) sepia(.06)", c1: "saturate(.85)", c2: "saturate(.62) brightness(.96)", c3: "saturate(.4) brightness(.92)" };
function drawAt(k, tl, T) {
  const sc = $("#scene" + k);
  if (!sc)
    return;
  let sh = tl.shots[tl.shots.length - 1];
  for (const s of tl.shots) {
    if (T < s.start + s.dur) {
      sh = s;
      break;
    }
  }
  const u = cl((T - sh.start) / sh.dur);
  TNOW = T;
  PFX = k;
  FACE_REF = S.face ? "yi" + k : null;
  const act = tl.lines.find(l => T >= l.at && T < l.at + l.d);
  TALK = act ? act.sp[0] : null;
  const age = sh.age ? lerp(sh.age[0], sh.age[1], ease(cl((u - .2) / .5))) : null;
  const filmed = filmAt(k, tl, sh, u, T), st = sc.querySelector("svg.st");
  if (st)
    st.style.visibility = filmed ? "hidden" : "";
  if (filmed) {
    FACE_REF = null;
    drawSubs(k, tl, T, act);
    return;
  }
  let inner;
  try {
    inner = sh.draw(u, T, age);
  }
  catch (e) {
    inner = `<rect width="440" height="600" fill="#333"/>`;
    console.error(e);
  }
  FACE_REF = null;
  const fade = Math.max(0, 1 - (T - sh.start) / .28, 1 - (sh.start + sh.dur - T) / .22);
  let filt = FX[sh.fx] || "none";
  if (sh.fx === "rewind")
    filt = `saturate(${lerp(.4, 1, u).toFixed(2)})`;
  let svg = sc.querySelector("svg.st");
  if (!svg) {
    sc.querySelectorAll(":scope>svg").forEach(e => e.remove());
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "st");
    svg.setAttribute("viewBox", "0 0 440 600");
    svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
    svg.innerHTML = `<g class="pd"></g><g class="fr"></g>`;
    sc.prepend(svg);
  }
  const fk = S.face ? S.face.length + ":" + S.face.slice(-24) : "";
  if (svg.dataset.fk !== fk) {
    svg.querySelector(".pd").innerHTML = faceDefs("yi" + k);
    svg.dataset.fk = fk;
  }
  svg.style.filter = filt;
  svg.querySelector(".fr").innerHTML = `<g transform="${camT(sh.cam, u)}">${inner}</g><rect width="440" height="600" fill="#000" opacity="${(Math.min(1, fade) * .85).toFixed(2)}" pointer-events="none"/>`;
  drawSubs(k, tl, T, act);
}
function drawSubs(k, tl, T, act) {
  const shown = act || tl.lines.filter(l => l.at <= T && T < l.at + l.d + 1.2).pop();
  const who = $("#who" + k), sub = $("#sub" + k);
  if (shown) {
    const nm = shown.sp[0];
    const lab = SPK_NAME[S.lang][nm] + (nm === "Y" ? " · " + shown.sp.replace(/\D/g, "") : "");
    if (who.textContent !== lab)
      who.textContent = lab;
    const q = quote(shown.txt);
    if (sub.textContent !== q)
      sub.textContent = q;
    sub.classList.toggle("lit", !!act);
  }
  const p = cl(T / tl.total), fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  $("#tr" + k).style.width = (p * 100) + "%";
  $("#prog" + k).style.width = (p * 100) + "%";
  $("#tm" + k).textContent = `${fmt(T)} / ${fmt(tl.total)}`;
}
