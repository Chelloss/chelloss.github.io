/* Mike's private admin page (watch/admin.html). Sign in with Google; the database rules let only the site owner's
   account read the totals (stats/{day}) and count the players. Everything is totals per day: no visitor is identified.
   Visits, countries, devices and where visitors came from are in Cloudflare Web Analytics (linked below). */
(function () {
  var SDK = "https://www.gstatic.com/firebasejs/10.12.2/";
  var $ = function (id) { return document.getElementById(id); };
  var fb = null, range = 30, days = [], catalog = null, game = null, counts = {};

  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; }
  function today() { return Math.floor(Date.now() / 86400000); }
  function label(d) { return new Date(d * 86400000).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }); }
  function num(n) { return (n || 0).toLocaleString("en-GB"); }
  function pct(a, b) { return b ? Math.round(100 * a / b) + "%" : "-"; }

  function gate(html) { $("gate").innerHTML = html; $("gate").hidden = false; $("dash").hidden = true; }

  function init() {
    fetch("firebase.json").then(function (r) { return r.json(); }).then(function (cfg) {
      return Promise.all([import(SDK + "firebase-app.js"), import(SDK + "firebase-auth.js"), import(SDK + "firebase-firestore.js")])
        .then(function (m) {
          var app = m[0].initializeApp(cfg);
          fb = { A: m[1], F: m[2], auth: m[1].getAuth(app), db: m[2].getFirestore(app) };
          fb.A.onAuthStateChanged(fb.auth, function (u) { if (u) load(); else signInGate(); });
        });
    }).catch(function () { gate("<p>Could not load. Check the internet connection and reload.</p>"); });
  }

  function signInGate() {
    gate('<p>This page is only for the site owner.</p><p><button type="button" class="btn big gbtn" id="in">' +
         '<span class="g" aria-hidden="true">G</span> Sign in with Google</button></p>');
    $("in").onclick = function () { fb.A.signInWithPopup(fb.auth, new fb.A.GoogleAuthProvider()).catch(function () {}); };
  }

  function load() {
    var F = fb.F, db = fb.db, t = today(), ids = [];
    for (var d = t - 29; d <= t; d++) ids.push(d);
    var players = F.collection(db, "players");
    var since = function (n) { return F.query(players, F.where("updated", ">=", F.Timestamp.fromMillis(Date.now() - n * 86400000))); };
    gate("<p>Loading...</p>");
    Promise.all([
      Promise.all(ids.map(function (d) { return F.getDoc(F.doc(db, "stats", String(d))).then(function (s) { return { d: d, x: s.exists() ? s.data() : {} }; }); })),
      F.getCountFromServer(players), F.getCountFromServer(since(1)), F.getCountFromServer(since(7)), F.getCountFromServer(since(30)),
      fetch("catalog.json").then(function (r) { return r.json(); }),
      fetch("game.json").then(function (r) { return r.ok ? r.json() : { items: {} }; })
    ]).then(function (r) {
      days = r[0];
      counts = { all: r[1].data().count, d1: r[2].data().count, d7: r[3].data().count, d30: r[4].data().count };
      catalog = r[5]; game = r[6];
      $("gate").hidden = true; $("dash").hidden = false;
      $("who").textContent = fb.auth.currentUser.email || "";
      render();
    }).catch(function (e) {
      gate("<p>This page is only for the site owner" + (e && e.code === "permission-denied" ? "" : " (" + esc(e && e.message) + ")") +
           '.</p><p><button type="button" class="btn" id="out">Sign out</button></p>');
      $("out").onclick = function () { fb.A.signOut(fb.auth); };
    });
  }

  // ------------------------------------------------------------ sums over the chosen range
  function inRange() { return days.slice(-range); }
  function total(name) { return inRange().reduce(function (s, x) { return s + ((x.x.total || {})[name] || 0); }, 0); }
  function group(name) {
    var out = {};
    inRange().forEach(function (x) { var g = x.x[name] || {}; for (var k in g) out[k] = (out[k] || 0) + g[k]; });
    return out;
  }
  function daily(name) { return inRange().map(function (x) { return { d: x.d, v: (x.x.total || {})[name] || 0 }; }); }

  // ------------------------------------------------------------ one single-series bar chart (one hue, no legend)
  function bars(title, series) {
    var W = 560, H = 150, pad = 26, n = series.length, max = Math.max(1, Math.max.apply(null, series.map(function (s) { return s.v; })));
    var bw = Math.max(2, (W - pad) / n - 2), out = "";
    series.forEach(function (s, i) {
      var h = Math.round((H - 34) * s.v / max), x = pad + i * (bw + 2), y = H - 20 - h;
      var r = Math.min(4, bw / 2, h);
      var d = h > 0 ? "M" + x + "," + (H - 20) + "V" + (y + r) + "Q" + x + "," + y + " " + (x + r) + "," + y + "H" + (x + bw - r) +
              "Q" + (x + bw) + "," + y + " " + (x + bw) + "," + (y + r) + "V" + (H - 20) + "Z" : "";
      out += '<g class="b" data-tip="' + esc(label(s.d) + ": " + num(s.v)) + '"><rect class="hit" x="' + (x - 1) + '" y="0" width="' + (bw + 2) +
             '" height="' + (H - 20) + '"></rect>' + (d ? '<path d="' + d + '"></path>' : "") + "</g>";
    });
    var first = series[0], last = series[n - 1];
    return '<figure class="chart"><figcaption><b>' + esc(title) + "</b> <span>" + num(series.reduce(function (s, x) { return s + x.v; }, 0)) +
      ' in total</span></figcaption><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(title) + '">' +
      '<line class="base" x1="' + pad + '" x2="' + W + '" y1="' + (H - 20) + '" y2="' + (H - 20) + '"></line>' +
      '<text class="ax" x="0" y="20">' + num(max) + '</text><text class="ax" x="0" y="' + (H - 22) + '">0</text>' + out +
      '<text class="ax" x="' + pad + '" y="' + (H - 4) + '">' + esc(label(first.d)) + '</text>' +
      '<text class="ax end" x="' + W + '" y="' + (H - 4) + '">' + esc(label(last.d)) + "</text></svg></figure>";
  }

  function table(title, head, rows, note) {
    if (!rows.length) return '<section class="tbl"><h2>' + esc(title) + '</h2><p class="small">Nothing yet in this period.</p></section>';
    return '<section class="tbl"><h2>' + esc(title) + "</h2>" + (note ? '<p class="small">' + esc(note) + "</p>" : "") +
      '<div class="scroll"><table><thead><tr>' + head.map(function (h, i) { return "<th" + (i ? ' class="n"' : "") + ">" + esc(h) + "</th>"; }).join("") +
      "</tr></thead><tbody>" + rows.map(function (r) {
        return "<tr>" + r.map(function (c, i) { return "<td" + (i ? ' class="n"' : "") + ">" + (i ? esc(c) : c) + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table></div></section>";
  }

  function tile(n, label, sub) { return '<div class="tile"><b>' + esc(n) + "</b><span>" + esc(label) + "</span>" + (sub ? "<small>" + esc(sub) + "</small>" : "") + "</div>"; }

  function render() {
    document.querySelectorAll("#range button").forEach(function (b) { b.classList.toggle("on", +b.getAttribute("data-r") === range); });
    var qr = total("quiz_right"), qw = total("quiz_wrong"), pr = total("pair_right"), pw = total("pair_wrong");
    $("tiles").innerHTML =
      tile(num(counts.all), "Accounts", "all time") +
      tile(num(counts.d7), "Active players", "signed in, last 7 days") +
      tile(num(counts.d30), "Active players", "signed in, last 30 days") +
      tile(num(total("page")), "Page views", "home + story pages") +
      tile(num(total("play")), "Video plays", "taps on play") +
      tile(num(qr + qw), "Questions answered", pct(qr, qr + qw) + " right") +
      tile(num(total("game_start")), "\"Which is older?\" games", num(total("game_end")) + " finished, " + pct(pr, pr + pw) + " pairs right") +
      tile(num(total("timeline_start")), "Timelines played", num(total("timeline_perfect")) + " in perfect order") +
      tile(num(total("where_right") + total("where_wrong")), "\"Where did it happen?\" answers", pct(total("where_right"), total("where_right") + total("where_wrong")) + " right") +
      tile(num(total("comment")), "\"Comment on YouTube\"", "clicks") +
      tile(num(total("signin")), "Sign-ins", num(total("signup")) + " new accounts") +
      tile(num(total("gate")), "\"Sign in to play\" shown", pct(total("signin"), total("gate")) + " then signed in") +
      tile(num(total("popup")), "Sign-in pop-up shown", pct(total("signin"), total("popup")) + " (all sign-ins per pop-up)") +
      tile(num(total("challenge_share")), "Challenges shared", num(total("challenge_open")) + " opened by friends") +
      tile(num(total("subscribe_tap")), "\"Subscribe\" taps", "loads YouTube's own button; real subscribers are in YouTube Studio") +
      // the newer games (2026-11-13, games.js): "opened" counts once per visit (Snake: once per new game)
      tile(num(total("snake_start")), "Story Snake games", num(total("snake_right")) + " right answers, " + num(total("snake_end")) + " games over, " + num(total("snake_listen")) + " read aloud") +
      tile(num(total("sudoku_start")), "Symbol Sudoku opened", num(total("sudoku_right")) + " right symbols, " + num(total("sudoku_solved")) + " boards solved") +
      tile(num(total("memory_start")), "Story Memory opened", num(total("memory_right")) + " pairs found, " + num(total("memory_solved")) + " boards finished") +
      tile(num(total("traps_start")), "Hidden Traps opened", num(total("traps_right")) + " safe moves, " + num(total("traps_won")) + " boards won, " + num(total("traps_lost")) + " lost") +
      tile(num(total("reward_video")), "Story videos from games", "opened after 10 right moves (the visitor still taps play)");

    $("charts").innerHTML = bars("Page views", daily("page")) + bars("Video plays", daily("play")) +
      bars("Questions answered", inRange().map(function (x) { var t = x.x.total || {}; return { d: x.d, v: (t.quiz_right || 0) + (t.quiz_wrong || 0) }; })) +
      bars("Games opened (all 7 games)", inRange().map(function (x) {
        var t = x.x.total || {};
        return { d: x.d, v: ["game_start", "timeline_start", "where_start", "snake_start", "sudoku_start", "memory_start", "traps_start"]
          .reduce(function (s, k) { return s + (t[k] || 0); }, 0) };
      }));

    var titles = {}; catalog.videos.forEach(function (v) { titles[v.id] = v; });
    var pages = group("page"), plays = group("play"), right = group("quiz_right"), wrong = group("quiz_wrong"), com = group("comment");
    var ids = Object.keys(Object.assign({}, pages, plays, right, wrong, com)).filter(function (k) {
      return k !== "home" && ((pages[k] || 0) + (plays[k] || 0) + (right[k] || 0) + (wrong[k] || 0) + (com[k] || 0)) > 0;
    });
    ids.sort(function (a, b) { return (plays[b] || 0) - (plays[a] || 0) || (pages[b] || 0) - (pages[a] || 0); });
    var storyRows = ids.map(function (id) {
      var v = titles[id], a = (right[id] || 0) + (wrong[id] || 0);
      var name = v ? '<a href="' + esc(v.page || v.youtube) + '"' + (v.page ? "" : ' target="_blank" rel="noopener"') + '>' + esc(v.title) + "</a>" : esc(id);
      return [name, num(pages[id]), num(plays[id]), num(a), pct(right[id] || 0, a), num(com[id])];
    });

    var pr2 = group("pair_right"), pw2 = group("pair_wrong");
    var pairRows = Object.keys(Object.assign({}, pr2, pw2)).filter(function (k) { return (pr2[k] || 0) + (pw2[k] || 0) > 0; }).map(function (k) {
      var names = k.split(".").map(function (x) { return game.items[x] ? game.items[x].label.en : x; }).join("  vs  ");
      var a = (pr2[k] || 0) + (pw2[k] || 0);
      return [esc(names), num(pr2[k]), num(pw2[k]), pct(pr2[k] || 0, a)];
    }).sort(function (a, b) { return parseInt(b[1].replace(/\D/g, "") || 0) - parseInt(a[1].replace(/\D/g, "") || 0); });

    function simple(name, nameOf) {
      var g = group(name);
      return Object.keys(g).filter(function (k) { return g[k] > 0; }).sort(function (a, b) { return g[b] - g[a]; }).map(function (k) { return [esc(nameOf ? nameOf(k) : k), num(g[k])]; });
    }
    var region = function (k) { try { return new Intl.DisplayNames(["en"], { type: "region" }).of(k); } catch (e) { return k; } };
    var language = function (k) { try { return new Intl.DisplayNames(["en"], { type: "language" }).of(k); } catch (e) { return k; } };

    $("tables").innerHTML =
      table("Stories", ["Story", "Page views", "Plays", "Questions answered", "Right", "Comment clicks"], storyRows,
            "Page views count every language page of a story; plays are taps on the YouTube player on this site.") +
      table("\"Which is older?\" pairs", ["Pair", "Right", "Wrong", "Right %"], pairRows) +
      table("Countries tapped on the map", ["Country", "Taps"], simple("country", region)) +
      table("Languages in use", ["Language", "Page views"], simple("lang", language)) +
      table("Other categories tapped (interest before they open)", ["Category", "Taps"], simple("cat")) +
      table("Searches", ["", "Count"], total("search") ? [["Visits that used search", num(total("search"))]] : []);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("#range button").forEach(function (b) {
      b.onclick = function () { range = +b.getAttribute("data-r"); render(); };
    });
    $("signout").onclick = function () { fb && fb.A.signOut(fb.auth); };
    // hover tooltip for the bars
    var tip = $("tip");
    document.addEventListener("mouseover", function (e) {
      var g = e.target.closest && e.target.closest("g.b");
      if (!g) { tip.hidden = true; return; }
      tip.textContent = g.getAttribute("data-tip"); tip.hidden = false;
    });
    document.addEventListener("mousemove", function (e) { tip.style.left = (e.clientX + 12) + "px"; tip.style.top = (e.clientY - 30) + "px"; });
    init();
  });
})();
