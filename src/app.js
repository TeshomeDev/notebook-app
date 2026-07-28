
import { initializeState } from "./state/state.js";
import { registerEditorEvents } from "./events/editorEvents.js";
import { registerSidebarEvents } from "./events/sidebarEvents.js";
import { registerToolbarEvents } from "./events/toolbarEvents.js";
import { renderAppUI, renderSidebar } from "./ui/ui.js";

window.addEventListener("state-saved", () => {
    renderSidebar();
    // setNoticeMessage("✓ Saved");
    // renderNotice();
  });

function initializeApplication() {
  initializeState();
  registerEditorEvents();
  registerSidebarEvents();
  registerToolbarEvents();
  renderAppUI();
}

document.addEventListener("DOMContentLoaded", initializeApplication);
