// ==UserScript==
// @name        Discussions
// @namespace   CCAU
// @description Automate course copies
// @match       https://*.instructure.com/courses/*/discussion_topics
// @version     0.1.1-alpha
// @author      CIDT
// @grant       none
// @license     GPL-3.0-or-later
// ==/UserScript==
"use strict";
(() => {
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
  async function ccau_confirm(msg) {
    return new Promise((resolve) => {
      const didConfirm = confirm("Are you sure you want to " + msg + "?");
      resolve(didConfirm);
    });
  }

  // out/utils.js
  function observeDOM(element, callback) {
    const observer = new MutationObserver(callback);
    observer.observe(element, {
      childList: true
    });
    return observer;
  }
  async function deleteDiscussions() {
    if (!await ccau_confirm("delete all discussions")) {
      return;
    }
    const sel = ".discussions-index-manage-menu";
    const rows = Array.from(document.querySelectorAll(sel));
    rows.map((r) => r.children[0].children[0]).forEach((b) => {
      b.click();
      const sel0 = "#delete-discussion-menu-option";
      const sel1 = "#confirm_delete_discussions";
      const menuOpt = document.querySelector(sel0);
      const confirmDelete = document.querySelector(sel1);
      menuOpt?.click();
      confirmDelete?.click();
    });
  }
  function addButton() {
    const sel = ".recent-activity-text-container";
    const appExists = document.querySelector(sel);
    const btnExists = document.querySelector("#ccau_delete_discussions");
    if (!appExists || btnExists) {
      return;
    }
    const bar = document.querySelector(sel);
    const btn = document.createElement("a");
    btn.id = "ccau_delete_discussions";
    btn.textContent = "Delete All Discussions";
    btn.classList.add("btn");
    btn.setAttribute("tabindex", "0");
    btn.addEventListener("click", deleteDiscussions);
    bar?.insertAdjacentElement("afterbegin", btn);
  }

  // out/index.js
  async function main() {
    if (!document.querySelector("#global_nav_accounts_link")) {
      throw new Error("Only admins can use CCAU");
    }
    if (await isLiveCourse()) {
      throw new Error("CCAU is disabled in live courses");
    }
    observeDOM(document.body, () => setTimeout(addButton, 500));
  }
  main();
})();
