import { Maybe } from "./ccau";

/// Open the option with a given `name` on the menu for a given group

export function openMenuItem(g: HTMLElement, name: string) {
    const button = g.querySelector(`.ig-header > .ag-header-controls > div > .al-options > li > a[aria-label='${name}']`);
    (button as Maybe<HTMLElement>)?.click();
}

/// Perform a function with the `confirm` popup automatically accepted
/// SAFETY: We restore the original function afterwards, but this could
/// lead to a race condition if something else tries to call `confirm`

function withOverriddenConfirm(fn: VoidFunction) {
    const orig = window.confirm;
    window.confirm = () => true;
    fn();
    window.confirm = orig;
}

/// Determine if a group has any content; this works on collapsed groups too

function isEmpty(g: HTMLElement): boolean {
    return g.querySelector(".assignment-list > ul > .no-items") !== null;
}

/// SAFETY: This is safe because the groups have no content
/// Should a group have content anyway, the deletion will fail

function deleteEmptyGroups() {
    withOverriddenConfirm(() => {
        Array.from(document.querySelectorAll(".assignment_group"))
            .map((e) => e as HTMLElement)
            .filter(isEmpty)
            .forEach((g) => openMenuItem(g, "Delete Assignment Group"))
    });
}

export function addButton() {
    const slot = document.querySelector(".header-bar-right");
    const button = document.createElement("a");

    button.id = "ccau_deleteEmptyAssignmentGroups";
    button.textContent = "Delete Empty Groups";
    button.classList.add("btn");
    button.setAttribute("tabindex", "0");
    button.addEventListener("click", deleteEmptyGroups);

    if (!slot || slot?.innerHTML.includes(button.id)) {
        return;
    }

    slot?.insertAdjacentElement("afterbegin", button);
}
