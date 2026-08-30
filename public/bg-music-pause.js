(function () {
  if (window.__afroMuteBg) return;
  window.__afroMuteBg = true;

  function allAudio() {
    return Array.from(document.querySelectorAll("audio"));
  }

  var wasPlaying = false;

  function pauseAll() {
    wasPlaying = allAudio().some(function (a) {
      return !a.paused && !a.ended;
    });
    allAudio().forEach(function (a) {
      try { a.pause(); } catch (e) {}
    });
    if (window.ac && window.ac.state === "running") window.ac.suspend();
  }

  function resumeAll() {
    if (!wasPlaying) return;
    allAudio().forEach(function (a) {
      a.play().catch(function () {});
    });
    if (window.ac && window.ac.state === "suspended") window.ac.resume();
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) pauseAll();
    else resumeAll();
  });
  window.addEventListener("pagehide", pauseAll);
})();
