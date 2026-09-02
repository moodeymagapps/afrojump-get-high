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

function patchDuelLinks(html: string, duelCode: string | null) {
  let out = html;
  out = out.replace(
    "function duelLink(code){const u=new URL(window.location.href);u.searchParams.set('duel',code);return u.toString();}",
    "function duelLink(code){return 'https://afrojumper.app/?duel='+encodeURIComponent(String(code||'').toUpperCase());}"
  );
  const boot =
    "<script>window.DUEL_BOOT_CODE=" +
    JSON.stringify(duelCode) +
    ";(function(){var c=window.DUEL_BOOT_CODE;if(c&&/^[A-Z0-9]{4,8}$/i.test(c)){setTimeout(function(){try{openDuel();duelJoin(String(c).toUpperCase(),'guest');}catch(e){}},700);}})();</script>";
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
    fetch("/game.html?v=duel4", { cache: "no-store" })
      .then((r) => r.text())
      .then((html) => {
        if (cancelled || !frame) return;
        frame.srcdoc = patchDuelLinks(html, duelCode);
      })
      .catch(() => {
        if (!cancelled && frame && !frame.getAttribute("src")) {
          frame.src = "/game.html?v=duel4" + window.location.search;
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
