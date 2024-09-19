import { Maybe } from "./types";

export function observeDOM(element: Element, callback: () => void) {
  const observer = new MutationObserver(callback);

  observer.observe(element, {
    childList: true,
  });

  return observer;
}

function deleteDiscussions() {
	const sel: string = ".discussions-index-manage-menu";
	const rows: Element[] = Array.from(document.querySelectorAll(sel));
	
	rows
	  .map((r) => r.children[0].children[0])
	  .forEach((b) => {
		  b.click();
		  document.querySelector("#delete-discussion-menu-option").click();
		  document.querySelector("#confirm_delete_discussions").click();
	  });
}

export function addButton() {
  const appExists = document.querySelector(".recent-activity-text-container");
  const btnExists = document.querySelector("#ccau_delete_discussions");

  if (!appExists || btnExists) {
    return;
  }

  const bar: Maybe<Element> = document.querySelector("#recent-activity-text-container");
  const btn: Maybe<Element> = document.createElement("a");

  btn.id = "ccau_delete_discussions";
  btn.textContent = "Delete All Discussions";
  btn.classList.add("btn");
  btn.setAttribute("tabindex", "0");
  btn.addEventListener("click", reloadSum);

  bar?.insertAdjacentElement("afterbegin", btn);
}
