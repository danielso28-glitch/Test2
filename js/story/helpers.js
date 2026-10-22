/* ================= STORY ENGINE v4: three acts, recorded voices, subtitles ================= */
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, t) => a + (b - a) * t, ease = x => { x = cl(x); return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }, RAD = Math.PI / 180;
function mix(a, b, t) { t = cl(t); const p = x => [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16)); const A = p(a), B = p(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join(""); }
const TXT = (x, y, s, c, str, w = 700, a = "middle") => `<text x="${x}" y="${y}" font-family="Figtree,system-ui,sans-serif" font-weight="${w}" font-size="${s}" fill="${c}" text-anchor="${a}">${esc(str)}</text>`;
