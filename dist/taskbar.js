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
  var DATA_URL = "https://pastebin.com/raw/DvDaEQEP";
  var ROOT_URL = "https://se.instructure.com";

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
  function getCourseID() {
    return window.location.href.match(/courses\/(\d+)/)?.[1] ?? "NO_COURSE_ID";
  }
  function goto(path_) {
    const newLoc = `${ROOT_URL}/courses/${getCourseID()}/${path_}`;
    if (window.location.href === newLoc) {
      window.location.reload();
    } else {
      window.location.href = newLoc;
    }
  }
  function curTask() {
    const id = getCourseID();
    const str = localStorage.getItem(`ccau_${id}_task`);
    const num = Number(str);
    return isNaN(num) ? null : num;
  }
  function setTask(task) {
    const id = getCourseID();
    localStorage.setItem(`ccau_${id}_task`, task.toString());
  }

  // out/task.js
  function update() {
    const day = 1e3 * 60 * 60 * 24;
    const now = Date.now();
    const last = Number(localStorage.getItem("ccau_task_ts")) ?? 0;
    if (now - last < day) {
      return;
    }
    fetch(DATA_URL).then((response) => response.json()).then((data) => {
      localStorage.setItem("ccau_task", JSON.stringify(data));
      localStorage.setItem("ccau_task_ts", now.toString());
      location.reload();
    });
  }
  function getTasks() {
    update();
    const tasks = localStorage.getItem("ccau_task") ?? "[]";
    const parsed = JSON.parse(tasks);
    return parsed.tasks;
  }

  // out/live.js
  function getCourseID2() {
    return window.location.href.match(/courses\/(\d+)/)?.[1] ?? "NO_COURSE_ID";
  }
  async function isLiveCourse() {
    const response = await fetch(ROOT_URL + "/api/v1/courses/" + getCourseID2());
    const data = await response.json();
    return new Date(data["start_at"]) < /* @__PURE__ */ new Date();
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
