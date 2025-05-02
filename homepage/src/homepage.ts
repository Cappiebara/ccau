import { Maybe } from "./ccau";

function getAltText(element: Maybe<HTMLElement>): Maybe<string> {
    const altText = element?.getAttribute("alt")?.toString();

    if (!altText) {
        return null;
    }

    const pattern = /Week \d{1,2}/;
    const arr = pattern.exec(altText);

    return arr ? arr[0] : null;
}

function relinkModuleButtons() {
    const iframe = document.querySelector("#wiki_page_body_ifr") as Maybe<HTMLIFrameElement>;
    const contentDocument = iframe?.contentDocument;

    if (!contentDocument) {
        throw new Error("Couldn't access iframe's content document");
    }

    const moduleButtons = Array.from(contentDocument.querySelectorAll("img[alt^='Week']")) as HTMLElement[];
    const links = Array.from(document.querySelectorAll("div[data-testid='instructure_links-Link'] > div[role='button']")) as HTMLElement[];

    moduleButtons
        .map((b) => [b, getAltText(b)])
        .filter((ba) => ba[1])
        .map((ba) => [ba[0], links.find((l) => l.innerText.startsWith(ba[1]!.toString()))])
        .forEach((bl) => {
            (bl[0] as HTMLElement).click();
            (bl[1] as Maybe<HTMLElement>)?.click();
        });
}

export function addButton() {
    const slot = document.querySelector("span[data-testid='CloseButton_ContentTray']");
    const button = document.createElement("a");

    button.id = "ccau_relinkModuleButtons";
    button.textContent = "Re-Link Modules";
    button.classList.add("btn");
    button.setAttribute("tabindex", "0");
    button.addEventListener("click", relinkModuleButtons);

    if (!slot || slot?.innerHTML.includes(button.id)) {
        return;
    }

    slot?.insertAdjacentElement("afterbegin", button);
}

