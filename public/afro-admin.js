/* Hide Moodey on leaderboard + Danjo gift */
(function () {
  function grantDanjo() {
    try {
      var n = "";
      if (typeof boardName === "function") n = String(boardName() || "");
      n = n.toLowerCase();
      if (n.indexOf("danjo") < 0) return;
      if (localStorage.getItem("afroGiftP10") === "1") return;
      localStorage.setItem("afroGiftP10", "1");
      localStorage.setItem("afroPoundTickets", "10");
      var el = document.getElementById("menuAcctStatus");
      if (el) el.textContent = "Geschenk: 10 Pfund-Pakete im Shop (kostenlos öffnen)";
    } catch (e) {}
  }
  function scrubBoard() {
    var list = document.getElementById("boardList");
    if (!list) return;
    Array.prototype.slice.call(list.children).forEach(function (row) {
      var t = (row.textContent || "").toLowerCase();
      if (t.indexOf("moodey") >= 0) row.remove();
    });
    var rows = list.querySelectorAll(".lbRow");
    rows.forEach(function (row, i) {
      var rank = row.querySelector(".rank");
      if (!rank) return;
      rank.textContent = i === 0 ? "\uD83E\uDD47" : i === 1 ? "\uD83E\uDD48" : i === 2 ? "\uD83E\uDD49" : "#" + (i + 1);
    });
  }
  function wrapLoadBoard() {
    if (typeof loadBoard !== "function" || window.__lbWrapped) return;
    window.__lbWrapped = true;
    var orig = loadBoard;
    window.loadBoard = async function () {
      var res = orig.apply(this, arguments);
      try { if (res && res.then) await res; } catch (e) {}
      scrubBoard();
    };
  }
  function boot() {
    grantDanjo();
    wrapLoadBoard();
    scrubBoard();
    var list = document.getElementById("boardList");
    if (list && !list.__moodeyObs) {
      list.__moodeyObs = true;
      new MutationObserver(scrubBoard).observe(list, { childList: true, subtree: true });
    }
    setInterval(function () {
      grantDanjo();
      wrapLoadBoard();
      scrubBoard();
    }, 500);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
