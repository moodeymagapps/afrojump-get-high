(function () {
  "use strict";
  if (window.__afroFxInit) return;
  window.__afroFxInit = true;

  // Overlay-Flieger AUS: game.html zeichnet die Flugzeuge selbst.
  var layer = document.getElementById("afroFxLayer");
  if (layer && layer.parentNode) layer.parentNode.removeChild(layer);

  // Blaue Vögel komplett raus. Nur Wolken / Blätter / Sterne bleiben.
  function stripBirds() {
    try {
      if (typeof skyProps === "undefined" || !Array.isArray(skyProps)) return;
      for (var i = skyProps.length - 1; i >= 0; i--) {
        var b = skyProps[i] && skyProps[i].base;
        if (b === "bird" || b === "birds") skyProps.splice(i, 1);
      }
    } catch (e) {}
  }
  stripBirds();
  setInterval(stripBirds, 250);
})();
