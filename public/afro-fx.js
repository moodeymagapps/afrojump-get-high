(function () {
  "use strict";
  if (window.__afroFxInit) return;
  window.__afroFxInit = true;

  var PLANES = [
    "/planes/merz.png",
    "/planes/fckafd.png",
    "/planes/161.png",
    "/planes/palestine.png"
  ];
  var SKY = [
    { src: "/sky/cloud.png", w: 92 },
    { src: "/sky/cloud_bank.png", w: 120 },
    { src: "/sky/bird.png", w: 40 },
    { src: "/sky/birds.png", w: 58 },
    { src: "/sky/balloon.png", w: 32 },
    { src: "/sky/leaves.png", w: 32 }
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

    function spawn(src, w, y, spd, kind) {
      var wrap = document.createElement("div");
      wrap.style.cssText = "position:absolute;left:0;top:0;width:" + w + "px;pointer-events:none;";
      var img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.draggable = false;
      img.style.cssText = "display:block;width:100%;height:auto;pointer-events:none;image-rendering:pixelated;";
      wrap.appendChild(img);
      layer.appendChild(wrap);
      items.push({
        wrap: wrap,
        x: layer.getBoundingClientRect().width + 16,
        y: y,
        v: -Math.abs(spd),
        w: w,
        kind: kind,
        bob: Math.random() * 5
      });
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
          spawn(PLANES[pi++ % PLANES.length], Math.min(148, Math.max(104, r.width * 0.36)), 36 + Math.random() * Math.max(16, r.height * 0.2), 0.88, "plane");
          nextPlane = m + 240 + Math.floor(Math.random() * 260);
        }
        var now = Date.now();
        if ((!nextSky || now >= nextSky) && items.filter(function (it) { return it.kind === "sky"; }).length < 2) {
          var s = SKY[Math.floor(Math.random() * SKY.length)];
          spawn(s.src, s.w, 18 + Math.random() * Math.max(16, r.height * 0.32), 0.2 + Math.random() * 0.14, "sky");
          nextSky = now + 5000 + Math.random() * 5000;
        }
        for (var i = items.length - 1; i >= 0; i--) {
          var it = items[i];
          it.x += it.v;
          it.bob += 0.03;
          it.wrap.style.transform = "translate(" + it.x.toFixed(1) + "px," + (it.y + Math.sin(it.bob) * 3).toFixed(1) + "px)";
          if (it.x < -it.w - 48) { it.wrap.remove(); items.splice(i, 1); }
        }
      } catch (e) {}
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
