/* Afro Jump – Lava button above Vollbild */
(function () {
  const SRC = "/lava_btn.png";
  const CSS = "#menu #menuLava{width:100%;max-width:none;margin:10px 0 8px;padding:0;border:none;background:none!important;cursor:pointer;display:block;line-height:0;}#menu #menuLava img{width:100%;height:88px;object-fit:contain;object-position:center;display:block;image-rendering:pixelated;}";
  function ensureCss(){
    if(document.getElementById("lavaMenuCss")) return;
    const s=document.createElement("style");
    s.id="lavaMenuCss";
    s.textContent=CSS;
    document.head.appendChild(s);
  }
  function enhance(){
    ensureCss();
    const btn=document.getElementById("menuLava");
    if(!btn) return false;
    const img=btn.querySelector("img") || document.createElement("img");
    img.alt="LAVA";
    img.src=SRC;
    img.removeAttribute("onerror");
    btn.innerHTML="";
    btn.appendChild(img);
    const slot=document.querySelector("#menu .mUtil") || document.getElementById("menuFs");
    if(slot && slot.parentNode && btn.parentNode!==slot.parentNode){
      slot.parentNode.insertBefore(btn, slot);
    } else if(slot && slot.parentNode && btn.nextElementSibling!==slot){
      slot.parentNode.insertBefore(btn, slot);
    }
    btn.style.cssText="";
    return true;
  }
  function boot(){
    if(enhance()) return;
    let n=0;
    const t=setInterval(function(){ n++; if(enhance()||n>40) clearInterval(t); },100);
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
/* Split Normal vs Lava leaderboard data. lava_best stays as-is. */
(function () {
  try {
    if (typeof lavaHeight === "undefined") {
      window.lavaHeight = parseInt(localStorage.getItem("afro_lava_height") || "0", 10) || 0;
    } else if (!lavaHeight) {
      lavaHeight = parseInt(localStorage.getItem("afro_lava_height") || "0", 10) || 0;
    }
  } catch (_) {
    try { window.lavaHeight = 0; } catch (e) {}
  }

  function rememberLavaHeight() {
    try {
      if (typeof lavaMode !== "undefined" && lavaMode && typeof bestY !== "undefined") {
        if (bestY > lavaHeight) {
          lavaHeight = bestY | 0;
          try { localStorage.setItem("afro_lava_height", lavaHeight); } catch (_) {}
        }
      }
    } catch (_) {}
  }

  if (typeof die === "function") {
    const _die = die;
    die = function () {
      rememberLavaHeight();
      return _die.apply(this, arguments);
    };
  }

  submitScore = async function () {
    if (!sb || !sbUser) return;
    try {
      await sb.from("leaderboard").upsert({
        user_id: sbUser.id,
        display_name: boardName(),
        best_height: (String(boardName()).toLowerCase()==='moodey'||(highScore|0)>=1000000)?0:(highScore|0),
        lava_best: lavaBest | 0,
        lava_height: lavaHeight | 0,
        lava_time: lavaBest | 0,
        total_bags: totalBags | 0,
        skin: selectedSkin,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    } catch (err) {
      console.warn("leaderboard submit failed", err);
    }
  };

  renderBoard = function () {
    const lava = boardMode === "lava";
    const data = (boardData || []).slice().sort((a, b) => lava
      ? ((b.lava_height | 0) - (a.lava_height | 0)) || ((b.lava_time | 0) - (a.lava_time | 0))
      : ((b.best_height | 0) - (a.best_height | 0)));
    boardListEl.innerHTML = "";
    boardEl.classList.toggle("lbLava", lava);
    const title = document.getElementById("lbTitle");
    if (title) title.textContent = lava ? "🌋 LAVA RANGLISTE" : "🏆 NORMAL RANGLISTE";
    const tn = document.getElementById("lbTabNormal");
    const tl = document.getElementById("lbTabLava");
    if (tn) tn.classList.toggle("on", !lava);
    if (tl) tl.classList.toggle("on", lava);
    if (!data || !data.length) {
      boardMsgEl.textContent = "Noch keine Einträge – sei der Erste!";
      return;
    }
    let myRank = 0;
    data.forEach((r, i) => {
      const mine = sbUser && r.user_id === sbUser.id;
      if (mine) myRank = i + 1;
      const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "#" + (i + 1);
      const row = document.createElement("div");
      row.className = "lbRow" + (mine ? " me" : "") + (i < 3 ? " top" + (i + 1) : "");
      const sk = SKINS.find((s) => s.id === r.skin);
      const meters = lava ? (r.lava_height | 0) : (r.best_height | 0);
      row.innerHTML =
        '<span class="rank">' + medal + "</span>" +
        '<span class="face" style="' + lbFaceStyle(r.skin) + '"></span>' +
        '<span class="who">' + escHtml(r.display_name || "Spieler") +
        (sk ? ' <span style="opacity:.6">· ' + escHtml(sk.name) + "</span>" : "") +
        "</span>" +
        '<span class="val">' + meters + "m</span>" +
        (lava ? '<span class="val">🔥 ' + (r.lava_time | 0) + "s</span>" : "");
      boardListEl.appendChild(row);
    });
    if (!sbUser) boardMsgEl.textContent = "Melde dich an, um in der Rangliste zu erscheinen.";
    else if (myRank) {
      boardMsgEl.textContent = lava
        ? "Dein Platz: #" + myRank + " · " + lavaHeight + "m · 🔥 " + lavaBest + "s"
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
    let res = await sb.from("leaderboard")
      .select("user_id,display_name,best_height,lava_best,lava_height,lava_time,total_bags,skin")
      .order("best_height", { ascending: false })
      .limit(50);
    if (res.error) {
      res = await sb.from("leaderboard")
        .select("user_id,display_name,best_height,lava_best,total_bags,skin")
        .order("best_height", { ascending: false })
        .limit(50);
      if (res.data) {
        res.data.forEach((r) => {
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
})();
