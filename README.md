# Canvas Copy Automatic Userscripts

> Notice: All new work is currently being done in the 0.2.0 branch.
> It adds a number of safety features and generally cleaner code.
> On the off-chance that anyone wants to make a PR, please do it there.

Automate course copies. Pronounced the same as "cow." CCAU is divided
into several sections, depending on which page(s) are targeted. These
sections are: Discussions, Gradebook, Modules, Pages, and Taskbar.

## Sections

**Discussions**

Add a "Delete All Discussions" button to the discussions page. This
is useful for wiping courses when the professor wants updated content
copied in. However, as of writing it is barely functional. You may
need to click it several times and/or confirm deletion.

**Gradebook**

Add an automatic calculator to the Gradebook to easily check against
the value listed in the syllabus.

**Modules**

The big one. This adds three buttons to the modules page: Auto-Move,
Remove Empty, and Add Dates.

Auto-Move will move each copied module
into the template module of the same semantic name. This accounts for
capitalization, symbols/emojis, spacing, etc. Basically, anything
with "Week" (any caps) and a 1- or 2-digit number will match. Word
numbers like "One" will not match.

Remove Empty finds modules with nothing in them and deletes them.
This *does* distinguish between empty and collapsed modules.

Add Dates removes old date headers and replaces them with updated
headers. The updated headers are fetched from PasteBin. If there
are no cached headers, you need to reload the page to make it work.
Also, headers need to be dragged into place within their respective
weeks; I tried to fix this but it is hard. PRs welcome!!

**Pages**

Simple checkbox at the top of the pages list so you can do 2 clicks
rather than 40+ to remove template pages. This was the first PoC for
CCAU, so I like it. On rare occasion, it randomly doesn't appear. If
this happens, click the trash can icon and cancel it.

**Taskbar**

Adds a task bar to the top of the screen on every page within a
course. This has arrows for the next/previous tasks and instructions
on what to do for the current task. The main purpose of this is so
you can easily go to the next page using the next arrow. Inspired by
Dawn's spreadsheet, which also needs to be filled out independently.

## Compiling and Usage

CCAU is meant to be used in compiled form with a userscript manager
such as Violentmonkey or Tampermonkey. If you have a UNIX-like OS
(MacOS, Linux, etc.) you can use the build script `./build_all`.

**CORS restrictions must be disabled!**

Compile-time dependencies include:
- esbuild
- toml2json
- tsc

Windows users are advised to ~~get a better OS~~ use WSL or similar.
To use a precompiled version, just add it to Violentmonkey.

## Contributors / Other University Users

Pull requests and issues are welcome!

CCAU is licensed under GPL-3.0-or-later, which means anyone can use
it as long as they keep it open source and use the same license. You
can find details here: https://choosealicense.com/licenses/gpl-3.0/.
Should a newer version of GPL come out than 3.0, newer is preferred.

For users at universities other than mine, you will want to fork this
and change the contents of all env.ts and data.toml files to match
your own course copy process. However, PRs should not modify these as
the 18-carat/ccau repo is used at my own university.

The easiest way to update is to change the data.toml files, convert
them to JSON, and copy-paste the output into the env.ts file. Or you
can write directly in JSON if you have poor taste in serialisation.
