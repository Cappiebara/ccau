import * as u from "../utils";
import { Maybe } from "../types";
import { actOnDates } from "./utils";
import { removeOldDates } from "./del";
import { getDates } from "./update";

function defaultToSubheader() {
  const sel: string = "#add_module_item_select";
  const element: Maybe<Element> = document.querySelector(sel);
  const select: HTMLSelectElement = element as HTMLSelectElement;
  const options: HTMLOptionElement[] = Array.from(select.options);

  options?.forEach((opt) => (opt.value = "context_module_sub_header"));
}

function publish() {
  actOnDates([3, 1, 0], (_) => {});
}

function setInput(sel: string, val: string) {
  const element: Maybe<Element> = document.querySelector(sel);
  const textBox: HTMLInputElement = element as HTMLInputElement;

  textBox.value = val;
}

async function addDates() {
  removeOldDates();
  defaultToSubheader();

  const dates: { [key: string]: string } = await getDates();
  const mods: HTMLElement[] = u.moduleList();

  mods
    .map((m) => u.lenientName(m.title))
    .filter((n) => n && dates[n])
    .map((n) => n as string)
    .forEach((n) => {
      u.openMenu(u.indexOf(n), 2);
      setInput("#sub_header_title", dates[n]);
      u.clickButton(".add_item_button");
    });

  setTimeout(publish, 1500);
}

export function dateButton() {
  u.addButton("Add Dates", addDates, ".header-bar-right__buttons");
}
