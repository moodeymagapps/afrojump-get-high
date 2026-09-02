/* Reset only the Moodey account score. Grant Moodey infinite bags. */
(function () {
  function currentName() {
    var n = "";
    try {
      if (typeof boardName === "function") n = String(boardName() || "");
    } catch (e) {}
    try {
      if (!n && typeof sbProfile !== "undefined" && sbProfile && sbProfile.display_name) n = String(sbProfile.display_name);
    } catch (e) {}
    try {
      if (!n && typeof sbUser !== "undefined" && sbUser && sbUser.email) n = String(sbUser.email).split("@")[0];
    } catch (e) {}
    try {
      var chip = document.getElementById("menuAccount") || document.querySelector("#userCard, #authName, .accountName");
      if (!n && chip && chip.textContent) n = String(chip.textContent);
    } catch (e) {}
    try {
      var loc = (parent && parent.location) || location;
      var q = String((loc.search || "") + " " + (loc.hash || "")).toLowerCase();
      if (q.indexOf("dev=moodey") >= 0) n = "moodey";
    } catch (e) {}
    return String(n).toLowerCase();
  }
  function isMoodey() {
    var n = currentName();
    return n === "moodey" || n.indexOf("moodey") >= 0;
  }
  function grantDanjo() {
    try {
      var n = currentName();
      if (n !== "danjo420" && n.indexOf("danjo420") < 0) return;
      if (localStorage.getItem("afroGiftP10") === "1") return;
      localStorage.setItem("afroGiftP10", "1");
      localStorage.setItem("afroPoundTickets", "10");
    } catch (e) {}
  }
  function zeroMoodeyLocal() {
    try {
      if (!isMoodey()) return;
      localStorage.setItem("afroJumpHigh", "0");
      if (typeof highScore !== "undefined") highScore = 0;
      var el = document.getElementById("menuHigh");
      if (el) el.textContent = "Best: 0m";
    } catch (e) {}
  }
  function grantMoodeyBags() {
    try {
      if (!isMoodey()) return;
      if (typeof totalBags !== "undefined") totalBags = 999999;
      localStorage.setItem("afroJumpBags", "999999");
      var shop = document.getElementById("shopBags");
      if (shop) shop.textContent = "\ud83c\udf3f 999999";
      var menu = document.querySelector(".hudChip.bagsChip, #menuBags, #bagsVal");
      if (menu) menu.textContent = "\ud83c\udf3f 999999";
      if (typeof writeBags === "function") writeBags(999999);
      else if (typeof updateBagsUI === "function") updateBagsUI();
    } catch (e) {}
  }
  function boot() {
    grantDanjo();
    zeroMoodeyLocal();
    grantMoodeyBags();
    setInterval(function () {
      grantDanjo();
      zeroMoodeyLocal();
      grantMoodeyBags();
    }, 800);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
