/* Afro Jump – Lava menu button (pixel banner + ember particles) */
(function () {
  const SRC = window.LAVA_BTN_SRC || "/lava/lava_btn.png";
  const CSS = `
#menu #menuLava{
  width:100%;min-width:0;margin:6px 0 4px;position:relative;overflow:visible;z-index:2;
  background:none;border:none;padding:0;cursor:pointer;display:block;line-height:0;
  -webkit-tap-highlight-color:transparent;
}
#menu #menuLava img{
  position:relative;z-index:2;width:100%;height:auto;display:block;image-rendering:pixelated;
  filter:drop-shadow(0 4px 0 rgba(0,0,0,.55)) drop-shadow(0 0 12px rgba(255,90,0,.55));
  animation:lavaBtnPulse 1.15s ease-in-out infinite;
}
#menu #menuLava .lavaArt{
  position:relative;z-index:2;width:100%;height:56px;
  display:flex;align-items:center;gap:8px;padding:0 10px 0 6px;box-sizing:border-box;
  image-rendering:pixelated;font-family:"Press Start 2P",monospace;
  background:
    linear-gradient(#3a0c00,#1a0400) padding-box,
    linear-gradient(90deg,#ffb347,#ff5a00 40%,#ffd36a 70%,#ff3b00) border-box;
  border:3px solid transparent;
  clip-path:polygon(0 10px,10px 10px,10px 0,calc(100% - 10px) 0,calc(100% - 10px) 10px,100% 10px,100% calc(100% - 10px),calc(100% - 10px) calc(100% - 10px),calc(100% - 10px) 100%,10px 100%,10px calc(100% - 10px),0 calc(100% - 10px));
  box-shadow:0 4px 0 #140200, 0 0 16px rgba(255,80,0,.45), inset 0 0 12px rgba(255,60,0,.35);
  animation:lavaBtnPulse 1.15s ease-in-out infinite;
}
#menu #menuLava .lavaArt::before{
  content:"";position:absolute;inset:3px;z-index:0;pointer-events:none;
  background:
    repeating-linear-gradient(90deg, rgba(255,90,0,.12) 0 8px, transparent 8px 16px),
    radial-gradient(circle at 20% 50%, rgba(255,140,0,.25), transparent 45%),
    linear-gradient(#5a1400,#2a0600);
}
#menu #menuLava .lavaCube{
  position:relative;z-index:1;flex:0 0 42px;height:42px;width:42px;
  display:grid;place-items:center;
}
#menu #menuLava .lavaCube i{
  display:block;width:28px;height:28px;
  background:linear-gradient(135deg,#ffe27a 0%,#ffb347 30%,#ff6a00 70%,#c43000 100%);
  box-shadow:3px 3px 0 #7a1800, inset -2px -2px 0 #ffea9a, inset 2px 2px 0 #ff8a20;
  clip-path:polygon(20% 8%,80% 8%,92% 22%,92% 78%,80% 92%,20% 92%,8% 78%,8% 22%);
  position:relative;
}
#menu #menuLava .lavaCube i::after{
  content:"";position:absolute;left:4px;right:4px;bottom:-6px;height:8px;
  background:linear-gradient(#ffb000,#ff4d00);
  clip-path:polygon(10% 0,90% 0,80% 100%,20% 100%);
}
#menu #menuLava .lavaWord{
  position:relative;z-index:1;flex:1;text-align:center;
  font-size:16px;letter-spacing:2px;line-height:1;
  color:#ffe566;
  text-shadow:0 0 8px #ff7a00, 3px 3px 0 #4a0c00, -1px -1px 0 #ffdd55;
  background:linear-gradient(#fff1a0,#ff9a1a 55%,#ff3b00);
  -webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 2px 0 #2a0600);
}
#menu #menuLava .lavaChev{
  position:relative;z-index:1;color:#ffe27a;font-size:16px;letter-spacing:-4px;
  text-shadow:2px 2px 0 #5a1000, 0 0 8px #ff8a00;padding-right:4px;
}
#menu #menuLava .lavaFxWrap{
  position:absolute;inset:-28% -12%;z-index:3;pointer-events:none;overflow:visible;
}
#menu #menuLava .lavaFxWrap canvas{
  width:100%;height:100%;display:block;image-rendering:pixelated;pointer-events:none;
}
#menu #menuLava::after{
  content:"";position:absolute;left:8%;right:8%;top:18%;bottom:18%;z-index:0;
  background:radial-gradient(ellipse at 50% 50%,rgba(255,90,0,.45),rgba(255,40,0,.08) 55%,transparent 75%);
  filter:blur(8px);animation:lavaGlow 1.4s ease-in-out infinite alternate;pointer-events:none;
}
@keyframes lavaBtnPulse{
  0%,100%{filter:drop-shadow(0 4px 0 rgba(0,0,0,.55)) drop-shadow(0 0 10px rgba(255,80,0,.4));}
  50%{filter:drop-shadow(0 4px 0 rgba(0,0,0,.55)) drop-shadow(0 0 18px rgba(255,140,0,.85));}
}
@keyframes lavaGlow{
  from{opacity:.55;transform:scale(1);}
  to{opacity:1;transform:scale(1.07);}
}`; 

  function ensureCss() {
    if (document.getElementById("lavaMenuCss")) return;
    const s = document.createElement("style");
    s.id = "lavaMenuCss";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function cssArt() {
    const art = document.createElement("div");
    art.className = "lavaArt";
    art.innerHTML = '<span class="lavaCube"><i></i></span><span class="lavaWord">LAVA</span><span class="lavaChev">>></span>';
    return art;
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
    img.onerror = function () {
      if (img.parentNode) img.parentNode.replaceChild(cssArt(), img);
    };
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
      ch = Math.round(r.height * 1.55);
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
        if (kind < 0.5) {
          x = cw * (0.06 + Math.random() * 0.88);
          y = ch * 0.34 + Math.random() * ch * 0.1;
          vx = (Math.random() - 0.5) * 1.2;
          vy = -(0.8 + Math.random() * 2.0);
          size = 1.2 + Math.random() * 3.6;
        } else if (kind < 0.78) {
          const left = Math.random() < 0.5;
          x = left ? cw * (0.02 + Math.random() * 0.1) : cw * (0.88 + Math.random() * 0.1);
          y = ch * (0.36 + Math.random() * 0.32);
          vx = (left ? -1 : 1) * (0.35 + Math.random() * 0.9);
          vy = -(0.3 + Math.random() * 1.3);
          size = 1.4 + Math.random() * 4;
        } else {
          x = cw * (0.12 + Math.random() * 0.76);
          y = ch * (0.62 + Math.random() * 0.1);
          vx = (Math.random() - 0.5) * 0.35;
          vy = 0.45 + Math.random() * 1.15;
          size = 1.7 + Math.random() * 4.6;
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
      if (parts.length > 120) parts.splice(0, parts.length - 120);
      ctx.clearRect(0, 0, cw, ch);
      ctx.imageSmoothingEnabled = false;
      ctx.globalCompositeOperation = "lighter";
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx; p.y += p.vy;
        p.vy += p.vy < 0 ? -0.012 : 0.022;
        p.life -= 0.017;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        const a = Math.max(0, p.life);
        const s = Math.max(1, Math.round(p.size * (0.55 + 0.6 * a)));
        ctx.fillStyle = p.hot > 0.55
          ? "rgba(255,240,140," + (0.92 * a) + ")"
          : p.hot > 0.28
            ? "rgba(255,140,30," + (0.86 * a) + ")"
            : "rgba(255,55,0," + (0.78 * a) + ")";
        ctx.fillRect(Math.round(p.x), Math.round(p.y), s, s);
        if (s >= 2) {
          ctx.fillStyle = "rgba(255,255,210," + (0.42 * a) + ")";
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
