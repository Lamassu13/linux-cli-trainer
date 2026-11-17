/* srs.js — progress store + Leitner spaced repetition.
 * Everything lives under one localStorage key so it can be exported/imported as a JSON file.
 *
 * Leitner: 5 boxes. "Know it" moves a card up one box; "Again" sends it back to box 1.
 * A card in box b is due again INTERVALS[b-1] days after its last review.
 */
(function (G) {
  'use strict';
  var KEY = 'lcl.v1', INTERVALS = [1, 2, 4, 9, 21];   // days until a card is due again after "Know it" in box 1..5

  function today() { var d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000); }
  function blank() {
    return { v: 1, cards: {}, stats: {}, lessons: {}, tasks: {}, quiz: {}, xp: 0, streak: { last: 0, n: 0, best: 0 },
      badges: {}, speed: { best: 0 }, counts: { run: 0, reviews: 0, correct: 0, perfect: 0 }, settings: { theme: 'system', front: 'cmd' } };
  }
  function valid(s) { return s && s.v === 1 && typeof s.cards === 'object' && typeof s.xp === 'number' && typeof s.streak === 'object'; }
  // Fill missing fields and coerce every value to the expected type. Imported files are untrusted:
  // numbers end up in the page, so nothing but finite numbers may survive here.
  function num(x) { x = Number(x); return isFinite(x) ? x : 0; }
  function obj(x) { return x && typeof x === 'object' && !Array.isArray(x) ? x : {}; }
  function merge(s) {
    var b = blank(), o = { v: 1, cards: {}, stats: {}, lessons: {}, tasks: {}, quiz: {}, badges: {} };
    Object.keys(obj(s.cards)).forEach(function (k) { var c = s.cards[k]; if (Array.isArray(c)) o.cards[k] = [Math.max(1, Math.min(5, num(c[0]))), num(c[1])]; });
    Object.keys(obj(s.stats)).forEach(function (k) { var x = obj(s.stats[k]); o.stats[k] = { ok: num(x.ok), bad: num(x.bad), last: num(x.last) }; });
    ['lessons', 'tasks', 'badges'].forEach(function (f) { Object.keys(obj(s[f])).forEach(function (k) { o[f][k] = num(s[f][k]) || 1; }); });
    Object.keys(obj(s.quiz)).forEach(function (k) { var x = obj(s.quiz[k]); o.quiz[k] = { best: num(x.best), runs: num(x.runs) }; });
    o.xp = num(s.xp);
    var st = obj(s.streak); o.streak = { last: num(st.last), n: num(st.n), best: num(st.best) };
    o.speed = { best: num(obj(s.speed).best) };
    var ct = obj(s.counts); o.counts = {}; Object.keys(b.counts).forEach(function (k) { o.counts[k] = num(ct[k]); });
    var se = obj(s.settings);
    o.settings = { theme: ['system', 'dark', 'light'].indexOf(se.theme) >= 0 ? se.theme : 'system', front: se.front === 'meaning' ? 'meaning' : 'cmd' };
    return o;
  }

  var state = blank(), timer = null, listeners = [];
  try { var raw = localStorage.getItem(KEY); if (raw) { var p = JSON.parse(raw); if (valid(p)) state = merge(p); } } catch (e) { /* private mode or corrupt: start fresh */ }

  function saveNow() { clearTimeout(timer); timer = null; try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* quota/private mode */ } }
  function save() { if (!timer) timer = setTimeout(saveNow, 250); }
  addEventListener('pagehide', saveNow);
  // Another tab (or the installed app) saved: adopt its state so we don't overwrite it.
  addEventListener('storage', function (e) {
    if (e.key !== KEY || !e.newValue) return;
    try { var p = JSON.parse(e.newValue); if (valid(p)) { state = merge(p); G.SRS.state = state; emit('sync'); } } catch (err) { /* ignore */ }
  });
  addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') saveNow(); });
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { /* optional */ }

  function emit(type, data) { listeners.forEach(function (fn) { fn(type, data); }); }

  function touchStreak() {
    var t = today(), s = state.streak;
    if (s.last === t) return;
    s.n = s.last === t - 1 ? s.n + 1 : 1;
    s.last = t; s.best = Math.max(s.best, s.n);
  }
  function streakNow() { return state.streak.last >= today() - 1 ? state.streak.n : 0; }
  function level(xp) { return Math.floor(Math.sqrt((xp === undefined ? state.xp : xp) / 50)) + 1; }
  function levelSpan() { var l = level(), lo = 50 * Math.pow(l - 1, 2), hi = 50 * Math.pow(l, 2); return { level: l, into: state.xp - lo, need: hi - lo }; }

  function addXP(n, why) {
    var before = level();
    state.xp += n; touchStreak(); save();
    emit('xp', { n: n, why: why });
    if (level() > before) emit('level', { level: level() });
    checkBadges();
  }

  /* ---------- cards ---------- */
  function grade(id, ok) {
    var c = state.cards[id] || [0, 0], box = ok ? Math.min((c[0] || 0) + 1, 5) : 1;
    state.cards[id] = [box, today() + (ok ? INTERVALS[box - 1] : 0)];
    state.counts.reviews++;
    addXP(2, 'review');
  }
  function isDue(id) { var c = state.cards[id]; return !c || c[1] <= today(); }
  function box(id) { var c = state.cards[id]; return c ? c[0] : 0; }

  /* ---------- answers & weak list ---------- */
  function answer(cmd, ok) {
    if (cmd) {
      var s = state.stats[cmd] || (state.stats[cmd] = { ok: 0, bad: 0, last: 0 });
      if (ok) s.ok++; else s.bad++;
      s.last = today();
    }
    if (ok) { state.counts.correct++; addXP(5, 'answer'); } else save();
  }
  function weak() {
    return Object.keys(state.stats).filter(function (k) { var s = state.stats[k]; return s.bad >= 2 && s.bad / (s.ok + s.bad) >= 0.4; })
      .sort(function (a, b) { var x = state.stats[a], y = state.stats[b]; return (y.bad / (y.ok + y.bad)) - (x.bad / (x.ok + x.bad)); });
  }
  // Wrong answers on fresh commands also show up in the review list sooner.
  function mistakes() { return Object.keys(state.stats).filter(function (k) { return state.stats[k].bad > 0; }); }

  /* ---------- lessons, tasks ---------- */
  function lessonDone(id) { if (state.lessons[id]) return false; state.lessons[id] = today(); addXP(10, 'lesson'); emit('lesson', id); return true; }
  function taskDone(id) { if (state.tasks[id]) return false; state.tasks[id] = today(); addXP(20, 'task'); return true; }
  function quizResult(scope, score, total) {
    var q = state.quiz[scope] || (state.quiz[scope] = { best: 0, runs: 0 });
    q.runs++; q.best = Math.max(q.best, Math.round(100 * score / total));
    if (total >= 8 && score === total) state.counts.perfect++;
    save(); checkBadges();
  }
  function ran() { state.counts.run++; if (state.counts.run % 5 === 0) checkBadges(); save(); }
  function speedResult(score) { var nb = score > state.speed.best; if (nb) state.speed.best = score; save(); checkBadges(); return nb; }

  /* ---------- badges ---------- */
  var content = null;
  function partDone(p) {
    if (!content) return false;
    return content.modules.filter(function (m) { return m.part === p; }).every(function (m) { return m.lessons.every(function (l) { return state.lessons[l.id]; }); });
  }
  var BADGES = [
    { id: 'first', icon: '🐣', name: 'First steps', d: 'Complete your first lesson', test: function () { return Object.keys(state.lessons).length >= 1; } },
    { id: 'run25', icon: '⌨️', name: 'Keyboard warrior', d: 'Run 25 commands in the terminal', test: function () { return state.counts.run >= 25; } },
    { id: 'task10', icon: '🛠️', name: 'Task master', d: 'Finish 10 guided tasks', test: function () { return Object.keys(state.tasks).length >= 10; } },
    { id: 'quiz50', icon: '🧠', name: 'Quiz whiz', d: 'Answer 50 questions correctly', test: function () { return state.counts.correct >= 50; } },
    { id: 'cards100', icon: '🃏', name: 'Card shark', d: 'Review 100 flashcards', test: function () { return state.counts.reviews >= 100; } },
    { id: 'perfect', icon: '💯', name: 'Perfectionist', d: 'Score 100% on a quiz of 8+ questions', test: function () { return state.counts.perfect >= 1; } },
    { id: 'speed15', icon: '⚡', name: 'Speed demon', d: 'Score 15+ in a speed round', test: function () { return state.speed.best >= 15; } },
    { id: 'streak3', icon: '🔥', name: 'On a roll', d: 'Keep a 3-day streak', test: function () { return state.streak.best >= 3; } },
    { id: 'streak7', icon: '📅', name: 'Habit formed', d: 'Keep a 7-day streak', test: function () { return state.streak.best >= 7; } },
    { id: 'level5', icon: '⭐', name: 'Rising star', d: 'Reach level 5', test: function () { return level() >= 5; } },
    { id: 'part1', icon: '🐚', name: 'Shell explorer', d: 'Finish Part I: Learning the Shell', test: function () { return partDone(1); } },
    { id: 'part2', icon: '⚙️', name: 'Configurator', d: 'Finish Part II: Configuration', test: function () { return partDone(2); } },
    { id: 'part3', icon: '🧰', name: 'Toolsmith', d: 'Finish Part III: Common Tasks', test: function () { return partDone(3); } },
    { id: 'part4', icon: '📜', name: 'Script writer', d: 'Finish Part IV: Shell Scripts', test: function () { return partDone(4); } }
  ];
  function checkBadges() {
    BADGES.forEach(function (b) {
      if (!state.badges[b.id] && b.test()) { state.badges[b.id] = today(); save(); emit('badge', b); }
    });
  }

  /* ---------- export / import ---------- */
  function exportJSON() { saveNow(); return JSON.stringify({ app: 'linux-cli-trainer', exported: new Date().toISOString(), state: state }, null, 1); }
  function importJSON(text) {
    var obj = JSON.parse(text), s = obj && obj.state ? obj.state : obj;
    if (!valid(s)) throw new Error('This file does not look like a Linux trainer progress export.');
    try { localStorage.setItem(KEY + '.bak', JSON.stringify(state)); } catch (e) { /* ignore */ }
    state = merge(s); G.SRS.state = state; saveNow(); emit('import');
  }
  function reset() { try { localStorage.setItem(KEY + '.bak', JSON.stringify(state)); } catch (e) { /* ignore */ } state = blank(); G.SRS.state = state; saveNow(); emit('import'); }

  G.SRS = {
    state: state, today: today, save: save, saveNow: saveNow,
    on: function (fn) { listeners.push(fn); },
    setContent: function (c) { content = c; },
    level: level, levelSpan: levelSpan, streakNow: streakNow, addXP: addXP,
    grade: grade, isDue: isDue, box: box, INTERVALS: INTERVALS,
    answer: answer, weak: weak, mistakes: mistakes,
    lessonDone: lessonDone, taskDone: taskDone, quizResult: quizResult, ran: ran, speedResult: speedResult,
    BADGES: BADGES, checkBadges: checkBadges,
    exportJSON: exportJSON, importJSON: importJSON, reset: reset
  };
})(window);
