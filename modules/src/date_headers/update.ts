import { DATA_URL } from "../env";
import { Maybe } from "../types";
import { showModal } from "./modal";
import { safeNestedJSON } from "./utils";

function update() {
    const day = 1E3 * 60 * 60 * 24;
    const now = Date.now();
    const last = Number(localStorage.getItem("ccau_data_ts")) ?? 0;

    if (now - last < day) {
        return;
    }

    fetch(DATA_URL)
        .then((response) => response.json())
        .then((data) => {
            localStorage.setItem("ccau_data", JSON.stringify(data));
            localStorage.setItem("ccau_data_ts", now.toString());
            location.reload();
        });
}

function getRawDates(sem: string): Maybe<string[]> {
    const data = JSON.parse(localStorage.getItem("ccau_data") || "{}");
    const dates: Maybe<string[]> = safeNestedJSON(data, ["dates", sem]);

    return dates;
}

function getDateRange(sem: string, term: string): Maybe<string> {
    const data = JSON.parse(localStorage.getItem("ccau_data") || "{}");

    return safeNestedJSON(data, ["ranges", sem, term]);
}

function datesInRange(dates: string[], range: string): string[] {
    return range.split(",").flatMap((r: string) => {
        const nums = r.split("-").map(Number);
        const start = nums[0];
        const end = nums[1];

        return dates.slice(start - 1, end || start);
    });
}

function datesToWeeks(dates: string[]): { [key: string]: string } {
    return dates.reduce<{ [key: string]: string }>((acc, date, i) => {
        acc[`Week ${i + 1}`] = date;
        return acc;
    }, {});
}

export async function getDates(): Promise<{ [key: string]: string }> {
    return new Promise((resolve) => {
        update();

        showModal().then(async ([sem, term]) => {
            if (!sem || !term) {
                throw new Error("Null semester or term from modal");
            }

            const rawDates = getRawDates(sem);
            const range = getDateRange(sem, term);

            if (!rawDates || !range) {
                resolve({});
                location.reload();
                return;
            }

            const dates = datesInRange(rawDates, range);
            resolve(datesToWeeks(dates));
        });
    });
}
