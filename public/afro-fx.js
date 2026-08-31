(function () {
  "use strict";
  if (window.__afroFxInit) return;
  window.__afroFxInit = true;

  var PLANES = ["/planes/merz.png", "/planes/fckafd.png", "/planes/161.png", "/planes/palestine.png"];
  var SKY = [
    { src: "/sky/cloud.png", w: 96, rare: false },
    { src: "/sky/cloud_bank.png", w: 120, rare: false },
    { src: "/sky/bird.png", w: 42, rare: false },
    { src: "/sky/birds.png", w: 64, rare: false },
    { src: "/sky/balloon.png", w: 36, rare: true },
    { src: "/sky/blimp.png", w: 70, rare: true },
    { src: "/sky/leaves.png", w: 36, rare: false }
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

  function playing() {
    function vis(id) {
      var el = document.getElementById(id);
      if (!el) return false;
      var s = window.getComputedStyle(el);
      if (s.display === "none" || s.visibility === "hidden") return false;
      return el.style.display === "flex" || el.classList.contains("show");
    }
    if (vis("over") || vis("pause") || vis("shop") || vis("menu")) return false;
    return true;
  }

  function boot() {
    var gameCv = findCanvas();
    if (!gameCv) { setTimeout(boot, 250); return; }
    var wrap = gameCv.parentElement || document.body;
    var layer = document.getElementById("afroFxLayer");
    if (!layer) {
      layer = document.createElement("div");
      layer.id = "afroFxLayer";
      layer.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:hidden;z-index:3;";
      wrap.appendChild(layer);
    }

    function box() { return layer.getBoundingClientRect(); }

    var flyers = [];
    var nextPlane = 220 + Math.floor(Math.random() * 80);
    var nextSky = 0;
    var lastM = 0;
    var pIdx = 0;

    function spawnImg(src, wpx, y, dir, speed, kind) {
      var img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.draggable = false;
      var W = box().width;
      img.style.cssText =
        "position:absolute;top:0;left:0;width:" + wpx + "px;height:auto;" +
        "image-rendering:pixelated;image-rendering:crisp-edges;pointer-events:none;opacity:" +
        (kind === "sky" ? "0.72" : "1") + ";";
      layer.appendChild(img);
      flyers.push({
        el: img, x: dir > 0 ? -wpx - 8 : W + 8, y: y,
        vx: dir * speed, w: wpx, kind: kind, bob: Math.random() * 6
      });
    }

    function spawnPlane() {
      var W = box().width, H = box().height;
      if (W < 40) return;
      var dir = Math.random() < 0.5 ? 1 : -1;
      var w = Math.min(210, Math.max(150, W * 0.55));
      spawnImg(PLANES[pIdx++ % PLANES.length], w, 50 + Math.random() * Math.max(30, H * 0.28), dir, 1.15 + Math.random() * 0.45, "plane");
    }

    function spawnSky() {
      var live = flyers.filter(function (f) { return f.kind === "sky"; }).length;
      if (live >= 2) return;
      var pool = SKY.filter(function (s) { return !s.rare || Math.random() < 0.22; });
      var spec = pool[Math.floor(Math.random() * pool.length)];
      var W = box().width, H = box().height;
      var dir = Math.random() < 0.5 ? 1 : -1;
      spawnImg(spec.src, spec.w, 36 + Math.random() * Math.max(24, H * 0.4), dir, 0.28 + Math.random() * 0.25, "sky");
    }

    function tick(t) {
      var meters = readMeters();
      if (meters < lastM - 20) {
        nextPlane = 220 + Math.floor(Math.random() * 80);
        flyers.forEach(function (f) { f.el.remove(); });
        flyers.length = 0;
      }
      lastM = meters;
      if (playing() && meters >= nextPlane) {
        spawnPlane();
        nextPlane = meters + 220 + Math.floor(Math.random() * 280);
      }
      if (playing() && t > nextSky) {
        spawnSky();
        nextSky = t + 4500 + Math.random() * 6000;
      }
      var W = box().width;
      for (var i = flyers.length - 1; i >= 0; i--) {
        var f = flyers[i];
        f.x += f.vx;
        f.bob += 0.03;
        var yy = f.y + Math.sin(f.bob) * (f.kind === "sky" ? 3 : 4);
        f.el.style.transform = "translate(" + f.x.toFixed(1) + "px," + yy.toFixed(1) + "px)" + (f.vx < 0 ? " scaleX(-1)" : "");
        if (f.x > W + f.w + 40 || f.x < -f.w - 40) {
          f.el.remove();
          flyers.splice(i, 1);
        }
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
