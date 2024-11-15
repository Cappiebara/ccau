import { DATE_HEADERS } from "../env";
import { Maybe } from "../types";
import { showModal } from "./modal";
import { safeNestedJSON } from "./utils";

function getRawDates(sem: string): Maybe<string[]> {
    return safeNestedJSON(DATE_HEADERS, ["dates", sem]);
}

function getDateRange(sem: string, term: string): Maybe<string> {
    return safeNestedJSON(DATE_HEADERS, ["ranges", sem, term]);
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
        showModal().then(async ([sem, term]) => {
            if (!sem || !term) {
                throw new Error("Null semester or term from modal");
            }

            const rawDates = getRawDates(sem);
            const range = getDateRange(sem, term);

            if (!rawDates || !range) {
                throw new Error("Dates or range are null")
            }

            const dates = datesInRange(rawDates, range);
            resolve(datesToWeeks(dates));
        });
    });
}
