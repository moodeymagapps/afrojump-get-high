(function () {
  "use strict";
  if (window.__afroFxInit) return;
  window.__afroFxInit = true;

  var PLANES = ["/planes/merz.gif", "/planes/fckafd.gif", "/planes/161.gif", "/planes/palestine.gif"];
  var SKY = [
    { src: "/sky/cloud.gif", w: 88 },
    { src: "/sky/cloud2.gif", w: 90 },
    { src: "/sky/cloud3.gif", w: 70 },
    { src: "/sky/cloud_wide.gif", w: 118 },
    { src: "/sky/cloud_small.gif", w: 56 },
    { src: "/sky/bird.gif", w: 40 },
    { src: "/sky/birds.gif", w: 58 },
    { src: "/sky/leaves.gif", w: 32 },
    { src: "/sky/balloon.gif", w: 32 }
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
      var boxEl = document.createElement("div");
      boxEl.style.cssText =
        "position:absolute;top:0;left:0;width:" + wpx + "px;pointer-events:none;will-change:transform;";
      var img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.draggable = false;
      img.style.cssText =
        "display:block;width:100%;height:auto;pointer-events:none;image-rendering:pixelated;opacity:" +
        (kind === "sky" ? "0.72" : "1") + ";";
      boxEl.appendChild(img);
      layer.appendChild(boxEl);
      flyers.push({
        el: boxEl, x: box().width + 12, y: y,
        vx: -Math.abs(speed), w: wpx, kind: kind, bob: Math.random() * 6
      });
    }

    function tick() {
      try {
        var meters = readMeters();
        if (meters >= 15) started = true;
        if (!started) { requestAnimationFrame(tick); return; }
        if (meters < lastM - 30) {
          nextPlane = 250; nextSkyAt = 0;
          flyers.forEach(function (f) { try { f.el.remove(); } catch (e) {} });
          flyers.length = 0;
        }
        lastM = meters;
        var W = box().width, H = box().height;
        if (meters >= nextPlane && flyers.filter(function (f) { return f.kind === "plane"; }).length < 1 && W >= 40) {
          var w = Math.min(140, Math.max(100, W * 0.36));
          spawnImg(PLANES[pIdx++ % PLANES.length], w, 40 + Math.random() * Math.max(16, H * 0.2), 0.9, "plane");
          nextPlane = meters + 250 + Math.floor(Math.random() * 250);
        }
        var now = Date.now();
        var skyLive = flyers.filter(function (f) { return f.kind === "sky"; }).length;
        if ((!nextSkyAt || now >= nextSkyAt) && skyLive < 3) {
          var spec = SKY[Math.floor(Math.random() * SKY.length)];
          spawnImg(spec.src, spec.w, 20 + Math.random() * Math.max(16, H * 0.34), 0.18 + Math.random() * 0.16, "sky");
          nextSkyAt = now + 3500 + Math.random() * 4500;
        }
        for (var i = flyers.length - 1; i >= 0; i--) {
          var f = flyers[i];
          f.x += f.vx;
          f.bob += 0.03;
          f.el.style.transform = "translate(" + f.x.toFixed(1) + "px," + (f.y + Math.sin(f.bob) * 3).toFixed(1) + "px)";
          if (f.x < -f.w - 40) { f.el.remove(); flyers.splice(i, 1); }
        }
      } catch (e) {}
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
