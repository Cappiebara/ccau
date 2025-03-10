import { Maybe } from "./ccau";

/// Determine if a module has any content; this works on collapsed modules too

export function isEmpty(m: HTMLElement): boolean {
    const module = m.parentElement?.parentElement;
    const list = module?.querySelector(".content > ul");

    return list?.children.length === 0;
}

/// Novel technique to get the internal React handler to manipulate forms

export function getReactHandler(obj: object): Maybe<string> {
    return Object.keys(obj).find((k) => k.startsWith("__reactProps"));
}

/// Given an element and a child-index path, return the specified child
/// NB: Negative numbers in the CI path mean "n from the end"
/// SAFETY: Hardcoded CI paths have been broken by Canvas updates before
/// so they should be replaced by CSS selectors when possible

// export function getChild(element: Maybe<HTMLElement>, indices: number[]): Maybe<HTMLElement> {
//     let cur = element;
//
//     indices.forEach((i_) => {
//         const children = cur?.children as Maybe<HTMLCollection>;
//         const length = children?.length ?? 0;
//         const i = i_ >= 0 ? i_ : length + i_;
//
//         length > i ? (cur = children![i] as HTMLElement) : null;
//     });
//
//     return cur;
// }

/// Open the option with a given `name` on the menu for module at index `index`

export function openMenuItem(index: number, name: string) {
    const modules = moduleList();
    const parent = modules[index].parentElement;
    const button = parent?.querySelector(`.ig-header-admin > .al-options > li > a[title='${name}']`);

    (button as Maybe<HTMLElement>)?.click();
}

/// Add a button to the row at the top which has Collapse All, etc.

export function addButton(name: string, fn: VoidFunction) {
    const slot = document.querySelector(".header-bar-right__buttons");
    const button = document.createElement("a");

    button.textContent = name;
    button.classList.add("btn");
    button.setAttribute("tabindex", "0");
    button.addEventListener("click", fn, false);

    slot?.insertAdjacentElement("afterbegin", button);
    slot?.insertAdjacentHTML("afterbegin", "&nbsp;");
}

/// In the list of modules, find the index of the first module matching a
/// given `name` (case insensitive), which has an index after `skip`

export function indexOf(name: string, skip: number = 0): number {
    return moduleList().findIndex(
        (m, i) => i >= skip && m.title.toLowerCase() === name.toLowerCase()
    );
}

/// indexOf but it uses lenientName rather than toLowerCase

export function lenientIndexOf(name: string, skip: number = 0): number {
    return moduleList().findIndex(
        (m, i) => i >= skip && lenientName(m.title) === lenientName(name)
    );
}

/// Given a module name, find the template module with the closest match
/// START HERE is an exception because it's used to find the skip count

export function lenientName(name: string): Maybe<string> {
    const lowerName = name.toLowerCase();
    const pattern = /week[^\d]*\d{1,2}(?=.?)/;
    const matches = lowerName.match(pattern);
    const result = matches ? matches[0] : null;

    if (lowerName.includes("start") && lowerName.includes("here")) {
        return "START HERE";
    }

    return result ? "Week " + result.split(" ")[1] : null;
}

/// Return every module, i.e., collapse_module_link, as an HTMLElement

export function moduleList(): HTMLElement[] {
    return Array.from(document.querySelectorAll(".collapse_module_link"));
}

/// Perform a function with the `confirm` popup automatically accepted
/// SAFETY: We restore the original function afterwards, but this could
/// lead to a race condition if something else tries to call `confirm`

export function withOverriddenConfirm(fn: VoidFunction) {
    const orig = window.confirm;
    window.confirm = () => true;
    fn();
    window.confirm = orig;
}
