import { createFileRoute } from "@tanstack/react-router";

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
  return (
    <div
      className="fixed inset-0 overflow-hidden bg-black"
      style={{ height: "100dvh", overscrollBehavior: "none", touchAction: "none" }}
    >
      <iframe
        src="/game.html"
        title="Afro Jump"
        className="w-full h-full border-0"
        allow="fullscreen; autoplay; clipboard-write"
        allowFullScreen
      />
    </div>
  );
}
