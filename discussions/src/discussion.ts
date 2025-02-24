import { ccauConfirm, clickButton } from "./ccau";

/// SAFETY: This is safe because we confirm with the user

async function deleteDiscussion() {
    if (!await ccauConfirm("delete all discussions")) {
        return;
    }

    Array.from(document.querySelectorAll(".discussions-index-manage-menu > span > button"))
        .map((e) => e as HTMLElement)
        .forEach((b) => {
            b.click();

            setTimeout(() => clickButton("#delete-discussion-menu-option"), 250);
            setTimeout(() => clickButton("#confirm_delete_discussions"), 250);
        });
}

export function addButton() {
    const slot = document.querySelector(".pinned-discussions-v2__wrapper");
    const button = document.createElement("a");

    button.id = "ccau_deleteDiscussion";
    button.textContent = "Delete All Discussions";
    button.classList.add("btn");
    button.setAttribute("tabindex", "0");
    button.addEventListener("click", deleteDiscussion);

    if (!slot || slot?.innerHTML.includes(button.id)) {
        return;
    }

    slot?.insertAdjacentElement("afterbegin", button);
}
