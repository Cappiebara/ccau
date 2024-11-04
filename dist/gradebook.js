// ==UserScript==
// @name        Gradebook
// @namespace   CCAU
// @description Automate course copies
// @match       https://*.instructure.com/courses/*/gradebook
// @version     0.1.1
// @author      CIDT
// @grant       none
// @license     GPL-3.0-or-later
// ==/UserScript==
"use strict";
(() => {
  // out/utils.js
  function observeDOM(element, callback) {
    const observer = new MutationObserver(callback);
    observer.observe(element, {
      childList: true
    });
    return observer;
  }
  function sumPoints() {
    return Array.from(document.querySelectorAll(".assignment-points-possible")).map((e) => e.children[0].textContent ?? "0").map((e) => Number(e.match(/(\d+)/)[0])).reduce((acc, num) => {
      return acc + num;
    }, 0);
  }
  function reloadSum() {
    const button = document.querySelector("#ccau_point_total");
    if (button) {
      button.textContent = "Total: " + sumPoints();
    }
  }
  function addButton() {
    const appExists = document.querySelector(".assignment-points-possible");
    const btnExists = document.querySelector("#ccau_point_total");
    if (!appExists || btnExists) {
      return;
    }
    const bar = document.querySelector("#gradebook-actions");
    const btn = document.createElement("a");
    btn.id = "ccau_point_total";
    btn.textContent = "Total: " + sumPoints();
    btn.classList.add("btn");
    btn.setAttribute("tabindex", "0");
    btn.addEventListener("click", reloadSum);
    bar?.insertAdjacentElement("afterbegin", btn);
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
    observeDOM(document.body, () => setTimeout(addButton, 500));
  }
  main();
})();
