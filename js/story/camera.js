/* ---------- camera + overlays ---------- */
function camT(c, u) {
  if (!c)
    return "";
  const e = ease(u), x = lerp(c[0], c[3], e), y = lerp(c[1], c[4], e), z = lerp(c[2], c[5], e);
  const cx = cl(x, 220 / z, 440 - 220 / z), cy = cl(y, 300 / z, 600 - 300 / z);
  return `translate(220 300) scale(${z.toFixed(3)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`;
}
function phoneUI(T, u, o = {}) {
  const slide = cl(u * 3) * (o.away ? 1 - cl((u - .45) * 4) : 1), y = lerp(-140, 0, ease(slide));
  return `<rect width="440" height="600" fill="${o.bg || "#2B3440"}"/><g transform="translate(220 330)"><rect x="-130" y="-250" width="260" height="520" rx="38" fill="#14181C"/><rect x="-118" y="-238" width="236" height="496" rx="30" fill="${o.screen || "#3F6C8E"}"/>${TXT(0, -170, 46, "#FFF", "21:47", 300)}${TXT(0, -140, 14, "#DCEBF5", S.lang === "de" ? "Dienstag, 14. Mai" : "Tuesday, 14 May", 500)}<g transform="translate(0 ${-60 + y})" opacity="${cl(slide * 2)}"><rect x="-110" y="-42" width="220" height="86" rx="16" fill="#FFFFFF" opacity=".95"/><rect x="-98" y="-30" width="24" height="24" rx="7" fill="#C8F06A"/>${TXT(-66, -14, 10, "#5A6670", "TWO PATHS · " + (S.lang === "de" ? "jetzt" : "now"), 800, "start")}${TXT(-98, 10, 14, "#12201B", S.lang === "de" ? "Walking-Gruppe 50+" : "Walking group 50+", 800, "start")}${TXT(-98, 26, 12, "#12201B", S.lang === "de" ? "Morgen um 9:00 – bist du dabei?" : "Tomorrow at 9:00 – are you in?", 600, "start")}${TXT(-98, 40, 11, "#5A6670", S.lang === "de" ? "Petra und 6 andere kommen" : "Petra and 6 others are going", 500, "start")}</g>${o.thumb ? `<g transform="translate(${lerp(140, 40, ease(cl(u * 2))) + (o.away && u > .45 ? -200 * ease(cl((u - .45) * 3)) : 0)} ${200 - 60 * ease(cl(u * 2))})"><ellipse rx="44" ry="70" fill="#E5BE9E" transform="rotate(-30)"/></g>` : ""}</g>`;
}
