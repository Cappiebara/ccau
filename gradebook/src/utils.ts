export function observeDOM(element: Element, callback: () => void) {
    const observer = new MutationObserver(callback);

    observer.observe(element, {
        childList: true,
    });

    return observer;
}

function sumPoints() {
    return Array.from(document.querySelectorAll(".assignment-points-possible"))
        .map((e) => e.children[0].textContent ?? "0")
        .map((e) => Number(e.match(/(\d+)/)![0]))
        .reduce((acc, num) => {
            return acc + num;
        }, 0);
}

function reloadSum() {
    const button = document.querySelector("#ccau_point_total");

    if (button) {
        button.textContent = "Total: " + sumPoints();
    }
}

export function addButton() {
    const appExists = document.querySelector(".assignment-points-possible");
    const btnExists = document.querySelector("#ccau_point_total");

    if (!appExists || btnExists) {
        return;
    }

    const bar = document.querySelector("#gradebook-actions");
    const btn = document.createElement("a");

    btn.id = "ccau_point_total";
    btn.textContent = "Total: " + sumPoints();
    btn.classList.add("btn");
    btn.setAttribute("tabindex", "0");
    btn.addEventListener("click", reloadSum);

    bar?.insertAdjacentElement("afterbegin", btn);
}
