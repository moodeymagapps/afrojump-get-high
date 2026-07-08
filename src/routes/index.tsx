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
    <div className="fixed inset-0 bg-black">
      <iframe
        src="/game.html"
        title="Afro Jump"
        className="w-full h-full border-0"
        allow="fullscreen"
      />
    </div>
  );
}
