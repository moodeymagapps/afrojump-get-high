(function () {
  "use strict";
  if (window.__afroFxInit) return;
  window.__afroFxInit = true;

  var PLANES = ["/planes/merz.png", "/planes/fckafd.png", "/planes/161.png", "/planes/palestine.png"];
  var SKY = [
    { src: "/sky/cloud.png", w: 88, rare: false },
    { src: "/sky/cloud_bank.png", w: 110, rare: false },
    { src: "/sky/bird.png", w: 36, rare: false },
    { src: "/sky/birds.png", w: 56, rare: false },
    { src: "/sky/balloon.png", w: 32, rare: true },
    { src: "/sky/blimp.png", w: 62, rare: true },
    { src: "/sky/leaves.png", w: 32, rare: false }
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

  function overlayOpen() {
    var ids = ["over", "pause", "shop", "menu"];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (!el) continue;
      var s = window.getComputedStyle(el);
      if (s.display === "none" || s.visibility === "hidden" || s.opacity === "0") continue;
      if (el.style.display === "flex" || el.classList.contains("show") || s.display === "flex" || s.display === "block") return true;
    }
    return false;
  }

  function playing() {
    return !overlayOpen();
  }

  function raiseUi() {
    if (document.getElementById("afroFxUiFix")) return;
    var st = document.createElement("style");
    st.id = "afroFxUiFix";
    st.textContent =
      "#over,#pause,#shop,#menu,#hud,#ui,.hud,.overlay{" +
      "position:relative;z-index:40 !important;}" +
      "#c,canvas{position:relative;z-index:0;}" +
      "#afroFxLayer{z-index:1 !important;}";
    document.head.appendChild(st);
    ["over", "pause", "shop", "menu", "hud"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.style.zIndex = "40";
    });
  }

  function boot() {
    var gameCv = findCanvas();
    if (!gameCv) { setTimeout(boot, 250); return; }
    raiseUi();
    var wrap = gameCv.parentElement || document.body;
    if (wrap && getComputedStyle(wrap).position === "static") wrap.style.position = "relative";
    var layer = document.getElementById("afroFxLayer");
    if (!layer) {
      layer = document.createElement("div");
      layer.id = "afroFxLayer";
      layer.style.cssText =
        "position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:hidden;z-index:1;";
      if (gameCv.parentNode) gameCv.parentNode.insertBefore(layer, gameCv.nextSibling);
      else wrap.appendChild(layer);
    } else {
      layer.style.zIndex = "1";
    }

    function box() { return layer.getBoundingClientRect(); }

    var flyers = [];
    var nextPlane = 220 + Math.floor(Math.random() * 80);
    var nextSky = 0;
    var lastM = 0;
    var pIdx = 0;

    function clearFlyers() {
      flyers.forEach(function (f) { f.el.remove(); });
      flyers.length = 0;
    }

    function spawnImg(src, wpx, y, speed, kind) {
      var img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.draggable = false;
      img.style.cssText =
        "position:absolute;top:0;left:0;width:" + wpx + "px;height:auto;" +
        "transform-origin:center center;image-rendering:pixelated;pointer-events:none;opacity:" +
        (kind === "sky" ? "0.55" : "0.92") + ";";
      layer.appendChild(img);
      flyers.push({
        el: img, x: -wpx - 12, y: y,
        vx: speed, w: wpx, kind: kind, bob: Math.random() * 6
      });
    }

    function spawnPlane() {
      var W = box().width, H = box().height;
      if (W < 40) return;
      var w = Math.min(150, Math.max(110, W * 0.38));
      spawnImg(PLANES[pIdx++ % PLANES.length], w, 42 + Math.random() * Math.max(20, H * 0.22), 0.9 + Math.random() * 0.35, "plane");
    }

    function spawnSky() {
      if (flyers.filter(function (f) { return f.kind === "sky"; }).length >= 2) return;
      var pool = SKY.filter(function (s) { return !s.rare || Math.random() < 0.22; });
      var spec = pool[Math.floor(Math.random() * pool.length)];
      var H = box().height;
      spawnImg(spec.src, spec.w, 28 + Math.random() * Math.max(20, H * 0.35), 0.22 + Math.random() * 0.2, "sky");
    }

    function tick(t) {
      var on = playing();
      layer.style.visibility = on ? "visible" : "hidden";
      if (!on) {
        clearFlyers();
        requestAnimationFrame(tick);
        return;
      }
      var meters = readMeters();
      if (meters < lastM - 20) {
        nextPlane = 220 + Math.floor(Math.random() * 80);
        clearFlyers();
      }
      lastM = meters;
      if (meters >= nextPlane) {
        spawnPlane();
        nextPlane = meters + 220 + Math.floor(Math.random() * 280);
      }
      if (t > nextSky) {
        spawnSky();
        nextSky = t + 5000 + Math.random() * 7000;
      }
      var W = box().width;
      for (var i = flyers.length - 1; i >= 0; i--) {
        var f = flyers[i];
        f.x += f.vx;
        f.bob += 0.03;
        var yy = f.y + Math.sin(f.bob) * (f.kind === "sky" ? 2 : 3);
        f.el.style.transform = "translate(" + f.x.toFixed(1) + "px," + yy.toFixed(1) + "px)";
        if (f.x > W + f.w + 40) {
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
