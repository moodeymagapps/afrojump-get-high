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
      if (typeof writeBags === "function") writeBags(999999);
    } catch (e) {}
  }
  function fillPhone() {
    try {
      var vv = window.visualViewport;
      var h = vv ? Math.round(vv.height + (vv.offsetTop || 0)) : window.innerHeight;
      var px = h + "px";
      document.documentElement.style.height = px;
      document.documentElement.style.minHeight = px;
      if (document.body) {
        document.body.style.height = px;
        document.body.style.minHeight = px;
        document.body.style.background = "#0b1a0b";
      }
      var wrap = document.getElementById("wrap");
      if (wrap) {
        wrap.style.position = "fixed";
        wrap.style.inset = "0";
        wrap.style.height = px;
        wrap.style.minHeight = px;
        wrap.style.background = "#0b1a0b";
      }
      var menu = document.getElementById("menu");
      if (menu) {
        menu.style.inset = "0";
        menu.style.minHeight = px;
        menu.style.paddingBottom = "max(16px, env(safe-area-inset-bottom))";
      }
      try { window.scrollTo(0, 0); } catch (e) {}
    } catch (e) {}
  }
  function boot() {
    grantDanjo();
    zeroMoodeyLocal();
    grantMoodeyBags();
    fillPhone();
    try {
      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", fillPhone);
        window.visualViewport.addEventListener("scroll", fillPhone);
      }
      window.addEventListener("resize", fillPhone);
      window.addEventListener("orientationchange", function () { setTimeout(fillPhone, 250); });
    } catch (e) {}
    setInterval(function () {
      grantDanjo();
      zeroMoodeyLocal();
      grantMoodeyBags();
      fillPhone();
    }, 800);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
