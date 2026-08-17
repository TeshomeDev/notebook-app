
import { storageManager } from "../services/storage.js";
import { subscribe, stateManager } from "../state/state.js";


let timeoutId = null;

export function scheduleAutoSave(callback, saveTimeout) {

  if(saveTimeout) {
    clearTimeout(saveTimeout);
  }

   timeoutId = setTimeout(() => {
    if(typeof callback === "function") {
      callback();
    }
      window.dispatchEvent(new CustomEvent("state-saved"));
  }, 1000);

  stateManager.setSaveTimeout(timeoutId);
}

export function saveToDisk(notes) {
  storageManager.saveNotes(notes);
}


let previousContent = null;
let previousTitle = null;
let previousActiveNoteId = null;

export function initSideEffectsSubscription() {
  subscribe((state) => {
    const currentActiveNoteId = state.activeNoteId;
    const activeNote = state.notes.find(note => note.id === currentActiveNoteId);
    
    if (!activeNote) return;

    const isContentChanged = activeNote?.content !== previousContent;
    const isTitleChanged = activeNote?.title !== previousTitle;
    const isActiveNoteIdChanged = currentActiveNoteId !== previousActiveNoteId;

    if (isContentChanged || isTitleChanged || isActiveNoteIdChanged) {
      previousContent = activeNote?.content;
      previousTitle = activeNote?.title;
      previousActiveNoteId = currentActiveNoteId;

      scheduleAutoSave(() => {
        saveToDisk(state.notes);
      }, stateManager.getSaveTimeout());
    }
  });
}

