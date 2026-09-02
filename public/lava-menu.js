/* Afro Jump – Lava menu button (no external PNG required) */
(function () {
  const CSS = `
#menu #menuLava{
  width:100%;min-width:0;margin:6px 0 4px;position:relative;overflow:visible;z-index:2;
  background:none!important;border:none!important;padding:0!important;cursor:pointer;display:block;
  line-height:0;-webkit-tap-highlight-color:transparent;color:inherit;
}
#menu #menuLava .lavaArt{
  position:relative;z-index:2;width:100%;height:58px;
  display:flex;align-items:center;gap:8px;
  padding:0 12px 0 8px;box-sizing:border-box;
  font-family:"Press Start 2P",monospace;
  background:linear-gradient(#7a2200,#2a0800 55%,#140200);
  border:3px solid #ff9a2a;
  box-shadow:0 4px 0 #3a0a00, inset 0 0 0 2px #4a1000, 0 0 18px rgba(255,80,0,.55);
  clip-path:polygon(0 8px,8px 8px,8px 0,calc(100% - 8px) 0,calc(100% - 8px) 8px,100% 8px,100% calc(100% - 8px),calc(100% - 8px) calc(100% - 8px),calc(100% - 8px) 100%,8px 100%,8px calc(100% - 8px),0 calc(100% - 8px));
}
#menu #menuLava .lavaCube{
  position:relative;z-index:1;flex:0 0 40px;height:40px;
  display:grid;place-items:center;
}
#menu #menuLava .lavaCube b{
  display:block;width:26px;height:26px;background:#ffb000;
  box-shadow:3px 3px 0 #7a1800, inset -2px -2px 0 #ffe27a, inset 2px 2px 0 #ff7a00;
  border:2px solid #3a0a00;
}
#menu #menuLava .lavaWord{
  position:relative;z-index:1;flex:1;text-align:center;
  font-size:15px;letter-spacing:3px;line-height:1;
  color:#ffe566!important;
  text-shadow:3px 3px 0 #3a0a00, 0 0 10px #ff7a00;
}
#menu #menuLava .lavaChev{
  position:relative;z-index:1;color:#ffe566!important;font-size:16px;letter-spacing:-3px;
  text-shadow:2px 2px 0 #3a0a00, 0 0 8px #ff8a00;padding-right:2px;
}
#menu #menuLava .lavaFxWrap{
  position:absolute;inset:-30% -14%;z-index:3;pointer-events:none;overflow:visible;
}
#menu #menuLava .lavaFxWrap canvas{
  width:100%;height:100%;display:block;image-rendering:pixelated;pointer-events:none;
}
#menu #menuLava::after{
  content:"";position:absolute;left:6%;right:6%;top:10%;bottom:10%;z-index:0;
  background:radial-gradient(ellipse at 50% 50%,rgba(255,90,0,.5),transparent 70%);
  filter:blur(7px);pointer-events:none;animation:lavaGlow 1.3s ease-in-out infinite alternate;
}
@keyframes lavaGlow{from{opacity:.5}to{opacity:1}}
`;

  function ensureCss() {
    if (document.getElementById("lavaMenuCss")) return;
    const s = document.createElement("style");
    s.id = "lavaMenuCss";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function buildButton(btn) {
    if (!btn) return btn;
    btn.classList.add("lavaBtn");
    btn.setAttribute("aria-label", "Lava-Modus");
    btn.style.cssText = "";
    btn.innerHTML =
      '<span class="lavaFxWrap" aria-hidden="true"><canvas id="lavaBtnFx"></canvas></span>' +
      '<div class="lavaArt">' +
      '<span class="lavaCube"><b></b></span>' +
      '<span class="lavaWord">LAVA</span>' +
      '<span class="lavaChev">>></span>' +
      '</div>';
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
      ch = Math.round(r.height * 1.6);
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
          y = ch * 0.32 + Math.random() * ch * 0.12;
          vx = (Math.random() - 0.5) * 1.2;
          vy = -(0.8 + Math.random() * 2);
          size = 1.3 + Math.random() * 3.4;
        } else if (kind < 0.8) {
          const left = Math.random() < 0.5;
          x = left ? cw * 0.05 : cw * 0.95;
          y = ch * (0.38 + Math.random() * 0.28);
          vx = (left ? -1 : 1) * (0.4 + Math.random() * 0.9);
          vy = -(0.25 + Math.random() * 1.2);
          size = 1.4 + Math.random() * 3.8;
        } else {
          x = cw * (0.15 + Math.random() * 0.7);
          y = ch * 0.68;
          vx = (Math.random() - 0.5) * 0.3;
          vy = 0.5 + Math.random() * 1.1;
          size = 1.6 + Math.random() * 4.2;
        }
        parts.push({ x, y, vx, vy, size, life: 1, hot: Math.random() });
      }
    }
    function tick() {
      requestAnimationFrame(tick);
      if (getComputedStyle(menu).display === "none") { parts.length = 0; return; }
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
        p.vy += p.vy < 0 ? -0.012 : 0.02;
        p.life -= 0.018;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        const a = Math.max(0, p.life);
        const s = Math.max(1, Math.round(p.size * (0.55 + 0.55 * a)));
        ctx.fillStyle = p.hot > 0.5 ? "rgba(255,240,140," + (0.9 * a) + ")" : "rgba(255,90,0," + (0.8 * a) + ")";
        ctx.fillRect(Math.round(p.x), Math.round(p.y), s, s);
      }
      ctx.globalCompositeOperation = "source-over";
    }
    window.addEventListener("resize", resize);
    setTimeout(resize, 30);
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

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", enhance);
  else enhance();
})();
