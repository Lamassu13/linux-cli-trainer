/* content.js — ALL learning content for the Linux Command Line trainer.
 * Source: "The Linux Command Line" (2nd ed.) by William Shotts. Explanations are paraphrased.
 *
 * Shape: CONTENT.modules[] -> lessons[] -> commands[] / terms[] / tasks[] / quiz[]
 *   command  { id, name, kind: cmd|builtin|keyword|syntax, chapters, summary, syntax, explain,
 *              flags:[{f, long?, d, p, ch}], examples:[{cmd, out?, note, sim, viz?}] }
 *            sim:true examples are run live in the terminal simulator, so they have no "out".
 *   lesson.refs   ids of commands owned by another chapter that this lesson also covers
 *   term     { t, d, p }                         concept-table rows (keys, wildcards, escapes)
 *   task     { id, prompt, hint, solution, check:[{t: exists|absent|isdir|content|cwd|mode|cmd|out, ...}] }
 *   quiz     { id, type: mc|fill|output|order, cmd, q, choices?, answer?, accept?, out?, parts?, explain? }
 * After editing run:  node tools/validate.mjs
 */
window.CONTENT = {
 "book": "The Linux Command Line, 2nd Edition — William Shotts",
 "modules": [
  {
   "id": "ch01",
   "n": 1,
   "part": 1,
   "title": "What Is the Shell?",
   "summary": "Meet bash, the prompt, command history, and your first simple commands",
   "lessons": [
    {
     "id": "ch01.shell",
     "title": "The Shell, the Terminal, and the Prompt",
     "intro": "The command line is really the shell: a program that reads what you type and hands it to the operating system. In a graphical desktop you reach it through a terminal emulator window.",
     "commands": [],
     "terms": [
      {
       "t": "shell",
       "d": "The program that accepts keyboard commands and passes them on to the operating system to run.",
       "p": 3
      },
      {
       "t": "bash",
       "d": "The usual Linux shell, from the GNU Project. The name stands for bourne-again shell, an improved take on the original sh.",
       "p": 3
      },
      {
       "t": "terminal emulator",
       "d": "A GUI program that gives you a window onto the shell, such as konsole (KDE) or gnome-terminal (GNOME).",
       "p": 3
      },
      {
       "t": "shell prompt",
       "d": "Text like [me@linuxbox ~]$ shown when the shell is waiting for input: user@machine, working directory, then $.",
       "p": 4
      },
      {
       "t": "# at end of prompt",
       "d": "A trailing hash mark instead of $ means the session has superuser (root) privileges.",
       "p": 4
      },
      {
       "t": "command not found",
       "d": "The message bash prints when you type something it cannot recognize as a command; you just get a fresh prompt.",
       "p": 4
      },
      {
       "t": "Up arrow",
       "d": "Recall the previous command from command history. Most distributions keep the last 1,000 commands.",
       "p": 4
      },
      {
       "t": "Down arrow",
       "d": "Step forward through history again; past the newest entry the recalled command disappears.",
       "p": 4
      },
      {
       "t": "Left / Right arrows",
       "d": "Move the cursor along the command line so you can edit a recalled command anywhere.",
       "p": 4
      },
      {
       "t": "Highlight + middle click",
       "d": "X Window copy and paste: selecting text copies it to a buffer; the middle mouse button pastes it at the cursor.",
       "p": 5
      },
      {
       "t": "CTRL-C / CTRL-V",
       "d": "Do not copy or paste inside a terminal; these control codes mean something else to the shell.",
       "p": 5
      },
      {
       "t": "focus follows mouse",
       "d": "Traditional X focus policy where hovering over a window lets it take input, unlike click to focus.",
       "p": 5
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch01.shell.q1",
       "type": "mc",
       "q": "What does a prompt ending in # (instead of $) tell you?",
       "choices": [
        "The session has superuser privileges",
        "The last command failed",
        "You are in the root directory",
        "History is turned off"
       ],
       "answer": 0,
       "explain": "A trailing hash mark signals a root (administrative) session; ordinary users see a dollar sign."
      },
      {
       "id": "ch01.shell.q2",
       "type": "mc",
       "q": "Which key brings back the command you entered last?",
       "choices": [
        "Up arrow",
        "Down arrow",
        "CTRL-V",
        "Left arrow"
       ],
       "answer": 0,
       "explain": "The up arrow walks backward through command history; the down arrow walks forward."
      },
      {
       "id": "ch01.shell.q3",
       "type": "mc",
       "q": "What is bash?",
       "choices": [
        "The shell program most Linux distributions ship",
        "A terminal emulator for KDE",
        "A text editor",
        "The Linux kernel"
       ],
       "answer": 0,
       "explain": "bash is the GNU shell; konsole and gnome-terminal are terminal emulators that give you access to it."
      },
      {
       "id": "ch01.shell.q4",
       "type": "order",
       "q": "Arrange the parts of the typical prompt [me@linuxbox ~]$ in order.",
       "parts": [
        "me",
        "@",
        "linuxbox",
        "~",
        "$"
       ]
      }
     ]
    },
    {
     "id": "ch01.simple",
     "title": "Try Some Simple Commands",
     "intro": "A few short commands make a good first workout: one shows the date, one draws a calendar, and two report on disk space and memory.",
     "commands": [
      {
       "id": "date",
       "name": "date",
       "kind": "cmd",
       "summary": "Show the current date and time",
       "syntax": "date",
       "explain": "Typed on its own, date prints today's date and the current time. It is a quick way to confirm the shell is responding to you.",
       "flags": [],
       "examples": [
        {
         "cmd": "date",
         "note": "Prints the current day, date, time, and time zone.",
         "sim": true
        }
       ],
       "chapters": [
        1
       ]
      },
      {
       "id": "cal",
       "name": "cal",
       "kind": "cmd",
       "summary": "Display a calendar of the current month",
       "syntax": "cal",
       "explain": "cal is a cousin of date. With no arguments it lays out the current month as a small grid of weekdays.",
       "flags": [],
       "examples": [
        {
         "cmd": "cal",
         "note": "Draws this month with Su through Sa as the column headings.",
         "sim": true
        }
       ],
       "chapters": [
        1
       ]
      },
      {
       "id": "df",
       "name": "df",
       "kind": "cmd",
       "summary": "Report free space on disk drives",
       "syntax": "df",
       "explain": "df lists each mounted file system with its size, how much is used, how much is still available, and where it is mounted.",
       "flags": [],
       "examples": [
        {
         "cmd": "df",
         "note": "One row per file system, with a Use% column and the mount point.",
         "sim": true
        }
       ],
       "chapters": [
        1
       ]
      },
      {
       "id": "free",
       "name": "free",
       "kind": "cmd",
       "summary": "Show how much memory is free",
       "syntax": "free",
       "explain": "free summarizes total, used, and free memory, plus swap space. It is handy for a quick check on how loaded the machine is.",
       "flags": [],
       "examples": [
        {
         "cmd": "free",
         "note": "Shows a Mem: row and a Swap: row with totals and free amounts.",
         "sim": true
        }
       ],
       "chapters": [
        1
       ]
      }
     ],
     "terms": [],
     "tasks": [
      {
       "id": "ch01.simple.t1",
       "prompt": "Ask the system for today's date and time.",
       "hint": "It is a four-letter command.",
       "solution": "date",
       "check": [
        {
         "t": "cmd",
         "re": "^\\s*date\\s*$"
        }
       ]
      },
      {
       "id": "ch01.simple.t2",
       "prompt": "Show a calendar for the current month.",
       "hint": "Short for calendar.",
       "solution": "cal",
       "check": [
        {
         "t": "cmd",
         "re": "^\\s*cal\\s*$"
        }
       ]
      },
      {
       "id": "ch01.simple.t3",
       "prompt": "Check how much free space is left on the disk drives, then check free memory.",
       "hint": "Run df, then free.",
       "solution": "df; free",
       "check": [
        {
         "t": "out",
         "re": "Mem:"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch01.simple.q1",
       "type": "mc",
       "cmd": "free",
       "q": "Which command reports the amount of free memory?",
       "choices": [
        "free",
        "df",
        "cal",
        "date"
       ],
       "answer": 0,
       "explain": "free covers memory and swap; df covers disk space."
      },
      {
       "id": "ch01.simple.q2",
       "type": "output",
       "cmd": "df",
       "q": "Which command produced this output?",
       "out": "Filesystem           1K-blocks      Used Available Use% Mounted on\n/dev/sda2             15115452   5012392   9949716  34% /\n/dev/sda5             59631908  26545424  30008432  47% /home",
       "choices": [
        "df",
        "free",
        "cal",
        "date"
       ],
       "answer": 0
      },
      {
       "id": "ch01.simple.q3",
       "type": "fill",
       "cmd": "cal",
       "q": "Display a calendar of the current month.",
       "accept": [
        "cal"
       ]
      },
      {
       "id": "ch01.simple.q4",
       "type": "output",
       "cmd": "cal",
       "q": "Which command produced this output?",
       "out": "    February 2018\nSu Mo Tu We Th Fr Sa\n             1  2  3\n 4  5  6  7  8  9 10",
       "choices": [
        "cal",
        "date",
        "df",
        "free"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch01.ending",
     "title": "Ending a Session and Virtual Consoles",
     "intro": "When you are done, there are three ways to close a terminal session. Behind the desktop, several text-only sessions are also quietly waiting.",
     "commands": [
      {
       "id": "exit",
       "name": "exit",
       "kind": "builtin",
       "summary": "End the current shell session",
       "syntax": "exit",
       "explain": "exit tells the shell to finish, which closes the terminal session. Closing the emulator window or pressing CTRL-D does the same job.",
       "flags": [],
       "examples": [
        {
         "cmd": "exit",
         "note": "Ends the session; the terminal window usually closes.",
         "sim": true
        },
        {
         "cmd": "exit 1",
         "out": "",
         "note": "Ends a script with status 1 to report failure. Without an argument, exit uses the status of the last command run.",
         "sim": false,
         "ch": 27
        }
       ],
       "chapters": [
        1,
        27
       ]
      }
     ],
     "terms": [
      {
       "t": "CTRL-D",
       "d": "Keyboard shortcut that ends a terminal session, just like typing exit.",
       "p": 6
      },
      {
       "t": "virtual consoles",
       "d": "Text login sessions that keep running behind the graphical desktop, reached with CTRL-ALT-F1 to F6.",
       "p": 6
      },
      {
       "t": "ALT-F1 ... ALT-F6",
       "d": "Switch from one virtual console to another.",
       "p": 6
      },
      {
       "t": "ALT-F7",
       "d": "On most systems, returns you from a virtual console to the graphical desktop.",
       "p": 6
      }
     ],
     "tasks": [
      {
       "id": "ch01.ending.t1",
       "prompt": "End your shell session with a command.",
       "hint": "The opposite of entering.",
       "solution": "exit",
       "check": [
        {
         "t": "cmd",
         "re": "^\\s*exit\\s*$"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch01.ending.q1",
       "type": "mc",
       "cmd": "exit",
       "q": "Which of these does NOT end a terminal session?",
       "choices": [
        "CTRL-C",
        "Typing exit",
        "Pressing CTRL-D",
        "Closing the emulator window"
       ],
       "answer": 0,
       "explain": "exit, CTRL-D, and closing the window all end the session. CTRL-C is not one of the ways listed."
      },
      {
       "id": "ch01.ending.q2",
       "type": "mc",
       "cmd": "exit",
       "q": "How do you reach the first virtual console from the desktop on most distributions?",
       "choices": [
        "CTRL-ALT-F1",
        "ALT-F7",
        "CTRL-D",
        "CTRL-V"
       ],
       "answer": 0,
       "explain": "CTRL-ALT-F1 through F6 open the virtual consoles; ALT-F7 usually goes back to the GUI."
      },
      {
       "id": "ch01.ending.q3",
       "type": "fill",
       "cmd": "exit",
       "q": "Type the command that ends the shell session.",
       "accept": [
        "exit"
       ]
      }
     ]
    }
   ]
  },
  {
   "id": "ch02",
   "n": 2,
   "part": 1,
   "title": "Navigation",
   "summary": "Find where you are, look around, and move through the file system tree",
   "lessons": [
    {
     "id": "ch02.tree",
     "title": "The File System Tree and pwd",
     "intro": "Linux arranges files as one upside-down tree of directories that starts at the root. At any moment you stand in exactly one directory, and pwd tells you which.",
     "commands": [
      {
       "id": "pwd",
       "name": "pwd",
       "kind": "builtin",
       "summary": "Print the current working directory",
       "syntax": "pwd",
       "explain": "pwd shows the full pathname of the directory you are standing in. When you first open a terminal, that is normally your home directory.",
       "flags": [],
       "examples": [
        {
         "cmd": "pwd",
         "note": "Right after login this prints your home directory, /home/me.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "cd /usr/bin; pwd",
         "note": "After moving, pwd reports the new location.",
         "sim": true,
         "viz": "tree"
        }
       ],
       "chapters": [
        2
       ]
      }
     ],
     "terms": [
      {
       "t": "hierarchical directory structure",
       "d": "Files kept in a tree of directories (folders) that can hold files and further directories.",
       "p": 7
      },
      {
       "t": "root directory",
       "d": "The first directory of the file system, at the top of the tree. Everything else branches off it.",
       "p": 7
      },
      {
       "t": "single file system tree",
       "d": "Unlike Windows, Linux has one tree no matter how many drives exist; devices are mounted at points in it.",
       "p": 8
      },
      {
       "t": "mount",
       "d": "Attaching a storage device at some location in the tree, as decided by the system administrator.",
       "p": 8
      },
      {
       "t": "current working directory",
       "d": "The directory you are standing in right now inside the tree.",
       "p": 8
      },
      {
       "t": "parent directory",
       "d": "The directory directly above the one you are in.",
       "p": 8
      },
      {
       "t": "home directory",
       "d": "Each user's own directory and the only place an ordinary user may write files. New sessions start there.",
       "p": 8
      }
     ],
     "tasks": [
      {
       "id": "ch02.tree.t1",
       "prompt": "Find out which directory you are currently in.",
       "hint": "print working directory",
       "solution": "pwd",
       "check": [
        {
         "t": "out",
         "re": "^/home/me\\s*$"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch02.tree.q1",
       "type": "mc",
       "cmd": "pwd",
       "q": "What does pwd stand for?",
       "choices": [
        "print working directory",
        "present whole directory",
        "path with directories",
        "print web domain"
       ],
       "answer": 0,
       "explain": "pwd prints the name of the current working directory."
      },
      {
       "id": "ch02.tree.q2",
       "type": "mc",
       "cmd": "pwd",
       "q": "How many file system trees does a Linux system have when three drives are attached?",
       "choices": [
        "One",
        "Three",
        "One per partition",
        "Two"
       ],
       "answer": 0,
       "explain": "Linux always has a single tree; extra drives are mounted somewhere inside it."
      },
      {
       "id": "ch02.tree.q3",
       "type": "output",
       "cmd": "pwd",
       "q": "You just opened a terminal as user me. Which command printed this?",
       "out": "/home/me",
       "choices": [
        "pwd",
        "ls",
        "cd",
        "date"
       ],
       "answer": 0
      },
      {
       "id": "ch02.tree.q4",
       "type": "fill",
       "cmd": "pwd",
       "q": "Show the name of the current working directory.",
       "accept": [
        "pwd"
       ]
      }
     ]
    },
    {
     "id": "ch02.ls",
     "title": "Listing a Directory with ls",
     "intro": "ls shows the files and directories in the directory you are in. It can do far more, as the next chapter shows.",
     "commands": [
      {
       "id": "ls",
       "name": "ls",
       "kind": "cmd",
       "summary": "List directory contents",
       "syntax": "ls [options] [directory...]",
       "explain": "With no arguments, ls lists what is inside the current working directory. Give it a directory name and it lists that directory instead.",
       "flags": [
        {
         "f": "-a",
         "long": "--all",
         "d": "Include every file, even hidden ones whose names start with a period.",
         "p": 15,
         "ch": 3
        },
        {
         "f": "-A",
         "long": "--almost-all",
         "d": "Same as -a but leaves out the . and .. entries.",
         "p": 15,
         "ch": 3
        },
        {
         "f": "-d",
         "long": "--directory",
         "d": "Describe a named directory itself rather than its contents; pair with -l to see its details.",
         "p": 15,
         "ch": 3
        },
        {
         "f": "-F",
         "long": "--classify",
         "d": "Tack a marker onto each name, such as a trailing / for directories.",
         "p": 15,
         "ch": 3
        },
        {
         "f": "-h",
         "long": "--human-readable",
         "d": "In long listings, show sizes in easy units instead of raw bytes.",
         "p": 15,
         "ch": 3
        },
        {
         "f": "-l",
         "d": "Use the long format, with permissions, owner, size, and date.",
         "p": 15,
         "ch": 3
        },
        {
         "f": "-r",
         "long": "--reverse",
         "d": "Flip the order of the results; the default is ascending alphabetical.",
         "p": 15,
         "ch": 3
        },
        {
         "f": "-S",
         "d": "Order the results by file size.",
         "p": 15,
         "ch": 3
        },
        {
         "f": "-t",
         "d": "Order the results by modification time.",
         "p": 15,
         "ch": 3
        },
        {
         "f": "-i",
         "d": "Show each file's inode number in the first column, revealing which names share data.",
         "p": 34,
         "ch": 4
        }
       ],
       "examples": [
        {
         "cmd": "ls",
         "note": "Lists the visible items in your home directory.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "ls -a",
         "note": "Also shows hidden names that start with a period, such as .bashrc.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "ls /usr/bin",
         "out": "...a very long list of programs...",
         "note": "Most of the system's programs live here, so the list is huge.",
         "sim": false
        },
        {
         "cmd": "ls /usr",
         "note": "Lists a directory other than the one you are in.",
         "sim": true,
         "viz": "tree",
         "ch": 3
        },
        {
         "cmd": "ls ~ /usr",
         "note": "Two directories at once; each listing gets its own heading.",
         "sim": true,
         "viz": "tree",
         "ch": 3
        },
        {
         "cmd": "ls -l",
         "note": "Long format: one detailed line per item.",
         "sim": true,
         "viz": "tree",
         "ch": 3
        },
        {
         "cmd": "ls -lt",
         "note": "Two short options joined together: long format, sorted by modification time.",
         "sim": true,
         "viz": "tree",
         "ch": 3
        },
        {
         "cmd": "ls -lt --reverse",
         "out": "",
         "note": "Adds the long option --reverse so the oldest items come first.",
         "sim": false,
         "ch": 3
        },
        {
         "cmd": "ls -F",
         "note": "Directories show up with a trailing slash.",
         "sim": true,
         "viz": "tree",
         "ch": 3
        },
        {
         "cmd": "ls -ld Documents",
         "note": "Details about the Documents directory itself, not what is in it.",
         "sim": true,
         "viz": "tree",
         "ch": 3
        },
        {
         "cmd": "ls -li",
         "out": "12353539 drwxrwxr-x 2 me   me   4096 2018-01-14 16:17 dir1\n12353538 -rw-r--r-- 4 me   me   1650 2018-01-10 16:33 fun\n12353538 -rw-r--r-- 4 me   me   1650 2018-01-10 16:33 fun-hard",
         "note": "fun and fun-hard share inode 12353538, so they are one file.",
         "sim": false,
         "ch": 4
        }
       ],
       "chapters": [
        2,
        3,
        4
       ]
      }
     ],
     "terms": [],
     "tasks": [
      {
       "id": "ch02.ls.t1",
       "prompt": "List the contents of your home directory.",
       "hint": "Two letters.",
       "solution": "ls",
       "check": [
        {
         "t": "out",
         "re": "Documents"
        }
       ]
      },
      {
       "id": "ch02.ls.t2",
       "prompt": "Without moving, list what is inside the Pictures directory.",
       "hint": "Pass the directory name to ls.",
       "solution": "ls Pictures",
       "check": [
        {
         "t": "out",
         "re": "cat\\.jpg"
        },
        {
         "t": "cwd",
         "p": "/home/me"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch02.ls.q1",
       "type": "mc",
       "cmd": "ls",
       "q": "What does ls show when run with no arguments?",
       "choices": [
        "The contents of the current working directory",
        "The contents of /",
        "Your command history",
        "The name of the current directory"
       ],
       "answer": 0,
       "explain": "Without arguments ls lists the working directory; pwd is the one that prints its name."
      },
      {
       "id": "ch02.ls.q2",
       "type": "fill",
       "cmd": "ls",
       "q": "List the contents of the Documents directory without changing into it.",
       "accept": [
        "ls Documents"
       ]
      },
      {
       "id": "ch02.ls.q3",
       "type": "output",
       "cmd": "ls",
       "q": "Which command produced this output in a home directory?",
       "out": "Desktop  Documents  Music  Pictures  Public  Templates  Videos",
       "choices": [
        "ls",
        "pwd",
        "cd",
        "df"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch02.cd",
     "title": "Moving Around with cd",
     "intro": "cd moves you to another directory. You tell it where to go with a pathname, which can start from the root (absolute) or from where you are (relative).",
     "commands": [
      {
       "id": "cd",
       "name": "cd",
       "kind": "builtin",
       "summary": "Change the current working directory",
       "syntax": "cd [directory]",
       "explain": "Type cd followed by a pathname to move there. An absolute pathname starts with / and traces the tree from the root; a relative one starts from your current directory. On its own, cd takes you home.",
       "flags": [],
       "examples": [
        {
         "cmd": "cd /usr/bin",
         "note": "Absolute path: from the root, into usr, then into bin.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "cd /usr/bin; cd ..",
         "note": "The .. shorthand moves up to the parent, /usr.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "cd /usr; cd ./bin",
         "note": "Relative path from /usr; the ./ is optional, so cd bin works too.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "cd /usr; cd -",
         "note": "cd - jumps back to the directory you were in before.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "cd /etc; cd",
         "note": "A bare cd always returns you to your home directory.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "cd ~me",
         "note": "Goes to the home directory of the user named me.",
         "sim": true,
         "viz": "tree"
        }
       ],
       "chapters": [
        2
       ]
      }
     ],
     "terms": [
      {
       "t": "pathname",
       "d": "The route through the branches of the tree that leads to a file or directory.",
       "p": 9
      },
      {
       "t": "absolute pathname",
       "d": "A path that begins at the root (the leading /) and names every directory down to the target, like /usr/bin.",
       "p": 9
      },
      {
       "t": "relative pathname",
       "d": "A path that starts from the current working directory instead of the root.",
       "p": 9
      },
      {
       "t": ".",
       "d": "Shorthand for the current working directory.",
       "p": 10
      },
      {
       "t": "..",
       "d": "Shorthand for the parent of the current working directory.",
       "p": 10
      },
      {
       "t": "./ is implied",
       "d": "You can nearly always drop a leading ./ because the shell assumes the working directory anyway.",
       "p": 10
      },
      {
       "t": "cd",
       "d": "With no argument, switches to your home directory.",
       "p": 11
      },
      {
       "t": "cd -",
       "d": "Switches back to the previous working directory.",
       "p": 11
      },
      {
       "t": "cd ~user_name",
       "d": "Switches to that user's home directory; cd ~bob goes to bob's home.",
       "p": 11
      }
     ],
     "tasks": [
      {
       "id": "ch02.cd.t1",
       "prompt": "Change to /usr/bin using an absolute pathname.",
       "hint": "Start the path with /",
       "solution": "cd /usr/bin",
       "check": [
        {
         "t": "cwd",
         "p": "/usr/bin"
        }
       ]
      },
      {
       "id": "ch02.cd.t2",
       "prompt": "Go to /usr/bin, then climb to its parent using the dot-dot shorthand.",
       "hint": "cd .. moves up one level.",
       "solution": "cd /usr/bin; cd ..",
       "check": [
        {
         "t": "cwd",
         "p": "/usr"
        },
        {
         "t": "cmd",
         "re": "\\.\\."
        }
       ]
      },
      {
       "id": "ch02.cd.t3",
       "prompt": "Visit /etc, then hop straight back to where you started using the previous-directory shortcut.",
       "hint": "cd followed by a dash.",
       "solution": "cd /etc; cd -",
       "check": [
        {
         "t": "cwd",
         "p": "/home/me"
        },
        {
         "t": "cmd",
         "re": "cd\\s+-"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch02.cd.q1",
       "type": "mc",
       "cmd": "cd",
       "q": "You are in /usr. Which command is a relative way to reach /usr/bin?",
       "choices": [
        "cd bin",
        "cd /bin",
        "cd ..",
        "cd -"
       ],
       "answer": 0,
       "explain": "bin is looked up from the working directory /usr; /bin would be an absolute path to a different place."
      },
      {
       "id": "ch02.cd.q2",
       "type": "mc",
       "cmd": "cd",
       "q": "What does cd - do?",
       "choices": [
        "Returns to the previous working directory",
        "Goes to the parent directory",
        "Goes to the root directory",
        "Goes to your home directory"
       ],
       "answer": 0,
       "explain": "The dash means the directory you were in before the last change."
      },
      {
       "id": "ch02.cd.q3",
       "type": "fill",
       "cmd": "cd",
       "q": "Move to the parent of the current working directory.",
       "accept": [
        "cd .."
       ]
      },
      {
       "id": "ch02.cd.q4",
       "type": "order",
       "cmd": "cd",
       "q": "Build: go to the home directory of user bob.",
       "parts": [
        "cd",
        "~bob"
       ]
      }
     ]
    },
    {
     "id": "ch02.names",
     "title": "Important Facts About Filenames",
     "intro": "Linux filenames follow a few rules that differ from other systems. Knowing them now saves trouble later.",
     "commands": [],
     "terms": [
      {
       "t": "hidden files",
       "d": "Names beginning with a period. ls skips them unless you ask with ls -a; many are account settings files.",
       "p": 11
      },
      {
       "t": "case sensitivity",
       "d": "Filenames and commands are case sensitive, so File1 and file1 are two separate files.",
       "p": 11
      },
      {
       "t": "safe filename characters",
       "d": "Stick to letters, digits, period, dash, and underscore. Avoid spaces; use underscores between words.",
       "p": 11
      },
      {
       "t": "no file extensions",
       "d": "Linux itself does not use extensions to judge a file's type, though many applications do.",
       "p": 11
      }
     ],
     "tasks": [
      {
       "id": "ch02.names.t1",
       "prompt": "List every file in your home directory, including the hidden ones.",
       "hint": "ls has an option for all files.",
       "solution": "ls -a",
       "check": [
        {
         "t": "out",
         "re": "\\.bashrc"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch02.names.q1",
       "type": "mc",
       "cmd": "ls",
       "q": "Why does a plain ls not show .profile?",
       "choices": [
        "Names that start with a period are hidden",
        "It is a system file owned by root",
        "It has no file extension",
        "It is a directory"
       ],
       "answer": 0,
       "explain": "A leading period makes a name hidden; ls -a reveals it."
      },
      {
       "id": "ch02.names.q2",
       "type": "mc",
       "cmd": "ls",
       "q": "Which name follows the recommended filename style?",
       "choices": [
        "tax_report_2018.txt",
        "tax report 2018.txt",
        "tax&report!.txt",
        "tax report(2018)"
       ],
       "answer": 0,
       "explain": "Use only period, dash, and underscore for punctuation, and underscores instead of spaces."
      },
      {
       "id": "ch02.names.q3",
       "type": "mc",
       "cmd": "ls",
       "q": "Are Notes.txt and notes.txt the same file on Linux?",
       "choices": [
        "No, names are case sensitive",
        "Yes, case is ignored",
        "Only in the home directory",
        "Only if they have the same size"
       ],
       "answer": 0,
       "explain": "Linux treats upper- and lowercase letters as different characters in names."
      }
     ]
    }
   ]
  },
  {
   "id": "ch03",
   "n": 3,
   "part": 1,
   "title": "Exploring the System",
   "summary": "Dig deeper with ls, read long listings, inspect files, and tour the directories",
   "lessons": [
    {
     "id": "ch03.ls",
     "title": "More Fun with ls",
     "intro": "ls can list any directory, several at once, and in far more detail. This is also where options and arguments come in, the pattern almost every command follows.",
     "commands": [],
     "terms": [
      {
       "t": "command -options arguments",
       "d": "The usual shape of a command: options change how it behaves, arguments are the things it acts on.",
       "p": 14
      },
      {
       "t": "short option",
       "d": "A single character after one dash, like -l. Many commands let you string several together, as in -lt.",
       "p": 14
      },
      {
       "t": "long option",
       "d": "A whole word after two dashes, like --reverse. GNU programs commonly support these.",
       "p": 14
      },
      {
       "t": "~",
       "d": "Stands for your home directory when used in a path.",
       "p": 14
      },
      {
       "t": "options are case sensitive",
       "d": "Like filenames, -s and -S are different options.",
       "p": 15
      }
     ],
     "tasks": [
      {
       "id": "ch03.ls.t1",
       "prompt": "Without leaving home, list the contents of /usr.",
       "hint": "Give ls the directory as an argument.",
       "solution": "ls /usr",
       "check": [
        {
         "t": "out",
         "re": "share"
        },
        {
         "t": "cwd",
         "p": "/home/me"
        }
       ]
      },
      {
       "id": "ch03.ls.t2",
       "prompt": "Show a long-format listing of the Documents directory's contents.",
       "hint": "ls -l followed by the directory.",
       "solution": "ls -l Documents",
       "check": [
        {
         "t": "out",
         "re": "report\\.txt"
        },
        {
         "t": "cmd",
         "re": "-\\w*l"
        }
       ]
      },
      {
       "id": "ch03.ls.t3",
       "prompt": "Show the long-format details of the Documents directory itself, not its contents.",
       "hint": "Combine -l with the option that treats directories as items.",
       "solution": "ls -ld Documents",
       "check": [
        {
         "t": "out",
         "re": "^d.*Documents"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch03.ls.q1",
       "type": "mc",
       "cmd": "ls",
       "q": "Which option lists hidden files but leaves out . and ..?",
       "choices": [
        "-A",
        "-a",
        "-d",
        "-F"
       ],
       "answer": 0,
       "explain": "-A (almost all) is like -a without the two dot entries."
      },
      {
       "id": "ch03.ls.q2",
       "type": "mc",
       "cmd": "ls",
       "q": "In ls -lt /usr, which part is the argument?",
       "choices": [
        "/usr",
        "-l",
        "-t",
        "ls"
       ],
       "answer": 0,
       "explain": "Options modify behavior; the argument is what the command works on."
      },
      {
       "id": "ch03.ls.q3",
       "type": "fill",
       "cmd": "ls",
       "q": "List the current directory in long format, sorted by size.",
       "accept": [
        "ls -lS",
        "ls -Sl",
        "ls -l -S",
        "ls -S -l"
       ]
      },
      {
       "id": "ch03.ls.q4",
       "type": "order",
       "cmd": "ls",
       "q": "Build: long listing sorted by time, in reverse order, using the long option.",
       "parts": [
        "ls",
        "-lt",
        "--reverse"
       ]
      }
     ],
     "refs": [
      "ls"
     ]
    },
    {
     "id": "ch03.longformat",
     "title": "Reading a Long Listing",
     "intro": "Each line of ls -l packs seven pieces of information about one file. Learning to read them pays off for the rest of the book.",
     "commands": [],
     "terms": [
      {
       "t": "-rw-r--r--",
       "d": "Access rights. First char is the type; then three sets of rights for owner, group, and everyone else.",
       "p": 16
      },
      {
       "t": "leading - / d",
       "d": "In the first column, a dash marks a regular file and a d marks a directory.",
       "p": 16
      },
      {
       "t": "link count (field 2)",
       "d": "How many hard links the file has.",
       "p": 16
      },
      {
       "t": "owner (field 3)",
       "d": "The username of the user who owns the file.",
       "p": 16
      },
      {
       "t": "group (field 4)",
       "d": "The name of the group the file belongs to.",
       "p": 16
      },
      {
       "t": "size (field 5)",
       "d": "File size in bytes.",
       "p": 16
      },
      {
       "t": "date and time",
       "d": "When the file was last modified, e.g. 2017-04-03 11:05.",
       "p": 16
      },
      {
       "t": "name (last field)",
       "d": "The file's name.",
       "p": 16
      }
     ],
     "tasks": [
      {
       "id": "ch03.longformat.t1",
       "prompt": "Show a long listing of /etc so you can see its owners and sizes.",
       "hint": "ls -l with a path.",
       "solution": "ls -l /etc",
       "check": [
        {
         "t": "out",
         "re": "passwd"
        },
        {
         "t": "cmd",
         "re": "-\\w*l"
        }
       ]
      },
      {
       "id": "ch03.longformat.t2",
       "prompt": "List your home directory in long format with sizes in human-friendly units.",
       "hint": "Add -h to -l.",
       "solution": "ls -lh",
       "check": [
        {
         "t": "cmd",
         "re": "-(lh|hl)|-l\\s+-h|-h\\s+-l"
        },
        {
         "t": "out",
         "re": "notes\\.txt"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch03.longformat.q1",
       "type": "mc",
       "cmd": "ls",
       "q": "In -rw-r--r-- 1 root root 32059 2017-04-03 11:05 oo-cd-cover.odf, what is 32059?",
       "choices": [
        "Size in bytes",
        "Inode number",
        "Link count",
        "User ID"
       ],
       "answer": 0,
       "explain": "Field 5 of a long listing is the size in bytes."
      },
      {
       "id": "ch03.longformat.q2",
       "type": "mc",
       "cmd": "ls",
       "q": "A long-listing line starts with drwxrwxr-x. What kind of item is it?",
       "choices": [
        "A directory",
        "A regular file",
        "A symbolic link",
        "A hidden file"
       ],
       "answer": 0,
       "explain": "The first character gives the type, and d means directory."
      },
      {
       "id": "ch03.longformat.q3",
       "type": "output",
       "cmd": "ls",
       "q": "Which command produced this output?",
       "out": "total 56\ndrwxrwxr-x 2 me me 4096 2017-10-26 17:20 Desktop\ndrwxrwxr-x 2 me me 4096 2017-10-26 17:20 Documents\ndrwxrwxr-x 2 me me 4096 2017-10-26 17:20 Music",
       "choices": [
        "ls -l",
        "ls -a",
        "ls -F",
        "ls"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch03.file-less",
     "title": "Inspecting Files with file and less",
     "intro": "A name does not guarantee what a file holds. file tells you what is really inside, and less lets you scroll through text files.",
     "commands": [
      {
       "id": "file",
       "name": "file",
       "kind": "cmd",
       "summary": "Determine a file's type",
       "syntax": "file filename",
       "explain": "file looks at a file's contents and prints a short description of what kind of data it holds. That matters because Linux does not require a name like picture.jpg to really be a JPEG.",
       "flags": [],
       "examples": [
        {
         "cmd": "file picture.jpg",
         "out": "picture.jpg: JPEG image data, JFIF standard 1.01",
         "note": "Reports the real format, whatever the name suggests.",
         "sim": false
        },
        {
         "cmd": "file notes.txt",
         "note": "Identifies a plain text file.",
         "sim": true
        },
        {
         "cmd": "file Pictures/cat.jpg",
         "note": "Checks an image in another directory.",
         "sim": true
        }
       ],
       "chapters": [
        3
       ]
      },
      {
       "id": "less",
       "name": "less",
       "kind": "cmd",
       "summary": "View text files one page at a time",
       "syntax": "less filename",
       "explain": "less opens a text file so you can scroll forward and backward through it, which is perfect for reading configuration files and scripts. Press q to leave.",
       "flags": [],
       "examples": [
        {
         "cmd": "less /etc/passwd",
         "note": "Opens the file that lists the system's user accounts.",
         "sim": true
        },
        {
         "cmd": "less notes.txt",
         "note": "Pages through a text file in your home directory.",
         "sim": true
        }
       ],
       "chapters": [
        3
       ]
      }
     ],
     "terms": [
      {
       "t": "everything is a file",
       "d": "A core Unix idea: many things, devices included, are presented to you as files.",
       "p": 16
      },
      {
       "t": "configuration files",
       "d": "Text files that hold system settings; reading them shows how the system works.",
       "p": 17
      },
      {
       "t": "scripts",
       "d": "Programs stored as human-readable text.",
       "p": 17
      },
      {
       "t": "ASCII text",
       "d": "An early, simple encoding that maps each character to a number, one byte per character.",
       "p": 17
      },
      {
       "t": "pager",
       "d": "A program for viewing long text page by page. less improved on the older more, which only went forward.",
       "p": 18
      },
      {
       "t": "PAGE UP or b",
       "d": "less: go back one page.",
       "p": 18
      },
      {
       "t": "PAGE DOWN or space",
       "d": "less: go forward one page.",
       "p": 18
      },
      {
       "t": "Up / Down arrow",
       "d": "less: move up or down by a single line.",
       "p": 18
      },
      {
       "t": "G",
       "d": "less: jump to the end of the file.",
       "p": 18
      },
      {
       "t": "1G or g",
       "d": "less: jump to the start of the file.",
       "p": 18
      },
      {
       "t": "/characters",
       "d": "less: search ahead for the next place the characters appear.",
       "p": 18
      },
      {
       "t": "n",
       "d": "less: repeat the last search to find the next match.",
       "p": 18
      },
      {
       "t": "h",
       "d": "less: show the help screen.",
       "p": 18
      },
      {
       "t": "q",
       "d": "less: quit.",
       "p": 18
      }
     ],
     "tasks": [
      {
       "id": "ch03.file-less.t1",
       "prompt": "Find out what kind of data notes.txt contains.",
       "hint": "The command is named for what it inspects.",
       "solution": "file notes.txt",
       "check": [
        {
         "t": "out",
         "re": "notes\\.txt:"
        }
       ]
      },
      {
       "id": "ch03.file-less.t2",
       "prompt": "Open the list of user accounts, /etc/passwd, in the pager.",
       "hint": "less is more.",
       "solution": "less /etc/passwd",
       "check": [
        {
         "t": "cmd",
         "re": "^\\s*less\\s+/etc/passwd"
        },
        {
         "t": "out",
         "re": "\\S"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch03.file-less.q1",
       "type": "mc",
       "cmd": "less",
       "q": "Inside less, which key jumps to the end of the file?",
       "choices": [
        "G",
        "g",
        "n",
        "b"
       ],
       "answer": 0,
       "explain": "Capital G goes to the end; g or 1G goes to the start."
      },
      {
       "id": "ch03.file-less.q2",
       "type": "mc",
       "cmd": "less",
       "q": "You are viewing a file in less. How do you get back to the prompt?",
       "choices": [
        "Press q",
        "Press CTRL-V",
        "Press G",
        "Press n"
       ],
       "answer": 0,
       "explain": "q quits less."
      },
      {
       "id": "ch03.file-less.q3",
       "type": "output",
       "cmd": "file",
       "q": "Which command produced this output?",
       "out": "picture.jpg: JPEG image data, JFIF standard 1.01",
       "choices": [
        "file picture.jpg",
        "less picture.jpg",
        "ls -l picture.jpg",
        "cat picture.jpg"
       ],
       "answer": 0
      },
      {
       "id": "ch03.file-less.q4",
       "type": "fill",
       "cmd": "file",
       "q": "Determine the type of the file data.csv.",
       "accept": [
        "file data.csv"
       ]
      }
     ]
    },
    {
     "id": "ch03.tour",
     "title": "A Guided Tour of the Directories",
     "intro": "Most distributions follow the Linux Filesystem Hierarchy Standard, so the same directories turn up nearly everywhere. Wander with cd, ls -l, file, and less.",
     "commands": [
      {
       "id": "reset",
       "name": "reset",
       "kind": "cmd",
       "summary": "Restore a terminal scrambled by binary output",
       "syntax": "reset",
       "explain": "If you accidentally view a non-text file and the terminal fills with garbage, running reset puts it back in working order.",
       "flags": [],
       "examples": [
        {
         "cmd": "reset",
         "out": "",
         "note": "Recovers a garbled terminal window.",
         "sim": false
        }
       ],
       "chapters": [
        3
       ]
      }
     ],
     "terms": [
      {
       "t": "Filesystem Hierarchy Standard",
       "d": "Published standard describing the Linux directory layout; most distributions follow it closely.",
       "p": 18
      },
      {
       "t": "/",
       "d": "The root directory, where the whole tree begins.",
       "p": 19
      },
      {
       "t": "/bin",
       "d": "Programs (binaries) the system needs in order to boot and run.",
       "p": 19
      },
      {
       "t": "/boot",
       "d": "The Linux kernel, the initial RAM disk image, and the boot loader.",
       "p": 19
      },
      {
       "t": "/dev",
       "d": "Device nodes: the kernel's list of the devices it knows about, shown as files.",
       "p": 19
      },
      {
       "t": "/etc",
       "d": "System-wide configuration files, all readable text, e.g. /etc/passwd, /etc/fstab, /etc/crontab.",
       "p": 20
      },
      {
       "t": "/home",
       "d": "Holds one directory per user. Ordinary users can write only inside their own.",
       "p": 20
      },
      {
       "t": "/lib",
       "d": "Shared libraries used by the core programs, similar to Windows DLLs.",
       "p": 20
      },
      {
       "t": "/lost+found",
       "d": "Exists on each Linux-formatted partition for recovering from file system damage; normally empty.",
       "p": 20
      },
      {
       "t": "/media",
       "d": "Mount points for removable media like USB drives, mounted automatically when inserted.",
       "p": 20
      },
      {
       "t": "/mnt",
       "d": "On older systems, mount points for removable devices mounted by hand.",
       "p": 20
      },
      {
       "t": "/opt",
       "d": "Where optional software, often commercial products, gets installed.",
       "p": 20
      },
      {
       "t": "/proc",
       "d": "A virtual file system kept by the kernel; its files are windows into the kernel, not data on disk.",
       "p": 20
      },
      {
       "t": "/root",
       "d": "The root account's home directory.",
       "p": 20
      },
      {
       "t": "/sbin",
       "d": "System binaries for vital tasks usually reserved for the superuser.",
       "p": 20
      },
      {
       "t": "/tmp",
       "d": "Scratch space for temporary files; some setups wipe it at every reboot.",
       "p": 20
      },
      {
       "t": "/usr",
       "d": "Often the largest tree: all programs and support files for regular users.",
       "p": 20
      },
      {
       "t": "/usr/bin",
       "d": "Executable programs installed by the distribution, often thousands of them.",
       "p": 20
      },
      {
       "t": "/usr/lib",
       "d": "Library files that the programs in /usr/bin rely on.",
       "p": 20
      },
      {
       "t": "/usr/local",
       "d": "For system-wide programs not shipped by the distribution; source builds go in /usr/local/bin.",
       "p": 21
      },
      {
       "t": "/usr/sbin",
       "d": "Additional system administration programs.",
       "p": 21
      },
      {
       "t": "/usr/share",
       "d": "Shared data for /usr/bin programs: default configs, icons, backgrounds, sounds.",
       "p": 21
      },
      {
       "t": "/usr/share/doc",
       "d": "Documentation files from installed packages, sorted by package.",
       "p": 21
      },
      {
       "t": "/var",
       "d": "Data that changes often: databases, spool files, user mail, and the like.",
       "p": 21
      },
      {
       "t": "/var/log",
       "d": "Log files recording system activity, such as /var/log/messages and /var/log/syslog.",
       "p": 21
      }
     ],
     "tasks": [
      {
       "id": "ch03.tour.t1",
       "prompt": "Go to the directory that holds the system-wide configuration files and list it in long format.",
       "hint": "It is a three-letter directory right under /.",
       "solution": "cd /etc; ls -l",
       "check": [
        {
         "t": "cwd",
         "p": "/etc"
        },
        {
         "t": "out",
         "re": "passwd"
        }
       ]
      },
      {
       "id": "ch03.tour.t2",
       "prompt": "Move into the directory where log files are kept and list what is there.",
       "hint": "Look under /var.",
       "solution": "cd /var/log; ls",
       "check": [
        {
         "t": "cwd",
         "p": "/var/log"
        },
        {
         "t": "out",
         "re": "syslog"
        }
       ]
      },
      {
       "id": "ch03.tour.t3",
       "prompt": "From home, list the subdirectories of /usr in a way that marks directories with a slash.",
       "hint": "ls -F with a path.",
       "solution": "ls -F /usr",
       "check": [
        {
         "t": "out",
         "re": "share/"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch03.tour.q1",
       "type": "mc",
       "cmd": "cd",
       "q": "Where are the system-wide configuration files kept?",
       "choices": [
        "/etc",
        "/var",
        "/opt",
        "/usr/share/doc"
       ],
       "answer": 0,
       "explain": "/etc holds configuration such as /etc/passwd and /etc/fstab."
      },
      {
       "id": "ch03.tour.q2",
       "type": "mc",
       "cmd": "cd",
       "q": "Which directory is not stored on disk but generated by the kernel?",
       "choices": [
        "/proc",
        "/dev",
        "/tmp",
        "/lost+found"
       ],
       "answer": 0,
       "explain": "/proc is not stored on disk; its files show how the kernel sees the machine."
      },
      {
       "id": "ch03.tour.q3",
       "type": "mc",
       "cmd": "cd",
       "q": "A program you compiled from source for all users would normally go in...",
       "choices": [
        "/usr/local/bin",
        "/bin",
        "/sbin",
        "/home"
       ],
       "answer": 0,
       "explain": "/usr/local is for system-wide software that the distribution did not supply."
      },
      {
       "id": "ch03.tour.q4",
       "type": "fill",
       "cmd": "cd",
       "q": "Change to the directory that holds log files.",
       "accept": [
        "cd /var/log"
       ]
      }
     ]
    },
    {
     "id": "ch03.links",
     "title": "Symbolic and Hard Links",
     "intro": "Some long-listing entries start with l and show an arrow between two names. These are links, which let one file go by more than one name.",
     "commands": [],
     "terms": [
      {
       "t": "symbolic link",
       "d": "A special file that points to another file; also called a soft link or symlink.",
       "p": 21
      },
      {
       "t": "l in the type column",
       "d": "A long listing starting with l, e.g. lrwxrwxrwx, marks a symbolic link.",
       "p": 21
      },
      {
       "t": "name -> target",
       "d": "How ls -l shows a link: libc.so.6 -> libc-2.6.so means the first name points to the second.",
       "p": 21
      },
      {
       "t": "versioning with symlinks",
       "d": "Keep a versioned file like foo-2.6 and a link named foo to it; upgrade or roll back by re-pointing the link.",
       "p": 22
      },
      {
       "t": "hard link",
       "d": "A second way to give a file several names, working differently from a symbolic link.",
       "p": 22
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch03.links.q1",
       "type": "mc",
       "cmd": "ln",
       "q": "What does this listing describe? lrwxrwxrwx 1 root root 11 2018-08-11 07:34 libc.so.6 -> libc-2.6.so",
       "choices": [
        "A symbolic link named libc.so.6 pointing to libc-2.6.so",
        "A directory named libc.so.6",
        "Two separate files",
        "A hard link named libc-2.6.so"
       ],
       "answer": 0,
       "explain": "The leading l and the arrow mark a symbolic link and its target."
      },
      {
       "id": "ch03.links.q2",
       "type": "mc",
       "cmd": "ln",
       "q": "Why point a link named foo at foo-2.6 instead of renaming the file?",
       "choices": [
        "Programs keep using foo while the version stays visible and is easy to swap",
        "Links take up less disk space",
        "Programs cannot open versioned names",
        "It makes the file read-only"
       ],
       "answer": 0,
       "explain": "Programs always open foo; upgrading or reverting only means re-pointing the link."
      },
      {
       "id": "ch03.links.q3",
       "type": "mc",
       "cmd": "ln",
       "q": "Which is another name for a symbolic link?",
       "choices": [
        "Soft link",
        "Hard link",
        "Inode",
        "Mount point"
       ],
       "answer": 0,
       "explain": "Symbolic links are also called soft links or symlinks."
      }
     ]
    }
   ]
  },
  {
   "id": "ch04",
   "n": 4,
   "part": 1,
   "title": "Manipulating Files and Directories",
   "summary": "Use wildcards with mkdir, cp, mv, rm, and ln to create and reshape files",
   "lessons": [
    {
     "id": "ch04.wildcards",
     "title": "Wildcards",
     "intro": "Wildcards (also called globbing) let you pick out groups of filenames by pattern. They work with any command that takes filenames, which is what makes the file commands so powerful.",
     "commands": [],
     "terms": [
      {
       "t": "*",
       "d": "Matches any characters, including none.",
       "p": 24
      },
      {
       "t": "?",
       "d": "Matches exactly one character, whatever it is.",
       "p": 24
      },
      {
       "t": "[characters]",
       "d": "Matches one character that belongs to the given set.",
       "p": 24
      },
      {
       "t": "[!characters]",
       "d": "Matches one character that is NOT in the given set.",
       "p": 24
      },
      {
       "t": "[[:class:]]",
       "d": "Matches one character belonging to the named character class.",
       "p": 24
      },
      {
       "t": "[:alnum:]",
       "d": "Class of letters and digits (alphanumeric characters).",
       "p": 24
      },
      {
       "t": "[:alpha:]",
       "d": "Class of alphabetic characters.",
       "p": 24
      },
      {
       "t": "[:digit:]",
       "d": "Class of numerals.",
       "p": 24
      },
      {
       "t": "[:lower:]",
       "d": "Class of lowercase letters.",
       "p": 24
      },
      {
       "t": "[:upper:]",
       "d": "Class of uppercase letters.",
       "p": 24
      },
      {
       "t": "g*",
       "d": "Example: every name that starts with g.",
       "p": 25
      },
      {
       "t": "b*.txt",
       "d": "Example: names starting with b, then anything, ending in .txt.",
       "p": 25
      },
      {
       "t": "Data???",
       "d": "Example: Data followed by exactly three more characters.",
       "p": 25
      },
      {
       "t": "[abc]*",
       "d": "Example: names whose first letter is a, b, or c.",
       "p": 25
      },
      {
       "t": "BACKUP.[0-9][0-9][0-9]",
       "d": "Example: BACKUP. followed by exactly three digits.",
       "p": 25
      },
      {
       "t": "[[:upper:]]*",
       "d": "Example: names that begin with a capital letter.",
       "p": 25
      },
      {
       "t": "[![:digit:]]*",
       "d": "Example: names that do not begin with a numeral.",
       "p": 25
      },
      {
       "t": "*[[:lower:]123]",
       "d": "Example: names whose last character is a lowercase letter or 1, 2, or 3.",
       "p": 25
      },
      {
       "t": "[A-Z] / [a-z] ranges",
       "d": "Old Unix range notation; may not behave as expected unless configured. Prefer character classes.",
       "p": 26
      }
     ],
     "tasks": [
      {
       "id": "ch04.wildcards.t1",
       "prompt": "List only the files in your home directory whose names end in .txt.",
       "hint": "Use * in front of the suffix.",
       "solution": "ls *.txt",
       "check": [
        {
         "t": "out",
         "re": "notes\\.txt"
        },
        {
         "t": "cmd",
         "re": "\\*"
        }
       ]
      },
      {
       "id": "ch04.wildcards.t2",
       "prompt": "List just the .jpg images inside Pictures (the .png should not appear).",
       "hint": "Put the pattern after the directory name.",
       "solution": "ls Pictures/*.jpg",
       "check": [
        {
         "t": "out",
         "re": "^(?![\\s\\S]*dog)[\\s\\S]*cat\\.jpg"
        },
        {
         "t": "cmd",
         "re": "\\*"
        }
       ]
      },
      {
       "id": "ch04.wildcards.t3",
       "prompt": "Using a character class, list (as names, not contents) every item in home that starts with an uppercase letter.",
       "hint": "ls -d with [[:upper:]]*",
       "solution": "ls -d [[:upper:]]*",
       "check": [
        {
         "t": "out",
         "re": "Documents"
        },
        {
         "t": "cmd",
         "re": "\\[\\[:upper:\\]\\]"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch04.wildcards.q1",
       "type": "mc",
       "cmd": "ls",
       "q": "Which pattern matches Data001 but not Data01?",
       "choices": [
        "Data???",
        "Data*",
        "Data?",
        "[Data]*"
       ],
       "answer": 0,
       "explain": "Each ? stands for exactly one character, so three of them need exactly three."
      },
      {
       "id": "ch04.wildcards.q2",
       "type": "mc",
       "cmd": "ls",
       "q": "What does [![:digit:]]* match?",
       "choices": [
        "Any name not starting with a numeral",
        "Any name made only of digits",
        "Any name ending in a digit",
        "Only names containing an exclamation mark"
       ],
       "answer": 0,
       "explain": "[! ] negates the set, so the first character must not be a digit."
      },
      {
       "id": "ch04.wildcards.q3",
       "type": "fill",
       "cmd": "ls",
       "q": "List every file in the current directory whose name starts with g.",
       "accept": [
        "ls g*"
       ]
      },
      {
       "id": "ch04.wildcards.q4",
       "type": "mc",
       "cmd": "ls",
       "q": "Why does the book suggest [[:upper:]] over [A-Z]?",
       "choices": [
        "Ranges may give unexpected results unless properly configured",
        "[A-Z] is a syntax error",
        "Character classes are faster",
        "[A-Z] only works in the GUI"
       ],
       "answer": 0,
       "explain": "Traditional range notation can misbehave on modern setups; classes are reliable."
      }
     ]
    },
    {
     "id": "ch04.mkdir-cp",
     "title": "Building a Playground: mkdir and cp",
     "intro": "First make some directories to experiment in, then fill them with copies. Your home already has an empty playground directory to use.",
     "commands": [
      {
       "id": "mkdir",
       "name": "mkdir",
       "kind": "cmd",
       "summary": "Create directories",
       "syntax": "mkdir directory...",
       "explain": "mkdir makes a new directory for each name you give it. The ... in the syntax means the argument can repeat, so one command can create several directories.",
       "flags": [],
       "examples": [
        {
         "cmd": "mkdir dir1",
         "note": "Creates one directory named dir1.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "mkdir dir1 dir2 dir3",
         "note": "Three directories in a single command.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "cd playground; mkdir dir1 dir2",
         "note": "Sets up the two practice directories inside playground.",
         "sim": true,
         "viz": "tree"
        }
       ],
       "chapters": [
        4
       ]
      },
      {
       "id": "cp",
       "name": "cp",
       "kind": "cmd",
       "summary": "Copy files and directories",
       "syntax": "cp [options] item... destination",
       "explain": "cp copies one item to a new name, or copies any number of items into an existing directory. It overwrites an existing destination without warning unless you add -i. Copying a directory requires -r or -a.",
       "flags": [
        {
         "f": "-a",
         "long": "--archive",
         "d": "Copy files and directories along with all their attributes, such as ownership and permissions.",
         "p": 27,
         "ch": 4
        },
        {
         "f": "-i",
         "long": "--interactive",
         "d": "Ask before overwriting an existing file; without it cp overwrites silently.",
         "p": 27,
         "ch": 4
        },
        {
         "f": "-r",
         "long": "--recursive",
         "d": "Copy directories and everything inside them. Needed (or -a) to copy a directory.",
         "p": 27,
         "ch": 4
        },
        {
         "f": "-u",
         "long": "--update",
         "d": "Copy only files missing from the destination or newer than the copies already there.",
         "p": 27,
         "ch": 4
        },
        {
         "f": "-v",
         "long": "--verbose",
         "d": "Print a message describing each copy as it happens.",
         "p": 27,
         "ch": 4
        }
       ],
       "examples": [
        {
         "cmd": "cp /etc/passwd playground",
         "note": "Copies a single file into a directory.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "cd playground; cp /etc/passwd .",
         "note": "The lone period is shorthand for the working directory.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "cp -v /etc/passwd playground",
         "note": "Same copy, but cp reports what it did.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "cp notes.txt notes2.txt",
         "note": "file1 to file2: creates notes2.txt, or overwrites it if it exists.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "cp notes.txt foo.txt playground",
         "note": "Several files into a directory that must already exist.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "cp Pictures/* playground",
         "note": "A wildcard copies every file in Pictures.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "cp -r Documents backup",
         "note": "backup does not exist yet, so it is created as a copy of Documents.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "cp -i /etc/passwd .",
         "out": "cp: overwrite `./passwd'?",
         "note": "Answer y to overwrite; any other key leaves the file alone.",
         "sim": false
        },
        {
         "cmd": "cp -u *.html destination",
         "out": "",
         "note": "Copies only HTML files that are new or newer than the ones in destination.",
         "sim": false
        }
       ],
       "chapters": [
        4
       ]
      }
     ],
     "terms": [
      {
       "t": "argument...",
       "d": "Three periods after an argument in a syntax description mean you may repeat it.",
       "p": 26
      },
      {
       "t": "cp -r dir1 dir2",
       "d": "If dir2 is missing it becomes a copy of dir1; if dir2 exists, dir1 is copied inside it.",
       "p": 27
      }
     ],
     "tasks": [
      {
       "id": "ch04.mkdir-cp.t1",
       "prompt": "Inside playground, create two directories named dir1 and dir2 with one command.",
       "hint": "mkdir accepts several names.",
       "solution": "cd playground && mkdir dir1 dir2",
       "check": [
        {
         "t": "isdir",
         "p": "~/playground/dir1"
        },
        {
         "t": "isdir",
         "p": "~/playground/dir2"
        }
       ]
      },
      {
       "id": "ch04.mkdir-cp.t2",
       "prompt": "Copy /etc/passwd into the playground directory.",
       "hint": "cp SOURCE DESTINATION",
       "solution": "cp /etc/passwd playground",
       "check": [
        {
         "t": "exists",
         "p": "~/playground/passwd"
        },
        {
         "t": "exists",
         "p": "/etc/passwd"
        }
       ]
      },
      {
       "id": "ch04.mkdir-cp.t3",
       "prompt": "Copy the whole Documents directory, contents included, into playground.",
       "hint": "Directories need the recursive option.",
       "solution": "cp -r Documents playground",
       "check": [
        {
         "t": "exists",
         "p": "~/playground/Documents/report.txt"
        },
        {
         "t": "exists",
         "p": "~/Documents/report.txt"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch04.mkdir-cp.q1",
       "type": "mc",
       "cmd": "cp",
       "q": "Which cp option copies only files that are missing or newer at the destination?",
       "choices": [
        "-u",
        "-i",
        "-a",
        "-v"
       ],
       "answer": 0,
       "explain": "-u (update) skips files that do not need copying."
      },
      {
       "id": "ch04.mkdir-cp.q2",
       "type": "fill",
       "cmd": "cp",
       "q": "Copy every file in dir1 into dir2 (dir2 already exists).",
       "accept": [
        "cp dir1/* dir2"
       ]
      },
      {
       "id": "ch04.mkdir-cp.q3",
       "type": "output",
       "cmd": "cp",
       "q": "Which command printed this?",
       "out": "`/etc/passwd' -> `./passwd'",
       "choices": [
        "cp -v /etc/passwd .",
        "cp -i /etc/passwd .",
        "cp /etc/passwd .",
        "mv /etc/passwd ."
       ],
       "answer": 0
      },
      {
       "id": "ch04.mkdir-cp.q4",
       "type": "order",
       "cmd": "mkdir",
       "q": "Build: create directories dir1, dir2, and dir3 at once.",
       "parts": [
        "mkdir",
        "dir1",
        "dir2",
        "dir3"
       ]
      }
     ]
    },
    {
     "id": "ch04.mv",
     "title": "Moving and Renaming with mv",
     "intro": "mv both moves and renames, depending on its arguments. Either way, the original name is gone afterward.",
     "commands": [
      {
       "id": "mv",
       "name": "mv",
       "kind": "cmd",
       "summary": "Move or rename files and directories",
       "syntax": "mv [options] item... destination",
       "explain": "Given two names, mv renames item1 to item2. Given a directory as the last argument, it moves the items into it. Like cp, it silently overwrites unless told to ask.",
       "flags": [
        {
         "f": "-i",
         "long": "--interactive",
         "d": "Ask for confirmation before overwriting an existing file.",
         "p": 28,
         "ch": 4
        },
        {
         "f": "-u",
         "long": "--update",
         "d": "Move only files missing from the destination or newer than the ones there.",
         "p": 28,
         "ch": 4
        },
        {
         "f": "-v",
         "long": "--verbose",
         "d": "Print a message for each move.",
         "p": 28,
         "ch": 4
        }
       ],
       "examples": [
        {
         "cmd": "mv foo.txt fun",
         "note": "Renames foo.txt to fun; foo.txt no longer exists.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "mv foo.txt playground",
         "note": "Moves the file into an existing directory.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "mv notes.txt foo.txt Documents",
         "note": "Moves two files into Documents in one go.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "mv Music Videos",
         "note": "Videos exists, so Music moves inside it rather than being renamed.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "mv Music Songs",
         "note": "Songs does not exist, so Music is simply renamed.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "mv -v foo.txt playground",
         "note": "Reports the move as it happens.",
         "sim": true,
         "viz": "tree"
        }
       ],
       "chapters": [
        4
       ]
      }
     ],
     "terms": [
      {
       "t": "mv dir1 dir2",
       "d": "If dir2 is missing, dir1 is renamed to dir2; if dir2 exists, dir1 moves inside it.",
       "p": 28
      }
     ],
     "tasks": [
      {
       "id": "ch04.mv.t1",
       "prompt": "Rename foo.txt to fun.",
       "hint": "mv OLD NEW",
       "solution": "mv foo.txt fun",
       "check": [
        {
         "t": "exists",
         "p": "~/fun"
        },
        {
         "t": "absent",
         "p": "~/foo.txt"
        }
       ]
      },
      {
       "id": "ch04.mv.t2",
       "prompt": "Move notes.txt into the Documents directory.",
       "hint": "Put the directory last.",
       "solution": "mv notes.txt Documents",
       "check": [
        {
         "t": "exists",
         "p": "~/Documents/notes.txt"
        },
        {
         "t": "absent",
         "p": "~/notes.txt"
        }
       ]
      },
      {
       "id": "ch04.mv.t3",
       "prompt": "Move the Music directory so it ends up inside Videos.",
       "hint": "Videos already exists, so mv will nest Music in it.",
       "solution": "mv Music Videos",
       "check": [
        {
         "t": "isdir",
         "p": "~/Videos/Music"
        },
        {
         "t": "absent",
         "p": "~/Music"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch04.mv.q1",
       "type": "mc",
       "cmd": "mv",
       "q": "dir2 already exists. What does mv dir1 dir2 do?",
       "choices": [
        "Moves dir1 and its contents into dir2",
        "Renames dir1 to dir2, replacing it",
        "Merges the two and deletes dir2",
        "Fails with an error"
       ],
       "answer": 0,
       "explain": "With an existing destination directory, mv places dir1 inside it."
      },
      {
       "id": "ch04.mv.q2",
       "type": "fill",
       "cmd": "mv",
       "q": "Rename file1 to file2, but ask before overwriting file2.",
       "accept": [
        "mv -i file1 file2"
       ]
      },
      {
       "id": "ch04.mv.q3",
       "type": "order",
       "cmd": "mv",
       "q": "Build: move file1 and file2 into directory dir1.",
       "parts": [
        "mv",
        "file1",
        "file2",
        "dir1"
       ]
      }
     ]
    },
    {
     "id": "ch04.rm",
     "title": "Removing with rm",
     "intro": "rm deletes files and directories. There is no undelete on Linux, so double-check, especially when wildcards are involved.",
     "commands": [
      {
       "id": "rm",
       "name": "rm",
       "kind": "cmd",
       "summary": "Remove files and directories",
       "syntax": "rm item...",
       "explain": "rm deletes each item you name, silently and permanently. Directories need -r. A handy habit: try your wildcard with ls first, then recall the line and swap ls for rm.",
       "flags": [
        {
         "f": "-i",
         "long": "--interactive",
         "d": "Ask before each deletion; without it rm deletes silently.",
         "p": 29,
         "ch": 4
        },
        {
         "f": "-r",
         "long": "--recursive",
         "d": "Delete directories, including all their subdirectories. Required to remove a directory.",
         "p": 29,
         "ch": 4
        },
        {
         "f": "-f",
         "long": "--force",
         "d": "Skip missing files and never prompt; overrides --interactive.",
         "p": 29,
         "ch": 4
        },
        {
         "f": "-v",
         "long": "--verbose",
         "d": "Print a message for each deletion.",
         "p": 29,
         "ch": 4
        }
       ],
       "examples": [
        {
         "cmd": "rm foo.txt",
         "note": "Deletes the file with no questions asked.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "rm -r Desktop foo.txt",
         "note": "Removes a file plus a directory and whatever it contains.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "rm -rf Desktop nothere",
         "note": "Like -r, but quietly carries on even though nothere does not exist.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "rm -v foo.txt",
         "note": "Confirms each removal on screen.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "rm -i foo.txt",
         "out": "rm: remove regular file `foo.txt'?",
         "note": "Type y to delete; anything else keeps the file.",
         "sim": false
        },
        {
         "cmd": "rm * .html",
         "out": "",
         "note": "Danger: the stray space makes * match everything, wiping the whole directory.",
         "sim": false
        }
       ],
       "chapters": [
        4
       ]
      }
     ],
     "terms": [
      {
       "t": "no undelete",
       "d": "Once rm removes something it is gone; Linux assumes you meant it.",
       "p": 29
      },
      {
       "t": "rm *.html vs rm * .html",
       "d": "One space turns delete-the-HTML-files into delete-everything.",
       "p": 29
      },
      {
       "t": "test with ls first",
       "d": "Run the wildcard with ls to preview the victims, then up arrow and replace ls with rm.",
       "p": 29
      }
     ],
     "tasks": [
      {
       "id": "ch04.rm.t1",
       "prompt": "Delete foo.txt.",
       "hint": "rm FILE",
       "solution": "rm foo.txt",
       "check": [
        {
         "t": "absent",
         "p": "~/foo.txt"
        }
       ]
      },
      {
       "id": "ch04.rm.t2",
       "prompt": "Remove the Documents directory and everything in it.",
       "hint": "Directories need the recursive option.",
       "solution": "rm -r Documents",
       "check": [
        {
         "t": "absent",
         "p": "~/Documents"
        }
       ]
      },
      {
       "id": "ch04.rm.t3",
       "prompt": "Delete only the .jpg files in Pictures, keeping dog.png.",
       "hint": "Preview with ls Pictures/*.jpg, then use rm.",
       "solution": "rm Pictures/*.jpg",
       "check": [
        {
         "t": "absent",
         "p": "~/Pictures/cat.jpg"
        },
        {
         "t": "absent",
         "p": "~/Pictures/beach.jpg"
        },
        {
         "t": "exists",
         "p": "~/Pictures/dog.png"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch04.rm.q1",
       "type": "mc",
       "cmd": "rm",
       "q": "Which option does rm require to delete a directory?",
       "choices": [
        "-r",
        "-f",
        "-i",
        "-v"
       ],
       "answer": 0,
       "explain": "Without -r, rm refuses to remove directories."
      },
      {
       "id": "ch04.rm.q2",
       "type": "mc",
       "cmd": "rm",
       "q": "What happens with rm * .html?",
       "choices": [
        "Every file in the directory is deleted, then rm complains about .html",
        "Only HTML files are deleted",
        "Nothing, it is a syntax error",
        "rm asks for confirmation first"
       ],
       "answer": 0,
       "explain": "The space splits the pattern: * matches all files, and .html is a separate (missing) name."
      },
      {
       "id": "ch04.rm.q3",
       "type": "fill",
       "cmd": "rm",
       "q": "Delete file1 and directory dir1, staying silent if either is missing.",
       "accept": [
        "rm -rf file1 dir1",
        "rm -fr file1 dir1"
       ]
      },
      {
       "id": "ch04.rm.q4",
       "type": "order",
       "cmd": "rm",
       "q": "Build: delete file1 after confirming.",
       "parts": [
        "rm",
        "-i",
        "file1"
       ]
      }
     ]
    },
    {
     "id": "ch04.ln",
     "title": "Creating Links with ln",
     "intro": "ln gives a file an extra name, either as a hard link or, with -s, as a symbolic link. The two behave quite differently.",
     "commands": [
      {
       "id": "ln",
       "name": "ln",
       "kind": "cmd",
       "summary": "Create hard and symbolic links",
       "syntax": "ln [-s] target link",
       "explain": "Without options, ln adds a hard link: another directory entry for the same data. With -s it makes a symbolic link, a small file holding a text path to its target. For symlinks, the target path is read relative to where the link lives.",
       "flags": [
        {
         "f": "-s",
         "d": "Make a symbolic link instead of a hard link; the target may be a file or a directory.",
         "p": 30,
         "ch": 4
        }
       ],
       "examples": [
        {
         "cmd": "ln notes.txt notes-hard",
         "note": "A hard link: notes-hard and notes.txt are the very same file.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "ln notes.txt playground/notes-hard",
         "note": "Hard links can live in other directories on the same file system.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "ln -s foo.txt foo-sym",
         "note": "A symbolic link pointing to foo.txt.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "ln -s ../foo.txt playground/foo-sym",
         "note": "Relative target: from inside playground, foo.txt is one level up.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "ln -s /home/me/foo.txt playground/foo-abs",
         "note": "An absolute target works too, but breaks if the tree is moved.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "ln -s Documents docs",
         "note": "Symbolic links can point at directories.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "ln -s foo.txt foo-sym; rm foo.txt; ls -l",
         "note": "Deleting the target leaves foo-sym broken, pointing to nothing.",
         "sim": true,
         "viz": "tree"
        }
       ],
       "chapters": [
        4
       ]
      }
     ],
     "terms": [
      {
       "t": "hard link",
       "d": "An extra directory entry for a file. Every file starts with one, which gives it its name.",
       "p": 30
      },
      {
       "t": "hard link limits",
       "d": "A hard link cannot point to a directory or to a file on a different file system (partition).",
       "p": 30
      },
      {
       "t": "deleting a hard link",
       "d": "Removes only that name; the data stays until the last link to it is gone.",
       "p": 30
      },
      {
       "t": "symbolic link",
       "d": "A special file containing a text pointer to a file or directory, much like a Windows shortcut.",
       "p": 31
      },
      {
       "t": "broken link",
       "d": "A symlink whose target was deleted; it still exists but points at nothing. ls often colors it red.",
       "p": 31
      },
      {
       "t": "inode",
       "d": "The data part of a file: a chain of disk blocks. Each hard link is a name part referring to an inode.",
       "p": 34
      },
      {
       "t": "symlink size",
       "d": "A symlink's size is the length of its target text, e.g. 6 for ../fun, not the target file's size.",
       "p": 35
      },
      {
       "t": "relative symlink targets",
       "d": "Usually preferred: the tree can be moved or renamed without breaking the links.",
       "p": 35
      },
      {
       "t": "rm and symlinks",
       "d": "Most operations act on a link's target, but rm deletes the link itself, not the target.",
       "p": 36
      }
     ],
     "tasks": [
      {
       "id": "ch04.ln.t1",
       "prompt": "Create a hard link to notes.txt named notes-hard.",
       "hint": "ln FILE LINK",
       "solution": "ln notes.txt notes-hard",
       "check": [
        {
         "t": "exists",
         "p": "~/notes-hard"
        },
        {
         "t": "cmd",
         "re": "^\\s*ln\\s+(?!-s)"
        }
       ]
      },
      {
       "id": "ch04.ln.t2",
       "prompt": "Create a symbolic link named docs that points to the Documents directory.",
       "hint": "Hard links cannot reference directories; use -s.",
       "solution": "ln -s Documents docs",
       "check": [
        {
         "t": "exists",
         "p": "~/docs"
        },
        {
         "t": "cmd",
         "re": "-s"
        }
       ]
      },
      {
       "id": "ch04.ln.t3",
       "prompt": "Inside playground, create a symbolic link foo-sym that points to ../foo.txt.",
       "hint": "cd playground, then ln -s with a relative target.",
       "solution": "cd playground && ln -s ../foo.txt foo-sym",
       "check": [
        {
         "t": "exists",
         "p": "~/playground/foo-sym"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch04.ln.q1",
       "type": "mc",
       "cmd": "ln",
       "q": "Which can a hard link NOT do?",
       "choices": [
        "Point to a directory",
        "Live in a different directory than the file",
        "Keep the data alive after the original name is deleted",
        "Share the file's inode"
       ],
       "answer": 0,
       "explain": "Hard links cannot reference directories or cross file systems; symbolic links can."
      },
      {
       "id": "ch04.ln.q2",
       "type": "mc",
       "cmd": "ls",
       "q": "How can you prove two names are hard links to the same file?",
       "choices": [
        "ls -li shows the same inode number",
        "ls -l shows the same size",
        "ls -F shows an @",
        "They have the same name"
       ],
       "answer": 0,
       "explain": "Same size proves nothing; a shared inode number proves they are one file."
      },
      {
       "id": "ch04.ln.q3",
       "type": "output",
       "cmd": "ln",
       "q": "Which command created the fun-sym entry shown?",
       "out": "lrwxrwxrwx 1 me   me      6 2018-01-15 15:17 fun-sym -> ../fun",
       "choices": [
        "ln -s ../fun dir1/fun-sym",
        "ln ../fun dir1/fun-sym",
        "cp -s ../fun dir1/fun-sym",
        "mv ../fun dir1/fun-sym"
       ],
       "answer": 0
      },
      {
       "id": "ch04.ln.q4",
       "type": "fill",
       "cmd": "ln",
       "q": "Make a symbolic link named dir1-sym pointing to the directory dir1.",
       "accept": [
        "ln -s dir1 dir1-sym"
       ]
      }
     ],
     "refs": [
      "ls"
     ]
    }
   ]
  },
  {
   "id": "ch05",
   "n": 5,
   "part": 1,
   "title": "Working with Commands",
   "summary": "Identify command types, read built-in docs and man pages, and make aliases",
   "lessons": [
    {
     "id": "ch05.kinds",
     "title": "What Exactly Is a Command?",
     "intro": "A command name can refer to four different kinds of thing. type and which tell you which kind you are dealing with and where it lives.",
     "commands": [
      {
       "id": "type",
       "name": "type",
       "kind": "builtin",
       "summary": "Show how the shell interprets a command name",
       "syntax": "type command",
       "explain": "type is a shell builtin that reports what kind of command a name refers to: a builtin, an alias, or a program on disk (with its path). It is the quickest way to check whether a name is already taken.",
       "flags": [],
       "examples": [
        {
         "cmd": "type type",
         "note": "type reports that it is a shell builtin itself.",
         "sim": true
        },
        {
         "cmd": "type ls",
         "note": "On some systems ls turns out to be an alias that adds --color=tty.",
         "sim": true
        },
        {
         "cmd": "type cp",
         "note": "cp is an executable program, so type shows its location.",
         "sim": true
        },
        {
         "cmd": "type cd",
         "note": "cd is built into the shell.",
         "sim": true
        }
       ],
       "chapters": [
        5
       ]
      },
      {
       "id": "which",
       "name": "which",
       "kind": "cmd",
       "summary": "Show which executable program will run",
       "syntax": "which command",
       "explain": "When more than one copy of a program might be installed, which prints the path of the one that will actually run. It only knows about executable programs, so builtins and aliases give nothing or an error.",
       "flags": [],
       "examples": [
        {
         "cmd": "which ls",
         "note": "Prints the full path to the ls program.",
         "sim": true
        },
        {
         "cmd": "which cd",
         "out": "/usr/bin/which: no cd in (/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games)",
         "note": "cd is a builtin, so which cannot find a program for it.",
         "sim": false
        }
       ],
       "chapters": [
        5
       ]
      }
     ],
     "terms": [
      {
       "t": "executable program",
       "d": "A file such as those in /usr/bin: a compiled binary or a script in a language like shell, Perl, or Python.",
       "p": 40
      },
      {
       "t": "shell builtin",
       "d": "A command built into bash itself rather than stored as a separate program; cd is one.",
       "p": 40
      },
      {
       "t": "shell function",
       "d": "A small shell script kept in the environment and run like a command.",
       "p": 40
      },
      {
       "t": "alias",
       "d": "A command you define yourself out of other commands.",
       "p": 40
      }
     ],
     "tasks": [
      {
       "id": "ch05.kinds.t1",
       "prompt": "Find out what kind of command cd is.",
       "hint": "Use the builtin that names command kinds.",
       "solution": "type cd",
       "check": [
        {
         "t": "out",
         "re": "builtin"
        }
       ]
      },
      {
       "id": "ch05.kinds.t2",
       "prompt": "Show the location of the executable program that runs when you type ls.",
       "hint": "which ...",
       "solution": "which ls",
       "check": [
        {
         "t": "out",
         "re": "/ls"
        },
        {
         "t": "cmd",
         "re": "^\\s*which\\s+ls"
        }
       ]
      },
      {
       "id": "ch05.kinds.t3",
       "prompt": "Check what the shell will run for the name cp.",
       "hint": "type NAME",
       "solution": "type cp",
       "check": [
        {
         "t": "out",
         "re": "cp is"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch05.kinds.q1",
       "type": "mc",
       "cmd": "type",
       "q": "Which is NOT one of the four kinds of command?",
       "choices": [
        "A device node",
        "An executable program",
        "A shell builtin",
        "An alias"
       ],
       "answer": 0,
       "explain": "The four kinds are executable programs, shell builtins, shell functions, and aliases."
      },
      {
       "id": "ch05.kinds.q2",
       "type": "mc",
       "cmd": "which",
       "q": "Why does which cd fail to find anything?",
       "choices": [
        "cd is a shell builtin, not an executable file",
        "cd is not installed",
        "which only searches /usr/local",
        "cd is an alias"
       ],
       "answer": 0,
       "explain": "which only locates executable programs."
      },
      {
       "id": "ch05.kinds.q3",
       "type": "output",
       "cmd": "type",
       "q": "Which command printed this?",
       "out": "type is a shell builtin",
       "choices": [
        "type type",
        "which type",
        "help type",
        "whatis type"
       ],
       "answer": 0
      },
      {
       "id": "ch05.kinds.q4",
       "type": "fill",
       "cmd": "type",
       "q": "Check how the shell would interpret the name test.",
       "accept": [
        "type test"
       ]
      }
     ]
    },
    {
     "id": "ch05.help",
     "title": "help and --help",
     "intro": "Builtins document themselves through help, and many programs print a usage summary when given --help.",
     "commands": [
      {
       "id": "help",
       "name": "help",
       "kind": "builtin",
       "summary": "Get help for shell builtins",
       "syntax": "help builtin",
       "explain": "bash has its own help facility for every builtin. Type help and a builtin's name to get its syntax and options; it is accurate but terse, not a tutorial.",
       "flags": [],
       "examples": [
        {
         "cmd": "help cd",
         "note": "Shows the cd syntax line and what each option does.",
         "sim": true
        },
        {
         "cmd": "help type",
         "note": "Works for any builtin, including type.",
         "sim": true
        }
       ],
       "chapters": [
        5
       ]
      },
      {
       "id": "help-option",
       "name": "--help",
       "kind": "syntax",
       "summary": "Ask a program to print its usage information",
       "syntax": "program --help",
       "explain": "Many executable programs accept a --help option that lists their syntax and options. Even programs that lack it often reply with an error that reveals the same usage details, so it is worth a try.",
       "flags": [],
       "examples": [
        {
         "cmd": "mkdir --help",
         "out": "Usage: mkdir [OPTION] DIRECTORY...\nCreate the DIRECTORY(ies), if they do not already exist.\n  -m, --mode=MODE   set file mode (as in chmod), not a=rwx – umask\n  -p, --parents     no error if existing, make parent directories as\n                    needed\n  -v, --verbose     print a message for each created directory",
         "note": "mkdir lists its options and what they do.",
         "sim": false
        }
       ],
       "chapters": [
        5
       ]
      }
     ],
     "terms": [
      {
       "t": "[ ] in syntax",
       "d": "Square brackets in a command's syntax mark parts you may leave out.",
       "p": 42
      },
      {
       "t": "| in syntax",
       "d": "A vertical bar separates choices that cannot be used together.",
       "p": 42
      },
      {
       "t": "cd [-L|[-P[-e]]] [dir]",
       "d": "Reads as: optionally -L or -P; -e only with -P; then an optional dir.",
       "p": 42
      }
     ],
     "tasks": [
      {
       "id": "ch05.help.t1",
       "prompt": "Display the built-in help for the cd command.",
       "hint": "help NAME",
       "solution": "help cd",
       "check": [
        {
         "t": "cmd",
         "re": "^\\s*help\\s+cd"
        },
        {
         "t": "out",
         "re": "cd"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch05.help.q1",
       "type": "mc",
       "cmd": "help",
       "q": "Which tool documents shell builtins like cd?",
       "choices": [
        "help",
        "which",
        "apropos",
        "file"
       ],
       "answer": 0,
       "explain": "help is bash's own documentation for its builtins."
      },
      {
       "id": "ch05.help.q2",
       "type": "mc",
       "cmd": "help",
       "q": "In a syntax line, what do square brackets around an item mean?",
       "choices": [
        "The item is optional",
        "The item is required",
        "The item repeats",
        "The item is a wildcard"
       ],
       "answer": 0,
       "explain": "Brackets mark optional parts; a vertical bar separates mutually exclusive ones."
      },
      {
       "id": "ch05.help.q3",
       "type": "fill",
       "cmd": "help-option",
       "q": "Ask the mkdir program to print its own usage information.",
       "accept": [
        "mkdir --help"
       ]
      },
      {
       "id": "ch05.help.q4",
       "type": "order",
       "cmd": "help-option",
       "q": "Build: show usage information for cp.",
       "parts": [
        "cp",
        "--help"
       ]
      }
     ]
    },
    {
     "id": "ch05.man",
     "title": "Man Pages: man, apropos, whatis",
     "intro": "Most command line programs ship a formal manual page. man displays it, and apropos and whatis help you search the collection.",
     "commands": [
      {
       "id": "man",
       "name": "man",
       "kind": "cmd",
       "summary": "Display a program's manual page",
       "syntax": "man [section] program",
       "explain": "man shows a program's manual page, usually through less, so the familiar less keys work. Pages give a title, synopsis, description, and option list, but are reference material and rarely include examples. Add a section number to pick a specific part of the manual.",
       "flags": [
        {
         "f": "-k",
         "d": "Search the manual pages for a term, doing the same job as apropos.",
         "p": 44,
         "ch": 5
        }
       ],
       "examples": [
        {
         "cmd": "man ls",
         "note": "Opens the manual page for ls.",
         "sim": true
        },
        {
         "cmd": "man 5 passwd",
         "out": "",
         "note": "Section 5 gives the file format of /etc/passwd rather than the passwd command.",
         "sim": false
        }
       ],
       "chapters": [
        5
       ]
      },
      {
       "id": "apropos",
       "name": "apropos",
       "kind": "cmd",
       "summary": "Search man pages for a term",
       "syntax": "apropos search_term",
       "explain": "apropos looks through the list of man pages for a term and prints each match with its section and a short description. It is a rough search but can point you to the right command.",
       "flags": [],
       "examples": [
        {
         "cmd": "apropos partition",
         "out": "addpart (8)          - simple wrapper around the \"add partition\" ioctl\ncfdisk (8)           - display or manipulate disk partition table\nfdisk (8)            - manipulate disk partition table\nmpartition (1)       - partition an MSDOS hard disk",
         "note": "First field is the page name, second is its section.",
         "sim": false
        }
       ],
       "chapters": [
        5
       ]
      },
      {
       "id": "whatis",
       "name": "whatis",
       "kind": "cmd",
       "summary": "Show one-line man page descriptions",
       "syntax": "whatis keyword",
       "explain": "whatis prints the name, section, and one-line summary of the man page matching a keyword. Use it for a quick reminder of what a command does.",
       "flags": [],
       "examples": [
        {
         "cmd": "whatis ls",
         "note": "Prints a one-line summary of ls from section 1.",
         "sim": true
        },
        {
         "cmd": "whatis cp",
         "note": "Same quick summary for cp.",
         "sim": true
        }
       ],
       "chapters": [
        5
       ]
      }
     ],
     "terms": [
      {
       "t": "man section 1",
       "d": "User commands.",
       "p": 43
      },
      {
       "t": "man section 2",
       "d": "Programming interfaces for kernel system calls.",
       "p": 43
      },
      {
       "t": "man section 3",
       "d": "Programming interfaces to the C library.",
       "p": 43
      },
      {
       "t": "man section 4",
       "d": "Special files like drivers and device nodes.",
       "p": 43
      },
      {
       "t": "man section 5",
       "d": "File formats.",
       "p": 43
      },
      {
       "t": "man section 6",
       "d": "Games and amusements, such as screen savers.",
       "p": 43
      },
      {
       "t": "man section 7",
       "d": "Miscellaneous.",
       "p": 43
      },
      {
       "t": "man section 8",
       "d": "System administration commands.",
       "p": 43
      },
      {
       "t": "man section search_term",
       "d": "Without a section, man shows the first match, likely section 1; naming one picks that part.",
       "p": 43
      }
     ],
     "tasks": [
      {
       "id": "ch05.man.t1",
       "prompt": "Get the one-line description of the ls command.",
       "hint": "What is ls?",
       "solution": "whatis ls",
       "check": [
        {
         "t": "out",
         "re": "[Ll]ist"
        },
        {
         "t": "cmd",
         "re": "^\\s*whatis\\s+ls"
        }
       ]
      },
      {
       "id": "ch05.man.t2",
       "prompt": "Open the manual page for ls.",
       "hint": "man PROGRAM",
       "solution": "man ls",
       "check": [
        {
         "t": "cmd",
         "re": "^\\s*man\\s+ls"
        },
        {
         "t": "out",
         "re": "\\S"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch05.man.q1",
       "type": "mc",
       "cmd": "man",
       "q": "Which manual section covers file formats?",
       "choices": [
        "5",
        "1",
        "8",
        "3"
       ],
       "answer": 0,
       "explain": "Section 5 is file formats; 1 is user commands and 8 is system administration."
      },
      {
       "id": "ch05.man.q2",
       "type": "mc",
       "cmd": "apropos",
       "q": "Which command does the same job as apropos?",
       "choices": [
        "man -k",
        "whatis",
        "info",
        "which"
       ],
       "answer": 0,
       "explain": "man with -k searches the man pages just like apropos."
      },
      {
       "id": "ch05.man.q3",
       "type": "output",
       "cmd": "whatis",
       "q": "Which command printed this?",
       "out": "ls                   (1)  - list directory contents",
       "choices": [
        "whatis ls",
        "man ls",
        "type ls",
        "which ls"
       ],
       "answer": 0
      },
      {
       "id": "ch05.man.q4",
       "type": "order",
       "cmd": "man",
       "q": "Build: show the man page describing the /etc/passwd file format.",
       "parts": [
        "man",
        "5",
        "passwd"
       ]
      }
     ]
    },
    {
     "id": "ch05.info",
     "title": "Info Pages and Other Documentation",
     "intro": "The GNU Project offers info pages as an alternative to man pages. They are split into linked nodes that you navigate with a few keys.",
     "commands": [
      {
       "id": "info",
       "name": "info",
       "kind": "cmd",
       "summary": "Display a program's info entry",
       "syntax": "info [program]",
       "explain": "info reads GNU info files, which are organized as a tree of nodes, each on one topic, joined by hyperlinks. A link starts with an asterisk; put the cursor on it and press ENTER to follow it.",
       "flags": [],
       "examples": [
        {
         "cmd": "info coreutils",
         "out": "",
         "note": "Opens a menu linking to every program in the coreutils package, which includes most commands so far.",
         "sim": false
        }
       ],
       "chapters": [
        5
       ]
      }
     ],
     "terms": [
      {
       "t": "?",
       "d": "info: show command help.",
       "p": 45
      },
      {
       "t": "PAGE UP or BACKSPACE",
       "d": "info: go to the previous page.",
       "p": 45
      },
      {
       "t": "PAGE DOWN or spacebar",
       "d": "info: go to the next page.",
       "p": 45
      },
      {
       "t": "n",
       "d": "info: jump to the next node.",
       "p": 45
      },
      {
       "t": "p",
       "d": "info: jump to the previous node.",
       "p": 45
      },
      {
       "t": "U",
       "d": "info: go up to the parent node, usually a menu.",
       "p": 45
      },
      {
       "t": "ENTER",
       "d": "info: follow the hyperlink under the cursor.",
       "p": 45
      },
      {
       "t": "Q",
       "d": "info: quit the reader.",
       "p": 45
      },
      {
       "t": "/usr/share/doc",
       "d": "Where many packages keep README and other docs, mostly plain text you can read with less.",
       "p": 46
      },
      {
       "t": ".gz files",
       "d": "Docs compressed with gzip; read them with zless, a version of less for compressed text.",
       "p": 46
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch05.info.q1",
       "type": "mc",
       "cmd": "info",
       "q": "In info, how do you follow a hyperlink?",
       "choices": [
        "Move the cursor onto it and press ENTER",
        "Press n",
        "Press U",
        "Press Q"
       ],
       "answer": 0,
       "explain": "ENTER follows the link at the cursor; n and p move between nodes."
      },
      {
       "id": "ch05.info.q2",
       "type": "mc",
       "cmd": "info",
       "q": "Which info key takes you up to the parent node?",
       "choices": [
        "U",
        "p",
        "?",
        "Q"
       ],
       "answer": 0,
       "explain": "U goes up a level, usually to a menu."
      },
      {
       "id": "ch05.info.q3",
       "type": "fill",
       "cmd": "info",
       "q": "Open the info menu for the GNU coreutils package.",
       "accept": [
        "info coreutils"
       ]
      }
     ]
    },
    {
     "id": "ch05.alias",
     "title": "Creating Your Own Commands with alias",
     "intro": "With a semicolon you can put several commands on one line, and with alias you can give that line a name of its own.",
     "commands": [
      {
       "id": "cmd-sep",
       "name": ";",
       "kind": "syntax",
       "summary": "Run several commands on one line",
       "syntax": "command1; command2; command3...",
       "explain": "Separating commands with semicolons makes the shell run them one after another. It is a handy way to bundle a short sequence into a single line.",
       "flags": [],
       "examples": [
        {
         "cmd": "cd /usr; ls; cd -",
         "note": "Visits /usr, lists it, then returns to where you started.",
         "sim": true
        }
       ],
       "chapters": [
        5
       ]
      },
      {
       "id": "alias",
       "name": "alias",
       "kind": "builtin",
       "summary": "Create an alias for a command",
       "syntax": "alias name='string'",
       "explain": "alias assigns a name to a quoted command string, and the name then works anywhere a command would. There must be no spaces around the equal sign. Without arguments, alias lists every alias defined; aliases made at the prompt disappear when the session ends.",
       "flags": [],
       "examples": [
        {
         "cmd": "alias foo='cd /usr; ls; cd -'",
         "note": "Defines foo as the three-command sequence.",
         "sim": true
        },
        {
         "cmd": "alias foo='cd /usr; ls; cd -'; foo",
         "note": "Running foo now performs the whole sequence.",
         "sim": true
        },
        {
         "cmd": "alias foo='cd /usr; ls; cd -'; type foo",
         "note": "type confirms that foo is an alias and shows its meaning.",
         "sim": true
        },
        {
         "cmd": "alias",
         "note": "With no arguments, lists all the aliases in the environment.",
         "sim": true
        },
        {
         "cmd": "alias ll='ls -l --color=auto'",
         "note": "Define ll as a long-format listing; put it in .bashrc to keep it.",
         "sim": true,
         "ch": 11
        },
        {
         "cmd": "alias l.='ls -d .* --color=auto'",
         "note": "Define l. to list only entries that begin with a dot.",
         "sim": true,
         "ch": 11
        }
       ],
       "chapters": [
        5,
        11
       ]
      },
      {
       "id": "unalias",
       "name": "unalias",
       "kind": "builtin",
       "summary": "Remove an alias",
       "syntax": "unalias name",
       "explain": "unalias deletes an alias you defined, after which the name is free again.",
       "flags": [],
       "examples": [
        {
         "cmd": "alias foo='cd /usr; ls; cd -'; unalias foo; type foo",
         "note": "After unalias, type no longer finds foo.",
         "sim": true
        }
       ],
       "chapters": [
        5
       ]
      }
     ],
     "terms": [
      {
       "t": "check names with type",
       "d": "Before choosing an alias name, run type on it; test, for instance, is already a builtin.",
       "p": 46
      },
      {
       "t": "aliasing existing commands",
       "d": "Common practice to add a favorite option, e.g. ls aliased to ls --color=tty.",
       "p": 47
      },
      {
       "t": "aliases are temporary",
       "d": "Aliases typed at the prompt vanish when the shell session ends.",
       "p": 48
      }
     ],
     "tasks": [
      {
       "id": "ch05.alias.t1",
       "prompt": "On one line: change to /usr, list it, and return to where you were.",
       "hint": "Separate the three commands with semicolons.",
       "solution": "cd /usr; ls; cd -",
       "check": [
        {
         "t": "cwd",
         "p": "/home/me"
        },
        {
         "t": "cmd",
         "re": ";"
        },
        {
         "t": "out",
         "re": "share"
        }
       ]
      },
      {
       "id": "ch05.alias.t2",
       "prompt": "Create an alias named foo for 'cd /usr; ls; cd -', then use type to confirm it.",
       "hint": "alias foo='...' then type foo",
       "solution": "alias foo='cd /usr; ls; cd -'; type foo",
       "check": [
        {
         "t": "out",
         "re": "foo is aliased"
        }
       ]
      },
      {
       "id": "ch05.alias.t3",
       "prompt": "Define an alias ll for 'ls -l', then remove it again.",
       "hint": "alias to create, unalias to remove.",
       "solution": "alias ll='ls -l'; unalias ll",
       "check": [
        {
         "t": "cmd",
         "re": "unalias\\s+ll"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch05.alias.q1",
       "type": "mc",
       "cmd": "alias",
       "q": "Which alias definition is written correctly?",
       "choices": [
        "alias foo='cd /usr; ls'",
        "alias foo = 'cd /usr; ls'",
        "alias 'foo'=cd /usr; ls",
        "alias foo: 'cd /usr; ls'"
       ],
       "answer": 0,
       "explain": "The name, the equal sign, and the quoted string must touch with no spaces between them."
      },
      {
       "id": "ch05.alias.q2",
       "type": "mc",
       "cmd": "alias",
       "q": "What happens to an alias defined at the prompt when you log out?",
       "choices": [
        "It disappears",
        "It is saved to .bashrc",
        "It becomes a builtin",
        "It is copied to /usr/bin"
       ],
       "answer": 0,
       "explain": "Command line aliases last only for the current session."
      },
      {
       "id": "ch05.alias.q3",
       "type": "fill",
       "cmd": "unalias",
       "q": "Remove the alias named foo.",
       "accept": [
        "unalias foo"
       ]
      },
      {
       "id": "ch05.alias.q4",
       "type": "output",
       "cmd": "type",
       "q": "Which command printed this?",
       "out": "foo is aliased to `cd /usr; ls; cd -'",
       "choices": [
        "type foo",
        "alias",
        "which foo",
        "whatis foo"
       ],
       "answer": 0
      }
     ]
    }
   ]
  },
  {
   "id": "ch06",
   "n": 6,
   "part": 1,
   "title": "Redirection",
   "summary": "Send output to files, read input from files, and chain commands with pipes",
   "lessons": [
    {
     "id": "ch06.streams",
     "title": "Standard Streams and Output Redirection",
     "intro": "Every program has three standard streams: input, output, and error. Redirection operators let you point those streams at files instead of the keyboard and screen.",
     "commands": [
      {
       "id": "redirect-out",
       "name": ">",
       "kind": "syntax",
       "summary": "Send standard output to a file, overwriting it",
       "syntax": "command > file",
       "explain": "The > operator sends a command's results into the named file instead of the screen. The file is created if needed and always rewritten from the start, so earlier contents are lost. Using > with no command in front of it empties a file or makes a new empty one.",
       "examples": [
        {
         "cmd": "ls -l /usr/bin > ls-output.txt",
         "note": "Saves a long listing of /usr/bin into ls-output.txt; nothing appears on screen.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "ls -l /bin/usr > ls-output.txt",
         "out": "ls: cannot access /bin/usr: No such file or directory",
         "note": "The error still reaches the screen, and ls-output.txt is left with zero length.",
         "sim": false
        },
        {
         "cmd": "> ls-output.txt",
         "out": "",
         "note": "A redirection with no command truncates the file or creates an empty one.",
         "sim": false
        }
       ],
       "chapters": [
        6
       ]
      },
      {
       "id": "redirect-append",
       "name": ">>",
       "kind": "syntax",
       "summary": "Append standard output to the end of a file",
       "syntax": "command >> file",
       "explain": "The >> operator adds new output after whatever the file already holds instead of replacing it. If the file is missing, it is created just as > would do. Running the same appending command three times makes the file three times as large.",
       "examples": [
        {
         "cmd": "ls -l /usr/bin >> ls-output.txt",
         "note": "Adds another copy of the listing to the end of ls-output.txt.",
         "sim": true
        },
        {
         "cmd": "ls Pictures > pics.txt; ls Documents >> pics.txt",
         "note": "The first command creates pics.txt; the second adds to it.",
         "sim": true
        }
       ],
       "chapters": [
        6
       ]
      },
      {
       "id": "redirect-err",
       "name": "2>",
       "kind": "syntax",
       "summary": "Send standard error (file descriptor 2) to a file",
       "syntax": "command 2> file",
       "explain": "The shell numbers the standard streams as file descriptors: 0 for input, 1 for output, 2 for error. Writing the number 2 directly in front of > redirects only the error messages. Regular results still go to the screen.",
       "examples": [
        {
         "cmd": "ls -l /bin/usr 2> ls-error.txt",
         "note": "The error message lands in ls-error.txt instead of the terminal.",
         "sim": true
        }
       ],
       "chapters": [
        6
       ]
      },
      {
       "id": "redirect-both",
       "name": "&>",
       "kind": "syntax",
       "summary": "Capture output and errors together in one file",
       "syntax": "command &> file   |   command > file 2>&1",
       "explain": "Modern bash offers &> to capture results and errors together in one file, and &>> to append both. The older, portable form is > file 2>&1, which first redirects output and then points descriptor 2 at descriptor 1. Order matters: if 2>&1 comes before > file, errors still go to the screen.",
       "examples": [
        {
         "cmd": "ls -l /bin/usr &> ls-output.txt",
         "note": "Both the listing and any error message go into ls-output.txt.",
         "sim": true
        },
        {
         "cmd": "ls -l /bin/usr > ls-output.txt 2>&1",
         "out": "",
         "note": "Traditional form that also works on old shells.",
         "sim": false
        },
        {
         "cmd": "ls -l /bin/usr &>> ls-output.txt",
         "out": "",
         "note": "Appends both streams to the file.",
         "sim": false
        }
       ],
       "chapters": [
        6
       ]
      },
      {
       "id": "dev-null",
       "name": "/dev/null",
       "kind": "syntax",
       "summary": "Throw away unwanted output by redirecting it to the bit bucket",
       "syntax": "command 2> /dev/null",
       "explain": "/dev/null is a special device file that swallows anything written to it. Redirecting a stream there discards it silently. It is most often used to hide error and status messages.",
       "examples": [
        {
         "cmd": "ls -l /bin/usr 2> /dev/null",
         "note": "The error message is discarded, so nothing is printed.",
         "sim": true
        }
       ],
       "chapters": [
        6
       ]
      }
     ],
     "terms": [
      {
       "t": "stdout",
       "d": "Standard output: where a program writes its results. Linked to the screen by default.",
       "p": 50
      },
      {
       "t": "stderr",
       "d": "Standard error: where a program writes status and error messages. Also shown on the screen by default.",
       "p": 50
      },
      {
       "t": "stdin",
       "d": "Standard input: where a program reads data from. Attached to the keyboard by default.",
       "p": 50
      },
      {
       "t": "file descriptors 0, 1, 2",
       "d": "Internal numbers the shell uses for standard input, standard output, and standard error.",
       "p": 52
      },
      {
       "t": "2>&1",
       "d": "Redirect file descriptor 2 (errors) to wherever descriptor 1 (output) currently points. Place it after > file.",
       "p": 52
      },
      {
       "t": "bit bucket",
       "d": "Nickname for /dev/null, a device that accepts input and does nothing with it.",
       "p": 53
      }
     ],
     "tasks": [
      {
       "id": "ch06.streams.t1",
       "prompt": "Save a long listing of /usr into a file called ls-output.txt.",
       "hint": "ls -l DIR > FILE",
       "solution": "ls -l /usr > ls-output.txt",
       "check": [
        {
         "t": "exists",
         "p": "~/ls-output.txt"
        },
        {
         "t": "content",
         "p": "~/ls-output.txt",
         "re": "bin"
        }
       ]
      },
      {
       "id": "ch06.streams.t2",
       "prompt": "Write the listing of Pictures into pics.txt, then add the listing of Documents to the end of the same file.",
       "hint": "Use > first, then >>",
       "solution": "ls Pictures > pics.txt; ls Documents >> pics.txt",
       "check": [
        {
         "t": "content",
         "p": "~/pics.txt",
         "re": "beach\\.jpg[\\s\\S]*report\\.txt"
        }
       ]
      },
      {
       "id": "ch06.streams.t3",
       "prompt": "List the nonexistent directory /bin/usr and capture only the error message in ls-error.txt.",
       "hint": "The error stream is file descriptor 2",
       "solution": "ls -l /bin/usr 2> ls-error.txt",
       "check": [
        {
         "t": "exists",
         "p": "~/ls-error.txt"
        },
        {
         "t": "content",
         "p": "~/ls-error.txt",
         "re": "usr"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch06.streams.q1",
       "type": "mc",
       "cmd": "redirect-append",
       "q": "Which operator adds output to the end of a file without erasing what is already there?",
       "choices": [
        ">>",
        ">",
        "2>",
        "<"
       ],
       "answer": 0,
       "explain": "> rewrites the file from the beginning; >> appends."
      },
      {
       "id": "ch06.streams.q2",
       "type": "mc",
       "cmd": "redirect-both",
       "q": "Which line sends both output and errors to out.txt?",
       "choices": [
        "ls /bin/usr > out.txt 2>&1",
        "ls /bin/usr 2>&1 > out.txt",
        "ls /bin/usr 2> out.txt",
        "ls /bin/usr | out.txt"
       ],
       "answer": 0,
       "explain": "2>&1 must come after the output redirection, otherwise errors still go to the screen."
      },
      {
       "id": "ch06.streams.q3",
       "type": "fill",
       "cmd": "dev-null",
       "q": "List /bin/usr with ls -l but throw away any error messages.",
       "accept": [
        "ls -l /bin/usr 2> /dev/null",
        "ls -l /bin/usr 2>/dev/null"
       ]
      },
      {
       "id": "ch06.streams.q4",
       "type": "order",
       "cmd": "redirect-err",
       "q": "Build: send the errors from ls -l /bin/usr into ls-error.txt",
       "parts": [
        "ls",
        "-l",
        "/bin/usr",
        "2>",
        "ls-error.txt"
       ]
      }
     ]
    },
    {
     "id": "ch06.input",
     "title": "cat and Input Redirection",
     "intro": "cat copies files, or its standard input, to standard output. The < operator makes a file the source of a command's standard input.",
     "commands": [
      {
       "id": "cat",
       "name": "cat",
       "kind": "cmd",
       "summary": "Concatenate files and copy them to standard output",
       "syntax": "cat [file...]",
       "explain": "cat reads each file named on the command line and writes it to standard output, which makes it handy for showing short text files and for joining files together. Given no file arguments, it reads standard input instead, so it waits for typing until you press Ctrl-D. Combined with >, that turns it into a tiny way to create text files.",
       "examples": [
        {
         "cmd": "cat notes.txt",
         "note": "Prints the whole file with no paging.",
         "sim": true
        },
        {
         "cmd": "cat movie.mpeg.0* > movie.mpeg",
         "out": "",
         "note": "Joins split parts back into one file; the wildcard expands in sorted order.",
         "sim": false
        },
        {
         "cmd": "cat > lazy_dog.txt",
         "out": "",
         "note": "Type a line of text, then press Ctrl-D to save it into lazy_dog.txt.",
         "sim": false
        },
        {
         "cmd": "cat -A distros.txt",
         "note": "Tabs show up as ^I, proving the fields are tab-separated.",
         "sim": true,
         "ch": 20
        },
        {
         "cmd": "cat -n notes.txt",
         "note": "Prints notes.txt with line numbers.",
         "sim": true,
         "ch": 20
        },
        {
         "cmd": "cat -A foo.txt",
         "out": "^IThe quick brown fox jumped over the lazy dog.   $",
         "note": "Book example: a leading tab and trailing spaces become visible.",
         "sim": false,
         "ch": 20
        },
        {
         "cmd": "cat -ns foo.txt",
         "out": "     1      The quick brown fox\n     2\n     3      jumped over the lazy dog.",
         "note": "Numbers lines and squeezes two blank lines into one.",
         "sim": false,
         "ch": 20
        }
       ],
       "chapters": [
        6,
        20
       ],
       "flags": [
        {
         "f": "-A",
         "d": "Show non-printing characters: a tab appears as ^I and $ marks each real line end.",
         "p": 247,
         "ch": 20
        },
        {
         "f": "-n",
         "d": "Number every output line.",
         "p": 248,
         "ch": 20
        },
        {
         "f": "-s",
         "d": "Collapse runs of blank lines into one blank line.",
         "p": 248,
         "ch": 20
        }
       ]
      },
      {
       "id": "redirect-in",
       "name": "<",
       "kind": "syntax",
       "summary": "Take standard input from a file instead of the keyboard",
       "syntax": "command < file",
       "explain": "The < operator changes where a command's standard input comes from. With cat the result looks the same as passing the filename as an argument, but it shows how any command that reads stdin can be fed from a file.",
       "examples": [
        {
         "cmd": "cat < notes.txt",
         "note": "cat reads notes.txt through standard input.",
         "sim": true
        }
       ],
       "chapters": [
        6
       ]
      }
     ],
     "terms": [
      {
       "t": "Ctrl-D",
       "d": "Signals end of file (EOF) on standard input, telling a program like cat that input is finished.",
       "p": 54
      }
     ],
     "tasks": [
      {
       "id": "ch06.input.t1",
       "prompt": "Make a copy of foo.txt named bar.txt using only cat and redirection.",
       "hint": "cat FILE > NEWFILE",
       "solution": "cat foo.txt > bar.txt",
       "check": [
        {
         "t": "exists",
         "p": "~/bar.txt"
        },
        {
         "t": "content",
         "p": "~/bar.txt",
         "re": "foo"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch06.input.q1",
       "type": "mc",
       "cmd": "cat",
       "q": "What does cat do when run with no arguments?",
       "choices": [
        "Reads standard input until end of file",
        "Prints the current directory",
        "Shows an error and quits",
        "Lists all files"
       ],
       "answer": 0,
       "explain": "Without file arguments cat copies stdin (the keyboard) to stdout until Ctrl-D."
      },
      {
       "id": "ch06.input.q2",
       "type": "fill",
       "cmd": "redirect-in",
       "q": "Display notes.txt with cat, feeding the file through standard input.",
       "accept": [
        "cat < notes.txt"
       ]
      },
      {
       "id": "ch06.input.q3",
       "type": "mc",
       "cmd": "cat",
       "q": "Which key tells cat it has reached the end of keyboard input?",
       "choices": [
        "Ctrl-D",
        "Ctrl-C",
        "Ctrl-Z",
        "Ctrl-L"
       ],
       "answer": 0,
       "explain": "Ctrl-D signals end of file on standard input."
      }
     ]
    },
    {
     "id": "ch06.pipes",
     "title": "Pipelines and Filters",
     "intro": "The pipe operator joins the output of one command to the input of the next. Commands that take input, transform it, and pass it on are called filters.",
     "commands": [
      {
       "id": "pipe",
       "name": "|",
       "kind": "syntax",
       "summary": "Feed one command's standard output into another's standard input",
       "syntax": "command1 | command2",
       "explain": "A pipeline connects commands so that data flows from left to right without temporary files. Redirection with > connects a command to a file, while | connects a command to another command. Typing command > command2 by mistake can overwrite a program file, so treat > with care.",
       "examples": [
        {
         "cmd": "ls -l /usr/bin | less",
         "note": "Pages through a long listing one screen at a time.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "ls /bin /usr/bin | sort | less",
         "note": "Merges two directory listings into one sorted list.",
         "sim": true,
         "viz": "pipe"
        }
       ],
       "chapters": [
        6
       ]
      },
      {
       "id": "sort",
       "name": "sort",
       "kind": "cmd",
       "summary": "Sort lines of text",
       "syntax": "sort [file...]",
       "explain": "sort reads lines and writes them back out in order. It is a classic filter: placed in a pipeline it turns several separate lists into one sorted list.",
       "examples": [
        {
         "cmd": "cat fruits.txt | sort",
         "note": "Prints the fruit names in alphabetical order.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "ls /bin /usr/bin | sort",
         "note": "Combines both listings into a single sorted list.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "sort fruits.txt",
         "note": "Alphabetical order, duplicates kept.",
         "sim": true,
         "ch": 20
        },
        {
         "cmd": "sort -r fruits.txt",
         "note": "Reverse alphabetical order.",
         "sim": true,
         "ch": 20
        },
        {
         "cmd": "sort -u fruits.txt",
         "note": "Sorted with each fruit listed once.",
         "sim": true,
         "ch": 20
        },
        {
         "cmd": "sort -t ',' -k 2 -n data.csv",
         "note": "Comma-separated fields, sorted numerically on field 2 (age).",
         "sim": true,
         "ch": 20
        },
        {
         "cmd": "sort -t ':' -k 7 /etc/passwd | head",
         "note": "Sorts accounts by their shell, the seventh colon-separated field.",
         "sim": true,
         "viz": "pipe",
         "ch": 20
        },
        {
         "cmd": "du -s /usr/share/* | sort -nr | head",
         "out": "509940    /usr/share/locale-langpack\n242660    /usr/share/doc\n197560    /usr/share/fonts\n179144    /usr/share/gnome",
         "note": "Book output (partial): largest directories first.",
         "sim": false,
         "ch": 20
        },
        {
         "cmd": "sort --key=1,1 --key=2n distros.txt",
         "out": "Fedora    5           03/20/2006\nFedora    6           10/24/2006\nFedora    7           05/31/2007\nFedora    8           11/08/2007\nFedora    9           05/13/2008\nFedora    10          11/25/2008",
         "note": "Two keys: name alphabetically, then version numerically.",
         "sim": false,
         "ch": 20
        },
        {
         "cmd": "sort -k 3.7nbr -k 3.1nbr -k 3.4nbr distros.txt",
         "out": "Fedora    10          11/25/2008\nUbuntu    8.10        10/30/2008\nSUSE      11.0        06/19/2008\nFedora    9           05/13/2008",
         "note": "Keys inside the date field give newest releases first.",
         "sim": false,
         "ch": 20
        },
        {
         "cmd": "sort file1.txt file2.txt file3.txt > final_sorted_list.txt",
         "out": "",
         "note": "Combines several files into one sorted file.",
         "sim": false,
         "ch": 20
        }
       ],
       "chapters": [
        6,
        20
       ],
       "flags": [
        {
         "f": "-b",
         "long": "--ignore-leading-blanks",
         "d": "Skip leading spaces so comparison starts at the first non-blank character.",
         "p": 249,
         "ch": 20
        },
        {
         "f": "-f",
         "long": "--ignore-case",
         "d": "Sort without regard to letter case.",
         "p": 249,
         "ch": 20
        },
        {
         "f": "-n",
         "long": "--numeric-sort",
         "d": "Compare by numeric value instead of alphabetically.",
         "p": 249,
         "ch": 20
        },
        {
         "f": "-r",
         "long": "--reverse",
         "d": "Reverse the order so results run from highest to lowest.",
         "p": 249,
         "ch": 20
        },
        {
         "f": "-k",
         "long": "--key=field1[,field2]",
         "d": "Sort on a key running from field1 to field2 instead of the whole line.",
         "p": 249,
         "ch": 20
        },
        {
         "f": "-m",
         "long": "--merge",
         "d": "Merge files that are each already sorted, with no further sorting.",
         "p": 249,
         "ch": 20
        },
        {
         "f": "-o",
         "long": "--output=file",
         "d": "Write the sorted result to a file instead of standard output.",
         "p": 249,
         "ch": 20
        },
        {
         "f": "-t",
         "long": "--field-separator=char",
         "d": "Set the field separator character; spaces and tabs are the default.",
         "p": 249,
         "ch": 20
        },
        {
         "f": "-u",
         "d": "GNU sort: drop duplicate lines from the sorted output.",
         "p": 254,
         "ch": 20
        }
       ]
      },
      {
       "id": "uniq",
       "name": "uniq",
       "kind": "cmd",
       "summary": "Report or omit repeated lines",
       "syntax": "uniq [options] [file]",
       "explain": "uniq expects sorted input, from stdin or a single file, and by default drops duplicate lines. That is why it usually follows sort in a pipeline. With -d it shows only the lines that were repeated.",
       "flags": [
        {
         "f": "-d",
         "d": "Show only the lines that appear more than once instead of removing them.",
         "p": 57,
         "ch": 6
        },
        {
         "f": "-c",
         "long": "--count",
         "d": "Prefix each output line with how many times it occurred.",
         "p": 255,
         "ch": 20
        },
        {
         "f": "-f",
         "long": "--skip-fields=n",
         "d": "Skip the first n whitespace-separated fields when comparing (-f n); no custom separator.",
         "p": 255,
         "ch": 20
        },
        {
         "f": "-i",
         "long": "--ignore-case",
         "d": "Compare lines without regard to case.",
         "p": 255,
         "ch": 20
        },
        {
         "f": "-s",
         "long": "--skip-chars=n",
         "d": "Skip the first n characters of each line when comparing (-s n).",
         "p": 255,
         "ch": 20
        },
        {
         "f": "-u",
         "long": "--unique",
         "d": "Print only lines that have no duplicates.",
         "p": 255,
         "ch": 20
        }
       ],
       "examples": [
        {
         "cmd": "sort fruits.txt | uniq",
         "note": "Each fruit name appears once.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "sort fruits.txt | uniq -d",
         "note": "Lists only the fruits that occur more than once.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "ls /bin /usr/bin | sort | uniq | less",
         "note": "A program list with duplicates between the two directories removed.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "uniq fruits.txt",
         "note": "Nothing removed: no two identical lines are adjacent.",
         "sim": true,
         "ch": 20
        },
        {
         "cmd": "sort fruits.txt | uniq -c",
         "note": "Each fruit with its number of occurrences.",
         "sim": true,
         "viz": "pipe",
         "ch": 20
        },
        {
         "cmd": "sort fruits.txt | uniq -u",
         "note": "Only fruits that appear exactly once.",
         "sim": true,
         "viz": "pipe",
         "ch": 20
        }
       ],
       "chapters": [
        6,
        20
       ]
      },
      {
       "id": "wc",
       "name": "wc",
       "kind": "cmd",
       "summary": "Count lines, words, and bytes",
       "syntax": "wc [options] [file...]",
       "explain": "wc prints three numbers for each file: lines, words, and bytes. Without file arguments it counts standard input, which makes it a quick counter at the end of a pipeline. The -l option reports only the line count.",
       "flags": [
        {
         "f": "-l",
         "d": "Report only the number of lines.",
         "p": 57,
         "ch": 6
        }
       ],
       "examples": [
        {
         "cmd": "wc notes.txt",
         "note": "Shows line, word, and byte counts followed by the filename.",
         "sim": true
        },
        {
         "cmd": "ls /bin /usr/bin | sort | uniq | wc -l",
         "note": "Counts how many distinct program names were found.",
         "sim": true,
         "viz": "pipe"
        }
       ],
       "chapters": [
        6
       ]
      }
     ],
     "terms": [
      {
       "t": "filter",
       "d": "A command used in a pipeline that takes input, changes it in some way, and outputs the result.",
       "p": 55
      },
      {
       "t": "> vs |",
       "d": "> connects a command to a file; | connects a command to another command's input.",
       "p": 56
      }
     ],
     "tasks": [
      {
       "id": "ch06.pipes.t1",
       "prompt": "Use a pipeline to count the lines in fruits.txt.",
       "hint": "cat FILE | wc -l",
       "solution": "cat fruits.txt | wc -l",
       "check": [
        {
         "t": "cmd",
         "re": "\\|\\s*wc\\s+-l"
        },
        {
         "t": "out",
         "re": "7"
        }
       ]
      },
      {
       "id": "ch06.pipes.t2",
       "prompt": "Print each fruit in fruits.txt once, in sorted order.",
       "hint": "sort first, then remove duplicates",
       "solution": "sort fruits.txt | uniq",
       "check": [
        {
         "t": "cmd",
         "re": "uniq"
        },
        {
         "t": "out",
         "re": "apple\\nbanana\\ncherry\\ndate"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch06.pipes.q1",
       "type": "mc",
       "cmd": "uniq",
       "q": "Why is uniq usually placed after sort?",
       "choices": [
        "It only removes duplicates that sit next to each other in sorted data",
        "It cannot read files",
        "sort deletes duplicates first",
        "uniq only works on numbers"
       ],
       "answer": 0,
       "explain": "uniq works on a sorted list, where repeated lines are adjacent."
      },
      {
       "id": "ch06.pipes.q2",
       "type": "output",
       "cmd": "uniq",
       "q": "Given fruits.txt (banana apple cherry apple banana date apple, one per line), which command printed this?",
       "out": "apple\nbanana",
       "choices": [
        "sort fruits.txt | uniq -d",
        "sort fruits.txt | uniq",
        "sort fruits.txt",
        "uniq fruits.txt"
       ],
       "answer": 0
      },
      {
       "id": "ch06.pipes.q3",
       "type": "fill",
       "cmd": "wc",
       "q": "Count the lines produced by ls /usr/bin.",
       "accept": [
        "ls /usr/bin | wc -l"
       ]
      },
      {
       "id": "ch06.pipes.q4",
       "type": "order",
       "cmd": "pipe",
       "q": "Build: list /bin and /usr/bin, sort, drop duplicates, and page the result",
       "parts": [
        "ls /bin /usr/bin",
        "|",
        "sort",
        "|",
        "uniq",
        "|",
        "less"
       ]
      }
     ]
    },
    {
     "id": "ch06.grep",
     "title": "Finding Text with grep",
     "intro": "grep prints the lines that contain a pattern. For now the patterns are plain text; regular expressions come later.",
     "commands": [
      {
       "id": "grep",
       "name": "grep",
       "kind": "cmd",
       "summary": "Print lines matching a pattern",
       "syntax": "grep [options] pattern [file...]",
       "explain": "grep scans its input and prints every line that contains the pattern. It reads files named on the command line or, inside a pipeline, standard input. Matching is case sensitive unless you add -i, and -v flips the logic to show non-matching lines.",
       "flags": [
        {
         "f": "-i",
         "d": "Ignore upper and lower case differences while matching.",
         "p": 58,
         "ch": 6
        },
        {
         "f": "-v",
         "d": "Invert the match: print only lines that do not contain the pattern.",
         "p": 58,
         "ch": 6
        },
        {
         "f": "-c",
         "long": "--count",
         "d": "Print how many lines matched (or failed to, with -v) instead of the lines.",
         "p": 226,
         "ch": 19
        },
        {
         "f": "-l",
         "long": "--files-with-matches",
         "d": "List only the names of files that hold at least one match.",
         "p": 226,
         "ch": 19
        },
        {
         "f": "-L",
         "long": "--files-without-match",
         "d": "List only the names of files with no match at all.",
         "p": 227,
         "ch": 19
        },
        {
         "f": "-n",
         "long": "--line-number",
         "d": "Put each matching line's line number in front of it.",
         "p": 227,
         "ch": 19
        },
        {
         "f": "-h",
         "long": "--no-filename",
         "d": "In a multi-file search, leave the filename prefix off each line.",
         "p": 227,
         "ch": 19
        },
        {
         "f": "-E",
         "d": "Use extended regular expressions, so ( ) { } ? + | act as metacharacters.",
         "p": 235,
         "ch": 19
        }
       ],
       "examples": [
        {
         "cmd": "grep error error.txt",
         "note": "Shows the two lines that mention error.",
         "sim": true,
         "viz": "scan"
        },
        {
         "cmd": "grep -v error error.txt",
         "note": "Shows the one line that does not mention error.",
         "sim": true,
         "viz": "scan"
        },
        {
         "cmd": "ls /bin /usr/bin | sort | uniq | grep zip",
         "out": "bunzip2\nbzip2\ngunzip\ngzip\nunzip\nzip\nzipcloak",
         "note": "Finds program names that contain zip, hinting at compression tools.",
         "sim": false
        },
        {
         "cmd": "grep -n apple fruits.txt",
         "note": "Each apple line comes out with its line number in front.",
         "sim": true,
         "viz": "scan",
         "ch": 19
        },
        {
         "cmd": "grep -c apple fruits.txt",
         "note": "Prints a count of matching lines rather than the lines.",
         "sim": true,
         "viz": "scan",
         "ch": 19
        },
        {
         "cmd": "grep -v apple fruits.txt",
         "note": "Inverts the match: every line without apple.",
         "sim": true,
         "viz": "scan",
         "ch": 19
        },
        {
         "cmd": "grep -l apple fruits.txt notes.txt data.csv",
         "note": "Reports just the names of the files where apple occurs.",
         "sim": true,
         "viz": "scan",
         "ch": 19
        },
        {
         "cmd": "grep -L bzip dirlist*.txt",
         "out": "dirlist-sbin.txt\ndirlist-usr-bin.txt\ndirlist-usr-sbin.txt",
         "note": "Book example: the files in which bzip never appears.",
         "sim": false,
         "ch": 19
        },
        {
         "cmd": "grep -Ev '^\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}$' phonelist.txt",
         "out": "(292) 108-518\n(129) 44-1379",
         "note": "Validates a phone list: -v shows only numbers that break the anchored pattern.",
         "sim": false,
         "ch": 19
        }
       ],
       "chapters": [
        6,
        19
       ]
      }
     ],
     "terms": [],
     "tasks": [
      {
       "id": "ch06.grep.t1",
       "prompt": "Show the lines of error.txt that contain the word error, ignoring case.",
       "hint": "grep has an option to ignore case",
       "solution": "grep -i error error.txt",
       "check": [
        {
         "t": "cmd",
         "re": "^grep\\s+-i\\s+error\\s+error\\.txt"
        },
        {
         "t": "out",
         "re": "error"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch06.grep.q1",
       "type": "mc",
       "cmd": "grep",
       "q": "Which grep option prints only lines that do NOT match?",
       "choices": [
        "-v",
        "-i",
        "-n",
        "-d"
       ],
       "answer": 0,
       "explain": "-v inverts the match."
      },
      {
       "id": "ch06.grep.q2",
       "type": "fill",
       "cmd": "grep",
       "q": "Search notes.txt for linux in any letter case.",
       "accept": [
        "grep -i linux notes.txt"
       ]
      },
      {
       "id": "ch06.grep.q3",
       "type": "output",
       "cmd": "grep",
       "q": "Which pipeline produced this list of program names?",
       "out": "bunzip2\nbzip2\ngunzip\ngzip\nunzip\nzip",
       "choices": [
        "ls /bin /usr/bin | sort | uniq | grep zip",
        "ls /bin /usr/bin | sort | uniq -d",
        "ls /usr/bin | tail -n 5",
        "ls /bin /usr/bin | wc -l"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch06.headtail",
     "title": "head, tail, and tee",
     "intro": "head and tail trim output to its first or last lines. tee copies a pipeline's data into a file while letting it keep flowing.",
     "commands": [
      {
       "id": "head",
       "name": "head",
       "kind": "cmd",
       "summary": "Output the first part of a file",
       "syntax": "head [-n count] [file...]",
       "explain": "head prints the first 10 lines of its input unless told otherwise. Use -n to choose a different number of lines. It works on files or as a filter in a pipeline.",
       "flags": [
        {
         "f": "-n",
         "d": "Set how many lines to print instead of the default 10.",
         "p": 58,
         "ch": 6
        }
       ],
       "examples": [
        {
         "cmd": "head -n 2 fruits.txt",
         "note": "Prints just the first two lines.",
         "sim": true
        },
        {
         "cmd": "head -n 5 ls-output.txt",
         "out": "total 343496\n-rwxr-xr-x 1 root root       31316 2017-12-05 08:58 [\n-rwxr-xr-x 1 root root        8240 2017-12-09 13:39 411toppm",
         "note": "Shows the top of a saved listing.",
         "sim": false
        }
       ],
       "chapters": [
        6
       ]
      },
      {
       "id": "tail",
       "name": "tail",
       "kind": "cmd",
       "summary": "Output the last part of a file",
       "syntax": "tail [-n count] [-f] [file...]",
       "explain": "tail prints the last 10 lines by default, and -n changes the count. With -f it keeps the file open and shows new lines as they are appended, which is ideal for watching log files. Press Ctrl-C to stop following.",
       "flags": [
        {
         "f": "-n",
         "d": "Set how many lines to print from the end instead of the default 10.",
         "p": 58,
         "ch": 6
        },
        {
         "f": "-f",
         "d": "Keep watching the file and print new lines as they are added, until Ctrl-C.",
         "p": 59,
         "ch": 6
        }
       ],
       "examples": [
        {
         "cmd": "tail -n 3 fruits.txt",
         "note": "Prints the final three lines.",
         "sim": true
        },
        {
         "cmd": "ls /usr/bin | tail -n 5",
         "note": "Shows the last five names in the listing.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "tail -f /var/log/messages",
         "out": "Feb  8 13:40:05 twin4 dhclient: DHCPACK from 192.168.1.1",
         "note": "Follows a log in real time; may need superuser rights.",
         "sim": false
        }
       ],
       "chapters": [
        6
       ]
      },
      {
       "id": "tee",
       "name": "tee",
       "kind": "cmd",
       "summary": "Copy standard input to standard output and to files",
       "syntax": "tee file...",
       "explain": "tee works like a T-shaped fitting in a pipe. It writes what it reads both to one or more files and onward to standard output, so the pipeline continues. This lets you save a snapshot of the data at a middle stage of processing.",
       "examples": [
        {
         "cmd": "ls /usr/bin | tee ls.txt | grep zip",
         "note": "Saves the full listing in ls.txt, then shows only names containing zip.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "sort fruits.txt | tee sorted.txt | uniq",
         "note": "Keeps the sorted list in sorted.txt and prints the de-duplicated version.",
         "sim": true,
         "viz": "pipe"
        }
       ],
       "chapters": [
        6
       ]
      }
     ],
     "terms": [],
     "tasks": [
      {
       "id": "ch06.headtail.t1",
       "prompt": "Show only the first two lines of fruits.txt.",
       "hint": "head -n N FILE",
       "solution": "head -n 2 fruits.txt",
       "check": [
        {
         "t": "cmd",
         "re": "^head"
        },
        {
         "t": "out",
         "re": "^banana\\napple\\s*$"
        }
       ]
      },
      {
       "id": "ch06.headtail.t2",
       "prompt": "Sort fruits.txt, save the sorted list to sorted.txt with tee, and pass it on to uniq.",
       "hint": "sort FILE | tee FILE | uniq",
       "solution": "sort fruits.txt | tee sorted.txt | uniq",
       "check": [
        {
         "t": "exists",
         "p": "~/sorted.txt"
        },
        {
         "t": "content",
         "p": "~/sorted.txt",
         "re": "^apple\\napple\\napple\\nbanana"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch06.headtail.q1",
       "type": "mc",
       "cmd": "tail",
       "q": "Which tail option keeps printing new lines as a log file grows?",
       "choices": [
        "-f",
        "-n",
        "-v",
        "-d"
       ],
       "answer": 0,
       "explain": "-f follows the file until you press Ctrl-C."
      },
      {
       "id": "ch06.headtail.q2",
       "type": "fill",
       "cmd": "head",
       "q": "Print the first 5 lines of ls-output.txt.",
       "accept": [
        "head -n 5 ls-output.txt"
       ]
      },
      {
       "id": "ch06.headtail.q3",
       "type": "mc",
       "cmd": "tee",
       "q": "What does tee add to a pipeline?",
       "choices": [
        "Writes the data to a file while passing it along",
        "Sorts the data",
        "Counts the lines",
        "Discards errors"
       ],
       "answer": 0,
       "explain": "tee copies stdin to stdout and to files."
      },
      {
       "id": "ch06.headtail.q4",
       "type": "order",
       "cmd": "tee",
       "q": "Build: list /usr/bin, save it to ls.txt, and show only zip names",
       "parts": [
        "ls /usr/bin",
        "|",
        "tee",
        "ls.txt",
        "|",
        "grep",
        "zip"
       ]
      }
     ]
    }
   ]
  },
  {
   "id": "ch07",
   "n": 7,
   "part": 1,
   "title": "Seeing the World as the Shell Sees It",
   "summary": "How bash expands and quotes the command line before running it",
   "lessons": [
    {
     "id": "ch07.echo",
     "title": "echo and Pathname Expansion",
     "intro": "Before running a command, bash rewrites the line through a process called expansion. echo is the easiest way to see the rewritten result.",
     "commands": [
      {
       "id": "echo",
       "name": "echo",
       "kind": "builtin",
       "summary": "Display a line of text",
       "syntax": "echo [-e] [string...]",
       "explain": "echo is a shell builtin that prints its arguments on standard output. Because the shell expands the command line first, echo only ever sees the finished result, which makes it a perfect tool for exploring expansion. With -e it also interprets backslash escape sequences such as \\t and \\a.",
       "flags": [
        {
         "f": "-e",
         "d": "Turn on interpretation of backslash escape sequences like \\n, \\t, and \\a.",
         "p": 71,
         "ch": 7
        }
       ],
       "examples": [
        {
         "cmd": "echo this is a test",
         "note": "Arguments are printed as given.",
         "sim": true
        },
        {
         "cmd": "echo *",
         "note": "The shell replaces * with the filenames in the current directory before echo runs.",
         "sim": true
        },
        {
         "cmd": "echo -e \"Name\\tCity\"",
         "note": "-e turns \\t into a real tab.",
         "sim": true
        },
        {
         "cmd": "echo $HOME",
         "note": "Expansion turns $HOME into its value before echo prints it.",
         "sim": true,
         "ch": 11
        }
       ],
       "chapters": [
        7,
        11
       ]
      },
      {
       "id": "path-exp",
       "name": "*",
       "kind": "syntax",
       "summary": "Pathname expansion: wildcards turn into matching filenames",
       "syntax": "echo pattern",
       "explain": "Wildcards work through pathname expansion: the shell replaces the pattern with the names that match it. Hidden files are skipped by *, and .* also matches . and .., so a pattern like .[!.]* is a better way to catch most hidden files.",
       "examples": [
        {
         "cmd": "echo D*",
         "note": "Expands to names starting with D.",
         "sim": true
        },
        {
         "cmd": "echo *s",
         "note": "Expands to names ending in s.",
         "sim": true
        },
        {
         "cmd": "echo [[:upper:]]*",
         "note": "Expands to names beginning with an uppercase letter.",
         "sim": true
        },
        {
         "cmd": "echo .[!.]*",
         "note": "Matches names that start with exactly one period, i.e. most hidden files.",
         "sim": true
        },
        {
         "cmd": "echo /usr/*/share",
         "out": "/usr/kerberos/share /usr/local/share",
         "note": "Wildcards also work inside longer paths.",
         "sim": false
        }
       ],
       "chapters": [
        7
       ]
      },
      {
       "id": "tilde-exp",
       "name": "~",
       "kind": "syntax",
       "summary": "Tilde expansion: ~ becomes a home directory path",
       "syntax": "~   |   ~user",
       "explain": "A tilde at the start of a word is replaced by the current user's home directory. Followed by a username, it becomes that user's home directory instead.",
       "examples": [
        {
         "cmd": "echo ~",
         "note": "Prints your home directory.",
         "sim": true
        },
        {
         "cmd": "echo ~foo",
         "out": "/home/foo",
         "note": "Prints the home directory of user foo, if that account exists.",
         "sim": false
        }
       ],
       "chapters": [
        7
       ]
      }
     ],
     "terms": [
      {
       "t": "expansion",
       "d": "The shell rewriting parts of a command line, such as wildcards, into something else before the command runs.",
       "p": 61
      },
      {
       "t": ".[!.]*",
       "d": "Pattern for names that begin with one period followed by other characters; catches most hidden files.",
       "p": 63
      }
     ],
     "tasks": [
      {
       "id": "ch07.echo.t1",
       "prompt": "Use echo and a wildcard to print every name in the current directory that starts with a capital P.",
       "hint": "echo P*",
       "solution": "echo P*",
       "check": [
        {
         "t": "cmd",
         "re": "^echo\\s+P\\*"
        },
        {
         "t": "out",
         "re": "Pictures"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch07.echo.q1",
       "type": "mc",
       "cmd": "path-exp",
       "q": "When you run echo *, who turns * into filenames?",
       "choices": [
        "The shell, before echo runs",
        "echo itself",
        "The ls command",
        "The kernel"
       ],
       "answer": 0,
       "explain": "Pathname expansion happens in the shell; echo only sees the result."
      },
      {
       "id": "ch07.echo.q2",
       "type": "mc",
       "cmd": "path-exp",
       "q": "Why is echo .* a poor way to list hidden files?",
       "choices": [
        "It also matches . and ..",
        "It matches nothing",
        "It only works as root",
        "It prints file contents"
       ],
       "answer": 0,
       "explain": ". and .. refer to the current and parent directories."
      },
      {
       "id": "ch07.echo.q3",
       "type": "fill",
       "cmd": "tilde-exp",
       "q": "Print your home directory using tilde expansion.",
       "accept": [
        "echo ~"
       ]
      }
     ]
    },
    {
     "id": "ch07.arith-brace",
     "title": "Arithmetic and Brace Expansion",
     "intro": "The shell can do integer math with $(( )) and can generate lists of strings from brace patterns.",
     "commands": [
      {
       "id": "arith-exp",
       "name": "$(( ))",
       "kind": "syntax",
       "summary": "Arithmetic expansion: evaluate an integer expression",
       "syntax": "$((expression))",
       "explain": "Arithmetic expansion replaces $((expression)) with the computed result, turning the prompt into a calculator. Only whole numbers are supported, so division drops any remainder. Spaces inside are optional, expressions can be nested, and single parentheses group subexpressions.",
       "examples": [
        {
         "cmd": "echo $((2 + 2))",
         "note": "Prints 4.",
         "sim": true
        },
        {
         "cmd": "echo $(((5**2) * 3))",
         "note": "Five squared, times three: 75.",
         "sim": true
        },
        {
         "cmd": "echo Five divided by two equals $((5/2))",
         "note": "Integer division gives 2.",
         "sim": true
        },
        {
         "cmd": "echo with $((5%2)) left over.",
         "note": "The modulo operator gives the remainder, 1.",
         "sim": true
        },
        {
         "cmd": "echo $(($((5**2)) * 3))",
         "out": "75",
         "note": "Nested expansions produce the same answer.",
         "sim": false
        }
       ],
       "chapters": [
        7
       ]
      },
      {
       "id": "brace-exp",
       "name": "{ }",
       "kind": "syntax",
       "summary": "Brace expansion: build many strings from one pattern",
       "syntax": "preamble{a,b,c}postscript   |   {start..end}",
       "explain": "Brace expansion creates several words from a pattern. Inside the braces you give either a comma-separated list or a range of integers or single letters, optionally with text before (preamble) and after (postscript). The pattern must not contain unquoted spaces, and braces can be nested. A common use is making a whole set of directories at once.",
       "examples": [
        {
         "cmd": "echo Front-{A,B,C}-Back",
         "note": "Three words, each with the same preamble and postscript.",
         "sim": true
        },
        {
         "cmd": "echo Number_{1..5}",
         "note": "An integer range.",
         "sim": true
        },
        {
         "cmd": "echo {01..15}",
         "out": "01 02 03 04 05 06 07 08 09 10 11 12 13 14 15",
         "note": "bash 4.0 and newer can zero-pad ranges.",
         "sim": false
        },
        {
         "cmd": "echo {Z..A}",
         "out": "Z Y X W V U T S R Q P O N M L K J I H G F E D C B A",
         "note": "Letter ranges can run backward.",
         "sim": false
        },
        {
         "cmd": "echo a{A{1,2},B{3,4}}b",
         "out": "aA1b aA2b aB3b aB4b",
         "note": "Brace expressions can be nested.",
         "sim": false
        },
        {
         "cmd": "mkdir {2007..2009}-{01..12}",
         "out": "",
         "note": "Creates 36 Year-Month directories that sort chronologically.",
         "sim": false
        }
       ],
       "chapters": [
        7
       ]
      }
     ],
     "terms": [
      {
       "t": "+",
       "d": "Arithmetic operator: addition.",
       "p": 64
      },
      {
       "t": "-",
       "d": "Arithmetic operator: subtraction.",
       "p": 64
      },
      {
       "t": "*",
       "d": "Arithmetic operator: multiplication.",
       "p": 64
      },
      {
       "t": "/",
       "d": "Arithmetic operator: division. Results are whole numbers only.",
       "p": 64
      },
      {
       "t": "%",
       "d": "Arithmetic operator: modulo, the remainder after division.",
       "p": 64
      },
      {
       "t": "**",
       "d": "Arithmetic operator: exponentiation (raise to a power).",
       "p": 64
      },
      {
       "t": "preamble / postscript",
       "d": "The text before and after a brace expression; it is attached to every generated word.",
       "p": 65
      }
     ],
     "tasks": [
      {
       "id": "ch07.arith-brace.t1",
       "prompt": "Use arithmetic expansion to print the result of 7 times 6.",
       "hint": "echo $((a * b))",
       "solution": "echo $((7 * 6))",
       "check": [
        {
         "t": "cmd",
         "re": "\\$\\(\\("
        },
        {
         "t": "out",
         "re": "^42"
        }
       ]
      },
      {
       "id": "ch07.arith-brace.t2",
       "prompt": "Inside playground, create directories dir-1, dir-2, and dir-3 with one mkdir and a brace range.",
       "hint": "mkdir playground/dir-{1..3}",
       "solution": "mkdir playground/dir-{1..3}",
       "check": [
        {
         "t": "isdir",
         "p": "~/playground/dir-1"
        },
        {
         "t": "isdir",
         "p": "~/playground/dir-2"
        },
        {
         "t": "isdir",
         "p": "~/playground/dir-3"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch07.arith-brace.q1",
       "type": "output",
       "cmd": "arith-exp",
       "q": "Which command produced this output?",
       "out": "2",
       "choices": [
        "echo $((5/2))",
        "echo $((5%2))",
        "echo $((5**2))",
        "echo $((5-2))"
       ],
       "answer": 0
      },
      {
       "id": "ch07.arith-brace.q2",
       "type": "mc",
       "cmd": "arith-exp",
       "q": "Which operator gives the remainder of a division?",
       "choices": [
        "%",
        "/",
        "**",
        "*"
       ],
       "answer": 0,
       "explain": "% is modulo."
      },
      {
       "id": "ch07.arith-brace.q3",
       "type": "output",
       "cmd": "brace-exp",
       "q": "Which command produced this output?",
       "out": "Front-A-Back Front-B-Back Front-C-Back",
       "choices": [
        "echo Front-{A,B,C}-Back",
        "echo Front-[ABC]-Back",
        "echo Front-{A..C}",
        "echo 'Front-{A,B,C}-Back'"
       ],
       "answer": 0
      },
      {
       "id": "ch07.arith-brace.q4",
       "type": "order",
       "cmd": "brace-exp",
       "q": "Build: print Number_1 through Number_5",
       "parts": [
        "echo",
        "Number_{1..5}"
       ]
      }
     ]
    },
    {
     "id": "ch07.param-subst",
     "title": "Parameter Expansion and Command Substitution",
     "intro": "Variables expand with $NAME, and the output of a whole command can be dropped into another command line with $( ).",
     "commands": [
      {
       "id": "param-exp",
       "name": "$VAR",
       "kind": "syntax",
       "summary": "Parameter expansion: replace $NAME with a variable's value",
       "syntax": "$NAME",
       "explain": "Variables are small named pieces of data the system keeps, such as USER, which holds your username. Writing $USER makes the shell substitute its value. Unlike other expansions, a misspelled variable name does not stay as typed; it quietly expands to an empty string.",
       "examples": [
        {
         "cmd": "echo $USER",
         "note": "Prints your username.",
         "sim": true
        },
        {
         "cmd": "echo $SUER",
         "note": "A typo expands to nothing, so an empty line is printed.",
         "sim": true
        },
        {
         "cmd": "printenv | less",
         "note": "Browse the list of available variables.",
         "sim": true,
         "viz": "pipe"
        }
       ],
       "chapters": [
        7
       ]
      },
      {
       "id": "cmd-subst",
       "name": "$( )",
       "kind": "syntax",
       "summary": "Command substitution: use a command's output as part of the line",
       "syntax": "$(command)   |   `command`",
       "explain": "Command substitution runs a command and puts its output into the command line. Whole pipelines can go inside. Older shells used backquotes for the same job, and bash still accepts that form.",
       "examples": [
        {
         "cmd": "echo $(ls)",
         "note": "The listing becomes echo's arguments.",
         "sim": true
        },
        {
         "cmd": "ls -l $(which cp)",
         "note": "Lists the cp program without knowing its full path.",
         "sim": true
        },
        {
         "cmd": "ls -l `which cp`",
         "note": "The same thing using the older backquote syntax.",
         "sim": true
        },
        {
         "cmd": "file $(ls -d /usr/bin/* | grep zip)",
         "out": "/usr/bin/bunzip2:      symbolic link to `bzip2'\n/usr/bin/gzip:         symbolic link to `../../bin/gzip'",
         "note": "A pipeline's output becomes file's argument list.",
         "sim": false
        }
       ],
       "chapters": [
        7
       ]
      }
     ],
     "terms": [
      {
       "t": "USER",
       "d": "Variable that holds your username.",
       "p": 66
      },
      {
       "t": "`command`",
       "d": "Backquote form of command substitution, from older shells and still supported by bash.",
       "p": 67
      }
     ],
     "tasks": [
      {
       "id": "ch07.param-subst.t1",
       "prompt": "Write the line \"I am\" followed by your username into me.txt, using parameter expansion.",
       "hint": "echo \"I am $USER\" > FILE",
       "solution": "echo \"I am $USER\" > me.txt",
       "check": [
        {
         "t": "content",
         "p": "~/me.txt",
         "re": "I am me"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch07.param-subst.q1",
       "type": "mc",
       "cmd": "param-exp",
       "q": "What does echo $SUER print if no variable SUER exists?",
       "choices": [
        "An empty line",
        "$SUER",
        "An error message",
        "Your username"
       ],
       "answer": 0,
       "explain": "Unknown variables expand to an empty string."
      },
      {
       "id": "ch07.param-subst.q2",
       "type": "fill",
       "cmd": "cmd-subst",
       "q": "Long-list the cp program by substituting the output of which cp (use the $( ) form).",
       "accept": [
        "ls -l $(which cp)"
       ]
      },
      {
       "id": "ch07.param-subst.q3",
       "type": "mc",
       "cmd": "cmd-subst",
       "q": "Which is the older alternative syntax for $(command)?",
       "choices": [
        "`command`",
        "${command}",
        "$((command))",
        "'command'"
       ],
       "answer": 0,
       "explain": "Backquotes do the same job."
      }
     ]
    },
    {
     "id": "ch07.quoting",
     "title": "Quoting and Escaping",
     "intro": "Quoting lets you switch off expansions you do not want. Double quotes block some, single quotes block all, and a backslash protects one character.",
     "commands": [
      {
       "id": "double-quote",
       "name": "\"...\"",
       "kind": "syntax",
       "summary": "Double quotes: stop word splitting and most expansions",
       "syntax": "\"text\"",
       "explain": "Inside double quotes, word splitting, pathname, tilde, and brace expansion are turned off, so spaces stay inside one argument. The characters $, \\, and ` keep their meaning, so variables, $(( )) math, and $( ) substitution are still expanded. Quoting a command substitution also preserves its newlines.",
       "examples": [
        {
         "cmd": "echo this is a     test",
         "note": "Word splitting collapses the extra spaces.",
         "sim": true
        },
        {
         "cmd": "echo \"this is a     test\"",
         "note": "The spaces survive because the text is one argument.",
         "sim": true
        },
        {
         "cmd": "echo \"$USER $((2+2)) $(cal)\"",
         "note": "Variables, math, and substitution still expand inside double quotes.",
         "sim": true
        },
        {
         "cmd": "ls -l \"two words.txt\"",
         "out": "-rw-rw-r-- 1 me   me   18 2018-02-20 13:03 two words.txt",
         "note": "A filename with a space is passed as a single argument.",
         "sim": false
        }
       ],
       "chapters": [
        7
       ]
      },
      {
       "id": "single-quote",
       "name": "'...'",
       "kind": "syntax",
       "summary": "Single quotes: suppress every expansion",
       "syntax": "'text'",
       "explain": "Single quotes turn off all expansions, so the text is passed exactly as typed. Comparing unquoted, double-quoted, and single-quoted versions of the same line shows each level hiding more expansions.",
       "examples": [
        {
         "cmd": "echo text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER",
         "note": "Unquoted: everything expands.",
         "sim": true
        },
        {
         "cmd": "echo \"text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER\"",
         "note": "Double quotes: only substitution, math, and variables expand.",
         "sim": true
        },
        {
         "cmd": "echo 'text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER'",
         "note": "Single quotes: nothing expands.",
         "sim": true
        }
       ],
       "chapters": [
        7
       ]
      },
      {
       "id": "escape",
       "name": "\\",
       "kind": "syntax",
       "summary": "Backslash escape: quote a single character",
       "syntax": "\\char",
       "explain": "A backslash in front of a character removes its special meaning. It is often used inside double quotes to block one expansion, or to put characters like $, !, &, or spaces in filenames. Type \\\\ to get a literal backslash; inside single quotes a backslash is just an ordinary character.",
       "examples": [
        {
         "cmd": "echo \"The balance for user $USER is: \\$5.00\"",
         "note": "$USER expands but \\$5 stays literal.",
         "sim": true
        },
        {
         "cmd": "echo The total is $100.00",
         "note": "Without escaping, $1 expands to nothing and you get 00.00.",
         "sim": true
        },
        {
         "cmd": "mv bad\\&filename good_filename",
         "out": "",
         "note": "Escaping & lets the shell treat it as part of the filename.",
         "sim": false
        }
       ],
       "chapters": [
        7
       ]
      },
      {
       "id": "ansi-quote",
       "name": "$' '",
       "kind": "syntax",
       "summary": "Write backslash escape sequences without echo -e",
       "syntax": "$'\\code'",
       "explain": "Besides being the escape character, the backslash starts codes for control characters such as tab and newline. You can enable them with echo -e or by placing them inside $' '.",
       "examples": [
        {
         "cmd": "sleep 10; echo -e \"Time's up\\a\"",
         "out": "Time's up",
         "note": "A crude countdown timer that beeps after 10 seconds.",
         "sim": false
        },
        {
         "cmd": "sleep 10; echo \"Time's up\" $'\\a'",
         "out": "Time's up",
         "note": "The same beep written with $' '.",
         "sim": false
        }
       ],
       "chapters": [
        7
       ]
      }
     ],
     "terms": [
      {
       "t": "word splitting",
       "d": "Unquoted spaces, tabs, and newlines separate words into separate arguments instead of being part of the text.",
       "p": 69
      },
      {
       "t": "escape character",
       "d": "The backslash, when used to cancel the special meaning of the next character.",
       "p": 70
      },
      {
       "t": "\\a",
       "d": "Escape sequence for bell: makes the computer beep.",
       "p": 70
      },
      {
       "t": "\\b",
       "d": "Escape sequence for backspace.",
       "p": 70
      },
      {
       "t": "\\n",
       "d": "Escape sequence for newline (a line feed on Unix-like systems).",
       "p": 70
      },
      {
       "t": "\\r",
       "d": "Escape sequence for carriage return.",
       "p": 70
      },
      {
       "t": "\\t",
       "d": "Escape sequence for tab.",
       "p": 70
      }
     ],
     "tasks": [
      {
       "id": "ch07.quoting.t1",
       "prompt": "Create a file literally named two words.txt containing the word hi.",
       "hint": "Quote the filename so the space is kept",
       "solution": "echo hi > \"two words.txt\"",
       "check": [
        {
         "t": "exists",
         "p": "~/two words.txt"
        },
        {
         "t": "absent",
         "p": "~/two"
        }
       ]
      },
      {
       "id": "ch07.quoting.t2",
       "prompt": "Print the text $USER literally, without expanding it.",
       "hint": "Single quotes block every expansion",
       "solution": "echo '$USER'",
       "check": [
        {
         "t": "out",
         "re": "^\\$USER\\s*$"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch07.quoting.q1",
       "type": "mc",
       "cmd": "double-quote",
       "q": "Which expansion still happens inside double quotes?",
       "choices": [
        "Command substitution",
        "Pathname expansion",
        "Brace expansion",
        "Tilde expansion"
       ],
       "answer": 0,
       "explain": "$, \\ and ` keep their meaning, so parameter, arithmetic, and command substitution still run."
      },
      {
       "id": "ch07.quoting.q2",
       "type": "output",
       "cmd": "single-quote",
       "q": "Which command produced this output?",
       "out": "text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER",
       "choices": [
        "echo 'text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER'",
        "echo \"text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER\"",
        "echo text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER",
        "echo -e text"
       ],
       "answer": 0
      },
      {
       "id": "ch07.quoting.q3",
       "type": "fill",
       "cmd": "escape",
       "q": "Print: Price: $5 (escape the dollar sign inside double quotes).",
       "accept": [
        "echo \"Price: \\$5\""
       ]
      },
      {
       "id": "ch07.quoting.q4",
       "type": "mc",
       "cmd": "echo",
       "q": "Which escape sequence produces a tab?",
       "choices": [
        "\\t",
        "\\a",
        "\\b",
        "\\r"
       ],
       "answer": 0,
       "explain": "\\t is tab; \\a is bell, \\b backspace, \\r carriage return."
      }
     ]
    }
   ]
  },
  {
   "id": "ch08",
   "n": 8,
   "part": 1,
   "title": "Advanced Keyboard Tricks",
   "summary": "Readline editing keys, Tab completion, and command history shortcuts",
   "lessons": [
    {
     "id": "ch08.editing",
     "title": "Command Line Editing",
     "intro": "bash uses the Readline library to let you move around and fix a command line without touching the mouse. Pick the keys you find useful; nobody needs all of them.",
     "commands": [
      {
       "id": "clear",
       "name": "clear",
       "kind": "cmd",
       "summary": "Clear the terminal screen",
       "syntax": "clear",
       "explain": "clear wipes the terminal and puts the cursor back in the top-left corner. Pressing Ctrl-L does the same thing without typing a command.",
       "examples": [
        {
         "cmd": "clear",
         "note": "Empties the screen.",
         "sim": true
        }
       ],
       "chapters": [
        8
       ]
      }
     ],
     "terms": [
      {
       "t": "Readline",
       "d": "The shared library bash uses to provide command line editing.",
       "p": 74
      },
      {
       "t": "Ctrl-a",
       "d": "Jump to the start of the line.",
       "p": 74
      },
      {
       "t": "Ctrl-e",
       "d": "Jump to the end of the line.",
       "p": 74
      },
      {
       "t": "Ctrl-f",
       "d": "Move forward one character, like the right arrow.",
       "p": 74
      },
      {
       "t": "Ctrl-b",
       "d": "Move back one character, like the left arrow.",
       "p": 74
      },
      {
       "t": "Alt-f",
       "d": "Move forward one word.",
       "p": 74
      },
      {
       "t": "Alt-b",
       "d": "Move back one word.",
       "p": 74
      },
      {
       "t": "Ctrl-l",
       "d": "Clear the screen and put the cursor at the top-left; same as the clear command.",
       "p": 74
      },
      {
       "t": "Ctrl-d",
       "d": "Delete the character under the cursor.",
       "p": 74
      },
      {
       "t": "Ctrl-t",
       "d": "Swap the character under the cursor with the one before it.",
       "p": 74
      },
      {
       "t": "Alt-t",
       "d": "Swap the word at the cursor with the word before it.",
       "p": 74
      },
      {
       "t": "Alt-l",
       "d": "Lowercase the characters from the cursor to the end of the word.",
       "p": 74
      },
      {
       "t": "Alt-u",
       "d": "Uppercase the characters from the cursor to the end of the word.",
       "p": 74
      },
      {
       "t": "kill / yank",
       "d": "Readline's names for cut and paste. Killed text is saved in a buffer called the kill-ring.",
       "p": 75
      },
      {
       "t": "Ctrl-k",
       "d": "Kill (cut) everything from the cursor to the line's end.",
       "p": 75
      },
      {
       "t": "Ctrl-u",
       "d": "Kill from the cursor back to the start of the line.",
       "p": 75
      },
      {
       "t": "Alt-d",
       "d": "Kill from the cursor to the end of the current word.",
       "p": 75
      },
      {
       "t": "Alt-Backspace",
       "d": "Kill back to the start of the current word, or the previous word if already at a word start.",
       "p": 75
      },
      {
       "t": "Ctrl-y",
       "d": "Yank (paste) text from the kill-ring at the cursor.",
       "p": 75
      },
      {
       "t": "meta key",
       "d": "Readline's extra modifier key. On modern keyboards it is Alt; pressing and releasing Esc works too.",
       "p": 75
      }
     ],
     "quiz": [
      {
       "id": "ch08.editing.q1",
       "type": "mc",
       "cmd": "clear",
       "q": "Which key jumps the cursor to the beginning of the line?",
       "choices": [
        "Ctrl-a",
        "Ctrl-e",
        "Ctrl-b",
        "Alt-b"
       ],
       "answer": 0,
       "explain": "Ctrl-a goes to the start, Ctrl-e to the end."
      },
      {
       "id": "ch08.editing.q2",
       "type": "mc",
       "cmd": "clear",
       "q": "You cut text with Ctrl-k. Which key pastes it back?",
       "choices": [
        "Ctrl-y",
        "Ctrl-v",
        "Ctrl-p",
        "Alt-y"
       ],
       "answer": 0,
       "explain": "Ctrl-y yanks text from the kill-ring."
      },
      {
       "id": "ch08.editing.q3",
       "type": "mc",
       "cmd": "clear",
       "q": "Which key does the same job as the clear command?",
       "choices": [
        "Ctrl-l",
        "Ctrl-c",
        "Ctrl-d",
        "Ctrl-u"
       ],
       "answer": 0,
       "explain": "Ctrl-l clears the screen."
      },
      {
       "id": "ch08.editing.q4",
       "type": "fill",
       "cmd": "clear",
       "q": "Type the command that clears the terminal screen.",
       "accept": [
        "clear"
       ]
      }
     ],
     "tasks": []
    },
    {
     "id": "ch08.completion",
     "title": "Tab Completion",
     "intro": "Press Tab while typing and the shell tries to finish the word for you. It only succeeds when what you typed matches a single possibility.",
     "commands": [],
     "terms": [
      {
       "t": "Tab",
       "d": "Complete the current word. If the start is ambiguous nothing happens; type more letters and try again.",
       "p": 76
      },
      {
       "t": "completion targets",
       "d": "Pathnames, variables (word starts with $), usernames (~), commands (first word), and hostnames (@, from /etc/hosts).",
       "p": 76
      },
      {
       "t": "Alt-?",
       "d": "Show the list of possible completions. Pressing Tab twice usually does the same.",
       "p": 77
      },
      {
       "t": "Alt-*",
       "d": "Insert every possible completion at once.",
       "p": 77
      },
      {
       "t": "programmable completion",
       "d": "Extra completion rules, often added by the distribution for specific programs, built with shell functions.",
       "p": 77
      }
     ],
     "quiz": [
      {
       "id": "ch08.completion.q1",
       "type": "mc",
       "cmd": "history",
       "q": "You type ls D and press Tab, but nothing happens. Why?",
       "choices": [
        "More than one name starts with D",
        "Tab only completes commands",
        "Completion is turned off for ls",
        "D is not a valid letter"
       ],
       "answer": 0,
       "explain": "Completion needs an unambiguous start; Desktop and Documents both match."
      },
      {
       "id": "ch08.completion.q2",
       "type": "mc",
       "cmd": "history",
       "q": "Which key shows all possible completions?",
       "choices": [
        "Alt-?",
        "Alt-*",
        "Ctrl-r",
        "Ctrl-o"
       ],
       "answer": 0,
       "explain": "Alt-? lists them; Alt-* inserts them all."
      },
      {
       "id": "ch08.completion.q3",
       "type": "mc",
       "cmd": "history",
       "q": "Completing a word that begins with ~ fills in what?",
       "choices": [
        "A username",
        "A variable",
        "A hostname",
        "A command"
       ],
       "answer": 0,
       "explain": "~ triggers username completion; $ triggers variables, @ hostnames."
      }
     ],
     "tasks": []
    },
    {
     "id": "ch08.history",
     "title": "Using History",
     "intro": "bash remembers the commands you type. You can list them, search them as you type, and replay them with history expansion.",
     "commands": [
      {
       "id": "history",
       "name": "history",
       "kind": "builtin",
       "summary": "Display or manipulate the history list",
       "syntax": "history",
       "explain": "history prints the saved command list with a line number in front of each entry. The list lives in a file called bash_history in your home directory and usually holds the last 500 or 1,000 commands. Piping it into grep is a fast way to find an old command.",
       "examples": [
        {
         "cmd": "history | less",
         "note": "Page through the whole history list.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "history | grep /usr/bin",
         "note": "Find earlier commands that mentioned /usr/bin.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "!88",
         "out": "ls -l /usr/bin > ls-output.txt",
         "note": "Re-runs entry 88 of the history list.",
         "sim": false
        }
       ],
       "chapters": [
        8
       ]
      },
      {
       "id": "script",
       "name": "script",
       "kind": "cmd",
       "summary": "Record a whole shell session into a file",
       "syntax": "script [file]",
       "explain": "script records everything in a shell session and saves it to the file you name. If you give no filename, the recording goes to a file called typescript.",
       "examples": [
        {
         "cmd": "script session.txt",
         "out": "",
         "note": "Starts recording the session into session.txt.",
         "sim": false
        }
       ],
       "chapters": [
        8
       ]
      }
     ],
     "terms": [
      {
       "t": "Ctrl-r",
       "d": "Start a reverse incremental search of history; press again to find the next older match.",
       "p": 78
      },
      {
       "t": "Ctrl-j",
       "d": "During a search, copy the found line to the command line for editing instead of running it.",
       "p": 78
      },
      {
       "t": "Ctrl-g",
       "d": "Quit an incremental history search (Ctrl-c also works).",
       "p": 78
      },
      {
       "t": "Ctrl-p",
       "d": "Move to the previous history entry, like the up arrow.",
       "p": 79
      },
      {
       "t": "Ctrl-n",
       "d": "Move to the next history entry, like the down arrow.",
       "p": 79
      },
      {
       "t": "Alt-<",
       "d": "Go to the top (oldest end) of the history list.",
       "p": 79
      },
      {
       "t": "Alt->",
       "d": "Go to the bottom of the history list, which is the current command line.",
       "p": 79
      },
      {
       "t": "Alt-p",
       "d": "Non-incremental reverse search: type the text, then Enter to search.",
       "p": 79
      },
      {
       "t": "Alt-n",
       "d": "Non-incremental forward search.",
       "p": 79
      },
      {
       "t": "Ctrl-o",
       "d": "Run the current history item and step to the next, useful for replaying a sequence.",
       "p": 79
      },
      {
       "t": "!!",
       "d": "Repeat the previous command.",
       "p": 79
      },
      {
       "t": "!number",
       "d": "Repeat the history entry with that line number.",
       "p": 79
      },
      {
       "t": "!string",
       "d": "Repeat the most recent entry that begins with string. Use with care.",
       "p": 79
      },
      {
       "t": "!?string",
       "d": "Repeat the most recent entry that contains string anywhere. Use with care.",
       "p": 79
      }
     ],
     "quiz": [
      {
       "id": "ch08.history.q1",
       "type": "fill",
       "cmd": "history",
       "q": "Use history expansion to repeat the last command.",
       "accept": [
        "!!"
       ]
      },
      {
       "id": "ch08.history.q2",
       "type": "fill",
       "cmd": "history",
       "q": "Search your history for lines mentioning /usr/bin.",
       "accept": [
        "history | grep /usr/bin"
       ]
      },
      {
       "id": "ch08.history.q3",
       "type": "output",
       "cmd": "history",
       "q": "Which key turned the prompt into this?",
       "out": "(reverse-i-search)`/usr/bin': ls -l /usr/bin > ls-output.txt",
       "choices": [
        "Ctrl-r",
        "Alt-p",
        "Ctrl-o",
        "Ctrl-p"
       ],
       "answer": 0
      },
      {
       "id": "ch08.history.q4",
       "type": "order",
       "cmd": "history",
       "q": "Build: page through the command history",
       "parts": [
        "history",
        "|",
        "less"
       ]
      }
     ],
     "tasks": []
    }
   ]
  },
  {
   "id": "ch09",
   "n": 9,
   "part": 1,
   "title": "Permissions",
   "summary": "Owners, groups, file modes, and how to change permissions and identity",
   "lessons": [
    {
     "id": "ch09.identity",
     "title": "Owners, Groups, and the File Mode",
     "intro": "Linux is multiuser, so every file has an owner, a group owner, and a set of rights for everybody else. The first column of ls -l shows the file type and those rights.",
     "commands": [
      {
       "id": "id",
       "name": "id",
       "kind": "cmd",
       "summary": "Display user identity",
       "syntax": "id",
       "explain": "id shows your user ID (uid), your primary group ID (gid), and every group you belong to. Each number is paired with a readable name. Account details come from /etc/passwd and groups from /etc/group.",
       "examples": [
        {
         "cmd": "id",
         "note": "Shows uid, gid, and group memberships for user me.",
         "sim": true
        },
        {
         "cmd": "ls -l foo.txt",
         "note": "The first 10 characters are the file type plus the permission bits.",
         "sim": true
        }
       ],
       "chapters": [
        9
       ]
      }
     ],
     "terms": [
      {
       "t": "uid",
       "d": "User ID: the number assigned to an account and mapped to a username.",
       "p": 82
      },
      {
       "t": "gid",
       "d": "Group ID: the number of a user's primary group. Users can also be in additional groups.",
       "p": 83
      },
      {
       "t": "world",
       "d": "Unix term for everybody who is neither the owner nor in the file's group.",
       "p": 82
      },
      {
       "t": "/etc/passwd",
       "d": "Defines each account: login name, uid, gid, real name, home directory, and login shell.",
       "p": 83
      },
      {
       "t": "/etc/group",
       "d": "File that defines the groups on the system.",
       "p": 83
      },
      {
       "t": "/etc/shadow",
       "d": "Holds the users' password information; regular users cannot read it.",
       "p": 83
      },
      {
       "t": "-",
       "d": "File type: a regular file.",
       "p": 84
      },
      {
       "t": "d",
       "d": "File type: a directory.",
       "p": 84
      },
      {
       "t": "l",
       "d": "File type: a symbolic link. Its rwxrwxrwx bits are dummies; the target's permissions apply.",
       "p": 84
      },
      {
       "t": "c",
       "d": "File type: character special file, a device that moves data byte by byte, e.g. a terminal or /dev/null.",
       "p": 84
      },
      {
       "t": "b",
       "d": "File type: block special file, a device that moves data in chunks (blocks), e.g. a disk or DVD drive.",
       "p": 84
      },
      {
       "t": "file mode",
       "d": "The nine characters after the type: rwx for owner, then group, then world.",
       "p": 84
      },
      {
       "t": "r",
       "d": "Files: may be opened and read. Directories: contents may be listed if x is also set.",
       "p": 84
      },
      {
       "t": "w",
       "d": "Files: may be written or truncated, not renamed or deleted. Directories: entries may be created, deleted, renamed (needs x).",
       "p": 84
      },
      {
       "t": "x",
       "d": "Files: may be run as a program (scripts also need r). Directories: may be entered, e.g. with cd.",
       "p": 84
      },
      {
       "t": "-rw-r--r--",
       "d": "Regular file the owner can read and write; group and world can only read.",
       "p": 85
      },
      {
       "t": "-rwxr-xr-x",
       "d": "Regular file the owner can read, write, and run; everyone else can read and run.",
       "p": 85
      },
      {
       "t": "drwxr-x---",
       "d": "Directory the owner can fully use; group can enter and list but not change; others have no access.",
       "p": 85
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch09.identity.q1",
       "type": "mc",
       "cmd": "id",
       "q": "In ls -l output, what does a leading d in the attributes mean?",
       "choices": [
        "The item is a directory",
        "The file is deleted",
        "The file is a device",
        "The file is a symlink"
       ],
       "answer": 0,
       "explain": "The first character is the file type; d is a directory."
      },
      {
       "id": "ch09.identity.q2",
       "type": "mc",
       "cmd": "id",
       "q": "On a directory, which permission lets you enter it with cd?",
       "choices": [
        "x",
        "r",
        "w",
        "s"
       ],
       "answer": 0,
       "explain": "Execute permission on a directory allows entering it."
      },
      {
       "id": "ch09.identity.q3",
       "type": "output",
       "cmd": "id",
       "q": "Which command produced this output?",
       "out": "uid=500(me) gid=500(me) groups=500(me)",
       "choices": [
        "id",
        "whoami",
        "ls -l",
        "umask"
       ],
       "answer": 0
      },
      {
       "id": "ch09.identity.q4",
       "type": "fill",
       "cmd": "id",
       "q": "Display your user and group identity.",
       "accept": [
        "id"
       ]
      }
     ]
    },
    {
     "id": "ch09.chmod",
     "title": "Changing Modes with chmod",
     "intro": "chmod changes a file's permissions. You can give the whole mode as octal digits, or adjust single bits with symbolic notation.",
     "commands": [
      {
       "id": "chmod",
       "name": "chmod",
       "kind": "cmd",
       "summary": "Change a file's mode (permissions)",
       "syntax": "chmod mode file...",
       "explain": "A mode can be changed only by the superuser or by whoever owns the file. In octal form each digit stands for three bits, so three digits set owner, group, and world at once; 7, 6, 5, 4, and 0 cover most needs. Symbolic form names who (u, g, o, a), an operation (+, -, =), and the bits (r, w, x), and can change one bit without touching the rest. Symbolic s and t set the special setuid, setgid, and sticky bits.",
       "flags": [
        {
         "f": "--recursive",
         "d": "Apply the change to files and directories inside. Rarely ideal, since files and dirs seldom want the same mode.",
         "p": 88,
         "ch": 9
        }
       ],
       "examples": [
        {
         "cmd": "chmod 600 foo.txt",
         "note": "Owner can read and write; group and world get nothing.",
         "sim": true,
         "viz": "chmod"
        },
        {
         "cmd": "chmod u+x hello.sh",
         "note": "Adds execute permission for the owner only.",
         "sim": true,
         "viz": "chmod"
        },
        {
         "cmd": "chmod u+x,go=rx hello.sh",
         "note": "Owner gains x; group and others are set to exactly r-x.",
         "sim": true,
         "viz": "chmod"
        },
        {
         "cmd": "chmod o-rw hello.sh",
         "note": "Takes read and write away from the world.",
         "sim": true,
         "viz": "chmod"
        },
        {
         "cmd": "chmod u+s program",
         "out": "",
         "note": "Marks a program setuid; ls then shows -rwsr-xr-x.",
         "sim": false
        },
        {
         "cmd": "chmod g+s dir",
         "out": "",
         "note": "Sets setgid on a directory; ls shows drwxrwsr-x.",
         "sim": false
        },
        {
         "cmd": "chmod +t dir",
         "out": "",
         "note": "Sets the sticky bit; ls shows drwxrwxrwt.",
         "sim": false
        },
        {
         "cmd": "chmod 755 hello.sh",
         "note": "Lets everyone read and run the script; only the owner can change it.",
         "sim": true,
         "viz": "chmod",
         "ch": 24
        },
        {
         "cmd": "chmod 700 hello.sh",
         "note": "Only the owner can read, write and run the script.",
         "sim": true,
         "viz": "chmod",
         "ch": 24
        },
        {
         "cmd": "ls -l hello_world",
         "out": "-rwxr-xr-x 1 me      me      63 2018-03-07 10:10 hello_world",
         "note": "After chmod 755 the listing shows x bits for owner, group and others.",
         "sim": false,
         "ch": 24
        }
       ],
       "chapters": [
        9,
        24
       ]
      }
     ],
     "terms": [
      {
       "t": "0 = ---",
       "d": "Octal 0, binary 000: no permissions.",
       "p": 87
      },
      {
       "t": "1 = --x",
       "d": "Octal 1, binary 001: execute only.",
       "p": 87
      },
      {
       "t": "2 = -w-",
       "d": "Octal 2, binary 010: write only.",
       "p": 87
      },
      {
       "t": "3 = -wx",
       "d": "Octal 3, binary 011: write and execute.",
       "p": 87
      },
      {
       "t": "4 = r--",
       "d": "Octal 4, binary 100: read only.",
       "p": 87
      },
      {
       "t": "5 = r-x",
       "d": "Octal 5, binary 101: read and execute.",
       "p": 87
      },
      {
       "t": "6 = rw-",
       "d": "Octal 6, binary 110: read and write.",
       "p": 87
      },
      {
       "t": "7 = rwx",
       "d": "Octal 7, binary 111: read, write, and execute.",
       "p": 87
      },
      {
       "t": "u",
       "d": "Symbolic who: the user, meaning the file's owner.",
       "p": 87
      },
      {
       "t": "g",
       "d": "Symbolic who: the group owner.",
       "p": 87
      },
      {
       "t": "o",
       "d": "Symbolic who: others, meaning the world.",
       "p": 87
      },
      {
       "t": "a",
       "d": "Symbolic who: all, i.e. u, g, and o together. Assumed when no who is given.",
       "p": 87
      },
      {
       "t": "+",
       "d": "Symbolic operation: add the listed permissions.",
       "p": 88
      },
      {
       "t": "-",
       "d": "Symbolic operation: remove the listed permissions.",
       "p": 88
      },
      {
       "t": "=",
       "d": "Symbolic operation: set exactly the listed permissions and clear the others.",
       "p": 88
      },
      {
       "t": "+x",
       "d": "Add execute for owner, group, and world; the same as a+x.",
       "p": 88
      },
      {
       "t": "go=rw",
       "d": "Group and others get exactly read and write; any execute bit they had is removed.",
       "p": 88
      },
      {
       "t": "u+x,go=rx",
       "d": "Several symbolic changes can be joined with commas.",
       "p": 88
      }
     ],
     "tasks": [
      {
       "id": "ch09.chmod.t1",
       "prompt": "Make foo.txt readable and writable by you only, using octal notation.",
       "hint": "6 = rw-, 0 = ---",
       "solution": "chmod 600 foo.txt",
       "check": [
        {
         "t": "mode",
         "p": "~/foo.txt",
         "mode": "600"
        }
       ]
      },
      {
       "id": "ch09.chmod.t2",
       "prompt": "Add execute permission for the owner of hello.sh without changing anything else.",
       "hint": "Symbolic notation: who, operation, permission",
       "solution": "chmod u+x hello.sh",
       "check": [
        {
         "t": "mode",
         "p": "~/hello.sh",
         "mode": "744"
        }
       ]
      },
      {
       "id": "ch09.chmod.t3",
       "prompt": "Give hello.sh the mode rwxr-xr-x using octal notation.",
       "hint": "7 = rwx, 5 = r-x",
       "solution": "chmod 755 hello.sh",
       "check": [
        {
         "t": "mode",
         "p": "~/hello.sh",
         "mode": "755"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch09.chmod.q1",
       "type": "mc",
       "cmd": "chmod",
       "q": "Which octal mode gives rw-r--r--?",
       "choices": [
        "644",
        "755",
        "600",
        "664"
       ],
       "answer": 0,
       "explain": "6 = rw-, 4 = r--."
      },
      {
       "id": "ch09.chmod.q2",
       "type": "fill",
       "cmd": "chmod",
       "q": "Remove read and write permission for others on notes.txt using symbolic notation.",
       "accept": [
        "chmod o-rw notes.txt"
       ]
      },
      {
       "id": "ch09.chmod.q3",
       "type": "mc",
       "cmd": "chmod",
       "q": "What does chmod +x file do?",
       "choices": [
        "Adds execute for owner, group, and world",
        "Adds execute for the owner only",
        "Removes all other permissions",
        "Sets the sticky bit"
       ],
       "answer": 0,
       "explain": "With no who given, all (a) is assumed."
      },
      {
       "id": "ch09.chmod.q4",
       "type": "order",
       "cmd": "chmod",
       "q": "Build: add owner execute and set group/others to read+execute on hello.sh",
       "parts": [
        "chmod",
        "u+x,go=rx",
        "hello.sh"
       ]
      }
     ]
    },
    {
     "id": "ch09.umask",
     "title": "Default Permissions and Special Bits",
     "intro": "umask decides which permission bits are stripped from newly created files. Beyond rwx there are three special bits: setuid, setgid, and sticky.",
     "commands": [
      {
       "id": "umask",
       "name": "umask",
       "kind": "builtin",
       "summary": "Set the default file permissions",
       "syntax": "umask [mask]",
       "explain": "umask holds an octal mask of bits to remove from the mode of every new file. Wherever the mask has a 1 in binary, that permission is turned off, so 0002 drops world write and 0022 drops group and world write. Run it with no argument to see the current value; a change lasts only for the current session.",
       "examples": [
        {
         "cmd": "umask",
         "note": "Prints the current mask, such as 0002 or 0022.",
         "sim": true
        },
        {
         "cmd": "umask 0000; echo hi > open.txt; ls -l open.txt",
         "note": "With the mask off, a new file is writable by everyone (rw-rw-rw-).",
         "sim": true
        },
        {
         "cmd": "umask 0002",
         "note": "Restores a common default.",
         "sim": true
        }
       ],
       "chapters": [
        9
       ]
      }
     ],
     "terms": [
      {
       "t": "setuid (4000)",
       "d": "On an executable, the program runs with its owner's user ID rather than the user who started it.",
       "p": 90
      },
      {
       "t": "setgid (2000)",
       "d": "Runs with the file's group ID; on a directory, new files inherit the directory's group.",
       "p": 91
      },
      {
       "t": "sticky bit (1000)",
       "d": "On a directory, only the dir owner, file owner, or superuser may delete or rename files. Used on /tmp.",
       "p": 91
      },
      {
       "t": "-rwsr-xr-x",
       "d": "How ls shows a setuid program: s replaces the owner's x.",
       "p": 91
      },
      {
       "t": "drwxrwsr-x",
       "d": "How ls shows a setgid directory: s replaces the group's x.",
       "p": 91
      },
      {
       "t": "drwxrwxrwt",
       "d": "How ls shows a sticky directory: t replaces the world's x.",
       "p": 91
      }
     ],
     "tasks": [
      {
       "id": "ch09.umask.t1",
       "prompt": "Turn the mask off with umask 0000, then create open.txt containing hi. It should end up world-writable.",
       "hint": "umask MASK; echo TEXT > FILE",
       "solution": "umask 0000; echo hi > open.txt",
       "check": [
        {
         "t": "mode",
         "p": "~/open.txt",
         "mode": "666"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch09.umask.q1",
       "type": "mc",
       "cmd": "umask",
       "q": "With umask 0022, which permission bits are removed from new files?",
       "choices": [
        "Group write and world write",
        "World write only",
        "All execute bits",
        "Owner write"
       ],
       "answer": 0,
       "explain": "Each 2 in the mask is binary 010, the write bit."
      },
      {
       "id": "ch09.umask.q2",
       "type": "mc",
       "cmd": "chmod",
       "q": "Which special bit keeps users from deleting each other's files in a shared directory like /tmp?",
       "choices": [
        "Sticky bit",
        "setuid",
        "setgid",
        "Execute bit"
       ],
       "answer": 0,
       "explain": "The sticky bit on a directory limits deletes and renames."
      },
      {
       "id": "ch09.umask.q3",
       "type": "fill",
       "cmd": "umask",
       "q": "Set the mask so new files are group-writable but not world-writable.",
       "accept": [
        "umask 0002"
       ]
      },
      {
       "id": "ch09.umask.q4",
       "type": "output",
       "cmd": "chmod",
       "q": "Which command turns drwxrwxr-x into this?",
       "out": "drwxrwsr-x",
       "choices": [
        "chmod g+s dir",
        "chmod u+s dir",
        "chmod +t dir",
        "chmod g+x dir"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch09.su",
     "title": "Changing Identities and Ownership",
     "intro": "su and sudo let you act as another user, usually the superuser. chown and chgrp change who owns a file, and passwd changes passwords.",
     "commands": [
      {
       "id": "su",
       "name": "su",
       "kind": "cmd",
       "summary": "Start a shell (or one command) as another user",
       "syntax": "su [-[l]] [user]",
       "explain": "su starts a new shell as another user, the superuser if none is named, after asking for that user's password. With -l (usually written as just -) you get a login shell: the user's environment is loaded and you start in their home directory. With -c it runs one command instead, which should be quoted so it expands in the new shell; type exit to leave.",
       "flags": [
        {
         "f": "-l",
         "d": "Start a login shell for the user, loading their environment and home directory. May be shortened to -.",
         "p": 92,
         "ch": 9
        },
        {
         "f": "-c",
         "d": "Pass a single command line to the new shell instead of starting an interactive session.",
         "p": 93,
         "ch": 9
        }
       ],
       "examples": [
        {
         "cmd": "su -",
         "out": "Password:",
         "note": "Opens a superuser login shell; the prompt ends in # instead of $.",
         "sim": false
        },
        {
         "cmd": "su -c 'ls -l /root/*'",
         "out": "Password:\n-rw------- 1 root root     754 2007-08-11 03:19 /root/anaconda-ks.cfg",
         "note": "Runs one command as root; the quotes delay expansion to the new shell.",
         "sim": false
        }
       ],
       "chapters": [
        9
       ]
      },
      {
       "id": "sudo",
       "name": "sudo",
       "kind": "cmd",
       "summary": "Execute a command as another user",
       "syntax": "sudo [options] command",
       "explain": "sudo runs commands as another user, usually root, according to rules the administrator writes in /etc/sudoers. It asks for your own password rather than root's and may limit you to particular commands. It does not start a new shell or load another environment, so commands need no extra quoting, and it usually remembers your password for a few minutes.",
       "flags": [
        {
         "f": "-l",
         "d": "List the privileges sudo grants you.",
         "p": 93,
         "ch": 9
        },
        {
         "f": "-i",
         "d": "Open an interactive root shell, similar to su -.",
         "p": 93,
         "ch": 9
        }
       ],
       "examples": [
        {
         "cmd": "sudo backup_script",
         "out": "Password:\nSystem Backup Starting...",
         "note": "Runs a privileged program after you type your own password.",
         "sim": false
        },
        {
         "cmd": "sudo -l",
         "out": "User me may run the following commands on this host:\n    (ALL) ALL",
         "note": "Shows what you are allowed to run.",
         "sim": false
        }
       ],
       "chapters": [
        9
       ]
      },
      {
       "id": "chown",
       "name": "chown",
       "kind": "cmd",
       "summary": "Change a file's owner and group",
       "syntax": "chown [owner][:[group]] file...",
       "explain": "chown sets the owner, the group owner, or both, depending on the form of its first argument. It needs superuser privileges. A trailing colon after the username also sets the group to that user's login group.",
       "examples": [
        {
         "cmd": "sudo chown tony: ~tony/myfile.txt",
         "out": "",
         "note": "Makes tony the owner and sets the group to tony's login group.",
         "sim": false
        },
        {
         "cmd": "sudo chown :music /usr/local/share/Music",
         "out": "",
         "note": "Changes only the group owner, to music.",
         "sim": false
        }
       ],
       "chapters": [
        9
       ]
      },
      {
       "id": "chgrp",
       "name": "chgrp",
       "kind": "cmd",
       "summary": "Change a file's group ownership",
       "syntax": "chgrp group file...",
       "explain": "chgrp comes from older Unix versions, where chown could not change the group. It works much like chown but only handles the group owner.",
       "examples": [
        {
         "cmd": "sudo chgrp music /usr/local/share/Music",
         "out": "",
         "note": "Gives the directory to group music; same effect as chown :music.",
         "sim": false
        }
       ],
       "chapters": [
        9
       ]
      },
      {
       "id": "passwd",
       "name": "passwd",
       "kind": "cmd",
       "summary": "Change a user's password",
       "syntax": "passwd [user]",
       "explain": "passwd prompts for your current password and then a new one. It rejects passwords that are too short, too close to the old one, dictionary words, or easy to guess. The superuser can name another user to set that account's password.",
       "examples": [
        {
         "cmd": "passwd",
         "out": "(current) UNIX password:\nNew UNIX password:",
         "note": "Changes your own password.",
         "sim": false
        }
       ],
       "chapters": [
        9
       ]
      }
     ],
     "terms": [
      {
       "t": "bob",
       "d": "chown argument: make user bob the owner.",
       "p": 94
      },
      {
       "t": "bob:users",
       "d": "chown argument: owner becomes bob and group owner becomes users.",
       "p": 94
      },
      {
       "t": ":admins",
       "d": "chown argument: change only the group owner, to admins.",
       "p": 95
      },
      {
       "t": "bob:",
       "d": "chown argument: owner becomes bob and group becomes bob's login group.",
       "p": 95
      },
      {
       "t": "/etc/sudoers",
       "d": "Config file where the administrator lists which commands which users may run with sudo.",
       "p": 92
      },
      {
       "t": "# prompt",
       "d": "A prompt ending in # instead of $ signals a shell with superuser privileges.",
       "p": 92
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch09.su.q1",
       "type": "mc",
       "cmd": "sudo",
       "q": "Whose password does sudo ask for?",
       "choices": [
        "Your own",
        "The superuser's",
        "The file owner's",
        "None ever"
       ],
       "answer": 0,
       "explain": "sudo authenticates with the user's own password; su asks for the target user's."
      },
      {
       "id": "ch09.su.q2",
       "type": "fill",
       "cmd": "su",
       "q": "Start a login shell as the superuser with su.",
       "accept": [
        "su -",
        "su -l"
       ]
      },
      {
       "id": "ch09.su.q3",
       "type": "mc",
       "cmd": "chown",
       "q": "What does chown bob: file do?",
       "choices": [
        "Owner to bob, group to bob's login group",
        "Owner to bob only",
        "Group to bob only",
        "Removes the group owner"
       ],
       "answer": 0,
       "explain": "The trailing colon also sets the login group."
      },
      {
       "id": "ch09.su.q4",
       "type": "order",
       "cmd": "chown",
       "q": "Build: as superuser, make tony the owner of ~tony/myfile.txt with tony's login group",
       "parts": [
        "sudo",
        "chown",
        "tony:",
        "~tony/myfile.txt"
       ]
      }
     ]
    }
   ]
  },
  {
   "id": "ch10",
   "n": 10,
   "part": 1,
   "title": "Processes",
   "summary": "View running processes, control jobs, send signals, and shut down",
   "lessons": [
    {
     "id": "ch10.viewing",
     "title": "Viewing Processes",
     "intro": "The kernel runs every program as a process with its own ID number. ps takes a snapshot of them, and top shows a live, updating view.",
     "commands": [
      {
       "id": "ps",
       "name": "ps",
       "kind": "cmd",
       "summary": "Report a snapshot of current processes",
       "syntax": "ps [options]",
       "explain": "With no options ps lists only the processes tied to your current terminal, showing PID, TTY, TIME, and CMD. The x option widens this to all of your processes, whatever terminal they belong to, and adds a STAT column. aux shows every user's processes with extra columns. These options are BSD style, written without a leading dash.",
       "flags": [
        {
         "f": "x",
         "d": "Show all of your processes regardless of controlling terminal; a ? in TTY means none.",
         "p": 101,
         "ch": 10
        },
        {
         "f": "aux",
         "d": "Show processes for every user, adding USER, %CPU, %MEM, VSZ, RSS, and START columns.",
         "p": 101,
         "ch": 10
        }
       ],
       "examples": [
        {
         "cmd": "ps",
         "note": "Lists processes for this terminal session only.",
         "sim": true
        },
        {
         "cmd": "ps x",
         "note": "Lists every process you own, with a STAT column.",
         "sim": true
        },
        {
         "cmd": "ps aux",
         "out": "USER    PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot      1  0.0  0.0   2136   644 ?        Ss   Mar05   0:31 init\nroot      2  0.0  0.0      0     0 ?        S<   Mar05   0:00 [kt]",
         "note": "Every process on the system, BSD style.",
         "sim": false
        }
       ],
       "chapters": [
        10
       ]
      },
      {
       "id": "top",
       "name": "top",
       "kind": "cmd",
       "summary": "Display tasks, updating continuously",
       "syntax": "top",
       "explain": "top refreshes its display every three seconds by default, listing processes sorted by CPU activity under a system summary. The summary shows uptime, users, load average, task counts, CPU usage, memory, and swap. Press h for help and q to quit.",
       "examples": [
        {
         "cmd": "top",
         "out": "top - 14:59:20 up  6:30,  2 users,  load average: 0.07, 0.02, 0.00\nTasks: 109 total,   1 running, 106 sleeping,   0 stopped,   2 zombie",
         "note": "Live view of the busiest processes.",
         "sim": false
        }
       ],
       "chapters": [
        10
       ]
      }
     ],
     "terms": [
      {
       "t": "init",
       "d": "The first program the kernel launches; it runs init scripts that start system services. Always PID 1.",
       "p": 100
      },
      {
       "t": "daemon",
       "d": "A program that runs in the background with no user interface, providing a service.",
       "p": 100
      },
      {
       "t": "parent / child process",
       "d": "When a program launches another, the launcher is the parent and the new process is its child.",
       "p": 100
      },
      {
       "t": "PID",
       "d": "Process ID, a number assigned to each process in ascending order.",
       "p": 100
      },
      {
       "t": "TTY",
       "d": "Short for teletype: the process's controlling terminal.",
       "p": 100
      },
      {
       "t": "TIME",
       "d": "The amount of CPU time the process has used.",
       "p": 100
      },
      {
       "t": "STAT",
       "d": "Column showing the process state, such as R, S, or Z.",
       "p": 101
      },
      {
       "t": "R",
       "d": "Process state: running or ready to run.",
       "p": 101
      },
      {
       "t": "S",
       "d": "Process state: sleeping, waiting for an event like a keystroke or network packet.",
       "p": 101
      },
      {
       "t": "D",
       "d": "Process state: uninterruptible sleep, waiting on I/O such as a disk.",
       "p": 101
      },
      {
       "t": "T",
       "d": "Process state: stopped (told to pause).",
       "p": 101
      },
      {
       "t": "Z",
       "d": "Process state: zombie, a finished child that its parent has not cleaned up.",
       "p": 101
      },
      {
       "t": "<",
       "d": "Process state: high priority (less nice), getting more CPU time.",
       "p": 101
      },
      {
       "t": "N",
       "d": "Process state: low priority (nice), served only after higher-priority work.",
       "p": 101
      },
      {
       "t": "USER",
       "d": "ps aux column: the owner of the process.",
       "p": 102
      },
      {
       "t": "%CPU",
       "d": "ps aux column: CPU usage in percent.",
       "p": 102
      },
      {
       "t": "%MEM",
       "d": "ps aux column: memory usage in percent.",
       "p": 102
      },
      {
       "t": "VSZ",
       "d": "ps aux column: virtual memory size.",
       "p": 102
      },
      {
       "t": "RSS",
       "d": "ps aux column: resident set size, the physical RAM used, in kilobytes.",
       "p": 102
      },
      {
       "t": "START",
       "d": "ps aux column: when the process started; a date is shown after 24 hours.",
       "p": 102
      },
      {
       "t": "load average",
       "d": "top: number of runnable processes sharing the CPU, over 1, 5, and 15 minutes. Under 1.0 means not busy.",
       "p": 103
      },
      {
       "t": "uptime",
       "d": "top: time since the machine was last booted.",
       "p": 103
      },
      {
       "t": "%us / %sy",
       "d": "top: share of CPU used by user processes (outside the kernel) and by system (kernel) processes.",
       "p": 103
      },
      {
       "t": "%ni / %id / %wa",
       "d": "top: CPU share for nice processes, idle time, and time waiting on I/O.",
       "p": 104
      },
      {
       "t": "h / q",
       "d": "top keyboard commands: h shows help, q quits.",
       "p": 104
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch10.viewing.q1",
       "type": "mc",
       "cmd": "ps",
       "q": "In the STAT column, what does Z mean?",
       "choices": [
        "A zombie: finished but not cleaned up by its parent",
        "Sleeping",
        "Stopped",
        "High priority"
       ],
       "answer": 0,
       "explain": "Z marks a defunct child process."
      },
      {
       "id": "ch10.viewing.q2",
       "type": "output",
       "cmd": "ps",
       "q": "Which command produced this output?",
       "out": "  PID TTY          TIME CMD\n 5198 pts/1    00:00:00 bash\n10129 pts/1    00:00:00 ps",
       "choices": [
        "ps",
        "ps aux",
        "top",
        "jobs"
       ],
       "answer": 0
      },
      {
       "id": "ch10.viewing.q3",
       "type": "fill",
       "cmd": "ps",
       "q": "Show every process on the system, belonging to all users, BSD style.",
       "accept": [
        "ps aux"
       ]
      },
      {
       "id": "ch10.viewing.q4",
       "type": "mc",
       "cmd": "top",
       "q": "Which key quits top?",
       "choices": [
        "q",
        "h",
        "x",
        "Ctrl-z"
       ],
       "answer": 0,
       "explain": "h shows help and q quits."
      }
     ]
    },
    {
     "id": "ch10.jobs",
     "title": "Foreground, Background, and Job Control",
     "intro": "A program started from the shell normally holds the prompt until it ends. Job control lets you interrupt it, pause it, or move it between foreground and background.",
     "commands": [
      {
       "id": "background",
       "name": "&",
       "kind": "syntax",
       "summary": "Start a command in the background",
       "syntax": "command &",
       "explain": "Ending a command with & launches it in the background so the prompt returns immediately. The shell prints the job number in brackets and the process ID. A background job ignores keyboard input, including Ctrl-C.",
       "examples": [
        {
         "cmd": "xlogo &",
         "out": "[1] 28236",
         "note": "Job 1 with PID 28236 runs while the prompt comes back.",
         "sim": false
        }
       ],
       "chapters": [
        10
       ]
      },
      {
       "id": "jobs",
       "name": "jobs",
       "kind": "builtin",
       "summary": "List active jobs",
       "syntax": "jobs",
       "explain": "jobs lists the jobs launched from the current terminal. Each line shows the job number, its status, and the command line that started it.",
       "examples": [
        {
         "cmd": "jobs",
         "out": "[1]+  Running                 xlogo &",
         "note": "One running background job.",
         "sim": false
        }
       ],
       "chapters": [
        10
       ]
      },
      {
       "id": "fg",
       "name": "fg",
       "kind": "builtin",
       "summary": "Place a job in the foreground",
       "syntax": "fg [%job]",
       "explain": "fg brings a background or stopped job back to the foreground, where it can receive keyboard input again. Name the job with a percent sign and its number, a jobspec, which is optional when only one job exists.",
       "examples": [
        {
         "cmd": "fg %1",
         "out": "xlogo",
         "note": "Job 1 returns to the foreground; Ctrl-C can now end it.",
         "sim": false
        }
       ],
       "chapters": [
        10
       ]
      },
      {
       "id": "bg",
       "name": "bg",
       "kind": "builtin",
       "summary": "Place a job in the background",
       "syntax": "bg [%job]",
       "explain": "bg resumes a stopped job in the background. A common use is fixing a program launched without &: press Ctrl-Z to stop it, then run bg.",
       "examples": [
        {
         "cmd": "bg %1",
         "out": "[1]+ xlogo &",
         "note": "Job 1 continues running in the background.",
         "sim": false
        }
       ],
       "chapters": [
        10
       ]
      }
     ],
     "terms": [
      {
       "t": "Ctrl-c",
       "d": "Interrupt the foreground program, politely asking it to end. Sends the INT signal.",
       "p": 105
      },
      {
       "t": "Ctrl-z",
       "d": "Stop (pause) the foreground program and put it in the background. Sends the TSTP signal.",
       "p": 106
      },
      {
       "t": "job control",
       "d": "Shell feature for tracking and moving programs started from the terminal.",
       "p": 105
      },
      {
       "t": "jobspec",
       "d": "A percent sign followed by a job number, such as %1, used to name a job.",
       "p": 106
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch10.jobs.q1",
       "type": "mc",
       "cmd": "bg",
       "q": "You started xlogo without & and want the prompt back without killing it. What do you do?",
       "choices": [
        "Press Ctrl-z, then run bg",
        "Press Ctrl-c, then run fg",
        "Run jobs",
        "Press Ctrl-d"
       ],
       "answer": 0,
       "explain": "Ctrl-z stops it, and bg resumes it in the background."
      },
      {
       "id": "ch10.jobs.q2",
       "type": "fill",
       "cmd": "fg",
       "q": "Bring job number 1 to the foreground using a jobspec.",
       "accept": [
        "fg %1"
       ]
      },
      {
       "id": "ch10.jobs.q3",
       "type": "output",
       "cmd": "jobs",
       "q": "Which command produced this output?",
       "out": "[1]+  Running                 xlogo &",
       "choices": [
        "jobs",
        "ps",
        "bg %1",
        "fg %1"
       ],
       "answer": 0
      },
      {
       "id": "ch10.jobs.q4",
       "type": "order",
       "cmd": "background",
       "q": "Build: launch xlogo in the background",
       "parts": [
        "xlogo",
        "&"
       ]
      }
     ]
    },
    {
     "id": "ch10.signals",
     "title": "Signals with kill and killall",
     "intro": "kill does not simply kill: it sends a signal, a message the program may act on. Ctrl-C and Ctrl-Z are signals too.",
     "commands": [
      {
       "id": "kill",
       "name": "kill",
       "kind": "builtin",
       "summary": "Send a signal to a process",
       "syntax": "kill [-signal] PID...",
       "explain": "kill sends a signal to the processes you name by PID or jobspec. With no signal given it sends TERM. A signal can be written as a number, a name, or the name with a SIG prefix. You must own the process, or be the superuser, to signal it.",
       "flags": [
        {
         "f": "-signal",
         "d": "Choose the signal by number or name, e.g. -1, -INT, or -SIGINT. TERM is used if omitted.",
         "p": 107,
         "ch": 10
        },
        {
         "f": "-l",
         "d": "Print the complete list of signals.",
         "p": 109,
         "ch": 10
        }
       ],
       "examples": [
        {
         "cmd": "kill 28401",
         "out": "[1]+  Terminated              xlogo",
         "note": "Sends the default TERM signal.",
         "sim": false
        },
        {
         "cmd": "kill -1 13546",
         "out": "[1]+  Hangup                  xlogo",
         "note": "Sends HUP by number.",
         "sim": false
        },
        {
         "cmd": "kill -SIGINT 13608",
         "out": "[1]+  Interrupt               xlogo",
         "note": "Sends INT using the SIG-prefixed name.",
         "sim": false
        }
       ],
       "chapters": [
        10
       ]
      },
      {
       "id": "killall",
       "name": "killall",
       "kind": "cmd",
       "summary": "Kill processes by name",
       "syntax": "killall [-u user] [-signal] name...",
       "explain": "killall sends a signal to every process matching a program name, optionally limited to one user's processes. As with kill, signaling another user's processes requires superuser privileges.",
       "flags": [
        {
         "f": "-u",
         "d": "Only target processes owned by the given user.",
         "p": 109,
         "ch": 10
        },
        {
         "f": "-signal",
         "d": "Choose which signal to send instead of the default.",
         "p": 109,
         "ch": 10
        }
       ],
       "examples": [
        {
         "cmd": "killall xlogo",
         "out": "[1]-  Terminated              xlogo\n[2]+  Terminated              xlogo",
         "note": "Ends both running copies of xlogo.",
         "sim": false
        }
       ],
       "chapters": [
        10
       ]
      }
     ],
     "terms": [
      {
       "t": "1 HUP",
       "d": "Hang up: sent when the controlling terminal closes. Many daemons use it to restart and reread config.",
       "p": 108
      },
      {
       "t": "2 INT",
       "d": "Interrupt: the same as pressing Ctrl-C; usually ends the program.",
       "p": 108
      },
      {
       "t": "9 KILL",
       "d": "Kill: the kernel ends the process at once, with no chance to clean up. Use only as a last resort.",
       "p": 108
      },
      {
       "t": "15 TERM",
       "d": "Terminate: the default signal kill sends.",
       "p": 108
      },
      {
       "t": "18 CONT",
       "d": "Continue: resumes a process after STOP or TSTP. Sent by bg and fg.",
       "p": 108
      },
      {
       "t": "19 STOP",
       "d": "Stop: pauses a process without ending it. Never delivered to the program, so it cannot be ignored.",
       "p": 108
      },
      {
       "t": "20 TSTP",
       "d": "Terminal stop: sent by Ctrl-Z. The program receives it and may choose to ignore it.",
       "p": 108
      },
      {
       "t": "3 QUIT",
       "d": "Quit.",
       "p": 109
      },
      {
       "t": "11 SEGV",
       "d": "Segmentation violation: the program tried to use memory it is not allowed to.",
       "p": 109
      },
      {
       "t": "28 WINCH",
       "d": "Window change: the window was resized. Programs like top and less redraw to fit.",
       "p": 109
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch10.signals.q1",
       "type": "mc",
       "cmd": "kill",
       "q": "Which signal does kill send if you do not specify one?",
       "choices": [
        "TERM",
        "KILL",
        "HUP",
        "INT"
       ],
       "answer": 0,
       "explain": "TERM (15) is the default."
      },
      {
       "id": "ch10.signals.q2",
       "type": "mc",
       "cmd": "kill",
       "q": "Why should KILL be a last resort?",
       "choices": [
        "The process gets no chance to clean up or save work",
        "It reboots the system",
        "It only pauses the process",
        "It cannot be sent by number"
       ],
       "answer": 0,
       "explain": "The kernel ends the process immediately."
      },
      {
       "id": "ch10.signals.q3",
       "type": "fill",
       "cmd": "kill",
       "q": "Send the INT signal, by name, to process 13601.",
       "accept": [
        "kill -INT 13601",
        "kill -SIGINT 13601"
       ]
      },
      {
       "id": "ch10.signals.q4",
       "type": "order",
       "cmd": "killall",
       "q": "Build: send the default signal to every process named xlogo",
       "parts": [
        "killall",
        "xlogo"
       ]
      }
     ]
    },
    {
     "id": "ch10.shutdown",
     "title": "Shutting Down and More Process Tools",
     "intro": "Shutting down ends every process in an orderly way and syncs file systems first. A few extra tools give other views of what the system is doing.",
     "commands": [
      {
       "id": "shutdown",
       "name": "shutdown",
       "kind": "cmd",
       "summary": "Shut down or reboot the system",
       "syntax": "shutdown [options] time",
       "explain": "shutdown lets you choose whether to halt, power off, or reboot and when it should happen, and it warns all logged-in users. The simpler halt, poweroff, and reboot commands are usually run with no options. All of them need superuser privileges.",
       "flags": [
        {
         "f": "-h",
         "d": "Halt the system.",
         "p": 110,
         "ch": 10
        },
        {
         "f": "-r",
         "d": "Reboot the system.",
         "p": 110,
         "ch": 10
        }
       ],
       "examples": [
        {
         "cmd": "sudo shutdown -h now",
         "out": "",
         "note": "Halts immediately.",
         "sim": false
        },
        {
         "cmd": "sudo shutdown -r now",
         "out": "",
         "note": "Reboots immediately.",
         "sim": false
        },
        {
         "cmd": "sudo reboot",
         "out": "",
         "note": "The plain reboot command.",
         "sim": false
        }
       ],
       "chapters": [
        10
       ]
      },
      {
       "id": "pstree",
       "name": "pstree",
       "kind": "cmd",
       "summary": "Show processes as a parent-child tree",
       "syntax": "pstree",
       "explain": "pstree prints the process list arranged as a tree. This makes it easy to see which parent processes started which children.",
       "examples": [
        {
         "cmd": "pstree",
         "out": "",
         "note": "Displays the process hierarchy.",
         "sim": false
        }
       ],
       "chapters": [
        10
       ]
      },
      {
       "id": "vmstat",
       "name": "vmstat",
       "kind": "cmd",
       "summary": "Snapshot of memory, swap, and disk I/O usage",
       "syntax": "vmstat [delay]",
       "explain": "vmstat reports system resource usage once. Give it a delay in seconds to keep printing updates, and stop it with Ctrl-C.",
       "examples": [
        {
         "cmd": "vmstat 5",
         "out": "",
         "note": "Prints a new line of statistics every five seconds.",
         "sim": false
        }
       ],
       "chapters": [
        10
       ]
      },
      {
       "id": "xload",
       "name": "xload",
       "kind": "cmd",
       "summary": "Graph system load over time in a window",
       "syntax": "xload",
       "explain": "xload is a graphical program that draws a running chart of system load. It needs a graphical desktop to display its window.",
       "examples": [
        {
         "cmd": "xload",
         "out": "",
         "note": "Opens a window with the load graph.",
         "sim": false
        }
       ],
       "chapters": [
        10
       ]
      },
      {
       "id": "tload",
       "name": "tload",
       "kind": "cmd",
       "summary": "Graph system load in the terminal",
       "syntax": "tload",
       "explain": "tload draws a load graph like xload but inside the terminal. Press Ctrl-C to end it.",
       "examples": [
        {
         "cmd": "tload",
         "out": "",
         "note": "Shows a text-mode load graph.",
         "sim": false
        }
       ],
       "chapters": [
        10
       ]
      }
     ],
     "terms": [
      {
       "t": "halt / poweroff / reboot",
       "d": "Simple shutdown commands, usually run with no options.",
       "p": 110
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch10.shutdown.q1",
       "type": "fill",
       "cmd": "shutdown",
       "q": "Reboot the system right now using shutdown with sudo.",
       "accept": [
        "sudo shutdown -r now"
       ]
      },
      {
       "id": "ch10.shutdown.q2",
       "type": "mc",
       "cmd": "pstree",
       "q": "Which command shows processes arranged by parent-child relationships?",
       "choices": [
        "pstree",
        "vmstat",
        "tload",
        "top"
       ],
       "answer": 0,
       "explain": "pstree draws the process tree."
      },
      {
       "id": "ch10.shutdown.q3",
       "type": "mc",
       "cmd": "vmstat",
       "q": "What does the 5 in vmstat 5 mean?",
       "choices": [
        "Update every 5 seconds",
        "Show 5 processes",
        "Use 5 percent of CPU",
        "Run 5 times"
       ],
       "answer": 0,
       "explain": "A number after vmstat is the delay between updates."
      }
     ]
    }
   ]
  },
  {
   "id": "ch11",
   "n": 11,
   "part": 2,
   "title": "The Environment",
   "summary": "Inspect and change shell variables, startup files, and .bashrc",
   "lessons": [
    {
     "id": "ch11.examine",
     "title": "Examining the environment",
     "intro": "The shell keeps shell variables, environment variables, aliases, and functions for the whole session. Two tools let you look at the variables: printenv and set.",
     "commands": [
      {
       "id": "printenv",
       "name": "printenv",
       "kind": "cmd",
       "summary": "Print all or part of the environment",
       "syntax": "printenv [variable]",
       "explain": "Without arguments, printenv lists every environment variable with its value, one per line. Give it a variable name and it prints only that value. It does not show shell-only variables or aliases. The list is long, so piping it into less helps.",
       "flags": [],
       "examples": [
        {
         "cmd": "printenv | less",
         "note": "Page through the full environment.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "printenv USER",
         "note": "Prints just the value of USER.",
         "sim": true
        }
       ],
       "chapters": [
        11
       ]
      },
      {
       "id": "set",
       "name": "set",
       "kind": "builtin",
       "summary": "Set shell options; with no arguments, list variables",
       "syntax": "set",
       "explain": "set is a bash builtin for setting shell options. Run bare, it prints shell variables, environment variables, and any shell functions. Unlike printenv, its listing comes out sorted alphabetically.",
       "flags": [
        {
         "f": "-x",
         "d": "Turn on tracing: each command is shown with its expansions before it runs.",
         "p": 393,
         "ch": 30
        },
        {
         "f": "+x",
         "d": "Turn tracing back off.",
         "p": 394,
         "ch": 30
        }
       ],
       "examples": [
        {
         "cmd": "set | less",
         "note": "Browse shell and environment variables in sorted order.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "set -x # Turn on tracing\nif [ $number = 1 ]; then\n    echo \"Number is equal to 1.\"\nfi\nset +x # Turn off tracing",
         "out": "+ '[' 1 = 1 ']'\n+ echo 'Number is equal to 1.'\nNumber is equal to 1.",
         "note": "Traces only the lines between set -x and set +x.",
         "sim": false,
         "ch": 30
        }
       ],
       "chapters": [
        11,
        30
       ]
      }
     ],
     "terms": [
      {
       "t": "shell variable",
       "d": "Data that bash itself places in the environment.",
       "p": 116
      },
      {
       "t": "environment variable",
       "d": "Any variable in the environment that bash did not create itself.",
       "p": 116
      },
      {
       "t": "aliases and functions",
       "d": "Besides variables, the shell keeps aliases and shell functions as programmatic data.",
       "p": 116
      },
      {
       "t": "alias (no arguments)",
       "d": "Lists defined aliases, which neither set nor printenv will display.",
       "p": 117
      }
     ],
     "tasks": [
      {
       "id": "ch11.examine.t1",
       "prompt": "Show only the value of the HOME environment variable using printenv.",
       "hint": "printenv NAME",
       "solution": "printenv HOME",
       "check": [
        {
         "t": "cmd",
         "re": "^\\s*printenv\\s+HOME\\s*$"
        },
        {
         "t": "out",
         "re": "/home/me"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch11.examine.q1",
       "type": "mc",
       "cmd": "set",
       "q": "Which command shows shell variables, environment variables, and shell functions, sorted?",
       "choices": [
        "set",
        "printenv",
        "alias",
        "export"
       ],
       "answer": 0,
       "explain": "printenv shows only environment variables; set shows both kinds plus functions, alphabetically."
      },
      {
       "id": "ch11.examine.q2",
       "type": "fill",
       "cmd": "printenv",
       "q": "Print only the value of the USER variable with printenv.",
       "accept": [
        "printenv USER"
       ]
      },
      {
       "id": "ch11.examine.q3",
       "type": "output",
       "cmd": "printenv",
       "q": "Which command produced this output?",
       "out": "me",
       "choices": [
        "printenv USER",
        "printenv HOME",
        "set | less",
        "alias"
       ],
       "answer": 0
      },
      {
       "id": "ch11.examine.q4",
       "type": "mc",
       "cmd": "alias",
       "q": "Which part of the environment is not displayed by either set or printenv?",
       "choices": [
        "Aliases",
        "Environment variables",
        "Shell variables",
        "The PATH value"
       ],
       "answer": 0,
       "explain": "To list aliases, run alias with no arguments."
      }
     ],
     "refs": [
      "echo"
     ]
    },
    {
     "id": "ch11.vars",
     "title": "Some interesting variables",
     "intro": "A handful of variables show up in almost every environment. Their exact values differ between distributions, and some may be absent.",
     "commands": [],
     "terms": [
      {
       "t": "DISPLAY",
       "d": "Name of your graphical display; usually :0, the first display made by the X server.",
       "p": 118
      },
      {
       "t": "EDITOR",
       "d": "The program used for editing text.",
       "p": 118
      },
      {
       "t": "SHELL",
       "d": "The name of your shell program.",
       "p": 118
      },
      {
       "t": "HOME",
       "d": "Path of your home directory.",
       "p": 118
      },
      {
       "t": "LANG",
       "d": "Sets your language's character set and collation order.",
       "p": 118
      },
      {
       "t": "OLDPWD",
       "d": "The working directory you were in before the current one.",
       "p": 118
      },
      {
       "t": "PAGER",
       "d": "Program used to page through output, often /usr/bin/less.",
       "p": 118
      },
      {
       "t": "PATH",
       "d": "Colon-separated directories the shell searches when you type a program name.",
       "p": 118
      },
      {
       "t": "PS1",
       "d": "Prompt string 1: defines what the shell prompt shows. Highly customizable.",
       "p": 118
      },
      {
       "t": "PWD",
       "d": "The current working directory.",
       "p": 118
      },
      {
       "t": "TERM",
       "d": "Your terminal type, which picks the protocol used with your terminal emulator.",
       "p": 118
      },
      {
       "t": "TZ",
       "d": "Your time zone; the clock is kept in UTC and this offset gives local time.",
       "p": 118
      },
      {
       "t": "USER",
       "d": "Your username.",
       "p": 118
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch11.vars.q1",
       "type": "mc",
       "cmd": "printenv",
       "q": "Which variable holds the list of directories searched for executable programs?",
       "choices": [
        "PATH",
        "PWD",
        "HOME",
        "SHELL"
       ],
       "answer": 0,
       "explain": "PATH is a colon-separated list of directories the shell looks through."
      },
      {
       "id": "ch11.vars.q2",
       "type": "mc",
       "cmd": "printenv",
       "q": "Which variable stores the previous working directory?",
       "choices": [
        "OLDPWD",
        "PWD",
        "HOME",
        "TERM"
       ],
       "answer": 0,
       "explain": "PWD is where you are now; OLDPWD is where you were before."
      },
      {
       "id": "ch11.vars.q3",
       "type": "fill",
       "cmd": "printenv",
       "q": "Use printenv to show your time zone setting.",
       "accept": [
        "printenv TZ"
       ]
      },
      {
       "id": "ch11.vars.q4",
       "type": "order",
       "cmd": "printenv",
       "q": "Build: page through the whole environment with less",
       "parts": [
        "printenv",
        "|",
        "less"
       ]
      }
     ]
    },
    {
     "id": "ch11.startup",
     "title": "How the environment is established",
     "intro": "At login, bash runs a series of startup files: system-wide ones first, then personal ones in your home directory. Which files it reads depends on the kind of shell session.",
     "commands": [],
     "terms": [
      {
       "t": "startup files",
       "d": "Configuration scripts bash reads when it starts, setting the default and personal environment.",
       "p": 118
      },
      {
       "t": "login shell",
       "d": "A session that asks for username and password, such as a virtual console.",
       "p": 118
      },
      {
       "t": "non-login shell",
       "d": "A session you typically get by opening a terminal window in the GUI.",
       "p": 118
      },
      {
       "t": "/etc/profile",
       "d": "Login shells: global configuration script for every user.",
       "p": 119
      },
      {
       "t": "~/.bash_profile",
       "d": "Login shells: personal startup file that can extend or override the global settings.",
       "p": 119
      },
      {
       "t": "~/.bash_login",
       "d": "Login shells: read when ~/.bash_profile does not exist.",
       "p": 119
      },
      {
       "t": "~/.profile",
       "d": "Login shells: read if neither ~/.bash_profile nor ~/.bash_login exists. Default on Debian and Ubuntu.",
       "p": 119
      },
      {
       "t": "/etc/bash.bashrc",
       "d": "Non-login shells: global configuration script for every user.",
       "p": 119
      },
      {
       "t": "~/.bashrc",
       "d": "Non-login shells: personal startup file. Nearly always read, so it matters most to ordinary users.",
       "p": 119
      },
      {
       "t": "inherited environment",
       "d": "A non-login shell also receives the environment of its parent process, usually a login shell.",
       "p": 119
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch11.startup.q1",
       "type": "mc",
       "cmd": "source",
       "q": "Opening a terminal window inside the GUI usually starts which kind of session?",
       "choices": [
        "A non-login shell",
        "A login shell",
        "A root shell",
        "A virtual console"
       ],
       "answer": 0,
       "explain": "Login shells are the ones that ask for a username and password."
      },
      {
       "id": "ch11.startup.q2",
       "type": "mc",
       "cmd": "source",
       "q": "A login shell finds no ~/.bash_profile. Which personal file does bash try next?",
       "choices": [
        "~/.bash_login",
        "~/.bashrc",
        "/etc/bash.bashrc",
        "~/.profile"
       ],
       "answer": 0,
       "explain": "The order is ~/.bash_profile, then ~/.bash_login, then ~/.profile."
      },
      {
       "id": "ch11.startup.q3",
       "type": "fill",
       "cmd": "ls",
       "q": "Most startup files are hidden. List the home directory including hidden files.",
       "accept": [
        "ls -a",
        "ls -a ~",
        "ls -a ~/"
       ]
      },
      {
       "id": "ch11.startup.q4",
       "type": "mc",
       "cmd": "source",
       "q": "Why is ~/.bashrc the most important startup file for ordinary users?",
       "choices": [
        "It is almost always read",
        "Only root can edit it",
        "It runs before /etc/profile",
        "It holds the password"
       ],
       "answer": 0,
       "explain": "Every non-login shell reads it, and most login startup files pull it in as well."
      }
     ]
    },
    {
     "id": "ch11.startfile",
     "title": "What's in a startup file",
     "intro": "A typical .bash_profile reads .bashrc, extends PATH, and exports it. Each piece shows a general shell technique.",
     "commands": [
      {
       "id": "export",
       "name": "export",
       "kind": "builtin",
       "summary": "Make variables available to child processes",
       "syntax": "export NAME[=value]",
       "explain": "export marks a variable so that programs started from this shell receive a copy of it. Startup files use it after changing PATH so the new value reaches child processes. You can assign and export in one step.",
       "flags": [],
       "examples": [
        {
         "cmd": "export PATH",
         "out": "",
         "note": "Pass the current PATH to programs launched from this shell.",
         "sim": false
        },
        {
         "cmd": "export HISTSIZE=1000",
         "out": "",
         "note": "Assign a value and export it in one command.",
         "sim": false
        }
       ],
       "chapters": [
        11
       ]
      }
     ],
     "terms": [
      {
       "t": "#",
       "d": "Starts a comment; the shell ignores the rest of the line.",
       "p": 120
      },
      {
       "t": ". ~/.bashrc",
       "d": "In .bash_profile, wrapped in an if test: reads ~/.bashrc when that file exists.",
       "p": 119
      },
      {
       "t": "PATH=$PATH:$HOME/bin",
       "d": "Appends $HOME/bin to the end of the search path, using parameter expansion.",
       "p": 120
      },
      {
       "t": "foo=$foo\"text.\"",
       "d": "Appends text to whatever a variable already holds.",
       "p": 120
      },
      {
       "t": "$HOME/bin",
       "d": "Place for your private programs; once it is in PATH, the shell will find them.",
       "p": 120
      },
      {
       "t": "~/bin on Ubuntu",
       "d": "Debian-based systems check for ~/bin at login and add it to PATH if it exists.",
       "p": 120
      },
      {
       "t": "PATH changes: .bash_profile",
       "d": "Put new PATH directories and extra environment variables here (.profile on Ubuntu).",
       "p": 121
      },
      {
       "t": "everything else: .bashrc",
       "d": "Changes other than PATH and environment variables go in .bashrc.",
       "p": 121
      },
      {
       "t": "files in /etc",
       "d": "Leave system-wide startup files alone unless you administer the system for all users.",
       "p": 121
      }
     ],
     "tasks": [
      {
       "id": "ch11.startfile.t1",
       "prompt": "Set foo to \"This is some \", append \"text.\" to it, export it, then print it with printenv.",
       "hint": "foo=$foo\"text.\" appends; export foo; printenv foo",
       "solution": "foo=\"This is some \"; foo=$foo\"text.\"; export foo; printenv foo",
       "check": [
        {
         "t": "out",
         "re": "This is some text\\."
        },
        {
         "t": "cmd",
         "re": "printenv"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch11.startfile.q1",
       "type": "mc",
       "cmd": "export",
       "q": "What does export PATH do?",
       "choices": [
        "Makes PATH available to child processes",
        "Saves PATH to a file",
        "Deletes PATH",
        "Prints PATH"
       ],
       "answer": 0,
       "explain": "Exported variables are copied into the environment of programs started from the shell."
      },
      {
       "id": "ch11.startfile.q2",
       "type": "order",
       "cmd": "export",
       "q": "Build: add $HOME/bin to the end of PATH",
       "parts": [
        "PATH=",
        "$PATH",
        ":",
        "$HOME/bin"
       ]
      },
      {
       "id": "ch11.startfile.q3",
       "type": "fill",
       "cmd": "export",
       "q": "Set HISTSIZE to 1000 and export it in a single command.",
       "accept": [
        "export HISTSIZE=1000"
       ]
      },
      {
       "id": "ch11.startfile.q4",
       "type": "mc",
       "cmd": "export",
       "q": "On Ubuntu, which file should get your extra PATH directories?",
       "choices": [
        "~/.profile",
        "~/.bashrc",
        "/etc/profile",
        "~/.bash_login"
       ],
       "answer": 0,
       "explain": "PATH and environment variable changes go in .bash_profile or its equivalent, which is .profile on Ubuntu."
      }
     ]
    },
    {
     "id": "ch11.editors",
     "title": "Text editors and editing .bashrc",
     "intro": "Startup files are plain text, so you change them with a text editor. Make a backup first, then add your settings with comments explaining them.",
     "commands": [],
     "terms": [
      {
       "t": "text editor",
       "d": "Like a word processor but for pure text, often with features for writing programs.",
       "p": 121
      },
      {
       "t": "gedit",
       "d": "GNOME's graphical editor, labeled Text Editor in the menu. Start it with gedit some_file.",
       "p": 121
      },
      {
       "t": "kedit, kwrite, kate",
       "d": "KDE's graphical editors, listed from simplest to most complex.",
       "p": 121
      },
      {
       "t": "nano",
       "d": "Simple text-based editor built to replace pico from the PINE email suite.",
       "p": 121
      },
      {
       "t": "vi / vim",
       "d": "Traditional Unix editor; most Linux systems run vim (vi improved) in its place.",
       "p": 122
      },
      {
       "t": "emacs",
       "d": "Huge do-everything programming environment by Richard Stallman; rarely installed by default.",
       "p": 122
      },
      {
       "t": "cp .bashrc .bashrc.bak",
       "d": "Back up a config file before editing it. .bak, .sav, .old, and .orig are common suffixes.",
       "p": 122
      },
      {
       "t": "^X (nano)",
       "d": "Ctrl-X exits nano. The ^ notation means the Ctrl key.",
       "p": 123
      },
      {
       "t": "^O (nano)",
       "d": "Ctrl-O saves (writes out) the file in nano.",
       "p": 123
      },
      {
       "t": "umask 0002",
       "d": "In .bashrc: sets the umask so shared directories work better (see Chapter 9).",
       "p": 123
      },
      {
       "t": "HISTCONTROL=ignoredups",
       "d": "History skips a command that is identical to the one just recorded.",
       "p": 123
      },
      {
       "t": "HISTSIZE=1000",
       "d": "Raises the history size from the usual 500 lines to 1,000.",
       "p": 123
      },
      {
       "t": "uncommenting",
       "d": "Deleting the leading # from a line to turn that setting on. Adding # turns it off.",
       "p": 124
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch11.editors.q1",
       "type": "mc",
       "cmd": "alias",
       "q": "In nano, which key combination saves the file?",
       "choices": [
        "Ctrl-O",
        "Ctrl-X",
        "Ctrl-S",
        "Ctrl-W"
       ],
       "answer": 0,
       "explain": "^O writes the file out; ^X exits."
      },
      {
       "id": "ch11.editors.q2",
       "type": "fill",
       "cmd": "alias",
       "q": "Define an alias ll that runs ls -l --color=auto.",
       "accept": [
        "alias ll='ls -l --color=auto'",
        "alias ll=\"ls -l --color=auto\""
       ]
      },
      {
       "id": "ch11.editors.q3",
       "type": "mc",
       "cmd": "export",
       "q": "What does export HISTCONTROL=ignoredups do?",
       "choices": [
        "History skips a command identical to the one just recorded",
        "History is turned off",
        "Duplicate files are ignored",
        "History grows to 1000 lines"
       ],
       "answer": 0,
       "explain": "It stops consecutive duplicate commands from filling the history."
      },
      {
       "id": "ch11.editors.q4",
       "type": "order",
       "cmd": "cp",
       "q": "Build: back up .bashrc before editing",
       "parts": [
        "cp",
        ".bashrc",
        ".bashrc.bak"
       ]
      }
     ],
     "refs": [
      "alias"
     ]
    },
    {
     "id": "ch11.activate",
     "title": "Activating our changes",
     "intro": "bash reads .bashrc only when a session starts. To use your edits right away, have the current shell read the file again.",
     "commands": [
      {
       "id": "source",
       "name": "source",
       "kind": "builtin",
       "summary": "Read and run a file in the current shell",
       "syntax": "source file",
       "explain": "source makes the running shell read a file and carry out its commands, as if you had typed them. After editing ~/.bashrc, it applies the changes without opening a new terminal. Startup files do the same thing with a leading dot, as in . ~/.bashrc.",
       "flags": [],
       "examples": [
        {
         "cmd": "source ~/.bashrc",
         "out": "",
         "note": "Reload .bashrc so new aliases and settings take effect now.",
         "sim": false
        },
        {
         "cmd": "ll",
         "out": "",
         "note": "Try the new alias after sourcing; it prints a long listing.",
         "sim": false
        },
        {
         "cmd": ". .bashrc",
         "out": "",
         "note": "Rereads .bashrc so a changed PATH applies to this session.",
         "sim": false,
         "ch": 24
        }
       ],
       "chapters": [
        11,
        24
       ]
      }
     ],
     "terms": [
      {
       "t": "new session",
       "d": "Without source, .bashrc edits only apply once you close the terminal and open another.",
       "p": 125
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch11.activate.q1",
       "type": "fill",
       "cmd": "source",
       "q": "Make the current shell reread ~/.bashrc.",
       "accept": [
        "source ~/.bashrc",
        ". ~/.bashrc"
       ]
      },
      {
       "id": "ch11.activate.q2",
       "type": "mc",
       "cmd": "source",
       "q": "You added an alias to .bashrc but it does not work yet. Why?",
       "choices": [
        "The file is read only when a session starts",
        "Aliases need root",
        "nano did not save it",
        "Aliases must go in /etc/profile"
       ],
       "answer": 0,
       "explain": "Start a new session or run source ~/.bashrc."
      },
      {
       "id": "ch11.activate.q3",
       "type": "order",
       "cmd": "source",
       "q": "Build: reload your personal startup file",
       "parts": [
        "source",
        "~/.bashrc"
       ]
      }
     ]
    }
   ]
  },
  {
   "id": "ch12",
   "n": 12,
   "part": 2,
   "title": "A Gentle Introduction to vi",
   "summary": "Modes, movement, editing, search-and-replace, and buffers in vi",
   "lessons": [
    {
     "id": "ch12.start",
     "title": "Starting, quitting, and modes",
     "intro": "vi is a modal editor that is present on almost every Unix-like system. Learn how to get out first, then how to switch between command mode and insert mode and save.",
     "commands": [
      {
       "id": "vi",
       "name": "vi",
       "kind": "cmd",
       "summary": "Modal screen text editor (usually vim on Linux)",
       "syntax": "vi [file...]",
       "explain": "vi opens one or more files for editing, or makes a new file when the name does not exist yet. It starts in command mode, where keys are commands; pressing i switches to insert mode for typing text, and ESC switches back. Commands that begin with a colon are ex commands, such as :w to save and :q to quit. On most Linux systems the vi command actually runs vim.",
       "flags": [],
       "examples": [
        {
         "cmd": "vi",
         "out": "~                         VIM - Vi Improved\n~          type  :q<Enter>               to exit",
         "note": "Start vi with no file; the welcome screen tells you how to quit.",
         "sim": false
        },
        {
         "cmd": "vi foo.txt",
         "out": "\"foo.txt\" [New File]",
         "note": "Open foo.txt, creating it if it does not exist.",
         "sim": false
        },
        {
         "cmd": "vi foo.txt ls-output.txt",
         "out": "",
         "note": "Open two files at once; the first one is displayed.",
         "sim": false
        },
        {
         "cmd": "echo \"set nocp\" >> ~/.vimrc",
         "out": "",
         "note": "Make vim use its enhanced behavior instead of vi compatible mode.",
         "sim": false
        }
       ],
       "chapters": [
        12
       ]
      }
     ],
     "terms": [
      {
       "t": ":q",
       "d": "Quit vi. The colon is part of the command.",
       "p": 129
      },
      {
       "t": ":q!",
       "d": "Quit even though there are unsaved changes, throwing them away.",
       "p": 130
      },
      {
       "t": "ESC ESC",
       "d": "Pressing ESC twice gets you back to a known state if you are lost.",
       "p": 130
      },
      {
       "t": "~ lines",
       "d": "A tilde at the start of a screen line means that line holds no text.",
       "p": 130
      },
      {
       "t": "command mode",
       "d": "The mode vi starts in; nearly every key is a command. vim's docs call it normal mode.",
       "p": 130
      },
      {
       "t": "i",
       "d": "Enter insert mode so typed keys become text. vim shows -- INSERT -- at the bottom.",
       "p": 131
      },
      {
       "t": "ESC",
       "d": "Leave insert mode and return to command mode.",
       "p": 131
      },
      {
       "t": ":",
       "d": "Begin an ex command; a colon appears on the bottom line.",
       "p": 131
      },
      {
       "t": ":w",
       "d": "Write (save) the file to disk.",
       "p": 131
      },
      {
       "t": "compatible mode",
       "d": "vim acting like classic vi. Fix with vim, alias vi='vim', or set nocp in ~/.vimrc.",
       "p": 129
      },
      {
       "t": "ex",
       "d": "The line editor built into vi; its commands are the ones typed after a colon.",
       "p": 128
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch12.start.q1",
       "type": "fill",
       "cmd": "vi",
       "q": "Quit vi and discard unsaved changes.",
       "accept": [
        ":q!"
       ]
      },
      {
       "id": "ch12.start.q2",
       "type": "mc",
       "cmd": "vi",
       "q": "Which mode is vi in right after it starts?",
       "choices": [
        "Command mode",
        "Insert mode",
        "Replace mode",
        "Visual mode"
       ],
       "answer": 0,
       "explain": "vi starts in command mode; press i to begin inserting text."
      },
      {
       "id": "ch12.start.q3",
       "type": "order",
       "cmd": "vi",
       "q": "Order the steps to add a line of text to a new file and save it.",
       "parts": [
        "vi foo.txt",
        "i",
        "type the text",
        "ESC",
        ":w"
       ]
      },
      {
       "id": "ch12.start.q4",
       "type": "output",
       "cmd": "vi",
       "q": "Which command line produced this bottom-line message?",
       "out": "\"foo.txt\" [New File]",
       "choices": [
        "vi foo.txt (foo.txt does not exist)",
        ":w",
        ":q",
        "vi foo.txt ls-output.txt"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch12.move",
     "title": "Moving the cursor",
     "intro": "In command mode, vi has many movement keys, several shared with less. Most of them take a number prefix that repeats the move.",
     "commands": [],
     "terms": [
      {
       "t": "l / right arrow",
       "d": "Move right one character.",
       "p": 131
      },
      {
       "t": "h / left arrow",
       "d": "Move left one character.",
       "p": 131
      },
      {
       "t": "j / down arrow",
       "d": "Move down one line.",
       "p": 131
      },
      {
       "t": "k / up arrow",
       "d": "Move up one line.",
       "p": 132
      },
      {
       "t": "0 (zero)",
       "d": "Jump to the start of the current line.",
       "p": 132
      },
      {
       "t": "^",
       "d": "Jump to the first character on the line that is not whitespace.",
       "p": 132
      },
      {
       "t": "$",
       "d": "Jump to the end of the current line.",
       "p": 132
      },
      {
       "t": "w",
       "d": "Next word or punctuation character.",
       "p": 132
      },
      {
       "t": "W",
       "d": "Next word, treating punctuation as part of words.",
       "p": 132
      },
      {
       "t": "b",
       "d": "Previous word or punctuation character.",
       "p": 132
      },
      {
       "t": "B",
       "d": "Previous word, treating punctuation as part of words.",
       "p": 132
      },
      {
       "t": "Ctrl-F / Page Down",
       "d": "Move down a page.",
       "p": 132
      },
      {
       "t": "Ctrl-B / Page Up",
       "d": "Move up a page.",
       "p": 132
      },
      {
       "t": "numberG",
       "d": "Go to the given line; 1G is the first line.",
       "p": 132
      },
      {
       "t": "G",
       "d": "Go to the last line of the file.",
       "p": 132
      },
      {
       "t": "count prefix",
       "d": "A number before a command repeats it; 5j moves down five lines.",
       "p": 132
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch12.move.q1",
       "type": "mc",
       "cmd": "vi",
       "q": "Which key moves the cursor down one line?",
       "choices": [
        "j",
        "k",
        "h",
        "l"
       ],
       "answer": 0,
       "explain": "h, j, k, l are left, down, up, right."
      },
      {
       "id": "ch12.move.q2",
       "type": "fill",
       "cmd": "vi",
       "q": "Type the command that jumps to the first line of the file.",
       "accept": [
        "1G"
       ]
      },
      {
       "id": "ch12.move.q3",
       "type": "mc",
       "cmd": "vi",
       "q": "What does 5j do?",
       "choices": [
        "Moves down five lines",
        "Joins five lines",
        "Deletes five lines",
        "Jumps to line 5"
       ],
       "answer": 0,
       "explain": "The number is a repeat count for the j movement."
      },
      {
       "id": "ch12.move.q4",
       "type": "mc",
       "cmd": "vi",
       "q": "Which key moves to the end of the current line?",
       "choices": [
        "$",
        "0",
        "^",
        "G"
       ],
       "answer": 0,
       "explain": "0 goes to the start, ^ to the first non-blank, $ to the end."
      }
     ]
    },
    {
     "id": "ch12.edit",
     "title": "Appending, opening lines, and deleting",
     "intro": "Besides i, vi has several other ways into insert mode, plus x and d for removing text. The u key undoes the last change.",
     "commands": [],
     "terms": [
      {
       "t": "u",
       "d": "Undo the last change. Classic vi has one level of undo; vim has many.",
       "p": 132
      },
      {
       "t": "a",
       "d": "Append: enter insert mode just after the cursor, so you can add past the line end.",
       "p": 133
      },
      {
       "t": "A",
       "d": "Jump to the end of the line and start appending there.",
       "p": 133
      },
      {
       "t": "o",
       "d": "Open a new blank line below the current one and enter insert mode.",
       "p": 133
      },
      {
       "t": "O",
       "d": "Open a new blank line above the current one and enter insert mode.",
       "p": 133
      },
      {
       "t": "x",
       "d": "Delete the character under the cursor.",
       "p": 134
      },
      {
       "t": "3x",
       "d": "Delete the character under the cursor plus the two after it.",
       "p": 134
      },
      {
       "t": "dd",
       "d": "Delete the current line.",
       "p": 134
      },
      {
       "t": "5dd",
       "d": "Delete the current line and the four below it.",
       "p": 134
      },
      {
       "t": "dW",
       "d": "Delete from the cursor up to the start of the next word.",
       "p": 134
      },
      {
       "t": "d$",
       "d": "Delete everything from the cursor through the line end.",
       "p": 134
      },
      {
       "t": "d0",
       "d": "Delete from the cursor back to the start of the line.",
       "p": 134
      },
      {
       "t": "d^",
       "d": "Delete from the cursor back to the first non-whitespace character.",
       "p": 134
      },
      {
       "t": "dG",
       "d": "Delete from the current line through the end of the file.",
       "p": 134
      },
      {
       "t": "d20G",
       "d": "Delete from the current line through line 20.",
       "p": 134
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch12.edit.q1",
       "type": "mc",
       "cmd": "vi",
       "q": "Which command moves to the end of the line and starts inserting there?",
       "choices": [
        "A",
        "a",
        "i",
        "o"
       ],
       "answer": 0,
       "explain": "a appends after the cursor; A first jumps to the end of the line."
      },
      {
       "id": "ch12.edit.q2",
       "type": "fill",
       "cmd": "vi",
       "q": "Delete five lines, starting with the one the cursor is on.",
       "accept": [
        "5dd"
       ]
      },
      {
       "id": "ch12.edit.q3",
       "type": "mc",
       "cmd": "vi",
       "q": "Which key opens a new line above the current one?",
       "choices": [
        "O",
        "o",
        "A",
        "P"
       ],
       "answer": 0,
       "explain": "o opens below, O opens above."
      },
      {
       "id": "ch12.edit.q4",
       "type": "output",
       "cmd": "vi",
       "q": "The line was 'The quick brown fox jumped over the lazy dog. It was cool.' with the cursor on 'It'. Which command gave this?",
       "out": "The quick brown fox jumped over the lazy dog.",
       "choices": [
        "d$",
        "dW",
        "dd",
        "x"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch12.paste",
     "title": "Cutting, copying, pasting, and joining",
     "intro": "Whatever d deletes goes into a paste buffer, and y copies into it without deleting. p and P put the buffer back, and J joins lines.",
     "commands": [],
     "terms": [
      {
       "t": "paste buffer",
       "d": "Deleted or yanked text is stored here, much like a clipboard.",
       "p": 135
      },
      {
       "t": "yy",
       "d": "Yank (copy) the current line.",
       "p": 135
      },
      {
       "t": "5yy",
       "d": "Copy the current line and the four below it.",
       "p": 135
      },
      {
       "t": "yW",
       "d": "Copy from the cursor to the start of the next word.",
       "p": 135
      },
      {
       "t": "y$",
       "d": "Copy everything from the cursor through the line end.",
       "p": 135
      },
      {
       "t": "y0",
       "d": "Copy from the cursor back to the start of the line.",
       "p": 135
      },
      {
       "t": "y^",
       "d": "Copy from the cursor back to the first non-whitespace character.",
       "p": 135
      },
      {
       "t": "yG",
       "d": "Copy from the current line through the end of the file.",
       "p": 135
      },
      {
       "t": "y20G",
       "d": "Copy from the current line through line 20.",
       "p": 135
      },
      {
       "t": "p",
       "d": "Paste the buffer after the cursor; a copied line goes below the current line.",
       "p": 136
      },
      {
       "t": "P",
       "d": "Paste the buffer before the cursor; a copied line goes above the current line.",
       "p": 136
      },
      {
       "t": "J",
       "d": "Join the line below onto the current line. Not the same as j.",
       "p": 136
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch12.paste.q1",
       "type": "fill",
       "cmd": "vi",
       "q": "Copy (yank) the current line.",
       "accept": [
        "yy"
       ]
      },
      {
       "id": "ch12.paste.q2",
       "type": "output",
       "cmd": "vi",
       "q": "Lines 3 and 4 read 'Line 3' and 'Line 4'. With the cursor on line 3, which key produced this?",
       "out": "Line 3 Line 4",
       "choices": [
        "J",
        "j",
        "p",
        "dd"
       ],
       "answer": 0
      },
      {
       "id": "ch12.paste.q3",
       "type": "mc",
       "cmd": "vi",
       "q": "You copied a line with yy. Which key pastes it above the current line?",
       "choices": [
        "P",
        "p",
        "u",
        "O"
       ],
       "answer": 0,
       "explain": "p puts the text below or after; P puts it above or before."
      },
      {
       "id": "ch12.paste.q4",
       "type": "order",
       "cmd": "vi",
       "q": "Order the keys to copy the first line and paste it after the last line.",
       "parts": [
        "1G",
        "yy",
        "G",
        "p"
       ]
      }
     ]
    },
    {
     "id": "ch12.search",
     "title": "Searching and replacing",
     "intro": "vi can jump to a character within a line or to a word anywhere in the file. A colon substitution command replaces text, with or without asking first.",
     "commands": [],
     "terms": [
      {
       "t": "f",
       "d": "Find a character on the current line; fa jumps to the next a.",
       "p": 137
      },
      {
       "t": ";",
       "d": "Repeat the last f character search.",
       "p": 137
      },
      {
       "t": "/",
       "d": "Search the file: type /, the word or phrase, then Enter.",
       "p": 137
      },
      {
       "t": "n",
       "d": "Repeat the previous search to find the next match.",
       "p": 137
      },
      {
       "t": ":%s/Line/line/g",
       "d": "Change every Line to line throughout the file.",
       "p": 137
      },
      {
       "t": "% (range)",
       "d": "Every line from first to last. 1,5 or 1,$ also work; with no range only the current line changes.",
       "p": 138
      },
      {
       "t": "s",
       "d": "The substitute operation: search and replace.",
       "p": 138
      },
      {
       "t": "g (flag)",
       "d": "Replace each match on a line; without it, only the first match per line changes.",
       "p": 138
      },
      {
       "t": "c (flag)",
       "d": "Ask before each replacement, e.g. :%s/line/Line/gc.",
       "p": 138
      },
      {
       "t": "y (confirm)",
       "d": "Make this replacement.",
       "p": 138
      },
      {
       "t": "n (confirm)",
       "d": "Leave this match alone and go to the next one.",
       "p": 138
      },
      {
       "t": "a (confirm)",
       "d": "Replace this match and all the ones after it.",
       "p": 138
      },
      {
       "t": "q / ESC (confirm)",
       "d": "Stop substituting.",
       "p": 138
      },
      {
       "t": "l (confirm)",
       "d": "Replace this one, then stop. Short for last.",
       "p": 139
      },
      {
       "t": "Ctrl-E / Ctrl-Y (confirm)",
       "d": "Scroll down or up to see the text around the proposed change.",
       "p": 139
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch12.search.q1",
       "type": "fill",
       "cmd": "vi",
       "q": "Replace every Line with line in the whole file, no confirmation.",
       "accept": [
        ":%s/Line/line/g"
       ]
      },
      {
       "id": "ch12.search.q2",
       "type": "mc",
       "cmd": "vi",
       "q": "After a / search, which key jumps to the next match?",
       "choices": [
        "n",
        ";",
        "N",
        "f"
       ],
       "answer": 0,
       "explain": "; repeats an f search within a line; n repeats a / search."
      },
      {
       "id": "ch12.search.q3",
       "type": "order",
       "cmd": "vi",
       "q": "Build: substitute line with Line on all lines, every match, asking each time",
       "parts": [
        ":",
        "%",
        "s",
        "/line/Line/",
        "g",
        "c"
       ]
      },
      {
       "id": "ch12.search.q4",
       "type": "mc",
       "cmd": "vi",
       "q": "At the confirm prompt, which key replaces this match and then stops?",
       "choices": [
        "l",
        "a",
        "y",
        "q"
       ],
       "answer": 0,
       "explain": "l means last: do this one, then quit."
      }
     ]
    },
    {
     "id": "ch12.files",
     "title": "Multiple files and saving",
     "intro": "vi can hold several files in buffers and move between them, open more mid-session, or read a whole file in. There are also several ways to save.",
     "commands": [],
     "terms": [
      {
       "t": "vi file1 file2",
       "d": "Open several files; each goes in its own buffer.",
       "p": 139
      },
      {
       "t": ":bn",
       "d": "Switch to the next buffer (file).",
       "p": 139
      },
      {
       "t": ":bp",
       "d": "Switch to the previous buffer.",
       "p": 139
      },
      {
       "t": "! (force)",
       "d": "vi refuses to switch away from unsaved changes; add ! to switch and drop them.",
       "p": 140
      },
      {
       "t": ":buffers",
       "d": "List the files being edited, with their buffer numbers.",
       "p": 140
      },
      {
       "t": ":buffer N",
       "d": "Switch to buffer number N, e.g. :buffer 2.",
       "p": 140
      },
      {
       "t": ":e file",
       "d": "Edit: open another file in the current session.",
       "p": 140
      },
      {
       "t": ":r file",
       "d": "Read: insert the whole file below the cursor.",
       "p": 142
      },
      {
       "t": "ZZ",
       "d": "In command mode, save the file and exit.",
       "p": 142
      },
      {
       "t": ":wq",
       "d": "Write and quit in one command.",
       "p": 142
      },
      {
       "t": ":w file",
       "d": "Save under another name, like Save As; you keep editing the original.",
       "p": 142
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch12.files.q1",
       "type": "mc",
       "cmd": "vi",
       "q": "Which ex command inserts the contents of foo.txt below the cursor?",
       "choices": [
        ":r foo.txt",
        ":e foo.txt",
        ":w foo.txt",
        ":buffer foo.txt"
       ],
       "answer": 0,
       "explain": ":e opens a file in a new buffer; :r reads it into the current one."
      },
      {
       "id": "ch12.files.q2",
       "type": "fill",
       "cmd": "vi",
       "q": "Save the file and exit vi with an ex command.",
       "accept": [
        ":wq"
       ]
      },
      {
       "id": "ch12.files.q3",
       "type": "output",
       "cmd": "vi",
       "q": "Which ex command printed this list?",
       "out": "  1 %a   \"foo.txt\"                      line 1\n  2      \"ls-output.txt\"                line 0",
       "choices": [
        ":buffers",
        ":bn",
        ":e ls-output.txt",
        ":r foo.txt"
       ],
       "answer": 0
      },
      {
       "id": "ch12.files.q4",
       "type": "mc",
       "cmd": "vi",
       "q": "While editing foo.txt you run :w foo1.txt. Which file are you editing afterwards?",
       "choices": [
        "foo.txt",
        "foo1.txt",
        "Both",
        "Neither; vi exits"
       ],
       "answer": 0,
       "explain": "Writing under a new name does not change the file being edited."
      }
     ]
    }
   ]
  },
  {
   "id": "ch13",
   "n": 13,
   "part": 2,
   "title": "Customizing the Prompt",
   "summary": "Build your own PS1 prompt with escape codes, colors, and cursor control",
   "lessons": [
    {
     "id": "ch13.anatomy",
     "title": "Anatomy of a prompt",
     "intro": "The prompt comes from the PS1 variable. Its odd-looking backslash sequences are special codes that bash swaps for things like your username and directory.",
     "commands": [
      {
       "id": "ps1",
       "name": "PS1",
       "kind": "syntax",
       "summary": "Prompt string 1: the variable that defines the shell prompt",
       "syntax": "PS1=\"string\"",
       "explain": "bash shows the contents of PS1 each time it is ready for a command. Backslash escape codes inside it expand to live values such as user, host, directory, or time. Assigning a new string changes the prompt at once for the current session.",
       "flags": [],
       "examples": [
        {
         "cmd": "echo $PS1",
         "note": "Show the current prompt definition, e.g. [\\u@\\h \\W]\\$",
         "sim": true
        },
        {
         "cmd": "ps1_old=\"$PS1\"",
         "out": "",
         "note": "Back up the prompt in a variable of your own.",
         "sim": false
        },
        {
         "cmd": "PS1=\"$ps1_old\"",
         "out": "",
         "note": "Put the saved prompt back.",
         "sim": false
        },
        {
         "cmd": "PS1=\"\\A \\h \\$ \"",
         "out": "17:33 linuxbox $",
         "note": "Prompt with 24-hour time and hostname.",
         "sim": false
        },
        {
         "cmd": "PS1=\"<\\u@\\h \\W>\\$ \"",
         "out": "<me@linuxbox ~>$",
         "note": "Like the default, with angle brackets in place of square ones.",
         "sim": false
        }
       ],
       "chapters": [
        13
       ]
      }
     ],
     "terms": [
      {
       "t": "\\a",
       "d": "ASCII bell: the computer beeps.",
       "p": 146
      },
      {
       "t": "\\d",
       "d": "Date as day, month, date, e.g. Mon May 26.",
       "p": 146
      },
      {
       "t": "\\h",
       "d": "Local hostname without the domain part.",
       "p": 146
      },
      {
       "t": "\\H",
       "d": "Full hostname.",
       "p": 146
      },
      {
       "t": "\\j",
       "d": "How many jobs are running in this shell session.",
       "p": 146
      },
      {
       "t": "\\l",
       "d": "Name of the current terminal device.",
       "p": 146
      },
      {
       "t": "\\n",
       "d": "Newline.",
       "p": 146
      },
      {
       "t": "\\r",
       "d": "Carriage return.",
       "p": 146
      },
      {
       "t": "\\s",
       "d": "Name of the shell program.",
       "p": 146
      },
      {
       "t": "\\t",
       "d": "Time in 24-hour hours:minutes:seconds.",
       "p": 146
      },
      {
       "t": "\\T",
       "d": "Time in 12-hour format.",
       "p": 146
      },
      {
       "t": "\\@",
       "d": "Time in 12-hour format with AM/PM.",
       "p": 146
      },
      {
       "t": "\\A",
       "d": "Time in 24-hour hours:minutes.",
       "p": 146
      },
      {
       "t": "\\u",
       "d": "Current user's username.",
       "p": 146
      },
      {
       "t": "\\v",
       "d": "Shell version number.",
       "p": 146
      },
      {
       "t": "\\V",
       "d": "Shell version and release numbers.",
       "p": 146
      },
      {
       "t": "\\w",
       "d": "Current working directory name.",
       "p": 146
      },
      {
       "t": "\\W",
       "d": "Only the last part of the working directory name.",
       "p": 146
      },
      {
       "t": "\\!",
       "d": "History number of this command.",
       "p": 146
      },
      {
       "t": "\\#",
       "d": "Count of commands entered in this shell session.",
       "p": 146
      },
      {
       "t": "\\$",
       "d": "Shows $ for normal users and # for the superuser.",
       "p": 146
      },
      {
       "t": "\\[",
       "d": "Marks the start of non-printing characters, e.g. color or cursor control codes.",
       "p": 146
      },
      {
       "t": "\\]",
       "d": "Marks the end of a non-printing sequence.",
       "p": 146
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch13.anatomy.q1",
       "type": "mc",
       "cmd": "ps1",
       "q": "Which escape code shows only the last part of the working directory?",
       "choices": [
        "\\W",
        "\\w",
        "\\h",
        "\\u"
       ],
       "answer": 0,
       "explain": "\\w is the full working directory name; \\W is just its final part."
      },
      {
       "id": "ch13.anatomy.q2",
       "type": "fill",
       "cmd": "ps1",
       "q": "Display the current prompt string definition.",
       "accept": [
        "echo $PS1",
        "echo \"$PS1\""
       ]
      },
      {
       "id": "ch13.anatomy.q3",
       "type": "mc",
       "cmd": "ps1",
       "q": "What does \\$ display in the prompt?",
       "choices": [
        "$ for normal users, # for the superuser",
        "Always a dollar sign",
        "The value of $HOME",
        "The last exit status"
       ],
       "answer": 0,
       "explain": "It changes to # when you have superuser privileges."
      },
      {
       "id": "ch13.anatomy.q4",
       "type": "output",
       "cmd": "ps1",
       "q": "Which assignment produces this prompt?",
       "out": "<me@linuxbox ~>$",
       "choices": [
        "PS1=\"<\\u@\\h \\W>\\$ \"",
        "PS1=\"\\A \\h \\$ \"",
        "PS1=\"[\\u@\\h \\w]\\$ \"",
        "PS1=\"\\$ \""
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch13.try",
     "title": "Trying alternative prompts",
     "intro": "Save the current prompt in a variable before you experiment so you can restore it. Then try simple designs and see what each escape does.",
     "commands": [],
     "terms": [
      {
       "t": "ps1_old=\"$PS1\"",
       "d": "Copy the current prompt into your own variable as a backup.",
       "p": 147
      },
      {
       "t": "PS1=\"$ps1_old\"",
       "d": "Restore the backed-up prompt during this session.",
       "p": 147
      },
      {
       "t": "PS1=",
       "d": "An empty prompt: the shell still waits for input but shows nothing.",
       "p": 147
      },
      {
       "t": "PS1=\"\\$ \"",
       "d": "Minimal prompt; the space inside the quotes separates $ from the cursor.",
       "p": 147
      },
      {
       "t": "PS1=\"\\[\\a\\]\\$ \"",
       "d": "Beep at every prompt. \\[ \\] wrap the bell so bash measures the prompt length correctly.",
       "p": 147
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch13.try.q1",
       "type": "order",
       "cmd": "ps1",
       "q": "Build: back up the current prompt into ps1_old",
       "parts": [
        "ps1_old=",
        "\"",
        "$PS1",
        "\""
       ]
      },
      {
       "id": "ch13.try.q2",
       "type": "mc",
       "cmd": "ps1",
       "q": "Why wrap \\a in \\[ and \\] when adding a bell to the prompt?",
       "choices": [
        "The bell prints nothing, so bash must not count it in the prompt length",
        "It makes the bell louder",
        "Without them the bell is printed as text",
        "They repeat the bell"
       ],
       "answer": 0,
       "explain": "Non-printing characters must be marked so bash can work out where the cursor is."
      },
      {
       "id": "ch13.try.q3",
       "type": "fill",
       "cmd": "ps1",
       "q": "Set a minimal prompt showing just the dollar sign and a trailing space.",
       "accept": [
        "PS1=\"\\$ \"",
        "PS1='\\$ '"
       ]
      }
     ]
    },
    {
     "id": "ch13.color",
     "title": "Adding color",
     "intro": "Terminal emulators follow ANSI escape codes that change text color and attributes. Inside PS1 these codes go between \\[ and \\].",
     "commands": [],
     "terms": [
      {
       "t": "\\033",
       "d": "Octal code for the ESC character; every ANSI escape code starts with it.",
       "p": 148
      },
      {
       "t": "ANSI escape code",
       "d": "ESC, an optional attribute, then an instruction. The terminal acts on it rather than printing it.",
       "p": 148
      },
      {
       "t": "\\033[0;30m",
       "d": "Text color black (attribute 0 = normal).",
       "p": 149
      },
      {
       "t": "\\033[0;31m",
       "d": "Text color red. \\033[1;31m is light red.",
       "p": 149
      },
      {
       "t": "\\033[0;32m",
       "d": "Text color green. \\033[1;32m is light green.",
       "p": 149
      },
      {
       "t": "\\033[0;33m",
       "d": "Text color brown. \\033[1;33m is yellow.",
       "p": 149
      },
      {
       "t": "\\033[0;34m",
       "d": "Text color blue. \\033[1;34m is light blue.",
       "p": 149
      },
      {
       "t": "\\033[0;35m",
       "d": "Text color purple. \\033[1;35m is light purple.",
       "p": 149
      },
      {
       "t": "\\033[0;36m",
       "d": "Text color cyan. \\033[1;36m is light cyan.",
       "p": 149
      },
      {
       "t": "\\033[0;37m",
       "d": "Text color light gray. \\033[1;37m is white; \\033[1;30m is dark gray.",
       "p": 149
      },
      {
       "t": "attribute 1 (bold)",
       "d": "Gives the lighter variant of each text color.",
       "p": 149
      },
      {
       "t": "\\033[0m",
       "d": "Back to the previous color so typed commands are not colored too.",
       "p": 149
      },
      {
       "t": "\\033[0;40m-47m",
       "d": "Backgrounds: 40 black, 41 red, 42 green, 43 brown, 44 blue, 45 purple, 46 cyan, 47 light gray.",
       "p": 149
      },
      {
       "t": "background bold",
       "d": "Bold (attribute 1) has no effect on background colors.",
       "p": 149
      },
      {
       "t": "attributes 4, 5, 7",
       "d": "Underscore, blinking, and inverse. Many terminals refuse to blink.",
       "p": 150
      },
      {
       "t": "termcap / terminfo",
       "d": "Unix subsystems that handle the differences between terminal types.",
       "p": 148
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch13.color.q1",
       "type": "mc",
       "cmd": "ps1",
       "q": "Which sequence sets the text color to red?",
       "choices": [
        "\\033[0;31m",
        "\\033[0;41m",
        "\\033[0;32m",
        "\\033[0m"
       ],
       "answer": 0,
       "explain": "3x codes set text color; 4x codes set background color."
      },
      {
       "id": "ch13.color.q2",
       "type": "mc",
       "cmd": "ps1",
       "q": "Your prompt is red, but so is everything you type after it. What is missing?",
       "choices": [
        "\\[\\033[0m\\] at the end of the prompt",
        "A trailing space",
        "export PS1",
        "\\033[1;31m at the start"
       ],
       "answer": 0,
       "explain": "\\033[0m switches the terminal back to the previous color."
      },
      {
       "id": "ch13.color.q3",
       "type": "fill",
       "cmd": "ps1",
       "q": "Write the escape sequence for a red background.",
       "accept": [
        "\\033[0;41m"
       ]
      },
      {
       "id": "ch13.color.q4",
       "type": "order",
       "cmd": "ps1",
       "q": "Build a red prompt that resets color afterward",
       "parts": [
        "PS1=\"",
        "\\[\\033[0;31m\\]",
        "<\\u@\\h \\W>\\$",
        "\\[\\033[0m\\]",
        " \""
       ]
      }
     ]
    },
    {
     "id": "ch13.cursor",
     "title": "Moving the cursor",
     "intro": "Escape codes can also move the cursor, for example to draw a clock in a corner every time the prompt appears.",
     "commands": [],
     "terms": [
      {
       "t": "\\033[l;cH",
       "d": "Put the cursor at line l, column c.",
       "p": 150
      },
      {
       "t": "\\033[nA",
       "d": "Move the cursor up n lines.",
       "p": 150
      },
      {
       "t": "\\033[nB",
       "d": "Move the cursor down n lines.",
       "p": 150
      },
      {
       "t": "\\033[nC",
       "d": "Move the cursor forward n characters.",
       "p": 150
      },
      {
       "t": "\\033[nD",
       "d": "Move the cursor back n characters.",
       "p": 150
      },
      {
       "t": "\\033[2J",
       "d": "Clear the screen and put the cursor in the top-left corner.",
       "p": 150
      },
      {
       "t": "\\033[K",
       "d": "Erase from the cursor position to the line's end.",
       "p": 150
      },
      {
       "t": "\\033[s",
       "d": "Save the cursor position. Some terminals ignore this.",
       "p": 150
      },
      {
       "t": "\\033[u",
       "d": "Return the cursor to the saved position.",
       "p": 150
      },
      {
       "t": "clock bar prompt",
       "d": "Save cursor, go to 0;0, red background, clear line, yellow \\t, reset, restore cursor.",
       "p": 151
      },
      {
       "t": "\\t inside \\[ \\]",
       "d": "The clock prints, but is kept in the non-printing part so it doesn't count toward prompt length.",
       "p": 151
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch13.cursor.q1",
       "type": "mc",
       "cmd": "ps1",
       "q": "Which escape code saves the current cursor position?",
       "choices": [
        "\\033[s",
        "\\033[u",
        "\\033[K",
        "\\033[2J"
       ],
       "answer": 0,
       "explain": "\\033[s stores the position; \\033[u restores it."
      },
      {
       "id": "ch13.cursor.q2",
       "type": "mc",
       "cmd": "ps1",
       "q": "In the clock-bar prompt, what makes the top line red?",
       "choices": [
        "A red background set, then \\033[K clears the line in that color",
        "\\033[2J",
        "\\033[1;33m",
        "\\033[0;0H alone"
       ],
       "answer": 0,
       "explain": "Clearing to end of line paints it with the current background color."
      },
      {
       "id": "ch13.cursor.q3",
       "type": "fill",
       "cmd": "ps1",
       "q": "Write the escape code that moves the cursor up 3 lines.",
       "accept": [
        "\\033[3A"
       ]
      }
     ]
    },
    {
     "id": "ch13.save",
     "title": "Saving the prompt",
     "intro": "A prompt set at the command line lasts only for that session. Add it to .bashrc to make it permanent.",
     "commands": [],
     "terms": [
      {
       "t": "PS1=... in .bashrc",
       "d": "Put your PS1 assignment in ~/.bashrc so each new shell gets it.",
       "p": 151
      },
      {
       "t": "export PS1",
       "d": "Second line added to .bashrc, after the assignment.",
       "p": 151
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch13.save.q1",
       "type": "mc",
       "cmd": "ps1",
       "q": "Where do you put a custom prompt to keep it for future sessions?",
       "choices": [
        "~/.bashrc",
        "/etc/passwd",
        "~/.vimrc",
        "/tmp"
       ],
       "answer": 0,
       "explain": "Add the PS1 assignment and export PS1 to .bashrc."
      },
      {
       "id": "ch13.save.q2",
       "type": "fill",
       "cmd": "ps1",
       "q": "After assigning PS1 in .bashrc, which line exports it?",
       "accept": [
        "export PS1"
       ]
      },
      {
       "id": "ch13.save.q3",
       "type": "order",
       "cmd": "ps1",
       "q": "Order the two lines to add to .bashrc for a saved prompt",
       "parts": [
        "PS1=\"<\\u@\\h \\W>\\$ \"",
        "export PS1"
       ]
      }
     ]
    }
   ]
  },
  {
   "id": "ch14",
   "n": 14,
   "part": 3,
   "title": "Package Management",
   "summary": "Install, remove, update and query software packages on Debian and Red Hat",
   "lessons": [
    {
     "id": "ch14.concepts",
     "title": "How Packaging Systems Work",
     "intro": "Most Linux software arrives as packages from your distribution. Learn the two big packaging families and the vocabulary behind them.",
     "commands": [],
     "terms": [
      {
       "t": "Debian-style (.deb)",
       "d": "Packaging family used by Debian, Ubuntu, Linux Mint and Raspbian.",
       "p": 156
      },
      {
       "t": "Red Hat-style (.rpm)",
       "d": "Packaging family used by Fedora, CentOS, Red Hat Enterprise Linux and OpenSUSE.",
       "p": 156
      },
      {
       "t": "package file",
       "d": "A compressed bundle holding a program's files plus metadata and often setup scripts run before or after install.",
       "p": 156
      },
      {
       "t": "package maintainer",
       "d": "The person who compiles upstream source, writes the metadata and install scripts, and builds the package.",
       "p": 157
      },
      {
       "t": "upstream provider",
       "d": "The original author of a program, from whom the maintainer obtains the source code.",
       "p": 157
      },
      {
       "t": "repository",
       "d": "A central store of packages built for a distribution; there may be separate testing and development ones.",
       "p": 157
      },
      {
       "t": "third-party repository",
       "d": "An independent repository for software a distribution can't ship for legal reasons; must be added to the config by hand.",
       "p": 157
      },
      {
       "t": "shared library",
       "d": "A set of common routines (such as I/O) used by many programs at once.",
       "p": 157
      },
      {
       "t": "dependency",
       "d": "A shared resource, like a library, that a package needs in order to work.",
       "p": 157
      },
      {
       "t": "dependency resolution",
       "d": "The package system's job of making sure everything a package needs gets installed along with it.",
       "p": 157
      },
      {
       "t": "low-level tools",
       "d": "Tools that install and remove package files: dpkg on Debian, rpm on Red Hat.",
       "p": 158
      },
      {
       "t": "high-level tools",
       "d": "Tools that search metadata and resolve dependencies: apt-get, apt, aptitude on Debian; yum, dnf on Red Hat.",
       "p": 158
      },
      {
       "t": "package_name vs package_file",
       "d": "package_name is the package's name; package_file names the file holding that package.",
       "p": 158
      }
     ],
     "quiz": [
      {
       "id": "ch14.concepts.q1",
       "type": "mc",
       "cmd": "rpm",
       "q": "Which distribution uses the Red Hat-style (.rpm) packaging system?",
       "choices": [
        "Fedora",
        "Ubuntu",
        "Linux Mint",
        "Raspbian"
       ],
       "answer": 0,
       "explain": "Fedora, CentOS, RHEL and OpenSUSE belong to the .rpm camp; the others are .deb based."
      },
      {
       "id": "ch14.concepts.q2",
       "type": "mc",
       "cmd": "dpkg",
       "q": "What does a high-level package tool add on top of a low-level one?",
       "choices": [
        "Metadata searching and dependency resolution",
        "The ability to remove packages",
        "Compression of package files",
        "Compiling source code"
       ],
       "answer": 0,
       "explain": "Low-level tools install and remove package files; high-level tools search metadata and resolve dependencies."
      },
      {
       "id": "ch14.concepts.q3",
       "type": "mc",
       "cmd": "apt-get",
       "q": "Which of these is the low-level tool on Debian-style systems?",
       "choices": [
        "dpkg",
        "apt-get",
        "aptitude",
        "yum"
       ],
       "answer": 0,
       "explain": "dpkg is the Debian low-level tool; apt-get and aptitude are high-level."
      }
     ]
    },
    {
     "id": "ch14.debian",
     "title": "Debian Tools: apt-get, apt-cache, dpkg",
     "intro": "On Debian-style systems, apt-get and apt-cache work with repositories while dpkg handles individual package files.",
     "commands": [
      {
       "id": "apt-get",
       "name": "apt-get",
       "kind": "cmd",
       "summary": "High-level Debian tool to install, remove and update packages",
       "syntax": "apt-get command [package_name]",
       "explain": "apt-get downloads packages from repositories and installs them along with their dependencies. Run update first so the local copy of the repository metadata is current. It usually needs superuser privileges.",
       "flags": [
        {
         "f": "update",
         "d": "Refresh the list of available packages from the repositories.",
         "p": 158,
         "ch": 14
        },
        {
         "f": "install",
         "d": "Download a package from a repository and install it with all its dependencies.",
         "p": 159,
         "ch": 14
        },
        {
         "f": "remove",
         "d": "Uninstall the named package.",
         "p": 160,
         "ch": 14
        },
        {
         "f": "upgrade",
         "d": "Bring every installed package up to its newest available version.",
         "p": 160,
         "ch": 14
        }
       ],
       "examples": [
        {
         "cmd": "apt-get update; apt-get install emacs",
         "out": "",
         "note": "Refreshes the package lists, then installs the emacs editor.",
         "sim": false
        },
        {
         "cmd": "apt-get remove emacs",
         "out": "",
         "note": "Uninstalls the emacs package.",
         "sim": false
        },
        {
         "cmd": "apt-get update; apt-get upgrade",
         "out": "",
         "note": "Applies all available updates to installed packages.",
         "sim": false
        }
       ],
       "chapters": [
        14
       ]
      },
      {
       "id": "apt-cache",
       "name": "apt-cache",
       "kind": "cmd",
       "summary": "Search and describe packages in Debian repository metadata",
       "syntax": "apt-cache command argument",
       "explain": "apt-cache queries the repository metadata without installing anything. Use search to find packages by name or description, and show to print a package's description.",
       "flags": [
        {
         "f": "search",
         "d": "Look up packages whose name or description matches the given string.",
         "p": 158,
         "ch": 14
        },
        {
         "f": "show",
         "d": "Print the description of the named package.",
         "p": 161,
         "ch": 14
        }
       ],
       "examples": [
        {
         "cmd": "apt-cache search emacs",
         "out": "",
         "note": "Lists repository packages that match emacs.",
         "sim": false
        },
        {
         "cmd": "apt-cache show emacs",
         "out": "",
         "note": "Describes the emacs package.",
         "sim": false
        }
       ],
       "chapters": [
        14
       ]
      },
      {
       "id": "dpkg",
       "name": "dpkg",
       "kind": "cmd",
       "summary": "Low-level Debian tool for package files and installed packages",
       "syntax": "dpkg option package_file|package_name",
       "explain": "dpkg installs a downloaded .deb file directly, but it performs no dependency resolution. It also reports what is installed and which package owns a file. It has no separate upgrade option: -i serves for both installing and upgrading.",
       "flags": [
        {
         "f": "-i",
         "d": "Install (or upgrade to) the given package file, without resolving dependencies.",
         "p": 159,
         "ch": 14
        },
        {
         "f": "-l",
         "d": "List every package installed on the system.",
         "p": 161,
         "ch": 14
        },
        {
         "f": "-s",
         "d": "Report whether the named package is installed.",
         "p": 161,
         "ch": 14
        },
        {
         "f": "-S",
         "d": "Show which package installed the given file.",
         "p": 162,
         "ch": 14
        }
       ],
       "examples": [
        {
         "cmd": "dpkg -i package_file",
         "out": "",
         "note": "Installs a .deb file obtained outside a repository.",
         "sim": false
        },
        {
         "cmd": "dpkg -s emacs",
         "out": "",
         "note": "Checks whether emacs is installed.",
         "sim": false
        },
        {
         "cmd": "dpkg -l",
         "out": "",
         "note": "Lists all installed packages.",
         "sim": false
        }
       ],
       "chapters": [
        14
       ]
      }
     ],
     "terms": [
      {
       "t": "apt / aptitude",
       "d": "Other high-level package tools for Debian-style systems, alongside apt-get.",
       "p": 158
      }
     ],
     "quiz": [
      {
       "id": "ch14.debian.q1",
       "type": "fill",
       "cmd": "apt-get",
       "q": "On a Debian system, uninstall the emacs package.",
       "accept": [
        "apt-get remove emacs"
       ]
      },
      {
       "id": "ch14.debian.q2",
       "type": "order",
       "cmd": "apt-get",
       "q": "Build: refresh package lists, then install emacs",
       "parts": [
        "apt-get",
        "update;",
        "apt-get",
        "install",
        "emacs"
       ]
      },
      {
       "id": "ch14.debian.q3",
       "type": "mc",
       "cmd": "dpkg",
       "q": "Which dpkg option tells you which package installed a particular file?",
       "choices": [
        "-S",
        "-s",
        "-l",
        "-i"
       ],
       "answer": 0,
       "explain": "Capital -S searches for the owner of a file; lowercase -s shows a package's status."
      },
      {
       "id": "ch14.debian.q4",
       "type": "output",
       "cmd": "dpkg",
       "q": "You want a listing like this on a Debian system. Which command gives it?",
       "out": "(every package installed on the system)",
       "choices": [
        "dpkg -l",
        "dpkg -s",
        "apt-cache show",
        "apt-get update"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch14.redhat",
     "title": "Red Hat Tools: yum and rpm",
     "intro": "Red Hat-style systems pair the low-level rpm program with a high-level tool such as yum.",
     "commands": [
      {
       "id": "yum",
       "name": "yum",
       "kind": "cmd",
       "summary": "High-level Red Hat tool to search, install, erase and update packages",
       "syntax": "yum command [package_name]",
       "explain": "yum is the high-level package tool on Red Hat Enterprise Linux and CentOS. It searches repositories and installs packages together with their dependencies. Unlike apt-get, a single update step applies all available updates.",
       "flags": [
        {
         "f": "search",
         "d": "Find repository packages by name or description.",
         "p": 158,
         "ch": 14
        },
        {
         "f": "install",
         "d": "Download and install a package, resolving its dependencies.",
         "p": 159,
         "ch": 14
        },
        {
         "f": "erase",
         "d": "Uninstall the named package.",
         "p": 160,
         "ch": 14
        },
        {
         "f": "update",
         "d": "Update installed packages to the latest versions in one step.",
         "p": 160,
         "ch": 14
        },
        {
         "f": "info",
         "d": "Show a description of the named package.",
         "p": 161,
         "ch": 14
        }
       ],
       "examples": [
        {
         "cmd": "yum search emacs",
         "out": "",
         "note": "Searches the repository for the emacs editor.",
         "sim": false
        },
        {
         "cmd": "yum install emacs",
         "out": "",
         "note": "Installs emacs with its dependencies.",
         "sim": false
        },
        {
         "cmd": "yum update",
         "out": "",
         "note": "Brings the whole system up to date.",
         "sim": false
        }
       ],
       "chapters": [
        14
       ]
      },
      {
       "id": "rpm",
       "name": "rpm",
       "kind": "cmd",
       "summary": "Low-level Red Hat tool for package files and package queries",
       "syntax": "rpm option package_file|package_name|file_name",
       "explain": "rpm installs and upgrades .rpm files directly and queries the database of installed packages. Because it is low-level, it does no dependency resolution and exits with an error if something is missing.",
       "flags": [
        {
         "f": "-i",
         "d": "Install a package file without dependency resolution.",
         "p": 159,
         "ch": 14
        },
        {
         "f": "-U",
         "d": "Upgrade: replace an installed package with the version in the given file.",
         "p": 160,
         "ch": 14
        },
        {
         "f": "-qa",
         "d": "List all installed packages.",
         "p": 161,
         "ch": 14
        },
        {
         "f": "-q",
         "d": "Check whether the named package is installed.",
         "p": 161,
         "ch": 14
        },
        {
         "f": "-qf",
         "d": "Identify the package that installed the given file.",
         "p": 162,
         "ch": 14
        }
       ],
       "examples": [
        {
         "cmd": "rpm -i emacs-22.1-7.fc7-i386.rpm",
         "out": "",
         "note": "Installs a package file downloaded from outside a repository.",
         "sim": false
        },
        {
         "cmd": "rpm -U emacs-22.1-7.fc7-i386.rpm",
         "out": "",
         "note": "Upgrades the existing emacs to this file's version.",
         "sim": false
        },
        {
         "cmd": "rpm -qf /usr/bin/vim",
         "out": "",
         "note": "Shows which package owns /usr/bin/vim.",
         "sim": false
        }
       ],
       "chapters": [
        14
       ]
      }
     ],
     "terms": [
      {
       "t": "dnf",
       "d": "Another high-level package tool for Red Hat-style distributions, comparable to yum.",
       "p": 158
      }
     ],
     "quiz": [
      {
       "id": "ch14.redhat.q1",
       "type": "mc",
       "cmd": "yum",
       "q": "Which yum subcommand removes a package?",
       "choices": [
        "erase",
        "remove",
        "delete",
        "purge"
       ],
       "answer": 0,
       "explain": "The book's table uses yum erase package_name."
      },
      {
       "id": "ch14.redhat.q2",
       "type": "fill",
       "cmd": "rpm",
       "q": "Find out which package installed /usr/bin/vim on a Red Hat system.",
       "accept": [
        "rpm -qf /usr/bin/vim"
       ]
      },
      {
       "id": "ch14.redhat.q3",
       "type": "order",
       "cmd": "rpm",
       "q": "Build: upgrade emacs from the file emacs-22.1-7.fc7-i386.rpm",
       "parts": [
        "rpm",
        "-U",
        "emacs-22.1-7.fc7-i386.rpm"
       ]
      },
      {
       "id": "ch14.redhat.q4",
       "type": "mc",
       "cmd": "rpm",
       "q": "What happens if rpm -i finds a missing dependency?",
       "choices": [
        "It exits with an error",
        "It downloads the dependency",
        "It installs anyway and warns",
        "It calls yum"
       ],
       "answer": 0,
       "explain": "rpm is low-level and does no dependency resolution."
      }
     ]
    }
   ]
  },
  {
   "id": "ch15",
   "n": 15,
   "part": 3,
   "title": "Storage Media",
   "summary": "Mount devices, partition and format drives, check file systems, make images",
   "lessons": [
    {
     "id": "ch15.mount",
     "title": "Mounting and Unmounting",
     "intro": "A storage device becomes usable only after it is attached, or mounted, somewhere in the single file system tree. /etc/fstab lists what gets mounted at boot.",
     "commands": [
      {
       "id": "mount",
       "name": "mount",
       "kind": "cmd",
       "summary": "Mount a file system, or list mounted ones",
       "syntax": "mount [-t type] [-o options] device mount_point",
       "explain": "With no arguments, mount prints one line per mounted file system: the device, its mount point, its type, and its options in parentheses. Given a device and a directory, it attaches the device there. Mounting normally needs superuser privileges.",
       "flags": [
        {
         "f": "-t",
         "d": "Name the file system type to mount, such as iso9660 for a CD-ROM.",
         "p": 169,
         "ch": 15
        },
        {
         "f": "-o loop",
         "d": "Mount an image file (like an ISO) as if it were a real device.",
         "p": 179,
         "ch": 15
        }
       ],
       "examples": [
        {
         "cmd": "mount",
         "out": "/dev/sda2 on / type ext4 (rw)\nproc on /proc type proc (rw)\nsysfs on /sys type sysfs (rw)\n/dev/sda5 on /home type ext4 (rw)\n/dev/sda1 on /boot type ext4 (rw)",
         "note": "Lists mounted file systems; rw means readable and writable.",
         "sim": false
        },
        {
         "cmd": "mount -t iso9660 /dev/sdc /mnt/cdrom",
         "out": "",
         "note": "Attaches the CD-ROM at /dev/sdc to the directory /mnt/cdrom.",
         "sim": false
        },
        {
         "cmd": "mount -t iso9660 -o loop image.iso /mnt/iso_image",
         "out": "",
         "note": "Mounts an ISO file from disk so it can be browsed like a disc.",
         "sim": false
        }
       ],
       "chapters": [
        15
       ]
      },
      {
       "id": "umount",
       "name": "umount",
       "kind": "cmd",
       "summary": "Unmount a file system",
       "syntax": "umount device",
       "explain": "umount (note the spelling) detaches a device and flushes any buffered data to it so it can be removed safely. It refuses while the device is in use, for example when a shell's working directory is the mount point.",
       "flags": [],
       "examples": [
        {
         "cmd": "umount /dev/sdc",
         "out": "",
         "note": "Detaches the CD-ROM.",
         "sim": false
        },
        {
         "cmd": "umount /dev/sdc",
         "out": "umount: /mnt/cdrom: device is busy",
         "note": "Fails because the current directory is inside the mount point; cd elsewhere first.",
         "sim": false
        }
       ],
       "chapters": [
        15
       ]
      }
     ],
     "terms": [
      {
       "t": "mounting",
       "d": "Attaching a device to the file system tree so the operating system can use it.",
       "p": 166
      },
      {
       "t": "/etc/fstab",
       "d": "The file system table: devices, usually disk partitions, to be mounted at boot time.",
       "p": 166
      },
      {
       "t": "fstab field 1: Device",
       "d": "A device file such as /dev/sda1, or more often a text label or UUID written when the media was formatted.",
       "p": 167
      },
      {
       "t": "fstab field 2: Mount point",
       "d": "The directory where the device joins the file system tree.",
       "p": 167
      },
      {
       "t": "fstab field 3: File system type",
       "d": "For example ext4, msdos (FAT16), vfat (FAT32), ntfs, iso9660 (CD-ROM).",
       "p": 167
      },
      {
       "t": "fstab field 4: Options",
       "d": "Mount options, e.g. read-only or forbidding programs to run from the device.",
       "p": 167
      },
      {
       "t": "fstab field 5: Frequency",
       "d": "A number saying whether and when the dump command backs up the file system.",
       "p": 167
      },
      {
       "t": "fstab field 6: Order",
       "d": "A number giving the order fsck checks file systems at boot; 0 means not checked.",
       "p": 167
      },
      {
       "t": "mount point",
       "d": "Any directory used as an attachment point; its old contents are hidden until the device is unmounted.",
       "p": 169
      },
      {
       "t": "buffering",
       "d": "Linux keeps data for slow devices in memory and writes it later; unmounting writes it out so nothing is lost.",
       "p": 170
      }
     ],
     "quiz": [
      {
       "id": "ch15.mount.q1",
       "type": "mc",
       "cmd": "mount",
       "q": "Which mount option names the file system type?",
       "choices": [
        "-t",
        "-o",
        "-f",
        "-l"
       ],
       "answer": 0,
       "explain": "-t is followed by a type such as iso9660 or ext4."
      },
      {
       "id": "ch15.mount.q2",
       "type": "fill",
       "cmd": "mount",
       "q": "Mount the ISO file image.iso at /mnt/iso_image using a loop device.",
       "accept": [
        "mount -t iso9660 -o loop image.iso /mnt/iso_image"
       ]
      },
      {
       "id": "ch15.mount.q3",
       "type": "output",
       "cmd": "umount",
       "q": "Which command printed this while the shell sat in /mnt/cdrom?",
       "out": "umount: /mnt/cdrom: device is busy",
       "choices": [
        "umount /dev/sdc",
        "mount /dev/sdc",
        "fsck /dev/sdc",
        "mount -t iso9660 /dev/sdc /mnt/cdrom"
       ],
       "answer": 0
      },
      {
       "id": "ch15.mount.q4",
       "type": "mc",
       "cmd": "mount",
       "q": "In /etc/fstab, what does the sixth field control?",
       "choices": [
        "The order fsck checks file systems",
        "dump backup frequency",
        "The mount point",
        "Mount options"
       ],
       "answer": 0,
       "explain": "Field 5 is for dump; field 6 is the fsck check order."
      }
     ]
    },
    {
     "id": "ch15.devices",
     "title": "Device Names and Partitions",
     "intro": "Devices live in /dev with predictable names. Once you know a drive's name, fdisk lets you edit its partition table.",
     "commands": [
      {
       "id": "fdisk",
       "name": "fdisk",
       "kind": "cmd",
       "summary": "Manipulate a disk's partition table",
       "syntax": "fdisk device",
       "explain": "fdisk works on a whole device (such as /dev/sdb, not /dev/sdb1) at a very low level. It runs interactively at a Command (m for help): prompt. Changes stay in memory until you write them with w, so q leaves the disk untouched.",
       "flags": [
        {
         "f": "m",
         "d": "Show the menu of fdisk commands.",
         "p": 173,
         "ch": 15
        },
        {
         "f": "p",
         "d": "Print the device's partition table.",
         "p": 174,
         "ch": 15
        },
        {
         "f": "l",
         "d": "List the known partition type IDs (e.g. b for W95 FAT32, 83 for Linux).",
         "p": 174,
         "ch": 15
        },
        {
         "f": "t",
         "d": "Change a partition's system ID.",
         "p": 174,
         "ch": 15
        },
        {
         "f": "n",
         "d": "Add a new partition.",
         "p": 173,
         "ch": 15
        },
        {
         "f": "d",
         "d": "Delete a partition.",
         "p": 173,
         "ch": 15
        },
        {
         "f": "w",
         "d": "Write the partition table to the disk and exit.",
         "p": 174,
         "ch": 15
        },
        {
         "f": "q",
         "d": "Quit without saving any changes.",
         "p": 175,
         "ch": 15
        }
       ],
       "examples": [
        {
         "cmd": "sudo fdisk /dev/sdb",
         "out": "Command (m for help):",
         "note": "Opens the flash drive's partition table; unmount it first.",
         "sim": false
        },
        {
         "cmd": "p",
         "out": "   Device Boot      Start         End      Blocks   Id  System\n/dev/sdb1               2        1008       15608+   b  W95 FAT32",
         "note": "Typed at the fdisk prompt to print the partitions.",
         "sim": false
        }
       ],
       "chapters": [
        15
       ]
      }
     ],
     "terms": [
      {
       "t": "/dev/fd*",
       "d": "Floppy disk drives.",
       "p": 171
      },
      {
       "t": "/dev/hd*",
       "d": "IDE (PATA) disks on older systems: hda is master on channel one, hdb its slave, and so on.",
       "p": 171
      },
      {
       "t": "/dev/lp*",
       "d": "Printers.",
       "p": 171
      },
      {
       "t": "/dev/sd*",
       "d": "SCSI disks; modern kernels treat all disk-like devices (SATA, flash, USB storage) this way.",
       "p": 171
      },
      {
       "t": "/dev/sr*",
       "d": "Optical drives: CD and DVD readers and burners.",
       "p": 171
      },
      {
       "t": "trailing digit",
       "d": "Marks a partition: /dev/sdb1 is the first partition, /dev/sdb is the whole drive.",
       "p": 171
      },
      {
       "t": "/dev/cdrom, /dev/dvd, /dev/floppy",
       "d": "Convenience symbolic links pointing to the real device files.",
       "p": 171
      },
      {
       "t": "tail -f /var/log/messages",
       "d": "Watch the system log live, then plug in a device to see the name the kernel gives it.",
       "p": 171
      }
     ],
     "quiz": [
      {
       "id": "ch15.devices.q1",
       "type": "mc",
       "cmd": "fdisk",
       "q": "On a modern system a USB flash drive usually shows up as which kind of name?",
       "choices": [
        "/dev/sd*",
        "/dev/hd*",
        "/dev/sr*",
        "/dev/lp*"
       ],
       "answer": 0,
       "explain": "The kernel treats flash drives and other disk-like devices as SCSI disks."
      },
      {
       "id": "ch15.devices.q2",
       "type": "mc",
       "cmd": "fdisk",
       "q": "At the fdisk prompt, which key leaves without saving?",
       "choices": [
        "q",
        "w",
        "x",
        "d"
       ],
       "answer": 0,
       "explain": "w writes the table and exits; q quits with no changes."
      },
      {
       "id": "ch15.devices.q3",
       "type": "fill",
       "cmd": "fdisk",
       "q": "Start fdisk on the whole device /dev/sdb as superuser.",
       "accept": [
        "sudo fdisk /dev/sdb"
       ]
      }
     ]
    },
    {
     "id": "ch15.mkfs-fsck",
     "title": "Creating and Checking File Systems",
     "intro": "After partitioning, mkfs puts an empty file system on a partition. fsck checks file systems and tries to repair damage.",
     "commands": [
      {
       "id": "mkfs",
       "name": "mkfs",
       "kind": "cmd",
       "summary": "Create a file system on a partition",
       "syntax": "mkfs -t type device",
       "explain": "mkfs (make file system) formats a partition with the type you choose, erasing what was there. Double-check the device name before running it.",
       "flags": [
        {
         "f": "-t",
         "d": "Select the file system type to create, for example ext4 or vfat.",
         "p": 175,
         "ch": 15
        }
       ],
       "examples": [
        {
         "cmd": "sudo mkfs -t ext4 /dev/sdb1",
         "out": "mke2fs 2.23.2 (12-Jul-2011)\nFilesystem label=\nOS type: Linux\nBlock size=1024 (log=0)\n...\nWriting superblocks and filesystem accounting information: done",
         "note": "Formats the flash drive partition as ext4.",
         "sim": false
        },
        {
         "cmd": "sudo mkfs -t vfat /dev/sdb1",
         "out": "",
         "note": "Puts it back to a FAT32 file system.",
         "sim": false
        }
       ],
       "chapters": [
        15
       ]
      },
      {
       "id": "fsck",
       "name": "fsck",
       "kind": "cmd",
       "summary": "Check and repair a file system",
       "syntax": "fsck device",
       "explain": "fsck (file system check) runs at every boot to verify file systems before they are mounted, and it can also repair corruption. Run it on an unmounted device.",
       "flags": [],
       "examples": [
        {
         "cmd": "sudo fsck /dev/sdb1",
         "out": "fsck 1.40.8 (13-Mar-2016)\ne2fsck 1.40.8 (13-Mar-2016)\n/dev/sdb1: clean, 11/3904 files, 1661/15608 blocks",
         "note": "Checks the flash drive and reports it clean.",
         "sim": false
        }
       ],
       "chapters": [
        15
       ]
      }
     ],
     "terms": [
      {
       "t": "lost+found",
       "d": "Directory at the root of each Unix-like file system where fsck puts recovered pieces of files.",
       "p": 176
      },
      {
       "t": "ext4",
       "d": "Fourth Extended File System, the usual native Linux file system.",
       "p": 167
      }
     ],
     "quiz": [
      {
       "id": "ch15.mkfs-fsck.q1",
       "type": "order",
       "cmd": "mkfs",
       "q": "Build: format /dev/sdb1 as ext4 with superuser rights",
       "parts": [
        "sudo",
        "mkfs",
        "-t",
        "ext4",
        "/dev/sdb1"
       ]
      },
      {
       "id": "ch15.mkfs-fsck.q2",
       "type": "output",
       "cmd": "fsck",
       "q": "Which command produced this output?",
       "out": "/dev/sdb1: clean, 11/3904 files, 1661/15608 blocks",
       "choices": [
        "sudo fsck /dev/sdb1",
        "sudo mkfs -t ext4 /dev/sdb1",
        "mount",
        "sudo fdisk /dev/sdb"
       ],
       "answer": 0
      },
      {
       "id": "ch15.mkfs-fsck.q3",
       "type": "mc",
       "cmd": "fsck",
       "q": "Where does fsck place recovered portions of damaged files?",
       "choices": [
        "lost+found",
        "/tmp",
        "/var/log",
        "/mnt"
       ],
       "answer": 0,
       "explain": "Each file system has a lost+found directory at its root for this."
      }
     ]
    },
    {
     "id": "ch15.dd",
     "title": "Raw Copies with dd and Checksums",
     "intro": "dd copies raw blocks between devices and files, which is how you clone drives or image a CD. md5sum confirms the copy is intact.",
     "commands": [
      {
       "id": "dd",
       "name": "dd",
       "kind": "cmd",
       "summary": "Copy raw data blocks between files and devices",
       "syntax": "dd if=input_file of=output_file [bs=block_size [count=blocks]]",
       "explain": "dd treats a device as a plain series of data blocks, so it can clone a whole drive or save it to an image file. Its option syntax is unusual. A mistyped if or of can wipe the wrong disk, so check both before pressing Enter.",
       "flags": [
        {
         "f": "if=",
         "d": "The input file or device to read from.",
         "p": 177,
         "ch": 15
        },
        {
         "f": "of=",
         "d": "The output file or device to write to.",
         "p": 177,
         "ch": 15
        },
        {
         "f": "bs=",
         "d": "Block size to read and write at a time.",
         "p": 177,
         "ch": 15
        },
        {
         "f": "count=",
         "d": "Number of blocks to copy.",
         "p": 177,
         "ch": 15
        }
       ],
       "examples": [
        {
         "cmd": "dd if=/dev/sdb of=/dev/sdc",
         "out": "",
         "note": "Copies one flash drive exactly onto another of the same size.",
         "sim": false
        },
        {
         "cmd": "dd if=/dev/sdb of=flash_drive.img",
         "out": "",
         "note": "Saves the drive's contents to an ordinary file.",
         "sim": false
        },
        {
         "cmd": "dd if=/dev/cdrom of=ubuntu.iso",
         "out": "",
         "note": "Makes an ISO image of a data CD (not audio CDs).",
         "sim": false
        }
       ],
       "chapters": [
        15
       ]
      },
      {
       "id": "md5sum",
       "name": "md5sum",
       "kind": "cmd",
       "summary": "Calculate an MD5 checksum",
       "syntax": "md5sum file",
       "explain": "md5sum prints a hexadecimal checksum that changes drastically if even one bit of the file changes. Compare it to the value a publisher supplies to verify a download, or compare an image with a burned disc.",
       "flags": [],
       "examples": [
        {
         "cmd": "md5sum image.iso",
         "out": "34e354760f9bb7fbf85c96f6a3f94ece  image.iso",
         "note": "Prints the checksum of the image file.",
         "sim": false
        },
        {
         "cmd": "md5sum /dev/cdrom",
         "out": "34e354760f9bb7fbf85c96f6a3f94ece  /dev/cdrom",
         "note": "A matching value shows the disc was written correctly.",
         "sim": false
        }
       ],
       "chapters": [
        15
       ]
      }
     ],
     "terms": [
      {
       "t": "checksum",
       "d": "A number computed from a file's contents; any change to the file gives a very different number.",
       "p": 180
      },
      {
       "t": "2,048-byte blocks",
       "d": "Optical media is always written in blocks of this size, which matters when checksumming a disc.",
       "p": 180
      }
     ],
     "quiz": [
      {
       "id": "ch15.dd.q1",
       "type": "fill",
       "cmd": "dd",
       "q": "Copy the CD in /dev/cdrom to an image file named ubuntu.iso.",
       "accept": [
        "dd if=/dev/cdrom of=ubuntu.iso"
       ]
      },
      {
       "id": "ch15.dd.q2",
       "type": "order",
       "cmd": "dd",
       "q": "Build: clone drive /dev/sdb onto /dev/sdc",
       "parts": [
        "dd",
        "if=/dev/sdb",
        "of=/dev/sdc"
       ]
      },
      {
       "id": "ch15.dd.q3",
       "type": "output",
       "cmd": "md5sum",
       "q": "Which command produced this output?",
       "out": "34e354760f9bb7fbf85c96f6a3f94ece  image.iso",
       "choices": [
        "md5sum image.iso",
        "dd if=image.iso",
        "stat image.iso",
        "genisoimage -o image.iso"
       ],
       "answer": 0
      },
      {
       "id": "ch15.dd.q4",
       "type": "mc",
       "cmd": "dd",
       "q": "Why is dd nicknamed \"destroy disk\"?",
       "choices": [
        "Mistyping if or of can overwrite the wrong device",
        "It always erases its input",
        "It formats the target first",
        "It deletes the image when done"
       ],
       "answer": 0,
       "explain": "Swapping input and output specifications can wipe a drive."
      }
     ]
    },
    {
     "id": "ch15.optical",
     "title": "Building and Burning CD-ROM Images",
     "intro": "Writing a CD takes two steps: build an ISO image, then write it to the media. genisoimage and wodim handle those steps.",
     "commands": [
      {
       "id": "genisoimage",
       "name": "genisoimage",
       "kind": "cmd",
       "summary": "Create an ISO 9660 image file from a directory",
       "syntax": "genisoimage -o image_file [-R] [-J] directory",
       "explain": "genisoimage builds an ISO image from the files in a directory. It is the replacement for mkisofs, created after a licensing dispute split the cdrtools project.",
       "flags": [
        {
         "f": "-o",
         "d": "Name the image file to create.",
         "p": 178,
         "ch": 15
        },
        {
         "f": "-R",
         "d": "Add Rock Ridge metadata, allowing long filenames and POSIX-style permissions.",
         "p": 178,
         "ch": 15
        },
        {
         "f": "-J",
         "d": "Add Joliet extensions so Windows sees long filenames.",
         "p": 178,
         "ch": 15
        }
       ],
       "examples": [
        {
         "cmd": "genisoimage -o cd-rom.iso -R -J ~/cd-rom-files",
         "out": "",
         "note": "Packs the contents of ~/cd-rom-files into cd-rom.iso.",
         "sim": false
        }
       ],
       "chapters": [
        15
       ]
      },
      {
       "id": "wodim",
       "name": "wodim",
       "kind": "cmd",
       "summary": "Write data to optical storage media",
       "syntax": "wodim dev=device [options] [image_file]",
       "explain": "wodim burns an image to CD or DVD media and can blank rewritable discs. It replaces the older cdrecord program. Its default recording mode is track-at-once.",
       "flags": [
        {
         "f": "dev=",
         "d": "The optical writer device, e.g. /dev/cdrw.",
         "p": 179,
         "ch": 15
        },
        {
         "f": "blank=fast",
         "d": "Erase a CD-RW using the quickest, most minimal blanking type.",
         "p": 179,
         "ch": 15
        },
        {
         "f": "-v",
         "d": "Verbose output.",
         "p": 179,
         "ch": 15
        },
        {
         "f": "-dao",
         "d": "Write in disc-at-once mode, suited to discs meant for commercial reproduction.",
         "p": 179,
         "ch": 15
        }
       ],
       "examples": [
        {
         "cmd": "wodim dev=/dev/cdrw blank=fast",
         "out": "",
         "note": "Blanks a rewritable disc so it can be reused.",
         "sim": false
        },
        {
         "cmd": "wodim dev=/dev/cdrw image.iso",
         "out": "",
         "note": "Burns image.iso to the disc.",
         "sim": false
        }
       ],
       "chapters": [
        15
       ]
      }
     ],
     "terms": [
      {
       "t": "ISO image",
       "d": "A file holding an exact file system image of a CD-ROM.",
       "p": 177
      },
      {
       "t": "mkisofs / cdrecord",
       "d": "Older cdrtools programs; genisoimage and wodim are their replacements.",
       "p": 178
      },
      {
       "t": "track-at-once",
       "d": "wodim's default recording mode, handy for music tracks.",
       "p": 179
      }
     ],
     "quiz": [
      {
       "id": "ch15.optical.q1",
       "type": "mc",
       "cmd": "genisoimage",
       "q": "Which genisoimage option enables long filenames for Windows?",
       "choices": [
        "-J",
        "-R",
        "-o",
        "-v"
       ],
       "answer": 0,
       "explain": "-J adds Joliet extensions; -R adds Rock Ridge for POSIX systems."
      },
      {
       "id": "ch15.optical.q2",
       "type": "fill",
       "cmd": "wodim",
       "q": "Quickly blank the CD-RW in /dev/cdrw.",
       "accept": [
        "wodim dev=/dev/cdrw blank=fast"
       ]
      },
      {
       "id": "ch15.optical.q3",
       "type": "order",
       "cmd": "genisoimage",
       "q": "Build: make cd-rom.iso from ~/cd-rom-files with Rock Ridge and Joliet",
       "parts": [
        "genisoimage",
        "-o",
        "cd-rom.iso",
        "-R",
        "-J",
        "~/cd-rom-files"
       ]
      }
     ]
    }
   ]
  },
  {
   "id": "ch16",
   "n": 16,
   "part": 3,
   "title": "Networking",
   "summary": "Check network health, transfer files, and log in to remote hosts securely",
   "lessons": [
    {
     "id": "ch16.monitor",
     "title": "Examining and Monitoring a Network",
     "intro": "A few commands tell you whether a host is reachable, which routers sit in between, and how your interfaces and routes are set up.",
     "commands": [
      {
       "id": "ping",
       "name": "ping",
       "kind": "cmd",
       "summary": "Send ICMP ECHO_REQUEST packets to a network host",
       "syntax": "ping host",
       "explain": "ping sends a special ICMP ECHO_REQUEST packet once a second until you press Ctrl-C, then prints statistics. Zero percent packet loss suggests the network path is working. Some hosts and firewalls deliberately ignore these packets.",
       "flags": [],
       "examples": [
        {
         "cmd": "ping linuxcommand.org",
         "out": "PING linuxcommand.org (66.35.250.210) 56(84) bytes of data.\n64 bytes from vhost.sourceforge.net (66.35.250.210): icmp_seq=1 ttl=43 time=107 ms\n64 bytes from vhost.sourceforge.net (66.35.250.210): icmp_seq=2 ttl=43 time=108 ms\n--- linuxcommand.org ping statistics ---\n6 packets transmitted, 6 received, 0% packet loss, time 6010ms",
         "note": "Checks that linuxcommand.org can be reached; stop with Ctrl-C.",
         "sim": false
        }
       ],
       "chapters": [
        16
       ]
      },
      {
       "id": "traceroute",
       "name": "traceroute",
       "kind": "cmd",
       "summary": "Print the route packets take to a network host",
       "syntax": "traceroute [-T|-I] host",
       "explain": "traceroute lists every hop (router) between your system and the target, with three round-trip time samples each. Routers that don't identify themselves appear as asterisks. Some systems provide the similar tracepath instead.",
       "flags": [
        {
         "f": "-T",
         "d": "Alternative probe method that may get through when routing information is blocked.",
         "p": 184,
         "ch": 16
        },
        {
         "f": "-I",
         "d": "Another alternative probe method for when hops show only asterisks.",
         "p": 184,
         "ch": 16
        }
       ],
       "examples": [
        {
         "cmd": "traceroute slashdot.org",
         "out": "traceroute to slashdot.org (216.34.181.45), 30 hops max, 40 byte packets\n 1  ipcop.localdomain (192.168.1.1)  1.066 ms  1.366 ms  1.720 ms\n 2  * * *\n...\n16  slashdot.org (216.34.181.45)  42.727 ms  42.016 ms  41.437 ms",
         "note": "Shows the 16 hops to slashdot.org; hop 2 gave no information.",
         "sim": false
        }
       ],
       "chapters": [
        16
       ]
      },
      {
       "id": "ip",
       "name": "ip",
       "kind": "cmd",
       "summary": "Show and manipulate routing, devices and tunnels",
       "syntax": "ip a",
       "explain": "ip is a multipurpose network configuration tool that replaces the deprecated ifconfig. For quick diagnostics, look for UP on each interface's first line and a valid address in the inet field.",
       "flags": [
        {
         "f": "a",
         "d": "Display the system's network interfaces and their addresses.",
         "p": 184,
         "ch": 16
        }
       ],
       "examples": [
        {
         "cmd": "ip a",
         "out": "1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000\n    inet 192.168.1.14/24 brd 192.168.1.255 scope global eth0",
         "note": "Shows the loopback interface lo and the Ethernet interface eth0.",
         "sim": false
        }
       ],
       "chapters": [
        16
       ]
      },
      {
       "id": "netstat",
       "name": "netstat",
       "kind": "cmd",
       "summary": "Print network connections, routing tables and interface statistics",
       "syntax": "netstat [options]",
       "explain": "netstat examines many network settings and statistics depending on the options given. Use it to view interfaces or the kernel's routing table.",
       "flags": [
        {
         "f": "-ie",
         "d": "Show the network interfaces in the system.",
         "p": 184,
         "ch": 16
        },
        {
         "f": "-r",
         "d": "Show the kernel's network routing table.",
         "p": 185,
         "ch": 16
        }
       ],
       "examples": [
        {
         "cmd": "netstat -ie",
         "out": "eth0    Link encap:Ethernet  HWaddr 00:1d:09:9b:99:67\n        inet addr:192.168.1.2 Bcast:192.168.1.255 Mask:255.255.255.0\n        UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1",
         "note": "Lists interface details.",
         "sim": false
        },
        {
         "cmd": "netstat -r",
         "out": "Kernel IP routing table\nDestination  Gateway     Genmask       Flags   MSS Window  irtt Iface\n192.168.1.0  *           255.255.255.0 U       0   0       0    eth0\ndefault      192.168.1.1 0.0.0.0       UG      0   0       0    eth0",
         "note": "Shows where packets are sent for each destination network.",
         "sim": false
        }
       ],
       "chapters": [
        16
       ]
      }
     ],
     "terms": [
      {
       "t": "lo (loopback)",
       "d": "A virtual interface the system uses to talk to itself.",
       "p": 184
      },
      {
       "t": "eth0",
       "d": "The Ethernet interface in the book's examples.",
       "p": 184
      },
      {
       "t": "UP",
       "d": "In ip output, shows the interface is enabled.",
       "p": 184
      },
      {
       "t": "inet",
       "d": "Field holding the interface's IP address; a valid one confirms DHCP worked on DHCP systems.",
       "p": 184
      },
      {
       "t": "address ending in 0",
       "d": "In a routing table, an address like 192.168.1.0 names a network rather than a single host.",
       "p": 185
      },
      {
       "t": "Gateway *",
       "d": "An asterisk in the Gateway column means no router is needed to reach that network.",
       "p": 185
      },
      {
       "t": "default route",
       "d": "Destination for traffic to any network not listed elsewhere in the table.",
       "p": 185
      }
     ],
     "quiz": [
      {
       "id": "ch16.monitor.q1",
       "type": "mc",
       "cmd": "netstat",
       "q": "Which netstat option shows the kernel routing table?",
       "choices": [
        "-r",
        "-ie",
        "-a",
        "-t"
       ],
       "answer": 0,
       "explain": "-r displays routes; -ie displays interfaces."
      },
      {
       "id": "ch16.monitor.q2",
       "type": "output",
       "cmd": "traceroute",
       "q": "Which command produced this output?",
       "out": "traceroute to slashdot.org (216.34.181.45), 30 hops max, 40 byte packets\n 1  ipcop.localdomain (192.168.1.1)  1.066 ms  1.366 ms  1.720 ms\n 2  * * *",
       "choices": [
        "traceroute slashdot.org",
        "ping slashdot.org",
        "netstat -r",
        "ip a"
       ],
       "answer": 0
      },
      {
       "id": "ch16.monitor.q3",
       "type": "fill",
       "cmd": "ip",
       "q": "Display the network interfaces and their addresses with the ip program.",
       "accept": [
        "ip a"
       ]
      },
      {
       "id": "ch16.monitor.q4",
       "type": "mc",
       "cmd": "ping",
       "q": "What does 0% packet loss in ping's statistics suggest?",
       "choices": [
        "The network path is working properly",
        "The host ignores ICMP",
        "A firewall is blocking traffic",
        "DNS is broken"
       ],
       "answer": 0,
       "explain": "A healthy network shows no lost packets."
      }
     ]
    },
    {
     "id": "ch16.transfer",
     "title": "Transferring Files: ftp, lftp, wget",
     "intro": "ftp is the classic way to move files to and from FTP servers. lftp improves on it, and wget downloads from web and FTP sites without interaction.",
     "commands": [
      {
       "id": "ftp",
       "name": "ftp",
       "kind": "cmd",
       "summary": "Internet file transfer program",
       "syntax": "ftp host",
       "explain": "ftp connects to an FTP server and gives you an ftp> prompt for interactive commands. Plain FTP sends names and passwords unencrypted, so on the Internet it is mostly used with anonymous servers.",
       "flags": [],
       "examples": [
        {
         "cmd": "ftp fileserver",
         "out": "Connected to fileserver.localdomain.\n220 (vsFTPd 2.0.1)\nName (fileserver:me): anonymous\n331 Please specify the password.\nPassword:\n230 Login successful.",
         "note": "Logs in anonymously to the server fileserver.",
         "sim": false
        },
        {
         "cmd": "get ubuntu-18.04-desktop-amd64.iso",
         "out": "226 File send OK.\n733079552 bytes received in 68.56 secs (10441.5 kB/s)",
         "note": "Typed at the ftp> prompt to download a file into the local directory.",
         "sim": false
        }
       ],
       "chapters": [
        16
       ]
      },
      {
       "id": "lftp",
       "name": "lftp",
       "kind": "cmd",
       "summary": "A friendlier command-line FTP client",
       "syntax": "lftp host",
       "explain": "lftp behaves much like ftp but adds conveniences such as support for several protocols including HTTP, automatic retries, background jobs, and tab completion of pathnames.",
       "flags": [],
       "examples": [
        {
         "cmd": "lftp fileserver",
         "out": "",
         "note": "Opens a session like ftp, with extra features.",
         "sim": false
        }
       ],
       "chapters": [
        16
       ]
      },
      {
       "id": "wget",
       "name": "wget",
       "kind": "cmd",
       "summary": "Non-interactive network downloader",
       "syntax": "wget URL",
       "explain": "wget fetches files from web and FTP sites: one file, many files, or a whole site. Its options cover recursive downloads, background downloading, and resuming partial downloads.",
       "flags": [],
       "examples": [
        {
         "cmd": "wget http://linuxcommand.org/index.php",
         "out": "Resolving linuxcommand.org... 66.35.250.210\nConnecting to linuxcommand.org|66.35.250.210|:80... connected.\nHTTP request sent, awaiting response... 200 OK\n11:02:51 (161.75 MB/s) - `index.php' saved [3120]",
         "note": "Downloads the site's first page as index.php.",
         "sim": false
        }
       ],
       "chapters": [
        16
       ]
      }
     ],
     "terms": [
      {
       "t": "anonymous FTP",
       "d": "A server that lets anyone log in as anonymous with any password (sometimes an email address).",
       "p": 186
      },
      {
       "t": "cleartext",
       "d": "Unencrypted data; ftp, telnet and rlogin send passwords this way, so others can sniff them.",
       "p": 186
      },
      {
       "t": "ftp> cd",
       "d": "Change directory on the remote system. Public files are usually under pub.",
       "p": 187
      },
      {
       "t": "ftp> ls",
       "d": "List the current directory on the remote system.",
       "p": 187
      },
      {
       "t": "ftp> lcd",
       "d": "Change the working directory on the local system, e.g. lcd Desktop.",
       "p": 187
      },
      {
       "t": "ftp> get",
       "d": "Transfer the named remote file to the local working directory.",
       "p": 187
      },
      {
       "t": "ftp> bye",
       "d": "Log off and end the session; quit and exit work too.",
       "p": 187
      },
      {
       "t": "ftp> help",
       "d": "List the commands the ftp program supports.",
       "p": 187
      }
     ],
     "quiz": [
      {
       "id": "ch16.transfer.q1",
       "type": "mc",
       "cmd": "ftp",
       "q": "At the ftp> prompt, which command changes the directory on your own machine?",
       "choices": [
        "lcd",
        "cd",
        "ls",
        "get"
       ],
       "answer": 0,
       "explain": "lcd is the local cd; plain cd acts on the remote system."
      },
      {
       "id": "ch16.transfer.q2",
       "type": "fill",
       "cmd": "wget",
       "q": "Download http://linuxcommand.org/index.php with a non-interactive tool.",
       "accept": [
        "wget http://linuxcommand.org/index.php"
       ]
      },
      {
       "id": "ch16.transfer.q3",
       "type": "mc",
       "cmd": "ftp",
       "q": "Why is plain FTP considered insecure?",
       "choices": [
        "It sends account names and passwords unencrypted",
        "It only works anonymously",
        "It can't download large files",
        "It requires root"
       ],
       "answer": 0,
       "explain": "Anyone sniffing the network can read the cleartext login."
      }
     ]
    },
    {
     "id": "ch16.ssh",
     "title": "Secure Remote Access: ssh, scp, sftp",
     "intro": "SSH verifies the remote host's identity and encrypts everything sent. OpenSSH provides ssh for logins plus scp and sftp for copying files.",
     "commands": [
      {
       "id": "ssh",
       "name": "ssh",
       "kind": "cmd",
       "summary": "OpenSSH client for secure remote login",
       "syntax": "ssh [-X] [user@]host [command]",
       "explain": "ssh connects to an SSH server, which listens on port 22 by default. On the first connection you confirm the host's key, and it is saved in ~/.ssh/known_hosts. You can open a remote shell, or run a single command and see its output locally.",
       "flags": [
        {
         "f": "user@host",
         "d": "Log in to a remote account whose name differs from your local one.",
         "p": 189,
         "ch": 16
        },
        {
         "f": "-X",
         "d": "Send X Window traffic through the tunnel so remote graphical programs display locally.",
         "p": 191,
         "ch": 16
        },
        {
         "f": "-Y",
         "d": "Use instead of -X on systems where -X doesn't work for X forwarding.",
         "p": 191,
         "ch": 16
        }
       ],
       "examples": [
        {
         "cmd": "ssh bob@remote-sys",
         "out": "bob@remote-sys's password:\nLast login: Sat Aug 25 13:03:21 2018\n[bob@remote-sys ~]$",
         "note": "Logs in as bob on remote-sys; type exit to return.",
         "sim": false
        },
        {
         "cmd": "ssh remote-sys free",
         "out": "             total     used     free     shared    buffers     cached\nMem:        775536   507184   268352          0     110068     154596",
         "note": "Runs free remotely and shows the result here.",
         "sim": false
        },
        {
         "cmd": "ssh remote-sys 'ls *' > dirlist.txt",
         "out": "",
         "note": "Quotes keep * from expanding locally; the listing is saved to a local file.",
         "sim": false
        }
       ],
       "chapters": [
        16
       ]
      },
      {
       "id": "scp",
       "name": "scp",
       "kind": "cmd",
       "summary": "Secure copy over an SSH tunnel",
       "syntax": "scp [user@]host:path destination",
       "explain": "scp works like cp, except a source or destination may start with a remote host name and a colon. Put user@ in front of the host if your remote account name differs.",
       "flags": [],
       "examples": [
        {
         "cmd": "scp remote-sys:document.txt .",
         "out": "document.txt                           100% 5581     5.5KB/s   00:00",
         "note": "Copies document.txt from your remote home into the current directory.",
         "sim": false
        },
        {
         "cmd": "scp bob@remote-sys:document.txt .",
         "out": "",
         "note": "Same copy, using the remote account bob.",
         "sim": false
        }
       ],
       "chapters": [
        16
       ]
      },
      {
       "id": "sftp",
       "name": "sftp",
       "kind": "cmd",
       "summary": "Secure FTP-like file transfer over SSH",
       "syntax": "sftp host",
       "explain": "sftp offers ftp-style commands such as ls, lcd, get and bye, but over an encrypted SSH tunnel. The remote host needs only an SSH server, not an FTP server.",
       "flags": [],
       "examples": [
        {
         "cmd": "sftp remote-sys",
         "out": "Connecting to remote-sys...\nme@remote-sys's password:\nsftp> ls\nubuntu-8.04-desktop-i386.iso\nsftp> get ubuntu-8.04-desktop-i386.iso",
         "note": "A session that downloads an ISO securely.",
         "sim": false
        }
       ],
       "chapters": [
        16
       ]
      }
     ],
     "terms": [
      {
       "t": "SSH",
       "d": "Secure Shell: authenticates the remote host and encrypts all traffic between the two systems.",
       "p": 188
      },
      {
       "t": "port 22",
       "d": "The TCP port an SSH server listens on by default.",
       "p": 188
      },
      {
       "t": "man-in-the-middle attack",
       "d": "An impostor host intercepting traffic; ssh warns if a host's key changes.",
       "p": 188
      },
      {
       "t": "~/.ssh/known_hosts",
       "d": "Stores accepted host keys; delete an obsolete line to accept a host's new key.",
       "p": 190
      },
      {
       "t": "SSH tunnel",
       "d": "The encrypted channel; it can carry other traffic too, like a simple VPN.",
       "p": 191
      },
      {
       "t": "sftp://",
       "d": "URI prefix GNOME or KDE file managers accept to browse files on an SSH server.",
       "p": 192
      }
     ],
     "quiz": [
      {
       "id": "ch16.ssh.q1",
       "type": "order",
       "cmd": "scp",
       "q": "Build: copy document.txt from remote-sys into the current directory",
       "parts": [
        "scp",
        "remote-sys:document.txt",
        "."
       ]
      },
      {
       "id": "ch16.ssh.q2",
       "type": "fill",
       "cmd": "ssh",
       "q": "Log in to remote-sys as the user bob.",
       "accept": [
        "ssh bob@remote-sys"
       ]
      },
      {
       "id": "ch16.ssh.q3",
       "type": "mc",
       "cmd": "ssh",
       "q": "In ssh remote-sys 'ls *' > dirlist.txt, why is ls * quoted?",
       "choices": [
        "So the wildcard expands on the remote system",
        "So the output stays remote",
        "Because ssh needs quotes for every command",
        "To hide the password"
       ],
       "answer": 0,
       "explain": "Without quotes the local shell would expand * first."
      },
      {
       "id": "ch16.ssh.q4",
       "type": "mc",
       "cmd": "sftp",
       "q": "What advantage does sftp have over ftp besides encryption?",
       "choices": [
        "The remote host needs only an SSH server",
        "It is faster",
        "It supports anonymous logins",
        "It needs no password ever"
       ],
       "answer": 0,
       "explain": "No FTP server is required on the remote side."
      }
     ]
    }
   ]
  },
  {
   "id": "ch17",
   "n": 17,
   "part": 3,
   "title": "Searching for Files",
   "summary": "Find files with locate and find, act on results, and inspect them with stat",
   "lessons": [
    {
     "id": "ch17.locate",
     "title": "locate: The Easy Way",
     "intro": "locate searches a prebuilt database of pathnames, so it is fast but only matches on names.",
     "commands": [
      {
       "id": "locate",
       "name": "locate",
       "kind": "cmd",
       "summary": "Find files by name using a pathname database",
       "syntax": "locate string",
       "explain": "locate prints every pathname in its database that contains the given substring. The database is built by updatedb, usually once a day, so very new files may be missing. Pipe the output to grep for more selective searches.",
       "flags": [
        {
         "f": "--regexp",
         "d": "Treat the search pattern as a basic regular expression.",
         "p": 241,
         "ch": 19
        },
        {
         "f": "--regex",
         "d": "Treat the search pattern as an extended regular expression.",
         "p": 241,
         "ch": 19
        }
       ],
       "examples": [
        {
         "cmd": "locate bin/zip",
         "out": "/usr/bin/zip\n/usr/bin/zipcloak\n/usr/bin/zipgrep\n/usr/bin/zipnote\n/usr/bin/zipsplit",
         "note": "Lists programs whose names start with zip in a bin directory.",
         "sim": false
        },
        {
         "cmd": "locate zip | grep bin",
         "out": "/bin/bunzip2\n/bin/bzip2\n/bin/gunzip\n/bin/gzip\n/usr/bin/unzip\n/usr/bin/zip",
         "note": "Combines locate with grep to keep only paths containing bin.",
         "sim": false
        },
        {
         "cmd": "locate --regex 'bin/(bz|gz|zip)'",
         "out": "/bin/bzcat\n/bin/bzcmp\n/bin/bzdiff\n/bin/bzegrep\n/bin/bzexe",
         "note": "Book output (partial): paths containing bin/bz, bin/gz or bin/zip.",
         "sim": false,
         "ch": 19
        }
       ],
       "chapters": [
        17,
        19
       ]
      }
     ],
     "terms": [
      {
       "t": "updatedb",
       "d": "Program that builds the locate database; usually run daily by cron, or by the superuser on demand.",
       "p": 197
      },
      {
       "t": "slocate / mlocate",
       "d": "The two common locate variants, normally reached through a symbolic link named locate.",
       "p": 197
      },
      {
       "t": "cron job",
       "d": "A task that the cron daemon runs at regular intervals.",
       "p": 197
      }
     ],
     "quiz": [
      {
       "id": "ch17.locate.q1",
       "type": "mc",
       "cmd": "locate",
       "q": "Why might locate miss a file you created a minute ago?",
       "choices": [
        "Its database is only updated periodically by updatedb",
        "It ignores hidden directories",
        "It only searches /usr/bin",
        "It needs root"
       ],
       "answer": 0,
       "explain": "updatedb usually runs once a day; run it manually as superuser to refresh."
      },
      {
       "id": "ch17.locate.q2",
       "type": "fill",
       "cmd": "locate",
       "q": "Use locate to find pathnames containing bin/zip.",
       "accept": [
        "locate bin/zip"
       ]
      },
      {
       "id": "ch17.locate.q3",
       "type": "order",
       "cmd": "locate",
       "q": "Build: locate paths with zip, then keep only those containing bin",
       "parts": [
        "locate",
        "zip",
        "|",
        "grep",
        "bin"
       ]
      }
     ]
    },
    {
     "id": "ch17.find-tests",
     "title": "find and Its Tests",
     "intro": "find walks a directory tree and selects files by attributes such as type, name, size and time. Tests decide which files match.",
     "commands": [
      {
       "id": "find",
       "name": "find",
       "kind": "cmd",
       "summary": "Search a directory hierarchy for files by many attributes",
       "syntax": "find directory... [options] [tests] [actions]",
       "explain": "find searches the given directories and their subdirectories, sending matching pathnames to standard output. You build a search from options, tests and actions. Numeric tests accept +n for more than, -n for less than, and n for exactly. Results are not sorted.",
       "flags": [
        {
         "f": "-type c",
         "d": "Match files of type c, e.g. d for directories or f for regular files.",
         "p": 198,
         "ch": 17
        },
        {
         "f": "-name pattern",
         "d": "Match names against a wildcard pattern; quote it so the shell won't expand it.",
         "p": 199,
         "ch": 17
        },
        {
         "f": "-iname pattern",
         "d": "Same as -name but ignores letter case.",
         "p": 199,
         "ch": 17
        },
        {
         "f": "-size n",
         "d": "Match by size; +1M means larger than 1 megabyte, -1M smaller, no sign exactly.",
         "p": 198,
         "ch": 17
        },
        {
         "f": "-empty",
         "d": "Match files and directories that are empty.",
         "p": 199,
         "ch": 17
        },
        {
         "f": "-cmin n",
         "d": "Match items whose content or attributes changed n minutes ago.",
         "p": 199,
         "ch": 17
        },
        {
         "f": "-cnewer file",
         "d": "Match items whose content or attributes changed more recently than file.",
         "p": 199,
         "ch": 17
        },
        {
         "f": "-ctime n",
         "d": "Match items whose content or attributes changed n*24 hours ago.",
         "p": 199,
         "ch": 17
        },
        {
         "f": "-mmin n",
         "d": "Match items whose contents were modified n minutes ago.",
         "p": 199,
         "ch": 17
        },
        {
         "f": "-mtime n",
         "d": "Match items whose contents were modified n*24 hours ago.",
         "p": 199,
         "ch": 17
        },
        {
         "f": "-newer file",
         "d": "Match items modified more recently than file; handy for finding what changed since a backup.",
         "p": 199,
         "ch": 17
        },
        {
         "f": "-group name",
         "d": "Match items owned by a group, given as a name or numeric ID.",
         "p": 199,
         "ch": 17
        },
        {
         "f": "-user name",
         "d": "Match items owned by a user, given as a username or numeric ID.",
         "p": 200,
         "ch": 17
        },
        {
         "f": "-nouser",
         "d": "Match items whose owner is not a valid user, e.g. from deleted accounts.",
         "p": 199,
         "ch": 17
        },
        {
         "f": "-nogroup",
         "d": "Match items whose group is not a valid group.",
         "p": 199,
         "ch": 17
        },
        {
         "f": "-perm mode",
         "d": "Match items with the given permissions, in octal or symbolic form.",
         "p": 199,
         "ch": 17
        },
        {
         "f": "-inum n",
         "d": "Match the inode number n; useful for locating all hard links to a file.",
         "p": 199,
         "ch": 17
        },
        {
         "f": "-samefile name",
         "d": "Match files sharing the inode of file name.",
         "p": 200,
         "ch": 17
        },
        {
         "f": "-and",
         "d": "True when both sides are true; short form -a. Implied when no operator is given.",
         "p": 200,
         "ch": 17
        },
        {
         "f": "-or",
         "d": "True when either side is true; short form -o.",
         "p": 200,
         "ch": 17
        },
        {
         "f": "-not",
         "d": "True when the following test is false; can be written as !.",
         "p": 200,
         "ch": 17
        },
        {
         "f": "\\( \\)",
         "d": "Group tests to control evaluation order; escape the parentheses so the shell passes them to find.",
         "p": 200,
         "ch": 17
        },
        {
         "f": "-depth",
         "d": "Handle a directory's contents before the directory itself; turned on automatically by -delete.",
         "p": 208,
         "ch": 17
        },
        {
         "f": "-maxdepth levels",
         "d": "Limit how many directory levels find descends.",
         "p": 208,
         "ch": 17
        },
        {
         "f": "-mindepth levels",
         "d": "Descend at least this many levels before applying tests and actions.",
         "p": 208,
         "ch": 17
        },
        {
         "f": "-mount",
         "d": "Don't enter directories mounted from other file systems.",
         "p": 208,
         "ch": 17
        },
        {
         "f": "-noleaf",
         "d": "Skip Unix-specific search optimizations; needed for DOS/Windows file systems and CD-ROMs.",
         "p": 208,
         "ch": 17
        },
        {
         "f": "-print",
         "d": "Write the matching pathname to standard output; the default action.",
         "p": 202,
         "ch": 17
        },
        {
         "f": "-delete",
         "d": "Remove the matching file. Test with -print first.",
         "p": 202,
         "ch": 17
        },
        {
         "f": "-ls",
         "d": "Show the match as ls -dils would.",
         "p": 202,
         "ch": 17
        },
        {
         "f": "-quit",
         "d": "Stop searching after the first match.",
         "p": 202,
         "ch": 17
        },
        {
         "f": "-exec command {} ;",
         "d": "Run command on each match; {} stands for the pathname and ; ends the command (quote or escape both).",
         "p": 204,
         "ch": 17
        },
        {
         "f": "-ok command {} ;",
         "d": "Like -exec, but asks for confirmation before each run.",
         "p": 204,
         "ch": 17
        },
        {
         "f": "-exec command {} +",
         "d": "Gather all matches into one argument list and run the command only once.",
         "p": 205,
         "ch": 17
        },
        {
         "f": "-print0",
         "d": "Print pathnames separated by null characters, safe for names with spaces.",
         "p": 206,
         "ch": 17
        },
        {
         "f": "-regex",
         "d": "Test pathnames with a regex; the entire pathname must match, not just part of it.",
         "p": 240,
         "ch": 19
        }
       ],
       "examples": [
        {
         "cmd": "find ~",
         "note": "Lists everything under the home directory.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "find ~ | wc -l",
         "note": "Counts how many items find reports.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "find ~ -type d",
         "note": "Limits the results to directories.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "find ~ -type f -name \"*.JPG\" -size +1M | wc -l",
         "note": "Counts regular files named *.JPG that are larger than 1 MB.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "find ~ -iname '*.jpg'",
         "note": "Finds .jpg files regardless of case.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "find playground -type f -newer playground/timestamp",
         "out": "",
         "note": "Lists files modified after the timestamp file was touched.",
         "sim": false
        },
        {
         "cmd": "find ~ -type f -name '*.txt'",
         "note": "Two tests with an implied -and: regular files whose names end in .txt.",
         "sim": true,
         "viz": "tree",
         "ch": 17
        },
        {
         "cmd": "find ~ \\( -type f -not -perm 0600 \\) -or \\( -type d -not -perm 0700 \\)",
         "out": "",
         "note": "Lists files not set to 0600 and directories not set to 0700.",
         "sim": false,
         "ch": 17
        },
        {
         "cmd": "find ~ -type f -name '*.bak' -delete",
         "note": "Deletes every regular file ending in .bak under home.",
         "sim": true,
         "viz": "tree",
         "ch": 17
        },
        {
         "cmd": "find ~ -type f -name 'foo*' -exec ls -l '{}' ';'",
         "out": "-rwxr-xr-x 1 me   me 224 2007-10-29 18:44 /home/me/bin/foo\n-rw-r--r-- 1 me   me   0 2016-09-19 12:53 /home/me/foo.txt",
         "note": "Runs ls -l separately for each match.",
         "sim": false,
         "ch": 17
        },
        {
         "cmd": "find ~ -type f -name 'foo*' -ok ls -l '{}' ';'",
         "out": "< ls ... /home/me/bin/foo > ? y\n-rwxr-xr-x 1 me   me 224 2007-10-29 18:44 /home/me/bin/foo",
         "note": "Prompts before each ls.",
         "sim": false,
         "ch": 17
        },
        {
         "cmd": "find ~ -type f -name 'foo*' -exec ls -l '{}' +",
         "out": "-rwxr-xr-x 1 me   me 224 2007-10-29 18:44 /home/me/bin/foo\n-rw-r--r-- 1 me   me   0 2016-09-19 12:53 /home/me/foo.txt",
         "note": "Same result, but ls runs only once.",
         "sim": false,
         "ch": 17
        },
        {
         "cmd": "find . -regex '.*[^-_./0-9a-zA-Z].*'",
         "out": "",
         "note": "Finds pathnames containing spaces or other awkward characters.",
         "sim": false,
         "ch": 19
        }
       ],
       "chapters": [
        17,
        19
       ]
      }
     ],
     "terms": [
      {
       "t": "-type b",
       "d": "File type: block special device file.",
       "p": 198
      },
      {
       "t": "-type c",
       "d": "File type: character special device file.",
       "p": 198
      },
      {
       "t": "-type d",
       "d": "File type: directory.",
       "p": 198
      },
      {
       "t": "-type f",
       "d": "File type: regular file.",
       "p": 198
      },
      {
       "t": "-type l",
       "d": "File type: symbolic link.",
       "p": 198
      },
      {
       "t": "size unit b",
       "d": "512-byte blocks; used when -size has no unit letter.",
       "p": 198
      },
      {
       "t": "size unit c",
       "d": "Bytes.",
       "p": 198
      },
      {
       "t": "size unit w",
       "d": "2-byte words.",
       "p": 198
      },
      {
       "t": "size unit k",
       "d": "Kilobytes, 1,024 bytes each.",
       "p": 199
      },
      {
       "t": "size unit M",
       "d": "Megabytes, 1,048,576 bytes each.",
       "p": 199
      },
      {
       "t": "size unit G",
       "d": "Gigabytes, 1,073,741,824 bytes each.",
       "p": 199
      },
      {
       "t": "+n / -n / n",
       "d": "In numeric tests: more than n, less than n, exactly n.",
       "p": 199
      }
     ],
     "tasks": [
      {
       "id": "ch17.find-tests.t1",
       "prompt": "Use find to list every file in your home directory whose name ends in .jpg.",
       "hint": "find ~ -name 'PATTERN' (quote the wildcard)",
       "solution": "find ~ -name '*.jpg'",
       "check": [
        {
         "t": "cmd",
         "re": "^find"
        },
        {
         "t": "out",
         "re": "beach\\.jpg"
        }
       ]
      },
      {
       "id": "ch17.find-tests.t2",
       "prompt": "Find .PNG files under your home directory, ignoring upper/lower case.",
       "hint": "Use the case-insensitive version of -name.",
       "solution": "find ~ -iname '*.PNG'",
       "check": [
        {
         "t": "cmd",
         "re": "-iname"
        },
        {
         "t": "out",
         "re": "dog\\.png"
        }
       ]
      },
      {
       "id": "ch17.find-tests.t3",
       "prompt": "List only the empty directories under your home directory.",
       "hint": "Combine -type d with -empty.",
       "solution": "find ~ -type d -empty",
       "check": [
        {
         "t": "cmd",
         "re": "-empty"
        },
        {
         "t": "out",
         "re": "playground"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch17.find-tests.q1",
       "type": "mc",
       "cmd": "find",
       "q": "Which test restricts find to regular files?",
       "choices": [
        "-type f",
        "-type d",
        "-type l",
        "-type r"
       ],
       "answer": 0,
       "explain": "Type letters: f means regular file, d means directory, l means symbolic link."
      },
      {
       "id": "ch17.find-tests.q2",
       "type": "fill",
       "cmd": "find",
       "q": "Find regular files under ~ that are larger than one megabyte.",
       "accept": [
        "find ~ -type f -size +1M"
       ]
      },
      {
       "id": "ch17.find-tests.q3",
       "type": "mc",
       "cmd": "find",
       "q": "With no unit letter, what unit does -size use?",
       "choices": [
        "512-byte blocks",
        "Bytes",
        "Kilobytes",
        "2-byte words"
       ],
       "answer": 0,
       "explain": "b (512-byte blocks) is the default."
      },
      {
       "id": "ch17.find-tests.q4",
       "type": "output",
       "cmd": "find",
       "q": "In the fixture home, which command prints exactly these two lines?",
       "out": "/home/me/Pictures/cat.jpg\n/home/me/Pictures/beach.jpg",
       "choices": [
        "find ~ -name '*.jpg'",
        "find ~ -name '*.png'",
        "find ~ -type d",
        "find ~ -empty"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch17.find-operators",
     "title": "Combining Tests and Limiting Scope",
     "intro": "Logical operators join tests into larger expressions, and options control how deep find goes. Knowing when the second half of an expression runs is the key to actions.",
     "commands": [],
     "terms": [
      {
       "t": "expr1 -and expr2 (expr1 true)",
       "d": "expr2 is always performed.",
       "p": 202
      },
      {
       "t": "expr1 -and expr2 (expr1 false)",
       "d": "expr2 is never performed, since the whole can't be true.",
       "p": 202
      },
      {
       "t": "expr1 -or expr2 (expr1 true)",
       "d": "expr2 is never performed, since the whole is already true.",
       "p": 202
      },
      {
       "t": "expr1 -or expr2 (expr1 false)",
       "d": "expr2 is always performed.",
       "p": 202
      },
      {
       "t": "left-to-right evaluation",
       "d": "find evaluates expressions from left to right unless parentheses change the order.",
       "p": 200
      }
     ],
     "tasks": [
      {
       "id": "ch17.find-operators.t1",
       "prompt": "Find the regular files in your home directory whose names end in .csv.",
       "hint": "Two tests side by side are joined by an implied -and.",
       "solution": "find ~ -type f -name '*.csv'",
       "check": [
        {
         "t": "cmd",
         "re": "-type f"
        },
        {
         "t": "out",
         "re": "data\\.csv"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch17.find-operators.q1",
       "type": "mc",
       "cmd": "find",
       "q": "In expr1 -or expr2, when is expr2 skipped?",
       "choices": [
        "When expr1 is true",
        "When expr1 is false",
        "Never",
        "Always"
       ],
       "answer": 0,
       "explain": "If expr1 is already true the -or result is known, so find doesn't bother."
      },
      {
       "id": "ch17.find-operators.q2",
       "type": "mc",
       "cmd": "find",
       "q": "Why are the parentheses written as \\( and \\) on the command line?",
       "choices": [
        "They are special to the shell and must be escaped",
        "find requires backslashes in all operators",
        "To make them optional",
        "To negate the group"
       ],
       "answer": 0,
       "explain": "Escaping lets the shell pass them through to find as arguments."
      },
      {
       "id": "ch17.find-operators.q3",
       "type": "order",
       "cmd": "find",
       "q": "Build: find directories under ~ whose permissions are not 0700",
       "parts": [
        "find",
        "~",
        "-type",
        "d",
        "-not",
        "-perm",
        "0700"
       ]
      }
     ],
     "refs": [
      "find"
     ]
    },
    {
     "id": "ch17.find-actions",
     "title": "Acting on Results: Actions and xargs",
     "intro": "Actions let find do something with each match, from printing or deleting to running any command. xargs turns a list of names into arguments.",
     "commands": [
      {
       "id": "xargs",
       "name": "xargs",
       "kind": "cmd",
       "summary": "Turn standard input into arguments for another command",
       "syntax": "command | xargs command",
       "explain": "xargs reads items from standard input and passes them as arguments to another command. If the list is too long for one command line, it runs the command repeatedly with as many arguments as fit.",
       "flags": [
        {
         "f": "--show-limits",
         "d": "Display the system's maximum command-line size.",
         "p": 205,
         "ch": 17
        },
        {
         "f": "-0",
         "long": "--null",
         "d": "Accept null-separated input, as produced by find -print0.",
         "p": 206,
         "ch": 17
        }
       ],
       "examples": [
        {
         "cmd": "find ~ -type f -name 'foo*' -print | xargs ls -l",
         "out": "-rwxr-xr-x 1 me   me 224 2007-10-29 18:44 /home/me/bin/foo\n-rw-r--r-- 1 me   me   0 2016-09-19 12:53 /home/me/foo.txt",
         "note": "Turns find's list into arguments for a single ls.",
         "sim": false
        },
        {
         "cmd": "find ~ -iname '*.jpg' -print0 | xargs --null ls -l",
         "out": "",
         "note": "Null separators keep filenames with spaces intact.",
         "sim": false
        }
       ],
       "chapters": [
        17
       ]
      }
     ],
     "terms": [
      {
       "t": "{}",
       "d": "In -exec and -ok, a placeholder for the current pathname.",
       "p": 204
      },
      {
       "t": "action order matters",
       "d": "Actions obey the same -and logic as tests; -print placed first runs for every file.",
       "p": 204
      },
      {
       "t": "null character",
       "d": "ASCII character zero, used as a separator that can't appear in filenames the way spaces can.",
       "p": 206
      }
     ],
     "tasks": [
      {
       "id": "ch17.find-actions.t1",
       "prompt": "Use find to delete all .txt files inside ~/Documents, leaving the directory itself.",
       "hint": "Tests first, then the -delete action.",
       "solution": "find ~/Documents -type f -name '*.txt' -delete",
       "check": [
        {
         "t": "absent",
         "p": "~/Documents/report.txt"
        },
        {
         "t": "absent",
         "p": "~/Documents/todo.txt"
        },
        {
         "t": "isdir",
         "p": "~/Documents"
        }
       ]
      },
      {
       "id": "ch17.find-actions.t2",
       "prompt": "Use find (not rm) to delete foo.txt from your home directory.",
       "hint": "find ~ -name NAME -delete",
       "solution": "find ~ -name 'foo.txt' -delete",
       "check": [
        {
         "t": "absent",
         "p": "~/foo.txt"
        },
        {
         "t": "cmd",
         "re": "^find.*-delete"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch17.find-actions.q1",
       "type": "mc",
       "cmd": "find",
       "q": "Which action asks you before running a command on each match?",
       "choices": [
        "-ok",
        "-exec",
        "-print",
        "-quit"
       ],
       "answer": 0,
       "explain": "-ok is the interactive form of -exec."
      },
      {
       "id": "ch17.find-actions.q2",
       "type": "fill",
       "cmd": "find",
       "q": "Delete every regular file under ~ whose name ends in .bak.",
       "accept": [
        "find ~ -type f -name '*.bak' -delete",
        "find ~ -type f -name \"*.bak\" -delete"
       ]
      },
      {
       "id": "ch17.find-actions.q3",
       "type": "order",
       "cmd": "xargs",
       "q": "Build: pipe find's list of foo* files into xargs to run ls -l once",
       "parts": [
        "find",
        "~",
        "-type",
        "f",
        "-name",
        "'foo*'",
        "-print",
        "|",
        "xargs",
        "ls",
        "-l"
       ]
      },
      {
       "id": "ch17.find-actions.q4",
       "type": "mc",
       "cmd": "find",
       "q": "What does ending -exec with + instead of ; do?",
       "choices": [
        "Runs the command once with all matches as arguments",
        "Runs it twice per file",
        "Prompts before running",
        "Adds the file to an archive"
       ],
       "answer": 0,
       "explain": "+ batches the results into a single command line."
      }
     ],
     "refs": [
      "find"
     ]
    },
    {
     "id": "ch17.touch-stat",
     "title": "Playground Tools: touch and stat",
     "intro": "touch creates empty files or refreshes timestamps, and stat reveals everything the system knows about a file. Together with find they make a good playground.",
     "commands": [
      {
       "id": "touch",
       "name": "touch",
       "kind": "cmd",
       "summary": "Change file times, or create empty files",
       "syntax": "touch file...",
       "explain": "touch normally updates a file's access, change and modify times to now. If the named file doesn't exist, it creates an empty one. With brace expansion it can create many files at once.",
       "flags": [],
       "examples": [
        {
         "cmd": "touch playground/timestamp",
         "note": "Creates an empty file named timestamp in playground.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "touch playground/file-{A..C}",
         "note": "Brace expansion creates file-A, file-B and file-C.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "touch playground/dir-{001..100}/file-{A..Z}",
         "out": "",
         "note": "After mkdir -p playground/dir-{001..100}, fills each directory with 26 empty files.",
         "sim": false
        },
        {
         "cmd": "find playground -type f -name 'file-B' -exec touch '{}' ';'",
         "out": "",
         "note": "Refreshes the times of every file-B.",
         "sim": false
        }
       ],
       "chapters": [
        17
       ]
      },
      {
       "id": "stat",
       "name": "stat",
       "kind": "cmd",
       "summary": "Display file or file system status",
       "syntax": "stat file",
       "explain": "stat is like a souped-up ls, showing a file's size, inode, permissions, owner and its access, modify and change times. Use it to confirm that touch updated a timestamp.",
       "flags": [],
       "examples": [
        {
         "cmd": "stat foo.txt",
         "note": "Shows all attributes of foo.txt.",
         "sim": true
        },
        {
         "cmd": "stat playground/timestamp",
         "out": "  File: `playground/timestamp'\n  Size: 0          Blocks: 0       IO Block: 4096 regular empty file\nAccess: (0644/-rw-r--r--)  Uid: ( 1001/ me)   Gid: ( 1001/ me)\nAccess: 2018-10-08 15:15:39.000000000 -0400\nModify: 2018-10-08 15:15:39.000000000 -0400\nChange: 2018-10-08 15:15:39.000000000 -0400",
         "note": "Book sample output for the timestamp file.",
         "sim": false
        }
       ],
       "chapters": [
        17
       ]
      }
     ],
     "terms": [
      {
       "t": "access / modify / change time",
       "d": "The three timestamps touch updates and stat reports for each file.",
       "p": 206
      }
     ],
     "tasks": [
      {
       "id": "ch17.touch-stat.t1",
       "prompt": "Create an empty file named timestamp inside the playground directory.",
       "hint": "touch PATH",
       "solution": "touch playground/timestamp",
       "check": [
        {
         "t": "exists",
         "p": "~/playground/timestamp"
        }
       ]
      },
      {
       "id": "ch17.touch-stat.t2",
       "prompt": "With one touch command and brace expansion, create file-A, file-B and file-C in playground.",
       "hint": "file-{A..C}",
       "solution": "touch playground/file-{A..C}",
       "check": [
        {
         "t": "exists",
         "p": "~/playground/file-A"
        },
        {
         "t": "exists",
         "p": "~/playground/file-B"
        },
        {
         "t": "exists",
         "p": "~/playground/file-C"
        }
       ]
      },
      {
       "id": "ch17.touch-stat.t3",
       "prompt": "Show the full status information for notes.txt.",
       "hint": "The souped-up ls.",
       "solution": "stat notes.txt",
       "check": [
        {
         "t": "cmd",
         "re": "^stat"
        },
        {
         "t": "out",
         "re": "notes"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch17.touch-stat.q1",
       "type": "mc",
       "cmd": "touch",
       "q": "What does touch do when the named file does not exist?",
       "choices": [
        "Creates an empty file",
        "Prints an error",
        "Creates a directory",
        "Does nothing"
       ],
       "answer": 0,
       "explain": "Besides updating times, touch makes a new empty file."
      },
      {
       "id": "ch17.touch-stat.q2",
       "type": "fill",
       "cmd": "touch",
       "q": "Create an empty file named timestamp in playground.",
       "accept": [
        "touch playground/timestamp"
       ]
      },
      {
       "id": "ch17.touch-stat.q3",
       "type": "output",
       "cmd": "stat",
       "q": "Which command produced this output?",
       "out": "  File: `playground/timestamp'\n  Size: 0          Blocks: 0       IO Block: 4096 regular empty file\nAccess: (0644/-rw-r--r--)  Uid: ( 1001/ me)   Gid: ( 1001/ me)",
       "choices": [
        "stat playground/timestamp",
        "ls -l playground/timestamp",
        "touch playground/timestamp",
        "find playground -name timestamp"
       ],
       "answer": 0
      }
     ]
    }
   ]
  },
  {
   "id": "ch18",
   "n": 18,
   "part": 3,
   "title": "Archiving and Backup",
   "summary": "Compress with gzip and bzip2, archive with tar and zip, sync with rsync",
   "lessons": [
    {
     "id": "ch18.compression",
     "title": "Compressing Files: gzip and bzip2",
     "intro": "Compression squeezes redundancy out of data. gzip and bzip2 are lossless tools that replace a file with a smaller compressed version.",
     "commands": [
      {
       "id": "gzip",
       "name": "gzip",
       "kind": "cmd",
       "summary": "Compress or expand files",
       "syntax": "gzip [options] file...",
       "explain": "gzip replaces each file with a compressed copy ending in .gz, keeping the original's permissions and timestamp. It can also read standard input and write standard output, so it fits into pipelines.",
       "flags": [
        {
         "f": "-c",
         "long": "--stdout",
         "d": "Send output to standard output and leave the original files alone (also --to-stdout).",
         "p": 211,
         "ch": 18
        },
        {
         "f": "-d",
         "long": "--decompress",
         "d": "Decompress, making gzip behave like gunzip (also --uncompress).",
         "p": 211,
         "ch": 18
        },
        {
         "f": "-f",
         "long": "--force",
         "d": "Compress even when a compressed version already exists.",
         "p": 211,
         "ch": 18
        },
        {
         "f": "-h",
         "long": "--help",
         "d": "Show usage information.",
         "p": 211,
         "ch": 18
        },
        {
         "f": "-l",
         "long": "--list",
         "d": "Print compression statistics for each compressed file.",
         "p": 211,
         "ch": 18
        },
        {
         "f": "-r",
         "long": "--recursive",
         "d": "Compress files inside any directories named as arguments, recursively.",
         "p": 211,
         "ch": 18
        },
        {
         "f": "-t",
         "long": "--test",
         "d": "Check a compressed file's integrity.",
         "p": 211,
         "ch": 18
        },
        {
         "f": "-v",
         "long": "--verbose",
         "d": "Print messages while working.",
         "p": 211,
         "ch": 18
        },
        {
         "f": "-number",
         "d": "Compression level 1 (fastest) to 9 (smallest); --fast and --best mean 1 and 9; default 6.",
         "p": 211,
         "ch": 18
        }
       ],
       "examples": [
        {
         "cmd": "gzip foo.txt",
         "out": "",
         "note": "Replaces foo.txt with foo.txt.gz, about one-fifth the size here.",
         "sim": false
        },
        {
         "cmd": "gzip -tv foo.txt.gz",
         "out": "foo.txt.gz:  OK",
         "note": "Tests the compressed file and reports the result.",
         "sim": false
        },
        {
         "cmd": "ls -l /etc | gzip > foo.txt.gz",
         "out": "",
         "note": "Compresses a directory listing straight from a pipe.",
         "sim": false
        }
       ],
       "chapters": [
        18
       ]
      },
      {
       "id": "gunzip",
       "name": "gunzip",
       "kind": "cmd",
       "summary": "Restore gzip-compressed files",
       "syntax": "gunzip [-c] file",
       "explain": "gunzip turns a .gz file back into the original. It assumes the .gz extension, so you can leave it off as long as no uncompressed file of that name exists.",
       "flags": [
        {
         "f": "-c",
         "d": "Write the uncompressed data to standard output instead of replacing the file.",
         "p": 212,
         "ch": 18
        }
       ],
       "examples": [
        {
         "cmd": "gunzip foo.txt",
         "out": "",
         "note": "Restores foo.txt from foo.txt.gz.",
         "sim": false
        },
        {
         "cmd": "gunzip -c foo.txt | less",
         "out": "",
         "note": "Views the compressed text without restoring it.",
         "sim": false
        }
       ],
       "chapters": [
        18
       ]
      },
      {
       "id": "zcat",
       "name": "zcat",
       "kind": "cmd",
       "summary": "Print gzip-compressed files, like cat",
       "syntax": "zcat file.gz",
       "explain": "zcat ships with gzip and does the same job as gunzip -c. Use it like cat on compressed files.",
       "flags": [],
       "examples": [
        {
         "cmd": "zcat foo.txt.gz | less",
         "out": "",
         "note": "Reads the compressed file page by page.",
         "sim": false
        }
       ],
       "chapters": [
        18
       ]
      },
      {
       "id": "bzip2",
       "name": "bzip2",
       "kind": "cmd",
       "summary": "A block-sorting file compressor",
       "syntax": "bzip2 [options] file...",
       "explain": "bzip2 works much like gzip but uses a different algorithm that compresses more at the cost of speed. Its files end in .bz2. It supports gzip's options except -r, though -number means something a bit different.",
       "flags": [],
       "examples": [
        {
         "cmd": "bzip2 foo.txt",
         "out": "",
         "note": "Produces foo.txt.bz2 (2792 bytes versus gzip's 3230 in the book).",
         "sim": false
        },
        {
         "cmd": "bunzip2 foo.txt.bz2",
         "out": "",
         "note": "Decompresses it again.",
         "sim": false
        }
       ],
       "chapters": [
        18
       ]
      }
     ],
     "terms": [
      {
       "t": "lossless compression",
       "d": "Restoring the file gives back exactly the original data.",
       "p": 210
      },
      {
       "t": "lossy compression",
       "d": "Throws away data for higher compression; restored files only approximate the original (JPEG, MP3).",
       "p": 210
      },
      {
       "t": "run-length encoding",
       "d": "A basic scheme that stores a run of identical values as a count plus the value.",
       "p": 210
      },
      {
       "t": "zless",
       "d": "Pages through a gzip file, like gunzip -c piped into less.",
       "p": 212
      },
      {
       "t": "bunzip2 / bzcat",
       "d": "Companions to bzip2 for decompressing .bz2 files.",
       "p": 213
      },
      {
       "t": "bzip2recover",
       "d": "Tries to rescue data from a damaged .bz2 file.",
       "p": 213
      },
      {
       "t": "compressing compressed files",
       "d": "Usually wasted effort: overhead often makes an already-compressed file like a JPEG bigger.",
       "p": 213
      }
     ],
     "quiz": [
      {
       "id": "ch18.compression.q1",
       "type": "mc",
       "cmd": "gzip",
       "q": "Which gzip option tests a compressed file's integrity?",
       "choices": [
        "-t",
        "-l",
        "-f",
        "-c"
       ],
       "answer": 0,
       "explain": "-t (--test) checks integrity; add -v to see the result."
      },
      {
       "id": "ch18.compression.q2",
       "type": "output",
       "cmd": "gzip",
       "q": "Which command produced this output?",
       "out": "foo.txt.gz:  OK",
       "choices": [
        "gzip -tv foo.txt.gz",
        "gzip -d foo.txt.gz",
        "gunzip foo.txt",
        "zcat foo.txt.gz"
       ],
       "answer": 0
      },
      {
       "id": "ch18.compression.q3",
       "type": "fill",
       "cmd": "zcat",
       "q": "View foo.txt.gz in less without decompressing it to disk, using zcat.",
       "accept": [
        "zcat foo.txt.gz | less"
       ]
      },
      {
       "id": "ch18.compression.q4",
       "type": "mc",
       "cmd": "bzip2",
       "q": "Compared with gzip, bzip2 generally...",
       "choices": [
        "Compresses more but more slowly",
        "Compresses less but faster",
        "Is lossy",
        "Can't decompress"
       ],
       "answer": 0,
       "explain": "Its algorithm trades speed for higher compression."
      }
     ]
    },
    {
     "id": "ch18.tar",
     "title": "Archiving with tar",
     "intro": "tar bundles many files and directories into one archive file. Its first letter is a mode, and options such as f, v, z and j follow without a dash.",
     "commands": [
      {
       "id": "tar",
       "name": "tar",
       "kind": "cmd",
       "summary": "Tape archiving utility",
       "syntax": "tar mode[options] pathname...",
       "explain": "The mode always comes first and can be joined with options, with no leading dash. tar stores pathnames as relative by stripping the leading slash, so archives extract under the current directory. Extracted files belong to whoever extracts them unless that is the superuser.",
       "flags": [
        {
         "f": "c",
         "d": "Mode: create an archive from files and/or directories.",
         "p": 214,
         "ch": 18
        },
        {
         "f": "x",
         "d": "Mode: extract an archive.",
         "p": 214,
         "ch": 18
        },
        {
         "f": "r",
         "d": "Mode: append pathnames to the end of an archive.",
         "p": 214,
         "ch": 18
        },
        {
         "f": "t",
         "d": "Mode: list an archive's contents.",
         "p": 214,
         "ch": 18
        },
        {
         "f": "f",
         "d": "Give the archive's filename; - means standard input or output.",
         "p": 214,
         "ch": 18
        },
        {
         "f": "v",
         "d": "Verbose: list details while working.",
         "p": 214,
         "ch": 18
        },
        {
         "f": "z",
         "d": "Compress or decompress with gzip directly.",
         "p": 217,
         "ch": 18
        },
        {
         "f": "j",
         "d": "Compress or decompress with bzip2 directly.",
         "p": 217,
         "ch": 18
        },
        {
         "f": "--wildcards",
         "d": "GNU tar: allow wildcards in pathnames to extract.",
         "p": 216,
         "ch": 18
        },
        {
         "f": "-T",
         "long": "--files-from",
         "d": "Read the list of pathnames from a file (- for standard input).",
         "p": 216,
         "ch": 18
        }
       ],
       "examples": [
        {
         "cmd": "tar cf playground.tar playground",
         "out": "",
         "note": "Archives the whole playground tree into playground.tar.",
         "sim": false
        },
        {
         "cmd": "tar tvf playground.tar",
         "out": "",
         "note": "Lists the archive's contents in detail.",
         "sim": false
        },
        {
         "cmd": "tar xf ../playground.tar",
         "out": "",
         "note": "Extracts the archive into the current directory.",
         "sim": false
        },
        {
         "cmd": "find playground -name 'file-A' | tar czf playground.tgz -T -",
         "out": "",
         "note": "Archives only the files find lists, compressed with gzip.",
         "sim": false
        },
        {
         "cmd": "ssh remote-sys 'tar cf - Documents' | tar xf -",
         "out": "",
         "note": "Copies a remote directory by streaming an archive through ssh.",
         "sim": false
        },
        {
         "cmd": "tar xzf diction-1.11.tar.gz",
         "note": "Unpacks the tarball into a diction-1.11 directory holding the source tree.",
         "sim": false,
         "out": "",
         "ch": 23
        }
       ],
       "chapters": [
        18,
        23
       ]
      }
     ],
     "terms": [
      {
       "t": "archiving",
       "d": "Collecting many files into one large file, often for backups or long-term storage.",
       "p": 213
      },
      {
       "t": ".tar / .tgz / .tbz",
       "d": "A plain tar archive, a gzip-compressed one (also .tar.gz), and a bzip2-compressed one.",
       "p": 213
      },
      {
       "t": "relative pathnames in tar",
       "d": "tar drops the leading / so you can extract anywhere; cd / first to restore to original spots.",
       "p": 215
      },
      {
       "t": "- (dash)",
       "d": "Used as a filename, means standard input or output; many programs follow this convention.",
       "p": 216
      },
      {
       "t": "incremental backup",
       "d": "Archive only files newer than a timestamp file, e.g. with find -newer and tar r.",
       "p": 216
      }
     ],
     "quiz": [
      {
       "id": "ch18.tar.q1",
       "type": "mc",
       "cmd": "tar",
       "q": "Which tar mode lists an archive's contents?",
       "choices": [
        "t",
        "x",
        "c",
        "r"
       ],
       "answer": 0,
       "explain": "t lists, x extracts, c creates, r appends."
      },
      {
       "id": "ch18.tar.q2",
       "type": "fill",
       "cmd": "tar",
       "q": "Create an archive named playground.tar of the playground directory.",
       "accept": [
        "tar cf playground.tar playground"
       ]
      },
      {
       "id": "ch18.tar.q3",
       "type": "order",
       "cmd": "tar",
       "q": "Build: extract ../playground.tar into the current directory",
       "parts": [
        "tar",
        "xf",
        "../playground.tar"
       ]
      },
      {
       "id": "ch18.tar.q4",
       "type": "mc",
       "cmd": "tar",
       "q": "Which option makes tar use bzip2 compression?",
       "choices": [
        "j",
        "z",
        "v",
        "f"
       ],
       "answer": 0,
       "explain": "z selects gzip and j selects bzip2."
      }
     ]
    },
    {
     "id": "ch18.zip",
     "title": "zip and unzip",
     "intro": "zip both compresses and archives, using the .zip format familiar from Windows. On Linux it is mainly for exchanging files with Windows systems.",
     "commands": [
      {
       "id": "zip",
       "name": "zip",
       "kind": "cmd",
       "summary": "Package and compress files",
       "syntax": "zip options zipfile file...",
       "explain": "zip adds files to an archive, either storing them as-is or deflating (compressing) them. If the archive already exists it is updated rather than replaced. Without -r, a directory is stored but not its contents.",
       "flags": [
        {
         "f": "-r",
         "d": "Recurse into directories so their contents are included.",
         "p": 218,
         "ch": 18
        },
        {
         "f": "-@",
         "d": "Read the list of files to add from standard input.",
         "p": 219,
         "ch": 18
        },
        {
         "f": "-",
         "d": "As the input file, compress standard input.",
         "p": 219,
         "ch": 18
        }
       ],
       "examples": [
        {
         "cmd": "zip -r playground.zip playground",
         "out": " adding: playground/dir-020/file-Z (stored 0%)\n adding: playground/dir-020/file-Y (stored 0%)\n adding: playground/dir-087/ (stored 0%)",
         "note": "Archives the playground; empty files are stored uncompressed.",
         "sim": false
        },
        {
         "cmd": "find playground -name \"file-A\" | zip -@ file-A.zip",
         "out": "",
         "note": "Builds file-A.zip from the names find prints.",
         "sim": false
        },
        {
         "cmd": "ls -l /etc/ | zip ls-etc.zip -",
         "out": " adding: - (deflated 80%)",
         "note": "Compresses another program's output.",
         "sim": false
        }
       ],
       "chapters": [
        18
       ]
      },
      {
       "id": "unzip",
       "name": "unzip",
       "kind": "cmd",
       "summary": "List and extract zip archives",
       "syntax": "unzip [options] zipfile [file...]",
       "explain": "unzip extracts a zip archive, optionally only the files you name. It asks before overwriting an existing file. It does not read standard input, so it can't be piped to the way tar can.",
       "flags": [
        {
         "f": "-l",
         "d": "List the archive's contents instead of extracting.",
         "p": 218,
         "ch": 18
        },
        {
         "f": "-v",
         "d": "Make the listing more detailed.",
         "p": 219,
         "ch": 18
        },
        {
         "f": "-p",
         "d": "Send extracted data to standard output (pipe).",
         "p": 219,
         "ch": 18
        }
       ],
       "examples": [
        {
         "cmd": "unzip ../playground.zip",
         "out": "",
         "note": "Extracts the whole archive here.",
         "sim": false
        },
        {
         "cmd": "unzip -l playground.zip playground/dir-087/file-Z",
         "out": "Archive:  ../playground.zip\n  Length     Date   Time    Name\n --------    ----   ----    ----\n        0  10-05-18 09:25   playground/dir-087/file-Z",
         "note": "Lists one file without extracting it.",
         "sim": false
        },
        {
         "cmd": "unzip -p ls-etc.zip | less",
         "out": "",
         "note": "Views the archived listing.",
         "sim": false
        }
       ],
       "chapters": [
        18
       ]
      }
     ],
     "terms": [
      {
       "t": "stored vs deflated",
       "d": "zip either keeps a file uncompressed (stored) or compresses it (deflated); the % shows the savings.",
       "p": 218
      }
     ],
     "quiz": [
      {
       "id": "ch18.zip.q1",
       "type": "mc",
       "cmd": "zip",
       "q": "What happens if you omit -r when zipping a directory?",
       "choices": [
        "Only the directory itself is stored, not its contents",
        "zip refuses to run",
        "The contents are compressed but not the directory",
        "It creates a tar file"
       ],
       "answer": 0,
       "explain": "-r is needed to recurse into the directory."
      },
      {
       "id": "ch18.zip.q2",
       "type": "fill",
       "cmd": "zip",
       "q": "Make a zip archive named playground.zip of the playground directory and everything in it.",
       "accept": [
        "zip -r playground.zip playground"
       ]
      },
      {
       "id": "ch18.zip.q3",
       "type": "mc",
       "cmd": "unzip",
       "q": "Which unzip option lists contents without extracting?",
       "choices": [
        "-l",
        "-p",
        "-r",
        "-@"
       ],
       "answer": 0,
       "explain": "-l lists; -p pipes data to standard output."
      }
     ]
    },
    {
     "id": "ch18.rsync",
     "title": "Synchronizing with rsync",
     "intro": "rsync keeps directories in sync locally or across a network, copying only what changed.",
     "commands": [
      {
       "id": "rsync",
       "name": "rsync",
       "kind": "cmd",
       "summary": "Remote file and directory synchronization",
       "syntax": "rsync options source destination",
       "explain": "rsync uses its remote-update protocol to spot differences and copy the minimum needed. Source and destination can be local paths, [user@]host:path, or an rsync://[user@]host[:port]/path server URI, but one side must be local. A trailing / on the source copies its contents rather than the directory itself.",
       "flags": [
        {
         "f": "-a",
         "d": "Archive mode: recurse and keep file attributes.",
         "p": 220,
         "ch": 18
        },
        {
         "f": "-v",
         "d": "Verbose output listing what is copied.",
         "p": 220,
         "ch": 18
        },
        {
         "f": "--delete",
         "d": "Remove files from the destination that no longer exist in the source.",
         "p": 222,
         "ch": 18
        },
        {
         "f": "--rsh=ssh",
         "d": "Use ssh as the remote shell so data travels through an encrypted tunnel.",
         "p": 222,
         "ch": 18
        }
       ],
       "examples": [
        {
         "cmd": "rsync -av playground foo",
         "out": "building file list ... done\nplayground/dir-099/file-Z\nsent 22685 bytes  received 42 bytes  45454.00 bytes/sec\ntotal size is 3230  speedup is 0.14",
         "note": "Mirrors playground into foo; reruns copy only changed files.",
         "sim": false
        },
        {
         "cmd": "rsync source/ destination",
         "out": "",
         "note": "Trailing slash: copies the contents of source, hidden files included.",
         "sim": false
        },
        {
         "cmd": "sudo rsync -av --delete /etc /home /usr/local /media/BigDisk/backup",
         "out": "",
         "note": "Backs up key directories to an external drive.",
         "sim": false
        },
        {
         "cmd": "sudo rsync -av --delete --rsh=ssh /etc /home /usr/local remote-sys:/backup",
         "out": "",
         "note": "Same backup sent to another machine over ssh.",
         "sim": false
        }
       ],
       "chapters": [
        18
       ]
      }
     ],
     "terms": [
      {
       "t": "rsync remote-update protocol",
       "d": "Lets rsync quickly find differences and copy only the minimum needed.",
       "p": 220
      },
      {
       "t": "[user@]host:path",
       "d": "Form for naming a remote file or directory as a source or destination.",
       "p": 220
      },
      {
       "t": "rsync://[user@]host[:port]/path",
       "d": "URI for a remote rsync server, such as a software mirror.",
       "p": 220
      },
      {
       "t": "trailing / on source",
       "d": "Copies only the directory's contents, similar to source/* but including hidden files.",
       "p": 221
      }
     ],
     "quiz": [
      {
       "id": "ch18.rsync.q1",
       "type": "mc",
       "cmd": "rsync",
       "q": "What does --delete do in an rsync backup?",
       "choices": [
        "Removes destination files that are gone from the source",
        "Deletes the source after copying",
        "Deletes the destination first",
        "Skips deleted files"
       ],
       "answer": 0,
       "explain": "It keeps the backup an exact mirror on later runs."
      },
      {
       "id": "ch18.rsync.q2",
       "type": "order",
       "cmd": "rsync",
       "q": "Build: mirror playground into foo in archive, verbose mode",
       "parts": [
        "rsync",
        "-av",
        "playground",
        "foo"
       ]
      },
      {
       "id": "ch18.rsync.q3",
       "type": "output",
       "cmd": "rsync",
       "q": "Which command most likely printed this after one file changed?",
       "out": "building file list ... done\nplayground/dir-099/file-Z\nsent 22685 bytes  received 42 bytes  45454.00 bytes/sec",
       "choices": [
        "rsync -av playground foo",
        "tar cvf playground.tar playground",
        "zip -r playground.zip playground",
        "unzip -l playground.zip"
       ],
       "answer": 0
      },
      {
       "id": "ch18.rsync.q4",
       "type": "mc",
       "cmd": "rsync",
       "q": "Given source holds file1, what ends up in destination after rsync source/ destination?",
       "choices": [
        "file1",
        "source/file1",
        "source",
        "Nothing"
       ],
       "answer": 0,
       "explain": "The trailing slash copies the contents, not the directory."
      }
     ]
    }
   ]
  },
  {
   "id": "ch19",
   "n": 19,
   "part": 3,
   "title": "Regular Expressions",
   "summary": "Describe text patterns with POSIX regular expressions and search with grep",
   "lessons": [
    {
     "id": "ch19.grep",
     "title": "grep and Regular Expressions",
     "intro": "A regular expression is a compact notation for a text pattern. grep reads files or standard input and prints each line holding a match for the pattern you give it.",
     "commands": [],
     "terms": [
      {
       "t": "regular expression",
       "d": "A symbolic notation for a text pattern; the exact notations accepted vary slightly between tools.",
       "p": 226
      },
      {
       "t": "literal",
       "d": "An ordinary pattern character that simply matches itself, like each letter of bzip.",
       "p": 227
      },
      {
       "t": "metacharacters",
       "d": "^ $ . [ ] { } - ? * + ( ) | \\ have special meaning; every other character is a literal.",
       "p": 228
      },
      {
       "t": "\\",
       "d": "A backslash escapes a metacharacter so it matches literally; it also builds a few special sequences.",
       "p": 228
      },
      {
       "t": "'regex'",
       "d": "Quote patterns on the command line so the shell cannot expand their metacharacters first.",
       "p": 228
      }
     ],
     "tasks": [
      {
       "id": "ch19.grep.t1",
       "prompt": "Save every line of error.txt that contains the word error into a new file named errors-only.txt.",
       "hint": "grep PATTERN FILE > NEWFILE",
       "solution": "grep error error.txt > errors-only.txt",
       "check": [
        {
         "t": "exists",
         "p": "~/errors-only.txt"
        },
        {
         "t": "content",
         "p": "~/errors-only.txt",
         "re": "error"
        }
       ]
      },
      {
       "id": "ch19.grep.t2",
       "prompt": "Count how many lines of fruits.txt mention apple, without printing the lines themselves.",
       "hint": "One grep option reports a count instead of lines.",
       "solution": "grep -c apple fruits.txt",
       "check": [
        {
         "t": "cmd",
         "re": "grep\\s+-c"
        },
        {
         "t": "out",
         "re": "^\\s*3\\s*$"
        }
       ]
      },
      {
       "id": "ch19.grep.t3",
       "prompt": "Show every line of fruits.txt that does NOT contain apple.",
       "hint": "Invert the match.",
       "solution": "grep -v apple fruits.txt",
       "check": [
        {
         "t": "cmd",
         "re": "grep"
        },
        {
         "t": "out",
         "re": "^(?![\\s\\S]*(apple))[\\s\\S]*cherry"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch19.grep.q1",
       "type": "mc",
       "cmd": "grep",
       "q": "Which grep option lists the files that contain no match?",
       "choices": [
        "-L",
        "-l",
        "-v",
        "-h"
       ],
       "answer": 0,
       "explain": "-L is the mirror of -l: it names files where the pattern never shows up."
      },
      {
       "id": "ch19.grep.q2",
       "type": "fill",
       "cmd": "grep",
       "q": "Print the lines of fruits.txt that contain apple, each prefixed with its line number.",
       "accept": [
        "grep -n apple fruits.txt",
        "grep --line-number apple fruits.txt",
        "grep -n 'apple' fruits.txt"
       ]
      },
      {
       "id": "ch19.grep.q3",
       "type": "output",
       "cmd": "grep",
       "q": "Which command produced this output?",
       "out": "dirlist-bin.txt",
       "choices": [
        "grep -l bzip dirlist*.txt",
        "grep -L bzip dirlist*.txt",
        "grep -c bzip dirlist*.txt",
        "grep -h bzip dirlist*.txt"
       ],
       "answer": 0
      },
      {
       "id": "ch19.grep.q4",
       "type": "mc",
       "cmd": "grep",
       "q": "Why wrap a pattern containing metacharacters in quotes?",
       "choices": [
        "So the shell does not expand the metacharacters first",
        "Because grep rejects unquoted patterns",
        "To make the match ignore case",
        "To switch on extended expressions"
       ],
       "answer": 0,
       "explain": "Many regex metacharacters also mean something to the shell, so quoting protects them."
      }
     ],
     "refs": [
      "grep"
     ]
    },
    {
     "id": "ch19.anchors",
     "title": "The Any Character and Anchors",
     "intro": "A dot stands for any single character, while ^ and $ tie a match to the start or end of a line. Together they control where a match sits and how long it is.",
     "commands": [
      {
       "id": "regex-dot",
       "name": ".",
       "kind": "syntax",
       "summary": "Regex metacharacter that matches any one character",
       "syntax": ".",
       "explain": "A dot fills exactly one character position and accepts whatever character is there. Because it demands a character, '.zip' cannot match a line that is just zip. It will also match the period in a filename extension.",
       "examples": [
        {
         "cmd": "grep 'a.e' fruits.txt",
         "note": "Finds a, any character, then e: date matches, apple does not.",
         "sim": true,
         "viz": "scan"
        },
        {
         "cmd": "grep -h '.zip' dirlist*.txt",
         "out": "bunzip2\nbzip2\nbzip2recover\ngunzip\ngzip",
         "note": "Book example (partial): names with some character before zip.",
         "sim": false
        }
       ],
       "chapters": [
        19
       ]
      },
      {
       "id": "regex-anchors",
       "name": "^ $",
       "kind": "syntax",
       "summary": "Anchors that pin a match to the start or end of a line",
       "syntax": "^regex   regex$   ^regex$",
       "explain": "A caret at the front of a pattern only matches at the beginning of a line, and a dollar sign at the end only matches at the line's end. Using both forces the pattern to cover the whole line. ^$ on its own therefore finds blank lines.",
       "examples": [
        {
         "cmd": "grep '^b' fruits.txt",
         "note": "Only lines that begin with b.",
         "sim": true,
         "viz": "scan"
        },
        {
         "cmd": "grep 'e$' fruits.txt",
         "note": "Only lines whose last character is e.",
         "sim": true,
         "viz": "scan"
        },
        {
         "cmd": "grep '^date$' fruits.txt",
         "note": "The line must be exactly date, nothing more.",
         "sim": true,
         "viz": "scan"
        },
        {
         "cmd": "grep -i '^..j.r$' /usr/share/dict/words",
         "out": "Major\nmajor",
         "note": "Crossword helper: five letters, j third, r last.",
         "sim": false
        }
       ],
       "chapters": [
        19
       ]
      }
     ],
     "terms": [
      {
       "t": ".",
       "d": "Matches any single character in that position.",
       "p": 228
      },
      {
       "t": "^",
       "d": "Anchor: the match must start at the beginning of the line.",
       "p": 228
      },
      {
       "t": "$",
       "d": "Anchor: the match must finish at the end of the line.",
       "p": 228
      },
      {
       "t": "^$",
       "d": "A start with an end right after it, so it matches only empty lines.",
       "p": 229
      },
      {
       "t": "/usr/share/dict/words",
       "d": "A dictionary file of one word per line, useful for pattern puzzles.",
       "p": 229
      }
     ],
     "tasks": [
      {
       "id": "ch19.anchors.t1",
       "prompt": "Print the lines of fruits.txt that begin with the letter b.",
       "hint": "Anchor the b to the line start.",
       "solution": "grep '^b' fruits.txt",
       "check": [
        {
         "t": "cmd",
         "re": "\\^b"
        },
        {
         "t": "out",
         "re": "^(?![\\s\\S]*(apple|cherry|date))[\\s\\S]*banana"
        }
       ]
      },
      {
       "id": "ch19.anchors.t2",
       "prompt": "Show the fruit names in fruits.txt that are exactly five letters long, using dots and both anchors.",
       "hint": "Five dots between ^ and $.",
       "solution": "grep '^.....$' fruits.txt",
       "check": [
        {
         "t": "cmd",
         "re": "\\^\\.{5}\\$"
        },
        {
         "t": "out",
         "re": "^(?![\\s\\S]*(banana|cherry|date))[\\s\\S]*apple"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch19.anchors.q1",
       "type": "mc",
       "cmd": "regex-dot",
       "q": "Why does grep '.zip' miss a line that is exactly zip?",
       "choices": [
        "The dot needs a character before zip, so a match is four characters long",
        "The dot only matches a literal period",
        "grep skips three-letter lines",
        "The dot has to be escaped"
       ],
       "answer": 0
      },
      {
       "id": "ch19.anchors.q2",
       "type": "output",
       "cmd": "regex-anchors",
       "q": "Run against fruits.txt, a command printed this. Which one?",
       "out": "apple\napple\ndate\napple",
       "choices": [
        "grep 'e$' fruits.txt",
        "grep '^e' fruits.txt",
        "grep 'a$' fruits.txt",
        "grep '^a' fruits.txt"
       ],
       "answer": 0
      },
      {
       "id": "ch19.anchors.q3",
       "type": "fill",
       "cmd": "regex-anchors",
       "q": "Print only the empty lines of notes.txt.",
       "accept": [
        "grep '^$' notes.txt",
        "grep ^$ notes.txt",
        "grep \"^$\" notes.txt"
       ]
      },
      {
       "id": "ch19.anchors.q4",
       "type": "order",
       "cmd": "regex-anchors",
       "q": "Build: find five-letter dictionary words with j third and r last, any case",
       "parts": [
        "grep",
        "-i",
        "'^..j.r$'",
        "/usr/share/dict/words"
       ]
      }
     ]
    },
    {
     "id": "ch19.brackets",
     "title": "Bracket Expressions and Character Classes",
     "intro": "Square brackets match one character picked from a set. A leading caret negates the set, a dash builds a range, and POSIX classes give named sets that behave well in any locale.",
     "commands": [
      {
       "id": "regex-bracket",
       "name": "[ ]",
       "kind": "syntax",
       "summary": "Match a single character from a set you list",
       "syntax": "[chars]  [^chars]  [a-z]  [[:class:]]",
       "explain": "Inside brackets most metacharacters lose their power and are taken literally. A caret placed first negates the set, and a dash between two characters makes a range; a dash listed first is literal. A negated set still uses up one character position, it just must be something outside the set.",
       "examples": [
        {
         "cmd": "grep '^[bc]' fruits.txt",
         "note": "Lines starting with b or c.",
         "sim": true,
         "viz": "scan"
        },
        {
         "cmd": "grep '^[^ab]' fruits.txt",
         "note": "Lines starting with anything except a or b.",
         "sim": true,
         "viz": "scan"
        },
        {
         "cmd": "grep '[[:digit:]]' data.csv",
         "note": "Only rows holding a digit, so the header is skipped.",
         "sim": true,
         "viz": "scan"
        },
        {
         "cmd": "grep -h '[bg]zip' dirlist*.txt",
         "out": "bzip2\nbzip2recover\ngzip",
         "note": "A two-character set: bzip or gzip.",
         "sim": false
        },
        {
         "cmd": "grep -h '^[A-Z]' dirlist*.txt",
         "out": "MAKEDEV\nControlPanel\nGET\nHEAD\nPOST",
         "note": "Book example (partial): names starting with an uppercase letter.",
         "sim": false
        }
       ],
       "chapters": [
        19
       ]
      },
      {
       "id": "locale",
       "name": "locale",
       "kind": "cmd",
       "summary": "Show the system's current locale settings",
       "syntax": "locale",
       "explain": "locale prints the language and character-set variables in effect, such as LANG and LC_COLLATE. The locale decides the collation order, which changes what a range like [A-Z] covers. Setting LANG=POSIX restores traditional ASCII ordering.",
       "examples": [
        {
         "cmd": "locale",
         "out": "LANG=en_US.UTF-8\nLC_CTYPE=\"en_US.UTF-8\"\nLC_NUMERIC=\"en_US.UTF-8\"\nLC_TIME=\"en_US.UTF-8\"\nLC_COLLATE=\"en_US.UTF-8\"",
         "note": "Book output (partial) on a US English system.",
         "sim": false
        }
       ],
       "chapters": [
        19
       ]
      }
     ],
     "terms": [
      {
       "t": "[abc]",
       "d": "Bracket expression: matches one character that is any of a, b or c.",
       "p": 230
      },
      {
       "t": "[^abc]",
       "d": "Negated set: one character that is not a, b or c. The caret negates only when first.",
       "p": 230
      },
      {
       "t": "[A-Z]",
       "d": "Character range: one character from A through Z, subject to locale collation.",
       "p": 230
      },
      {
       "t": "[-AZ]",
       "d": "A dash listed first is literal, so this matches a dash, A or Z.",
       "p": 231
      },
      {
       "t": "LANG",
       "d": "Variable naming the locale's language and character set, e.g. en_US.UTF-8.",
       "p": 232
      },
      {
       "t": "collation order",
       "d": "Sort order of characters; dictionary order interleaves cases (aAbB...), unlike ASCII.",
       "p": 232
      },
      {
       "t": "export LANG=POSIX",
       "d": "Switches to traditional ASCII collation; add it to .bashrc to keep it.",
       "p": 234
      },
      {
       "t": "[:alnum:]",
       "d": "Letters and digits; in ASCII the same as [A-Za-z0-9].",
       "p": 233
      },
      {
       "t": "[:word:]",
       "d": "Like [:alnum:] plus the underscore character.",
       "p": 233
      },
      {
       "t": "[:alpha:]",
       "d": "Letters only; in ASCII the same as [A-Za-z].",
       "p": 233
      },
      {
       "t": "[:blank:]",
       "d": "Space and tab.",
       "p": 233
      },
      {
       "t": "[:cntrl:]",
       "d": "ASCII control codes 0-31 and 127.",
       "p": 233
      },
      {
       "t": "[:digit:]",
       "d": "The digits 0 to 9.",
       "p": 233
      },
      {
       "t": "[:graph:]",
       "d": "Visible characters; ASCII 33 to 126.",
       "p": 233
      },
      {
       "t": "[:lower:]",
       "d": "Lowercase letters.",
       "p": 233
      },
      {
       "t": "[:punct:]",
       "d": "Punctuation symbols.",
       "p": 233
      },
      {
       "t": "[:print:]",
       "d": "Printable characters: everything in [:graph:] plus space.",
       "p": 233
      },
      {
       "t": "[:space:]",
       "d": "Whitespace: space, tab, carriage return, newline, vertical tab, form feed.",
       "p": 233
      },
      {
       "t": "[:upper:]",
       "d": "Uppercase letters.",
       "p": 233
      },
      {
       "t": "[:xdigit:]",
       "d": "Hexadecimal digits; in ASCII the same as [0-9A-Fa-f].",
       "p": 233
      }
     ],
     "tasks": [
      {
       "id": "ch19.brackets.t1",
       "prompt": "Print the lines of fruits.txt that start with any letter except a or b.",
       "hint": "Negate a bracket expression with a leading caret.",
       "solution": "grep '^[^ab]' fruits.txt",
       "check": [
        {
         "t": "cmd",
         "re": "\\[\\^"
        },
        {
         "t": "out",
         "re": "^(?![\\s\\S]*(apple|banana))[\\s\\S]*cherry[\\s\\S]*date"
        }
       ]
      },
      {
       "id": "ch19.brackets.t2",
       "prompt": "Using a POSIX character class, print only the lines of data.csv that contain a digit.",
       "hint": "Put the class inside a bracket expression: [[:class:]]",
       "solution": "grep '[[:digit:]]' data.csv",
       "check": [
        {
         "t": "cmd",
         "re": "\\[:digit:\\]"
        },
        {
         "t": "out",
         "re": "^(?![\\s\\S]*(name,age))[\\s\\S]*ann,31,Paris"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch19.brackets.q1",
       "type": "mc",
       "cmd": "regex-bracket",
       "q": "In the expression [^bg]zip, what does the caret do?",
       "choices": [
        "Negates the set: the character before zip must not be b or g",
        "Anchors zip to the start of the line",
        "Matches a literal caret",
        "Makes the bracket optional"
       ],
       "answer": 0
      },
      {
       "id": "ch19.brackets.q2",
       "type": "mc",
       "cmd": "regex-bracket",
       "q": "How do you put a literal dash in a bracket expression?",
       "choices": [
        "List it first, as in [-AZ]",
        "Write it twice",
        "Wrap it in parentheses",
        "A dash can never be matched"
       ],
       "answer": 0
      },
      {
       "id": "ch19.brackets.q3",
       "type": "fill",
       "cmd": "regex-bracket",
       "q": "Print the lines of distros.txt that start with an uppercase letter, using a POSIX class.",
       "accept": [
        "grep '^[[:upper:]]' distros.txt",
        "grep \"^[[:upper:]]\" distros.txt"
       ]
      },
      {
       "id": "ch19.brackets.q4",
       "type": "mc",
       "cmd": "locale",
       "q": "With LANG=en_US.UTF-8, why can [A-Z] also match lowercase letters?",
       "choices": [
        "Dictionary collation interleaves cases (aAbB...), so the range spans lowercase too",
        "grep always ignores case",
        "UTF-8 has no uppercase letters",
        "[A-Z] is a POSIX class"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch19.ere",
     "title": "Extended Expressions and Alternation",
     "intro": "POSIX splits regular expressions into basic (BRE) and extended (ERE) flavors. ERE adds metacharacters such as | for alternation, and grep needs -E to use them.",
     "commands": [
      {
       "id": "regex-alternation",
       "name": "|",
       "kind": "syntax",
       "summary": "ERE alternation: match any one of several expressions",
       "syntax": "regex1|regex2[|regex3...]",
       "explain": "A bracket expression offers a choice of single characters; alternation offers a choice of whole strings or subexpressions. It is an ERE feature, so use grep -E and quote the pattern so the shell does not read | as a pipe. Parentheses group the alternatives, which decides what an anchor applies to.",
       "examples": [
        {
         "cmd": "echo \"AAA\" | grep -E 'AAA|BBB'",
         "note": "AAA is one of the alternatives, so it prints.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "echo \"CCC\" | grep -E 'AAA|BBB'",
         "note": "No output: CCC matches neither choice.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "grep -E 'cherry|date' fruits.txt",
         "note": "Lines containing either word.",
         "sim": true,
         "viz": "scan"
        },
        {
         "cmd": "grep -E '^(ban|ch)' fruits.txt",
         "note": "Grouping keeps the ^ anchor on both alternatives.",
         "sim": true,
         "viz": "scan"
        }
       ],
       "chapters": [
        19
       ]
      }
     ],
     "terms": [
      {
       "t": "BRE",
       "d": "Basic regex: ^ $ . [ ] * are special; ( ) { } turn special only when backslash-escaped.",
       "p": 234
      },
      {
       "t": "ERE",
       "d": "Extended regex adds ( ) { } ? + | as metacharacters; a backslash makes any of them literal.",
       "p": 235
      },
      {
       "t": "egrep",
       "d": "The traditional program for extended expressions; GNU grep -E does the same job.",
       "p": 235
      },
      {
       "t": "POSIX",
       "d": "Portable Operating System Interface: the IEEE 1003 standards for Unix-like APIs, shell and tools.",
       "p": 235
      },
      {
       "t": "( )",
       "d": "Groups part of an ERE, for example to limit alternation as in ^(bz|gz|zip).",
       "p": 236
      },
      {
       "t": "^bz|gz|zip",
       "d": "Ungrouped, only the first choice is anchored: starts with bz, or contains gz or zip.",
       "p": 236
      }
     ],
     "tasks": [
      {
       "id": "ch19.ere.t1",
       "prompt": "With alternation, save the lines of fruits.txt containing cherry or date into picks.txt.",
       "hint": "grep -E 'A|B' FILE > NEWFILE",
       "solution": "grep -E 'cherry|date' fruits.txt > picks.txt",
       "check": [
        {
         "t": "exists",
         "p": "~/picks.txt"
        },
        {
         "t": "content",
         "p": "~/picks.txt",
         "re": "^(?![\\s\\S]*(apple|banana))[\\s\\S]*cherry[\\s\\S]*date"
        }
       ]
      },
      {
       "id": "ch19.ere.t2",
       "prompt": "Using one grep with alternation and grouping, print the data.csv records for bob and cy.",
       "hint": "Anchor a group of names to the line start, followed by a comma.",
       "solution": "grep -E '^(bob|cy),' data.csv",
       "check": [
        {
         "t": "cmd",
         "re": "\\|"
        },
        {
         "t": "out",
         "re": "^(?![\\s\\S]*(ann))[\\s\\S]*bob,25,Rome[\\s\\S]*cy,40,Oslo"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch19.ere.q1",
       "type": "mc",
       "cmd": "regex-alternation",
       "q": "Which grep option enables extended expressions so | means alternation?",
       "choices": [
        "-E",
        "-v",
        "-h",
        "-L"
       ],
       "answer": 0
      },
      {
       "id": "ch19.ere.q2",
       "type": "output",
       "cmd": "regex-alternation",
       "q": "Which command printed this?",
       "out": "BBB",
       "choices": [
        "echo \"BBB\" | grep -E 'AAA|BBB'",
        "echo \"BBB\" | grep AAA",
        "echo \"CCC\" | grep -E 'AAA|BBB'",
        "echo \"AAA\" | grep -E 'AAA|BBB'"
       ],
       "answer": 0
      },
      {
       "id": "ch19.ere.q3",
       "type": "mc",
       "cmd": "regex-alternation",
       "q": "What does grep -E '^bz|gz|zip' match?",
       "choices": [
        "Lines starting with bz, or containing gz or zip anywhere",
        "Only lines starting with bz, gz or zip",
        "Lines that are exactly bz, gz or zip",
        "Lines containing all three strings"
       ],
       "answer": 0,
       "explain": "Without parentheses the caret binds only to the first alternative."
      },
      {
       "id": "ch19.ere.q4",
       "type": "order",
       "cmd": "regex-alternation",
       "q": "Build: lines of fruits.txt starting with ban or ch, using a group",
       "parts": [
        "grep",
        "-E",
        "'^(ban|ch)'",
        "fruits.txt"
       ]
      }
     ]
    },
    {
     "id": "ch19.quant",
     "title": "Quantifiers",
     "intro": "Quantifiers set how many times the element before them may occur. ERE offers ?, *, + and the {n,m} interval forms.",
     "commands": [
      {
       "id": "regex-optional",
       "name": "?",
       "kind": "syntax",
       "summary": "Match the preceding element zero or one time",
       "syntax": "element?",
       "explain": "A question mark makes the element in front of it optional. In the phone pattern, \\(? and \\)? let the area-code parentheses be present or missing. The backslashes are needed because parentheses are metacharacters in ERE.",
       "examples": [
        {
         "cmd": "echo \"(555) 123-4567\" | grep -E '^\\(?[0-9][0-9][0-9]\\)? [0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]$'",
         "note": "Accepted: the optional parentheses are present.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "echo \"555 123-4567\" | grep -E '^\\(?[0-9][0-9][0-9]\\)? [0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]$'",
         "note": "Also accepted: the parentheses are left out.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "echo \"AAA 123-4567\" | grep -E '^\\(?[0-9][0-9][0-9]\\)? [0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]$'",
         "note": "No output: letters are not digits.",
         "sim": true,
         "viz": "pipe"
        }
       ],
       "chapters": [
        19
       ]
      },
      {
       "id": "regex-star",
       "name": "*",
       "kind": "syntax",
       "summary": "Match the preceding element zero or more times",
       "syntax": "element*",
       "explain": "Like ?, the star marks an element as optional, but it may repeat any number of times. The sentence pattern wants a capital letter, then any run of letters and spaces, then a literal period written as \\.",
       "examples": [
        {
         "cmd": "echo \"This works.\" | grep -E '[[:upper:]][[:upper:][:lower:] ]*\\.'",
         "note": "Capital first, letters and spaces, then a period: a match.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "echo \"this does not\" | grep -E '[[:upper:]][[:upper:][:lower:] ]*\\.'",
         "note": "No output: no leading capital and no final period.",
         "sim": true,
         "viz": "pipe"
        }
       ],
       "chapters": [
        19
       ]
      },
      {
       "id": "regex-plus",
       "name": "+",
       "kind": "syntax",
       "summary": "Match the preceding element one or more times",
       "syntax": "element+",
       "explain": "The plus behaves like the star except that at least one occurrence is required. The pattern below accepts lines made of letter groups separated by single spaces.",
       "examples": [
        {
         "cmd": "echo \"a b c\" | grep -E '^([[:alpha:]]+ ?)+$'",
         "note": "Letter groups split by single spaces: printed.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "echo \"a b 9\" | grep -E '^([[:alpha:]]+ ?)+$'",
         "note": "No output: 9 is not a letter.",
         "sim": true,
         "viz": "pipe"
        }
       ],
       "chapters": [
        19
       ]
      },
      {
       "id": "regex-interval",
       "name": "{ }",
       "kind": "syntax",
       "summary": "Match the preceding element a set number of times",
       "syntax": "element{n}  {n,m}  {n,}  {,m}",
       "explain": "Braces give an exact count or a minimum and maximum for the element before them. They shorten repetitive patterns: [0-9]{3} replaces [0-9][0-9][0-9]. This is an ERE feature.",
       "examples": [
        {
         "cmd": "echo \"(555) 123-4567\" | grep -E '^\\(?[0-9]{3}\\)? [0-9]{3}-[0-9]{4}$'",
         "note": "Same phone check, written with intervals.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "echo \"5555 123-4567\" | grep -E '^\\(?[0-9]{3}\\)? [0-9]{3}-[0-9]{4}$'",
         "note": "No output: four digits where three are required.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "grep -E '^[a-z]{3},' data.csv",
         "note": "Rows whose name is exactly three lowercase letters.",
         "sim": true,
         "viz": "scan"
        }
       ],
       "chapters": [
        19
       ]
      }
     ],
     "terms": [
      {
       "t": "?",
       "d": "Quantifier: the preceding element may appear zero times or once.",
       "p": 236
      },
      {
       "t": "*",
       "d": "Quantifier: the preceding element may appear any number of times, including none.",
       "p": 237
      },
      {
       "t": "+",
       "d": "Quantifier: the preceding element must appear at least once.",
       "p": 238
      },
      {
       "t": "{n}",
       "d": "The preceding element occurs exactly n times.",
       "p": 238
      },
      {
       "t": "{n,m}",
       "d": "The preceding element occurs at least n and at most m times.",
       "p": 238
      },
      {
       "t": "{n,}",
       "d": "The preceding element occurs n times or more.",
       "p": 238
      },
      {
       "t": "{,m}",
       "d": "The preceding element occurs m times or fewer.",
       "p": 238
      },
      {
       "t": "\\.",
       "d": "A backslash before a dot matches an actual period instead of any character.",
       "p": 237
      }
     ],
     "tasks": [
      {
       "id": "ch19.quant.t1",
       "prompt": "With an interval quantifier, print the data.csv rows whose name is exactly three lowercase letters followed by a comma.",
       "hint": "Anchor to the start, then [a-z]{3},",
       "solution": "grep -E '^[a-z]{3},' data.csv",
       "check": [
        {
         "t": "cmd",
         "re": "\\{3\\}"
        },
        {
         "t": "out",
         "re": "^(?![\\s\\S]*(cy,|name))[\\s\\S]*ann,31,Paris[\\s\\S]*bob,25,Rome"
        }
       ]
      },
      {
       "id": "ch19.quant.t2",
       "prompt": "Print the lines of fruits.txt where the pair 'an' appears twice in a row.",
       "hint": "Group an in parentheses and add {2}.",
       "solution": "grep -E '(an){2}' fruits.txt",
       "check": [
        {
         "t": "cmd",
         "re": "\\{2"
        },
        {
         "t": "out",
         "re": "^(?![\\s\\S]*(apple|cherry|date))[\\s\\S]*banana"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch19.quant.q1",
       "type": "mc",
       "cmd": "regex-interval",
       "q": "What does {n,m} mean after an element?",
       "choices": [
        "At least n and at most m occurrences",
        "Exactly n or exactly m occurrences",
        "Lines n through m",
        "n characters then m characters"
       ],
       "answer": 0
      },
      {
       "id": "ch19.quant.q2",
       "type": "mc",
       "cmd": "regex-plus",
       "q": "How does + differ from *?",
       "choices": [
        "+ needs at least one occurrence; * also allows zero",
        "+ allows zero; * needs one",
        "They are identical",
        "+ works only in BRE"
       ],
       "answer": 0
      },
      {
       "id": "ch19.quant.q3",
       "type": "fill",
       "cmd": "regex-interval",
       "q": "Write [0-9][0-9][0-9] more briefly as an ERE using an interval.",
       "accept": [
        "[0-9]{3}"
       ]
      },
      {
       "id": "ch19.quant.q4",
       "type": "output",
       "cmd": "regex-optional",
       "q": "Which command printed this line?",
       "out": "555 123-4567",
       "choices": [
        "echo \"555 123-4567\" | grep -E '^\\(?[0-9]{3}\\)? [0-9]{3}-[0-9]{4}$'",
        "echo \"5555 123-4567\" | grep -E '^\\(?[0-9]{3}\\)? [0-9]{3}-[0-9]{4}$'",
        "echo \"555 123-4567\" | grep -E '^\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}$'",
        "echo \"AAA 123-4567\" | grep -E '^\\(?[0-9]{3}\\)? [0-9]{3}-[0-9]{4}$'"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch19.work",
     "title": "Putting Regular Expressions to Work",
     "intro": "Many familiar tools accept regular expressions: grep for checking lists, find and locate for pathnames, zgrep for compressed files, and less and vim for searching inside a file.",
     "commands": [
      {
       "id": "zgrep",
       "name": "zgrep",
       "kind": "cmd",
       "summary": "Search compressed files with grep",
       "syntax": "zgrep [options] regex file.gz...",
       "explain": "zgrep is a front end to grep that can read compressed files directly. It takes the usual grep options. The book uses it to list which section 1 man pages mention regular expressions.",
       "examples": [
        {
         "cmd": "zgrep -El 'regex|regular expression' *.gz",
         "out": "",
         "note": "Run in /usr/share/man/man1; lists man page files that mention either phrase.",
         "sim": false
        }
       ],
       "chapters": [
        19
       ]
      }
     ],
     "terms": [
      {
       "t": ".*",
       "d": "Any character, zero or more times; wraps a find -regex so anything may surround the core.",
       "p": 240
      },
      {
       "t": "/ (less)",
       "d": "In less or vim, press / and type a regex to search; less highlights the matches.",
       "p": 241
      },
      {
       "t": "vim search",
       "d": "vim uses BRE, so intervals are written \\{3\\} and ( ) are literal unless escaped.",
       "p": 242
      },
      {
       "t": ":hlsearch",
       "d": "vim command-mode setting that highlights search matches.",
       "p": 242
      }
     ],
     "tasks": [
      {
       "id": "ch19.work.t1",
       "prompt": "Validate data.csv like a phone list: print only the lines that do NOT have the form name,number,City (lowercase name, digits, capitalized city).",
       "hint": "grep -Ev with an anchor at each end of the pattern.",
       "solution": "grep -Ev '^[a-z]+,[0-9]+,[A-Z][a-z]+$' data.csv",
       "check": [
        {
         "t": "cmd",
         "re": "-[a-zA-Z]*v"
        },
        {
         "t": "out",
         "re": "^\\s*name,age,city\\s*$"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch19.work.q1",
       "type": "mc",
       "cmd": "find",
       "q": "How does matching with find -regex differ from grep?",
       "choices": [
        "find needs the whole pathname to match; grep needs only part of the line",
        "find takes only literal strings",
        "find always ignores case",
        "There is no difference"
       ],
       "answer": 0
      },
      {
       "id": "ch19.work.q2",
       "type": "mc",
       "cmd": "locate",
       "q": "Which locate option takes an extended regular expression?",
       "choices": [
        "--regex",
        "--regexp",
        "-l",
        "-n"
       ],
       "answer": 0
      },
      {
       "id": "ch19.work.q3",
       "type": "fill",
       "cmd": "zgrep",
       "q": "List the compressed .gz files in the current directory that mention regex.",
       "accept": [
        "zgrep -l regex *.gz",
        "zgrep -l 'regex' *.gz"
       ]
      },
      {
       "id": "ch19.work.q4",
       "type": "order",
       "cmd": "find",
       "q": "Build: find pathnames containing characters outside a safe set",
       "parts": [
        "find",
        ".",
        "-regex",
        "'.*[^-_./0-9a-zA-Z].*'"
       ]
      }
     ],
     "refs": [
      "find",
      "locate"
     ]
    }
   ]
  },
  {
   "id": "ch20",
   "n": 20,
   "part": 3,
   "title": "Text Processing",
   "summary": "Slice, sort, compare and edit text streams with classic Unix filters",
   "lessons": [
    {
     "id": "ch20.cat",
     "title": "cat: Revealing Hidden Characters",
     "intro": "cat does more than print files. Its options expose tabs and line endings, number lines and collapse runs of blank lines.",
     "commands": [],
     "terms": [
      {
       "t": "^I",
       "d": "How cat -A shows a tab: Ctrl-I, which is the same code as a tab.",
       "p": 247
      },
      {
       "t": "$ (cat -A)",
       "d": "Marks the true end of each line, so trailing spaces become visible.",
       "p": 247
      },
      {
       "t": "carriage return",
       "d": "DOS/Windows end lines with carriage return plus linefeed; Unix uses a linefeed (ASCII 10) only.",
       "p": 248
      },
      {
       "t": "dos2unix / unix2dos",
       "d": "Programs on many systems that convert text between DOS and Unix line endings.",
       "p": 248
      }
     ],
     "tasks": [
      {
       "id": "ch20.cat.t1",
       "prompt": "Check whether distros.txt separates its fields with tabs by displaying non-printing characters.",
       "hint": "cat has an option that shows tabs as ^I.",
       "solution": "cat -A distros.txt",
       "check": [
        {
         "t": "cmd",
         "re": "cat\\s+-A"
        },
        {
         "t": "out",
         "re": "\\^I"
        }
       ]
      },
      {
       "id": "ch20.cat.t2",
       "prompt": "Print notes.txt with each line numbered.",
       "hint": "cat -n FILE",
       "solution": "cat -n notes.txt",
       "check": [
        {
         "t": "cmd",
         "re": "cat\\s+-n"
        },
        {
         "t": "out",
         "re": "^\\s*1\\s"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch20.cat.q1",
       "type": "mc",
       "cmd": "cat",
       "q": "In cat -A output, what does ^I stand for?",
       "choices": [
        "A tab character",
        "A carriage return",
        "A space",
        "The end of the line"
       ],
       "answer": 0
      },
      {
       "id": "ch20.cat.q2",
       "type": "output",
       "cmd": "cat",
       "q": "Which command produced this output?",
       "out": "^IThe quick brown fox jumped over the lazy dog.   $",
       "choices": [
        "cat -A foo.txt",
        "cat -n foo.txt",
        "cat -s foo.txt",
        "cat foo.txt"
       ],
       "answer": 0
      },
      {
       "id": "ch20.cat.q3",
       "type": "fill",
       "cmd": "cat",
       "q": "Number the lines of foo.txt and squeeze repeated blank lines.",
       "accept": [
        "cat -ns foo.txt",
        "cat -sn foo.txt",
        "cat -n -s foo.txt",
        "cat -s -n foo.txt"
       ]
      }
     ],
     "refs": [
      "cat"
     ]
    },
    {
     "id": "ch20.sort",
     "title": "sort: Ordering Lines and Fields",
     "intro": "sort orders the lines it reads from files or standard input. Options pick numeric order, direction, the field used as the key and the field separator.",
     "commands": [],
     "terms": [
      {
       "t": "record",
       "d": "One line of tabular data, viewed like a database row.",
       "p": 251
      },
      {
       "t": "field",
       "d": "One column of a record; sort splits fields at spaces or tabs by default.",
       "p": 251
      },
      {
       "t": "sort key",
       "d": "The field, or range of fields, used to order records; set with -k.",
       "p": 251
      },
      {
       "t": "-k 1,1",
       "d": "A key that starts and stops at field 1; without the end part the key runs to line's end.",
       "p": 252
      },
      {
       "t": "-k 2n",
       "d": "A trailing option letter (n, b, r...) sets the sort type for that key only.",
       "p": 253
      },
      {
       "t": "-k 3.7",
       "d": "A key starting at the seventh character of field 3, for sorting on part of a field.",
       "p": 253
      }
     ],
     "tasks": [
      {
       "id": "ch20.sort.t1",
       "prompt": "Sort fruits.txt in reverse alphabetical order and save the result as fruits-rev.txt.",
       "hint": "sort -r FILE > NEWFILE",
       "solution": "sort -r fruits.txt > fruits-rev.txt",
       "check": [
        {
         "t": "exists",
         "p": "~/fruits-rev.txt"
        },
        {
         "t": "content",
         "p": "~/fruits-rev.txt",
         "re": "^date\\s*\\ncherry\\s*\\nbanana"
        }
       ]
      },
      {
       "id": "ch20.sort.t2",
       "prompt": "Sort the records of data.csv numerically by age, the second comma-separated field.",
       "hint": "Combine -t, -k and -n.",
       "solution": "sort -t ',' -k 2 -n data.csv",
       "check": [
        {
         "t": "cmd",
         "re": "-t"
        },
        {
         "t": "out",
         "re": "bob,25,Rome\\s*\\nann,31,Paris\\s*\\ncy,40,Oslo"
        }
       ]
      },
      {
       "id": "ch20.sort.t3",
       "prompt": "List each distinct fruit in fruits.txt once, in order, using sort alone.",
       "hint": "GNU sort can drop duplicates itself.",
       "solution": "sort -u fruits.txt",
       "check": [
        {
         "t": "cmd",
         "re": "-u"
        },
        {
         "t": "out",
         "re": "^\\s*apple\\s*\\nbanana\\s*\\ncherry\\s*\\ndate\\s*$"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch20.sort.q1",
       "type": "mc",
       "cmd": "sort",
       "q": "Which option makes sort compare values as numbers?",
       "choices": [
        "-n",
        "-k",
        "-b",
        "-m"
       ],
       "answer": 0
      },
      {
       "id": "ch20.sort.q2",
       "type": "fill",
       "cmd": "sort",
       "q": "Sort /etc/passwd on its seventh field, using a colon as the field separator.",
       "accept": [
        "sort -t ':' -k 7 /etc/passwd",
        "sort -t : -k 7 /etc/passwd",
        "sort -t: -k7 /etc/passwd",
        "sort -t ':' -k7 /etc/passwd"
       ]
      },
      {
       "id": "ch20.sort.q3",
       "type": "mc",
       "cmd": "sort",
       "q": "In sort -k 3.7nbr, what does 3.7 mean?",
       "choices": [
        "The key starts at the 7th character of field 3",
        "Use fields 3 through 7",
        "Sort only lines 3 to 7",
        "Three keys, each 7 wide"
       ],
       "answer": 0
      },
      {
       "id": "ch20.sort.q4",
       "type": "order",
       "cmd": "sort",
       "q": "Build: show the ten biggest items in /usr/share by disk use",
       "parts": [
        "du",
        "-s",
        "/usr/share/*",
        "|",
        "sort",
        "-nr",
        "|",
        "head"
       ]
      }
     ],
     "refs": [
      "sort"
     ]
    },
    {
     "id": "ch20.uniq",
     "title": "uniq: Handling Duplicate Lines",
     "intro": "uniq drops repeated lines, but only when the copies sit next to each other. That is why it is nearly always fed by sort.",
     "commands": [],
     "terms": [
      {
       "t": "adjacent duplicates",
       "d": "uniq compares each line only with the one before it, so unsorted copies survive.",
       "p": 255
      }
     ],
     "tasks": [
      {
       "id": "ch20.uniq.t1",
       "prompt": "Count how many times each fruit appears in fruits.txt.",
       "hint": "Sort, then pipe into uniq with a counting option.",
       "solution": "sort fruits.txt | uniq -c",
       "check": [
        {
         "t": "cmd",
         "re": "uniq\\s+-c"
        },
        {
         "t": "out",
         "re": "3 apple"
        }
       ]
      },
      {
       "id": "ch20.uniq.t2",
       "prompt": "Print only the fruits that occur exactly once in fruits.txt.",
       "hint": "sort FILE | uniq -?",
       "solution": "sort fruits.txt | uniq -u",
       "check": [
        {
         "t": "cmd",
         "re": "uniq"
        },
        {
         "t": "out",
         "re": "^\\s*cherry\\s*\\n\\s*date\\s*$"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch20.uniq.q1",
       "type": "mc",
       "cmd": "uniq",
       "q": "Why does uniq fruits.txt leave the duplicates in place?",
       "choices": [
        "uniq removes only adjacent duplicates, and the copies are not next to each other",
        "uniq needs -c to do anything",
        "uniq only reads standard input",
        "uniq skips lowercase text"
       ],
       "answer": 0
      },
      {
       "id": "ch20.uniq.q2",
       "type": "output",
       "cmd": "uniq",
       "q": "foo.txt holds a b c a b c, one per line. Which command printed this?",
       "out": "      2 a\n      2 b\n      2 c",
       "choices": [
        "sort foo.txt | uniq -c",
        "sort foo.txt | uniq -d",
        "uniq -c foo.txt",
        "sort foo.txt | uniq -u"
       ],
       "answer": 0
      },
      {
       "id": "ch20.uniq.q3",
       "type": "fill",
       "cmd": "uniq",
       "q": "Sort fruits.txt and print only the lines that are repeated.",
       "accept": [
        "sort fruits.txt | uniq -d",
        "sort fruits.txt | uniq --repeated"
       ]
      },
      {
       "id": "ch20.uniq.q4",
       "type": "order",
       "cmd": "uniq",
       "q": "Build: tally how often each fruit appears",
       "parts": [
        "sort",
        "fruits.txt",
        "|",
        "uniq",
        "-c"
       ]
      }
     ],
     "refs": [
      "uniq"
     ]
    },
    {
     "id": "ch20.cut",
     "title": "cut: Extracting Columns",
     "intro": "cut pulls a slice out of every line, either by character position or by field. It suits machine-made data with consistent separators.",
     "commands": [
      {
       "id": "cut",
       "name": "cut",
       "kind": "cmd",
       "summary": "Extract characters or fields from each line",
       "syntax": "cut -c list | -f list [-d delim] [file...]",
       "explain": "cut writes a chosen portion of each input line to standard output. You select character positions with -c or fields with -f; fields are split on a single tab unless -d names another delimiter. Lists can mix single numbers and ranges such as 7-10, separated by commas.",
       "flags": [
        {
         "f": "-c",
         "long": "--characters=list",
         "d": "Extract the characters given by list, one or more comma-separated ranges.",
         "p": 256,
         "ch": 20
        },
        {
         "f": "-f",
         "long": "--fields=list",
         "d": "Extract the fields given by list, single fields or ranges separated by commas.",
         "p": 256,
         "ch": 20
        },
        {
         "f": "-d",
         "long": "--delimiter=delim",
         "d": "With -f, split fields on delim instead of the default single tab.",
         "p": 256,
         "ch": 20
        },
        {
         "f": "--complement",
         "d": "Output everything except the parts chosen with -c or -f.",
         "p": 256,
         "ch": 20
        }
       ],
       "examples": [
        {
         "cmd": "cut -f 3 distros.txt",
         "note": "Prints the third tab-separated field, the release date.",
         "sim": true
        },
        {
         "cmd": "cut -f 3 distros.txt | cut -c 7-10",
         "note": "A second cut keeps characters 7-10 of the date: the year.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "cut -d ',' -f 1,3 data.csv",
         "note": "Comma delimiter; keeps the name and city fields.",
         "sim": true
        },
        {
         "cmd": "cut -d ':' -f 1 /etc/passwd | head",
         "note": "The account names from the colon-separated passwd file.",
         "sim": true,
         "viz": "pipe"
        }
       ],
       "chapters": [
        20
       ]
      }
     ],
     "terms": [
      {
       "t": "7-10",
       "d": "A range in a cut list; lists may combine ranges and single numbers separated by commas.",
       "p": 258
      },
      {
       "t": "expand",
       "d": "Coreutils tool that converts tabs to spaces, so cut -c can reach any character column.",
       "p": 258
      },
      {
       "t": "unexpand",
       "d": "The reverse of expand: turns spaces back into tabs.",
       "p": 258
      }
     ],
     "tasks": [
      {
       "id": "ch20.cut.t1",
       "prompt": "Print the city column (field 3) of the comma-separated data.csv.",
       "hint": "cut -d DELIM -f N FILE",
       "solution": "cut -d ',' -f 3 data.csv",
       "check": [
        {
         "t": "cmd",
         "re": "cut"
        },
        {
         "t": "out",
         "re": "city\\s*\\nParis\\s*\\nRome\\s*\\nOslo"
        }
       ]
      },
      {
       "id": "ch20.cut.t2",
       "prompt": "Save the distro names (field 1) of the tab-separated distros.txt into names.txt.",
       "hint": "Tab is cut's default delimiter.",
       "solution": "cut -f 1 distros.txt > names.txt",
       "check": [
        {
         "t": "exists",
         "p": "~/names.txt"
        },
        {
         "t": "content",
         "p": "~/names.txt",
         "re": "^(?![\\s\\S]*\\t)[\\s\\S]*(SUSE|Fedora|Ubuntu)"
        }
       ]
      },
      {
       "id": "ch20.cut.t3",
       "prompt": "Print just the release year from each line of distros.txt by chaining two cut commands.",
       "hint": "Cut field 3, then cut characters 7-10.",
       "solution": "cut -f 3 distros.txt | cut -c 7-10",
       "check": [
        {
         "t": "cmd",
         "re": "cut\\s+-c"
        },
        {
         "t": "out",
         "re": "^\\s*\\d{4}\\s*\\n"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch20.cut.q1",
       "type": "mc",
       "cmd": "cut",
       "q": "By default, what separates the fields that cut -f reads?",
       "choices": [
        "A single tab character",
        "Any whitespace",
        "A comma",
        "A colon"
       ],
       "answer": 0
      },
      {
       "id": "ch20.cut.q2",
       "type": "output",
       "cmd": "cut",
       "q": "Which command produced this output?",
       "out": "root\ndaemon\nbin\nsys",
       "choices": [
        "cut -d ':' -f 1 /etc/passwd | head",
        "cut -f 1 /etc/passwd | head",
        "cut -c 1 /etc/passwd | head",
        "sort -t ':' -k 1 /etc/passwd | head"
       ],
       "answer": 0
      },
      {
       "id": "ch20.cut.q3",
       "type": "fill",
       "cmd": "cut",
       "q": "Print fields 1 and 3 (name and city) of data.csv.",
       "accept": [
        "cut -d ',' -f 1,3 data.csv",
        "cut -d , -f 1,3 data.csv",
        "cut -d, -f1,3 data.csv",
        "cut -d ',' -f1,3 data.csv"
       ]
      },
      {
       "id": "ch20.cut.q4",
       "type": "order",
       "cmd": "cut",
       "q": "Build: extract the year from each date in distros.txt",
       "parts": [
        "cut",
        "-f",
        "3",
        "distros.txt",
        "|",
        "cut",
        "-c",
        "7-10"
       ]
      }
     ]
    },
    {
     "id": "ch20.paste",
     "title": "paste: Merging Columns",
     "intro": "paste is the counterpart of cut. It reads several files side by side and glues their matching lines into columns.",
     "commands": [
      {
       "id": "paste",
       "name": "paste",
       "kind": "cmd",
       "summary": "Merge lines of files side by side into columns",
       "syntax": "paste file...",
       "explain": "paste reads its input files in parallel and joins line 1 of each, then line 2, and so on, into a single output stream. The order of the arguments sets the order of the columns. Like cut, it accepts file arguments and standard input.",
       "examples": [
        {
         "cmd": "cut -d ',' -f 3 data.csv > cities.txt; cut -d ',' -f 1 data.csv > names.txt; paste cities.txt names.txt",
         "note": "Splits two columns apart, then pastes them back with the city first.",
         "sim": true
        },
        {
         "cmd": "paste distros-dates.txt distros-versions.txt",
         "out": "11/25/2008    Fedora      10\n10/30/2008    Ubuntu      8.10\n06/19/2008    SUSE        11.0\n05/13/2008    Fedora      9",
         "note": "Book output (partial): dates placed in front of names and versions.",
         "sim": false
        }
       ],
       "chapters": [
        20
       ]
      }
     ],
     "terms": [],
     "tasks": [
      {
       "id": "ch20.paste.t1",
       "prompt": "From data.csv, build pairs.txt with the city column first and the name column second.",
       "hint": "cut each column into its own file, then paste them in the order you want.",
       "solution": "cut -d ',' -f 3 data.csv > cities.txt && cut -d ',' -f 1 data.csv > names.txt && paste cities.txt names.txt > pairs.txt",
       "check": [
        {
         "t": "exists",
         "p": "~/pairs.txt"
        },
        {
         "t": "content",
         "p": "~/pairs.txt",
         "re": "Paris\\tann"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch20.paste.q1",
       "type": "mc",
       "cmd": "paste",
       "q": "How does paste relate to cut?",
       "choices": [
        "It does the opposite: it adds columns by combining lines from several files",
        "It deletes columns",
        "It sorts columns",
        "It is another name for join"
       ],
       "answer": 0
      },
      {
       "id": "ch20.paste.q2",
       "type": "fill",
       "cmd": "paste",
       "q": "Place the lines of dates.txt beside the lines of names.txt, dates first.",
       "accept": [
        "paste dates.txt names.txt"
       ]
      },
      {
       "id": "ch20.paste.q3",
       "type": "output",
       "cmd": "paste",
       "q": "Which command produced this output?",
       "out": "11/25/2008    Fedora      10\n10/30/2008    Ubuntu      8.10",
       "choices": [
        "paste distros-dates.txt distros-versions.txt",
        "paste distros-versions.txt distros-dates.txt",
        "cut -f 1,2 distros-by-date.txt",
        "sort distros-dates.txt distros-versions.txt"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch20.join",
     "title": "join: Combining Files on a Key",
     "intro": "join borrows a relational-database idea: records from two files are matched through a field they share. Both files must be sorted on that key.",
     "commands": [
      {
       "id": "join",
       "name": "join",
       "kind": "cmd",
       "summary": "Join lines of two files that share a key field",
       "syntax": "join file1 file2",
       "explain": "For every key value present in both files, join prints the key followed by the other fields from each file. The inputs must already be sorted on the key field or the results will be wrong. By default input fields are split on whitespace and output fields are separated by one space.",
       "examples": [
        {
         "cmd": "join distros-key-names.txt distros-key-vernums.txt | head",
         "out": "11/25/2008 Fedora 10\n10/30/2008 Ubuntu 8.10\n06/19/2008 SUSE 11.0\n05/13/2008 Fedora 9",
         "note": "Book output (partial): release date key, name, version.",
         "sim": false
        }
       ],
       "chapters": [
        20
       ]
      }
     ],
     "terms": [
      {
       "t": "key field",
       "d": "A field shared by two tables (like CUSTNUM) that lets their records be linked.",
       "p": 260
      },
      {
       "t": "join (database)",
       "d": "Combining rows from several tables that share a key into one result, such as an invoice.",
       "p": 260
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch20.join.q1",
       "type": "mc",
       "cmd": "join",
       "q": "What must be true of both files before you run join?",
       "choices": [
        "They must be sorted on the key field",
        "They must have the same number of lines",
        "They must be comma-separated",
        "They must be named .db"
       ],
       "answer": 0
      },
      {
       "id": "ch20.join.q2",
       "type": "mc",
       "cmd": "join",
       "q": "By default, what does join put between its output fields?",
       "choices": [
        "A single space",
        "A tab",
        "A comma",
        "Nothing"
       ],
       "answer": 0
      },
      {
       "id": "ch20.join.q3",
       "type": "order",
       "cmd": "join",
       "q": "Build: join the names and version-number files on the date key, first lines only",
       "parts": [
        "join",
        "distros-key-names.txt",
        "distros-key-vernums.txt",
        "|",
        "head"
       ]
      }
     ]
    },
    {
     "id": "ch20.compare",
     "title": "Comparing Files: comm, diff and patch",
     "intro": "comm and diff report how two files differ. diff output can be saved as a patch, and patch applies it to turn the old version into the new one.",
     "commands": [
      {
       "id": "comm",
       "name": "comm",
       "kind": "cmd",
       "summary": "Compare two sorted files line by line",
       "syntax": "comm [-n] file1 file2",
       "explain": "comm prints three columns: lines found only in the first file, lines found only in the second, and lines in both. Options -1, -2 and -3 hide the matching column, and they can be combined.",
       "flags": [
        {
         "f": "-1",
         "d": "Hide column 1, the lines unique to the first file.",
         "p": 262,
         "ch": 20
        },
        {
         "f": "-2",
         "d": "Hide column 2, the lines unique to the second file.",
         "p": 262,
         "ch": 20
        },
        {
         "f": "-3",
         "d": "Hide column 3, the lines both files share.",
         "p": 262,
         "ch": 20
        }
       ],
       "examples": [
        {
         "cmd": "comm file1.txt file2.txt",
         "out": "a\n                b\n                c\n                d\n       e",
         "note": "a is only in file1, e only in file2, b-d in both.",
         "sim": false
        },
        {
         "cmd": "comm -12 file1.txt file2.txt",
         "out": "b\nc\nd",
         "note": "Hides columns 1 and 2, leaving only shared lines.",
         "sim": false
        }
       ],
       "chapters": [
        20
       ]
      },
      {
       "id": "diff",
       "name": "diff",
       "kind": "cmd",
       "summary": "Compare files line by line and describe the changes",
       "syntax": "diff [options] file1 file2",
       "explain": "diff reports the edits that would turn the first file into the second. Its default output is terse change commands; the context (-c) and unified (-u) formats show surrounding lines and are more popular. It can walk whole source trees and its output can serve as a patch.",
       "flags": [
        {
         "f": "-c",
         "d": "Use context format: both files' sections are shown with markers on each line.",
         "p": 263,
         "ch": 20
        },
        {
         "f": "-u",
         "d": "Use unified format: like context but shorter, with no repeated context lines.",
         "p": 264,
         "ch": 20
        },
        {
         "f": "-r",
         "d": "Recurse through directory trees (used in diff -Naur).",
         "p": 265,
         "ch": 20
        }
       ],
       "examples": [
        {
         "cmd": "diff file1.txt file2.txt",
         "out": "1d0\n< a\n4a4\n> e",
         "note": "Default format: delete line 1, append e after line 4.",
         "sim": false
        },
        {
         "cmd": "diff -u file1.txt file2.txt",
         "out": "--- file1.txt    2008-12-23 06:40:13.000000000 -0500\n+++ file2.txt    2008-12-23 06:40:34.000000000 -0500\n@@ -1,4 +1,4 @@\n-a\n b\n c\n d\n+e",
         "note": "Unified format with three lines of context.",
         "sim": false
        },
        {
         "cmd": "diff -c file1.txt file2.txt",
         "out": "*** file1.txt    2008-12-23 06:40:13.000000000 -0500\n--- file2.txt    2008-12-23 06:40:34.000000000 -0500\n***************\n*** 1,4 ****\n- a\n  b\n  c\n  d",
         "note": "Context format (first group only).",
         "sim": false
        },
        {
         "cmd": "diff -Naur file1.txt file2.txt > patchfile.txt",
         "out": "",
         "note": "Saves a patch in the form GNU suggests for use with patch.",
         "sim": false
        }
       ],
       "chapters": [
        20
       ]
      },
      {
       "id": "patch",
       "name": "patch",
       "kind": "cmd",
       "summary": "Apply a diff file to update the original files",
       "syntax": "patch < diff_file",
       "explain": "patch reads diff output and applies those changes, turning old versions of files into new ones. A unified diff already names the files in its header, so no target needs to be given. Sending a small diff instead of a whole source tree is how projects like the Linux kernel share changes.",
       "examples": [
        {
         "cmd": "patch < patchfile.txt",
         "out": "patching file file1.txt",
         "note": "Afterward file1.txt is identical to file2.txt.",
         "sim": false
        }
       ],
       "chapters": [
        20
       ]
      }
     ],
     "terms": [
      {
       "t": "source tree",
       "d": "A directory hierarchy of program source code, which diff can scan recursively.",
       "p": 263
      },
      {
       "t": "r1ar2",
       "d": "diff change command: append the lines at r2 of file 2 at position r1 of file 1.",
       "p": 263
      },
      {
       "t": "r1cr2",
       "d": "diff change command: replace the lines at r1 with those at r2 of file 2.",
       "p": 263
      },
      {
       "t": "r1dr2",
       "d": "diff change command: delete lines r1 of file 1, which would be at r2 in file 2.",
       "p": 263
      },
      {
       "t": "*** / --- (context)",
       "d": "Context headers: asterisks mark the first file and dashes the second, with line ranges.",
       "p": 264
      },
      {
       "t": "blank (context)",
       "d": "Context format: a line shown only for context, not a difference.",
       "p": 264
      },
      {
       "t": "- (context)",
       "d": "Context format: a deleted line, present in the first file only.",
       "p": 264
      },
      {
       "t": "+ (context)",
       "d": "Context format: an added line, present in the second file only.",
       "p": 264
      },
      {
       "t": "! (context)",
       "d": "Context format: a changed line; each version appears in its file's section.",
       "p": 264
      },
      {
       "t": "@@ -1,4 +1,4 @@",
       "d": "Unified hunk header giving the line ranges in the first and second files.",
       "p": 265
      },
      {
       "t": "blank (unified)",
       "d": "Unified format: a line both files share.",
       "p": 265
      },
      {
       "t": "- (unified)",
       "d": "Unified format: a line removed from the first file.",
       "p": 265
      },
      {
       "t": "+ (unified)",
       "d": "Unified format: a line added to the first file.",
       "p": 265
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch20.compare.q1",
       "type": "mc",
       "cmd": "comm",
       "q": "Which command shows only the lines common to both files?",
       "choices": [
        "comm -12 file1.txt file2.txt",
        "comm -3 file1.txt file2.txt",
        "comm -1 file1.txt file2.txt",
        "comm -23 file1.txt file2.txt"
       ],
       "answer": 0
      },
      {
       "id": "ch20.compare.q2",
       "type": "output",
       "cmd": "diff",
       "q": "Which command produced this output?",
       "out": "1d0\n< a\n4a4\n> e",
       "choices": [
        "diff file1.txt file2.txt",
        "diff -u file1.txt file2.txt",
        "diff -c file1.txt file2.txt",
        "comm file1.txt file2.txt"
       ],
       "answer": 0
      },
      {
       "id": "ch20.compare.q3",
       "type": "mc",
       "cmd": "diff",
       "q": "In unified diff output, what does a line starting with + mean?",
       "choices": [
        "The line was added to the first file",
        "The line was deleted",
        "The line is shared context",
        "The line was changed in place"
       ],
       "answer": 0
      },
      {
       "id": "ch20.compare.q4",
       "type": "fill",
       "cmd": "diff",
       "q": "Create the patch file diff_file from old_file to new_file the way the GNU docs suggest.",
       "accept": [
        "diff -Naur old_file new_file > diff_file"
       ]
      }
     ]
    },
    {
     "id": "ch20.tr",
     "title": "tr: Translating and Deleting Characters",
     "intro": "tr is a character-level search and replace. It maps one set of characters onto another, and can also delete or squeeze characters.",
     "commands": [
      {
       "id": "tr",
       "name": "tr",
       "kind": "cmd",
       "summary": "Translate, squeeze or delete characters from standard input",
       "syntax": "tr [options] set1 [set2]",
       "explain": "tr reads standard input and replaces each character of the first set with the matching character of the second. Sets can be spelled out, written as ranges like a-z, or named with POSIX classes such as [:upper:]. The first set may be longer than the second, which collapses several characters into one.",
       "flags": [
        {
         "f": "-d",
         "d": "Delete the characters in the set instead of translating them.",
         "p": 267,
         "ch": 20
        },
        {
         "f": "-s",
         "d": "Squeeze runs of the same adjacent set character down to one.",
         "p": 267,
         "ch": 20
        }
       ],
       "examples": [
        {
         "cmd": "echo \"lowercase letters\" | tr a-z A-Z",
         "note": "Every lowercase letter becomes uppercase.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "echo \"lowercase letters\" | tr '[:lower:]' A",
         "note": "A long first set mapped to one character: every letter becomes A.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "echo \"aaabbbccc\" | tr -s ab",
         "note": "Repeated a's and b's shrink to one each; c is not in the set.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "echo \"abcabcabc\" | tr -s ab",
         "note": "No change: the repeats are not adjacent.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "cut -d ',' -f 1 data.csv | tr a-z A-Z",
         "note": "Names column from data.csv, in capitals.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "tr -d '\\r' < dos_file > unix_file",
         "out": "",
         "note": "Strips carriage returns to convert a DOS text file to Unix format.",
         "sim": false
        },
        {
         "cmd": "echo \"secret text\" | tr a-zA-Z n-za-mN-ZA-M",
         "out": "frperg grkg",
         "note": "ROT13: run it again to get the original back.",
         "sim": false
        }
       ],
       "chapters": [
        20
       ]
      }
     ],
     "terms": [
      {
       "t": "enumerated set",
       "d": "A tr set written out in full, e.g. ABCDEFGHIJKLMNOPQRSTUVWXYZ.",
       "p": 267
      },
      {
       "t": "A-Z (tr range)",
       "d": "A tr set given as a range; locale collation can affect it, so use with care.",
       "p": 267
      },
      {
       "t": "[:upper:] (tr)",
       "d": "A tr set named by a POSIX character class.",
       "p": 267
      },
      {
       "t": "\\r",
       "d": "Escape sequence for a carriage return, as in tr -d '\\r'.",
       "p": 267
      },
      {
       "t": "ROT13",
       "d": "Shift each letter 13 places; doing it twice restores the text. Obfuscation, not real encryption.",
       "p": 268
      }
     ],
     "tasks": [
      {
       "id": "ch20.tr.t1",
       "prompt": "Write an uppercase copy of fruits.txt into a file named upper.txt.",
       "hint": "tr reads standard input: tr SET1 SET2 < FILE > NEWFILE",
       "solution": "tr a-z A-Z < fruits.txt > upper.txt",
       "check": [
        {
         "t": "exists",
         "p": "~/upper.txt"
        },
        {
         "t": "content",
         "p": "~/upper.txt",
         "re": "^(?![\\s\\S]*[a-z])[\\s\\S]*BANANA"
        }
       ]
      },
      {
       "id": "ch20.tr.t2",
       "prompt": "Print the contents of data.csv with every comma deleted.",
       "hint": "tr -d deletes characters.",
       "solution": "tr -d ',' < data.csv",
       "check": [
        {
         "t": "cmd",
         "re": "tr\\s+-d"
        },
        {
         "t": "out",
         "re": "ann31Paris"
        }
       ]
      },
      {
       "id": "ch20.tr.t3",
       "prompt": "Using a pipeline, print the first column of data.csv in uppercase.",
       "hint": "cut the column, then pipe it into tr.",
       "solution": "cut -d ',' -f 1 data.csv | tr a-z A-Z",
       "check": [
        {
         "t": "cmd",
         "re": "\\|\\s*tr"
        },
        {
         "t": "out",
         "re": "NAME\\s*\\nANN\\s*\\nBOB\\s*\\nCY"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch20.tr.q1",
       "type": "mc",
       "cmd": "tr",
       "q": "What does tr -s do?",
       "choices": [
        "Squeezes adjacent repeats of set characters into one",
        "Sorts the characters",
        "Swaps the two sets",
        "Silences output"
       ],
       "answer": 0
      },
      {
       "id": "ch20.tr.q2",
       "type": "output",
       "cmd": "tr",
       "q": "Which command printed this?",
       "out": "abccc",
       "choices": [
        "echo \"aaabbbccc\" | tr -s ab",
        "echo \"aaabbbccc\" | tr -d ab",
        "echo \"abcabcabc\" | tr -s ab",
        "echo \"aaabbbccc\" | tr a-z A-Z"
       ],
       "answer": 0
      },
      {
       "id": "ch20.tr.q3",
       "type": "fill",
       "cmd": "tr",
       "q": "Convert dos_file to Unix format as unix_file by deleting carriage returns.",
       "accept": [
        "tr -d '\\r' < dos_file > unix_file",
        "tr -d \"\\r\" < dos_file > unix_file"
       ]
      },
      {
       "id": "ch20.tr.q4",
       "type": "order",
       "cmd": "tr",
       "q": "Build: turn the words lowercase letters into capitals",
       "parts": [
        "echo",
        "\"lowercase letters\"",
        "|",
        "tr",
        "a-z",
        "A-Z"
       ]
      }
     ]
    },
    {
     "id": "ch20.sed",
     "title": "sed: Addresses and Basic Commands",
     "intro": "sed is a non-interactive stream editor. It runs an editing command on each input line, and an address can restrict which lines are touched.",
     "commands": [
      {
       "id": "sed",
       "name": "sed",
       "kind": "cmd",
       "summary": "Edit a stream of text non-interactively with commands",
       "syntax": "sed [options] 'command' [file...]",
       "explain": "sed applies one editing command, or a script of them, to every line of its input and writes the result to standard output. Commands are single letters, and most may be preceded by an address that limits the lines they affect. The substitution command s takes whatever character follows it as the delimiter.",
       "flags": [
        {
         "f": "-n",
         "d": "Turn off automatic printing, so only lines printed with p appear.",
         "p": 270,
         "ch": 20
        },
        {
         "f": "-f",
         "d": "Read the editing commands from a script file.",
         "p": 273,
         "ch": 20
        },
        {
         "f": "-i",
         "d": "Edit files in place, rewriting them instead of printing to standard output.",
         "p": 276,
         "ch": 20
        }
       ],
       "examples": [
        {
         "cmd": "echo \"front\" | sed 's/front/back/'",
         "out": "back",
         "note": "Substitutes back for front.",
         "sim": false
        },
        {
         "cmd": "echo \"front\" | sed 's_front_back_'",
         "out": "back",
         "note": "Same edit with underscore as the delimiter.",
         "sim": false
        },
        {
         "cmd": "echo \"front\" | sed '2s/front/back/'",
         "out": "front",
         "note": "Address 2 does not exist in a one-line stream, so nothing changes.",
         "sim": false
        },
        {
         "cmd": "sed -n '1,5p' distros.txt",
         "out": "SUSE             10.2    12/07/2006\nFedora           10      11/25/2008\nSUSE             11.0    06/19/2008\nUbuntu           8.04    04/24/2008\nFedora           8       11/08/2007",
         "note": "Prints only lines 1 through 5.",
         "sim": false
        },
        {
         "cmd": "sed -n '/SUSE/p' distros.txt",
         "out": "SUSE             10.2    12/07/2006\nSUSE             11.0    06/19/2008\nSUSE             10.3    10/04/2007\nSUSE             10.1    05/11/2006",
         "note": "A regex address: like grep SUSE.",
         "sim": false
        },
        {
         "cmd": "sed -n '/SUSE/!p' distros.txt",
         "out": "Fedora           10      11/25/2008\nUbuntu           8.04    04/24/2008\nFedora           8       11/08/2007\nUbuntu           6.10    10/26/2006",
         "note": "Book output (partial): ! negates the address.",
         "sim": false
        }
       ],
       "chapters": [
        20
       ]
      }
     ],
     "terms": [
      {
       "t": "n (address)",
       "d": "A line number; the command runs only on that line.",
       "p": 269
      },
      {
       "t": "$ (address)",
       "d": "The last line of input.",
       "p": 269
      },
      {
       "t": "/regexp/",
       "d": "Lines matching a basic regex; \\cregexpc lets another character c be the delimiter.",
       "p": 269
      },
      {
       "t": "addr1,addr2",
       "d": "An inclusive range of lines from addr1 to addr2.",
       "p": 269
      },
      {
       "t": "first~step",
       "d": "Line first, then every step lines after it: 1~2 is every odd line.",
       "p": 269
      },
      {
       "t": "addr1,+n",
       "d": "addr1 plus the n lines that follow it.",
       "p": 269
      },
      {
       "t": "addr!",
       "d": "Every line except those that addr selects.",
       "p": 269
      },
      {
       "t": "=",
       "d": "sed command: print the current line number.",
       "p": 271
      },
      {
       "t": "a",
       "d": "sed command: append text after the current line.",
       "p": 271
      },
      {
       "t": "d",
       "d": "sed command: delete the current line.",
       "p": 271
      },
      {
       "t": "i",
       "d": "sed command: insert text before the current line.",
       "p": 271
      },
      {
       "t": "p",
       "d": "sed command: print the current line; pair with -n to avoid doubled output.",
       "p": 271
      },
      {
       "t": "q",
       "d": "sed command: stop processing; prints the current line unless -n is set.",
       "p": 271
      },
      {
       "t": "Q",
       "d": "sed command: stop processing without printing.",
       "p": 271
      },
      {
       "t": "s/regexp/replacement/",
       "d": "sed command: replace text matching regexp; an optional flag may follow.",
       "p": 271
      },
      {
       "t": "y/set1/set2",
       "d": "sed command: transliterate characters; both sets must be the same length.",
       "p": 271
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch20.sed.q1",
       "type": "mc",
       "cmd": "sed",
       "q": "Why is -n used in sed -n '1,5p' distros.txt?",
       "choices": [
        "Without it sed prints every line anyway, so lines 1-5 would appear twice",
        "-n numbers the lines",
        "-n turns on regular expressions",
        "-n edits the file in place"
       ],
       "answer": 0
      },
      {
       "id": "ch20.sed.q2",
       "type": "output",
       "cmd": "sed",
       "q": "Which command printed this?",
       "out": "front",
       "choices": [
        "echo \"front\" | sed '2s/front/back/'",
        "echo \"front\" | sed '1s/front/back/'",
        "echo \"front\" | sed 's/front/back/'",
        "echo \"front\" | sed 's_front_back_'"
       ],
       "answer": 0
      },
      {
       "id": "ch20.sed.q3",
       "type": "fill",
       "cmd": "sed",
       "q": "With sed, print only the lines of distros.txt that do not contain SUSE.",
       "accept": [
        "sed -n '/SUSE/!p' distros.txt"
       ]
      },
      {
       "id": "ch20.sed.q4",
       "type": "mc",
       "cmd": "sed",
       "q": "Which sed address selects every odd-numbered line?",
       "choices": [
        "1~2",
        "1,2",
        "1,+2",
        "$"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch20.sedscript",
     "title": "sed: Substitution, Back References and Scripts",
     "intro": "The s command can reorder text using back references to parenthesized subexpressions. Longer jobs go into a sed script run with -f.",
     "commands": [
      {
       "id": "sed-subst",
       "name": "s///",
       "kind": "syntax",
       "summary": "sed substitution: s/regexp/replacement/flags",
       "syntax": "sed 's/regexp/replacement/[g]'",
       "explain": "The s command swaps text matching regexp for replacement, by default only the first match on each line. Parenthesized subexpressions can be recalled in the replacement as \\1 to \\9, which lets you rearrange fields. Because sed reads BRE, the parentheses, braces and any extra slashes need backslashes.",
       "examples": [
        {
         "cmd": "echo \"aaabbbccc\" | sed 's/b/B/'",
         "out": "aaaBbbccc",
         "note": "Without g only the first b is replaced.",
         "sim": false
        },
        {
         "cmd": "echo \"aaabbbccc\" | sed 's/b/B/g'",
         "out": "aaaBBBccc",
         "note": "The g flag replaces all of them.",
         "sim": false
        },
        {
         "cmd": "sed 's/\\([0-9]\\{2\\}\\)\\/\\([0-9]\\{2\\}\\)\\/\\([0-9]\\{4\\}\\)$/\\3-\\1-\\2/' distros.txt",
         "out": "SUSE             10.2      2006-12-07\nFedora           10        2008-11-25\nSUSE             11.0      2008-06-19\nUbuntu           8.04      2008-04-24",
         "note": "Back references reorder MM/DD/YYYY into YYYY-MM-DD.",
         "sim": false
        },
        {
         "cmd": "sed -f distros.sed distros.txt",
         "out": "Linux Distributions Report\nSUSE            10.2      2006-12-07\nFEDORA          10        2008-11-25\nSUSE            11.0      2008-06-19",
         "note": "A script inserts a title, rewrites dates and uppercases names.",
         "sim": false
        }
       ],
       "chapters": [
        20
       ]
      }
     ],
     "terms": [
      {
       "t": "g (s flag)",
       "d": "After the replacement, g makes s replace every match on the line, not just the first.",
       "p": 273
      },
      {
       "t": "&",
       "d": "In a replacement, stands for the whole text that regexp matched.",
       "p": 271
      },
      {
       "t": "\\1 ... \\9",
       "d": "Back references: in a replacement, the text caught by the matching parenthesized subexpression.",
       "p": 272
      },
      {
       "t": "\\( \\) and \\{ \\}",
       "d": "sed uses BRE by default, so grouping and interval braces must be escaped.",
       "p": 273
      },
      {
       "t": "line-continuation character",
       "d": "A backslash right before the line end; lets i, a and c take several lines of text.",
       "p": 274
      },
      {
       "t": "# (sed script)",
       "d": "Starts a comment in a sed script; blank lines are also allowed for readability.",
       "p": 274
      },
      {
       "t": "; (sed)",
       "d": "Separates several editing commands given on one command line.",
       "p": 276
      },
      {
       "t": "awk / perl",
       "d": "Fuller programming languages people often prefer to sed for bigger text tasks.",
       "p": 275
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch20.sedscript.q1",
       "type": "mc",
       "cmd": "sed-subst",
       "q": "What does the g in s/b/B/g do?",
       "choices": [
        "Replaces every match on the line, not only the first",
        "Ignores case",
        "Prints matching lines",
        "Groups the pattern"
       ],
       "answer": 0
      },
      {
       "id": "ch20.sedscript.q2",
       "type": "fill",
       "cmd": "sed",
       "q": "Run the sed script distros.sed against distros.txt.",
       "accept": [
        "sed -f distros.sed distros.txt"
       ]
      },
      {
       "id": "ch20.sedscript.q3",
       "type": "mc",
       "cmd": "sed-subst",
       "q": "In a sed replacement, what does \\3 refer to?",
       "choices": [
        "Text matched by the third parenthesized subexpression",
        "Line 3",
        "The third character",
        "Three repeats"
       ],
       "answer": 0
      },
      {
       "id": "ch20.sedscript.q4",
       "type": "order",
       "cmd": "sed-subst",
       "q": "Build: replace every b with B in aaabbbccc",
       "parts": [
        "echo",
        "\"aaabbbccc\"",
        "|",
        "sed",
        "'s/b/B/g'"
       ]
      }
     ]
    },
    {
     "id": "ch20.aspell",
     "title": "aspell: Interactive Spellchecking",
     "intro": "aspell checks spelling interactively, offering numbered suggestions for each suspect word. It understands formats such as HTML.",
     "commands": [
      {
       "id": "aspell",
       "name": "aspell",
       "kind": "cmd",
       "summary": "Check the spelling of a text file interactively",
       "syntax": "aspell [options] check textfile",
       "explain": "In check mode aspell highlights each doubtful word, lists numbered replacements and waits for a key. It replaces ispell and is often used by other programs, but works well on its own. Before changing a file it saves the original with a .bak extension.",
       "flags": [
        {
         "f": "check",
         "d": "Interactive mode: step through each suspect word and choose a fix.",
         "p": 275,
         "ch": 20
        },
        {
         "f": "-H",
         "d": "HTML mode: skip markup inside tags so only the text is checked.",
         "p": 277,
         "ch": 20
        },
        {
         "f": "--dont-backup",
         "d": "Do not keep a .bak copy of the original file.",
         "p": 276,
         "ch": 20
        }
       ],
       "examples": [
        {
         "cmd": "aspell check foo.txt",
         "out": "The quick brown fox  jimped  over the laxy dog.\n1) jumped                               6) wimped\n2) gimped                               7) camped\ni) Ignore                               I) Ignore all\nr) Replace                              R) Replace all",
         "note": "Book screen (partial): pick a number to replace the word.",
         "sim": false
        },
        {
         "cmd": "aspell -H check foo.txt",
         "out": "",
         "note": "Spellchecks an HTML file while leaving its tags alone.",
         "sim": false
        },
        {
         "cmd": "sed -i 's/lazy/laxy/; s/jumped/jimped/' foo.txt",
         "out": "",
         "note": "Puts the typos back: -i edits in place, ; separates two commands.",
         "sim": false
        }
       ],
       "chapters": [
        20
       ]
      }
     ],
     "terms": [
      {
       "t": "i / I (aspell)",
       "d": "Ignore this occurrence / ignore the word everywhere.",
       "p": 276
      },
      {
       "t": "r / R (aspell)",
       "d": "Replace this occurrence / replace it everywhere.",
       "p": 276
      },
      {
       "t": "a (aspell)",
       "d": "Add the word to the dictionary.",
       "p": 276
      },
      {
       "t": "b / x (aspell)",
       "d": "Abort, or exit, the check session.",
       "p": 276
      },
      {
       "t": ".bak",
       "d": "Extension aspell gives the backup of the original file, unless --dont-backup is used.",
       "p": 276
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch20.aspell.q1",
       "type": "mc",
       "cmd": "aspell",
       "q": "Which aspell option stops HTML tags from being flagged as misspelled?",
       "choices": [
        "-H",
        "--dont-backup",
        "check",
        "-n"
       ],
       "answer": 0
      },
      {
       "id": "ch20.aspell.q2",
       "type": "fill",
       "cmd": "aspell",
       "q": "Spellcheck foo.txt interactively.",
       "accept": [
        "aspell check foo.txt"
       ]
      },
      {
       "id": "ch20.aspell.q3",
       "type": "mc",
       "cmd": "aspell",
       "q": "After aspell corrects foo.txt, where is the original text kept?",
       "choices": [
        "foo.txt.bak",
        "foo.txt~",
        "/tmp/foo.txt",
        "Nowhere"
       ],
       "answer": 0
      }
     ]
    }
   ]
  },
  {
   "id": "ch21",
   "n": 21,
   "part": 3,
   "title": "Formatting Output",
   "summary": "Number, wrap, paginate and lay out text with nl, fold, fmt, pr, printf, groff",
   "lessons": [
    {
     "id": "ch21.nl",
     "title": "Numbering Lines with nl",
     "intro": "nl puts numbers in front of lines, much like cat -n. It also understands logical pages, so a header, body and footer can each be numbered their own way.",
     "commands": [
      {
       "id": "nl",
       "name": "nl",
       "kind": "cmd",
       "summary": "Number lines of text",
       "syntax": "nl [options] [file...]",
       "explain": "nl reads files or standard input and prefixes lines with numbers, treating several files as one stream. Markup lines can divide the stream into logical pages with a header, body and footer. Out of the box only the non-blank lines of the body get numbers.",
       "flags": [
        {
         "f": "-b",
         "d": "Body numbering style: a = every line, t = non-blank lines (default), n = none, pREGEXP = lines matching a basic regex.",
         "p": 281,
         "ch": 21
        },
        {
         "f": "-f",
         "d": "Footer numbering style; n (none) unless you change it.",
         "p": 281,
         "ch": 21
        },
        {
         "f": "-h",
         "d": "Header numbering style; n (none) unless you change it.",
         "p": 281,
         "ch": 21
        },
        {
         "f": "-i",
         "d": "Amount added to the number on each step; 1 by default.",
         "p": 281,
         "ch": 21
        },
        {
         "f": "-n",
         "d": "Number format: ln = left-aligned, rn = right-aligned (default), rz = right-aligned padded with zeros.",
         "p": 281,
         "ch": 21
        },
        {
         "f": "-p",
         "d": "Keep counting across logical pages instead of starting over at each one.",
         "p": 281,
         "ch": 21
        },
        {
         "f": "-s",
         "d": "Text placed after each number as a separator; a tab by default.",
         "p": 281,
         "ch": 21
        },
        {
         "f": "-v",
         "d": "First number used on each logical page; 1 by default.",
         "p": 281,
         "ch": 21
        },
        {
         "f": "-w",
         "d": "Width of the number column in characters; 6 by default.",
         "p": 281,
         "ch": 21
        }
       ],
       "examples": [
        {
         "cmd": "nl distros.txt | head",
         "note": "Numbers each line of distros.txt and shows the first ten.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "nl fruits.txt",
         "note": "Every non-blank line gets a right-aligned number followed by a tab.",
         "sim": true
        },
        {
         "cmd": "sort -k 1,1 -k 2n distros.txt | sed -f distros-nl.sed | nl",
         "note": "The sed script inserts nl markup, so only the data rows in the body are numbered; header and footer lines stay bare.",
         "sim": false,
         "out": "       Linux Distributions Report\n\n       Name     Ver.    Released\n       ----     ----    --------\n     1  Fedora  5       2006-03-20\n     2  Fedora  6       2006-10-24\n     3  Fedora  7       2007-05-31"
        }
       ],
       "chapters": [
        21
       ]
      }
     ],
     "terms": [
      {
       "t": "\\:\\:\\:",
       "d": "Alone on a line, marks where a logical page header starts. nl removes the marker from the output.",
       "p": 280
      },
      {
       "t": "\\:\\:",
       "d": "Alone on a line, marks where the logical page body starts.",
       "p": 280
      },
      {
       "t": "\\:",
       "d": "Alone on a line, marks where the logical page footer starts.",
       "p": 280
      },
      {
       "t": "logical page",
       "d": "nl's numbering unit, made of header, body and footer; numbering may restart or change style in each.",
       "p": 280
      }
     ],
     "tasks": [
      {
       "id": "ch21.nl.t1",
       "prompt": "Number the lines of fruits.txt.",
       "hint": "nl FILE",
       "solution": "nl fruits.txt",
       "check": [
        {
         "t": "cmd",
         "re": "\\bnl\\b.*fruits\\.txt|fruits\\.txt.*\\|\\s*nl\\b"
        },
        {
         "t": "out",
         "re": "^\\s*1\\s+banana"
        }
       ]
      },
      {
       "id": "ch21.nl.t2",
       "prompt": "Number the lines of distros.txt but show only the first 3.",
       "hint": "Pipe nl into head",
       "solution": "nl distros.txt | head -n 3",
       "check": [
        {
         "t": "cmd",
         "re": "\\bnl\\b.*distros\\.txt.*\\|\\s*head\\s+(-n\\s*3|-3)\\b"
        },
        {
         "t": "out",
         "re": "^\\s*1\\s"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch21.nl.q1",
       "type": "mc",
       "cmd": "nl",
       "q": "Which nl option numbers every line, blank ones included?",
       "choices": [
        "-b a",
        "-b t",
        "-b n",
        "-p"
       ],
       "answer": 0,
       "explain": "Body style a numbers all lines; t (the default) skips blanks."
      },
      {
       "id": "ch21.nl.q2",
       "type": "fill",
       "cmd": "nl",
       "q": "Number the lines of fruits.txt.",
       "accept": [
        "nl fruits.txt"
       ]
      },
      {
       "id": "ch21.nl.q3",
       "type": "mc",
       "cmd": "nl",
       "q": "With default settings, which part of a logical page does nl number?",
       "choices": [
        "Only the body",
        "Only the header",
        "Header and footer",
        "All three sections"
       ],
       "answer": 0,
       "explain": "Header and footer styles default to n (none)."
      },
      {
       "id": "ch21.nl.q4",
       "type": "output",
       "cmd": "nl",
       "q": "Which command produced this output?",
       "out": "     1\tbanana\n     2\tapple\n     3\tcherry",
       "choices": [
        "nl fruits.txt | head -n 3",
        "head -n 3 fruits.txt",
        "sort fruits.txt | head -n 3",
        "wc -l fruits.txt"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch21.wrap",
     "title": "Wrapping Text with fold and fmt",
     "intro": "fold cuts lines at a fixed width, while fmt fills and joins lines into tidy paragraphs. Both read files or standard input.",
     "commands": [
      {
       "id": "fold",
       "name": "fold",
       "kind": "cmd",
       "summary": "Wrap each line to a given width",
       "syntax": "fold [options] [file...]",
       "explain": "fold breaks lines so that none is longer than a chosen width, which is 80 characters if you give none. It cuts at the exact column, even in the middle of a word. Adding -s makes it break at a space instead.",
       "flags": [
        {
         "f": "-w",
         "d": "Maximum line width in characters; 80 if not given.",
         "p": 283,
         "ch": 21
        },
        {
         "f": "-s",
         "d": "Break at the last space before the width limit rather than mid-word.",
         "p": 283,
         "ch": 21
        }
       ],
       "examples": [
        {
         "cmd": "echo \"The quick brown fox jumped over the lazy dog.\" | fold -w 12",
         "note": "Lines are cut every 12 characters, splitting words where they fall.",
         "sim": true,
         "viz": "pipe"
        },
        {
         "cmd": "echo \"The quick brown fox jumped over the lazy dog.\" | fold -w 12 -s",
         "note": "With -s the breaks land on spaces, so whole words are kept.",
         "sim": false,
         "out": "The quick\nbrown fox\njumped over\nthe lazy\ndog."
        },
        {
         "cmd": "fold -w 20 notes.txt",
         "note": "Wraps every line of notes.txt at 20 columns.",
         "sim": true
        }
       ],
       "chapters": [
        21
       ]
      },
      {
       "id": "fmt",
       "name": "fmt",
       "kind": "cmd",
       "summary": "Fill and join lines into neat paragraphs",
       "syntax": "fmt [options] [file...]",
       "explain": "fmt does more than fold: it reformats paragraphs, joining and filling lines up to a width while keeping blank lines and indentation. Since it keeps the indent of a paragraph's first line, plain fmt can give odd results. The -c option usually fixes that.",
       "flags": [
        {
         "f": "-c",
         "d": "Crown margin mode: keep the indents of a paragraph's first two lines and line up the rest with the second.",
         "p": 285,
         "ch": 21
        },
        {
         "f": "-p",
         "d": "Reformat only lines starting with the given prefix, then put the prefix back; good for # comments.",
         "p": 285,
         "ch": 21
        },
        {
         "f": "-s",
         "d": "Split-only mode: break long lines but never join short ones, useful for code.",
         "p": 285,
         "ch": 21
        },
        {
         "f": "-u",
         "d": "Uniform spacing: one space between words and two between sentences, undoing justified text.",
         "p": 285,
         "ch": 21
        },
        {
         "f": "-w",
         "d": "Target column width (75 by default); lines come out slightly shorter so they balance.",
         "p": 285,
         "ch": 21
        }
       ],
       "examples": [
        {
         "cmd": "fmt -cw 50 fmt-info.txt",
         "note": "Crown margin mode gives clean 50-column paragraphs.",
         "sim": false,
         "out": "   `fmt' reads from the specified FILE arguments\n(or standard input if none are given), and writes\nto standard output.\n   By default, blank lines, spaces between words,\nand indentation are preserved in the output;"
        },
        {
         "cmd": "fmt -w 50 -p '# ' fmt-code.txt",
         "note": "Only the comment lines are joined and refilled; the code lines are left alone.",
         "sim": false,
         "out": "# This file contains code with comments.\n\n# This line is a comment. Followed by another\n# comment line. And another.\n\nThis, on the other hand, is a line of code.\nAnd another line of code.\nAnd another."
        }
       ],
       "chapters": [
        21
       ]
      }
     ],
     "terms": [
      {
       "t": "folding",
       "d": "Breaking lines of text at a set width.",
       "p": 282
      }
     ],
     "tasks": [
      {
       "id": "ch21.wrap.t1",
       "prompt": "Show notes.txt with its lines wrapped at 10 characters.",
       "hint": "fold -w N FILE",
       "solution": "fold -w 10 notes.txt",
       "check": [
        {
         "t": "cmd",
         "re": "\\bfold\\b.*-w\\s*10\\b"
        },
        {
         "t": "cmd",
         "re": "notes\\.txt"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch21.wrap.q1",
       "type": "mc",
       "cmd": "fold",
       "q": "Which fold option makes it break at spaces instead of mid-word?",
       "choices": [
        "-s",
        "-w",
        "-c",
        "-u"
       ],
       "answer": 0,
       "explain": "-s breaks at the last space that fits."
      },
      {
       "id": "ch21.wrap.q2",
       "type": "order",
       "cmd": "fold",
       "q": "Build: wrap notes.txt at 20 columns, breaking at spaces",
       "parts": [
        "fold",
        "-w",
        "20",
        "-s",
        "notes.txt"
       ]
      },
      {
       "id": "ch21.wrap.q3",
       "type": "fill",
       "cmd": "fmt",
       "q": "Reformat fmt-info.txt to 50 columns using crown margin mode.",
       "accept": [
        "fmt -cw 50 fmt-info.txt",
        "fmt -c -w 50 fmt-info.txt",
        "fmt -w 50 -c fmt-info.txt"
       ]
      },
      {
       "id": "ch21.wrap.q4",
       "type": "mc",
       "cmd": "fmt",
       "q": "Which fmt option limits formatting to lines that begin with a given string?",
       "choices": [
        "-p",
        "-s",
        "-u",
        "-c"
       ],
       "answer": 0,
       "explain": "-p string works on prefixed lines only, such as comments."
      }
     ]
    },
    {
     "id": "ch21.pr",
     "title": "Paginating Text with pr",
     "intro": "pr turns a stream of text into pages ready for printing, with margins and a header on each page.",
     "commands": [
      {
       "id": "pr",
       "name": "pr",
       "kind": "cmd",
       "summary": "Paginate text for printing",
       "syntax": "pr [options] [file...]",
       "explain": "pr splits text into pages, padding each with blank lines for top and bottom margins. The default page header shows the file's modification time, its name and the page number. Many more layout options appear in the printing chapter.",
       "flags": [
        {
         "f": "-l",
         "d": "Page length in lines (66 by default).",
         "p": 286,
         "ch": 21
        },
        {
         "f": "-w",
         "d": "Page width in columns (72 by default).",
         "p": 286,
         "ch": 21
        },
        {
         "f": "+first[:last]",
         "d": "Output only a range of pages, from first up to the optional last.",
         "p": 301,
         "ch": 22
        },
        {
         "f": "-columns",
         "d": "Lay each page out in that many columns, e.g. -3 for three.",
         "p": 301,
         "ch": 22
        },
        {
         "f": "-a",
         "d": "Fill multicolumn output across rows instead of down columns.",
         "p": 301,
         "ch": 22
        },
        {
         "f": "-d",
         "d": "Double-space the output.",
         "p": 301,
         "ch": 22
        },
        {
         "f": "-D",
         "d": "Format the header date with a date-style format string.",
         "p": 301,
         "ch": 22
        },
        {
         "f": "-f",
         "d": "Separate pages with form feeds instead of carriage returns.",
         "p": 301,
         "ch": 22
        },
        {
         "f": "-h",
         "d": "Use the given text in the middle of the header in place of the filename.",
         "p": 301,
         "ch": 22
        },
        {
         "f": "-n",
         "d": "Number the lines.",
         "p": 301,
         "ch": 22
        },
        {
         "f": "-o",
         "d": "Add a left margin of the given number of characters.",
         "p": 301,
         "ch": 22
        },
        {
         "f": "-t",
         "d": "Leave out page headers and footers.",
         "p": 304,
         "ch": 22
        }
       ],
       "examples": [
        {
         "cmd": "pr -l 15 -w 65 distros.txt",
         "note": "Makes short pages, 15 lines long and 65 columns wide, each with a header.",
         "sim": false,
         "out": "2016-12-11 18:27                distros.txt                Page 1\n\nSUSE            10.2      12/07/2006\nFedora          10        11/25/2008\nSUSE            11.0      06/19/2008\nUbuntu          8.04      04/24/2008\nFedora          8         11/08/2007"
        },
        {
         "cmd": "ls /usr/bin | pr -3 -w 65 | head",
         "note": "Turns a directory listing into paginated three-column output.",
         "sim": false,
         "out": "2016-02-18 14:00                                                 Page 1\n\n[                             apturl                bsd-write\n411toppm                      ar                    bsh\na2p                           arecord               btcflash\na2ps                          arecordmidi           bug-buddy",
         "ch": 22
        }
       ],
       "chapters": [
        21,
        22
       ]
      }
     ],
     "terms": [
      {
       "t": "page header",
       "d": "Line pr adds at the top of each page: modification time, filename and page number.",
       "p": 286
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch21.pr.q1",
       "type": "mc",
       "cmd": "pr",
       "q": "What does pr's default page header contain?",
       "choices": [
        "Modification time, filename, page number",
        "Username and hostname",
        "Line count and word count",
        "Nothing; pr adds no header"
       ],
       "answer": 0,
       "explain": "pr builds the header from the file's time, name and the page number."
      },
      {
       "id": "ch21.pr.q2",
       "type": "fill",
       "cmd": "pr",
       "q": "Paginate distros.txt into pages 15 lines long and 65 columns wide.",
       "accept": [
        "pr -l 15 -w 65 distros.txt",
        "pr -w 65 -l 15 distros.txt"
       ]
      },
      {
       "id": "ch21.pr.q3",
       "type": "order",
       "cmd": "pr",
       "q": "Build: paginate distros.txt with 15-line, 65-column pages",
       "parts": [
        "pr",
        "-l",
        "15",
        "-w",
        "65",
        "distros.txt"
       ]
      }
     ]
    },
    {
     "id": "ch21.printf",
     "title": "Formatted Output with printf",
     "intro": "printf applies a format string to a list of arguments. It is mostly a scripting tool for laying out tabular data.",
     "commands": [
      {
       "id": "printf",
       "name": "printf",
       "kind": "builtin",
       "summary": "Format and print data from a format string",
       "syntax": "printf \"format\" arguments",
       "explain": "printf comes from the C language and is a builtin in bash. The format string mixes literal text, escape sequences such as \\n, and conversion specifications that start with %, each replaced by a formatted argument. It writes to standard output and does not read standard input.",
       "flags": [],
       "examples": [
        {
         "cmd": "printf \"I formatted the string: %s\\n\" foo",
         "note": "%s is replaced by the string foo.",
         "sim": false,
         "out": "I formatted the string: foo"
        },
        {
         "cmd": "printf \"%d, %f, %o, %s, %x, %X\\n\" 380 380 380 380 380 380",
         "note": "Six specifiers need six arguments; each shows 380 a different way.",
         "sim": false,
         "out": "380, 380.000000, 574, 380, 17c, 17C"
        },
        {
         "cmd": "printf \"%s\\t%s\\t%s\\n\" str1 str2 str3",
         "note": "\\t puts a tab between the fields.",
         "sim": false,
         "out": "str1\tstr2\tstr3"
        },
        {
         "cmd": "printf \"Line: %05d %15.3f Result: %+15d\\n\" 1071 3.14156295 32589",
         "note": "Field widths, zero padding, precision and a forced sign line up the numbers.",
         "sim": false,
         "out": "Line: 01071           3.142 Result:          +32589"
        },
        {
         "cmd": "printf \"<html>\\n\\t<head>\\n\\t\\t<title>%s</title>\\n\\t</head>\\n\\t<body>\\n\\t\\t<p>%s</p>\\n\\t</body>\\n</html>\\n\" \"Page Title\" \"Page Content\"",
         "note": "One printf can emit a small indented HTML page.",
         "sim": false,
         "out": "<html>\n\t<head>\n\t\t<title>Page Title</title>\n\t</head>\n\t<body>\n\t\t<p>Page Content</p>\n\t</body>\n</html>"
        }
       ],
       "chapters": [
        21
       ]
      }
     ],
     "terms": [
      {
       "t": "conversion specification",
       "d": "A % sequence in the format string that is replaced by a formatted argument.",
       "p": 287
      },
      {
       "t": "%d",
       "d": "Prints a number as a signed decimal integer.",
       "p": 287
      },
      {
       "t": "%f",
       "d": "Prints a number in floating-point form.",
       "p": 287
      },
      {
       "t": "%o",
       "d": "Prints an integer in octal.",
       "p": 287
      },
      {
       "t": "%s",
       "d": "Prints a string.",
       "p": 287
      },
      {
       "t": "%x",
       "d": "Prints an integer in hexadecimal using lowercase a-f.",
       "p": 287
      },
      {
       "t": "%X",
       "d": "Same as %x, but with uppercase letters.",
       "p": 287
      },
      {
       "t": "%%",
       "d": "Prints a literal percent sign.",
       "p": 287
      },
      {
       "t": "%[flags][width][.precision]conversion",
       "d": "Full shape of a conversion spec; any optional parts must appear in this order.",
       "p": 288
      },
      {
       "t": "# (flag)",
       "d": "Alternate form: octal output gains a leading 0, hex gains 0x or 0X.",
       "p": 288
      },
      {
       "t": "0 (flag)",
       "d": "Fill the field with leading zeros, as in 000380.",
       "p": 288
      },
      {
       "t": "- (flag)",
       "d": "Left-align the field; printf right-aligns unless told otherwise.",
       "p": 288
      },
      {
       "t": "' ' (flag)",
       "d": "A space flag puts a blank in front of positive numbers.",
       "p": 288
      },
      {
       "t": "+ (flag)",
       "d": "Show a plus sign on positive numbers too; normally only negatives get a sign.",
       "p": 288
      },
      {
       "t": "width",
       "d": "Number giving the minimum width of the field.",
       "p": 288
      },
      {
       "t": ".precision",
       "d": "For floats, digits after the decimal point; for strings, the most characters to print.",
       "p": 288
      },
      {
       "t": "%#x",
       "d": "Hex with the alternate-form flag: 380 becomes 0x17c.",
       "p": 288
      },
      {
       "t": "%010.5f",
       "d": "Float with five decimals in a zero-padded 10-wide field: 380 becomes 0380.00000.",
       "p": 289
      },
      {
       "t": "%.5s",
       "d": "Precision on a string cuts it short: abcdefghijk becomes abcde.",
       "p": 289
      },
      {
       "t": "\\t",
       "d": "Escape sequence for a tab character in a format string.",
       "p": 289
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch21.printf.q1",
       "type": "mc",
       "cmd": "printf",
       "q": "Which specifier prints an integer in octal?",
       "choices": [
        "%o",
        "%x",
        "%d",
        "%f"
       ],
       "answer": 0,
       "explain": "o stands for octal; 380 prints as 574."
      },
      {
       "id": "ch21.printf.q2",
       "type": "output",
       "cmd": "printf",
       "q": "Which command produced this output?",
       "out": "0x17c",
       "choices": [
        "printf \"%#x\\n\" 380",
        "printf \"%x\\n\" 380",
        "printf \"%X\\n\" 380",
        "printf \"%o\\n\" 380"
       ],
       "answer": 0
      },
      {
       "id": "ch21.printf.q3",
       "type": "fill",
       "cmd": "printf",
       "q": "Print 380 zero-padded to a width of 5, followed by a newline.",
       "accept": [
        "printf \"%05d\\n\" 380",
        "printf '%05d\\n' 380"
       ]
      },
      {
       "id": "ch21.printf.q4",
       "type": "mc",
       "cmd": "printf",
       "q": "What does the format %.5s print for the argument abcdefghijk?",
       "choices": [
        "abcde",
        "abcdefghijk padded to 5 columns",
        "abcdefghijk unchanged",
        "fghijk"
       ],
       "answer": 0,
       "explain": "Precision on a string sets the maximum characters shown."
      }
     ]
    },
    {
     "id": "ch21.groff",
     "title": "Document Formatting with groff",
     "intro": "For bigger jobs, Unix offers full document formatters. groff, the GNU take on troff, turns marked-up text into typeset pages, and it is what renders man pages.",
     "commands": [
      {
       "id": "groff",
       "name": "groff",
       "kind": "cmd",
       "summary": "GNU document formatting system in the roff family",
       "syntax": "groff [options] [file...]",
       "explain": "groff is a suite holding the GNU implementation of troff, plus a script that emulates nroff and the other roff tools. You write text with embedded markup and groff handles the layout, often through a macro package that wraps low-level requests in simpler commands. Without an output choice it produces PostScript.",
       "flags": [
        {
         "f": "-mandoc",
         "d": "Use the mandoc macro package, the one used to render man pages.",
         "p": 292,
         "ch": 21
        },
        {
         "f": "-T",
         "d": "Pick the output driver, e.g. -T ascii for plain text instead of PostScript.",
         "p": 292,
         "ch": 21
        },
        {
         "f": "-t",
         "d": "Pass the input through tbl first so table markup gets formatted.",
         "p": 294,
         "ch": 21
        }
       ],
       "examples": [
        {
         "cmd": "zcat /usr/share/man/man1/ls.1.gz | groff -mandoc -T ascii | head",
         "note": "Renders the raw ls man page as text, just as man would.",
         "sim": false,
         "out": "LS(1)                     User Commands                      LS(1)\nNAME\n       ls - list directory contents\nSYNOPSIS\n       ls [OPTION]... [FILE]..."
        },
        {
         "cmd": "zcat /usr/share/man/man1/ls.1.gz | groff -mandoc > ~/Desktop/ls.ps",
         "note": "Saves a typeset PostScript version of the man page that a page viewer can open.",
         "sim": false,
         "out": ""
        },
        {
         "cmd": "sort -k 1,1 -k 2n distros.txt | sed -f distros-tbl.sed | groff -t -T ascii",
         "note": "sed adds tbl requests, and groff -t draws a boxed table.",
         "sim": false,
         "out": "                 +------------------------------+\n                 | Linux Distributions Report   |\n                 +------------------------------+\n                 | Name    Version    Released  |\n                 +------------------------------+\n                 |Fedora     5       2006-03-20 |\n                 |Fedora     6       2006-10-24 |"
        }
       ],
       "chapters": [
        21
       ]
      },
      {
       "id": "ps2pdf",
       "name": "ps2pdf",
       "kind": "cmd",
       "summary": "Convert a PostScript file to PDF",
       "syntax": "ps2pdf file.ps file.pdf",
       "explain": "ps2pdf belongs to the ghostscript package, present on most Linux systems that can print. It converts PostScript output, such as groff's, into a Portable Document Format file.",
       "flags": [],
       "examples": [
        {
         "cmd": "ps2pdf ~/Desktop/ls.ps ~/Desktop/ls.pdf",
         "note": "Makes a PDF copy of the typeset ls man page.",
         "sim": false,
         "out": ""
        }
       ],
       "chapters": [
        21
       ]
      }
     ],
     "terms": [
      {
       "t": "roff",
       "d": "The original Unix formatter, named after 'run off' a copy; nroff and troff descend from it.",
       "p": 290
      },
      {
       "t": "nroff",
       "d": "roff-family formatter for monospaced devices such as terminals and typewriter-like printers.",
       "p": 290
      },
      {
       "t": "troff",
       "d": "roff-family formatter for typesetters that produce camera-ready output.",
       "p": 290
      },
      {
       "t": "TeX",
       "d": "Donald Knuth's typesetting system, the other main formatter family; not installed by default.",
       "p": 290
      },
      {
       "t": "texlive",
       "d": "Package to install if you want TeX; LyX is a graphical editor for it.",
       "p": 290
      },
      {
       "t": "eqn",
       "d": "roff helper that formats mathematical equations.",
       "p": 290
      },
      {
       "t": "tbl",
       "d": "roff helper that formats tables; groff -t runs it.",
       "p": 290
      },
      {
       "t": "macro package",
       "d": "Bundle of high-level groff commands built from many low-level ones, making groff easier to use.",
       "p": 291
      },
      {
       "t": "mandoc",
       "d": "groff macro package that man pages are written for.",
       "p": 292
      },
      {
       "t": "PostScript",
       "d": "Page description language for typesetter-like devices; groff's default output.",
       "p": 292
      },
      {
       "t": "request",
       "d": "groff's word for a markup element, such as the ones tbl needs.",
       "p": 293
      },
      {
       "t": ".TS / .TE",
       "d": "tbl requests that open and close a table in the text.",
       "p": 294
      },
      {
       "t": "format2format",
       "d": "Common naming style for converters, like ps2pdf; try ls /usr/bin/*[[:alpha:]]2[[:alpha:]]*.",
       "p": 293
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch21.groff.q1",
       "type": "mc",
       "cmd": "groff",
       "q": "Which groff option runs the input through tbl first?",
       "choices": [
        "-t",
        "-T",
        "-mandoc",
        "-p"
       ],
       "answer": 0,
       "explain": "-t preprocesses with tbl; -T picks the output driver."
      },
      {
       "id": "ch21.groff.q2",
       "type": "mc",
       "cmd": "groff",
       "q": "If no output format is given, what does groff produce?",
       "choices": [
        "PostScript",
        "ASCII text",
        "PDF",
        "HTML"
       ],
       "answer": 0,
       "explain": "PostScript is groff's default output."
      },
      {
       "id": "ch21.groff.q3",
       "type": "order",
       "cmd": "groff",
       "q": "Build: format man page markup as plain text with the mandoc macros",
       "parts": [
        "groff",
        "-mandoc",
        "-T",
        "ascii"
       ]
      },
      {
       "id": "ch21.groff.q4",
       "type": "mc",
       "cmd": "groff",
       "q": "Which roff program targets typesetters rather than character terminals?",
       "choices": [
        "troff",
        "nroff",
        "eqn",
        "tbl"
       ],
       "answer": 0,
       "explain": "nroff is for monospaced devices; troff is for typesetters."
      }
     ]
    }
   ]
  },
  {
   "id": "ch22",
   "n": 22,
   "part": 3,
   "title": "Printing",
   "summary": "Prepare text with pr, print with lpr/lp/a2ps, and manage CUPS print queues",
   "lessons": [
    {
     "id": "ch22.history",
     "title": "How Printing Got Here",
     "intro": "Unix printing grew up around big shared printers that printed fixed characters. That history explains 80-column terminals, page description languages and how Linux prints today.",
     "commands": [
      {
       "id": "nroff",
       "name": "nroff",
       "kind": "cmd",
       "summary": "Format roff markup for character devices",
       "syntax": "nroff [options] [file...]",
       "explain": "nroff renders roff markup for monospaced output. Piping its output to cat -A shows how old printers faked bold text: a character, a backspace (^H), then the same character again. Underlining uses an underscore and a backspace the same way.",
       "flags": [],
       "examples": [
        {
         "cmd": "zcat /usr/share/man/man1/ls.1.gz | nroff -man | cat -A | head",
         "note": "The ^H backspaces reveal the overstrike trick behind bold text.",
         "sim": false,
         "out": "LS(1)                       User Commands                      LS(1)$\n$\nN^HNA^HAM^HME^HE$\n       ls - list directory contents$\n$\nS^HSY^HYN^HNO^HOP^HPS^HSI^HIS^HS$"
        }
       ],
       "chapters": [
        22
       ]
      }
     ],
     "terms": [
      {
       "t": "banner page",
       "d": "Sheet printed at the start of a job showing the user's name, so shared output could be sorted.",
       "p": 298
      },
      {
       "t": "impact printer",
       "d": "Printer that strikes a ribbon against paper; daisy-wheel and dot-matrix were common types.",
       "p": 298
      },
      {
       "t": "monospaced font",
       "d": "Fixed-width font in which every character takes the same space.",
       "p": 298
      },
      {
       "t": "CPI",
       "d": "Characters per inch; early printers usually printed 10 across.",
       "p": 298
      },
      {
       "t": "LPI",
       "d": "Lines per inch; 6 was typical, so a US-letter page held 66 lines.",
       "p": 298
      },
      {
       "t": "80 columns",
       "d": "Usual maximum print line, which is why terminals are normally 80 characters wide.",
       "p": 298
      },
      {
       "t": "WYSIWYG",
       "d": "What you see is what you get: the screen matches the printed result.",
       "p": 298
      },
      {
       "t": "laser printer",
       "d": "Low-cost graphical printer that can place tiny dots anywhere on the page.",
       "p": 299
      },
      {
       "t": "PDL",
       "d": "Page description language: a programming language that describes what goes on a page.",
       "p": 299
      },
      {
       "t": "PostScript",
       "d": "Adobe's PDL, a full language for typography and graphics with 35 built-in fonts.",
       "p": 299
      },
      {
       "t": "RIP",
       "d": "Raster image processor: turns a page description into a bitmap of dots for printing.",
       "p": 300
      },
      {
       "t": "bitmap",
       "d": "Large pattern of bits (dots) that represents a rendered page.",
       "p": 300
      },
      {
       "t": "CUPS",
       "d": "Common Unix Printing System: print drivers, print queues and job management on Linux.",
       "p": 300
      },
      {
       "t": "Ghostscript",
       "d": "PostScript interpreter that acts as the RIP on Linux systems.",
       "p": 300
      },
      {
       "t": "print queue",
       "d": "Place where jobs wait until they can be spooled to a printer; CUPS keeps one per printer.",
       "p": 305
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch22.history.q1",
       "type": "mc",
       "cmd": "nroff",
       "q": "What does CPI measure?",
       "choices": [
        "Characters per inch",
        "Copies per job",
        "Colors per image",
        "Commands per instruction"
       ],
       "answer": 0,
       "explain": "Early printers typically printed 10 characters per inch."
      },
      {
       "id": "ch22.history.q2",
       "type": "mc",
       "cmd": "nroff",
       "q": "In modern Linux printing, which component acts as the raster image processor?",
       "choices": [
        "Ghostscript",
        "CUPS",
        "lpr",
        "pr"
       ],
       "answer": 0,
       "explain": "CUPS manages drivers and queues; Ghostscript does the rendering."
      },
      {
       "id": "ch22.history.q3",
       "type": "mc",
       "cmd": "nroff",
       "q": "Why were page description languages invented?",
       "choices": [
        "Sending full-page bitmaps was too much data for slow networks",
        "Printers could not print text",
        "To add color to terminals",
        "To replace print queues"
       ],
       "answer": 0,
       "explain": "A PDL program is far smaller than the bitmap of a whole page."
      },
      {
       "id": "ch22.history.q4",
       "type": "output",
       "cmd": "nroff",
       "q": "Which command produced this output?",
       "out": "N^HNA^HAM^HME^HE$",
       "choices": [
        "zcat /usr/share/man/man1/ls.1.gz | nroff -man | cat -A | head",
        "zcat /usr/share/man/man1/ls.1.gz | head",
        "man ls | head",
        "zcat /usr/share/man/man1/ls.1.gz | groff -mandoc | head"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch22.pr",
     "title": "Preparing Text with pr",
     "intro": "pr fits text to a page size, with optional headers and margins. Its column options make it handy in front of a printer command.",
     "commands": [],
     "terms": [],
     "tasks": [],
     "quiz": [
      {
       "id": "ch22.pr.q1",
       "type": "mc",
       "cmd": "pr",
       "q": "Which pr option lists multicolumn output across rows?",
       "choices": [
        "-a",
        "-d",
        "-f",
        "-n"
       ],
       "answer": 0,
       "explain": "-a means across; the default fills columns top to bottom."
      },
      {
       "id": "ch22.pr.q2",
       "type": "fill",
       "cmd": "pr",
       "q": "Format the output of ls /usr/bin into 3 columns, 65 characters wide.",
       "accept": [
        "ls /usr/bin | pr -3 -w 65",
        "ls /usr/bin | pr -w 65 -3"
       ]
      },
      {
       "id": "ch22.pr.q3",
       "type": "order",
       "cmd": "pr",
       "q": "Build: list /usr/bin in 3 columns with no headers or footers",
       "parts": [
        "ls",
        "/usr/bin",
        "|",
        "pr",
        "-3",
        "-t"
       ]
      },
      {
       "id": "ch22.pr.q4",
       "type": "mc",
       "cmd": "pr",
       "q": "What is pr's default page length?",
       "choices": [
        "66 lines",
        "72 lines",
        "80 lines",
        "60 lines"
       ],
       "answer": 0,
       "explain": "66 lines matches US letter at 6 lines per inch."
      }
     ],
     "refs": [
      "pr"
     ]
    },
    {
     "id": "ch22.send",
     "title": "Sending Jobs with lpr and lp",
     "intro": "CUPS supports both classic ways of printing: the Berkeley (LPD) style lpr and the System V style lp. They do roughly the same job, so pick whichever you like.",
     "commands": [
      {
       "id": "lpr",
       "name": "lpr",
       "kind": "cmd",
       "summary": "Send files to a printer (Berkeley style)",
       "syntax": "lpr [options] [file...]",
       "explain": "lpr hands files to the print system, or reads standard input, so it fits at the end of a pipeline. Jobs go to the default printer unless -P names another one. Run lpstat -a to see which printers exist.",
       "flags": [
        {
         "f": "-#",
         "d": "Print the given number of copies.",
         "p": 302,
         "ch": 22
        },
        {
         "f": "-p",
         "d": "Pretty-print: each page gets a shaded header with date, time, job name and page number.",
         "p": 302,
         "ch": 22
        },
        {
         "f": "-P",
         "d": "Send the job to the named printer instead of the default.",
         "p": 302,
         "ch": 22
        },
        {
         "f": "-r",
         "d": "Delete the files after printing, handy for temporary print files.",
         "p": 302,
         "ch": 22
        }
       ],
       "examples": [
        {
         "cmd": "ls /usr/bin | pr -3 | lpr",
         "note": "Prints the three-column listing on the default printer.",
         "sim": false,
         "out": ""
        },
        {
         "cmd": "lpr -P printer_name",
         "note": "Chooses a specific printer; replace printer_name with a name from lpstat -a.",
         "sim": false,
         "out": ""
        }
       ],
       "chapters": [
        22
       ]
      },
      {
       "id": "lp",
       "name": "lp",
       "kind": "cmd",
       "summary": "Send files to a printer (System V style)",
       "syntax": "lp [options] [file...]",
       "explain": "lp also prints files or standard input, but has a somewhat richer set of options, many given as -o settings. It comes from the System V printing tradition.",
       "flags": [
        {
         "f": "-d",
         "d": "Destination printer; the default printer is used if none is given.",
         "p": 303,
         "ch": 22
        },
        {
         "f": "-n",
         "d": "Print the given number of copies.",
         "p": 303,
         "ch": 22
        },
        {
         "f": "-o landscape",
         "d": "Print in landscape orientation.",
         "p": 303,
         "ch": 22
        },
        {
         "f": "-o fitplot",
         "d": "Scale the file to fit the page, useful for images such as JPEGs.",
         "p": 303,
         "ch": 22
        },
        {
         "f": "-o scaling=number",
         "d": "Scale to number: 100 fills the page, less shrinks it, more spreads it over several pages.",
         "p": 303,
         "ch": 22
        },
        {
         "f": "-o cpi=number",
         "d": "Characters per inch; 10 by default.",
         "p": 303,
         "ch": 22
        },
        {
         "f": "-o lpi=number",
         "d": "Lines per inch; 6 by default.",
         "p": 303,
         "ch": 22
        },
        {
         "f": "-o page-left=points",
         "d": "Left margin in points (72 to the inch); page-right, page-top and page-bottom work the same way.",
         "p": 303,
         "ch": 22
        },
        {
         "f": "-P",
         "d": "Print only the listed pages, e.g. 1,3,5,7-10.",
         "p": 303,
         "ch": 22
        }
       ],
       "examples": [
        {
         "cmd": "ls /usr/bin | pr -4 -w 90 -l 88 | lp -o page-left=36 -o cpi=12 -o lpi=8",
         "note": "Smaller type (12 CPI, 8 LPI) and a half-inch left margin fit four columns; pr is sized to match.",
         "sim": false,
         "out": ""
        },
        {
         "cmd": "ls *.txt | pr -3 | lp",
         "note": "lp reports the job's request ID.",
         "sim": false,
         "out": "request id is printer-603 (1 file(s))"
        }
       ],
       "chapters": [
        22
       ]
      }
     ],
     "terms": [
      {
       "t": "Berkeley (LPD)",
       "d": "Printing style from BSD Unix, which uses lpr.",
       "p": 301
      },
      {
       "t": "System V (SysV)",
       "d": "Printing style from System V Unix, which uses lp.",
       "p": 301
      },
      {
       "t": "PDF printer",
       "d": "Virtual printer that writes PDF files instead of paper; good for practice (may need cups-pdf).",
       "p": 302
      },
      {
       "t": "point",
       "d": "Typographic unit used for lp margins; 72 points equal one inch.",
       "p": 303
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch22.send.q1",
       "type": "mc",
       "cmd": "lpr",
       "q": "Which lpr option chooses a printer other than the default?",
       "choices": [
        "-P",
        "-p",
        "-r",
        "-#"
       ],
       "answer": 0,
       "explain": "Uppercase -P names the printer; lowercase -p pretty-prints."
      },
      {
       "id": "ch22.send.q2",
       "type": "fill",
       "cmd": "lp",
       "q": "Print 2 copies of report.txt using lp.",
       "accept": [
        "lp -n 2 report.txt"
       ]
      },
      {
       "id": "ch22.send.q3",
       "type": "order",
       "cmd": "lp",
       "q": "Build: print notes.txt in landscape orientation with lp",
       "parts": [
        "lp",
        "-o",
        "landscape",
        "notes.txt"
       ]
      },
      {
       "id": "ch22.send.q4",
       "type": "mc",
       "cmd": "lp",
       "q": "lp margins are given in points. How many points make an inch?",
       "choices": [
        "72",
        "36",
        "12",
        "100"
       ],
       "answer": 0,
       "explain": "So page-left=36 is a half-inch margin."
      }
     ]
    },
    {
     "id": "ch22.a2ps",
     "title": "Pretty Printing with a2ps",
     "intro": "a2ps converts text and other data into PostScript and prints it with neat headers and footers.",
     "commands": [
      {
       "id": "a2ps",
       "name": "a2ps",
       "kind": "cmd",
       "summary": "Convert almost anything to PostScript and print it",
       "syntax": "a2ps [options] [file...]",
       "explain": "a2ps first meant ASCII to PostScript and now stands for Anything to PostScript. It is really a printing program: output goes to the default printer, not standard output, unless -o says otherwise. By default it pretty-prints two pages on each sheet with headers and footers.",
       "flags": [
        {
         "f": "--center-title=text",
         "d": "Use text as the centered page title.",
         "p": 304,
         "ch": 22
        },
        {
         "f": "--columns=number",
         "d": "Put pages into number columns; 2 by default.",
         "p": 304,
         "ch": 22
        },
        {
         "f": "--footer=text",
         "d": "Use text as the page footer.",
         "p": 304,
         "ch": 22
        },
        {
         "f": "--guess",
         "d": "Report what type a2ps thinks each file is, to predict what it will do.",
         "p": 304,
         "ch": 22
        },
        {
         "f": "--left-footer=text",
         "d": "Use text as the left-page footer.",
         "p": 304,
         "ch": 22
        },
        {
         "f": "--left-title=text",
         "d": "Use text as the left-page title.",
         "p": 304,
         "ch": 22
        },
        {
         "f": "--line-numbers=interval",
         "d": "Number output lines every interval lines.",
         "p": 305,
         "ch": 22
        },
        {
         "f": "--list=defaults",
         "d": "Show the default settings.",
         "p": 305,
         "ch": 22
        },
        {
         "f": "--pages=range",
         "d": "Print only the pages in range.",
         "p": 305,
         "ch": 22
        },
        {
         "f": "--right-footer=text",
         "d": "Use text as the right-page footer.",
         "p": 305,
         "ch": 22
        },
        {
         "f": "--right-title=text",
         "d": "Use text as the right-page title.",
         "p": 305,
         "ch": 22
        },
        {
         "f": "--rows=number",
         "d": "Put pages into number rows; 1 by default.",
         "p": 305,
         "ch": 22
        },
        {
         "f": "-B",
         "d": "Print no page headers.",
         "p": 305,
         "ch": 22
        },
        {
         "f": "-b",
         "d": "Use the given text as the page header.",
         "p": 305,
         "ch": 22
        },
        {
         "f": "-f",
         "d": "Use a font of the given point size.",
         "p": 305,
         "ch": 22
        },
        {
         "f": "-l",
         "d": "Characters per line; with -L it helps text paginated by pr fit the page.",
         "p": 305,
         "ch": 22
        },
        {
         "f": "-L",
         "d": "Lines per page.",
         "p": 305,
         "ch": 22
        },
        {
         "f": "-M",
         "d": "Media name to use, such as A4.",
         "p": 305,
         "ch": 22
        },
        {
         "f": "-n",
         "d": "Print the given number of copies of each page.",
         "p": 305,
         "ch": 22
        },
        {
         "f": "-o",
         "d": "Write output to a file; - means standard output.",
         "p": 305,
         "ch": 22
        },
        {
         "f": "-P",
         "d": "Send to the named printer; the system default otherwise.",
         "p": 305,
         "ch": 22
        },
        {
         "f": "-R",
         "d": "Portrait orientation.",
         "p": 305,
         "ch": 22
        },
        {
         "f": "-r",
         "d": "Landscape orientation.",
         "p": 305,
         "ch": 22
        },
        {
         "f": "-T",
         "d": "Set tab stops every number characters.",
         "p": 305,
         "ch": 22
        },
        {
         "f": "-u",
         "d": "Underlay each page with text as a watermark.",
         "p": 305,
         "ch": 22
        }
       ],
       "examples": [
        {
         "cmd": "ls /usr/bin | pr -3 -t | a2ps -o ~/Desktop/ls.ps -L 66",
         "note": "pr -t drops its headers; a2ps writes a PostScript file with 66 lines per page to match.",
         "sim": false,
         "out": "[stdin (plain): 11 pages on 6 sheets]\n[Total: 11 pages on 6 sheets] saved into the file `/home/me/Desktop/ls.ps'"
        }
       ],
       "chapters": [
        22
       ]
      }
     ],
     "terms": [
      {
       "t": "pretty printer",
       "d": "Program that improves the look of printed output, as a2ps does by default.",
       "p": 303
      },
      {
       "t": "two-up",
       "d": "a2ps's default layout: two pages printed on each sheet.",
       "p": 304
      },
      {
       "t": "enscript",
       "d": "Another text-to-PostScript formatter; unlike a2ps it only accepts text.",
       "p": 305
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch22.a2ps.q1",
       "type": "mc",
       "cmd": "a2ps",
       "q": "Where does a2ps send its output by default?",
       "choices": [
        "The default printer",
        "Standard output",
        "A file named a2ps.ps",
        "/dev/null"
       ],
       "answer": 0,
       "explain": "Use -o to write a file instead."
      },
      {
       "id": "ch22.a2ps.q2",
       "type": "mc",
       "cmd": "a2ps",
       "q": "Which a2ps option reports what type it thinks each file is?",
       "choices": [
        "--guess",
        "--list=defaults",
        "-M",
        "-B"
       ],
       "answer": 0,
       "explain": "--guess predicts how a2ps will treat a file."
      },
      {
       "id": "ch22.a2ps.q3",
       "type": "fill",
       "cmd": "a2ps",
       "q": "Convert notes.txt to PostScript in the file notes.ps using a2ps.",
       "accept": [
        "a2ps -o notes.ps notes.txt",
        "a2ps notes.txt -o notes.ps"
       ]
      }
     ]
    },
    {
     "id": "ch22.jobs",
     "title": "Monitoring and Canceling Print Jobs",
     "intro": "Each printer has a queue where jobs wait. CUPS provides Berkeley- and System V-style tools to check status, view queues and cancel jobs.",
     "commands": [
      {
       "id": "lpstat",
       "name": "lpstat",
       "kind": "cmd",
       "summary": "Show printer and print system status",
       "syntax": "lpstat [options]",
       "explain": "lpstat lists the printers the system knows and whether they are available. With -a it shows whether each queue accepts jobs; with -s it summarizes the setup, including the default printer and each device address.",
       "flags": [
        {
         "f": "-a",
         "d": "Show whether print queues accept jobs (not the state of the hardware); all queues if none named.",
         "p": 306,
         "ch": 22
        },
        {
         "f": "-d",
         "d": "Show the name of the default printer.",
         "p": 306,
         "ch": 22
        },
        {
         "f": "-p",
         "d": "Show the status of the named printers, or all printers.",
         "p": 306,
         "ch": 22
        },
        {
         "f": "-r",
         "d": "Show the status of the print server.",
         "p": 306,
         "ch": 22
        },
        {
         "f": "-s",
         "d": "Show a status summary.",
         "p": 306,
         "ch": 22
        },
        {
         "f": "-t",
         "d": "Show a complete status report.",
         "p": 306,
         "ch": 22
        }
       ],
       "examples": [
        {
         "cmd": "lpstat -a",
         "note": "Both queues are accepting jobs.",
         "sim": false,
         "out": "PDF accepting requests since Mon 08 Dec 2017 03:05:59 PM EST\nprinter accepting requests since Tue 24 Feb 2018 08:43:22 AM EST"
        },
        {
         "cmd": "lpstat -s",
         "note": "printer is the default and is reached over IPP on print-server.",
         "sim": false,
         "out": "system default destination: printer\ndevice for PDF: cups-pdf:/\ndevice for printer: ipp://print-server:631/printers/printer"
        }
       ],
       "chapters": [
        22
       ]
      },
      {
       "id": "lpq",
       "name": "lpq",
       "kind": "cmd",
       "summary": "Show the jobs in a printer queue",
       "syntax": "lpq [options]",
       "explain": "lpq displays a printer's queue and the jobs waiting in it. Without -P it shows the default printer.",
       "flags": [
        {
         "f": "-P",
         "d": "Show the queue of the named printer instead of the default.",
         "p": 307,
         "ch": 22
        }
       ],
       "examples": [
        {
         "cmd": "lpq",
         "note": "An empty queue.",
         "sim": false,
         "out": "printer is ready\nno entries"
        },
        {
         "cmd": "lpq",
         "note": "After sending a job, it shows up as active.",
         "sim": false,
         "out": "printer is ready and printing\nRank    Owner   Job     File(s)                         Total Size\nactive  me      603     (stdin)                         1024 bytes"
        }
       ],
       "chapters": [
        22
       ]
      },
      {
       "id": "lprm",
       "name": "lprm",
       "kind": "cmd",
       "summary": "Remove print jobs from a queue (Berkeley style)",
       "syntax": "lprm [job...]",
       "explain": "lprm is the Berkeley-style way to stop print jobs and take them out of the queue. It does basically what cancel does, with slightly different options; its man page covers removing jobs by user, printer or number.",
       "flags": [],
       "examples": [
        {
         "cmd": "lprm 603",
         "note": "Removes job 603, like cancel 603.",
         "sim": false,
         "out": ""
        }
       ],
       "chapters": [
        22
       ]
      },
      {
       "id": "cancel",
       "name": "cancel",
       "kind": "cmd",
       "summary": "Cancel print jobs (System V style)",
       "syntax": "cancel [job...]",
       "explain": "cancel is the System V-style tool for stopping print jobs and removing them from the queue. Give it the job number that lp or lpq reported.",
       "flags": [],
       "examples": [
        {
         "cmd": "cancel 603",
         "note": "Stops job 603; lpq then shows an empty queue.",
         "sim": false,
         "out": ""
        }
       ],
       "chapters": [
        22
       ]
      }
     ],
     "terms": [
      {
       "t": "job ID",
       "d": "Number that identifies a print job (lp reports printer-603); lpq and cancel use it.",
       "p": 307
      },
      {
       "t": "ipp://",
       "d": "Internet Printing Protocol address, as used for a network printer.",
       "p": 306
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch22.jobs.q1",
       "type": "output",
       "cmd": "lpq",
       "q": "Which command produced this output?",
       "out": "printer is ready\nno entries",
       "choices": [
        "lpq",
        "lpstat -a",
        "lpstat -s",
        "cancel 603"
       ],
       "answer": 0
      },
      {
       "id": "ch22.jobs.q2",
       "type": "fill",
       "cmd": "cancel",
       "q": "Cancel print job 603 with the System V style command.",
       "accept": [
        "cancel 603"
       ]
      },
      {
       "id": "ch22.jobs.q3",
       "type": "mc",
       "cmd": "lpstat",
       "q": "Which lpstat option prints the name of the default printer?",
       "choices": [
        "-d",
        "-a",
        "-s",
        "-t"
       ],
       "answer": 0,
       "explain": "-d shows the default destination."
      },
      {
       "id": "ch22.jobs.q4",
       "type": "output",
       "cmd": "lpstat",
       "q": "Which command produced this output?",
       "out": "system default destination: printer\ndevice for PDF: cups-pdf:/",
       "choices": [
        "lpstat -s",
        "lpstat -a",
        "lpq",
        "lpstat -r"
       ],
       "answer": 0
      }
     ]
    }
   ]
  },
  {
   "id": "ch23",
   "n": 23,
   "part": 3,
   "title": "Compiling Programs",
   "summary": "Build software from source with ./configure, make and make install",
   "lessons": [
    {
     "id": "ch23.concepts",
     "title": "What Compiling Means",
     "intro": "Compiling turns human-readable source code into the machine language a CPU runs. You might do it to get a program your distribution lacks, or a newer version than it ships.",
     "commands": [
      {
       "id": "gcc",
       "name": "gcc",
       "kind": "cmd",
       "summary": "The GNU C compiler",
       "syntax": "gcc [options] file...",
       "explain": "gcc, the GNU C Compiler first written by Richard Stallman, is the C compiler used nearly everywhere on Linux. Many distributions do not install it by default, so check for it before building. In a typical build you never call it directly; make runs it through the makefile's CC variable.",
       "flags": [],
       "examples": [
        {
         "cmd": "which gcc",
         "note": "Confirms the compiler is installed.",
         "sim": false,
         "out": "/usr/bin/gcc"
        }
       ],
       "chapters": [
        23
       ]
      }
     ],
     "terms": [
      {
       "t": "source code",
       "d": "The human-readable description of a program that a programmer writes.",
       "p": 310
      },
      {
       "t": "machine language",
       "d": "Numeric binary instructions that a CPU executes directly.",
       "p": 310
      },
      {
       "t": "assembly language",
       "d": "Machine instructions written as short mnemonics like CPY and MOV.",
       "p": 310
      },
      {
       "t": "assembler",
       "d": "Program that turns assembly language into machine language.",
       "p": 310
      },
      {
       "t": "high-level language",
       "d": "Language that lets you focus on the problem instead of the CPU, e.g. FORTRAN, COBOL, C, C++.",
       "p": 310
      },
      {
       "t": "compiler",
       "d": "Program that translates high-level source code into machine language.",
       "p": 311
      },
      {
       "t": "library",
       "d": "Collection of shared routines for common tasks; many live in /lib and /usr/lib.",
       "p": 311
      },
      {
       "t": "linker",
       "d": "Program that connects compiler output with the libraries it needs.",
       "p": 311
      },
      {
       "t": "executable",
       "d": "The finished program file produced by compiling and linking.",
       "p": 311
      },
      {
       "t": "interpreter",
       "d": "Program that reads and runs a script's instructions one by one, with no compile step.",
       "p": 311
      },
      {
       "t": "scripting language",
       "d": "Interpreted language such as shell, Perl, Python, PHP or Ruby; slower to run but faster to develop.",
       "p": 311
      },
      {
       "t": "meta-package",
       "d": "A group of packages installed together, e.g. a software-development bundle.",
       "p": 312
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch23.concepts.q1",
       "type": "mc",
       "cmd": "gcc",
       "q": "Which program connects compiled code to the libraries it uses?",
       "choices": [
        "The linker",
        "The assembler",
        "The interpreter",
        "configure"
       ],
       "answer": 0,
       "explain": "Linking joins compiler output and library routines into an executable."
      },
      {
       "id": "ch23.concepts.q2",
       "type": "mc",
       "cmd": "gcc",
       "q": "Why do interpreted programs usually run slower than compiled ones?",
       "choices": [
        "Each instruction is translated every time it runs",
        "They cannot use libraries",
        "They run only as root",
        "They are always larger"
       ],
       "answer": 0,
       "explain": "A compiled program is translated once, ahead of time."
      },
      {
       "id": "ch23.concepts.q3",
       "type": "mc",
       "cmd": "gcc",
       "q": "What two reasons does the book give for compiling software yourself?",
       "choices": [
        "Availability and timeliness",
        "Security and speed",
        "Licensing and cost",
        "Size and portability"
       ],
       "answer": 0,
       "explain": "Your distribution may lack a program, or ship an older version."
      }
     ]
    },
    {
     "id": "ch23.source",
     "title": "Getting and Examining Source Code",
     "intro": "Source code usually comes as a compressed tar file. After downloading it (with ftp or wget, covered in Chapter 16), unpack it with tar (Chapter 18) and look around the source tree.",
     "commands": [],
     "terms": [
      {
       "t": "tarball",
       "d": "A compressed tar file, the usual way source code is distributed.",
       "p": 313
      },
      {
       "t": "source tree",
       "d": "The hierarchy of directories and files that make up a program's source.",
       "p": 313
      },
      {
       "t": "project-x.xx",
       "d": "Standard name of the unpacked source directory: the project name plus its version.",
       "p": 313
      },
      {
       "t": "tar tzvf tarfile | head",
       "d": "Peek at a tarball's layout first, to check it unpacks into its own directory.",
       "p": 313
      },
      {
       "t": "~/src",
       "d": "Where you keep source code that you maintain yourself.",
       "p": 313
      },
      {
       "t": "/usr/src",
       "d": "Where source code installed by your distribution goes.",
       "p": 313
      },
      {
       "t": "/usr/local/src",
       "d": "Where locally maintained source meant for many users usually goes.",
       "p": 313
      },
      {
       "t": "README",
       "d": "File describing the program; read it before building.",
       "p": 314
      },
      {
       "t": "INSTALL",
       "d": "File explaining how to build and install the program; read it before building.",
       "p": 314
      },
      {
       "t": "NEWS",
       "d": "Standard GNU documentation file shipped with the source.",
       "p": 314
      },
      {
       "t": "COPYING",
       "d": "File with the program's license terms.",
       "p": 314
      },
      {
       "t": ".c file",
       "d": "C source code module; ordinary text you can read with less.",
       "p": 314
      },
      {
       "t": ".h file",
       "d": "Header file describing the routines in a source file or library.",
       "p": 314
      },
      {
       "t": "#include",
       "d": "Tells the compiler to read a header; \"getopt.h\" is local, <stdio.h> is a system header.",
       "p": 314
      },
      {
       "t": "/usr/include",
       "d": "Directory of system header files, installed along with the compiler.",
       "p": 315
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch23.source.q1",
       "type": "mc",
       "cmd": "tar",
       "q": "What do .h header files contain?",
       "choices": [
        "Descriptions of routines in a source file or library",
        "Compiled machine code",
        "The license terms",
        "Build instructions for make"
       ],
       "answer": 0,
       "explain": "The compiler needs them to know what other modules provide."
      },
      {
       "id": "ch23.source.q2",
       "type": "fill",
       "cmd": "tar",
       "q": "Unpack the tarball diction-1.11.tar.gz.",
       "accept": [
        "tar xzf diction-1.11.tar.gz",
        "tar xzvf diction-1.11.tar.gz"
       ]
      },
      {
       "id": "ch23.source.q3",
       "type": "order",
       "cmd": "tar",
       "q": "Build: preview the first lines of diction-1.11.tar.gz's contents",
       "parts": [
        "tar",
        "tzvf",
        "diction-1.11.tar.gz",
        "|",
        "head"
       ]
      },
      {
       "id": "ch23.source.q4",
       "type": "mc",
       "cmd": "tar",
       "q": "Which files should you read before trying to build a program?",
       "choices": [
        "README and INSTALL",
        "COPYING and NEWS",
        "config.sub and config.guess",
        "Makefile.in and configure.in"
       ],
       "answer": 0,
       "explain": "They describe the program and how to build it."
      }
     ],
     "refs": [
      "tar"
     ]
    },
    {
     "id": "ch23.configure",
     "title": "Configuring the Build",
     "intro": "Most packages build with two commands: ./configure, then make. configure gets the source ready for your particular system.",
     "commands": [
      {
       "id": "configure",
       "name": "./configure",
       "kind": "syntax",
       "summary": "Check the build environment and create the Makefile",
       "syntax": "./configure",
       "explain": "configure is a shell script shipped with the source tree. It inspects the system, adjusts portable source for differences between Unix-like systems, and checks that needed tools are installed. It finishes by writing files such as Makefile. If it prints errors, the program will not build until they are fixed.",
       "flags": [],
       "examples": [
        {
         "cmd": "./configure",
         "note": "The ./ is needed because the script lives in the current directory, not where the shell looks for programs.",
         "sim": false,
         "out": "checking for libintl.h... yes\nchecking for library containing gettext... none required\nconfigure: creating ./config.status\nconfig.status: creating Makefile\nconfig.status: creating diction.1\nconfig.status: creating config.h"
        }
       ],
       "chapters": [
        23
       ]
      }
     ],
     "terms": [
      {
       "t": "./",
       "d": "Prefix telling the shell the program is in the current working directory.",
       "p": 315
      },
      {
       "t": "portable",
       "d": "Source written so it can be built on many different Unix-like systems.",
       "p": 315
      },
      {
       "t": "config.status",
       "d": "Script configure creates, which then writes Makefile, config.h and other files.",
       "p": 315
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch23.configure.q1",
       "type": "mc",
       "cmd": "configure",
       "q": "Why is configure run as ./configure?",
       "choices": [
        "It sits in the current directory, where the shell doesn't look for programs",
        "The dot makes it run as root",
        "It hides the output",
        "It is required for all shell scripts in /usr/bin"
       ],
       "answer": 0,
       "explain": "./ gives the shell the program's location explicitly."
      },
      {
       "id": "ch23.configure.q2",
       "type": "output",
       "cmd": "configure",
       "q": "Which command produced this output?",
       "out": "config.status: creating Makefile\nconfig.status: creating config.h",
       "choices": [
        "./configure",
        "make",
        "sudo make install",
        "less Makefile"
       ],
       "answer": 0
      },
      {
       "id": "ch23.configure.q3",
       "type": "fill",
       "cmd": "configure",
       "q": "Run the configure script in the current directory.",
       "accept": [
        "./configure"
       ]
      }
     ]
    },
    {
     "id": "ch23.make",
     "title": "Building and Installing with make",
     "intro": "make reads the Makefile and builds the program, redoing only the parts that are out of date. A final make install puts the result in a system directory.",
     "commands": [
      {
       "id": "make",
       "name": "make",
       "kind": "cmd",
       "summary": "Build targets from a makefile, redoing only what is out of date",
       "syntax": "make [target]",
       "explain": "make reads a makefile, normally called Makefile, listing targets, the files each depends on, and the commands that build them. It requires targets to be newer than their dependencies, so it rebuilds only what is missing or stale. Run it twice with nothing changed and it does nothing. It suits any target and dependency job, not just compiling.",
       "flags": [
        {
         "f": "install",
         "d": "Special target in well-packaged source that installs the program, usually into /usr/local/bin.",
         "p": 318,
         "ch": 23
        }
       ],
       "examples": [
        {
         "cmd": "make",
         "note": "Running it again with every target current: nothing needs rebuilding.",
         "sim": false,
         "out": "make: Nothing to be done for `all'."
        },
        {
         "cmd": "touch getopt.c && make",
         "note": "getopt.c is now newer than diction, so make rebuilds the pieces that depend on it.",
         "sim": false,
         "out": ""
        },
        {
         "cmd": "sudo make install",
         "note": "/usr/local/bin is not writable by ordinary users, so installing needs superuser rights.",
         "sim": false,
         "out": ""
        }
       ],
       "chapters": [
        23
       ]
      }
     ],
     "terms": [
      {
       "t": "makefile",
       "d": "Text file telling make how to build a program; make won't run without one.",
       "p": 316
      },
      {
       "t": "target",
       "d": "A file the makefile says how to build, such as the executable diction.",
       "p": 316
      },
      {
       "t": "dependency",
       "d": "A file a target needs; make rebuilds the target when a dependency is newer.",
       "p": 316
      },
      {
       "t": "CC= gcc",
       "d": "Makefile variable naming the C compiler; $(CC) is replaced by gcc when make runs.",
       "p": 316
      },
      {
       "t": ".c.o:",
       "d": "General makefile rule saying how to compile any .c file into a .o file.",
       "p": 317
      },
      {
       "t": ".o file",
       "d": "Intermediate compiled module, such as getopt.o, linked into the final program.",
       "p": 317
      },
      {
       "t": "/usr/local/bin",
       "d": "Traditional home for locally built software; ordinary users can't write to it.",
       "p": 318
      }
     ],
     "tasks": [],
     "quiz": [
      {
       "id": "ch23.make.q1",
       "type": "output",
       "cmd": "make",
       "q": "Which command produced this output?",
       "out": "make: Nothing to be done for `all'.",
       "choices": [
        "make",
        "./configure",
        "sudo make install",
        "less Makefile"
       ],
       "answer": 0
      },
      {
       "id": "ch23.make.q2",
       "type": "order",
       "cmd": "make",
       "q": "Build: install the compiled program as the superuser",
       "parts": [
        "sudo",
        "make",
        "install"
       ]
      },
      {
       "id": "ch23.make.q3",
       "type": "mc",
       "cmd": "make",
       "q": "After touch getopt.c, what does running make do?",
       "choices": [
        "Rebuilds the targets that depend on getopt.c",
        "Nothing, since all targets exist",
        "Deletes the diction program",
        "Runs configure again"
       ],
       "answer": 0,
       "explain": "make keeps targets newer than their dependencies."
      },
      {
       "id": "ch23.make.q4",
       "type": "fill",
       "cmd": "make",
       "q": "Build the program from the Makefile in the current directory.",
       "accept": [
        "make"
       ]
      }
     ]
    }
   ]
  },
  {
   "id": "ch24",
   "n": 24,
   "part": 4,
   "title": "Writing Your First Script",
   "summary": "Create a script file, make it executable, and put it on your PATH",
   "lessons": [
    {
     "id": "ch24.format",
     "title": "Script File Format",
     "intro": "A shell script is just a text file full of commands that the shell runs one after another. Every script starts with a special first line and can carry comments to explain itself.",
     "commands": [
      {
       "id": "shebang",
       "name": "#!",
       "kind": "syntax",
       "summary": "First script line naming the interpreter that runs the file",
       "syntax": "#!/bin/bash",
       "explain": "The two characters #! at the very top of a script form the shebang. They tell the kernel which program should interpret the rest of the file. Every shell script should begin with one, such as #!/bin/bash.",
       "examples": [
        {
         "cmd": "#!/bin/bash\n# This is our first script.\necho 'Hello World!'",
         "out": "Hello World!",
         "note": "The classic Hello World script: a shebang, a comment, and one echo command.",
         "sim": false
        }
       ],
       "chapters": [
        24
       ]
      },
      {
       "id": "comment",
       "name": "#",
       "kind": "syntax",
       "summary": "Mark the rest of a line as a comment the shell ignores",
       "syntax": "command # comment text",
       "explain": "From a # symbol to the end of the line, the shell ignores the text. A comment can fill a whole line or follow a command, as long as at least one whitespace character comes before the #. Comments even work at the prompt, though they rarely help there.",
       "examples": [
        {
         "cmd": "echo 'Hello World!' # This is a comment too",
         "out": "Hello World!",
         "note": "Only the echo part runs; the trailing comment is skipped.",
         "sim": false
        }
       ],
       "chapters": [
        24
       ]
      }
     ],
     "terms": [
      {
       "t": "shell script",
       "d": "A plain text file of commands that the shell reads and runs as if they were typed at the prompt.",
       "p": 323
      },
      {
       "t": "three steps to a script",
       "d": "Write the file in a text editor, set execute permission, then store it where the shell searches for programs.",
       "p": 324
      },
      {
       "t": "syntax highlighting",
       "d": "Editor feature that colors script elements, making some mistakes easy to spot. vim, gedit and kate offer it.",
       "p": 324
      }
     ],
     "quiz": [
      {
       "id": "ch24.format.q1",
       "type": "mc",
       "cmd": "shebang",
       "q": "What does the #! line at the top of a script tell the kernel?",
       "choices": [
        "Which interpreter should run the script",
        "That the file is a comment",
        "Who owns the script",
        "Where the script is stored"
       ],
       "answer": 0,
       "explain": "The shebang names the interpreter, for example /bin/bash."
      },
      {
       "id": "ch24.format.q2",
       "type": "fill",
       "cmd": "shebang",
       "q": "Write the first line of a script that should be run by /bin/bash.",
       "accept": [
        "#!/bin/bash"
       ]
      },
      {
       "id": "ch24.format.q3",
       "type": "output",
       "cmd": "comment",
       "q": "What does this print? echo 'Hello World!' # This is a comment too",
       "out": "Hello World!",
       "choices": [
        "Hello World!",
        "Hello World! # This is a comment too",
        "# This is a comment too",
        "Nothing"
       ],
       "answer": 0
      },
      {
       "id": "ch24.format.q4",
       "type": "order",
       "cmd": "shebang",
       "q": "Put the Hello World script lines in order",
       "parts": [
        "#!/bin/bash",
        "# This is our first script.",
        "echo 'Hello World!'"
       ]
      }
     ]
    },
    {
     "id": "ch24.perms",
     "title": "Making a Script Executable",
     "intro": "Linux will not run an ordinary text file as a program until it has execute permission. chmod sets that permission in one step.",
     "commands": [],
     "terms": [
      {
       "t": "755",
       "d": "Common script mode: anyone may run it, only the owner may modify it.",
       "p": 325
      },
      {
       "t": "700",
       "d": "Common script mode for private scripts: only the owner can run it.",
       "p": 325
      },
      {
       "t": "readable to run",
       "d": "A script also needs read permission to execute, because the shell must read its text.",
       "p": 325
      }
     ],
     "tasks": [
      {
       "id": "ch24.perms.t1",
       "prompt": "Make hello.sh executable by everyone while only you can modify it.",
       "hint": "chmod with the octal mode 755",
       "solution": "chmod 755 hello.sh",
       "check": [
        {
         "t": "mode",
         "p": "~/hello.sh",
         "mode": "755"
        }
       ]
      },
      {
       "id": "ch24.perms.t2",
       "prompt": "Make hello.sh a private script that only you can read, write and run.",
       "hint": "chmod with the octal mode 700",
       "solution": "chmod 700 hello.sh",
       "check": [
        {
         "t": "mode",
         "p": "~/hello.sh",
         "mode": "700"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch24.perms.q1",
       "type": "fill",
       "cmd": "chmod",
       "q": "Make hello.sh executable by everyone (mode 755).",
       "accept": [
        "chmod 755 hello.sh"
       ]
      },
      {
       "id": "ch24.perms.q2",
       "type": "mc",
       "cmd": "chmod",
       "q": "Which mode suits a script that only its owner should be able to run?",
       "choices": [
        "700",
        "755",
        "644",
        "777"
       ],
       "answer": 0,
       "explain": "700 gives the owner rwx and nobody else any access."
      },
      {
       "id": "ch24.perms.q3",
       "type": "output",
       "cmd": "chmod",
       "q": "hello_world started as -rw-r--r--. Which command produced this new listing?",
       "out": "-rwxr-xr-x 1 me      me      63 2018-03-07 10:10 hello_world",
       "choices": [
        "chmod 755 hello_world",
        "chmod 700 hello_world",
        "chmod 644 hello_world",
        "chmod 711 hello_world"
       ],
       "answer": 0
      },
      {
       "id": "ch24.perms.q4",
       "type": "order",
       "cmd": "chmod",
       "q": "Build: give hello.sh mode 700",
       "parts": [
        "chmod",
        "700",
        "hello.sh"
       ]
      }
     ],
     "refs": [
      "chmod"
     ]
    },
    {
     "id": "ch24.location",
     "title": "Script Location and PATH",
     "intro": "Typing a script's bare name only works if it lives in one of the directories listed in PATH. Otherwise you must give an explicit path such as ./hello_world.",
     "commands": [],
     "terms": [
      {
       "t": "./script",
       "d": "Running a script by an explicit path works even when its directory is not in PATH.",
       "p": 325
      },
      {
       "t": "command not found",
       "d": "Error shown when a script's bare name is typed but its directory is missing from PATH.",
       "p": 325
      },
      {
       "t": "PATH",
       "d": "Environment variable holding a colon-separated list of directories searched for programs.",
       "p": 325
      },
      {
       "t": "~/bin",
       "d": "Personal script directory. Most distributions put it in PATH so your own programs run by name.",
       "p": 326
      },
      {
       "t": "export PATH=~/bin:\"$PATH\"",
       "d": "Line to add to .bashrc when ~/bin is not already part of PATH.",
       "p": 326
      },
      {
       "t": "/usr/local/bin",
       "d": "Traditional home for scripts that every user on the system may run.",
       "p": 326
      },
      {
       "t": "/usr/local/sbin",
       "d": "Usual place for scripts meant for the system administrator.",
       "p": 326
      },
      {
       "t": "/bin and /usr/bin",
       "d": "Reserved for files supplied by the distribution; local software belongs under /usr/local.",
       "p": 326
      }
     ],
     "tasks": [
      {
       "id": "ch24.location.t1",
       "prompt": "Create a bin directory in your home and move hello.sh into it.",
       "hint": "mkdir then mv, joined with &&",
       "solution": "mkdir bin && mv hello.sh bin",
       "check": [
        {
         "t": "exists",
         "p": "~/bin/hello.sh"
        },
        {
         "t": "absent",
         "p": "~/hello.sh"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch24.location.q1",
       "type": "mc",
       "cmd": "source",
       "q": "Where should a script that all users may run traditionally go?",
       "choices": [
        "/usr/local/bin",
        "/usr/bin",
        "/bin",
        "~/bin"
       ],
       "answer": 0,
       "explain": "/bin and /usr/bin belong to the distributor; shared local scripts go in /usr/local/bin."
      },
      {
       "id": "ch24.location.q2",
       "type": "fill",
       "cmd": "source",
       "q": "Using the dot synonym, reread .bashrc in the current shell.",
       "accept": [
        ". .bashrc",
        "source .bashrc"
       ]
      },
      {
       "id": "ch24.location.q3",
       "type": "output",
       "cmd": "source",
       "q": "hello_world is executable in the current directory, which is not in PATH. Which command gives this?",
       "out": "bash: hello_world: command not found",
       "choices": [
        "hello_world",
        "./hello_world",
        "bash hello_world",
        "~/hello_world"
       ],
       "answer": 0
      },
      {
       "id": "ch24.location.q4",
       "type": "order",
       "cmd": "source",
       "q": "Build the .bashrc line that puts ~/bin first in PATH",
       "parts": [
        "export",
        "PATH=~/bin:\"$PATH\""
       ]
      }
     ],
     "refs": [
      "source"
     ]
    },
    {
     "id": "ch24.formatting",
     "title": "Formatting for Readability",
     "intro": "Scripts are read and changed far more often than they are written. Long option names, indentation and line continuations keep them easy to maintain.",
     "commands": [
      {
       "id": "line-continuation",
       "name": "\\",
       "kind": "syntax",
       "summary": "Continue a long command on the next line",
       "syntax": "command arg \\\n    more args",
       "explain": "A backslash placed right before the end of a line joins the next line to the current command. Combined with indentation, it lets a long, complex command be laid out so its logic is clear. It also works at the prompt, but it is awkward to type there.",
       "examples": [
        {
         "cmd": "find playground \\\n     \\( \\\n          -type f \\\n          -not -perm 0600 \\\n          -exec chmod 0600 '{}' ';' \\\n     \\) \\\n     -or \\\n     \\( \\\n          -type d \\\n          -not -perm 0700 \\\n          -exec chmod 0700 '{}' ';' \\\n     \\)",
         "out": "",
         "note": "The long find command from Chapter 17, spread over lines so each test is visible.",
         "sim": false
        }
       ],
       "chapters": [
        24
       ]
      }
     ],
     "terms": [
      {
       "t": "long option names",
       "d": "Short options save typing at the prompt; long ones such as --all make scripts easier to read.",
       "p": 327
      },
      {
       "t": "ls --all --directory",
       "d": "Long-form spelling of ls -ad, preferred inside scripts.",
       "p": 327
      },
      {
       "t": "tabs in scripts",
       "d": "Scripts may indent with tabs; at the prompt a tab triggers completion instead.",
       "p": 328
      },
      {
       "t": ":syntax on",
       "d": "vim command that colors shell syntax. Try :set syntax=sh if it does not work.",
       "p": 328
      },
      {
       "t": ":set hlsearch",
       "d": "vim setting that highlights every match of a search.",
       "p": 328
      },
      {
       "t": ":set tabstop=4",
       "d": "vim setting for tab width; the default is eight columns.",
       "p": 328
      },
      {
       "t": ":set autoindent",
       "d": "vim indents each new line like the previous one. CTRL-D stops the indent.",
       "p": 328
      },
      {
       "t": "~/.vimrc",
       "d": "Put vim settings here, without the leading colon, to make them permanent.",
       "p": 328
      }
     ],
     "quiz": [
      {
       "id": "ch24.formatting.q1",
       "type": "fill",
       "cmd": "line-continuation",
       "q": "Rewrite ls -ad using long option names, as you might in a script.",
       "accept": [
        "ls --all --directory",
        "ls --directory --all"
       ]
      },
      {
       "id": "ch24.formatting.q2",
       "type": "mc",
       "cmd": "line-continuation",
       "q": "Which character, placed at the very end of a line, continues a command onto the next line?",
       "choices": [
        "\\",
        "#",
        ";",
        "&"
       ],
       "answer": 0,
       "explain": "A backslash-linefeed sequence joins the lines."
      },
      {
       "id": "ch24.formatting.q3",
       "type": "mc",
       "cmd": "line-continuation",
       "q": "Why can't you indent with tabs at the command line the way you can in a script?",
       "choices": [
        "Tab triggers completion",
        "Tabs end the command",
        "Tabs start a comment",
        "bash rejects tab characters"
       ],
       "answer": 0,
       "explain": "At the prompt the tab key is used for completion."
      },
      {
       "id": "ch24.formatting.q4",
       "type": "order",
       "cmd": "line-continuation",
       "q": "Order the lines of a find command split with continuations",
       "parts": [
        "find playground \\",
        "-type f \\",
        "-not -perm 0600 \\",
        "-exec chmod 0600 '{}' ';'"
       ]
      }
     ]
    }
   ]
  },
  {
   "id": "ch25",
   "n": 25,
   "part": 4,
   "title": "Starting a Project",
   "summary": "Build a report script with variables, constants and here documents",
   "lessons": [
    {
     "id": "ch25.vars",
     "title": "Variables and Constants",
     "intro": "The project script prints an HTML report, and repeating the same title text in several places makes it hard to change. Storing the text once in a variable fixes that.",
     "commands": [
      {
       "id": "var-assign",
       "name": "variable=value",
       "kind": "syntax",
       "summary": "Create a variable or constant and give it a value",
       "syntax": "variable=value [variable=value...]",
       "explain": "A variable springs into existence the moment the shell sees it, with no declaration needed. Assign it with name=value and no spaces around the equal sign. The shell treats every value as a string, and the value can be anything that expands to a string: quoted text, other variables, command substitution or arithmetic.",
       "examples": [
        {
         "cmd": "foo=\"yes\"; echo $foo",
         "note": "Assigns yes to foo, then expands it.",
         "sim": true
        },
        {
         "cmd": "echo $fool",
         "note": "A misspelled name expands to nothing, so echo prints an empty line.",
         "sim": true
        },
        {
         "cmd": "a=5 b=\"a string\"",
         "note": "Two assignments on a single line.",
         "sim": true
        },
        {
         "cmd": "foo=foo.txt; foo1=foo1.txt; cp $foo $fool",
         "out": "cp: missing destination file operand after `foo.txt'\nTry `cp --help' for more information.",
         "note": "The typo $fool expands to nothing, so cp gets only one argument.",
         "sim": false
        }
       ],
       "chapters": [
        25
       ]
      },
      {
       "id": "declare",
       "name": "declare",
       "kind": "builtin",
       "summary": "Give a variable attributes such as read-only or integer",
       "syntax": "declare [-r|-i] name=value",
       "explain": "declare can make the shell enforce rules about a variable. With -r the variable becomes read-only, so a constant cannot be reassigned. With -i only integers may be stored. Both are rarely used outside very formal scripts.",
       "flags": [
        {
         "f": "-r",
         "d": "Make the variable read-only so later assignments fail.",
         "p": 334,
         "ch": 25
        },
        {
         "f": "-i",
         "d": "Restrict the variable to integer values.",
         "p": 334,
         "ch": 25
        },
        {
         "f": "-u",
         "d": "Make the variable always store its value in uppercase, whatever is assigned.",
         "p": 426,
         "ch": 34
        },
        {
         "f": "-l",
         "d": "Make the variable always store its value in lowercase, whatever is assigned.",
         "p": 426,
         "ch": 34
        },
        {
         "f": "-a",
         "d": "Create an indexed (integer-subscript) array.",
         "p": 438,
         "ch": 35
        },
        {
         "f": "-A",
         "d": "Create an associative array, indexed by strings. Required before such an array is used.",
         "p": 444,
         "ch": 35
        }
       ],
       "examples": [
        {
         "cmd": "declare -r TITLE=\"Page Title\"",
         "out": "",
         "note": "TITLE can no longer be assigned a new value.",
         "sim": false
        },
        {
         "cmd": "declare -u upper; declare -l lower; upper=aBc; lower=aBc; echo \"$upper\"; echo \"$lower\"",
         "out": "ABC\nabc",
         "note": "The same input is normalized differently by each variable.",
         "sim": false,
         "ch": 34
        },
        {
         "cmd": "ul-declare aBc",
         "out": "ABC\nabc",
         "note": "The book's script assigns $1 to both variables.",
         "sim": false,
         "ch": 34
        },
        {
         "cmd": "declare -a a",
         "out": "",
         "note": "Creates the indexed array a; optional, since indexed arrays appear on first use.",
         "sim": false,
         "ch": 35
        },
        {
         "cmd": "declare -A colors",
         "out": "",
         "note": "Associative arrays cannot be created just by assigning to them.",
         "sim": false,
         "ch": 35
        }
       ],
       "chapters": [
        25,
        34,
        35
       ]
      }
     ],
     "terms": [
      {
       "t": "variable name characters",
       "d": "Names may use letters, digits and underscores only; no spaces or punctuation.",
       "p": 333
      },
      {
       "t": "variable name first character",
       "d": "A name must start with a letter or an underscore, never a digit.",
       "p": 333
      },
      {
       "t": "constant",
       "d": "A named value that never changes. The shell treats it like any variable; the difference is only in intent.",
       "p": 333
      },
      {
       "t": "UPPERCASE convention",
       "d": "Constants are usually written in capitals, true variables in lowercase.",
       "p": 334
      },
      {
       "t": "HOSTNAME",
       "d": "Shell variable holding the network name of the machine.",
       "p": 334
      },
      {
       "t": "no spaces around =",
       "d": "In an assignment the name, equal sign and value must touch each other.",
       "p": 334
      },
      {
       "t": "d=\"$(ls -l foo.txt)\"",
       "d": "Assigning the output of a command to a variable.",
       "p": 335
      },
      {
       "t": "e=$((5 * 7))",
       "d": "Assigning the result of arithmetic expansion to a variable.",
       "p": 335
      },
      {
       "t": "PS2",
       "d": "Secondary prompt, shown as > while you type a statement over several lines.",
       "p": 331
      }
     ],
     "tasks": [
      {
       "id": "ch25.vars.t1",
       "prompt": "Assign the string \"System Information Report\" to a variable named title, then echo it.",
       "hint": "title=\"...\"; echo $title",
       "solution": "title=\"System Information Report\"; echo $title",
       "check": [
        {
         "t": "out",
         "re": "System Information Report"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch25.vars.q1",
       "type": "mc",
       "cmd": "var-assign",
       "q": "Which assignment is valid?",
       "choices": [
        "b=\"a string\"",
        "b = \"a string\"",
        "b= a string",
        "$b=\"a string\""
       ],
       "answer": 0,
       "explain": "No spaces may surround = and values with spaces need quotes."
      },
      {
       "id": "ch25.vars.q2",
       "type": "mc",
       "cmd": "var-assign",
       "q": "Which is NOT a legal variable name?",
       "choices": [
        "1st_value",
        "_count",
        "TITLE",
        "file_name2"
       ],
       "answer": 0,
       "explain": "A name cannot begin with a digit."
      },
      {
       "id": "ch25.vars.q3",
       "type": "mc",
       "cmd": "var-assign",
       "q": "After foo=\"yes\", what does echo $fool print?",
       "choices": [
        "An empty line",
        "yes",
        "fool",
        "an error: fool not defined"
       ],
       "answer": 0
      },
      {
       "id": "ch25.vars.q4",
       "type": "fill",
       "cmd": "declare",
       "q": "Make TITLE a read-only constant holding \"Page Title\".",
       "accept": [
        "declare -r TITLE=\"Page Title\"",
        "declare -r TITLE='Page Title'"
       ]
      }
     ]
    },
    {
     "id": "ch25.braces",
     "title": "Braces Around Variable Names",
     "intro": "When text follows a variable name directly, the shell may read it as part of the name. Wrapping the name in braces marks exactly where it ends.",
     "commands": [
      {
       "id": "var-braces",
       "name": "${var}",
       "kind": "syntax",
       "summary": "Delimit a variable name with braces during expansion",
       "syntax": "${variable}",
       "explain": "Braces around a variable name are optional, but they remove ambiguity. Without them, \"$filename1\" refers to a different, empty variable called filename1. Writing \"${filename}1\" expands filename and then appends a 1.",
       "examples": [
        {
         "cmd": "filename=\"myfile\"; touch \"$filename\"; mv \"$filename\" \"${filename}1\"",
         "note": "Creates myfile and renames it to myfile1.",
         "sim": true,
         "viz": "tree"
        },
        {
         "cmd": "mv \"$filename\" \"$filename1\"",
         "out": "mv: missing destination file operand after `myfile'\nTry `mv --help' for more information.",
         "note": "Without braces the shell looks up the empty variable filename1.",
         "sim": false
        }
       ],
       "chapters": [
        25
       ]
      }
     ],
     "terms": [
      {
       "t": "quote your variables",
       "d": "Put double quotes around variable and command substitution expansions to curb word splitting, above all for filenames.",
       "p": 335
      }
     ],
     "tasks": [
      {
       "id": "ch25.braces.t1",
       "prompt": "Set filename to foo.txt, then copy that file to foo.txt1 using braces around the variable.",
       "hint": "filename=foo.txt && cp \"$filename\" \"${filename}1\"",
       "solution": "filename=foo.txt && cp \"$filename\" \"${filename}1\"",
       "check": [
        {
         "t": "exists",
         "p": "~/foo.txt1"
        },
        {
         "t": "cmd",
         "re": "\\$\\{filename\\}1"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch25.braces.q1",
       "type": "fill",
       "cmd": "var-braces",
       "q": "Rename the file in $filename to the same name with a 1 appended (quote both arguments).",
       "accept": [
        "mv \"$filename\" \"${filename}1\""
       ]
      },
      {
       "id": "ch25.braces.q2",
       "type": "mc",
       "cmd": "var-braces",
       "q": "With filename=myfile, what does \"$filename1\" expand to?",
       "choices": [
        "An empty string",
        "myfile1",
        "myfile",
        "$filename1"
       ],
       "answer": 0,
       "explain": "The shell reads filename1 as the variable name, and it is unset."
      },
      {
       "id": "ch25.braces.q3",
       "type": "order",
       "cmd": "var-braces",
       "q": "Build: rename $filename to the same name plus 1",
       "parts": [
        "mv",
        "\"$filename\"",
        "\"${filename}1\""
       ]
      }
     ]
    },
    {
     "id": "ch25.heredoc",
     "title": "Here Documents",
     "intro": "A here document embeds a block of text in the script and feeds it to a command's standard input. It is a third way to print the report, after one or many echo commands.",
     "commands": [
      {
       "id": "here-doc",
       "name": "<<",
       "kind": "syntax",
       "summary": "Feed an embedded block of text to a command's standard input",
       "syntax": "command << token\ntext\ntoken",
       "explain": "Everything between the << token line and a line holding only the token is sent to the command's standard input. The token, often _EOF_, must stand alone with no trailing spaces. Inside the text, quote characters lose their special meaning while expansions such as $foo still happen. The <<- form strips leading tabs so the body can be indented.",
       "flags": [
        {
         "f": "<<-",
         "d": "Ignore leading tab characters (not spaces) in the body, so the text and token can be indented.",
         "p": 337,
         "ch": 25
        }
       ],
       "examples": [
        {
         "cmd": "cat << _EOF_\n$foo\n\"$foo\"\n'$foo'\n\\$foo\n_EOF_",
         "out": "some text\n\"some text\"\n'some text'\n$foo",
         "note": "With foo=\"some text\": quotes print literally, and only the backslash stops expansion.",
         "sim": false
        },
        {
         "cmd": "cat << _EOF_\n<html>\n        <head>\n                <title>$TITLE</title>\n        </head>\n</html>\n_EOF_",
         "out": "",
         "note": "The report script prints its HTML with cat and a here document.",
         "sim": false
        },
        {
         "cmd": "ftp -n <<- _EOF_\n\topen $FTP_SERVER\n\tuser anonymous me@linuxbox\n\tget $REMOTE_FILE\n\tbye\n\t_EOF_",
         "out": "",
         "note": "Tab-indented commands are passed to ftp; <<- removes the tabs.",
         "sim": false
        }
       ],
       "chapters": [
        25
       ]
      }
     ],
     "terms": [
      {
       "t": "_EOF_",
       "d": "Customary token marking the end of a here document; it stands for end of file.",
       "p": 336
      },
      {
       "t": "here document vs echo",
       "d": "Inside a here document quotes are ordinary characters, so they can be embedded freely.",
       "p": 336
      },
      {
       "t": "tabs vs spaces",
       "d": "<<- only strips tabs, which clashes with editors set to indent with spaces.",
       "p": 338
      }
     ],
     "quiz": [
      {
       "id": "ch25.heredoc.q1",
       "type": "mc",
       "cmd": "here-doc",
       "q": "Which operator lets a here document's body be indented with tabs?",
       "choices": [
        "<<-",
        "<<",
        "<<<",
        ">>"
       ],
       "answer": 0,
       "explain": "<<- tells the shell to drop leading tab characters."
      },
      {
       "id": "ch25.heredoc.q2",
       "type": "output",
       "cmd": "here-doc",
       "q": "foo=\"some text\". What does cat print for the here document line '$foo' ?",
       "out": "'some text'",
       "choices": [
        "'some text'",
        "'$foo'",
        "some text",
        "$foo"
       ],
       "answer": 0
      },
      {
       "id": "ch25.heredoc.q3",
       "type": "order",
       "cmd": "here-doc",
       "q": "Order the lines of a here document passed to cat",
       "parts": [
        "cat << _EOF_",
        "<html>",
        "</html>",
        "_EOF_"
       ]
      },
      {
       "id": "ch25.heredoc.q4",
       "type": "fill",
       "cmd": "here-doc",
       "q": "Write the opening line that sends a here document ending in _EOF_ to cat.",
       "accept": [
        "cat << _EOF_",
        "cat <<_EOF_"
       ]
      }
     ]
    }
   ]
  },
  {
   "id": "ch26",
   "n": 26,
   "part": 4,
   "title": "Top-Down Design",
   "summary": "Break a script into shell functions, local variables and testable stubs",
   "lessons": [
    {
     "id": "ch26.functions",
     "title": "Shell Functions",
     "intro": "Top-down design splits a big job into top-level steps, then refines each step into smaller ones. In a script, each step can become a shell function: a mini-script with its own name.",
     "commands": [
      {
       "id": "function",
       "name": "name () { }",
       "kind": "syntax",
       "summary": "Define a named shell function inside a script",
       "syntax": "function name {\n    commands\n    return\n}\n\nname () {\n    commands\n    return\n}",
       "explain": "A shell function has two equivalent forms: the formal one starting with the word function, and the shorter name () form, which is usually preferred. Once defined, the function is called by name like any command. The definition must come before the first call, or the shell will look for an external program instead. Function names follow the same rules as variable names, and the body needs at least one command.",
       "examples": [
        {
         "cmd": "function step2 {\n    echo \"Step 2\"\n    return\n}\necho \"Step 1\"\nstep2\necho \"Step 3\"",
         "out": "Step 1\nStep 2\nStep 3",
         "note": "Execution skips the definition, runs Step 1, jumps into step2, then returns for Step 3.",
         "sim": false
        },
        {
         "cmd": "report_uptime () {\n    cat <<- _EOF_\n        <h2>System Uptime</h2>\n        <pre>$(uptime)</pre>\n        _EOF_\n    return\n}",
         "out": "",
         "note": "A report section built from a here document and command substitution.",
         "sim": false
        },
        {
         "cmd": "ds () {\n    echo \"Disk Space Utilization For $HOSTNAME\"\n    df -h\n}",
         "out": "",
         "note": "A small personal command for .bashrc; functions beat aliases because they support any shell feature.",
         "sim": false
        }
       ],
       "chapters": [
        26
       ]
      },
      {
       "id": "return",
       "name": "return",
       "kind": "builtin",
       "summary": "End a shell function and hand control back to the caller",
       "syntax": "return",
       "explain": "return stops the function and execution resumes at the line after the call. It is optional, but an otherwise empty function needs it since every function body needs one or more commands.",
       "examples": [
        {
         "cmd": "report_disk_space () {\n    return\n}",
         "out": "",
         "note": "A minimal placeholder function; return alone satisfies the one-command rule.",
         "sim": false
        },
        {
         "cmd": "return 1",
         "out": "",
         "note": "Inside a function, ends it with exit status 1, just as exit 1 would end a script.",
         "sim": false,
         "ch": 27
        }
       ],
       "chapters": [
        26,
        27
       ]
      }
     ],
     "terms": [
      {
       "t": "top-down design",
       "d": "Name the broad steps of a task first, then break each into ever finer steps.",
       "p": 340
      },
      {
       "t": "$(function_name)",
       "d": "Command substitution works with functions, inserting their output into the report text.",
       "p": 341
      }
     ],
     "quiz": [
      {
       "id": "ch26.functions.q1",
       "type": "mc",
       "cmd": "function",
       "q": "Why must a function definition appear before it is called in a script?",
       "choices": [
        "Otherwise the shell treats the name as an external program",
        "Functions are compiled first",
        "return would fail",
        "The shebang requires it"
       ],
       "answer": 0,
       "explain": "The shell only knows the function once it has read the definition."
      },
      {
       "id": "ch26.functions.q2",
       "type": "order",
       "cmd": "function",
       "q": "Order the lines of a function in the preferred form",
       "parts": [
        "step2 () {",
        "echo \"Step 2\"",
        "return",
        "}"
       ]
      },
      {
       "id": "ch26.functions.q3",
       "type": "output",
       "cmd": "function",
       "q": "step2 prints Step 2. What does this print? echo \"Step 1\"; step2; echo \"Step 3\"",
       "out": "Step 1\nStep 2\nStep 3",
       "choices": [
        "Step 1\nStep 2\nStep 3",
        "Step 1\nStep 3",
        "Step 2\nStep 1\nStep 3",
        "Step 1\nStep 3\nStep 2"
       ],
       "answer": 0
      },
      {
       "id": "ch26.functions.q4",
       "type": "fill",
       "cmd": "function",
       "q": "Write the first line of the formal-style definition of a function named step2.",
       "accept": [
        "function step2 {"
       ]
      }
     ]
    },
    {
     "id": "ch26.local",
     "title": "Local Variables",
     "intro": "Ordinary variables are global and live for the whole script. Inside a function, local variables avoid clashes with names used elsewhere.",
     "commands": [
      {
       "id": "local",
       "name": "local",
       "kind": "builtin",
       "summary": "Create a variable that exists only inside the current function",
       "syntax": "local variable",
       "explain": "Putting local before a name inside a function makes a private copy of that variable. Changes to it do not touch a global variable of the same name, and it disappears when the function ends. This keeps functions independent, so they can be copied between scripts safely.",
       "examples": [
        {
         "cmd": "foo=0\nfunct_1 () {\n    local foo\n    foo=1\n    echo \"funct_1: foo = $foo\"\n}\necho \"global:  foo = $foo\"\nfunct_1\necho \"global:  foo = $foo\"",
         "out": "global:  foo = 0\nfunct_1: foo = 1\nglobal:  foo = 0",
         "note": "The function sets its own foo; the global foo stays 0.",
         "sim": false
        }
       ],
       "chapters": [
        26
       ]
      }
     ],
     "terms": [
      {
       "t": "global variable",
       "d": "A variable that exists from the moment it is set until the script ends, visible everywhere.",
       "p": 343
      },
      {
       "t": "local variable",
       "d": "A variable visible only inside the function that declared it, gone once the function returns.",
       "p": 343
      }
     ],
     "quiz": [
      {
       "id": "ch26.local.q1",
       "type": "mc",
       "cmd": "local",
       "q": "A global foo=0 exists. A function runs local foo; foo=1. What is the global foo afterward?",
       "choices": [
        "0",
        "1",
        "empty",
        "an error"
       ],
       "answer": 0,
       "explain": "The local copy hides the global one only inside the function."
      },
      {
       "id": "ch26.local.q2",
       "type": "fill",
       "cmd": "local",
       "q": "Inside a function, declare foo as a local variable.",
       "accept": [
        "local foo"
       ]
      },
      {
       "id": "ch26.local.q3",
       "type": "output",
       "cmd": "local",
       "q": "Which output does the local-vars script produce for: echo global; funct_2; echo global (funct_2 sets local foo=2)?",
       "out": "global:  foo = 0\nfunct_2: foo = 2\nglobal:  foo = 0",
       "choices": [
        "global:  foo = 0\nfunct_2: foo = 2\nglobal:  foo = 0",
        "global:  foo = 0\nfunct_2: foo = 2\nglobal:  foo = 2",
        "global:  foo = 2\nfunct_2: foo = 2\nglobal:  foo = 2",
        "funct_2: foo = 2"
       ],
       "answer": 0
      },
      {
       "id": "ch26.local.q4",
       "type": "order",
       "cmd": "local",
       "q": "Order the body of a function that uses a private foo",
       "parts": [
        "local foo",
        "foo=1",
        "echo \"funct_1: foo = $foo\""
       ]
      }
     ]
    },
    {
     "id": "ch26.stubs",
     "title": "Keep Scripts Running",
     "intro": "Testing after every small change keeps bugs easy to locate. Empty placeholder functions let you check the flow of a program long before it is finished.",
     "commands": [],
     "terms": [
      {
       "t": "stub",
       "d": "An empty or placeholder function used to confirm the program's flow before the real code exists.",
       "p": 344
      },
      {
       "t": "stub feedback",
       "d": "Have a stub echo a message such as \"Function report_uptime executed.\" so you can see it ran.",
       "p": 345
      },
      {
       "t": "runnable state",
       "d": "Keep the script working at each stage; a new error then most likely comes from the latest edit.",
       "p": 344
      },
      {
       "t": "du -sh /home/*",
       "d": "Home space report that may need superuser rights where home directories are not world-readable.",
       "p": 346
      }
     ],
     "quiz": [
      {
       "id": "ch26.stubs.q1",
       "type": "mc",
       "cmd": "function",
       "q": "What is a stub?",
       "choices": [
        "A placeholder function used to check program flow",
        "A comment line",
        "A truncated file",
        "A function that calls exit"
       ],
       "answer": 0,
       "explain": "Stubs let you verify the logic before writing the details."
      },
      {
       "id": "ch26.stubs.q2",
       "type": "fill",
       "cmd": "function",
       "q": "Write a one-line stub for report_uptime that just returns.",
       "accept": [
        "report_uptime () { return; }",
        "report_uptime() { return; }"
       ]
      },
      {
       "id": "ch26.stubs.q3",
       "type": "output",
       "cmd": "function",
       "q": "Which stub body produced this line in the report?",
       "out": "Function report_uptime executed.",
       "choices": [
        "echo \"Function report_uptime executed.\"",
        "return",
        "cat <<- _EOF_",
        "local report_uptime"
       ],
       "answer": 0
      }
     ]
    }
   ]
  },
  {
   "id": "ch27",
   "n": 27,
   "part": 4,
   "title": "Flow Control: Branching with if",
   "summary": "Branch on exit status with if, test, [[ ]], (( )) and the && and || operators",
   "lessons": [
    {
     "id": "ch27.if",
     "title": "if and Exit Status",
     "intro": "A branch lets a script choose between paths depending on a condition. In the shell, the condition is simply whether a command succeeded or failed.",
     "commands": [
      {
       "id": "if",
       "name": "if",
       "kind": "keyword",
       "summary": "Run commands only when a command list succeeds",
       "syntax": "if commands; then\n    commands\n[elif commands; then\n    commands...]\n[else\n    commands]\nfi",
       "explain": "if runs the commands after it and checks the exit status of the last one. Zero means success, so the then block runs; otherwise the optional elif tests are tried in turn, then the optional else block. The statement always closes with fi. elif is short for else if and allows chains of tests.",
       "examples": [
        {
         "cmd": "x=5; if [ \"$x\" -eq 5 ]; then echo \"equals 5\"; else echo \"does not equal 5\"; fi",
         "out": "equals 5",
         "note": "The whole if statement typed on a single line.",
         "sim": false
        },
        {
         "cmd": "if true; then echo \"It's true.\"; fi",
         "out": "It's true.",
         "note": "true succeeds, so the then branch runs.",
         "sim": false
        },
        {
         "cmd": "if false; true; then echo \"It's true.\"; fi",
         "out": "It's true.",
         "note": "With a list of commands, only the last one's status counts.",
         "sim": false
        }
       ],
       "chapters": [
        27
       ]
      },
      {
       "id": "exit-status",
       "name": "$?",
       "kind": "syntax",
       "summary": "Expand to the most recent command's exit status",
       "syntax": "echo $?",
       "explain": "Every command, script and function returns an exit status from 0 to 255 when it ends. By convention 0 means success and any other value means failure. The special parameter $? reports how the most recent command ended. Many programs just use 1 for failure, while some use several codes, documented under Exit Status in their man pages.",
       "examples": [
        {
         "cmd": "ls -d /usr/bin; echo $?",
         "out": "/usr/bin\n0",
         "note": "Success gives status 0.",
         "sim": false
        },
        {
         "cmd": "ls -d /bin/usr; echo $?",
         "out": "ls: cannot access /bin/usr: No such file or directory\n2",
         "note": "ls reports this error with status 2.",
         "sim": false
        }
       ],
       "chapters": [
        27
       ]
      },
      {
       "id": "true",
       "name": "true",
       "kind": "builtin",
       "summary": "Do nothing and exit with status 0",
       "syntax": "true",
       "explain": "true is a builtin whose only job is to succeed. It is handy for seeing how if reacts to success and for building loops that never end on their own.",
       "examples": [
        {
         "cmd": "true; echo $?",
         "out": "0",
         "note": "Always succeeds.",
         "sim": false
        }
       ],
       "chapters": [
        27
       ]
      },
      {
       "id": "false",
       "name": "false",
       "kind": "builtin",
       "summary": "Do nothing and exit with status 1",
       "syntax": "false",
       "explain": "false is the opposite of true: a builtin that always fails with status 1. With if, it guarantees the then block is skipped.",
       "examples": [
        {
         "cmd": "false; echo $?",
         "out": "1",
         "note": "Always fails.",
         "sim": false
        }
       ],
       "chapters": [
        27
       ]
      }
     ],
     "terms": [
      {
       "t": "exit status",
       "d": "An integer from 0 to 255 a command hands back when it ends; 0 means success, anything else failure.",
       "p": 350
      },
      {
       "t": "elif",
       "d": "Short for else if; adds another test to an if statement when earlier tests fail.",
       "p": 356
      },
      {
       "t": "running off the end",
       "d": "A script that reaches end of file exits with the status of its last command.",
       "p": 354
      },
      {
       "t": ">&2",
       "d": "Send an error message to standard error, the proper place for it.",
       "p": 355
      }
     ],
     "quiz": [
      {
       "id": "ch27.if.q1",
       "type": "order",
       "cmd": "if",
       "q": "Order the parts of a full if statement",
       "parts": [
        "if commands; then",
        "commands",
        "elif commands; then",
        "commands",
        "else",
        "commands",
        "fi"
       ]
      },
      {
       "id": "ch27.if.q2",
       "type": "output",
       "cmd": "exit-status",
       "q": "What is printed by: false; echo $?",
       "out": "1",
       "choices": [
        "1",
        "0",
        "false",
        "nothing"
       ],
       "answer": 0
      },
      {
       "id": "ch27.if.q3",
       "type": "mc",
       "cmd": "if",
       "q": "In if true; false; then ... fi, does the then block run?",
       "choices": [
        "No, only the last command's status counts",
        "Yes, the first command succeeded",
        "Yes, if ignores false",
        "It is a syntax error"
       ],
       "answer": 0,
       "explain": "if looks at the exit status of the final command in the list."
      },
      {
       "id": "ch27.if.q4",
       "type": "fill",
       "cmd": "exit-status",
       "q": "Display the exit status of the previous command.",
       "accept": [
        "echo $?"
       ]
      }
     ],
     "refs": [
      "exit",
      "return"
     ]
    },
    {
     "id": "ch27.test",
     "title": "test and File Expressions",
     "intro": "test is the command most often paired with if. It evaluates an expression and succeeds when the expression is true.",
     "commands": [
      {
       "id": "test",
       "name": "test",
       "kind": "builtin",
       "summary": "Evaluate an expression and exit 0 if true, 1 if false",
       "syntax": "test expression\n[ expression ]",
       "explain": "test has two equivalent spellings: test expression, and the more popular [ expression ], where ] must be the final argument. Both are bash builtins and also exist as programs in /usr/bin. Quote variables inside the expression, as in \"$FILE\", so an empty value still leaves a string for the operator to work on.",
       "examples": [
        {
         "cmd": "if [ -e \"$FILE\" ]; then\n    echo \"$FILE exists\"\nfi",
         "out": "",
         "note": "Checks whether the file named in FILE exists.",
         "sim": false
        },
        {
         "cmd": "test -d /usr/bin; echo $?",
         "out": "0",
         "note": "The plain test form; status 0 means the expression is true.",
         "sim": false
        },
        {
         "cmd": "if [ \"$x\" -eq 5 ]; then echo \"x equals 5.\"; fi",
         "out": "x equals 5.",
         "note": "The [ ] form comparing an integer.",
         "sim": false
        }
       ],
       "chapters": [
        27
       ]
      }
     ],
     "terms": [
      {
       "t": "file1 -ef file2",
       "d": "True if both names point to the same inode, i.e. hard links to one file.",
       "p": 352
      },
      {
       "t": "file1 -nt file2",
       "d": "True if file1 is newer than file2.",
       "p": 352
      },
      {
       "t": "file1 -ot file2",
       "d": "True if file1 is older than file2.",
       "p": 352
      },
      {
       "t": "-b file",
       "d": "True if file is present and is a block device file.",
       "p": 352
      },
      {
       "t": "-c file",
       "d": "True if file is present and is a character device file.",
       "p": 352
      },
      {
       "t": "-d file",
       "d": "True if file exists and is a directory.",
       "p": 352
      },
      {
       "t": "-e file",
       "d": "True if file exists.",
       "p": 352
      },
      {
       "t": "-f file",
       "d": "True if file exists and is a regular file.",
       "p": 352
      },
      {
       "t": "-g file",
       "d": "True if file exists and has set-group-ID.",
       "p": 352
      },
      {
       "t": "-G file",
       "d": "True if file exists and belongs to the effective group ID.",
       "p": 352
      },
      {
       "t": "-k file",
       "d": "True if file exists and has the sticky bit set.",
       "p": 352
      },
      {
       "t": "-L file",
       "d": "True if file exists and is a symbolic link.",
       "p": 352
      },
      {
       "t": "-O file",
       "d": "True if file exists and belongs to the effective user ID.",
       "p": 352
      },
      {
       "t": "-p file",
       "d": "True if file exists and is a named pipe.",
       "p": 352
      },
      {
       "t": "-r file",
       "d": "True if file exists and the effective user may read it.",
       "p": 352
      },
      {
       "t": "-s file",
       "d": "True if file exists and is not empty.",
       "p": 353
      },
      {
       "t": "-S file",
       "d": "True if file exists and is a network socket.",
       "p": 353
      },
      {
       "t": "-t fd",
       "d": "True if file descriptor fd is attached to the terminal; detects redirected input or output.",
       "p": 353
      },
      {
       "t": "-u file",
       "d": "True if file exists and is setuid.",
       "p": 353
      },
      {
       "t": "-w file",
       "d": "True if file exists and the effective user may write to it.",
       "p": 353
      },
      {
       "t": "-x file",
       "d": "True if file exists and the effective user may execute or search it.",
       "p": 353
      }
     ],
     "quiz": [
      {
       "id": "ch27.test.q1",
       "type": "fill",
       "cmd": "test",
       "q": "Using [ ], write the test expression that is true if the file in $FILE exists.",
       "accept": [
        "[ -e \"$FILE\" ]",
        "[ -e $FILE ]"
       ]
      },
      {
       "id": "ch27.test.q2",
       "type": "mc",
       "cmd": "test",
       "q": "Which file expression is true when the file is a directory?",
       "choices": [
        "-d",
        "-f",
        "-e",
        "-x"
       ],
       "answer": 0,
       "explain": "-d checks for a directory; -f checks for a regular file."
      },
      {
       "id": "ch27.test.q3",
       "type": "order",
       "cmd": "test",
       "q": "Build: test whether $FILE is a regular file",
       "parts": [
        "[",
        "-f",
        "\"$FILE\"",
        "]"
       ]
      },
      {
       "id": "ch27.test.q4",
       "type": "output",
       "cmd": "test",
       "q": "/usr/bin is a directory. What does this print? test -d /usr/bin; echo $?",
       "out": "0",
       "choices": [
        "0",
        "1",
        "true",
        "/usr/bin"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch27.strint",
     "title": "String and Integer Expressions",
     "intro": "test can also compare strings and integers. Strings use symbols such as = and !=, while integers use letter operators like -eq and -lt.",
     "commands": [],
     "terms": [
      {
       "t": "string",
       "d": "True if string is not null.",
       "p": 355
      },
      {
       "t": "-n string",
       "d": "True if string has a length greater than zero.",
       "p": 355
      },
      {
       "t": "-z string",
       "d": "True if string has zero length.",
       "p": 355
      },
      {
       "t": "string1 = string2",
       "d": "True if the strings are equal. == also works and is preferred, though not POSIX.",
       "p": 355
      },
      {
       "t": "string1 != string2",
       "d": "True if the strings differ.",
       "p": 355
      },
      {
       "t": "string1 > string2",
       "d": "True if string1 sorts after string2. Quote or escape > with test, or it becomes a redirection.",
       "p": 355
      },
      {
       "t": "string1 < string2",
       "d": "True if string1 sorts before string2. Quote or escape < with test.",
       "p": 355
      },
      {
       "t": "int1 -eq int2",
       "d": "True if the integers are equal.",
       "p": 356
      },
      {
       "t": "int1 -ne int2",
       "d": "True if the integers are not equal.",
       "p": 356
      },
      {
       "t": "int1 -le int2",
       "d": "True if int1 is less than or equal to int2.",
       "p": 356
      },
      {
       "t": "int1 -lt int2",
       "d": "True if int1 is less than int2.",
       "p": 356
      },
      {
       "t": "int1 -ge int2",
       "d": "True if int1 is greater than or equal to int2.",
       "p": 356
      },
      {
       "t": "int1 -gt int2",
       "d": "True if int1 is greater than int2.",
       "p": 356
      },
      {
       "t": "$((INT % 2))",
       "d": "Modulo 2 gives the remainder; 0 means the number is even.",
       "p": 356
      }
     ],
     "quiz": [
      {
       "id": "ch27.strint.q1",
       "type": "fill",
       "cmd": "test",
       "q": "Using [ ], write the test that is true if $ANSWER is an empty string.",
       "accept": [
        "[ -z \"$ANSWER\" ]",
        "[ -z $ANSWER ]"
       ]
      },
      {
       "id": "ch27.strint.q2",
       "type": "mc",
       "cmd": "test",
       "q": "Which operator tests whether one integer is less than another?",
       "choices": [
        "-lt",
        "<",
        "-le",
        "-ne"
       ],
       "answer": 0,
       "explain": "test uses -lt for integers; < compares strings by sort order."
      },
      {
       "id": "ch27.strint.q3",
       "type": "output",
       "cmd": "test",
       "q": "INT=-5. What does the test-integer script print?",
       "out": "INT is negative.\nINT is odd.",
       "choices": [
        "INT is negative.\nINT is odd.",
        "INT is negative.\nINT is even.",
        "INT is positive.\nINT is odd.",
        "INT is zero."
       ],
       "answer": 0
      },
      {
       "id": "ch27.strint.q4",
       "type": "order",
       "cmd": "test",
       "q": "Build: test whether $INT equals 0",
       "parts": [
        "[",
        "\"$INT\"",
        "-eq",
        "0",
        "]"
       ]
      }
     ]
    },
    {
     "id": "ch27.modern",
     "title": "[[ ]] and (( ))",
     "intro": "bash adds two compound commands that improve on test. [[ ]] adds regex and pattern matching, while (( )) handles integer tests with natural-looking operators.",
     "commands": [
      {
       "id": "dbl-bracket",
       "name": "[[ ]]",
       "kind": "syntax",
       "summary": "Enhanced test with regex matching and glob patterns",
       "syntax": "[[ expression ]]",
       "explain": "[[ ]] accepts every expression test does and adds string =~ regex, which is true when the string matches the extended regular expression. Its == operator also matches patterns the way pathname expansion does. It is specific to bash and a few modern shells, but it is easier to use and preferred in new scripts.",
       "flags": [
        {
         "f": "=~",
         "d": "True if the left string matches the extended regular expression on the right.",
         "p": 357,
         "ch": 27
        },
        {
         "f": "==",
         "d": "Inside [[ ]], compares the string against a wildcard pattern such as foo.*",
         "p": 358,
         "ch": 27
        }
       ],
       "examples": [
        {
         "cmd": "if [[ \"$INT\" =~ ^-?[0-9]+$ ]]; then echo \"integer\"; fi",
         "out": "integer",
         "note": "Accepts an optional minus sign then digits; it also rejects empty values.",
         "sim": false
        },
        {
         "cmd": "FILE=foo.bar; if [[ $FILE == foo.* ]]; then echo \"$FILE matches pattern 'foo.*'\"; fi",
         "out": "foo.bar matches pattern 'foo.*'",
         "note": "Pattern matching makes [[ ]] useful for file and pathnames.",
         "sim": false
        }
       ],
       "chapters": [
        27
       ]
      },
      {
       "id": "dbl-paren",
       "name": "(( ))",
       "kind": "syntax",
       "summary": "Arithmetic truth test: true when the result is non-zero",
       "syntax": "(( expression ))",
       "explain": "(( )) evaluates an arithmetic expression and succeeds if the result is not zero. Because it is shell syntax that works only on integers, it recognizes variables by name without a $ and lets you write <, > and == for comparisons.",
       "examples": [
        {
         "cmd": "if ((1)); then echo \"It is true.\"; fi",
         "out": "It is true.",
         "note": "1 is non-zero, so the test is true.",
         "sim": false
        },
        {
         "cmd": "if ((0)); then echo \"It is true.\"; fi",
         "out": "",
         "note": "0 makes the test false, so nothing prints.",
         "sim": false
        },
        {
         "cmd": "if ((INT < 0)); then echo \"INT is negative.\"; fi",
         "out": "INT is negative.",
         "note": "With INT=-5; no $ needed in front of INT.",
         "sim": false
        }
       ],
       "chapters": [
        27
       ]
      }
     ],
     "terms": [
      {
       "t": "test vs [[ ]]",
       "d": "test is traditional and POSIX; [[ ]] is bash-specific but easier and preferred for modern scripts.",
       "p": 361
      }
     ],
     "quiz": [
      {
       "id": "ch27.modern.q1",
       "type": "fill",
       "cmd": "dbl-bracket",
       "q": "Using [[ ]], test whether $FILE matches the glob pattern foo.*",
       "accept": [
        "[[ $FILE == foo.* ]]",
        "[[ \"$FILE\" == foo.* ]]"
       ]
      },
      {
       "id": "ch27.modern.q2",
       "type": "mc",
       "cmd": "dbl-bracket",
       "q": "Which operator, available only in [[ ]], matches a string against a regular expression?",
       "choices": [
        "=~",
        "==",
        "-eq",
        "-re"
       ],
       "answer": 0,
       "explain": "string =~ regex is the expression [[ ]] adds."
      },
      {
       "id": "ch27.modern.q3",
       "type": "mc",
       "cmd": "dbl-paren",
       "q": "What does this print? if ((0)); then echo \"It is true.\"; fi",
       "choices": [
        "Nothing",
        "It is true.",
        "0",
        "an error"
       ],
       "answer": 0
      },
      {
       "id": "ch27.modern.q4",
       "type": "order",
       "cmd": "dbl-bracket",
       "q": "Build: test that $INT is an integer",
       "parts": [
        "[[",
        "\"$INT\"",
        "=~",
        "^-?[0-9]+$",
        "]]"
       ]
      }
     ]
    },
    {
     "id": "ch27.logic",
     "title": "Combining Expressions and Control Operators",
     "intro": "Logical operators join several tests into one decision. The control operators && and || give a compact way to branch between whole commands.",
     "commands": [
      {
       "id": "and-op",
       "name": "&&",
       "kind": "syntax",
       "summary": "Run the second command only if the first succeeds",
       "syntax": "command1 && command2",
       "explain": "With &&, command1 runs first and command2 runs only when command1 returns a zero exit status. It is a short way to make one step depend on another.",
       "examples": [
        {
         "cmd": "mkdir temp && cd temp",
         "note": "Changes into temp only if mkdir succeeded.",
         "sim": true,
         "viz": "tree"
        }
       ],
       "chapters": [
        27
       ]
      },
      {
       "id": "or-op",
       "name": "||",
       "kind": "syntax",
       "summary": "Run the second command only if the first fails",
       "syntax": "command1 || command2",
       "explain": "With ||, command2 runs only when command1 fails. It suits fallbacks and error handling, such as quitting a script when a needed directory is missing.",
       "examples": [
        {
         "cmd": "[[ -d temp ]] || mkdir temp",
         "out": "",
         "note": "Creates temp only if the test finds no such directory.",
         "sim": false
        },
        {
         "cmd": "[ -d temp ] || exit 1",
         "out": "",
         "note": "In a script, stops with status 1 when temp is missing.",
         "sim": false
        }
       ],
       "chapters": [
        27
       ]
      }
     ],
     "terms": [
      {
       "t": "AND",
       "d": "Written -a in test, && in [[ ]] and (( )).",
       "p": 359
      },
      {
       "t": "OR",
       "d": "Written -o in test, || in [[ ]] and (( )).",
       "p": 359
      },
      {
       "t": "NOT",
       "d": "Written ! in test, [[ ]] and (( )); flips true to false and back.",
       "p": 359
      },
      {
       "t": "( ) grouping",
       "d": "Parentheses group expressions so ! applies to the whole combination, not just the first part.",
       "p": 360
      },
      {
       "t": "\\( \\) in test",
       "d": "With test, quote or escape (, ), < and > because the shell sees them as ordinary arguments.",
       "p": 360
      }
     ],
     "tasks": [
      {
       "id": "ch27.logic.t1",
       "prompt": "Create a directory named temp and, only if that works, change into it.",
       "hint": "mkdir ... && cd ...",
       "solution": "mkdir temp && cd temp",
       "check": [
        {
         "t": "isdir",
         "p": "~/temp"
        },
        {
         "t": "cwd",
         "p": "~/temp"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch27.logic.q1",
       "type": "mc",
       "cmd": "or-op",
       "q": "In command1 || command2, when does command2 run?",
       "choices": [
        "Only if command1 fails",
        "Only if command1 succeeds",
        "Always",
        "Never"
       ],
       "answer": 0,
       "explain": "|| runs the second command on failure."
      },
      {
       "id": "ch27.logic.q2",
       "type": "fill",
       "cmd": "and-op",
       "q": "Create directory temp and cd into it only if mkdir succeeds.",
       "accept": [
        "mkdir temp && cd temp"
       ]
      },
      {
       "id": "ch27.logic.q3",
       "type": "mc",
       "cmd": "test",
       "q": "Which operator means AND inside a test ([ ]) expression?",
       "choices": [
        "-a",
        "&&",
        "-o",
        "!"
       ],
       "answer": 0,
       "explain": "test uses -a; [[ ]] and (( )) use &&."
      },
      {
       "id": "ch27.logic.q4",
       "type": "order",
       "cmd": "dbl-bracket",
       "q": "Build: true if $INT is between $MIN_VAL and $MAX_VAL",
       "parts": [
        "[[",
        "\"$INT\" -ge \"$MIN_VAL\"",
        "&&",
        "\"$INT\" -le \"$MAX_VAL\"",
        "]]"
       ]
      }
     ]
    }
   ]
  },
  {
   "id": "ch28",
   "n": 28,
   "part": 4,
   "title": "Reading Keyboard Input",
   "summary": "Make scripts interactive with read, IFS, here strings, validation and menus",
   "lessons": [
    {
     "id": "ch28.read",
     "title": "read: Input from the Keyboard",
     "intro": "Editing a script every time a value changes is tedious. The read builtin lets the script ask the user for the value instead.",
     "commands": [
      {
       "id": "read",
       "name": "read",
       "kind": "builtin",
       "summary": "Read one line of standard input into variables",
       "syntax": "read [-options] [variable...]",
       "explain": "read takes a single line from standard input, the keyboard or a redirected file, and splits it into fields assigned to the named variables. Too few fields leave the extra variables empty, and too many pile the leftovers into the last variable. With no variable names, the whole line lands in the shell variable REPLY.",
       "flags": [
        {
         "f": "-a array",
         "d": "Store the input in an array, starting at index zero.",
         "p": 366,
         "ch": 28
        },
        {
         "f": "-d delimiter",
         "d": "End input at the first character of delimiter instead of at a newline.",
         "p": 366,
         "ch": 28
        },
        {
         "f": "-e",
         "d": "Use Readline for input, so it can be edited like the command line.",
         "p": 366,
         "ch": 28
        },
        {
         "f": "-i string",
         "d": "Offer string as the default answer if the user just presses ENTER. Needs -e.",
         "p": 366,
         "ch": 28
        },
        {
         "f": "-n num",
         "d": "Read only num characters rather than a whole line.",
         "p": 366,
         "ch": 28
        },
        {
         "f": "-p prompt",
         "d": "Show the prompt string before waiting for input.",
         "p": 366,
         "ch": 28
        },
        {
         "f": "-r",
         "d": "Raw mode: backslashes are not treated as escape characters.",
         "p": 367,
         "ch": 28
        },
        {
         "f": "-s",
         "d": "Silent mode: typed characters are not shown, useful for passwords.",
         "p": 367,
         "ch": 28
        },
        {
         "f": "-t seconds",
         "d": "Give up after the given seconds; read then returns a non-zero status.",
         "p": 367,
         "ch": 28
        },
        {
         "f": "-u fd",
         "d": "Take input from descriptor fd in place of standard input.",
         "p": 367,
         "ch": 28
        }
       ],
       "examples": [
        {
         "cmd": "echo -n \"Please enter an integer -> \"\nread int",
         "out": "Please enter an integer -> 5",
         "note": "echo -n keeps the cursor on the prompt line; the reply goes into int.",
         "sim": false
        },
        {
         "cmd": "read var1 var2 var3 var4 var5",
         "out": "a b c d e f g\nvar1 = 'a'\nvar2 = 'b'\nvar3 = 'c'\nvar4 = 'd'\nvar5 = 'e f g'",
         "note": "Surplus words all end up in the last variable.",
         "sim": false
        },
        {
         "cmd": "read -p \"Enter one or more values > \"\necho \"REPLY = '$REPLY'\"",
         "out": "Enter one or more values > a b c d\nREPLY = 'a b c d'",
         "note": "No variable given, so the line is stored in REPLY.",
         "sim": false
        },
        {
         "cmd": "read -t 10 -sp \"Enter secret passphrase > \" secret_pass",
         "out": "",
         "note": "Hides the typing and times out after ten seconds.",
         "sim": false
        },
        {
         "cmd": "read -e -p \"What is your user name? \" -i $USER",
         "out": "What is your user name? me",
         "note": "Pre-fills the answer with $USER; ENTER accepts it.",
         "sim": false
        }
       ],
       "chapters": [
        28
       ]
      }
     ],
     "terms": [
      {
       "t": "REPLY",
       "d": "Shell variable that receives the whole input line when read is given no variable names.",
       "p": 364
      }
     ],
     "quiz": [
      {
       "id": "ch28.read.q1",
       "type": "mc",
       "cmd": "read",
       "q": "Which read option hides the characters as they are typed?",
       "choices": [
        "-s",
        "-r",
        "-e",
        "-n"
       ],
       "answer": 0,
       "explain": "-s is silent mode."
      },
      {
       "id": "ch28.read.q2",
       "type": "fill",
       "cmd": "read",
       "q": "Prompt with \"Enter selection [0-3] > \" and read the answer into REPLY.",
       "accept": [
        "read -p \"Enter selection [0-3] > \""
       ]
      },
      {
       "id": "ch28.read.q3",
       "type": "output",
       "cmd": "read",
       "q": "The user types a b c d e f g for: read var1 var2 var3 var4 var5. What is in var5?",
       "out": "var5 = 'e f g'",
       "choices": [
        "e f g",
        "e",
        "g",
        "empty"
       ],
       "answer": 0
      },
      {
       "id": "ch28.read.q4",
       "type": "order",
       "cmd": "read",
       "q": "Build: silently read secret_pass with a 10 second timeout and a prompt",
       "parts": [
        "read",
        "-t 10",
        "-sp",
        "\"Enter secret passphrase > \"",
        "secret_pass"
       ]
      }
     ]
    },
    {
     "id": "ch28.ifs",
     "title": "IFS and Here Strings",
     "intro": "read splits its input on the characters in IFS. Changing IFS lets read split other formats, such as the colon-separated lines of /etc/passwd.",
     "commands": [
      {
       "id": "here-string",
       "name": "<<<",
       "kind": "syntax",
       "summary": "Feed a single string to a command's standard input",
       "syntax": "command <<< \"string\"",
       "explain": "A here string works like a short here document made of one string. It is the usual way to give read a line of data, because piping into read fails: the pipeline runs read in a subshell, and its variables vanish when that subshell exits.",
       "examples": [
        {
         "cmd": "IFS=\":\" read user pw uid gid name home shell <<< \"$file_info\"",
         "out": "",
         "note": "Splits one passwd line on colons into seven variables.",
         "sim": false
        },
        {
         "cmd": "echo \"foo\" | read",
         "out": "",
         "note": "Looks fine but REPLY stays empty, because read ran in a subshell.",
         "sim": false
        }
       ],
       "chapters": [
        28
       ]
      }
     ],
     "terms": [
      {
       "t": "IFS",
       "d": "Internal Field Separator: the characters used to split input into fields. Default is space, tab and newline.",
       "p": 368
      },
      {
       "t": "VAR=value command",
       "d": "An assignment placed before a command changes its environment only while that command runs.",
       "p": 369
      },
      {
       "t": "OLD_IFS=\"$IFS\"",
       "d": "The longer alternative: save IFS, change it, run read, then restore the saved value.",
       "p": 369
      },
      {
       "t": "subshell",
       "d": "A copy of the shell and its environment that runs pipeline commands; it cannot change its parent.",
       "p": 370
      }
     ],
     "quiz": [
      {
       "id": "ch28.ifs.q1",
       "type": "mc",
       "cmd": "read",
       "q": "Why does echo \"foo\" | read leave REPLY empty?",
       "choices": [
        "read runs in a subshell whose variables are discarded",
        "read cannot read from pipes",
        "echo adds a newline",
        "REPLY is read-only"
       ],
       "answer": 0,
       "explain": "Pipelines create subshells, which cannot alter the parent environment."
      },
      {
       "id": "ch28.ifs.q2",
       "type": "fill",
       "cmd": "here-string",
       "q": "Use a here string to feed \"$file_info\" to read, storing the line in REPLY.",
       "accept": [
        "read <<< \"$file_info\""
       ]
      },
      {
       "id": "ch28.ifs.q3",
       "type": "order",
       "cmd": "here-string",
       "q": "Build: split $file_info on colons into user and pw",
       "parts": [
        "IFS=\":\"",
        "read",
        "user pw",
        "<<<",
        "\"$file_info\""
       ]
      },
      {
       "id": "ch28.ifs.q4",
       "type": "output",
       "cmd": "here-string",
       "q": "file_info is me:x:1000:1000:Me:/home/me:/bin/bash. After IFS=\":\" read user pw uid gid name home shell <<< \"$file_info\", which value does $uid hold?",
       "out": "1000",
       "choices": [
        "1000",
        "x",
        "me",
        "/home/me"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch28.validate",
     "title": "Validating Input and Menus",
     "intro": "Input from people is unpredictable, so a good script checks it before acting on it. A menu is a common interactive pattern that relies on such checks.",
     "commands": [],
     "terms": [
      {
       "t": "validating input",
       "d": "Screen every input for empty, multi-word or wrongly formed values before using it.",
       "p": 370
      },
      {
       "t": "[[ -z \"$REPLY\" ]] && invalid_input",
       "d": "Calls an error function when the user entered nothing.",
       "p": 371
      },
      {
       "t": "(( \"$(echo \"$REPLY\" | wc -w)\" > 1 ))",
       "d": "True when the input contains more than one word.",
       "p": 371
      },
      {
       "t": "^-?[[:digit:]]+$",
       "d": "Regex for an integer: optional minus sign followed by digits.",
       "p": 371
      },
      {
       "t": "menu-driven",
       "d": "A program that lists choices and asks the user to pick one.",
       "p": 372
      },
      {
       "t": "[[ \"$REPLY\" =~ ^[0-3]$ ]]",
       "d": "Accepts only a single digit from 0 to 3 as a menu choice.",
       "p": 372
      },
      {
       "t": "multiple exit points",
       "d": "Several exit commands make logic harder to follow, though the menu script uses them.",
       "p": 373
      }
     ],
     "quiz": [
      {
       "id": "ch28.validate.q1",
       "type": "fill",
       "cmd": "dbl-bracket",
       "q": "Using [[ ]], test that $REPLY is a single digit from 0 to 3.",
       "accept": [
        "[[ \"$REPLY\" =~ ^[0-3]$ ]]",
        "[[ $REPLY =~ ^[0-3]$ ]]"
       ]
      },
      {
       "id": "ch28.validate.q2",
       "type": "mc",
       "cmd": "read",
       "q": "What does [[ -z \"$REPLY\" ]] && invalid_input catch?",
       "choices": [
        "Empty input",
        "Multiple words",
        "Non-numeric input",
        "A timeout"
       ],
       "answer": 0,
       "explain": "-z is true for a zero-length string."
      },
      {
       "id": "ch28.validate.q3",
       "type": "order",
       "cmd": "read",
       "q": "Order the steps of the read-menu script",
       "parts": [
        "clear",
        "echo the menu",
        "read -p \"Enter selection [0-3] > \"",
        "if [[ \"$REPLY\" =~ ^[0-3]$ ]]; then"
       ]
      }
     ]
    }
   ]
  },
  {
   "id": "ch29",
   "n": 29,
   "part": 4,
   "title": "Flow Control: Looping with while/until",
   "summary": "Repeat commands with while and until, control loops, and read files",
   "lessons": [
    {
     "id": "ch29.while",
     "title": "while and until Loops",
     "intro": "A loop repeats a block of commands until some condition is met. bash's while and until loops test an exit status each time around, just as if does.",
     "commands": [
      {
       "id": "while",
       "name": "while",
       "kind": "keyword",
       "summary": "Repeat commands as long as a test command succeeds",
       "syntax": "while commands; do commands; done",
       "explain": "while runs its test commands and, while they keep returning zero, executes the body between do and done. After each pass the test is repeated. When it finally returns non-zero, the loop ends and execution continues after done.",
       "examples": [
        {
         "cmd": "count=1\nwhile [[ \"$count\" -le 5 ]]; do\n    echo \"$count\"\n    count=$((count + 1))\ndone\necho \"Finished.\"",
         "out": "1\n2\n3\n4\n5\nFinished.",
         "note": "Counts to 5; on the sixth check count is 6 and the loop stops.",
         "sim": false
        },
        {
         "cmd": "while [[ \"$REPLY\" != 0 ]]; do\n    clear\n    read -p \"Enter selection [0-3] > \"\ndone",
         "out": "",
         "note": "The menu keeps coming back until the user picks 0.",
         "sim": false
        },
        {
         "cmd": "while read distro version release; do\n    printf \"Distro: %s\\tVersion: %s\\tReleased: %s\\n\" \\\n        \"$distro\" \\\n        \"$version\" \\\n        \"$release\"\ndone < distros.txt",
         "out": "",
         "note": "The redirection after done feeds the file to the loop; read fails at end of file and the loop ends.",
         "sim": false
        },
        {
         "cmd": "sort -k 1,1 -k 2n distros.txt | while read distro version release; do\n    printf \"Distro: %s\\tVersion: %s\\tReleased: %s\\n\" \"$distro\" \"$version\" \"$release\"\ndone",
         "out": "",
         "note": "Piped input works too, but the loop runs in a subshell.",
         "sim": false
        }
       ],
       "chapters": [
        29
       ]
      },
      {
       "id": "until",
       "name": "until",
       "kind": "keyword",
       "summary": "Repeat commands until a test command succeeds",
       "syntax": "until commands; do commands; done",
       "explain": "until is the mirror image of while: it keeps looping while the test fails and stops at the first zero exit status. Pick whichever of the two lets you write the clearer test.",
       "examples": [
        {
         "cmd": "count=1\nuntil [[ \"$count\" -gt 5 ]]; do\n    echo \"$count\"\n    count=$((count + 1))\ndone\necho \"Finished.\"",
         "out": "1\n2\n3\n4\n5\nFinished.",
         "note": "Same result as the while version, with the test turned around.",
         "sim": false
        }
       ],
       "chapters": [
        29
       ]
      }
     ],
     "terms": [
      {
       "t": "loop",
       "d": "A section of a program that repeats until a condition says to stop.",
       "p": 376
      },
      {
       "t": "sleep \"$DELAY\"",
       "d": "Pauses the menu so results stay visible before the screen is cleared.",
       "p": 378
      }
     ],
     "quiz": [
      {
       "id": "ch29.while.q1",
       "type": "order",
       "cmd": "while",
       "q": "Order the parts of a while loop that counts to 5",
       "parts": [
        "while [[ \"$count\" -le 5 ]]; do",
        "echo \"$count\"",
        "count=$((count + 1))",
        "done"
       ]
      },
      {
       "id": "ch29.while.q2",
       "type": "mc",
       "cmd": "until",
       "q": "When does an until loop stop?",
       "choices": [
        "When its test returns a zero exit status",
        "When its test returns non-zero",
        "After one pass",
        "Only at break"
       ],
       "answer": 0,
       "explain": "until loops while the test fails and quits on success."
      },
      {
       "id": "ch29.while.q3",
       "type": "fill",
       "cmd": "until",
       "q": "Write the header of an until loop that runs until $count is greater than 5 (use [[ ]]).",
       "accept": [
        "until [[ \"$count\" -gt 5 ]]; do",
        "until [[ $count -gt 5 ]]; do"
       ]
      },
      {
       "id": "ch29.while.q4",
       "type": "output",
       "cmd": "while",
       "q": "count=1. What does this print? while [[ \"$count\" -le 3 ]]; do echo \"$count\"; count=$((count + 1)); done",
       "out": "1\n2\n3",
       "choices": [
        "1\n2\n3",
        "1\n2",
        "1\n2\n3\n4",
        "0\n1\n2"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch29.break",
     "title": "break and continue",
     "intro": "Two builtins change the flow inside a loop. They are often paired with an endless while true loop that the script exits on purpose.",
     "commands": [
      {
       "id": "break",
       "name": "break",
       "kind": "builtin",
       "summary": "Leave the current loop immediately",
       "syntax": "break",
       "explain": "break ends the loop at once, and the script carries on with the first statement after done. It is the usual way out of a loop that would otherwise never stop, such as while true.",
       "examples": [
        {
         "cmd": "while true; do\n    read -p \"Enter selection [0-3] > \"\n    if [[ \"$REPLY\" == 0 ]]; then\n        break\n    fi\ndone\necho \"Program terminated.\"",
         "out": "Enter selection [0-3] > 0\nProgram terminated.",
         "note": "Choosing 0 breaks out of the endless loop.",
         "sim": false
        }
       ],
       "chapters": [
        29
       ]
      },
      {
       "id": "continue",
       "name": "continue",
       "kind": "builtin",
       "summary": "Skip the rest of this pass and start the next loop iteration",
       "syntax": "continue",
       "explain": "continue jumps straight back to the top of the loop, skipping the remaining commands in the body. In the menu script it saves testing the other choices once one has matched.",
       "examples": [
        {
         "cmd": "if [[ \"$REPLY\" == 2 ]]; then\n    df -h\n    sleep \"$DELAY\"\n    continue\nfi",
         "out": "",
         "note": "After showing disk space, go straight back to the menu.",
         "sim": false
        }
       ],
       "chapters": [
        29
       ]
      }
     ],
     "terms": [
      {
       "t": "endless loop",
       "d": "A loop such as while true that never ends by itself; the script must break out of it.",
       "p": 379
      }
     ],
     "quiz": [
      {
       "id": "ch29.break.q1",
       "type": "mc",
       "cmd": "continue",
       "q": "What does continue do inside a loop?",
       "choices": [
        "Skips to the next iteration",
        "Ends the loop",
        "Exits the script",
        "Repeats the current command"
       ],
       "answer": 0,
       "explain": "break leaves the loop; continue starts the next pass."
      },
      {
       "id": "ch29.break.q2",
       "type": "fill",
       "cmd": "while",
       "q": "Write the header of a loop that never ends on its own.",
       "accept": [
        "while true; do"
       ]
      },
      {
       "id": "ch29.break.q3",
       "type": "output",
       "cmd": "break",
       "q": "The user picks 0 in the while-menu2 script. What is printed after the loop?",
       "out": "Program terminated.",
       "choices": [
        "Program terminated.",
        "Invalid entry.",
        "Nothing",
        "Finished."
       ],
       "answer": 0
      },
      {
       "id": "ch29.break.q4",
       "type": "order",
       "cmd": "break",
       "q": "Order the lines that leave the menu loop on choice 0",
       "parts": [
        "if [[ \"$REPLY\" == 0 ]]; then",
        "break",
        "fi"
       ]
      }
     ]
    },
    {
     "id": "ch29.files",
     "title": "Reading Files with Loops",
     "intro": "while and until can take standard input, so a loop with read can process a file line by line. Input can be redirected after done or piped in.",
     "commands": [],
     "terms": [
      {
       "t": "done < file",
       "d": "Put the input redirection after done to send a file into the whole loop.",
       "p": 380
      },
      {
       "t": "read at end of file",
       "d": "read succeeds for each line and returns non-zero at end of file, which ends the loop.",
       "p": 380
      },
      {
       "t": "pipe into while",
       "d": "A piped loop runs in a subshell, so variables set inside it are lost when it finishes.",
       "p": 381
      }
     ],
     "quiz": [
      {
       "id": "ch29.files.q1",
       "type": "mc",
       "cmd": "while",
       "q": "Where does the redirection go to feed distros.txt into a while read loop?",
       "choices": [
        "After done",
        "After while",
        "After do",
        "Before while"
       ],
       "answer": 0,
       "explain": "done < distros.txt sends the file into the whole loop."
      },
      {
       "id": "ch29.files.q2",
       "type": "fill",
       "cmd": "while",
       "q": "Write the closing line of a loop that reads its input from distros.txt.",
       "accept": [
        "done < distros.txt",
        "done <distros.txt"
       ]
      },
      {
       "id": "ch29.files.q3",
       "type": "order",
       "cmd": "while",
       "q": "Order the parts of a loop reading distros.txt",
       "parts": [
        "while read distro version release; do",
        "printf ...",
        "done < distros.txt"
       ]
      },
      {
       "id": "ch29.files.q4",
       "type": "output",
       "cmd": "while",
       "q": "A loop that ends in done < distros.txt prints the fields of each line. Which first line results for the line SUSE 10.2 12/07/2006?",
       "out": "Distro: SUSE\tVersion: 10.2\tReleased: 12/07/2006",
       "choices": [
        "Distro: SUSE\tVersion: 10.2\tReleased: 12/07/2006",
        "SUSE 10.2 12/07/2006",
        "Distro: SUSE 10.2 12/07/2006",
        "Distro: %s"
       ],
       "answer": 0
      }
     ]
    }
   ]
  },
  {
   "id": "ch30",
   "n": 30,
   "part": 4,
   "title": "Troubleshooting",
   "summary": "Spot syntax and logic errors, code defensively, test, and trace scripts",
   "lessons": [
    {
     "id": "ch30.syntax",
     "title": "Syntactic Errors",
     "intro": "A syntactic error is a typo in the shell's grammar, and it stops the script. The reported line number is often well past the real mistake.",
     "commands": [],
     "terms": [
      {
       "t": "missing quote",
       "d": "bash keeps reading until it finds a closing quote, so the error is reported much later in the file.",
       "p": 384
      },
      {
       "t": "unexpected EOF while looking for matching",
       "d": "Message produced when a quoted string is never closed.",
       "p": 384
      },
      {
       "t": "missing semicolon before then",
       "d": "then becomes just another argument to [, so the shell later trips over else.",
       "p": 385
      },
      {
       "t": "syntax error near unexpected token",
       "d": "Message shown when a reserved word such as else appears where it cannot go.",
       "p": 385
      },
      {
       "t": "reserved word",
       "d": "A word with special meaning to the shell, like if or else, rather than a command name.",
       "p": 385
      },
      {
       "t": "unary operator expected",
       "d": "Error from [ $number = 1 ] when number is empty: the test sees [ = 1 ].",
       "p": 386
      },
      {
       "t": "[ \"$number\" = 1 ]",
       "d": "Quoting the variable keeps an empty value as an argument, giving [ \"\" = 1 ].",
       "p": 386
      },
      {
       "t": "quote expansions",
       "d": "As a rule, double-quote variables and command substitutions unless word splitting is wanted.",
       "p": 387
      }
     ],
     "quiz": [
      {
       "id": "ch30.syntax.q1",
       "type": "mc",
       "cmd": "if",
       "q": "if [ $number = 1 ] then ... (no semicolon). Where does bash report the error?",
       "choices": [
        "At the else line",
        "At the if line",
        "At the then word",
        "It runs without error"
       ],
       "answer": 0,
       "explain": "then is taken as an argument to [, so the problem only shows at else."
      },
      {
       "id": "ch30.syntax.q2",
       "type": "output",
       "cmd": "test",
       "q": "number is empty. Which test line causes this message?",
       "out": "/home/me/bin/trouble: line 7: [: =: unary operator expected",
       "choices": [
        "[ $number = 1 ]",
        "[ \"$number\" = 1 ]",
        "[[ $number == 1 ]]",
        "[ -z \"$number\" ]"
       ],
       "answer": 0
      },
      {
       "id": "ch30.syntax.q3",
       "type": "fill",
       "cmd": "test",
       "q": "Rewrite [ $number = 1 ] so it still works when number is empty.",
       "accept": [
        "[ \"$number\" = 1 ]"
       ]
      },
      {
       "id": "ch30.syntax.q4",
       "type": "order",
       "cmd": "if",
       "q": "Order the tokens of a correct if header",
       "parts": [
        "if",
        "[ \"$number\" = 1 ]",
        ";",
        "then"
       ]
      }
     ]
    },
    {
     "id": "ch30.defensive",
     "title": "Logical Errors and Defensive Programming",
     "intro": "Logical errors let a script run but give the wrong result. Defensive programming checks each assumption, such as whether a cd really worked, before doing anything risky.",
     "commands": [],
     "terms": [
      {
       "t": "incorrect conditional expressions",
       "d": "if/then/else logic coded backward or left incomplete.",
       "p": 387
      },
      {
       "t": "off by one",
       "d": "A counting loop that starts at the wrong value runs one pass too many or too few.",
       "p": 387
      },
      {
       "t": "unanticipated situations",
       "d": "Data the programmer never expected, such as a filename with spaces that becomes several arguments.",
       "p": 387
      },
      {
       "t": "cd $dir_name; rm *",
       "d": "Dangerous: if cd fails, rm deletes files in whatever directory you are in.",
       "p": 387
      },
      {
       "t": "cd \"$dir_name\" && rm *",
       "d": "Runs rm only when cd succeeds.",
       "p": 388
      },
      {
       "t": "[[ -d \"$dir_name\" ]] && cd \"$dir_name\" && rm *",
       "d": "Also confirms the variable names an existing directory.",
       "p": 388
      },
      {
       "t": "if ! cd \"$dir_name\"; then",
       "d": "Detects a failed cd so the script can print an error to stderr and exit 1.",
       "p": 388
      },
      {
       "t": "rm ./*",
       "d": "Prefix wildcards with ./ so a file named like -rf is not taken as an option.",
       "p": 389
      },
      {
       "t": "legal filename characters",
       "d": "Unix allows everything in a name except / and the null byte, even spaces and leading hyphens.",
       "p": 388
      },
      {
       "t": "POSIX Portable Filename Character Set",
       "d": "A-Z, a-z, 0-9, period, hyphen and underscore; names should not start with a hyphen.",
       "p": 389
      },
      {
       "t": "verifying input",
       "d": "Accept only valid input, e.g. [[ $REPLY =~ ^[0-3]$ ]] for a menu choice.",
       "p": 389
      }
     ],
     "quiz": [
      {
       "id": "ch30.defensive.q1",
       "type": "fill",
       "cmd": "and-op",
       "q": "Delete all files in \"$dir_name\" only if changing into it succeeds (no ./ prefix).",
       "accept": [
        "cd \"$dir_name\" && rm *"
       ]
      },
      {
       "id": "ch30.defensive.q2",
       "type": "mc",
       "cmd": "and-op",
       "q": "Why write rm ./* instead of rm *?",
       "choices": [
        "A filename starting with - is not read as an option",
        "It is faster",
        "It includes hidden files",
        "It asks before deleting"
       ],
       "answer": 0,
       "explain": "The ./ prefix means no expanded name can begin with a hyphen."
      },
      {
       "id": "ch30.defensive.q3",
       "type": "order",
       "cmd": "and-op",
       "q": "Build the safest one-line version of the deletion",
       "parts": [
        "[[ -d \"$dir_name\" ]]",
        "&&",
        "cd \"$dir_name\"",
        "&&",
        "rm ./*"
       ]
      },
      {
       "id": "ch30.defensive.q4",
       "type": "output",
       "cmd": "if",
       "q": "dir_name names a missing directory. Which check prints this?",
       "out": "No such directory: 'foo'",
       "choices": [
        "if [[ ! -d \"$dir_name\" ]]; then echo \"No such directory: '$dir_name'\" >&2; exit 1; fi",
        "cd \"$dir_name\" && rm *",
        "rm ./*",
        "if ! rm *; then echo \"File deletion failed. Check results\" >&2; fi"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch30.testing",
     "title": "Testing",
     "intro": "Bugs are cheaper to fix the earlier they are found. Stubs, safe test edits and good test cases help you test as you go.",
     "commands": [],
     "terms": [
      {
       "t": "release early, release often",
       "d": "Open source saying: frequent releases get software more use and testing sooner.",
       "p": 390
      },
      {
       "t": "echo rm * # TESTING",
       "d": "Prints the command and its expanded arguments instead of deleting anything.",
       "p": 390
      },
      {
       "t": "exit # TESTING",
       "d": "Stops the script after the code under test so nothing else runs.",
       "p": 390
      },
      {
       "t": "# TESTING markers",
       "d": "Comments tagging temporary test edits so they are easy to find and remove later.",
       "p": 391
      },
      {
       "t": "test cases",
       "d": "Inputs chosen to cover edge and corner cases, e.g. an existing directory, a missing one, an empty name.",
       "p": 391
      },
      {
       "t": "commenting out",
       "d": "Put # before each line of a section to disable it and see if the bug changes.",
       "p": 391
      },
      {
       "t": "design is a function of time",
       "d": "A one-off script can be quick and dirty; production scripts deserve careful design.",
       "p": 390
      }
     ],
     "quiz": [
      {
       "id": "ch30.testing.q1",
       "type": "mc",
       "cmd": "echo",
       "q": "Why put echo in front of rm * while testing?",
       "choices": [
        "It shows the expanded command without deleting",
        "It makes rm verbose",
        "It logs to a file",
        "It asks for confirmation"
       ],
       "answer": 0,
       "explain": "echo prints the command line rm would have run."
      },
      {
       "id": "ch30.testing.q2",
       "type": "fill",
       "cmd": "echo",
       "q": "Make rm * safe to test by displaying it instead of running it (no comment).",
       "accept": [
        "echo rm *"
       ]
      },
      {
       "id": "ch30.testing.q3",
       "type": "output",
       "cmd": "echo",
       "q": "The directory holds a.txt and b.txt. What does echo rm * print?",
       "out": "rm a.txt b.txt",
       "choices": [
        "rm a.txt b.txt",
        "rm *",
        "Nothing; the files are removed",
        "a.txt b.txt"
       ],
       "answer": 0
      },
      {
       "id": "ch30.testing.q4",
       "type": "order",
       "cmd": "echo",
       "q": "Order the three test cases from the chapter as listed",
       "parts": [
        "dir_name names an existing directory",
        "dir_name names a nonexistent directory",
        "dir_name is empty"
       ]
      }
     ]
    },
    {
     "id": "ch30.tracing",
     "title": "Debugging and Tracing",
     "intro": "Tracing reveals the real path a script takes. You can print your own markers, or let bash show every command after expansion.",
     "commands": [],
     "terms": [
      {
       "t": "echo \"...\" >&2",
       "d": "Trace messages go to stderr to stay apart from normal output; leave them unindented to spot them.",
       "p": 392
      },
      {
       "t": "#!/bin/bash -x",
       "d": "Adding -x to the shebang traces the entire script.",
       "p": 393
      },
      {
       "t": "+",
       "d": "Default prefix marking trace lines, so they stand out from real output.",
       "p": 393
      },
      {
       "t": "PS4",
       "d": "Prompt string 4: holds the prefix printed before each trace line.",
       "p": 393
      },
      {
       "t": "export PS4='$LINENO + '",
       "d": "Shows the script line number in traces; single quotes delay expansion until use.",
       "p": 393
      },
      {
       "t": "echo \"number=$number\" # DEBUG",
       "d": "Prints a variable's value while running, tagged for easy removal later.",
       "p": 394
      }
     ],
     "quiz": [
      {
       "id": "ch30.tracing.q1",
       "type": "fill",
       "cmd": "set",
       "q": "Turn on tracing for the following section of a script.",
       "accept": [
        "set -x"
       ]
      },
      {
       "id": "ch30.tracing.q2",
       "type": "mc",
       "cmd": "set",
       "q": "Which shell variable sets the prefix printed in front of trace lines?",
       "choices": [
        "PS4",
        "PS1",
        "PS2",
        "IFS"
       ],
       "answer": 0,
       "explain": "PS4 defaults to a plus sign."
      },
      {
       "id": "ch30.tracing.q3",
       "type": "output",
       "cmd": "set",
       "q": "Which setting produced these trace lines?",
       "out": "5 + number=1\n7 + '[' 1 = 1 ']'",
       "choices": [
        "export PS4='$LINENO + '",
        "export PS4=\"$LINENO + \"",
        "set +x",
        "export PS1='$LINENO + '"
       ],
       "answer": 0
      },
      {
       "id": "ch30.tracing.q4",
       "type": "order",
       "cmd": "set",
       "q": "Order the lines to trace just one if statement",
       "parts": [
        "set -x",
        "if [ $number = 1 ]; then",
        "echo \"Number is equal to 1.\"",
        "fi",
        "set +x"
       ]
      }
     ],
     "refs": [
      "set"
     ]
    }
   ]
  },
  {
   "id": "ch31",
   "n": 31,
   "part": 4,
   "title": "Flow Control: Branching with case",
   "summary": "Choose among many actions by matching one word against patterns",
   "lessons": [
    {
     "id": "ch31.case",
     "title": "The case Command",
     "intro": "A menu with many choices quickly turns into a long chain of if tests. The case compound command compares one word against a list of patterns and runs only the commands attached to the first pattern that fits.",
     "commands": [
      {
       "id": "case",
       "name": "case",
       "kind": "keyword",
       "summary": "Run the commands tied to the first pattern a word matches",
       "syntax": "case word in [pattern [| pattern]...) commands ;;]... esac",
       "explain": "case expands word, usually a variable such as $REPLY, and checks it against each pattern from top to bottom. As soon as one pattern fits, its commands run and the rest of the patterns are skipped. Each clause ends with ;; and the whole block is closed with esac, which is case spelled backward.",
       "examples": [
        {
         "cmd": "case \"$REPLY\" in 0) echo \"Program terminated.\"; exit ;; *) echo \"Invalid entry\" >&2; exit 1 ;; esac",
         "out": "",
         "note": "A condensed version of the menu: 0 quits, anything else is reported as invalid on standard error.",
         "sim": false
        },
        {
         "cmd": "read -p \"enter word > \"; case \"$REPLY\" in ???) echo \"is three characters long.\" ;; *) echo \"is something else.\" ;; esac",
         "out": "enter word > abc\nis three characters long.",
         "note": "The ??? pattern fits any word that is exactly three characters.",
         "sim": false
        },
        {
         "cmd": "case4-1",
         "out": "Type a character > a\n'a' is lower case.",
         "note": "Only the first matching clause runs, even though a also fits other character classes.",
         "sim": false
        },
        {
         "cmd": "while [[ -n \"$1\" ]]; do case \"$1\" in -f | --file) shift; filename=\"$1\" ;; -i | --interactive) interactive=1 ;; -h | --help) usage; exit ;; *) usage >&2; exit 1 ;; esac; shift; done",
         "out": "",
         "note": "Option processing: each pass checks $1 with case, then shift moves to the next word.",
         "sim": false,
         "ch": 32
        },
        {
         "cmd": "case \"$REPLY\" in Y|y) break ;; Q|q) echo \"Program terminated.\"; exit ;; *) continue ;; esac",
         "out": "",
         "note": "Interactive mode: overwrite, quit, or ask again for a filename.",
         "sim": false,
         "ch": 32
        }
       ],
       "chapters": [
        31,
        32
       ]
      }
     ],
     "terms": [
      {
       "t": "a)",
       "d": "Pattern that fits only when word is exactly the text a.",
       "p": 398
      },
      {
       "t": "[[:alpha:]])",
       "d": "Pattern that fits when word is one alphabetic character.",
       "p": 398
      },
      {
       "t": "???)",
       "d": "Pattern that fits any word that is exactly three characters long.",
       "p": 398
      },
      {
       "t": "*.txt)",
       "d": "Pattern that fits any word ending in .txt.",
       "p": 398
      },
      {
       "t": "*)",
       "d": "Fits anything. Put it last as a catch-all for values no earlier pattern handled, such as invalid input.",
       "p": 398
      },
      {
       "t": ";;",
       "d": "Ends the command list of a case clause; after it runs, case stops checking patterns.",
       "p": 396
      },
      {
       "t": "esac",
       "d": "Keyword that closes a case statement.",
       "p": 396
      },
      {
       "t": "case patterns",
       "d": "Use the same wildcard rules as pathname expansion and end with a ) character.",
       "p": 397
      }
     ],
     "quiz": [
      {
       "id": "ch31.case.q1",
       "type": "mc",
       "cmd": "case",
       "q": "A clause ends with ;; and its pattern matches. What does case do next?",
       "choices": [
        "Runs that clause and stops checking patterns",
        "Tests every remaining pattern too",
        "Exits the whole script",
        "Runs the next clause as well"
       ],
       "answer": 0,
       "explain": "With ;; the first match wins and no further patterns are tried."
      },
      {
       "id": "ch31.case.q2",
       "type": "order",
       "cmd": "case",
       "q": "Build the first line of a case statement that tests the REPLY variable.",
       "parts": [
        "case",
        "\"$REPLY\"",
        "in"
       ]
      },
      {
       "id": "ch31.case.q3",
       "type": "fill",
       "cmd": "case",
       "q": "Type the keyword that closes a case statement.",
       "accept": [
        "esac"
       ]
      },
      {
       "id": "ch31.case.q4",
       "type": "output",
       "cmd": "case",
       "q": "The patterns are [[:alpha:]]), [ABC][0-9]), ???), *.txt) and *), in that order. Which input word printed this?",
       "out": "is three characters long.",
       "choices": [
        "abc",
        "a",
        "B7",
        "x.txt"
       ],
       "answer": 0,
       "explain": "abc is not a single letter and not a letter plus digit, so ??? is the first pattern that fits."
      }
     ]
    },
    {
     "id": "ch31.multi",
     "title": "Multiple Patterns and Multiple Matches",
     "intro": "One clause can list several patterns separated by a vertical bar, which works like an or. Modern bash can also keep testing after a match when a clause ends with ;;& instead of ;;.",
     "commands": [
      {
       "id": "case-or",
       "name": "|",
       "kind": "syntax",
       "summary": "Join several patterns in one case clause; any of them can match",
       "syntax": "pattern1|pattern2) commands ;;",
       "explain": "Inside case, a vertical bar between patterns means the clause fires if any one of them fits. A common use is accepting the same menu letter in either uppercase or lowercase.",
       "examples": [
        {
         "cmd": "case \"$REPLY\" in q|Q) echo \"Program terminated.\"; exit ;; b|B) df -h ;; esac",
         "out": "",
         "note": "Typing q or Q quits; b or B shows disk space.",
         "sim": false
        }
       ],
       "chapters": [
        31
       ]
      },
      {
       "id": "case-next",
       "name": ";;&",
       "kind": "syntax",
       "summary": "End a case clause but keep testing the patterns after it",
       "syntax": "pattern) commands ;;&",
       "explain": "Before bash 4.0, case could act on only one matching pattern. Ending a clause with ;;& tells case to carry on and test the following patterns, so one word can trigger several clauses. This is handy when a value belongs to more than one category, like a character class test.",
       "examples": [
        {
         "cmd": "case4-2",
         "out": "Type a character > a\n'a' is lower case.\n'a' is alphabetic.\n'a' is a visible character.\n'a' is a hexadecimal digit.",
         "note": "Every clause ends in ;;&, so each class that a fits gets reported.",
         "sim": false
        },
        {
         "cmd": "case \"$REPLY\" in [[:lower:]]) echo \"'$REPLY' is lower case.\" ;;& [[:alpha:]]) echo \"'$REPLY' is alphabetic.\" ;;& esac",
         "out": "'a' is lower case.\n'a' is alphabetic.",
         "note": "With REPLY=a both clauses run.",
         "sim": false
        }
       ],
       "chapters": [
        31
       ]
      }
     ],
     "terms": [
      {
       "t": "q|Q)",
       "d": "Pattern pair that matches either a lowercase or an uppercase q.",
       "p": 398
      },
      {
       "t": ";;&",
       "d": "Clause terminator (bash 4.0+) that lets case go on testing later patterns after a match.",
       "p": 400
      }
     ],
     "quiz": [
      {
       "id": "ch31.multi.q1",
       "type": "mc",
       "cmd": "case-next",
       "q": "Which clause terminator lets case keep testing patterns after a match?",
       "choices": [
        ";;&",
        ";;",
        "esac",
        "&&"
       ],
       "answer": 0,
       "explain": ";;& was added in bash 4.0 so one word can match several clauses."
      },
      {
       "id": "ch31.multi.q2",
       "type": "order",
       "cmd": "case-or",
       "q": "Build a clause that matches a or A and runs df -h.",
       "parts": [
        "a|A)",
        "df -h",
        ";;"
       ]
      },
      {
       "id": "ch31.multi.q3",
       "type": "fill",
       "cmd": "case-or",
       "q": "Write a case pattern, including the closing parenthesis, that matches either b or B.",
       "accept": [
        "b|B)",
        "B|b)"
       ]
      },
      {
       "id": "ch31.multi.q4",
       "type": "output",
       "cmd": "case-next",
       "q": "Typing a gave only this line, although a is also alphabetic and a hex digit. How did each clause end?",
       "out": "'a' is lower case.",
       "choices": [
        ";;",
        ";;&",
        "|",
        "esac"
       ],
       "answer": 0,
       "explain": "With ;; case stops after the first match."
      }
     ]
    }
   ]
  },
  {
   "id": "ch32",
   "n": 32,
   "part": 4,
   "title": "Positional Parameters",
   "summary": "Let scripts and functions read and process their command line arguments",
   "lessons": [
    {
     "id": "ch32.access",
     "title": "Accessing the Command Line",
     "intro": "Every word typed on a script's command line lands in a numbered shell variable. These positional parameters, plus a count of them, let a script react to its arguments.",
     "commands": [
      {
       "id": "posit-params",
       "name": "$1",
       "kind": "syntax",
       "summary": "Read the individual words from a script's command line",
       "syntax": "$0 $1 $2 ... $9 ${10}",
       "explain": "$0 always holds the path of the running program, the first word typed. $1 through $9 hold the arguments that follow it and are empty when not supplied. Past nine arguments, wrap the number in braces: ${10}, ${55}.",
       "examples": [
        {
         "cmd": "posit-param",
         "out": "$0 = /home/me/bin/posit-param\n$1 =\n$2 =\n$3 =",
         "note": "With no arguments, only $0 has a value.",
         "sim": false
        },
        {
         "cmd": "posit-param a b c d",
         "out": "$0 = /home/me/bin/posit-param\n$1 = a\n$2 = b\n$3 = c\n$4 = d\n$5 =",
         "note": "Each argument fills the next numbered parameter.",
         "sim": false
        }
       ],
       "chapters": [
        32
       ]
      },
      {
       "id": "arg-count",
       "name": "$#",
       "kind": "syntax",
       "summary": "Expand to how many arguments the script received",
       "syntax": "$#",
       "explain": "$# holds how many arguments were passed, not counting $0. Scripts test it to see whether enough arguments were given or to drive a loop over them.",
       "examples": [
        {
         "cmd": "posit-param a b c d",
         "out": "Number of arguments: 4\n$0 = /home/me/bin/posit-param\n$1 = a",
         "note": "The script prints $# before the individual parameters.",
         "sim": false
        },
        {
         "cmd": "posit-param *",
         "out": "Number of arguments: 82\n$0 = /home/me/bin/posit-param\n$1 = addresses.ldif\n$2 = bin",
         "note": "The wildcard expanded into 82 separate arguments on the book's system.",
         "sim": false
        }
       ],
       "chapters": [
        32
       ]
      }
     ],
     "terms": [
      {
       "t": "$0",
       "d": "Holds the first item on the command line: the pathname of the program being run.",
       "p": 402
      },
      {
       "t": "$1 - $9",
       "d": "Hold the first nine command line arguments; unused ones are empty.",
       "p": 401
      },
      {
       "t": "${10}",
       "d": "Braces let you reach positional parameters above nine, e.g. ${10} or ${211}.",
       "p": 402
      },
      {
       "t": "$#",
       "d": "Number of arguments given on the command line.",
       "p": 402
      }
     ],
     "quiz": [
      {
       "id": "ch32.access.q1",
       "type": "mc",
       "cmd": "posit-params",
       "q": "Which parameter holds the pathname of the running script?",
       "choices": [
        "$0",
        "$1",
        "$#",
        "$@"
       ],
       "answer": 0,
       "explain": "$0 is always the first word of the command line, the program itself."
      },
      {
       "id": "ch32.access.q2",
       "type": "fill",
       "cmd": "posit-params",
       "q": "Write the expansion that gives the eleventh positional parameter.",
       "accept": [
        "${11}"
       ]
      },
      {
       "id": "ch32.access.q3",
       "type": "output",
       "cmd": "arg-count",
       "q": "The script prints $# first. Which call produced this line?",
       "out": "Number of arguments: 4",
       "choices": [
        "posit-param a b c d",
        "posit-param a b c",
        "posit-param",
        "posit-param abcd"
       ],
       "answer": 0
      },
      {
       "id": "ch32.access.q4",
       "type": "order",
       "cmd": "arg-count",
       "q": "Build a line that prints how many arguments the script received.",
       "parts": [
        "echo",
        "\"Number of arguments:",
        "$#\""
       ]
      }
     ]
    },
    {
     "id": "ch32.shift",
     "title": "shift and Simple Applications",
     "intro": "Scripts can receive far more than nine arguments. shift slides the parameters down so a loop can handle them one at a time, and basename helps a script name itself in messages.",
     "commands": [
      {
       "id": "shift",
       "name": "shift",
       "kind": "builtin",
       "summary": "Move every positional parameter down by one position",
       "syntax": "shift",
       "explain": "Each time shift runs, the value in $2 moves into $1, $3 moves into $2, and so on, and $# goes down by one. $0 is never changed. A loop that works on $1 and then calls shift can process any number of arguments using just that one parameter.",
       "examples": [
        {
         "cmd": "posit-param2 a b c d",
         "out": "Argument 1 = a\nArgument 2 = b\nArgument 3 = c\nArgument 4 = d",
         "note": "The script loops while $# is above zero, printing $1 and shifting each time.",
         "sim": false
        },
        {
         "cmd": "count=1; while [[ $# -gt 0 ]]; do echo \"Argument $count = $1\"; count=$((count + 1)); shift; done",
         "out": "",
         "note": "The loop body from posit-param2, written on one line.",
         "sim": false
        }
       ],
       "chapters": [
        32
       ]
      },
      {
       "id": "basename",
       "name": "basename",
       "kind": "cmd",
       "summary": "Strip the leading directories from a pathname",
       "syntax": "basename pathname",
       "explain": "basename removes the directory part of a path and leaves only the final file name. Scripts often run it on $0 to learn their own short name for usage messages, so the message stays correct even after the script is renamed.",
       "examples": [
        {
         "cmd": "PROGNAME=\"$(basename \"$0\")\"",
         "out": "",
         "note": "In a script at /home/me/bin/file-info, PROGNAME becomes file-info.",
         "sim": false
        },
        {
         "cmd": "echo \"$PROGNAME: usage: $PROGNAME file\" >&2",
         "out": "",
         "note": "A usage message built from the script's own name, sent to standard error. It reads file-info: usage: file-info file.",
         "sim": false
        }
       ],
       "chapters": [
        32
       ]
      }
     ],
     "terms": [
      {
       "t": "shift and $0",
       "d": "shift never changes $0; only $1 and up move down.",
       "p": 404
      },
      {
       "t": "function arguments",
       "d": "Arguments passed to a shell function arrive in $1, $2, ... just like script arguments.",
       "p": 405
      },
      {
       "t": "FUNCNAME",
       "d": "Shell variable the shell updates with the name of the function currently running.",
       "p": 405
      },
      {
       "t": "$0 in a function",
       "d": "Still holds the program's pathname, not the function's name.",
       "p": 405
      }
     ],
     "quiz": [
      {
       "id": "ch32.shift.q1",
       "type": "mc",
       "cmd": "shift",
       "q": "What happens to $# each time shift runs?",
       "choices": [
        "It drops by one",
        "It grows by one",
        "It resets to zero",
        "It stays the same"
       ],
       "answer": 0,
       "explain": "One parameter falls off the front, so the count shrinks by one."
      },
      {
       "id": "ch32.shift.q2",
       "type": "order",
       "cmd": "shift",
       "q": "Build a loop header that keeps going while arguments remain.",
       "parts": [
        "while",
        "[[ $# -gt 0 ]];",
        "do"
       ]
      },
      {
       "id": "ch32.shift.q3",
       "type": "fill",
       "cmd": "basename",
       "q": "Set PROGNAME to the script's own name without its directories, quoting as the book does.",
       "accept": [
        "PROGNAME=\"$(basename \"$0\")\""
       ]
      },
      {
       "id": "ch32.shift.q4",
       "type": "output",
       "cmd": "shift",
       "q": "posit-param2 prints $1 and shifts until no arguments remain. Which call produced this?",
       "out": "Argument 1 = a\nArgument 2 = b",
       "choices": [
        "posit-param2 a b",
        "posit-param2 a b c",
        "posit-param2 b a",
        "posit-param2"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch32.enmasse",
     "title": "Handling Positional Parameters en Masse",
     "intro": "Sometimes a script needs to pass all of its arguments along at once, for example in a wrapper around another program. The special parameters $* and $@ do this, but quoting changes how they behave.",
     "commands": [
      {
       "id": "all-params",
       "name": "$@",
       "kind": "syntax",
       "summary": "Expand to every positional parameter, starting at $1",
       "syntax": "$*   \"$*\"   $@   \"$@\"",
       "explain": "Without quotes, $* and $@ act the same: the full argument list is split into words again, so arguments containing spaces break apart. In double quotes, \"$*\" glues all arguments into one word, while \"$@\" keeps each original argument as its own separate word. Because it preserves each argument intact, \"$@\" is the right choice in almost every case.",
       "examples": [
        {
         "cmd": "print_params \"$@\"",
         "out": "$1 = word\n$2 = words with spaces\n$3 =\n$4 =",
         "note": "Called from pass_params \"word\" \"words with spaces\": two arguments stay two.",
         "sim": false
        },
        {
         "cmd": "print_params \"$*\"",
         "out": "$1 = word words with spaces\n$2 =\n$3 =\n$4 =",
         "note": "Everything is joined into a single argument.",
         "sim": false
        },
        {
         "cmd": "print_params $*",
         "out": "$1 = word\n$2 = words\n$3 = with\n$4 = spaces",
         "note": "Unquoted, the arguments are split into four words; $@ unquoted gives the same result.",
         "sim": false
        }
       ],
       "chapters": [
        32
       ]
      }
     ],
     "terms": [
      {
       "t": "$*",
       "d": "All positional parameters from $1 on; unquoted, they are word-split again.",
       "p": 406
      },
      {
       "t": "\"$*\"",
       "d": "One double-quoted string holding every parameter, joined by the first character of IFS (a space by default).",
       "p": 406
      },
      {
       "t": "$@",
       "d": "All positional parameters from $1 on; unquoted, behaves like $*.",
       "p": 406
      },
      {
       "t": "\"$@\"",
       "d": "Each positional parameter becomes its own quoted word, keeping embedded spaces intact.",
       "p": 406
      },
      {
       "t": "wrapper",
       "d": "A script or function that adds options and hands its argument list on to another program.",
       "p": 406
      }
     ],
     "quiz": [
      {
       "id": "ch32.enmasse.q1",
       "type": "mc",
       "cmd": "all-params",
       "q": "Which form hands every argument on intact, including ones that contain spaces?",
       "choices": [
        "\"$@\"",
        "\"$*\"",
        "$*",
        "$@"
       ],
       "answer": 0,
       "explain": "\"$@\" expands each parameter as a separate quoted word."
      },
      {
       "id": "ch32.enmasse.q2",
       "type": "output",
       "cmd": "all-params",
       "q": "The arguments were \"word\" and \"words with spaces\". Which call produced this?",
       "out": "$1 = word words with spaces\n$2 =",
       "choices": [
        "print_params \"$*\"",
        "print_params \"$@\"",
        "print_params $*",
        "print_params $@"
       ],
       "answer": 0
      },
      {
       "id": "ch32.enmasse.q3",
       "type": "fill",
       "cmd": "all-params",
       "q": "Run the program foo, passing it all of the current arguments with each one preserved.",
       "accept": [
        "foo \"$@\""
       ]
      },
      {
       "id": "ch32.enmasse.q4",
       "type": "order",
       "cmd": "all-params",
       "q": "Build: call print_params with every argument kept separate and intact.",
       "parts": [
        "print_params",
        "\"$@\""
       ]
      }
     ]
    },
    {
     "id": "ch32.app",
     "title": "A More Complete Application",
     "intro": "The sys_info_page script gains command line options: -f to name an output file, -i for interactive mode, and -h for help. A while loop, a case statement, and shift work together to read them.",
     "commands": [],
     "terms": [
      {
       "t": "while [[ -n \"$1\" ]]",
       "d": "Loop test that continues as long as the first positional parameter is not empty.",
       "p": 408
      },
      {
       "t": "-f | --file)",
       "d": "Clause that calls shift an extra time so $1 becomes the filename given after -f.",
       "p": 408
      },
      {
       "t": "*) usage >&2; exit 1",
       "d": "Catches unknown options: print usage to standard error and exit with an error status.",
       "p": 408
      },
      {
       "t": "touch then [[ -f ]]",
       "d": "Checks an output file is usable: touch fails on a bad path, and -f confirms a regular file.",
       "p": 410
      }
     ],
     "quiz": [
      {
       "id": "ch32.app.q1",
       "type": "mc",
       "cmd": "shift",
       "q": "Why does the -f clause call shift before reading $1?",
       "choices": [
        "To move $1 onto the filename that follows -f",
        "To skip the help message",
        "To end the loop early",
        "To reset $# to zero"
       ],
       "answer": 0,
       "explain": "After the extra shift, $1 holds the filename argument."
      },
      {
       "id": "ch32.app.q2",
       "type": "order",
       "cmd": "case",
       "q": "Build the case pattern that accepts either -h or --help.",
       "parts": [
        "-h",
        "|",
        "--help)"
       ]
      },
      {
       "id": "ch32.app.q3",
       "type": "fill",
       "cmd": "case",
       "q": "Write the loop header that runs while $1 is not empty, quoting $1.",
       "accept": [
        "while [[ -n \"$1\" ]]; do"
       ]
      }
     ],
     "refs": [
      "case"
     ]
    }
   ]
  },
  {
   "id": "ch33",
   "n": 33,
   "part": 4,
   "title": "Flow Control: Looping with for",
   "summary": "Loop over word lists or numeric sequences with the two forms of for",
   "lessons": [
    {
     "id": "ch33.for",
     "title": "for: Traditional Shell Form",
     "intro": "Unlike while and until, the for loop walks through a sequence of items, handing each one to a variable in turn. The list can come from plain words, brace expansion, wildcards, or command substitution.",
     "commands": [
      {
       "id": "for",
       "name": "for",
       "kind": "keyword",
       "summary": "Run commands once for each word in a list",
       "syntax": "for variable [in words]; do commands; done",
       "explain": "On each pass, for assigns the next word from the list to variable and runs the commands between do and done. The list can be typed out or produced by brace expansion, pathname expansion, or command substitution. If the in words part is left off, for loops over the positional parameters instead.",
       "examples": [
        {
         "cmd": "for i in A B C D; do echo $i; done",
         "out": "A\nB\nC\nD",
         "note": "Four words in the list, so the loop runs four times.",
         "sim": false
        },
        {
         "cmd": "for i in {A..D}; do echo $i; done",
         "out": "A\nB\nC\nD",
         "note": "Brace expansion builds the same word list.",
         "sim": false
        },
        {
         "cmd": "for i in distros*.txt; do echo \"$i\"; done",
         "out": "distros-by-date.txt\ndistros-dates.txt\ndistros-key-names.txt\ndistros.txt",
         "note": "Pathname expansion supplies matching file names (output trimmed).",
         "sim": false
        },
        {
         "cmd": "for i in $(strings \"$1\"); do echo \"$i\"; done",
         "out": "",
         "note": "Command substitution is left unquoted on purpose so word splitting yields many words.",
         "sim": false
        }
       ],
       "chapters": [
        33
       ]
      }
     ],
     "terms": [
      {
       "t": "done",
       "d": "Keyword that closes the body of a for loop, as it does for while and until.",
       "p": 414
      },
      {
       "t": "brace expansion list",
       "d": "for i in {A..D} produces the words A B C D for the loop.",
       "p": 414
      },
      {
       "t": "failed wildcard",
       "d": "If a glob matches nothing, the pattern itself is passed in; guard with [[ -e \"$i\" ]] inside the loop.",
       "p": 414
      },
      {
       "t": "unquoted $(cmd) in for",
       "d": "Leave command substitution unquoted here so it splits into words; quoted, it would be one big word.",
       "p": 415
      },
      {
       "t": "for i; do",
       "d": "Leaving out in words makes for loop over the positional parameters.",
       "p": 415
      },
      {
       "t": "i, j, k",
       "d": "Traditional loop variable names, a habit inherited from Fortran's integer naming rule.",
       "p": 416
      }
     ],
     "quiz": [
      {
       "id": "ch33.for.q1",
       "type": "mc",
       "cmd": "for",
       "q": "If you leave out the in words part, what does for loop over?",
       "choices": [
        "The positional parameters",
        "Files in the current directory",
        "Lines of standard input",
        "Nothing; it is an error"
       ],
       "answer": 0,
       "explain": "for with no list processes $1, $2, and so on."
      },
      {
       "id": "ch33.for.q2",
       "type": "order",
       "cmd": "for",
       "q": "Build a loop that prints A through D using brace expansion.",
       "parts": [
        "for",
        "i",
        "in",
        "{A..D};",
        "do",
        "echo $i;",
        "done"
       ]
      },
      {
       "id": "ch33.for.q3",
       "type": "fill",
       "cmd": "for",
       "q": "Write a one-line loop that echoes each of the words A B C D using the variable i.",
       "accept": [
        "for i in A B C D; do echo $i; done",
        "for i in A B C D; do echo \"$i\"; done"
       ]
      },
      {
       "id": "ch33.for.q4",
       "type": "output",
       "cmd": "for",
       "q": "Which loop produced this output?",
       "out": "A\nB\nC\nD",
       "choices": [
        "for i in {A..D}; do echo $i; done",
        "for i in {A..C}; do echo $i; done",
        "for i in A-D; do echo $i; done",
        "for i in ABCD; do echo $i; done"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch33.forc",
     "title": "for: C Language Form",
     "intro": "Newer versions of bash add a second for syntax modeled on C. It is built from three arithmetic expressions and is the natural choice when you need a numeric sequence.",
     "commands": [
      {
       "id": "for-c",
       "name": "for (( ))",
       "kind": "syntax",
       "summary": "Loop using setup, test, and step arithmetic expressions",
       "syntax": "for (( expression1; expression2; expression3 )); do commands; done",
       "explain": "expression1 runs once to set up the loop, expression2 is checked before each pass and ends the loop when false, and expression3 runs after every pass. It behaves like (( expression1 )) followed by a while (( expression2 )) loop whose last command is (( expression3 )).",
       "examples": [
        {
         "cmd": "for (( i=0; i<5; i=i+1 )); do echo $i; done",
         "out": "0\n1\n2\n3\n4",
         "note": "The simple_counter script: start at 0, stop before 5, add 1 each time.",
         "sim": false
        },
        {
         "cmd": "simple_counter",
         "out": "0\n1\n2\n3\n4",
         "note": "Running the script version gives the same five lines.",
         "sim": false
        }
       ],
       "chapters": [
        33
       ]
      }
     ],
     "terms": [
      {
       "t": "expression1",
       "d": "Setup step; evaluated once before the loop starts, e.g. i=0.",
       "p": 417
      },
      {
       "t": "expression2",
       "d": "Loop condition; checked before each pass, and the loop ends when it is false.",
       "p": 417
      },
      {
       "t": "expression3",
       "d": "Evaluated at the end of every pass, usually to advance a counter.",
       "p": 417
      }
     ],
     "quiz": [
      {
       "id": "ch33.forc.q1",
       "type": "mc",
       "cmd": "for-c",
       "q": "In for (( e1; e2; e3 )), which expression decides when the loop stops?",
       "choices": [
        "e2",
        "e1",
        "e3",
        "None of them"
       ],
       "answer": 0,
       "explain": "e2 is the test checked before every pass."
      },
      {
       "id": "ch33.forc.q2",
       "type": "order",
       "cmd": "for-c",
       "q": "Build a C-style loop header that counts from 0 up to 4.",
       "parts": [
        "for",
        "((",
        "i=0;",
        "i<5;",
        "i=i+1",
        "));",
        "do"
       ]
      },
      {
       "id": "ch33.forc.q3",
       "type": "fill",
       "cmd": "for-c",
       "q": "Write a C-style for loop that echoes 0 through 4 (use i=i+1 as the step).",
       "accept": [
        "for (( i=0; i<5; i=i+1 )); do echo $i; done",
        "for ((i=0; i<5; i=i+1)); do echo $i; done",
        "for ((i=0;i<5;i=i+1)); do echo $i; done"
       ]
      },
      {
       "id": "ch33.forc.q4",
       "type": "output",
       "cmd": "for-c",
       "q": "Which loop produced this output?",
       "out": "0\n1\n2",
       "choices": [
        "for (( i=0; i<3; i=i+1 )); do echo $i; done",
        "for (( i=0; i<=3; i=i+1 )); do echo $i; done",
        "for (( i=1; i<3; i=i+1 )); do echo $i; done",
        "for (( i=0; i<5; i=i+1 )); do echo $i; done"
       ],
       "answer": 0
      }
     ]
    }
   ]
  },
  {
   "id": "ch34",
   "n": 34,
   "part": 4,
   "title": "Strings and Numbers",
   "summary": "Manipulate strings with parameter expansion and do math with $(( )) and bc",
   "lessons": [
    {
     "id": "ch34.basic",
     "title": "Basic Parameters",
     "intro": "The plainest parameter expansion is just using a variable. Wrapping the name in braces changes nothing about the value but tells the shell exactly where the name ends.",
     "commands": [
      {
       "id": "param-brace",
       "name": "${var}",
       "kind": "syntax",
       "summary": "Expand a variable with its name clearly marked off by braces",
       "syntax": "${parameter}",
       "explain": "${a} gives the same value as $a. The braces are needed when the variable touches other text that could be read as part of its name, and for positional parameters above nine such as ${11}. Putting expansions inside double quotes is good practice so file names with spaces are not split.",
       "examples": [
        {
         "cmd": "a=\"foo\"; echo \"${a}_file\"",
         "note": "Braces end the name at a, so _file is appended to foo.",
         "sim": true
        },
        {
         "cmd": "a=\"foo\"; echo \"$a_file\"",
         "note": "Prints an empty line: the shell looks for a variable named a_file, which does not exist.",
         "sim": true
        }
       ],
       "chapters": [
        34
       ]
      }
     ],
     "terms": [
      {
       "t": "$a vs ${a}",
       "d": "Both expand to the value of a; braces only matter when other text follows the name.",
       "p": 420
      },
      {
       "t": "quote expansions",
       "d": "Wrap parameter expansions in double quotes to stop unwanted word splitting, especially with file names.",
       "p": 420
      }
     ],
     "tasks": [
      {
       "id": "ch34.basic.t1",
       "prompt": "Set the variable a to foo, then print foo_file using brace notation, all on one line.",
       "hint": "a=\"foo\"; echo \"${a}_file\"",
       "solution": "a=\"foo\"; echo \"${a}_file\"",
       "check": [
        {
         "t": "out",
         "re": "foo_file"
        },
        {
         "t": "cmd",
         "re": "\\$\\{a\\}"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch34.basic.q1",
       "type": "mc",
       "cmd": "param-brace",
       "q": "With a=foo, why does echo \"$a_file\" print nothing?",
       "choices": [
        "The shell looks for a variable named a_file",
        "Underscores are not allowed in output",
        "Double quotes block all expansion",
        "echo ignores variables in quotes"
       ],
       "answer": 0,
       "explain": "Without braces the whole word a_file is taken as the variable name."
      },
      {
       "id": "ch34.basic.q2",
       "type": "fill",
       "cmd": "param-brace",
       "q": "With a=foo already set, print foo_file using a double-quoted brace expansion.",
       "accept": [
        "echo \"${a}_file\""
       ]
      },
      {
       "id": "ch34.basic.q3",
       "type": "order",
       "cmd": "param-brace",
       "q": "Build: set a to foo, then print foo_file.",
       "parts": [
        "a=\"foo\";",
        "echo",
        "\"${a}_file\""
       ]
      }
     ]
    },
    {
     "id": "ch34.empty",
     "title": "Expansions to Manage Empty Variables",
     "intro": "Four expansions decide what happens when a variable is unset or empty. They supply defaults, assign them, abort with an error, or substitute a value only when something is set.",
     "commands": [
      {
       "id": "param-default",
       "name": "${var:-word}",
       "kind": "syntax",
       "summary": "Use word when the variable is unset or empty",
       "syntax": "${parameter:-word}",
       "explain": "If parameter is missing or empty, the expansion produces word; otherwise it produces the variable's value. The variable itself is left unchanged. This is handy for giving missing positional parameters a fallback.",
       "examples": [
        {
         "cmd": "foo=; echo ${foo:-\"substitute value if unset\"}",
         "out": "substitute value if unset",
         "note": "foo is empty, so the fallback text is used; foo stays empty.",
         "sim": false
        },
        {
         "cmd": "foo=bar; echo ${foo:-\"substitute value if unset\"}",
         "out": "bar",
         "note": "foo has a value, so that value is used.",
         "sim": false
        }
       ],
       "chapters": [
        34
       ]
      },
      {
       "id": "param-assign",
       "name": "${var:=word}",
       "kind": "syntax",
       "summary": "Use word and also store it when the variable is unset or empty",
       "syntax": "${parameter:=word}",
       "explain": "This works like :- but goes one step further: when parameter is missing or empty, word is also assigned to it. If the variable already has a value, that value is returned and nothing changes. Positional and other special parameters cannot be set this way.",
       "examples": [
        {
         "cmd": "foo=; echo ${foo:=\"default value if unset\"}; echo $foo",
         "out": "default value if unset\ndefault value if unset",
         "note": "The default is printed and now lives in foo.",
         "sim": false
        },
        {
         "cmd": "foo=bar; echo ${foo:=\"default value if unset\"}",
         "out": "bar",
         "note": "foo already had a value, so it is kept.",
         "sim": false
        }
       ],
       "chapters": [
        34
       ]
      },
      {
       "id": "param-error",
       "name": "${var:?word}",
       "kind": "syntax",
       "summary": "Exit with an error message if the variable is unset or empty",
       "syntax": "${parameter:?word}",
       "explain": "When parameter is missing or empty, the script exits with an error and word is written to standard error. When it has a value, the expansion simply yields that value. Use it to stop a script early if a required value is absent.",
       "examples": [
        {
         "cmd": "foo=; echo ${foo:?\"parameter is empty\"}",
         "out": "bash: foo: parameter is empty",
         "note": "Running echo $? right after shows an exit status of 1.",
         "sim": false
        },
        {
         "cmd": "foo=bar; echo ${foo:?\"parameter is empty\"}",
         "out": "bar",
         "note": "foo is set, so its value is printed and $? is 0.",
         "sim": false
        }
       ],
       "chapters": [
        34
       ]
      },
      {
       "id": "param-alt",
       "name": "${var:+word}",
       "kind": "syntax",
       "summary": "Use word only when the variable has a value",
       "syntax": "${parameter:+word}",
       "explain": "This is the reverse of :-. If parameter is missing or empty, the result is nothing at all. If it has a value, word is produced instead of that value, and the variable is not modified.",
       "examples": [
        {
         "cmd": "foo=; echo ${foo:+\"substitute value if set\"}",
         "out": "",
         "note": "foo is empty, so nothing is substituted.",
         "sim": false
        },
        {
         "cmd": "foo=bar; echo ${foo:+\"substitute value if set\"}",
         "out": "substitute value if set",
         "note": "foo is set, so word replaces it in the output.",
         "sim": false
        }
       ],
       "chapters": [
        34
       ]
      }
     ],
     "terms": [
      {
       "t": "${parameter:-word}",
       "d": "Unset or empty: gives word. Set: gives the value. Never changes the variable.",
       "p": 421
      },
      {
       "t": "${parameter:=word}",
       "d": "Unset or empty: gives word and assigns it to parameter. Set: gives the value.",
       "p": 421
      },
      {
       "t": "${parameter:?word}",
       "d": "Unset or empty: script exits with an error and word goes to stderr. Set: gives the value.",
       "p": 421
      },
      {
       "t": "${parameter:+word}",
       "d": "Unset or empty: gives nothing. Set: gives word, leaving the variable as it was.",
       "p": 422
      }
     ],
     "quiz": [
      {
       "id": "ch34.empty.q1",
       "type": "mc",
       "cmd": "param-assign",
       "q": "Which expansion both supplies a default and stores it in the empty variable?",
       "choices": [
        "${foo:=word}",
        "${foo:-word}",
        "${foo:+word}",
        "${foo:?word}"
       ],
       "answer": 0,
       "explain": "The = form assigns word to the variable as well as expanding to it."
      },
      {
       "id": "ch34.empty.q2",
       "type": "output",
       "cmd": "param-error",
       "q": "foo was empty. Which command printed this message to standard error?",
       "out": "bash: foo: parameter is empty",
       "choices": [
        "echo ${foo:?\"parameter is empty\"}",
        "echo ${foo:-\"parameter is empty\"}",
        "echo ${foo:+\"parameter is empty\"}",
        "echo ${foo:=\"parameter is empty\"}"
       ],
       "answer": 0
      },
      {
       "id": "ch34.empty.q3",
       "type": "fill",
       "cmd": "param-default",
       "q": "Print foo's value, or the word default if foo is empty or unset, without changing foo.",
       "accept": [
        "echo ${foo:-default}",
        "echo \"${foo:-default}\""
       ]
      },
      {
       "id": "ch34.empty.q4",
       "type": "order",
       "cmd": "param-alt",
       "q": "Build: set foo to bar, then print a substitute only because foo is set.",
       "parts": [
        "foo=bar;",
        "echo",
        "${foo:+\"substitute value if set\"}"
       ]
      }
     ]
    },
    {
     "id": "ch34.strings",
     "title": "String Length, Slices, and Variable Names",
     "intro": "Parameter expansion can measure a string, cut out part of it, or even list the names of variables that share a prefix.",
     "commands": [
      {
       "id": "param-length",
       "name": "${#var}",
       "kind": "syntax",
       "summary": "Expand to the length of the string in a variable",
       "syntax": "${#parameter}",
       "explain": "${#parameter} becomes the number of characters stored in parameter. If parameter is @ or *, it instead gives the number of positional parameters. Using it avoids running external programs just to count characters.",
       "examples": [
        {
         "cmd": "foo=\"This string is long.\"; echo \"'$foo' is ${#foo} characters long.\"",
         "out": "'This string is long.' is 20 characters long.",
         "note": "Spaces and the period count as characters.",
         "sim": false
        },
        {
         "cmd": "len=\"${#j}\"",
         "out": "",
         "note": "longest-word3 uses this instead of $(echo -n $j | wc -c) and runs far faster.",
         "sim": false
        }
       ],
       "chapters": [
        34
       ]
      },
      {
       "id": "param-substr",
       "name": "${var:offset:length}",
       "kind": "syntax",
       "summary": "Extract part of a string starting at an offset",
       "syntax": "${parameter:offset}  ${parameter:offset:length}",
       "explain": "The result starts offset characters into the string and runs to the end, or for length characters if length is given. A negative offset counts back from the end and must be preceded by a space so it is not mistaken for :-. If parameter is @, the result is length positional parameters beginning at offset.",
       "examples": [
        {
         "cmd": "foo=\"This string is long.\"; echo ${foo:5}",
         "out": "string is long.",
         "note": "Skips the first five characters.",
         "sim": false
        },
        {
         "cmd": "echo ${foo:5:6}",
         "out": "string",
         "note": "Six characters starting at offset 5.",
         "sim": false
        },
        {
         "cmd": "echo ${foo: -5}",
         "out": "long.",
         "note": "The space before -5 makes it a negative offset.",
         "sim": false
        },
        {
         "cmd": "echo ${foo: -5:2}",
         "out": "lo",
         "note": "Two characters starting five from the end.",
         "sim": false
        }
       ],
       "chapters": [
        34
       ]
      },
      {
       "id": "param-names",
       "name": "${!prefix*}",
       "kind": "syntax",
       "summary": "List the names of variables that begin with a prefix",
       "syntax": "${!prefix*}  ${!prefix@}",
       "explain": "This expansion returns variable names, not values: every existing variable whose name starts with prefix. The * and @ forms behave the same according to the bash documentation. It is only needed in fairly unusual situations.",
       "examples": [
        {
         "cmd": "echo ${!BASH*}",
         "out": "BASH BASH_ARGC BASH_ARGV BASH_COMMAND BASH_COMPLETION BASH_COMPLETION_DIR\nBASH_LINENO BASH_SOURCE BASH_SUBSHELL BASH_VERSINFO BASH_VERSION",
         "note": "All variables whose names start with BASH.",
         "sim": false
        }
       ],
       "chapters": [
        34
       ]
      }
     ],
     "terms": [
      {
       "t": "${#parameter}",
       "d": "Length of the string in parameter; with @ or * it is the count of positional parameters.",
       "p": 422
      },
      {
       "t": "${parameter:offset}",
       "d": "The string from offset characters in, through to the end.",
       "p": 423
      },
      {
       "t": "${parameter:offset:length}",
       "d": "length characters starting at offset; length must not be negative.",
       "p": 423
      },
      {
       "t": "${foo: -5}",
       "d": "Negative offset counts from the end; the space keeps it from looking like ${foo:-word}.",
       "p": 423
      },
      {
       "t": "${!prefix*} / ${!prefix@}",
       "d": "Names of all existing variables starting with prefix; both forms act the same.",
       "p": 422
      }
     ],
     "quiz": [
      {
       "id": "ch34.strings.q1",
       "type": "mc",
       "cmd": "param-substr",
       "q": "Why must ${foo: -5} have a space before the minus sign?",
       "choices": [
        "Without it the shell reads it as the :- default-value expansion",
        "Spaces are required before every number",
        "It makes the offset count from the start",
        "It is optional style only"
       ],
       "answer": 0,
       "explain": "${foo:-5} means use 5 if foo is empty, not a negative offset."
      },
      {
       "id": "ch34.strings.q2",
       "type": "output",
       "cmd": "param-substr",
       "q": "foo=\"This string is long.\" Which command printed this?",
       "out": "string",
       "choices": [
        "echo ${foo:5:6}",
        "echo ${foo:5}",
        "echo ${foo: -5}",
        "echo ${foo:6:5}"
       ],
       "answer": 0
      },
      {
       "id": "ch34.strings.q3",
       "type": "fill",
       "cmd": "param-length",
       "q": "Print the number of characters stored in foo.",
       "accept": [
        "echo ${#foo}",
        "echo \"${#foo}\""
       ]
      },
      {
       "id": "ch34.strings.q4",
       "type": "order",
       "cmd": "param-substr",
       "q": "Build: print the last five characters of foo.",
       "parts": [
        "echo",
        "${foo:",
        "-5}"
       ]
      }
     ]
    },
    {
     "id": "ch34.patterns",
     "title": "Removing and Replacing Patterns",
     "intro": "Several expansions trim text matching a wildcard pattern from the front or back of a string, or search and replace inside it. They are especially useful on pathnames and can replace calls to sed or cut.",
     "commands": [
      {
       "id": "param-del-front",
       "name": "${var#pattern}",
       "kind": "syntax",
       "summary": "Remove the shortest match of pattern from the start of the string",
       "syntax": "${parameter#pattern}",
       "explain": "pattern is a wildcard like those in pathname expansion. The single # form deletes the shortest leading piece of the string that matches it and returns the rest.",
       "examples": [
        {
         "cmd": "foo=file.txt.zip; echo ${foo#*.}",
         "out": "txt.zip",
         "note": "Only up to the first dot is removed.",
         "sim": false
        },
        {
         "cmd": "j=\"${i#0}\"",
         "out": "",
         "note": "Used in Chapter 35 to strip a leading zero from an hour like 09.",
         "sim": false
        }
       ],
       "chapters": [
        34
       ]
      },
      {
       "id": "param-del-front-long",
       "name": "${var##pattern}",
       "kind": "syntax",
       "summary": "Remove the longest match of pattern from the start of the string",
       "syntax": "${parameter##pattern}",
       "explain": "The double ## form deletes the longest leading match instead of the shortest. With */ as the pattern it strips every directory from a path, acting like basename.",
       "examples": [
        {
         "cmd": "foo=file.txt.zip; echo ${foo##*.}",
         "out": "zip",
         "note": "Everything up to the last dot is removed.",
         "sim": false
        },
        {
         "cmd": "PROGNAME=\"${0##*/}\"",
         "out": "",
         "note": "loan-calc gets its own base name without running basename.",
         "sim": false
        }
       ],
       "chapters": [
        34
       ]
      },
      {
       "id": "param-del-end",
       "name": "${var%pattern}",
       "kind": "syntax",
       "summary": "Remove the shortest match of pattern from the end of the string",
       "syntax": "${parameter%pattern}",
       "explain": "The % form mirrors # but works from the end of the string. It removes the shortest trailing piece that matches pattern.",
       "examples": [
        {
         "cmd": "foo=file.txt.zip; echo ${foo%.*}",
         "out": "file.txt",
         "note": "Only the last extension is removed.",
         "sim": false
        }
       ],
       "chapters": [
        34
       ]
      },
      {
       "id": "param-del-end-long",
       "name": "${var%%pattern}",
       "kind": "syntax",
       "summary": "Remove the longest match of pattern from the end of the string",
       "syntax": "${parameter%%pattern}",
       "explain": "The %% form removes the longest trailing match, so with .* it cuts from the first dot onward.",
       "examples": [
        {
         "cmd": "foo=file.txt.zip; echo ${foo%%.*}",
         "out": "file",
         "note": "Everything from the first dot to the end is removed.",
         "sim": false
        }
       ],
       "chapters": [
        34
       ]
      },
      {
       "id": "param-replace",
       "name": "${var/pattern/string}",
       "kind": "syntax",
       "summary": "Search for pattern in a variable and replace it with string",
       "syntax": "${parameter/pattern/string}  ${parameter//pattern/string}  ${parameter/#pattern/string}  ${parameter/%pattern/string}",
       "explain": "The single-slash form replaces only the first match, while // replaces every match. /# only matches at the start of the string and /% only at the end. Leaving off /string deletes the matched text.",
       "examples": [
        {
         "cmd": "foo=JPG.JPG; echo ${foo/JPG/jpg}",
         "out": "jpg.JPG",
         "note": "Only the first JPG changes.",
         "sim": false
        },
        {
         "cmd": "echo ${foo//JPG/jpg}",
         "out": "jpg.jpg",
         "note": "Every JPG changes.",
         "sim": false
        },
        {
         "cmd": "echo ${foo/#JPG/jpg}",
         "out": "jpg.JPG",
         "note": "Matches only at the beginning.",
         "sim": false
        },
        {
         "cmd": "echo ${foo/%JPG/jpg}",
         "out": "JPG.jpg",
         "note": "Matches only at the end.",
         "sim": false
        }
       ],
       "chapters": [
        34
       ]
      }
     ],
     "terms": [
      {
       "t": "${parameter#pattern}",
       "d": "Strips the shortest leading match of pattern.",
       "p": 423
      },
      {
       "t": "${parameter##pattern}",
       "d": "Strips the longest leading match of pattern.",
       "p": 423
      },
      {
       "t": "${parameter%pattern}",
       "d": "Strips the shortest trailing match of pattern.",
       "p": 424
      },
      {
       "t": "${parameter%%pattern}",
       "d": "Strips the longest trailing match of pattern.",
       "p": 424
      },
      {
       "t": "${parameter/pattern/string}",
       "d": "Replaces the first match of pattern with string.",
       "p": 424
      },
      {
       "t": "${parameter//pattern/string}",
       "d": "Replaces every match of pattern with string.",
       "p": 424
      },
      {
       "t": "${parameter/#pattern/string}",
       "d": "Replaces pattern only if it matches at the start of the string.",
       "p": 424
      },
      {
       "t": "${parameter/%pattern/string}",
       "d": "Replaces pattern only if it matches at the end of the string.",
       "p": 424
      }
     ],
     "quiz": [
      {
       "id": "ch34.patterns.q1",
       "type": "output",
       "cmd": "param-del-front-long",
       "q": "foo=file.txt.zip. Which command printed this?",
       "out": "zip",
       "choices": [
        "echo ${foo##*.}",
        "echo ${foo#*.}",
        "echo ${foo%.*}",
        "echo ${foo%%.*}"
       ],
       "answer": 0
      },
      {
       "id": "ch34.patterns.q2",
       "type": "mc",
       "cmd": "param-del-end-long",
       "q": "With foo=file.txt.zip, what does echo ${foo%%.*} print?",
       "choices": [
        "file",
        "file.txt",
        "zip",
        "txt.zip"
       ],
       "answer": 0,
       "explain": "%% removes the longest trailing match, from the first dot on."
      },
      {
       "id": "ch34.patterns.q3",
       "type": "fill",
       "cmd": "param-replace",
       "q": "Print foo with every JPG replaced by jpg.",
       "accept": [
        "echo ${foo//JPG/jpg}",
        "echo \"${foo//JPG/jpg}\""
       ]
      },
      {
       "id": "ch34.patterns.q4",
       "type": "order",
       "cmd": "param-del-front-long",
       "q": "Build: set foo to file.txt.zip, then print only its last extension.",
       "parts": [
        "foo=file.txt.zip;",
        "echo",
        "${foo##*.}"
       ]
      }
     ]
    },
    {
     "id": "ch34.case",
     "title": "Case Conversion",
     "intro": "Normalizing input to one case makes comparisons and lookups reliable. bash offers two declare options and four parameter expansions for converting between uppercase and lowercase.",
     "commands": [
      {
       "id": "param-case",
       "name": "${var^^}",
       "kind": "syntax",
       "summary": "Expand a value converted to uppercase or lowercase",
       "syntax": "${parameter,,pattern}  ${parameter,pattern}  ${parameter^^pattern}  ${parameter^pattern}",
       "explain": "Doubled symbols convert the whole value and a single symbol converts only the first character. Commas lower the case and carets raise it. The optional pattern, such as [A-F], restricts which characters get converted.",
       "examples": [
        {
         "cmd": "ul-param aBc",
         "out": "abc\naBc\nABC\nABc",
         "note": "The script prints ${1,,}, ${1,}, ${1^^} and ${1^} in turn.",
         "sim": false
        },
        {
         "cmd": "echo \"${1^^}\"",
         "out": "ABC",
         "note": "With $1 set to aBc, every letter is uppercased.",
         "sim": false
        }
       ],
       "chapters": [
        34
       ]
      }
     ],
     "terms": [
      {
       "t": "${parameter,,pattern}",
       "d": "Whole value in lowercase; optional pattern limits which characters change.",
       "p": 426
      },
      {
       "t": "${parameter,pattern}",
       "d": "Lowercases only the first character.",
       "p": 426
      },
      {
       "t": "${parameter^^pattern}",
       "d": "Whole value in uppercase.",
       "p": 426
      },
      {
       "t": "${parameter^pattern}",
       "d": "Uppercases only the first character (capitalizes).",
       "p": 426
      },
      {
       "t": "normalize input",
       "d": "Convert user input to one case before comparing or looking it up.",
       "p": 425
      }
     ],
     "quiz": [
      {
       "id": "ch34.case.q1",
       "type": "mc",
       "cmd": "declare",
       "q": "Which declare option makes a variable always hold uppercase text?",
       "choices": [
        "-u",
        "-l",
        "-r",
        "-i"
       ],
       "answer": 0,
       "explain": "-u forces uppercase, -l forces lowercase."
      },
      {
       "id": "ch34.case.q2",
       "type": "output",
       "cmd": "param-case",
       "q": "$1 is aBc. Which line printed this?",
       "out": "ABc",
       "choices": [
        "echo \"${1^}\"",
        "echo \"${1^^}\"",
        "echo \"${1,}\"",
        "echo \"${1,,}\""
       ],
       "answer": 0
      },
      {
       "id": "ch34.case.q3",
       "type": "fill",
       "cmd": "param-case",
       "q": "Print the first argument converted entirely to lowercase, in double quotes.",
       "accept": [
        "echo \"${1,,}\""
       ]
      },
      {
       "id": "ch34.case.q4",
       "type": "order",
       "cmd": "declare",
       "q": "Build: make lower a variable that always stores lowercase.",
       "parts": [
        "declare",
        "-l",
        "lower"
       ]
      }
     ],
     "refs": [
      "declare"
     ]
    },
    {
     "id": "ch34.arith",
     "title": "Arithmetic Expansion, Number Bases, and Operators",
     "intro": "Arithmetic expansion evaluates integer expressions and substitutes the result. It accepts constants in several bases and supports the usual math operators, with whole-number division.",
     "commands": [
      {
       "id": "arith-ops",
       "name": "$((expression))",
       "kind": "syntax",
       "summary": "Evaluate an integer expression and substitute the result",
       "syntax": "$((expression))",
       "explain": "The shell evaluates the expression with integer math and replaces the whole construct with the answer. It is closely related to the (( )) compound command, which evaluates an expression as a true or false test. Because only integers are used, division drops any fraction, so the % operator is how you get the remainder.",
       "examples": [
        {
         "cmd": "echo $(( 5 / 2 ))",
         "note": "Integer division: the fraction is discarded.",
         "sim": true
        },
        {
         "cmd": "echo $(( 5 % 2 ))",
         "note": "Modulo gives the remainder of the division.",
         "sim": true
        },
        {
         "cmd": "echo $((0xff))",
         "out": "255",
         "note": "Hexadecimal ff, the largest two-digit hex number.",
         "sim": false
        },
        {
         "cmd": "echo $((2#11111111))",
         "out": "255",
         "note": "base#number notation: eight binary ones.",
         "sim": false
        }
       ],
       "chapters": [
        34
       ]
      }
     ],
     "terms": [
      {
       "t": "number",
       "d": "A number with no prefix is read as decimal (base 10).",
       "p": 427
      },
      {
       "t": "0number",
       "d": "A leading zero makes the number octal inside arithmetic expressions.",
       "p": 427
      },
      {
       "t": "0xnumber",
       "d": "Hexadecimal notation.",
       "p": 427
      },
      {
       "t": "base#number",
       "d": "Writes number in the given base, e.g. 2#1010 for binary.",
       "p": 427
      },
      {
       "t": "unary + and -",
       "d": "Mark a number as positive or negative, as in -5.",
       "p": 428
      },
      {
       "t": "+  -  *",
       "d": "Addition, subtraction, and multiplication.",
       "p": 428
      },
      {
       "t": "/",
       "d": "Integer division; the result is always a whole number.",
       "p": 428
      },
      {
       "t": "**",
       "d": "Exponentiation (raise to a power).",
       "p": 428
      },
      {
       "t": "%",
       "d": "Modulo: the remainder after division. Useful for acting every nth pass of a loop.",
       "p": 428
      }
     ],
     "tasks": [
      {
       "id": "ch34.arith.t1",
       "prompt": "Use arithmetic expansion with echo to print the remainder of 5 divided by 2.",
       "hint": "The modulo operator is %.",
       "solution": "echo $(( 5 % 2 ))",
       "check": [
        {
         "t": "cmd",
         "re": "%"
        },
        {
         "t": "out",
         "re": "^\\s*1\\s*$"
        }
       ]
      },
      {
       "id": "ch34.arith.t2",
       "prompt": "Use arithmetic expansion with echo to print the integer result of 5 divided by 2.",
       "hint": "echo $(( a / b ))",
       "solution": "echo $(( 5 / 2 ))",
       "check": [
        {
         "t": "cmd",
         "re": "/"
        },
        {
         "t": "out",
         "re": "^\\s*2\\s*$"
        }
       ]
      }
     ],
     "quiz": [
      {
       "id": "ch34.arith.q1",
       "type": "mc",
       "cmd": "arith-ops",
       "q": "What does echo $(( 5 / 2 )) print?",
       "choices": [
        "2",
        "2.5",
        "3",
        "1"
       ],
       "answer": 0,
       "explain": "Shell arithmetic is integer only, so the fraction is dropped."
      },
      {
       "id": "ch34.arith.q2",
       "type": "output",
       "cmd": "arith-ops",
       "q": "Which command printed this?",
       "out": "255",
       "choices": [
        "echo $((0xff))",
        "echo $((0xf))",
        "echo $((2#1111))",
        "echo $((ff))"
       ],
       "answer": 0
      },
      {
       "id": "ch34.arith.q3",
       "type": "fill",
       "cmd": "arith-ops",
       "q": "Print the remainder of 5 divided by 2 using arithmetic expansion.",
       "accept": [
        "echo $(( 5 % 2 ))",
        "echo $((5 % 2))",
        "echo $((5%2))"
       ]
      },
      {
       "id": "ch34.arith.q4",
       "type": "order",
       "cmd": "arith-ops",
       "q": "Build: print the value of the binary number 11111111.",
       "parts": [
        "echo",
        "$((",
        "2#11111111",
        "))"
       ]
      }
     ]
    },
    {
     "id": "ch34.assign",
     "title": "Assignment, Increment, and Decrement",
     "intro": "Arithmetic expressions can assign values too. Besides =, there are shorthand operators that update a variable in place, including the C-style ++ and --.",
     "commands": [
      {
       "id": "incr",
       "name": "++",
       "kind": "syntax",
       "summary": "Increase (++) or decrease (--) a variable by one in arithmetic",
       "syntax": "++parameter  parameter++  --parameter  parameter--",
       "explain": "Placed before the name, the variable changes first and the new value is returned. Placed after, the old value is returned and the change happens afterward. The prefix form is usually what you want, and both are common in loops.",
       "examples": [
        {
         "cmd": "foo=1; echo $((foo++)); echo $foo",
         "out": "1\n2",
         "note": "Post-increment returns 1, but foo is 2 afterward.",
         "sim": false
        },
        {
         "cmd": "foo=1; echo $((++foo)); echo $foo",
         "out": "2\n2",
         "note": "Pre-increment changes foo before returning it.",
         "sim": false
        },
        {
         "cmd": "if (( foo = 5 )); then echo \"It is true.\"; fi",
         "out": "It is true.",
         "note": "A single = assigns 5 to foo, and the non-zero result counts as true.",
         "sim": false
        }
       ],
       "chapters": [
        34
       ]
      }
     ],
     "terms": [
      {
       "t": "parameter = value",
       "d": "Plain assignment inside an arithmetic expression.",
       "p": 430
      },
      {
       "t": "= vs ==",
       "d": "One = assigns a value; == tests whether two values are equal.",
       "p": 429
      },
      {
       "t": "parameter += value",
       "d": "Adds value to parameter, same as parameter = parameter + value.",
       "p": 430
      },
      {
       "t": "parameter -= value",
       "d": "Subtracts value from parameter.",
       "p": 430
      },
      {
       "t": "parameter *= value",
       "d": "Multiplies parameter by value.",
       "p": 430
      },
      {
       "t": "parameter /= value",
       "d": "Integer-divides parameter by value.",
       "p": 430
      },
      {
       "t": "parameter %= value",
       "d": "Sets parameter to the remainder of parameter divided by value.",
       "p": 430
      },
      {
       "t": "parameter++",
       "d": "Post-increment: returns the current value, then adds one.",
       "p": 430
      },
      {
       "t": "parameter--",
       "d": "Post-decrement: returns the current value, then subtracts one.",
       "p": 430
      },
      {
       "t": "++parameter",
       "d": "Pre-increment: adds one, then returns the new value.",
       "p": 430
      },
      {
       "t": "--parameter",
       "d": "Pre-decrement: subtracts one, then returns the new value.",
       "p": 430
      }
     ],
     "quiz": [
      {
       "id": "ch34.assign.q1",
       "type": "mc",
       "cmd": "incr",
       "q": "After foo=1, what does echo $((foo++)) print?",
       "choices": [
        "1",
        "2",
        "0",
        "foo"
       ],
       "answer": 0,
       "explain": "Post-increment hands back the old value before adding one."
      },
      {
       "id": "ch34.assign.q2",
       "type": "output",
       "cmd": "incr",
       "q": "foo started at 1. Which commands printed this?",
       "out": "2\n2",
       "choices": [
        "echo $((++foo)); echo $foo",
        "echo $((foo++)); echo $foo",
        "echo $((foo--)); echo $foo",
        "echo $foo; echo $((foo++))"
       ],
       "answer": 0
      },
      {
       "id": "ch34.assign.q3",
       "type": "fill",
       "cmd": "incr",
       "q": "Add 5 to the variable foo with an assignment operator inside (( )).",
       "accept": [
        "((foo += 5))",
        "(( foo += 5 ))",
        "((foo+=5))"
       ]
      },
      {
       "id": "ch34.assign.q4",
       "type": "order",
       "cmd": "incr",
       "q": "Build a loop header that counts i from 0 to 20 using pre-increment.",
       "parts": [
        "for",
        "((i = 0;",
        "i <= 20;",
        "++i",
        "));",
        "do"
       ]
      }
     ]
    },
    {
     "id": "ch34.logic",
     "title": "Bit Operations and Logic",
     "intro": "Some operators work on the individual bits of a number, and others compare values or combine conditions. In arithmetic, zero counts as false and anything else as true.",
     "commands": [
      {
       "id": "ternary",
       "name": "?:",
       "kind": "syntax",
       "summary": "Choose between two expressions based on a test, like a tiny if",
       "syntax": "expr1?expr2:expr3",
       "explain": "If expr1 is non-zero, expr2 is evaluated; otherwise expr3 is. It works only with arithmetic expressions, not strings. An assignment such as a+=1 inside it must be wrapped in parentheses, or bash reports an error.",
       "examples": [
        {
         "cmd": "a=0; ((a<1?++a:--a)); echo $a",
         "out": "1",
         "note": "Running the same ternary again sets a back to 0, so it acts as a toggle.",
         "sim": false
        },
        {
         "cmd": "((a<1?a+=1:a-=1))",
         "out": "bash: ((: a<1?a+=1:a-=1: attempted assignment to non-variable (error token is \"-=1\")",
         "note": "Bare assignments inside the ternary fail.",
         "sim": false
        },
        {
         "cmd": "((a<1?(a+=1):(a-=1)))",
         "out": "",
         "note": "Parentheses around each assignment fix the error.",
         "sim": false
        },
        {
         "cmd": "for ((i=0;i<8;++i)); do echo $((1<<i)); done",
         "out": "1\n2\n4\n8\n16\n32\n64\n128",
         "note": "Left shift builds powers of 2.",
         "sim": false
        }
       ],
       "chapters": [
        34
       ]
      }
     ],
     "terms": [
      {
       "t": "~",
       "d": "Bitwise negation: flips every bit of a number.",
       "p": 431
      },
      {
       "t": "<<",
       "d": "Shifts all bits of a number to the left.",
       "p": 431
      },
      {
       "t": ">>",
       "d": "Shifts all bits of a number to the right.",
       "p": 431
      },
      {
       "t": "&",
       "d": "Bitwise AND of the bits in two numbers.",
       "p": 431
      },
      {
       "t": "|",
       "d": "Bitwise OR of the bits in two numbers.",
       "p": 431
      },
      {
       "t": "^",
       "d": "Bitwise exclusive OR (XOR) of the bits in two numbers.",
       "p": 431
      },
      {
       "t": "<<= and friends",
       "d": "Each bit operator except ~ has a matching assignment form.",
       "p": 431
      },
      {
       "t": "<=  >=  <  >",
       "d": "Less or equal, greater or equal, less than, greater than.",
       "p": 432
      },
      {
       "t": "==  !=",
       "d": "Equal to and not equal to.",
       "p": 432
      },
      {
       "t": "&&  ||",
       "d": "Logical AND and logical OR.",
       "p": 432
      },
      {
       "t": "expr1?expr2:expr3",
       "d": "Ternary: if expr1 is non-zero, do expr2, else expr3.",
       "p": 432
      },
      {
       "t": "arithmetic truth",
       "d": "Zero is false and non-zero is true; (( )) turns this into a normal exit status.",
       "p": 432
      }
     ],
     "quiz": [
      {
       "id": "ch34.logic.q1",
       "type": "mc",
       "cmd": "ternary",
       "q": "In (( )), an expression that evaluates to 0 is treated as what?",
       "choices": [
        "False",
        "True",
        "An error",
        "Undefined"
       ],
       "answer": 0,
       "explain": "Arithmetic logic treats zero as false and any other value as true."
      },
      {
       "id": "ch34.logic.q2",
       "type": "output",
       "cmd": "ternary",
       "q": "Which loop printed this?",
       "out": "1\n2\n4\n8",
       "choices": [
        "for ((i=0;i<4;++i)); do echo $((1<<i)); done",
        "for ((i=0;i<4;++i)); do echo $((i<<1)); done",
        "for ((i=1;i<=4;++i)); do echo $((i*2)); done",
        "for ((i=0;i<4;++i)); do echo $((1>>i)); done"
       ],
       "answer": 0
      },
      {
       "id": "ch34.logic.q3",
       "type": "fill",
       "cmd": "ternary",
       "q": "Write a ternary in (( )) that toggles a between 0 and 1 using ++a and --a.",
       "accept": [
        "((a<1?++a:--a))"
       ]
      },
      {
       "id": "ch34.logic.q4",
       "type": "order",
       "cmd": "ternary",
       "q": "Build a ternary that adds or subtracts 1 from a without an assignment error.",
       "parts": [
        "((a<1",
        "?",
        "(a+=1)",
        ":",
        "(a-=1)))"
       ]
      }
     ]
    },
    {
     "id": "ch34.bc",
     "title": "bc: An Arbitrary Precision Calculator",
     "intro": "The shell cannot do floating-point or higher math. The bc program fills that gap with its own small C-like language, read from a file or from standard input.",
     "commands": [
      {
       "id": "bc",
       "name": "bc",
       "kind": "cmd",
       "summary": "Calculator language for arbitrary-precision math",
       "syntax": "bc [options] [file]",
       "explain": "bc runs programs written in a C-like language that supports variables, loops, and functions. It can read a script file, take input interactively, or read from standard input, so pipes, here documents, and here strings all work. The special scale variable sets how many decimal places results carry.",
       "flags": [
        {
         "f": "-q",
         "d": "Quiet mode: skip the copyright banner bc normally prints at startup.",
         "p": 434,
         "ch": 34
        }
       ],
       "examples": [
        {
         "cmd": "bc foo.bc",
         "out": "bc 1.06.94\nCopyright 1991-1994, 1997, 1998, 2000, 2004, 2006 Free Software Foundation, Inc.\nThis is free software with ABSOLUTELY NO WARRANTY.\nFor details type `warranty'.\n4",
         "note": "foo.bc holds 2 + 2; the answer appears after the banner.",
         "sim": false
        },
        {
         "cmd": "bc -q",
         "out": "2 + 2\n4\nquit",
         "note": "Interactive session: type expressions, then quit to leave.",
         "sim": false
        },
        {
         "cmd": "bc < foo.bc",
         "out": "4",
         "note": "Script fed through standard input.",
         "sim": false
        },
        {
         "cmd": "bc <<< \"2+2\"",
         "out": "4",
         "note": "A here string passes the expression directly.",
         "sim": false
        },
        {
         "cmd": "loan-calc 135000 0.0775 180",
         "out": "1270.7222490000",
         "note": "The script sends a here document to bc with scale = 10.",
         "sim": false
        }
       ],
       "chapters": [
        34
       ]
      }
     ],
     "terms": [
      {
       "t": "/* ... */",
       "d": "Comment syntax in bc, borrowed from C; may span several lines.",
       "p": 434
      },
      {
       "t": "quit",
       "d": "bc command that ends an interactive session.",
       "p": 435
      },
      {
       "t": "scale",
       "d": "Special bc variable setting how many digits follow the decimal point.",
       "p": 436
      },
      {
       "t": "integer-only shell math",
       "d": "The shell cannot do floating point itself, so an external tool like bc is needed.",
       "p": 434
      }
     ],
     "quiz": [
      {
       "id": "ch34.bc.q1",
       "type": "mc",
       "cmd": "bc",
       "q": "What does the bc -q option do?",
       "choices": [
        "Suppresses the startup copyright banner",
        "Quits after one calculation",
        "Uses integer-only math",
        "Reads from a file quietly without output"
       ],
       "answer": 0,
       "explain": "-q stands for quiet and hides the banner."
      },
      {
       "id": "ch34.bc.q2",
       "type": "fill",
       "cmd": "bc",
       "q": "Calculate 2+2 with bc using a here string.",
       "accept": [
        "bc <<< \"2+2\"",
        "bc <<< 2+2"
       ]
      },
      {
       "id": "ch34.bc.q3",
       "type": "order",
       "cmd": "bc",
       "q": "Build: feed the script foo.bc to bc through standard input.",
       "parts": [
        "bc",
        "<",
        "foo.bc"
       ]
      },
      {
       "id": "ch34.bc.q4",
       "type": "output",
       "cmd": "bc",
       "q": "foo.bc contains 2 + 2. Which command printed only this, with no banner?",
       "out": "4",
       "choices": [
        "bc < foo.bc",
        "bc foo.bc",
        "bc",
        "cat foo.bc"
       ],
       "answer": 0
      }
     ]
    }
   ]
  },
  {
   "id": "ch35",
   "n": 35,
   "part": 4,
   "title": "Arrays",
   "summary": "Store many values in one variable with indexed and associative arrays",
   "lessons": [
    {
     "id": "ch35.create",
     "title": "Creating and Assigning Arrays",
     "intro": "Ordinary variables hold one value; an array holds many. bash arrays are one-dimensional, like a spreadsheet with a single column, and each cell is reached by a numeric subscript.",
     "commands": [
      {
       "id": "array-assign",
       "name": "name[subscript]=value",
       "kind": "syntax",
       "summary": "Create an array and store values in its elements",
       "syntax": "name[subscript]=value   name=(value1 value2 ...)",
       "explain": "An array springs into existence the first time one of its elements is assigned. The subscript is an integer or arithmetic expression of zero or more, and the first element is number zero. The parenthesized form fills elements in order starting at zero, and [n]=value inside the list sets a specific element.",
       "examples": [
        {
         "cmd": "a[1]=foo",
         "out": "",
         "note": "Creates array a and sets element 1.",
         "sim": false
        },
        {
         "cmd": "echo ${a[1]}",
         "out": "foo",
         "note": "Braces are needed so the shell does not treat a[1] as a wildcard.",
         "sim": false
        },
        {
         "cmd": "days=(Sun Mon Tue Wed Thu Fri Sat)",
         "out": "",
         "note": "Seven values go into elements 0 through 6.",
         "sim": false
        },
        {
         "cmd": "days=([0]=Sun [1]=Mon [2]=Tue [3]=Wed [4]=Thu [5]=Fri [6]=Sat)",
         "out": "",
         "note": "Same result with each subscript spelled out.",
         "sim": false
        }
       ],
       "chapters": [
        35
       ]
      }
     ],
     "terms": [
      {
       "t": "array",
       "d": "A variable that holds more than one value at once.",
       "p": 437
      },
      {
       "t": "element",
       "d": "One cell of an array, holding a single piece of data.",
       "p": 438
      },
      {
       "t": "index / subscript",
       "d": "The address used to reach an individual array element.",
       "p": 438
      },
      {
       "t": "subscript 0",
       "d": "Indexed arrays start counting at zero, not one.",
       "p": 438
      },
      {
       "t": "one dimension",
       "d": "bash arrays have a single dimension; support began in bash version 2.",
       "p": 438
      },
      {
       "t": "declare -a a",
       "d": "Explicitly creates the indexed array a.",
       "p": 438
      }
     ],
     "quiz": [
      {
       "id": "ch35.create.q1",
       "type": "mc",
       "cmd": "array-assign",
       "q": "What is the subscript of an array's first element?",
       "choices": [
        "0",
        "1",
        "-1",
        "Any number you choose"
       ],
       "answer": 0,
       "explain": "Indexed arrays in bash start at element zero."
      },
      {
       "id": "ch35.create.q2",
       "type": "fill",
       "cmd": "array-assign",
       "q": "Store the value foo in element 1 of array a.",
       "accept": [
        "a[1]=foo"
       ]
      },
      {
       "id": "ch35.create.q3",
       "type": "order",
       "cmd": "array-assign",
       "q": "Build: create the array days holding Sun, Mon and Tue.",
       "parts": [
        "days=(Sun",
        "Mon",
        "Tue)"
       ]
      },
      {
       "id": "ch35.create.q4",
       "type": "output",
       "cmd": "array-assign",
       "q": "After a[1]=foo, which command printed this?",
       "out": "foo",
       "choices": [
        "echo ${a[1]}",
        "echo ${a[0]}",
        "echo $a",
        "echo a[1]"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch35.access",
     "title": "Accessing Array Elements",
     "intro": "Elements are read with ${name[subscript]}. Special subscripts and expansions return every element, the element count, or the list of subscripts that are actually in use.",
     "commands": [
      {
       "id": "array-all",
       "name": "${array[@]}",
       "kind": "syntax",
       "summary": "Expand to every element of an array",
       "syntax": "${array[@]}  ${array[*]}",
       "explain": "The @ and * subscripts both return all elements and behave alike until quoted. Quoted, \"${array[*]}\" becomes one single word, while \"${array[@]}\" gives each element as its own word, matching the array's real contents. As with positional parameters, the quoted @ form is the more useful one.",
       "examples": [
        {
         "cmd": "animals=(\"a dog\" \"a cat\" \"a fish\")",
         "out": "",
         "note": "Three elements, each two words long.",
         "sim": false
        },
        {
         "cmd": "for i in ${animals[*]}; do echo $i; done",
         "out": "a\ndog\na\ncat\na\nfish",
         "note": "Unquoted, every word is split apart; ${animals[@]} unquoted does the same.",
         "sim": false
        },
        {
         "cmd": "for i in \"${animals[*]}\"; do echo $i; done",
         "out": "a dog a cat a fish",
         "note": "Quoted * yields one word.",
         "sim": false
        },
        {
         "cmd": "for i in \"${animals[@]}\"; do echo $i; done",
         "out": "a dog\na cat\na fish",
         "note": "Quoted @ keeps the three elements intact.",
         "sim": false
        }
       ],
       "chapters": [
        35
       ]
      },
      {
       "id": "array-count",
       "name": "${#array[@]}",
       "kind": "syntax",
       "summary": "Expand to the number of elements in an array",
       "syntax": "${#array[@]}",
       "explain": "Much like ${#var} measures a string, ${#array[@]} counts the elements that exist. bash counts only elements that were assigned, so gaps in the subscripts are not included. ${#array[n]} instead gives the length of element n.",
       "examples": [
        {
         "cmd": "a[100]=foo; echo ${#a[@]}",
         "out": "1",
         "note": "Only one element exists, even though its subscript is 100.",
         "sim": false
        },
        {
         "cmd": "echo ${#a[100]}",
         "out": "3",
         "note": "Length of the string in element 100.",
         "sim": false
        }
       ],
       "chapters": [
        35
       ]
      },
      {
       "id": "array-keys",
       "name": "${!array[@]}",
       "kind": "syntax",
       "summary": "Expand to the list of subscripts an array is using",
       "syntax": "${!array[@]}  ${!array[*]}",
       "explain": "Because arrays may have gaps, it helps to know which subscripts exist. This expansion returns the indexes rather than the values. Quoting the @ form gives each subscript as a separate word.",
       "examples": [
        {
         "cmd": "foo=([2]=a [4]=b [6]=c)",
         "out": "",
         "note": "Elements at 2, 4 and 6 only.",
         "sim": false
        },
        {
         "cmd": "for i in \"${!foo[@]}\"; do echo $i; done",
         "out": "2\n4\n6",
         "note": "The subscripts in use.",
         "sim": false
        },
        {
         "cmd": "for i in \"${foo[@]}\"; do echo $i; done",
         "out": "a\nb\nc",
         "note": "Compare: the values themselves.",
         "sim": false
        }
       ],
       "chapters": [
        35
       ]
      }
     ],
     "terms": [
      {
       "t": "${name[subscript]}",
       "d": "Reads one element; the braces stop pathname expansion on the bracket.",
       "p": 438
      },
      {
       "t": "${array[*]}",
       "d": "All elements; quoted, they merge into one word.",
       "p": 441
      },
      {
       "t": "\"${array[@]}\"",
       "d": "All elements, each kept as a separate word even if it contains spaces.",
       "p": 441
      },
      {
       "t": "${#array[@]}",
       "d": "Count of elements that have been assigned.",
       "p": 441
      },
      {
       "t": "${!array[@]}",
       "d": "List of subscripts actually in use.",
       "p": 442
      },
      {
       "t": "hours[i]",
       "d": "A subscript may be an arithmetic expression, e.g. a loop variable, without needing $.",
       "p": 440
      }
     ],
     "quiz": [
      {
       "id": "ch35.access.q1",
       "type": "mc",
       "cmd": "array-count",
       "q": "After a[100]=foo on a new array, what does echo ${#a[@]} print?",
       "choices": [
        "1",
        "100",
        "101",
        "3"
       ],
       "answer": 0,
       "explain": "bash only counts elements that were assigned."
      },
      {
       "id": "ch35.access.q2",
       "type": "output",
       "cmd": "array-all",
       "q": "animals=(\"a dog\" \"a cat\" \"a fish\"). Which loop printed this?",
       "out": "a dog\na cat\na fish",
       "choices": [
        "for i in \"${animals[@]}\"; do echo $i; done",
        "for i in \"${animals[*]}\"; do echo $i; done",
        "for i in ${animals[@]}; do echo $i; done",
        "for i in ${animals[*]}; do echo $i; done"
       ],
       "answer": 0
      },
      {
       "id": "ch35.access.q3",
       "type": "fill",
       "cmd": "array-keys",
       "q": "Loop over the subscripts used by array foo, echoing each one.",
       "accept": [
        "for i in \"${!foo[@]}\"; do echo $i; done",
        "for i in \"${!foo[@]}\"; do echo \"$i\"; done"
       ]
      },
      {
       "id": "ch35.access.q4",
       "type": "order",
       "cmd": "array-all",
       "q": "Build: loop over every element of animals, keeping each element whole.",
       "parts": [
        "for",
        "i",
        "in",
        "\"${animals[@]}\";",
        "do",
        "echo $i;",
        "done"
       ]
      }
     ]
    },
    {
     "id": "ch35.ops",
     "title": "Appending, Sorting, and Deleting",
     "intro": "Common array chores include adding values at the end, sorting, and removing elements or whole arrays. The shell has += and unset for these, and sorting needs a short pipeline.",
     "commands": [
      {
       "id": "array-append",
       "name": "+=",
       "kind": "syntax",
       "summary": "Add new values after the last element of an array",
       "syntax": "name+=(value ...)",
       "explain": "The element count does not reveal the highest subscript in use, so it cannot be relied on to find the end. The += operator solves this by adding the new values after the last existing element automatically.",
       "examples": [
        {
         "cmd": "foo=(a b c); echo ${foo[@]}",
         "out": "a b c",
         "note": "Start with three elements.",
         "sim": false
        },
        {
         "cmd": "foo+=(d e f); echo ${foo[@]}",
         "out": "a b c d e f",
         "note": "Three more are added at the end.",
         "sim": false
        },
        {
         "cmd": "a_sorted=($(for i in \"${a[@]}\"; do echo $i; done | sort))",
         "out": "",
         "note": "Sorting: print each element, pipe through sort, and capture the result in a new array.",
         "sim": false
        }
       ],
       "chapters": [
        35
       ]
      },
      {
       "id": "unset",
       "name": "unset",
       "kind": "builtin",
       "summary": "Delete a variable, a whole array, or one array element",
       "syntax": "unset name   unset 'name[subscript]'",
       "explain": "unset with an array name removes the entire array. Given a subscripted name it deletes just that element; quote it so the brackets are not treated as a wildcard. Assigning an empty value to an array name does not clear it, because a name with no subscript refers to element zero.",
       "examples": [
        {
         "cmd": "foo=(a b c d e f); unset foo; echo ${foo[@]}",
         "out": "",
         "note": "The whole array is gone.",
         "sim": false
        },
        {
         "cmd": "foo=(a b c d e f); unset 'foo[2]'; echo ${foo[@]}",
         "out": "a b d e f",
         "note": "Subscript 2 is the third element, c.",
         "sim": false
        },
        {
         "cmd": "foo=(a b c d e f); foo=; echo ${foo[@]}",
         "out": "b c d e f",
         "note": "Only element zero was emptied.",
         "sim": false
        },
        {
         "cmd": "foo=(a b c d e f); foo=A; echo ${foo[@]}",
         "out": "A b c d e f",
         "note": "No subscript means element zero.",
         "sim": false
        }
       ],
       "chapters": [
        35
       ]
      }
     ],
     "terms": [
      {
       "t": "name+=(values)",
       "d": "Adds values after the last element of the array.",
       "p": 442
      },
      {
       "t": "sorting an array",
       "d": "No built-in sort: echo the elements into sort and rebuild an array with command substitution.",
       "p": 443
      },
      {
       "t": "unset 'foo[2]'",
       "d": "Removes one element; the quotes block pathname expansion.",
       "p": 443
      },
      {
       "t": "name without subscript",
       "d": "Refers to element zero, so foo=value changes only the first element.",
       "p": 444
      }
     ],
     "quiz": [
      {
       "id": "ch35.ops.q1",
       "type": "mc",
       "cmd": "unset",
       "q": "foo=(a b c d e f) then foo= . What does echo ${foo[@]} print?",
       "choices": [
        "b c d e f",
        "nothing",
        "a b c d e f",
        "a"
       ],
       "answer": 0,
       "explain": "foo= only empties element zero."
      },
      {
       "id": "ch35.ops.q2",
       "type": "fill",
       "cmd": "unset",
       "q": "Delete only the element with subscript 2 from array foo, quoting it.",
       "accept": [
        "unset 'foo[2]'",
        "unset \"foo[2]\""
       ]
      },
      {
       "id": "ch35.ops.q3",
       "type": "order",
       "cmd": "array-append",
       "q": "Build: add d, e and f to the end of array foo.",
       "parts": [
        "foo+=(d",
        "e",
        "f)"
       ]
      },
      {
       "id": "ch35.ops.q4",
       "type": "output",
       "cmd": "unset",
       "q": "foo=(a b c d e f). Which command was run before echo ${foo[@]} printed this?",
       "out": "a b d e f",
       "choices": [
        "unset 'foo[2]'",
        "unset 'foo[3]'",
        "unset foo",
        "foo="
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch35.assoc",
     "title": "Associative Arrays",
     "intro": "Since bash 4.0, arrays can use strings instead of integers as indexes. These associative arrays must be declared before use.",
     "commands": [
      {
       "id": "assoc-array",
       "name": "name[\"key\"]=value",
       "kind": "syntax",
       "summary": "Store and read array elements by string key",
       "syntax": "declare -A name; name[\"key\"]=value; ${name[\"key\"]}",
       "explain": "After declare -A, elements are set and read just like indexed ones, except the subscript is a string such as a color name. This makes it easy to tally or look up data by name, for example counting files per owner.",
       "examples": [
        {
         "cmd": "colors[\"red\"]=\"#ff0000\"; colors[\"green\"]=\"#00ff00\"; colors[\"blue\"]=\"#0000ff\"",
         "out": "",
         "note": "Three entries keyed by color name.",
         "sim": false
        },
        {
         "cmd": "echo ${colors[\"blue\"]}",
         "out": "#0000ff",
         "note": "Look up a value by its key.",
         "sim": false
        }
       ],
       "chapters": [
        35
       ]
      }
     ],
     "terms": [
      {
       "t": "associative array",
       "d": "An array whose indexes are strings rather than integers (bash 4.0 and later).",
       "p": 444
      },
      {
       "t": "declare -A",
       "d": "Mandatory for associative arrays; indexed arrays can be created just by use.",
       "p": 444
      }
     ],
     "quiz": [
      {
       "id": "ch35.assoc.q1",
       "type": "mc",
       "cmd": "declare",
       "q": "Which command must run before an associative array named colors is used?",
       "choices": [
        "declare -A colors",
        "declare -a colors",
        "colors=()",
        "unset colors"
       ],
       "answer": 0,
       "explain": "Only declare -A creates an associative array."
      },
      {
       "id": "ch35.assoc.q2",
       "type": "fill",
       "cmd": "assoc-array",
       "q": "Print the value stored under the key blue in the associative array colors.",
       "accept": [
        "echo ${colors[\"blue\"]}",
        "echo \"${colors[\"blue\"]}\"",
        "echo ${colors[blue]}"
       ]
      },
      {
       "id": "ch35.assoc.q3",
       "type": "order",
       "cmd": "declare",
       "q": "Build: create an associative array called colors.",
       "parts": [
        "declare",
        "-A",
        "colors"
       ]
      }
     ],
     "refs": [
      "declare"
     ]
    }
   ]
  },
  {
   "id": "ch36",
   "n": 36,
   "part": 4,
   "title": "Exotica",
   "summary": "Group commands, process substitution, traps, wait, and named pipes",
   "lessons": [
    {
     "id": "ch36.group",
     "title": "Group Commands and Subshells",
     "intro": "bash can bundle several commands so they share one redirection or feed one pipeline. A group command uses braces and runs in the current shell; a subshell uses parentheses and runs in a child copy.",
     "commands": [
      {
       "id": "group-cmd",
       "name": "{ }",
       "kind": "syntax",
       "summary": "Run several commands as one unit in the current shell",
       "syntax": "{ command1; command2; [command3; ...] }",
       "explain": "A group command lets one redirection or pipe apply to the combined output of all its commands. The braces need a space between them and the commands, and the last command must end with a semicolon or newline before the closing brace. Because it runs in the current shell, it is faster and lighter than a subshell, and variable changes inside it persist.",
       "examples": [
        {
         "cmd": "{ ls -l; echo \"Listing of foo.txt\"; cat foo.txt; } > output.txt",
         "out": "",
         "note": "One redirection captures the output of all three commands.",
         "sim": false
        },
        {
         "cmd": "{ ls -l; echo \"Listing of foo.txt\"; cat foo.txt; } | lpr",
         "out": "",
         "note": "The combined stream is piped to the printer as one report.",
         "sim": false
        },
        {
         "cmd": "{ for i in \"${!owners[@]}\"; do printf \"%-10s: %5d file(s)\\n\" \"$i\" \"${owners[\"$i\"]}\"; done } | sort",
         "out": "daemon    :     1 file(s)\nroot      :  1394 file(s)",
         "note": "From array-2: grouping the loop lets its whole output be sorted.",
         "sim": false
        }
       ],
       "chapters": [
        36
       ]
      },
      {
       "id": "subshell",
       "name": "( )",
       "kind": "syntax",
       "summary": "Run several commands as one unit in a child copy of the shell",
       "syntax": "(command1; command2; [command3;...])",
       "explain": "A subshell also combines output for redirection or pipelines, but its commands run in a copy of the current shell's environment. When the subshell ends, that copy is thrown away, so any variables it set are lost. Unless a subshell is really needed, a group command is the better choice.",
       "examples": [
        {
         "cmd": "(ls -l; echo \"Listing of foo.txt\"; cat foo.txt) > output.txt",
         "out": "",
         "note": "Same result as the group command, but in a child shell.",
         "sim": false
        },
        {
         "cmd": "echo \"foo\" | read; echo $REPLY",
         "out": "",
         "note": "Prints an empty line: read ran in a pipeline subshell, and its REPLY vanished with it.",
         "sim": false
        }
       ],
       "chapters": [
        36
       ]
      }
     ],
     "terms": [
      {
       "t": "group command spacing",
       "d": "Braces must be separated from commands by spaces, and a ; or newline must come before the closing }.",
       "p": 448
      },
      {
       "t": "group vs subshell",
       "d": "Group runs in the current shell; subshell runs in a copy whose changes are lost on exit.",
       "p": 451
      },
      {
       "t": "pipeline subshells",
       "d": "Every command in a pipeline runs in a subshell, so variable assignments there do not survive.",
       "p": 451
      }
     ],
     "quiz": [
      {
       "id": "ch36.group.q1",
       "type": "mc",
       "cmd": "subshell",
       "q": "A variable is set inside ( ). What happens to it after the subshell finishes?",
       "choices": [
        "It is lost along with the subshell's copy of the environment",
        "It is kept in the parent shell",
        "It becomes an environment variable",
        "It is saved to a file"
       ],
       "answer": 0,
       "explain": "A subshell works on a copy of the environment that disappears when it exits."
      },
      {
       "id": "ch36.group.q2",
       "type": "fill",
       "cmd": "group-cmd",
       "q": "Using a group command, send the output of ls -l followed by cat foo.txt into output.txt.",
       "accept": [
        "{ ls -l; cat foo.txt; } > output.txt",
        "{ ls -l; cat foo.txt; } >output.txt"
       ]
      },
      {
       "id": "ch36.group.q3",
       "type": "order",
       "cmd": "group-cmd",
       "q": "Build a group command that writes a listing, a heading and foo.txt to output.txt.",
       "parts": [
        "{",
        "ls -l;",
        "echo \"Listing of foo.txt\";",
        "cat foo.txt;",
        "}",
        ">",
        "output.txt"
       ]
      }
     ]
    },
    {
     "id": "ch36.procsub",
     "title": "Process Substitution",
     "intro": "Process substitution makes the output of a subshell look like a file. This works around the problem of read losing its variables when it sits at the end of a pipeline.",
     "commands": [
      {
       "id": "proc-subst",
       "name": "<(list)",
       "kind": "syntax",
       "summary": "Treat a command list's output (or input) as a file name",
       "syntax": "<(list)   >(list)",
       "explain": "<(list) is used for commands that write to standard output, and >(list) for commands that read standard input. The shell replaces the construct with a file name, such as /dev/fd/63, that connects to the subshell. Redirecting from it lets a loop or read run in the current shell, so its variables are kept.",
       "examples": [
        {
         "cmd": "read < <(echo \"foo\"); echo $REPLY",
         "out": "foo",
         "note": "Unlike echo \"foo\" | read, REPLY keeps its value.",
         "sim": false
        },
        {
         "cmd": "echo <(echo \"foo\")",
         "out": "/dev/fd/63",
         "note": "Shows the file name the expansion really produces.",
         "sim": false
        },
        {
         "cmd": "while read attr links owner group size date time filename; do echo \"$filename\"; done < <(ls -l | tail -n +2)",
         "out": "",
         "note": "A read loop over a directory listing; tail drops the total line.",
         "sim": false
        }
       ],
       "chapters": [
        36
       ]
      }
     ],
     "terms": [
      {
       "t": "<(list)",
       "d": "Process substitution for commands that produce standard output.",
       "p": 451
      },
      {
       "t": ">(list)",
       "d": "Process substitution for commands that take standard input.",
       "p": 451
      },
      {
       "t": "/dev/fd/63",
       "d": "Example of the file name a process substitution expands into.",
       "p": 452
      }
     ],
     "quiz": [
      {
       "id": "ch36.procsub.q1",
       "type": "output",
       "cmd": "proc-subst",
       "q": "Which command printed this?",
       "out": "/dev/fd/63",
       "choices": [
        "echo <(echo \"foo\")",
        "echo $(echo \"foo\")",
        "cat <(echo \"foo\")",
        "echo \"foo\" | read"
       ],
       "answer": 0
      },
      {
       "id": "ch36.procsub.q2",
       "type": "mc",
       "cmd": "proc-subst",
       "q": "Why does echo \"foo\" | read leave REPLY empty afterward?",
       "choices": [
        "read runs in a subshell whose REPLY is discarded",
        "read cannot take input from echo",
        "REPLY is read-only",
        "echo sends output to stderr"
       ],
       "answer": 0,
       "explain": "Pipeline commands run in subshells, so their assignments are lost."
      },
      {
       "id": "ch36.procsub.q3",
       "type": "fill",
       "cmd": "proc-subst",
       "q": "Read the output of echo \"foo\" into REPLY using process substitution.",
       "accept": [
        "read < <(echo \"foo\")",
        "read < <(echo foo)"
       ]
      },
      {
       "id": "ch36.procsub.q4",
       "type": "order",
       "cmd": "proc-subst",
       "q": "Build: redirect a process substitution into read.",
       "parts": [
        "read",
        "<",
        "<(echo \"foo\")"
       ]
      }
     ]
    },
    {
     "id": "ch36.trap",
     "title": "Traps and Temporary Files",
     "intro": "Long scripts should react sensibly when they are interrupted or terminated, for instance by cleaning up temporary files. The trap builtin runs a command when a chosen signal arrives.",
     "commands": [
      {
       "id": "trap",
       "name": "trap",
       "kind": "builtin",
       "summary": "Run a command when the script receives a given signal",
       "syntax": "trap argument signal [signal...]",
       "explain": "argument is a string that the shell reads and runs as a command whenever one of the listed signals arrives. Because building a long command string is clumsy, it is common to name a shell function instead. A handler that should stop the script needs its own exit, or the script carries on after the function returns.",
       "examples": [
        {
         "cmd": "trap \"echo 'I am ignoring you.'\" SIGINT SIGTERM",
         "out": "",
         "note": "Interrupting or terminating the script just prints a message.",
         "sim": false
        },
        {
         "cmd": "trap-demo",
         "out": "Iteration 1 of 5\nIteration 2 of 5\n^CI am ignoring you.\nIteration 3 of 5\n^CI am ignoring you.\nIteration 4 of 5\nIteration 5 of 5",
         "note": "Pressing CTRL-C no longer stops the loop.",
         "sim": false
        },
        {
         "cmd": "trap exit_on_signal_SIGINT SIGINT",
         "out": "",
         "note": "Calls a function that prints a message and exits.",
         "sim": false
        }
       ],
       "chapters": [
        36
       ]
      },
      {
       "id": "mktemp",
       "name": "mktemp",
       "kind": "cmd",
       "summary": "Create a temporary file with an unpredictable name",
       "syntax": "mktemp template",
       "explain": "mktemp both names and creates a temporary file. The template should end in a run of X characters, which are swapped for random letters and digits; more X's give a longer random part. Unpredictable names protect against temp race attacks in shared directories like /tmp.",
       "examples": [
        {
         "cmd": "tempfile=$(mktemp /tmp/foobar.$$.XXXXXXXXXX)",
         "out": "",
         "note": "tempfile might become /tmp/foobar.6593.UOZuvM6654.",
         "sim": false
        },
        {
         "cmd": "[[ -d $HOME/tmp ]] || mkdir $HOME/tmp",
         "out": "",
         "note": "For scripts run by regular users, keep temp files in a private directory instead.",
         "sim": false
        }
       ],
       "chapters": [
        36
       ]
      }
     ],
     "terms": [
      {
       "t": "SIGINT",
       "d": "Interrupt signal, sent when the user presses CTRL-C.",
       "p": 454
      },
      {
       "t": "SIGTERM",
       "d": "Terminate signal; a trap can catch it to clean up before exiting.",
       "p": 453
      },
      {
       "t": "signal handler",
       "d": "Function named in a trap; include exit in it if the script should stop.",
       "p": 454
      },
      {
       "t": "$$",
       "d": "Special parameter holding the process ID of the running shell.",
       "p": 455
      },
      {
       "t": "$RANDOM",
       "d": "Shell variable giving a random integer, but only from 1 to 32767.",
       "p": 455
      },
      {
       "t": "temp race attack",
       "d": "Exploit that guesses temporary file names; avoid it with unpredictable names.",
       "p": 455
      }
     ],
     "quiz": [
      {
       "id": "ch36.trap.q1",
       "type": "mc",
       "cmd": "trap",
       "q": "Why do the handler functions in trap-demo2 end with exit?",
       "choices": [
        "Otherwise the script keeps running after the handler returns",
        "trap requires an exit status",
        "exit resets the trap",
        "It sends the signal on to the parent"
       ],
       "answer": 0,
       "explain": "Without exit, control returns to the script once the function is done."
      },
      {
       "id": "ch36.trap.q2",
       "type": "fill",
       "cmd": "trap",
       "q": "Set a trap that runs the function exit_on_signal_SIGTERM when SIGTERM arrives.",
       "accept": [
        "trap exit_on_signal_SIGTERM SIGTERM"
       ]
      },
      {
       "id": "ch36.trap.q3",
       "type": "order",
       "cmd": "mktemp",
       "q": "Build: create a temp file in /tmp with a random suffix and save its name in tempfile.",
       "parts": [
        "tempfile=$(mktemp",
        "/tmp/foobar.$$.XXXXXXXXXX)"
       ]
      },
      {
       "id": "ch36.trap.q4",
       "type": "output",
       "cmd": "trap",
       "q": "The user pressed CTRL-C during the loop. Which trap was set?",
       "out": "Iteration 1 of 5\nIteration 2 of 5\n^CI am ignoring you.\nIteration 3 of 5",
       "choices": [
        "trap \"echo 'I am ignoring you.'\" SIGINT SIGTERM",
        "trap exit_on_signal_SIGINT SIGINT",
        "trap \"exit\" SIGINT",
        "trap \"echo 'I am ignoring you.'\" SIGTERM"
       ],
       "answer": 0
      }
     ]
    },
    {
     "id": "ch36.async",
     "title": "Asynchronous Execution with wait",
     "intro": "A script can start a child process in the background and keep working. When it later depends on the child's result, the wait builtin pauses it until that child is finished.",
     "commands": [
      {
       "id": "wait",
       "name": "wait",
       "kind": "builtin",
       "summary": "Pause until a specified background process finishes",
       "syntax": "wait pid",
       "explain": "The parent launches a child with & and saves its process ID from $!. Later, wait with that PID blocks the parent until the child exits. This keeps parent and child coordinated when one depends on the other.",
       "examples": [
        {
         "cmd": "async-child &",
         "out": "",
         "note": "Starts the child script in the background.",
         "sim": false
        },
        {
         "cmd": "pid=$!",
         "out": "",
         "note": "$! holds the PID of the job just put in the background.",
         "sim": false
        },
        {
         "cmd": "wait \"$pid\"",
         "out": "",
         "note": "The parent stops here until the child exits.",
         "sim": false
        },
        {
         "cmd": "async-parent",
         "out": "Parent: starting...\nParent: launching child script...\nParent: child (PID= 6741) launched.\nParent: continuing...\nChild: child is running...\nParent: pausing to wait for child to finish...\nChild: child is done. Exiting.\nParent: child is finished. Continuing...",
         "note": "Parent and child output interleave until wait syncs them.",
         "sim": false
        }
       ],
       "chapters": [
        36
       ]
      }
     ],
     "terms": [
      {
       "t": "$!",
       "d": "Process ID of the most recent job put into the background.",
       "p": 457
      },
      {
       "t": "command &",
       "d": "Runs the command in the background so the script continues immediately.",
       "p": 456
      }
     ],
     "quiz": [
      {
       "id": "ch36.async.q1",
       "type": "mc",
       "cmd": "wait",
       "q": "Which parameter holds the PID of the last background job?",
       "choices": [
        "$!",
        "$$",
        "$?",
        "$#"
       ],
       "answer": 0,
       "explain": "$$ is the shell's own PID; $! is the last background job."
      },
      {
       "id": "ch36.async.q2",
       "type": "fill",
       "cmd": "wait",
       "q": "Pause until the process whose ID is stored in pid has exited (quote the variable).",
       "accept": [
        "wait \"$pid\""
       ]
      },
      {
       "id": "ch36.async.q3",
       "type": "order",
       "cmd": "wait",
       "q": "Build: wait for the child whose PID is saved in pid.",
       "parts": [
        "wait",
        "\"$pid\""
       ]
      }
     ]
    },
    {
     "id": "ch36.fifo",
     "title": "Named Pipes",
     "intro": "A named pipe is a special file that connects two processes as a first-in first-out buffer. One process writes into it and another reads from it, just like an ordinary pipe but through the file system.",
     "commands": [
      {
       "id": "mkfifo",
       "name": "mkfifo",
       "kind": "cmd",
       "summary": "Create a named pipe (FIFO) file",
       "syntax": "mkfifo name",
       "explain": "mkfifo makes a file that behaves like a pipe: writing process1 > pipe and reading process2 < pipe works like process1 | process2. A writer blocks until a reader opens the other end, and then the data flows through. In ls -l, a named pipe shows p as the first attribute character.",
       "examples": [
        {
         "cmd": "mkfifo pipe1",
         "out": "",
         "note": "Creates the named pipe pipe1.",
         "sim": false
        },
        {
         "cmd": "ls -l pipe1",
         "out": "prw-r--r-- 1 me   me    0 2018-07-17 06:41 pipe1",
         "note": "The leading p marks a named pipe.",
         "sim": false
        },
        {
         "cmd": "ls -l > pipe1",
         "out": "",
         "note": "In one terminal: appears to hang because the pipe is blocked.",
         "sim": false
        },
        {
         "cmd": "cat < pipe1",
         "out": "",
         "note": "In a second terminal: shows the listing, and the first ls then finishes.",
         "sim": false
        }
       ],
       "chapters": [
        36
       ]
      }
     ],
     "terms": [
      {
       "t": "named pipe",
       "d": "A special file that links two processes; data written in one end comes out the other.",
       "p": 457
      },
      {
       "t": "FIFO",
       "d": "First-in first-out: data leaves a named pipe in the order it went in.",
       "p": 457
      },
      {
       "t": "blocked pipe",
       "d": "A writer waits when no process is reading the other end yet.",
       "p": 458
      },
      {
       "t": "client-server",
       "d": "Design where clients send requests and a server answers; named pipes are one way to connect them.",
       "p": 457
      }
     ],
     "quiz": [
      {
       "id": "ch36.fifo.q1",
       "type": "mc",
       "cmd": "mkfifo",
       "q": "Why does ls -l > pipe1 seem to hang?",
       "choices": [
        "Nothing is reading the other end yet, so the pipe is blocked",
        "ls cannot write to files",
        "pipe1 is a directory",
        "The command needs sudo"
       ],
       "answer": 0,
       "explain": "The write completes once a reader such as cat < pipe1 attaches."
      },
      {
       "id": "ch36.fifo.q2",
       "type": "output",
       "cmd": "mkfifo",
       "q": "Which command printed this?",
       "out": "prw-r--r-- 1 me   me    0 2018-07-17 06:41 pipe1",
       "choices": [
        "ls -l pipe1",
        "ls pipe1",
        "mkfifo pipe1",
        "cat < pipe1"
       ],
       "answer": 0
      },
      {
       "id": "ch36.fifo.q3",
       "type": "fill",
       "cmd": "mkfifo",
       "q": "Create a named pipe called pipe1.",
       "accept": [
        "mkfifo pipe1"
       ]
      },
      {
       "id": "ch36.fifo.q4",
       "type": "order",
       "cmd": "mkfifo",
       "q": "Build: read from the named pipe pipe1 with cat.",
       "parts": [
        "cat",
        "<",
        "pipe1"
       ]
      }
     ]
    }
   ]
  }
 ]
};
