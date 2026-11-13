/* Four games themed on the 4 channels (Mike, 2026-11-13: "add other games like sudoku, like snake etc. but to have
   theme the channels and the findings ... show them the video"; later the same day: levels, scores, read the
   question aloud, and every game should lead to a story video).
   - Story Snake: steer the snake to the right answer of a quick question from the chosen channel's stories. The
     question and its answers can be read aloud (the browser's own speech, free; the game waits while it reads).
     Every 5 right answers open a story video.
   - Symbol Sudoku: 4 levels (4x4 and 6x6 with the channel's symbols, 9x9 with digits for hard and very hard). A
     solved board opens a story video.
   - Story Memory: each board is one story's picture cut into tiles. Find the pairs, the picture comes together and
     its story opens. Score with streaks; every finished board goes up a level.
   - Hidden Traps: 4 levels. A story's picture hides under the board; clear it and that story opens (or watch it
     anyway after a trap).
   Videos open in the site's player (YouTube's own player, so a play is a real YouTube view), ready to play: the
   visitor taps play themselves. Never autoplay or auto-click (YouTube counts only real plays; forcing them is fake
   engagement), and no points for watching or liking. Points come only from game moves, once per thing, so they
   cannot be farmed. Needs the home page (home.js exposes OS.home). */
(function () {
  if (!window.OS) return;
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; }
  function L() { return OS.home ? OS.home.L() : "en"; }
  function t(k, v) { return OS.t(L(), k, v); }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; }
    return a;
  }
  function range(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }
  function count(k) { if (OS.count) OS.count(k); }
  function store(k, v) {   // this browser only (a level, a best score, the read-aloud switch); never required
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, String(v)); } catch (e) { /* private mode */ }
    return null;
  }
  var THEMES = ["history", "how", "money", "psychology"];
  var theme = null;   // the chosen channel; starts as the home page's category

  function cat() { return OS.home ? OS.home.cat() : null; }
  function storiesOf(th) {
    var c = cat();
    return c ? c.videos.filter(function (v) { return v.category === th && v.page; }) : [];
  }
  var qCache = null;
  function questions() {
    if (!qCache) qCache = fetch("questions.json").then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
    return qCache;
  }

  // ------------------------------------------------------------ shared: theme and level chips, progress bar, videos
  function themeChips(box, onPick) {
    box.innerHTML = '<span class="small">' + esc(t("theme")) + "</span>" + THEMES.map(function (th) {
      return '<button type="button" class="chip' + (th === theme ? " sel" : "") + '" data-th="' + th + '" aria-pressed="' + (th === theme) + '">' +
        esc(t("cat_" + th)) + "</button>";
    }).join("");
    box.querySelectorAll("[data-th]").forEach(function (b) {
      b.onclick = function () { theme = b.getAttribute("data-th"); onPick(); };
    });
  }
  var LV_KEYS = ["lvl_easy", "lvl_medium", "lvl_hard", "lvl_vhard"];
  function levelOf(game) { var v = +(store("os-lvl-" + game) || 0); return v >= 0 && v < LV_KEYS.length ? v : 0; }
  function levelChips(box, cur, onPick) {
    box.innerHTML = '<span class="small">' + esc(t("level")) + "</span>" + LV_KEYS.map(function (k, i) {
      return '<button type="button" class="chip' + (i === cur ? " sel" : "") + '" data-lv="' + i + '" aria-pressed="' + (i === cur) + '">' + esc(t(k)) + "</button>";
    }).join("");
    box.querySelectorAll("[data-lv]").forEach(function (b) { b.onclick = function () { onPick(+b.getAttribute("data-lv")); }; });
  }
  function bar(el, frac, text) {
    if (!el) return;
    el.innerHTML = '<span class="gbar" aria-hidden="true"><span style="width:' + Math.round(100 * Math.max(0, Math.min(1, frac))) + '%"></span></span>' +
      "<span>" + esc(text) + "</span>";
  }
  // a story opens in the player sheet; the visitor taps play (never automatic)
  var shown = {};
  function reward(preferId, toastKey) {
    var list = storiesOf(theme);
    if (!list.length || !OS.home) return;
    var v = list.filter(function (x) { return x.id === preferId; })[0];
    if (!v) {
      var fresh = list.filter(function (x) { return !shown[x.id]; });
      if (!fresh.length) { shown = {}; fresh = list; }
      v = fresh[Math.floor(Math.random() * fresh.length)];
    }
    shown[v.id] = 1;
    count("reward_video");
    OS.toast(t(toastKey || "rw_toast"));
    OS.home.playStory(v);
  }
  // a story with a picture for Memory and Hidden Traps (the tall Shorts pictures first)
  var pictured = {};
  function pictureStory() {
    var all = storiesOf(theme).filter(function (v) { return v.thumb; });
    var tall = all.filter(function (v) { return v.format === "short"; });
    var list = tall.length ? tall : all;
    if (!list.length) return null;
    var fresh = list.filter(function (v) { return !pictured[v.id]; });
    if (!fresh.length) { pictured = {}; fresh = list; }
    var v = fresh[Math.floor(Math.random() * fresh.length)];
    pictured[v.id] = 1;
    return v;
  }
  function picRatio(v) { return v && v.format === "short" ? 480 / 853 : 16 / 9; }   // thumbs are 480x853 or 480x270
  function storyTitle(v) { return (v.titles && v.titles[L()]) || v.title; }
  function sheetOpen() { var s = $("sheet"); return s && !s.hidden; }

  // ------------------------------------------------------------ reading aloud (the browser's speech; nothing is sent by us)
  var VOICE = { en: "en-US", es: "es-ES", el: "el-GR", de: "de-DE", fr: "fr-FR", pt: "pt-BR", it: "it-IT" };
  function canSpeak() { return "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function"; }
  function hush() { if (canSpeak()) window.speechSynthesis.cancel(); }
  function speak(text, done) {
    var fired = false;
    function fin() { if (!fired) { fired = true; if (done) done(); } }
    if (!canSpeak()) { fin(); return; }
    var synth = window.speechSynthesis, lang = VOICE[L()] || "en-US", u = new window.SpeechSynthesisUtterance(text);
    synth.cancel();
    u.lang = lang;
    u.rate = 0.95;
    var voices = synth.getVoices().filter(function (x) { return (x.lang || "").replace("_", "-").toLowerCase().indexOf(lang.slice(0, 2)) === 0; });
    if (voices.length) u.voice = voices.filter(function (x) { return x.lang.replace("_", "-") === lang; })[0] || voices[0];
    u.onend = fin;
    u.onerror = fin;
    synth.speak(u);
    setTimeout(fin, Math.min(40000, 2500 + text.length * 95));   // some browsers never say they finished
  }
  var SPEAKER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // ------------------------------------------------------------ Story Snake
  var snake = (function () {
    var N = 14, COLORS = ["#ffd60a", "#ff7a66", "#5ac8fa"], LETTERS = ["A", "B", "C"], SPEED = 210, EVERY = 5;
    var g = null, timer = null, pool = [], qs = {};

    function autoOn() { return canSpeak() && store("os-snake-voice") === "1"; }
    function qText() {
      var l = L(), q = g.q.q, opts = q.options[l] || q.options.en;
      return (q.q[l] || q.q.en) + " " + g.q.order.map(function (opt, k) { return LETTERS[k] + ": " + opts[opt] + "."; }).join(" ");
    }
    function newQuestion() {
      if (!pool.length) pool = shuffle(Object.keys(qs));
      var id = pool.pop(), q = qs[id], l = L();
      var order = shuffle(q.options.en.map(function (_, i) { return i; }));
      g.q = { id: id, q: q, order: order, heard: false };
      g.food = [];
      var free = [];
      for (var x = 0; x < N; x++) for (var y = 0; y < N; y++) {
        var nearHead = Math.abs(x - g.body[0][0]) + Math.abs(y - g.body[0][1]) < 3;
        if (!nearHead && !g.body.some(function (s) { return s[0] === x && s[1] === y; })) free.push([x, y]);
      }
      free = shuffle(free);
      order.forEach(function (opt, k) { g.food.push({ x: free[k][0], y: free[k][1], opt: opt, k: k }); });
      $("snake-q").textContent = q.q[l] || q.q.en;
      $("snake-opts").innerHTML = order.map(function (opt, k) {
        return '<li><span class="sl" style="background:' + COLORS[k] + '">' + LETTERS[k] + "</span>" + esc((q.options[l] || q.options.en)[opt]) + "</li>";
      }).join("");
    }
    function reset(keepScore) {
      var m = Math.floor(N / 2);
      g.body = [[m, m], [m - 1, m], [m - 2, m]];
      g.dir = [1, 0]; g.queue = [];
      if (!keepScore) { g.right = 0; g.lives = 3; g.over = false; }
      if (!g.q) newQuestion();
    }
    function hearts() { return "♥".repeat(Math.max(0, g.lives)) + '<span class="off">' + "♥".repeat(Math.max(0, 3 - g.lives)) + "</span>"; }
    function status() {
      $("snake-stat").innerHTML = '<span class="lives" aria-label="' + esc(t("lives")) + ": " + g.lives + '">' + hearts() + "</span>" +
        "<span>" + esc(t("your_score", { n: g.right })) + "</span>";
      bar($("snake-prog"), (g.right % EVERY) / EVERY, t("next_video5", { n: g.right % EVERY }));
    }
    function draw() {
      var cv = $("snake-cv"), ctx = cv.getContext("2d"), s = cv.width / N;
      ctx.fillStyle = "#1b2433"; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = "rgba(255,255,255,.035)";
      for (var x = 0; x < N; x++) for (var y = 0; y < N; y++) if ((x + y) % 2) ctx.fillRect(x * s, y * s, s, s);
      g.food.forEach(function (f) {
        ctx.fillStyle = COLORS[f.k];
        ctx.beginPath(); ctx.arc(f.x * s + s / 2, f.y * s + s / 2, s * 0.42, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#1d1b18"; ctx.font = "800 " + Math.round(s * 0.55) + "px system-ui, sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(LETTERS[f.k], f.x * s + s / 2, f.y * s + s / 2 + 1);
      });
      g.body.forEach(function (p, i) {
        ctx.fillStyle = i === 0 ? "#fff2b0" : "#e8b931";
        var pad = i === 0 ? 1 : 2;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(p[0] * s + pad, p[1] * s + pad, s - 2 * pad, s - 2 * pad, s * 0.3); else ctx.rect(p[0] * s + pad, p[1] * s + pad, s - 2 * pad, s - 2 * pad);
        ctx.fill();
      });
    }
    function overlay(text, sub) {
      var o = $("snake-over");
      o.hidden = !text;
      if (text) o.innerHTML = "<b>" + esc(text) + "</b>" + (sub ? "<span>" + esc(sub) + "</span>" : "");
    }
    function stop() { clearInterval(timer); timer = null; }
    function begin() { overlay(null); stop(); timer = setInterval(step, SPEED); }
    function start() {
      if (g.over) { reset(false); g.q = null; newQuestion(); status(); draw(); }
      if (!g.seen) {   // first start: the question, the board and the arrow buttons in view together (phones)
        g.seen = true;
        var w = $("snake-q");
        if (w && w.scrollIntoView) w.scrollIntoView({ block: "start" });
      }
      if (autoOn() && !g.q.heard) { listen(true); return; }
      begin();
    }
    // read the question and its 3 answers; the snake waits meanwhile, then goes on
    function listen(thenPlay) {
      if (!canSpeak() || !g || !g.q || g.over) return;
      g.q.heard = true; stop(); g.reading = true;
      overlay(t("reading"));
      count("snake_listen");
      speak(qText(), function () {
        if (!g.reading) return;
        g.reading = false;
        if (thenPlay) begin(); else overlay(t("tap_start"));
      });
    }
    function pause() { if (timer) { stop(); overlay(t("paused")); } }
    function lose() {
      g.lives--;
      status();
      if (g.lives <= 0) {
        g.over = true; stop();
        overlay(t("game_over"), t("your_score", { n: g.right }));
        count("snake_end");
        return true;
      }
      return false;
    }
    function step() {
      if (sheetOpen() || document.hidden) { pause(); return; }
      if (g.queue.length) {
        var d = g.queue.shift();
        if (d[0] !== -g.dir[0] || d[1] !== -g.dir[1]) g.dir = d;
      }
      var head = [g.body[0][0] + g.dir[0], g.body[0][1] + g.dir[1]];
      var hitWall = head[0] < 0 || head[1] < 0 || head[0] >= N || head[1] >= N;
      var hitSelf = g.body.some(function (p, i) { return i < g.body.length - 1 && p[0] === head[0] && p[1] === head[1]; });
      if (hitWall || hitSelf) {
        if (!lose()) { reset(true); overlay(t("paused")); stop(); }
        draw(); return;
      }
      g.body.unshift(head);
      var f = g.food.filter(function (f) { return f.x === head[0] && f.y === head[1]; })[0];
      if (!f) { g.body.pop(); draw(); return; }
      var ok = f.opt === g.q.q.answer, l = L(), id = g.q.id;
      var answer = (g.q.q.options[l] || g.q.q.options.en)[g.q.q.answer];
      if (ok) {
        g.right++;
        count("snake_right");
        OS.progress.add("s:" + id, 5);
        $("snake-res").className = "verdict ok";
        $("snake-res").textContent = t("right") + " " + (g.q.q.fact[l] || g.q.q.fact.en);
      } else {
        g.body.pop(); if (g.body.length > 3) g.body.pop();
        $("snake-res").className = "verdict no";
        $("snake-res").textContent = t("q_wrong") + " " + answer;
        if (lose()) { draw(); return; }
      }
      status();
      newQuestion();
      draw();
      if (ok && g.right % EVERY === 0) { stop(); overlay(t("paused")); reward(id, "rw_toast5"); return; }
      if (autoOn()) listen(true);
    }
    function turn(dx, dy) {
      if (!g || g.over) return;
      if (!timer && !g.reading) start();
      if (g.queue.length < 3) g.queue.push([dx, dy]);
    }
    function overTap() {
      if (g.reading) { hush(); g.reading = false; begin(); return; }
      start();
    }
    var keysOn = false;
    function keys() {
      if (keysOn) return;
      keysOn = true;
      document.addEventListener("keydown", function (e) {
        if (!g || $("g-snake").hidden || sheetOpen()) return;
        var m = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] }[e.key];
        if (m) { e.preventDefault(); turn(m[0], m[1]); }
        else if (e.key === " ") { e.preventDefault(); if (timer) pause(); else overTap(); }
      });
    }
    function show() {
      keys();
      var box = $("snake-box");
      themeChips($("snake-themes"), function () { g = null; hush(); show(); });
      questions().then(function (all) {
        qs = {};
        storiesOf(theme).forEach(function (v) { if (all[v.id]) qs[v.id] = all[v.id]; });
        if (!Object.keys(qs).length) { box.innerHTML = '<p class="empty">' + esc(t("no_results")) + "</p>"; return; }
        if (!g || !document.getElementById("snake-cv")) {
          var voice = canSpeak();
          box.innerHTML = '<div class="sq"><p class="gq" id="snake-q"></p>' +
            (voice ? '<button type="button" class="chip listen" id="snake-listen">' + SPEAKER + esc(t("listen")) + "</button>" : "") + "</div>" +
            '<ol class="sopts" id="snake-opts"></ol>' +
            '<div class="snakewrap"><canvas id="snake-cv" width="560" height="560" aria-label="' + esc(t("g_snake")) + '"></canvas>' +
            '<button type="button" class="snake-over" id="snake-over"></button></div>' +
            '<div class="dpad">' + [["up", 0, -1, "▲"], ["left", -1, 0, "◀"], ["right", 1, 0, "▶"], ["down", 0, 1, "▼"]].map(function (b) {
              return '<button type="button" class="dp ' + b[0] + '" data-dx="' + b[1] + '" data-dy="' + b[2] + '" aria-label="' + esc(t("dir_" + b[0])) + '">' + b[3] + "</button>";
            }).join("") + "</div>" +
            '<p class="small shint">' + esc(t("snake_hint")) + "</p>" +
            (voice ? '<p class="small autoread"><label><input type="checkbox" id="snake-auto"> ' + esc(t("auto_read")) + "</label></p>" : "") +
            '<p class="sstat" id="snake-stat"></p><p class="verdict" id="snake-res" aria-live="polite"></p>';
          g = {}; pool = []; g.q = null;
          reset(false); newQuestion(); status(); draw();
          overlay(t("tap_start"));
          count("snake_start");
          $("snake-over").onclick = overTap;
          if (voice) {
            $("snake-listen").onclick = function () { listen(!!timer); };
            $("snake-auto").checked = autoOn();
            $("snake-auto").onchange = function () { store("os-snake-voice", this.checked ? "1" : "0"); };
          }
          box.querySelectorAll(".dp").forEach(function (b) {
            b.onclick = function () { turn(+b.getAttribute("data-dx"), +b.getAttribute("data-dy")); };
          });
          var cv = $("snake-cv"), t0 = null;
          cv.addEventListener("touchstart", function (e) { var p = e.touches[0]; t0 = [p.clientX, p.clientY]; }, { passive: true });
          cv.addEventListener("touchend", function (e) {
            if (!t0) return;
            var p = e.changedTouches[0], dx = p.clientX - t0[0], dy = p.clientY - t0[1];
            t0 = null;
            if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) { if (!timer) overTap(); return; }
            if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? 1 : -1, 0); else turn(0, dy > 0 ? 1 : -1);
          });
        } else { newQuestion(); status(); draw(); if (!timer) overlay(g.over ? t("game_over") : t("paused")); }
      });
    }
    return { show: show, stop: function () { if (g && g.reading) { hush(); g.reading = false; overlay(t("paused")); } if (timer) pause(); } };
  })();

  // ------------------------------------------------------------ Symbol Sudoku (4x4, 6x6, 9x9)
  var SYM = {   // six simple symbols per channel (hand-drawn SVG paths, no image files)
    history: ["M7 3h10M7 21h10M8 3c0 6 8 6 8 9s-8 3-8 9M16 3c0 6-8 6-8 9s8 3 8 9",
              "M6 4h10a2 2 0 0 1 2 2v12a2 2 0 0 0 2 2H8a2 2 0 0 1-2-2zM9 9h6M9 13h6",
              "M4 18h16l-1.5-9-4.5 4-2-6-2 6-4.5-4z",
              "M9 3h6M10 3v3c-3 1-5 4-5 8 0 4 3 7 7 7s7-3 7-7c0-4-2-7-5-8V3",
              "M4 21h16M5 18h14M6 18V9M10 18V9M14 18V9M18 18V9M4 9h16L12 3z",
              "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"],
    how: ["M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2",
          "M13 2 5 14h6l-1 8 8-12h-6z",
          "M14.5 4.5a4 4 0 0 0-5 5L4 15l3 3 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2-.5-.5-2z",
          "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z",
          "M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
          "M6 3v9a6 6 0 0 0 12 0V3h-4v9a2 2 0 0 1-4 0V3zM6 7h4M14 7h4"],
    money: ["M12 4c4 0 7 1.3 7 3s-3 3-7 3-7-1.3-7-3 3-3 7-3zM5 7v5c0 1.7 3 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3 3 7 3s7-1.3 7-3v-5",
            "M3 7h18v10H3zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM6 10v4M18 10v4",
            "M4 20h16M6 16l4-5 3 3 5-7M15 7h3v3",
            "M8 7c-2 2-3 4-3 7a7 7 0 0 0 14 0c0-3-1-5-3-7M8 7h8l-1.5-3h-5z",
            "M3 6h18v12H3zM3 10h18M6 15h4",
            "M5 19L19 5M7.5 5.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM16.5 14.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"],
    psychology: ["M12 4c-3 0-5 2-5 4-2 .5-3 2-3 4s1 3.5 3 4c0 2 2 4 5 4M12 4c3 0 5 2 5 4 2 .5 3 2 3 4s-1 3.5-3 4c0 2-2 4-5 4M12 4v16",
                 "M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
                 "M4 9h4a2 2 0 1 1 4 0h4v4a2 2 0 1 0 0 4v3H4v-4a2 2 0 1 1 0-4z",
                 "M12 20s-8-4.5-8-10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 10-8 10z",
                 "M4 5h16v10H9l-5 4z",
                 "M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"]
  };
  function symSvg(th, i) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + SYM[th][i] + '" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  // levels: board size, box size (rows x cols), empty squares to aim for, symbols or digits, points for a solve
  var SD = [{ n: 4, br: 2, bc: 2, holes: 8, sym: true, pts: 5 }, { n: 6, br: 2, bc: 3, holes: 18, sym: true, pts: 8 },
            { n: 9, br: 3, bc: 3, holes: 45, sym: false, pts: 12 }, { n: 9, br: 3, bc: 3, holes: 54, sym: false, pts: 15 }];
  var sudoku = (function () {
    var s = null;
    function boxOf(cfg, r, c) { return Math.floor(r / cfg.br) * (cfg.n / cfg.bc) + Math.floor(c / cfg.bc); }
    // fills the grid with the first solution (random=true), or counts solutions up to limit (pass a copy)
    function solve(grid, cfg, limit, random) {
      var n = cfg.n, rows = [], cols = [], boxes = [], full = (1 << n) - 1, found = 0, i;
      for (i = 0; i < n; i++) { rows.push(0); cols.push(0); boxes.push(0); }
      for (i = 0; i < n * n; i++) if (grid[i] >= 0) {
        var r0 = (i / n) | 0, c0 = i % n, m0 = 1 << grid[i];
        rows[r0] |= m0; cols[c0] |= m0; boxes[boxOf(cfg, r0, c0)] |= m0;
      }
      function bits(m) { var k = 0; while (m) { m &= m - 1; k++; } return k; }
      function rec() {
        var best = -1, bm = 0, bn = 99;
        for (var k = 0; k < n * n; k++) if (grid[k] < 0) {   // the square with the fewest choices first
          var r = (k / n) | 0, c = k % n, m = full & ~(rows[r] | cols[c] | boxes[boxOf(cfg, r, c)]), cnt = bits(m);
          if (cnt < bn) { bn = cnt; best = k; bm = m; if (cnt < 2) break; }
        }
        if (best < 0) { found++; return found >= limit; }
        if (!bm) return false;
        var r1 = (best / n) | 0, c1 = best % n, b1 = boxOf(cfg, r1, c1), vals = [];
        for (var v = 0; v < n; v++) if (bm & (1 << v)) vals.push(v);
        if (random) vals = shuffle(vals);
        for (var j = 0; j < vals.length; j++) {
          var bit = 1 << vals[j];
          grid[best] = vals[j]; rows[r1] |= bit; cols[c1] |= bit; boxes[b1] |= bit;
          if (rec()) return true;
          grid[best] = -1; rows[r1] &= ~bit; cols[c1] &= ~bit; boxes[b1] &= ~bit;
        }
        return false;
      }
      rec();
      return found;
    }
    function make(level) {
      var cfg = SD[level], n = cfg.n, sol = range(n * n).map(function () { return -1; });
      solve(sol, cfg, 1, true);
      var grid = sol.slice(), holes = 0;
      shuffle(range(n * n)).forEach(function (i) {   // take squares away while the puzzle keeps exactly one solution
        if (holes >= cfg.holes) return;
        var keep = grid[i]; grid[i] = -1;
        if (solve(grid.slice(), cfg, 2, false) === 1) holes++; else grid[i] = keep;
      });
      return { level: level, cfg: cfg, sol: sol, grid: grid, given: grid.map(function (x) { return x >= 0; }), sel: -1, miss: 0, msg: "", cls: "verdict", done: false };
    }
    function face(v, cfg) { return v < 0 ? "" : cfg.sym ? symSvg(theme, v) : '<span class="dg">' + (v + 1) + "</span>"; }
    function render() {
      var box = $("sudoku-box"), b = s.board, cfg = b.cfg, n = cfg.n;
      var filled = b.grid.filter(function (x) { return x >= 0; }).length, selV = b.sel >= 0 ? b.grid[b.sel] : -1;
      bar($("sudoku-prog"), filled / (n * n), t("sd_goal"));
      box.innerHTML = '<div class="themes lvls" id="sudoku-lvls" role="group"></div>' +
        '<p class="gq">' + esc(t("pick_cell")) + "</p>" +
        '<div class="sgrid n' + n + '" role="grid" style="grid-template-columns:repeat(' + n + ',1fr)">' + b.grid.map(function (v, i) {
          var r = (i / n) | 0, c = i % n;
          var cls = "scell" + (b.given[i] ? " given" : "") + (i === b.sel ? " sel" : "") + (selV >= 0 && v === selV && i !== b.sel ? " same" : "") +
            (c % cfg.bc === cfg.bc - 1 && c < n - 1 ? " br" : "") + (r % cfg.br === cfg.br - 1 && r < n - 1 ? " bb" : "");
          return '<button type="button" class="' + cls + '" data-i="' + i + '"' + (b.given[i] || b.done ? " disabled" : "") + ">" + face(v, cfg) + "</button>";
        }).join("") + "</div>" +
        '<div class="spal n' + n + '">' + range(n).map(function (v) { return '<button type="button" class="ssym" data-v="' + v + '"' + (b.done ? " disabled" : "") + ">" + face(v, cfg) + "</button>"; }).join("") + "</div>" +
        '<p class="sstat"><span>' + esc(t("mistakes", { n: b.miss })) + "</span></p>" +
        '<p class="' + b.cls + '" id="sudoku-res" aria-live="polite">' + esc(b.msg ? t(b.msg) : "") + "</p>" +
        '<p class="gactions"><button type="button" class="btn big" id="sudoku-new">' + esc(t("new_board")) + "</button></p>";
      levelChips($("sudoku-lvls"), b.level, function (lv) { store("os-lvl-sudoku", lv); s.board = make(lv); count("sudoku_start"); render(); });
      box.querySelectorAll(".scell").forEach(function (el) {
        el.onclick = function () { s.board.sel = +el.getAttribute("data-i"); render(); };
      });
      box.querySelectorAll(".ssym").forEach(function (el) { el.onclick = function () { place(+el.getAttribute("data-v")); }; });
      $("sudoku-new").onclick = function () { s.board = make(s.board.level); render(); };
    }
    function place(v) {
      var b = s.board, i = b.sel;
      if (b.done) return;
      if (i < 0 || b.given[i] || b.grid[i] >= 0) { b.msg = "pick_cell"; b.cls = "verdict"; render(); return; }
      if (b.sol[i] !== v) {
        b.miss++; b.msg = "q_wrong"; b.cls = "verdict no";
        render();
        var cell = document.querySelector('.scell[data-i="' + i + '"]'); if (cell) cell.classList.add("shake");
        return;
      }
      b.grid[i] = v; b.msg = ""; b.cls = "verdict";
      count("sudoku_right");
      if (b.grid.every(function (x) { return x >= 0; })) {
        b.done = true; b.sel = -1; b.msg = "solved"; b.cls = "verdict ok";
        var p = OS.progress.get(), solved = Object.keys(p.done).filter(function (k) { return k.indexOf("u:") === 0; }).length;
        if (solved < 20) OS.progress.add("u:" + (solved + 1), b.cfg.pts);
        count("sudoku_solved");
        render();
        reward(null, "rw_solved");   // a solved board opens a story video (tap to play)
        return;
      }
      render();
    }
    function show() {
      themeChips($("sudoku-themes"), function () { show(); });
      if (!s) { s = { board: make(levelOf("sudoku")) }; count("sudoku_start"); }
      render();
    }
    return { show: show, stop: function () {} };
  })();

  // ------------------------------------------------------------ Story Memory (one story's picture in tiles)
  var memory = (function () {
    var GRIDS = [[2, 2], [2, 3], [2, 4], [3, 3], [3, 4]];   // picture tiles (columns x rows) for level 1, 2, 3...
    var m = null, lock = false;
    function best() { return +(store("os-mem-best") || 0); }
    function deal() {
      var gr = GRIDS[Math.min(m.level - 1, GRIDS.length - 1)];
      m.story = pictureStory();
      m.tc = gr[0]; m.tr = gr[1];
      var tiles = range(m.tc * m.tr);
      m.cards = shuffle(tiles.concat(tiles)).map(function (k) { return { k: k, open: false, done: false }; });
      m.first = -1; m.misses = 0; m.streak = 0; m.done = false; m.msg = ""; m.found = 0;
    }
    function tileStyle(k) {
      var x = k % m.tc, y = (k / m.tc) | 0;
      return "background-image:url('" + esc(m.story.thumb) + "');background-size:" + (m.tc * 100) + "% " + (m.tr * 100) + "%;background-position:" +
        (m.tc > 1 ? x / (m.tc - 1) * 100 : 0) + "% " + (m.tr > 1 ? y / (m.tr - 1) * 100 : 0) + "%";
    }
    function render() {
      var box = $("memory-box");
      if (!m.story) { box.innerHTML = '<p class="empty">' + esc(t("no_results")) + "</p>"; return; }
      var total = m.tc * m.tr, cols = m.cards.length > 16 ? 6 : 4, ar = picRatio(m.story) * m.tr / m.tc;
      bar($("memory-prog"), m.found / total, t("mem_goal"));
      var head = '<p class="mstat"><b>' + esc(t("lvl_n", { n: m.level })) + "</b><span>" + esc(t("score", { n: m.score })) + "</span><span>" +
        esc(t("best", { n: Math.max(best(), m.score) })) + "</span></p>";
      var body = m.done
        ? '<figure class="mpic"><img alt="" src="' + esc(m.story.thumb) + '"><figcaption>' + esc(t("mem_done", { t: storyTitle(m.story) })) + "</figcaption></figure>"
        : '<div class="mgrid" style="grid-template-columns:repeat(' + cols + ',1fr)">' + m.cards.map(function (c, i) {
            var face = c.open || c.done;
            return '<button type="button" class="mcard' + (face ? " open" : "") + (c.done ? " done" : "") + '" data-i="' + i + '" style="aspect-ratio:' + ar.toFixed(3) + '"' +
              ' aria-label="' + esc(face ? String(c.k + 1) : t("g_memory")) + '"' + (c.done ? " disabled" : "") + ">" +
              (face ? '<span class="tile" style="' + tileStyle(c.k) + '"></span>' : '<span class="mback" aria-hidden="true">?</span>') + "</button>";
          }).join("") + "</div>";
      box.innerHTML = head + body + '<p class="verdict' + (m.done ? " ok" : "") + '" id="memory-res" aria-live="polite">' + esc(m.msg || "") + "</p>" +
        '<p class="gactions">' + (m.done ? '<button type="button" class="btn big gold" id="memory-next">' + esc(t("next_level")) + "</button>" : "") +
        '<button type="button" class="btn big" id="memory-new">' + esc(t("new_game")) + "</button></p>";
      box.querySelectorAll(".mcard").forEach(function (b) { b.onclick = function () { flip(+b.getAttribute("data-i")); }; });
      if (m.done) $("memory-next").onclick = function () { m.level++; deal(); render(); };
      $("memory-new").onclick = function () { m.level = 1; m.score = 0; deal(); render(); };
    }
    function flip(i) {
      var c = m.cards[i];
      if (lock || m.done || c.done || c.open) return;
      c.open = true;
      if (m.first < 0) { m.first = i; render(); return; }
      var a = m.cards[m.first];
      m.first = -1;
      if (a.k === c.k) {
        a.done = c.done = true; a.open = c.open = false;
        m.streak++; m.found++;
        var gain = 10 * m.streak;
        m.score += gain;
        count("memory_right");
        m.msg = "+" + gain + (m.streak > 1 ? " · " + t("combo", { n: m.streak }) : "");
        if (m.found === m.tc * m.tr) finish(); else render();
        return;
      }
      m.streak = 0; m.misses++;
      render();
      lock = true;
      setTimeout(function () { a.open = c.open = false; lock = false; render(); }, 900);
    }
    function finish() {
      m.done = true;
      m.score += 20 * m.level + Math.max(0, 30 - 3 * m.misses);
      if (m.score > best()) store("os-mem-best", m.score);
      OS.progress.add("m:" + m.story.id, 2);
      count("memory_solved");
      m.msg = "";
      render();
      reward(m.story.id, "rw_picture");   // the picture's own story opens (tap to play)
    }
    function show() {
      themeChips($("memory-themes"), function () { if (m) { deal(); } show(); });
      if (!m) { m = { level: 1, score: 0 }; deal(); count("memory_start"); }
      render();
    }
    return { show: show, stop: function () {} };
  })();

  // ------------------------------------------------------------ Hidden Traps (a story picture under the board)
  var TRAP = {   // the hidden trap of each channel (hand-drawn SVG)
    history: "M12 3a7 7 0 0 0-7 7c0 2.5 1.2 4.3 3 5.3V19h8v-3.7c1.8-1 3-2.8 3-5.3a7 7 0 0 0-7-7zM9.5 10.5h.01M14.5 10.5h.01M11 19v2M13 19v2",
    how: "M13 2 5 14h6l-1 8 8-12h-6z",
    money: "M4 4v16h16M7 8l4 4 3-3 5 6M19 11v4h-4",
    psychology: "M12 12a1 1 0 1 1 1 1 2.5 2.5 0 0 1-3.5-2 4 4 0 0 1 4-4.5 5.5 5.5 0 0 1 5.5 5.5 7 7 0 0 1-7 7 8.5 8.5 0 0 1-8.5-8.5"
  };
  var FLAG = "M6 21V4M6 4h11l-2.5 4 2.5 4H6";
  function line(d, w) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '" fill="none" stroke="currentColor" stroke-width="' + (w || 2.2) +
      '" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  var TL = [{ w: 8, h: 8, n: 8, pts: 5 }, { w: 8, h: 10, n: 12, pts: 8 }, { w: 9, h: 12, n: 18, pts: 12 }, { w: 10, h: 13, n: 26, pts: 15 }];
  var traps = (function () {
    var s = null, hold = null, held = false;
    function cfg() { return TL[s.level]; }
    function around(i) {
      var W = cfg().w, H = cfg().h, x = i % W, y = Math.floor(i / W), out = [];
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
        var nx = x + dx, ny = y + dy;
        if ((dx || dy) && nx >= 0 && ny >= 0 && nx < W && ny < H) out.push(ny * W + nx);
      }
      return out;
    }
    function fresh(keepStory) {
      var c = cfg(), size = c.w * c.h;
      s.b = { trap: [], open: [], flag: [], n: [], laid: false, over: false, won: false, hit: -1 };
      for (var i = 0; i < size; i++) { s.b.trap.push(false); s.b.open.push(false); s.b.flag.push(false); s.b.n.push(0); }
      if (!keepStory || !s.story) s.story = pictureStory();
      s.msg = ""; s.cls = "verdict";
    }
    function lay(first) {   // traps go down after the first tap, never on it or next to it
      var b = s.b, c = cfg(), keep = around(first).concat([first]), spots = [];
      for (var i = 0; i < c.w * c.h; i++) if (keep.indexOf(i) < 0) spots.push(i);
      shuffle(spots).slice(0, c.n).forEach(function (k) { b.trap[k] = true; });
      for (var j = 0; j < c.w * c.h; j++) b.n[j] = around(j).filter(function (k) { return b.trap[k]; }).length;
      b.laid = true;
    }
    function openFrom(i) {   // opens the square, and the whole empty area around a 0
      var b = s.b, stack = [i], opened = 0;
      while (stack.length) {
        var k = stack.pop();
        if (b.open[k] || b.flag[k] || b.trap[k]) continue;
        b.open[k] = true; opened++;
        if (!b.n[k]) around(k).forEach(function (m) { if (!b.open[m]) stack.push(m); });
      }
      return opened;
    }
    function safeLeft() {
      var b = s.b, n = 0;
      for (var i = 0; i < b.open.length; i++) if (!b.trap[i] && !b.open[i]) n++;
      return n;
    }
    function tap(i, mark) {
      var b = s.b;
      if (b.over || b.won || b.open[i]) return;
      if (mark || s.mode === "mark") { b.flag[i] = !b.flag[i]; render(); return; }
      if (b.flag[i]) return;
      if (!b.laid) lay(i);
      if (b.trap[i]) {
        b.over = true; b.hit = i;
        s.cls = "verdict no"; s.msg = "trap_hit";
        count("traps_lost");
        render();
        return;
      }
      if (!openFrom(i)) return;
      count("traps_right");
      s.cls = "verdict"; s.msg = "";
      if (!safeLeft()) {
        b.won = true;
        var p = OS.progress.get(), won = Object.keys(p.done).filter(function (x) { return x.indexOf("h:") === 0; }).length;
        if (won < 20) OS.progress.add("h:" + (won + 1), cfg().pts);
        count("traps_won");
        s.cls = "verdict ok"; s.msg = "board_clear";
        render();
        if (s.story) reward(s.story.id, "rw_traps");   // the picture's own story opens (tap to play)
        return;
      }
      render();
    }
    function cell(i) {
      var b = s.b, cls = "tc", inner = "", label = "";
      if (b.won) cls += " open";
      else if (b.open[i]) {
        cls += " open" + (b.n[i] ? " n" + Math.min(b.n[i], 3) : "");
        inner = b.n[i] ? "<span>" + b.n[i] + "</span>" : ""; label = String(b.n[i]);
      } else if (b.trap[i] && b.over) {
        cls += " trap" + (i === b.hit ? " hit" : ""); inner = line(TRAP[theme]); label = t("g_traps");
      } else if (b.flag[i]) {
        cls += " flag"; inner = line(FLAG); label = t("mode_mark");
      }
      if (b.over && b.flag[i] && !b.trap[i]) cls += " wrong";
      return '<button type="button" class="' + cls + '" data-c="' + i + '" aria-label="' + esc(label || "?") + '"' +
        (b.open[i] || b.won ? " disabled" : "") + ">" + inner + "</button>";
    }
    function render() {
      var b = s.b, c = cfg(), box = $("traps-box");
      var flags = b.flag.filter(function (x) { return x; }).length, safe = c.w * c.h - c.n, opened = b.open.filter(function (x) { return x; }).length;
      bar($("traps-prog"), b.won ? 1 : opened / safe, t("tr_goal"));
      var cells = "";
      for (var i = 0; i < c.w * c.h; i++) cells += cell(i);
      var pic = s.story ? "background-image:url('" + esc(s.story.thumb) + "');" : "";
      box.innerHTML = '<div class="themes lvls" id="traps-lvls" role="group"></div>' +
        '<p class="gq">' + esc(t("traps_hint")) + "</p>" +
        '<div class="tmode" role="group">' + ["open", "mark"].map(function (md) {
          return '<button type="button" class="chip' + (s.mode === md ? " sel" : "") + '" data-m="' + md + '" aria-pressed="' + (s.mode === md) + '">' +
            (md === "mark" ? line(FLAG) : "") + esc(t("mode_" + md)) + "</button>";
        }).join("") + "</div>" +
        '<p class="sstat"><span class="tleft">' + line(TRAP[theme]) + esc(t("traps_left", { n: Math.max(0, c.n - flags) })) + "</span>" +
        "<span>" + esc(t("lvl_n", { n: s.level + 1 })) + "</span></p>" +
        '<div class="twrap"><div class="tgrid' + (b.won ? " won" : "") + '" style="grid-template-columns:repeat(' + c.w + ",1fr);" + pic + '">' + cells + "</div>" +
        (b.over ? '<div class="tover"><b>' + esc(t("game_over")) + "</b>" +
          (s.story ? '<button type="button" class="btn gold" id="traps-watch">' + esc(t("watch_anyway")) + "</button>" : "") +
          '<button type="button" class="btn" id="traps-again">' + esc(t("try_again")) + "</button></div>" : "") + "</div>" +
        '<p class="' + s.cls + '" id="traps-res" aria-live="polite">' + esc(s.msg ? t(s.msg) : "") +
        (b.won && s.story ? " " + esc(storyTitle(s.story)) : "") + "</p>" +
        '<p class="gactions"><button type="button" class="btn big' + (b.won ? " gold" : "") + '" id="traps-new">' + esc(t(b.won ? "next_level" : "new_board")) + "</button></p>";
      levelChips($("traps-lvls"), s.level, function (lv) { store("os-lvl-traps", lv); s.level = lv; fresh(false); render(); });
    }
    function wire(box) {   // one set of handlers on the box (the board is redrawn after every move)
      function cellOf(e) { var c = e.target.closest && e.target.closest(".tc"); return c ? +c.getAttribute("data-c") : -1; }
      box.onclick = function (e) {
        var md = e.target.closest("[data-m]");
        if (md) { s.mode = md.getAttribute("data-m"); render(); return; }
        if (e.target.closest("#traps-new")) {
          if (s.b.won && s.level < TL.length - 1) { s.level++; store("os-lvl-traps", s.level); }
          fresh(false); render(); return;
        }
        if (e.target.closest("#traps-again")) { fresh(true); render(); return; }
        if (e.target.closest("#traps-watch")) { if (s.story) reward(s.story.id, "rw_toast"); return; }
        var i = cellOf(e);
        if (i < 0) return;
        if (held) { held = false; return; }   // a long press already marked it
        tap(i, false);
      };
      box.oncontextmenu = function (e) { var i = cellOf(e); if (i >= 0) { e.preventDefault(); tap(i, true); } };
      box.ontouchstart = function (e) {   // press and hold = mark
        var i = cellOf(e);
        held = false; clearTimeout(hold);
        if (i >= 0) hold = setTimeout(function () { held = true; tap(i, true); if (navigator.vibrate) navigator.vibrate(15); }, 450);
      };
      box.ontouchend = box.ontouchmove = box.ontouchcancel = function () { clearTimeout(hold); };
    }
    function show() {
      themeChips($("traps-themes"), function () { if (s) fresh(false); show(); });
      if (!s) { s = { level: levelOf("traps"), mode: "open" }; fresh(false); count("traps_start"); }
      wire($("traps-box"));
      render();
    }
    return { show: show, stop: function () {} };
  })();

  OS.games = {
    snake: snake, sudoku: sudoku, memory: memory, traps: traps,
    open: function (name) {
      if (!theme) theme = OS.home ? OS.home.category() : "history";
      if (OS.games[name]) OS.games[name].show();
    },
    stop: function () { snake.stop(); }
  };
})();
