/* ---------- line texts ---------- */
const LT = {
  O01: ["This is you. Fifty-five. Busy, a bit tired – like most evenings.", "Das bist du. Fünfundfünfzig. Viel zu tun, ein bisschen müde – wie an den meisten Abenden."],
  O02: ["Hmm. Maybe next week.", "Hm. Vielleicht nächste Woche."],
  O03: ["One small choice. Twenty years. Two paths.", "Eine kleine Entscheidung. Zwanzig Jahre. Zwei Wege."],
  A01: ["So you went. Just once, to try.", "Also bist du hingegangen. Nur einmal, zum Ausprobieren."],
  A02: ["First time? Don't worry – we mostly talk.", "Das erste Mal? Keine Sorge – wir reden hauptsächlich."],
  A03: ["Funny. I actually look forward to Tuesdays now.", "Komisch. Ich freue mich jetzt richtig auf die Dienstage."],
  A04: ["Ten years later. The group has changed. You kept going.", "Zehn Jahre später. Die Gruppe hat sich verändert. Du bist geblieben."],
  A05: ["Same as last year? I'll take that.", "Genauso wie letztes Jahr? Nehme ich."],
  A06: ["Can you lead the Thursday group? They listen to you.", "Kannst du die Donnerstagsgruppe leiten? Auf dich hören sie."],
  A07: ["Seventy-five.", "Fünfundsiebzig."],
  A09: ["It started with one Tuesday. Your Tuesday is waiting.", "Mit einem einzigen Dienstag hat alles angefangen. Fang du auch an."],
  B01: ["Next week turned into next month.", "Aus nächster Woche wurde nächster Monat."],
  B02: ["I'll start when things calm down at work.", "Ich fange an, wenn es im Job ruhiger wird."],
  B03: ["They never calmed down.", "Es wurde nie ruhiger."],
  B04: ["Ten years later.", "Zehn Jahre später."],
  B05: ["Your back and your blood pressure – we should really talk about moving more.", "Ihr Rücken und Ihr Blutdruck – wir sollten wirklich über mehr Bewegung reden."],
  B06: ["You go without me. My knees, you know.", "Geht ohne mich. Meine Knie, du weißt ja."],
  B07: ["Seventy-five.", "Fünfundsiebzig."],
  B09: ["But this isn't fixed. You're still on the sofa at fifty-five.", "Aber nichts davon steht fest. Du sitzt noch mit fünfundfünfzig auf dem Sofa."],
  B10: ["And the question is still open.", "Und die Frage ist noch offen."],
  A08_grand: ["I'm coming, I'm coming!", "Warte auf mich, ich bin gleich da!"],
  A08_travel: ["Two hundred steps – and worth every one.", "So viele Stufen, aber die Aussicht ist es wert."],
  A08_own: ["My flat, my rules, my stairs.", "Ich wohne hier und mache alles selbst."],
  A08_garden: ["Best harvest yet – and my back agrees.", "So viel Gemüse hatte ich noch nie."],
  A08_dance: ["Tuesdays!", "Immer dienstags!"],
  A08_friends: ["Wouldn't miss it.", "Da bin ich jedes Mal dabei."],
  B08_grand: ["Next time, sweetheart.", "Nächstes Mal, Schatz."],
  B08_travel: ["I'll see the photos later.", "Ich schau mir später die Fotos an."],
  B08_cycle: ["I should really sell it.", "Ich sollte es wirklich verkaufen."],
  B08_own: ["Maybe it's time to stop pretending.", "Vielleicht ist es Zeit, ehrlich zu sein."],
  B08_garden: ["I used to love that garden.", "Ich habe diesen Garten mal geliebt."],
  B08_dance: ["You go ahead. I'll watch the bags.", "Geht ruhig. Ich pass auf die Taschen auf."],
  B08_hike: ["Looks beautiful up there.", "Sieht schön aus da oben."],
  B08_friends: ["Everyone's so busy these days.", "Alle haben heutzutage so viel zu tun."],
  K_A_m: ["Faster, Grandpa!", "Schneller, Opa!"], K_A_f: ["Faster, Grandma!", "Schneller, Oma!"],
  K_B_m: ["Can't you come too, Grandpa?", "Kommst du nicht mit, Opa?"], K_B_f: ["Can't you come too, Grandma?", "Kommst du nicht mit, Oma?"],
  F_cycle: ["Slow down, you show-off!", "Langsamer, du Angeber!"], F_dance: ["Where did you learn that?", "Wo hast du das gelernt?"], F_friends: ["Same time next week?", "Gleiche Zeit nächste Woche?"],
  C_hike: ["Everyone smile – again, the oldest one first!", "Alle lächeln – der Älteste zuerst!"]
};
const SPK_NAME = { en: { N: "Narrator", Y: "You", K: "Your grandchild", F: "Friend", C: "Coach", D: "Doctor" }, de: { N: "Erzähler", Y: "Du", K: "Dein Enkelkind", F: "Freundin", C: "Coach", D: "Ärztin" } };
function spkOf(id) {
  if (/^(O01|O03|A01|A04|A07|B01|B03|B04|B07|B09|B10)$/.test(id))
    return "N";
  if (/^(O02|A03|B02)$/.test(id))
    return "Y55";
  if (id === "A05")
    return "Y65A";
  if (id === "B06")
    return "Y65B";
  if (id === "A09" || id.startsWith("A08_"))
    return "Y75A";
  if (id.startsWith("B08_"))
    return "Y75B";
  if (id.startsWith("K_"))
    return "K";
  if (id === "A02" || id.startsWith("F_"))
    return "F";
  if (id === "A06" || id.startsWith("C_"))
    return "C";
  if (id === "B05")
    return "D";
  return "N";
}
/* recorded clip for this line, or null (→ browser voice). German clips are named de_<ID>. */
function clipFor(id, sp) { if (S.lang === "es") /* no Spanish recordings: browser voice */
  return null; const k = S.lang === "de" ? "de_" + id : id; if (!ADUR[k])
  return null; if (sp[0] === "Y" && S.gender === "f")
  return null; return k; }
function lineInfo(id) {
  const sp = spkOf(id), clip = clipFor(id, sp), txt = LT[id][LANG_I[S.lang]] || LT[id][0];
  const d = clip ? ADUR[clip] : Math.max(1.1, txt.length * (S.lang === "en" ? .062 : .068) + .35) * (/75B|65B/.test(sp) ? 1.2 : 1);
  return { id, sp, clip, txt, d };
}
