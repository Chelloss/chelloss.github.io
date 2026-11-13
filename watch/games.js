/* Three more games, themed on the 4 channels (Mike, 2026-11-13: "add other games like sudoku, like snake etc. but to
   have theme the channels and the findings and every 10 correct steps ... show them the video").
   - Story Snake: steer the snake to the right answer of a quick question from the chosen channel's stories.
   - Symbol Sudoku: a 4x4 sudoku with four symbols of the chosen channel.
   - Story Memory: find the pairs of story pictures.
   Every 10 correct steps open one of the channel's story videos in the site's player, ready to play: the visitor
   taps play themselves. Never autoplay or auto-click (YouTube counts only real plays; forcing them is fake
   engagement), and no points for watching. Points come only from the game moves, once per thing, so they cannot be
   farmed. Needs the home page (home.js exposes OS.home). */
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
  function count(k) { if (OS.count) OS.count(k); }
  var THEMES = ["history", "how", "money", "psychology"];
  var REWARD_EVERY = 10;
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

  // ------------------------------------------------------------ shared: theme chips, progress to the next video
  function themeChips(box, onPick) {
    box.innerHTML = '<span class="small" data-i="theme">' + esc(t("theme")) + "</span>" + THEMES.map(function (th) {
      return '<button type="button" class="chip' + (th === theme ? " sel" : "") + '" data-th="' + th + '" aria-pressed="' + (th === theme) + '">' +
        esc(t("cat_" + th)) + "</button>";
    }).join("");
    box.querySelectorAll("[data-th]").forEach(function (b) {
      b.onclick = function () { theme = b.getAttribute("data-th"); onPick(); };
    });
  }
  function progressLine(el, steps) {
    var n = steps % REWARD_EVERY;
    el.innerHTML = '<span class="gbar" aria-hidden="true"><span style="width:' + (100 * n / REWARD_EVERY) + '%"></span></span>' +
      '<span>' + esc(t("next_video", { n: n })) + "</span>";
  }
  // after every 10 correct steps: the story opens in the player sheet; the visitor taps play (never automatic)
  var shown = {};
  function reward(preferId) {
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
    OS.toast(t("rw_toast"));
    OS.home.playStory(v);
  }
  function sheetOpen() { var s = $("sheet"); return s && !s.hidden; }

  // ------------------------------------------------------------ Story Snake
  var snake = (function () {
    var N = 14, COLORS = ["#ffd60a", "#ff7a66", "#5ac8fa"], LETTERS = ["A", "B", "C"];
    var g = null, timer = null, pool = [], qs = {};

    function newQuestion() {
      if (!pool.length) pool = shuffle(Object.keys(qs));
      var id = pool.pop(), q = qs[id], l = L();
      var order = shuffle(q.options.en.map(function (_, i) { return i; }));
      g.q = { id: id, q: q, order: order };
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
        '<span>' + esc(t("your_score", { n: g.right })) + "</span>";
      progressLine($("snake-prog"), g.right);
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
    function start() {
      if (g.over) { reset(false); g.q = null; newQuestion(); status(); }
      if (!g.seen) {   // first start: the question, the board and the arrow buttons in view together (phones)
        g.seen = true;
        var w = $("snake-q");
        if (w && w.scrollIntoView) w.scrollIntoView({ block: "start" });
      }
      overlay(null); stop();
      timer = setInterval(step, 190);
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
        if (OS.count) OS.count("snake_right");
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
      if (ok && g.right % REWARD_EVERY === 0) { stop(); overlay(t("paused")); reward(id); }
    }
    function turn(dx, dy) {
      if (!g || g.over) return;
      if (!timer) start();
      if (g.queue.length < 3) g.queue.push([dx, dy]);
    }
    var keysOn = false;
    function keys() {
      if (keysOn) return;
      keysOn = true;
      document.addEventListener("keydown", function (e) {
        if (!g || $("g-snake").hidden || sheetOpen()) return;
        var m = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] }[e.key];
        if (m) { e.preventDefault(); turn(m[0], m[1]); }
        else if (e.key === " ") { e.preventDefault(); if (timer) pause(); else start(); }
      });
    }
    function show() {
      keys();
      var box = $("snake-box");
      themeChips($("snake-themes"), function () { g = null; show(); });
      questions().then(function (all) {
        qs = {};
        storiesOf(theme).forEach(function (v) { if (all[v.id]) qs[v.id] = all[v.id]; });
        if (!Object.keys(qs).length) { box.innerHTML = '<p class="empty">' + esc(t("no_results")) + "</p>"; return; }
        if (!g || !document.getElementById("snake-cv")) {
          box.innerHTML = '<p class="gq" id="snake-q"></p><ol class="sopts" id="snake-opts"></ol>' +
            '<div class="snakewrap"><canvas id="snake-cv" width="560" height="560" aria-label="' + esc(t("g_snake")) + '"></canvas>' +
            '<button type="button" class="snake-over" id="snake-over"></button></div>' +
            '<p class="sstat" id="snake-stat"></p><p class="verdict" id="snake-res" aria-live="polite"></p>' +
            '<div class="dpad">' + [["up", 0, -1, "▲"], ["left", -1, 0, "◀"], ["right", 1, 0, "▶"], ["down", 0, 1, "▼"]].map(function (b) {
              return '<button type="button" class="dp ' + b[0] + '" data-dx="' + b[1] + '" data-dy="' + b[2] + '" aria-label="' + esc(t("dir_" + b[0])) + '">' + b[3] + "</button>";
            }).join("") + "</div>";
          g = {}; pool = []; g.q = null;
          reset(false); newQuestion(); status(); draw();
          overlay(t("tap_start"));
          count("snake_start");
          $("snake-over").onclick = start;
          box.querySelectorAll(".dp").forEach(function (b) {
            b.onclick = function () { turn(+b.getAttribute("data-dx"), +b.getAttribute("data-dy")); };
          });
          var cv = $("snake-cv"), t0 = null;
          cv.addEventListener("touchstart", function (e) { var p = e.touches[0]; t0 = [p.clientX, p.clientY]; }, { passive: true });
          cv.addEventListener("touchend", function (e) {
            if (!t0) return;
            var p = e.changedTouches[0], dx = p.clientX - t0[0], dy = p.clientY - t0[1];
            t0 = null;
            if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) { if (!timer) start(); return; }
            if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? 1 : -1, 0); else turn(0, dy > 0 ? 1 : -1);
          });
        } else { newQuestion(); status(); draw(); if (!timer) overlay(g.over ? t("game_over") : t("paused")); }
      });
    }
    return { show: show, stop: function () { if (timer) pause(); } };
  })();

  // ------------------------------------------------------------ Symbol Sudoku (4x4)
  var SYM = {   // four simple symbols per channel (hand-drawn SVG paths, no image files)
    history: ["M7 3h10M7 21h10M8 3c0 6 8 6 8 9s-8 3-8 9M16 3c0 6-8 6-8 9s8 3 8 9",
              "M6 4h10a2 2 0 0 1 2 2v12a2 2 0 0 0 2 2H8a2 2 0 0 1-2-2zM9 9h6M9 13h6",
              "M4 18h16l-1.5-9-4.5 4-2-6-2 6-4.5-4z",
              "M9 3h6M10 3v3c-3 1-5 4-5 8 0 4 3 7 7 7s7-3 7-7c0-4-2-7-5-8V3"],
    how: ["M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2",
          "M13 2 5 14h6l-1 8 8-12h-6z",
          "M14.5 4.5a4 4 0 0 0-5 5L4 15l3 3 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2-.5-.5-2z",
          "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z"],
    money: ["M12 4c4 0 7 1.3 7 3s-3 3-7 3-7-1.3-7-3 3-3 7-3zM5 7v5c0 1.7 3 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3 3 7 3s7-1.3 7-3v-5",
            "M3 7h18v10H3zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM6 10v4M18 10v4",
            "M4 20h16M6 16l4-5 3 3 5-7M15 7h3v3",
            "M8 7c-2 2-3 4-3 7a7 7 0 0 0 14 0c0-3-1-5-3-7M8 7h8l-1.5-3h-5z"],
    psychology: ["M12 4c-3 0-5 2-5 4-2 .5-3 2-3 4s1 3.5 3 4c0 2 2 4 5 4M12 4c3 0 5 2 5 4 2 .5 3 2 3 4s-1 3.5-3 4c0 2-2 4-5 4M12 4v16",
                 "M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
                 "M4 9h4a2 2 0 1 1 4 0h4v4a2 2 0 1 0 0 4v3H4v-4a2 2 0 1 1 0-4z",
                 "M12 20s-8-4.5-8-10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 10-8 10z"]
  };
  function symSvg(th, i) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + SYM[th][i] + '" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  var sudoku = (function () {
    var s = null;
    function solutions(grid, limit) {   // count solutions (stops at limit)
      var i = grid.indexOf(-1);
      if (i < 0) return 1;
      var r = Math.floor(i / 4), c = i % 4, n = 0;
      for (var v = 0; v < 4 && n < limit; v++) {
        if (ok(grid, r, c, v)) { grid[i] = v; n += solutions(grid, limit - n); grid[i] = -1; }
      }
      return n;
    }
    function ok(grid, r, c, v) {
      for (var k = 0; k < 4; k++) if (grid[r * 4 + k] === v || grid[k * 4 + c] === v) return false;
      var br = r - r % 2, bc = c - c % 2;
      for (var a = 0; a < 2; a++) for (var b = 0; b < 2; b++) if (grid[(br + a) * 4 + bc + b] === v) return false;
      return true;
    }
    function make() {
      var base = [[0, 1, 2, 3], [2, 3, 0, 1], [1, 0, 3, 2], [3, 2, 1, 0]];
      var sym = shuffle([0, 1, 2, 3]);
      var bands = shuffle([0, 1]), rows = [], stacks = shuffle([0, 1]), cols = [];
      bands.forEach(function (b) { shuffle([0, 1]).forEach(function (r) { rows.push(b * 2 + r); }); });
      stacks.forEach(function (b) { shuffle([0, 1]).forEach(function (c) { cols.push(b * 2 + c); }); });
      var sol = [];
      rows.forEach(function (r) { cols.forEach(function (c) { sol.push(sym[base[r][c]]); }); });
      if (Math.random() < 0.5) { var tr = []; for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) tr.push(sol[c * 4 + r]); sol = tr; }
      var grid = sol.slice();
      shuffle([...Array(16).keys()]).forEach(function (i) {   // take cells away while the puzzle keeps one solution
        if (grid.filter(function (x) { return x < 0; }).length >= 9) return;
        var keep = grid[i]; grid[i] = -1;
        if (solutions(grid.slice(), 2) !== 1) grid[i] = keep;
      });
      return { sol: sol, grid: grid, given: grid.map(function (x) { return x >= 0; }), sel: -1 };
    }
    function render() {
      var box = $("sudoku-box"), th = theme;
      box.innerHTML = '<p class="gq" data-i="pick_cell">' + esc(t("pick_cell")) + "</p>" +
        '<div class="sgrid" role="grid">' + s.board.grid.map(function (v, i) {
          var cls = "scell" + (s.board.given[i] ? " given" : "") + (i === s.board.sel ? " sel" : "") +
            (i % 4 === 1 ? " br" : "") + (Math.floor(i / 4) === 1 ? " bb" : "");
          return '<button type="button" class="' + cls + '" data-i="' + i + '"' + (s.board.given[i] ? " disabled" : "") + ">" +
            (v >= 0 ? symSvg(th, v) : "") + "</button>";
        }).join("") + "</div>" +
        '<div class="spal">' + [0, 1, 2, 3].map(function (v) { return '<button type="button" class="ssym" data-v="' + v + '">' + symSvg(th, v) + "</button>"; }).join("") + "</div>" +
        '<p class="verdict" id="sudoku-res" aria-live="polite"></p>' +
        '<p class="gactions"><button type="button" class="btn big" id="sudoku-new">' + esc(t("new_board")) + "</button></p>";
      progressLine($("sudoku-prog"), s.right);
      box.querySelectorAll(".scell").forEach(function (b) {
        b.onclick = function () { s.board.sel = +b.getAttribute("data-i"); render(); };
      });
      box.querySelectorAll(".ssym").forEach(function (b) { b.onclick = function () { place(+b.getAttribute("data-v")); }; });
      $("sudoku-new").onclick = function () { s.board = make(); render(); };
    }
    function place(v) {
      var i = s.board.sel;
      if (i < 0 || s.board.given[i] || s.board.grid[i] >= 0) { $("sudoku-res").textContent = t("pick_cell"); return; }
      if (s.board.sol[i] !== v) {
        $("sudoku-res").className = "verdict no"; $("sudoku-res").textContent = t("q_wrong");
        var cell = document.querySelector('.scell[data-i="' + i + '"]'); if (cell) { cell.classList.add("shake"); }
        return;
      }
      s.board.grid[i] = v; s.board.sel = -1; s.right++;
      if (OS.count) OS.count("sudoku_right");
      var done = s.board.grid.every(function (x) { return x >= 0; });
      render();
      if (done) {
        var p = OS.progress.get(), solved = Object.keys(p.done).filter(function (k) { return k.indexOf("u:") === 0; }).length;
        if (solved < 20) OS.progress.add("u:" + (solved + 1), 5);
        count("sudoku_solved");
        $("sudoku-res").className = "verdict ok"; $("sudoku-res").textContent = t("solved");
      }
      if (s.right % REWARD_EVERY === 0) reward(null);
    }
    function show() {
      themeChips($("sudoku-themes"), function () { show(); });
      if (!s) { s = { right: 0, board: make() }; count("sudoku_start"); }
      render();
    }
    return { show: show, stop: function () {} };
  })();

  // ------------------------------------------------------------ Story Memory
  var memory = (function () {
    var m = null, lock = false;
    function deal() {
      var list = shuffle(storiesOf(theme).filter(function (v) { return v.thumb; })).slice(0, 6);
      if (list.length < 6) {   // too few stories with pages: fill with the channel's other stories
        var c = cat(), more = c ? shuffle(c.videos.filter(function (v) { return v.category === theme && v.thumb && list.indexOf(v) < 0; })) : [];
        list = list.concat(more).slice(0, 6);
      }
      m.cards = shuffle(list.concat(list).map(function (v) { return { v: v, open: false, done: false }; }));
      m.first = -1;
    }
    function render() {
      var box = $("memory-box");
      box.innerHTML = '<div class="mgrid">' + m.cards.map(function (c, i) {
        var face = c.open || c.done;
        return '<button type="button" class="mcard' + (face ? " open" : "") + (c.done ? " done" : "") + '" data-i="' + i + '"' +
          ' aria-label="' + esc(face ? (c.v.titles && c.v.titles[L()]) || c.v.title : t("g_memory")) + '"' + (c.done ? " disabled" : "") + ">" +
          (face ? '<img alt="" src="' + esc(c.v.thumb) + '">' : '<span class="mback" aria-hidden="true">?</span>') + "</button>";
      }).join("") + "</div>" + '<p class="verdict" id="memory-res" aria-live="polite">' + esc(m.msg || "") + "</p>" +
        '<p class="gactions"><button type="button" class="btn big" id="memory-new">' + esc(t("new_board")) + "</button></p>";
      progressLine($("memory-prog"), m.right);
      box.querySelectorAll(".mcard").forEach(function (b) { b.onclick = function () { flip(+b.getAttribute("data-i")); }; });
      $("memory-new").onclick = function () { deal(); m.msg = ""; render(); };
    }
    function flip(i) {
      var c = m.cards[i];
      if (lock || c.done || c.open) return;
      c.open = true;
      if (m.first < 0) { m.first = i; render(); return; }
      var a = m.cards[m.first];
      m.first = -1;
      if (a.v.id === c.v.id) {
        a.done = c.done = true; a.open = c.open = false; m.right++;
        if (OS.count) OS.count("memory_right");
        OS.progress.add("m:" + c.v.id, 2);
        m.msg = t("matched", { t: (c.v.titles && c.v.titles[L()]) || c.v.title });
        render();
        if (m.cards.every(function (x) { return x.done; })) { count("memory_solved"); m.msg = t("solved"); render(); }
        if (m.right % REWARD_EVERY === 0) reward(c.v.id);
        return;
      }
      render();
      lock = true;
      setTimeout(function () { a.open = c.open = false; lock = false; render(); }, 900);
    }
    function show() {
      themeChips($("memory-themes"), function () { deal(); m.msg = ""; show(); });
      if (!m) { m = { right: 0 }; deal(); count("memory_start"); }
      render();
    }
    return { show: show, stop: function () {} };
  })();

  OS.games = {
    snake: snake, sudoku: sudoku, memory: memory,
    open: function (name) {
      if (!theme) theme = OS.home ? OS.home.category() : "history";
      if (OS.games[name]) OS.games[name].show();
    },
    stop: function () { snake.stop(); }
  };
})();
