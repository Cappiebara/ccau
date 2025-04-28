function relinkModuleButtons() {
    const moduleButtons = Array.from(document.querySelectorAll("img[alt^='Week']")) as HTMLElement[];
    const links = Array.from(document.querySelectorAll("div[data-testid='instructure_links-Link']")) as HTMLElement[];

    moduleButtons
        .map((b) => [b, links.find((l) => l.innerText === b.title)!])
        .forEach((bl) => { bl[0].click(); bl[1].click() });
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
