import { isLiveCourse } from "./live";
import { Task, getTasks } from "./task";
import * as u from "./utils";

async function main() {
    if (!document.querySelector("#global_nav_accounts_link")) {
        throw new Error("Only admins can use CCAU");
    }

    if (await isLiveCourse()) {
        throw new Error("CCAU is disabled in live courses")
    }

    const tasks = getTasks();
    const taskNum = u.curTask() ?? 0;
    const task = tasks[taskNum];
    const prevNum = Math.max(0, taskNum - 1);
    const prev = tasks[prevNum];
    const nextNum = (taskNum + 1) % tasks.length;
    const next = tasks[nextNum];

    u.prevArrow(prev, () => prevTask(tasks));
    u.displayCurrent(task);
    u.nextArrow(next, () => nextTask(tasks));
}

function prevTask(tasks: Task[]) {
    const taskNum = u.curTask() ?? 0;
    const prevNum = Math.max(0, taskNum - 1);
    const prev = tasks[prevNum];

    u.setTask(prevNum);
    u.goto(prev.path);
}

function nextTask(tasks: Task[]) {
    const taskNum = u.curTask() ?? 0;
    const nextNum = (taskNum + 1) % tasks.length;
    const next = tasks[nextNum];

    if (nextNum === 0) {
        return;
    }

    u.setTask(nextNum);
    u.goto(next.path);
}

main();
