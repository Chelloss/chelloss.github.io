/* Optional Google sign-in to keep game progress on every device (Mike, 2026-11-12).
   Firebase project oldest-surviving-web (free Spark plan): Google sign-in + one Firestore document per player,
   players/{uid}, which only that player can read, write or delete (web/firestore.rules). The document holds only
   game progress (points, answers, badges, stamps); no name or email is stored in it.
   Nothing loads from Google until the visitor taps "Sign in with Google", or comes back after signing in before.
   Playing without an account keeps working exactly as before (progress in this browser only). */
(function () {
  var V = "10.12.2", SDK = "https://www.gstatic.com/firebasejs/" + V + "/";
  var fb = null, user = null, timer = null, listeners = [], ready = false;
  // is the sign-in state known yet? (only after Firebase answers, for visitors who signed in before)
  var known = OS.store("os-cloud") !== "1";
  var FIELDS = ["points", "done", "answers", "badges", "bestRun", "perfect", "poly", "prefs"];

  function base() { return document.body.classList.contains("video") ? "../" : ""; }
  function L() { return document.documentElement.lang || "en"; }
  function emit() { listeners.forEach(function (f) { try { f(user); } catch (e) { /* keep going */ } }); }

  function load() {
    if (fb) return fb;
    fb = fetch(base() + "firebase.json").then(function (r) { return r.json(); }).then(function (cfg) {
      return Promise.all([import(SDK + "firebase-app.js"), import(SDK + "firebase-auth.js"), import(SDK + "firebase-firestore.js")])
        .then(function (m) {
          var app = m[0].initializeApp(cfg), A = m[1], F = m[2];
          var o = { A: A, F: F, auth: A.getAuth(app), db: F.getFirestore(app) };
          A.onAuthStateChanged(o.auth, function (u) {
            var was = user;
            user = u; known = true;
            if (u && (!was || was.uid !== u.uid)) pull().then(emit); else emit();
          });
          return o;
        });
    });
    return fb;
  }

  // ------------------------------------------------------------ merge local and saved progress (nothing is lost)
  function merge(local, remote, localPass, remotePass) {
    var p = { done: {}, answers: {}, badges: {}, prefs: {} };
    [remote.done || {}, local.done || {}].forEach(function (d) { for (var k in d) p.done[k] = d[k]; });
    // before 2026-11-12 each thing was marked 1 instead of its points: count those as the base points
    for (var k in p.done) if (+p.done[k] === 1) p.done[k] = /^q:/.test(k) ? 10 : /^p:/.test(k) ? 5 : 1;
    var sum = Object.keys(p.done).reduce(function (s, key) { return s + (+p.done[key] || 0); }, 0);
    // never less than either side already had (the new-country bonus of old entries is not in "done")
    p.points = Math.max(sum, +local.points || 0, +remote.points || 0);
    [remote.answers || {}, local.answers || {}].forEach(function (d) { for (var k in d) if (!p.answers[k]) p.answers[k] = d[k]; });
    [remote.badges || {}, local.badges || {}].forEach(function (d) {
      for (var k in d) if (!p.badges[k] || d[k] < p.badges[k]) p.badges[k] = d[k];
    });
    p.prefs = Object.assign({}, remote.prefs || {}, local.prefs || {});
    p.bestRun = Math.max(remote.bestRun || 0, local.bestRun || 0);
    p.perfect = !!(remote.perfect || local.perfect);
    p.poly = !!(remote.poly || local.poly);
    var pass = {};
    [remotePass || {}, localPass || {}].forEach(function (d) {
      for (var c in d) {
        var s = pass[c] || { first: d[c].first, stories: [] };
        if (d[c].first < s.first) s.first = d[c].first;
        (d[c].stories || []).forEach(function (id) { if (s.stories.indexOf(id) < 0) s.stories.push(id); });
        pass[c] = s;
      }
    });
    return { progress: p, passport: pass };
  }

  function pull() {
    return load().then(function (o) {
      return o.F.getDoc(o.F.doc(o.db, "players", user.uid)).then(function (snap) {
        var remote = snap.exists() ? snap.data() : {};
        if (!snap.exists() && OS.count) OS.count("signup");
        var m = merge(OS.progress.get(), remote, OS.passport.get(), remote.passport);
        ready = true;
        OS.progress.save(m.progress, true);
        OS.store("os-passport", JSON.stringify(m.passport));
        OS.paintLevel();
        document.dispatchEvent(new CustomEvent("os-stamp", { detail: [] }));
        return push();
      });
    });
  }

  function push() {
    if (!user || !ready) return Promise.resolve();
    return load().then(function (o) {
      var p = OS.progress.get(), data = { passport: OS.passport.get(), updated: o.F.serverTimestamp(), v: 1 };
      FIELDS.forEach(function (k) { if (p[k] !== undefined) data[k] = p[k]; });
      data.points = Math.max(0, Math.round(+data.points || 0));
      return o.F.setDoc(o.F.doc(o.db, "players", user.uid), data);
    });
  }

  function schedule() {
    if (!user || !ready) return;
    clearTimeout(timer);
    timer = setTimeout(function () { push().catch(function () { /* next change tries again */ }); }, 1500);
  }

  function signIn() {
    return load().then(function (o) {
      return o.A.signInWithPopup(o.auth, new o.A.GoogleAuthProvider()).then(function () {
        OS.store("os-cloud", "1");
        if (OS.count) OS.count("signin");
        OS.toast(OS.t(L(), "acc_synced"));
      });
    }).catch(function (e) {
      if (!e || e.code !== "auth/popup-closed-by-user") OS.toast(OS.t(L(), "acc_error"));
    });
  }

  function clearLocal() {
    OS.progress.clear(); OS.passport.clear();
    OS.store("os-cloud", "0");
    ready = false;
    OS.paintLevel();
    document.dispatchEvent(new CustomEvent("os-stamp", { detail: [] }));
  }

  function signOut() {
    return load().then(function (o) {
      return push().catch(function () {}).then(function () { return o.A.signOut(o.auth); });
    }).then(clearLocal);
  }

  function deleteAccount() {
    if (!user) return Promise.resolve();
    return load().then(function (o) {
      var u = user;
      return o.F.deleteDoc(o.F.doc(o.db, "players", u.uid)).then(function () {
        return u.delete().catch(function (e) {
          if (e && e.code === "auth/requires-recent-login") {
            return o.A.reauthenticateWithPopup(u, new o.A.GoogleAuthProvider()).then(function () { return u.delete(); });
          }
          throw e;
        });
      }).then(function () { clearLocal(); OS.toast(OS.t(L(), "acc_deleted")); });
    }).catch(function () { OS.toast(OS.t(L(), "acc_error")); });
  }

  // "Sign in to play" card (Mike, 2026-11-12: games and quick questions need sign-in; watching and reading stay free)
  function gate(box, kind) {
    var l = L();
    if (!known) { box.innerHTML = '<p class="small">...</p>'; return; }
    box.innerHTML = '<div class="acc gate"><p><b>' + esc(OS.t(l, kind === "quiz" ? "q_signin" : "gate_title")) + "</b><br>" +
      esc(OS.t(l, "gate_text")) + '</p><p><button type="button" class="btn big gbtn"><span class="g" aria-hidden="true">G</span> ' +
      esc(OS.t(l, "acc_signin")) + '</button></p><p class="small"><a href="' + base() + 'privacy.html">' + esc(OS.t(l, "acc_age")) + "</a></p></div>";
    box.querySelector(".gbtn").onclick = signIn;
    if (OS.count) OS.count("gate");   // a plain total: the rules allow no new groups
  }
  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; }

  OS.cloud = {
    signIn: signIn, signOut: signOut, deleteAccount: deleteAccount, schedule: schedule, gate: gate,
    user: function () { return user; },
    known: function () { return known; },
    onChange: function (f) { listeners.push(f); }
  };
  // came back after signing in before: restore the session (otherwise nothing loads from Google)
  if (OS.store("os-cloud") === "1") load();
})();
