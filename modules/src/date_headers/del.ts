import { actOnDates } from "./utils";
import * as u from "../utils";

function clickDelete(_: string) {
  const nodes = document.querySelectorAll(".ui-kyle-menu");
  const menus = Array.from(nodes).map((e) => e as HTMLElement);

  menus
    .filter((m) => m.getAttribute("aria-hidden") === "false")
    .forEach((m) => {
      const len = m.children.length;
      const btn = u.getChild(m, [len - 1, 0]);

      btn?.click();
    });
}

export function removeOldDates() {
  const orig = u.overrideConfirm();
  actOnDates([5, 2, 1, -1, 0], clickDelete);
  u.restoreConfirm(orig);
}
