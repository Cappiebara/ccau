import { dateButton } from "./date_headers/add";
import { deleteButton } from "./modules/delete";
import { moveButton } from "./modules/move";

function main() {
  if (!document.querySelector("#global_nav_accounts_link")) {
    throw new Error("Only admins can use this script");
  }

  dateButton();
  deleteButton();
  moveButton();
}

main();
