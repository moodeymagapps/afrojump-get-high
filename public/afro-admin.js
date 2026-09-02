/* Reset only the Moodey account score. Do not hide anyone. */
(function () {
  function grantDanjo() {
    try {
      var n = "";
      if (typeof boardName === "function") n = String(boardName() || "");
      n = n.toLowerCase();
      if (n !== "danjo420" && n.indexOf("danjo420") < 0) return;
      if (localStorage.getItem("afroGiftP10") === "1") return;
      localStorage.setItem("afroGiftP10", "1");
      localStorage.setItem("afroPoundTickets", "10");
    } catch (e) {}
  }
  function zeroMoodeyLocal() {
    try {
      if (typeof boardName === "function" && String(boardName()).toLowerCase() === "moodey") {
        localStorage.setItem("afroJumpHigh", "0");
        if (typeof highScore !== "undefined") highScore = 0;
        var el = document.getElementById("menuHigh");
        if (el) el.textContent = "Best: 0m";
      }
    } catch (e) {}
  }
  function boot() {
    grantDanjo();
    zeroMoodeyLocal();
    setInterval(function () {
      grantDanjo();
      zeroMoodeyLocal();
    }, 2000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
