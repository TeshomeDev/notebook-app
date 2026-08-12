
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

export function initSideEffectsSubscription() {
  subscribe((state) => {
    const activeDraft = state.activeDraft;
    if (!activeDraft) return;

    const isContentChanged = activeDraft.content !== previousContent;
    const isTitleChanged = activeDraft.title !== previousTitle;

    if (isContentChanged || isTitleChanged) {
      previousContent = activeDraft.content;
      previousTitle = activeDraft.title;

      scheduleAutoSave(() => {
        stateManager.commitDraftToNotes({ ensureUniqueTitle: true });
        saveToDisk(stateManager.getNote());
      }, stateManager.getSaveTimeout());
    }
  });
}

