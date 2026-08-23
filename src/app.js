
import { stateManager } from "./state/state.js";
import { registerEditorEvents } from "./events/editorEvents.js";
import { registerSidebarEvents } from "./events/sidebarEvents.js";
import { registerToolbarEvents } from "./events/toolbarEvents.js";
import { initTitleSubscription } from "./ui/renderTitle.js";
import { initEditorSubscription } from "./ui/renderEditor.js";
import { initSidebarSubscription } from "./ui/renderSidebar.js";
import { initNoticeSubscription } from "./ui/renderNotice.js";
import {
  initNoticeHiddenSubscription,
  initSideEffectsSubscription,
} from "./side-effects/sideEffects.js";



function initializeApplication() {
  initTitleSubscription();
  initEditorSubscription();
  initSidebarSubscription();
  initNoticeSubscription();
  initSideEffectsSubscription();
  initNoticeHiddenSubscription();
  stateManager.initializeAppState();

  registerEditorEvents();
  registerSidebarEvents();
  registerToolbarEvents();
}

document.addEventListener("DOMContentLoaded", initializeApplication);
