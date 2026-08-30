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
  const LABELS = {
    palestine: "Free Palestine",
    fckafd: "FCKAFD",
    p161: "161",
    merz: "MERZLECKEIER",
  };
  const COLORS = {
    palestine: ["#0a7a3e", "#fff"],
    fckafd: ["#0b1d4a", "#f5c518"],
    p161: ["#c41212", "#fff"],
    merz: ["#f3e6c4", "#b11"],
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
    const wrap = gameCv.parentElement || document.body;
    const ov = document.createElement("canvas");
    ov.id = "planeOverlay";
    ov.style.cssText =
      "position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:3;image-rendering:pixelated;";
    wrap.appendChild(ov);
    const g = ov.getContext("2d");

    function fit() {
      const r = gameCv.getBoundingClientRect();
      const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
      ov.width = Math.max(1, Math.round(r.width * dpr));
      ov.height = Math.max(1, Math.round(r.height * dpr));
      ov.style.width = r.width + "px";
      ov.style.height = r.height + "px";
      ov.style.left = gameCv.offsetLeft + "px";
      ov.style.top = gameCv.offsetTop + "px";
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
      function vis(el) {
        if (!el) return false;
        const s = window.getComputedStyle(el);
        if (s.display === "none" || s.visibility === "hidden") return false;
        return el.style.display === "flex" || el.classList.contains("show");
      }
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
      const ready = im && im.complete && im.naturalWidth > 8;
      const targetW = Math.min(300, Math.max(170, W * 0.68));
      const nw = ready ? im.naturalWidth : 280;
      const nh = ready ? im.naturalHeight : 72;
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

    function drawFallback(p, yy) {
      const c = COLORS[p.key] || ["#222", "#fff"];
      g.fillStyle = "#c9c9c9";
      g.fillRect(p.x, yy + p.h * 0.35, p.w * 0.28, p.h * 0.22);
      g.fillStyle = c[0];
      g.fillRect(p.x + p.w * 0.32, yy + p.h * 0.18, p.w * 0.66, p.h * 0.64);
      g.fillStyle = c[1] || "#fff";
      g.font = "bold " + Math.max(10, Math.floor(p.h * 0.28)) + "px monospace";
      g.textBaseline = "middle";
      g.fillText(LABELS[p.key] || p.key, p.x + p.w * 0.36, yy + p.h * 0.5, p.w * 0.58);
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
        g.save();
        if (p.vx < 0) {
          g.translate(p.x + p.w / 2, yy + p.h / 2);
          g.scale(-1, 1);
          g.translate(-p.w / 2, -p.h / 2);
          if (im && im.complete && im.naturalWidth > 8) g.drawImage(im, 0, 0, p.w, p.h);
          else drawFallback({ key: p.key, x: 0, y: 0, w: p.w, h: p.h }, 0);
        } else if (im && im.complete && im.naturalWidth > 8) {
          g.drawImage(im, p.x, yy, p.w, p.h);
        } else {
          drawFallback(p, yy);
        }
        g.restore();
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
