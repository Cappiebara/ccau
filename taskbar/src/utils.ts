import { ROOT_URL } from "./env";
import { Task } from "./task";
import { Maybe } from "./types";

/// Add an arrow button, either <-- to go to the previous task
/// or --> to go to the next task. Hover to display the help text

function addArrowButton(task: Task, fn: VoidFunction, label: string) {
    const bar = document.querySelector(".right-of-crumbs");
    const btn = document.createElement("a");

    btn.textContent = label;
    btn.setAttribute("title", task.help);
    btn.classList.add("btn");
    btn.setAttribute("tabindex", "0");
    btn.addEventListener("click", fn);

    bar?.insertAdjacentElement("beforebegin", btn);
}

/// Easy shortcuts for the above

export function prevArrow(task: Task, fn: VoidFunction) {
    addArrowButton(task, fn, "<--");
}

export function nextArrow(task: Task, fn: VoidFunction) {
    addArrowButton(task, fn, "-->");
}

/// Add the name of the current task to the taskbar
/// When hovered over, it displays the help for the task

export function displayCurrent(task: Task) {
    const bar = document.querySelector(".right-of-crumbs");
    const btn = document.createElement("a");

    btn.textContent = task.name;
    btn.setAttribute("title", task.help);
    btn.classList.add("btn");
    btn.setAttribute("tabindex", "0");

    bar?.insertAdjacentElement("beforebegin", btn);
}

/// This is so we can store progress in multiple courses

function getCourseID(): string {
    return window.location.href.match(/courses\/(\d+)/)?.[1] ?? "NO_COURSE_ID";
}

/// Go to a given page in the course

export function goto(path_: string) {
    const id = getCourseID();
    const newLoc = `${ROOT_URL}/courses/${id}/${path_}`;

    if (window.location.href === newLoc) {
        window.location.reload();
    } else {
        window.location.href = newLoc;
    }
}

/// Get the current task from this course

export function curTask(): Maybe<number> {
    const id = getCourseID();
    const str = localStorage.getItem(`ccau_${id}_task`);
    const num = Number(str);

    return isNaN(num) ? null : num;
}

/// ...and set it to a given task

export function setTask(task: number) {
    const id = getCourseID();
    localStorage.setItem(`ccau_${id}_task`, task.toString());
}
