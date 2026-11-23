// Self-check for js/terminal.js.  Run: node tools/term-test.mjs
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx = vm.createContext({ console, structuredClone, Intl });
vm.runInContext(readFileSync(new URL('../js/terminal.js', import.meta.url), 'utf8'), ctx);
const fresh = () => ctx.Term.create({ now: () => new Date(2026, 10, 17, 9, 0).getTime() });

let n = 0;
function t(name, fn) { try { fn(); n++; } catch (e) { console.error('FAIL', name, '\n', e.message); process.exitCode = 1; } }
const out = (sh, line) => sh.run(line).text;

t('pwd/cd', () => { const s = fresh(); assert.equal(out(s, 'pwd'), '/home/me\n'); s.run('cd /usr'); assert.equal(out(s, 'pwd'), '/usr\n'); s.run('cd -'); assert.equal(s.cwd, '/home/me'); s.run('cd ..'); assert.equal(s.cwd, '/home'); s.run('cd'); assert.equal(s.cwd, '/home/me'); });
t('cd errors', () => { const s = fresh(); assert.match(out(s, 'cd nope'), /No such file/); assert.match(out(s, 'cd notes.txt'), /Not a directory/); assert.match(out(s, 'cd /root'), /Permission denied/); });
t('ls plain tty', () => { const s = fresh(); assert.equal(out(s, 'ls /usr'), 'bin  games  include  lib  local  sbin  share  src\n'); });
t('ls piped one per line', () => { const s = fresh(); assert.equal(out(s, 'ls Pictures | wc -l'), '3\n'); });
t('ls -l', () => { const s = fresh(); const o = out(s, 'ls -l Documents'); assert.match(o, /^total 8\n-rw-rw-r-- 1 me me \d+ \d{4}-\d\d-\d\d \d\d:\d\d report\.txt\n/); });
t('ls -a hidden', () => { const s = fresh(); assert.match(out(s, 'ls -a'), /\.bashrc/); assert.doesNotMatch(out(s, 'ls'), /\.bashrc/); });
t('ls -F', () => { const s = fresh(); assert.match(out(s, 'ls -F'), /Desktop\//); });
t('ls missing', () => { const s = fresh(); const r = s.run('ls nope'); assert.equal(r.code, 2); assert.match(r.text, /cannot access 'nope'/); });
t('mkdir/-p', () => { const s = fresh(); s.run('mkdir dir1 dir2'); assert.ok(s.check([{ t: 'isdir', p: '~/dir1' }, { t: 'isdir', p: 'dir2' }]).every(Boolean)); assert.match(out(s, 'mkdir dir1'), /File exists/); s.run('mkdir -p a/b/c'); assert.ok(s.check([{ t: 'isdir', p: '~/a/b/c' }])[0]); });
t('cp file & dir', () => { const s = fresh(); s.run('cp notes.txt playground'); assert.ok(s.check([{ t: 'exists', p: '~/playground/notes.txt' }])[0]); assert.match(out(s, 'cp Documents backup'), /-r not specified/); s.run('cp -r Documents backup'); assert.ok(s.check([{ t: 'exists', p: '~/backup/todo.txt' }])[0]); });
t('cp -v / glob', () => { const s = fresh(); assert.equal(out(s, 'cp -v *.txt playground').split('\n').length - 1, 5); });
t('mv rename & move', () => { const s = fresh(); s.run('mkdir logs && mv error.txt logs'); assert.deepEqual(s.check([{ t: 'exists', p: '~/logs/error.txt' }, { t: 'absent', p: '~/error.txt' }]), [true, true]); s.run('mv foo.txt bar.txt'); assert.ok(s.check([{ t: 'exists', p: 'bar.txt' }])[0]); });
t('rm', () => { const s = fresh(); s.run('rm foo.txt'); assert.ok(s.check([{ t: 'absent', p: 'foo.txt' }])[0]); assert.match(out(s, 'rm Documents'), /Is a directory/); s.run('rm -r Documents'); assert.ok(s.check([{ t: 'absent', p: 'Documents' }])[0]); assert.match(out(s, 'rm -rf ~'), /protects/); });
t('ln hard & soft', () => { const s = fresh(); s.run('ln foo.txt foo-hard'); s.run('ln -s foo.txt foo-sym'); assert.match(out(s, 'ls -l foo-sym'), /^lrwxrwxrwx .* foo-sym -> foo.txt/); s.run('echo changed > foo-hard'); assert.equal(out(s, 'cat foo.txt'), 'changed\n'); assert.match(out(s, 'ls -l foo.txt'), /^-rw-rw-r-- 2 /); });
t('redirection', () => { const s = fresh(); s.run('ls -l /usr/bin > ls-output.txt'); assert.match(s.readFile('ls-output.txt'), /grep/); s.run('echo hi >> foo.txt'); assert.equal(s.readFile('foo.txt'), 'foo\nhi\n'); s.run('ls nope 2> err.txt'); assert.match(s.readFile('err.txt'), /cannot access/); s.run('ls nope &> both.txt'); assert.match(s.readFile('both.txt'), /cannot access/); assert.equal(out(s, 'ls nope 2> /dev/null'), ''); });
t('truncate before run', () => { const s = fresh(); s.run('ls > list.txt'); assert.match(s.readFile('list.txt'), /list\.txt/); });
t('stdin <', () => { const s = fresh(); assert.equal(out(s, 'wc -l < fruits.txt'), '7\n'); });
t('pipeline sort uniq', () => { const s = fresh(); assert.equal(out(s, 'sort fruits.txt | uniq'), 'apple\nbanana\ncherry\ndate\n'); assert.equal(out(s, 'sort fruits.txt | uniq -c | sort -nr | head -1'), '      3 apple\n'); });
t('stages captured', () => { const s = fresh(); const r = s.run('cat fruits.txt | sort | uniq'); assert.equal(r.stages.length, 3); });
t('grep', () => { const s = fresh(); assert.equal(out(s, 'grep error error.txt'), 'error: file not found\nerror: permission denied\n'); assert.equal(out(s, 'grep -c error error.txt'), '2\n'); assert.equal(out(s, 'grep -v error error.txt'), 'warning: low disk space\n'); assert.equal(out(s, 'grep -n ^w error.txt'), '2:warning: low disk space\n'); assert.equal(out(s, 'grep -l apple *.txt'), 'fruits.txt\n'); });
t('grep regex', () => { const s = fresh(); assert.equal(out(s, "grep -E '^(Fedora|SUSE)' distros.txt | wc -l"), '6\n'); assert.equal(out(s, "grep '[[:upper:]]\\{4\\}' distros.txt | wc -l"), '3\n'); assert.equal(out(s, 'grep -i LINUX notes.txt'), 'Linux is fun\n'); });
t('wc', () => { const s = fresh(); assert.equal(out(s, 'wc fruits.txt'), ' 7  7 44 fruits.txt\n'); assert.equal(out(s, 'cat fruits.txt | wc'), '      7       7      44\n'); });
t('head/tail', () => { const s = fresh(); assert.equal(out(s, 'head -n 2 fruits.txt'), 'banana\napple\n'); assert.equal(out(s, 'tail -2 fruits.txt'), 'date\napple\n'); });
t('tee', () => { const s = fresh(); assert.equal(out(s, 'cat foo.txt | tee copy.txt'), 'foo\n'); assert.equal(s.readFile('copy.txt'), 'foo\n'); });
t('cut/tr/sort -k', () => { const s = fresh(); assert.equal(out(s, 'cut -d , -f 1 data.csv'), 'name\nann\nbob\ncy\n'); assert.equal(out(s, 'echo hello | tr a-z A-Z'), 'HELLO\n'); assert.equal(out(s, "echo 'aaabbb' | tr -s ab"), 'ab\n'); assert.equal(out(s, 'sort -t , -k 2 -n data.csv | head -2'), 'name,age,city\nbob,25,Rome\n'); assert.equal(out(s, 'cut -f 1 distros.txt | sort -u'), 'Fedora\nSUSE\nUbuntu\n'); });
t('expansion', () => { const s = fresh(); assert.equal(out(s, 'echo ~'), '/home/me\n'); assert.equal(out(s, 'echo $((2 + 2))'), '4\n'); assert.equal(out(s, 'echo $(((5**2) * 3))'), '75\n'); assert.equal(out(s, 'echo Front-{A,B,C}-Back'), 'Front-A-Back Front-B-Back Front-C-Back\n'); assert.equal(out(s, 'echo {1..5}'), '1 2 3 4 5\n'); assert.equal(out(s, 'echo {Z..W}'), 'Z Y X W\n'); assert.equal(out(s, 'echo a{A{1,2},B{3,4}}b'), 'aA1b aA2b aB3b aB4b\n'); assert.equal(out(s, 'echo $USER'), 'me\n'); assert.equal(out(s, 'echo $(ls Pictures | wc -l) files'), '3 files\n'); assert.equal(out(s, 'echo `pwd`'), '/home/me\n'); });
t('quoting', () => { const s = fresh(); assert.equal(out(s, 'echo this is a    test'), 'this is a test\n'); assert.equal(out(s, 'echo "this is a    test"'), 'this is a    test\n'); assert.equal(out(s, "echo '$USER $((2+2))'"), '$USER $((2+2))\n'); assert.equal(out(s, 'echo "$USER $((2+2))"'), 'me 4\n'); assert.equal(out(s, 'echo \\$5.00'), '$5.00\n'); assert.equal(out(s, 'echo -e "a\\tb"'), 'a\tb\n'); assert.equal(out(s, 'echo D*'), 'Desktop Documents\n'); assert.equal(out(s, 'echo "D*"'), 'D*\n'); assert.equal(out(s, 'echo [[:upper:]]*s'), 'Documents Pictures Videos\n'); });
t('glob no match stays literal', () => { const s = fresh(); assert.equal(out(s, 'echo *.zzz'), '*.zzz\n'); });
t('vars', () => { const s = fresh(); s.run('foo=yes'); assert.equal(out(s, 'echo $foo'), 'yes\n'); assert.equal(out(s, 'printenv foo'), ''); s.run('export foo'); assert.equal(out(s, 'printenv foo'), 'yes\n'); });
t('&& ||', () => { const s = fresh(); assert.equal(out(s, 'ls nope 2>/dev/null || echo no'), 'no\n'); assert.equal(out(s, 'true && echo yes'), 'yes\n'); assert.equal(out(s, 'false; echo $?'), '1\n'); });
t('chmod/umask', () => { const s = fresh(); s.run('chmod 755 hello.sh'); assert.ok(s.check([{ t: 'mode', p: 'hello.sh', mode: '755' }])[0]); s.run('chmod go-rx hello.sh'); assert.match(out(s, 'ls -l hello.sh'), /^-rwx------/); s.run('chmod u-r foo.txt'); assert.match(out(s, 'cat foo.txt'), /Permission denied/); assert.equal(out(s, 'umask'), '0002\n'); assert.match(out(s, 'chmod 777 /etc/passwd'), /not permitted/); });
t('find', () => { const s = fresh(); assert.equal(out(s, 'find Pictures -name "*.jpg"'), 'Pictures/beach.jpg\nPictures/cat.jpg\n'); assert.equal(out(s, 'find ~ -type d -name "P*"'), '/home/me/Pictures\n'); assert.match(out(s, 'find . -type f -name "*.txt" | wc -l'), /^7\n$/); s.run('find playground -empty -delete'); assert.ok(s.check([{ t: 'absent', p: 'playground' }])[0]); });
t('find logic', () => { const s = fresh(); assert.equal(out(s, 'find Pictures \\( -name "*.png" -or -name "beach*" \\)'), 'Pictures/beach.jpg\nPictures/dog.png\n'); assert.equal(out(s, 'find Pictures -type f -not -name "*.jpg"'), 'Pictures/dog.png\n'); });
t('type/which/alias', () => { const s = fresh(); assert.equal(out(s, 'type cd'), 'cd is a shell builtin\n'); assert.equal(out(s, 'which ls'), '/bin/ls\n'); assert.equal(out(s, 'type cp'), 'cp is /bin/cp\n'); s.run("alias foo='cd /usr; ls; cd -'"); assert.match(out(s, 'type foo'), /aliased/); s.run("alias ll='ls -l'"); assert.match(out(s, 'll Documents'), /^total/); });
t('history expansion', () => { const s = fresh(); s.run('echo one'); s.run('echo two'); assert.equal(out(s, '!!'), 'echo two\ntwo\n'); assert.equal(out(s, '!1'), 'echo one\none\n'); assert.match(out(s, 'history'), /1  echo one/); });
t('file/stat/du', () => { const s = fresh(); assert.equal(out(s, 'file Pictures/cat.jpg'), 'Pictures/cat.jpg: JPEG image data, JFIF standard 1.01\n'); assert.equal(out(s, 'file Documents'), 'Documents: directory\n'); assert.match(out(s, 'stat foo.txt'), /Size: 4 /); assert.match(out(s, 'du -s Documents'), /^\d+\tDocuments\n$/); });
t('stubs & unknown', () => { const s = ctx.Term.create({ known: { ssh: 'ch16.ssh' } }); const r = s.run('ssh host'); assert.equal(r.stub, 'ssh'); assert.equal(s.run('frobnicate').code, 127); assert.match(s.run('ls -Z').text, /isn't simulated/); });
t('syntax errors', () => { const s = fresh(); assert.match(out(s, 'echo "oops'), /unexpected EOF/); assert.match(out(s, '| ls'), /unexpected token/); });
t('smart punctuation', () => { const s = fresh(); assert.equal(out(s, 'ls —almost-all Desktop'), ''); assert.equal(out(s, 'echo “hi there”'), 'hi there\n'); });
t('complete', () => { const s = fresh(); assert.equal(s.complete('cd Doc').line, 'cd Documents/'); assert.equal(s.complete('mkd').line, 'mkdir '); assert.ok(s.complete('ls D').options.length === 2); });
t('set -x trace', () => { const s = fresh(); s.run('set -x'); assert.match(out(s, 'echo hi'), /^\+ echo hi\nhi\n$/); });
t('nl/paste/fold', () => { const s = fresh(); assert.equal(out(s, 'nl foo.txt'), '     1\tfoo\n'); assert.equal(out(s, 'paste foo.txt foo.txt'), 'foo\tfoo\n'); assert.equal(out(s, 'echo abcdef | fold -w 2'), 'ab\ncd\nef\n'); });
t('snapshot', () => { const s = fresh(); const t0 = s.snapshot('~'.replace('~', '/home/me'), 1); assert.equal(t0.kids[0].name, 'Desktop'); });
t('source .bashrc', () => { const s = fresh(); s.run('source .bashrc'); assert.match(out(s, 'alias'), /ll='ls -l'/); });

t('assignment concat', () => { const s = fresh(); s.run('foo="This is some "; foo=$foo"text."'); assert.equal(out(s, 'echo "$foo"'), 'This is some text.\n'); });
t('2>&1 order', () => { const s = fresh(); s.run('ls nope > a.txt 2>&1'); assert.match(s.readFile('a.txt'), /cannot access/); const r = s.run('ls nope 2>&1 > b.txt'); assert.match(r.text, /cannot access/); assert.equal(s.readFile('b.txt'), ''); assert.match(out(s, 'ls nope 2>&1 | wc -l'), /^1\n$/); });
t('prompt escapes and colours', () => { const s = fresh(); assert.equal(s.prompt(), '[me@linuxbox ~]$ '); s.run('cd Documents'); assert.equal(s.prompt(), '[me@linuxbox Documents]$ ');
  s.run('PS1="<\\u@\\h \\w>\\$ "'); assert.equal(s.prompt(), '<me@linuxbox ~/Documents>$ ');
  const p = s.promptParts('\\[\\033[0;31m\\]red\\[\\033[0m\\] \\033[1;44mX'); assert.equal(JSON.stringify(p.map(x => [x.t, x.fg, x.bg, x.bold])), JSON.stringify([['red', 1, null, false], [' ', null, null, false], ['X', null, 4, true]])); });
t('load puzzle filesystem', () => { const s = fresh(); s.load({ remove: ['~/foo.txt'], dirs: ['~/escape/vault'], files: { '~/escape/.clue': 'look in vault', '~/escape/vault/code.txt': { data: '4815', mode: '000' }, '~/escape/old.log': { data: 'x', age: 600 } }, modes: { '~/escape/vault': '700' }, cwd: '~/escape' });
  assert.equal(s.cwd, '/home/me/escape'); assert.equal(out(s, 'ls'), 'old.log  vault\n'); assert.equal(out(s, 'cat .clue'), 'look in vault'); assert.match(out(s, 'cat vault/code.txt'), /Permission denied/);
  s.run('chmod 600 vault/code.txt'); assert.equal(out(s, 'cat vault/code.txt'), '4815'); assert.ok(s.check([{ t: 'absent', p: '~/foo.txt' }])[0]); assert.equal(out(s, 'ls -t | head -1'), 'vault\n'); });
t('alias with several commands', () => { const s = fresh(); s.run("alias foo='cd /usr; ls; cd -'"); const r = s.run('foo'); assert.match(r.text, /games/); assert.equal(s.cwd, '/home/me'); assert.match(out(s, 'ls /usr/bin | grep zip'), /gzip/); });
console.log(n + ' terminal checks passed' + (process.exitCode ? ' (with failures above)' : ''));
