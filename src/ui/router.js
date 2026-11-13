export function renderFeature(featureName) {
  const container = document.getElementById("main-panel");

  if (!container) {
    console.error("Router: #main-panel container not found");

    return;
  }

  console.log(`Router: requested to render "${featureName}"`);

  switch (featureName) {
    case "home":
      break;

    case "note":
      break;

    default:
      console.warn(`Router: no feature found for "${featureName}"`);
  }
}
