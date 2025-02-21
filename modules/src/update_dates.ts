import { DATE_HEADERS, showModal } from "date_modal";

function datesToWeeks(dates: string[]): { [key: string]: string } {
    return dates.reduce<{ [key: string]: string }>((acc, date, i) => {
        acc[`Week ${i + 1}`] = date;
        return acc;
    }, {});
}

export async function getDates(): Promise<{ [key: string]: string }> {
    return new Promise((resolve) => {
        showModal().then(async ([semester, term]) => {
            if (!semester || !term) {
                throw new Error("Null semester or term from modal");
            }

            const range = DATE_HEADERS.ranges[semester][term];
            const dates = DATE_HEADERS.dates[semester].slice(range[0] - 1, range[1]);

            resolve(datesToWeeks(dates));
        });
    });
}
