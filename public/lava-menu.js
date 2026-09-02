/* Afro Jump – Lava button uses /lava_btn.png */
(function () {
  const SRC = "/lava_btn.png";
  const CSS = "#menu #menuLava{width:100%;min-width:0;margin:6px 0 4px;padding:0;border:none;background:none!important;cursor:pointer;display:block;line-height:0;}#menu #menuLava img{width:100%;height:auto;display:block;image-rendering:pixelated;}";
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
    btn.style.cssText="width:100%;background:none;border:none;padding:0;margin:6px 0 4px;cursor:pointer;";
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
