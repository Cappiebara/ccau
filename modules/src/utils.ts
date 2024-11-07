import { Maybe } from "./types";

/// Add a button to the first element matching a given selector

export function addButton(name: string, fn: VoidFunction, sel: string) {
  const bar = document.querySelector(sel);
  const btn = document.createElement("a");

  btn.textContent = name;
  btn.classList.add("btn");
  btn.setAttribute("tabindex", "0");
  btn.addEventListener("click", fn, false);

  bar?.insertAdjacentElement("afterbegin", btn);
  bar?.insertAdjacentHTML("afterbegin", "&nbsp;");
}

/// Click the first button matching a given selector

export function clickButton(sel: string) {
  const element = document.querySelector(sel);
  const btn = element as Maybe<HTMLElement>;

  btn?.click();
}

/// Given an element and a child-index path, return the specified child
/// NB: Negative numbers in the child-index path mean "n from the end"

export function getChild(
  element: Maybe<HTMLElement>,
  indices: number[],
): Maybe<HTMLElement> {
  let cur = element;

  indices.forEach((i_) => {
    const children = cur?.children as Maybe<HTMLCollection>;
    const len = children?.length ?? 0;
    const i = i_ >= 0 ? i_ : len + i_;

    len > i ? (cur = children![i] as HTMLElement) : null;
  });

  return cur;
}

/// In the list of modules, get the index of the first one with a given name

export function indexOf(name: string, skip: number = 0): number {
  return moduleList().findIndex(
    (m, i) => i >= skip && m.title.toLowerCase() === name.toLowerCase(),
  );
}

/// indexOf, but it works using the lenientName function below

export function lenientIndexOf(name: string, skip: number = 0): number {
  return moduleList().findIndex(
    (m, i) => i >= skip && lenientName(m.title) === lenientName(name),
  );
}

/// Given a module name, find the template module with the closest match
/// Ideally, this would be a Damerau-Levenshtein comparison but ya girl's lazy
/// START HERE is an exception included because it's used to find the skip number

export function lenientName(name: string): Maybe<string> {
  const ln = name.toLowerCase();
  const rgx = /week[^\d]*\d{1,2}(?=.?)/;
  const matches = ln.match(rgx);
  const result = matches ? matches[0] : null;

  if (ln.includes("start") && ln.includes("here")) {
    return "START HERE";
  }

  if (!result) {
    return null;
  }

  return "Week " + result.split(" ")[1];
}

/// Return every module as an HTMLElement

export function moduleList(): HTMLElement[] {
  const sel = ".collapse_module_link";
  const mods: HTMLElement[] = Array.from(document.querySelectorAll(sel));

  return mods;
}

/// Open the option btnIdx on the hamburger menu for module idx

export function openMenu(idx: number, btnIdx: number) {
  const mods = moduleList();
  const hpe = mods[idx].parentElement;
  const btn = getChild(hpe, [5, 0, btnIdx]);

  btn?.click();
}

/// Return true for the global confirm() function
/// This is done so that we can automate removing items

export function overrideConfirm(): () => boolean {
  const orig= window.confirm;
  window.confirm = () => true;

  return orig;
}

/// Fix it as soon as we finish the above

export function restoreConfirm(orig: () => boolean) {
  window.confirm = orig;
}
