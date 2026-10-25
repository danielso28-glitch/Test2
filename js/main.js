/* ================= INIT ================= */
applySize();
makeMap("mapA");
makeMap("mapB");
renderText();
try {
  speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = () => { };
}
catch (e) { }
if (!S.account)
  openAccount("signup");
else if (!S.loggedIn)
  openAccount("login");
else if (S.onboarded)
  openMain(S.tab);
else
  go("s1");
/* scans from before the aged portraits existed: draw them once now */
if (S.face)
  ageFaces().then(() => { if (!$("#main").hidden)
    renderAvatar(); });
