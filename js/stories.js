/* ================= STORIES (Explore) ================= */
/* kind "story" = invented demo testimonial (always labelled), "model" = real person from a public article, "study" = research finding.
   Sources and background: docs/research/role-models-50plus.md */
const STORIES = [
  { k: "st-monika", kind: "story", who: "Monika", age: 58, act: "walking", tags: ["walking"], sc: "#E3F1DD",
    en: ["I used to take the lift to the second floor. Three months with my walking group, and now I'm the one waiting for the others at the top of the stairs.", "Walking group 50+ · twice a week"],
    de: ["Früher bin ich mit dem Aufzug in den zweiten Stock gefahren. Nach drei Monaten in meiner Walking-Gruppe warte jetzt ich oben an der Treppe auf die anderen.", "Walking-Gruppe 50+ · zweimal pro Woche"] },
  { k: "st-klaus", kind: "story", who: "Klaus", age: 59, act: "walking", tags: ["food", "walking", "sleep"], sc: "#FFF1C2",
    en: ["The app showed me at 75, stuck on the sofa. That picture stayed with me. I swapped my evening beer for a walk, and I sleep better than in years.", "Started with Two Paths · evening walks"],
    de: ["Die App hat mich mit 75 auf dem Sofa gezeigt. Das Bild ging mir nicht aus dem Kopf. Ich habe das Feierabendbier gegen einen Spaziergang getauscht und schlafe besser als seit Jahren.", "Hat mit Two Paths angefangen · Abendspaziergänge"] },
  { k: "st-hanspeter", kind: "story", who: "Hans-Peter", age: 63, act: "football", tags: ["football", "social"], sc: "#DFEAF6",
    en: ["My knees said no to normal football years ago. Walking football gave me my Saturday team back, and my grandson now wants to play with me in the garden.", "Walking football 50+ · Saturdays"],
    de: ["Meine Knie haben vor Jahren Nein zu normalem Fußball gesagt. Walking Football hat mir meine Samstagsmannschaft zurückgegeben, und mein Enkel will jetzt im Garten mit mir kicken.", "Walking Football 50+ · samstags"] },
  { k: "st-ayse", kind: "story", who: "Ayşe", age: 55, act: "dancing", tags: ["dancing", "social", "mind"], sc: "#FFE3CC",
    en: ["I only came because my friend didn't want to go alone. Now I'm the one who drags her along every Wednesday.", "Dancing 50+ · Wednesdays"],
    de: ["Ich bin nur mitgekommen, weil meine Freundin nicht allein hinwollte. Jetzt bin ich die, die sie jeden Mittwoch mitschleppt.", "Tanzen 50+ · mittwochs"] },
  { k: "st-juergen", kind: "story", who: "Jürgen", age: 61, act: "back", tags: ["back", "strength"], sc: "#E3F1DD",
    en: ["Thirty years at a desk. My insurer paid for the back course, and now I can work in the garden all afternoon without pain.", "Strong back 50+ · paid by his health insurer"],
    de: ["Dreißig Jahre am Schreibtisch. Den Rückenkurs hat meine Krankenkasse bezahlt, und jetzt kann ich einen ganzen Nachmittag schmerzfrei im Garten arbeiten.", "Starker Rücken 50+ · von der Krankenkasse bezahlt"] },
  { k: "st-birgit", kind: "story", who: "Birgit", age: 64, act: "yoga", tags: ["yoga", "balance"], sc: "#F1E4F7",
    en: ["After my fall on the ice I was scared to go out. Gentle yoga gave me my balance back, and my confidence too.", "Gentle yoga 50+ · Mondays"],
    de: ["Nach meinem Sturz auf dem Glatteis hatte ich Angst rauszugehen. Sanftes Yoga hat mir mein Gleichgewicht zurückgegeben, und mein Selbstvertrauen auch.", "Sanftes Yoga 50+ · montags"] },
  { k: "st-renate", kind: "story", who: "Renate", age: 67, act: "cycling", tags: ["cycling", "social"], sc: "#FFF1C2",
    en: ["Until two years ago I hadn't ridden a bike in decades. Now I lead the Sunday tour myself.", "Cycling tour 50+ · volunteer guide"],
    de: ["Bis vor zwei Jahren war ich seit Jahrzehnten nicht mehr Rad gefahren. Jetzt leite ich selbst die Sonntagstour.", "Radtour 50+ · ehrenamtliche Tourleiterin"] },
  { k: "rm-flowers", kind: "model", who: "Marlene Flowers", act: "back", tags: ["strength", "back"], sc: "#C8F06A", src: "Yahoo Lifestyle", url: "https://www.yahoo.com/lifestyle/67-old-bodybuilder-started-exercising-105035198.html",
    en: ["At 57 her knees hurt on every hill. At 58 she started working out at home with DVDs, at 63 she went to a gym for the first time. Today she can do 140 push-ups in a row.", "Started at 58"],
    de: ["Mit 57 taten ihr an jedem Hügel die Knie weh. Mit 58 fing sie mit Workout-DVDs zu Hause an, mit 63 ging sie zum ersten Mal ins Fitnessstudio. Heute schafft sie 140 Liegestütze am Stück.", "Angefangen mit 58"] },
  { k: "rm-shah", kind: "model", who: "Axay Shah", act: "walking", tags: ["walking"], sc: "#DFEAF6", src: "The Healthy", url: "https://www.thehealthy.com/exercise/people-in-best-shape-of-their-lives-after-50/",
    en: ["He hadn't run a single mile before he turned 50. He ran his first marathon at 50 and calls running his \"second life\".", "Started at 50"],
    de: ["Vor seinem 50. Geburtstag war er noch nie eine Meile gelaufen. Mit 50 lief er seinen ersten Marathon und nennt das Laufen sein „zweites Leben“.", "Angefangen mit 50"] },
  { k: "rm-crawford", kind: "model", who: "Barbara Crawford", act: "walking", tags: ["strength", "walking"], sc: "#FFE3CC", src: "The Healthy", url: "https://www.thehealthy.com/exercise/people-in-best-shape-of-their-lives-after-50/",
    en: ["At 64, arthritis in her knees kept her off the stairs. After training she was fit enough to get the puppy she had always wanted.", "Started at 64"],
    de: ["Mit 64 konnte sie wegen Arthrose in den Knien kaum Treppen steigen. Nach dem Training war sie fit genug für den Welpen, den sie sich immer gewünscht hatte.", "Angefangen mit 64"] },
  { k: "sd-kora", kind: "study", act: "walking", tags: ["check", "walking", "strength"], sc: "#E3F1DD", src: "KORA-Age (GMS)", url: "https://www.egms.de/static/en/meetings/gmds2011/11gmds153.shtml",
    en: ["Older adults from the Augsburg region who were moderately or very active from age 50 had a lower risk of disability in old age, over about 18 years.", "German study"],
    de: ["Ältere Menschen aus der Region Augsburg, die ab 50 mäßig oder sehr aktiv waren, hatten über etwa 18 Jahre ein geringeres Risiko, im Alter pflegebedürftig zu werden.", "Deutsche Studie"] }
].map(s => ({ ...s, cat: "story" }));
FEED.push(...STORIES);
const initials = n => n.split(/[\s-]+/).map(w => w[0]).join("").slice(0, 2);
function storyCard(f, why) {
  const [quote, ctx] = f[S.lang] || f.en;
  const badge = { story: t("stDemo"), model: t("stModel"), study: t("stStudy") }[f.kind];
  const person = f.kind === "study" ? `<span class="face">${ICON.heart}</span><div><b>${esc(f.src)}</b><span>${esc(ctx)}</span></div>`
    : `<span class="face">${esc(initials(f.who))}</span><div><b>${esc(f.who)}${f.age ? `, ${f.age}` : ""}</b><span>${esc(ctx)}</span></div>`;
  const link = f.url ? `<a class="open" href="${f.url}" target="_blank" rel="noopener">${t("stRead")}${ICON.ext}</a><span class="muted" style="font-size:.85rem">${esc(f.src)}</span>` : "";
  return `<article class="post stcard k-${f.kind}" style="background:${f.sc}">${why}<span class="stbadge">${badge}</span>
   <blockquote>${f.kind === "study" ? "" : "“"}${esc(quote)}${f.kind === "study" ? "" : "”"}</blockquote>
   <div class="person">${person}</div>
   <div class="foot">${link}<button class="like" data-like="${f.k}" aria-pressed="${S.liked.includes(f.k)}" aria-label="${t("aria").like}">${ICON.heart}</button></div></article>`;
}
