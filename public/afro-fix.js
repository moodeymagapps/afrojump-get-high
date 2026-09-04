/* James raus + Ranglisten-Daten trennen. lava_best bleibt. */
(function () {
  function stripJames() {
    try {
      if (typeof SKINS !== "undefined") {
        for (var i = SKINS.length - 1; i >= 0; i--) {
          if (SKINS[i] && SKINS[i].id === "james") SKINS.splice(i, 1);
        }
      }
      if (typeof owned !== "undefined" && Array.isArray(owned)) {
        owned = owned.filter(function (id) { return id !== "james"; });
        if (owned.indexOf("bob") < 0) owned.push("bob");
        if (typeof selectedSkin !== "undefined" && (selectedSkin === "james" || owned.indexOf(selectedSkin) < 0)) {
          selectedSkin = "bob";
        }
        try {
          localStorage.setItem(OK, JSON.stringify(owned));
          if (typeof selectedSkin !== "undefined") localStorage.setItem(SK, selectedSkin);
        } catch (e) {}
      }
      if (typeof SKINS !== "undefined") {
        SKINS.forEach(function (s) { if (s.id === "bob") s.price = 0; });
      }
    } catch (e) {}
  }

  try {
    if (typeof lavaHeight === "undefined") {
      window.lavaHeight = parseInt(localStorage.getItem("afro_lava_height") || "0", 10) || 0;
    }
  } catch (e) { window.lavaHeight = 0; }

  stripJames();

  if (typeof die === "function") {
    var _die = die;
    die = function () {
      try {
        if (lavaMode && typeof bestY !== "undefined" && bestY > lavaHeight) {
          lavaHeight = bestY | 0;
          try { localStorage.setItem("afro_lava_height", lavaHeight); } catch (e) {}
        }
      } catch (e) {}
      return _die.apply(this, arguments);
    };
  }

  submitScore = async function () {
    if (!sb || !sbUser) return;
    try {
      await sb.from("leaderboard").upsert({
        user_id: sbUser.id,
        display_name: boardName(),
        best_height: (String(boardName()).toLowerCase() === "moodey" || (highScore | 0) >= 1000000) ? 0 : (highScore | 0),
        lava_best: lavaBest | 0,
        lava_height: lavaHeight | 0,
        lava_time: lavaBest | 0,
        total_bags: totalBags | 0,
        skin: selectedSkin === "james" ? "bob" : selectedSkin,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    } catch (err) {
      console.warn("leaderboard submit failed", err);
    }
  };

  renderBoard = function () {
    var lava = boardMode === "lava";
    var data = (boardData || []).slice().sort(function (a, b) {
      return lava
        ? ((b.lava_height | 0) - (a.lava_height | 0)) || ((b.lava_time | 0) - (a.lava_time | 0))
        : ((b.best_height | 0) - (a.best_height | 0));
    });
    boardListEl.innerHTML = "";
    boardEl.classList.toggle("lbLava", lava);
    var title = document.getElementById("lbTitle");
    if (title) title.textContent = lava ? "LAVA RANGLISTE" : "NORMAL RANGLISTE";
    var tn = document.getElementById("lbTabNormal");
    var tl = document.getElementById("lbTabLava");
    if (tn) tn.classList.toggle("on", !lava);
    if (tl) tl.classList.toggle("on", lava);
    if (!data || !data.length) {
      boardMsgEl.textContent = "Noch keine Einträge – sei der Erste!";
      return;
    }
    var myRank = 0;
    data.forEach(function (r, i) {
      var mine = sbUser && r.user_id === sbUser.id;
      if (mine) myRank = i + 1;
      var medal = i === 0 ? "1" : i === 1 ? "2" : i === 2 ? "3" : "#" + (i + 1);
      var row = document.createElement("div");
      row.className = "lbRow" + (mine ? " me" : "") + (i < 3 ? " top" + (i + 1) : "");
      var skinId = r.skin === "james" ? "bob" : r.skin;
      var sk = SKINS.find(function (s) { return s.id === skinId; });
      var meters = lava ? (r.lava_height | 0) : (r.best_height | 0);
      row.innerHTML =
        '<span class="rank">' + medal + "</span>" +
        '<span class="face" style="' + lbFaceStyle(skinId) + '"></span>' +
        '<span class="who">' + escHtml(r.display_name || "Spieler") +
        (sk ? ' <span style="opacity:.6"> · ' + escHtml(sk.name) + "</span>" : "") +
        "</span>" +
        '<span class="val">' + meters + "m</span>" +
        (lava ? '<span class="val"> ' + (r.lava_time | 0) + "s</span>" : "");
      boardListEl.appendChild(row);
    });
    if (!sbUser) boardMsgEl.textContent = "Melde dich an, um in der Rangliste zu erscheinen.";
    else if (myRank) {
      boardMsgEl.textContent = lava
        ? "Dein Platz: #" + myRank + " · " + lavaHeight + "m · " + lavaBest + "s"
        : "Dein Platz: #" + myRank + " · " + highScore + "m";
    } else boardMsgEl.textContent = "Du bist noch nicht in den Top 50 – weiter springen!";
  };

  loadBoard = async function () {
    boardMsgEl.textContent = "Lade…";
    if (!sb) {
      boardMsgEl.textContent = "Rangliste offline nicht verfügbar.";
      return;
    }
    await submitScore();
    var res = await sb.from("leaderboard")
      .select("user_id,display_name,best_height,lava_best,lava_height,lava_time,total_bags,skin")
      .order("best_height", { ascending: false })
      .limit(50);
    if (res.error) {
      res = await sb.from("leaderboard")
        .select("user_id,display_name,best_height,lava_best,total_bags,skin")
        .order("best_height", { ascending: false })
        .limit(50);
      if (res.data) {
        res.data.forEach(function (r) {
          r.lava_height = r.lava_height | 0;
          r.lava_time = r.lava_time | r.lava_best | 0;
        });
      }
    }
    if (res.error) {
      boardMsgEl.textContent = "Fehler beim Laden der Rangliste.";
      return;
    }
    boardData = res.data || [];
    renderBoard();
  };

  if (typeof renderShop === "function") {
    try { renderShop(); } catch (e) {}
  }
})();
