import { dateButton } from "./date_headers/add";
import { deleteButton } from "./modules/delete";
import { moveButton } from "./modules/move";
import { isLiveCourse } from "./live";

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
