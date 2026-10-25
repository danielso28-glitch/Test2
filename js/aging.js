/* ================= AGED FACES (on the phone) ================= */
/* From the scanned face (240×282) two portraits at 75 are drawn on a canvas, nothing is uploaded:
   a = Path A, without exercise: white hair, deep lines, bags, sagging jaw, sallow tired skin, age spots
   b = Path B, with exercise:    silver hair, laugh lines, healthy colour, rosy cheeks
   The lines are placed with the face keypoints (eyes, nose, mouth) when the detector is available,
   otherwise with the usual position after the scan's auto-crop. Cached in S.faceOld. */
const faceKey = () => S.face ? S.face.length + ":" + S.face.slice(-24) : "";
const agedFace = bad => (S.faceOld && S.faceOld.k === faceKey() && S.faceOld[bad ? "a" : "b"]) || S.face;
let AGING = null;
function ageFaces() {
  const k = faceKey();
  if (!k || (S.faceOld && S.faceOld.k === k))
    return Promise.resolve();
  if (AGING && AGING.k === k)
    return AGING.p;
  const p = (async () => {
    const im = new Image();
    im.src = S.face;
    await im.decode();
    /* the detector may still be loading from the CDN – don't wait for it longer than 3 s */
    const box = await Promise.race([detectFace(im).catch(() => null), new Promise(r => setTimeout(() => r(null), 3000))]);
    const G = faceGeom(box && box.kp, im.width, im.height);
    const out = { k, a: await drawAged(im, G, true), b: await drawAged(im, G, false) };
    if (faceKey() === k) {
      S.faceOld = out;
      save();
    }
  })().catch(() => { });
  AGING = { k, p };
  return p;
}
/* eyes (left/right in the picture), nose, mouth in pixels; d = distance between the eyes */
function faceGeom(kp, W, H) {
  if (kp && kp.length >= 4) {
    const [e1, e2, n, m] = kp.map(q => ({ x: q.x * W, y: q.y * H }));
    const [eL, eR] = e1.x < e2.x ? [e1, e2] : [e2, e1], d = eR.x - eL.x;
    if (d > W * .18 && d < W * .7 && m.y > n.y && n.y > Math.min(eL.y, eR.y))
      return { eL, eR, n, m, d, cx: (eL.x + eR.x) / 2, ey: (eL.y + eR.y) / 2 };
  }
  const d = W * .35, ey = H * .39;
  return { eL: { x: W / 2 - d / 2, y: ey }, eR: { x: W / 2 + d / 2, y: ey }, n: { x: W / 2, y: ey + d * .55 }, m: { x: W / 2, y: ey + d * 1.05 }, d, cx: W / 2, ey };
}
const smooth = (a, b, x) => { const u = cl((x - a) / (b - a)); return u * u * (3 - 2 * u); };
async function drawAged(im, G, bad) {
  const W = im.width, H = im.height, cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const c = cv.getContext("2d"), { d, cx, ey, n, m } = G;
  /* 1 sagging lower face (A): below the nose the face is stretched down and a little wider – jowls */
  c.drawImage(im, 0, 0);
  const sag = bad ? .07 : .015;
  for (let y = Math.floor(n.y); y < H; y++) {
    const r = smooth(n.y, n.y + d * .6, y), sy = y - (y - n.y) * sag * r, wx = 1 + sag * .7 * r;
    c.drawImage(im, cx - cx / wx, sy, W / wx, 1, 0, y, W, 1);
  }
  /* 2 pixel pass: hair (MediaPipe hair mask) and brows turn grey, skin tone per path; the background stays as it is */
  const hm = await hairMask(cv).catch(() => null);
  const px = c.getImageData(0, 0, W, H), D = px.data;
  const at = (x, y, rr) => { let t = [0, 0, 0], k = 0;
    for (let yy = Math.max(0, y - rr); yy <= Math.min(H - 1, y + rr); yy++)
      for (let xx = Math.max(0, x - rr); xx <= Math.min(W - 1, x + rr); xx++) {
        const i = (Math.round(yy) * W + Math.round(xx)) * 4;
        t[0] += D[i]; t[1] += D[i + 1]; t[2] += D[i + 2]; k++;
      }
    return t.map(v => v / Math.max(1, k) / 255); };
  const lum = q => .3 * q[0] + .59 * q[1] + .11 * q[2];
  /* colour distance: hue (normalised rgb) + brightness ratio, tolerant to light and shade */
  const cd = (q, p) => { const sq = q[0] + q[1] + q[2] + .03, sp = p[0] + p[1] + p[2] + .03;
    return Math.hypot(q[0] / sq - p[0] / sp, q[1] / sq - p[1] / sp) * 3 + Math.abs(Math.log((lum(q) + .04) / (lum(p) + .04))) * .3; };
  const r0 = Math.max(2, Math.round(d * .12)), Sk = [at(G.eL.x, G.eL.y + d * .5, r0), at(G.eR.x, G.eR.y + d * .5, r0)].reduce((x, y) => x.map((v, j) => (v + y[j]) / 2));
  const hair = hm ? (x, y) => hm.a[Math.min(hm.h - 1, Math.floor(y * hm.h / H)) * hm.w + Math.min(hm.w - 1, Math.floor(x * hm.w / W))]
    : (x, y, l) => smooth(ey - d * .8, ey - d * 1.1, y) * smooth(.45, .2, l) * smooth(1.6, 1.2, Math.abs(x - cx) / d); /* no model (offline): dark area above the forehead */
  const fy = ey + d * .32, sl = lum(Sk), by = ey - d * .3;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      let r = D[i] / 255, g = D[i + 1] / 255, b = D[i + 2] / 255;
      const q = [r, g, b], l = lum(q);
      const dS = cd(q, Sk), skin = smooth(.45, .18, dS) * smooth(1.4, 1.1, Math.hypot((x - cx) / d, (y - fy) / (d * 1.9)));
      /* the hair mask can spill onto the face edge: skin-coloured pixels stay skin */
      let hw = hair(x, y, l) * smooth(.06, .16, dS);
      /* eyebrows: darker than the skin, around the brow line */
      const bw = Math.exp(-(((y - by) / (d * .09)) ** 2) - (((Math.abs(x - cx) - d * .48) / (d * .28)) ** 2)) * smooth(sl * .9, sl * .6, l);
      hw = Math.max(hw, bw * .7) * (bad ? .95 : .82);
      if (hw > .01) { /* keep the hair texture (light and dark strands), lift it to white (A) or silver (B) */
        const s = cl((bad ? .66 : .54) + (l - .25) * 1.4);
        r += (s - r) * hw;
        g += (s - g) * hw;
        b += (s * 1.02 - b) * hw;
      }
      const inF = skin * (1 - hw), L2 = .3 * r + .59 * g + .11 * b;
      if (bad) { /* tired, sallow skin; the rest of the picture only a little duller */
        const ds = .12 + .32 * inF, k = 1 - .1 * inF;
        r = (r + (L2 - r) * ds) * k;
        g = (g + (L2 - g) * ds) * k;
        b = (b + (L2 - b) * ds) * k * (1 - .07 * inF);
      }
      else { /* healthy: warmer, a little brighter */
        r += (r - L2) * .12 * inF + .035 * inF;
        g += (g - L2) * .12 * inF + .012 * inF;
        b += (b - L2) * .12 * inF - .01 * inF;
      }
      D[i] = cl(r) * 255;
      D[i + 1] = cl(g) * 255;
      D[i + 2] = cl(b) * 255;
    }
  c.putImageData(px, 0, 0);
  /* 3 lines and shadows, drawn soft (shadowBlur works on every phone, canvas filter does not) */
  const s = bad ? 1.25 : .5, w = Math.max(1.2, d * .022);
  const line = (pts, a, wd = w) => {
    for (const [mode, col, dy, k] of [["multiply", "70,40,32", 0, 1], ["screen", "255,240,228", wd * .9, .45]]) {
      c.save();
      c.globalCompositeOperation = mode;
      c.strokeStyle = c.shadowColor = `rgba(${col},${(a * k).toFixed(3)})`;
      c.shadowBlur = wd * 1.4;
      c.lineWidth = wd;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(pts[0], pts[1] + dy);
      if (pts.length > 4)
        c.quadraticCurveTo(pts[2], pts[3] + dy, pts[4], pts[5] + dy);
      else
        c.lineTo(pts[2], pts[3] + dy);
      c.stroke();
      c.restore();
    }
  };
  const blob = (x, y, rad, col, a, mode = "multiply") => {
    c.save();
    c.globalCompositeOperation = mode;
    const gr = c.createRadialGradient(x, y, 0, x, y, rad);
    gr.addColorStop(0, `rgba(${col},${a})`);
    gr.addColorStop(1, `rgba(${col},0)`);
    c.fillStyle = gr;
    c.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    c.restore();
  };
  /* forehead */
  [.62, .8, .98].forEach((f, j) => { if (bad || j < 2)
    line([cx - d * (.5 - j * .05), ey - d * f + d * .03, cx, ey - d * (f + .05), cx + d * (.5 - j * .05), ey - d * f + d * .03], .3 * s); });
  if (bad) /* frown lines */
    [-1, 1].forEach(z => line([cx + z * d * .07, ey - d * .42, cx + z * d * .09, ey - d * .17], .28));
  [G.eL, G.eR].forEach((e, j) => {
    const z = j ? 1 : -1, ox = e.x + z * d * .3;
    /* crow's feet – laugh lines on both paths */
    [-.45, 0, .45].forEach(an => line([ox, e.y, ox + z * Math.cos(an) * d * .22, e.y + Math.sin(an) * d * .22], .26 * (bad ? 1 : .75), w * .8));
    /* under the eyes */
    line([e.x - d * .2, e.y + d * .13, e.x, e.y + d * .27, e.x + d * .2, e.y + d * .13], .26 * s, w * .9);
    if (bad) {
      blob(e.x, e.y + d * .2, d * .24, "105,62,72", .32);
      line([e.x - d * .22, e.y + d * .3, e.x, e.y + d * .44, e.x + d * .24, e.y + d * .28], .24, w * 1.1);
      /* hooded upper lid */
      line([e.x - d * .05 * z, e.y - d * .15, e.x + d * .12 * z, e.y - d * .19, e.x + d * .27 * z, e.y - d * .08], .2, w * 1.4);
      /* hollow cheeks */
      blob(e.x + z * d * .08, e.y + d * .78, d * .3, "80,62,55", .2);
    }
    else /* rosy cheeks */
      blob(e.x + z * d * .05, e.y + d * .58, d * .3, "236,104,92", .17, "source-over");
    /* nose-to-mouth fold, deeper without exercise */
    line([n.x + z * d * .25, n.y - d * .04, n.x + z * d * (bad ? .44 : .4), (n.y + m.y) / 2 + d * .04, m.x + z * d * .38, m.y + d * (bad ? .16 : .08)], (bad ? .38 : .2), w * 1.3);
    if (bad) /* mouth corners pulled down */
      line([m.x + z * d * .34, m.y + d * .1, m.x + z * d * .4, m.y + d * .32, m.x + z * d * .44, m.y + d * .5], .3, w * 1.1);
  });
  if (bad) /* a few age spots */
    [[-.42, -.55, .035], [.38, -.7, .03], [.62, .1, .04], [-.6, .35, .028], [.2, -.9, .025]].forEach(([dx, dy, rr]) => blob(cx + dx * d, ey + dy * d, d * rr, "120,78,48", .3));
  return cv.toDataURL("image/jpeg", .85);
}
