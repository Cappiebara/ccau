import { Maybe, clickButton } from "././ccau";

/// SAFETY: This is safe because Canvas has its own confirmation alert

function deleteAll() {
    const selectAll = document.querySelector("#ccau_selectAll") as Maybe<HTMLInputElement>;
    const checked = selectAll?.checked;

    const updatedPages: string[] = [
        "University Information",
        "✏️SE Evaluation Information",
        "Prerequisite Knowledge/Skills",
    ];

    Array.from(document.querySelectorAll(".select-page-checkbox"))
        .map((e) => e as HTMLInputElement)
        .filter((e) => e.checked != checked)
        .filter((e) => updatedPages.find((p) => e.ariaLabel?.includes(p)) == undefined)
        .forEach((e) => e.click());

    if (checked) {
        clickButton(".delete_pages");
    }
}

export function addButton() {
    const slot = document.querySelector("thead > tr > th");
    const selectAll = document.createElement("input");

    selectAll.type = "checkbox";
    selectAll.id = "ccau_selectAll";
    selectAll.onclick = deleteAll;

    if (!slot || slot?.innerHTML.includes(selectAll.id)) {
        return;
    }

    slot?.appendChild(selectAll);
}
