/* Afro Jump – Banner-Flugzeuge alle 200–300 m */
(function () {
  "use strict";
  if (window.__afroPlanesInit) return;
  window.__afroPlanesInit = true;

  const SRCS = {
    palestine: "/planes/plane_palestine.png",
    fckafd: "/planes/plane_fckafd.png",
    p161: "/planes/plane_161.png",
    merz: "/planes/plane_merz.png",
  };

  const KEYS = Object.keys(SRCS);
  const imgs = {};
  KEYS.forEach(function (k) {
    const im = new Image();
    im.src = SRCS[k];
    imgs[k] = im;
  });

  function findCanvas() {
    return document.getElementById("c") || document.querySelector("canvas");
  }

  function boot() {
    const gameCv = findCanvas();
    if (!gameCv) {
      setTimeout(boot, 250);
      return;
    }
    const wrap = gameCv.parentElement || document.getElementById("wrap") || document.body;
    const ov = document.createElement("canvas");
    ov.id = "planeOverlay";
    ov.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:4;image-rendering:pixelated;";
    if (!wrap.style.position) wrap.style.position = "relative";
    wrap.appendChild(ov);
    const g = ov.getContext("2d");

    function fit() {
      const r = gameCv.getBoundingClientRect();
      const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
      ov.width = Math.max(1, Math.round(r.width * dpr));
      ov.height = Math.max(1, Math.round(r.height * dpr));
      ov.style.width = r.width + "px";
      ov.style.height = r.height + "px";
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.imageSmoothingEnabled = false;
    }
    fit();
    window.addEventListener("resize", fit);

    function readMeters() {
      const el = document.getElementById("score");
      if (!el) return 0;
      const m = String(el.textContent || "").match(/(\d+)/);
      return m ? parseInt(m[1], 10) : 0;
    }
    function playing() {
      const menu = document.getElementById("menu");
      const over = document.getElementById("over");
      const pause = document.getElementById("pause");
      const shop = document.getElementById("shop");
      const vis = function (el) {
        return el && (el.style.display === "flex" || el.classList.contains("show"));
      };
      if (vis(over) || vis(pause) || vis(shop) || vis(menu)) return false;
      return true;
    }

    const planes = [];
    let nextAt = 200 + Math.floor(Math.random() * 101);
    let lastMeters = 0;
    let idx = 0;

    function spawn() {
      const key = KEYS[idx++ % KEYS.length];
      const im = imgs[key];
      const W = ov.getBoundingClientRect().width;
      const H = ov.getBoundingClientRect().height;
      if (W < 40 || H < 40) return;
      const dir = Math.random() < 0.5 ? 1 : -1;
      const targetW = Math.min(300, Math.max(170, W * 0.68));
      const nw = im.naturalWidth || 280;
      const nh = im.naturalHeight || 70;
      const scale = targetW / Math.max(1, nw);
      const pw = nw * scale;
      const ph = nh * scale;
      const y = 56 + Math.random() * Math.max(40, H * 0.42);
      planes.push({
        key: key,
        x: dir > 0 ? -pw - 8 : W + 8,
        y: y,
        vx: dir * (1.25 + Math.random() * 0.6),
        w: pw,
        h: ph,
        bob: Math.random() * Math.PI * 2,
      });
    }

    function tick() {
      const meters = readMeters();
      if (meters < lastMeters - 20) {
        nextAt = 200 + Math.floor(Math.random() * 101);
        planes.length = 0;
      }
      lastMeters = meters;
      if (playing() && meters >= nextAt) {
        spawn();
        nextAt = meters + 200 + Math.floor(Math.random() * 101);
      }

      const W = ov.getBoundingClientRect().width;
      const H = ov.getBoundingClientRect().height;
      if (ov.width < 2) fit();
      g.setTransform(
        ov.width / Math.max(1, W) || 1,
        0,
        0,
        ov.height / Math.max(1, H) || 1,
        0,
        0
      );
      g.imageSmoothingEnabled = false;
      g.clearRect(0, 0, W, H);

      for (let i = planes.length - 1; i >= 0; i--) {
        const p = planes[i];
        p.x += p.vx * 1.4;
        p.bob += 0.04;
        const yy = p.y + Math.sin(p.bob) * 5;
        const im = imgs[p.key];
        if (im && im.complete && im.naturalWidth) {
          g.save();
          if (p.vx < 0) {
            g.translate(p.x + p.w / 2, yy + p.h / 2);
            g.scale(-1, 1);
            g.drawImage(im, -p.w / 2, -p.h / 2, p.w, p.h);
          } else {
            g.drawImage(im, p.x, yy, p.w, p.h);
          }
          g.restore();
        }
        if (p.x > W + p.w + 40 || p.x < -p.w - 40) planes.splice(i, 1);
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
