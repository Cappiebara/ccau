import { Maybe, clickButton } from "./ccau";
import { DATE_HEADERS, showModal } from "./date_modal";
import { addButton, indexOf, lenientName, moduleList, withOverriddenConfirm } from "./utils";

function clickDelete(_: string) {
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

/// For each date header, run a given function

function actOnDates(selectorPath: string, fn: (nm: string) => void) {
    const rows = document.querySelectorAll(".ig-row");
    const len = rows.length;

    for (let i = 0; i < len; i++) {
        const rowItem = rows[i] as Maybe<HTMLElement>;
        const label = rowItem?.querySelector(".ig-info > .module-item-title") as Maybe<HTMLElement>;
        const btn = rowItem?.querySelector(selectorPath) as Maybe<HTMLElement>;
        const regex = /^\*?[a-z]{3,12} \d{1,2} - [a-z]{0,12} ?\d{1,2}\*?$/;

        if (!label?.innerText) {
            continue;
        }

        if (!regex.test(label?.innerText.toLowerCase())) {
            continue;
        }

        btn?.click();
        fn(label.innerText);
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

    options?.forEach((opt) => (opt.value = "context_module_sub_header"));
}

function setInput(val: string) {
    const element = document.querySelector("#sub_header_title");
    const textBox = element as HTMLInputElement;

    textBox.value = val;
}

function openMenu(idx: number) {
    const mods = moduleList();
    const parent = mods[idx].parentElement;
    const btn = parent?.querySelector(".module_header_items > .ig-header-admin > .add_module_item_link") as Maybe<HTMLElement>;

    btn?.click();
}

function publish() {
    actOnDates(".ig-admin > span[title='Publish'] > i", (_) => { });
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

    setTimeout(publish, 1500);
}

export function addDateButton() {
    addButton("Add Dates", addDates);
}
