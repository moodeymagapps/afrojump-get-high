/* Board + names v3 */
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
        if (typeof selectedSkin !== "undefined" && (selectedSkin === "james" || owned.indexOf(selectedSkin) < 0)) selectedSkin = "bob";
        try {
          localStorage.setItem(OK, JSON.stringify(owned));
          if (typeof selectedSkin !== "undefined") localStorage.setItem(SK, selectedSkin);
        } catch (e) {}
      }
    } catch (e) {}
  }
  stripJames();

  function isEmailName(s) {
    return !!(s && String(s).indexOf("@") >= 0);
  }
  function niceName() {
    try {
      var email = sbUser && sbUser.email;
      if (email && String(email).toLowerCase() === "wilkoppierre@gmail.com") return "Moodey";
      var p = sbProfile && sbProfile.display_name;
      var meta = sbUser && sbUser.user_metadata && sbUser.user_metadata.display_name;
      if (p && !isEmailName(p)) return String(p).slice(0, 20);
      if (meta && !isEmailName(meta)) return String(meta).slice(0, 20);
      if (p && !isEmailName(p)) return String(p).slice(0, 20);
    } catch (e) {}
    return "Spieler";
  }

  boardName = function () { return niceName(); };
  myDuelName = function () { return niceName(); };

  if (typeof refreshAccountUI === "function") {
    var _refresh = refreshAccountUI;
    refreshAccountUI = function () {
      try {
        if (sbUser) {
          sbProfile = sbProfile || {};
          sbProfile.display_name = niceName();
        }
      } catch (e) {}
      return _refresh.apply(this, arguments);
    };
  }

  if (typeof pushCloudSave === "function") {
    var _push = pushCloudSave;
    pushCloudSave = function (nameOverride) {
      var n = nameOverride;
      if (!n || isEmailName(n)) n = niceName();
      if (sbProfile) sbProfile.display_name = n;
      return _push.call(this, n);
    };
  }

  try {
    if (typeof lavaHeight === "undefined") window.lavaHeight = parseInt(localStorage.getItem("afro_lava_height") || "0", 10) || 0;
  } catch (e) { window.lavaHeight = 0; }

  function normRow(r) {
    r.best_height = r.best_height | 0;
    r.lava_best = r.lava_best | 0;
    r.lava_height = r.lava_height | 0;
    r.lava_time = (r.lava_time | 0) || (r.lava_best | 0);
    if (r.skin === "james") r.skin = "bob";
    if (isEmailName(r.display_name)) {
      if (String(r.display_name).toLowerCase().indexOf("wilkoppierre") >= 0) r.display_name = "Moodey";
    }
    return r;
  }

  if (typeof die === "function") {
    var _die = die;
    die = function () {
      try {
        if (typeof lavaMode !== "undefined" && lavaMode && typeof bestY !== "undefined" && bestY > lavaHeight) {
          lavaHeight = bestY | 0;
          try { localStorage.setItem("afro_lava_height", lavaHeight); } catch (e) {}
        }
      } catch (e) {}
      return _die.apply(this, arguments);
    };
  }

  submitScore = async function () {
    if (!sb || !sbUser) return;
    var payload = {
      user_id: sbUser.id,
      display_name: niceName(),
      best_height: highScore | 0,
      lava_best: lavaBest | 0,
      total_bags: totalBags | 0,
      skin: selectedSkin === "james" ? "bob" : selectedSkin,
      updated_at: new Date().toISOString()
    };
    try {
      await sb.from("leaderboard").upsert(payload, { onConflict: "user_id" });
    } catch (err) {}
  };

  renderBoard = function () {
    var lava = boardMode === "lava";
    var data = (boardData || []).map(normRow).slice().sort(function (a, b) {
      return lava
        ? ((b.lava_time | 0) - (a.lava_time | 0)) || ((b.lava_height | 0) - (a.lava_height | 0))
        : ((b.best_height | 0) - (a.best_height | 0));
    });
    if (lava) data = data.filter(function (r) { return (r.lava_time | 0) > 0 || (r.lava_height | 0) > 0 || (r.lava_best | 0) > 0; });
    boardListEl.innerHTML = "";
    boardEl.classList.toggle("lbLava", lava);
    var title = document.getElementById("lbTitle");
    if (title) title.textContent = lava ? "LAVA RANGLISTE" : "NORMAL RANGLISTE";
    var tn = document.getElementById("lbTabNormal");
    var tl = document.getElementById("lbTabLava");
    if (tn) tn.classList.toggle("on", !lava);
    if (tl) tl.classList.toggle("on", lava);
    if (!data.length) {
      boardMsgEl.textContent = lava ? "Noch keine Lava-Zeiten." : "Noch keine Einträge – sei der Erste!";
      return;
    }
    var myRank = 0;
    data.forEach(function (r, i) {
      var mine = sbUser && r.user_id === sbUser.id;
      if (mine) myRank = i + 1;
      var medal = i === 0 ? "1" : i === 1 ? "2" : i === 2 ? "3" : "#" + (i + 1);
      var row = document.createElement("div");
      row.className = "lbRow" + (mine ? " me" : "") + (i < 3 ? " top" + (i + 1) : "");
      var skinId = r.skin || "bob";
      var sk = SKINS.find(function (s) { return s.id === skinId; });
      var meters = lava ? (r.lava_height | 0) : (r.best_height | 0);
      var html = '<span class="rank">' + medal + "</span>" +
        '<span class="face" style="' + lbFaceStyle(skinId) + '"></span>' +
        '<span class="who">' + escHtml(r.display_name || "Spieler") +
        (sk ? ' <span style="opacity:.6"> · ' + escHtml(sk.name) + "</span>" : "") + "</span>";
      if (lava) {
        if (meters) html += '<span class="val">' + meters + "m</span>";
        html += '<span class="val">' + (r.lava_time | 0) + "s</span>";
      } else html += '<span class="val">' + meters + "m</span>";
      row.innerHTML = html;
      boardListEl.appendChild(row);
    });
    if (!sbUser) boardMsgEl.textContent = "Melde dich an, um in der Rangliste zu erscheinen.";
    else if (myRank) {
      boardMsgEl.textContent = lava
        ? "Dein Platz: #" + myRank + " · " + (lavaBest | 0) + "s"
        : "Dein Platz: #" + myRank + " · " + (highScore | 0) + "m";
    } else boardMsgEl.textContent = "Du bist noch nicht in den Top 50 – weiter springen!";
  };

  loadBoard = async function () {
    boardMsgEl.textContent = "Lade…";
    if (!sb) { boardMsgEl.textContent = "Rangliste offline nicht verfügbar."; return; }
    try { await submitScore(); } catch (e) {}
    var res = await sb.from("leaderboard")
      .select("user_id,display_name,best_height,lava_best,total_bags,skin")
      .order("best_height", { ascending: false })
      .limit(50);
    if (res.error) {
      boardMsgEl.textContent = "Fehler beim Laden der Rangliste.";
      return;
    }
    boardData = (res.data || []).map(normRow);
    renderBoard();
  };

  try { if (typeof refreshAccountUI === "function") refreshAccountUI(); } catch (e) {}
})();
