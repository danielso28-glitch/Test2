/* ================= ACCOUNT (prototype: stored only on this device) ================= */
/* First screen of the app. S.account = { first, last, birth, email, ins, salt, hash, created }, S.loggedIn.
   The password is never stored, only a salted SHA-256 hash. Gender goes to S.gender. */
let accMode = "signup", accReset = false;
const DEMO_INS = "A123456789";
async function pwHash(pw, salt) {
  const s = salt + ":" + pw;
  try {
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
  }
  catch (e) { /* no WebCrypto (old browser / insecure context): simple fallback, demo only */
    let h = 2166136261;
    for (const c of s)
      h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return "f" + (h >>> 0).toString(16);
  }
}
/* accounts made before sign-up asked for the insurance number get the demo number (the prototype only ever uses it) */
if (S.account && !S.account.ins) {
  S.account = { ...S.account, ins: DEMO_INS };
  save();
}
const okEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
/* age in whole years on a given day */
function ageOn(birth, d = new Date()) {
  const b = new Date(birth + "T12:00:00");
  let a = d.getFullYear() - b.getFullYear();
  if (d.getMonth() < b.getMonth() || (d.getMonth() === b.getMonth() && d.getDate() < b.getDate()))
    a--;
  return a;
}
/* where the user goes once signed in */
const afterAccount = () => S.onboarded ? openMain(S.tab) : go("s1");
function openAccount(mode) {
  accMode = mode;
  accReset = false;
  /* close anything still open on top (tracker sheet, settings sheet, face scan) – it would block the login */
  ["#trSheet", "#setSheet"].forEach(id => { const e = $(id); if (e)
    e.hidden = true; });
  if (!$("#scanOv").hidden)
    scanClose();
  go("sacc");
  renderAccount();
}
function renderAccount(keep = {}) {
  const up = accMode === "signup", re = accMode === "reset", a = S.account || {}, A = t("acc");
  const fld = (id, type, ac, val = "", extra = "") => `<div class="field"><label for="${id}">${A[id]}</label><input id="${id}" type="${type}" autocomplete="${ac}" value="${esc(keep[id] ?? val)}"${extra}></div>`;
  const pw = `<div class="field"><label for="accPw">${A.accPw}</label><div class="pwrow"><input id="accPw" type="password" autocomplete="${up || re ? "new-password" : "current-password"}" value="${esc(keep.accPw || "")}"><button type="button" class="btn out small" id="accShow" aria-pressed="false">${A.show}</button></div>${up || re ? `<span class="hint" style="margin:0">${A.pwHint}</span>` : ""}</div>`;
  const g = keep.gender;
  $("#accBody").innerHTML = `<header class="acchead"><div class="logo"><svg viewBox="0 0 22 26" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M2 2l9 11 9-11M11 13v11"/></svg>Two Paths</div>${langMenu()}</header>
   <div><h2 class="t">${up ? A.upT : re ? A.reT : A.inT(a.first)}</h2><p class="sub">${up ? A.upSub : re ? (a.birth ? A.reSub : A.reSubNoBirth) : A.inSub}</p></div>
   <form class="card accform" id="accForm" novalidate>
     ${up ? `<div class="lbl">${A.secYou}</div>
     <div class="two">${fld("accFirst", "text", "given-name")}${fld("accLast", "text", "family-name")}</div>
     ${fld("accBirth", "date", "bday", "", ` max="${dayKey(new Date())}" min="1910-01-01"`)}
     <div class="field"><span class="flabel">${t("avatarType")}</span><div class="seg" id="accGender">${["m", "f"].map(k => `<button type="button" data-g="${k}" aria-pressed="${g === k}">${t(k === "f" ? "woman" : "man")}</button>`).join("")}</div><span class="hint" style="margin:0">${A.genderHint}</span></div>
     <div class="lbl">${A.secLogin}</div>` : ""}
     ${re ? (a.birth ? fld("accBirth", "date", "bday", "", ` max="${dayKey(new Date())}" min="1910-01-01"`) : "") : fld("accEmail", "email", "email", up ? "" : a.email, ' inputmode="email" spellcheck="false" autocapitalize="off"')}
     ${re ? pw.replace(A.accPw, A.newPw) : pw}
     ${up ? `<div class="lbl">${A.secIns}</div>
     ${fld("accIns", "text", "off", DEMO_INS, ' maxlength="10" spellcheck="false" autocapitalize="characters"')}
     <span class="hint" style="margin:-6px 0 0">${t("insHint")} <b>${A.insDemo}</b></span>` : ""}
     <p class="err" id="accErr" hidden></p>
     <button class="cta" type="submit"><span>${up ? A.upBtn : re ? A.reBtn : A.inBtn}</span><span class="arr"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></button>
     <p class="demo">${A.demo}</p>
   </form>
   ${up ? "" : re ? `<div class="acclinks"><button class="btn out" id="accBackLogin">${A.backLogin}</button>
     <button class="btn ghost danger" id="accFresh">${accReset ? A.freshSure : A.fresh}</button>${accReset ? `<p class="hint" style="text-align:center">${A.freshD}</p>` : ""}</div>`
     : `<div class="acclinks"><button class="btn out" id="accForgot">${A.forgot}</button></div>`}`;
  /* language menu: keep what was typed */
  bindLangMenu($("#accBody"), () => {
    const v = {};
    $$("#accForm input").forEach(i => v[i.id] = i.value);
    v.gender = ($("#accGender [aria-pressed=true]") || {}).dataset?.g;
    renderText();
    renderAccount(v);
  });
  $$("#accGender [data-g]").forEach(b => b.onclick = () => $$("#accGender [data-g]").forEach(x => x.setAttribute("aria-pressed", x === b)));
  $("#accShow").onclick = e => { const i = $("#accPw"), on = i.type === "password"; i.type = on ? "text" : "password"; e.target.setAttribute("aria-pressed", on); e.target.textContent = on ? A.hide : A.show; };
  $("#accForm").onsubmit = e => { e.preventDefault(); up ? doSignup() : re ? doReset() : doLogin(); };
  const fg = $("#accForgot"), bl = $("#accBackLogin"), fr = $("#accFresh");
  if (fg)
    fg.onclick = () => openAccount("reset");
  if (bl)
    bl.onclick = () => openAccount("login");
  /* last resort (birth date unknown too): start completely fresh – asks twice, wipes this phone's data */
  if (fr)
    fr.onclick = () => {
      if (!accReset) {
        accReset = true;
        renderAccount();
        return;
      }
      try {
        localStorage.removeItem("tp2");
      }
      catch (e) { }
      S = { ...DEF, lang: S.lang };
      save();
      renderText();
      toast(A.deleted);
      openAccount("signup");
    };
}
/* forgotten password: the account only lives on this phone, so it can't be mailed – confirm the birth date and set a new one */
async function doReset() {
  const a = S.account, A = t("acc"), pw = $("#accPw").value, bd = $("#accBirth");
  if (a.birth && (!bd || bd.value !== a.birth))
    return accError(A.errBirthMatch, "accBirth");
  if (pw.length < 6)
    return accError(A.errPw, "accPw");
  const salt = Math.random().toString(36).slice(2, 10);
  S.account = { ...a, salt, hash: await pwHash(pw, salt) };
  S.loggedIn = true;
  save();
  renderText();
  toast(A.reDone);
  afterAccount();
}
function accError(msg, id) {
  const e = $("#accErr");
  e.textContent = msg;
  e.hidden = false;
  if (id)
    $("#" + id).focus();
}
async function doSignup() {
  const A = t("acc"), v = id => $("#" + id).value.trim();
  const first = v("accFirst"), last = v("accLast"), birth = v("accBirth"), email = v("accEmail").toLowerCase(), pw = $("#accPw").value, ins = v("accIns").toUpperCase().replace(/\s/g, "");
  const g = ($("#accGender [aria-pressed=true]") || {}).dataset?.g;
  if (!first || !last)
    return accError(A.errName, first ? "accLast" : "accFirst");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birth) || ageOn(birth) < 18 || ageOn(birth) > 110)
    return accError(A.errBirth, "accBirth");
  if (!g)
    return accError(A.errGender);
  if (!okEmail(email))
    return accError(A.errEmail, "accEmail");
  if (pw.length < 6)
    return accError(A.errPw, "accPw");
  if (!/^[A-Z]\d{9}$/.test(ins))
    return accError(t("insErr"), "accIns");
  const salt = Math.random().toString(36).slice(2, 10);
  S.account = { first, last, birth, email, ins, salt, hash: await pwHash(pw, salt), created: dayKey(new Date()) };
  S.gender = g;
  S.loggedIn = true;
  save();
  renderText();
  toast(A.welcome(first));
  afterAccount();
}
async function doLogin() {
  const a = S.account, email = $("#accEmail").value.trim().toLowerCase(), pw = $("#accPw").value;
  if (!a || email !== a.email || (await pwHash(pw, a.salt)) !== a.hash)
    return accError(t("acc").errLogin, "accPw");
  S.loggedIn = true;
  save();
  renderText();
  toast(t("acc").welcome(a.first));
  afterAccount();
}
function logOut() {
  S.loggedIn = false;
  save();
  openAccount("login");
}
/* settings block */
function accountRow() {
  const a = S.account;
  if (!a)
    return "";
  const masked = a.ins ? a.ins.slice(0, 3) + "••••" + a.ins.slice(-3) : "";
  return `<div class="lbl">${t("acc").title}</div><div class="card accrow"><div style="min-width:0"><b>${esc(a.first)} ${esc(a.last)}</b><span class="muted">${esc(a.email)}</span>${a.birth ? `<span class="muted">${t("acc").age(ageOn(a.birth))}${masked ? " · " + t("insMasked")(masked) : ""}</span>` : ""}</div><button class="btn small out" data-acc="logout">${t("acc").logout}</button></div>`;
}
function bindAccountRow(box) {
  box.querySelectorAll("[data-acc]").forEach(b => b.onclick = () => logOut());
}
