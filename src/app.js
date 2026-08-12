
import { initializeState } from "./state/state.js";
import { registerEditorEvents } from "./events/editorEvents.js";
import { registerSidebarEvents } from "./events/sidebarEvents.js";
import { registerToolbarEvents } from "./events/toolbarEvents.js";
// import { registerNoticeEvents } from "./events/noticeEvents.js";
import { initTitleSubscription } from "./ui/renderTitle.js";
import { initSideEffectsSubscription } from "./side-effects/sideEffects.js";
import { initEditorSubscription } from "./ui/renderEditor.js";
import { initSidebarSubscription } from "./ui/renderSidebar.js";
import { initNoticeSubscription } from "./ui/renderNotice.js";
import { renderAppUI } from "./ui/ui.js";

function initializeApplication() {
  initializeState();
  initSideEffectsSubscription();
  initTitleSubscription();
  initSidebarSubscription();
  initEditorSubscription();
  initNoticeSubscription();
  registerEditorEvents();
  registerSidebarEvents();
  registerToolbarEvents();
  // registerNoticeEvents();
  renderAppUI();
}

document.addEventListener("DOMContentLoaded", initializeApplication);
