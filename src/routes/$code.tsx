import { createFileRoute } from "@tanstack/react-router";
import { Index } from "./index";

export const Route = createFileRoute("/$code")({
  head: () => ({
    meta: [
      { title: "AFRO JUMP – Duell" },
      { name: "description", content: "AFRO JUMP Duell-Einladung." },
      { property: "og:title", content: "AFRO JUMP – Duell" },
      { property: "og:description", content: "AFRO JUMP Duell-Einladung." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});
