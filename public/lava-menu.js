/* Afro Jump – Lava button uses /lava_btn.png, compact size */
(function () {
  const SRC = "/lava_btn.png";
  const CSS = "#menu #menuLava{width:86%;max-width:280px;margin:4px auto 6px;padding:0;border:none;background:none!important;cursor:pointer;display:block;line-height:0;}#menu #menuLava img{width:100%;height:auto;max-height:58px;object-fit:contain;object-position:center;display:block;image-rendering:pixelated;}";
  function ensureCss(){
    if(document.getElementById("lavaMenuCss")) return;
    const s=document.createElement("style");
    s.id="lavaMenuCss";
    s.textContent=CSS;
    document.head.appendChild(s);
  }
  function enhance(){
    ensureCss();
    const btn=document.getElementById("menuLava");
    if(!btn) return false;
    const img=btn.querySelector("img") || document.createElement("img");
    img.alt="LAVA";
    img.src=SRC;
    img.removeAttribute("onerror");
    btn.innerHTML="";
    btn.appendChild(img);
    btn.style.cssText="";
    return true;
  }
  function boot(){
    if(enhance()) return;
    let n=0;
    const t=setInterval(function(){ n++; if(enhance()||n>40) clearInterval(t); },100);
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
