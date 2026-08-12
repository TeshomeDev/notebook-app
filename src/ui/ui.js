
import { renderEditor } from "./renderEditor.js";
import { renderSidebar } from "./renderSidebar.js";
import { renderNotice } from "./renderNotice.js";


export function renderAppUI() {
  renderSidebar();
  renderEditor();
  renderNotice();
}



