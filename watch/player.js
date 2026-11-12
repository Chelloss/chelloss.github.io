/* YouTube player with our subtitle bar on top, and the quick question (Mike, 2026-11-12).
   - Plays the real YouTube video, so every play is a normal YouTube view. Nothing loads from YouTube until the
     visitor taps play (no cookie banner needed for the rest of the site); videos never start by themselves.
   - Our subtitles (site/watch/subs/<id>/<lang>.vtt) show in a bar above the video, so they never sit on top of the
     English captions that are burned into the picture. For English the bar starts off.
   - Points and stamps come only from answering the quick question, never from watching (YouTube forbids rewards
     for views). */
(function () {
  var api = null, vttCache = {}, qCache = null;
  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; }
  function L() { return document.documentElement.lang || "en"; }
  function base() { return document.body.classList.contains("video") ? "../" : ""; }

  function loadApi() {
    if (api) return api;
    api = new Promise(function (resolve) {
      if (window.YT && window.YT.Player) { resolve(window.YT); return; }
      var prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function () { if (prev) prev(); resolve(window.YT); };
      var s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    });
    return api;
  }

  function toSec(ts) { var p = ts.split(":"); return (+p[0]) * 3600 + (+p[1]) * 60 + parseFloat(p[2]); }
  function parseVtt(text) {
    var cues = [];
    text.replace(/\r/g, "").split(/\n\n+/).forEach(function (block) {
      var lines = block.split("\n"), i = lines.findIndex(function (l) { return l.indexOf("-->") >= 0; });
      if (i < 0) return;
      var m = /([\d:.]+)\s*-->\s*([\d:.]+)/.exec(lines[i]);
      if (!m) return;
      var div = document.createElement("div");
      div.innerHTML = lines.slice(i + 1).join("\n");
      cues.push({ s: toSec(m[1]), e: toSec(m[2]), t: div.textContent });
    });
    return cues;
  }
  function vtt(id, lang) {
    var k = id + "/" + lang;
    if (!vttCache[k]) vttCache[k] = fetch(base() + "subs/" + id + "/" + lang + ".vtt").then(function (r) { return r.ok ? r.text() : ""; }).then(parseVtt);
    return vttCache[k];
  }

  // opts: {id, ytid, langs, format, poster}
  function player(box, opts) {
    var langs = opts.langs || [], cur = defaultSubs(), cues = [], yt = null, timer = null;
    // subtitles start in the visitor's language (English too, Mike 2026-11-12), unless the visitor turned them off
    function wanted(l) { return OS.store("os-cc") !== "off" && langs.indexOf(l) >= 0 ? l : "off"; }
    function defaultSubs() { return wanted(L()); }
    var options = langs.map(function (l) { return '<option value="' + l + '">' + l.toUpperCase() + "</option>"; }).join("") +
      '<option value="off" data-i="off">' + esc(OS.t(L(), "off")) + "</option>";
    box.innerHTML =
      '<div class="ytbox ' + (opts.format === "long" ? "wide" : "tall") + '">' +
      '<div class="subbar" aria-live="off"><span class="subtext"></span></div>' +
      '<div class="ytframe"><button type="button" class="ytcover"' + (opts.poster ? ' style="background-image:url(\'' + esc(opts.poster) + '\')"' : "") +
      ' aria-label="' + esc(OS.t(L(), "play_label")) + '"><span class="playbtn" aria-hidden="true"></span><span class="ytlogo">YouTube</span></button></div>' +
      '<div class="cc"><label><span class="ccbadge" aria-hidden="true">CC</span> <span data-i="subtitles">' + esc(OS.t(L(), "subtitles")) + "</span></label>" +
      '<select class="ccsel" aria-label="' + esc(OS.t(L(), "subtitles")) + '">' + options + "</select></div>" +
      '<p class="ytnote" data-i="yt_note">' + esc(OS.t(L(), "yt_note")) + "</p></div>";
    var bar = box.querySelector(".subbar"), text = box.querySelector(".subtext"), sel = box.querySelector(".ccsel");

    function show() {
      bar.classList.toggle("off", cur === "off");
      if (cur === "off" || !yt || !yt.getCurrentTime) { text.textContent = ""; return; }
      var t = yt.getCurrentTime(), c = null;
      for (var i = 0; i < cues.length; i++) if (cues[i].s <= t && t < cues[i].e) { c = cues[i]; break; }
      text.textContent = c ? c.t : "";
    }
    function setSubs(l) {
      cur = langs.indexOf(l) >= 0 ? l : "off";
      sel.value = cur;
      bar.classList.toggle("off", cur === "off");
      if (cur === "off") { cues = []; show(); return; }
      vtt(opts.id, cur).then(function (c) { if (cur === l) { cues = c; show(); } });
    }
    sel.addEventListener("change", function () { OS.store("os-cc", sel.value === "off" ? "off" : "on"); setSubs(sel.value); });
    setSubs(cur);

    box.querySelector(".ytcover").addEventListener("click", function () {
      if (OS.count) OS.count("play", opts.id);
      var frame = box.querySelector(".ytframe"), slot = document.createElement("div");
      frame.innerHTML = ""; frame.appendChild(slot);
      loadApi().then(function (YT) {
        yt = new YT.Player(slot, {
          host: "https://www.youtube-nocookie.com", videoId: opts.ytid, width: "100%", height: "100%",
          playerVars: { autoplay: 1, playsinline: 1, rel: 0, modestbranding: 1, cc_load_policy: 0, iv_load_policy: 3,
                        enablejsapi: 1, origin: location.origin },
          events: { onReady: function (e) { e.target.playVideo(); } }
        });
        // read the player's clock a few times a second while this player exists (state events can be late)
        clearInterval(timer);
        timer = setInterval(show, 150);
      });
    });
    return {
      setLang: function (l) {
        setSubs(wanted(l));
        var cover = box.querySelector(".ytcover");   // the play button's spoken label follows the page language
        if (cover) cover.setAttribute("aria-label", OS.t(l, "play_label"));
        var cs = box.querySelector(".ccsel");
        if (cs) cs.setAttribute("aria-label", OS.t(l, "subtitles"));
      },
      stop: function () { clearInterval(timer); if (yt && yt.stopVideo) try { yt.stopVideo(); yt.destroy(); } catch (e) { /* gone */ } }
    };
  }

  // ------------------------------------------------------------ quick question
  function questions() {
    if (!qCache) qCache = fetch(base() + "questions.json").then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
    return qCache;
  }

  // "Comment on YouTube" (Mike, 2026-11-12): copies a short line with the answer and opens the video's YouTube page,
  // where the comments are; the visitor posts it themselves, from their own account, if they want. No points for it
  // (rewarded comments break YouTube's rules). YouTube has no link that opens the comment box itself.
  function commentButton(box, ytid, text, id) {
    if (!ytid) return;
    var l = L(), a = document.createElement("a");
    a.className = "btn ytcomment"; a.href = "https://www.youtube.com/watch?v=" + ytid + "#comments";
    a.target = "_blank"; a.rel = "noopener"; a.textContent = OS.t(l, "comment_btn");
    a.addEventListener("click", function () {
      if (OS.count) OS.count("comment", id);
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { OS.toast(OS.t(l, "comment_copied")); }, function () {});
    });
    var wrap = document.createElement("p");
    wrap.className = "qcomment";
    wrap.appendChild(a);
    box.querySelector(".quiz").appendChild(wrap);
  }

  function quiz(box, id, places, ytid) {
    if (OS.cloud && !box._gateWatch) {   // re-draw when the visitor signs in or out
      box._gateWatch = true;
      OS.cloud.onChange(function () { if (document.body.contains(box)) quiz(box, id, places, ytid); });
    }
    questions().then(function (all) {
      var q = all[id];
      if (!q) { box.hidden = true; return; }
      box.hidden = false;
      if (OS.cloud && !OS.cloud.user()) {
        var l0 = L();
        box.innerHTML = '<div class="quiz"><p class="qhead">' + esc(OS.t(l0, "quick_q")) + '</p><p class="qq">' + esc(q.q[l0] || q.q.en) +
          '</p><div class="qgate"></div></div>';
        OS.cloud.gate(box.querySelector(".qgate"), "quiz");
        return;
      }
      var l = L(), p = OS.progress.get(), done = (p.answers || {})[id];
      var order = q.options.en.map(function (_, i) { return i; });
      for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = order[i]; order[i] = order[j]; order[j] = x; }
      box.innerHTML = '<div class="quiz"><p class="qhead">' + esc(OS.t(l, "quick_q")) + "</p>" +
        '<p class="qq">' + esc(q.q[l] || q.q.en) + "</p>" +
        '<div class="qopts">' + order.map(function (i) {
          return '<button type="button" class="qopt" data-i="' + i + '">' + esc((q.options[l] || q.options.en)[i]) + "</button>";
        }).join("") + "</div>" +
        '<p class="qres" aria-live="polite"></p><p class="small qhint">' + esc(OS.t(l, "q_hint")) + "</p></div>";
      var res = box.querySelector(".qres");
      function reveal(pick) {
        box.querySelectorAll(".qopt").forEach(function (b) {
          var i = +b.getAttribute("data-i");
          b.disabled = true;
          if (i === q.answer) b.classList.add("right");
          else if (i === pick) b.classList.add("wrong");
        });
        box.querySelector(".qhint").hidden = true;
      }
      if (done) {
        reveal(done === "right" ? q.answer : -1);
        res.innerHTML = "<b>" + esc(OS.t(l, done === "right" ? "q_answered_right" : "q_answered")) + "</b> " + esc(q.fact[l] || q.fact.en);
        commentButton(box, ytid, OS.t(l, done === "right" ? "comment_right" : "comment_wrong", { a: (q.options[l] || q.options.en)[q.answer] }), id);
        return;
      }
      box.querySelectorAll(".qopt").forEach(function (b) {
        b.onclick = function () {
          var pick = +b.getAttribute("data-i"), ok = pick === q.answer;
          reveal(pick);
          res.innerHTML = "<b>" + esc(OS.t(l, ok ? "right" : "q_wrong")) + "</b> " + esc(q.fact[l] || q.fact.en);
          res.className = "qres " + (ok ? "ok" : "no");
          commentButton(box, ytid, OS.t(l, ok ? "comment_right" : "comment_wrong", { a: (q.options[l] || q.options.en)[q.answer] }), id);
          if (OS.count) OS.count(ok ? "quiz_right" : "quiz_wrong", id);
          // answering stamps the story's countries; a right answer also gives points (10, +20 per new country)
          var countries = (places || []).map(function (x) { return x.country; }).filter(function (c, i, a) { return a.indexOf(c) === i; });
          var fresh = OS.passport.stamp(countries, id);
          if (fresh.length) OS.toast(OS.t(l, "stamped_toast", { c: fresh.map(function (c) { return OS.country(l, c); }).join(", ") }));
          setTimeout(function () {
            OS.progress.add(ok ? "q:" + id : null, 10 + 20 * fresh.length, function (pr) {
              pr.answers = pr.answers || {}; pr.answers[id] = ok ? "right" : "wrong";
              if (l !== "en") pr.poly = true;
            });
            document.dispatchEvent(new CustomEvent("os-stamp", { detail: fresh }));
          }, fresh.length ? 1600 : 0);
        };
      });
    });
  }

  // ------------------------------------------------------------ Subscribe (Mike, 2026-11-12: "do your best legally")
  // A visitor's own tap opens YouTube's official Subscribe button in place: it subscribes with one more tap and shows
  // "Subscribed" by itself when they already are. Nothing from Google loads before the tap; never automatic, no
  // points for it (YouTube's rules). If the button cannot load, the plain link to YouTube's subscribe page stays.
  var platform = null;
  function loadPlatform() {
    if (!platform) platform = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "https://apis.google.com/js/platform.js";
      s.onload = function () { resolve(window.gapi); }; s.onerror = reject;
      document.head.appendChild(s);
    });
    return platform;
  }
  function subscribeLinks(root) {
    (root || document).querySelectorAll("a[data-ch]").forEach(function (a) {
      if (a._sub) return;
      a._sub = true;
      a.addEventListener("click", function (e) {
        e.preventDefault();
        if (OS.count) OS.count("subscribe_tap");
        var box = document.createElement("span");
        box.className = "ytsub";
        box.innerHTML = '<span class="g-ytsubscribe" data-channelid="' + esc(a.getAttribute("data-ch")) + '" data-layout="default" data-count="default"></span>' +
          '<a class="small ytsubalt" href="' + esc(a.href) + '" target="_blank" rel="noopener">' + esc(OS.t(L(), "sub_alt")) + "</a>";
        a.replaceWith(box);
        loadPlatform().then(function (g) {
          if (g && g.ytsubscribe) g.ytsubscribe.go(box);
          setTimeout(function () { if (!box.querySelector("iframe")) box.classList.add("nolive"); }, 4000);
        }).catch(function () { box.classList.add("nolive"); });
      });
    });
  }

  OS.player = player;
  OS.quiz = quiz;
  OS.subscribeLinks = subscribeLinks;
})();
