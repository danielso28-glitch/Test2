/* ================= EXPLORE FEED ================= */
/* k = stable id (likes), tags = what the "For you" ranking matches against interests, joined groups and goal */
const YT = q => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
const FEED = [
  { k: "who150", cat: "move", tags: ["walking", "strength", "balance"], kind: "article", src: "WHO", sc: "#DFEAF6", url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity", min: 3,
    en: ["150 minutes a week", "WHO recommends that adults do at least 150–300 minutes of moderate activity per week, such as brisk walking, plus muscle-strengthening activities on 2 or more days. Older adults should also train their balance to prevent falls."],
    de: ["150 Minuten pro Woche", "Die WHO empfiehlt Erwachsenen mindestens 150–300 Minuten moderate Bewegung pro Woche, zum Beispiel zügiges Gehen, plus Krafttraining an 2 oder mehr Tagen. Ältere Menschen sollten zusätzlich ihr Gleichgewicht trainieren, um Stürzen vorzubeugen."] },
  { k: "plate", cat: "food", tags: ["food"], kind: "article", src: "DGE", sc: "#E3F1DD", url: "https://www.dge.de", min: 4,
    en: ["Eat more plants", "The German Nutrition Society (DGE) recommends filling most of your plate with vegetables, fruit, pulses and whole grains, and drinking mainly water. Small changes add up over the years."],
    de: ["Mehr Pflanzliches essen", "Die Deutsche Gesellschaft für Ernährung (DGE) empfiehlt, den Teller größtenteils mit Gemüse, Obst, Hülsenfrüchten und Vollkorn zu füllen und vor allem Wasser zu trinken. Kleine Änderungen summieren sich über die Jahre."] },
  { k: "balance10", cat: "move", tags: ["balance", "yoga"], kind: "video", src: "YouTube", sc: "#FFE3CC", q: { en: YT("10 minute balance exercises for older adults"), de: YT("Gleichgewichtsübungen Senioren 10 Minuten") },
    en: ["10 minutes of balance training", "Short balance exercises you can do at home, holding on to a chair. Good on days without your group."],
    de: ["10 Minuten Gleichgewicht", "Kurze Gleichgewichtsübungen für zu Hause, mit einem Stuhl zum Festhalten. Ideal an Tagen ohne Gruppe."] },
  { k: "protein", cat: "food", tags: ["food", "strength"], kind: "tip", src: "Two Paths", sc: "#FFF1C2",
    en: ["Protein keeps your muscles", "Muscles need protein, and from about 65 the body needs a bit more of it. Spread it over the day: yoghurt or quark at breakfast, beans or lentils at lunch, fish, eggs or tofu in the evening. It works best together with strength training."],
    de: ["Eiweiß hält deine Muskeln", "Muskeln brauchen Eiweiß, und ab etwa 65 braucht der Körper etwas mehr davon. Verteil es über den Tag: Joghurt oder Quark zum Frühstück, Bohnen oder Linsen mittags, Fisch, Eier oder Tofu am Abend. Am besten wirkt es zusammen mit Krafttraining."] },
  { k: "strength", cat: "move", tags: ["strength", "back"], kind: "tip", src: "Two Paths", sc: "#C8F06A",
    en: ["Strength protects your independence", "Muscle mass declines with age. Strength training twice a week helps you keep carrying shopping, climbing stairs and playing with your grandchildren."],
    de: ["Kraft schützt deine Selbstständigkeit", "Muskelmasse nimmt mit dem Alter ab. Zweimal pro Woche Krafttraining hilft dir, weiter Einkäufe zu tragen, Treppen zu steigen und mit den Enkeln zu spielen."] },
  { k: "water", cat: "food", tags: ["food", "walking", "cycling"], kind: "tip", src: "Two Paths", sc: "#DFEAF6",
    en: ["Drink before you feel thirsty", "With age we feel thirst later. The DGE recommends about 1.5 litres a day, mainly water or unsweetened tea, and more when you exercise or it's hot. A full bottle on the table is a good reminder."],
    de: ["Trinken, bevor der Durst kommt", "Mit dem Alter spüren wir Durst später. Die DGE empfiehlt rund 1,5 Liter am Tag, vor allem Wasser oder ungesüßten Tee, und mehr bei Bewegung oder Hitze. Eine volle Flasche auf dem Tisch erinnert dich daran."] },
  { k: "lunch15", cat: "food", tags: ["food"], kind: "video", src: "YouTube", sc: "#FFF1C2", q: { en: YT("quick healthy lunch recipes 15 minutes"), de: YT("schnelle gesunde Rezepte 15 Minuten") },
    en: ["Healthy lunch in 15 minutes", "Quick recipes for busy days, so the healthy choice is also the easy one."],
    de: ["Gesundes Mittagessen in 15 Minuten", "Schnelle Rezepte für volle Tage, damit die gesunde Wahl auch die einfache ist."] },
  { k: "sleep", cat: "sleep", tags: ["sleep"], kind: "article", src: "NHS", sc: "#DFEAF6", url: "https://www.nhs.uk/live-well/sleep-and-tiredness/", min: 3,
    en: ["Sleep is part of training", "Most adults need around 7 to 9 hours of sleep. Regular bedtimes and daylight during the day help, especially after a long day at the desk."],
    de: ["Schlaf gehört zum Training", "Die meisten Erwachsenen brauchen etwa 7 bis 9 Stunden Schlaf. Feste Schlafenszeiten und Tageslicht helfen, gerade nach einem langen Tag am Schreibtisch."] },
  { k: "fiveaday", cat: "food", tags: ["food"], kind: "article", src: "DGE", sc: "#E3F1DD", url: "https://www.dge.de", min: 3,
    en: ["5 a day", "The DGE recommends 3 portions of vegetables and 2 portions of fruit a day. One portion is about one handful. Frozen vegetables count too and are quick to cook."],
    de: ["5 am Tag", "Die DGE empfiehlt 3 Portionen Gemüse und 2 Portionen Obst am Tag. Eine Portion ist etwa eine Handvoll. Tiefkühlgemüse zählt auch und ist schnell gekocht."] },
  { k: "checkup", cat: "check", tags: ["check"], kind: "article", src: "gesund.bund.de", sc: "#E3F1DD", url: "https://gesund.bund.de", min: 3,
    en: ["The free check-up from 35", "In Germany, statutory health insurance pays for a general health check-up every 3 years from age 35. Book it like a car service: a fixed date in your calendar."],
    de: ["Der kostenlose Check-up ab 35", "In Deutschland zahlt die gesetzliche Krankenkasse ab 35 alle 3 Jahre einen Gesundheits-Check-up. Buch ihn wie eine Inspektion beim Auto: als festen Termin im Kalender."] },
  { k: "salt", cat: "food", tags: ["food", "check"], kind: "article", src: "WHO", sc: "#F1E4F7", url: "https://www.who.int/news-room/fact-sheets/detail/salt-reduction", min: 3,
    en: ["Less salt, better blood pressure", "WHO recommends less than 5 g of salt a day, about one teaspoon. Most salt is hidden in bread, cheese, sausage and ready meals. Herbs and lemon add taste instead."],
    de: ["Weniger Salz, besserer Blutdruck", "Die WHO empfiehlt weniger als 5 g Salz am Tag, etwa einen Teelöffel. Das meiste Salz steckt in Brot, Käse, Wurst und Fertiggerichten. Kräuter und Zitrone geben stattdessen Geschmack."] },
  { k: "together", cat: "mind", tags: ["mind", "social"], kind: "tip", src: "Two Paths", sc: "#FFE3CC",
    en: ["Move together, not alone", "Many people find it easier to keep exercising in a group. Bring a friend to your next session."],
    de: ["Gemeinsam statt allein", "Vielen fällt es in der Gruppe leichter, dranzubleiben. Bring zur nächsten Stunde eine Freundin oder einen Freund mit."] },
  { k: "vitd", cat: "food", tags: ["food", "check"], kind: "article", src: "NHS", sc: "#FFF1C2", url: "https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-d/", min: 3,
    en: ["Bones need calcium and vitamin D", "Dairy, green vegetables and calcium-rich mineral water help your bones. In autumn and winter the sun is too weak for vitamin D, so the NHS advises considering a supplement. Ask your doctor what fits you."],
    de: ["Knochen brauchen Kalzium und Vitamin D", "Milchprodukte, grünes Gemüse und kalziumreiches Mineralwasser helfen deinen Knochen. Im Herbst und Winter ist die Sonne zu schwach für Vitamin D, deshalb rät der britische NHS, ein Präparat zu erwägen. Frag deine Ärztin oder deinen Arzt, was zu dir passt."] },
  { k: "desk", cat: "move", tags: ["back", "yoga"], kind: "video", src: "YouTube", sc: "#F1E4F7", q: { en: YT("desk stretches back neck 5 minutes"), de: YT("Rücken Nacken Übungen Büro 5 Minuten") },
    en: ["5-minute desk stretches", "Simple stretches for back and neck between two meetings."],
    de: ["5 Minuten Dehnen am Schreibtisch", "Einfache Übungen für Rücken und Nacken zwischen zwei Terminen."] },
  { k: "nutri", cat: "food", tags: ["food"], kind: "tip", src: "Two Paths", sc: "#C8F06A",
    en: ["Compare with the Nutri-Score", "The Nutri-Score on the pack goes from A (green) to E (red). It helps you compare similar products, for example two kinds of muesli or two frozen pizzas."],
    de: ["Mit dem Nutri-Score vergleichen", "Der Nutri-Score auf der Packung geht von A (grün) bis E (rot). Er hilft beim Vergleich ähnlicher Produkte, zum Beispiel zwei Müslis oder zwei Tiefkühlpizzen."] },
  { k: "taiso", cat: "mind", tags: ["mind", "social", "balance"], kind: "tip", src: "Two Paths", sc: "#C8F06A",
    en: ["Japan's daily exercise break", "In Japan, many people do a short exercise routine together, called Radio Taiso. Five minutes together beats one hour alone that never happens."],
    de: ["Japans tägliche Bewegungspause", "In Japan machen viele Menschen gemeinsam eine kurze Übungsroutine, Radio Taiso genannt. Fünf Minuten gemeinsam sind besser als eine Stunde alleine, die nie stattfindet."] },
  { k: "breakfast", cat: "food", tags: ["food", "strength"], kind: "video", src: "YouTube", sc: "#FFE3CC", q: { en: YT("easy high protein breakfast ideas"), de: YT("eiweißreiches Frühstück einfach Rezept") },
    en: ["Breakfast with protein", "Easy ideas like overnight oats with quark or an omelette with vegetables. A good start before your group session."],
    de: ["Frühstück mit Eiweiß", "Einfache Ideen wie Overnight Oats mit Quark oder ein Omelett mit Gemüse. Ein guter Start vor deiner Gruppenstunde."] },
  { k: "meal", cat: "food", tags: ["food", "social", "mind"], kind: "tip", src: "Two Paths", sc: "#E3F1DD",
    en: ["Eat together more often", "People who eat alone often eat less well. Cook with a neighbour, invite your group for soup, or join a lunch table in your area."],
    de: ["Öfter gemeinsam essen", "Wer allein isst, isst oft schlechter. Koch mit der Nachbarin, lad deine Gruppe zur Suppe ein oder geh zu einem Mittagstisch in deiner Nähe."] },
  { k: "medi", cat: "food", tags: ["food", "check"], kind: "video", src: "YouTube", sc: "#DFEAF6", q: { en: YT("mediterranean diet easy recipes"), de: YT("mediterrane Küche einfache Rezepte") },
    en: ["Cook Mediterranean", "Vegetables, olive oil, fish, beans and nuts. Mediterranean-style eating is linked to a healthier heart, and it tastes like holidays."],
    de: ["Mediterran kochen", "Gemüse, Olivenöl, Fisch, Bohnen und Nüsse. Mediterrane Ernährung wird mit einem gesünderen Herzen in Verbindung gebracht, und sie schmeckt nach Urlaub."] },
  { k: "alcohol", cat: "food", tags: ["food", "sleep", "check"], kind: "article", src: "DGE", sc: "#F1E4F7", url: "https://www.dge.de", min: 2,
    en: ["Less alcohol, better sleep", "The DGE advises avoiding alcohol, because there is no amount that is safe for health. A drink in the evening also makes your sleep lighter. Alcohol-free beer or sparkling water with lemon are good swaps."],
    de: ["Weniger Alkohol, besserer Schlaf", "Die DGE rät, auf Alkohol zu verzichten, weil es keine gesundheitlich unbedenkliche Menge gibt. Ein Glas am Abend macht auch den Schlaf leichter und unruhiger. Alkoholfreies Bier oder Sprudel mit Zitrone sind gute Alternativen."] },
  { k: "dancehome", cat: "move", tags: ["dancing", "balance", "social"], kind: "video", src: "YouTube", sc: "#FFE3CC", q: { en: YT("dance workout for seniors 15 minutes"), de: YT("Tanzen für Senioren zum Mitmachen") },
    en: ["Dance at home for 15 minutes", "Easy dance routines to follow in your living room. Good for balance, memory and mood."],
    de: ["15 Minuten Tanzen zu Hause", "Einfache Tänze zum Mitmachen im Wohnzimmer. Gut für Gleichgewicht, Gedächtnis und Laune."] },
  { k: "brisk", cat: "move", tags: ["walking"], kind: "tip", src: "Two Paths", sc: "#C8F06A",
    en: ["Walk a little faster", "Brisk walking means you can still talk, but not sing. Try 10 minutes of brisk walking after lunch. It all counts towards your 150 minutes."],
    de: ["Ein bisschen schneller gehen", "Zügig gehen heißt: Du kannst noch reden, aber nicht mehr singen. Probier 10 Minuten zügiges Gehen nach dem Mittagessen. Alles zählt zu deinen 150 Minuten."] },
  { k: "ebike", cat: "move", tags: ["cycling"], kind: "tip", src: "Two Paths", sc: "#FFF1C2",
    en: ["An e-bike still counts", "An e-bike makes hills and longer trips easier, so you ride more often. You still pedal, so your heart and legs still train. Practise braking and curves somewhere quiet first."],
    de: ["Auch E-Bike zählt", "Ein E-Bike macht Hügel und lange Strecken leichter, also fährst du öfter. Du trittst trotzdem, Herz und Beine trainieren also mit. Üb Bremsen und Kurven zuerst an einem ruhigen Ort."] }
];
/* tags that fit each goal from the first screen */
const GOAL_TAGS = { grand: ["strength", "balance", "walking"], travel: ["walking", "strength"], cycle: ["cycling"], own: ["strength", "balance", "food"], garden: ["back", "strength"], dance: ["dancing", "balance"], hike: ["walking", "food"], friends: ["social", "mind"] };
/* interest chips */
const INTERESTS = ["food", "walking", "dancing", "cycling", "yoga", "back", "football", "sleep", "mind", "check"];
const intLabel = k => t("exCats")[k] || t(k);
let exEdit = false;
/* "For you": score each item, return [score, reason] */
function rankItem(f) {
  const joined = allGroups().filter(g => S.joined.includes(g.id));
  const likedTags = FEED.filter(x => S.liked.includes(x.k)).flatMap(x => x.tags);
  let sc = f.cat === "food" || f.cat === "story" ? 1 : 0, why = null, best = 0;
  const hit = (n, w) => { sc += n; if (n > best) { best = n; why = w; } };
  const ints = f.tags.filter(x => (S.interests || []).includes(x));
  if (ints.length)
    hit(3 * ints.length, t("whyInt")(intLabel(ints[0])));
  const g = joined.find(g => f.tags.includes(g.type));
  if (g)
    hit(2.5, t("whyGroup")(nm(g)));
  if (f.tags.some(x => (S.goals || [S.goal]).some(g => (GOAL_TAGS[g] || []).includes(x))))
    hit(2, t("whyGoal"));
  if (!S.liked.includes(f.k) && f.tags.some(x => likedTags.includes(x)))
    hit(1, t("whyLiked"));
  return [sc, why];
}
/* keep the ranked order, but don't show the same topic more than twice in a row if something nearly as relevant can go in between */
function mixFeed(rest) {
  const out = [];
  while (rest.length) {
    const same = out.length >= 2 && out.at(-1).cat === out.at(-2).cat ? out.at(-1).cat : null;
    let j = same ? rest.findIndex(f => f.cat !== same && f.sc2 >= rest[0].sc2 - 3) : 0;
    if (j < 0)
      j = 0;
    out.push(rest.splice(j, 1)[0]);
  }
  return out;
}
function renderExplore() {
  S.liked = S.liked.filter(x => typeof x === "string");
  const ch = $("#exChips");
  ch.innerHTML = "";
  Object.keys(t("exCats")).forEach(k => { const b = document.createElement("button"); b.textContent = t("exCats")[k]; b.setAttribute("aria-pressed", S.exCat === k); b.onclick = () => { S.exCat = k; save(); renderExplore(); }; ch.appendChild(b); });
  const ints = S.interests || [];
  const showPick = S.exCat === "all" && (exEdit || !ints.length);
  $("#exInterests").innerHTML = S.exCat !== "all" ? "" : showPick
    ? `<div class="intcard"><b>${t("intQ")}</b><span class="muted">${t("intSub")}</span><div class="chips wrap">${INTERESTS.map(k => `<button data-int="${k}" aria-pressed="${ints.includes(k)}">${esc(intLabel(k))}</button>`).join("")}</div>${ints.length ? `<button class="btn dark small" data-intdone>${t("done")}</button>` : ""}</div>`
    : `<div class="intline"><span>${t("intYours")}: <b>${ints.map(k => esc(intLabel(k))).join(", ")}</b></span><button class="link" data-intedit>${t("intEdit")}</button></div>`;
  $$("[data-int]").forEach(b => b.onclick = () => { const k = b.dataset.int; S.interests = ints.includes(k) ? ints.filter(x => x !== k) : [...ints, k]; exEdit = true; save(); renderExplore(); renderAvatar(); });
  const ie = $("[data-intedit]"), id = $("[data-intdone]");
  if (ie)
    ie.onclick = () => { exEdit = true; renderExplore(); };
  if (id)
    id.onclick = () => { exEdit = false; renderExplore(); };
  let items = FEED.map((f, i) => { const [sc, why] = rankItem(f); return { ...f, i, sc2: sc, why }; });
  items = S.exCat === "all" ? mixFeed(items.sort((a, b) => b.sc2 - a.sc2 || a.i - b.i)) : items.filter(f => f.cat === S.exCat);
  $("#feed").innerHTML = items.map(f => {
    if (f.cat === "story")
      return storyCard(f, S.exCat === "all" && f.why ? `<span class="why">${esc(f.why)}</span>` : "");
    const [h, p] = f[S.lang];
    const url = f.q ? f.q[S.lang] : f.url;
    const liked = S.liked.includes(f.k);
    const media = f.kind === "video" ? `<a class="vid" href="${url}" target="_blank" rel="noopener" aria-label="${t("watch")}"><svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="28" fill="#fff"/><path d="M23 18l15 10-15 10z" fill="#12201B"/></svg></a>` : "";
    const btn = url ? `<a class="open" href="${url}" target="_blank" rel="noopener">${f.kind === "video" ? t("watch") : t("openSrc")}${ICON.ext}</a>` : "";
    const why = S.exCat === "all" && f.why ? `<span class="why">${esc(f.why)}</span>` : "";
    return `<article class="post" style="background:${f.sc}">${why}<div class="src"><i>${esc(f.src.slice(0, 3).toUpperCase())}</i><span>${esc(f.src)}</span><span class="kind">${t("kinds")[f.kind]}</span></div>${media}<h3>${esc(h)}</h3><p>${esc(p)}</p><div class="foot">${btn}${f.min ? `<span class="muted" style="font-size:.85rem">${t("read")(f.min)}</span>` : ""}<button class="like" data-like="${f.k}" aria-pressed="${liked}" aria-label="${t("aria").like}">${ICON.heart}</button></div></article>`;
  }).join("");
  $$("[data-like]").forEach(b => b.onclick = () => { const k = b.dataset.like; S.liked = S.liked.includes(k) ? S.liked.filter(x => x !== k) : [...S.liked, k]; save(); b.setAttribute("aria-pressed", S.liked.includes(k)); });
}
