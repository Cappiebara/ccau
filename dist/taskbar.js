// ==UserScript==
// @name        Task Bar
// @namespace   CCAU
// @description Automate course copies
// @match       https://*.instructure.com/courses/*
// @version     0.1.3
// @author      CIDT
// @grant       none
// @license     GPL-3.0-or-later
// ==/UserScript==
"use strict";
(() => {
  // out/env.js
  var ROOT_URL = "https://se.instructure.com";
  var TASKS = { "tasks": [{ "help": "Click the --> button to start the copy", "name": "Begin Course Copy", "path": "" }, { "help": "If there is any content, don't do the copy", "name": "Check for Content", "path": "modules" }, { "help": "Delete 'Student Introductions' and 'Questions and Answers'", "name": "Delete Discussions", "path": "discussion_topics" }, { "help": "Delete all pages except University Information", "name": "Delete Pages", "path": "pages" }, { "help": "'Restrict students from viewing course before term start date' should be enabled and 'Participation' should be 'Course'", "name": "Verify Settings", "path": "settings" }, { "help": "Double check the email to make sure you copy the right course", "name": "Copy Content", "path": "content_migrations" }, { "help": "Copy the current holiday from the SE University Holidays course (select content)", "name": "Copy Holiday", "path": "content_migrations" }, { "help": "Delete any duplicate menu items. The original item is the first one listed", "name": "Delete Duplicate Menu Items", "path": "settings/configurations#tab-tools" }, { "help": "Move the items in the navigation menu to this order:\n\nHome\nAnnouncements\nSyllabus\nModules\nGrades\nSubmit Grades\nPeople\nSE Email\nHenry G. Bennett Library\nTech Support\nTutor.com\nYuJa\nPanorama\nLockdown Browser\nItem Banks\nCredentials\nFollett Discover\n(whatever else happens to be there)\n", "name": "Fix Menu Order", "path": "settings#tab-navigation" }, { "help": "Click the Auto-Move button, then the arrow in the bottom left", "name": "Move Content", "path": "modules" }, { "help": "Click the Remove Empty button, then the arrow in the bottom left", "name": "Delete Empty Modules", "path": "modules" }, { "help": "Click the Add Dates button, wait for them to publish, then drag them to the top of their respective modules", "name": "Add Date Headers", "path": "modules" }, { "help": "Delete any GOLD Orientation and the University Information items which are NOT at the bottom of the START HERE module", "name": "Delete Old GOLD", "path": "modules" }, { "help": "Move the holiday module into place", "name": "Move Holiday", "path": "modules" }, { "help": "Delete any duplicate Question and Answer or Student Introductions discussions", "name": "Delete Duplicate Discussions", "path": "discussion_topics" }, { "help": "Delete any undeployed GOLD Orientation assignments and empty categories", "name": "Delete Duplicate Assignments", "path": "assignments" }, { "help": "Use https://k.ngn.tf/8775a to fix broken images; manually fix broken module links", "name": "Fix Homepage", "path": "wiki" }, { "help": "Make sure the dates are correct, especially regarding the holiday-adjacent weeks", "name": "Check Assignment Dates", "path": "assignments" }, { "help": "Check for Blackboard references, as well as getting the grade total / weights", "name": "Check Syllabus", "path": "assignments/syllabus" }, { "help": "Make sure it matches the syllabus", "name": "Check Gradebook", "path": "gradebook" }, { "help": "If any real links are broken, inform the professor", "name": "Run Link Validator", "path": "link_validator" }, { "help": "Ensure that all the steps on the Google Sheet have been followed. If something there isn't covered in the automation, lmk", "name": "Check Google Sheet", "path": "" }, { "help": "Excellent work, 47. The money has been wired to your account", "name": "Done", "path": "" }] };

  // out/live.js
  function getCourseID() {
    return window.location.href.match(/courses\/(\d+)/)?.[1] ?? "NO_COURSE_ID";
  }
  async function isLiveCourse() {
    const response = await fetch(ROOT_URL + "/api/v1/courses/" + getCourseID());
    const data = await response.json();
    return new Date(data["start_at"]) < /* @__PURE__ */ new Date();
  }

  // out/task.js
  function getTasks() {
    return TASKS.tasks;
  }

  // out/utils.js
  function addArrowButton(task, fn, label) {
    const bar = document.querySelector(".right-of-crumbs");
    const btn = document.createElement("a");
    btn.textContent = label;
    btn.setAttribute("title", task.help);
    btn.classList.add("btn");
    btn.setAttribute("tabindex", "0");
    btn.addEventListener("click", fn);
    bar?.insertAdjacentElement("beforebegin", btn);
  }
  function prevArrow(task, fn) {
    addArrowButton(task, fn, "<--");
  }
  function nextArrow(task, fn) {
    addArrowButton(task, fn, "-->");
  }
  function displayCurrent(task) {
    const bar = document.querySelector(".right-of-crumbs");
    const btn = document.createElement("a");
    btn.textContent = task.name;
    btn.setAttribute("title", task.help);
    btn.classList.add("btn");
    btn.setAttribute("tabindex", "0");
    bar?.insertAdjacentElement("beforebegin", btn);
  }
  function getCourseID2() {
    return window.location.href.match(/courses\/(\d+)/)?.[1] ?? "NO_COURSE_ID";
  }
  function goto(path_) {
    const id = getCourseID2();
    const newLoc = `${ROOT_URL}/courses/${id}/${path_}`;
    if (window.location.href === newLoc) {
      window.location.reload();
    } else {
      window.location.href = newLoc;
    }
  }
  function curTask() {
    const id = getCourseID2();
    const str = localStorage.getItem(`ccau_${id}_task`);
    const num = Number(str);
    return isNaN(num) ? null : num;
  }
  function setTask(task) {
    const id = getCourseID2();
    localStorage.setItem(`ccau_${id}_task`, task.toString());
  }

  // out/index.js
  async function main() {
    if (!document.querySelector("#global_nav_accounts_link")) {
      throw new Error("Only admins can use CCAU");
    }
    if (await isLiveCourse()) {
      throw new Error("CCAU is disabled in live courses");
    }
    const tasks = getTasks();
    const taskNum = curTask() ?? 0;
    const task = tasks[taskNum];
    const prevNum = Math.max(0, taskNum - 1);
    const prev = tasks[prevNum];
    const nextNum = (taskNum + 1) % tasks.length;
    const next = tasks[nextNum];
    prevArrow(prev, () => prevTask(tasks));
    displayCurrent(task);
    nextArrow(next, () => nextTask(tasks));
  }
  function prevTask(tasks) {
    const taskNum = curTask() ?? 0;
    const prevNum = Math.max(0, taskNum - 1);
    const prev = tasks[prevNum];
    setTask(prevNum);
    goto(prev.path);
  }
  function nextTask(tasks) {
    const taskNum = curTask() ?? 0;
    const nextNum = (taskNum + 1) % tasks.length;
    const next = tasks[nextNum];
    if (nextNum === 0) {
      return;
    }
    setTask(nextNum);
    goto(next.path);
  }
  main();
})();
