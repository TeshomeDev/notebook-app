
import { storageManager } from "../services/storage.js";
import { stateManager } from "../state/state.js";

export function scheduleAutoSave(callback, saveTimeout) {

  if(saveTimeout) {
    clearTimeout(saveTimeout);
  }


  const timeoutId = setTimeout(() => {
    if(typeof callback === "function") {
      callback();
    }
    window.dispatchEvent(new CustomEvent("state-saved"));
  }, 1000);

  stateManager.setSaveTimeout(timeoutId);
  return timeoutId;
}

export function saveToDisk(notes) {
  storageManager.saveNotes(notes);
}