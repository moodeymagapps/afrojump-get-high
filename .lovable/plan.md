# Interaktive Gembo-Skin-Vorschau

## Ziel
Spieler können Gembo und MF GEMBO direkt im Shop in einer großen, interaktiven Spielvorschau ansehen. Die Vorschau verändert weder Besitz noch Ausrüstung.

## Umsetzung
- Auf den Shopkarten von **Gembo** und **MF GEMBO SET** eine Schaltfläche „VORSCHAU“ ergänzen.
- Eine bildschirmfüllende Vorschau über dem Shop öffnen, die auf Handy, Tablet und Desktop sauber passt.
- Den Charakter mit den echten Sprite-Frames auf einer kleinen Spielplattform darstellen.
- Umschaltbare Animationen anbieten: **Idle**, **Landung**, **Sprung**, **Fall** und **Schutz**.
- Animation wahlweise automatisch abspielen oder pausieren; einzelne Frames lassen sich vor- und zurückschalten.
- Zwischen **Gembo** und **MF GEMBO** wechseln.
- Bei MF GEMBO die Shotgun und die Chain sichtbar einblenden und separat ein-/ausblenden; bei Gembo bleibt die normale Skin-Vorschau ohne Set-Gegenstände.
- Vorschau über Schließen-Schaltfläche, Zurück-Taste und Tippen neben dem Fenster verlassen.
- Touch-Ziele, Textgrößen und Vorschaufläche für kleine und große Bildschirme anpassen.

## Technische Details
- Bestehende Skin-Sheets und Set-Bilder wiederverwenden; keine neuen Bilddateien erzeugen.
- Die Vorschau als eigene Shop-Ebene in `public/game.html` ergänzen und passend in `public/afro-shop.css` gestalten.
- Für die Figurenanzeige direkt die acht vorhandenen Frames des 4×2-Sheets verwenden, damit Shop und Spiel identisch aussehen.
- Bestehende Kauf-, Besitz- und Ausrüstungslogik unverändert lassen.
- Cache-Version aktualisieren und die Bedienung bei 390×710, Tablet- und Desktop-Größe im Browser prüfen.
