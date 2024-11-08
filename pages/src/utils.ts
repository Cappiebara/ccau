import { Maybe } from "./types";

/// Click the first button matching a given selector

export function clickButton(sel: string) {
    const element = document.querySelector(sel);
    const btn = element as Maybe<HTMLElement>;

    btn?.click();
}

/// Run callback every time a given element changes

export function observeDOM(element: Element, callback: () => void) {
    const observer = new MutationObserver(callback);

    observer.observe(element, {
        childList: true,
    });

    return observer;
}
