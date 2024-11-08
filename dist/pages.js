// ==UserScript==
// @name        Pages
// @namespace   CCAU
// @description Automate course copies
// @match       https://*.instructure.com/courses/*/pages
// @version     0.1.2
// @author      CIDT
// @grant       none
// @license     GPL-3.0-or-later
// ==/UserScript==
"use strict";
(() => {
  // out/utils.js
  function clickButton(sel) {
    const element = document.querySelector(sel);
    const btn = element;
    btn?.click();
  }
  function observeDOM(element, callback) {
    const observer = new MutationObserver(callback);
    observer.observe(element, {
      childList: true
    });
    return observer;
  }

  // out/check.js
  function deleteAll() {
    const sel = ".select-page-checkbox";
    const sel2 = "#ccau_selectAll";
    const checked = document.querySelector(sel2).checked;
    const updatedPages = [
      "University Information",
      "\u270F\uFE0FSE Evaluation Information",
      "Prerequisite Knowledge/Skills"
    ];
    Array.from(document.querySelectorAll(sel)).map((e) => e).filter((e) => e.checked != checked).filter((e) => updatedPages.find((p) => e.ariaLabel?.includes(p)) === void 0).forEach((e) => e.click());
    if (checked) {
      clickButton(".delete_pages");
    }
  }
  function addButton() {
    const row = document.querySelector("thead");
    const slot = row?.children[0].children[0];
    const selectAll = document.createElement("input");
    selectAll.type = "checkbox";
    selectAll.id = "ccau_selectAll";
    selectAll.onclick = deleteAll;
    if (!row || slot?.innerHTML.includes("ccau_selectAll")) {
      return;
    }
    slot?.appendChild(selectAll);
  }

  // out/env.js
  var ROOT_URL = "https://se.instructure.com";

  // out/live.js
  function getCourseID() {
    return window.location.href.match(/courses\/(\d+)/)?.[1] ?? "NO_COURSE_ID";
  }
  async function isLiveCourse() {
    const response = await fetch(ROOT_URL + "/api/v1/courses/" + getCourseID());
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
    observeDOM(document.body, () => setTimeout(addButton, 1e3));
  }
  main();
})();
