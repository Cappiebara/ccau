import { addButton } from "./check";
import { isLiveCourse } from "./live";
import * as u from "./utils";

async function main() {
    if (!document.querySelector("#global_nav_accounts_link")) {
        throw new Error("Only admins can use CCAU");
    }

    if (await isLiveCourse()) {
        throw new Error("CCAU is disabled in live courses")
    }

    u.observeDOM(document.body, () => setTimeout(addButton, 1E3));
}

main();
