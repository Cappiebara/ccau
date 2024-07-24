import { actOnDates } from "./utils";
import { Maybe } from "../types";
import * as u from "../utils";

function clickDelete(_: string) {
  const nodes: NodeListOf<Element> = document.querySelectorAll(".ui-kyle-menu");
  const menus: HTMLElement[] = Array.from(nodes).map((e) => e as HTMLElement);

  menus
    .filter((m) => m.getAttribute("aria-hidden") === "false")
    .forEach((m) => {
      const len: number = m.children.length;
      const btn: Maybe<HTMLElement> = u.getChild(m, [len - 1, 0]);

      btn?.click();
    });
}

export function removeOldDates() {
  const orig: () => boolean = u.overrideConfirm();
  actOnDates([3, 2, 1, -1, 0], clickDelete);
  u.restoreConfirm(orig);
}
