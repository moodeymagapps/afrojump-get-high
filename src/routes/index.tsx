import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

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

function patchGameHtml(html: string) {
  let out = html;
  if (!out.includes('<base ')) {
    out = out.replace("<head>", '<head>\n<base href="/" />');
  }
  out = out.replace(
    "html,body{margin:0;padding:0;height:100%;background:#0b1a0b;",
    "html,body{margin:0;padding:0;height:100%;min-height:100dvh;min-height:-webkit-fill-available;background:#0b1a0b;"
  );
  out = out.replace(
    "const SKY_BIRDS=['bird','birds','leaves'];",
    "const SKY_BIRDS=['leaves'];"
  );
  out = out.replace(
    "const PLANE_FILES=['fckafd','p161','merz','palestine'];",
    "const PLANE_FILES=['fckafd','161','merz','palestine'];"
  );
  out = out.replaceAll(
    "planeNextM=200+Math.random()*300",
    "planeNextM=200+Math.random()*200"
  );
  out = out.replaceAll(
    "planeT=12+Math.random()*6",
    "planeT=4+Math.random()*4"
  );
  out = out.replace(
    "  // Birds — daytime\n  const birdA=Math.max(0,1-sstep(m,400,900));\n  if(birdA>0.01){",
    "  // Birds disabled\n  const birdA=0;\n  if(false){"
  );
  return out;
}

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

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    let cancelled = false;
    fetch("/game.html", { cache: "no-store" })
      .then((r) => r.text())
      .then((html) => {
        if (cancelled || !frame) return;
        frame.srcdoc = patchGameHtml(html);
      })
      .catch(() => {
        if (!cancelled && frame && !frame.getAttribute("src")) {
          frame.src = "/game.html";
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
        inset: 0,
        width: "100%",
        height: "100%",
        minHeight: "100dvh",
        background: "#0b1a0b",
        overflow: "hidden",
        overscrollBehavior: "none",
        touchAction: "none",
      }}
    >
      <iframe
        ref={frameRef}
        title="Afro Jump"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
          background: "#0b1a0b",
          display: "block",
        }}
        allow="fullscreen; autoplay; clipboard-write"
        allowFullScreen
        onLoad={injectScripts}
      />
    </div>
  );
}
