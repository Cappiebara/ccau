import { clickButton } from "./utils";

function deleteAll() {
    const sel: string = ".select-page-checkbox";
    const sel2: string = "#ccau_selectAll";
    const checked = (document.querySelector(sel2) as HTMLInputElement).checked;

    const updatedPages: string[] = [
        "University Information",
        "✏️SE Evaluation Information",
        "Prerequisite Knowledge/Skills",
    ]

    Array.from(document.querySelectorAll(sel))
        .map((e) => e as HTMLInputElement)
        .filter((e) => e.checked != checked)
        .filter((e) => updatedPages.find((p) => e.ariaLabel?.includes(p)) === undefined)
        .forEach((e) => e.click());

    if (checked) {
        clickButton(".delete_pages");
    }
}

export function addButton() {
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
