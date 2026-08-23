
import { subscribe } from "../state/state.js";


const elements = {
  activeNoteTitle: document.querySelector(".editable--title")
};

let lastRenderedTitle = null;

export function renderTitle(state) {
  const activeNote = state.notes.find(note => note.id === state.activeNoteId);
  if (!activeNote) {
    lastRenderedTitle = null;
    elements.activeNoteTitle.textContent = "";
    return;
  }

  if (lastRenderedTitle !== activeNote.title) {
    lastRenderedTitle = activeNote.title;
  }

  if (document.activeElement !== elements.activeNoteTitle) {
    elements.activeNoteTitle.innerHTML = activeNote.title;
  }
}

export function initTitleSubscription() {
  subscribe(state => renderTitle(state));
}