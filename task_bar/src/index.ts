import { isAdmin, isLiveCourse } from "./ccau";
import { getTasks } from "./task";
import { addButton, getCurrentTask, goto, setCurrentTask } from "./ui";

async function main() {
    if (!isAdmin()) {
        throw new Error("Only admins can use CCAU");
    }

    if (await isLiveCourse()) {
        throw new Error("CCAU is disabled in live courses");
    }

    const tasks = getTasks();
    const taskNum = getCurrentTask() ?? 0;
    const task = tasks[taskNum];

    const prevNum = Math.max(0, taskNum - 1);
    const prev = tasks[prevNum];

    const nextNum = (taskNum + 1) % tasks.length;
    const next = tasks[nextNum];

    addButton(prev, (() => { setCurrentTask(prevNum); goto(prev.path) }), "<--");
    addButton(task, (() => { alert(task.help) }), task.name);
    addButton(next, (() => { setCurrentTask(nextNum); goto(next.path) }), "-->");
}

main();
