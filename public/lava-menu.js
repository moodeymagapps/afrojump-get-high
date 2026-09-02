/* Stoner Jump – Lava button above Vollbild */
(function () {
  const SRC = "/lava_btn.png";
  const CSS = "#menu #menuLava{width:100%;max-width:none;margin:10px 0 8px;padding:0;border:none;background:none!important;cursor:pointer;display:block;line-height:0;}#menu #menuLava img{width:100%;height:88px;object-fit:contain;object-position:center;display:block;image-rendering:pixelated;}";
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
    const slot=document.querySelector("#menu .mUtil") || document.getElementById("menuFs");
    if(slot && slot.parentNode && btn.parentNode!==slot.parentNode){
      slot.parentNode.insertBefore(btn, slot);
    } else if(slot && slot.parentNode && btn.nextElementSibling!==slot){
      slot.parentNode.insertBefore(btn, slot);
    }
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
