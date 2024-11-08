import { dateButton } from "./date_headers/add";
import { isLiveCourse } from "./live";
import { deleteButton } from "./modules/delete";
import { moveButton } from "./modules/move";

async function main() {
    if (!document.querySelector("#global_nav_accounts_link")) {
        throw new Error("Only admins can use CCAU");
    }

    if (await isLiveCourse()) {
        throw new Error("CCAU is disabled in live courses")
    }

    dateButton();
    deleteButton();
    moveButton();
}

main();
