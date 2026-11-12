/* Home page: four views behind a bottom dock (map, game, passport, search), all from catalog.json and game.json.
   Fair play (Mike, 2026-11-12): no streaks, no timers, no fake counters, no sounds; progress stays in this browser. */
(function () {
  var cat = null, game = null, L = "en", chipsOpen = false;
  var state = { view: "map", cat: "history", fmt: "all", country: null, q: "", game: "hub" };
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; }
  function fold(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ς/g, "σ"); }
  function title(v) { return (v.titles && v.titles[L]) || v.title; }
  function len(s) { if (!s) return ""; s = Math.round(s); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }
  function byId(id) { return cat.videos.filter(function (v) { return v.id === id; })[0]; }
  function live() { return cat.videos.filter(function (v) { return v.category === state.cat; }); }

  // ------------------------------------------------------------ views and dock
  function show(view) {
    state.view = ["map", "play", "passport", "search"].indexOf(view) >= 0 ? view : "map";
    ["map", "play", "passport", "search"].forEach(function (v) { $("view-" + v).hidden = v !== state.view; });
    document.querySelectorAll(".dock a").forEach(function (a) {
      var on = a.getAttribute("data-v") === state.view;
      a.classList.toggle("on", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    if (state.view === "play" && game) renderPlay();
    if (state.view === "passport") renderPassport();
    if (state.view === "search") renderGrid();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", function () { route(); });
  function route() {
    var h = location.hash.slice(1), view = h.split("/")[0];
    if (!$("sheet").hidden) closeSheet(true);
    var sub = h.split("/")[1] || "";
    if (view === "play") state.game = /^c=/.test(sub) ? "older" : (["older", "timeline", "where"].indexOf(sub) >= 0 ? sub : "hub");
    if (view === "play" && h.indexOf("/c=") > 0 && game) { newGame(h); }
    show(view);
  }

  // ------------------------------------------------------------ map board
  function countriesIn(list) {
    var c = {};
    list.forEach(function (v) { uniq(v.places.map(function (p) { return p.country; })).forEach(function (k) { c[k] = (c[k] || 0) + 1; }); });
    return c;
  }

  function renderMap() {
    var list = live(), countries = countriesIn(list), pass = OS.passport.get();
    document.querySelectorAll(".cat").forEach(function (b) {
      var on = b.getAttribute("data-cat") === state.cat;
      b.classList.toggle("on", on); b.setAttribute("aria-pressed", on);
    });
    document.querySelectorAll(".map [data-c]").forEach(function (el) {
      var k = el.getAttribute("data-c");
      el.classList.toggle("has", !!countries[k]);
      el.classList.toggle("sel", k === state.country);
      el.classList.toggle("visited", !!pass[k] && !!countries[k]);
      if (el.tagName === "path") {
        el.setAttribute("aria-label", OS.country(L, k) + ": " + (countries[k] || 0));
        var tt = el.querySelector("title"); if (tt) tt.textContent = OS.country(L, k) + " · " + (countries[k] || 0);
      }
    });
    var keys = Object.keys(countries);
    $("boardcount").textContent = OS.t(L, "board_count", { c: keys.length, n: list.length });
    $("boardcount").hidden = !list.length;
    // big buttons under the map (small European countries are too small to tap on a phone map); most stories first
    keys.sort(function (a, b) { return countries[b] - countries[a] || OS.country(L, a).localeCompare(OS.country(L, b), L); });
    var shown = chipsOpen || keys.length <= 9 ? keys : keys.slice(0, 8);   // the top 8, then "+9" opens the rest
    $("country").innerHTML = shown.map(function (k) {
      return '<button type="button" class="chip' + (k === state.country ? " sel" : "") + '" data-c="' + k + '">' +
        esc(OS.country(L, k)) + " <b>" + countries[k] + "</b></button>";
    }).join("") + (shown.length < keys.length ? '<button type="button" class="chip more" aria-expanded="false">+' + (keys.length - shown.length) + "</button>" : "");
    $("country").hidden = !keys.length;
    var total = Object.keys(countriesIn(cat.videos)).length, have = Object.keys(pass).length;
    $("passmini").textContent = OS.t(L, "passport_mini", { v: have, n: total });
  }

  function pick(k) {
    if (!k) return;
    if (OS.count) OS.count("country", k);
    state.country = k;
    renderMap();
    openCountry(k);
  }

  // ------------------------------------------------------------ the sheet (country stories, coming soon, player)
  var lastFocus = null, sheetKind = null;
  // "Next story" walks the list a story was opened from; a story opened from a country's list returns to that list
  var ctx = { list: [], country: null }, back = null, newestList = [], gridList = [];
  function pagesOf(list) { return list.filter(function (v) { return v.page; }).map(function (v) { return v.id; }); }
  function openSheet(titleText, sub, bodyHtml, kind) {
    if (!$("sheet").hidden) stopVideo();
    sheetKind = kind || null;
    lastFocus = lastFocus || document.activeElement;
    $("sheet-title").textContent = titleText;
    $("sheet-sub").textContent = sub || "";
    $("sheet-body").innerHTML = bodyHtml;
    $("sheet").className = "sheet " + (kind || "");
    $("sheet").hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { $("sheet").classList.add("open"); }); });
    document.body.classList.add("locked");
    setTimeout(function () { var x = $("sheet").querySelector(".x"); if (x) x.focus({ preventScroll: true }); }, 30);
  }
  function stopVideo() {
    if (current) { current.stop(); current = null; }
  }
  function closeSheet(all) {
    if (!all && sheetKind === "player" && back) { var k = back; back = null; openCountry(k); return; }
    back = null;
    stopVideo();
    $("sheet").classList.remove("open");
    document.body.classList.remove("locked");
    setTimeout(function () { $("sheet").hidden = true; $("sheet-body").innerHTML = ""; }, reduce ? 0 : 260);
    if (state.country) { state.country = null; renderMap(); }
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    lastFocus = null;
  }
  $("sheet").addEventListener("click", function (e) { if (e.target.closest("[data-close]")) closeSheet(); });
  document.addEventListener("keydown", function (e) {
    if ($("sheet").hidden) return;
    if (e.key === "Escape") closeSheet();
    if (e.key === "Tab") {      // keep the focus inside the open sheet
      var f = $("sheet").querySelectorAll("button, a[href], select, video, [tabindex]:not([tabindex='-1'])");
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  function card(v, big) {
    var ext = !v.page, href = v.page || v.youtube;
    var place = v.places.length ? uniq(v.places.map(function (p) { return p.name; })).slice(0, 2).join(" · ") : OS.t(L, "worldwide");
    var badge = v.page ? '<span class="badge cc" title="' + esc(v.subtitles.map(function (s) { return s.toUpperCase(); }).join(" ")) + '">' +
                           esc(OS.t(L, "subs_n", { n: v.subtitles.length })) + "</span>"
                       : '<span class="badge yt">' + esc(OS.t(L, "on_youtube")) + "</span>";
    var pass = OS.passport.get();
    var stamped = v.places.some(function (p) { var s = pass[p.country]; return s && s.stories.indexOf(v.id) >= 0; });
    return '<a class="card ' + v.format + (big ? " big" : "") + (ext ? " ext" : "") + '" href="' + esc(href) + '"' +
      (ext ? ' rel="noopener" target="_blank"' : ' data-play="' + v.id + '"') + ">" +
      '<span class="thumb">' + (v.thumb ? '<img loading="lazy" alt="" src="' + esc(v.thumb) + '">' : "") +
      (v.page ? '<span class="playbtn" aria-hidden="true"></span>' : "") +
      '<span class="len">' + len(v.seconds) + "</span>" + (stamped ? '<span class="mini-stamp" title="' + esc(OS.t(L, "stamped")) + '">✓</span>' : "") + "</span>" +
      '<span class="meta"><span class="place">' + esc(place) + "</span>" +
      '<span class="t">' + esc(title(v)) + "</span>" + badge + "</span></a>";
  }

  function openCountry(k) {
    var list = live().filter(function (v) { return v.places.some(function (p) { return p.country === k; }); });
    var here = list.filter(function (v) { return v.page; }), yt = list.filter(function (v) { return !v.page; });
    ctx = { list: pagesOf(here), country: k };
    var s = OS.passport.get()[k], signed = OS.cloud && OS.cloud.user();
    // stamps mean something only to signed-in players
    var sub = (list.length === 1 ? OS.t(L, "story_here") : OS.t(L, "stories_here", { n: list.length })) +
              (signed ? " · " + (s ? OS.t(L, "stamped") + " ✓" : OS.t(L, "not_yet")) : "");
    function rail(l) { return '<div class="rail">' + l.map(function (v) { return card(v, true); }).join("") + "</div>"; }
    var both = here.length && yt.length;
    openSheet(OS.country(L, k), sub,
      (here.length ? (both ? '<h3 class="railh">' + esc(OS.t(L, "watch_here")) + "</h3>" : "") + rail(here) : "") +
      (yt.length ? (both ? '<h3 class="railh">' + esc(OS.t(L, "on_youtube")) + "</h3>" : "") + rail(yt) : ""), "stories");
  }

  function openSoon(c) {
    openSheet(OS.t(L, "cat_" + c.id), c.channel,
      '<div class="soon"><p>' + esc(OS.t(L, "coming_soon", { channel: c.channel })) + "</p>" +
      '<p><a class="btn red" href="' + esc(c.youtube) + '" target="_blank" rel="noopener">' + esc(OS.t(L, "open_channel")) + "</a> " +
      '<a class="btn" href="' + esc(c.subscribe) + '" target="_blank" rel="noopener">' + esc(OS.t(L, "subscribe")) + "</a></p></div>", "soon");
  }

  // The answer (or any story) plays right here in YouTube's player, with our subtitle bar on top, then its quick question
  var current = null;
  function playStory(v) {   // from a game: "Next story" walks all stories that play here
    back = null; ctx = { list: pagesOf(live()), country: null };
    openPlayer(v);
  }
  function openPlayer(v) {
    var ids = ctx.list.length ? ctx.list : pagesOf(live()), i = ids.indexOf(v.id);
    var nextId = ids.length > 1 ? ids[(i + 1) % ids.length] : null;
    if (nextId === v.id) nextId = null;
    openSheet(title(v), uniq(v.places.map(function (p) { return p.name; })).join(" · "),
      '<div id="pplayer"></div><div id="pquiz" class="pquiz"></div>' +
      '<p class="sheet-links">' + (nextId ? '<button type="button" class="btn gold" id="pnext">' + esc(OS.t(L, "next_story")) + " →</button>" : "") +
      '<a class="btn" href="' + esc(v.page) + '">' + esc(OS.t(L, "read_story")) + "</a>" +
      '<a class="btn red" href="' + esc(v.youtube) + '" target="_blank" rel="noopener">' + esc(OS.t(L, "watch_on_youtube")) + "</a>" +
      '<a class="btn" href="' + esc(v.subscribe) + '" target="_blank" rel="noopener" data-ch="' + esc(v.channel_id || "") + '">' + esc(OS.t(L, "subscribe")) + "</a></p>", "player");
    if (OS.subscribeLinks) OS.subscribeLinks($("sheet-body"));
    if (nextId) $("pnext").onclick = function () { var n = byId(nextId); if (n) openPlayer(n); };
    current = OS.player($("pplayer"), { id: v.id, ytid: v.youtube_id, langs: v.subtitles, format: v.format, poster: v.thumb });
    OS.quiz($("pquiz"), v.id, v.places, v.youtube_id);
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-play]");
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var v = byId(a.getAttribute("data-play"));
    if (!v || !v.page) return;
    e.preventDefault();
    if (a.closest("#sheet-body")) { if (sheetKind === "stories") back = ctx.country; }
    else {
      back = null;
      ctx = { list: pagesOf(a.closest("#newest") ? newestList : a.closest("#grid") ? gridList : live()), country: null };
    }
    openPlayer(v);
  });
  document.addEventListener("os-stamp", function () { renderMap(); if (state.view === "passport") setTimeout(renderPassport, 1900); });

  // ------------------------------------------------------------ "Which is older?"
  var g = { order: [], i: 0, right: 0, played: 0, picked: false, timer: null, run: 0, friend: null };

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; }
    return a;
  }
  function played(name) {   // a 0-point mark for the "Game explorer" badge
    OS.progress.add(null, 0, function (p) { if (p.done["g:" + name] === undefined) p.done["g:" + name] = 0; });
  }

  // ------------------------------------------------------------ the game hub
  function renderPlay() {
    var locked = state.game !== "hub" && OS.cloud && !OS.cloud.user();
    ["hub", "older", "timeline", "where"].forEach(function (k) { $(k === "hub" ? "hub" : "g-" + k).hidden = locked || state.game !== k; });
    $("g-gate").hidden = !locked;
    if (locked) { OS.cloud.gate($("g-gate-box"), state.game); return; }
    if (state.game === "hub") {
      var keys = Object.keys(game.items);
      $("hp-older").innerHTML = game.rounds.slice(0, 1).map(function (r) {
        return '<img alt="" src="' + esc(game.items[r.a].img) + '"><img alt="" src="' + esc(game.items[r.b].img) + '">';
      }).join("");
      $("hp-timeline").innerHTML = keys.slice(2, 6).map(function (k) { return '<img alt="" src="' + esc(game.items[k].img) + '">'; }).join("");
    }
    if (state.game === "older") playRound();
    if (state.game === "timeline") { if (!tl.items.length) tlNew(); else tlRender(); }
    if (state.game === "where") { if (!wh.order.length) whNew(); else whRender(); }
  }

  // ------------------------------------------------------------ Timeline: four moments, oldest first
  var tl = { items: [], picked: [], checked: false };
  function tlNew() {
    var chosen = [];
    shuffle(Object.keys(game.items)).forEach(function (k) {
      if (chosen.length < 4 && chosen.every(function (c) { return Math.abs(game.items[c].sort - game.items[k].sort) >= 30; })) chosen.push(k);
    });
    tl = { items: chosen, picked: [], checked: false, n: 0 };
    played("timeline");
    if (OS.count) OS.count("timeline_start");
    $("tlres").textContent = ""; $("tlres").className = "verdict";
    tlRender();
  }
  function tlRender() {
    var right = tl.items.slice().sort(function (a, b) { return game.items[a].sort - game.items[b].sort; });
    $("tl").innerHTML = tl.items.map(function (k) {
      var it = game.items[k], pos = tl.picked.indexOf(k), cls = "tlcard";
      if (pos >= 0) cls += " placed";
      if (tl.checked) cls += right[pos] === k ? " good" : " bad";
      var badge = pos >= 0 ? '<span class="tlnum">' + (pos + 1) + "</span>" : "";
      var fix = tl.checked && right[pos] !== k ? '<span class="tlfix">→ ' + (right.indexOf(k) + 1) + "</span>" : "";
      return '<button type="button" class="' + cls + '" data-k="' + k + '"><span class="pimg"><img alt="" src="' + esc(it.img) + '">' +
        '<span class="when">' + (tl.checked ? esc(it.when[L] || it.when.en) : "") + "</span>" + badge + fix + "</span>" +
        '<span class="plabel">' + esc(it.label[L] || it.label.en) + "</span></button>";
    }).join("");
    $("tl").querySelectorAll(".tlcard").forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute("data-k"), pos = tl.picked.indexOf(k);
        if (tl.checked) { var v = byId(game.items[k].production); if (v && v.page) playStory(v); return; }
        if (pos >= 0) tl.picked = tl.picked.slice(0, pos); else tl.picked.push(k);
        tlRender();
      };
    });
    $("tlcheck").disabled = tl.picked.length < 4 || tl.checked;
    $("tlcred").innerHTML = OS.t(L, "picture") + ": " + tl.items.map(function (k) {
      var it = game.items[k];
      return esc(tl.checked ? it.credit : (it.author || it.credit)) + " (" + esc(it.licence || "") + ")";
    }).join(" · ");
  }
  function tlCheck() {
    var right = tl.items.slice().sort(function (a, b) { return game.items[a].sort - game.items[b].sort; });
    var n = tl.picked.filter(function (k, i) { return right[i] === k; }).length;
    tl.checked = true; tl.n = n;
    $("tlres").textContent = n === 4 ? OS.t(L, "tl_perfect") : OS.t(L, "tl_result", { r: n });
    $("tlres").className = "verdict " + (n === 4 ? "ok" : "no");
    if (n === 4) {
      if (OS.count) OS.count("timeline_perfect");
      OS.progress.add("t:" + tl.items.slice().sort().join("."), 10);
    }
    tlRender();
  }
  $("tlcheck").onclick = tlCheck;
  $("tlnew").onclick = tlNew;

  // ------------------------------------------------------------ Where did it happen? A story, three countries
  var wh = { order: [], i: 0, right: 0, played: 0, answered: false };
  function whNew() {
    var pool = cat.videos.filter(function (v) { return v.category === "history" && v.places.length && v.page; });
    if (pool.length < 5) pool = cat.videos.filter(function (v) { return v.places.length; });
    wh = { order: shuffle(pool).slice(0, 5), i: 0, right: 0, played: 0, answered: false, opts: null };
    played("where");
    if (OS.count) OS.count("where_start");
    whRender();
  }
  function whRender() {
    $("wact").hidden = true; $("wres").textContent = ""; $("wres").className = "verdict";
    $("wdots").innerHTML = wh.order.map(function (_, k) { return '<span class="' + (k < wh.i ? "done" : k === wh.i ? "now" : "") + '"></span>'; }).join("");
    $("wscore").textContent = wh.played ? OS.t(L, "score", { r: wh.right, n: wh.played }) : "";
    var v = wh.order[wh.i];
    if (!v) {
      $("wcard").innerHTML = '<p class="gq">' + esc(OS.t(L, "wh_done", { r: wh.right, n: wh.played })) + '</p><div class="gameover">' +
        '<button class="btn big gold" id="wagain" type="button">' + esc(OS.t(L, "wh_again")) + "</button></div>";
      $("wagain").onclick = whNew;
      return;
    }
    var own = uniq(v.places.map(function (p) { return p.country; }));
    if (!wh.opts) {
      var others = shuffle(Object.keys(countriesIn(cat.videos)).filter(function (c) { return own.indexOf(c) < 0; })).slice(0, 2);
      wh.opts = shuffle([own[0]].concat(others));
    }
    $("wcard").innerHTML = '<div class="wpic">' + (v.thumb ? '<img alt="" src="' + esc(v.thumb) + '">' : "") + "</div>" +
      '<p class="wtitle">' + esc(title(v)) + '</p><p class="gq">' + esc(OS.t(L, "wh_q")) + "</p>" +
      '<div class="qopts">' + wh.opts.map(function (c) { return '<button type="button" class="qopt" data-c="' + c + '">' + esc(OS.country(L, c)) + "</button>"; }).join("") + "</div>";
    $("wcard").querySelectorAll(".qopt").forEach(function (b) { b.onclick = function () { whAnswer(b.getAttribute("data-c")); }; });
    if (wh.answered) whShow(wh.answered);
  }
  function whShow(pick) {
    var v = wh.order[wh.i], own = uniq(v.places.map(function (p) { return p.country; }));
    $("wcard").querySelectorAll(".qopt").forEach(function (b) {
      var c = b.getAttribute("data-c"); b.disabled = true;
      if (own.indexOf(c) >= 0) b.classList.add("right"); else if (c === pick) b.classList.add("wrong");
    });
    var ok = own.indexOf(pick) >= 0;
    var where = uniq(v.places.map(function (p) { return p.name; })).join(" · ") + " (" + own.map(function (c) { return OS.country(L, c); }).join(", ") + ")";
    $("wres").textContent = OS.t(L, ok ? "right" : "wrong") + " " + OS.t(L, "wh_place", { p: where });
    $("wres").className = "verdict " + (ok ? "ok" : "no");
    $("wact").hidden = false;
    $("wwatch").onclick = function () { if (v.page) playStory(v); else window.open(v.youtube, "_blank", "noopener"); };
  }
  function whAnswer(pick) {
    if (wh.answered) return;
    var v = wh.order[wh.i], ok = v.places.some(function (p) { return p.country === pick; });
    wh.answered = pick; wh.played++; if (ok) wh.right++;
    if (OS.count) OS.count(ok ? "where_right" : "where_wrong");
    if (ok) setTimeout(function () { OS.progress.add("w:" + v.id, 5); }, 600);
    $("wscore").textContent = OS.t(L, "score", { r: wh.right, n: wh.played });
    whShow(pick);
  }
  $("wnext").onclick = function () { wh.i++; wh.answered = false; wh.opts = null; whRender(); };

  function newGame(fromLink) {
    played("older");
    if (OS.count) OS.count("game_start");
    var pool = game.rounds.slice();
    for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = pool[i]; pool[i] = pool[j]; pool[j] = x; }
    g.order = pool.slice(0, 5).map(function (r) { return Math.random() < 0.5 ? { a: r.a, b: r.b, r: r } : { a: r.b, b: r.a, r: r }; });
    g.friend = null;
    if (fromLink) {   // "#play/c=senet.pyramid,benz.wall/s=3": a friend's pairs and score
      var m = /c=([\w.,-]+)\/s=(\d+)/.exec(fromLink);
      if (m) {
        var want = m[1].split(",").map(function (x) { return x.split("."); });
        var order = want.map(function (ab) {
          var r = game.rounds.filter(function (r) { return (r.a === ab[0] && r.b === ab[1]) || (r.a === ab[1] && r.b === ab[0]); })[0];
          return r ? { a: ab[0], b: ab[1], r: r } : null;
        }).filter(Boolean);
        if (order.length) { g.order = order; g.friend = +m[2]; if (OS.count) OS.count("challenge_open"); }
      }
    }
    g.i = 0; g.right = 0; g.played = 0; g.picked = false; g.run = 0;
  }

  function challengeUrl() {
    var pairs = g.order.map(function (o) { return o.a + "." + o.b; }).join(",");
    return location.href.split("#")[0] + "#play/c=" + pairs + "/s=" + g.right;
  }
  function share() {
    var text = OS.gt(L, "challenge_text").replace("{r}", g.right).replace("{n}", g.order.length), url = challengeUrl();
    if (OS.count) OS.count("challenge_share");
    if (navigator.share) { navigator.share({ title: "Oldest Surviving", text: text, url: url }).catch(function () {}); return; }
    var done = function () { OS.toast(OS.gt(L, "copied")); };
    if (navigator.clipboard) navigator.clipboard.writeText(text + " " + url).then(done, function () { prompt("", url); });
    else prompt("", url);
  }

  function playRound() {
    if (!g.order.length) newGame();
    clearTimeout(g.timer);
    $("gactions").hidden = true;
    $("verdict").textContent = "";
    $("verdict").className = "verdict";
    $("gdots").innerHTML = g.order.map(function (_, k) { return '<span class="' + (k < g.i ? "done" : k === g.i ? "now" : "") + '"></span>'; }).join("");
    $("gscore").textContent = g.played ? OS.t(L, "score", { r: g.right, n: g.played }) : "";
    if (g.i >= g.order.length) {
      $("h-play").textContent = OS.t(L, "play_title");
      $("gq").textContent = g.friend != null ? OS.gt(L, "challenge_result").replace("{a}", g.right).replace("{b}", g.friend) : OS.t(L, "done");
      $("duel").innerHTML = '<div class="gameover"><button class="btn big gold" id="share" type="button">' + esc(OS.gt(L, "challenge")) + "</button>" +
        '<button class="btn big" id="again" type="button">' + esc(OS.t(L, "play_again")) + "</button></div>";
      $("share").onclick = share;
      $("again").onclick = function () { newGame(); playRound(); };
      $("gcredits").innerHTML = "";
      if (OS.count) OS.count("game_end");
      if (g.played && g.right === g.order.length) OS.progress.add(null, 0, function (p) { p.perfect = true; });
      return;
    }
    if (g.i === 0 && g.friend != null && !g.picked) {
      $("gscore").textContent = OS.gt(L, "challenge_intro").replace("{r}", g.friend).replace("{n}", g.order.length);
    }
    var round = g.order[g.i], first = round.r.question === "first";
    $("h-play").textContent = OS.t(L, first ? "play_first" : "play_title");
    $("gq").textContent = OS.t(L, "round", { i: g.i + 1, n: g.order.length }) + " · " + OS.t(L, first ? "play_hint_first" : "play_hint");
    g.picked = false;
    $("duel").innerHTML = [round.a, round.b].map(function (key, k) {
      var it = game.items[key];
      return '<button class="pick" type="button" data-k="' + key + '" style="--tilt:' + (k ? 1.2 : -1.2) + 'deg">' +
        '<span class="pimg"><img alt="" src="' + esc(it.img) + '"><span class="when"></span><span class="pstamp" aria-hidden="true"></span></span>' +
        '<span class="plabel">' + esc(it.label[L] || it.label.en) + "</span></button>";
    }).join('<span class="vs" aria-hidden="true">VS</span>');
    $("duel").querySelectorAll(".pick").forEach(function (b) { b.onclick = function () { answer(b.getAttribute("data-k")); }; });
    credits(round, false);
  }

  // Picture credits: before the tap only author and licence (file names can give the answer away), the full credit after
  function credits(round, full) {
    $("gcredits").innerHTML = OS.t(L, "picture") + ": " + [round.a, round.b].map(function (key) {
      var it = game.items[key], lic = it.licence_url ? '<a href="' + esc(it.licence_url) + '" rel="noopener license">' + esc(it.licence) + "</a>" : esc(it.licence || "");
      var who = full ? it.credit : (it.author || it.credit);
      return (full && it.url ? '<a href="' + esc(it.url) + '" rel="noopener">' + esc(who) + "</a>" : esc(who)) + " (" + lic + (full ? ", " + esc(it.changes || "") : "") + ")";
    }).join(" · ");
  }

  function answer(key) {
    if (g.picked) return;
    g.picked = true;
    var round = g.order[g.i], first = round.r.question === "first";
    var older = game.items[round.a].sort <= game.items[round.b].sort ? round.a : round.b;
    var ok = key === older;
    g.played++; if (ok) g.right++;
    g.run = ok ? g.run + 1 : 0;
    var run = g.run, pairKey = [round.a, round.b].sort().join(".");
    if (OS.count) OS.count(ok ? "pair_right" : "pair_wrong", pairKey);
    setTimeout(function () {   // after the reveal; points once per pair, the best run counts for "Sharp eye"
      OS.progress.add(ok ? "p:" + pairKey : null, 5, function (p) { p.bestRun = Math.max(p.bestRun || 0, run); });
    }, 700);
    $("duel").querySelectorAll(".pick").forEach(function (b) {
      var k = b.getAttribute("data-k"), it = game.items[k];
      b.classList.add("revealed", k === older ? "older" : "newer");
      if (k === key) b.classList.add("chosen");
      b.querySelector(".when").textContent = it.when[L] || it.when.en;
      b.querySelector(".pstamp").textContent = k === older ? OS.t(L, first ? "stamp_first" : "stamp_older") : "";
      b.setAttribute("aria-disabled", "true");
    });
    credits(round, true);
    var label = game.items[older].label[L] || game.items[older].label.en;
    $("verdict").textContent = OS.t(L, ok ? "right" : "wrong") + " " + OS.t(L, first ? "first_is" : "older_is", { x: label });
    $("verdict").className = "verdict " + (ok ? "ok" : "no");
    $("gscore").textContent = OS.t(L, "score", { r: g.right, n: g.played });
    var v = byId(round.r.answer || game.items[older].production);
    $("gactions").hidden = false;
    var w = $("gwatch");
    w.textContent = OS.t(L, v && v.page ? "watch_answer" : "watch_answer_yt");
    w.onclick = function () { if (v && v.page) playStory(v); else if (v) window.open(v.youtube, "_blank", "noopener"); };
    $("gnext").onclick = function () { g.i++; playRound(); };
    w.focus({ preventScroll: true });
    // the answer Short plays only when the player taps "Watch the answer" (never by itself: YouTube's rules)
  }

  // ------------------------------------------------------------ passport
  function renderProgress() {
    var p = OS.progress.get(), n = OS.progress.level(p.points), names = OS.gt(L, "levels");
    var lo = OS.LEVELS[n - 1], hi = OS.LEVELS[n];
    $("levelcard").innerHTML = '<span class="big-ln">' + n + '</span><span class="lt"><b>' + esc(OS.gt(L, "level") + " " + n + ": " + names[n - 1]) + "</b>" +
      '<span class="bar"><span style="width:' + (hi ? 100 * (p.points - lo) / (hi - lo) : 100) + '%"></span></span>' +
      "<small>" + esc(OS.gt(L, "points").replace("{p}", p.points) + " \u00b7 " + (hi ? OS.gt(L, "to_next").replace("{n}", hi - p.points) : OS.gt(L, "max_level"))) + "</small></span>";
    $("h-badges").textContent = OS.gt(L, "badges");
    $("badges").innerHTML = OS.BADGES.map(function (b) {
      var bt = OS.gt(L, "b_" + b), got = p.badges[b];
      return '<div class="badge-tile' + (got ? "" : " locked") + '"><span class="bi" aria-hidden="true">' + (got ? "\u2605" : "?") + "</span>" +
        "<span><b>" + esc(bt[0]) + "</b><small>" + esc(got ? bt[1] + " \u00b7 " + got : bt[1]) + "</small></span></div>";
    }).join("");
    $("h-unlocks").textContent = OS.gt(L, "unlocks");
    $("unlocks").innerHTML = OS.UNLOCKS.map(function (u) {
      var open = n >= u.level, on = open && !!p.prefs[u.id];
      return '<div class="unlock"><span><b>' + esc(OS.gt(L, "u_" + u.id)) + "</b><small>" + esc(OS.gt(L, "u_" + u.id + "_d") + " \u00b7 " +
        OS.gt(L, "at_level").replace("{l}", u.level)) + '</small></span><button class="switch" type="button" role="switch" data-u="' + u.id +
        '" aria-checked="' + on + '" aria-label="' + esc(OS.gt(L, "u_" + u.id)) + '"' + (open ? "" : " disabled") + "></button></div>";
    }).join("");
    $("unlocks").querySelectorAll(".switch").forEach(function (b) {
      b.onclick = function () {
        var q = OS.progress.get(); q.prefs[b.getAttribute("data-u")] = b.getAttribute("aria-checked") !== "true";
        OS.progress.save(q); OS.paintLevel(); renderProgress();
      };
    });
    $("fair").textContent = OS.gt(L, "fair");
  }

  function renderAccount() {
    var box = $("account");
    if (!box || !OS.cloud) return;
    var u = OS.cloud.user();
    if (u) {
      box.innerHTML = '<div class="acc on"><p><b>' + esc(OS.t(L, "acc_signed")) + "</b></p>" +
        '<p class="accbtns"><button type="button" class="btn" id="accout">' + esc(OS.t(L, "acc_signout")) + "</button>" +
        '<button type="button" class="linkbtn" id="accdel">' + esc(OS.t(L, "acc_delete")) + "</button></p></div>";
      $("accout").onclick = function () { OS.cloud.signOut(); };
      $("accdel").onclick = function () { if (confirm(OS.t(L, "acc_delete_confirm"))) OS.cloud.deleteAccount(); };
    } else {
      box.innerHTML = '<div class="acc"><p><b>' + esc(OS.t(L, "acc_title")) + "</b><br>" + esc(OS.t(L, "acc_text")) + "</p>" +
        OS.cloud.signInHtml(L) + '<p class="small"><a href="privacy.html">' + esc(OS.t(L, "acc_age")) + "</a></p></div>";
      var b = box.querySelector(".gbtn"); if (b) b.onclick = function () { OS.cloud.signIn(); };
    }
  }
  if (OS.cloud) OS.cloud.onChange(function () {
    renderAccount(); renderMap(); renderNewest();
    if (state.view === "passport") renderPassport();
    if (state.view === "play" && game) renderPlay();
  });

  function renderPassport() {
    renderProgress();
    renderAccount();
    var all = countriesIn(cat.videos), pass = OS.passport.get();
    var keys = Object.keys(all).sort(function (a, b) {
      return (pass[b] ? 1 : 0) - (pass[a] ? 1 : 0) || OS.country(L, a).localeCompare(OS.country(L, b), L);
    });
    var have = keys.filter(function (k) { return pass[k]; }).length;
    $("passcount").textContent = OS.t(L, "passport_count", { v: have, n: keys.length });
    $("passbar").style.width = (keys.length ? 100 * have / keys.length : 0) + "%";
    var hues = [8, 28, 200, 152, 280, 340, 45, 220];
    $("stamps").innerHTML = keys.map(function (k, i) {
      var s = pass[k], name = esc(OS.country(L, k));
      if (!s) return '<button type="button" class="stamp empty" data-c="' + k + '"><span class="sname">' + name + '</span><span class="snum">' + all[k] + "</span></button>";
      return '<button type="button" class="stamp" data-c="' + k + '" style="--h:' + hues[i % hues.length] + ";--r:" + ((i * 37) % 15 - 7) + 'deg">' +
        '<span class="sname">' + name + '</span><span class="sdate">' + esc(s.first) + "</span></button>";
    }).join("");
    $("stamps").querySelectorAll(".stamp").forEach(function (b) {
      b.onclick = function () { state.cat = "history"; openCountry(b.getAttribute("data-c")); };
    });
  }
  $("passclear").onclick = function () {
    if (confirm(OS.t(L, "passport_confirm"))) { OS.passport.clear(); OS.progress.clear(); OS.paintLevel(); renderPassport(); renderMap(); }
  };

  // ------------------------------------------------------------ search
  function matches(v) {
    if (v.category !== state.cat) return false;
    if (state.fmt !== "all" && v.format !== state.fmt) return false;
    if (state.q) {
      var hay = fold([v.title, v.summary].concat(Object.values(v.titles || {}), Object.values(v.summaries || {}))
        .concat(v.places.map(function (p) { return p.name + " " + OS.country(L, p.country) + " " + OS.country("en", p.country); })).join(" "));
      return fold(state.q).split(/\s+/).every(function (w) { return hay.indexOf(w) >= 0; });
    }
    return true;
  }
  function renderGrid() {
    var c = cat.categories.filter(function (x) { return x.id === state.cat; })[0];
    document.querySelectorAll(".seg button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-f") === state.fmt); });
    if (!c.live) { $("count").textContent = ""; $("grid").innerHTML = ""; return; }
    var list = cat.videos.filter(matches);
    list.sort(function (a, b) { return (b.page ? 1 : 0) - (a.page ? 1 : 0); });
    gridList = list;
    $("count").textContent = list.length === 1 ? OS.t(L, "n_story") : OS.t(L, "n_stories", { n: list.length });
    $("grid").innerHTML = list.length ? list.map(function (v) { return card(v); }).join("") : '<p class="empty">' + esc(OS.t(L, "no_results")) + "</p>";
  }

  // ------------------------------------------------------------ wiring
  // a channel that is not on the site yet only opens its panel: the map and the stories stay as they were
  document.querySelectorAll(".cat").forEach(function (b) {
    b.onclick = function () {
      var id = b.getAttribute("data-cat"), c = cat.categories.filter(function (x) { return x.id === id; })[0];
      if (OS.count) OS.count("cat", id);
      if (!c.live) { openSoon(c); return; }
      state.cat = id; state.country = null; renderMap(); renderGrid(); renderNewest();
    };
  });
  document.querySelectorAll(".seg button").forEach(function (b) { b.onclick = function () { state.fmt = b.getAttribute("data-f"); renderGrid(); }; });
  document.querySelectorAll(".map path[data-c]").forEach(function (el) {
    el.addEventListener("click", function () { if (el.classList.contains("has")) pick(el.getAttribute("data-c")); });
    el.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && el.classList.contains("has")) { e.preventDefault(); pick(el.getAttribute("data-c")); } });
  });
  $("country").addEventListener("click", function (e) {
    var b = e.target.closest(".chip");
    if (!b) return;
    if (b.classList.contains("more")) { chipsOpen = true; renderMap(); var c = $("country").querySelectorAll(".chip")[8]; if (c) c.focus(); return; }
    pick(b.getAttribute("data-c"));
  });
  var searched = false;
  $("q").addEventListener("input", function () {
    state.q = $("q").value.trim(); renderGrid();
    if (!searched && state.q.length > 2) { searched = true; if (OS.count) OS.count("search"); }
  });

  function renderChannels() {
    $("chlist").innerHTML = cat.categories.map(function (c) {
      return '<div class="chrow"><span class="chname"><b>' + esc(c.channel) + "</b><small>" + esc(OS.t(L, "cat_" + c.id)) + "</small></span>" +
        '<a class="btn red" href="' + esc(c.subscribe) + '" target="_blank" rel="noopener" data-ch="' + esc(c.channel_id || "") + '">' + esc(OS.t(L, "subscribe")) + "</a></div>";
    }).join("");
    if (OS.subscribeLinks) OS.subscribeLinks($("chlist"));
  }

  // "Newest stories" under the map: stories that play here first, newest first (the page also carries them as
  // plain links for search engines, written by pipeline/web_site.py)
  function renderNewest() {
    if (!cat) return;
    var list = live();
    newestList = list.filter(function (v) { return v.page; }).concat(list.filter(function (v) { return !v.page; })).slice(0, 8);
    $("newest").innerHTML = newestList.map(function (v) { return card(v); }).join("");
  }

  function rerender() {
    if (cat && !$("chlist").querySelector(".ytsub")) renderChannels();
    document.title = OS.t(L, "site_title");
    $("q").setAttribute("aria-label", OS.t(L, "search"));
    renderMap(); renderGrid(); renderNewest();
    if (state.view === "passport") renderPassport();
    if (state.view === "play" && game) {
      if (state.game === "older" && !g.picked) playRound();
      else if (state.game === "timeline") tlRender();
      else if (state.game === "where") whRender();
      else renderPlay();
    }
    if (game) $("promopics").innerHTML = game.rounds.slice(0, 1).map(function (r) {
      return '<img alt="" src="' + esc(game.items[r.a].img) + '"><img alt="" src="' + esc(game.items[r.b].img) + '">';
    }).join("");
  }
  L = OS.boot(function (l) { L = l; rerender(); if (OS.count) OS.count("lang_switch", l); });
  if (OS.count) OS.count("page", "home");
  if (OS.count) OS.count("lang", L);
  Promise.all([
    fetch("catalog.json").then(function (r) { return r.json(); }),
    fetch("game.json").then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
  ]).then(function (res) {
    cat = res[0]; game = res[1];
    if (game && !game.rounds.length) game = null;
    if (!game) document.querySelectorAll('[href="#play"]').forEach(function (a) { a.hidden = true; });
    rerender();
    route();
    if (!reduce) document.body.classList.add("lit");
  }).catch(function () { $("boardcount").textContent = "Could not load the list of stories."; });
})();
