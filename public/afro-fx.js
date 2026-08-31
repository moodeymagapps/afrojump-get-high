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
    if (!gameCv) { setTimeout(boot, 300); return; }
    var wrap = gameCv.parentElement || document.body;
    var layer = document.getElementById("afroFxLayer");
    if (!layer) {
      layer = document.createElement("div");
      layer.id = "afroFxLayer";
      layer.style.cssText =
        "position:absolute;left:0;top:0;width:100%;height:100%;" +
        "pointer-events:none !important;overflow:hidden;z-index:1;";
      wrap.appendChild(layer);
    }

    function box() { return layer.getBoundingClientRect(); }

    var flyers = [];
    var nextPlane = 180 + Math.floor(Math.random() * 80);
    var nextSky = 2000;
    var lastM = 0;
    var pIdx = 0;

    function spawnImg(src, wpx, y, speed, kind) {
      var img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.draggable = false;
      img.style.cssText =
        "position:absolute;top:0;left:0;width:" + wpx + "px;height:auto;" +
        "pointer-events:none;image-rendering:pixelated;opacity:" +
        (kind === "sky" ? "0.6" : "0.95") + ";";
      layer.appendChild(img);
      flyers.push({ el: img, x: -wpx - 16, y: y, vx: speed, w: wpx, kind: kind, bob: Math.random() * 6 });
    }

    function spawnPlane() {
      var W = box().width, H = box().height;
      if (W < 40) return;
      var w = Math.min(140, Math.max(100, W * 0.36));
      spawnImg(PLANES[pIdx++ % PLANES.length], w, 40 + Math.random() * Math.max(16, H * 0.2), 0.85 + Math.random() * 0.3, "plane");
    }

    function spawnSky() {
      if (flyers.filter(function (f) { return f.kind === "sky"; }).length >= 2) return;
      var spec = SKY[Math.floor(Math.random() * SKY.length)];
      var H = box().height;
      spawnImg(spec.src, spec.w, 24 + Math.random() * Math.max(16, H * 0.32), 0.2 + Math.random() * 0.18, "sky");
    }

    function tick(t) {
      try {
        var meters = readMeters();
        if (meters < lastM - 30) {
          nextPlane = 180 + Math.floor(Math.random() * 80);
          flyers.forEach(function (f) { f.el.remove(); });
          flyers.length = 0;
        }
        lastM = meters;
        if (meters >= nextPlane) {
          spawnPlane();
          nextPlane = meters + 220 + Math.floor(Math.random() * 280);
        }
        if (t > nextSky) {
          spawnSky();
          nextSky = t + 6000 + Math.random() * 7000;
        }
        var W = box().width;
        for (var i = flyers.length - 1; i >= 0; i--) {
          var f = flyers[i];
          f.x += f.vx;
          f.bob += 0.03;
          var yy = f.y + Math.sin(f.bob) * 3;
          f.el.style.transform = "translate(" + f.x.toFixed(1) + "px," + yy.toFixed(1) + "px)";
          if (f.x > W + f.w + 40) {
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
