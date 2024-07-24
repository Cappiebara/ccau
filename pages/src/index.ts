import { addButton } from "./check";
import * as u from "./utils";

u.observeDOM(document.body, () => setTimeout(addButton, 1000));
