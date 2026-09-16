import { storageManager } from "../services/storage.js";
import { noteManager } from "../domain/note-actions.js";
import { noteReducer } from "../domain/noteReducer.js";

// ===========================
// PRIVATES
// ===========================

let appState;

let listeners = new Set();

function notify(action) {
  listeners.forEach((listener) => listener(appState, action));
}

// ===========================
// PUBLIC API
// ===========================
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const stateManager = {
  initializeAppState() {
    const loadedNotes = storageManager.loadNotes() || [];
    const loadedActiveNoteId = storageManager.loadActiveNoteId(loadedNotes);

    appState = {
      notes: loadedNotes,
      activeNoteId: loadedActiveNoteId,
      isEditMode: false,
      noticeMessage: "",
    };

    notify();
  },

  dispatch(action) {
    const nextState = noteReducer(appState, action);
    appState = nextState;

    notify(action);
  },

  getState() {
    return Object.freeze({
      ...appState,
      notes: Object.freeze(
        appState.notes.map((note) => Object.freeze({ ...note })),
      ),
    });
  },

  // Derived
  getEmptyNote() {
    return this.getState().notes.find((note) => noteManager.isNoteEmpty(note));
  },

  hasEmptyNote() {
    if (!appState.notes) return;

    const emptyNoteState = this.getState().notes.find((note) =>
      noteManager.isNoteEmpty(note),
    );

    if (emptyNoteState) return true;

    return false;
  },
};
