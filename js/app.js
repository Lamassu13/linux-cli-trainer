/* app.js — UI, routing, animations for the Linux CLI Trainer.
 * Reads window.CONTENT (content.js), drives window.Term (terminal.js) and window.SRS (srs.js).
 * Hash routes (safe on GitHub Pages, no 404 on refresh):
 *   #/  #/module/ch04  #/lesson/ch04.cp  #/cmd/cp  #/terminal[/taskId]  #/cards[/scope]
 *   #/quiz[/scope]  #/speed  #/cheats  #/progress
 */
(function () {
  'use strict';
  var C = window.CONTENT, SRS = window.SRS, Term = window.Term;
  SRS.setContent(C);

  /* ================= utilities ================= */
  var mqReduced = matchMedia('(prefers-reduced-motion: reduce)');
  var REDUCED = mqReduced.matches;
  mqReduced.addEventListener && mqReduced.addEventListener('change', function (e) { REDUCED = e.matches; });
  var WIDE = matchMedia('(min-width: 900px)');
  var HOME = Term.HOME;
  var main = document.getElementById('main');

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  // Quiz randomness goes through rand() so a seed can reproduce a quiz exactly (daily challenge, challenge links).
  var rand = Math.random;
  function seeded(seed) {   // mulberry32: tiny, fast, good enough for shuffling questions
    var t = seed >>> 0;
    return function () { t += 0x6D2B79F5; var r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; };
  }
  function withSeed(seed, fn) { var old = rand; rand = seeded(seed); try { return fn(); } finally { rand = old; } }
  function newSeed() { return 100000 + Math.floor(Math.random() * 900000); }
  function utcDay() { return Math.floor(Date.now() / 86400000); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rand() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, REDUCED ? 0 : ms); }); }
  function anim(node, frames, opts) {
    if (REDUCED || !node || !node.animate) return Promise.resolve();
    var o = Object.assign({ duration: 320, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'none' }, opts || {});
    var a = node.animate(frames, o);
    // background tabs may never finish an animation; never let the UI wait on one forever
    return Promise.race([a.finished.catch(function () {}), new Promise(function (r) { setTimeout(r, o.duration + (o.delay || 0) + 80); })]);
  }
  function norm(s) { return String(s).replace(/[\u201c\u201d]/g, '"').replace(/[\u2018\u2019]/g, "'").replace(/\u2014/g, '--').replace(/\u2013/g, '-').trim().replace(/\s+/g, ' '); }
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
  var ICON = {
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l4 4 10-10"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16"><path d="M7 5l11 7-11 7z"/></svg>',
    eye: '<svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    reset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4v6h6"/><path d="M5.5 15a7 7 0 1 0 1.6-7.3L4 10"/></svg>',
    clear: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
    replay: '<svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16"><path d="M4 4v6h6"/><path d="M5.5 15a7 7 0 1 0 1.6-7.3L4 10"/></svg>',
    info: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/></svg>',
    tree: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v4H4zM14 10h6v4h-6zM14 17h6v4h-6zM7 8v11h7M7 12h7"/></svg>'
  };

  /* ================= content index ================= */
  var MODS = new Map(), LESSONS = new Map(), CMDS = new Map(), BYNAME = new Map(), LESSON_ORDER = [];
  C.modules.forEach(function (m) {
    MODS.set(m.id, m);
    m.lessons.forEach(function (l) {
      l.module = m; LESSONS.set(l.id, l); LESSON_ORDER.push(l);
      (l.commands || []).forEach(function (c) { c.lesson = l; c.module = m; CMDS.set(c.id, c); if (!BYNAME.has(c.name)) BYNAME.set(c.name, c); });
    });
  });
  var KNOWN = {};   // command name -> lesson id, so the terminal can point at the right lesson
  CMDS.forEach(function (c) { if ((c.kind === 'cmd' || c.kind === 'builtin') && /^[\w.-]+$/.test(c.name)) KNOWN[c.name] = c.lesson.id; });
  var PARTS = { 1: 'Part I · Learning the Shell', 2: 'Part II · Configuration and the Environment', 3: 'Part III · Common Tasks and Essential Tools', 4: 'Part IV · Writing Shell Scripts' };
  function lessonCmds(l) { return (l.commands || []).concat((l.refs || []).map(function (id) { return CMDS.get(id); }).filter(Boolean)); }
  function modCmds(m) { var s = []; m.lessons.forEach(function (l) { lessonCmds(l).forEach(function (c) { if (s.indexOf(c) < 0) s.push(c); }); }); return s; }
  function modPct(m) { var d = m.lessons.filter(function (l) { return SRS.state.lessons[l.id]; }).length; return m.lessons.length ? d / m.lessons.length : 0; }

  /* ================= shell ================= */
  function newShell() { return Term.create({ docs: function (n) { return BYNAME.get(n) || null; }, known: KNOWN }); }
  // interactive shells pick up the prompt designed in the prompt studio; example/visualization shells stay default
  function userShell() { var sh = newShell(); if (SRS.state.settings.ps1) sh.setVar('PS1', SRS.state.settings.ps1); return sh; }
  var shell = userShell(), transcript = [], activeTask = null;
  var simCache = new Map();
  function simOut(cmd) {
    if (!simCache.has(cmd)) { var r = newShell().run(cmd); simCache.set(cmd, r.text.replace(/\n$/, '')); }
    return simCache.get(cmd);
  }
  function exOut(ex) { return ex.sim ? simOut(ex.cmd) : (ex.out || ''); }

  /* ================= flag breakdown ================= */
  var OPS = ['|', '||', '&&', ';', '>', '>>', '<', '2>', '2>>', '&>', '&>>', '2>&1', '&'];
  function flagInfo(c, tok) {
    if (!c || !c.flags) return null;
    var base = tok.split('=')[0];
    var hit = c.flags.filter(function (f) { return f.f === tok || f.long === tok || f.f === base || f.long === base || f.f === base + '=' || f.f.split(' ')[0] === tok; })[0];
    if (hit) return [hit];
    if (/^-[A-Za-z]{2,}$/.test(tok)) {
      var parts = tok.slice(1).split('').map(function (ch) { return c.flags.filter(function (f) { return f.f === '-' + ch; })[0]; });
      if (parts.every(Boolean)) return parts;
    }
    return null;
  }
  function tokenize(line) {
    var re = /\s+|(?:'[^']*'|"[^"]*"|\\.|[^\s'"\\])+/g, m, out = [], cmdNext = true, cur = null;
    while ((m = re.exec(line))) {
      var t = m[0];
      if (/^\s+$/.test(t)) { out.push({ t: t, k: 'ws' }); continue; }
      if (OPS.indexOf(t) >= 0) { out.push({ t: t, k: 'o' }); cmdNext = ['|', '||', '&&', ';', '&'].indexOf(t) >= 0; continue; }
      if (cmdNext && !/^[A-Za-z_]\w*=/.test(t)) { cur = BYNAME.get(t) || null; out.push({ t: t, k: 'c', c: cur }); cmdNext = t === 'sudo' || t === 'xargs'; continue; }
      if (cmdNext) { out.push({ t: t, k: 'a' }); continue; }
      var fi = flagInfo(cur, t);
      if (fi || (/^--?[A-Za-z]/.test(t) && t !== '-')) out.push({ t: t, k: 'f', c: cur, fi: fi });
      else out.push({ t: t, k: 'a' });
    }
    return out;
  }
  function cmdlineHTML(line, interactive) {
    return '<span class="ps" aria-hidden="true">$ </span>' + tokenize(line).map(function (tk, i) {
      if (tk.k === 'ws') return tk.t;
      var cls = 'tok ' + tk.k;
      if (interactive && (tk.k === 'f' || (tk.k === 'c' && tk.c))) return '<button type="button" class="' + cls + '" data-tok="' + i + '" aria-label="Explain ' + esc(tk.t) + '">' + esc(tk.t) + '</button>';
      return '<span class="' + cls + ' plain">' + esc(tk.t) + '</span>';
    }).join('');
  }
  function explainTok(tk) {
    if (tk.k === 'c') return '<code>' + esc(tk.t) + '</code> — ' + esc(tk.c.summary) + (tk.c.lesson ? ' · <a href="#/cmd/' + esc(tk.c.id) + '">lesson</a>' : '');
    if (tk.fi) return tk.fi.map(function (f) { return '<code>' + esc(f.f) + '</code>' + (f.long ? ' (<code>' + esc(f.long) + '</code>)' : '') + ' — ' + esc(f.d); }).join('<br>');
    return '<code>' + esc(tk.t) + '</code> — an option of <code>' + esc(tk.c ? tk.c.name : 'this command') + '</code> not broken down in the lessons. Check its man page.';
  }

  /* ================= toasts, confetti, top bar ================= */
  function toast(msg, icon) {
    var t = el('<div class="toast"><span class="x">' + esc(icon || '✓') + '</span><span>' + esc(msg) + '</span></div>');
    $('#toasts').appendChild(t);
    anim(t, [{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 220 });
    setTimeout(function () { anim(t, [{ opacity: 1 }, { opacity: 0 }], { duration: 250 }).then(function () { t.remove(); }); }, 2600);
  }
  function celebrate() {
    if (REDUCED) return;
    var fx = $('#fx'), colors = ['#3fd17a', '#6cb6ff', '#f0b849', '#ff8fd0', '#ff6b6b'];
    for (var i = 0; i < 28; i++) {
      var p = document.createElement('i'); p.style.background = colors[i % colors.length]; fx.appendChild(p);
      var ang = Math.random() * Math.PI * 2, dist = 120 + Math.random() * 260;
      (function (p) {
        p.animate([{ transform: 'translate(-50%,-50%) rotate(0)', opacity: 1 },
          { transform: 'translate(' + (Math.cos(ang) * dist) + 'px,' + (Math.sin(ang) * dist + 220) + 'px) rotate(' + (Math.random() * 720) + 'deg)', opacity: 0 }],
        { duration: 1100 + Math.random() * 600, easing: 'cubic-bezier(.15,.7,.3,1)' }).finished.then(function () { p.remove(); });
        setTimeout(function () { p.remove(); }, 2000);   // throttled tabs may never finish the animation
      })(p);
    }
  }
  function dueCount() { var n = 0; Object.keys(SRS.state.cards).forEach(function (k) { if (SRS.isDue(k)) n++; }); return n; }
  function renderTop() {
    var s = SRS.state;
    $('#topStats').innerHTML = '<span class="pill" title="Daily streak">🔥 ' + SRS.streakNow() + '</span><span class="pill" title="Level">Lv ' + SRS.level() + '</span>';
  }
  SRS.on(function (type, d) {
    renderTop();
    if (type === 'sync') return;
    if (type === 'level') { toast('Level up! You reached level ' + d.level, '⭐'); celebrate(); if (d.level === STUDIO_LEVEL) setTimeout(function () { toast('Prompt studio unlocked: find it under Progress', '🎨'); }, 1200); }
    if (type === 'badge') { toast('Badge earned: ' + d.name, d.icon); celebrate(); }
    if (type === 'import') { setTheme(SRS.state.settings.theme); shell.setVar('PS1', SRS.state.settings.ps1 || PS1_DEFAULT); route(); }
  });

  /* ================= theme ================= */
  function effectiveTheme() { var t = document.documentElement.dataset.theme; return t || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'); }
  function setTheme(t) {
    SRS.state.settings.theme = t; SRS.save();
    if (t === 'system') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t;
    $$('meta[name="theme-color"]').forEach(function (m) {
      if (!m.dataset.orig) m.dataset.orig = m.content;
      m.content = t === 'system' ? m.dataset.orig : (t === 'dark' ? '#0b0f14' : '#f5f7fa');
    });
    syncThemeBtn();
  }
  function syncThemeBtn() { var e = effectiveTheme(); $('#themeBtn').setAttribute('aria-label', 'Switch to ' + (e === 'dark' ? 'light' : 'dark') + ' theme'); }
  $('#themeBtn').addEventListener('click', function () { setTheme(effectiveTheme() === 'dark' ? 'light' : 'dark'); });
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', syncThemeBtn);

  /* ================= router ================= */
  var leaveFns = [];
  function onLeave(fn) { leaveFns.push(fn); }
  var ROUTES = [
    [/^\/?$/, viewHome, 'learn'], [/^\/module\/(.+)$/, viewModule, 'learn'], [/^\/lesson\/(.+)$/, viewLesson, 'learn'], [/^\/cmd\/(.+)$/, viewCmd, 'learn'],
    [/^\/terminal(?:\/(.+))?$/, viewTerminal, 'terminal'], [/^\/cards(?:\/(.+))?$/, viewCards, 'cards'], [/^\/quiz(?:\/(.+))?$/, viewQuiz, 'quiz'],
    [/^\/speed(?:\/(.+))?$/, viewSpeed, 'quiz'], [/^\/daily$/, viewDaily, 'quiz'], [/^\/man$/, viewMan, 'quiz'], [/^\/play$/, viewPlay, 'play'], [/^\/audio(?:\/(.+))?$/, viewAudio, 'cards'], [/^\/play\/(story|room|golf|boss)\/(.+)$/, viewGame, 'play'], [/^\/cheats$/, viewCheats, 'cheats'], [/^\/progress$/, viewProgress, '']
  ];
  var backTo = null, lastHash = null;
  function setBack(h) { backTo = h; $('#backBtn').hidden = !h; }
  $('#backBtn').addEventListener('click', function () { if (backTo) location.hash = backTo; });

  function route(keepScroll) {
    var raw = location.hash.replace(/^#/, ''), path;
    try { path = decodeURIComponent(raw) || '/'; } catch (e) { path = raw || '/'; }
    var y = keepScroll === true ? scrollY : 0;
    var hit = null, args = [];
    for (var i = 0; i < ROUTES.length; i++) { var m = path.match(ROUTES[i][0]); if (m) { hit = ROUTES[i]; args = m.slice(1); break; } }
    if (!hit) { hit = ROUTES[0]; args = []; }
    function render() {
      // run cleanups here (not before a view transition) so a skipped transition can't leak listeners
      leaveFns.splice(0).forEach(function (f) { try { f(); } catch (e) { /* ignore */ } });
      closeSheet(true);
      document.body.className = document.body.className.replace(/\broute-\S+/g, '').trim();
      document.body.classList.add('route-' + (hit[2] || 'progress'));
      main.innerHTML = '';
      setBack(null);
      hit[1].apply(null, [main].concat(args));
      $$('#tabbar a').forEach(function (a) { if (a.dataset.tab === hit[2]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
      scrollTo(0, y);
      var h1 = $('h1', main);
      document.title = (h1 ? h1.textContent + ' · ' : '') + 'Linux CLI Trainer';
    }
    var first = lastHash === null, fresh = lastHash !== path; lastHash = path;
    if (fresh && !first && !REDUCED && document.startViewTransition && keepScroll !== true && document.visibilityState === 'visible') {
      var rendered = false, vt = document.startViewTransition(function () { rendered = true; render(); });
      [vt.ready, vt.finished, vt.updateCallbackDone].forEach(function (p) { if (p) p.catch(function () {}); });
      // a throttled/background page may never give the transition a frame: don't leave the view blank
      setTimeout(function () { if (!rendered) vt.skipTransition(); }, 400);
    }
    else { render(); if (fresh && keepScroll !== true) main.classList.add('view-in'), setTimeout(function () { main.classList.remove('view-in'); }, 400); }
    if (fresh && keepScroll !== true) main.focus({ preventScroll: true });
    renderTop();
  }
  addEventListener('hashchange', function () { route(); });
  WIDE.addEventListener('change', function () { if (/^#\/(lesson|cmd)\//.test(location.hash)) route(true); });

  /* ================= HOME ================= */
  function ring(p, label) {
    var r = 24, c = 2 * Math.PI * r;
    return '<div class="ring" aria-label="' + Math.round(p * 100) + '% complete" role="img"><svg viewBox="0 0 56 56"><circle class="bg" cx="28" cy="28" r="' + r + '"/><circle class="fg" cx="28" cy="28" r="' + r + '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - p)).toFixed(1) + '"/></svg><b>' + esc(label === undefined ? Math.round(p * 100) + '%' : label) + '</b></div>';
  }
  function nextLesson() { return LESSON_ORDER.filter(function (l) { return !SRS.state.lessons[l.id]; })[0] || LESSON_ORDER[0]; }
  function viewHome(root) {
    var s = SRS.state, ls = SRS.levelSpan(), nl = nextLesson(), due = dueCount();
    var done = Object.keys(s.lessons).length;
    root.innerHTML =
      '<section class="hero"><div>' +
      '<p class="eyebrow">From the book <cite>' + esc(C.book) + '</cite></p>' +
      '<h1>Learn the Linux <span>command line</span>, one command at a time.</h1>' +
      '<p class="muted">' + plural(C.modules.length, 'chapter') + ' · ' + plural(CMDS.size, 'command') + ' and constructs · a terminal to practise in. ' + done + ' of ' + LESSON_ORDER.length + ' lessons done.</p>' +
      '<div class="row"><a class="btn primary" href="#/lesson/' + esc(nl.id) + '">' + (done ? 'Continue' : 'Start') + ': ' + esc(nl.title) + '</a>' +
      '<a class="btn" href="#/cards">' + (due ? 'Review ' + plural(due, 'card') : 'Flashcards') + '</a>' +
      (dueTaskIds().length ? '<a class="btn" href="#/terminal/' + esc(dueTaskIds()[0]) + '/review">Redo ' + plural(dueTaskIds().length, 'task') + '</a>' : '') +
      '<a class="btn" href="#/daily">📅 ' + (SRS.state.daily[utcDay()] !== undefined ? 'Daily ✓ ' + SRS.state.daily[utcDay()] + '/8' : 'Daily challenge') + '</a>' +
      '<a class="btn" href="#/play">🎮 Play</a><a class="btn ghost" href="#/terminal">Open terminal</a></div>' +
      '</div><div class="stats">' +
      '<div class="stat"><b>' + ls.level + '</b><span>Level</span><div class="xpbar" aria-hidden="true"><i style="transform:scaleX(' + (ls.into / ls.need).toFixed(3) + ')"></i></div></div>' +
      '<div class="stat"><b>🔥 ' + SRS.streakNow() + '</b><span>Day streak</span></div>' +
      '<div class="stat"><b>' + s.xp + '</b><span>XP</span></div></div></section>';
    [1, 2, 3, 4].forEach(function (p) {
      var sec = el('<section class="section"><h2>' + esc(PARTS[p]) + '</h2><div class="grid stagger"></div></section>');
      var g = $('.grid', sec);
      C.modules.filter(function (m) { return m.part === p; }).forEach(function (m, i) {
        var a = el('<a class="card mod" href="#/module/' + esc(m.id) + '" style="--i:' + i + '">' + ring(modPct(m)) +
          '<div><span class="num">Chapter ' + m.n + '</span><h3>' + esc(m.title) + '</h3><p>' + esc(m.summary || '') + '</p></div></a>');
        g.appendChild(a);
      });
      root.appendChild(sec);
    });
  }

  /* ================= MODULE ================= */
  function viewModule(root, id) {
    var m = MODS.get(id);
    if (!m) { location.hash = '#/'; return; }
    setBack('#/');
    var html = '<p class="eyebrow">' + esc(PARTS[m.part]) + ' · Chapter ' + m.n + '</p><div class="row" style="align-items:center;gap:16px">' + ring(modPct(m)) +
      '<div class="grow"><h1 style="margin:0">' + esc(m.title) + '</h1><p class="muted" style="margin:4px 0 0">' + esc(m.summary || '') + '</p></div></div>' +
      '<div class="row section"><a class="btn primary" href="#/quiz/' + esc(m.id) + '">Quiz this chapter</a><a class="btn" href="#/cards/' + esc(m.id) + '">Flashcards</a></div>' +
      '<ol class="lesson-list stagger">';
    m.lessons.forEach(function (l, i) {
      var done = SRS.state.lessons[l.id], cmds = lessonCmds(l).map(function (c) { return c.name; }).slice(0, 6).join('  ');
      html += '<li style="--i:' + i + '"><a class="card lesson-link" href="#/lesson/' + esc(l.id) + '"><span class="check' + (done ? ' done' : '') + '">' + (done ? ICON.check : i + 1) + '</span>' +
        '<span class="grow"><b>' + esc(l.title) + '</b><small class="mono">' + esc(cmds || ((l.terms || []).length + ' key ideas')) + '</small></span>' +
        ((l.tasks || []).length ? '<span class="tag">' + plural(l.tasks.length, 'task') + '</span>' : '') + '</a></li>';
    });
    root.innerHTML = html + '</ol>';
  }

  /* ================= LESSON ================= */
  function viewCmd(root, id) {
    var c = CMDS.get(id) || BYNAME.get(id);
    if (!c) { location.hash = '#/cheats'; return; }
    viewLesson(root, c.lesson.id, c.id);
  }
  function viewLesson(root, id, focusCmd) {
    var l = LESSONS.get(id);
    if (!l) { var c = CMDS.get(id) || BYNAME.get(id); if (c) { l = c.lesson; focusCmd = c.id; } }
    if (!l) { location.hash = '#/'; return; }
    var m = l.module, idx = LESSON_ORDER.indexOf(l), prev = LESSON_ORDER[idx - 1], next = LESSON_ORDER[idx + 1];
    setBack('#/module/' + m.id);
    var wrap = el('<div class="lesson-wrap"><article class="lesson-main"></article><aside class="practice-aside" aria-label="Practice area"></aside></div>');
    root.appendChild(wrap);
    var art = $('.lesson-main', wrap), aside = $('.practice-aside', wrap);
    var cmds = lessonCmds(l), html = '';
    html += '<p class="eyebrow"><a href="#/module/' + esc(m.id) + '">Chapter ' + m.n + ' · ' + esc(m.title) + '</a></p><h1>' + esc(l.title) + '</h1>';
    if (l.intro) html += '<p>' + esc(l.intro) + '</p>';
    if (cmds.length) html += '<div class="legend" aria-label="Colour key"><span><i style="color:var(--c-cmd)">cmd</i> command</span><span><i style="color:var(--c-flag)">-f</i> option (tap it)</span><span><i style="color:var(--c-arg)">arg</i> argument</span><span><i style="color:var(--c-op)">|</i> operator</span></div>';
    art.innerHTML = html;
    var stag = el('<div class="stagger"></div>');
    art.appendChild(stag);
    cmds.forEach(function (c, i) { stag.appendChild(commandCard(c, c.lesson !== l, i)); });
    if ((l.terms || []).length) {
      var t = el('<section class="card" style="margin-top:14px"><h2>Key ideas</h2><div class="terms"></div></section>');
      $('.terms', t).innerHTML = l.terms.map(function (x) { return '<div class="term-row"><code>' + esc(x.t) + '</code><span>' + esc(x.d) + '</span></div>'; }).join('');
      art.appendChild(t);
    }
    if ((l.tasks || []).length) {
      var ts = el('<section class="card" style="margin-top:14px"><h2>Guided tasks</h2><p class="muted">Each task opens the terminal with a fresh practice filesystem and checks your work automatically.</p><ul class="lesson-list"></ul></section>');
      $('ul', ts).innerHTML = l.tasks.map(function (t) {
        var done = SRS.state.tasks[t.id];
        return '<li><a class="lesson-link card" href="#/terminal/' + esc(t.id) + '"><span class="check' + (done ? ' done' : '') + '">' + (done ? ICON.check : '›') + '</span><span class="grow">' + esc(t.prompt) + '</span></a></li>';
      }).join('');
      art.appendChild(ts);
    }
    var done = SRS.state.lessons[l.id];
    var foot = el('<section class="card" style="margin-top:14px"><h2>Lock it in</h2><div class="row">' +
      ((l.quiz || []).length || cmds.length ? '<a class="btn" href="#/quiz/' + esc(l.id) + '">Quiz this lesson</a>' : '') +
      '<button class="btn primary" type="button" data-complete ' + (done ? 'disabled' : '') + '>' + (done ? '✓ Lesson complete' : 'Mark lesson complete (+10 XP)') + '</button></div>' +
      '<div class="row" style="margin-top:12px;justify-content:space-between">' + (prev ? '<a class="btn ghost small" href="#/lesson/' + esc(prev.id) + '">‹ ' + esc(prev.title) + '</a>' : '<span></span>') +
      (next ? '<a class="btn ghost small" href="#/lesson/' + esc(next.id) + '">' + esc(next.title) + ' ›</a>' : '') + '</div></section>');
    art.appendChild(foot);
    $('[data-complete]', foot).addEventListener('click', function (e) {
      if (SRS.lessonDone(l.id)) {
        e.currentTarget.disabled = true; e.currentTarget.textContent = '✓ Lesson complete';
        toast('Lesson complete · +10 XP');
        if (modPct(m) === 1) { toast('Chapter ' + m.n + ' complete!', '🏁'); celebrate(); }
      }
    });
    // practice side (wide screens)
    if (WIDE.matches) {
      aside.innerHTML = '<div class="viz" id="vizBox"><h3>Visualization</h3><p class="viz-empty">Tap <b>Visualize</b> on an example to watch it happen, or <b>Run</b> to try it in the terminal below.</p></div><div class="term-host"></div>';
      practiceTerm = new TermView($('.term-host', aside), { chips: chipsFor(cmds), title: 'practice' });
      onLeave(function () { practiceTerm = null; });
    }
    if (focusCmd) {
      var card = document.getElementById('cmd-' + focusCmd);
      if (card) setTimeout(function () { card.scrollIntoView({ block: 'start', behavior: REDUCED ? 'auto' : 'smooth' }); }, 60);
    }
  }
  var practiceTerm = null;
  function chipsFor(cmds) {
    var n = cmds.filter(function (c) { return shell.simulated(c.name); }).map(function (c) { return c.name; });
    return n.length ? n.slice(0, 8) : ['ls', 'cd', 'pwd', 'cat', 'echo', 'grep'];
  }

  function commandCard(c, isRef, i) {
    var card = el('<section class="card cmd-card" id="cmd-' + esc(c.id) + '" data-cmd="' + esc(c.id) + '" style="--i:' + i + '"></section>');
    var h = '<div class="cmd-head"><span class="cmd-name">' + esc(c.name) + '</span><span class="tag kind">' + esc(c.kind) + '</span>' +
      (isRef ? '<a class="tag" href="#/cmd/' + esc(c.id) + '">from chapter ' + c.module.n + '</a>' : '') + '</div>';
    h += '<p><b>' + esc(c.summary) + '</b></p>';
    if (c.syntax) h += '<div class="syntax" aria-label="Syntax">' + esc(c.syntax) + '</div>';
    if (c.explain) h += '<p>' + esc(c.explain) + '</p>';
    if ((c.flags || []).length) {
      h += '<h3>Options</h3><div class="flags">' + c.flags.map(function (f, k) {
        return '<button type="button" class="chip" aria-expanded="false" data-flag="' + k + '">' + esc(f.f) + '</button>';
      }).join('') + '</div><div class="flag-detail" hidden aria-live="polite"></div>';
    }
    (c.examples || []).forEach(function (ex, k) {
      var out = exOut(ex);
      h += '<div class="example" data-ex="' + k + '"><div class="cmdline">' + cmdlineHTML(ex.cmd, true) + '</div>' +
        (out ? '<pre class="out">' + esc(out) + '</pre>' : '') +
        '<div class="flag-detail tokinfo" hidden aria-live="polite"></div>' +
        (ex.note ? '<div class="note">' + esc(ex.note) + '</div>' : '') +
        '<div class="row">' + (ex.sim ? '<button type="button" class="btn small" data-run="' + k + '">' + ICON.play + ' Run it</button>' : '<span class="tag">book example · not simulated</span>') +
        (ex.viz && ex.sim ? '<button type="button" class="btn small" data-viz="' + k + '">' + ICON.eye + ' Visualize</button>' : '') + '</div></div>';
    });
    card.innerHTML = h;
    var detail = $('.flags + .flag-detail', card);
    $$('.chip', card).forEach(function (b) {
      b.addEventListener('click', function () {
        var f = c.flags[+b.dataset.flag], open = b.getAttribute('aria-expanded') === 'true';
        $$('.chip', card).forEach(function (x) { x.setAttribute('aria-expanded', 'false'); });
        if (open) { detail.hidden = true; return; }
        b.setAttribute('aria-expanded', 'true');
        detail.hidden = false;
        detail.innerHTML = '<code>' + esc(f.f) + '</code>' + (f.long ? ' · <code>' + esc(f.long) + '</code>' : '') + ' — ' + esc(f.d) + (f.p ? ' <span class="muted">(book p. ' + f.p + ')</span>' : '');
        anim(detail, [{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'none' }], { duration: 180 });
      });
    });
    $$('.example', card).forEach(function (exEl) {
      var ex = c.examples[+exEl.dataset.ex], toks = tokenize(ex.cmd), info = $('.tokinfo', exEl);
      $$('.tok[data-tok]', exEl).forEach(function (b) {
        b.addEventListener('click', function () {
          var tk = toks[+b.dataset.tok];
          if (!info.hidden && info.dataset.tok === b.dataset.tok) { info.hidden = true; return; }
          info.dataset.tok = b.dataset.tok; info.hidden = false; info.innerHTML = explainTok(tk);
          anim(info, [{ opacity: 0 }, { opacity: 1 }], { duration: 160 });
        });
      });
      var run = $('[data-run]', exEl), viz = $('[data-viz]', exEl);
      if (run) run.addEventListener('click', function () { openPractice(null, c, ex.cmd); });
      if (viz) viz.addEventListener('click', function () { openPractice(ex, c, null); });
    });
    return card;
  }

  /* ---- practice panel: aside on wide screens, bottom sheet on narrow ---- */
  var sheetReturn = null;
  function openPractice(ex, c, runCmd) {
    var cmds = c.lesson ? lessonCmds(c.lesson) : [c];
    if (WIDE.matches && practiceTerm) {
      if (ex) runViz($('#vizBox'), ex);
      if (runCmd) practiceTerm.typeRun(runCmd);
      return;
    }
    var sheet = $('#sheet'), body = $('#sheetBody');
    sheetReturn = document.activeElement;
    $('#sheetTitle').textContent = ex ? 'Visualize: ' + ex.cmd : 'Practice terminal';
    body.innerHTML = (ex ? '<div class="viz" id="vizSheet"></div>' : '') + '<div class="term-host"></div>';
    sheet.hidden = false;
    ['.topbar', '#tabbar', '#main'].forEach(function (q) { $(q).inert = true; });
    var tv = new TermView($('.term-host', body), { chips: chipsFor(cmds), title: 'practice', compact: true });
    anim($('.sheet-panel', sheet), [{ transform: 'translateY(40px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 260 });
    if (ex) runViz($('#vizSheet'), ex);
    $('[data-close]', sheet).focus();
    if (runCmd) tv.typeRun(runCmd);
  }
  function closeSheet(instant) {
    var sheet = $('#sheet');
    if (sheet.hidden) return;
    sheet.hidden = true; $('#sheetBody').innerHTML = '';
    ['.topbar', '#tabbar', '#main'].forEach(function (q) { $(q).inert = false; });
    document.body.classList.remove('kb-open');
    if (!instant && sheetReturn && sheetReturn.focus) sheetReturn.focus();
  }
  $('#sheet').addEventListener('click', function (e) { if (e.target.id === 'sheet' || e.target.closest('[data-close]')) closeSheet(); });

  /* ================= TERMINAL VIEW ================= */
  // ANSI colours 0-7 (normal) and their bold/light variants, as chapter 13 describes
  var PAL = ['#000000', '#cd3131', '#0dbc79', '#a0702a', '#2472c8', '#bc3fbc', '#11a8cd', '#c0c0c0'];
  var PAL_B = ['#7f7f7f', '#f14c4c', '#23d18b', '#f5f543', '#3b8eea', '#d670d6', '#29b8db', '#ffffff'];
  function promptHTML(parts, lastLineOnly) {
    if (lastLineOnly) {
      var keep = [];
      for (var i = parts.length - 1; i >= 0; i--) {
        var k = parts[i].t.lastIndexOf('\n');
        if (k >= 0) { keep.unshift(Object.assign({}, parts[i], { t: parts[i].t.slice(k + 1) })); break; }
        keep.unshift(parts[i]);
      }
      parts = keep;
    }
    return parts.map(function (p) {
      var fg = p.fg === null ? null : (p.bold ? PAL_B : PAL)[p.fg], bg = p.bg === null ? null : PAL[p.bg], css = '';
      if (p.inv) { var f = fg || '#d7e2ea'; fg = bg || '#05080c'; bg = f; }
      if (fg) css += 'color:' + fg + ';';
      if (bg) css += 'background:' + bg + ';';
      if (p.bold) css += 'font-weight:700;';
      if (p.u) css += 'text-decoration:underline;';
      return css ? '<span style="' + css + '">' + esc(p.t) + '</span>' : esc(p.t);
    }).join('');
  }
  // one-line plain-language reading of what is typed so far
  function explainLine(v) {
    var items = [], toks = tokenize(v), lastWord = -1;
    toks.forEach(function (tk, i) { if (tk.k !== 'ws') lastWord = i; });
    var typing = !/\s$/.test(v);
    toks.forEach(function (tk, i) {
      var cut = function (s) { return s.length > 64 ? s.slice(0, 62) + '…' : s; };
      if (tk.k === 'c') {
        if (tk.c) items.push(['c', tk.t, cut(tk.c.summary)]);
        else if (!(typing && i === lastWord)) items.push(['x', tk.t, shell.simulated(tk.t) ? 'a command' : 'not a command I know']);
      } else if (tk.k === 'f') items.push(['f', tk.t, tk.fi ? cut(tk.fi.map(function (f) { return f.d; }).join(' + ')) : 'option not covered in the lessons']);
      else if (tk.k === 'o') { var o = BYNAME.get(tk.t); items.push(['o', tk.t, o ? cut(o.summary) : 'operator']); }
    });
    return items.map(function (x) { return '<span class="xt ' + x[0] + '"><code>' + esc(x[1]) + '</code> ' + esc(x[2]) + '</span>'; }).join('');
  }
  function TermView(host, opts) {
    var self = this;
    opts = opts || {};
    this.hist = -1;
    this.ctrl = false;
    var keys = [['Tab', 'tab'], ['Ctrl', 'ctrl'], ['↑', 'up'], ['↓', 'down'], ['←', 'left'], ['→', 'right'], ['|', '|'], ['~', '~'], ['/', '/'], ['-', '-'], ['>', '>'], ['*', '*'], ['.', '.']];
    this.opts = opts;
    this.explainOn = SRS.state.settings.explain !== false;
    var chips = (opts.chips || []).map(function (c) { return '<button type="button" class="key word" data-ins="' + esc(c) + ' ">' + esc(c) + '</button>'; }).join('');
    host.innerHTML = '<div class="term" role="region" aria-label="Terminal simulator">' +
      '<div class="term-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="title">me@linuxbox: ' + esc(opts.title || 'terminal') + '</span>' +
      (opts.treeToggle ? '<button class="icon-btn tree-toggle" type="button" data-act="tree" aria-pressed="false" aria-label="Show the live file tree">' + ICON.tree + '</button>' : '') +
      '<button class="icon-btn" type="button" data-act="explain" aria-pressed="' + this.explainOn + '" aria-label="Explain commands as I type">' + ICON.info + '</button>' +
      '<button class="icon-btn" type="button" data-act="clear" aria-label="Clear screen">' + ICON.clear + '</button>' +
      '<button class="icon-btn" type="button" data-act="reset" aria-label="Reset the practice filesystem">' + ICON.reset + '</button></div>' +
      '<div class="term-out" role="log" aria-live="polite" aria-label="Terminal output"></div>' +
      '<div class="term-explain" role="note" aria-label="What your command means" hidden></div>' +
      '<form class="term-in" autocomplete="off"><label class="ps" for="tin' + (TermView.n = (TermView.n || 0) + 1) + '"></label>' +
      '<input id="tin' + TermView.n + '" type="text" inputmode="text" enterkeyhint="go" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" aria-label="Command input"></form>' +
      '<div class="keys" role="toolbar" aria-label="Terminal keys">' + keys.map(function (k) { return '<button type="button" class="key" data-key="' + esc(k[1]) + '"' + (k[1] === 'ctrl' ? ' aria-pressed="false"' : '') + ' aria-label="' + esc(k[0] === '|' ? 'pipe' : k[0]) + '">' + esc(k[0]) + '</button>'; }).join('') + chips + '</div></div>';
    this.out = $('.term-out', host); this.input = $('input', host); this.ps = $('.ps', host); this.form = $('form', host); this.ex = $('.term-explain', host);
    this.restore();
    this.form.addEventListener('submit', function (e) { e.preventDefault(); self.submit(); });
    this.input.addEventListener('keydown', function (e) { self.onKey(e); });
    this.input.addEventListener('beforeinput', function (e) {
      if (self.ctrl && e.data && e.data.length === 1) {
        e.preventDefault(); self.setCtrl(false); self.ctrlAction(e.data.toLowerCase());
        self.strip = e.data; setTimeout(function () { self.strip = null; }, 60);
      }
    });
    this.input.addEventListener('input', function () {
      var inp = self.input, ch = self.strip, p = inp.selectionStart;
      if (ch) {
        self.strip = null;
        if (inp.value.slice(p - ch.length, p) === ch) { inp.value = inp.value.slice(0, p - ch.length) + inp.value.slice(p); inp.setSelectionRange(p - ch.length, p - ch.length); }
      }
      self.explain();
    });
    this.input.addEventListener('focus', function () { setTimeout(onViewport, 50); });
    $$('.keys button', host).forEach(function (b) {
      b.addEventListener('pointerdown', function (e) { e.preventDefault(); });   // keep the soft keyboard open
      b.addEventListener('click', function () { self.helper(b); });
    });
    $('[data-act="clear"]', host).addEventListener('click', function () { transcript = []; self.out.innerHTML = ''; self.input.focus(); });
    $('[data-act="explain"]', host).addEventListener('click', function (e) {
      self.explainOn = !self.explainOn; SRS.state.settings.explain = self.explainOn; SRS.save();
      e.currentTarget.setAttribute('aria-pressed', String(self.explainOn)); self.explain();
    });
    var tb = $('[data-act="tree"]', host);
    if (tb) tb.addEventListener('click', function () { var on = tb.getAttribute('aria-pressed') !== 'true'; tb.setAttribute('aria-pressed', String(on)); if (opts.onTree) opts.onTree(on); });
    $('[data-act="reset"]', host).addEventListener('click', function () {
      shell = userShell(); transcript = [];
      self.out.innerHTML = ''; self.line('Practice filesystem reset to its starting state.', 'note'); self.updatePs();
      if (opts.onReset) opts.onReset();
      if (activeTask) self.line('Task restarted: ' + activeTask.prompt, 'note');
    });
    this.out.addEventListener('click', function () { if (!getSelection().toString()) self.input.focus({ preventScroll: true }); });
    this.updatePs();
  }
  TermView.prototype.updatePs = function () { this.ps.innerHTML = promptHTML(shell.promptParts(), true); };
  TermView.prototype.explain = function () {
    var v = this.input.value, html = this.explainOn && v.trim() ? explainLine(v) : '';
    this.ex.innerHTML = html; this.ex.hidden = !html;
  };
  TermView.prototype.restore = function () {
    if (!transcript.length) transcript.push({ c: 'note', h: 'Welcome! This is a simulated bash shell with a practice filesystem in <code>/home/me</code>. Try <b>ls</b>, <b>cd Documents</b> or <b>cat notes.txt</b>. Tab completes names; ↑ recalls history.' });
    this.out.innerHTML = transcript.map(function (t) { return '<div class="ln ' + t.c + '">' + t.h + '</div>'; }).join('');
    this.out.scrollTop = this.out.scrollHeight;
  };
  TermView.prototype.line = function (text, cls, isHTML) {
    var h = isHTML ? text : esc(text);
    transcript.push({ c: cls || '', h: h });
    if (transcript.length > 500) transcript.splice(0, transcript.length - 500);
    var d = document.createElement('div'); d.className = 'ln ' + (cls || ''); d.innerHTML = h;
    this.out.appendChild(d);
    this.out.scrollTop = this.out.scrollHeight;
    return d;
  };
  TermView.prototype.submit = function () {
    var line = this.input.value;
    this.input.value = ''; this.hist = -1;
    this.line('<span class="ps">' + promptHTML(shell.promptParts()) + '</span>' + esc(line), 'cmd', true);
    this.explain();
    if (!line.trim()) return;
    var before = this.opts.onBefore ? this.opts.onBefore() : null;
    var r = shell.run(line);
    if (r.clear) { transcript = []; this.out.innerHTML = ''; }
    var errs = {}; (r.err || '').split('\n').forEach(function (x) { if (x) errs[x] = 1; });
    var self = this;
    (r.text || '').replace(/\n$/, '').split('\n').forEach(function (x, i, a) { if (x !== '' || a.length > 1) self.line(x, errs[x] ? 'err' : ''); });
    if (r.note) this.line(r.note, 'note');
    if (r.stub && KNOWN[r.stub]) this.line('→ <a href="#/lesson/' + esc(KNOWN[r.stub]) + '">Open the ' + esc(r.stub) + ' lesson</a>', 'note', true);
    this.updatePs();
    if (this.opts.onAfter) this.opts.onAfter(before, line, r);
    SRS.ran();
    if (activeTask) checkTask(r, this);
  };
  TermView.prototype.typeRun = function (cmd) {
    var self = this, i = 0;
    this.input.value = '';
    if (REDUCED) { this.input.value = cmd; this.submit(); return; }
    this.typing = true;
    (function step() {
      if (!self.input.isConnected) return;
      self.input.value = cmd.slice(0, ++i);
      self.explain();
      if (i < cmd.length) setTimeout(step, 22 + Math.random() * 30);
      else setTimeout(function () { self.typing = false; if (self.input.isConnected) self.submit(); }, 160);
    })();
  };
  TermView.prototype.setCtrl = function (on) { this.ctrl = on; var b = $('[data-key="ctrl"]', this.form.parentNode); if (b) b.setAttribute('aria-pressed', on ? 'true' : 'false'); };
  TermView.prototype.histMove = function (d) {
    var h = shell.history();
    if (!h.length) return;
    if (this.hist === -1) this.hist = h.length;
    this.hist = Math.max(0, Math.min(h.length, this.hist + d));
    this.input.value = this.hist === h.length ? '' : h[this.hist];
    this.explain();
    var v = this.input; setTimeout(function () { v.setSelectionRange(v.value.length, v.value.length); }, 0);
  };
  TermView.prototype.complete = function () {
    var inp = this.input, pos = inp.selectionStart, before = inp.value.slice(0, pos), after = inp.value.slice(pos);
    var r = shell.complete(before);
    if (r.options.length) this.line(r.options.join('   '), 'note');
    inp.value = r.line + after;
    inp.setSelectionRange(r.line.length, r.line.length);
    this.explain();
  };
  TermView.prototype.ctrlAction = function (k) {
    var self = this; setTimeout(function () { self.explain(); }, 0);   // u/k/w edit the line without an input event
    var inp = this.input, v = inp.value, p = inp.selectionStart;
    if (k === 'c') { this.line('<span class="ps">' + promptHTML(shell.promptParts()) + '</span>' + esc(v) + '^C', 'cmd', true); inp.value = ''; this.explain(); return true; }
    if (k === 'l') { transcript = []; this.out.innerHTML = ''; return true; }
    if (k === 'a') { inp.setSelectionRange(0, 0); return true; }
    if (k === 'e') { inp.setSelectionRange(v.length, v.length); return true; }
    if (k === 'u') { inp.value = v.slice(p); inp.setSelectionRange(0, 0); return true; }
    if (k === 'k') { inp.value = v.slice(0, p); return true; }
    if (k === 'w') { var s = v.slice(0, p).replace(/\S+\s*$/, ''); inp.value = s + v.slice(p); inp.setSelectionRange(s.length, s.length); return true; }
    if (k === 'd' && !v) { this.line('(Ctrl-d would end the session in a real terminal.)', 'note'); return true; }
    return false;
  };
  TermView.prototype.onKey = function (e) {
    if (this.typing) { e.preventDefault(); return; }
    var ctrl = e.ctrlKey || this.ctrl;
    if (ctrl && e.key && e.key.length === 1) {
      if (this.ctrlAction(e.key.toLowerCase())) { e.preventDefault(); this.setCtrl(false); return; }
    }
    if (e.key === 'Tab') { e.preventDefault(); this.complete(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); this.histMove(-1); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); this.histMove(1); }
    else if (e.key === 'Escape') { if (!$('#sheet').hidden) closeSheet(); }
  };
  TermView.prototype.helper = function (b) {
    var self = this; setTimeout(function () { self.explain(); }, 0);
    var inp = this.input, k = b.dataset.key, ins = b.dataset.ins;
    inp.focus({ preventScroll: true });
    if (ins !== undefined) {
      if (inp.value.trim() === '') inp.value = ins;
      else inp.setRangeText((/\s$/.test(inp.value.slice(0, inp.selectionStart)) ? '' : ' ') + ins, inp.selectionStart, inp.selectionEnd, 'end');
      return;
    }
    if (k === 'ctrl') return this.setCtrl(!this.ctrl);
    if (this.ctrl && k.length === 1) { this.setCtrl(false); this.ctrlAction(k); return; }
    if (k === 'tab') return this.complete();
    if (k === 'up') return this.histMove(-1);
    if (k === 'down') return this.histMove(1);
    if (k === 'left' || k === 'right') { var p = Math.max(0, Math.min(inp.value.length, inp.selectionStart + (k === 'left' ? -1 : 1))); inp.setSelectionRange(p, p); return; }
    inp.setRangeText(k, inp.selectionStart, inp.selectionEnd, 'end');
  };

  /* ---- guided tasks ---- */
  var ALL_TASKS = [];
  LESSON_ORDER.forEach(function (l) { (l.tasks || []).forEach(function (t) { t.lesson = l; ALL_TASKS.push(t); }); });
  var TASK_BY_ID = {};
  ALL_TASKS.forEach(function (t) { TASK_BY_ID[t.id] = t; });
  var taskMode = { review: false, failed: false };
  function dueTaskIds() { return SRS.dueTasks().filter(function (id) { return TASK_BY_ID[id]; }); }
  function checkTask(r, tv) {
    var res = shell.check(activeTask.check, r), panel = $('.task-panel');
    if (!res.every(Boolean)) return;
    var t = activeTask; activeTask = null;
    var msg, nextHref = null, nextLabel = '';
    if (taskMode.review) {
      if (taskMode.failed) msg = '✓ Done. It comes back tomorrow so you can try it from memory again.';
      else { var d = SRS.reviewTask(t.id, true); msg = '✓ Remembered! +10 XP · back in ' + days(d) + '.'; }
      var more = dueTaskIds().filter(function (id) { return id !== t.id; });
      if (more.length) { nextHref = '#/terminal/' + more[0] + '/review'; nextLabel = 'Next review (' + more.length + ' left) ›'; }
    } else {
      var first = SRS.taskDone(t.id);
      msg = '✓ Task complete!' + (first ? ' +20 XP' : '');
      var nx = ALL_TASKS[ALL_TASKS.indexOf(t) + 1];
      if (nx) { nextHref = '#/terminal/' + nx.id; nextLabel = 'Next task ›'; }
    }
    tv.line(msg, 'ok');
    celebrate();
    if (panel) {
      panel.classList.add('done');
      $('.task-status', panel).innerHTML = '<b style="color:var(--accent)">' + esc(msg) + '</b>';
      $('.task-actions', panel).innerHTML = (nextHref ? '<a class="btn primary small" href="' + esc(nextHref) + '">' + esc(nextLabel) + '</a>' : '') +
        (taskMode.review ? '<a class="btn small" href="#/cards">Back to flashcards</a>' : '<a class="btn small" href="#/lesson/' + esc(t.lesson.id) + '">Back to lesson</a>');
      var rv = $('.task-reveal', panel); if (rv) rv.textContent = '';
    }
  }
  function viewTerminal(root, arg) {
    var parts = (arg || '').split('/'), taskId = parts[0], review = parts[1] === 'review';
    var task = taskId ? TASK_BY_ID[taskId] || null : null;
    if (task && review && !SRS.state.tasks[task.id]) review = false;   // can't review what was never done
    taskMode = { review: !!(task && review), failed: false };
    if (task) setBack(review ? '#/cards' : '#/lesson/' + task.lesson.id);
    var page = el('<div class="term-page' + (task ? ' with-task' : '') + '"></div>');
    var panel = el('<section class="task-panel" aria-label="Guided task"></section>');
    if (task) {
      shell = userShell(); transcript = [{ c: 'note', h: 'Fresh practice filesystem loaded for this task. You are in <code>/home/me</code>.' }];
      activeTask = task;
      if (review) panel.innerHTML = '<p class="eyebrow">From memory · ' + esc(task.lesson.title) + '</p><h2>' + esc(task.prompt) + '</h2>' +
        '<div class="task-status muted">No hints this time: do it the way you remember. I check after each command.</div>' +
        '<div class="row task-actions"><button class="btn small ghost" type="button" data-stuck>I’m stuck</button></div><div class="task-reveal muted" aria-live="polite"></div>';
      else panel.innerHTML = '<p class="eyebrow">Guided task · ' + esc(task.lesson.title) + '</p><h2>' + esc(task.prompt) + '</h2>' +
        '<div class="task-status muted">Type commands below. I check after each one.</div>' +
        '<div class="row task-actions"><button class="btn small" type="button" data-hint>Hint</button><button class="btn small ghost" type="button" data-sol>Show solution</button></div><div class="task-reveal muted" aria-live="polite"></div>';
    } else {
      activeTask = null;
      var dueIds = dueTaskIds();
      var opts = '<option value="">Pick a guided task…</option>' +
        (dueIds.length ? '<optgroup label="🔁 Due to redo from memory">' + dueIds.map(function (id) { return '<option value="' + esc(id) + '/review">' + esc(TASK_BY_ID[id].prompt.slice(0, 70)) + '</option>'; }).join('') + '</optgroup>' : '') +
        C.modules.filter(function (m) { return m.lessons.some(function (l) { return (l.tasks || []).length; }); }).map(function (m) {
        return '<optgroup label="Ch ' + m.n + ' · ' + esc(m.title) + '">' + m.lessons.map(function (l) { return (l.tasks || []).map(function (t) { return '<option value="' + esc(t.id) + '">' + (SRS.state.tasks[t.id] ? '✓ ' : '') + esc(t.prompt.slice(0, 70)) + '</option>'; }).join(''); }).join('') + '</optgroup>';
      }).join('');
      panel.innerHTML = '<div class="row"><label class="sr-only" for="taskPick">Guided task</label><select id="taskPick" class="grow">' + opts + '</select><button class="btn small" type="button" data-rand>Random task</button></div>';
    }
    var side = el('<div class="term-side"></div>'), treeHost = el('<div class="tree-host"></div>');
    side.appendChild(panel); side.appendChild(treeHost);
    page.appendChild(side);
    var host = el('<div class="term-host" style="min-height:0"></div>');
    page.appendChild(host);
    root.appendChild(page);
    var tree = new LiveTree(treeHost);
    var tv = new TermView(host, {
      chips: ['ls', 'cd', 'pwd', 'cat', 'mkdir', 'cp', 'mv', 'rm', 'echo', 'grep', 'clear'], title: task ? 'task' : '~', treeToggle: true,
      onBefore: function () { return tree.capture(); },
      onAfter: function (before, line) { tree.update(before, line); },
      onReset: function () { tree.open = new Set(); tree.draw(tree.capture()); },
      onTree: function (on) { page.classList.toggle('show-tree', on); if (on) tree.focusRow(); requestAnimationFrame(onViewport); }
    });
    $('.term', host).style.height = '100%';
    function showSolution() {
      var rv = $('.task-reveal', panel);
      rv.innerHTML = 'Solution: <code>' + esc(task.solution) + '</code> <button class="btn small" type="button" data-type>Type it for me</button>';
      $('[data-type]', rv).addEventListener('click', function () { tv.typeRun(task.solution); });
    }
    if (task && review) {
      $('[data-stuck]', panel).addEventListener('click', function (e) {
        if (!taskMode.failed) { taskMode.failed = true; SRS.reviewTask(task.id, false); }
        e.currentTarget.remove();
        showSolution();
        $('.task-reveal', panel).insertAdjacentHTML('afterbegin', '<p style="margin:0 0 6px">No problem: it comes back tomorrow. Finish it now to lock it in.</p>');
      });
    } else if (task) {
      $('[data-hint]', panel).addEventListener('click', function () { $('.task-reveal', panel).textContent = 'Hint: ' + (task.hint || 'Look at the examples in the lesson.'); tv.input.focus(); });
      $('[data-sol]', panel).addEventListener('click', showSolution);
    } else {
      $('#taskPick').addEventListener('change', function (e) { if (e.target.value) location.hash = '#/terminal/' + e.target.value; });
      $('[data-rand]', panel).addEventListener('click', function () {
        var open = ALL_TASKS.filter(function (t) { return !SRS.state.tasks[t.id]; });
        var t = (open.length ? open : ALL_TASKS)[Math.floor(Math.random() * (open.length || ALL_TASKS.length))];
        location.hash = '#/terminal/' + t.id;
      });
    }
    onLeave(function () { activeTask = null; taskMode = { review: false, failed: false }; });
    requestAnimationFrame(onViewport);
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) tv.input.focus({ preventScroll: true });
  }

  /* ---- live file tree: redraws after every command and animates what changed ---- */
  function dirOf(p) { return p.slice(0, p.lastIndexOf('/')) || '/'; }
  function LiveTree(host) {
    host.innerHTML = '<section class="viz live-tree" tabindex="0" aria-label="Live file tree"><h3>Files <small class="muted">· follows your commands</small></h3><ul class="tree"></ul></section>';
    this.box = $('.live-tree', host); this.list = $('ul', host); this.open = new Set(); this.gen = 0;
    this.draw(this.capture());
  }
  LiveTree.prototype.capture = function () {
    var cwd = shell.cwd, rootPath = cwd === HOME || cwd.indexOf(HOME + '/') === 0 ? HOME : '/';
    return { root: rootPath, snap: shell.snapshot(rootPath, 8), cwd: cwd };
  };
  LiveTree.prototype.expand = function (st, extra) {
    var open = this.open;
    [st.cwd].concat(extra || []).forEach(function (p) { ancestors(p).forEach(function (a) { open.add(a); }); });
    open.add(st.cwd);
    return open;
  };
  LiveTree.prototype.draw = function (st, cls) { this.gen++; if (st.snap) renderRows(this.list, treeRows(st.snap, this.expand(st)), st.cwd, cls); };
  LiveTree.prototype.focusRow = function () {
    var row = this.list.querySelector('li.added') || this.list.querySelector('li.cwd'), box = this.box;
    if (row && box.scrollHeight > box.clientHeight) box.scrollTop += row.getBoundingClientRect().top - box.getBoundingClientRect().top - box.clientHeight / 2;
  };
  LiveTree.prototype.update = function (before, line) {
    var self = this, after = this.capture(), list = this.list, g = ++this.gen;   // a newer update or reset wins
    if (!list.isConnected) return;
    if (!before || before.root !== after.root || !before.snap || !after.snap) { this.draw(after); this.focusRow(); return; }
    var b = flatPaths(before.snap), a = flatPaths(after.snap), added = [], removed = [];
    a.forEach(function (x) { if (!b.has(x)) added.push(x); });
    b.forEach(function (x) { if (!a.has(x)) removed.push(x); });
    if (!added.length && !removed.length && before.cwd === after.cwd) return;
    var topAdded = added.filter(function (x) { return added.indexOf(dirOf(x)) < 0; });
    var topRemoved = removed.filter(function (x) { return removed.indexOf(dirOf(x)) < 0; });
    topRemoved.forEach(function (x) { var li = list.querySelector('[data-p="' + CSS.escape(x) + '"]'); if (li) { li.classList.add('gone'); anim(li, [{ opacity: 1 }, { opacity: .25 }], { duration: 240 }); } });
    wait(topRemoved.length ? 260 : 0).then(function () {
      if (!list.isConnected || g !== self.gen) return;
      var rects = {};
      $$('li', list).forEach(function (li) { rects[li.dataset.p] = li.getBoundingClientRect(); });
      var moveFrom = {};
      if (/(^|[;&|]\s*)mv\s/.test(line) && topAdded.length === topRemoved.length) topAdded.forEach(function (x, i) { moveFrom[x] = topRemoved[i]; });
      var cls = {};
      added.forEach(function (x) { cls[x] = 'added'; });
      self.expand(after, topAdded);
      renderRows(list, treeRows(after.snap, self.open), after.cwd, cls);
      var shift = self.box.scrollTop; self.focusRow(); shift = self.box.scrollTop - shift;   // scroll first so FLIP measures final positions
      $$('li', list).forEach(function (li) {
        var x = li.dataset.p, old = rects[moveFrom[x] || x], now = li.getBoundingClientRect();
        if (old && shift) old = { left: old.left, top: old.top - shift };
        if (old) { var dx = old.left - now.left, dy = old.top - now.top; if (dx || dy) anim(li, [{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: moveFrom[x] ? 600 : 360 }); }
        else if (cls[x]) anim(li, [{ opacity: 0, transform: 'scale(.85)' }, { opacity: 1, transform: 'none' }], { duration: 380 });
      });
      setTimeout(function () { if (g === self.gen) $$('li.added', list).forEach(function (li) { li.classList.remove('added'); }); }, 2200);
    });
  };

  /* ---- viewport / on-screen keyboard handling ---- */
  function onViewport() {
    var vv = window.visualViewport, h = vv ? vv.height : innerHeight, top = vv ? vv.offsetTop : 0;
    document.documentElement.style.setProperty('--vvh', h + 'px');
    var kb = !!vv && innerHeight - vv.height > 140 && document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName);
    document.body.classList.toggle('kb-open', kb);
    var page = $('.term-page');
    if (page) {
      if (kb && scrollY) scrollTo(0, 0);
      var tab = $('#tabbar'), bottomBar = getComputedStyle(tab).gridTemplateColumns.split(' ').length > 1 && !kb ? tab.offsetHeight : 0;
      var avail = top + h - page.getBoundingClientRect().top - bottomBar - 4;
      page.style.setProperty('--term-h', Math.max(260, Math.floor(avail)) + 'px');
    }
  }
  if (window.visualViewport) { visualViewport.addEventListener('resize', onViewport); visualViewport.addEventListener('scroll', onViewport); }
  addEventListener('resize', onViewport);
  document.addEventListener('focusout', function () { setTimeout(onViewport, 80); });

  /* ================= VISUALIZATIONS ================= */
  function runViz(box, ex) {
    if (!box) return;
    box.classList.toggle('viz-wide', !WIDE.matches);
    box.innerHTML = '<h3>' + esc(ex.cmd) + ' <button class="btn small ghost" type="button" data-replay aria-label="Replay animation">' + ICON.replay + ' Replay</button></h3><div class="viz-stage"></div>';
    var stage = $('.viz-stage', box), token = {};
    box._token = token;
    var go = function () {
      var tk = {}; box._token = tk; stage.innerHTML = '';
      var alive = function () { return box._token === tk && box.isConnected; };
      ({ tree: vizTree, pipe: vizPipe, scan: vizScan, chmod: vizChmod }[ex.viz] || vizTree)(stage, ex.cmd, alive);
    };
    $('[data-replay]', box).addEventListener('click', go);
    go();
  }

  // ---- file tree ----
  function flatPaths(snap, set) { set = set || new Set(); if (!snap) return set; set.add(snap.path); (snap.kids || []).forEach(function (k) { flatPaths(k, set); }); return set; }
  function ancestors(p) { var a = []; while (p && p !== '/') { p = p.slice(0, p.lastIndexOf('/')) || '/'; a.push(p); } return a; }
  function treeRows(snap, expand) {
    var rows = [];
    (function walk(n, depth) {
      rows.push({ path: n.path, name: depth === 0 ? (n.path === HOME ? '~ (' + HOME + ')' : n.path) : n.name, t: n.t, depth: depth });
      if (n.kids && (depth === 0 || expand.has(n.path))) n.kids.forEach(function (k) { walk(k, depth + 1); });
    })(snap, 0);
    return rows;
  }
  function renderRows(list, rows, cwd, cls) {
    list.innerHTML = rows.map(function (r) {
      var ic = r.t === 'd' ? '📁' : r.t === 'l' ? '🔗' : '📄';
      return '<li class="' + r.t + (r.path === cwd ? ' cwd' : '') + (cls && cls[r.path] ? ' ' + cls[r.path] : '') + '" data-p="' + esc(r.path) + '" style="padding-left:' + (6 + r.depth * 16) + 'px"><span class="ic" aria-hidden="true">' + ic + '</span><span class="nm">' + esc(r.name) + '</span>' + (r.path === cwd ? '<span class="here">you are here</span>' : '') + '</li>';
    }).join('');
  }
  function vizTree(stage, cmd, alive) {
    var sh = newShell();
    var rootPath = / \/(usr|etc|bin|tmp|var|root|home)(\/|\s|$)/.test(' ' + cmd + ' ') || /(^|\s)cd \/(\s|$)/.test(cmd) ? '/' : HOME;
    var before = sh.snapshot(rootPath, 6), cwd0 = sh.cwd;
    var r = sh.run(cmd), after = sh.snapshot(rootPath, 6), cwd1 = sh.cwd;
    var b = flatPaths(before), a = flatPaths(after);
    var added = [], removed = [];
    a.forEach(function (p) { if (!b.has(p)) added.push(p); });
    b.forEach(function (p) { if (!a.has(p)) removed.push(p); });
    var topAdded = added.filter(function (p) { return added.indexOf(p.slice(0, p.lastIndexOf('/'))) < 0; });
    var topRemoved = removed.filter(function (p) { return removed.indexOf(p.slice(0, p.lastIndexOf('/'))) < 0; });
    var first = cmd.trim().split(/\s+/)[0], isMv = /(^|[;&|]\s*)mv\s/.test(cmd), isCp = /(^|[;&|]\s*)cp\s/.test(cmd);
    // paths printed by ls/find (resolve relative to the cwd at the time)
    var listed = [];
    (r.out || '').split('\n').forEach(function (line) {
      line.trim().split(/\s{2,}|\t/).forEach(function (w) {
        w = w.replace(/[\/*@]$/, '').split(' -> ')[0]; if (!w) return;
        var cand = w[0] === '/' ? w : (cwd1 === '/' ? '' : cwd1) + '/' + w.replace(/^\.\//, '');
        if (a.has(cand)) listed.push(cand);
        else { var lsDir = (cmd.match(/^ls(?:\s+-\S+)*\s+([^\s|>-][^\s|>]*)/) || [])[1]; if (lsDir) { var d = sh.norm(lsDir); var c2 = (d === '/' ? '' : d) + '/' + w.split(/\s+/).pop(); if (a.has(c2)) listed.push(c2); } }
      });
      var parts = line.trim().split(/\s+/), last = parts[parts.length - 1];
      if (parts.length > 5 && last) { var c3 = (cwd1 === '/' ? '' : cwd1) + '/' + last; if (a.has(c3)) listed.push(c3); }
    });
    var interesting = added.concat(removed, listed, [cwd0, cwd1]);
    var expand = new Set();
    interesting.forEach(function (p) { ancestors(p).forEach(function (x) { expand.add(x); }); });
    var lsTarget = first === 'ls' || first === 'find' || first === 'cd';
    if (lsTarget) { expand.add(cwd1); listed.forEach(function (p) { expand.add(p.slice(0, p.lastIndexOf('/')) || '/'); }); }
    [cwd0, cwd1].forEach(function (p) { expand.add(p); });
    var list = el('<ul class="tree" aria-label="File tree"></ul>');
    stage.appendChild(list);
    var outBox = el('<pre class="viz-out" aria-label="Command output"></pre>');
    // before
    renderRows(list, treeRows(before, expand), cwd0);
    var cls0 = {};
    topRemoved.forEach(function (p) { cls0[p] = ''; });
    (async function () {
      await wait(550); if (!alive()) return;
      // removals fade
      for (var i = 0; i < topRemoved.length; i++) {
        var li = list.querySelector('[data-p="' + CSS.escape(topRemoved[i]) + '"]');
        if (li) { li.classList.add('gone'); anim(li, [{ opacity: 1, transform: 'none' }, { opacity: .25, transform: 'scale(.97)' }], { duration: 380 }); }
      }
      if (topRemoved.length) await wait(isMv ? 250 : 500);
      if (!alive()) return;
      // FLIP to the after-state
      var rects = {};
      $$('li', list).forEach(function (li) { rects[li.dataset.p] = li.getBoundingClientRect(); });
      var moveFrom = {};
      if (isMv) topAdded.forEach(function (p, i) { if (topRemoved[i]) moveFrom[p] = topRemoved[i]; });
      var copyFrom = {};
      if (isCp) topAdded.forEach(function (p) {
        var nm = p.slice(p.lastIndexOf('/') + 1), src = null;
        b.forEach(function (q) { if (!src && q.slice(q.lastIndexOf('/') + 1) === nm && a.has(q)) src = q; });
        if (src) copyFrom[p] = src;
      });
      var cls = {};
      added.forEach(function (p) { cls[p] = 'added'; });
      renderRows(list, treeRows(after, expand), cwd1, cls);
      var ghosts = [];
      $$('li', list).forEach(function (li) {
        var p = li.dataset.p, old = rects[moveFrom[p] || p], now = li.getBoundingClientRect();
        if (copyFrom[p] && rects[copyFrom[p]]) {
          var s = rects[copyFrom[p]], g = el('<div class="fly">' + esc(p.slice(p.lastIndexOf('/') + 1)) + '</div>');
          g.style.left = s.left + 'px'; g.style.top = s.top + 'px'; document.body.appendChild(g); ghosts.push(g);
          li.style.opacity = '0';
          anim(g, [{ transform: 'translate(0,0)' }, { transform: 'translate(' + (now.left - s.left + (+li.style.paddingLeft.replace('px', '') - 6)) + 'px,' + (now.top - s.top) + 'px)' }], { duration: 700 })
            .then(function () { g.remove(); li.style.opacity = ''; anim(li, [{ opacity: .4 }, { opacity: 1 }], { duration: 200 }); });
          if (REDUCED) { g.remove(); li.style.opacity = ''; }
        } else if (old) {
          var dx = old.left - now.left, dy = old.top - now.top;
          if (dx || dy) anim(li, [{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: moveFrom[p] ? 700 : 420 });
        } else if (cls[p]) anim(li, [{ opacity: 0, transform: 'scale(.85)' }, { opacity: 1, transform: 'none' }], { duration: 420 });
      });
      onLeave(function () { ghosts.forEach(function (g) { g.remove(); }); });
      var focusRow = list.querySelector('li.added') || list.querySelector('li.cwd');
      var scroller = list.closest('.viz');
      if (focusRow && scroller && scroller.scrollHeight > scroller.clientHeight) scroller.scrollTop += focusRow.getBoundingClientRect().top - scroller.getBoundingClientRect().top - scroller.clientHeight / 2;
      // ls pulses listed rows; find steps a cursor through the tree
      if (first === 'find' && listed.length) {
        var hits = new Set(listed), rows = $$('li', list);
        for (var k = 0; k < rows.length; k++) {
          if (!alive()) return;
          if (hits.has(rows[k].dataset.p)) { rows[k].classList.add('hit'); anim(rows[k], [{ transform: 'scale(1.03)' }, { transform: 'none' }], { duration: 220 }); }
          await wait(90);
        }
      } else if (listed.length) {
        listed.forEach(function (p, i) {
          var li = list.querySelector('[data-p="' + CSS.escape(p) + '"]');
          if (li) { li.classList.add('pulse'); anim(li, [{ transform: 'translateX(0)' }, { transform: 'translateX(6px)' }, { transform: 'none' }], { duration: 360, delay: i * 50 }); }
        });
      }
      if (!alive()) return;
      outBox.textContent = (r.text || '').replace(/\n$/, '') || '(no output — the command changed the filesystem silently)';
      stage.appendChild(outBox);
      anim(outBox, [{ opacity: 0 }, { opacity: 1 }], { duration: 250 });
    })();
  }

  // ---- pipeline ----
  function vizPipe(stage, cmd, alive) {
    var sh = newShell(), r = sh.run(cmd), stages = r.stages || [];
    var pipe = el('<div class="pipe"></div>');
    stage.appendChild(pipe);
    var boxes = stages.map(function (s, i) {
      if (i) pipe.appendChild(el('<div class="pipe-link" aria-hidden="true"><span class="dot" style="opacity:0"></span></div>'));
      var b = el('<div class="stage"><div class="sc">' + esc(s.cmd) + '</div><ul class="sl"></ul><div class="more"></div></div>');
      pipe.appendChild(b); return b;
    });
    var last = stages[stages.length - 1], fileBox = null, m = last && last.cmd.match(/(?:^|\s)>>?\s*(\S+)\s*$/);
    if (m) {
      pipe.appendChild(el('<div class="pipe-link" aria-hidden="true"><span class="dot" style="opacity:0"></span></div>'));
      fileBox = el('<div class="stage file"><div class="sc">📄 ' + esc(m[1]) + '</div><ul class="sl"></ul><div class="more"></div></div>');
      pipe.appendChild(fileBox);
    }
    function fill(box, text) {
      var L = (text || '').replace(/\n$/, '').split('\n').filter(function (x, i, a) { return x !== '' || a.length > 1; });
      var ul = $('.sl', box);
      ul.innerHTML = L.slice(0, 6).map(function (x) { return '<li>' + esc(x || ' ') + '</li>'; }).join('') || '<li class="muted">(nothing)</li>';
      $('.more', box).textContent = L.length > 6 ? '+ ' + (L.length - 6) + ' more lines' : '';
      return $$('li', ul);
    }
    (async function () {
      var links = $$('.pipe-link', pipe);
      for (var i = 0; i < boxes.length; i++) {
        if (!alive()) return;
        if (i) {
          var dot = $('.dot', links[i - 1]), horiz = links[i - 1].offsetWidth > links[i - 1].offsetHeight;
          await anim(dot, [{ opacity: 1, transform: 'translate(0,0)' }, { opacity: 1, transform: horiz ? 'translate(16px,0)' : 'translate(0,16px)' }], { duration: 380 });
          dot.style.opacity = '0';
          var keep = new Set((stages[i].out || '').split('\n').map(function (x) { return x.trim(); }));
          $$('.sl li', boxes[i - 1]).forEach(function (li) { var t = li.textContent.trim(); if (!keep.has(t) && !/^\d+\s/.test(stages[i].out || '')) li.classList.add('drop'); });
        }
        var lis = fill(boxes[i], stages[i].out);
        lis.forEach(function (li, k) { anim(li, [{ opacity: 0, transform: 'translateX(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 260, delay: k * 60 }); });
        await wait(420 + lis.length * 60);
      }
      if (fileBox && alive()) {
        var ld = $('.dot', links[links.length - 1]);
        await anim(ld, [{ opacity: 1, transform: 'none' }, { opacity: 1, transform: links[links.length - 1].offsetWidth > links[links.length - 1].offsetHeight ? 'translate(16px,0)' : 'translate(0,16px)' }], { duration: 380 });
        ld.style.opacity = '0';
        fill(fileBox, sh.readFile(m[1]) || '').forEach(function (li, k) { anim(li, [{ opacity: 0 }, { opacity: 1 }], { duration: 240, delay: k * 50 }); });
      }
      if (alive() && r.err) stage.appendChild(el('<pre class="viz-out">' + esc(r.err) + '</pre>'));
    })();
  }

  // ---- grep scan ----
  function vizScan(stage, cmd, alive) {
    var sh = newShell(), r = sh.run(cmd), st = r.stages || [], gi = -1;
    st.forEach(function (s, i) { if (/^grep\b/.test(s.cmd)) gi = i; });
    var input = '', label = 'input';
    if (gi > 0) { input = st[gi - 1].out; label = 'output of ' + st[gi - 1].cmd; }
    else {
      var fresh = newShell(), words = (gi >= 0 ? st[gi].cmd : cmd).split(/\s+/).slice(1), files = words.filter(function (w) { return w[0] !== '-' && fresh.readFile(w) !== null; });
      if (/\*/.test(cmd)) files = (fresh.run('echo ' + cmd.split(/\s+/).filter(function (w) { return /\*/.test(w); }).join(' ')).out || '').trim().split(/\s+/).filter(function (f) { return fresh.readFile(f) !== null; });
      input = files.map(function (f) { return files.length > 1 ? fresh.readFile(f).replace(/^/gm, f + ':') : fresh.readFile(f); }).join('');
      label = files.join(', ') || 'input';
    }
    var outLines = new Set(((gi >= 0 ? st[gi].out : r.out) || '').split('\n').map(function (x) { return x.replace(/^(\d+:)/, ''); }));
    var multi = /:/.test(input.split('\n')[0] || '') && label.indexOf(',') > 0;
    var lines = input.replace(/\n$/, '').split('\n').slice(0, 40);
    stage.appendChild(el('<p class="muted" style="margin:0 0 6px;font-size:.85rem">Scanning ' + esc(label) + '</p>'));
    var ul = el('<ul class="scan"></ul>');
    ul.innerHTML = lines.map(function (x) { return '<li>' + esc(x || ' ') + '</li>'; }).join('');
    var cur = el('<div class="scan-cursor" aria-hidden="true"></div>');
    ul.appendChild(cur);
    stage.appendChild(ul);
    var outBox = el('<pre class="viz-out"></pre>');
    (async function () {
      var lis = $$('li', ul);
      for (var i = 0; i < lis.length; i++) {
        if (!alive()) return;
        var y = lis[i].offsetTop;
        cur.style.transform = 'translateY(' + y + 'px)';
        await anim(cur, [{ transform: 'translateY(' + (i ? lis[i - 1].offsetTop : 0) + 'px)' }, { transform: 'translateY(' + y + 'px)' }], { duration: 140 });
        var t = lines[i], plain = multi ? t : t;
        var hit = outLines.has(plain) || outLines.has(t) || Array.from(outLines).some(function (o) { return o && (t.indexOf(o) >= 0 && /-o\b/.test(cmd)); });
        lis[i].classList.add(hit ? 'hit' : 'miss');
        if (hit) anim(lis[i], [{ transform: 'scale(1.02)' }, { transform: 'none' }], { duration: 200 });
        await wait(60);
      }
      if (!alive()) return;
      cur.style.opacity = '0';
      outBox.textContent = (r.text || '').replace(/\n$/, '') || '(no matching lines)';
      stage.appendChild(outBox);
    })();
  }

  // ---- chmod ----
  function vizChmod(stage, cmd, alive) {
    var sh = newShell(), words = cmd.trim().split(/\s+/), target = words[words.length - 1], mode0 = '664', mode1;
    var L = sh.look(target); if (L.node) mode0 = L.node.mode;
    var r = cmd ? sh.run(cmd) : null; L = sh.look(target); mode1 = L.node ? L.node.mode : mode0;
    chmodWidget(stage, target || 'foo.txt', mode0, mode1, alive, r);
  }
  function chmodWidget(stage, file, from, to, alive, r) {
    var bits = function (m) { var v = parseInt(m, 8) & 511; return [256, 128, 64, 32, 16, 8, 4, 2, 1].map(function (b) { return !!(v & b); }); };
    var cur = bits(from);
    var html = '<div class="perm" role="group" aria-label="Permission bits"><span></span><span class="h">read</span><span class="h">write</span><span class="h">execute</span>';
    ['owner', 'group', 'world'].forEach(function (w, i) {
      html += '<span class="who">' + w + '</span>' + ['r', 'w', 'x'].map(function (b, j) { return '<button type="button" class="bit" data-i="' + (i * 3 + j) + '" aria-label="' + w + ' ' + ['read', 'write', 'execute'][j] + '">' + b + '</button>'; }).join('');
    });
    html += '</div><div class="perm-read"><span class="big" aria-live="polite"></span><label>octal <input type="text" inputmode="numeric" maxlength="3" aria-label="Octal mode"></label><code class="sym"></code></div><p class="muted cmdtxt" style="margin-top:8px"></p>';
    var w = el('<div>' + html + '</div>');
    stage.appendChild(w);
    var btns = $$('.bit', w), oct = $('input', w);
    function sync(skipInput) {
      btns.forEach(function (b, i) { b.setAttribute('aria-pressed', cur[i] ? 'true' : 'false'); });
      var v = cur.reduce(function (t, on, i) { return t | (on ? (256 >> i) : 0); }, 0), o = v.toString(8); while (o.length < 3) o = '0' + o;
      $('.big', w).textContent = o;
      if (!skipInput) oct.value = o;
      $('.sym', w).textContent = '-' + cur.map(function (on, i) { return on ? 'rwx'[i % 3] : '-'; }).join('');
      $('.cmdtxt', w).innerHTML = 'Command: <code>chmod ' + o + ' ' + esc(file) + '</code>';
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { var i = +b.dataset.i; cur[i] = !cur[i]; sync(); anim(b, [{ transform: 'scale(.85)' }, { transform: 'none' }], { duration: 180 }); }); });
    oct.addEventListener('input', function () { if (/^[0-7]{3}$/.test(oct.value)) { cur = bits(oct.value); sync(true); } });
    sync();
    if (to && to !== from) (async function () {
      await wait(600);
      var target = bits(to);
      for (var i = 0; i < 9; i++) {
        if (!alive || !alive()) return;
        if (cur[i] !== target[i]) { cur[i] = target[i]; sync(); await anim(btns[i], [{ transform: 'scale(1.25)' }, { transform: 'none' }], { duration: 260 }); }
      }
      if (r && alive()) stage.appendChild(el('<pre class="viz-out">$ ' + esc(r.line || '') + '\n' + esc((r.text || '').replace(/\n$/, '') || '(mode changed from ' + from + ' to ' + to + ')') + '</pre>'));
    })();
  }

  /* ================= FLASHCARDS ================= */
  // Card kinds: c = command, f = option, t = key/term, x = fill-in-the-blank built from a book example.
  // `ans` is what "Type answer" mode expects; `accept` lists other spellings that also count.
  function clozeCards(c) {
    var out = [];
    (c.examples || []).forEach(function (ex) {
      if (out.length >= 2 || ex.cmd.length > 60) return;
      var toks = tokenize(ex.cmd), words = toks.filter(function (t) { return t.k !== 'ws'; }), pick = -1;
      if (words.length < 2) return;
      toks.forEach(function (tk, i) { if (pick < 0 && tk.k === 'f' && tk.fi && tk.c === c) pick = i; });
      if (pick < 0) toks.forEach(function (tk, i) { if (pick < 0 && tk.k === 'c' && tk.t === c.name) pick = i; });
      if (pick < 0) return;
      out.push({ id: 'x:' + c.id + ':' + ex.cmd, kind: 'x', cmd: c.id, ex: ex, mono: true,
        front: toks.map(function (tk, i) { return i === pick ? '___' : tk.t; }).join(''), back: ex.cmd, ans: toks[pick].t, accept: [], note: ex.note || c.summary });
    });
    return out;
  }
  function cardsFor(mods) {
    var out = [];
    mods.forEach(function (m) {
      m.lessons.forEach(function (l) {
        (l.commands || []).forEach(function (c) {
          out.push({ id: 'c:' + c.id, kind: 'c', cmd: c.id, front: c.name, back: c.summary, extra: c.syntax, mono: true, ans: c.name, accept: [] });
          (c.flags || []).forEach(function (f) {
            out.push({ id: 'f:' + c.id + ':' + f.f, kind: 'f', cmd: c.id, name: c.name, front: c.name + ' ' + f.f, back: f.d, mono: true, ans: f.f,
              accept: [c.name + ' ' + f.f].concat(f.long ? [f.long, c.name + ' ' + f.long] : []) });
          });
          clozeCards(c).forEach(function (x) { out.push(x); });
        });
        (l.terms || []).forEach(function (t) { out.push({ id: 't:' + l.id + ':' + t.t, kind: 't', cmd: null, front: t.t, back: t.d, extra: l.title, mono: true, ans: t.t, accept: [] }); });
      });
    });
    return out;
  }
  // edit distance, capped: only used to spot one-letter typos
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 1) return 2;
    var prev = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      var cur = [i];
      for (j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[b.length];
  }
  function judge(item, typed) {
    var v = norm(typed), targets = [item.ans].concat(item.accept || []).map(norm);
    if (targets.indexOf(v) >= 0) return 'right';
    if (targets.some(function (t) { return t.toLowerCase() === v.toLowerCase() || (t.length >= 4 && lev(t, v) <= 1); })) return 'close';
    return 'wrong';
  }
  function days(n) { return n <= 0 ? 'now' : n === 1 ? '1 day' : n + ' days'; }
  var GRADES = [['Again', 'again'], ['Hard', 'hard'], ['Good', 'good'], ['Easy', 'easy']];

  function viewCards(root, scope) {
    scope = scope || 'due';
    var all = cardsFor(C.modules), deck = deckFor(scope);
    var set = SRS.state.settings, mode = set.mode === 'type' ? 'type' : 'flip', front = set.front || 'cmd';
    var dueT = SRS.dueTasks().filter(function (id) { return TASK_BY_ID[id]; });
    root.innerHTML = '<div class="title-row"><h1>Flashcards</h1><a class="btn small" href="#/audio/' + esc(scope) + '">🎧 Audio drill</a></div>' +
      (dueT.length ? '<a class="card task-due" href="#/terminal/' + esc(dueT[0]) + '/review"><span aria-hidden="true">🔁</span><span class="grow"><b>' + plural(dueT.length, 'task') + ' to redo from memory</b><small>Finished tasks come back so you can do them again without hints.</small></span><span aria-hidden="true">›</span></a>' : '') +
      '<div class="deck-bar"><label class="sr-only" for="deckSel">Deck</label><select id="deckSel">' +
      '<option value="due">Due today + new</option><option value="weak">Weak commands</option><option value="all">Everything (' + all.length + ')</option>' +
      C.modules.map(function (m) { return '<option value="' + m.id + '">Chapter ' + m.n + ': ' + esc(m.title) + '</option>'; }).join('') + '</select>' +
      '<div class="seg" role="group" aria-label="Answer mode"><button type="button" data-mode="flip" aria-pressed="' + (mode === 'flip') + '">Flip</button><button type="button" data-mode="type" aria-pressed="' + (mode === 'type') + '">Type answer</button></div>' +
      (mode === 'flip' ? '<div class="seg" role="group" aria-label="Card front"><button type="button" data-front="cmd" aria-pressed="' + (front === 'cmd') + '">Command first</button><button type="button" data-front="meaning" aria-pressed="' + (front === 'meaning') + '">Meaning first</button></div>' : '') +
      '</div><div id="flashHost"></div>';
    $('#deckSel').value = scope;
    $('#deckSel').addEventListener('change', function (e) { location.hash = '#/cards/' + e.target.value; });
    $$('[data-front]', root).forEach(function (b) { b.addEventListener('click', function () { set.front = b.dataset.front; SRS.save(); route(true); }); });
    $$('[data-mode]', root).forEach(function (b) { b.addEventListener('click', function () { set.mode = b.dataset.mode; SRS.save(); route(true); }); });
    var host = $('#flashHost');
    if (!deck.length) { host.innerHTML = '<div class="card"><p>Nothing to review here right now. 🎉</p><div class="row"><a class="btn primary" href="#/cards/all">Study everything</a><a class="btn" href="#/lesson/' + esc(nextLesson().id) + '">Next lesson</a></div></div>'; return; }

    var queue = shuffle(deck).slice(0, 30), requeued = {}, done = 0, known = 0, total = queue.length;
    host.innerHTML = '<p class="count" aria-live="polite"></p><div class="flash-stage' + (mode === 'type' ? ' typed' : '') + '"></div>' +
      '<form class="recall" hidden autocomplete="off"><div class="fill-in"><span class="ps" aria-hidden="true">$</span>' +
      '<input type="text" aria-label="Your answer" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" enterkeyhint="done">' +
      '<button class="btn primary small" type="submit">Check</button></div><button class="btn ghost small" type="button" data-giveup>Show answer</button></form>' +
      '<div class="flash-actions"><button class="btn" type="button" data-flip aria-label="Flip the card (space)">Flip</button></div>' +
      '<div class="grades" role="group" aria-label="How well did you know it?"></div>' +
      '<p class="muted flash-help">' + (mode === 'type'
        ? 'Type the answer and press Enter, then rate it with 1–4. Linux is case-sensitive.'
        : 'Tap to flip · swipe right for Good, left for Again, up for Easy · keys: Space, 1–4, ← → ↑') + '</p>';
    var st = $('.flash-stage', host), count = $('.count', host), form = $('.recall', host), input = $('input', form), grades = $('.grades', host);
    var card = null, item = null, revealed = false;

    function faceOf(it) {
      if (it.kind === 'x') {
        var out = exOut(it.ex), shortOut = out && out.split('\n').length <= 6 && out.length <= 320 ? out : '';
        return { ask: 'Fill in the blank', a: it.front, am: true, b: it.back, bm: true, more: '<p class="meaning small">' + esc(it.note) + '</p>' + (shortOut ? '<pre class="out mini">' + esc(shortOut) + '</pre>' : '') };
      }
      if (mode === 'type') {
        var ask = it.kind === 'c' ? 'Type the command' : it.kind === 'f' ? 'Type the option of ' + it.name : 'Type the key or symbol';
        return { ask: ask, a: it.back, am: false, b: it.ans, bm: true };
      }
      return front === 'cmd' ? { ask: 'What does this do?', a: it.front, am: true, b: it.back, bm: false }
        : { ask: 'Which command or key?', a: it.back, am: false, b: it.front, bm: true };
    }
    function show() {
      if (!queue.length) {
        st.innerHTML = '<div class="face" style="position:relative;height:100%"><div class="big">Done!</div><p>' + known + ' of ' + total + ' remembered · come back tomorrow for the next due cards.</p><div class="row" style="justify-content:center">' +
          (SRS.dueTasks().length ? '<a class="btn primary" href="#/terminal/' + esc(SRS.dueTasks()[0]) + '/review">Redo a task</a>' : '') + '<a class="btn" href="#/quiz">Take a quiz</a></div></div>';
        form.hidden = true; grades.innerHTML = ''; $('.flash-actions', host).hidden = true; count.textContent = '';
        celebrate(); return;
      }
      item = queue[0]; revealed = false;
      var f = faceOf(item);
      card = el('<div class="flash" role="button" tabindex="0" aria-label="Flashcard. Activate to flip."><span class="stamp yes">GOOD</span><span class="stamp no">AGAIN</span><div class="flash-inner">' +
        '<div class="face front"><span class="hint">' + esc(f.ask) + '</span><div class="' + (f.am ? 'big' : 'meaning') + '">' + esc(f.a) + '</div>' + (f.more || '') + '<span class="hint">Box ' + (SRS.box(item.id) || 'new') + '</span></div>' +
        '<div class="face back"><div class="verdict" aria-live="polite"></div><div class="' + (f.bm ? 'big' : 'meaning') + '">' + esc(f.b) + '</div>' + (item.extra ? '<code>' + esc(item.extra) + '</code>' : '') +
        (item.cmd && CMDS.get(item.cmd) ? '<a class="hint" href="#/cmd/' + esc(item.cmd) + '">open lesson</a>' : '') + '</div></div></div>');
      st.innerHTML = ''; st.appendChild(card);
      anim(card, [{ opacity: 0, transform: 'translateY(16px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 260 });
      count.textContent = (done + 1) + ' / ' + total + ' · ' + queue.length + ' left';
      swipe(card);
      if (mode === 'type') {
        form.hidden = false; input.value = ''; input.disabled = false; grades.innerHTML = ''; $('.flash-actions', host).hidden = true;
        if (matchMedia('(pointer: fine)').matches) input.focus({ preventScroll: true });
      } else { form.hidden = true; $('.flash-actions', host).hidden = false; showGrades([0, 1, 2, 3]); }
    }
    // grade buttons; each shows when the card would come back
    function showGrades(levels, labels, focusLevel) {
      var pv = SRS.preview(item.id);
      grades.innerHTML = levels.map(function (g) {
        var name = (labels && labels[g]) || GRADES[g][0];
        return '<button type="button" class="btn grade ' + GRADES[g][1] + '" data-g="' + g + '"><span>' + esc(name) + ' <kbd>' + (g + 1) + '</kbd></span><small>' + days(pv[g]) + '</small></button>';
      }).join('');
      grades.style.setProperty('--cols', levels.length);
      $$('[data-g]', grades).forEach(function (b) { b.addEventListener('click', function () { gradeIt(+b.dataset.g); }); });
      if (focusLevel !== undefined) { var fb = $('[data-g="' + focusLevel + '"]', grades); if (fb) fb.focus({ preventScroll: true }); }
    }
    function flip() { if (card && (mode === 'flip' || revealed)) card.classList.toggle('flipped'); }
    function reveal(result, typed) {
      revealed = true; input.disabled = true; form.hidden = true;
      card.classList.add('flipped');
      var v = $('.verdict', card);
      if (result === 'right') { v.className = 'verdict right'; v.textContent = '✓ Correct'; SRS.recalled(); showGrades([1, 2, 3], null, 2); }
      else if (result === 'close') { v.className = 'verdict close'; v.textContent = 'Almost: you typed “' + typed + '”'; showGrades([0, 1], { 1: 'Count it' }, 1); }
      else { v.className = 'verdict wrong'; v.textContent = typed ? '✗ You typed “' + typed + '”' : 'The answer is:'; showGrades([0, 1], { 1: 'I was right' }, 0); }
    }
    form.addEventListener('submit', function (e) { e.preventDefault(); if (!item || revealed || !input.value.trim()) return; reveal(judge(item, input.value), input.value.trim()); });
    $('[data-giveup]', form).addEventListener('click', function () { if (item && !revealed) reveal('wrong', ''); });
    function gradeIt(g) {
      if (!item) return;
      if (mode === 'type' && !revealed) return;
      if (!$('[data-g="' + g + '"]', grades)) return;      // only the levels on offer right now
      var it = item; item = null;
      SRS.grade(it.id, g); if (it.cmd) SRS.answer(it.cmd, g > 0);
      queue.shift(); done++;
      if (g > 0) known++; else if (!requeued[it.id]) { requeued[it.id] = 1; queue.push(it); total++; }
      var c = card, out = g === 0 ? 'translateX(-520px) rotate(-18deg)' : g === 3 ? 'translateY(-420px)' : 'translateX(520px) rotate(18deg)';
      anim(c, [{ transform: c.style.transform || 'none', opacity: 1 }, { transform: out, opacity: 0 }], { duration: 300 }).then(show);
    }
    function swipe(c) {
      var x0 = 0, y0 = 0, dx = 0, dy = 0, down = false, moved = false;
      c.addEventListener('pointerdown', function (e) {
        if (e.target.closest('a')) return;
        if (mode === 'type' && !revealed) return;          // in type mode the card only flips once answered
        down = true; moved = false; x0 = e.clientX; y0 = e.clientY; dx = dy = 0; c.setPointerCapture(e.pointerId);
      });
      c.addEventListener('pointermove', function (e) {
        if (!down) return; dx = e.clientX - x0; dy = e.clientY - y0;
        if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
        if (mode === 'type') return;
        c.style.transform = 'translate(' + dx + 'px,' + Math.min(0, dy) * .5 + 'px) rotate(' + dx / 22 + 'deg)';
        $('.stamp.yes', c).style.opacity = Math.max(0, Math.min(1, dx / 90));
        $('.stamp.no', c).style.opacity = Math.max(0, Math.min(1, -dx / 90));
      });
      function reset() { $('.stamp.yes', c).style.opacity = 0; $('.stamp.no', c).style.opacity = 0; c.style.transform = ''; }
      function end() {
        if (!down) return; down = false;
        if (mode === 'flip') {
          if (dx > 90) return gradeIt(2);
          if (dx < -90) return gradeIt(0);
          if (dy < -90 && Math.abs(dx) < 60) return gradeIt(3);
          reset();
          anim(c, [{ transform: c.style.transform || 'none' }, { transform: 'none' }], { duration: 200 });
        }
        if (!moved) flip();
      }
      c.addEventListener('pointerup', end);
      c.addEventListener('pointercancel', function () { down = false; reset(); });
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); flip(); } });
    }
    $('[data-flip]', host).addEventListener('click', flip);
    function key(e) {
      if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
      if ((e.key === ' ' || e.key === 'Enter') && e.target.closest && e.target.closest('button,a')) return;
      if (e.key === ' ') { e.preventDefault(); flip(); }
      else if (/^[1-4]$/.test(e.key)) gradeIt(+e.key - 1);
      else if (e.key === 'ArrowLeft') gradeIt(0);
      else if (e.key === 'ArrowRight') gradeIt(2);
      else if (e.key === 'ArrowUp') { e.preventDefault(); gradeIt(3); }
    }
    document.addEventListener('keydown', key);
    onLeave(function () { document.removeEventListener('keydown', key); });
    show();
  }

  /* ================= QUIZ ENGINE ================= */
  function scopeCmds(scope) {
    if (scope === 'weak') { var w = SRS.weak(); if (!w.length) w = SRS.mistakes(); return w.map(function (id) { return CMDS.get(id); }).filter(Boolean); }
    if (scope === 'mix' || !scope) return Array.from(CMDS.values());
    var m = MODS.get(scope); if (m) return modCmds(m);
    var l = LESSONS.get(scope); if (l) return lessonCmds(l);
    return [];
  }
  function scopeLessons(scope) {
    var m = MODS.get(scope); if (m) return m.lessons;
    var l = LESSONS.get(scope); if (l) return [l];
    if (scope === 'mix') return LESSON_ORDER;
    return [];
  }
  function pick(arr, n, not) { return shuffle(arr.filter(function (x) { return not.indexOf(x) < 0; })).slice(0, n); }
  var ALLC = Array.from(CMDS.values());
  function genQuestion(c, pool) {
    var kinds = [], others = pool.length >= 4 ? pool : ALLC;
    if ((c.flags || []).length) kinds.push('flag');
    kinds.push('name');
    if ((c.examples || []).length) kinds.push('order', 'output');
    if (c.kind === 'cmd' || c.kind === 'builtin') kinds.push('fill');
    var k = kinds[Math.floor(rand() * kinds.length)];
    if (k === 'flag') {
      var f = c.flags[Math.floor(rand() * c.flags.length)];
      var dis = c.flags.filter(function (x) { return x !== f && x.d !== f.d; }).map(function (x) { return x.d; });
      if (dis.length < 3) dis = dis.concat(ALLC.filter(function (o) { return o !== c && (o.flags || []).length; }).map(function (o) { return o.flags[0].d; }));
      var ch = shuffle([f.d].concat(pick(dis, 3, [f.d])));
      return { type: 'mc', cmd: c.id, q: 'What does ' + c.name + ' ' + f.f + ' do?', qcode: c.name + ' ' + f.f, choices: ch, answer: ch.indexOf(f.d), explain: f.f + ': ' + f.d };
    }
    if (k === 'order') {
      var ex = c.examples.filter(function (e) { var n = e.cmd.split(/\s+/).length; return n >= 2 && n <= 8; })[0];
      if (ex) return { type: 'order', cmd: c.id, q: 'Put the pieces in order: ' + (ex.note || c.summary), parts: ex.cmd.trim().split(/\s+/) };
    }
    if (k === 'output') {
      var exs = c.examples.filter(function (e) { var o = exOut(e); return o && o.split('\n').length <= 10 && o.length < 600; });
      if (exs.length) {
        var e1 = exs[Math.floor(rand() * exs.length)], o1 = exOut(e1);
        var cand = [];
        pool.concat(ALLC).forEach(function (o) { (o.examples || []).forEach(function (e) { if (e.cmd !== e1.cmd && cand.indexOf(e.cmd) < 0 && exOut(e) !== o1) cand.push(e.cmd); }); });
        var near = cand.filter(function (x) { return x.split(/\s+/)[0] === e1.cmd.split(/\s+/)[0]; });
        var ch2 = shuffle([e1.cmd].concat(pick(near, 2, []).concat(pick(cand, 3, near)).slice(0, 3)));
        return { type: 'output', cmd: c.id, q: 'Which command produced this output?', out: o1, choices: ch2, answer: ch2.indexOf(e1.cmd), mono: true };
      }
    }
    if (k === 'fill') return { type: 'fill', cmd: c.id, q: 'Type the command: ' + c.summary, accept: [c.name] };
    var names = pick(others.filter(function (o) { return o.name !== c.name; }).map(function (o) { return o.name; }), 3, []);
    var ch3 = shuffle([c.name].concat(names));
    return { type: 'mc', cmd: c.id, q: 'Which one does this: ' + c.summary + '?', choices: ch3, answer: ch3.indexOf(c.name), mono: true, explain: c.name + ' — ' + c.summary };
  }
  /* Mix-ups: two-choice questions on things people confuse (CONTENT.pairs) */
  var PAIRS = C.pairs || [];
  function pairQuestions(filter) {
    var out = [];
    PAIRS.forEach(function (p) {
      if (filter && !filter(p)) return;
      p.items.forEach(function (it) {
        var side = it.ans === 'a' ? p.a : p.b;
        out.push({ type: 'mc', mix: p.a.label + ' or ' + p.b.label + '?', cmd: side.cmd, q: it.q, choices: [p.a.label, p.b.label], answer: it.ans === 'a' ? 0 : 1, mono: true, explain: it.why });
      });
    });
    return out;
  }
  function buildQuiz(scope, n, seed) {
    return withSeed(seed || newSeed(), function () {
      var cmds = scopeCmds(scope), qs = [];
      if (scope === 'pairs') return shuffle(pairQuestions()).slice(0, n);
      var authored = [], m = MODS.get(scope);
      scopeLessons(scope).forEach(function (l) { (l.quiz || []).forEach(function (q) { authored.push(q); }); });
      if (scope === 'weak') { var ids = cmds.map(function (c) { return c.id; }); LESSON_ORDER.forEach(function (l) { (l.quiz || []).forEach(function (q) { if (ids.indexOf(q.cmd) >= 0) authored.push(q); }); }); }
      var mixups = scope === 'mix' ? pairQuestions() : m ? pairQuestions(function (p) { return p.ch === m.n; })
        : scope === 'weak' ? pairQuestions(function (p) { return cmds.some(function (c) { return c.id === p.a.cmd || c.id === p.b.cmd; }); }) : [];
      authored = shuffle(authored).slice(0, Math.ceil(n * 0.5)).concat(shuffle(mixups).slice(0, Math.ceil(n * 0.2)));
      qs = authored.map(function (q) { return Object.assign({}, q); });
      var gens = shuffle(cmds), guard = 0;
      while (qs.length < n && gens.length && guard++ < 200) qs.push(genQuestion(gens[guard % gens.length], cmds));
      return shuffle(qs).slice(0, n);
    });
  }

  function renderQuestion(host, q, onDone) {
    var answered = false;
    host.innerHTML = '';
    var box = el('<div class="card"></div>');
    var qhtml = (q.mix ? '<p class="eyebrow mixup">Mix-up · ' + esc(q.mix) + '</p>' : '') + '<div class="q" id="qtext">' + esc(q.q) + '</div>';
    if (q.type === 'output' && q.out) qhtml += '<pre class="output-box" aria-label="Output">' + esc(q.out) + '</pre>';
    box.innerHTML = qhtml;
    host.appendChild(box);
    var fb = el('<div class="feedback" hidden aria-live="polite"></div>');
    function finish(ok, correctText) {
      if (answered) return; answered = true;
      SRS.answer(q.cmd, ok);
      fb.hidden = false; fb.className = 'feedback ' + (ok ? 'good' : 'bad');
      fb.innerHTML = (ok ? '<b>✓ Correct!</b>' : '<b>✗ Not quite.</b> Answer: <code>' + esc(correctText) + '</code>') + (q.explain ? '<p style="margin:.4em 0 0">' + esc(q.explain) + '</p>' : '') +
        (q.cmd && CMDS.get(q.cmd) ? ' <a href="#/cmd/' + esc(q.cmd) + '">Review ' + esc(CMDS.get(q.cmd).name) + '</a>' : '') +
        '<div class="row end" style="margin-top:10px"><button class="btn primary" type="button" data-next>Next ›</button></div>';
      box.appendChild(fb);
      anim(fb, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 220 });
      if (!ok) anim(box, [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'none' }], { duration: 300 });
      var nb = $('[data-next]', fb); nb.addEventListener('click', function () { onDone(ok); }); nb.focus({ preventScroll: true });
    }
    if (q.type === 'mc' || q.type === 'output') {
      var list = el('<div class="choices" role="group" aria-labelledby="qtext"></div>');
      q.choices.forEach(function (c, i) {
        var b = el('<button type="button" class="choice' + (q.mono || q.type === 'output' ? ' mono' : '') + '"><span class="n">' + (i + 1) + '</span><span>' + esc(c) + '</span></button>');
        b.addEventListener('click', function () {
          if (answered) return;
          var ok = i === q.answer;
          $$('.choice', list).forEach(function (x, j) { if (j === q.answer) x.classList.add('right'); else if (j === i) x.classList.add('wrong'); x.disabled = true; });
          finish(ok, q.choices[q.answer]);
        });
        list.appendChild(b);
      });
      box.appendChild(list);
    } else if (q.type === 'fill') {
      var form = el('<form><div class="fill-in"><span class="ps" aria-hidden="true">$</span><input type="text" aria-labelledby="qtext" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" enterkeyhint="done"><button class="btn primary small" type="submit">Check</button></div></form>');
      form.addEventListener('submit', function (e) {
        e.preventDefault(); if (answered) return;
        var v = norm($('input', form).value), strip = function (s) { return norm(s).replace(/["']/g, ''); };
        if (!v) return;
        var ok = q.accept.some(function (a) { return norm(a) === v || strip(a) === strip(v); });
        $('input', form).disabled = true;
        finish(ok, q.accept[0]);
      });
      box.appendChild(form);
      setTimeout(function () { if (matchMedia('(pointer: fine)').matches) $('input', form).focus(); }, 50);
    } else if (q.type === 'order') {
      var zoneA = el('<div class="order-zone answer" role="group" data-empty="Tap pieces below to build the command" aria-label="Your answer"></div>');
      var zoneP = el('<div class="order-zone" role="group" aria-label="Pieces"></div>');
      var parts = q.parts.slice(), shuffled = shuffle(parts.map(function (p, i) { return { p: p, i: i }; }));
      if (shuffled.every(function (x, i) { return x.i === i; }) && parts.length > 1) shuffled.reverse();
      shuffled.forEach(function (x) {
        var b = el('<button type="button" class="ochip">' + esc(x.p) + '</button>');
        b.dataset.p = x.p;
        b.addEventListener('click', function () { if (answered || b._dragged) { b._dragged = false; return; } (b.parentNode === zoneP ? zoneA : zoneP).appendChild(b); b.focus({ preventScroll: true }); anim(b, [{ transform: 'scale(.8)' }, { transform: 'none' }], { duration: 160 }); });
        dragChip(b, zoneA, zoneP);
        zoneP.appendChild(b);
      });
      var check = el('<div class="row end" style="margin-top:10px"><button class="btn ghost small" type="button" data-clear>Reset</button><button class="btn primary" type="button" data-check>Check</button></div>');
      box.appendChild(zoneA); box.appendChild(zoneP); box.appendChild(check);
      $('[data-clear]', check).addEventListener('click', function () { if (!answered) $$('.ochip', zoneA).forEach(function (b) { zoneP.appendChild(b); }); });
      $('[data-check]', check).addEventListener('click', function () {
        if (answered) return;
        var got = $$('.ochip', zoneA).map(function (b) { return b.dataset.p; }).join(' ');
        if (!got) return;
        $$('.ochip', box).forEach(function (b) { b.disabled = true; });
        finish(norm(got) === norm(parts.join(' ')), parts.join(' '));
      });
    }
    box._key = function (e) {
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (!answered && /^[1-9]$/.test(e.key)) { var cs = $$('.choice', box); if (cs[+e.key - 1]) cs[+e.key - 1].click(); }
    };
    return box;
  }
  // Pointer-events drag to reorder chips in the answer zone (tap still works; keyboard uses Enter/Space)
  function dragChip(b, zoneA, zoneP) {
    var sx, sy, dragging = false, pid = null;
    b.addEventListener('pointerdown', function (e) { if (b.disabled) return; sx = e.clientX; sy = e.clientY; pid = e.pointerId; dragging = false; });
    b.addEventListener('pointermove', function (e) {
      if (pid !== e.pointerId) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (!dragging && Math.hypot(dx, dy) > 8) { dragging = true; b.setPointerCapture(pid); b.classList.add('dragging'); }
      if (dragging) b.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    });
    function up(e) {
      if (pid !== e.pointerId) return; pid = null;
      if (!dragging) return;
      b._dragged = true; b.classList.remove('dragging'); b.style.transform = '';
      var target = document.elementFromPoint(e.clientX, e.clientY);
      var zone = target && target.closest('.order-zone');
      if (zone !== zoneA && zone !== zoneP) zone = zoneA;
      var siblings = $$('.ochip', zone).filter(function (x) { return x !== b; }), before = null;
      for (var i = 0; i < siblings.length; i++) {
        var r = siblings[i].getBoundingClientRect();
        if (e.clientY < r.bottom && (e.clientY < r.top || e.clientX < r.left + r.width / 2)) { before = siblings[i]; break; }
      }
      zone.insertBefore(b, before);
      setTimeout(function () { b._dragged = false; }, 0);
    }
    b.addEventListener('pointerup', up);
    b.addEventListener('pointercancel', function () { pid = null; dragging = false; b.classList.remove('dragging'); b.style.transform = ''; });
  }

  // #/quiz/<scope>[/<seed>[/<friendScore>]] — a seed rebuilds the exact same quiz (challenge links)
  function viewQuiz(root, arg) {
    if (!arg) return quizPicker(root);
    var parts = arg.split('/'), scope = parts[0], seed = +parts[1] || 0, friend = parts[2] !== undefined && /^\d+$/.test(parts[2]) ? +parts[2] : null;
    var title = scope === 'weak' ? 'Weak commands drill' : scope === 'mix' ? 'Mixed quiz' : scope === 'pairs' ? 'Mix-ups' : MODS.get(scope) ? 'Chapter ' + MODS.get(scope).n + ': ' + MODS.get(scope).title : LESSONS.get(scope) ? LESSONS.get(scope).title : 'Quiz';
    runQuiz(root, { scope: scope, seed: seed || newSeed(), n: 10, title: title, friend: friend, shareable: scope !== 'weak' });
  }
  function viewDaily(root) {
    var day = utcDay(), date = new Date(day * 86400000).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });
    runQuiz(root, { scope: 'mix', seed: day * 7919, n: 8, title: 'Daily challenge', sub: date + ' · the same 8 questions for everyone today', daily: day });
  }
  function shareLink(url, text, box) {
    var done = function () { toast('Challenge link copied'); };
    box.innerHTML = '<label class="sr-only" for="shareUrl">Challenge link</label><input id="shareUrl" class="share-url" type="text" readonly value="' + esc(url) + '">';
    $('#shareUrl', box).addEventListener('focus', function (e) { e.target.select(); });
    if (navigator.share && matchMedia('(pointer: coarse)').matches) { navigator.share({ title: 'Linux CLI challenge', text: text, url: url }).catch(function () {}); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () { $('#shareUrl', box).select(); });
    else $('#shareUrl', box).select();
  }
  function runQuiz(root, o) {
    var scope = o.scope;
    setBack('#/quiz');
    var qs = buildQuiz(scope, o.n, o.seed);
    root.innerHTML = '<h1>' + esc(o.title) + '</h1>' + (o.sub ? '<p class="muted">' + esc(o.sub) + '</p>' : '') +
      (o.friend !== null && o.friend !== undefined ? '<div class="card challenge-banner"><b>🏆 A friend scored ' + o.friend + ' / ' + o.n + ' on this exact quiz.</b> Same questions, same order. Can you beat it?</div>' : '') +
      (o.daily && SRS.state.daily[o.daily] !== undefined ? '<div class="card challenge-banner">You already did today’s challenge (' + SRS.state.daily[o.daily] + ' / ' + o.n + '). Practise again for fun; only the first score counts.</div>' : '');
    if (!qs.length) { root.innerHTML += '<div class="card"><p>' + (scope === 'weak' ? 'No weak commands yet — answer some quizzes first and your mistakes will collect here.' : 'No questions available here.') + '</p><a class="btn primary" href="#/quiz">Pick another quiz</a></div>'; return; }
    var top = el('<div class="quiz-top"><span class="count" aria-live="polite"></span><div class="progressbar" aria-hidden="true"><i style="transform:scaleX(0)"></i></div></div>');
    var host = el('<div></div>');
    root.appendChild(top); root.appendChild(host);
    var i = 0, score = 0, missed = [], box = null;
    function key(e) { if (box && box._key) box._key(e); }
    document.addEventListener('keydown', key);
    onLeave(function () { document.removeEventListener('keydown', key); });
    function step() {
      $('i', top).style.transform = 'scaleX(' + (i / qs.length) + ')';
      if (i >= qs.length) return end();
      $('.count', top).textContent = 'Question ' + (i + 1) + ' of ' + qs.length + ' · score ' + score;
      box = renderQuestion(host, qs[i], function (ok) { if (ok) score++; else missed.push(qs[i]); i++; step(); });
      anim(box, [{ opacity: 0, transform: 'translateX(14px)' }, { opacity: 1, transform: 'none' }], { duration: 240 });
    }
    function end() {
      if (o.daily) { if (SRS.dailyResult(o.daily, score, qs.length)) toast('Daily challenge done · +' + (10 + score * 3) + ' XP', '📅'); }
      else SRS.quizResult(scope, score, qs.length);
      var pct = Math.round(100 * score / qs.length);
      if (pct >= 80) celebrate();
      var miss = missed.map(function (q) { var c = CMDS.get(q.cmd); return c ? '<a class="chip" href="#/cmd/' + esc(c.id) + '">' + esc(c.name) + '</a>' : ''; }).filter(function (x, i, a) { return x && a.indexOf(x) === i; }).join('');
      var vs = o.friend === null || o.friend === undefined ? '' : '<p class="versus">' + (score > o.friend ? '🏆 You beat your friend (' + o.friend + ')!' : score === o.friend ? '🤝 A tie with your friend (' + o.friend + ').' : 'Your friend scored ' + o.friend + '. So close: try again!') + '</p>';
      host.innerHTML = '<div class="card" style="text-align:center"><div class="eyebrow">' + (o.daily ? 'Daily challenge' : 'Result') + '</div><h2 style="font-size:2.4rem">' + score + ' / ' + qs.length + '</h2>' + vs + '<p>' + (pct >= 80 ? 'Excellent work!' : pct >= 50 ? 'Good progress. Review the misses below.' : 'Keep at it. These are now in your weak list.') + '</p>' +
        (miss ? '<p class="muted">Review:</p><div class="flags" style="justify-content:center">' + miss + '</div>' : '') +
        '<div class="row" style="justify-content:center;margin-top:12px">' + (o.shareable ? '<button class="btn primary" type="button" data-share>Challenge a friend</button>' : '') +
        (o.daily ? '<a class="btn primary" href="#/quiz/pairs">Try the mix-ups</a>' : '<button class="btn" type="button" data-again>New questions</button>') +
        '<a class="btn" href="#/quiz/weak">Drill weak commands</a><a class="btn ghost" href="#/quiz">All quizzes</a></div><div class="share-box"></div></div>';
      var ag = $('[data-again]', host); if (ag) ag.addEventListener('click', function () { if (location.hash === '#/quiz/' + scope) route(); else location.hash = '#/quiz/' + scope; });
      var sb = $('[data-share]', host);
      if (sb) sb.addEventListener('click', function () {
        var url = location.href.split('#')[0] + '#/quiz/' + scope + '/' + o.seed + '/' + score;
        shareLink(url, 'I scored ' + score + '/' + qs.length + ' on "' + o.title + '" in the Linux CLI Trainer. Same questions for you. Can you beat me?', $('.share-box', host));
      });
    }
    step();
  }
  function quizPicker(root) {
    var weak = SRS.weak();
    root.innerHTML = '<h1>Quizzes</h1><p class="muted">Multiple choice, type-the-command, “which command produced this output?” and build-the-command puzzles.</p>' +
      '<div class="grid stagger"><a class="card mod" href="#/speed" style="--i:0"><div class="ring" style="display:grid;place-items:center;font-size:1.8rem">⚡</div><div><h3>Speed round</h3><p>60 seconds. Best: ' + SRS.state.speed.best + '</p></div></a>' +
      '<a class="card mod" href="#/quiz/weak" style="--i:1"><div class="ring" style="display:grid;place-items:center;font-size:1.8rem">🎯</div><div><h3>Weak commands</h3><p>' + (weak.length ? plural(weak.length, 'command') + ' to drill' : 'Built from your mistakes') + '</p></div></a>' +
      '<a class="card mod" href="#/quiz/mix" style="--i:2"><div class="ring" style="display:grid;place-items:center;font-size:1.8rem">🎲</div><div><h3>Mixed</h3><p>Questions from the whole book</p></div></a>' +
      '<a class="card mod" href="#/daily" style="--i:3"><div class="ring" style="display:grid;place-items:center;font-size:1.8rem">📅</div><div><h3>Daily challenge</h3><p>' + (SRS.state.daily[utcDay()] !== undefined ? '✓ Done today: ' + SRS.state.daily[utcDay()] + ' / 8' : 'Same 8 questions for everyone today') + '</p></div></a>' +
      '<a class="card mod" href="#/man" style="--i:5"><div class="ring" style="display:grid;place-items:center;font-size:1.8rem">📖</div><div><h3>Man page hunt</h3><p>Find options in manual pages with less-style / search</p></div></a>' +
      '<a class="card mod" href="#/quiz/pairs" style="--i:4"><div class="ring" style="display:grid;place-items:center;font-size:1.8rem">⚖️</div><div><h3>Mix-ups</h3><p>' + PAIRS.length + ' pairs people confuse: cp/mv, &gt;/&gt;&gt;, find/locate…</p></div></a></div>' +
      '<h2 class="section">By chapter</h2><div class="grid stagger">' + C.modules.map(function (m, i) {
        var best = (SRS.state.quiz[m.id] || {}).best;
        return '<a class="card mod" href="#/quiz/' + m.id + '" style="--i:' + Math.min(i, 12) + '">' + ring((best || 0) / 100, best === undefined ? '–' : best + '%') + '<div><span class="num">Chapter ' + m.n + '</span><h3>' + esc(m.title) + '</h3></div></a>';
      }).join('') + '</div>';
  }

  /* ================= MAN PAGE HUNT ================= */
  // Read a manual page and find the option that matches a description, using less-style search (/, n, N).
  function markMatches(text, q) {
    if (!q) return { html: esc(text), n: 0 };
    var low = text.toLowerCase(), ql = q.toLowerCase(), out = '', pos = 0, n = 0, i;
    while ((i = low.indexOf(ql, pos)) >= 0) { out += esc(text.slice(pos, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>'; pos = i + q.length; n++; }
    return { html: out + esc(text.slice(pos)), n: n };
  }
  function viewMan(root) {
    setBack('#/quiz');
    var pool = ALLC.filter(function (c) { return (c.kind === 'cmd' || c.kind === 'builtin') && (c.flags || []).length >= 4 && /^[\w.-]+$/.test(c.name); });
    var rounds = 8, i = 0, score = 0, used = {};
    root.innerHTML = '<h1>Man page hunt</h1><p class="muted">Real users look things up in man pages. Find the option that fits the description. Search the page like in <b>less</b>: type a word after <kbd>/</kbd> and press Enter, then use <kbd>n</kbd> and <kbd>N</kbd> to jump between matches.</p>' +
      '<div class="quiz-top"><span class="count" aria-live="polite"></span><div class="progressbar" aria-hidden="true"><i style="transform:scaleX(0)"></i></div></div><div id="manHost"></div>';
    var host = $('#manHost'), top = $('.quiz-top', root);
    function round() {
      $('i', top).style.transform = 'scaleX(' + (i / rounds) + ')';
      if (i >= rounds) return end();
      $('.count', top).textContent = 'Round ' + (i + 1) + ' of ' + rounds + ' · score ' + score;
      var c, tries = 0;
      do { c = pool[Math.floor(Math.random() * pool.length)]; } while (used[c.id] && tries++ < 50);
      used[c.id] = 1;
      var f = c.flags[Math.floor(Math.random() * c.flags.length)];
      var page = newShell().run('man ' + c.name).out, hits = [], at = -1, answered = false;
      host.innerHTML = '<div class="card man-round"><div class="q" id="manq">Find the option of <code>' + esc(c.name) + '</code> that does this: <span class="man-goal">' + esc(f.d) + '</span></div>' +
        '<form class="man-search" autocomplete="off"><label for="manSearch">/</label><input id="manSearch" type="text" data-slash aria-label="Search the manual page" placeholder="search the page" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="search">' +
        '<button class="btn small" type="submit">Search</button><button class="btn small ghost" type="button" data-next-match aria-label="Next match (n)">n</button><button class="btn small ghost" type="button" data-prev-match aria-label="Previous match (N)">N</button><span class="man-hits muted" aria-live="polite"></span></form>' +
        '<pre class="man-page" tabindex="0" role="region" aria-label="Manual page for ' + esc(c.name) + '"></pre>' +
        '<form class="fill-in man-answer" autocomplete="off"><span class="ps" aria-hidden="true">$ ' + esc(c.name) + '</span><input type="text" aria-labelledby="manq" placeholder="option" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done"><button class="btn primary small" type="submit">Check</button></form>' +
        '<div class="feedback" hidden aria-live="polite"></div></div>';
      var pre = $('.man-page', host), sForm = $('.man-search', host), sIn = $('#manSearch'), info = $('.man-hits', host);
      pre.textContent = page;
      function go(d) {
        var marks = $$('mark', pre);
        if (!marks.length) return;
        if (at >= 0) marks[at].classList.remove('cur');
        at = (at + d + marks.length) % marks.length;
        marks[at].classList.add('cur');
        pre.scrollTop = marks[at].offsetTop - pre.clientHeight / 3;
        info.textContent = (at + 1) + ' of ' + marks.length;
      }
      sForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var q = sIn.value.trim(), r = markMatches(page, q);
        pre.innerHTML = r.html; at = -1;
        if (!q) { info.textContent = ''; return; }
        if (!r.n) { info.textContent = 'Pattern not found'; return; }
        go(1);
        pre.focus({ preventScroll: true });
      });
      $('[data-next-match]', sForm).addEventListener('click', function () { go(1); });
      $('[data-prev-match]', sForm).addEventListener('click', function () { go(-1); });
      pre.addEventListener('keydown', function (e) {
        if (e.key === 'n') { e.preventDefault(); go(1); } else if (e.key === 'N') { e.preventDefault(); go(-1); }
        else if (e.key === '/') { e.preventDefault(); sIn.focus(); sIn.select(); }
      });
      var aForm = $('.man-answer', host);
      aForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var v = norm($('input', aForm).value);
        if (!v || answered) return;
        answered = true;
        // also accept the option without its placeholder ("-name" for "-name pattern", "--output" for "--output=file"),
        // unless another option of the same command starts with the same word
        var first = f.f.split(/[ =]/)[0], unique = c.flags.filter(function (x) { return x.f.split(/[ =]/)[0] === first; }).length === 1;
        var forms = [f.f, f.long, f.long ? f.long.replace(/=.*$/, '') : null, /=\w+$/.test(f.f) ? f.f.replace(/=\w+$/, '') : null, unique ? first : null].filter(Boolean);
        var ok = forms.concat(forms.map(function (a) { return c.name + ' ' + a; })).some(function (a) { return norm(a) === v; });
        SRS.answer(c.id, ok); if (ok) score++;
        $('input', aForm).disabled = true;
        var fb = $('.feedback', host);
        fb.hidden = false; fb.className = 'feedback ' + (ok ? 'good' : 'bad');
        fb.innerHTML = (ok ? '<b>✓ Found it!</b>' : '<b>✗ Not that one.</b>') + ' <code>' + esc(f.f) + '</code>' + (f.long ? ' (<code>' + esc(f.long) + '</code>)' : '') + ': ' + esc(f.d) +
          '<div class="row end" style="margin-top:10px"><button class="btn primary" type="button" data-next>Next ›</button></div>';
        var nb = $('[data-next]', fb); nb.addEventListener('click', function () { i++; round(); }); nb.focus({ preventScroll: true });
      });
      if (matchMedia('(pointer: fine)').matches) sIn.focus({ preventScroll: true });
    }
    function end() {
      if (score >= 6) celebrate();
      host.innerHTML = '<div class="card" style="text-align:center"><div class="eyebrow">Man page hunt</div><h2 style="font-size:2.4rem">' + score + ' / ' + rounds + '</h2><p>' + (score >= 6 ? 'You read man pages like a pro.' : 'Searching with / gets faster with practice.') + '</p>' +
        '<div class="row" style="justify-content:center"><button class="btn primary" type="button" data-again>Play again</button><a class="btn ghost" href="#/quiz">All quizzes</a></div></div>';
      $('[data-again]', host).addEventListener('click', function () { route(); });
    }
    round();
  }

  /* ================= SPEED ROUND ================= */
  // #/speed[/<seed>/<friendScore>/<chapters>] — a challenge link replays the same question sequence
  function viewSpeed(root, arg) {
    setBack('#/quiz');
    var parts = (arg || '').split('/'), seed = +parts[0] || newSeed(), friend = /^\d+$/.test(parts[1] || '') ? +parts[1] : null;
    var chs = (parts[2] || '').split('.').map(Number).filter(function (n) { return MODS.get('ch' + (n < 10 ? '0' : '') + n); });
    var mods = chs.length ? chs.map(function (n) { return MODS.get('ch' + (n < 10 ? '0' : '') + n); })
      : C.modules.filter(function (m) { return m.lessons.some(function (l) { return SRS.state.lessons[l.id]; }); });
    if (!mods.length) mods = C.modules.slice(0, 6);
    var pool = mods.reduce(function (a, m) { return a.concat(modCmds(m)); }, []), poolCode = mods.map(function (m) { return m.n; }).join('.');
    root.innerHTML = '<h1>Speed round</h1><p class="muted">Answer as many as you can in 60 seconds. Keys 1–4 work too. Chapters: ' + esc(poolCode.replace(/\./g, ', ')) + '.</p>' +
      (friend !== null ? '<div class="card challenge-banner"><b>🏆 A friend scored ' + friend + '.</b> You get the exact same questions in the same order. Go!</div>' : '') +
      '<div id="speedHost" class="card" style="text-align:center"><p>Best score: <b>' + SRS.state.speed.best + '</b></p><button class="btn primary" type="button" data-start>Start</button></div>';
    var host = $('#speedHost'), timer = null, rng = seeded(seed);
    onLeave(function () { clearInterval(timer); document.removeEventListener('keydown', key); });
    var cur = null, score = 0, left = 60;
    function key(e) { if (cur && /^[1-4]$/.test(e.key)) { var b = $$('.choice', host)[+e.key - 1]; if (b) b.click(); } }
    function q() {
      var old = rand; rand = rng;
      try { return q1(); } finally { rand = old; }
    }
    function q1() {
      var c = pool[Math.floor(rand() * pool.length)], useFlag = (c.flags || []).length && rand() < .5, item;
      if (useFlag) {
        var f = c.flags[Math.floor(rand() * c.flags.length)], ch = shuffle([f.d].concat(pick(ALLC.filter(function (o) { return (o.flags || []).length; }).map(function (o) { return o.flags[Math.floor(rand() * o.flags.length)].d; }), 3, [f.d])));
        item = { q: c.name + ' ' + f.f, mono: true, choices: ch, answer: ch.indexOf(f.d), cmd: c.id };
      } else {
        var ch2 = shuffle([c.name].concat(pick(pool.concat(ALLC).map(function (o) { return o.name; }).filter(function (n, i, a) { return n !== c.name && a.indexOf(n) === i; }), 3, [])));
        item = { q: c.summary, choices: ch2, answer: ch2.indexOf(c.name), cmd: c.id, monoChoices: true };
      }
      cur = item;
      host.innerHTML = '<div class="quiz-top"><span class="timer" aria-live="off">' + left + '</span><span class="grow"></span><b aria-live="polite">Score ' + score + '</b></div><div class="q' + (item.mono ? ' mono' : '') + '">' + esc(item.q) + '</div><div class="choices"></div>';
      item.choices.forEach(function (c2, i) {
        var b = el('<button type="button" class="choice' + (item.monoChoices ? ' mono' : '') + '"><span class="n">' + (i + 1) + '</span><span>' + esc(c2) + '</span></button>');
        b.addEventListener('click', function () {
          if (cur !== item) return;
          var ok = i === item.answer; cur = null;
          SRS.answer(item.cmd, ok); if (ok) score++;
          b.classList.add(ok ? 'right' : 'wrong');
          setTimeout(function () { if (left > 0) q(); }, ok ? 180 : 600);
        });
        $('.choices', host).appendChild(b);
      });
    }
    $('[data-start]', host).addEventListener('click', function () {
      document.addEventListener('keydown', key);
      q();
      timer = setInterval(function () {
        left--; var t = $('.timer', host); if (t) t.textContent = left;
        if (left <= 0) {
          clearInterval(timer); cur = null;
          var nb = SRS.speedResult(score); if (score) SRS.addXP(score * 2, 'speed');
          if (nb && score) celebrate();
          var vs = friend === null ? '' : '<p class="versus">' + (score > friend ? '🏆 You beat your friend (' + friend + ')!' : score === friend ? '🤝 A tie (' + friend + ').' : 'Your friend scored ' + friend + '. Rematch?') + '</p>';
          host.innerHTML = '<div class="eyebrow">Time!</div><h2 style="font-size:2.4rem">' + score + '</h2>' + vs + '<p>' + (nb && score ? 'New best score! ' : 'Best: ' + SRS.state.speed.best + '. ') + '+' + score * 2 + ' XP</p><div class="row" style="justify-content:center"><button class="btn primary" type="button" data-share>Challenge a friend</button><button class="btn" type="button" data-again>Play again</button><a class="btn" href="#/quiz/weak">Drill weak commands</a></div><div class="share-box"></div>';
          $('[data-again]', host).addEventListener('click', function () { if (location.hash === '#/speed') route(); else location.hash = '#/speed'; });
          $('[data-share]', host).addEventListener('click', function () {
            shareLink(location.href.split('#')[0] + '#/speed/' + seed + '/' + score + '/' + poolCode, 'I scored ' + score + ' in a 60-second Linux command speed round. Same questions for you. Beat it!', $('.share-box', host));
          });
        }
      }, 1000);
    });
  }

  /* ================= CHEAT SHEET ================= */
  function viewCheats(root) {
    var cmds = Array.from(CMDS.values()).sort(function (a, b) { return a.module.n - b.module.n || a.name.localeCompare(b.name); });
    var terms = [];
    LESSON_ORDER.forEach(function (l) { (l.terms || []).forEach(function (t) { terms.push({ t: t, l: l }); }); });
    root.innerHTML = '<h1>Cheat sheet</h1><div class="cheat-tools"><label class="sr-only" for="cs">Search</label><input id="cs" type="search" placeholder="Search commands, options, keys…  (press /)" autocapitalize="off" autocorrect="off" spellcheck="false">' +
      '<label class="sr-only" for="cch">Chapter</label><select id="cch"><option value="">All chapters</option>' + C.modules.map(function (m) { return '<option value="' + m.n + '">Ch ' + m.n + ' · ' + esc(m.title) + '</option>'; }).join('') + '</select>' +
      '<label class="row" style="gap:8px;min-height:44px"><input type="checkbox" id="cterms" style="width:22px;height:22px"> Keys &amp; syntax</label></div><p class="count" id="ccount" aria-live="polite"></p><ul class="cheat-list" id="clist"></ul>';
    var list = $('#clist'), frag = document.createDocumentFragment();
    cmds.forEach(function (c) {
      var li = el('<li class="cheat" data-cmd="' + esc(c.id) + '"><button type="button" aria-expanded="false"><span class="nm">' + esc(c.name) + '</span><span class="sm">' + esc(c.summary) + '</span><span class="meta">Ch ' + c.chapters.join(', ') + ' · ' + esc(c.kind) + ((c.flags || []).length ? ' · ' + plural(c.flags.length, 'option') : '') + '</span></button></li>');
      li._s = (c.name + ' ' + c.summary + ' ' + (c.flags || []).map(function (f) { return f.f + ' ' + (f.long || '') + ' ' + f.d; }).join(' ')).toLowerCase();
      li._ch = c.chapters;
      $('button', li).addEventListener('click', function () {
        var b = this, open = b.getAttribute('aria-expanded') === 'true', more = $('.more', li);
        b.setAttribute('aria-expanded', String(!open));
        if (open) { more.remove(); return; }
        more = el('<div class="more">' + (c.syntax ? '<code>' + esc(c.syntax) + '</code>' : '') + ((c.flags || []).length ? '<ul>' + c.flags.map(function (f) { return '<li><code>' + esc(f.f) + '</code> ' + esc(f.d) + '</li>'; }).join('') + '</ul>' : '') +
          '<div class="row"><a class="btn small" href="#/cmd/' + esc(c.id) + '">Open lesson</a>' + (shell.simulated(c.name) ? '<a class="btn small ghost" href="#/terminal">Try in terminal</a>' : '') + '</div></div>');
        li.appendChild(more);
        anim(more, [{ opacity: 0 }, { opacity: 1 }], { duration: 160 });
      });
      frag.appendChild(li);
    });
    terms.forEach(function (x) {
      var li = el('<li class="cheat term-kind" data-term hidden><a class="cheat-link" href="#/lesson/' + esc(x.l.id) + '"><span class="nm">' + esc(x.t.t) + '</span><span class="sm">' + esc(x.t.d) + '</span><span class="meta">Ch ' + x.l.module.n + ' · ' + esc(x.l.title) + '</span></a></li>');
      li._s = (x.t.t + ' ' + x.t.d).toLowerCase(); li._ch = [x.l.module.n]; li._term = true;
      frag.appendChild(li);
    });
    list.appendChild(frag);
    var items = Array.from(list.children), qi = $('#cs'), chs = $('#cch'), ct = $('#cterms');
    function filter() {
      var q = qi.value.trim().toLowerCase(), ch = +chs.value, withTerms = ct.checked, n = 0;
      items.forEach(function (li) {
        var show = (!li._term || withTerms) && (!q || li._s.indexOf(q) >= 0) && (!ch || li._ch.indexOf(ch) >= 0);
        li.hidden = !show; if (show) n++;
      });
      $('#ccount').textContent = n + ' shown · ' + cmds.length + ' commands and constructs' + (withTerms ? ' + ' + terms.length + ' keys & syntax entries' : '');
    }
    var deb; qi.addEventListener('input', function () { clearTimeout(deb); deb = setTimeout(filter, 80); });
    chs.addEventListener('change', filter); ct.addEventListener('change', filter);
    filter();
  }

  /* ================= PROGRESS ================= */
  var installEvt = null;
  addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); installEvt = e; });
  function viewProgress(root) {
    setBack('#/');
    var s = SRS.state, ls = SRS.levelSpan(), weak = SRS.weak(), boxes = [0, 0, 0, 0, 0];
    Object.keys(s.cards).forEach(function (k) { boxes[s.cards[k][0] - 1]++; });
    var isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    root.innerHTML = '<h1>Progress</h1>' +
      '<div class="stats"><div class="stat"><b>' + ls.level + '</b><span>Level · ' + s.xp + ' XP</span><div class="xpbar"><i style="transform:scaleX(' + (ls.into / ls.need).toFixed(3) + ')"></i></div></div>' +
      '<div class="stat"><b>🔥 ' + SRS.streakNow() + '</b><span>Streak · best ' + s.streak.best + '</span></div><div class="stat"><b>' + Object.keys(s.lessons).length + '/' + LESSON_ORDER.length + '</b><span>Lessons</span></div></div>' +
      '<div class="stats" style="margin-top:10px"><div class="stat"><b>' + Object.keys(s.tasks).length + '</b><span>Tasks done</span></div><div class="stat"><b>' + s.counts.correct + '</b><span>Correct answers</span></div><div class="stat"><b>' + s.counts.reviews + '</b><span>Card reviews</span></div></div>' +
      '<h2 class="section">Activity</h2><div class="card" id="actChart"></div>' +
      '<h2 class="section">Memory strength</h2><div class="card" id="memChart"></div>' +
      '<h2 class="section">Chapters</h2><div class="grid stagger">' + C.modules.map(function (m, i) { return '<a class="card mod" style="--i:' + Math.min(i, 12) + '" href="#/module/' + m.id + '">' + ring(modPct(m)) + '<div><span class="num">Chapter ' + m.n + '</span><h3>' + esc(m.title) + '</h3></div></a>'; }).join('') + '</div>' +
      '<h2 class="section">Badges</h2><div class="badges">' + SRS.BADGES.map(function (b) { var got = s.badges[b.id]; return '<div class="badge' + (got ? ' got' : '') + '"><span class="ico" aria-hidden="true">' + b.icon + '</span><b>' + esc(b.name) + '</b><small>' + esc(b.d) + '</small><span class="sr-only">' + (got ? 'earned' : 'locked') + '</span></div>'; }).join('') + '</div>' +
      '<h2 class="section">Weak commands</h2>' + (weak.length ? '<div class="weak-list">' + weak.map(function (id) { var c = CMDS.get(id); return c ? '<a class="chip" href="#/cmd/' + esc(id) + '">' + esc(c.name) + '</a>' : ''; }).join('') + '</div><div class="row" style="margin-top:10px"><a class="btn primary" href="#/quiz/weak">Drill them</a><a class="btn" href="#/cards/weak">As flashcards</a></div>' : '<p class="muted">Nothing yet. Commands you miss twice or more show up here.</p>') +
      '<h2 class="section">Flashcard boxes</h2><div class="boxes">' + boxes.map(function (n, i) { return '<span class="pill">Box ' + (i + 1) + ': ' + n + '</span>'; }).join('') +
      '<span class="pill">Tasks due to redo: ' + dueTaskIds().length + '</span><span class="pill">Typed answers right: ' + s.counts.recalled + '</span></div>' +
      '<h2 class="section">Settings</h2><div class="card"><div class="row"><span class="grow">Theme</span><div class="seg" role="group" aria-label="Theme">' + ['system', 'dark', 'light'].map(function (t) { return '<button type="button" data-theme-set="' + t + '" aria-pressed="' + (s.settings.theme === t) + '">' + t[0].toUpperCase() + t.slice(1) + '</button>'; }).join('') + '</div></div></div>' +
      '<div class="card" id="promptStudio"></div>' +
      '<div class="card"><h3>Backup &amp; sync</h3><p class="muted">Progress is saved in this browser only. Export it to move it to another device, or as a backup' + (isIOS && !standalone ? '. Safari may clear site data after 7 days without a visit, so export regularly or add the app to your Home Screen' : '') + '.</p>' +
      '<div class="row"><button class="btn primary" type="button" data-export>Export progress (.json)</button><label class="btn" for="importFile">Import file</label><input id="importFile" type="file" accept=".json,application/json" class="sr-only"><button class="btn ghost" type="button" data-paste>Paste JSON</button></div><div id="ioArea"></div></div>' +
      '<div class="card"><h3>Install</h3>' + (standalone ? '<p>Installed. It works offline.</p>' : isIOS ? '<p>In Safari, tap <b>Share</b> → <b>Add to Home Screen</b>. It works offline after the first visit.</p>' : '<p>Install the app for offline use and a full-screen terminal.</p><button class="btn" type="button" data-install ' + (installEvt ? '' : 'disabled') + '>Install app</button>') + '</div>' +
      '<div class="card"><h3>Keyboard shortcuts</h3><p class="muted">Alt+1…6 switch tabs · / search the cheat sheet · Man page hunt: / search, n / N next and previous match · Flashcards: Space flip, 1–4 grade (Again/Hard/Good/Easy), ← Again, → Good, ↑ Easy · Quiz: 1–9 choose, Enter next · Terminal: Tab complete, ↑/↓ history, Ctrl-A/E/U/K/W/L/C</p></div>' +
      '<div class="card"><h3>About</h3><p class="muted">All lessons are paraphrased from <cite>' + esc(C.book) + '</cite> (No Starch Press). This trainer is a study companion, not a replacement for the book.</p><button class="btn danger small" type="button" data-reset>Reset all progress</button></div>';
    $$('[data-theme-set]', root).forEach(function (b) { b.addEventListener('click', function () { setTheme(b.dataset.themeSet); route(true); }); });
    promptStudio($('#promptStudio'));
    activityChart($('#actChart'));
    memoryChart($('#memChart'));
    $('[data-export]', root).addEventListener('click', function () {
      var json = SRS.exportJSON(), name = 'linux-cli-progress-' + new Date().toISOString().slice(0, 10) + '.json', blob = new Blob([json], { type: 'application/json' });
      var file = null; try { file = new File([blob], name, { type: 'application/json' }); } catch (e) { /* old Safari */ }
      if (file && navigator.canShare && navigator.canShare({ files: [file] }) && matchMedia('(pointer: coarse)').matches) { navigator.share({ files: [file], title: 'Linux CLI progress' }).catch(function () {}); }
      else { var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }
      $('#ioArea').innerHTML = '<p class="muted" style="margin-top:10px">If the download did not start, copy this text and save it:</p><textarea readonly aria-label="Progress JSON">' + esc(json) + '</textarea>';
      toast('Progress exported');
    });
    function doImport(text) {
      if (!confirm('Replace your current progress with the imported file? (Your current progress is kept as a backup.)')) return;
      try { SRS.importJSON(text); toast('Progress imported'); renderTop(); } catch (e) { alert(e.message || 'Could not read that file.'); }
    }
    $('#importFile').addEventListener('change', function (e) { var f = e.target.files[0]; if (!f) return; var r = new FileReader(); r.onload = function () { doImport(String(r.result)); }; r.readAsText(f); e.target.value = ''; });
    $('[data-paste]', root).addEventListener('click', function () {
      $('#ioArea').innerHTML = '<textarea id="pasteBox" aria-label="Paste exported JSON here" placeholder="Paste exported JSON here" style="margin-top:10px"></textarea><div class="row" style="margin-top:8px"><button class="btn primary small" type="button" data-doimport>Import</button></div>';
      $('[data-doimport]', root).addEventListener('click', function () { doImport($('#pasteBox').value); });
    });
    var ib = $('[data-install]', root); if (ib) ib.addEventListener('click', function () { if (installEvt) { installEvt.prompt(); installEvt = null; ib.disabled = true; } });
    $('[data-reset]', root).addEventListener('click', function () { if (confirm('Reset all progress? A backup copy is kept in this browser.')) { SRS.reset(); toast('Progress reset'); } });
  }

  /* ================= PLAY: story mode, escape rooms, command golf, bosses ================= */
  var GAMES = C.games || {};
  var STORY = GAMES.story || [], ROOMS = GAMES.rooms || [], GOLF = GAMES.golf || [], BOSSES = GAMES.bosses || [];
  var MISSIONS = [];
  STORY.forEach(function (d) { d.missions.forEach(function (m) { m.day = d; MISSIONS.push(m); }); });
  var GAME_BY = { story: {}, room: {}, golf: {}, boss: {} };
  MISSIONS.forEach(function (m) { GAME_BY.story[m.id] = m; });
  ROOMS.forEach(function (r) { GAME_BY.room[r.id] = r; });
  GOLF.forEach(function (h) { GAME_BY.golf[h.id] = h; });
  BOSSES.forEach(function (b) { GAME_BY.boss[b.id] = b; });
  function mmss(sec) { sec = Math.max(0, Math.round(sec)); return Math.floor(sec / 60) + ':' + two(sec % 60); }
  function two(n) { return (n < 10 ? '0' : '') + n; }
  function missionOpen(i) { return i === 0 || SRS.gameDone(MISSIONS[i - 1].id) || SRS.gameDone(MISSIONS[i].id); }
  function gameInfo(id) { return SRS.state.games[id] || null; }

  function viewPlay(root) {
    var doneM = MISSIONS.filter(function (m) { return SRS.gameDone(m.id); }).length;
    var html = '<h1>Play</h1><p class="muted">Learn by doing: story missions, escape rooms, command golf and boss fights, all in the practice terminal.</p>';
    if (MISSIONS.length) {
      html += '<h2 class="section">📖 Story: your first week (' + doneM + '/' + MISSIONS.length + ')</h2><div class="grid stagger">';
      STORY.forEach(function (d, di) {
        html += '<div class="card play-day" style="--i:' + di + '"><h3>' + esc(d.title) + '</h3>' + (d.intro ? '<p class="muted">' + esc(d.intro) + '</p>' : '') + '<ul class="lesson-list">';
        d.missions.forEach(function (m) {
          var i = MISSIONS.indexOf(m), open = missionOpen(i), done = SRS.gameDone(m.id);
          html += '<li>' + (open ? '<a class="lesson-link" href="#/play/story/' + esc(m.id) + '">' : '<span class="lesson-link locked" aria-disabled="true">') +
            '<span class="check' + (done ? ' done' : '') + '">' + (done ? ICON.check : open ? '›' : '🔒') + '</span><span class="grow">' + esc(m.title) + '<small>' + plural(m.steps.length, 'step') + '</small></span>' + (open ? '</a>' : '</span>') + '</li>';
        });
        html += '</ul></div>';
      });
      html += '</div>';
    }
    if (ROOMS.length) {
      html += '<h2 class="section">🗝️ Escape rooms</h2><div class="grid stagger">' + ROOMS.map(function (r, i) {
        var g = gameInfo(r.id);
        return '<a class="card mod" href="#/play/room/' + esc(r.id) + '" style="--i:' + i + '"><div class="ring play-ico">' + (g ? '🔓' : '🚪') + '</div><div><span class="num">' + '★'.repeat(r.difficulty || i + 1) + '</span><h3>' + esc(r.title) + '</h3><p>' + (g ? 'Escaped in ' + mmss(g.best) + (g.hints ? ' · ' + plural(g.hints, 'hint') : ' · no hints') : 'Find the way out with real commands') + '</p></div></a>';
      }).join('') + '</div>';
    }
    if (GOLF.length) {
      html += '<h2 class="section">⛳ Command golf</h2><p class="muted">Reach the goal in as few keystrokes as possible. Par is the length of a short, clean solution.</p><div class="grid stagger golf-grid">' + GOLF.map(function (h, i) {
        var g = gameInfo(h.id), par = h.par.length;
        return '<a class="card mod" href="#/play/golf/' + esc(h.id) + '" style="--i:' + Math.min(i, 12) + '"><div class="ring play-ico">' + (g ? (g.under ? '🏌️' : '✓') : (i + 1)) + '</div><div><span class="num">Par ' + par + '</span><h3>' + esc(h.title) + '</h3><p>' + (g ? 'Best ' + g.best + (g.best <= par ? ' (at or under par!)' : ' (' + (g.best - par) + ' over)') : 'Not played yet') + '</p></div></a>';
      }).join('') + '</div>';
    }
    if (BOSSES.length) {
      html += '<h2 class="section">⚔️ Boss fights</h2><div class="grid stagger">' + BOSSES.map(function (b, i) {
        var g = gameInfo(b.id);
        return '<a class="card mod" href="#/play/boss/' + esc(b.id) + '" style="--i:' + i + '"><div class="ring play-ico">' + (g ? '🏆' : '👾') + '</div><div><span class="num">' + esc(PARTS[b.part] || '') + '</span><h3>' + esc(b.title) + '</h3><p>' + (g ? 'Defeated · best ' + mmss(g.best) : (b.kind === 'quiz' ? 'Quiz battle' : 'Terminal battle') + ' · ' + mmss(b.time) + ' on the clock') + '</p></div></a>';
      }).join('') + '</div>';
    }
    if (!MISSIONS.length && !ROOMS.length && !GOLF.length && !BOSSES.length) html += '<div class="card"><p>No games yet.</p></div>';
    root.innerHTML = html;
  }

  function viewGame(root, kind, id) {
    var game = (GAME_BY[kind] || {})[id];
    if (!game) { location.hash = '#/play'; return; }
    setBack('#/play');
    if (kind === 'boss' && game.kind === 'quiz') return quizBoss(root, game);
    if (kind === 'story' && !missionOpen(MISSIONS.indexOf(game))) { location.hash = '#/play'; return; }
    var steps = kind === 'room' || kind === 'golf' ? null : game.steps, si = 0, timer = null, t0 = Date.now(), over = false;
    var strokes = 0, hintsUsed = 0, gaveUp = false, peeked = false, timeLeft = game.time || 0, penalty = 0, hinted = {};
    var page = el('<div class="term-page with-task game-page"></div>');
    var side = el('<div class="term-side"></div>'), panel = el('<section class="task-panel game-panel" aria-label="Game"></section>'), treeHost = el('<div class="tree-host"></div>');
    side.appendChild(panel); side.appendChild(treeHost); page.appendChild(side);
    var host = el('<div class="term-host" style="min-height:0"></div>');
    page.appendChild(host); root.appendChild(page);
    var freeShell = shell, freeTranscript = transcript;   // the free-play terminal comes back when you leave the game
    onLeave(function () { shell = freeShell; transcript = freeTranscript; });
    function fresh() {
      shell = userShell(); shell.load(game.setup);
      transcript = [{ c: 'note', h: esc(kind === 'golf' ? 'Hole loaded. Every character you type counts.' : kind === 'room' ? 'The room is set. Look around.' : 'Ready.') + ' You are in <code>' + esc(shell.cwd) + '</code>.' }];
    }
    fresh();
    var tree = new LiveTree(treeHost), tv;
    var eyebrow = kind === 'story' ? 'Story · ' + game.day.title : kind === 'room' ? 'Escape room · ' + '★'.repeat(game.difficulty || 1) : kind === 'golf' ? 'Command golf · par ' + game.par.length : 'Boss · ' + (PARTS[game.part] || '');
    panel.innerHTML = '<p class="eyebrow">' + esc(eyebrow) + '</p><h1 class="game-title">' + esc(game.title) + '</h1>' +
      (kind === 'boss' ? '<div class="boss-hud"><div class="hpbar" role="progressbar" aria-label="Boss health" aria-valuemin="0" aria-valuemax="' + steps.length + '"><i></i></div><span class="timer" role="timer" aria-live="off"></span></div>' : '') +
      (kind === 'room' ? '<div class="boss-hud"><span class="muted">Time</span><span class="timer" aria-live="off">0:00</span></div>' : '') +
      (kind === 'golf' ? '<div class="golf-hud"><span>Strokes <b class="strokes">0</b></span><span>Par <b>' + game.par.length + '</b></span></div>' : '') +
      '<p class="game-intro">' + esc(game.intro || game.goal) + '</p>' + (kind === 'golf' && game.intro ? '<p><b>Goal:</b> ' + esc(game.goal) + '</p>' : '') +
      (steps ? '<ol class="steps"></ol>' : '') +
      '<div class="task-status muted" aria-live="polite"></div>' +
      '<div class="row task-actions"></div><div class="task-reveal muted" aria-live="polite"></div>';
    var stepsEl = $('.steps', panel), status = $('.task-status', panel), actions = $('.task-actions', panel), reveal = $('.task-reveal', panel);
    function drawSteps() {
      if (!stepsEl) return;
      stepsEl.innerHTML = steps.map(function (st, i) {
        if (i < si) return '<li class="done">' + ICON.check + '<span>' + esc(st.goal) + '</span></li>';
        if (i === si) return '<li class="cur" aria-current="step"><span>' + esc(st.goal) + '</span></li>';
        return '<li class="todo"><span>Step ' + (i + 1) + '</span></li>';
      }).join('');
      if (kind === 'boss') { $('.hpbar i', panel).style.transform = 'scaleX(' + (1 - si / steps.length) + ')'; $('.hpbar', panel).setAttribute('aria-valuenow', steps.length - si); }
    }
    function drawActions() {
      if (over) return;
      if (kind === 'golf') actions.innerHTML = '<button class="btn small" type="button" data-restart>Restart hole</button><button class="btn small ghost" type="button" data-show>Show par solution</button>';
      else if (kind === 'room') actions.innerHTML = '<button class="btn small" type="button" data-hint>Hint (' + (game.hints.length - hintsUsed) + ' left)</button><button class="btn small ghost" type="button" data-show>Give up</button>';
      else actions.innerHTML = '<button class="btn small" type="button" data-hint>Hint' + (kind === 'boss' ? ' (−15 s)' : '') + '</button>' + (kind === 'story' ? '<button class="btn small ghost" type="button" data-show>Show solution</button>' : '');
      var hb = $('[data-hint]', actions), sb = $('[data-show]', actions), rb = $('[data-restart]', actions);
      if (hb) hb.addEventListener('click', function () {
        if (kind === 'room') {
          if (hintsUsed >= game.hints.length) return;
          reveal.innerHTML = game.hints.slice(0, ++hintsUsed).map(function (h, i) { return '<p>💡 ' + (i + 1) + '. ' + esc(h) + '</p>'; }).join('');
          drawActions();
        } else {
          reveal.textContent = '💡 ' + (steps[si].hint || 'Think about which command fits.');
          if (kind === 'boss' && !hinted[si]) { hinted[si] = 1; penalty += 15; tick(); }
        }
        tv.input.focus({ preventScroll: true });
      });
      if (sb) sb.addEventListener('click', function () {
        if (kind === 'golf') { peeked = true; reveal.innerHTML = 'Par solution: <code>' + esc(game.par) + '</code> (' + game.par.length + ' characters). Peeking means this round won’t count toward your best.'; }
        else if (kind === 'room') { gaveUp = true; reveal.innerHTML = '<p>One way out:</p><ol class="sol">' + [].concat(game.solution).map(function (c) { return '<li><code>' + esc(c) + '</code></li>'; }).join('') + '</ol>'; }
        else { var sol = [].concat(steps[si].solution); reveal.innerHTML = 'Solution: ' + sol.map(function (c) { return '<code>' + esc(c) + '</code>'; }).join(' then ') + (sol.length === 1 ? ' <button class="btn small" type="button" data-type>Type it for me</button>' : ''); var tb = $('[data-type]', reveal); if (tb) tb.addEventListener('click', function () { tv.typeRun(sol[0]); }); }
      });
      if (rb) rb.addEventListener('click', function () {
        fresh(); strokes = 0; peeked = false; $('.strokes', panel).textContent = '0'; reveal.textContent = ''; status.textContent = '';
        tv.restore(); tv.updatePs(); tree.open = new Set(); tree.draw(tree.capture()); tv.input.focus({ preventScroll: true });
      });
    }
    function tick() {
      var el2 = $('.timer', panel); if (!el2) return;
      var used = (Date.now() - t0) / 1000 + penalty;
      if (kind === 'room') el2.textContent = mmss(used);
      if (kind === 'boss') {
        var left = timeLeft - used; el2.textContent = mmss(left); el2.classList.toggle('low', left <= 30);
        if (left <= 0 && !over) lose();
      }
    }
    function finish(win, extra) {
      over = true; clearInterval(timer); actions.innerHTML = ''; tv.input.blur();
      panel.classList.add(win ? 'done' : 'lost');
      if (win) celebrate();
      status.innerHTML = extra;
    }
    function lose() {
      finish(false, '<p class="lose">⏱️ Time’s up! The boss got away.</p><div class="row"><button class="btn primary" type="button" data-retry>Try again</button><a class="btn" href="#/play">Back to Play</a></div>');
      $('[data-retry]', status).addEventListener('click', function () { route(); });
    }
    function nextLink() {
      if (kind === 'story') { var nx = MISSIONS[MISSIONS.indexOf(game) + 1]; return nx ? '<a class="btn primary" href="#/play/story/' + esc(nx.id) + '">Next mission ›</a>' : ''; }
      var list = kind === 'room' ? ROOMS : kind === 'golf' ? GOLF : BOSSES, n2 = list[list.indexOf(game) + 1];
      return n2 ? '<a class="btn primary" href="#/play/' + kind + '/' + esc(n2.id) + '">Next ' + (kind === 'golf' ? 'hole' : kind === 'room' ? 'room' : 'boss') + ' ›</a>' : '';
    }
    function win() {
      var used = Math.round((Date.now() - t0) / 1000 + penalty), msg = '', res, xp = 0;
      if (kind === 'boss' && timeLeft - used <= 0) return lose();
      if (kind === 'story') { res = SRS.gameResult(game.id); xp = res.first ? 25 : 0; msg = '<p class="win">✓ Mission complete!</p>' + (game.outro ? '<p>' + esc(game.outro) + '</p>' : ''); }
      else if (kind === 'room') {
        if (gaveUp) { msg = '<p class="win">🚪 You’re out, with the solution’s help. Try again without it to earn the badge and XP.</p>'; }
        else { res = SRS.gameResult(game.id, { best: used, hints: hintsUsed }); xp = res.first ? Math.max(10, 50 - hintsUsed * 10) : 0; msg = '<p class="win">🔓 Escaped in ' + mmss(used) + (hintsUsed ? ' with ' + plural(hintsUsed, 'hint') : ' without hints') + '!</p>' + (res.improved ? '<p>New best time!</p>' : ''); }
        if (game.outro) msg += '<p>' + esc(game.outro) + '</p>';
      } else if (kind === 'golf') {
        var par = game.par.length, d = strokes - par, under = d <= 0;
        if (peeked) res = { first: false, improved: false };   // looked at the answer: practice round only
        else { res = SRS.gameResult(game.id, { best: strokes, under: under }); xp = res.first ? 15 + (under ? 10 : 0) : 0; }
        msg = '<p class="win">⛳ ' + strokes + ' strokes · ' + (d < 0 ? (-d) + ' under par! 🦅' : d === 0 ? 'right on par!' : d + ' over par') + '</p>' + (res.improved ? '<p>New personal best!</p>' : '') +
          (peeked ? '<p class="muted">Practice round (you peeked at par), so it isn’t scored. Play again to set a best.</p>' : '') + '<p>Par solution: <code>' + esc(game.par) + '</code></p>' + (game.tip ? '<p class="muted">' + esc(game.tip) + '</p>' : '');
      } else {
        res = SRS.gameResult(game.id, { best: used }); xp = res.first ? 100 : 0;
        msg = '<p class="win">🏆 ' + esc(game.title) + ' is defeated with ' + mmss(timeLeft - used) + ' to spare!</p>' + (res.improved ? '<p>New best time!</p>' : '');
      }
      if (xp) { SRS.addXP(xp, kind); msg += '<p class="muted">+' + xp + ' XP</p>'; }
      finish(true, msg + '<div class="row">' + nextLink() + '<a class="btn" href="#/play">Back to Play</a>' + (kind === 'golf' ? '<button class="btn ghost" type="button" data-retry>Play again</button>' : '') + '</div>');
      var rr = $('[data-retry]', status); if (rr) rr.addEventListener('click', function () { route(); });
    }
    function after(before, line, r) {
      tree.update(before, line);
      if (over || !line.trim()) return;
      if (kind === 'golf') { strokes += line.trim().length; $('.strokes', panel).textContent = strokes; }
      if (steps) {
        if (shell.check(steps[si].check, r).every(Boolean)) {
          si++; reveal.textContent = '';
          if (si >= steps.length) { drawSteps(); return win(); }
          drawSteps();
          status.textContent = '✓ Step ' + si + ' done. Step ' + (si + 1) + ' of ' + steps.length + ': ' + steps[si].goal;
          if (kind === 'boss') { var hp = $('.hpbar', panel); anim(hp, [{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'none' }], { duration: 260 }); }
          anim($('.steps li.cur', panel), [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 260 });
        }
      } else if (shell.check(game.check, r).every(Boolean)) win();
    }
    tv = new TermView(host, {
      chips: ['ls', 'cd', 'cat', 'grep', 'find', 'chmod', 'echo', 'sort'], title: kind === 'golf' ? 'golf' : kind, treeToggle: true,
      onBefore: function () { return tree.capture(); },
      onAfter: after,
      onReset: function () {
        fresh(); tv.restore(); tv.updatePs(); tree.open = new Set(); tree.draw(tree.capture());
        if (kind === 'golf') { strokes = 0; peeked = false; $('.strokes', panel).textContent = '0'; }
        if (steps && !over) { si = 0; reveal.textContent = ''; drawSteps(); status.textContent = 'Files reset, so the steps start again from step 1.'; }   // later steps need earlier ones' files
      },
      onTree: function (on) { page.classList.toggle('show-tree', on); if (on) tree.focusRow(); requestAnimationFrame(onViewport); }
    });
    $('.term', host).style.height = '100%';
    document.body.classList.add('route-terminal');   // full-height layout like the terminal page
    drawSteps(); drawActions();
    if (kind === 'room' || kind === 'boss') { tick(); timer = setInterval(tick, 1000); }
    onLeave(function () { clearInterval(timer); over = true; });
    requestAnimationFrame(onViewport);
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) tv.input.focus({ preventScroll: true });
  }

  // Part IV boss: a timed quiz battle with lives (scripting isn't simulated)
  function quizBoss(root, b) {
    var pool = [];
    b.chapters.forEach(function (n) {
      var m = MODS.get('ch' + (n < 10 ? '0' : '') + n); if (!m) return;
      m.lessons.forEach(function (l) { (l.quiz || []).forEach(function (q) { pool.push(Object.assign({}, q)); }); });
    });
    pool = pool.concat(pairQuestions(function (p) { return b.chapters.indexOf(p.ch) >= 0; }));
    // enough questions to absorb every life: HP = count, each miss costs a life instead of the fight
    var qs = shuffle(pool).slice(0, b.count + b.lives - 1), hpMax = Math.min(b.count, qs.length), hp = hpMax, lives = b.lives, t0 = Date.now(), timer = null, over = false, i = 0;
    root.innerHTML = '<p class="eyebrow">Boss · ' + esc(PARTS[b.part] || '') + '</p><h1>' + esc(b.title) + '</h1><p class="muted">' + esc(b.intro) + '</p>' +
      '<div class="card boss-arena"><div class="boss-hud"><span aria-hidden="true" class="boss-face">👾</span><div class="hpbar" role="progressbar" aria-label="Boss health" aria-valuemin="0"><i></i></div><span class="timer" role="timer" aria-live="off"></span></div>' +
      '<div class="lives" aria-live="polite"></div></div><div id="bossQ"></div>';
    if (!qs.length) { $('#bossQ').innerHTML = '<div class="card"><p>This boss has no questions yet.</p><a class="btn" href="#/play">Back to Play</a></div>'; return; }
    var hpEl = $('.hpbar i', root), livesEl = $('.lives', root), host = $('#bossQ'), timerEl = $('.timer', root), box = null;
    var shownLives = -1;
    function hud() {
      hpEl.style.transform = 'scaleX(' + (hp / hpMax) + ')';
      var bar = hpEl.parentNode; bar.setAttribute('aria-valuemax', hpMax); bar.setAttribute('aria-valuenow', hp); bar.setAttribute('aria-valuetext', hp + ' of ' + hpMax + ' health left');
      if (lives !== shownLives) { shownLives = lives; livesEl.textContent = 'Lives: ' + '❤️'.repeat(lives) + '🖤'.repeat(b.lives - lives); }   // announce only real changes
    }
    function tick() { var left = b.time - (Date.now() - t0) / 1000; timerEl.textContent = mmss(left); timerEl.classList.toggle('low', left <= 30); if (left <= 0 && !over) end(false, '⏱️ Time’s up!'); }
    function key(e) { if (box && box._key) box._key(e); }
    document.addEventListener('keydown', key);
    function next() {
      if (over) return;
      if (hp <= 0) return end(true);
      if (i >= qs.length) return end(false, 'Out of questions.');
      box = renderQuestion(host, qs[i++], function (ok) {
        if (ok) { hp--; anim($('.boss-face', root), [{ transform: 'rotate(-12deg) scale(.9)' }, { transform: 'none' }], { duration: 300 }); }
        else { lives--; anim(livesEl, [{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'none' }], { duration: 300 }); }
        hud();
        if (lives <= 0) return end(false, '💔 Out of lives.');
        next();
      });
    }
    function end(won, why) {
      over = true; clearInterval(timer); box = null;
      var used = Math.round((Date.now() - t0) / 1000), msg;
      if (won) {
        var res = SRS.gameResult(b.id, { best: used });
        if (res.first) SRS.addXP(100, 'boss');
        celebrate();
        msg = '<p class="win">🏆 ' + esc(b.title) + ' is defeated in ' + mmss(used) + '!</p>' + (res.first ? '<p class="muted">+100 XP</p>' : res.improved ? '<p>New best time!</p>' : '');
      } else msg = '<p class="lose">' + esc(why) + ' The boss escapes this time.</p>';
      host.innerHTML = '<div class="card" style="text-align:center">' + msg + '<div class="row" style="justify-content:center"><button class="btn primary" type="button" data-retry>' + (won ? 'Fight again' : 'Try again') + '</button><a class="btn" href="#/play">Back to Play</a></div></div>';
      $('[data-retry]', host).addEventListener('click', function () { route(); });
    }
    onLeave(function () { over = true; clearInterval(timer); document.removeEventListener('keydown', key); });
    hud(); tick(); timer = setInterval(tick, 1000);
    next();
  }

  /* ================= PROGRESS CHARTS: activity heatmap + memory strength ================= */
  var HEAT_WEEKS = 18;
  function dayLabel(d, opts) { return new Date(d * 86400000).toLocaleDateString(undefined, Object.assign({ timeZone: 'UTC' }, opts || { weekday: 'short', month: 'short', day: 'numeric' })); }
  function heatLevel(xp) { return xp <= 0 ? 0 : xp < 20 ? 1 : xp < 50 ? 2 : xp < 100 ? 3 : 4; }
  // Sequential, one hue: darker green = more XP that day. Readout on hover/tap; the table holds the same numbers.
  function activityChart(box) {
    var act = SRS.state.activity, t = SRS.today(), first = t - (HEAT_WEEKS * 7 - 1);
    var start = first - ((first + 4) % 7);            // day 0 (1970-01-01) was a Thursday: step back to Sunday
    var cells = '', activeDays = 0, best = 0, bestDay = 0, weeks = [];
    for (var d = start; d <= t; d++) {
      var xp = act[d] || 0, wk = Math.floor((d - start) / 7);
      if (!weeks[wk]) weeks[wk] = { from: d, xp: 0, days: 0 };
      weeks[wk].xp += xp; if (xp) { weeks[wk].days++; activeDays++; }
      if (xp > best) { best = xp; bestDay = d; }
      cells += '<i class="h' + heatLevel(xp) + (d === t ? ' today' : '') + '" data-d="' + d + '"></i>';
    }
    var thisWeek = weeks[weeks.length - 1] ? weeks[weeks.length - 1].xp : 0;
    var months = weeks.map(function (w, k) {   // label a column where a new month starts
      var mo = new Date(w.from * 86400000).getUTCMonth(), prev = k ? new Date(weeks[k - 1].from * 86400000).getUTCMonth() : -1;
      return mo !== prev ? '<span>' + esc(dayLabel(w.from, { month: 'short' })) + '</span>' : '<span></span>';
    }).join('');
    var summary = activeDays + ' active ' + (activeDays === 1 ? 'day' : 'days') + ' in the last ' + HEAT_WEEKS + ' weeks' + (best ? ' · best day ' + best + ' XP (' + dayLabel(bestDay) + ')' : '') + ' · this week ' + thisWeek + ' XP';
    box.innerHTML = '<div class="heat-wrap"><div class="heat-months" aria-hidden="true" style="--cols:' + weeks.length + '">' + months + '</div>' +
      '<div class="heat" style="--cols:' + weeks.length + '" tabindex="0" role="slider" aria-label="Daily activity. Arrow keys move by day and week." aria-valuemin="' + start + '" aria-valuemax="' + t + '" aria-valuenow="' + t + '" aria-valuetext="' + esc(summary) + '">' + cells + '</div></div>' +
      '<div class="heat-foot"><span class="heat-readout">' + esc(summary) + '</span><span class="heat-legend" aria-hidden="true">Less <i class="h0"></i><i class="h1"></i><i class="h2"></i><i class="h3"></i><i class="h4"></i> More</span></div>' +
      '<details class="chart-table"><summary>Show as table</summary><table><thead><tr><th scope="col">Week of</th><th scope="col">XP</th><th scope="col">Active days</th></tr></thead><tbody>' +
      weeks.slice().reverse().map(function (w) { return '<tr><td>' + esc(dayLabel(w.from, { month: 'short', day: 'numeric' })) + '</td><td>' + w.xp + '</td><td>' + w.days + '</td></tr>'; }).join('') + '</tbody></table></details>';
    var grid = $('.heat', box), readout = $('.heat-readout', box), lit = null, kd = t;
    function show(cell) {
      if (lit) lit.classList.remove('on');
      if (!cell || !cell.dataset.d) { readout.textContent = summary; lit = null; return; }
      lit = cell; cell.classList.add('on');
      var dd = +cell.dataset.d, xp = act[dd] || 0, txt = dayLabel(dd) + (dd === t ? ' (today)' : '') + ': ' + (xp ? xp + ' XP' : 'no activity');
      if (readout.textContent !== txt) readout.textContent = txt;
      grid.setAttribute('aria-valuenow', dd); grid.setAttribute('aria-valuetext', txt);
    }
    grid.addEventListener('keydown', function (e) {
      var step = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 }[e.key];
      if (!step) return;
      e.preventDefault();
      kd = Math.max(start, Math.min(t, kd + step));
      show(grid.querySelector('[data-d="' + kd + '"]'));
    });
    grid.addEventListener('focus', function () { show(grid.querySelector('[data-d="' + kd + '"]')); });
    grid.addEventListener('pointermove', function (e) { if (e.target.dataset && e.target.dataset.d) show(e.target); });
    grid.addEventListener('pointerdown', function (e) { show(e.target.dataset && e.target.dataset.d ? e.target : null); });
    grid.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') show(null); });
  }

  // which command a flashcard belongs to: c:<cmd>, f:<cmd>:<flag>, x:<cmd>:<example>
  function cardCmd(id) { var p = id.split(':'); return (p[0] === 'c' || p[0] === 'f' || p[0] === 'x') && CMDS.get(p[1]) ? p[1] : null; }
  function memoryChart(box) {
    var by = {};
    Object.keys(SRS.state.cards).forEach(function (id) {
      var cmd = cardCmd(id), m = cmd && SRS.memory(id);
      if (m) { m.id = id; (by[cmd] = by[cmd] || []).push(m); }
    });
    var rows = Object.keys(by).map(function (cmd) {
      var ms = by[cmd], weakest = ms.reduce(function (a, b) { return b.recall < a.recall ? b : a; });
      return { cmd: cmd, recall: ms.reduce(function (s, m) { return s + m.recall; }, 0) / ms.length, n: ms.length, weakest: weakest };
    }).sort(function (a, b) { return a.recall - b.recall; });
    if (!rows.length) { box.innerHTML = '<p class="muted">Review some flashcards and your memory curves appear here: one per command, showing how fast it fades.</p>'; return; }
    var top = rows.slice(0, 8), avg = rows.reduce(function (s, r) { return s + r.recall; }, 0) / rows.length;
    box.innerHTML = '<p class="muted">Estimated chance you still remember each command today, from your flashcard reviews. Average across ' + plural(rows.length, 'command') + ': <b>' + Math.round(avg * 100) + '%</b>. Tap a command to see its forgetting curve.</p>' +
      '<div class="mem-list">' + top.map(function (r, i) {
        var c = CMDS.get(r.cmd), pct = Math.round(r.recall * 100);
        return '<button type="button" class="mem-row" data-i="' + i + '" aria-pressed="' + (i === 0) + '" aria-label="' + esc(c.name + ': ' + pct + '% recall, ' + plural(r.n, 'card')) + '">' +
          '<span class="mem-name">' + esc(c.name) + '</span><span class="mem-track"><i style="transform:scaleX(' + Math.max(.02, r.recall).toFixed(3) + ')"></i></span><span class="mem-val">' + pct + '%</span></button>';
      }).join('') + '</div><div class="curve-box"></div>';
    var cb = $('.curve-box', box);
    function pick(i) {
      $$('.mem-row', box).forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.i === i)); });
      curveChart(cb, top[i]);
    }
    $$('.mem-row', box).forEach(function (b) { b.addEventListener('click', function () { pick(+b.dataset.i); }); });
    pick(0);
  }
  // one command's forgetting curve: recall (%) against days since its last review; crosshair readout on hover/drag/arrow keys
  function curveChart(box, row) {
    var c = CMDS.get(row.cmd), m = row.weakest, now = SRS.today() - m.last, dueAt = m.due - m.last;
    var span = Math.max(14, Math.ceil(Math.max(now, dueAt) * 1.5 / 7) * 7);
    var W = Math.max(260, Math.min(640, box.clientWidth || 320)), H = 190, L = 36, R = 12, T = 14, B = 30, pw = W - L - R, ph = H - T - B;
    var x = function (d) { return L + pw * d / span; }, y = function (r) { return T + ph * (1 - r); };
    var pts = [], i, k;
    for (k = 0; k <= 60; k++) { var dd = span * k / 60; pts.push(x(dd).toFixed(1) + ',' + y(m.at(dd)).toFixed(1)); }
    var grid = [0, .25, .5, .75, 1].map(function (v) { return '<line class="g" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v) + '" y2="' + y(v) + '"/><text class="ax" x="' + (L - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + v * 100 + '%</text>'; }).join('');
    var room = Math.max(2, Math.floor(pw / 44)), step = [1, 2, 7, 14, 28, 56, 91, 182, 364].filter(function (s) { return span / s <= room; })[0] || 364, ticks = '';
    for (i = 0; i <= span; i += step) ticks += '<text class="ax" x="' + x(i) + '" y="' + (H - 10) + '" text-anchor="middle">' + i + 'd</text>';
    var p = m.id.split(':'), cardName = p[0] === 'f' ? c.name + ' ' + p.slice(2).join(':') : p[0] === 'x' ? c.name + ' example' : c.name;
    box.innerHTML = '<h3 class="curve-title">Forgetting curve: <code>' + esc(cardName) + '</code>' + (row.n > 1 ? ' <small class="muted">(your weakest ' + esc(c.name) + ' card of ' + row.n + ')</small>' : '') + '</h3>' +
      '<svg class="curve" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="' + span + '" aria-valuenow="' + Math.min(now, span) + '" aria-label="' + esc('Forgetting curve for ' + cardName + ', days since the last review. Arrow keys move along the curve.') + '" aria-valuetext="' + esc('Today: ' + Math.round(m.recall * 100) + '% recall, ' + plural(now, 'day') + ' after the last review') + '">' +
      grid + ticks +
      '<polygon class="area" points="' + x(0) + ',' + y(0) + ' ' + pts.join(' ') + ' ' + x(span) + ',' + y(0) + '"/>' +
      '<polyline class="line" points="' + pts.join(' ') + '"/>' +
      (dueAt <= span ? '<line class="due" x1="' + x(dueAt) + '" x2="' + x(dueAt) + '" y1="' + T + '" y2="' + (T + ph) + '"/><text class="ax" x="' + x(dueAt) + '" y="' + (T - 3) + '" text-anchor="middle">due</text>' : '') +
      '<circle class="dot" cx="' + x(Math.min(now, span)) + '" cy="' + y(m.at(now)) + '" r="5"/>' +
      '<g class="cross" style="display:none"><line class="cx" y1="' + T + '" y2="' + (T + ph) + '"/><circle class="cdot" r="4"/></g></svg>' +
      '<p class="curve-read"></p>' +
      '<p class="muted small-print">Today (dot): <b>' + Math.round(m.recall * 100) + '%</b>, ' + plural(now, 'day') + ' after your last review (box ' + m.box + ')' + (m.lapsed ? ', which you marked “Again”, so it starts low' : '') + '. Every review restarts the curve at 100% and makes it flatter, so the next gap can be longer.</p>' +
      '<div class="row"><a class="btn small" href="#/cards/' + esc(c.module.id) + '">Review chapter ' + c.module.n + ' cards</a><a class="btn small ghost" href="#/cmd/' + esc(c.id) + '">Open lesson</a></div>';
    var svg = $('.curve', box), cross = $('.cross', svg), cx = $('.cx', svg), cdot = $('.cdot', svg), read = $('.curve-read', box), cur = Math.min(now, span);
    function at(d) {
      cur = Math.max(0, Math.min(span, Math.round(d)));
      cross.style.display = '';
      cx.setAttribute('x1', x(cur)); cx.setAttribute('x2', x(cur));
      cdot.setAttribute('cx', x(cur)); cdot.setAttribute('cy', y(m.at(cur)));
      var txt = 'Day ' + cur + (cur === now ? ' (today)' : cur === dueAt ? ' (due)' : '') + ': ' + Math.round(m.at(cur) * 100) + '% recall';
      if (read.textContent !== txt) read.textContent = txt;
      svg.setAttribute('aria-valuenow', cur); svg.setAttribute('aria-valuetext', txt);
    }
    function fromEvent(e) { var r = svg.getBoundingClientRect(); at((e.clientX - r.left - L * r.width / W) / (pw * r.width / W) * span); }
    svg.addEventListener('pointermove', fromEvent);
    svg.addEventListener('pointerdown', fromEvent);
    svg.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { cross.style.display = 'none'; read.textContent = ''; } });
    svg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); at(cur + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); at(cur - 1); }
    });
    svg.addEventListener('focus', function () { at(cur); });
  }

  /* ================= AUDIO DRILL ================= */
  // Hands-free flashcards: the device's speech engine reads the meaning, waits, then says the answer.
  var SAY = { ls: 'L S', cd: 'C D', pwd: 'P W D', cp: 'C P', mv: 'M V', rm: 'R M', ln: 'L N', wc: 'W C', tr: 'T R', du: 'D U', df: 'D F', ps: 'P S',
    su: 'S U', id: 'I D', nl: 'N L', bc: 'B C', dd: 'D D', ip: 'I P', bg: 'B G', fg: 'F G', vi: 'V I', lp: 'L P', lpr: 'L P R', lpq: 'L P Q',
    lprm: 'L P R M', ssh: 'S S H', scp: 'S C P', sftp: 'S F T P', ftp: 'F T P', rpm: 'R P M', dpkg: 'D package', fsck: 'F S check', mkfs: 'make F S',
    mkdir: 'make dir', chmod: 'change mode', chown: 'change owner', chgrp: 'change group', sudo: 'sue doo', umask: 'you mask', printf: 'print F',
    gzip: 'G zip', gunzip: 'G unzip', bzip2: 'B zip 2', 'apt-get': 'apt get', 'apt-cache': 'apt cache', grep: 'grep', egrep: 'E grep', md5sum: 'M D 5 sum',
    xargs: 'X args', mkfifo: 'make fifo', PS1: 'P S 1', pstree: 'P S tree', vmstat: 'V M stat', fdisk: 'F disk', wget: 'W get', lftp: 'L F T P' };
  var SYM = { '|': 'pipe', '>': 'greater than', '>>': 'double greater than', '<': 'less than', '&': 'ampersand', '&&': 'and and', '||': 'double pipe',
    ';': 'semicolon', '~': 'tilde', '*': 'star', '$': 'dollar', '#': 'hash', '!': 'bang', '/': 'slash', '\\': 'backslash', '"': 'quote', "'": 'single quote',
    '[': 'open bracket', ']': 'close bracket', '{': 'open brace', '}': 'close brace', '(': 'open paren', ')': 'close paren', '=': 'equals', '.': 'dot',
    ':': 'colon', '^': 'caret', '%': 'percent', '@': 'at', '?': 'question mark', '`': 'backtick', '-': 'dash', '+': 'plus', ',': 'comma', '_': 'underscore' };
  function speakable(s) {
    return String(s).split(/(\s+)/).map(function (w) {
      if (!w || /^\s+$/.test(w)) return ' ';
      if (SAY[w]) return SAY[w];
      if (SYM[w]) return SYM[w];
      var k = w.match(/^(Ctrl|Alt)-(.+)$/i);   // readline keys: "control A", "alt F"
      if (k) return (k[1].toLowerCase() === 'ctrl' ? 'control ' : 'alt ') + (k[2].length === 1 ? k[2].toUpperCase() : speakable(k[2]));
      var m = w.match(/^(--?)([A-Za-z][\w-]*)(=.*)?$/);
      if (m) return (m[1] === '--' ? 'dash dash ' : 'dash ') + (m[1] === '-' && m[2].length <= 3 ? m[2].split('').join(' ').toUpperCase() : m[2].replace(/-/g, ' ')) + (m[3] ? ' equals ' + speakable(m[3].slice(1)) : '');
      return w.replace(/[^\w\s]/g, function (ch) { return ' ' + (SYM[ch] || '') + ' '; });
    }).join('').replace(/\s+/g, ' ').trim();
  }
  function audioPrompt(it) {
    if (it.kind === 'x') return 'Fill in the blank. ' + speakable(it.front.replace('___', ' blank ')) + '.';
    if (it.kind === 'c') return 'Which command: ' + it.back;
    if (it.kind === 'f') return 'Which option of ' + speakable(it.name) + ': ' + it.back;
    return 'Which key or symbol: ' + it.back;
  }
  function deckFor(scope) {
    var all = cardsFor(C.modules);
    if (scope === 'due') {
      var seen = all.filter(function (c) { return SRS.state.cards[c.id] && SRS.isDue(c.id); });
      var doneMods = C.modules.filter(function (m) { return m.lessons.some(function (l) { return SRS.state.lessons[l.id]; }); });
      if (!doneMods.length) doneMods = [C.modules.filter(function (m) { return modPct(m) < 1; })[0] || C.modules[0]];
      return seen.concat(cardsFor(doneMods).filter(function (c) { return !SRS.state.cards[c.id]; }).slice(0, 20));
    }
    if (scope === 'weak') { var w = SRS.weak().concat(SRS.mistakes()); return all.filter(function (c) { return c.cmd && w.indexOf(c.cmd) >= 0; }); }
    if (scope === 'all') return all;
    var m = MODS.get(scope); return m ? cardsFor([m]) : [];
  }
  function viewAudio(root, scope) {
    setBack('#/cards');
    var synth = window.speechSynthesis, Recog = window.SpeechRecognition || window.webkitSpeechRecognition;
    root.innerHTML = '<h1>🎧 Audio drill</h1><p class="muted">Hands-free flashcards: I read the meaning, give you time to think, then say the answer. Rate it by tapping, with the keys, or by saying “yes” or “no”.</p>';
    if (!synth || !window.SpeechSynthesisUtterance) { root.innerHTML += '<div class="card"><p>This browser has no speech engine, so the audio drill isn’t available here. Try Safari or Chrome.</p><a class="btn" href="#/cards">Back to flashcards</a></div>'; return; }
    scope = scope || 'due';
    var set = SRS.state.settings, opt = { think: 5, rate: 1, mode: 'rate', voice: false };
    try { Object.assign(opt, JSON.parse(localStorage.getItem('lcl.audio') || '{}')); } catch (e) { /* defaults */ }
    var deck = shuffle(deckFor(scope)).slice(0, 25);
    root.innerHTML += '<div class="card audio-setup"><div class="deck-bar"><label class="sr-only" for="aDeck">Deck</label><select id="aDeck"><option value="due">Due today + new</option><option value="weak">Weak commands</option><option value="all">Everything</option>' +
      C.modules.map(function (m) { return '<option value="' + m.id + '">Chapter ' + m.n + ': ' + esc(m.title) + '</option>'; }).join('') + '</select></div>' +
      '<div class="audio-opts"><div class="seg" role="group" aria-label="Thinking time">' + [3, 5, 8].map(function (s) { return '<button type="button" data-think="' + s + '" aria-pressed="' + (opt.think === s) + '">' + s + ' s</button>'; }).join('') + '</div>' +
      '<div class="seg" role="group" aria-label="Speaking speed">' + [[0.8, 'Slow'], [1, 'Normal'], [1.2, 'Fast']].map(function (r) { return '<button type="button" data-rate="' + r[0] + '" aria-pressed="' + (opt.rate === r[0]) + '">' + r[1] + '</button>'; }).join('') + '</div>' +
      '<div class="seg" role="group" aria-label="Mode"><button type="button" data-mode="rate" aria-pressed="' + (opt.mode === 'rate') + '">Rate each</button><button type="button" data-mode="listen" aria-pressed="' + (opt.mode === 'listen') + '">Listen only</button></div>' +
      (Recog ? '<label class="row voice-opt"><input type="checkbox" id="aVoice"' + (opt.voice ? ' checked' : '') + '> Answer “yes” / “no” by voice <small class="muted">(uses your browser’s speech service)</small></label>' : '') + '</div></div>' +
      '<div class="audio-stage card"><p class="audio-phase eyebrow" role="status">Ready</p><div class="audio-q">' + plural(deck.length, 'card') + ' in this session.</div><div class="audio-a mono"></div></div>' +
      '<div class="audio-controls row"><button class="btn primary" type="button" data-play>▶ Start</button><button class="btn" type="button" data-skip disabled>Next ›</button></div>' +
      '<div class="audio-grade row" hidden><button class="btn grade again" type="button" data-ag="0">✗ Again <kbd>1</kbd></button><button class="btn grade good" type="button" data-ag="2">✓ Knew it <kbd>2</kbd></button></div>' +
      '<p class="count audio-count" aria-live="off"></p>';
    $('#aDeck').value = scope;
    $('#aDeck').addEventListener('change', function (e) { location.hash = '#/audio/' + e.target.value; });
    function saveOpt() { try { localStorage.setItem('lcl.audio', JSON.stringify(opt)); } catch (e) { /* per-device preference only */ } }
    $$('[data-think]', root).forEach(function (b) { b.addEventListener('click', function () { opt.think = +b.dataset.think; saveOpt(); $$('[data-think]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); }); });
    $$('[data-rate]', root).forEach(function (b) { b.addEventListener('click', function () { opt.rate = +b.dataset.rate; saveOpt(); $$('[data-rate]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); }); });
    $$('[data-mode]', root).forEach(function (b) { b.addEventListener('click', function () { opt.mode = b.dataset.mode; saveOpt(); $$('[data-mode]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); }); });
    var vc = $('#aVoice'); if (vc) vc.addEventListener('change', function () { opt.voice = vc.checked; saveOpt(); });
    if (!deck.length) { $('.audio-q', root).textContent = 'No cards to drill here right now. Pick another deck.'; $('[data-play]', root).disabled = true; return; }

    var phase = $('.audio-phase', root), qEl = $('.audio-q', root), aEl = $('.audio-a', root), playB = $('[data-play]', root), skipB = $('[data-skip]', root), gradeRow = $('.audio-grade', root), countEl = $('.audio-count', root);
    var i = 0, running = false, run = 0, waitGrade = null, rec = null, lock = null, known = 0, done = 0;
    function acquire() {   // keep the screen awake while the drill runs (released on pause/leave; the browser drops it when hidden)
      try {
        if (!navigator.wakeLock || lock) return;
        navigator.wakeLock.request('screen').then(function (l) { if (running) lock = l; else l.release().catch(function () {}); }).catch(function () {});
      } catch (e) { /* optional */ }
    }
    function onVis() { if (document.visibilityState === 'visible' && running) { lock = null; acquire(); } }
    document.addEventListener('visibilitychange', onVis);
    function sleep(ms, r) { return new Promise(function (res) { var t = setTimeout(res, ms); (sleepers[r] = sleepers[r] || []).push(function () { clearTimeout(t); res(); }); }); }
    var sleepers = {};
    function cancelSleeps() { Object.keys(sleepers).forEach(function (k) { sleepers[k].forEach(function (f) { f(); }); }); sleepers = {}; }
    function say(text) {
      return new Promise(function (res) {
        var u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = opt.rate;
        var t = setTimeout(res, 2500 + text.length * 120);   // some engines never fire onend
        u.onend = u.onerror = function () { clearTimeout(t); res(); };
        synth.speak(u);
      });
    }
    function listenYesNo() {
      return new Promise(function (res) {
        if (!Recog || !opt.voice) return res(null);
        if (rec) { try { rec.abort(); } catch (e) { /* ignore */ } }
        try {
          rec = new Recog(); rec.lang = 'en-US'; rec.interimResults = false; rec.maxAlternatives = 3;
          var settled = false, finish = function (v) { if (!settled) { settled = true; try { rec.abort(); } catch (e) { /* already stopped */ } res(v); } };
          rec.onresult = function (e) {
            var said = Array.prototype.map.call(e.results[0], function (a) { return a.transcript.toLowerCase(); }).join(' ');
            finish(/\b(yes|yeah|yep|good|got it|knew|know)\b/.test(said) ? 2 : /\b(no|nope|again|missed|wrong)\b/.test(said) ? 0 : null);
          };
          rec.onerror = rec.onend = function () { finish(null); };
          rec.start();
          setTimeout(function () { finish(null); }, 6000);
        } catch (e) { res(null); }
      });
    }
    function grade(g) {
      var it = deck[i];
      if (!it || !waitGrade) return;
      SRS.grade(it.id, g); if (it.cmd) SRS.answer(it.cmd, g > 0);
      done++; if (g > 0) known++;
      i++;                                     // move on now, so pausing during the feedback can't grade this card twice
      if (rec) { try { rec.abort(); } catch (e) { /* ignore */ } }
      var w = waitGrade; waitGrade = null; w();
    }
    async function loop(r) {
      while (running && r === run && i < deck.length) {
        var it = deck[i];
        countEl.textContent = 'Card ' + (i + 1) + ' of ' + deck.length + (done ? ' · ' + known + ' of ' + done + ' known' : '');
        aEl.textContent = ''; gradeRow.hidden = true;
        phase.textContent = 'Question';
        qEl.textContent = it.kind === 'x' ? 'Fill in the blank: ' + it.front : it.kind === 'f' ? 'Which option of ' + it.name + ': ' + it.back : it.kind === 'c' ? 'Which command: ' + it.back : 'Which key or symbol: ' + it.back;
        await say(audioPrompt(it)); if (!running || r !== run) return;
        phase.textContent = 'Think…';
        await sleep(opt.think * 1000, r); if (!running || r !== run) return;
        phase.textContent = 'Answer';
        aEl.textContent = it.kind === 'x' ? it.back : it.ans;
        await say('The answer is: ' + speakable(it.ans)); if (!running || r !== run) return;
        if (opt.mode === 'rate') {
          phase.textContent = 'Did you know it?'; gradeRow.hidden = false;
          var card = { idx: i, heard: null };
          var graded = new Promise(function (res) { waitGrade = res; });
          listenYesNo().then(function (v) {   // only counts for this card, in this run
            if (v === null || r !== run || i !== card.idx || !waitGrade) return;
            card.heard = v; grade(v);
          });
          await graded; if (!running || r !== run) return;
          if (card.heard !== null) await say(card.heard ? 'Good.' : 'Again later.');
        } else {
          await sleep(1500, r);
          if (!running || r !== run) return;
          i++;
        }
      }
      if (i >= deck.length) {
        running = false; release();
        phase.textContent = 'Done'; qEl.textContent = opt.mode === 'rate' ? 'Session over: ' + known + ' of ' + done + ' known.' : 'Session over.'; aEl.textContent = ''; gradeRow.hidden = true;
        playB.textContent = '↻ Again'; playB.onclick = function () { route(); }; skipB.disabled = true;
        say('Session over.'); if (opt.mode === 'rate' && done) celebrate();
      }
    }
    function release() { if (lock) { lock.release().catch(function () {}); lock = null; } }
    function stop() { running = false; run++; cancelSleeps(); synth.cancel(); if (rec) { try { rec.abort(); } catch (e) { /* ignore */ } } if (waitGrade) { var w = waitGrade; waitGrade = null; w(); } release(); }
    playB.onclick = function () {
      if (running) { stop(); playB.textContent = '▶ Resume'; phase.textContent = 'Paused'; skipB.disabled = true; return; }
      running = true; run++; playB.textContent = '⏸ Pause'; skipB.disabled = false;
      acquire();
      loop(run);
    };
    skipB.addEventListener('click', function () { if (!running) return; stop(); i++; running = true; run++; acquire(); loop(run); });
    $$('[data-ag]', root).forEach(function (b) { b.addEventListener('click', function () { grade(+b.dataset.ag); }); });
    function key(e) {
      if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
      if (e.key === '1' || e.key === 'ArrowLeft') grade(0);
      else if (e.key === '2' || e.key === 'ArrowRight') grade(2);
      else if (e.key === ' ' && !(e.target.closest && e.target.closest('button,a'))) { e.preventDefault(); playB.click(); }
    }
    document.addEventListener('keydown', key);
    onLeave(function () { stop(); document.removeEventListener('keydown', key); document.removeEventListener('visibilitychange', onVis); });
  }

  /* ================= PROMPT STUDIO ================= */
  var PS1_DEFAULT = '[\\u@\\h \\W]\\$ ', STUDIO_LEVEL = 3;
  var PS1_PRESETS = [
    ['Default', PS1_DEFAULT], ['Minimal', '\\$ '], ['Clock', '\\A \\h \\$ '], ['Angle', '<\\u@\\h \\W>\\$ '],
    ['Red', '\\[\\033[0;31m\\]<\\u@\\h \\W>\\$\\[\\033[0m\\] '], ['Red background', '\\[\\033[0;41m\\]<\\u@\\h \\W>\\$\\[\\033[0m\\] ']
  ];
  var PS1_CHIPS = [['\\u', 'user'], ['\\h', 'host'], ['\\w', 'full dir'], ['\\W', 'dir name'], ['\\A', 'HH:MM'], ['\\t', 'HH:MM:SS'], ['\\d', 'date'], ['\\$', '$ or #'], ['\\n', 'newline'],
    ['\\[\\033[0;31m\\]', 'red'], ['\\[\\033[0;32m\\]', 'green'], ['\\[\\033[1;33m\\]', 'yellow'], ['\\[\\033[0;34m\\]', 'blue'], ['\\[\\033[0;36m\\]', 'cyan'], ['\\[\\033[0m\\]', 'reset colour']];
  function promptStudio(box) {
    if (!box) return;
    var lvl = SRS.level();
    if (lvl < STUDIO_LEVEL) {
      var need = 50 * Math.pow(STUDIO_LEVEL - 1, 2) - SRS.state.xp;
      box.innerHTML = '<h3>🔒 Prompt studio</h3><p class="muted">Reach level ' + STUDIO_LEVEL + ' to unlock it (' + need + ' XP to go). Then you can design your own shell prompt with the PS1 codes from Chapter 13, and every terminal in the app will use it.</p>';
      return;
    }
    var cur = SRS.state.settings.ps1 || PS1_DEFAULT;
    box.innerHTML = '<h3>🎨 Prompt studio</h3><p class="muted">Design your prompt with the PS1 escape codes from Chapter 13. Every terminal in the app uses it.</p>' +
      '<div class="fill-in"><label class="ps" for="ps1In">PS1=</label><input id="ps1In" type="text" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false"></div>' +
      '<div class="prompt-preview" aria-live="polite" aria-label="Preview"></div>' +
      '<p class="eyebrow">Insert a code</p><div class="flags ps1-chips">' + PS1_CHIPS.map(function (c, i) { return '<button type="button" class="chip" data-chip="' + i + '"><span>' + esc(c[0]) + '</span><small>' + esc(c[1]) + '</small></button>'; }).join('') + '</div>' +
      '<p class="eyebrow" style="margin-top:12px">Prompts from the book</p><div class="flags">' + PS1_PRESETS.map(function (p, i) { return '<button type="button" class="btn small" data-preset="' + i + '">' + esc(p[0]) + '</button>'; }).join('') + '</div>' +
      '<div class="row" style="margin-top:12px"><button class="btn primary" type="button" data-save>Use this prompt</button><button class="btn ghost" type="button" data-default>Back to default</button></div>' +
      '<p class="muted" style="margin-top:12px">To keep it in a real shell, add these two lines to <code>~/.bashrc</code>:</p><pre class="out bashrc"></pre>';
    var inp = $('#ps1In'), pv = $('.prompt-preview', box), rc = $('.bashrc', box);
    inp.value = cur;
    function preview() {
      var sh = newShell(); sh.run('cd Documents');
      pv.innerHTML = '<span class="ps">' + promptHTML(sh.promptParts(inp.value)) + '</span>ls -l';
      rc.textContent = "PS1='" + inp.value.replace(/'/g, "'\\''") + "'\nexport PS1";
    }
    inp.addEventListener('input', preview);
    $$('[data-chip]', box).forEach(function (b) { b.addEventListener('click', function () { inp.focus(); inp.setRangeText(PS1_CHIPS[+b.dataset.chip][0], inp.selectionStart, inp.selectionEnd, 'end'); preview(); }); });
    $$('[data-preset]', box).forEach(function (b) { b.addEventListener('click', function () { inp.value = PS1_PRESETS[+b.dataset.preset][1]; preview(); }); });
    $('[data-save]', box).addEventListener('click', function () {
      var v = inp.value.slice(0, 200);
      SRS.state.settings.ps1 = v === PS1_DEFAULT ? '' : v; SRS.save(); SRS.checkBadges();
      shell.setVar('PS1', v || PS1_DEFAULT);
      toast('Prompt saved: every terminal now uses it', '🎨');
    });
    $('[data-default]', box).addEventListener('click', function () {
      inp.value = PS1_DEFAULT; SRS.state.settings.ps1 = ''; SRS.save(); shell.setVar('PS1', PS1_DEFAULT); preview(); toast('Back to the default prompt');
    });
    preview();
  }

  /* ================= global keys, boot ================= */
  $('.skip').addEventListener('click', function (e) { e.preventDefault(); main.focus(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !$('#sheet').hidden) { closeSheet(); return; }
    var typing = /INPUT|TEXTAREA|SELECT/.test(e.target.tagName);
    if (e.altKey && /^Digit[1-6]$/.test(e.code)) { e.preventDefault(); location.hash = $$('#tabbar a')[+e.code.slice(5) - 1].getAttribute('href'); return; }
    if (!typing && e.key === '/' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      var own = $('[data-slash]');
      if (own) { own.focus(); own.select(); return; }
      if (!/cheats/.test(location.hash)) location.hash = '#/cheats';
      setTimeout(function () { var s = $('#cs'); if (s) s.focus(); }, 60);
    }
  });
  if ('serviceWorker' in navigator && location.protocol !== 'file:') addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  if (SRS.state.settings.theme !== 'system') setTheme(SRS.state.settings.theme); else syncThemeBtn();
  SRS.checkBadges();
  route();
  onViewport();
})();
