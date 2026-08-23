import { storageManager } from "../services/storage.js";
import { noteManager } from "../domain/note-actions.js";
import { noteReducer } from "../domain/noteReducer.js";


// ===========================
// PRIVATES
// ===========================
const notes = storageManager.loadNotes() || [];
const activeNoteId = storageManager.loadActiveNoteId(notes);

const initialState = {
  notes,
  activeNoteId,
  isEditMode: false,
  noticeMessage: ""
}

let appState;

let listeners = new Set();

function notify(action) {
  listeners.forEach(listener => listener(appState, action));
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
    appState = initialState;
    notify();
  },

  subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
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
        appState.notes.map((note) => Object.freeze({ ...note }))
      ),
    });
  },

  // Derived
  getEmptyNote() {
    return this.getState().notes.find((note) => noteManager.isNoteEmpty(note));
  },

  noticeEmptyState() {
    if (!appState.notes) return;

    const emptyNoteState = this.getEmptyNote();

    if (!emptyNoteState) return true;

    if (emptyNoteState.title.trim() === "") {
      return false;
    }

    if (emptyNoteState.content.trim() === "") {
      return false;
    }
  },
};


