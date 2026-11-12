/* Anonymous usage counts for Mike's admin page (Mike, 2026-11-12: plays, quiz answers, game, comment clicks...).
   Only totals per day are kept: "+1 play for video X today". No visitor id, no cookie, nothing stored on the device.
   Counts are sent at most every 15 seconds and when the page is left, as one small write to the Firestore database
   (EU) through Google's REST endpoint; the rules (web/firestore.rules) only let anyone add to today's totals and let
   only the site owner read them. Off on test computers (localhost) unless the address has ?stats=1. */
(function () {
  var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var on = !local || /[?&]stats=1\b/.test(location.search);
  var C = null, q = {}, timer = null;

  function base() { return document.body.classList.contains("video") ? "../" : ""; }
  function seg(s) { s = String(s); return /^[A-Za-z_][A-Za-z_0-9]*$/.test(s) ? s : "`" + s.replace(/[`\\]/g, "\\$&") + "`"; }
  function add(path) {
    q[path] = (q[path] || 0) + 1;
    clearTimeout(timer);
    timer = setTimeout(function () { flush(false); }, 15000);
  }

  // OS.count("play", "0014-first-car") -> total.play +1 and play.0014-first-car +1 (today)
  function count(group, key) {
    if (!on) { if (local && window.console) console.debug("[stats off on localhost]", group, key || ""); return; }
    add("total." + seg(group));
    if (key != null && key !== "") add(seg(group) + "." + seg(key));
  }

  function flush(leaving) {
    var paths = Object.keys(q);
    if (!paths.length || !C) return;
    var day = String(Math.floor(Date.now() / 86400000));   // days since 1970 (UTC)
    var name = "projects/" + C.projectId + "/databases/(default)/documents/stats/" + day;
    var body = { writes: [{ update: { name: name, fields: {} }, updateMask: { fieldPaths: [] },
      updateTransforms: paths.map(function (p) { return { fieldPath: p, increment: { integerValue: String(q[p]) } }; }) }] };
    q = {};
    try {
      fetch("https://firestore.googleapis.com/v1/projects/" + C.projectId + "/databases/(default)/documents:commit?key=" + C.apiKey,
            { method: "POST", keepalive: !!leaving, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        .catch(function () { /* counts are best effort */ });
    } catch (e) { /* old browser */ }
  }

  if (on) {
    fetch(base() + "firebase.json").then(function (r) { return r.json(); }).then(function (c) { C = c; flush(false); }).catch(function () {});
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flush(true); });
    window.addEventListener("pagehide", function () { flush(true); });
  }
  OS.count = count;
})();
