(function () {
  "use strict";
  if (window.__afroFxInit) return;
  window.__afroFxInit = true;

  var PLANES = ["/planes/merz.png", "/planes/fckafd.png", "/planes/161.png", "/planes/palestine.png"];
  var SKY = [
    { src: "/sky/cloud.png", maxW: 90, maxH: 64 },
    { src: "/sky/cloud_bank.png", maxW: 110, maxH: 56 },
    { src: "/sky/bird.png", maxW: 42, maxH: 42 },
    { src: "/sky/birds.png", maxW: 60, maxH: 42 },
    { src: "/sky/leaves.png", maxW: 34, maxH: 40 }
  ];

  function canvas() {
    return document.getElementById("c") || document.querySelector("canvas");
  }
  function meters() {
    var el = document.getElementById("score");
    if (!el) return 0;
    var m = String(el.textContent || "").match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  function boot() {
    var cv = canvas();
    if (!cv) { setTimeout(boot, 400); return; }
    var parent = cv.parentElement || document.body;
    var layer = document.getElementById("afroFxLayer");
    if (!layer) {
      layer = document.createElement("div");
      layer.id = "afroFxLayer";
      layer.style.cssText = "position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:1;";
      parent.appendChild(layer);
    }

    var items = [];
    var nextPlane = 240;
    var nextSky = 0;
    var last = 0;
    var pi = 0;
    var live = false;

    function spawn(src, maxW, maxH, y, spd, kind) {
      var wrap = document.createElement("div");
      wrap.style.cssText = "position:absolute;left:0;top:0;pointer-events:none;";
      var img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.draggable = false;
      img.style.cssText =
        "display:block;width:auto;height:auto;max-width:" + maxW +
        "px;max-height:" + maxH + "px;pointer-events:none;";
      wrap.appendChild(img);
      layer.appendChild(wrap);
      var W = layer.getBoundingClientRect().width || 360;
      items.push({
        wrap: wrap,
        x: W + 20,
        y: y,
        v: -Math.abs(spd),
        w: maxW,
        kind: kind
      });
      wrap.style.left = items[items.length - 1].x + "px";
      wrap.style.top = y + "px";
    }

    function tick() {
      try {
        var m = meters();
        if (m >= 12) live = true;
        if (!live) { requestAnimationFrame(tick); return; }
        if (m < last - 30) {
          nextPlane = 240;
          items.forEach(function (it) { try { it.wrap.remove(); } catch (e) {} });
          items.length = 0;
        }
        last = m;
        var r = layer.getBoundingClientRect();
        if (m >= nextPlane && items.filter(function (it) { return it.kind === "plane"; }).length < 1 && r.width > 40) {
          var pw = Math.min(160, Math.max(110, r.width * 0.38));
          spawn(PLANES[pi++ % PLANES.length], pw, 48, 32 + Math.random() * Math.max(12, r.height * 0.18), 0.9, "plane");
          nextPlane = m + 240 + Math.floor(Math.random() * 260);
        }
        var now = Date.now();
        if ((!nextSky || now >= nextSky) && items.filter(function (it) { return it.kind === "sky"; }).length < 2) {
          var s = SKY[Math.floor(Math.random() * SKY.length)];
          spawn(s.src, s.maxW, s.maxH, 16 + Math.random() * Math.max(12, r.height * 0.3), 0.22, "sky");
          nextSky = now + 5000 + Math.random() * 5000;
        }
        for (var i = items.length - 1; i >= 0; i--) {
          var it = items[i];
          it.x += it.v;
          it.wrap.style.left = it.x.toFixed(1) + "px";
          if (it.x < -it.w - 60) { it.wrap.remove(); items.splice(i, 1); }
        }
      } catch (e) {}
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
