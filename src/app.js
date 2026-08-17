
import { initializeState } from "./state/state.js";
import { registerEditorEvents } from "./events/editorEvents.js";
import { registerSidebarEvents } from "./events/sidebarEvents.js";
import { registerToolbarEvents } from "./events/toolbarEvents.js";
import { registerNoticeEvents } from "./events/noticeEvents.js";
import { initTitleSubscription } from "./ui/renderTitle.js";
import { initSideEffectsSubscription } from "./side-effects/sideEffects.js";
import { initEditorSubscription, renderEditor } from "./ui/renderEditor.js";
import { initSidebarSubscription, renderSidebar } from "./ui/renderSidebar.js";
import { initNoticeSubscription, renderNotice } from "./ui/renderNotice.js";


function initializeApplication() {
  initializeState();
  initTitleSubscription();
  initEditorSubscription();
  initSidebarSubscription();
  initNoticeSubscription();
  initSideEffectsSubscription();
  
  registerEditorEvents();
  registerSidebarEvents();
  registerToolbarEvents();
  registerNoticeEvents();
}

document.addEventListener("DOMContentLoaded", initializeApplication);
