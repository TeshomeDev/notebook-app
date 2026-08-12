
import { stateManager, subscribe } from "../state/state.js";


const elements = {
  activeNoteTitle: document.querySelector(".editable--title")
};

let lastRenderedTitle = null;

export function renderTitle() {
  const activeDraft = stateManager.getActiveNote();
  if (!activeDraft) {
    lastRenderedTitle = null;
    elements.activeNoteTitle.textContent = "";
    return;
  }

  if (lastRenderedTitle !== activeDraft.title) {
    lastRenderedTitle = activeDraft.title;
  }

  if (document.activeElement !== elements.activeNoteTitle) {
    elements.activeNoteTitle.innerHTML = activeDraft.title;
  }
}

export function initTitleSubscription() {
  subscribe(renderTitle);
}