/* srs.js — progress store + Leitner spaced repetition.
 * Everything lives under one localStorage key so it can be exported/imported as a JSON file.
 *
 * Leitner: 5 boxes, graded Again / Hard / Good / Easy:
 *   Again -> box 1, due today      Hard -> same box, half the wait
 *   Good  -> up one box             Easy -> up two boxes
 * A card in box b is due again INTERVALS[b-1] days after its last review.
 * Finished guided tasks get the same treatment (TASK_INTERVALS) so they come back to be redone from memory.
 */
(function (G) {
  'use strict';
  var KEY = 'lcl.v1', INTERVALS = [1, 2, 4, 9, 21];   // days until a card is due again after "Good" in box 1..5
  var TASK_INTERVALS = [2, 5, 10, 21, 45];            // tasks are bigger, so they wait longer
  var AGAIN = 0, HARD = 1, GOOD = 2, EASY = 3;

  function today() { var d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000); }
  function blank() {
    return { v: 1, cards: {}, treview: {}, daily: {}, games: {}, activity: {}, stats: {}, lessons: {}, tasks: {}, quiz: {}, xp: 0, streak: { last: 0, n: 0, best: 0 },
      badges: {}, speed: { best: 0 }, counts: { run: 0, reviews: 0, correct: 0, perfect: 0, recalled: 0, treviews: 0, dailies: 0 },
      settings: { theme: 'system', front: 'cmd', mode: 'flip', explain: true, ps1: '' } };
  }
  function valid(s) { return s && s.v === 1 && typeof s.cards === 'object' && typeof s.xp === 'number' && typeof s.streak === 'object'; }
  // Fill missing fields and coerce every value to the expected type. Imported files are untrusted:
  // numbers end up in the page, so nothing but finite numbers may survive here.
  function num(x) { x = Number(x); return isFinite(x) ? x : 0; }
  function obj(x) { return x && typeof x === 'object' && !Array.isArray(x) ? x : {}; }
  function merge(s) {
    var b = blank(), o = { v: 1, cards: {}, treview: {}, daily: {}, games: {}, activity: {}, stats: {}, lessons: {}, tasks: {}, quiz: {}, badges: {} };
    ['cards', 'treview'].forEach(function (f) {
      Object.keys(obj(s[f])).forEach(function (k) {
        var c = s[f][k]; if (!Array.isArray(c)) return;
        var box = Math.max(1, Math.min(5, num(c[0]))), due = num(c[1]);
        o[f][k] = [box, due];
        // last review day (older saves lack it: estimate from the box's interval)
        if (f === 'cards') o[f][k].push(c[2] !== undefined ? num(c[2]) : due - INTERVALS[box - 1]);
      });
    });
    Object.keys(obj(s.stats)).forEach(function (k) { var x = obj(s.stats[k]); o.stats[k] = { ok: num(x.ok), bad: num(x.bad), last: num(x.last) }; });
    ['lessons', 'tasks', 'badges'].forEach(function (f) { Object.keys(obj(s[f])).forEach(function (k) { o[f][k] = num(s[f][k]) || 1; }); });
    Object.keys(obj(s.games)).forEach(function (k) {
      if (!/^(story|room|golf|boss)\.[\w.-]+$/.test(k)) return;   // also keeps out keys like __proto__
      var g = obj(s.games[k]), pos = function (x) { return Math.max(0, num(x)); };
      o.games[k] = { done: pos(g.done), best: pos(g.best), under: g.under ? 1 : 0, hints: pos(g.hints) };
    });
    Object.keys(obj(s.daily)).forEach(function (k) { if (/^\d+$/.test(k)) o.daily[k] = num(s.daily[k]); });
    Object.keys(obj(s.quiz)).forEach(function (k) { var x = obj(s.quiz[k]); o.quiz[k] = { best: num(x.best), runs: num(x.runs) }; });
    Object.keys(obj(s.activity)).forEach(function (k) { if (/^\d+$/.test(k)) o.activity[k] = Math.max(0, num(s.activity[k])); });
    if (!Object.keys(o.activity).length) {   // older saves: rebuild a rough history from the days things were completed
      var mark = function (d, xp) { d = num(d); if (d > 0) o.activity[d] = (o.activity[d] || 0) + xp; };
      Object.keys(o.lessons).forEach(function (k) { mark(o.lessons[k], 10); });
      Object.keys(o.tasks).forEach(function (k) { mark(o.tasks[k], 20); });
      Object.keys(o.games).forEach(function (k) { mark(o.games[k].done, 25); });
      Object.keys(o.daily).forEach(function (k) { mark(k, 10); });
    }
    o.xp = num(s.xp);
    var st = obj(s.streak); o.streak = { last: num(st.last), n: num(st.n), best: num(st.best) };
    o.speed = { best: num(obj(s.speed).best) };
    var ct = obj(s.counts); o.counts = {}; Object.keys(b.counts).forEach(function (k) { o.counts[k] = num(ct[k]); });
    var se = obj(s.settings);
    o.settings = { theme: ['system', 'dark', 'light'].indexOf(se.theme) >= 0 ? se.theme : 'system', front: se.front === 'meaning' ? 'meaning' : 'cmd', mode: se.mode === 'type' ? 'type' : 'flip',
      explain: se.explain !== false, ps1: typeof se.ps1 === 'string' ? se.ps1.slice(0, 200) : '' };
    // progress saved before task reviews existed: schedule a first review two days after each finished task
    Object.keys(o.tasks).forEach(function (k) { if (!o.treview[k]) o.treview[k] = [1, o.tasks[k] + TASK_INTERVALS[0]]; });
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
    var before = level(), d = today();
    state.xp += n; touchStreak();
    state.activity[d] = (state.activity[d] || 0) + n;
    Object.keys(state.activity).forEach(function (k) { if (+k < d - 400) delete state.activity[k]; });
    save();
    emit('xp', { n: n, why: why });
    if (level() > before) emit('level', { level: level() });
    checkBadges();
  }

  /* ---------- cards ---------- */
  // g: 0 Again, 1 Hard, 2 Good, 3 Easy (true/false still mean Good/Again)
  function schedule(cur, g, table) {
    var b = cur ? cur[0] : 0;
    if (g === AGAIN) return [1, today()];
    if (g === HARD) { b = Math.max(1, b); return [b, today() + Math.max(1, Math.floor(table[b - 1] / 2))]; }
    b = Math.min(5, b + (g === EASY ? 2 : 1));
    return [b, today() + table[b - 1]];
  }
  function level4(g) { return g === true ? GOOD : g === false ? AGAIN : Math.max(0, Math.min(3, g | 0)); }
  function grade(id, g) {
    g = level4(g);
    state.cards[id] = schedule(state.cards[id], g, INTERVALS).concat([today()]);
    state.counts.reviews++;
    addXP(2, 'review');
    return state.cards[id][1] - today();          // days until it comes back
  }
  // days until the card would come back for each grade (shown on the buttons)
  function preview(id) { return [0, 1, 2, 3].map(function (g) { return schedule(state.cards[id], g, INTERVALS)[1] - today(); }); }
  function recalled() { state.counts.recalled++; save(); }
  // Forgetting curve: chance you still recall a card, R(t) = exp(-t / S), t = days since the last review.
  // S (stability) is set so recall is about 85% on the card's due day: longer intervals mean flatter curves.
  var RECALL_AT_DUE = 0.85;
  function memory(id) {
    var c = state.cards[id];
    if (!c) return null;
    var last = c[2] !== undefined ? c[2] : c[1] - INTERVALS[c[0] - 1], gap = Math.max(1, c[1] - last);
    // "Again" schedules the card for the same day it was reviewed: you just failed it, so it starts at half strength
    var lapsed = c[1] <= last, base = lapsed ? 0.5 : 1;
    var S = gap / -Math.log(RECALL_AT_DUE), t = Math.max(0, today() - last);
    return { box: c[0], due: c[1], last: last, lapsed: lapsed, stability: S, recall: base * Math.exp(-t / S), at: function (days) { return base * Math.exp(-Math.max(0, days) / S); } };
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
  function taskDone(id) {
    if (state.tasks[id]) return false;
    state.tasks[id] = today(); state.treview[id] = [1, today() + TASK_INTERVALS[0]];
    addXP(20, 'task'); return true;
  }
  // a finished task redone from memory: ok moves it up, failing brings it back tomorrow
  function reviewTask(id, ok) {
    var cur = state.treview[id], r = ok ? schedule(cur, GOOD, TASK_INTERVALS) : [1, today() + 1];
    state.treview[id] = r;
    if (ok) { state.counts.treviews++; addXP(10, 'task review'); } else save();
    return r[1] - today();
  }
  function dueTasks() { var t = today(); return Object.keys(state.treview).filter(function (k) { return state.treview[k][1] <= t; }); }
  function quizResult(scope, score, total) {
    var q = state.quiz[scope] || (state.quiz[scope] = { best: 0, runs: 0 });
    q.runs++; q.best = Math.max(q.best, Math.round(100 * score / total));
    if (total >= 8 && score === total) state.counts.perfect++;
    save(); checkBadges();
  }
  // daily challenge: only the first attempt of each (UTC) day is scored
  function dailyResult(day, score, total) {
    if (state.daily[day] !== undefined) return false;
    state.daily[day] = score; state.counts.dailies++;
    Object.keys(state.daily).sort(function (a, b) { return b - a; }).slice(120).forEach(function (k) { delete state.daily[k]; });
    if (total >= 8 && score === total) state.counts.perfect++;
    addXP(10 + score * 3, 'daily');
    return true;
  }
  // games (story missions, escape rooms, golf holes, bosses): lower "best" is better (time or keystrokes)
  function gameResult(id, info) {
    info = info || {};
    var g = state.games[id], first = !g || !g.done, improved = false;
    if (!g) g = state.games[id] = { done: 0, best: 0, under: 0, hints: 0 };
    if (first) g.done = today();
    if (info.best !== undefined && (first || !g.best || info.best < g.best)) { improved = !first && !!g.best; g.best = info.best; if (info.hints !== undefined) g.hints = info.hints; }
    if (info.under) g.under = 1;
    save(); checkBadges();
    return { first: first, improved: improved };
  }
  function gameDone(id) { return !!(state.games[id] && state.games[id].done); }
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
    { id: 'recall50', icon: '✍️', name: 'Total recall', d: 'Type 50 flashcard answers correctly', test: function () { return state.counts.recalled >= 50; } },
    { id: 'treview10', icon: '🔁', name: 'Muscle memory', d: 'Redo 10 tasks from memory', test: function () { return state.counts.treviews >= 10; } },
    { id: 'daily7', icon: '📆', name: 'Daily devotee', d: 'Complete 7 daily challenges', test: function () { return state.counts.dailies >= 7; } },
    { id: 'prompt', icon: '🎨', name: 'Prompt artist', d: 'Design your own prompt in the prompt studio', test: function () { return !!state.settings.ps1; } },
    { id: 'escape', icon: '🗝️', name: 'Escape artist', d: 'Escape from a terminal escape room', test: function () { return Object.keys(state.games).some(function (k) { return k.indexOf('room.') === 0 && state.games[k].done; }); } },
    { id: 'week1', icon: '🥐', name: 'First week survived', d: 'Finish every story mission', test: function () { var st = content && content.games && content.games.story; return !!st && st.length > 0 && st.every(function (d) { return d.missions.every(function (m) { return gameDone(m.id); }); }); } },
    { id: 'golf5', icon: '⛳', name: 'Club champion', d: 'Finish 5 golf holes at or under par', test: function () { return Object.keys(state.games).filter(function (k) { return k.indexOf('golf.') === 0 && state.games[k].under; }).length >= 5; } },
    { id: 'boss1', icon: '⚔️', name: 'Boss slayer', d: 'Defeat a boss', test: function () { return Object.keys(state.games).some(function (k) { return k.indexOf('boss.') === 0 && state.games[k].done; }); } },
    { id: 'boss4', icon: '👑', name: 'Grand champion', d: 'Defeat all four bosses', test: function () { var b = content && content.games && content.games.bosses; return !!b && b.length >= 4 && b.every(function (x) { return gameDone(x.id); }); } },
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
    grade: grade, preview: preview, memory: memory, recalled: recalled, isDue: isDue, box: box, INTERVALS: INTERVALS,
    reviewTask: reviewTask, dueTasks: dueTasks, dailyResult: dailyResult, gameResult: gameResult, gameDone: gameDone,
    answer: answer, weak: weak, mistakes: mistakes,
    lessonDone: lessonDone, taskDone: taskDone, quizResult: quizResult, ran: ran, speedResult: speedResult,
    BADGES: BADGES, checkBadges: checkBadges,
    exportJSON: exportJSON, importJSON: importJSON, reset: reset
  };
})(window);
