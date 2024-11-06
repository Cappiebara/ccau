import { Maybe } from "../types";
import * as u from "../utils";

export function isEmpty(m: HTMLElement): boolean {
  const mod: Maybe<HTMLElement> = m.parentElement?.parentElement;
  return u.getChild(mod as Maybe<HTMLElement>, [2, 0])?.children.length === 0;
}

export function getReactHandler(obj: object): Maybe<string> {
  const sel: string = "__reactEventHandler";
  const sel2: string = "__reactProps"; // TODO: Investigate this more. Did it change everywhere???
  const keys: string[] = Object.keys(obj);
  const key: Maybe<string> = keys.find((k) => k.startsWith(sel) || k.startsWith(sel2));

  return key;
}
