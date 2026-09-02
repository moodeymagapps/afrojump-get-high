/* one-time gifts / leaderboard helpers */
(function () {
  function grantDanjo() {
    try {
      var n = "";
      if (typeof boardName === "function") n = String(boardName() || "");
      if (!n && typeof sbProfile !== "undefined" && sbProfile && sbProfile.display_name) n = String(sbProfile.display_name);
      n = n.toLowerCase();
      if (n.indexOf("danjo") < 0) return;
      if (localStorage.getItem("afroGiftP10") === "1") return;
      localStorage.setItem("afroGiftP10", "1");
      localStorage.setItem("afroPoundTickets", "10");
      var el = document.getElementById("menuAcctStatus");
      if (el) el.textContent = "Geschenk: 10 Pfund-Pakete im Shop (kostenlos öffnen)";
    } catch (e) {}
  }
  function boot() {
    grantDanjo();
    setInterval(grantDanjo, 2000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
