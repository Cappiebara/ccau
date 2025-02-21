/// Replica for Haskell's Maybe type to handle all variants of optional data

export type Maybe<T> = T | null | undefined;

/// Determine if the current user has admin privileges

export function isAdmin(): boolean {
    const adminButton = document.querySelector("#global_nav_accounts_link");
    return adminButton ? true : false;
}

/// Get the course ID from the URL or return "NO_COURSE_ID"

export function getCourseID(): string {
    return window.location.href.match(/courses\/(\d+)/)?.[1] ?? "NO_COURSE_ID";
}

/// A course is considered "live" if the start date is before the current date
/// Note that concluded courses are also "live" for this purpose

export async function isLiveCourse(): Promise<boolean> {
    const response = await fetch("https://se.instructure.com/api/v1/courses/" + getCourseID());
    const data = await response.json();

    return new Date(data.start_at) < new Date();
}

/// Require confirmation from the user before doing anything irreversible

export async function ccauConfirm(msg: string): Promise<boolean> {
    return new Promise((resolve) => {
        const didConfirm = confirm("Are you sure you want to " + msg + "?");
        resolve(didConfirm);
    });
}

/// Run `callback` every time `element` changes

export function observeDOM(element: Element, callback: () => void) {
    const observer = new MutationObserver(callback);

    observer.observe(element, {
        childList: true
    })

    return observer;
}

/// Simulate a mouse click on the button registered at `sel`

export function clickButton(sel: string) {
    const element = document.querySelector(sel);
    const button = element as Maybe<HTMLElement>;

    button?.click();
}
