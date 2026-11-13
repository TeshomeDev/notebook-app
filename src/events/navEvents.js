import { renderFeature } from "../ui/router.js";

export function registerNavEvents() {
  const nav = document.querySelector(".app-nav");
  if (!nav) return;

  nav.addEventListener("click", (event) => {
    const link = event.target.closest(".app-nav__link");

    if (!link) return;
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#/")) return;

    const featureName = href.replace("#/", "");

    renderFeature(featureName);
  });

  window.addEventListener("hashchange", () => {
    const hash = window.location.hash;
    if (hash.startsWith("#/")) {
      const featureName = hash.replace("#/", "");
      renderFeature(featureName);
    }
  });
}
