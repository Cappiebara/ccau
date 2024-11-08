import { ccau_confirm } from "../live";
import * as u from "../utils";
import { isEmpty } from "./utils";

function clickDelete() {
    const sel = ".ui-kyle-menu";
    const menus = Array.from(document.querySelectorAll(sel));

    menus
        .filter((m) => m.getAttribute("aria-hidden") === "false")
        .forEach((m) => u.getChild(m as HTMLElement, [5, 0])?.click());
}

async function removeEmpty() {
    if (!await ccau_confirm("delete empty modules")) {
        return;
    }

    const orig = u.overrideConfirm();
    const mods = u.moduleList();

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
