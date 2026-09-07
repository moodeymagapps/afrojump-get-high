/* Fettarsch69: Geschenk beim Einloggen -> Hase im Hauptmenue (unten links) */
(function () {
  var OWNED = "afroBunnyOwned";
  var GIFT = "afroBunnyGiftDone";
  var FRAMES = ["/bunny/front.png", "/bunny/hop.png", "/bunny/right.png", "/bunny/front.png", "/bunny/left.png", "/bunny/cuddle.png", "/bunny/sleep.png"];

  function ls(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function ids() {
    var parts = [];
    function add(v) { if (v) parts.push(String(v)); }
    try { if (typeof boardName === "function") add(boardName()); } catch (e) {}
    try { if (typeof sbProfile !== "undefined" && sbProfile) { add(sbProfile.display_name); add(sbProfile.name); add(sbProfile.email); } } catch (e) {}
    try { if (typeof sbUser !== "undefined" && sbUser) { add(sbUser.email); if (sbUser.user_metadata) { add(sbUser.user_metadata.email); add(sbUser.user_metadata.name); } } } catch (e) {}
    try { add(localStorage.getItem("playerName")); add(localStorage.getItem("boardName")); } catch (e) {}
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf("-auth-token") >= 0) {
          var m = String(localStorage.getItem(k) || "").match(/"email"\s*:\s*"([^"]+)"/);
          if (m) add(m[1]);
        }
      }
    } catch (e) {}
    try {
      var loc = (parent && parent.location) || location;
      add((loc.search || "") + " " + (loc.hash || ""));
    } catch (e) {}
    return parts.join(" ").toLowerCase();
  }
  function eligible() {
    var s = ids();
    return s.indexOf("fettarsch") >= 0 || s.indexOf("inagk@icloud.com") >= 0 || s.indexOf("dev=fettarsch") >= 0;
  }


  function menuOpen() {
    var m = document.getElementById("menu");
    if (!m) return false;
    var st = getComputedStyle(m);
    if (st.display === "none" || st.visibility === "hidden" || Number(st.opacity) === 0) return false;
    return true;
  }

  function css() {
    if (document.getElementById("bunnyCss")) return;
    var s = document.createElement("style");
    s.id = "bunnyCss";
    s.textContent =
      '#afroBunny{position:fixed;left:10px;bottom:calc(10px + env(safe-area-inset-bottom));width:92px;z-index:9998;cursor:pointer;image-rendering:pixelated;filter:drop-shadow(0 4px 6px rgba(0,0,0,.5));animation:bunnyBob 1.6s ease-in-out infinite;display:none}' +
      '@keyframes bunnyBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}' +
      '#afroBunnyLove{position:fixed;left:8px;bottom:calc(112px + env(safe-area-inset-bottom));z-index:9999;font-family:"Press Start 2P",monospace;font-size:11px;line-height:1.5;color:#ffd9ef;background:rgba(60,20,70,.92);border:3px solid #d98bd0;border-radius:8px;padding:8px 10px;text-shadow:2px 2px 0 #4a1050;opacity:0;transition:opacity .2s;pointer-events:none}' +
      '#afroBunnyLove.show{opacity:1;animation:bunnyPop .35s ease-out}' +
      '@keyframes bunnyPop{0%{transform:scale(.6) translateY(8px)}100%{transform:scale(1) translateY(0)}}' +
      '#afroGift{position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;flex-direction:column;background:rgba(6,4,14,.88)}' +
      '#afroGift img{width:min(62vw,260px);image-rendering:pixelated;filter:drop-shadow(0 0 24px rgba(255,180,40,.45))}' +
      '#afroGift .gTxt{font-family:"Press Start 2P",monospace;color:#ffe38a;font-size:12px;line-height:1.7;text-align:center;margin-top:14px;text-shadow:2px 2px 0 #5a2500;max-width:80vw}' +
      '#afroGift .gBtn{margin-top:16px;font-family:"Press Start 2P",monospace;font-size:11px;color:#12220f;background:#8fdc5a;border:3px solid #2f5d24;border-radius:8px;padding:10px 16px;cursor:pointer;display:none}';
    document.body.appendChild(s);
  }

  var bunny, love, loveT;
  function mountBunny() {
    css();
    if (!bunny) {
      bunny = document.createElement("img");
      bunny.id = "afroBunny";
      bunny.src = FRAMES[0];
      bunny.alt = "Hase";
      love = document.createElement("div");
      love.id = "afroBunnyLove";
      love.textContent = "HAB DICH LIEB \u2665";
      document.body.appendChild(bunny);
      document.body.appendChild(love);
      var i = 0;
      setInterval(function () {
        if (bunny.style.display === "none") return;
        i = (i + 1) % FRAMES.length;
        bunny.src = FRAMES[i];
      }, 900);
      bunny.addEventListener("click", function (e) {
        e.stopPropagation();
        bunny.src = "/bunny/cuddle.png";
        love.classList.add("show");
        clearTimeout(loveT);
        loveT = setTimeout(function () { love.classList.remove("show"); }, 2200);
      });
    }
    var on = menuOpen();
    bunny.style.display = on ? "block" : "none";
    if (!on) love.classList.remove("show");
  }

  function showGift() {
    css();
    if (document.getElementById("afroGift")) return;
    var box = document.createElement("div");
    box.id = "afroGift";
    box.innerHTML =
      '<img id="gImg" src="/gift/g1.png" alt="Geschenk">' +
      '<div class="gTxt" id="gTxt">EIN GESCHENK F\u00dcR DICH!<br>TIPPE ZUM \u00d6FFNEN</div>' +
      '<div class="gBtn" id="gBtn">\u2665 ANNEHMEN</div>';
    document.body.appendChild(box);
    box.style.display = "flex";
    var img = box.querySelector("#gImg"), txt = box.querySelector("#gTxt"), btn = box.querySelector("#gBtn");
    var opening = false;
    function open() {
      if (opening) return;
      opening = true;
      txt.innerHTML = "...";
      var f = 1;
      var t = setInterval(function () {
        f++;
        img.src = "/gift/g" + f + ".png";
        if (f >= 8) {
          clearInterval(t);
          txt.innerHTML = "DU HAST EINEN<br>KUSCHELHASEN BEKOMMEN!";
          btn.style.display = "block";
        }
      }, 260);
    }
    img.addEventListener("click", open);
    txt.addEventListener("click", open);
    btn.addEventListener("click", function () {
      set(OWNED, "1");
      set(GIFT, "1");
      box.remove();
      mountBunny();
    });
  }

  function tick() {
    if (!eligible()) return;
    if (ls(OWNED) === "1") { mountBunny(); return; }
    if (ls(GIFT) !== "1" && menuOpen()) showGift();
  }

  function boot() { setInterval(tick, 700); tick(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
