import { Maybe } from "../types";
import { getChild } from "../utils";

export function actOnDates(idc: number[], fn: (nm: string) => void) {
  const rows: NodeListOf<Element> = document.querySelectorAll(".ig-row");
  const len: number = rows.length;

  for (let i: number = 0; i < len; i++) {
    const rowItem: Maybe<HTMLElement> = rows[i] as Maybe<HTMLElement>;
    const label: Maybe<HTMLElement> = getChild(rowItem, [2, 0]);
    const btn: Maybe<HTMLElement> = getChild(rowItem, idc);
    const nm: string = label?.innerText || "";
    const rgx: RegExp = /^\*?[a-z]{3,12} \d{1,2} - [a-z]{0,12} ?\d{1,2}\*?$/;

    if (!rgx.test(nm.toLowerCase())) {
      continue;
    }

    btn?.click();
    fn(nm);
  }
}

export function safeNestedJSON<T>(data: any, keys: string[]): Maybe<T> {
  return keys.reduce((acc: any, key: string) => {
    return acc ? acc[key] : null;
  }, data);
}
