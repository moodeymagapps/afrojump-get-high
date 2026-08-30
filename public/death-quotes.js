(function () {
  "use strict";
  if (window.__afroDeathQuotes) return;
  window.__afroDeathQuotes = true;
  var LINES = [
    "Hahaha war das Weed zu stark?",
    "Bro ist im Kushkoma",
    "Nach jedem High kommt ein Tief",
    "Skill-Issue, kein Strain-Issue",
    "Der Joint hat dich gedroppt",
    "Afro landed\u2026 poorly",
    "Baggys eingesammelt, W\u00fcrde verloren",
    "Zu high zum Springen",
    "Die Plattform war eine Halluzination",
    "Cops 1 \u2013 Du 0",
    "Respawn in 3\u2026 2\u2026 noch ein Zug",
    "Das war kein Flow, das war ein Fall",
    "Mutterpflanze sch\u00e4mt sich",
    "Bongzilla hat ausgeatmet. Du auch.",
    "Game Over, aber der Vibe bleibt"
  ];
  var last = -1;
  function pick() {
    var i = Math.floor(Math.random() * LINES.length);
    if (i === last) i = (i + 1) % LINES.length;
    last = i;
    return LINES[i];
  }
  function vis(el) {
    if (!el) return false;
    var s = window.getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden" || s.opacity === "0") return false;
    return true;
  }
  function ensure() {
    var over = document.getElementById("over");
    if (!over) return;
    var el = document.getElementById("deathQuote");
    if (!el) {
      el = document.createElement("div");
      el.id = "deathQuote";
      el.style.cssText =
        "pointer-events:none;margin:8px 16px 0;text-align:center;font:700 14px/1.3 system-ui,sans-serif;color:#d4ff8a;text-shadow:0 1px 0 #000;";
      over.appendChild(el);
    }
    if (vis(over) && !el.dataset.shown) {
      el.textContent = pick();
      el.dataset.shown = "1";
    }
    if (!vis(over)) el.dataset.shown = "";
  }
  setInterval(ensure, 250);
})();
