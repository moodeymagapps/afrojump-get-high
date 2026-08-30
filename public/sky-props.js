(function () {
  "use strict";
  if (window.__afroSkyInit) return;
  window.__afroSkyInit = true;
  var FILES = [
    { src: "/sky/cloud.webm", w: 0.34, rare: false },
    { src: "/sky/cloud_bank.webm", w: 0.5, rare: false },
    { src: "/sky/bird.webm", w: 0.12, rare: false },
    { src: "/sky/birds.webm", w: 0.22, rare: false },
    { src: "/sky/balloon.webm", w: 0.2, rare: true },
    { src: "/sky/blimp.webm", w: 0.26, rare: true },
    { src: "/sky/leaves.webm", w: 0.16, rare: false }
  ];
  function findCanvas() {
    return document.getElementById("c") || document.querySelector("canvas");
  }
  function boot() {
    var gameCv = findCanvas();
    if (!gameCv) { setTimeout(boot, 250); return; }
    var wrap = gameCv.parentElement || document.body;
    var ov = document.createElement("canvas");
    ov.id = "skyOverlay";
    ov.style.cssText =
      "position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:2;opacity:.58;";
    wrap.appendChild(ov);
    var g = ov.getContext("2d");
    function fit() {
      var r = gameCv.getBoundingClientRect();
      var dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      ov.width = Math.max(1, Math.round(r.width * dpr));
      ov.height = Math.max(1, Math.round(r.height * dpr));
      ov.style.width = r.width + "px";
      ov.style.height = r.height + "px";
      ov.style.left = gameCv.offsetLeft + "px";
      ov.style.top = gameCv.offsetTop + "px";
    }
    fit();
    window.addEventListener("resize", fit);
    var items = [];
    var next = 0;
    function vid(src) {
      var v = document.createElement("video");
      v.src = src;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.setAttribute("playsinline", "");
      v.play().catch(function () {});
      return v;
    }
    function spawn() {
      if (items.length >= 2) return;
      var pool = FILES.filter(function (f) { return !f.rare || Math.random() < 0.25; });
      var spec = pool[Math.floor(Math.random() * pool.length)];
      var W = ov.getBoundingClientRect().width;
      var H = ov.getBoundingClientRect().height;
      var dir = Math.random() < 0.5 ? 1 : -1;
      var w = Math.max(48, W * spec.w);
      items.push({
        v: vid(spec.src),
        x: dir > 0 ? -w - 10 : W + 10,
        y: 40 + Math.random() * Math.max(30, H * 0.45),
        vx: dir * (0.35 + Math.random() * 0.35),
        w: w,
        h: w * 0.62,
        bob: Math.random() * 6
      });
    }
    function tick(t) {
      if (t > next) {
        spawn();
        next = t + 5000 + Math.random() * 7000;
      }
      var W = ov.getBoundingClientRect().width;
      var H = ov.getBoundingClientRect().height;
      if (ov.width < 2) fit();
      g.setTransform(ov.width / Math.max(1, W), 0, 0, ov.height / Math.max(1, H), 0, 0);
      g.imageSmoothingEnabled = false;
      g.clearRect(0, 0, W, H);
      for (var i = items.length - 1; i >= 0; i--) {
        var p = items[i];
        p.x += p.vx;
        p.bob += 0.02;
        var yy = p.y + Math.sin(p.bob) * 4;
        try { if (p.v.readyState >= 2) g.drawImage(p.v, p.x, yy, p.w, p.h); } catch (e) {}
        if (p.x > W + p.w + 30 || p.x < -p.w - 30) items.splice(i, 1);
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
