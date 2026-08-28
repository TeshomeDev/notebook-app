const elements = {
  menu: document.querySelector(".hamburger-menu"),
  sidebar: document.querySelector(".sidebar"),
};

export function insertClipboardData(clipboardData) {
  const html = clipboardData.getData("text/html");
  if (html) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    selection.getRangeAt(0).deleteContents();

    const div = document.createElement("div");
    div.innerHTML = html.replace(/<--[\s\S]*?-->/g, "");

    const fragment = document.createDocumentFragment();
    while (div.firstChild) {
      fragment.appendChild(div.firstChild);
    }
    selection.getRangeAt(0).insertNode(fragment);

    selection.collapseToEnd();
  } else {
    const text = clipboardData.getData("text/plain");
    const textNode = document.createTextNode(text);
    const selection = window.getSelection();
    if (selection.rangeCount) {
      selection.getRangeAt(0).insertNode(textNode);
    }
  }
}

export function putCursorAtEnd(element) {
  if (!element) return;

  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

export function syncHamburgerMenuState() {
  const hamburgerMenuBars = elements.menu.querySelectorAll(
    ".hamburger-menu__bar",
  );

  if (elements.sidebar.classList.contains("is-menu-open")) {
    hamburgerMenuBars.forEach((bar) => {
      bar.classList.add("menu-open");
    });
    elements.sidebar.scrollTop = 0;
  } else {
    hamburgerMenuBars.forEach((bar) => {
      bar.classList.remove("menu-open");
    });
  }
}
