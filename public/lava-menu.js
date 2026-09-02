/* Afro Jump – Lava menu button art + ember particles */
(function () {
  const SRC = window.LAVA_BTN_SRC || "/lava/lava_btn.png";
  const CSS = `#menu #menuLava{width:100%;min-width:0;margin:4px 0 2px;position:relative;overflow:visible;z-index:2;}
#menu #menuLava img{position:relative;z-index:2;width:100%;height:auto;display:block;image-rendering:pixelated;filter:drop-shadow(0 4px 0 rgba(0,0,0,.55)) drop-shadow(0 0 12px rgba(255,90,0,.55));animation:lavaBtnPulse 1.15s ease-in-out infinite;}
#menu #menuLava .lavaFxWrap{position:absolute;inset:-22% -10%;z-index:3;pointer-events:none;overflow:visible;}
#menu #menuLava .lavaFxWrap canvas{width:100%;height:100%;display:block;image-rendering:pixelated;pointer-events:none;}
#menu #menuLava::after{content:"";position:absolute;left:10%;right:10%;top:30%;bottom:32%;z-index:0;background:radial-gradient(ellipse at 50% 50%,rgba(255,90,0,.4),rgba(255,40,0,.08) 55%,transparent 75%);filter:blur(8px);animation:lavaGlow 1.4s ease-in-out infinite alternate;pointer-events:none;}
@keyframes lavaBtnPulse{0%,100%{filter:drop-shadow(0 4px 0 rgba(0,0,0,.55)) drop-shadow(0 0 10px rgba(255,80,0,.4));}50%{filter:drop-shadow(0 4px 0 rgba(0,0,0,.55)) drop-shadow(0 0 18px rgba(255,140,0,.8));}}
@keyframes lavaGlow{from{opacity:.55;transform:scale(1);}to{opacity:1;transform:scale(1.06);}}`;

  function ensureCss() {
    if (document.getElementById("lavaMenuCss")) return;
    const s = document.createElement("style");
    s.id = "lavaMenuCss";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function buildButton(btn) {
    if (!btn || btn.dataset.lavaReady === "1") return btn;
    btn.dataset.lavaReady = "1";
    btn.classList.add("mSprite", "lavaBtn");
    btn.setAttribute("aria-label", "Lava-Modus");
    btn.innerHTML = "";
    const wrap = document.createElement("span");
    wrap.className = "lavaFxWrap";
    wrap.setAttribute("aria-hidden", "true");
    const canvas = document.createElement("canvas");
    canvas.id = "lavaBtnFx";
    wrap.appendChild(canvas);
    const img = document.createElement("img");
    img.id = "lavaBtnImg";
    img.alt = "LAVA";
    img.src = SRC;
    btn.appendChild(wrap);
    btn.appendChild(img);
    return btn;
  }

  function startFx(btn) {
    const canvas = btn.querySelector("#lavaBtnFx");
    const menu = document.getElementById("menu");
    if (!canvas || !menu) return;
    const ctx = canvas.getContext("2d");
    const parts = [];
    let dpr = 1, cw = 0, ch = 0, acc = 0;
    function resize() {
      const r = btn.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) return;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cw = Math.round(r.width);
      ch = Math.round(r.height * 1.5);
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      canvas.style.width = cw + "px";
      canvas.style.height = ch + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spawn(n) {
      while (n--) {
        const kind = Math.random();
        let x, y, vx, vy, size;
        if (kind < 0.52) {
          x = cw * (0.08 + Math.random() * 0.84);
          y = ch * 0.36 + Math.random() * ch * 0.1;
          vx = (Math.random() - 0.5) * 1.1;
          vy = -(0.7 + Math.random() * 1.8);
          size = 1.2 + Math.random() * 3.4;
        } else if (kind < 0.8) {
          const left = Math.random() < 0.5;
          x = left ? cw * (0.03 + Math.random() * 0.1) : cw * (0.87 + Math.random() * 0.1);
          y = ch * (0.38 + Math.random() * 0.3);
          vx = (left ? -1 : 1) * (0.3 + Math.random() * 0.8);
          vy = -(0.25 + Math.random() * 1.2);
          size = 1.4 + Math.random() * 3.8;
        } else {
          x = cw * (0.14 + Math.random() * 0.72);
          y = ch * (0.64 + Math.random() * 0.08);
          vx = (Math.random() - 0.5) * 0.3;
          vy = 0.4 + Math.random() * 1.05;
          size = 1.6 + Math.random() * 4.4;
        }
        parts.push({ x, y, vx, vy, size, life: 1, hot: Math.random() });
      }
    }
    function tick() {
      requestAnimationFrame(tick);
      const vis = getComputedStyle(menu).display !== "none";
      if (!vis) { parts.length = 0; return; }
      if (canvas.width < 4) resize();
      acc++;
      if (acc % 2 === 0) spawn(3);
      if (parts.length > 110) parts.splice(0, parts.length - 110);
      ctx.clearRect(0, 0, cw, ch);
      ctx.imageSmoothingEnabled = false;
      ctx.globalCompositeOperation = "lighter";
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx; p.y += p.vy;
        p.vy += p.vy < 0 ? -0.01 : 0.02;
        p.life -= 0.018;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        const a = Math.max(0, p.life);
        const s = Math.max(1, Math.round(p.size * (0.55 + 0.6 * a)));
        ctx.fillStyle = p.hot > 0.55
          ? "rgba(255,240,140," + (0.9 * a) + ")"
          : p.hot > 0.28
            ? "rgba(255,140,30," + (0.85 * a) + ")"
            : "rgba(255,55,0," + (0.75 * a) + ")";
        ctx.fillRect(Math.round(p.x), Math.round(p.y), s, s);
        if (s >= 2) {
          ctx.fillStyle = "rgba(255,255,210," + (0.4 * a) + ")";
          ctx.fillRect(Math.round(p.x), Math.round(p.y), s - 1, s - 1);
        }
      }
      ctx.globalCompositeOperation = "source-over";
    }
    window.addEventListener("resize", resize);
    setTimeout(resize, 40);
    tick();
  }

  function enhance() {
    ensureCss();
    let btn = document.getElementById("menuLava");
    if (!btn) {
      const play = document.getElementById("menuPlay");
      if (!play || !play.parentNode) return;
      btn = document.createElement("button");
      btn.id = "menuLava";
      play.parentNode.insertBefore(btn, play.nextSibling);
      btn.addEventListener("click", function () {
        if (typeof playWipe === "function") playWipe();
        if (typeof startLavaGame === "function") startLavaGame();
      });
    }
    buildButton(btn);
    startFx(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhance);
  } else {
    enhance();
  }
})();
