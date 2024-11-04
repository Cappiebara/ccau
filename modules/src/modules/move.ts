import * as u from "../utils";
import { Maybe } from "../types";
import { isEmpty, getReactHandler } from "./utils";
import { ccau_confirm } from "../live";

function clickMoveContents() {
  const sel: string = ".ui-kyle-menu";
  const menus: Element[] = Array.from(document.querySelectorAll(sel));

  menus
    .filter((m) => m.getAttribute("aria-hidden") === "false")
    .forEach((m) => u.getChild(m as HTMLElement, [2, 0])?.click());
}

function selectDestination(name: string): boolean {
  const form_el: Maybe<Element> = document.querySelector(".move-select-form");

  if (!form_el) {
    return false;
  }

  const form: HTMLSelectElement = form_el as HTMLSelectElement;
  const options: HTMLOptionElement[] = Array.from(form.options);
  const handlerName: Maybe<string> = getReactHandler(form);
  const handler: Maybe<any> = form[handlerName ?? ("" as any)];
  const i: number = options.findIndex((o) => o.text === name);

  if (i === -1 || !form) {
    return false;
  }

  form.selectedIndex = i;
  form.value = options[i].value;
  handler.onChange({ target: { value: options[i].value } });

  return true;
}

async function moveAll() {
  if (!await ccau_confirm("move content into template modules")) {
    return;
  }

  const startIdx: number = u.lenientIndexOf("START HERE", 1);
  const mods: HTMLElement[] = u.moduleList();

  if (startIdx === -1) {
    throw new Error("START HERE not found, add it and reload");
  }

  mods
    .slice(startIdx)
    .filter((m) => !isEmpty(m) && u.lenientName(m.title))
    .forEach((m) => {
      const title: string = m.title;
      const name: string = u.lenientName(title)!;
      const index: number = u.indexOf(title, startIdx);

      u.openMenu(index, 3);
      clickMoveContents();

      if (selectDestination(name)) {
        u.clickButton("#move-item-tray-submit-button");
      }
    });
}

export function moveButton() {
  u.addButton("Auto-Move", moveAll, ".header-bar-right__buttons");
}
