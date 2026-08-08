import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Afro Jump – Get High!" },
      { name: "description", content: "Springe so hoch du kannst! Sammle Weed-Baggys, weiche der Polizei aus und besiege den Bosshubschrauber." },
    ],
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
