import { Maybe } from "../types";

function createModal(div: HTMLDivElement): HTMLDivElement {
  const container = document.createElement("div");
  const content = document.createElement("div");

  container.className = "ccau_modal";
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  container.style.display = "flex";
  container.style.justifyContent = "center";
  container.style.alignItems = "center";
  container.style.zIndex = "1000";

  content.classList.add("ccau_modal_content");
  content.classList.add("ui-dialog");
  content.classList.add("ui-widget");
  content.classList.add("ui-widget-content");
  content.classList.add("ui-corner-all");
  content.classList.add("ui-dialog-buttons");
  content.style.padding = "20px";
  content.style.textAlign = "center";

  document.body.appendChild(container);
  container.appendChild(content);
  content.appendChild(div);

  return container;
}

function semesterButtons(): HTMLButtonElement[] {
  const cached = localStorage.getItem("ccau_data") ?? "{}";
  const data = JSON.parse(cached);
  const semesters = Object.keys(data["dates"]);

  return semesters.map((sem) => {
    const button = document.createElement("button");

    button.textContent = sem;
    button.classList.add("ccau_semester_button");
    button.classList.add("btn");
    button.style.margin = "5px";

    return button;
  });
}

function termButtons(semester: string): HTMLButtonElement[] {
  const data = JSON.parse(localStorage.getItem("ccau_data") || "{}");
  const terms = Object.keys(data["ranges"][semester]);

  return terms.map((term) => {
    const button = document.createElement("button");

    button.textContent = term;
    button.classList.add("ccau_term_button");
    button.classList.add("btn");
    button.style.margin = "5px";

    return button;
  });
}

function replaceButtons(semester: string): void {
  const sel = ".ccau_semester_button";
  const buttons = Array.from(document.querySelectorAll(sel));

  buttons.forEach((button) => button.remove());

  const newButtons = termButtons(semester);
  const modal = document.querySelector(".ccau_modal_content");

  if (!modal) {
    return;
  }

  newButtons.forEach((button) => modal.appendChild(button));
}

export async function showModal(): Promise<[Maybe<string>, Maybe<string>]> {
  const div = document.createElement("div");
  const buttons = semesterButtons();
  const label = document.createElement("div");

  label.textContent = "Which semester is this course?";
  div.appendChild(label);

  let semester: Maybe<string> = null;
  let term: Maybe<string> = null;

  return new Promise((resolve) => {
    const tCallback = (btn: HTMLButtonElement) => {
      btn.addEventListener("click", () => {
        term = btn.textContent;
        resolve([semester, term]);
        modal.remove();
      });
    };

    const sCallback = (btn: HTMLButtonElement) => {
      btn.addEventListener("click", () => {
        semester = btn.textContent;
        replaceButtons(semester || "");

        Array.from(document.querySelectorAll(".ccau_term_button"))
          .map((e) => e as HTMLButtonElement)
          .forEach(tCallback);
      });

      div.appendChild(btn);
    };

    buttons.forEach(sCallback);
    const modal = createModal(div);
  });
}
