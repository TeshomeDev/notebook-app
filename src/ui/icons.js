import { icons } from "../assets/icons.js";

export function mountIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((el) => {
    const name = el.dataset.icon;

    if (el.firstElementChild?.tagName === "svg") return;

    if (icons[name]) {
      el.innerHTML = icons[name];
    } else {
      console.warn(`Icon "${name}" not found in the library`);
    }
  });
}

export function mountIcon(el, name) {
  if (icons[name]) {
    el.innerHTML = icons[name];
  } else {
    console.warn(`Icon "${name}" not found in the library`);
  }
}
