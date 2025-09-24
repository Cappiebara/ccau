# Course Copy Automatic Userscripts

Automate course copies on the Canvas LMS. Pronounced like “cow.”

CCAU is divided into several sections based on which page(s) are targeted. These sections are independent, but I recommend using them all together for the best experience.

## Assignments

Adds a Delete Empty Groups button to the assignments page.

## Discussions

Adds a “Delete All Discussions” button to the discussions page. This is useful for wiping courses when a professor wants updated content to be copied in. It can also save a click during normal course copies.

## Home Page

Adds a Re-Link Modules button to the home page Course Link editor. Make sure to manually re-link Start Here *before* clicking this button. Wait until the yellow flash before continuing as it may take a few seconds.

## Modules

Adds three buttons to the modules page: Auto-Move, Remove Empty, and Add Dates.

Auto-Move moves the content of each copied *weekly* module into its respective template module. This accounts for casing, symbols, emojis, spacing, &c. Anything with the word “week” (in any casing) followed by a 1- or 2-digit number will match; words numbers like “One” won’t match. Non-matching modules are ignored.

Remove Empty finds modules with no content and deletes them. This *does* distinguish between empty and collapsed modules.

Add Dates removes old date headers, adds new date headers to each weekly module, publishes them, and drags them to the top of their respective weekly modules.

## Pages

Adds a checkbox at the top of the list of pages on the View All Pages page. This allows for removing pages using only two clicks rather than 40+. University Information, ✏️SE Evaluation Information, Prerequisite Knowledge/Skills, and designated front pages are retained.

Known issues:

- On rare occasion, the checkbox doesn’t appear; if this happens, clicking the trash can icon and cancelling should make it appear.
- Pages are lazy-loaded if there are more than 50 of them, so large numbers of pages may require multiple rounds of deleting.

## Task Bar

Adds a task bar to the top of the screen on every page within a live course. This has a back arrow to return to the previous task, a button indicating the current task (which gives detailed instructions when clicked), and a next arrow to proceed to the next task. Clicking the arrows takes you directly to the necessary page.

## Compiling

CCAU is used in compiled form with a user script manager (e.g., Violentmonkey). I have included a build script for OS X and Linux; Windows build script PRs welcome.

To compile, you must have `esbuild` and `typescript` installed through your system package manager. If you don’t have a system package manager, try Nix.

Precompiled versions are available on [OpenUserJS](https://openuserjs.org/users/18C/scripts).

## Contributing

PRs and issues *from CIDT employees* are welcome!

CCAU is licensed under GPL-3.0-or-later, which means anyone can use it as long as they keep it open source and use the same license. In the event that a newer version of the GNU Public License should be released, that newer version takes precedence over all previous versions of the license.

`modules/src/date_modal.ts` and `task_bar/src/task.ts` will need to be updated periodically as they contain the term dates and tasks, respectively. Both are stored in a very simple format so no TypeScript experience is needed.
