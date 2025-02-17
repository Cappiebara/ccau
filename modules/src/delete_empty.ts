import { ccauConfirm } from "ccau";
import { addButton, isEmpty, moduleList, openMenuItem, withOverriddenConfirm } from "utils";

/// SAFETY: This is safe because we confirm with the user and check for content

async function removeEmpty() {
    if (!await ccauConfirm("delete empty modules")) {
        return;
    }

    withOverriddenConfirm(() => {
        const modules = moduleList();

        modules
            .filter((m) => isEmpty(m))
            .map((m) => modules.indexOf(m))
            .forEach((i) => openMenuItem(i, "Delete this module"));
    });
}

export function addDeleteButton() {
    addButton("Remove Empty", removeEmpty);
}
