/* ================= DRAWING ================= */
function head(mood, x, y, s) {
  if (S.face) {
    const n = ++FID, f = S.gender === "f", sat = mood === "happy" ? .95 : mood === "ok" ? .7 : .4, br = mood === "sad" ? .88 : 1;
    const hair = f ? `<path d="M-50 -2 Q-52 -50 0 -52 Q52 -50 50 -2 Q44 -34 0 -38 Q-44 -34 -50 -2z" fill="#E6E8EA"/>` : `<path d="M-48 -8 A48 48 0 0 1 48 -8 Q40 -40 0 -46 Q-40 -40 -48 -8z" fill="#E6E8EA"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s})"><filter id="hf${n}"><feColorMatrix type="saturate" values="${sat}"/><feComponentTransfer><feFuncR type="linear" slope="${br}"/><feFuncG type="linear" slope="${br}"/><feFuncB type="linear" slope="${br}"/></feComponentTransfer></filter><clipPath id="hc${n}"><ellipse rx="44" ry="52"/></clipPath><ellipse cx="-44" cy="8" rx="8" ry="12" fill="#D9B597"/><ellipse cx="44" cy="8" rx="8" ry="12" fill="#D9B597"/><image href="${S.face}" x="-44" y="-52" width="88" height="104" preserveAspectRatio="xMidYMid slice" clip-path="url(#hc${n})" filter="url(#hf${n})"/><g opacity="${mood === "happy" ? .55 : .85}">${hair}</g></g>`;
  }
  const f = S.gender === "f", skin = mood === "happy" ? "#E8C5A6" : mood === "ok" ? "#DDBB9F" : "#C9B09E";
  const hair = f ? `<path d="M-50 -2 Q-52 -50 0 -52 Q52 -50 50 -2 Q44 -34 0 -38 Q-44 -34 -50 -2z" fill="#E6E8EA"/><circle cx="0" cy="-58" r="16" fill="#E6E8EA"/>`
    : `<path d="M-48 -8 A48 48 0 0 1 48 -8 Q40 -40 0 -46 Q-40 -40 -48 -8z" fill="#E6E8EA"/>`;
  let face;
  if (mood === "happy")
    face = `<circle cx="-22" cy="8" r="13" fill="none" stroke="#12201B" stroke-width="4"/><circle cx="22" cy="8" r="13" fill="none" stroke="#12201B" stroke-width="4"/><path d="M-9 8h18" stroke="#12201B" stroke-width="4"/><path d="M-29 9q7-7 14 0M15 9q7-7 14 0" fill="none" stroke="#12201B" stroke-width="3.5" stroke-linecap="round"/><circle cx="-34" cy="26" r="7" fill="#F2A68F" opacity=".8"/><circle cx="34" cy="26" r="7" fill="#F2A68F" opacity=".8"/><path d="M-16 26q16 16 32 0" fill="none" stroke="#7A3B1F" stroke-width="4.5" stroke-linecap="round"/>`;
  else if (mood === "ok")
    face = `<circle cx="-22" cy="6" r="13" fill="none" stroke="#12201B" stroke-width="4"/><circle cx="22" cy="6" r="13" fill="none" stroke="#12201B" stroke-width="4"/><path d="M-9 6h18" stroke="#12201B" stroke-width="4"/><circle cx="-22" cy="7" r="4" fill="#12201B"/><circle cx="22" cy="7" r="4" fill="#12201B"/><path d="M-12 30q12 6 24 0" fill="none" stroke="#5A3A2A" stroke-width="4.5" stroke-linecap="round"/>`;
  else
    face = `<path d="M-24 -18h20" stroke="#8E7A6C" stroke-width="3" stroke-linecap="round"/><circle cx="-22" cy="6" r="13" fill="none" stroke="#12201B" stroke-width="4"/><circle cx="22" cy="6" r="13" fill="none" stroke="#12201B" stroke-width="4"/><path d="M-9 6h18" stroke="#12201B" stroke-width="4"/><circle cx="-22" cy="8" r="4" fill="#12201B"/><circle cx="22" cy="8" r="4" fill="#12201B"/><path d="M-14 36q14-12 28 0" fill="none" stroke="#3A2E28" stroke-width="4.5" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="-50" cy="12" rx="9" ry="12" fill="${skin}"/><ellipse cx="50" cy="12" rx="9" ry="12" fill="${skin}"/><circle r="50" fill="${skin}"/>${hair}${face}</g>`;
}
function corners(x, y, w, c) { const l = 22; return `<g fill="none" stroke="${c}" stroke-width="4"><path d="M${x} ${y + l}V${y}h${l}M${x + w - l} ${y}h${l}v${l}M${x + w} ${y + w - l}v${l}h-${l}M${x + l} ${y + w}h-${l}v-${l}"/></g>`; }
const tag = (x, y, w, bg, fg) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="28" rx="14" fill="${bg}"/><text x="${x}" y="${y + 19}" text-anchor="middle" font-family="Figtree,sans-serif" font-weight="700" font-size="14" fill="${fg}">${t("youAt75")}</text>`;
function child(col, hair) { return `<g class="lg1"><path d="M-8 34l-4 42" stroke="#12201B" stroke-width="9" stroke-linecap="round"/></g><g class="lg2"><path d="M8 34l4 42" stroke="#12201B" stroke-width="9" stroke-linecap="round"/></g><rect x="-17" y="-26" width="34" height="62" rx="12" fill="${col}"/><g class="arm"><path d="M12 -18l18-26" stroke="${col}" stroke-width="9" stroke-linecap="round"/></g><circle cx="0" cy="-48" r="23" fill="#E8C5A6"/><path d="M-23 -50a23 23 0 0 1 46 0q-12-14-46 0z" fill="${hair}"/><circle cx="-7" cy="-46" r="2.5" fill="#12201B"/><circle cx="7" cy="-46" r="2.5" fill="#12201B"/><path d="M-8 -38q8 7 16 0" fill="none" stroke="#12201B" stroke-width="2.5" stroke-linecap="round"/>`; }
const chipAvatar = m => `<svg viewBox="-60 -70 120 128" width="100%" height="100%">${head(m === "sad" ? "sad" : "happy", 0, 4, .95)}</svg>`;
