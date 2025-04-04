import { Maybe, getCourseID } from "./ccau";
import { Task } from "./task";

/// Add a button which displays help text when hovered over

export function addButton(task: Task, fn: VoidFunction, label: string) {
    const slot = document.querySelector(".right-of-crumbs");
    const button = document.createElement("a");

    button.textContent = label;
    button.classList.add("btn");
    button.setAttribute("tabindex", "0");
    button.addEventListener("click", fn, false);
    button.setAttribute("title", task.help);

    slot?.insertAdjacentElement("beforebegin", button);
}

/// Change the page to the specified path within the current course

export function goto(path_: string) {
    const id = getCourseID();
    const newLoc = `https://se.instructure.com/courses/${id}/${path_}`;

    if (window.location.href === newLoc) {
        window.location.reload();
    } else {
        window.location.href = newLoc;
    }
}

/// Fetch the current task from localStorage

export function getCurrentTask(): Maybe<number> {
    const id = getCourseID();
    const taskNum = Number(localStorage.getItem(`ccau_${id}_task`));

    return isNaN(taskNum) ? null : taskNum;
}

/// Write a new task index to localStorage

export function setCurrentTask(taskNum: number) {
    const id = getCourseID();
    localStorage.setItem(`ccau_${id}_task`, taskNum.toString());
}
