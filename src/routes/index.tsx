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
  if (!out.includes("<base ")) {
    out = out.replace("<head>", '<head>\n<base href="/" />');
  }

  out = out.replace(
    "html,body{margin:0;padding:0;height:100%;background:#0b1a0b;",
    "html,body{margin:0;padding:0;height:100%;min-height:100dvh;min-height:-webkit-fill-available;background:#0b1a0b;"
  );

  out = out.replace(
    "canvas{background:#0b1a0b;display:block;box-shadow:0 0 40px #000a, 0 0 0 4px #2b1a0a, 0 0 0 8px #7cfc00;touch-action:none;image-rendering:pixelated;}",
    "canvas{background:#0b1a0b;display:block;box-shadow:none;touch-action:none;image-rendering:pixelated;}"
  );

  out = out.replace(
    "const vw=window.innerWidth,vh=window.innerHeight;",
    "const vw=(window.visualViewport&&window.visualViewport.width)||window.innerWidth,vh=(window.visualViewport&&window.visualViewport.height)||window.innerHeight;"
  );

  out = out.replace(
    "const SKY_BIRDS=['bird','birds','leaves'];",
    "const SKY_BIRDS=['leaves'];"
  );

  out = out.replace(
    "const PLANE_FILES=['fckafd','p161','merz','palestine'];",
    "const PLANE_FILES=['fckafd','161','merz','palestine'];try{PLANE_FILES.forEach(function(b){media('planes/'+b);});}catch(e){}"
  );
  out = out.replaceAll(
    "planeNextM=200+Math.random()*300",
    "planeNextM=40"
  );
  out = out.replaceAll(
    "planeT=12+Math.random()*6",
    "planeT=1.2"
  );
  out = out.replace(
    "planeNextM=m+200+Math.random()*300",
    "planeNextM=m+220+Math.random()*120"
  );
  out = out.replace(
    "const w=W*(0.28+Math.random()*0.14),h=w*0.3;",
    "const w=W*(0.34+Math.random()*0.08),h=w*0.3;"
  );
  out = out.replace(
    "y:30+Math.random()*(H*0.35)",
    "y:H*0.30+Math.random()*(H*0.28)"
  );
  out = out.replace(
    "  if(plane){\n    plane.t+=dt;\n    plane.x+=plane.vx*dt;\n    const bob=Math.sin(plane.t*1.8)*3;\n    drawMedia(ctx,'planes/'+plane.base,plane.x,plane.y+bob,plane.w,plane.h,0.95,plane.dir<0);\n    if(plane.x>W+plane.w*1.2||plane.x<-plane.w*2.2)plane=null;",
    "  if(plane){\n    const md=media('planes/'+plane.base);\n    if(!md.ready){drawMedia(ctx,'planes/'+plane.base,plane.x,plane.y,plane.w,plane.h,0.95,plane.dir<0);}\n    else{\n    plane.t+=dt;\n    plane.x+=plane.vx*dt;\n    const bob=Math.sin(plane.t*1.8)*3;\n    drawMedia(ctx,'planes/'+plane.base,plane.x,plane.y+bob,plane.w,plane.h,0.95,plane.dir<0);\n    if(plane.x>W+plane.w*1.2||plane.x<-plane.w*2.2)plane=null;}\n"
  );

  out = out.replace(
    "const png=()=>{const i=new Image();i.onload=()=>{m.el=i;m.ready=true;};i.onerror=()=>{m.dead=true;};i.src='/'+base+'.png';};\n    try{",
    "const png=()=>{const i=new Image();i.onload=()=>{if(!m.ready||!(m.el&&m.el.tagName==='VIDEO')){m.el=i;m.ready=true;}};i.onerror=()=>{if(!m.ready)m.dead=true;};i.src='/'+base+'.png';};\n    png();\n    try{"
  );

  out = out.replace(
    "  // Birds — daytime\n  const birdA=Math.max(0,1-sstep(m,400,900));\n  if(birdA>0.01){",
    "  // Birds disabled\n  const birdA=0;\n  if(false){"
  );
  out = out.replace(
    "const birdA=Math.max(0,1-sstep(m,400,900));",
    "const birdA=0;"
  );

  const inject =
    "<style id=\"afroSafeFill\">" +
    "html,body,#wrap{background:#0b1a0b!important;min-height:100dvh!important;min-height:-webkit-fill-available!important;}" +
    "canvas{box-shadow:none!important;}" +
    ".overlay,#menu,#menu::after{background-color:#0c1408!important;}" +
    "</style>";
  if (!out.includes("afroSafeFill")) {
    out = out.replace("</head>", inject + "</head>");
  }
  return out;
}

function Index() {
  const frameRef = useRef<HTMLIFrameElement>(null);

  function injectScripts() {
    try {
      const doc = frameRef.current?.contentDocument;
      if (!doc) return;
      doc.documentElement.style.background = "#0b1a0b";
      if (doc.body) doc.body.style.background = "#0b1a0b";
      if (!doc.getElementById("afroFxScript")) {
        const s = doc.createElement("script");
        s.id = "afroFxScript";
        s.src = "/afro-fx.js?v=fit7";
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
    fetch("/game.html?v=fit7", { cache: "no-store" })
      .then((r) => r.text())
      .then((html) => {
        if (cancelled || !frame) return;
        frame.srcdoc = patchGameHtml(html);
      })
      .catch(() => {
        if (!cancelled && frame && !frame.getAttribute("src")) {
          frame.src = "/game.html?v=fit7";
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
        minHeight: "-webkit-fill-available",
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
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: 0,
          background: "#0b1a0b",
          display: "block",
          colorScheme: "dark",
        }}
        allow="fullscreen; autoplay; clipboard-write"
        allowFullScreen
        onLoad={injectScripts}
      />
    </div>
  );
}
