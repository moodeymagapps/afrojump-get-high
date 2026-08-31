(function () {
  "use strict";
  if (window.__afroFxInit) return;
  window.__afroFxInit = true;

  // Overlay-Flieger AUS: game.html zeichnet die Flugzeuge selbst.
  // Doppel-Spawn war der Grund für "kommen zu oft".
  var layer = document.getElementById("afroFxLayer");
  if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
})();
