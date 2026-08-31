(function () {
  "use strict";
  if (window.__afroFxInit) return;
  window.__afroFxInit = true;

  var PLANES = ["/planes/merz.png", "/planes/fckafd.png", "/planes/161.png", "/planes/palestine.png"];
  var SKY = [
    { src: "/sky/cloud.png", w: 88 },
    { src: "/sky/cloud_bank.png", w: 110 },
    { src: "/sky/bird.png", w: 36 },
    { src: "/sky/birds.png", w: 56 },
    { src: "/sky/balloon.png", w: 32 },
    { src: "/sky/blimp.png", w: 62 },
    { src: "/sky/leaves.png", w: 32 }
  ];

  function findCanvas() {
    return document.getElementById("c") || document.querySelector("canvas");
  }

  function readMeters() {
    var el = document.getElementById("score");
    if (!el) return 0;
    var m = String(el.textContent || "").match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  function boot() {
    var gameCv = findCanvas();
    if (!gameCv) { setTimeout(boot, 400); return; }
    var wrap = gameCv.parentElement || document.body;
    if (!document.getElementById("afroFxLayer")) {
      var layer = document.createElement("div");
      layer.id = "afroFxLayer";
      layer.style.cssText =
        "position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:hidden;z-index:1;";
      wrap.appendChild(layer);
    }
    var layer = document.getElementById("afroFxLayer");

    var flyers = [];
    var nextPlane = 250;
    var nextSkyAt = 0;
    var lastM = 0;
    var pIdx = 0;
    var started = false;

    function box() { return layer.getBoundingClientRect(); }

    function spawnImg(src, wpx, y, speed, kind) {
      var img = document.createElement("img");
      img.src = src;
      img.decoding = "async";
      img.alt = "";
      img.draggable = false;
      img.style.cssText =
        "position:absolute;top:0;left:0;width:" + wpx + "px;height:auto;" +
        "pointer-events:none;image-rendering:pixelated;opacity:" +
        (kind === "sky" ? "0.55" : "0.95") + ";";
      layer.appendChild(img);
      flyers.push({ el: img, x: -wpx - 16, y: y, vx: speed, w: wpx, kind: kind, bob: Math.random() * 6 });
    }

    function tick() {
      try {
        var meters = readMeters();
        if (meters >= 15) started = true;
        if (!started) {
          requestAnimationFrame(tick);
          return;
        }
        if (meters < lastM - 30) {
          nextPlane = 250;
          nextSkyAt = 0;
          flyers.forEach(function (f) { try { f.el.remove(); } catch (e) {} });
          flyers.length = 0;
        }
        lastM = meters;
        if (meters >= nextPlane && flyers.filter(function (f) { return f.kind === "plane"; }).length < 1) {
          var W = box().width, H = box().height;
          if (W >= 40) {
            var w = Math.min(140, Math.max(100, W * 0.36));
            spawnImg(PLANES[pIdx++ % PLANES.length], w, 40 + Math.random() * Math.max(16, H * 0.2), 0.85, "plane");
            nextPlane = meters + 250 + Math.floor(Math.random() * 250);
          }
        }
        var now = Date.now();
        if ((!nextSkyAt || now >= nextSkyAt) && flyers.filter(function (f) { return f.kind === "sky"; }).length < 1) {
          var spec = SKY[Math.floor(Math.random() * SKY.length)];
          var H2 = box().height;
          spawnImg(spec.src, spec.w, 24 + Math.random() * Math.max(16, H2 * 0.3), 0.22, "sky");
          nextSkyAt = now + 8000 + Math.random() * 8000;
        }
        var WW = box().width;
        for (var i = flyers.length - 1; i >= 0; i--) {
          var f = flyers[i];
          f.x += f.vx;
          f.bob += 0.03;
          f.el.style.transform = "translate(" + f.x.toFixed(1) + "px," + (f.y + Math.sin(f.bob) * 3).toFixed(1) + "px)";
          if (f.x > WW + f.w + 40) {
            f.el.remove();
            flyers.splice(i, 1);
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
