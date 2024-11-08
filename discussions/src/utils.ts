import { ccau_confirm } from "./live";
import { Maybe } from "./types";

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

    const sel = ".discussions-index-manage-menu";
    const rows = Array.from(document.querySelectorAll(sel));

    rows
        .map((r) => r.children[0].children[0] as HTMLElement)
        .forEach((b) => {
            b.click();

            const sel0 = "#delete-discussion-menu-option";
            const menuOpt = document.querySelector(sel0) as Maybe<HTMLElement>;
            menuOpt?.click();

            const sel1 = "#confirm_delete_discussions";
            const confirmDelete = document.querySelector(sel1) as Maybe<HTMLElement>;
            confirmDelete?.click();
        });
}

export function addButton() {
    const sel = ".pinned-discussions-v2__wrapper"
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
