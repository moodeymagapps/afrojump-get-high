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

  function inject(id: string, src: string) {
    try {
      const doc = frameRef.current?.contentDocument;
      if (!doc || doc.getElementById(id)) return;
      const s = doc.createElement("script");
      s.id = id;
      s.src = src;
      doc.body.appendChild(s);
    } catch {
      /* ignore */
    }
  }

  function injectAll() {
    inject("bannerPlanesScript", "/banner-planes.js");
    inject("skyPropsScript", "/sky-props.js");
    inject("deathQuotesScript", "/death-quotes.js");
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        height: "100dvh",
        background: "#0b1a0b",
        overscrollBehavior: "none",
        touchAction: "none",
      }}
    >
      <iframe
        ref={frameRef}
        src="/game.html"
        title="Afro Jump"
        className="w-full h-full border-0"
        style={{ background: "#0b1a0b" }}
        allow="fullscreen; autoplay; clipboard-write"
        allowFullScreen
        onLoad={injectAll}
      />
    </div>
  );
}
