(function () {
  "use strict";
  if (window.__afroFxInit) return;
  window.__afroFxInit = true;

  var PLANES = ["/planes/merz.png", "/planes/fckafd.png", "/planes/161.png", "/planes/palestine.png"];
  var SKY = [
    { src: "/sky/cloud.png", maxW: 86, maxH: 58 },
    { src: "/sky/cloud_bank.png", maxW: 104, maxH: 50 },
    { src: "/sky/bird.png", maxW: 38, maxH: 38 },
    { src: "/sky/birds.png", maxW: 54, maxH: 38 }
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
    var cs = window.getComputedStyle(parent);
    if (cs.position === "static") parent.style.position = "relative";

    var layer = document.getElementById("afroFxLayer");
    if (!layer) {
      layer = document.createElement("div");
      layer.id = "afroFxLayer";
      layer.style.cssText = "position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:1;";
      parent.appendChild(layer);
    }

    var items = [];
    var nextPlane = 280;
    var nextSky = 0;
    var last = 0;
    var pi = 0;
    var live = false;

    function spawn(src, maxW, maxH, y, spd, kind) {
      var wrap = document.createElement("div");
      wrap.style.cssText = "position:absolute;pointer-events:none;";
      var img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.draggable = false;
      img.style.cssText =
        "display:block;width:auto;height:auto;max-width:" + maxW +
        "px;max-height:" + maxH + "px;pointer-events:none;opacity:" +
        (kind === "sky" ? "0.75" : "0.96") + ";";
      wrap.appendChild(img);
      layer.appendChild(wrap);
      var W = layer.getBoundingClientRect().width || 360;
      var it = { wrap: wrap, x: W + 24, y: y, v: -Math.abs(spd), w: maxW, kind: kind };
      wrap.style.left = it.x + "px";
      wrap.style.top = it.y + "px";
      items.push(it);
    }

    function clearAll() {
      items.forEach(function (it) { try { it.wrap.remove(); } catch (e) {} });
      items.length = 0;
    }

    function tick() {
      try {
        var m = meters();
        if (m >= 20) live = true;
        if (!live) { requestAnimationFrame(tick); return; }
        if (m < last - 40) {
          nextPlane = 280;
          nextSky = 0;
          clearAll();
        }
        last = m;
        var r = layer.getBoundingClientRect();
        var planes = 0, skies = 0, i;
        for (i = 0; i < items.length; i++) {
          if (items[i].kind === "plane") planes++;
          else skies++;
        }
        if (m >= nextPlane && planes < 1 && r.width > 50) {
          spawn(PLANES[pi++ % PLANES.length], 132, 40, 28 + Math.random() * 36, 0.72, "plane");
          nextPlane = m + 320 + Math.floor(Math.random() * 220);
        }
        var now = Date.now();
        if ((!nextSky || now >= nextSky) && skies < 2 && r.width > 50) {
          var s = SKY[Math.floor(Math.random() * SKY.length)];
          spawn(s.src, s.maxW, s.maxH, 14 + Math.random() * 48, 0.16 + Math.random() * 0.1, "sky");
          nextSky = now + 7000 + Math.random() * 6000;
        }
        for (i = items.length - 1; i >= 0; i--) {
          var it = items[i];
          it.x += it.v;
          it.wrap.style.left = it.x.toFixed(1) + "px";
          if (it.x < -it.w - 80) {
            it.wrap.remove();
            items.splice(i, 1);
          }
        }
      } catch (e) {}
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
