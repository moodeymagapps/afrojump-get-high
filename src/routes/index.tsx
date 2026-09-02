import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

const KEY_ART =
  "https://afrojumper.app/__l5e/assets-v1/0ddacadd-adb6-40df-9701-fe9168b6a5f6/afro-jump-keyart-og.jpg";

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

function patchSkins(html: string) {
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
  return out;
}

function Index() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    let cancelled = false;
    fetch("/game.html?v=stoner1", { cache: "no-store" })
      .then((r) => r.text())
      .then((html) => {
        if (cancelled || !frame) return;
        frame.srcdoc = patchSkins(html);
      })
      .catch(() => {
        if (!cancelled && frame && !frame.getAttribute("src")) {
          frame.src = "/game.html?v=stoner1";
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
