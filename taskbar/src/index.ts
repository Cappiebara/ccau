import * as u from "./utils";
import { Task, getTasks } from "./task";
import { isLiveCourse } from "./live";

async function main() {
  if (!document.querySelector("#global_nav_accounts_link")) {
    throw new Error("Only admins can use CCAU");
  }

  if (await isLiveCourse()) {
    throw new Error("CCAU is disabled in live courses")
  }

  const tasks = getTasks();
  const taskNum: number = u.curTask() ?? 0;
  const task: Task = tasks[taskNum];
  const prevNum: number = Math.max(0, taskNum - 1);
  const prev: Task = tasks[prevNum];
  const nextNum: number = (taskNum + 1) % tasks.length;
  const next: Task = tasks[nextNum];

  u.prevArrow(prev, () => prevTask(tasks));
  u.displayCurrent(task);
  u.nextArrow(next, () => nextTask(tasks));
}

function prevTask(tasks: Task[]) {
  const taskNum: number = u.curTask() ?? 0;
  const prevNum: number = Math.max(0, taskNum - 1);
  const prev: Task = tasks[prevNum];

  u.setTask(prevNum);
  u.goto(prev.path);
}

function nextTask(tasks: Task[]) {
  const taskNum: number = u.curTask() ?? 0;
  const nextNum: number = (taskNum + 1) % tasks.length;
  const next: Task = tasks[nextNum];

  if (nextNum === 0) {
    return;
  }

  u.setTask(nextNum);
  u.goto(next.path);
}

main();
