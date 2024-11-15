import { TASKS } from "./env";

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

export function getTasks(): Task[] {
    return TASKS.tasks;
}
