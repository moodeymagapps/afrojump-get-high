# Afro Jump High

Du bist ein erfahrener Spieleentwickler für Mobile-Games. Erstelle mir ein direkt spielbares, voll funktionsfähiges HTML5-2D-Spiel im Stil von "Doodle Jump". 

Nutze die Claude-Artifacts-Funktion, um den gesamten Code in einer einzigen, eigenständigen HTML-Datei (inklusive CSS und JavaScript im <script>-Tag) auszugeben. Verwende KEINE externen Assets (Bilder/Sounds). Zeichne die gesamte Grafik flüssig und performant über das HTML5 Canvas-API.

Hier sind die genauen Spielmechaniken und das Design:

1. Visueller Stil & UI:

- Grafik: 2D-Cartoon-Stil, handgezeichneter Look (per Canvas-Befehlen umgesetzt).

- Steuerung: Optimiert für Mobile (Touch links/rechts auf dem Bildschirm) und PC (Pfeiltasten oder A/D).

- UI: Punktestand (Höhe), Highscore und eine Anzeige für aktive Power-ups oben am Rand. Ein "Game Over"-Screen mit Restart-Button.

2. Spielfigur (Spieler):

- Ein gezeichneter Mann mit Afro-Frisur.

- Ein brennender Joint im Mund (mit kleinen, animierten Rauchpartikeln).

- Die Figur springt automatisch nach oben, wenn sie auf Plattformen landet.

3. Plattformen & Biome:

- Endlos generierte Plattformen nach oben hin.

- Hintergrund: Blauer Himmel mit gezeichneten Vögeln und Häuser-Silhouetten im Hintergrund.

- Biome: Je höher der Spieler kommt, desto mehr verändert sich die Hintergrundfarbe und die Elemente (z. B. Stadt -> Wolken -> Weltall / visuelle Effekte).

4. Collectibles (Sammelobjekte):

- Weed-Baggys (Tütchen): Ersetzen die klassischen Münzen und geben Extra-Punkte.

- Ganze Joints: Power-up für temporäre Unbesiegbarkeit (wie der Mario-Stern). Währenddessen blinkt der Spieler in Regenbogenfarben, fliegt automatisch ein Stück nach oben und zerstört Gegner bei Berührung.

5. Gegner & Hindernisse:

- Polizei: Streifenwagen oder Polizisten, die auf manchen Plattformen patrouillieren (hin und her fahren/laufen). 

- Kollision: Normale Berührung führt zum sofortigen Game Over, außer das Unbesiegbarkeits-Power-up ist aktiv.

6. Bosskämpfe:

- Alle X Meter (z. B. alle 2000 Punkte) taucht ein Bossgegner auf (z. B. ein riesiger Polizeihubschrauber).

- Der Bildschirm scrollt während des Bosskampfs nicht weiter nach oben, bis der Boss besiegt ist.

- Der Boss kann besiegt werden, indem man von unten gegen ihn springt, ein Power-up nutzt oder Projektile (z. B. Rauchringe) schießt, wenn man eine Taste drückt/tippt.

Bitte erstelle den Code so robust, dass er ohne Abstürze läuft, eine saubere Game-Loop (requestAnimationFrame) nutzt und sofort im Browser spielbar ist.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://afrojump-get-high.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ebac0fa3-7fff-4432-9cff-e5039fa681b5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
