import { isAdmin, isLiveCourse } from "./ccau";
import { addDeleteButton } from "./delete_empty";
import { addMoveButton } from "./move_modules";
import { addDateButton } from "./update_dates";

async function main() {
    if (!isAdmin()) {
        throw new Error("Only admins can use CCAU");
    }

    if (await isLiveCourse()) {
        throw new Error("CCAU is disabled in live courses");
    }

    [
        addMoveButton,
        addDeleteButton,
        addDateButton
    ].reverse().forEach((f) => f());
}

main();
