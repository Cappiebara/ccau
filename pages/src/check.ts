import { clickButton } from "./utils";
import { Maybe } from "./types";

function deleteAll() {
  const s: string = ".select-page-checkbox";
  const s2: string = "#ccau_selectAll";
  const chk: boolean = (document.querySelector(s2) as HTMLInputElement).checked;

  const updatedPages: string[] = [
    "University Information",
    "✏️SE Evaluation Information",
    "Prerequisite Knowledge/Skills",
  ]

  Array.from(document.querySelectorAll(s))
    .map((e) => e as HTMLInputElement)
    .filter((e) => e.checked != chk)
    .filter((e) => updatedPages.find((p) => e.ariaLabel?.includes(p)) === undefined)
    .forEach((e) => e.click());

  if (chk) {
    clickButton(".delete_pages");
  }
}

export function addButton() {
  const row: Maybe<Element> = document.querySelector("thead");
  const slot: Maybe<Element> = row?.children[0].children[0];
  const selectAll: HTMLInputElement = document.createElement("input");

  selectAll.type = "checkbox";
  selectAll.id = "ccau_selectAll";
  selectAll.onclick = deleteAll;

  if (!row || slot?.innerHTML.includes("ccau_selectAll")) {
    return;
  }

  slot?.appendChild(selectAll);
}
