import * as u from "../utils";
import { actOnDates } from "./utils";
import { removeOldDates } from "./del";
import { getDates } from "./update";

function defaultToSubheader() {
  const sel = "#add_module_item_select";
  const element = document.querySelector(sel);
  const select = element as HTMLSelectElement;
  const options = Array.from(select.options);

  options?.forEach((opt) => (opt.value = "context_module_sub_header"));
}

function publish() {
  actOnDates([3, 1, 0], (_) => {});
}

function setInput(sel: string, val: string) {
  const element = document.querySelector(sel);
  const textBox = element as HTMLInputElement;

  textBox.value = val;
}

async function addDates() {
  removeOldDates();
  defaultToSubheader();

  const dates = await getDates();
  const mods = u.moduleList();

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
