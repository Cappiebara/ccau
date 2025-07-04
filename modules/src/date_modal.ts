import { Maybe } from "./ccau";

export const DATE_HEADERS: { [index: string]: { [index: string]: any } } = {
    dates: {
        Fall: [
            "*Aug 18 - Aug 24*",
            "*Aug 25 - Aug 31*",
            "*Sep 1 - Sep 7*",
            "*Sep 8 - Sep 14*",
            "*Sep 15 - Sep 21*",
            "*Sep 22 - Sep 28*",
            "*Sep 29 - Oct 5*",
            "*Oct 6 - Oct 12*",
            "*Oct 13 - Oct 19*",
            "*Oct 20 - Oct 26*",
            "*Oct 27 - Nov 2*",
            "*Nov 3 - Nov 9*",
            "*Nov 10 - Nov 16*",
            "*Nov 17 - Nov 23*",
            "*Dec 1 - Dec 7*",
            "*Dec 8 - Dec 14*",
        ],
    },

    ranges: {
        Fall: {
            "16": [1, 16],
            "7A": [1, 7],
            "7B": [9, 15],
            "8A": [1, 8],
            "8B": [9, 16],
            "14": [1, 15],
        },
    },
};

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
    return Object.keys(DATE_HEADERS.dates).map((semester) => {
        const button = document.createElement("button");

        button.textContent = semester;
        button.classList.add("ccau_semester_button");
        button.classList.add("btn");
        button.style.margin = "5px";

        return button;
    });
}

function termButtons(semester: string): HTMLButtonElement[] {
    return Object.keys(DATE_HEADERS.ranges[semester]).map((term) => {
        const button = document.createElement("button");

        button.textContent = term;
        button.classList.add("ccau_term_button");
        button.classList.add("btn");
        button.style.margin = "5px";

        return button;
    });
}

function addTermButtonsForSemester(semester: string) {
    Array.from(document.querySelectorAll(".ccau_semester_button")).forEach((b) => b.remove());

    const buttons = termButtons(semester);
    const modal = document.querySelector(".ccau_modal_content");

    if (!modal) {
        return;
    }

    buttons.forEach((b) => modal.appendChild(b));
}

export async function showModal(): Promise<[Maybe<string>, Maybe<string>]> {
    const div = document.createElement("div");
    const label = document.createElement("div");

    label.textContent = "Which semester is this course?";
    div.appendChild(label);

    let semester: Maybe<string> = null;
    let term: Maybe<string> = null;

    return new Promise((resolve) => {
        const termCallback = (button: HTMLButtonElement) => {
            button.addEventListener("click", () => {
                term = button.textContent;
                resolve([semester, term]);
                modal.remove();
            });
        };

        const semesterCallback = (button: HTMLButtonElement) => {
            button.addEventListener("click", () => {
                semester = button.textContent;
                addTermButtonsForSemester(semester || "");

                Array.from(document.querySelectorAll(".ccau_term_button"))
                    .map((e) => e as HTMLButtonElement)
                    .forEach(termCallback);
            });

            div.appendChild(button);
        };

        semesterButtons().forEach(semesterCallback);
        const modal = createModal(div);
    });
}
