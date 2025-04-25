import { Maybe, clickButton } from "./ccau";
import { DATE_HEADERS, showModal } from "./date_modal";
import { addButton, indexOf, lenientName, moduleList, withOverriddenConfirm } from "./utils";

function clickDelete(_: HTMLElement) {
    const nodes = document.querySelectorAll(".ui-kyle-menu");
    const menus = Array.from(nodes).map((e) => e as HTMLElement);

    menus
        .filter((m) => m.getAttribute("aria-hidden") === "false")
        .forEach((m) => (m.querySelector("li > .delete_link") as Maybe<HTMLElement>)?.click());
}

/// SAFETY: This is safe because date headers can be recreated easily

function removeOldDates() {
    withOverriddenConfirm(() => actOnDates(".ig-admin > .cog-menu-container > ul > li > .delete_link", clickDelete));
}

// Determine if a module item is a date header

function isDateHeader(item: HTMLElement): Boolean {
    const label = item.querySelector(".ig-info > .module-item-title") as Maybe<HTMLElement>;
    const regex = /^\*?[a-z]{3,12} \d{1,2} - [a-z]{0,12} ?\d{1,2}\*?$/;

    if (!label?.innerText || !regex.test(label?.innerText.toLowerCase())) {
        return false;
    }

    return true;
}

/// For each date header, run a given function

function actOnDates(selector: Maybe<string>, fn: (item: HTMLElement) => void) {
    const rows = document.querySelectorAll(".ig-row");
    const len = rows.length;

    for (let i = 0; i < len; i++) {
        const item = rows[i] as Maybe<HTMLElement>;

        if (!item || !isDateHeader(item)) {
            continue;
        }

        if (selector) {
            const button = item?.querySelector(selector) as Maybe<HTMLElement>;
            button?.click();
        }

        fn(item);
    }
}

/// Map a list of dates to the week they represent

function datesToWeeks(dates: string[]): { [key: string]: string } {
    return dates.reduce<{ [key: string]: string }>((acc, date, i) => {
        acc[`Week ${i + 1}`] = date;
        return acc;
    }, {});
}

/// Display the date modal, wait for selection, and return a week-to-date map

async function getDates(): Promise<{ [key: string]: string }> {
    return new Promise((resolve) => {
        showModal().then(async ([semester, term]) => {
            if (!semester || !term) {
                throw new Error("Null semester or term from modal");
            }

            const range = DATE_HEADERS.ranges[semester][term];
            const dates = DATE_HEADERS.dates[semester].slice(range[0] - 1, range[1]);

            resolve(datesToWeeks(dates));
        });
    });
}

/// Make date subheader the default item type for creating a new item
/// SAFETY: This is safe because it clears on refresh

function defaultToSubheader() {
    const sel = "#add_module_item_select";
    const element = document.querySelector(sel);
    const select = element as HTMLSelectElement;
    const options = Array.from(select.options);

    options?.forEach((o) => (o.value = "context_module_sub_header"));
}

/// Set the input textbox for the title

function setInput(val: string) {
    const element = document.querySelector("#sub_header_title");
    const textBox = element as HTMLInputElement;

    textBox.value = val;
}

/// Open the action menu for the nth module

function openMenu(idx: number) {
    const mods = moduleList();
    const parent = mods[idx].parentElement;
    const button = parent?.querySelector(".module_header_items > .ig-header-admin > .add_module_item_link") as Maybe<HTMLElement>;

    button?.click();
}

/// Simulate a mouse event

function simulate(element: Element | Document, type: string, x: number, y: number) {
    const event = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
        view: window,
    });

    element.dispatchEvent(event);
}

/// Drag a given module item above another item
/// The scrollIntoView call is VERY IMPORTANT.

async function dragItem(item: HTMLElement) {
    const target = item.closest("ul")?.querySelector("li");
    const handle = item.querySelector(".ig-handle > .draggable-handle");

    if (!target || !handle) {
        return;
    }

    handle.scrollIntoView();

    const sourceBox = handle.getBoundingClientRect();
    const startX = sourceBox.left + sourceBox.width / 2;
    const startY = sourceBox.top + sourceBox.height / 2;

    const targetBox = target.getBoundingClientRect();
    const endX = targetBox.left + targetBox.width / 2;
    const endY = targetBox.top + targetBox.height / 2;

    simulate(handle, "mousedown", startX, startY);
    simulate(document, "mousemove", startX + 1, startY + 1);
    simulate(document, "mousemove", endX, endY);

    target.scrollIntoView();

    simulate(document, "mouseup", endX, endY);
}

/// Click the bublish button for all dates

function publish() {
    actOnDates(".ig-admin > span[title='Publish'] > i", (_) => { });
}

/// Move all date headers to the top of their respective modules

function moveToTop() {
    actOnDates(null, dragItem);
}

async function addDates() {
    removeOldDates();
    defaultToSubheader();

    const dates = await getDates();
    const mods = moduleList();

    mods
        .map((m) => lenientName(m.title))
        .filter((n) => n && dates[n])
        .map((n) => n as string)
        .forEach((n) => {
            openMenu(indexOf(n));
            setInput(dates[n]);
            clickButton(".add_item_button");
        });

    setTimeout(moveToTop, 1E3);
    setTimeout(publish, 1E3);
}

export function addDateButton() {
    addButton("Add Dates", addDates);
}
