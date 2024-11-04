import { Maybe } from "./types";
import { ccau_confirm } from "./live";

export function observeDOM(element: Element, callback: () => void) {
  const observer = new MutationObserver(callback);

  observer.observe(element, {
    childList: true,
  });

  return observer;
}

async function deleteDiscussions() {
  if (!await ccau_confirm("delete all discussions")) {
    return;
  }

  const sel: string = ".discussions-index-manage-menu";
  const rows: Element[] = Array.from(document.querySelectorAll(sel));

  rows
    .map((r) => r.children[0].children[0] as HTMLElement)
    .forEach((b) => {
      b.click();

      const sel0: string = "#delete-discussion-menu-option";
      const sel1: string = "#confirm_delete_discussions";
      const menuOpt: Maybe<HTMLElement> = document.querySelector(sel0) as Maybe<HTMLElement>;
      const confirmDelete: Maybe<HTMLElement> = document.querySelector(sel1) as Maybe<HTMLElement>;

      menuOpt?.click();
      confirmDelete?.click();
    });
}

export function addButton() {
  const sel: string = ".recent-activity-text-container"
  const appExists: Maybe<Element> = document.querySelector(sel);
  const btnExists: Maybe<Element> = document.querySelector("#ccau_delete_discussions");

  if (!appExists || btnExists) {
    return;
  }

  const bar: Maybe<Element> = document.querySelector(sel);
  const btn: Maybe<Element> = document.createElement("a");

  btn.id = "ccau_delete_discussions";
  btn.textContent = "Delete All Discussions";
  btn.classList.add("btn");
  btn.setAttribute("tabindex", "0");
  btn.addEventListener("click", deleteDiscussions);

  bar?.insertAdjacentElement("afterbegin", btn);
}
