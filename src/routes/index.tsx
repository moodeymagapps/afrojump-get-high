import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

const KEY_ART =
  "https://afrojumper.app/__l5e/assets-v1/0ddacadd-adb6-40df-9701-fe9168b6a5f6/afro-jump-keyart-og.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AFRO JUMP – JUMP HIGH." },
      { name: "description", content: "JUMP HIGH." },
      { property: "og:title", content: "AFRO JUMP – JUMP HIGH." },
      { property: "og:url", content: "https://afrojumper.app" },
      { property: "og:image", content: KEY_ART },
    ],
    links: [{ rel: "canonical", href: "https://afrojumper.app" }],
  }),
  component: Index,
});

export function readRoomCode() {
  try {
    const path = window.location.pathname.replace(/^\//, "").split("/")[0];
    if (path && /^[A-Z0-9]{4,8}$/i.test(path)) return path.toUpperCase();
  } catch (e) {}
  try {
    const q = new URLSearchParams(window.location.search).get("duel");
    if (q && /^[A-Z0-9]{4,8}$/i.test(q)) return q.toUpperCase();
  } catch (e) {}
  return null;
}

const EXTRA_BOOT = `
<script>
(function(){
  function addDfb(){
    try{
      if(typeof SKINS==='undefined' || !Array.isArray(SKINS)) return false;
      if(!SKINS.some(function(s){ return s && (s.id==='dfbboy' || s.id==='dfb'); })){
        SKINS.push({id:'dfbboy', name:'DFB', price:1500, community:true, rarity:'legendary', img:'skins/dfbboy.png', anchorY:0.70});
      }
      return true;
    }catch(e){ return false; }
  }
  function boot(){
    addDfb();
    var n=0, t=setInterval(function(){ n++; if(addDfb()||n>50) clearInterval(t); }, 100);
    var c=window.DUEL_BOOT_CODE;
    if(c && /^[A-Z0-9]{4,8}$/i.test(c)){
      setTimeout(function(){ try{ openDuel(); duelJoin(String(c).toUpperCase(),'guest'); }catch(e){} }, 700);
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
</script>
`;

export function patchDuelLinks(html: string, roomCode: string | null) {
  let out = html;
  out = out.replace(
    "function duelLink(code){const u=new URL(window.location.href);u.searchParams.set('duel',code);return u.toString();}",
    "function duelLink(code){return 'https://afrojumper.app/'+String(code||'').toUpperCase();}"
  );
  const boot = "<script>window.DUEL_BOOT_CODE=" + JSON.stringify(roomCode) + ";</script>" + EXTRA_BOOT;
  if (out.includes("</body>")) out = out.replace("</body>", boot + "</body>");
  else out += boot;
  return out;
}

export function Index() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    let cancelled = false;
    const roomCode = readRoomCode();
    fetch("/game.html?v=duel7", { cache: "no-store" })
      .then((r) => r.text())
      .then((html) => {
        if (cancelled || !frame) return;
        frame.srcdoc = patchDuelLinks(html, roomCode);
      })
      .catch(() => {
        if (!cancelled && frame && !frame.getAttribute("src")) {
          frame.src = "/game.html?v=duel7";
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, width: "100%", height: "100dvh", background: "#0b1a0b", overflow: "hidden" }}>
      <iframe
        ref={frameRef}
        title="Afro Jump"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, background: "#0b1a0b" }}
        allow="fullscreen; autoplay; clipboard-write"
        allowFullScreen
      />
    </div>
  );
}
