import { addButton, observeDOM } from "./utils";

observeDOM(document.body, () => setTimeout(addButton, 500));
