/* Map-Duell invite links: use real origin, not about:srcdoc */
(function () {
  function origin() {
    try {
      if (window.PUBLIC_GAME_ORIGIN) return String(window.PUBLIC_GAME_ORIGIN);
    } catch (e) {}
    try {
      if (window.parent && window.parent !== window && parent.location && /^https?:/.test(parent.location.protocol))
        return parent.location.origin + "/";
    } catch (e) {}
    try {
      if (location && /^https?:/.test(location.protocol) && String(location.href).indexOf("about:") < 0)
        return location.origin + "/";
    } catch (e) {}
    return "https://afrojumper.app/";
  }
  window.duelLink = function (code) {
    var u = new URL(origin(), "https://afrojumper.app/");
    u.searchParams.set("duel", String(code || "").toUpperCase());
    return u.toString();
  };
  function readCode() {
    try {
      var a = new URLSearchParams(location.search).get("duel");
      if (a) return a;
    } catch (e) {}
    try {
      if (window.parent && parent.location) {
        var b = new URLSearchParams(parent.location.search).get("duel");
        if (b) return b;
      }
    } catch (e) {}
    try {
      if (window.DUEL_BOOT_CODE) return String(window.DUEL_BOOT_CODE);
    } catch (e) {}
    return null;
  }
  function wireCreate() {
    var btn = document.getElementById("duelCreate");
    if (!btn || btn.getAttribute("data-duel-fix") === "1") return;
    btn.setAttribute("data-duel-fix", "1");
    btn.addEventListener("click", function () {
      setTimeout(function () {
        var copy = document.getElementById("duelCopy");
        if (!copy) return;
        copy.onclick = function () {
          var code = window.duel && duel.code;
          if (!code) return;
          var link = window.duelLink(code);
          var done = function () {
            try {
              duelSay(
                "Raum <b style=\"color:#7cfc00\">" +
                  code +
                  "</b><br>Code: <b>" +
                  code +
                  "</b><br>Link:<br><span style=\"font-size:13px;word-break:break-all\">" +
                  escHtml(link) +
                  "</span><br>Warte auf Gegner…"
              );
            } catch (e) {}
          };
          if (navigator.clipboard && navigator.clipboard.writeText)
            navigator.clipboard.writeText(link).then(done).catch(done);
          else done();
        };
      }, 0);
    });
  }
  function bootInvite() {
    var code = readCode();
    if (code && /^[A-Z0-9]{4,8}$/i.test(code)) {
      setTimeout(function () {
        try {
          openDuel();
          duelJoin(String(code).toUpperCase(), "guest");
        } catch (e) {}
      }, 700);
    }
  }
  function boot() {
    wireCreate();
    bootInvite();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
