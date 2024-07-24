import * as u from "../utils";
import { isEmpty } from "./utils";

function clickDelete() {
  const sel: string = ".ui-kyle-menu";
  const menus: Element[] = Array.from(document.querySelectorAll(sel));

  menus
    .filter((m) => m.getAttribute("aria-hidden") === "false")
    .forEach((m) => u.getChild(m as HTMLElement, [5, 0])?.click());
}

function removeEmpty() {
  const orig: () => boolean = u.overrideConfirm();
  const mods: HTMLElement[] = u.moduleList();

  mods
    .filter((m) => isEmpty(m))
    .map((m) => mods.indexOf(m))
    .forEach((i) => {
      u.openMenu(i, 3);
      clickDelete();
    });

  u.restoreConfirm(orig);
}

export function deleteButton() {
  u.addButton("Remove Empty", removeEmpty, ".header-bar-right__buttons");
}
