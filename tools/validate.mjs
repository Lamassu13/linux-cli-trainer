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
      else if (qz.type === 'order') { if (!Array.isArray(qz.parts) || qz.parts.length < 2) E(`${qz.id}: order needs parts[]`); }
      else E(`${qz.id}: unknown quiz type ${qz.type}`);
      if (!qz.q) E(`${qz.id}: missing q`);
    }
  }
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

console.log(`${C.modules.length} modules · ${nCmd} commands · ${nEx} examples (${nSim} simulated) · ${nTerm} terms · ${nTask} tasks · ${nQuiz} quiz items`);
warns.slice(0, 40).forEach(w => console.log('warn  ', w));
if (warns.length > 40) console.log(`warn   … ${warns.length - 40} more`);
errors.forEach(e => console.log('ERROR ', e));
console.log(errors.length ? `✗ ${errors.length} errors` : '✓ content valid');
process.exitCode = errors.length ? 1 : 0;
