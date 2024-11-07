import { Maybe } from "../types";
import * as u from "../utils";

export function isEmpty(m: HTMLElement): boolean {
  const mod = m.parentElement?.parentElement;
  return u.getChild(mod, [2, 0])?.children.length === 0;
}

export function getReactHandler(obj: object): Maybe<string> {
  const sel = "__reactProps";
  const keys = Object.keys(obj);
  const key = keys.find((k) => k.startsWith(sel));

  return key;
}
