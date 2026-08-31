(function () {
  "use strict";
  if (window.__afroFxInit) return;
  window.__afroFxInit = true;

  var layer = document.getElementById("afroFxLayer");
  if (layer && layer.parentNode) layer.parentNode.removeChild(layer);

  var css = document.createElement("style");
  css.textContent =
    "html,body,#wrap,#c{background:#0b1a0b!important;background-color:#0b1a0b!important;}" +
    "html,body{margin:0!important;padding:0!important;width:100%!important;height:100%!important;min-height:100dvh!important;min-height:-webkit-fill-available!important;overflow:hidden!important;}" +
    "#wrap{position:fixed!important;inset:0!important;display:flex!important;align-items:stretch!important;justify-content:stretch!important;}" +
    "canvas,#c{box-shadow:none!important;border:0!important;margin:0!important;max-width:none!important;max-height:none!important;}" +
    "#menu,#menu::after{background-color:#0c1408!important;}";
  document.documentElement.appendChild(css);

  function paintFill() {
    var vv = window.visualViewport;
    var w = Math.round((vv && vv.width) || window.innerWidth || 0);
    var h = Math.round((vv && vv.height) || window.innerHeight || 0);
    [document.documentElement, document.body].forEach(function (el) {
      if (!el) return;
      el.style.background = "#0b1a0b";
      el.style.backgroundColor = "#0b1a0b";
      el.style.width = "100%";
      el.style.height = h ? h + "px" : "100%";
      el.style.minHeight = h ? h + "px" : "100dvh";
      el.style.margin = "0";
      el.style.overflow = "hidden";
    });
    var wrap = document.getElementById("wrap");
    if (wrap) {
      wrap.style.background = "#0b1a0b";
      wrap.style.inset = "0";
      wrap.style.width = w ? w + "px" : "100%";
      wrap.style.height = h ? h + "px" : "100%";
    }
  }
  paintFill();
  window.addEventListener("resize", paintFill);
  window.addEventListener("orientationchange", paintFill);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", paintFill);
    window.visualViewport.addEventListener("scroll", paintFill);
  }
})();
