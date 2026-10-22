/* ---------- backgrounds ---------- */
function sky(c1, c2) { return `<defs><linearGradient id="skyg${PFX}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="440" height="600" fill="url(#skyg${PFX})"/>`; }
function bgPark(T, o = {}) { const sun = o.sun !== false; return sky(o.c1 || "#9ED4F5", o.c2 || "#FDE8C8") + (sun ? `<circle cx="${o.sx || 340}" cy="${o.sy || 130}" r="44" fill="#FFE08A"/><circle cx="${o.sx || 340}" cy="${o.sy || 130}" r="62" fill="#FFE08A" opacity=".25"/>` : "") + `<ellipse cx="${(80 + T * 6) % 560 - 60}" cy="90" rx="50" ry="14" fill="#FFF" opacity=".8"/><path d="M0 420Q120 370 240 405T440 395V600H0Z" fill="#8CCB7E"/><path d="M0 455Q220 420 440 455V600H0Z" fill="#79BC6C"/>` + (o.lake ? `<path d="M0 430Q220 418 440 430V452Q220 440 0 452Z" fill="#6FB6D9"/>` : "") + `${tree(40, 450, .9)}${tree(400, 445, 1)}${tree(300, 425, .6, "#5DA868", "#4A9157")}${tree(130, 420, .55, "#5DA868", "#4A9157")}<path d="M170 600L205 445H240L300 600Z" fill="#E6D3B3"/>`; }
function bgRoom(T, o = {}) {
  const tv = o.tv ? (.55 + Math.sin(T * 9) * .08 + Math.sin(T * 3.3) * .06) : 0;
  return `<rect width="440" height="600" fill="${o.wall || "#E9DCCB"}"/><rect y="470" width="440" height="130" fill="#B48A64"/><path d="M0 470H440" stroke="#9C7553" stroke-width="3"/><rect x="250" y="110" width="140" height="170" rx="8" fill="${o.day ? "#BFE4F7" : "#1F2D4A"}" stroke="#FFFFFF" stroke-width="8"/><path d="M320 110V280M250 195H390" stroke="#FFFFFF" stroke-width="6"/>${o.day ? "" : `<circle cx="356" cy="150" r="14" fill="#F4F1DE"/>`}<g transform="translate(70 300)"><path d="M0 0v170" stroke="#3C3C3C" stroke-width="5"/><path d="M-28 0h56l-14 -44h-28z" fill="#F6C770"/><ellipse cx="0" cy="10" rx="70" ry="60" fill="#FFD98A" opacity="${o.day ? 0 : .22}"/></g><rect x="40" y="520" width="360" height="40" rx="20" fill="#C9A47E" opacity=".6"/>${sofa(220, 510, o.sofa || "#5C6B7A")}` + (o.tv ? `<rect x="0" y="0" width="440" height="600" fill="#5DA9FF" opacity="${(tv * .22).toFixed(2)}"/>` : "");
}
function bgDoctor() { return `<rect width="440" height="600" fill="#E3EEF6"/><rect y="480" width="440" height="120" fill="#C8D3DC"/><rect x="40" y="110" width="110" height="140" rx="6" fill="#FFF" stroke="#B9C6D1" stroke-width="3"/><path d="M60 150h70M60 175h50M60 200h62" stroke="#9FB2C3" stroke-width="5" stroke-linecap="round"/><path d="M58 228l20 -14 18 8 26 -22" stroke="#E74C3C" stroke-width="4" fill="none"/><rect x="290" y="100" width="110" height="130" rx="6" fill="#BFE4F7" stroke="#FFF" stroke-width="7"/><rect x="190" y="400" width="250" height="20" rx="6" fill="#8E6E53"/><rect x="420" y="420" width="12" height="80" fill="#7A5C45"/><circle cx="110" cy="80" r="0"/>`; }
function bgStreet(T) { return sky("#B9D7EA", "#E8EEF2") + `<rect x="0" y="210" width="150" height="270" fill="#C9B9A6"/><rect x="150" y="250" width="140" height="230" fill="#B5A08C"/><rect x="290" y="190" width="150" height="290" fill="#D0C3B3"/>${[30, 90].map(x => `<rect x="${x}" y="260" width="34" height="46" fill="#7FA6C2"/><rect x="${x}" y="340" width="34" height="46" fill="#7FA6C2"/>`).join("")}${[320, 380].map(x => `<rect x="${x}" y="240" width="34" height="46" fill="#7FA6C2"/><rect x="${x}" y="320" width="34" height="46" fill="#7FA6C2"/>`).join("")}<rect y="480" width="440" height="120" fill="#8D959C"/><rect y="470" width="440" height="14" fill="#B8BEC3"/>`; }
function car(x, y, c = "#3B6EA5") { return `<g transform="translate(${x} ${y})"><path d="M-110 -20Q-108 -48 -80 -50L-56 -82Q-48 -92 -30 -92H40Q58 -92 70 -78L92 -50Q116 -48 118 -20V0H-110Z" fill="${c}"/><path d="M-46 -78L-30 -84H8V-52H-62ZM18 -84H40Q52 -84 60 -74L74 -52H18Z" fill="#CFE6F5"/><circle cx="-62" cy="2" r="22" fill="#22282E"/><circle cx="66" cy="2" r="22" fill="#22282E"/><circle cx="-62" cy="2" r="9" fill="#9AA4AC"/><circle cx="66" cy="2" r="9" fill="#9AA4AC"/></g>`; }
function bgStairs(o = {}) {
  let st = "";
  for (let i = 0; i < 9; i++)
    st += `<rect x="${120 + i * 30}" y="${500 - i * 34}" width="${320 - i * 30}" height="34" fill="${i % 2 ? "#C9B79F" : "#D6C6B0"}"/>`;
  return `<rect width="440" height="600" fill="${o.wall || "#EFE6D8"}"/>${st}<rect y="500" width="440" height="100" fill="#A9927A"/><rect x="345" y="70" width="80" height="130" rx="4" fill="#8E5E3C"/><circle cx="410" cy="140" r="4" fill="#E8C66A"/><path d="M120 470L390 160" stroke="#6F5640" stroke-width="6"/>` + (o.lift ? `<path d="M140 486L400 186" stroke="#B0B8BF" stroke-width="10"/><rect x="150" y="430" width="40" height="44" rx="6" fill="#D0D6DB"/>` : "");
}
function bgOldTown() {
  let h = "";
  const cols = ["#F2B9A0", "#F7D794", "#A8D8EA", "#F6C1C6", "#C3E3B5", "#F2E3C6"];
  for (let i = 0; i < 7; i++) {
    const x = i * 66 - 10, ht = 160 + ((i * 53) % 90);
    h += `<rect x="${x}" y="${330 - ht}" width="70" height="${ht + 120}" fill="${cols[i % 6]}"/><path d="M${x - 4} ${330 - ht}L${x + 35} ${300 - ht}L${x + 74} ${330 - ht}Z" fill="#C0583A"/>${[0, 1, 2].map(r => `<rect x="${x + 14}" y="${350 - ht + r * 52}" width="16" height="24" fill="#5B7D96"/><rect x="${x + 40}" y="${350 - ht + r * 52}" width="16" height="24" fill="#5B7D96"/>`).join("")}`;
  }
  let st = "";
  for (let i = 0; i < 10; i++)
    st += `<rect x="${60 + i * 26}" y="${560 - i * 28}" width="${380 - i * 26}" height="30" fill="${i % 2 ? "#D7CDBF" : "#E4DBCF"}"/>`;
  return sky("#7EC8F0", "#FFF1D6") + h + st + `<rect y="560" width="440" height="40" fill="#CFC3B3"/>`;
}
function bgHall(T, o = {}) {
  let l = "";
  for (let i = 0; i < 9; i++) {
    const x = 20 + i * 50, on = (Math.sin(T * 4 + i) + 1) / 2;
    l += `<circle cx="${x}" cy="${70 + Math.sin(i) * 10}" r="7" fill="#FFE08A" opacity="${(.5 + on * .5).toFixed(2)}"/>`;
  }
  return `<rect width="440" height="600" fill="${o.dim ? "#3A3346" : "#4A3D5C"}"/><path d="M0 60Q110 100 220 60T440 60" stroke="#FFE08A" stroke-width="2" fill="none"/>${l}<rect y="470" width="440" height="130" fill="#6B4E3D"/><path d="M0 470H440" stroke="#8A6A55" stroke-width="3"/>${[0, 1, 2, 3].map(i => `<circle cx="${60 + i * 110}" cy="${180 + (i % 2) * 30}" r="${40}" fill="#FFF" opacity=".04"/>`).join("")}`;
}
function bgSummit() { return sky("#6FB7E8", "#DDF1FB") + `<path d="M0 360L80 300L140 330L230 240L300 300L360 270L440 320V600H0Z" fill="#9DB7C9"/><path d="M0 420L120 330L190 370L250 300L330 360L440 340V600H0Z" fill="#7FA36E"/><path d="M60 600L220 280L380 600Z" fill="#8FB57A"/><path d="M220 280v-90M196 214h48" stroke="#5A4636" stroke-width="9" stroke-linecap="round"/>`; }
function bgCafe(o = {}) { return sky("#A7D8F0", "#FCEBD5") + `<rect x="0" y="150" width="440" height="330" fill="#E9D7C0"/><path d="M0 150L20 190H420L440 150Z" fill="${o.awn || "#C0392B"}"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => `<path d="M${i * 44} 150L${i * 44 + 22} 190" stroke="#FFF" stroke-width="10" opacity=".7"/>`).join("")}<rect x="40" y="220" width="150" height="150" rx="6" fill="#8DBAD3"/><rect x="250" y="220" width="150" height="150" rx="6" fill="#8DBAD3"/>${TXT(220, 175, 16, "#FFF", "CAFÉ", 800)}<rect y="480" width="440" height="120" fill="#CDBEA8"/>`; }
function bgCellar() { return `<rect width="440" height="600" fill="#3B3632"/><rect y="470" width="440" height="130" fill="#2C2825"/><rect x="40" y="90" width="90" height="60" fill="#5A544D"/><path d="M40 90l90 60M130 90l-90 60" stroke="#3B3632" stroke-width="3"/><path d="M300 60q30 10 50 40M310 60q10 30 40 40M330 60l20 40" stroke="#8A8580" stroke-width="1" fill="none" opacity=".6"/><rect x="330" y="200" width="80" height="270" fill="#4A4540"/>`; }
function bgGarden(lush) {
  if (lush)
    return bgPark(0, { c1: "#9ED4F5", c2: "#FFF3D6" }) + `<rect y="440" width="440" height="160" fill="#8B5E3C"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${40 + i * 70} 440q-10 -40 0 -60q10 20 0 60M${40 + i * 70} 440q14 -30 26 -36" stroke="#3E8E41" stroke-width="6" fill="none" stroke-linecap="round"/>`).join("")}`;
  let g = "";
  for (let i = 0; i < 40; i++) {
    const x = (i * 37) % 440, h = 60 + (i * 29) % 120;
    g += `<path d="M${x} 600Q${x + ((i % 3) - 1) * 20} ${600 - h / 2} ${x + ((i % 5) - 2) * 12} ${600 - h}" stroke="${i % 2 ? "#6E8A4E" : "#5A7342"}" stroke-width="5" fill="none"/>`;
  }
  return sky("#B9C6CF", "#DCE1E4") + `<rect y="400" width="440" height="200" fill="#7C8A5E"/>${g}`;
}
