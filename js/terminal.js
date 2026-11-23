/* terminal.js — a small bash-like shell over a virtual filesystem.
 * Pure engine: no DOM. app.js draws the UI; tools/*.mjs run it under node.
 *
 *   const sh = Term.create({ docs, known, now });
 *   const r = sh.run('ls -l | sort');   // { text, out, err, code, stages, clear, stub }
 *
 * Only commands and options taught in the book are simulated. Anything else
 * prints a friendly message instead of guessing at behaviour.
 */
(function (G) {
  'use strict';

  var HOME = '/home/me', USER = 'me', HOST = 'linuxbox';
  var UMASK0 = '0002';

  /* ---------- fixture filesystem ---------- */
  var BIN = 'bash cat chmod cp date df echo file ln ls mkdir mv pwd rm touch'.split(' ');
  var USRBIN = ('bzip2 cal cut du find fold free grep gunzip gzip head id less man nl paste printenv ps sort stat tail tee tr uniq unzip wc whatis which zip zipinfo').split(' ');
  var DISTROS = [
    ['SUSE', '10.2', '12/07/2006'], ['Fedora', '10', '11/25/2008'], ['SUSE', '11.0', '06/19/2008'],
    ['Ubuntu', '8.04', '04/24/2008'], ['Fedora', '8', '11/08/2007'], ['SUSE', '10.3', '10/04/2007'],
    ['Ubuntu', '6.10', '10/26/2006'], ['Fedora', '7', '05/31/2007']
  ].map(function (r) { return r.join('\t'); }).join('\n') + '\n';

  function fixtureSpec() {
    var bin = {}, ubin = {};
    BIN.forEach(function (n) { bin[n] = { $file: '\x7fELF binary', mode: '755', owner: 'root', size: 120000 + n.length * 4096 }; });
    USRBIN.forEach(function (n) { ubin[n] = { $file: '\x7fELF binary', mode: '755', owner: 'root', size: 40000 + n.length * 2048 }; });
    return { $dir: {
      bin: { $dir: bin, owner: 'root' },
      dev: { $dir: { null: { $dev: true } }, owner: 'root' },
      etc: { $dir: {
        passwd: { $file: 'root:x:0:0:root:/root:/bin/bash\nme:x:1000:1000:Me,,,:/home/me:/bin/bash\n', owner: 'root' },
        hosts: { $file: '127.0.0.1\tlocalhost\n127.0.1.1\tlinuxbox\n', owner: 'root' },
        fstab: { $file: 'LABEL=/12   /        ext4   defaults   1 1\nLABEL=/home /home    ext4   defaults   1 2\n/dev/sda1   /boot    ext4   defaults   1 2\n', owner: 'root' }
      }, owner: 'root' },
      home: { $dir: { me: { $dir: {
        '.bashrc': "# .bashrc\nalias ll='ls -l'\nexport EDITOR=nano\n",
        '.profile': '# ~/.profile: run by login shells\nPATH="$HOME/bin:$PATH"\n',
        Desktop: {}, Music: {}, Videos: {}, playground: {},
        Documents: { 'report.txt': 'Quarterly report\nSales are up this quarter.\nCosts are down.\n', 'todo.txt': 'buy milk\nfix bike\ncall home\n' },
        Pictures: { 'beach.jpg': { $file: '', bin: 'jpg', size: 48213 }, 'cat.jpg': { $file: '', bin: 'jpg', size: 20480 }, 'dog.png': { $file: '', bin: 'png', size: 31744 } },
        'notes.txt': 'Linux is fun\nThe shell is a program\nls lists files\nMy notes end here\n',
        'error.txt': 'error: file not found\nwarning: low disk space\nerror: permission denied\n',
        'fruits.txt': 'banana\napple\ncherry\napple\nbanana\ndate\napple\n',
        'distros.txt': DISTROS,
        'data.csv': 'name,age,city\nann,31,Paris\nbob,25,Rome\ncy,40,Oslo\n',
        'hello.sh': { $file: "#!/bin/bash\n\n# This is our first script.\n\necho 'Hello World!'\n", mode: '644' },
        'foo.txt': 'foo\n'
      } } }, owner: 'root' },
      root: { $dir: {}, owner: 'root', mode: '700' },
      tmp: { $dir: {}, owner: 'root', mode: '1777' },
      usr: { $dir: { bin: { $dir: ubin, owner: 'root' }, games: { $dir: {}, owner: 'root' }, include: { $dir: {}, owner: 'root' }, lib: { $dir: {}, owner: 'root' }, local: { $dir: {}, owner: 'root' }, sbin: { $dir: {}, owner: 'root' }, share: { $dir: {}, owner: 'root' }, src: { $dir: {}, owner: 'root' } }, owner: 'root' },
      var: { $dir: { log: { $dir: { syslog: { $file: 'Nov 17 09:00:01 linuxbox kernel: Linux version 5.x\nNov 17 09:00:02 linuxbox systemd[1]: Started Session 1 of user me.\n', owner: 'root', mode: '640' } }, owner: 'root' } }, owner: 'root' }
    }, owner: 'root' };
  }

  // Build the tree. Each node gets a fixed mtime a minute apart so `ls -t` is stable.
  function buildFs(t0) {
    var tick = 0;
    function mk(spec, owner) {
      tick++;
      var mtime = t0 - (400 - tick) * 60000;
      if (typeof spec === 'string') return { t: 'f', data: spec, mode: '664', owner: owner, mtime: mtime };
      if (spec.$dev) return { t: 'c', data: '', mode: '666', owner: 'root', mtime: mtime };
      if (spec.$file !== undefined) {
        var f = { t: 'f', data: spec.$file, mode: spec.mode || '664', owner: spec.owner || owner, mtime: mtime };
        if (spec.size) f.size = spec.size;
        if (spec.bin) f.bin = spec.bin;
        if (spec.owner === 'root' && !spec.mode) f.mode = '644';
        return f;
      }
      var body = spec.$dir || spec, own = spec.$dir ? (spec.owner || owner) : owner;
      var d = { t: 'd', kids: {}, mode: spec.mode || (own === 'root' ? '755' : '775'), owner: own, mtime: mtime };
      Object.keys(body).forEach(function (k) { d.kids[k] = mk(body[k], k === 'me' ? 'me' : own); });
      return d;
    }
    return mk(fixtureSpec(), 'root');
  }

  /* ---------- small helpers ---------- */
  function pad(s, n) { s = String(s); while (s.length < n) s = ' ' + s; return s; }
  function rpad(s, n) { s = String(s); while (s.length < n) s += ' '; return s; }
  function lines(s) { if (!s) return []; var a = s.split('\n'); if (a[a.length - 1] === '') a.pop(); return a; }
  function unlines(a) { return a.length ? a.join('\n') + '\n' : ''; }
  function basename(p) { var a = p.replace(/\/+$/, '').split('/'); return a[a.length - 1] || '/'; }
  function dirname(p) { var i = p.replace(/\/+$/, '').lastIndexOf('/'); return i <= 0 ? '/' : p.slice(0, i); }
  function q(s) { return "'" + s + "'"; }
  function sizeOf(n) { return n.t === 'd' ? 4096 : n.t === 'l' ? n.target.length : n.t === 'c' ? 0 : (n.size || n.data.length); }
  function two(n) { return (n < 10 ? '0' : '') + n; }
  function fmtTime(ms) { var d = new Date(ms); return d.getFullYear() + '-' + two(d.getMonth() + 1) + '-' + two(d.getDate()) + ' ' + two(d.getHours()) + ':' + two(d.getMinutes()); }
  function human(n) {
    if (n < 1024) return String(n);
    var u = 'KMGT', i = -1;
    do { n /= 1024; i++; } while (n >= 1024 && i < 3);
    return (n < 10 ? (Math.ceil(n * 10) / 10).toFixed(1) : String(Math.ceil(n))) + u[i];
  }
  function modeStr(n) {
    var m = parseInt(n.mode, 8), s = '', r = 'rwxrwxrwx';
    for (var i = 0; i < 9; i++) s += (m & (256 >> i)) ? r[i] : '-';
    if (m & 2048) s = s.slice(0, 2) + (s[2] === 'x' ? 's' : 'S') + s.slice(3);
    if (m & 1024) s = s.slice(0, 5) + (s[5] === 'x' ? 's' : 'S') + s.slice(6);
    if (m & 512) s = s.slice(0, 8) + (s[8] === 'x' ? 't' : 'T');
    return ({ d: 'd', l: 'l', c: 'c', f: '-' })[n.t] + s;
  }
  function err(s, code) { return { out: '', err: s + '\n', code: code === undefined ? 1 : code }; }
  function ok(out) { return { out: out || '', err: '', code: 0 }; }

  /* Option parser: short flags (bundled), value flags, a few long names. */
  function opts(args, short, withVal, longMap) {
    var o = { _all: [] }, rest = [];
    withVal = withVal || ''; longMap = longMap || {};
    for (var i = 0; i < args.length; i++) {
      var a = args[i];
      if (a === '--') { rest = rest.concat(args.slice(i + 1)); break; }
      if (a.slice(0, 2) === '--') {
        var eq = a.indexOf('='), k = eq < 0 ? a.slice(2) : a.slice(2, eq);
        if (!(k in longMap)) return { bad: a };
        var lk = longMap[k];
        if (withVal.indexOf(lk) >= 0) { var lv = eq < 0 ? args[++i] : a.slice(eq + 1); o[lk] = lv; o._all.push([lk, lv]); }
        else o[lk] = true;
        continue;
      }
      if (a[0] === '-' && a.length > 1) {
        for (var j = 1; j < a.length; j++) {
          var ch = a[j];
          if (withVal.indexOf(ch) >= 0) {
            var v = a.slice(j + 1) || args[++i];
            if (v === undefined) return { bad: '-' + ch, missing: true };
            o[ch] = v; o._all.push([ch, v]); break;
          }
          if (short.indexOf(ch) < 0) return { bad: '-' + ch };
          o[ch] = true;
        }
        continue;
      }
      rest.push(a);
    }
    o.rest = rest;
    return o;
  }
  function badOpt(name, o) {
    return o.missing ? err(name + ': option requires an argument -- ' + q(o.bad.slice(1)), 2)
      : err(name + ': option ' + o.bad + " isn't simulated in this trainer (the lesson explains it)", 2);
  }

  /* ---------- POSIX-ish regex & glob translation ---------- */
  var CLASSES = { alnum: 'A-Za-z0-9', alpha: 'A-Za-z', digit: '0-9', lower: 'a-z', upper: 'A-Z', space: ' \\t\\n\\r\\f\\v', blank: ' \\t', punct: '!-\\/:-@\\[-`{-~', xdigit: '0-9A-Fa-f', cntrl: '\\x00-\\x1f', print: ' -~', graph: '!-~' };
  // Translate a bracket expression starting at s[i]==='['; returns [jsText, nextIndex] or null.
  function bracket(s, i, bang) {
    var j = i + 1, neg = false, body = '';
    if (s[j] === '^' || (bang && s[j] === '!')) { neg = true; j++; }
    if (s[j] === ']') { body += '\\]'; j++; }
    while (j < s.length && s[j] !== ']') {
      if (s[j] === '[' && s[j + 1] === ':') {
        var e = s.indexOf(':]', j + 2);
        if (e < 0) return null;
        var cls = CLASSES[s.slice(j + 2, e)];
        if (cls === undefined) return null;
        body += cls; j = e + 2; continue;
      }
      body += (s[j] === '\\' || s[j] === '^' || s[j] === '[') ? '\\' + s[j] : s[j];
      j++;
    }
    if (j >= s.length) return null;
    return ['[' + (neg ? '^' : '') + body + ']', j + 1];
  }
  // grep pattern (BRE unless ere) -> JS RegExp source
  function posixRe(p, ere) {
    var out = '', i = 0;
    while (i < p.length) {
      var c = p[i];
      if (c === '[') { var b = bracket(p, i, false); if (b) { out += b[0]; i = b[1]; continue; } out += '\\['; i++; continue; }
      if (c === '\\' && i + 1 < p.length) {
        var n = p[i + 1];
        if (!ere && '(){}|+?'.indexOf(n) >= 0) out += n;
        else if (/[wWsSbB]/.test(n)) out += '\\' + n;
        else if (n === '<') out += '\\b(?=\\w)';
        else if (n === '>') out += '\\b(?<=\\w)';
        else if (/[1-9]/.test(n)) out += '\\' + n;
        else out += '\\' + n.replace(/[a-zA-Z0-9]/, function (x) { return x; });
        i += 2; continue;
      }
      if (!ere && '(){}|+?'.indexOf(c) >= 0) { out += '\\' + c; i++; continue; }
      if (c === '*' && (out === '' || out === '^')) { out += '\\*'; i++; continue; }
      if (c === '/') { out += '\\/'; i++; continue; }
      out += c; i++;
    }
    return out;
  }
  // glob pattern (array of {c,q}) -> RegExp
  function globRe(chars) {
    var s = '', i = 0;
    while (i < chars.length) {
      var ch = chars[i];
      if (ch.q === 0 && ch.c === '*') { s += '[^/]*'; i++; continue; }
      if (ch.q === 0 && ch.c === '?') { s += '[^/]'; i++; continue; }
      if (ch.q === 0 && ch.c === '[') {
        var raw = chars.slice(i).map(function (x) { return x.c; }).join('');
        var b = bracket(raw, 0, true);
        if (b) { s += b[0]; i += b[1]; continue; }
      }
      s += ch.c.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&'); i++;
    }
    return new RegExp('^' + s + '$');
  }
  function hasGlob(chars) { return chars.some(function (x) { return x.q === 0 && (x.c === '*' || x.c === '?' || x.c === '['); }); }

  /* ---------- lexer ---------- */
  // A word is an array of {c, q, sp}: q 0 = unquoted, 1 = literal (single quotes / escaped), 2 = double quotes.
  function SyntaxErr(msg) { this.message = msg; }
  function scanBalanced(src, i, open, close) {
    var depth = 0;
    for (var j = i; j < src.length; j++) {
      var c = src[j];
      if (c === '\\') { j++; continue; }
      if (c === "'") { var e = src.indexOf("'", j + 1); if (e < 0) break; j = e; continue; }
      if (c === open) depth++;
      else if (c === close) { depth--; if (depth === 0) return j; }
    }
    throw new SyntaxErr('unexpected EOF while looking for matching `' + close + "'");
  }
  function lex(src) {
    var toks = [], w = null, i = 0;
    function push() { if (w) { toks.push({ t: 'w', w: w }); w = null; } }
    function add(c, qq) { (w || (w = [])).push({ c: c, q: qq }); }
    function op(o) { push(); toks.push({ t: 'op', v: o }); }
    function subst(qq) { // copy $(..), $((..)), ${..}, `..` raw into the word
      var e;
      if (src[i] === '`') { e = src.indexOf('`', i + 1); if (e < 0) throw new SyntaxErr('unexpected EOF while looking for matching ``\''); }
      else if (src[i + 1] === '(') e = scanBalanced(src, i + 1, '(', ')');
      else if (src[i + 1] === '{') e = scanBalanced(src, i + 1, '{', '}');
      else { add('$', qq); i++; return; }
      for (var k = i; k <= e; k++) add(src[k], qq);
      i = e + 1;
    }
    while (i < src.length) {
      var c = src[i], n = src[i + 1];
      if (c === ' ' || c === '\t' || c === '\n') { push(); i++; continue; }
      if (c === '#' && !w) break;
      if (c === "'") {
        var e = src.indexOf("'", i + 1);
        if (e < 0) throw new SyntaxErr("unexpected EOF while looking for matching `''");
        w = w || [];
        for (var k = i + 1; k < e; k++) add(src[k], 1);
        i = e + 1; continue;
      }
      if (c === '"') {
        i++; w = w || [];
        while (i < src.length && src[i] !== '"') {
          if (src[i] === '\\' && '"\\$`'.indexOf(src[i + 1]) >= 0) { add(src[i + 1], 1); i += 2; continue; }
          if (src[i] === '$' || src[i] === '`') { subst(2); continue; }
          add(src[i], 2); i++;
        }
        if (i >= src.length) throw new SyntaxErr('unexpected EOF while looking for matching `"\'');
        i++; continue;
      }
      if (c === '\\') { if (n !== undefined) add(n, 1); i += 2; continue; }
      if (c === '$' || c === '`') { subst(0); continue; }
      if (c === '2' && !w && n === '>') {
        if (src.slice(i, i + 4) === '2>&1') { op('2>&1'); i += 4; continue; }
        if (src[i + 2] === '>') { op('2>>'); i += 3; continue; }
        op('2>'); i += 2; continue;
      }
      if (c === '|') { if (n === '|') { op('||'); i += 2; } else { op('|'); i++; } continue; }
      if (c === '&') {
        if (n === '&') { op('&&'); i += 2; } else if (n === '>' && src[i + 2] === '>') { op('&>>'); i += 3; } else if (n === '>') { op('&>'); i += 2; } else { op('&'); i++; }
        continue;
      }
      if (c === ';') { op(';'); i++; continue; }
      if (c === '>') { if (n === '>') { op('>>'); i += 2; } else { op('>'); i++; } continue; }
      if (c === '<') { if (n === '<') throw new SyntaxErr('here documents work in scripts; they are not simulated here'); op('<'); i++; continue; }
      if (c === '(' || c === ')') throw new SyntaxErr('subshells ( ) are not simulated in this terminal');
      add(c, 0); i++;
    }
    push();
    return toks;
  }
  // tokens -> [{ sep, pipe:[{words, redirs}] }]
  function parse(toks) {
    var lists = [], pipe = [], cmd = { words: [], redirs: [] }, sep = null;
    function endCmd(tok) {
      if (!cmd.words.length && !cmd.redirs.length) throw new SyntaxErr('syntax error near unexpected token `' + tok + "'");
      pipe.push(cmd); cmd = { words: [], redirs: [] };
    }
    for (var i = 0; i < toks.length; i++) {
      var t = toks[i];
      if (t.t === 'w') { cmd.words.push(t.w); continue; }
      if (t.v === '|') { endCmd('|'); continue; }
      if (t.v === '&&' || t.v === '||' || t.v === ';' || t.v === '&') {
        endCmd(t.v); lists.push({ sep: sep, pipe: pipe, bg: t.v === '&' }); pipe = []; sep = t.v === '&' ? ';' : t.v; continue;
      }
      if (t.v === '2>&1') { cmd.redirs.push({ op: t.v }); continue; }
      var nx = toks[i + 1];
      if (!nx || nx.t !== 'w') throw new SyntaxErr('syntax error near unexpected token `' + (nx ? nx.v : 'newline') + "'");
      cmd.redirs.push({ op: t.v, w: nx.w }); i++;
    }
    if (cmd.words.length || cmd.redirs.length) pipe.push(cmd);
    else if (pipe.length || (sep && sep !== ';')) throw new SyntaxErr('syntax error: unexpected end of command');
    if (pipe.length) lists.push({ sep: sep, pipe: pipe });
    return lists;
  }

  /* ---------- arithmetic $(( )) — integer Pratt parser, no eval ---------- */
  function arith(src, sh) {
    var toks = src.match(/\d+#[0-9a-zA-Z@_]+|0[xX][0-9a-fA-F]+|\d+|[A-Za-z_]\w*|\*\*=?|<<=?|>>=?|\+\+|--|&&|\|\||[<>=!]=|[-+*\/%&|^]=|[-+*\/%<>&|^!~?:=(),]|\S/g) || [];
    var p = 0;
    function peek() { return toks[p]; }
    function next() { return toks[p++]; }
    function num(t) {
      if (/^\d+#/.test(t)) { var parts = t.split('#'); return parseInt(parts[1], +parts[0]); }
      if (/^0[xX]/.test(t)) return parseInt(t, 16);
      if (/^0\d/.test(t)) return parseInt(t, 8);
      return parseInt(t, 10);
    }
    function getv(n) { var v = sh.getVar(n); return v === '' || v === undefined ? 0 : (/^-?\d+$/.test(v) ? parseInt(v, 10) : arith(v, sh)); }
    var BIN = { ',': 1, '||': 3, '&&': 4, '|': 5, '^': 6, '&': 7, '==': 8, '!=': 8, '<': 9, '>': 9, '<=': 9, '>=': 9, '<<': 10, '>>': 10, '+': 11, '-': 11, '*': 12, '/': 12, '%': 12, '**': 13 };
    function primary() {
      var t = next();
      if (t === undefined) throw new SyntaxErr('arithmetic: syntax error: operand expected');
      if (t === '(') { var v = expr(0); if (next() !== ')') throw new SyntaxErr('arithmetic: missing )'); return v; }
      if (t === '-') return -primary();
      if (t === '+') return +primary();
      if (t === '!') return primary() ? 0 : 1;
      if (t === '~') return ~primary();
      if (t === '++' || t === '--') { var nm = next(); var nv = getv(nm) + (t === '++' ? 1 : -1); sh.setVar(nm, String(nv)); return nv; }
      if (/^\d/.test(t)) return num(t);
      if (/^[A-Za-z_]/.test(t)) {
        var a = peek();
        if (a === '++' || a === '--') { p++; var old = getv(t); sh.setVar(t, String(old + (a === '++' ? 1 : -1))); return old; }
        if (a && /^(=|[-+*\/%&|^]=|\*\*=|<<=|>>=)$/.test(a)) {
          p++; var rhs = expr(2), cur = getv(t), res = a === '=' ? rhs : apply(a.slice(0, -1), cur, rhs);
          sh.setVar(t, String(res)); return res;
        }
        return getv(t);
      }
      throw new SyntaxErr('arithmetic: syntax error: invalid token "' + t + '"');
    }
    function apply(o, a, b) {
      switch (o) {
        case '+': return a + b; case '-': return a - b; case '*': return a * b;
        case '/': if (b === 0) throw new SyntaxErr('division by 0'); return Math.trunc(a / b);
        case '%': if (b === 0) throw new SyntaxErr('division by 0'); return a % b;
        case '**': return Math.pow(a, b);
        case '<<': return a << b; case '>>': return a >> b;
        case '&': return a & b; case '|': return a | b; case '^': return a ^ b;
        case '<': return +(a < b); case '>': return +(a > b); case '<=': return +(a <= b); case '>=': return +(a >= b);
        case '==': return +(a === b); case '!=': return +(a !== b);
        case '&&': return +(a && b); case '||': return +(a || b); case ',': return b;
      }
    }
    function expr(min) {
      var left = primary();
      for (;;) {
        var o = peek();
        if (o === '?' && min <= 2) { p++; var a = expr(0); if (next() !== ':') throw new SyntaxErr('arithmetic: expected :'); var b = expr(2); left = left ? a : b; continue; }
        var pr = BIN[o];
        if (!pr || pr < min) return left;
        p++;
        left = apply(o, left, expr(o === '**' ? pr : pr + 1));
      }
    }
    if (!toks.length) return 0;
    var v = expr(0);
    if (p < toks.length) throw new SyntaxErr('arithmetic: syntax error in expression (error token is "' + toks[p] + '")');
    return v;
  }

  /* ---------- the shell ---------- */
  function create(opt) {
    opt = opt || {};
    var now = opt.now || function () { return Date.now(); };
    var docs = opt.docs || function () { return null; };   // name -> command object from content.js
    var known = opt.known || {};                           // name -> lessonId for stub messages
    var sh = {};
    var root = buildFs(opt.t0 || new Date(2026, 9, 26, 17, 20).getTime());
    var vars = {
      HOME: HOME, USER: USER, LOGNAME: USER, SHELL: '/bin/bash', HOSTNAME: HOST, LANG: 'en_US.UTF-8', TERM: 'xterm-256color',
      PATH: '/home/me/bin:/usr/local/bin:/usr/bin:/bin', PWD: HOME, OLDPWD: HOME, PS1: '[\\u@\\h \\W]\\$ ', EDITOR: 'nano', PAGER: 'less'
    };
    var exported = { HOME: 1, USER: 1, LOGNAME: 1, SHELL: 1, HOSTNAME: 1, LANG: 1, TERM: 1, PATH: 1, PWD: 1, OLDPWD: 1, EDITOR: 1, PAGER: 1 };
    var aliases = {}, history = [], umask = UMASK0, status = 0, trace = false, inodes = new WeakMap(), nextIno = 1048577;
    sh.cwd = HOME;

    /* --- paths & nodes --- */
    function norm(p, base) {
      if (p === '') return base || sh.cwd;
      var parts = (p[0] === '/' ? p : (base || sh.cwd) + '/' + p).split('/'), out = [];
      parts.forEach(function (x) { if (x === '' || x === '.') return; if (x === '..') out.pop(); else out.push(x); });
      return '/' + out.join('/');
    }
    function walk(abs, follow, depth) {
      if ((depth || 0) > 20) return null;
      var parts = abs.split('/').filter(Boolean), node = root, path = '';
      for (var i = 0; i < parts.length; i++) {
        if (node.t !== 'd') return null;
        var nx = node.kids[parts[i]];
        if (!nx) return null;
        if (nx.t === 'l' && (i < parts.length - 1 || follow)) {
          nx = walk(norm(nx.target, path || '/'), true, (depth || 0) + 1);
          if (!nx) return null;
        }
        path += '/' + parts[i];
        node = nx;
      }
      return node;
    }
    // { abs, node, parent, name } ; node may be null
    function look(p, follow) {
      var abs = norm(p), parent = abs === '/' ? null : walk(dirname(abs), true);
      var name = basename(abs), node = abs === '/' ? root : (parent && parent.t === 'd' ? parent.kids[name] || null : null);
      if (node && node.t === 'l' && follow !== false) node = walk(abs, true);
      return { abs: abs, node: node, parent: parent && parent.t === 'd' ? parent : null, name: name };
    }
    function can(n, bit) {
      var m = parseInt(n.mode, 8), sh3 = n.owner === USER ? 6 : 0;
      return !!((m >> sh3) & bit);
    }
    function ino(n) { if (!inodes.has(n)) inodes.set(n, nextIno++); return inodes.get(n); }
    function newMode(isDir) { var u = parseInt(umask, 8); return ((isDir ? 511 : 438) & ~u).toString(8); }
    function readFile(name, p) {
      var L = look(p);
      if (!L.node) return { e: name + ': ' + p + ': No such file or directory' };
      if (L.node.t === 'd') return { e: name + ': ' + p + ': Is a directory' };
      if (!can(L.node, 4)) return { e: name + ': ' + p + ': Permission denied' };
      if (L.node.bin) return { d: '��JFIF (binary data — not shown)\n', bin: true };
      return { d: L.node.data };
    }
    function writeFile(name, p, data, append) {
      var L = look(p);
      if (L.node && L.node.t === 'c') return null;
      if (L.node && L.node.t === 'd') return name + ': ' + p + ': Is a directory';
      if (!L.parent) return name + ': ' + p + ': No such file or directory';
      if (L.node) {
        if (!can(L.node, 2)) return name + ': ' + p + ': Permission denied';
        L.node.data = append ? L.node.data + data : data; L.node.mtime = now(); delete L.node.size; delete L.node.bin;
        return null;
      }
      if (!can(L.parent, 2)) return name + ': ' + p + ': Permission denied';
      L.parent.kids[L.name] = { t: 'f', data: data, mode: newMode(false), owner: USER, mtime: now() };
      return null;
    }
    sh.look = look; sh.norm = norm;

    /* --- variables --- */
    sh.getVar = function (n) {
      if (n === '?') return String(status);
      if (n === '$') return '4242';
      if (n === '0') return 'bash';
      if (n === '#') return '0';
      if (n === 'PWD') return sh.cwd;
      if (n === 'RANDOM') return String(Math.floor(Math.random() * 32768));
      return vars[n] === undefined ? '' : vars[n];
    };
    sh.setVar = function (n, v) { vars[n] = v; };

    /* --- expansion (brace, tilde, parameter/arith/command, split, glob) --- */
    function chars(s, qq) { return s.split('').map(function (c) { return { c: c, q: qq }; }); }
    function str(w) { return w.map(function (x) { return x.c; }).join(''); }
    function braces(w) {
      for (var i = 0; i < w.length; i++) {
        if (w[i].q !== 0 || w[i].c !== '{' || (i > 0 && w[i - 1].c === '$' && w[i - 1].q !== 1)) continue;
        var depth = 0, commas = [], j;
        for (j = i; j < w.length; j++) {
          if (w[j].q !== 0) continue;
          if (w[j].c === '{') depth++;
          else if (w[j].c === '}') { depth--; if (depth === 0) break; }
          else if (w[j].c === ',' && depth === 1) commas.push(j);
        }
        if (j >= w.length) return [w];
        var pre = w.slice(0, i), post = w.slice(j + 1), alts = [];
        if (commas.length) {
          var s = i + 1;
          commas.concat([j]).forEach(function (c) { alts.push(w.slice(s, c)); s = c + 1; });
        } else {
          var m = str(w.slice(i + 1, j)).match(/^(-?\d+|[a-zA-Z])\.\.(-?\d+|[a-zA-Z])$/);
          if (!m) continue;
          var a = m[1], b = m[2], numeric = /\d/.test(a);
          if (numeric !== /\d/.test(b)) continue;
          var x = numeric ? +a : a.charCodeAt(0), y = numeric ? +b : b.charCodeAt(0), step = x <= y ? 1 : -1;
          var width = (/^-?0\d/.test(a) || /^-?0\d/.test(b)) ? Math.max(a.length, b.length) : 0;
          for (var v = x; step > 0 ? v <= y : v >= y; v += step) {
            var t = numeric ? String(v) : String.fromCharCode(v);
            if (width) { var neg = v < 0; t = String(Math.abs(v)); while (t.length < width - (neg ? 1 : 0)) t = '0' + t; if (neg) t = '-' + t; }
            alts.push(chars(t, 1));
          }
        }
        var res = [];
        alts.forEach(function (alt) { braces(pre.concat(alt, post)).forEach(function (r) { res.push(r); }); });
        return res;
      }
      return [w];
    }
    function tilde(w) {
      if (!w.length || w[0].c !== '~' || w[0].q !== 0) return w;
      var j = 1;
      while (j < w.length && w[j].c !== '/' && w[j].q === 0) j++;
      var user = str(w.slice(1, j)), home = user === '' || user === USER ? vars.HOME : user === 'root' ? '/root' : null;
      return home === null ? w : chars(home, 1).concat(w.slice(j));
    }
    function params(w) {
      var out = [];
      for (var i = 0; i < w.length; i++) {
        var ch = w[i];
        if (ch.q === 1 || (ch.c !== '$' && ch.c !== '`')) { out.push(ch); continue; }
        // only look ahead through chars in the same quoting state ($foo"bar" stops at the quote)
        var k = i; while (k < w.length && w[k].q === ch.q) k++;
        var rest = str(w.slice(i, k)), val = null, len = 0;
        if (ch.c === '`') {
          var e = rest.indexOf('`', 1);
          if (e > 0) { val = capture(rest.slice(1, e)); len = e + 1; }
        } else if (rest.slice(0, 3) === '$((') {
          var e2 = scanBalanced(rest, 1, '(', ')');
          var inner = rest.slice(3, e2 - 1);
          val = String(arith(str(params(chars(inner, 2))), sh)); len = e2 + 1;
        } else if (rest.slice(0, 2) === '$(') {
          var e3 = scanBalanced(rest, 1, '(', ')');
          val = capture(rest.slice(2, e3)); len = e3 + 1;
        } else if (rest.slice(0, 2) === '${') {
          var e4 = rest.indexOf('}');
          var body = rest.slice(2, e4), m;
          if ((m = body.match(/^#([A-Za-z_]\w*)$/))) val = String(sh.getVar(m[1]).length);
          else if (/^([A-Za-z_]\w*|[?$#0-9])$/.test(body)) val = sh.getVar(body);
          else if ((m = body.match(/^([A-Za-z_]\w*):?-(.*)$/))) val = sh.getVar(m[1]) || m[2];
          else throw new SyntaxErr('${' + body + '}: this parameter expansion form is covered in the lessons but not simulated');
          len = e4 + 1;
        } else {
          var m2 = rest.match(/^\$([A-Za-z_]\w*|[?$#0-9])/);
          if (m2) { val = sh.getVar(m2[1]); len = m2[0].length; }
        }
        if (val === null) { out.push(ch); continue; }
        var qq = ch.q;
        val.split('').forEach(function (c) { out.push({ c: c, q: qq === 0 ? 0 : 1, sp: qq === 0 }); });
        if (!val.length && qq === 2) out.push({ c: '', q: 2 });
        i += len - 1;
      }
      return out;
    }
    function split(w) {
      var fields = [], cur = [], quoted = false;
      w.forEach(function (x) {
        if (x.sp && /\s/.test(x.c)) { if (cur.length || quoted) fields.push(cur); cur = []; quoted = false; return; }
        if (x.q || !x.sp) quoted = quoted || x.q > 0;
        cur.push(x);
      });
      if (cur.length || quoted) fields.push(cur);
      return fields;
    }
    function glob(w) {
      if (!hasGlob(w)) return null;
      var segs = [[]];
      w.forEach(function (x) { if (x.c === '/') segs.push([]); else segs[segs.length - 1].push(x); });
      var absolute = segs[0].length === 0 && w[0].c === '/';
      var cands = [{ path: absolute ? '/' : '', node: absolute ? root : walk(sh.cwd, true) }];
      if (absolute) segs.shift();
      segs.forEach(function (seg, si) {
        var next = [];
        if (seg.length === 0) { // trailing slash
          cands.forEach(function (c) { if (c.node && c.node.t === 'd') next.push({ path: c.path + (si ? '' : '/'), node: c.node }); });
          cands = next; return;
        }
        cands.forEach(function (c) {
          var dir = c.node && c.node.t === 'l' ? walk(norm(c.path), true) : c.node;
          if (!dir || dir.t !== 'd') return;
          var join = function (n) { return c.path === '' ? n : c.path === '/' ? '/' + n : c.path + '/' + n; };
          if (hasGlob(seg)) {
            var re = globRe(seg), dot = seg[0].c === '.';
            Object.keys(dir.kids).sort(cmpName).forEach(function (n) {
              if ((n[0] !== '.' || dot) && re.test(n)) next.push({ path: join(n), node: dir.kids[n].t === 'l' ? walk(norm(join(n)), true) : dir.kids[n] });
            });
          } else {
            var n = str(seg);
            if (n === '.' || n === '..') { next.push({ path: join(n), node: walk(norm(join(n)), true) }); return; }
            if (dir.kids[n]) next.push({ path: join(n), node: dir.kids[n] });
          }
        });
        cands = next;
      });
      var res = cands.map(function (c) { return c.path; });
      return res.length ? res : null;
    }
    function expandWord(w, noGlob, noSplit) {
      var res = [];
      braces(w).forEach(function (b) {
        var pw = params(tilde(b));
        (noSplit ? [pw] : split(pw)).forEach(function (f) {
          var g = noGlob ? null : glob(f);
          if (g) res = res.concat(g); else res.push(str(f));
        });
      });
      return res;
    }
    function capture(src) {
      var saveCwd = sh.cwd, saveHist = history.length, saveTrace = trace;
      var r = execLine(src, true);
      sh.cwd = saveCwd; history.length = saveHist; trace = saveTrace;
      return r.out.replace(/\n+$/, '');
    }

    /* --- sorting like GNU ls in en_US (case-insensitive, ignore leading dots) --- */
    function cmpName(a, b) {
      var x = a.replace(/^\.+/, '').toLowerCase(), y = b.replace(/^\.+/, '').toLowerCase();
      return x < y ? -1 : x > y ? 1 : a < b ? -1 : a > b ? 1 : 0;
    }

    /* ---------- commands ---------- */
    var BUILTINS = 'alias cd echo exit export help history pwd set source type umask unalias unset . read test true false printf local return shift break continue declare trap wait'.split(' ');
    var KEYWORDS = 'if then else elif fi case esac for while until do done in function select [[ ]] { }'.split(' ');
    var C = {};

    C.pwd = function () { return ok(sh.cwd + '\n'); };

    C.cd = function (a) {
      var t = a[0] === undefined || a[0] === '~' ? vars.HOME : a[0] === '-' ? vars.OLDPWD : a[0];
      if (a.length > 1) return err('bash: cd: too many arguments');
      var L = look(t);
      if (!L.node) return err('bash: cd: ' + t + ': No such file or directory');
      if (L.node.t !== 'd') return err('bash: cd: ' + t + ': Not a directory');
      if (!can(L.node, 1)) return err('bash: cd: ' + t + ': Permission denied');
      vars.OLDPWD = sh.cwd; sh.cwd = L.abs; vars.PWD = L.abs;
      return ok(a[0] === '-' ? L.abs + '\n' : '');
    };

    C.ls = function (a, ctx) {
      var o = opts(a, 'aAdFhlrSt1Ri', '', { all: 'a', 'almost-all': 'A', directory: 'd', classify: 'F', 'human-readable': 'h', reverse: 'r', recursive: 'R', inode: 'i' });
      if (o.bad) return badOpt('ls', o);
      var targets = o.rest.length ? o.rest : ['.'], errs = [], files = [], dirs = [];
      targets.forEach(function (t) {
        var L = look(t, !(o.l || o.d) || /\/$/.test(t));
        if (!L.node) { errs.push('ls: cannot access ' + q(t) + ': No such file or directory'); return; }
        if (L.node.t === 'd' && !o.d) dirs.push({ name: t, node: L.node, abs: L.abs }); else files.push({ name: t, node: L.node });
      });
      function sortEnts(ents) {
        ents.sort(function (x, y) { return cmpName(x.name, y.name); });
        if (o.t) ents.sort(function (x, y) { return y.node.mtime - x.node.mtime; });
        if (o.S) ents.sort(function (x, y) { return sizeOf(y.node) - sizeOf(x.node); });
        if (o.r) ents.reverse();
        return ents;
      }
      function deco(e) {
        var n = e.name;
        if (o.F) n += e.node.t === 'd' ? '/' : e.node.t === 'l' ? '@' : (e.node.t === 'f' && /[1357]/.test(e.node.mode.slice(-3))) ? '*' : '';
        if (o.l && e.node.t === 'l') n += ' -> ' + e.node.target;
        return n;
      }
      function links(n) {
        if (n.t !== 'd') { var c = 0; (function cnt(d) { Object.keys(d.kids).forEach(function (k) { var x = d.kids[k]; if (x === n) c++; if (x.t === 'd') cnt(x); }); })(root); return c || 1; }
        return 2 + Object.keys(n.kids).filter(function (k) { return n.kids[k].t === 'd'; }).length;
      }
      function block(ents) {
        if (!o.l) {
          var names = ents.map(function (e) { return (o.i ? ino(e.node) + ' ' : '') + deco(e); });
          return ctx.tty && !o['1'] ? (names.length ? names.join('  ') + '\n' : '') : unlines(names);
        }
        var rows = ents.map(function (e) {
          var n = e.node;
          return [o.i ? String(ino(n)) : null, modeStr(n), String(links(n)), n.owner, n.owner, o.h ? human(sizeOf(n)) : String(sizeOf(n)), fmtTime(n.mtime), deco(e)];
        });
        var wd = [0, 0, 0, 0, 0, 0];
        rows.forEach(function (r) { for (var k = 0; k < 6; k++) wd[k] = Math.max(wd[k], (r[k] || '').length); });
        return unlines(rows.map(function (r) {
          return (r[0] ? pad(r[0], wd[0]) + ' ' : '') + r[1] + ' ' + pad(r[2], wd[2]) + ' ' + rpad(r[3], wd[3]) + ' ' + rpad(r[4], wd[4]) + ' ' + pad(r[5], wd[5]) + ' ' + r[6] + ' ' + r[7];
        }));
      }
      function listDir(d) {
        if (!can(d.node, 4)) { errs.push('ls: cannot open directory ' + q(d.name) + ': Permission denied'); return ''; }
        var ents = Object.keys(d.node.kids).filter(function (k) { return k[0] !== '.' || o.a || o.A; })
          .map(function (k) { return { name: k, node: d.node.kids[k] }; });
        if (o.a) ents.push({ name: '.', node: d.node }, { name: '..', node: walk(dirname(d.abs), true) });
        sortEnts(ents);
        var s = '';
        if (o.l) s += 'total ' + ents.reduce(function (t, e) { return t + (e.node.t === 'd' ? 4 : e.node.t === 'f' ? Math.ceil(sizeOf(e.node) / 4096) * 4 : 0); }, 0) + '\n';
        s += block(ents);
        if (o.R) ents.forEach(function (e) {
          if (e.node.t === 'd' && e.name !== '.' && e.name !== '..') {
            var sub = { name: (d.name === '/' ? '' : d.name) + '/' + e.name, node: e.node, abs: norm(e.name, d.abs) };
            s += '\n' + sub.name + ':\n' + listDir(sub);
          }
        });
        return s;
      }
      var out = '';
      if (files.length) out += block(sortEnts(files));
      sortEnts(dirs).forEach(function (d, i) {
        var head = (targets.length > 1 || o.R) ? d.name + ':\n' : '';
        if (out || i) out += '\n';
        out += head + listDir(d);
      });
      return { out: out, err: unlines(errs), code: errs.length ? 2 : 0 };
    };

    C.mkdir = function (a) {
      var o = opts(a, 'p', '', { parents: 'p' });
      if (o.bad) return badOpt('mkdir', o);
      if (!o.rest.length) return err('mkdir: missing operand', 1);
      var errs = [];
      o.rest.forEach(function (p) {
        var abs = norm(p);
        if (o.p) {
          var cur = '';
          abs.split('/').filter(Boolean).forEach(function (part) {
            cur += '/' + part;
            var L = look(cur);
            if (L.node) { if (L.node.t !== 'd') errs.push('mkdir: cannot create directory ' + q(p) + ': Not a directory'); return; }
            if (L.parent && can(L.parent, 2)) L.parent.kids[L.name] = { t: 'd', kids: {}, mode: newMode(true), owner: USER, mtime: now() };
            else errs.push('mkdir: cannot create directory ' + q(p) + ': Permission denied');
          });
          return;
        }
        var L = look(p, false);
        if (L.node) return errs.push('mkdir: cannot create directory ' + q(p) + ': File exists');
        if (!L.parent) return errs.push('mkdir: cannot create directory ' + q(p) + ': No such file or directory');
        if (!can(L.parent, 2)) return errs.push('mkdir: cannot create directory ' + q(p) + ': Permission denied');
        L.parent.kids[L.name] = { t: 'd', kids: {}, mode: newMode(true), owner: USER, mtime: now() };
      });
      return { out: '', err: unlines(errs.filter(function (e, i, arr) { return arr.indexOf(e) === i; })), code: errs.length ? 1 : 0 };
    };

    C.touch = function (a) {
      var o = opts(a, '');
      if (o.bad) return badOpt('touch', o);
      if (!o.rest.length) return err('touch: missing file operand');
      var errs = [];
      o.rest.forEach(function (p) {
        var L = look(p);
        if (L.node) { L.node.mtime = now(); return; }
        if (!L.parent) return errs.push('touch: cannot touch ' + q(p) + ': No such file or directory');
        if (!can(L.parent, 2)) return errs.push('touch: cannot touch ' + q(p) + ': Permission denied');
        L.parent.kids[L.name] = { t: 'f', data: '', mode: newMode(false), owner: USER, mtime: now() };
      });
      return { out: '', err: unlines(errs), code: errs.length ? 1 : 0 };
    };

    function clone(n, keep) {
      var c = JSON.parse(JSON.stringify(n));
      (function fix(x) { x.owner = USER; if (!keep) x.mtime = now(); if (x.kids) Object.keys(x.kids).forEach(function (k) { fix(x.kids[k]); }); })(c);
      return c;
    }
    // shared by cp and mv
    function transfer(name, a, move) {
      var o = move ? opts(a, 'iuvf', '', { interactive: 'i', update: 'u', verbose: 'v', force: 'f' })
        : opts(a, 'airRuvf', '', { archive: 'a', interactive: 'i', recursive: 'r', update: 'u', verbose: 'v', force: 'f' });
      if (o.bad) return badOpt(name, o);
      var ops = o.rest;
      if (ops.length < 2) return err(name + ': missing ' + (ops.length ? 'destination file operand after ' + q(ops[0]) : 'file operand'));
      var dest = ops.pop(), D = look(dest), out = [], errs = [];
      var intoDir = D.node && D.node.t === 'd';
      if (ops.length > 1 && !intoDir) return err(name + ': target ' + q(dest) + ' is not a directory');
      ops.forEach(function (src) {
        var S = look(src, !(move || o.a));
        if (!S.node) return errs.push(name + ": cannot stat " + q(src) + ': No such file or directory');
        if (S.node.t === 'd' && !move && !(o.r || o.R || o.a)) return errs.push(name + ': -r not specified; omitting directory ' + q(src));
        var tpath = intoDir ? norm(basename(S.abs), D.abs) : D.abs, T = look(tpath, false);
        if (tpath === S.abs) return errs.push(name + ': ' + q(src) + ' and ' + q(dest) + ' are the same file');
        if (S.node.t === 'd' && (tpath + '/').indexOf(S.abs + '/') === 0) return errs.push(name + ': cannot ' + (move ? 'move' : 'copy') + ' ' + q(src) + ' to a subdirectory of itself');
        if (!T.parent) return errs.push(name + ': cannot create ' + q(tpath) + ': No such file or directory');
        if (!can(T.parent, 2) || (move && S.parent && !can(S.parent, 2))) return errs.push(name + ': cannot ' + (move ? 'move' : 'create') + ' ' + q(src) + ': Permission denied');
        var shown = intoDir ? (dest.replace(/\/$/, '') + '/' + basename(S.abs)) : dest;
        if (T.node) {
          if (T.node.t === 'd' && S.node.t !== 'd') return errs.push(name + ': cannot overwrite directory ' + q(shown) + ' with non-directory');
          if (o.u && T.node.mtime >= S.node.mtime) return;
          if (o.i && !o.f) { out.push(name + ': overwrite ' + q(shown) + '? n   (the trainer answers "n" for you)'); return; }
          if (T.node.t === 'd' && S.node.t === 'd' && !move) { // merge copy into existing dir
            Object.keys(S.node.kids).forEach(function (k) { T.node.kids[k] = clone(S.node.kids[k], o.a); });
            if (o.v) out.push(q(src) + ' -> ' + q(shown));
            return;
          }
        }
        T.parent.kids[T.name] = move ? S.node : clone(S.node, o.a);
        if (move) { delete S.parent.kids[S.name]; if (sh.cwd === S.abs || sh.cwd.indexOf(S.abs + '/') === 0) sh.cwd = tpath + sh.cwd.slice(S.abs.length); }
        if (o.v) out.push((move ? 'renamed ' : '') + q(src) + ' -> ' + q(shown));
      });
      return { out: unlines(out), err: unlines(errs), code: errs.length ? 1 : 0 };
    }
    C.cp = function (a) { return transfer('cp', a, false); };
    C.mv = function (a) { return transfer('mv', a, true); };

    C.rm = function (a) {
      var o = opts(a, 'irRfv', '', { interactive: 'i', recursive: 'r', force: 'f', verbose: 'v' });
      if (o.bad) return badOpt('rm', o);
      if (!o.rest.length) return o.f ? ok() : err('rm: missing operand');
      var out = [], errs = [];
      o.rest.forEach(function (p) {
        var L = look(p, false);
        if (L.abs === '/' || L.abs === HOME || L.abs === '/home') return errs.push('rm: refusing to remove ' + q(p) + ' (the trainer protects it)');
        if (!L.node) { if (!o.f) errs.push('rm: cannot remove ' + q(p) + ': No such file or directory'); return; }
        if (L.node.t === 'd' && !(o.r || o.R)) return errs.push('rm: cannot remove ' + q(p) + ': Is a directory');
        if (!can(L.parent, 2)) return errs.push('rm: cannot remove ' + q(p) + ': Permission denied');
        if (o.i && !o.f) { out.push('rm: remove ' + (L.node.t === 'd' ? 'directory' : 'regular file') + ' ' + q(p) + '? n   (the trainer answers "n" for you)'); return; }
        if (o.v && L.node.t === 'd') (function rec(n, path) {
          Object.keys(n.kids).forEach(function (k) { var c = n.kids[k], cp = path + '/' + k; if (c.t === 'd') rec(c, cp); else out.push('removed ' + q(cp)); });
          out.push('removed directory ' + q(path));
        })(L.node, p.replace(/\/$/, ''));
        else if (o.v) out.push('removed ' + q(p));
        delete L.parent.kids[L.name];
        if (sh.cwd === L.abs || sh.cwd.indexOf(L.abs + '/') === 0) { /* like bash, cwd now dangles; keep path */ }
      });
      return { out: unlines(out), err: unlines(errs), code: errs.length ? 1 : 0 };
    };

    C.ln = function (a) {
      var o = opts(a, 's', '', { symbolic: 's' });
      if (o.bad) return badOpt('ln', o);
      if (o.rest.length !== 2) return err('ln: needs a TARGET and a LINK_NAME in this trainer');
      var target = o.rest[0], link = o.rest[1], Lk = look(link, false);
      if (Lk.node && Lk.node.t === 'd') Lk = look(norm(basename(target), Lk.abs), false);
      if (Lk.node) return err('ln: failed to create ' + (o.s ? 'symbolic ' : 'hard ') + 'link ' + q(link) + ': File exists');
      if (!Lk.parent) return err('ln: failed to create link ' + q(link) + ': No such file or directory');
      if (!can(Lk.parent, 2)) return err('ln: failed to create link ' + q(link) + ': Permission denied');
      if (o.s) { Lk.parent.kids[Lk.name] = { t: 'l', target: target, mode: '777', owner: USER, mtime: now() }; return ok(); }
      var T = look(target);
      if (!T.node) return err('ln: failed to access ' + q(target) + ': No such file or directory');
      if (T.node.t === 'd') return err('ln: ' + q(target) + ': hard link not allowed for directory');
      Lk.parent.kids[Lk.name] = T.node;   // same object = same inode
      return ok();
    };

    // read stdin or files; returns {d, errs}
    function inputs(name, files, ctx) {
      if (!files.length) {
        if (ctx.stdin === null) return { none: true };
        return { d: ctx.stdin, errs: [] };
      }
      var d = '', errs = [];
      files.forEach(function (f) {
        if (f === '-') { d += ctx.stdin || ''; return; }
        var r = readFile(name, f);
        if (r.e) errs.push(r.e); else d += r.d;
      });
      return { d: d, errs: errs };
    }
    function needInput(name) {
      return err(name + ': no input. In a real terminal ' + name + ' would wait for you to type (Ctrl-d to finish). Here, give it a file or pipe something in.', 0);
    }

    C.cat = function (a, ctx) {
      var o = opts(a, 'nAs', '', { number: 'n', 'show-all': 'A', 'squeeze-blank': 's' });
      if (o.bad) return badOpt('cat', o);
      var r = inputs('cat', o.rest, ctx);
      if (r.none) return needInput('cat');
      var L = lines(r.d), endsNl = /\n$/.test(r.d);
      if (o.s) L = L.filter(function (l, i) { return !(l === '' && L[i - 1] === ''); });
      if (o.A) L = L.map(function (l) { return l.replace(/\t/g, '^I') + '$'; });
      if (o.n) L = L.map(function (l, i) { return pad(i + 1, 6) + '\t' + l; });
      var out = L.join('\n') + (L.length && (endsNl || o.A) ? '\n' : '');
      return { out: out, err: unlines(r.errs), code: r.errs.length ? 1 : 0 };
    };
    C.less = function (a, ctx) {
      var r = inputs('less', a.filter(function (x) { return x[0] !== '-'; }), ctx);
      if (r.none) return err('Missing filename ("less --help" for help)');
      return { out: r.d, err: unlines(r.errs), code: r.errs.length ? 1 : 0, note: 'less shows a file one screen at a time (q quits). The trainer prints it all at once.' };
    };

    C.echo = function (a) {
      var e = false, n = false, i = 0;
      for (; i < a.length && /^-[enE]+$/.test(a[i]); i++) { if (a[i].indexOf('e') >= 0) e = true; if (a[i].indexOf('n') >= 0) n = true; if (a[i].indexOf('E') >= 0) e = false; }
      var s = a.slice(i).join(' ');
      if (e) {
        var stop = false;
        s = s.replace(/\\(c|[abefnrtv\\]|0[0-7]{0,3})/g, function (m, x) {
          if (x === 'c') { stop = true; return '\u0000'; }
          return ({ a: '\x07', b: '\b', e: '\x1b', f: '\f', n: '\n', r: '\r', t: '\t', v: '\v', '\\': '\\' })[x] || String.fromCharCode(parseInt(x.slice(1) || '0', 8));
        });
        if (stop) { s = s.slice(0, s.indexOf('\u0000')); n = true; }
      }
      return ok(s + (n ? '' : '\n'));
    };

    function headTail(name, a, ctx) {
      a = a.map(function (x) { return /^-\d+$/.test(x) ? '-n' + x.slice(1) : x; });
      var o = opts(a, '', 'n', { lines: 'n' });
      if (o.bad) return badOpt(name, o);
      var n = o.n === undefined ? 10 : parseInt(o.n, 10);
      if (isNaN(n)) return err(name + ': invalid number of lines: ' + q(o.n));
      function pick(d) { var L = lines(d); return unlines(name === 'head' ? L.slice(0, n) : (n ? L.slice(-n) : [])); }
      if (!o.rest.length) { if (ctx.stdin === null) return needInput(name); return ok(pick(ctx.stdin)); }
      var out = [], errs = [];
      o.rest.forEach(function (f) {
        var r = readFile(name, f);
        if (r.e) return errs.push(r.e.replace(name + ': ', name + ": cannot open '").replace(/: (No such|Permission|Is a)/, "' for reading: $1"));
        out.push((o.rest.length > 1 ? '==> ' + f + ' <==\n' : '') + pick(r.d));
      });
      return { out: out.join('\n'), err: unlines(errs), code: errs.length ? 1 : 0 };
    }
    C.head = function (a, ctx) { return headTail('head', a, ctx); };
    C.tail = function (a, ctx) { return headTail('tail', a, ctx); };

    C.wc = function (a, ctx) {
      var o = opts(a, 'lwc', '', { lines: 'l', words: 'w', bytes: 'c' });
      if (o.bad) return badOpt('wc', o);
      var sel = (o.l || o.w || o.c) ? [o.l, o.w, o.c] : [true, true, true];
      function count(d) { return [lines(d).length + (d && !/\n$/.test(d) ? 0 : 0), (d.match(/\S+/g) || []).length, d.length].map(function (v, i) { return i === 0 ? (d.match(/\n/g) || []).length : v; }); }
      var rows = [], errs = [], tot = [0, 0, 0];
      if (!o.rest.length) {
        if (ctx.stdin === null) return needInput('wc');
        rows.push([count(ctx.stdin), '']);
      } else o.rest.forEach(function (f) {
        var r = readFile('wc', f);
        if (r.e) return errs.push(r.e);
        var c = count(r.d); rows.push([c, f]); tot = tot.map(function (t, i) { return t + c[i]; });
      });
      if (rows.length > 1) rows.push([tot, 'total']);
      var nsel = sel.filter(Boolean).length;
      var width = !o.rest.length ? (nsel === 1 ? 1 : 7) : (nsel === 1 && rows.length === 1 ? 1 : String(Math.max.apply(null, rows.map(function (r) { return r[0][2]; }))).length);
      var out = rows.map(function (r) {
        return r[0].filter(function (v, i) { return sel[i]; }).map(function (v) { return pad(v, width); }).join(' ') + (r[1] ? ' ' + r[1] : '');
      });
      return { out: unlines(out), err: unlines(errs), code: errs.length ? 1 : 0 };
    };

    C.sort = function (a, ctx) {
      var o = opts(a, 'rnfbuM', 'kto', { reverse: 'r', 'numeric-sort': 'n', 'ignore-case': 'f', 'ignore-leading-blanks': 'b', unique: 'u', key: 'k', 'field-separator': 't', output: 'o', 'month-sort': 'M' });
      if (o.bad) return badOpt('sort', o);
      var r = inputs('sort', o.rest, ctx);
      if (r.none) return needInput('sort');
      if (r.errs.length) return { out: '', err: unlines(r.errs.map(function (e) { return e.replace('sort: ', 'sort: cannot read: '); })), code: 2 };
      var MONTHS = 'jan feb mar apr may jun jul aug sep oct nov dec'.split(' ');
      var keys = o._all.filter(function (x) { return x[0] === 'k'; }).map(function (x) {
        var m = x[1].match(/^(\d+)(?:\.(\d+))?([bnrfM]*)(?:,(\d+)(?:\.(\d+))?([bnrfM]*))?$/);
        if (!m) return null;
        return { f1: +m[1], c1: m[2] ? +m[2] : 0, f2: m[4] ? +m[4] : 0, c2: m[5] ? +m[5] : 0, fl: (m[3] || '') + (m[6] || '') };
      });
      if (keys.some(function (k) { return !k; })) return err('sort: invalid key specification', 2);
      function fields(l) {
        if (o.t) return l.split(o.t);
        var res = [], re = /\s*\S+/g, m; while ((m = re.exec(l))) res.push(m[0]); return res.length ? res : [''];
      }
      function keyText(l, k) {
        var f = fields(l), sep = o.t || '';
        var end = k.f2 ? f.slice(k.f1 - 1, k.f2) : f.slice(k.f1 - 1);
        var s = end.join(sep);
        if (k.c1) { var first = f[k.f1 - 1] || ''; var lead = o.t ? 0 : (first.match(/^\s*/)[0].length); s = s.slice(k.c1 - 1 + (k.fl.indexOf('b') >= 0 || o.b ? lead : 0)); }
        if (k.c2 && k.f2 === k.f1) s = s.slice(0, k.c2 - k.c1 + 1);
        return s;
      }
      function cmp(x, y, fl) {
        var n = fl.indexOf('n') >= 0 || (o.n && !/[nM]/.test(fl)), M = fl.indexOf('M') >= 0 || o.M, f = fl.indexOf('f') >= 0 || o.f, b = fl.indexOf('b') >= 0 || o.b;
        if (b || n) { x = x.replace(/^\s+/, ''); y = y.replace(/^\s+/, ''); }
        var c;
        if (n) c = (parseFloat(x) || 0) - (parseFloat(y) || 0);
        else if (M) c = MONTHS.indexOf(x.slice(0, 3).toLowerCase()) - MONTHS.indexOf(y.slice(0, 3).toLowerCase());
        else { if (f) { x = x.toUpperCase(); y = y.toUpperCase(); } c = x.localeCompare(y, 'en'); }
        return fl.indexOf('r') >= 0 ? -c : c;
      }
      var L = lines(r.d);
      L.sort(function (x, y) {
        var c = 0;
        if (keys.length) { for (var i = 0; i < keys.length && !c; i++) c = cmp(keyText(x, keys[i]), keyText(y, keys[i]), keys[i].fl); }
        else c = cmp(x, y, '');
        if (!c && !o.u) c = x < y ? -1 : x > y ? 1 : 0;
        return o.r ? -c : c;
      });
      if (o.u) L = L.filter(function (l, i) { return i === 0 || cmp(keys.length ? keyText(l, keys[0]) : l, keys.length ? keyText(L[i - 1], keys[0]) : L[i - 1], keys.length ? keys[0].fl : '') !== 0; });
      if (o.o) { var e = writeFile('sort', o.o, unlines(L)); return e ? err(e, 2) : ok(); }
      return ok(unlines(L));
    };

    C.uniq = function (a, ctx) {
      var o = opts(a, 'cdui', '', { count: 'c', repeated: 'd', unique: 'u', 'ignore-case': 'i' });
      if (o.bad) return badOpt('uniq', o);
      var r = inputs('uniq', o.rest.slice(0, 1), ctx);
      if (r.none) return needInput('uniq');
      if (r.errs.length) return err(r.errs[0]);
      var groups = [];
      lines(r.d).forEach(function (l) {
        var g = groups[groups.length - 1], k = o.i ? l.toLowerCase() : l;
        if (g && g.k === k) g.n++; else groups.push({ k: k, l: l, n: 1 });
      });
      if (o.d) groups = groups.filter(function (g) { return g.n > 1; });
      if (o.u) groups = groups.filter(function (g) { return g.n === 1; });
      var out = unlines(groups.map(function (g) { return o.c ? pad(g.n, 7) + ' ' + g.l : g.l; }));
      if (o.rest[1]) { var e = writeFile('uniq', o.rest[1], out); return e ? err(e) : ok(); }
      return ok(out);
    };

    C.grep = function (a, ctx) {
      var o = opts(a, 'ivclLnhEwoqr', 'e', { 'ignore-case': 'i', 'invert-match': 'v', count: 'c', 'files-with-matches': 'l', 'files-without-match': 'L', 'line-number': 'n', 'no-filename': 'h', 'extended-regexp': 'E', 'word-regexp': 'w', 'only-matching': 'o', quiet: 'q', silent: 'q', regexp: 'e' });
      if (o.bad) return badOpt('grep', o);
      if (o.r) return err('grep: -r (recursive) is not simulated in this trainer', 2);
      var pats = o._all.filter(function (x) { return x[0] === 'e'; }).map(function (x) { return x[1]; });
      var files = o.rest.slice();
      if (!pats.length) { if (!files.length) return err('Usage: grep [OPTION]... PATTERNS [FILE]...', 2); pats = [files.shift()]; }
      var re;
      try {
        var src = pats.map(function (p) { return posixRe(p, o.E); }).join('|');
        if (o.w) src = '(?<![\\w])(?:' + src + ')(?![\\w])';
        re = new RegExp(src, (o.i ? 'i' : '') + 'g');
      } catch (e) { return err('grep: invalid regular expression', 2); }
      var srcs = files.length ? files : [null], out = [], errs = [], any = false, many = files.length > 1 && !o.h;
      if (!files.length && ctx.stdin === null) return needInput('grep');
      srcs.forEach(function (f) {
        var d;
        if (f === null || f === '-') d = ctx.stdin || '';
        else {
          var L = look(f);
          if (L.node && L.node.t === 'd') return errs.push('grep: ' + f + ': Is a directory');
          var rr = readFile('grep', f); if (rr.e) return errs.push(rr.e); d = rr.d;
        }
        var label = f === null ? '(standard input)' : f, cnt = 0;
        lines(d).forEach(function (l, i) {
          re.lastIndex = 0;
          var hit = re.test(l);
          if (hit === !!o.v) return;
          cnt++;
          if (o.q || o.l || o.L || o.c) return;
          var pre = (many ? label + ':' : '') + (o.n ? (i + 1) + ':' : '');
          if (o.o && !o.v) { re.lastIndex = 0; var m; while ((m = re.exec(l))) { if (m[0] === '') { re.lastIndex++; continue; } out.push(pre + m[0]); } }
          else out.push(pre + l);
        });
        if (cnt) any = true;
        if (o.c && !o.q) out.push((many ? label + ':' : '') + cnt);
        if (o.l && cnt) out.push(label);
        if (o.L && !cnt) out.push(label);
      });
      if (o.q) return { out: '', err: '', code: any ? 0 : 1 };
      return { out: unlines(out), err: unlines(errs), code: errs.length ? 2 : (o.L ? (out.length ? 0 : 1) : any ? 0 : 1) };
    };

    function parseList(s) {
      return s.split(',').map(function (p) {
        var m = p.match(/^(\d*)-(\d*)$/);
        if (m) return [m[1] ? +m[1] : 1, m[2] ? +m[2] : Infinity];
        if (/^\d+$/.test(p)) return [+p, +p];
        return null;
      });
    }
    C.cut = function (a, ctx) {
      var o = opts(a, '', 'dfc', { delimiter: 'd', fields: 'f', characters: 'c' });
      if (o.bad) return badOpt('cut', o);
      if (!o.f && !o.c) return err('cut: you must specify a list of bytes, characters, or fields');
      var list = parseList(o.f || o.c);
      if (list.some(function (x) { return !x; })) return err('cut: invalid field range');
      function inL(n) { return list.some(function (r) { return n >= r[0] && n <= r[1]; }); }
      var r = inputs('cut', o.rest, ctx);
      if (r.none) return needInput('cut');
      var d = o.d === undefined ? '\t' : o.d;
      var out = lines(r.d).map(function (l) {
        if (o.c) return l.split('').filter(function (ch, i) { return inL(i + 1); }).join('');
        if (l.indexOf(d) < 0) return l;
        return l.split(d).filter(function (f, i) { return inL(i + 1); }).join(d);
      });
      return { out: unlines(out), err: unlines(r.errs), code: r.errs.length ? 1 : 0 };
    };

    function trSet(s) {
      var out = [], i = 0;
      s = s.replace(/\[:(\w+):\]/g, function (m, c) {
        var map = { lower: 'a-z', upper: 'A-Z', digit: '0-9', alpha: 'a-zA-Z', alnum: 'a-zA-Z0-9', space: ' \t\n\r\f\v', blank: ' \t', punct: '!-/:-@[-`{-~' };
        return map[c] || m;
      }).replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\');
      while (i < s.length) {
        if (s[i + 1] === '-' && i + 2 < s.length) {
          for (var c = s.charCodeAt(i); c <= s.charCodeAt(i + 2); c++) out.push(String.fromCharCode(c));
          i += 3;
        } else out.push(s[i++]);
      }
      return out;
    }
    C.tr = function (a, ctx) {
      var o = opts(a, 'ds', '', { delete: 'd', 'squeeze-repeats': 's' });
      if (o.bad) return badOpt('tr', o);
      if (ctx.stdin === null) return needInput('tr');
      if (!o.rest.length) return err('tr: missing operand');
      var s1 = trSet(o.rest[0]), s2 = o.rest[1] !== undefined ? trSet(o.rest[1]) : null, d = ctx.stdin;
      if (o.d) d = d.split('').filter(function (c) { return s1.indexOf(c) < 0; }).join('');
      else if (s2) {
        d = d.split('').map(function (c) { var k = s1.indexOf(c); return k < 0 ? c : s2[Math.min(k, s2.length - 1)]; }).join('');
      }
      if (o.s) { var sq = s2 && !o.d ? s2 : (o.d ? (s2 || []) : s1); d = d.replace(/([\s\S])\1+/g, function (m, c) { return sq.indexOf(c) >= 0 ? c : m; }); }
      return ok(d);
    };

    C.tee = function (a, ctx) {
      var o = opts(a, 'a', '', { append: 'a' });
      if (o.bad) return badOpt('tee', o);
      var d = ctx.stdin || '', errs = [];
      o.rest.forEach(function (f) { var e = writeFile('tee', f, d, o.a); if (e) errs.push(e); });
      return { out: d, err: unlines(errs), code: errs.length ? 1 : 0 };
    };

    C.find = function (a) {
      var paths = [], i = 0;
      while (i < a.length && a[i][0] !== '-' && a[i] !== '(' && a[i] !== '!') paths.push(a[i++]);
      if (!paths.length) paths = ['.'];
      var toks = a.slice(i), p = 0, del = false, printed = false;
      // expression parser: or > and > not > primary
      function primary() {
        var t = toks[p++];
        if (t === '(') { var e = orE(); if (toks[p++] !== ')') throw new SyntaxErr("find: missing ')'"); return e; }
        if (t === '!' || t === '-not') { var n = primary(); return function (x) { return !n(x); }; }
        var arg;
        switch (t) {
          case '-name': case '-iname':
            arg = toks[p++]; if (arg === undefined) throw new SyntaxErr("find: missing argument to '" + t + "'");
            var re = globRe(arg.split('').map(function (c) { return { c: c, q: 0 }; }));
            if (t === '-iname') re = new RegExp(re.source, 'i');
            return function (x) { return re.test(x.name); };
          case '-type':
            arg = toks[p++];
            if (!/^[fdl]$/.test(arg || '')) throw new SyntaxErr("find: -type " + (arg || '') + " isn't simulated (try f, d or l)");
            return function (x) { return arg === 'f' ? x.node.t === 'f' : arg === 'd' ? x.node.t === 'd' : x.node.t === 'l'; };
          case '-size':
            arg = toks[p++];
            var m = (arg || '').match(/^([+-]?)(\d+)([bckMG]?)$/);
            if (!m) throw new SyntaxErr("find: invalid argument '" + arg + "' to '-size'");
            var unit = { b: 512, c: 1, k: 1024, M: 1048576, G: 1073741824, '': 512 }[m[3]], want = +m[2];
            return function (x) {
              if (x.node.t === 'd') return false;
              var s = Math.ceil(sizeOf(x.node) / unit);
              return m[1] === '+' ? s > want : m[1] === '-' ? s < want : s === want;
            };
          case '-empty': return function (x) { return x.node.t === 'd' ? !Object.keys(x.node.kids).length : x.node.t === 'f' && sizeOf(x.node) === 0; };
          case '-print': printed = true; return function (x) { x.out.push(x.path); return true; };
          case '-delete': del = printed = true; return function (x) { x.del.push(x); return true; };
          case '-and': case '-a': case '-or': case '-o':
            throw new SyntaxErr("find: invalid expression; you have used a binary operator '" + t + "' with nothing before it.");
          case undefined: throw new SyntaxErr('find: expression ends unexpectedly');
          default: throw new SyntaxErr('find: ' + t + " isn't simulated in this trainer (supported: -name -iname -type -size -empty -print -delete)");
        }
      }
      function andE() {
        var l = primary();
        while (p < toks.length && toks[p] !== ')' && toks[p] !== '-o' && toks[p] !== '-or') {
          if (toks[p] === '-a' || toks[p] === '-and') p++;
          var r = primary(), L0 = l; l = (function (x, y) { return function (n) { return x(n) && y(n); }; })(L0, r);
        }
        return l;
      }
      function orE() {
        var l = andE();
        while (toks[p] === '-o' || toks[p] === '-or') { p++; var r = andE(), L0 = l; l = (function (x, y) { return function (n) { return x(n) || y(n); }; })(L0, r); }
        return l;
      }
      var test;
      try { test = toks.length ? orE() : function () { return true; }; if (p < toks.length) throw new SyntaxErr("find: paths must precede expression: '" + toks[p] + "'"); }
      catch (e) { if (e instanceof SyntaxErr) return err(e.message); throw e; }
      var out = [], dels = [], errs = [];
      paths.forEach(function (start) {
        var L = look(start);
        if (!L.node) return errs.push("find: '" + start + "': No such file or directory");
        (function visit(node, path, name, abs, parent) {
          var x = { node: node, path: path, name: name, out: out, del: dels, abs: abs, parent: parent };
          var hit = test(x);
          if (hit && !printed) out.push(path);
          if (node.t === 'd') {
            if (!can(node, 4)) return errs.push("find: '" + path + "': Permission denied");
            Object.keys(node.kids).sort(cmpName).forEach(function (k) {
              visit(node.kids[k], path.replace(/\/$/, '') + '/' + k, k, norm(k, abs), node);
            });
          }
        })(L.node, start, basename(L.abs), L.abs, L.parent);
      });
      if (del) dels.reverse().forEach(function (x) {
        if (x.abs === HOME || x.abs === '/' || !x.parent) return errs.push("find: cannot delete '" + x.path + "' (the trainer protects it)");
        if (x.node.t === 'd' && Object.keys(x.node.kids).length) return errs.push("find: cannot delete '" + x.path + "': Directory not empty");
        delete x.parent.kids[basename(x.abs)];
      });
      return { out: unlines(out), err: unlines(errs), code: errs.length ? 1 : 0 };
    };

    C.file = function (a) {
      if (!a.length) return err('Usage: file [-bchikLlNnprsSvzZ0] [file ...]');
      var out = a.map(function (f) {
        var L = look(f, false), n = L.node, d;
        if (!n) return f + ': cannot open `' + f + "' (No such file or directory)";
        if (n.t === 'l') d = 'symbolic link to ' + n.target;
        else if (n.t === 'd') d = 'directory';
        else if (n.t === 'c') d = 'character special (1/3)';
        else if (n.bin === 'jpg') d = 'JPEG image data, JFIF standard 1.01';
        else if (n.bin === 'png') d = 'PNG image data, 640 x 480, 8-bit/color RGB, non-interlaced';
        else if (/^\x7fELF/.test(n.data)) d = 'ELF 64-bit LSB pie executable, x86-64, dynamically linked';
        else if (!n.data.length) d = 'empty';
        else if (/^#!\/bin\/(ba)?sh/.test(n.data)) d = 'Bourne-Again shell script, ASCII text executable';
        else if (/^[^\n]*,[^\n]*\n/.test(n.data) && /\.csv$/.test(f)) d = 'CSV text';
        else d = 'ASCII text';
        return f + ': ' + d;
      });
      return ok(unlines(out));
    };

    C.stat = function (a) {
      if (!a.length) return err('stat: missing operand');
      var out = [], errs = [];
      a.forEach(function (f) {
        var L = look(f, false), n = L.node;
        if (!n) return errs.push("stat: cannot statx '" + f + "': No such file or directory");
        var kind = { f: sizeOf(n) ? 'regular file' : 'regular empty file', d: 'directory', l: 'symbolic link', c: 'character special file' }[n.t];
        var uid = n.owner === USER ? '1000' : '   0', t = fmtTime(n.mtime) + ':00.000000000 +0000';
        var m = modeStr(n);
        out.push('  File: ' + f + (n.t === 'l' ? ' -> ' + n.target : ''),
          '  Size: ' + rpad(sizeOf(n), 10) + '\tBlocks: ' + rpad(n.t === 'd' ? 8 : Math.ceil(sizeOf(n) / 4096) * 8, 10) + ' IO Block: 4096   ' + kind,
          'Device: 801h/2049d\tInode: ' + rpad(ino(n), 11) + ' Links: 1',
          'Access: (' + ('0' + parseInt(n.mode, 8).toString(8)).slice(-4) + '/' + m + ')  Uid: (' + pad(uid, 5) + '/' + pad(n.owner, 8) + ')   Gid: (' + pad(uid, 5) + '/' + pad(n.owner, 8) + ')',
          'Access: ' + t, 'Modify: ' + t, 'Change: ' + t, ' Birth: -');
      });
      return { out: unlines(out), err: unlines(errs), code: errs.length ? 1 : 0 };
    };

    C.du = function (a) {
      var o = opts(a, 'sh', '', { summarize: 's', 'human-readable': 'h' });
      if (o.bad) return badOpt('du', o);
      var targets = o.rest.length ? o.rest : ['.'], out = [], errs = [];
      function blocks(n, path, top) {
        if (n.t !== 'd') return n.t === 'f' ? Math.ceil(sizeOf(n) / 4096) * 4 : 0;
        var t = 4;
        Object.keys(n.kids).sort(cmpName).forEach(function (k) { t += blocks(n.kids[k], path.replace(/\/$/, '') + '/' + k, false); });
        if (!o.s || top) out.push((o.h ? human(t * 1024) : t) + '\t' + path);
        return t;
      }
      targets.forEach(function (t) {
        var L = look(t);
        if (!L.node) return errs.push("du: cannot access '" + t + "': No such file or directory");
        var b = blocks(L.node, t, true);
        if (L.node.t !== 'd') out.push((o.h ? human(b * 1024) : b) + '\t' + t);
      });
      return { out: unlines(out), err: unlines(errs), code: errs.length ? 1 : 0 };
    };

    C.chmod = function (a) {
      if (a.length < 2) return err('chmod: missing operand');
      var mode = a[0], errs = [];
      a.slice(1).forEach(function (f) {
        var L = look(f);
        if (!L.node) return errs.push("chmod: cannot access '" + f + "': No such file or directory");
        if (L.node.owner !== USER) return errs.push("chmod: changing permissions of '" + f + "': Operation not permitted");
        var cur = parseInt(L.node.mode, 8), res;
        if (/^[0-7]{1,4}$/.test(mode)) res = parseInt(mode, 8);
        else {
          res = cur;
          var okAll = mode.split(',').every(function (cl) {
            var m = cl.match(/^([ugoa]*)([-+=])([rwxst]*)$/);
            if (!m) return false;
            var who = m[1] || 'a', bits = 0, mask = 0;
            if (who.indexOf('a') >= 0) who = 'ugo';
            who.split('').forEach(function (w) {
              var shf = { u: 6, g: 3, o: 0 }[w];
              mask |= 7 << shf;
              m[3].split('').forEach(function (b) {
                if (b === 'r') bits |= 4 << shf; if (b === 'w') bits |= 2 << shf; if (b === 'x') bits |= 1 << shf;
                if (b === 's' && w === 'u') bits |= 2048; if (b === 's' && w === 'g') bits |= 1024; if (b === 't') bits |= 512;
              });
            });
            if (!m[1] && m[2] !== '=') bits &= ~parseInt(umask, 8);
            res = m[2] === '+' ? res | bits : m[2] === '-' ? res & ~bits : (res & ~mask) | bits;
            return true;
          });
          if (!okAll) { errs.push("chmod: invalid mode: '" + mode + "'"); return; }
        }
        L.node.mode = res.toString(8);
      });
      return { out: '', err: unlines(errs.filter(function (e, i, x) { return x.indexOf(e) === i; })), code: errs.length ? 1 : 0 };
    };

    C.umask = function (a) {
      if (!a.length) return ok(umask + '\n');
      if (a[0] === '-S') { var m = ~parseInt(umask, 8) & 511, s = ['u=', 'g=', 'o='].map(function (p, i) { var b = (m >> (6 - 3 * i)) & 7; return p + (b & 4 ? 'r' : '') + (b & 2 ? 'w' : '') + (b & 1 ? 'x' : ''); }).join(','); return ok(s + '\n'); }
      if (!/^[0-7]{1,4}$/.test(a[0])) return err('bash: umask: ' + a[0] + ': octal number out of range');
      umask = ('0000' + a[0]).slice(-4);
      return ok();
    };

    C.id = function () { return ok('uid=1000(me) gid=1000(me) groups=1000(me),4(adm),24(cdrom),27(sudo)\n'); };

    C.date = function () {
      var d = new Date(now()), days = 'Sun Mon Tue Wed Thu Fri Sat'.split(' '), mons = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
      var tz = 'UTC';
      try { tz = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(d).filter(function (x) { return x.type === 'timeZoneName'; })[0].value; } catch (e) { /* keep UTC */ }
      return ok(days[d.getDay()] + ' ' + mons[d.getMonth()] + ' ' + pad(d.getDate(), 2) + ' ' + two(d.getHours()) + ':' + two(d.getMinutes()) + ':' + two(d.getSeconds()) + ' ' + tz + ' ' + d.getFullYear() + '\n');
    };

    C.cal = function () {
      var d = new Date(now()), y = d.getFullYear(), m = d.getMonth();
      var names = 'January February March April May June July August September October November December'.split(' ');
      var title = names[m] + ' ' + y, first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
      var s = pad(title, Math.floor((20 + title.length) / 2)) + '\nSu Mo Tu We Th Fr Sa\n', row = '';
      for (var i = 0; i < first; i++) row += '   ';
      for (var day = 1; day <= days; day++) {
        row += pad(day, 2) + ((first + day) % 7 === 0 ? '' : ' ');
        if ((first + day) % 7 === 0) { s += row.replace(/\s+$/, '') + '\n'; row = ''; }
      }
      if (row) s += row.replace(/\s+$/, '') + '\n';
      return ok(s);
    };

    C.clear = function () { return { out: '', err: '', code: 0, clear: true }; };
    C.history = function (a) {
      var n = a[0] && /^\d+$/.test(a[0]) ? +a[0] : history.length;
      return ok(unlines(history.slice(-n).map(function (h, i) { return pad(history.length - Math.min(n, history.length) + i + 1, 5) + '  ' + h; })));
    };

    function pathLookup(n) {
      var dirs = vars.PATH.split(':');
      for (var i = 0; i < dirs.length; i++) { var L = look(dirs[i] + '/' + n); if (L.node && L.node.t === 'f') return L.abs; }
      return null;
    }
    C.type = function (a) {
      var out = [], errs = [];
      a.forEach(function (n) {
        if (aliases[n]) out.push(n + ' is aliased to `' + aliases[n] + "'");
        else if (KEYWORDS.indexOf(n) >= 0) out.push(n + ' is a shell keyword');
        else if (BUILTINS.indexOf(n) >= 0) out.push(n + ' is a shell builtin');
        else { var p = pathLookup(n); if (p) out.push(n + ' is ' + p); else errs.push('bash: type: ' + n + ': not found'); }
      });
      return { out: unlines(out), err: unlines(errs), code: errs.length ? 1 : 0 };
    };
    C.which = function (a) {
      var out = [], code = 0;
      a.forEach(function (n) { var p = pathLookup(n); if (p) out.push(p); else code = 1; });
      return { out: unlines(out), err: '', code: code };
    };
    C.alias = function (a) {
      if (!a.length) return ok(unlines(Object.keys(aliases).sort().map(function (k) { return 'alias ' + k + "='" + aliases[k] + "'"; })));
      var out = [], errs = [];
      a.forEach(function (x) {
        var i = x.indexOf('=');
        if (i < 0) { if (aliases[x]) out.push('alias ' + x + "='" + aliases[x] + "'"); else errs.push('bash: alias: ' + x + ': not found'); }
        else aliases[x.slice(0, i)] = x.slice(i + 1);
      });
      return { out: unlines(out), err: unlines(errs), code: errs.length ? 1 : 0 };
    };
    C.unalias = function (a) {
      var errs = [];
      a.forEach(function (x) { if (aliases[x]) delete aliases[x]; else errs.push('bash: unalias: ' + x + ': not found'); });
      return { out: '', err: unlines(errs), code: errs.length ? 1 : 0 };
    };

    function manPage(n) {
      var d = docs(n);
      if (!d) return null;
      var s = n.toUpperCase() + '(1)                 Linux Trainer Manual                 ' + n.toUpperCase() + '(1)\n\nNAME\n       ' + n + ' - ' + d.summary + '\n\nSYNOPSIS\n       ' + (d.syntax || n) + '\n\nDESCRIPTION\n       ' + (d.explain || '') + '\n';
      if (d.flags && d.flags.length) s += '\nOPTIONS\n' + d.flags.map(function (f) { return '       ' + f.f + (f.long ? ', ' + f.long : '') + '\n              ' + f.d; }).join('\n') + '\n';
      return s;
    }
    C.man = function (a) {
      if (!a.length) return err('What manual page do you want?');
      var n = a[a.length - 1], s = manPage(n);
      return s ? { out: s, err: '', code: 0, note: 'Real man pages are longer; press q to quit them.' } : err('No manual entry for ' + n, 16);
    };
    C.whatis = function (a) {
      var out = [], errs = [];
      a.forEach(function (n) { var d = docs(n); if (d) out.push(rpad(n + ' (1)', 15) + ' - ' + d.summary); else errs.push(n + ': nothing appropriate.'); });
      return { out: unlines(out), err: unlines(errs), code: errs.length ? 16 : 0 };
    };
    C.help = function (a) {
      if (!a.length) return ok('GNU bash, trainer edition. These shell commands are defined internally:\n\n' + BUILTINS.join('  ') + '\n\nType `help name\' to find out more about the function `name\'.\n');
      var d = docs(a[0]);
      if (BUILTINS.indexOf(a[0]) < 0 && KEYWORDS.indexOf(a[0]) < 0) return err('bash: help: no help topics match `' + a[0] + "'.  Try `help help' or `man -k " + a[0] + "' or `info " + a[0] + "'.");
      return ok(a[0] + ': ' + (d ? d.syntax : a[0]) + '\n    ' + (d ? d.summary : 'Shell builtin.') + '\n');
    };
    C.printenv = function (a) {
      if (a.length) { var v = exported[a[0]] ? sh.getVar(a[0]) : ''; return v ? ok(v + '\n') : { out: '', err: '', code: 1 }; }
      return ok(unlines(Object.keys(exported).sort().map(function (k) { return k + '=' + sh.getVar(k); })));
    };
    C.export = function (a) {
      if (!a.length || a[0] === '-p') return ok(unlines(Object.keys(exported).sort().map(function (k) { return 'declare -x ' + k + '="' + sh.getVar(k) + '"'; })));
      a.forEach(function (x) { var i = x.indexOf('='); if (i >= 0) { vars[x.slice(0, i)] = x.slice(i + 1); exported[x.slice(0, i)] = 1; } else exported[x] = 1; });
      return ok();
    };
    C.set = function (a) {
      if (a[0] === '-x' || a[0] === '-o' && a[1] === 'xtrace') { trace = true; return ok(); }
      if (a[0] === '+x' || a[0] === '+o' && a[1] === 'xtrace') { trace = false; return ok(); }
      if (a.length) return err('bash: set: ' + a[0] + ": this option isn't simulated (try set -x / set +x)", 2);
      var all = {}; Object.keys(vars).forEach(function (k) { all[k] = sh.getVar(k); });
      return ok(unlines(Object.keys(all).sort().map(function (k) { return k + '=' + (/[\s\\$']/.test(all[k]) ? "'" + all[k] + "'" : all[k]); })) +
        unlines(Object.keys(aliases).length ? [] : []));
    };
    C.unset = function (a) { a.forEach(function (n) { delete vars[n]; delete exported[n]; }); return ok(); };
    C.exit = function () { return { out: 'logout\n', err: '', code: 0, note: 'In a real terminal, exit closes the session. Here the trainer keeps going.' }; };
    C.source = C['.'] = function (a) {
      if (!a.length) return err('bash: source: filename argument required', 2);
      var r = readFile('bash', a[0]);
      if (r.e) return err(r.e);
      var out = '', errt = '';
      lines(r.d).forEach(function (l) { var x = execLine(l, true); out += x.out; errt += x.err; });
      return { out: out, err: errt, code: 0 };
    };
    C.true = function () { return { out: '', err: '', code: 0 }; };
    C.false = function () { return { out: '', err: '', code: 1 }; };

    C.nl = function (a, ctx) {
      var r = inputs('nl', a, ctx);
      if (r.none) return needInput('nl');
      var n = 0;
      return { out: unlines(lines(r.d).map(function (l) { return l === '' ? '' : pad(++n, 6) + '\t' + l; })), err: unlines(r.errs), code: r.errs.length ? 1 : 0 };
    };
    C.paste = function (a, ctx) {
      var o = opts(a, '', 'd', { delimiters: 'd' });
      if (o.bad) return badOpt('paste', o);
      var cols = [], errs = [];
      o.rest.forEach(function (f) { var r = f === '-' ? { d: ctx.stdin || '' } : readFile('paste', f); if (r.e) errs.push(r.e); else cols.push(lines(r.d)); });
      if (errs.length) return err(errs[0]);
      var d = o.d === undefined ? '\t' : o.d.replace(/\\t/g, '\t');
      var max = Math.max.apply(null, cols.map(function (c) { return c.length; }).concat([0]));
      var out = [];
      for (var i = 0; i < max; i++) out.push(cols.map(function (c) { return c[i] || ''; }).join(d));
      return ok(unlines(out));
    };
    C.fold = function (a, ctx) {
      a = a.map(function (x) { return /^-\d+$/.test(x) ? '-w' + x.slice(1) : x; });
      var o = opts(a, 's', 'w', { width: 'w', spaces: 's' });
      if (o.bad) return badOpt('fold', o);
      var w = o.w ? parseInt(o.w, 10) : 80, r = inputs('fold', o.rest, ctx);
      if (r.none) return needInput('fold');
      var out = r.d.split('\n').map(function (l) {
        var res = [];
        while (l.length > w) {
          var cut = w;
          if (o.s) { var sp = l.lastIndexOf(' ', w - 1); if (sp >= 0) cut = sp + 1; }
          res.push(l.slice(0, cut)); l = l.slice(cut);
        }
        res.push(l); return res.join('\n');
      }).join('\n');
      return ok(out);
    };

    // Canned samples for commands that need real hardware/processes.
    C.df = function () {
      return ok('Filesystem     1K-blocks     Used Available Use% Mounted on\n/dev/sda2       15115452  5012392   9949716  34% /\n/dev/sda5       59631908 26545424  30008432  47% /home\n/dev/sda1         147764    17370    122765  13% /boot\ntmpfs             256856        0    256856   0% /dev/shm\n');
    };
    C.free = function () {
      return ok('              total        used        free      shared  buff/cache   available\nMem:        2032668      917116      178548       26032      937004      921432\nSwap:       2097148      126724     1970424\n');
    };
    C.ps = function (a) {
      if (a[0] === 'x' || a[0] === 'aux') return ok('  PID TTY      STAT   TIME COMMAND\n 2799 ?        Ssl    0:00 /usr/libexec/bonobo-activation-server\n 2820 ?        Sl     0:01 /usr/libexec/evolution-data-server\n 5198 pts/1    Ss     0:00 bash\n10129 pts/1    R+     0:00 ps ' + a[0] + '\n');
      return ok('  PID TTY          TIME CMD\n 5198 pts/1    00:00:00 bash\n10129 pts/1    00:00:00 ps\n');
    };

    /* ---------- execution ---------- */
    function runCmd(cmd, stdin, isLast) {
      var argv = [], words = cmd.words.slice();
      // leading NAME=value assignments
      var assigns = [];
      while (words.length) {
        var w0 = words[0], eq = w0.findIndex(function (x) { return x.c === '='; });
        if (eq > 0 && w0.slice(0, eq).every(function (x) { return x.q === 0; }) && /^[A-Za-z_]\w*$/.test(str(w0.slice(0, eq)))) {
          assigns.push([str(w0.slice(0, eq)), params(tilde(w0.slice(eq + 1))).map(function (x) { return x.c; }).join('')]); words.shift();
        } else break;
      }
      words.forEach(function (w) { argv = argv.concat(expandWord(w)); });
      if (aliases[argv[0]] && cmd.words[0].every(function (x) { return x.q === 0; })) {
        var body = aliases[argv[0]], btoks = lex(body);
        if (btoks.some(function (t) { return t.t === 'op'; })) {   // e.g. alias foo='cd /usr; ls; cd -'
          if ((sh._aliasDepth = (sh._aliasDepth || 0) + 1) > 10) { sh._aliasDepth = 0; return err('bash: ' + argv[0] + ': alias loops back on itself'); }
          var quoted = argv.slice(1).map(function (a) { return "'" + a.replace(/'/g, "'\\''") + "'"; }).join(' ');
          var ar = execLine(body + (quoted ? ' ' + quoted : ''), true);
          sh._aliasDepth--;
          return { out: ar.out, err: ar.err, code: ar.code };
        }
        var aw = [];
        btoks.forEach(function (t) { if (t.t === 'w') aw = aw.concat(expandWord(t.w)); });
        argv = aw.concat(argv.slice(1));
      }
      assigns.forEach(function (kv) { vars[kv[0]] = kv[1]; });
      // redirections
      var outF = null, outApp = false, errF = null, errApp = false, both = false, errToOut = false, inErr = null;
      for (var i = 0; i < cmd.redirs.length; i++) {
        var r = cmd.redirs[i];
        if (r.op === '2>&1') { errToOut = outF ? 'file' : 'stdout'; continue; }   // order matters, as in bash
        var tg = expandWord(r.w);
        if (tg.length !== 1) return { out: '', err: 'bash: ' + str(r.w) + ': ambiguous redirect\n', code: 1 };
        tg = tg[0];
        if (r.op === '<') {
          var rf = readFile('bash', tg);
          if (rf.e) { inErr = rf.e.replace(/^bash: /, 'bash: '); break; }
          stdin = rf.d;
        } else {
          var e = writeFile('bash', tg, '', r.op === '>>' || r.op === '2>>' || r.op === '&>>');   // truncate/create now, like bash
          if (e) return { out: '', err: e + '\n', code: 1 };
          if (r.op === '>' || r.op === '>>') { outF = tg; outApp = true; }
          else if (r.op === '&>' || r.op === '&>>') { outF = tg; outApp = true; both = true; }
          else { errF = tg; errApp = true; }
        }
      }
      if (inErr) return { out: '', err: inErr + '\n', code: 1 };
      if (!argv.length) return { out: '', err: '', code: 0 };
      var name = argv[0], args = argv.slice(1), res, trc = trace ? '+ ' + argv.join(' ') + '\n' : '';
      var ctx = { stdin: stdin, tty: isLast && !outF };
      if (args.indexOf('--help') >= 0 && C[name] && docs(name)) {
        var d = docs(name);
        res = ok('Usage: ' + (d.syntax || name) + '\n' + d.summary + '\n\n' + (d.flags || []).map(function (f) { return '  ' + rpad(f.f + (f.long ? ', ' + f.long : ''), 24) + ' ' + f.d; }).join('\n') + '\n');
      } else if (C[name]) {
        try { res = C[name](args, ctx); }
        catch (ex) { if (ex instanceof SyntaxErr) res = err(ex.message, 2); else throw ex; }
      } else if (KEYWORDS.indexOf(name) >= 0 || BUILTINS.indexOf(name) >= 0) {
        res = err(name + ': shell programming constructs are taught in Part IV but not run by this terminal. Try them in a real bash script.', 1);
        res.stub = name;
      } else if (known[name]) {
        res = err(name + ": isn't simulated here — it needs a real Linux system. Its lesson explains what it does.", 1);
        res.stub = name;
      } else if (/\//.test(name)) {
        var L = look(name);
        res = !L.node ? err('bash: ' + name + ': No such file or directory', 127)
          : L.node.t === 'd' ? err('bash: ' + name + ': Is a directory', 126)
          : !can(L.node, 1) ? err('bash: ' + name + ': Permission denied', 126)
          : err('bash: ' + name + ": running scripts isn't simulated, but its permissions are fine!", 0);
      } else res = err(name + ': command not found', 127);
      res.err = trc + (res.err || '');
      // 2>&1 before > file duplicated the *screen*, so errors stay on screen in that case
      if (both || errToOut === 'file' || (errToOut === 'stdout' && !outF)) { res.out = (res.err || '') + res.out; res.err = ''; }
      if (errF) { var e2 = writeFile('bash', errF, res.err, errApp); res.err = e2 ? e2 + '\n' : ''; }
      if (outF) { var e3 = writeFile('bash', outF, res.out, outApp); res.out = ''; if (e3) res.err += e3 + '\n'; }
      return res;
    }

    function execLine(line, quiet) {
      var lists, text = '', out = '', errs = '', stages = [], extra = {};
      try { lists = parse(lex(line)); }
      catch (e) { if (e instanceof SyntaxErr) { status = 2; return { out: '', err: 'bash: ' + e.message + '\n', code: 2, text: 'bash: ' + e.message + '\n', stages: [] }; } throw e; }
      for (var i = 0; i < lists.length; i++) {
        var L = lists[i];
        if (L.sep === '&&' && status !== 0) continue;
        if (L.sep === '||' && status === 0) continue;
        var data = null;
        stages = [];
        for (var j = 0; j < L.pipe.length; j++) {
          var r;
          try { r = runCmd(L.pipe[j], data, j === L.pipe.length - 1); }
          catch (e) { if (e instanceof SyntaxErr) r = err('bash: ' + e.message, 1); else throw e; }
          stages.push({ cmd: L.pipe[j].words.map(str).join(' '), out: r.out });
          if (r.err) { errs += r.err; text += r.err; }
          data = r.out;
          status = r.code;
          if (r.clear) extra.clear = true;
          if (r.stub) extra.stub = r.stub;
          if (r.note) extra.note = r.note;
        }
        if (L.bg) { text += "[1] 4243  (background jobs aren't simulated; it ran in the foreground)\n"; }
        out += data; text += data;
      }
      vars['?'] = String(status);
      return { out: out, err: errs, code: status, text: text, stages: stages, clear: extra.clear, stub: extra.stub, note: extra.note, quiet: quiet };
    }

    // history expansion: !!, !n, !string (chapter 8)
    function histExpand(line) {
      if (line.indexOf('!') < 0 || /^\s*'/.test(line)) return { line: line };
      var changed = false, bad = null;
      var res = line.replace(/!(!|-?\d+|[A-Za-z][\w.-]*)/g, function (m, k) {
        var h = null;
        if (k === '!') h = history[history.length - 1];
        else if (/^-?\d+$/.test(k)) h = +k < 0 ? history[history.length + (+k)] : history[+k - 1];
        else for (var i = history.length - 1; i >= 0; i--) if (history[i].indexOf(k) === 0) { h = history[i]; break; }
        if (h === undefined || h === null) { bad = m; return m; }
        changed = true; return h;
      });
      if (bad) return { error: 'bash: ' + bad + ': event not found' };
      return { line: res, echo: changed };
    }

    sh.run = function (line) {
      line = String(line).replace(/[“”„]/g, '"').replace(/[‘’‚]/g, "'").replace(/—/g, '--').replace(/–/g, '-').replace(/ /g, ' ');
      if (!line.trim()) return { out: '', err: '', code: status, text: '', stages: [] };
      var hx = histExpand(line);
      if (hx.error) return { out: '', err: hx.error + '\n', code: 1, text: hx.error + '\n', stages: [] };
      line = hx.line;
      history.push(line);
      var r = execLine(line);
      if (hx.echo) r.text = line + '\n' + r.text;
      r.line = line;
      return r;
    };
    // PS1 rendering (chapter 13): backslash escapes plus ANSI colour codes.
    // Returns segments { t, fg, bg, bold, u, inv } so the UI can colour them; fg/bg are 0-7 or null.
    sh.promptParts = function (ps1) {
      var ps = ps1 !== undefined ? ps1 : (vars.PS1 === undefined ? '$ ' : vars.PS1);
      var w = sh.cwd === HOME ? '~' : sh.cwd.indexOf(HOME + '/') === 0 ? '~' + sh.cwd.slice(HOME.length) : sh.cwd;
      var d = new Date(now()), h12 = d.getHours() % 12 || 12, ampm = d.getHours() < 12 ? 'AM' : 'PM';
      var esc1 = {
        a: '', d: d.toDateString().slice(0, 10), h: HOST, H: HOST, j: '0', l: '0', n: '\n', r: '', s: 'bash',
        t: two(d.getHours()) + ':' + two(d.getMinutes()) + ':' + two(d.getSeconds()),
        T: two(h12) + ':' + two(d.getMinutes()) + ':' + two(d.getSeconds()), '@': two(h12) + ':' + two(d.getMinutes()) + ' ' + ampm,
        A: two(d.getHours()) + ':' + two(d.getMinutes()), u: USER, v: '5.0', V: '5.0.17', w: w, W: w === '~' ? '~' : basename(w),
        '!': String(history.length + 1), '#': String(history.length + 1), $: '$', '[': '', ']': '', '\\': '\\', e: ''
      };
      var parts = [], st = { fg: null, bg: null, bold: false, u: false, inv: false }, buf = '';
      function flush() { if (buf) parts.push({ t: buf, fg: st.fg, bg: st.bg, bold: st.bold, u: st.u, inv: st.inv }); buf = ''; }
      function sgr(codes) {
        (codes === '' ? ['0'] : codes.split(';')).forEach(function (c) {
          c = +c;
          if (c === 0) st = { fg: null, bg: null, bold: false, u: false, inv: false };
          else if (c === 1) st.bold = true; else if (c === 4) st.u = true; else if (c === 7) st.inv = true;
          else if (c >= 30 && c <= 37) st.fg = c - 30; else if (c >= 40 && c <= 47) st.bg = c - 40;
        });
      }
      for (var i = 0; i < ps.length; i++) {
        var m = ps.slice(i).match(/^(?:\\033|\\e|\\x1b|\x1b)\[([0-9;]*)([a-zA-Z])/);
        if (m) { flush(); if (m[2] === 'm') sgr(m[1]); i += m[0].length - 1; continue; }   // cursor codes are dropped
        if (ps[i] === '\\' && i + 1 < ps.length && esc1.hasOwnProperty(ps[i + 1])) { buf += esc1[ps[i + 1]]; i++; continue; }
        buf += ps[i];
      }
      flush();
      return parts;
    };
    sh.prompt = function () { return sh.promptParts().map(function (p) { return p.t; }).join('').replace(/\n/g, ' '); };
    sh.history = function () { return history.slice(); };
    sh.commands = function () { return Object.keys(C).concat(BUILTINS.filter(function (b) { return !C[b]; })); };
    sh.simulated = function (n) { return !!C[n]; };

    // Tab completion of the last word: commands in first position, else paths.
    sh.complete = function (line) {
      var m = line.match(/(^|[\s|;&<>]+)([^\s|;&<>]*)$/), word = m ? m[2] : '', before = line.slice(0, line.length - word.length);
      var first = /^\s*$|[|;&]\s*$/.test(before), cands;
      if (first && word.indexOf('/') < 0) {
        cands = Object.keys(C).concat(Object.keys(aliases)).filter(function (c) { return c.indexOf(word) === 0 && c !== '.'; }).sort()
          .map(function (c) { return { s: c, dir: false }; });
      } else {
        var w = word.replace(/^~(?=\/|$)/, HOME), slash = w.lastIndexOf('/'), dirPart = slash >= 0 ? w.slice(0, slash + 1) : '', pre = w.slice(slash + 1);
        var dir = walk(norm(dirPart || '.'), true);
        if (!dir || dir.t !== 'd') return { line: line, options: [] };
        cands = Object.keys(dir.kids).filter(function (k) { return k.indexOf(pre) === 0 && (pre[0] === '.' || k[0] !== '.'); }).sort(cmpName)
          .map(function (k) { var n = dir.kids[k]; if (n.t === 'l') n = walk(norm(dirPart + k), true) || n; return { s: word.slice(0, word.length - pre.length) + k, dir: n.t === 'd' }; });
      }
      if (!cands.length) return { line: line, options: [] };
      if (cands.length === 1) return { line: before + cands[0].s + (cands[0].dir ? '/' : ' '), options: [] };
      var common = cands[0].s;
      cands.forEach(function (c) { while (c.s.indexOf(common) !== 0) common = common.slice(0, -1); });
      return { line: before + common, options: cands.map(function (c) { return basename(c.s) + (c.dir ? '/' : ''); }) };
    };

    // Plain tree for visualizations: {name, path, t, kids}
    sh.snapshot = function (path, depth) {
      var abs = norm(path || HOME), node = walk(abs, true);
      depth = depth === undefined ? 3 : depth;
      function snap(n, p, nm, dl) {
        var o = { name: nm, path: p, t: n.t, mode: n.mode };
        if (n.t === 'd' && dl > 0) o.kids = Object.keys(n.kids).filter(function (k) { return k[0] !== '.'; }).sort(function (x, y) {
          var dx = n.kids[x].t === 'd', dy = n.kids[y].t === 'd'; return dx !== dy ? (dx ? -1 : 1) : cmpName(x, y);
        }).map(function (k) { return snap(n.kids[k], p === '/' ? '/' + k : p + '/' + k, k, dl - 1); });
        return o;
      }
      return node ? snap(node, abs, abs === '/' ? '/' : basename(abs), depth) : null;
    };
    sh.readFile = function (p) { var L = look(p); return L.node && L.node.t === 'f' ? L.node.data : null; };

    // Puzzle filesystems for games (story missions, escape rooms, golf, bosses). Runs with full rights.
    //   { remove: [path], dirs: [path], files: { path: "text" | { data, mode, age } }, links: { path: target },
    //     modes: { path: "755" }, cwd: path }        paths may start with ~ ; age = minutes ago (for ls -t)
    sh.load = function (st) {
      if (!st) return;
      function P(p) { return norm(String(p).replace(/^~(?=\/|$)/, HOME), HOME); }
      function mkdirp(abs) {
        var cur = root;
        abs.split('/').filter(Boolean).forEach(function (part) {
          if (!cur.kids[part] || cur.kids[part].t !== 'd') cur.kids[part] = { t: 'd', kids: {}, mode: '775', owner: USER, mtime: now() };
          cur = cur.kids[part];
        });
        return cur;
      }
      (st.remove || []).forEach(function (p) { var L = look(P(p), false); if (L.node && L.parent) delete L.parent.kids[L.name]; });
      (st.dirs || []).forEach(function (p) { mkdirp(P(p)); });
      Object.keys(st.files || {}).forEach(function (p) {
        var abs = P(p), spec = st.files[p], f = typeof spec === 'string' ? { data: spec } : spec;
        mkdirp(dirname(abs)).kids[basename(abs)] = { t: 'f', data: f.data || '', mode: f.mode || '664', owner: USER, mtime: now() - (f.age || 0) * 60000 };
      });
      Object.keys(st.links || {}).forEach(function (p) { var abs = P(p); mkdirp(dirname(abs)).kids[basename(abs)] = { t: 'l', target: st.links[p], mode: '777', owner: USER, mtime: now() }; });
      Object.keys(st.modes || {}).forEach(function (p) { var L = look(P(p), false); if (L.node) L.node.mode = st.modes[p]; });
      if (st.cwd) { sh.cwd = P(st.cwd); vars.PWD = sh.cwd; }
    };

    // Guided-task checks (declarative). last = result of sh.run
    sh.check = function (checks, last) {
      function P(p) { return norm(p.replace(/^~(?=\/|$)/, HOME), HOME); }
      return checks.map(function (c) {
        var L;
        switch (c.t) {
          case 'exists': return !!look(P(c.p), false).node;
          case 'absent': return !look(P(c.p), false).node;
          case 'isdir': L = look(P(c.p)); return !!L.node && L.node.t === 'd';
          case 'content': L = look(P(c.p)); return !!L.node && L.node.t === 'f' && new RegExp(c.re, 'm').test(L.node.data);
          case 'cwd': return sh.cwd === P(c.p);
          case 'mode': L = look(P(c.p)); return !!L.node && parseInt(L.node.mode, 8) === parseInt(c.mode, 8);
          case 'cmd': return !!last && new RegExp(c.re).test(last.line || '');
          case 'out': return !!last && new RegExp(c.re, 'm').test(last.text || '');
          default: return false;
        }
      });
    };
    return sh;
  }

  G.Term = { create: create, HOME: HOME };
})(typeof window !== 'undefined' ? window : globalThis);
