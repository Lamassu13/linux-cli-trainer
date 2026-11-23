// Validate js/content.js against the schema and the terminal simulator.
//   node tools/validate.mjs              schema, ids, quizzes, simulated examples, guided tasks
//   node tools/validate.mjs <pdfTextDir> also checks facts against the book text (chNN.txt files)
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const ctx = vm.createContext({ console, structuredClone, Intl, window: {} });
vm.runInContext(readFileSync(new URL('js/content.js', root), 'utf8'), ctx);
vm.runInContext(readFileSync(new URL('js/terminal.js', root), 'utf8'), ctx);
const C = ctx.window.CONTENT, Term = ctx.window.Term;
// GAMES=path/to/games.json checks a draft games file instead of the one in content.js
if (process.env.GAMES) C.games = JSON.parse(readFileSync(process.env.GAMES, 'utf8'));
const errors = [], warns = [];
const E = (m) => errors.push(m), W = (m) => warns.push(m);

const ids = new Set(), cmds = new Map();
function uid(id, where) { if (!id) E(`missing id in ${where}`); else if (ids.has(id)) E(`duplicate id ${id}`); else ids.add(id); }
for (const m of C.modules) for (const l of m.lessons) for (const c of l.commands || []) {
  if (cmds.has(c.id)) E(`command ${c.id} defined twice`); cmds.set(c.id, { c, m, l });
}
const known = {}; for (const [id, x] of cmds) known[x.c.name || id] = x.l.id;
const docs = (n) => { for (const [, x] of cmds) if ((x.c.name || x.c.id) === n) return x.c; return null; };
const fresh = () => Term.create({ docs, known, now: () => new Date(2026, 10, 17, 9, 0).getTime() });
const BAD = /isn't simulated|command not found|syntax error|unexpected EOF|not simulated|needs a real Linux/;

let nCmd = 0, nEx = 0, nSim = 0, nTask = 0, nQuiz = 0, nTerm = 0;
for (const m of C.modules) {
  uid(m.id, 'module');
  for (const k of ['n', 'part', 'title', 'lessons']) if (m[k] === undefined) E(`${m.id}: missing ${k}`);
  for (const l of m.lessons) {
    uid(l.id, m.id);
    if (!l.title) E(`${l.id}: missing title`);
    for (const r of l.refs || []) if (!cmds.has(r)) E(`${l.id}: ref to unknown command ${r}`);
    for (const c of l.commands || []) {
      nCmd++;
      for (const k of ['id', 'name', 'kind', 'summary']) if (!c[k]) E(`${l.id}/${c.id}: missing ${k}`);
      if (!['cmd', 'builtin', 'keyword', 'syntax'].includes(c.kind)) E(`${c.id}: bad kind ${c.kind}`);
      if (c.summary && c.summary.length > 100) W(`${c.id}: long summary`);
      for (const f of c.flags || []) { if (!f.f || !f.d) E(`${c.id}: flag missing f/d`); if (f.d && f.d.length > 160) W(`${c.id} ${f.f}: long description`); }
      for (const e of c.examples || []) {
        nEx++;
        if (!e.cmd) { E(`${c.id}: example without cmd`); continue; }
        if (e.sim) {
          nSim++;
          const r = fresh().run(e.cmd);
          if (BAD.test(r.text)) E(`${c.id}: sim example fails: ${e.cmd}\n      → ${r.text.trim().split('\n')[0]}`);
        }
        if (e.viz && !['tree', 'pipe', 'scan', 'chmod'].includes(e.viz)) E(`${c.id}: bad viz ${e.viz}`);
      }
    }
    for (const t of l.terms || []) { nTerm++; if (!t.t || !t.d) E(`${l.id}: term missing t/d`); }
    for (const t of l.tasks || []) {
      nTask++; uid(t.id, l.id);
      if (!t.prompt || !t.solution || !Array.isArray(t.check) || !t.check.length) { E(`${t.id}: task needs prompt, solution, check[]`); continue; }
      const sh = fresh();
      if (sh.check(t.check, null).every(Boolean)) E(`${t.id}: checks already pass before the solution`);
      let last = null;
      for (const part of [t.solution]) last = sh.run(part);
      const res = sh.check(t.check, last);
      if (!res.every(Boolean)) E(`${t.id}: solution "${t.solution}" fails checks ${JSON.stringify(t.check.filter((c, i) => !res[i]))}\n      → ${(last.text || '').trim().slice(0, 160)}`);
    }
    for (const qz of l.quiz || []) {
      nQuiz++; uid(qz.id, l.id);
      if (qz.cmd && !cmds.has(qz.cmd)) W(`${qz.id}: cmd ${qz.cmd} is not a command id`);
      if (qz.type === 'mc' || qz.type === 'output') {
        if (!Array.isArray(qz.choices) || qz.choices.length < 2) E(`${qz.id}: needs choices`);
        else if (!(qz.answer >= 0 && qz.answer < qz.choices.length)) E(`${qz.id}: answer out of range`);
        else if (new Set(qz.choices).size !== qz.choices.length) E(`${qz.id}: duplicate choices`);
        if (qz.type === 'output' && !qz.out) E(`${qz.id}: output quiz needs out`);
      } else if (qz.type === 'fill') { if (!Array.isArray(qz.accept) || !qz.accept.length) E(`${qz.id}: fill needs accept[]`); }
      else if (qz.type === 'order') {
        if (!Array.isArray(qz.parts) || qz.parts.length < 2) E(`${qz.id}: order needs parts[]`);
        const key = (a) => a.slice().sort().join('\u0000');
        for (const r of qz.free || []) if (!(Array.isArray(r) && r[0] >= 0 && r[1] > r[0] && r[1] < qz.parts.length)) E(`${qz.id}: bad free range ${JSON.stringify(r)}`);
        for (const alt of qz.alts || []) if (!Array.isArray(alt) || key(alt) !== key(qz.parts)) E(`${qz.id}: an alt must use exactly the same pieces as parts`);
      }
      else E(`${qz.id}: unknown quiz type ${qz.type}`);
      if (!qz.q) E(`${qz.id}: missing q`);
    }
  }
}

// Mix-up pairs: every side names a real command, every item has a question, a/b answer and a reason.
let nPairs = 0;
for (const p of C.pairs || []) {
  uid('pair:' + p.id, 'pairs');
  if (!C.modules.some(m => m.n === p.ch)) E(`pair ${p.id}: unknown chapter ${p.ch}`);
  for (const side of [p.a, p.b]) if (!side || !side.label || !cmds.has(side.cmd)) E(`pair ${p.id}: side needs label and a known cmd (${side && side.cmd})`);
  for (const it of p.items || []) { nPairs++; if (!it.q || !/^[ab]$/.test(it.ans) || !it.why) E(`pair ${p.id}: item needs q, ans a|b, why`); }
}

// Games: every mission step, escape room, golf hole and terminal boss must be solvable in the simulator,
// and must not already be solved before its solution runs.
const G = C.games || {};
let nGames = 0;
const SIM_ONLY = (id, r, cmd) => { if (r && BAD.test(r.text || '')) E(`${id}: "${cmd}" is not runnable in the simulator → ${(r.text || '').trim().split('\n')[0]}`); };
function checkSteps(id, setup, steps) {
  const sh = fresh(); sh.load(setup);
  if (!Array.isArray(steps) || !steps.length) return E(`${id}: needs steps[]`);
  steps.forEach((st, i) => {
    if (!st.goal || !Array.isArray(st.check) || !st.check.length || !st.solution) return E(`${id} step ${i + 1}: needs goal, check[], solution`);
    if (sh.check(st.check, null).every(Boolean)) E(`${id} step ${i + 1}: checks already pass before its solution`);
    let last = null;
    for (const cmd of [].concat(st.solution)) { last = sh.run(cmd); SIM_ONLY(id, last, cmd); }
    const res = sh.check(st.check, last);
    if (!res.every(Boolean)) E(`${id} step ${i + 1} "${st.goal}": solution fails ${JSON.stringify(st.check.filter((c, k) => !res[k]))}\n      → ${(last.text || '').trim().slice(0, 160)}`);
  });
}
function checkFinal(id, setup, check, solution) {
  const sh = fresh(); sh.load(setup);
  if (!Array.isArray(check) || !check.length) return E(`${id}: needs check[]`);
  if (sh.check(check, null).every(Boolean)) E(`${id}: checks already pass before the solution`);
  let last = null;
  for (const cmd of [].concat(solution || [])) { last = sh.run(cmd); SIM_ONLY(id, last, cmd); }
  const res = sh.check(check, last);
  if (!res.every(Boolean)) E(`${id}: solution fails ${JSON.stringify(check.filter((c, k) => !res[k]))}\n      → ${((last && last.text) || '').trim().slice(0, 160)}`);
}
for (const day of G.story || []) {
  if (!day.id || !day.title || !Array.isArray(day.missions)) { E(`story day ${day.id}: needs id, title, missions[]`); continue; }
  for (const m of day.missions) { nGames++; uid(m.id, 'story'); if (!m.title || !m.intro) E(`${m.id}: needs title, intro`); checkSteps(m.id, m.setup, m.steps); }
}
for (const r of G.rooms || []) {
  nGames++; uid(r.id, 'rooms');
  if (!r.title || !r.intro || !Array.isArray(r.hints) || r.hints.length < 2) E(`${r.id}: needs title, intro, 2+ hints`);
  checkFinal(r.id, r.setup, r.check, r.solution);
}
for (const h of G.golf || []) {
  nGames++; uid(h.id, 'golf');
  if (!h.title || !h.goal || typeof h.par !== 'string') { E(`${h.id}: needs title, goal, par (the reference solution)`); continue; }
  if ((h.check || []).every(c => c.t === 'out')) E(`${h.id}: golf checks only look at output, so a bare echo could beat par; add a cmd or file check`);
  checkFinal(h.id, h.setup, h.check, [h.par]);
}
for (const b of G.bosses || []) {
  nGames++; uid(b.id, 'bosses');
  if (!b.title || !b.intro || !(b.time > 0) || ![1, 2, 3, 4].includes(b.part)) E(`${b.id}: needs title, intro, time, part 1-4`);
  if (b.kind === 'terminal') checkSteps(b.id, b.setup, b.steps);
  else if (b.kind === 'quiz') { if (!(b.count > 0 && b.lives > 0) || !(b.chapters || []).length || b.chapters.some(n => !C.modules.some(m => m.n === n))) E(`${b.id}: quiz boss needs count, lives, chapters[] of real chapters`); }
  else E(`${b.id}: kind must be terminal or quiz`);
}

// Book checks (optional): names and flags present in the chapter text, no 8-word copies, chapter openers covered.
const dump = process.argv[2];
if (dump && existsSync(dump)) {
  const text = {}, flat = (s) => s.replace(/<<p\.\d+>>/g, ' ').toLowerCase().replace(/[^a-z0-9$\-\s]/g, ' ').split(/\s+/).filter(Boolean);
  for (const m of C.modules) text[m.n] = readFileSync(`${dump}/ch${String(m.n).padStart(2, '0')}.txt`, 'utf8');
  const book = Object.values(text).join('\n');
  const shingles = new Set(), words = flat(book);
  for (let i = 0; i + 8 <= words.length; i++) shingles.add(words.slice(i, i + 8).join(' '));
  const has = (hay, needle) => new RegExp('(^|[^\\w-])' + needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\w])').test(hay);
  const copied = (s) => { const w = flat(s || ''); for (let i = 0; i + 8 <= w.length; i++) if (shingles.has(w.slice(i, i + 8).join(' '))) return w.slice(i, i + 8).join(' '); return null; };
  for (const [id, { c, m }] of cmds) {
    const chText = c.chapters.map(n => text[n]).join('\n');
    if (c.kind === 'cmd' && !has(chText, c.name)) E(`${id}: name "${c.name}" not found in its chapter text`);
    for (const f of c.flags || []) {
      const ft = f.f.split(/[ =]/)[0];
      if (!has(text[f.ch || m.n] || '', ft) && !has(chText, ft)) W(`${id}: flag ${f.f} not in chapter ${f.ch || m.n} text`);
    }
    for (const s of [c.summary, c.explain, ...(c.flags || []).map(f => f.d), ...(c.examples || []).map(e => e.note)]) { const hit = copied(s); if (hit) E(`${id}: copies the book: "${hit}"`); }
  }
  for (const m of C.modules) for (const l of m.lessons) {
    for (const s of [l.intro, ...(l.terms || []).map(t => t.d), ...(l.quiz || []).map(q => q.explain)]) { const hit = copied(s); if (hit) E(`${l.id}: copies the book: "${hit}"`); }
  }
  for (const p of C.pairs || []) for (const it of p.items || []) for (const s of [it.q, it.why]) { const hit = copied(s); if (hit) E(`pair ${p.id}: copies the book: "${hit}"`); }
  const gameText = [];
  for (const d of G.story || []) { gameText.push([d.id, d.intro]); for (const m of d.missions || []) { gameText.push([m.id, m.intro], [m.id, m.outro]); for (const st of m.steps || []) gameText.push([m.id, st.goal], [m.id, st.hint]); } }
  for (const r of G.rooms || []) { gameText.push([r.id, r.intro], [r.id, r.outro]); (r.hints || []).forEach(h => gameText.push([r.id, h])); }
  for (const h of G.golf || []) gameText.push([h.id, h.goal], [h.id, h.tip]);
  for (const b of G.bosses || []) { gameText.push([b.id, b.intro]); for (const st of b.steps || []) gameText.push([b.id, st.goal]); }
  for (const [id, txt] of gameText) { const hit = copied(txt); if (hit) E(`${id}: copies the book: "${hit}"`); }
  // chapter-opener command lists: "name Description" lines on the first page of each chapter
  const names = new Set([...cmds.values()].map(x => x.c.name));
  for (const m of C.modules) {
    const first = text[m.n].split(/<<p\.\d+>>/).slice(1, 3).join('\n');
    for (const line of first.split('\n')) {
      const mm = line.trim().match(/^([a-z][\w.-]{0,15}) ([A-Z][a-z]+(?: [\w'’/-]+)+)$/);
      if (mm && /^(Print|Change|List|Determine|View|Copy|Move|Create|Remove|Indicate|Display|Get|Concatenate|Sort|Report|Output|Read|Clear|Set|Execute|Run|Send|Kill|Place|Shut|Mount|Unmount|Check|Manipulate|Convert|Calculate|Internet|Non|OpenSSH|Find|Search|Build|Compress|Tape|Package|Merge|Join|Compare|Apply|Translate|Stream|Interactive|Number|Wrap|Prepare|Format|Show|Cancel|Utility|Export|Calculate)/.test(mm[2]) && !names.has(mm[1]))
        E(`ch${m.n}: opener command "${mm[1]}" missing from content`);
    }
  }
}

console.log(`${C.modules.length} modules · ${nCmd} commands · ${nEx} examples (${nSim} simulated) · ${nTerm} terms · ${nTask} tasks · ${nQuiz} quiz items · ${nPairs} mix-up items · ${nGames} games`);
warns.slice(0, 40).forEach(w => console.log('warn  ', w));
if (warns.length > 40) console.log(`warn   … ${warns.length - 40} more`);
errors.forEach(e => console.log('ERROR ', e));
console.log(errors.length ? `✗ ${errors.length} errors` : '✓ content valid');
process.exitCode = errors.length ? 1 : 0;
