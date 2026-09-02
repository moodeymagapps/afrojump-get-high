import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

const KEY_ART =
  "https://afrojumper.app/__l5e/assets-v1/0ddacadd-adb6-40df-9701-fe9168b6a5f6/afro-jump-keyart-og.jpg";
const PUBLIC_ORIGIN = "https://afrojumper.app/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "STONER JUMP – JUMP HIGH." },
      { name: "description", content: "JUMP HIGH." },
      { property: "og:title", content: "STONER JUMP – JUMP HIGH." },
      { property: "og:url", content: "https://afrojumper.app" },
      { property: "og:image", content: KEY_ART },
    ],
    links: [{ rel: "canonical", href: "https://afrojumper.app" }],
  }),
  component: Index,
});

function patchSkins(html: string, publicBase: string, duelCode: string | null) {
  let out = html;
  out = out.replace("const DEFAULT_SKIN='james';", "const DEFAULT_SKIN='bob';");
  out = out.replace(
    'JSON.parse(localStorage.getItem(OK)||\'["james"]\')',
    'JSON.parse(localStorage.getItem(OK)||\'["bob"]\')'
  );
  out = out.replace(
    "owned=owned.map(id=>id==='revengebird'?'bob':id);",
    "owned=owned.map(id=>id==='revengebird'||id==='james'?'bob':id).filter(id=>id!=='james');"
  );
  out = out.replace(
    "  {id:'james',      name:'James',      price:0,    community:true, rarity:'legendary', img:'skins/james.png',      anchorY:0.70},\n  {id:'bob',        name:'Bob',        price:50,   community:true, rarity:'rare',      img:'skins/bob.png',        anchorY:0.70},",
    "  {id:'bob',        name:'Bob',        price:0,    community:true, rarity:'common',    img:'skins/bob.png',        anchorY:0.70},"
  );
  out = out.replace(
    "if(!owned.includes(selectedSkin))selectedSkin=DEFAULT_SKIN;",
    "if(selectedSkin==='james'||!owned.includes(selectedSkin))selectedSkin=DEFAULT_SKIN;"
  );
  out = out.replace(
    "if(d.selectedSkin&&owned.includes(d.selectedSkin))selectedSkin=d.selectedSkin;",
    "if(d.selectedSkin&&d.selectedSkin!=='james'&&owned.includes(d.selectedSkin))selectedSkin=d.selectedSkin;if(selectedSkin==='james')selectedSkin='bob';"
  );
  const LOGO = '/stoner-jump-logo.jpg';
  out = out.replaceAll('Afro Jump', 'Stoner Jump');
  out = out.replaceAll('AFRO JUMP', 'STONER JUMP');
  out = out.replaceAll('/__l5e/assets-v1/69274bbc-7857-4d3d-a4d3-4747a688e509/afro-jump-logo.png', LOGO);
  out = out.replaceAll('/stoner-jump-logo.jpg', LOGO);
  out = out.replaceAll("Afro landed", "Stoner landed");

  out = out.replace(
    "function duelLink(code){const u=new URL(window.location.href);u.searchParams.set('duel',code);return u.toString();}",
    "function duelLink(code){const base=(window.PUBLIC_GAME_ORIGIN||'" + publicBase + "');const u=new URL(base, 'https://afrojumper.app/');u.searchParams.set('duel',String(code||'').toUpperCase());return u.toString();}"
  );

  const boot =
    "<script>window.PUBLIC_GAME_ORIGIN=" +
    JSON.stringify(publicBase) +
    ";window.DUEL_BOOT_CODE=" +
    JSON.stringify(duelCode) +
    ";(function(){function showCopied(code){try{var link=duelLink(code);duelSay('Raum <b style=\"color:#7cfc00\">' + code + '</b><br>Code: <b>' + code + '</b><br>Link:<br><span style=\"font-size:13px;word-break:break-all\">' + escHtml(link) + '</span><br>Warte auf Gegner\u2026');}catch(e){}}var btn=document.getElementById('duelCreate');if(btn){var prev=btn.onclick;btn.onclick=function(){var code=randCode();duelSay('Raum <b style=\"color:#7cfc00\">' + code + '</b> wird erstellt\u2026');duelJoin(code,'host');var copy=document.getElementById('duelCopy');if(copy){copy.style.display='block';copy.onclick=function(){var link=duelLink(code);function done(){showCopied(code);}if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(link).then(done).catch(done);}else{done();}};}}};}if(window.DUEL_BOOT_CODE&&/^[A-Z0-9]{4,8}$/i.test(window.DUEL_BOOT_CODE)){setTimeout(function(){try{openDuel();duelJoin(String(window.DUEL_BOOT_CODE).toUpperCase(),'guest');}catch(e){}},700);}})();</script>";
  if (out.includes("</body>")) out = out.replace("</body>", boot + "</body>");
  else out += boot;
  return out;
}

function Index() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    let cancelled = false;
    const duelCode = new URLSearchParams(window.location.search).get("duel");
    const publicBase =
      window.location.origin && window.location.protocol.indexOf("http") === 0
        ? window.location.origin + "/"
        : PUBLIC_ORIGIN;
    fetch("/game.html?v=stoner2", { cache: "no-store" })
      .then((r) => r.text())
      .then((html) => {
        if (cancelled || !frame) return;
        frame.srcdoc = patchSkins(html, publicBase, duelCode);
      })
      .catch(() => {
        if (!cancelled && frame && !frame.getAttribute("src")) {
          frame.src = "/game.html?v=stoner2" + window.location.search;
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
        title="Stoner Jump"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, background: "#0b1a0b" }}
        allow="fullscreen; autoplay; clipboard-write"
        allowFullScreen
      />
    </div>
  );
}
