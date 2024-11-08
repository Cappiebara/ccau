import { DATA_URL } from "./env";

export class Task {
    name: string;
    path: string;
    help: string;

    constructor(name: string, path: string, help: string) {
        this.name = name;
        this.path = path;
        this.help = help;
    }
}

function update() {
    const day = 1E3 * 60 * 60 * 24;
    const now = Date.now();
    const last = Number(localStorage.getItem("ccau_task_ts")) ?? 0;

    if (now - last < day) {
        return;
    }

    fetch(DATA_URL)
        .then((response) => response.json())
        .then((data) => {
            localStorage.setItem("ccau_task", JSON.stringify(data));
            localStorage.setItem("ccau_task_ts", now.toString());
            location.reload();
        });
}

export function getTasks(): Task[] {
    update();

    const tasks = localStorage.getItem("ccau_task") ?? "[]";
    const parsed = JSON.parse(tasks);

    return parsed.tasks;
}
