/* Video page: one language choice drives the subtitles, the story text and the interface words.
   It starts in the browser's language when this video has it (else English); the choice is kept in this browser. */
(function () {
  var data = JSON.parse(document.getElementById("data").textContent);
  var L = data.lang;
  var yt = OS.player(document.getElementById("player"), { id: data.id, ytid: data.ytid, langs: data.subtitles, format: data.format, poster: data.poster });

  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; }

  function storyHtml(paras) {
    return paras.map(function (p) {
      var h = p[0].h ? "<h3>" + esc(p[0].h) + "</h3>" : "";
      return h + "<p>" + p.map(function (s) {
        var refs = s.refs.length ? '<sup class="refs">' + s.refs.map(function (n) { return '<a href="#s' + n + '">' + n + "</a>"; }).join(",") + "</sup>" : "";
        return esc(s.t) + refs;
      }).join(" ") + "</p>";
    }).join("\n");
  }

  function len(s) { if (!s) return ""; s = Math.round(s); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }

  // "More stories" under the story, in the visitor's language: the page in that language when the story has it
  function moreHtml(l) {
    return (data.related || []).map(function (r) {
      var href = r.page ? r.id + (l !== "en" && r.langs.indexOf(l) >= 0 ? "." + l : "") + ".html" : r.youtube;
      return '<a class="card ' + r.format + (r.page ? "" : " ext") + '" href="' + esc(href) + '"' + (r.page ? "" : ' target="_blank" rel="noopener"') + ">" +
        '<span class="thumb">' + (r.thumb ? '<img loading="lazy" alt="" src="../' + esc(r.thumb) + '">' : "") +
        (r.page ? '<span class="playbtn" aria-hidden="true"></span>' : "") + '<span class="len">' + len(r.seconds) + "</span></span>" +
        '<span class="meta"><span class="place">' + esc(r.place) + '</span><span class="t">' + esc(r.titles[l] || r.titles.en) + "</span></span></a>";
    }).join("");
  }

  function show(l, push) {
    if (data.langs.indexOf(l) < 0) l = "en";
    L = l;
    var t = data.texts[l];
    document.getElementById("title").textContent = t.title;
    document.getElementById("summary").textContent = t.summary;
    document.getElementById("story").innerHTML = storyHtml(t.story);
    document.getElementById("tnote").hidden = l === "en";
    document.title = t.title + " | Oldest Surviving";
    var more = document.getElementById("more");
    if (more && data.related && data.related.length) more.innerHTML = moreHtml(l);
    // the date in the visitor's language ("6 November 2026", "6 novembre 2026")
    document.querySelectorAll("time.date").forEach(function (el) {
      try { el.textContent = new Date(el.getAttribute("datetime") + "T12:00:00").toLocaleDateString(l, { day: "numeric", month: "long", year: "numeric" }); }
      catch (e) { /* keep the plain date */ }
    });
    OS.apply(l);
    yt.setLang(l);
    OS.quiz(document.getElementById("quiz"), data.id, data.places, data.ytid);
    if (push) {
      var url = data.id + (l === "en" ? "" : "." + l) + ".html";
      try { history.replaceState(null, "", url + location.hash); } catch (e) { /* file:// */ }
    }
  }

  // the page language list offers every UI language; story and subtitles fall back to English when missing
  var sel = document.getElementById("lang");
  sel.addEventListener("change", function () { OS.store("os-lang", sel.value); show(sel.value, true); });
  // English page: start in the browser's language (or the visitor's earlier choice). A page in another language
  // (often reached from a search engine) stays in its language unless the visitor chose one before.
  var saved = OS.store("os-lang");
  var start = data.lang !== "en" && !saved ? data.lang : OS.lang(data.langs);
  if (saved && data.langs.indexOf(saved) < 0) start = data.lang;  // a UI-only language this video lacks
  show(start, start !== data.lang);
  OS.paintLevel();
  if (OS.subscribeLinks) OS.subscribeLinks(document);
  if (OS.count) OS.count("page", data.id);
  if (OS.count) OS.count("lang", start);
})();
