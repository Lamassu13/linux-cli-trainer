# Linux Command Line Trainer

An interactive, offline-capable web app for learning and memorizing the Linux command line. All teaching content is paraphrased from **_The Linux Command Line_, 2nd Edition, by William Shotts** (No Starch Press). This app is a study companion; read the book itself for the full explanations.

**What's inside**

| Area | Coverage |
|---|---|
| Content | 36 chapters, 161 lessons, 225 commands and shell constructs, ~1,080 keys and syntax terms |
| Lessons | Syntax, a plain-language explanation, colour-coded options you can tap, and examples with output |
| Animations | File tree for `ls cd mkdir cp mv rm ln find`, pipelines, a `grep` scan, and an interactive `chmod` bit grid |
| Terminal | Simulated bash over a practice filesystem (pipes, redirection, globbing, expansions, tab completion, history), plus 113 guided tasks that check themselves |
| A terminal that teaches | A live line under the input explains each command, option and operator as you type; a live file tree beside the terminal animates every change |
| Man page hunt | Find options in simulated man pages using `less`-style search (`/`, `n`, `N`) |
| Prompt studio | Unlocks at level 3: design your own `PS1` with the escape and colour codes from Chapter 13; every terminal in the app uses it |
| Flashcards | Leitner spaced repetition with Again/Hard/Good/Easy grading and swipe gestures; a flip mode and a type-the-answer mode with typo detection; fill-in-the-blank cards built from the book's examples |
| Task reviews | Finished guided tasks come back on a schedule to redo from memory, without hints |
| Quizzes | Multiple choice, type the command, "which command produced this output?", build-the-command puzzles, a 60-second speed round, and a weak-commands drill |
| Mix-ups | 20 pairs people confuse (`cp`/`mv`, `>`/`>>`, `find`/`locate`, hard/symbolic links…) as quick two-choice questions |
| Daily challenge | The same 8 questions for everyone each day, scored once and counted toward your streak |
| Challenge links | After a quiz or speed round, share a link that gives a friend the exact same questions and shows your score to beat |
| Progress | XP, levels, streaks, badges, a progress ring per chapter, and export/import of progress as JSON |
| Retention | An 18-week activity heatmap, plus per-command memory strength with an interactive forgetting curve estimated from your flashcard reviews |
| Audio drill | Hands-free flashcards: the device's speech engine reads the meaning, pauses, says the answer; rate by tap, keys or saying "yes"/"no" |
| Play | Story mode (15 missions over a sysadmin's first week), 4 escape rooms with hints, 12 command-golf holes scored by keystrokes against par, and 4 boss fights (timed terminal battles for Parts I–III, a quiz battle for Part IV) |
| Cheat sheet | Searchable and filterable by chapter |
| App | Works offline (PWA) and can be installed to the home screen |

Everything is plain HTML, CSS and vanilla JS: no framework, no build step, no external requests.

## Run locally

A service worker needs `http://`, so serve the folder rather than opening `index.html` from disk:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/.

To check that it works under a sub-path the way GitHub Pages serves it, serve the **parent** folder and open `http://localhost:8000/<folder-name>/`.

## Deploy to GitHub Pages

1. Push these files to the root of a repository. `.nojekyll` is already included.
2. Go to **Settings → Pages**, choose **Deploy from a branch**, then pick `main` and the `/ (root)` folder.
3. Open `https://<username>.github.io/<repo-name>/`.

All paths are relative and routing uses the URL hash (`#/lesson/ls`), so refreshing any page never returns a 404.

When you change any file, bump `VERSION` in `sw.js` (e.g. `lcl-v2`). Otherwise returning visitors keep the cached copy until the service worker refreshes in the background.

## Project layout

```
index.html            app shell (header, tab bar, bottom sheet)
css/styles.css        all styles: mobile-first, dark/light themes, reduced motion
js/content.js         ALL educational content (one editable data object)
js/terminal.js        shell simulator + virtual filesystem (no DOM; also runs in node)
js/srs.js             progress store, Leitner scheduling, XP/badges, export/import
js/app.js             router, views, terminal UI, visualizations, flashcards, quizzes
sw.js                 offline cache
manifest.webmanifest  PWA metadata; icons/ holds the app icons
tools/validate.mjs    content checker (run after editing content.js)
tools/term-test.mjs   terminal simulator self-test
```

## Adding or editing content

Everything lives in `js/content.js` as `window.CONTENT = { modules: [...] }`. The header comment documents the full shape. A short version:

```js
{ id: "ch04", n: 4, part: 1, title: "...", summary: "...",
  lessons: [{ id: "ch04.cp", title: "...", intro: "...",
    commands: [{ id: "cp", name: "cp", kind: "cmd", summary: "...", syntax: "...", explain: "...",
      flags: [{ f: "-r", long: "--recursive", d: "...", p: 27 }],
      examples: [{ cmd: "cp -r Documents backup", note: "...", sim: true, viz: "tree" }] }],
    terms: [{ t: "*", d: "Matches any characters", p: 24 }],
    tasks: [{ id: "ch04.cp.t1", prompt: "...", hint: "...", solution: "cp notes.txt playground",
      check: [{ t: "exists", p: "~/playground/notes.txt" }] }],
    quiz:  [{ id: "ch04.cp.q1", type: "mc", cmd: "cp", q: "...", choices: ["-r","-i","-u","-v"], answer: 0 }] }] }
```

Field rules:

- **`sim: true`** examples run live in the terminal simulator, so they need no `out`. For a command the simulator doesn't support, use `sim: false` and give `out` yourself.
- **`viz`** can be `tree`, `pipe`, `scan` (grep) or `chmod`.
- **Task `check`** types are `exists`, `absent`, `isdir`, `content` (with `re`), `cwd`, `mode` (with `mode`), `cmd` and `out` (each with `re`). Tasks always start from a fresh copy of the practice filesystem with the working directory at `/home/me`.
- **Quiz types** are `mc`, `fill` (with `accept: [...]`), `output` (with `out`, `choices`, `answer`) and `order` (with `parts: [...]`). The app also generates extra questions from every command's flags and examples.
- **Games** live in `CONTENT.games` at the end of `content.js` (story, rooms, golf, bosses). Each puzzle has a `setup` that builds its files, plus checks; the validator replays every solution through the simulator.
- **Mix-up pairs** live in `CONTENT.pairs` at the end of `content.js`: `{ id, ch, a: {label, cmd}, b: {label, cmd}, items: [{ q, ans: "a"|"b", why }] }`.
- **Progress ids** for flashcards come from command and flag ids (`c:cp`, `f:cp:-r`). Keep those ids stable so saved progress survives your edits.

After editing, run both checks:

```bash
node tools/validate.mjs
```

```bash
node tools/term-test.mjs
```

The validator checks the schema, unique ids and quiz shapes. It also runs every `sim: true` example and every guided task through the simulator: each task must fail before its solution runs and pass after it.

## Progress and privacy

Progress is stored in `localStorage` on the device and is never sent anywhere. Use **Progress → Export** to move it between devices or keep a backup. On iOS, Safari may clear the data of websites you haven't visited for a while, so add the app to your Home Screen or export regularly.

## Suggested additions (not in the book, so not in the app)

The app teaches only what the book covers. These came up while building it and would make good extra lessons:

- **Files and directories:** `rmdir`, `tree`, `mkdir -p` taught on its own, `touch -d`/`-t`, `find -regex`/`-path`
- **Help and docs:** `zless`, `vimtutor`, and redo with `Ctrl-R` in vim
- **Shell:** `echo -n`, appending errors with `2>>`, `HISTSIZE`, `env`, `PROMPT_COMMAND`, `tput`
- **Permissions and users:** `chmod -R` (the book shows only `--recursive`), `groupadd`, `usermod`
- **Processes:** `nice`/`renice`, `pgrep`/`pkill`
- **Packages:** `apt` and `dnf` usage (the book names them but teaches `apt-get`/`yum`)
- **Storage and network:** `lsblk`/`blkid`, `ssh-keygen` and key-based login, `curl`
- **Archives:** `xz` and `tar J`
- **Text:** `grep -o`, `grep -w`, `awk`, `split`/`csplit`/`sdiff`, `strings`
- **Building:** running `gcc` directly
- **Scripting:** `bash script.sh`, `bash -x script`, quoted here-document tokens (`<< '_EOF_'`), `getopts`, `trap EXIT`

## Credits

Content is based on _The Linux Command Line_ (2nd ed.) by William E. Shotts, Jr., © No Starch Press. The explanations, quizzes and exercises here are written in the app's own words. If this app helps you, please buy the book.
