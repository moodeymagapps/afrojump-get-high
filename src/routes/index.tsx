import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";

const KEY_ART =
  "https://afrojumper.app/__l5e/assets-v1/0ddacadd-adb6-40df-9701-fe9168b6a5f6/afro-jump-keyart-og.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AFRO JUMP – JUMP HIGH." },
      { name: "description", content: "JUMP HIGH. 🟢" },
      { property: "og:title", content: "AFRO JUMP – JUMP HIGH." },
      { property: "og:description", content: "JUMP HIGH. 🟢" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://afrojumper.app" },
      { property: "og:image", content: KEY_ART },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "AFRO JUMP Pixelart Key-Art – JUMP HIGH." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AFRO JUMP – JUMP HIGH." },
      { name: "twitter:description", content: "JUMP HIGH. 🟢" },
      { name: "twitter:image", content: KEY_ART },
    ],
    links: [{ rel: "canonical", href: "https://afrojumper.app" }],
  }),
  component: Index,
});

function Index() {
  const frameRef = useRef<HTMLIFrameElement>(null);

  function injectScripts() {
    try {
      const doc = frameRef.current?.contentDocument;
      if (!doc) return;
      if (!doc.getElementById("afroFxScript")) {
        const s = doc.createElement("script");
        s.id = "afroFxScript";
        s.src = "/afro-fx.js";
        doc.body.appendChild(s);
      }
      if (!doc.getElementById("bgMusicScript")) {
        const s2 = doc.createElement("script");
        s2.id = "bgMusicScript";
        s2.src = "/bg-music-pause.js";
        doc.body.appendChild(s2);
      }
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100dvh",
        minHeight: "-webkit-fill-available",
        background: "#0b1a0b",
        overscrollBehavior: "none",
        touchAction: "none",
      }}
    >
      <iframe
        ref={frameRef}
        src="/game.html"
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
        onLoad={injectScripts}
      />
    </div>
  );
}
