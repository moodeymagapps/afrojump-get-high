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
      { property: "og:description", content: "JUMP HIGH." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://afrojumper.app" },
      { property: "og:image", content: KEY_ART },
    ],
    links: [{ rel: "canonical", href: "https://afrojumper.app" }],
  }),
  component: Index,
});

function Index() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    let cancelled = false;
    fetch("/game.html?v=warp40", { cache: "no-store" })
      .then((r) => r.text())
      .then((html) => {
        if (cancelled || !frame) return;
        frame.srcdoc = html;
      })
      .catch(() => {
        if (!cancelled && frame && !frame.getAttribute("src")) {
          frame.src = "/game.html?v=warp40";
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100dvh",
        background: "#0b1a0b",
        overflow: "hidden",
      }}
    >
      <iframe
        ref={frameRef}
        title="Afro Jump"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: 0,
          background: "#0b1a0b",
        }}
        allow="fullscreen; autoplay; clipboard-write"
        allowFullScreen
      />
    </div>
  );
}
