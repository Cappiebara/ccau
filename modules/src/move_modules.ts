import { Maybe, ccauConfirm, clickButton } from "./ccau";
import { addButton, getReactHandler, indexOf, isEmpty, lenientIndexOf, lenientName, moduleList, openMenuItem } from "./utils";

/// Select the desired destination module from the React form
/// or return false if it fails for any reason

function selectDestination(name: string): boolean {
    const form = document.querySelector(".move-select-form") as Maybe<HTMLSelectElement>;

    if (!form) {
        return false;
    }

    const options = Array.from(form.options);
    const handlerName = getReactHandler(form);
    const handler: Maybe<any> = form[handlerName ?? ("" as Maybe<any>)];
    const index = options.findIndex((o) => o.text === name);

    if (index === -1) {
        return false;
    }

    form.selectedIndex = index;
    form.value = options[index].value;
    handler?.onChange({ target: { value: options[index].value } });

    return true;
}

/// SAFETY: This is safe because we confirm with the user

async function moveAll() {
    if (!await ccauConfirm("move content into template modules")) {
        return;
    }

    const startIndex = lenientIndexOf("START HERE", 1);

    moduleList().slice(startIndex).filter((m) => !isEmpty(m) && lenientName(m.title)).forEach((m) => {
        const name = lenientName(m.title);
        const index = indexOf(m.title, startIndex);

        openMenuItem(index, "Move module contents");

        if (name && selectDestination(name)) {
            clickButton("#move-item-tray-submit-button");
        }
    });
}

export function addMoveButton() {
    addButton("Auto-Move", moveAll);
}
