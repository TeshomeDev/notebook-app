import { storageManager } from "../services/storage.js";
import { noteManager } from "../domain/note-actions.js";
import { saveToDisk } from "../side-effects/sideEffects.js";


// ===========================
// PRIVATES
// ===========================
let appState = {
  notes: storageManager.loadNotes() || null,
  activeNoteId: storageManager.loadActiveNoteId() || null,
  activeDraft: null,
  saveTimeout: null,
  isEditMode: false,
  noticeMessage: "",
}

let listeners = new Set();

function notify() {
  listeners.forEach(listener => listener(appState));
}

function setState(updater) {
  const newState = typeof updater === "function" ? updater(appState) : updater;
  appState = newState;
  notify();
}


// ===========================
// PUBLIC API
// ===========================
export function initializeState() {
  stateManager.ensureValidActiveNote();
  notify();
}

export function subscribe(listener) {
  listeners.add(listener);
  listener(appState);
  return () => listeners.delete(listener);
}

export const stateManager = {

  // Getters
  getActiveNote(state) {
    if (!state?.activeNoteId) return;
    return state.notes.find((note) => note.id === state.activeNoteId);
  },

  getNote() {
    return appState.notes;
  },

  getActiveNoteId() {
    return appState.activeNoteId;
  },
  getActiveNote() {
    if (!appState.activeNoteId) return;
    const note = appState.notes.find(
      (note) => note.id === appState.activeNoteId,
    );
    if (!note) return;

    return note;
  },

  getIsEditMode() {
    return appState.isEditMode;
  },

  getSaveTimeout() {
    return appState.saveTimeout;
  },

  getNoticeMessage() {
    return appState.noticeMessage;
  },

  // Setters
  setSaveTimeout(timeoutId) {
    setState((prev) => ({ ...prev, saveTimeout: timeoutId }));
  },

  setActiveNoteId(newId) {
    if (newId === appState.activeNoteId) return;
    setState((prev) => ({ ...prev, activeNoteId: newId }));
    storageManager.saveActiveNoteId(appState.activeNoteId);
  },

  setIsEditMode(bool) {
    if (bool === appState.isEditMode) return;
    setState((prev) => ({ ...prev, isEditMode: bool }));
  },

  setNoticeMessage(message) {
    if (message === appState.noticeMessage) return;
    setState((prev) => ({ ...prev, noticeMessage: message }));
  },

  clearNoticeMessage() {
    setState((prev) => ({ ...prev, noticeMessage: "" }));
  },

  // Derived
  getEmptyNote() {
    return appState.notes.find((note) => noteManager.isNoteEmpty(note));
  },

  noticeEmptyState() {
    if (!appState.notes) return;

    const emptyNoteState = stateManager.getEmptyNote();
    if (!emptyNoteState) return true;
    if (emptyNoteState.title.trim() === "") {
      this.setNoticeMessage("Title should not be empty.");
      this.setActiveNoteId(emptyNoteState.id);
      this.setIsEditMode(true);
      return false;
    } else if (emptyNoteState.content.trim() === "") {
      this.setNoticeMessage("You can't add note when empty note exists.");
      this.setActiveNoteId(emptyNoteState.id);
      this.setIsEditMode(true);
      return false;
    }
  },

  // Mutators
  replaceNotes(currentNotes) {
    const newNotes = [...currentNotes];
    setState((prev) => ({ ...prev, notes: newNotes }));
    saveToDisk(newNotes);
  },

  updateActiveNoteContent(content) {
    setState(prev => {
      return {
        ...prev,
        notes: prev.notes.map(note => {
          if(note.id !== prev.activeNoteId) return note;

         return noteManager.updateNoteContent(note, content);
        })
      };
    });
  },

  updateActiveNoteTitle(title) {
    setState(prev => {
      return {
        ...prev,
        notes: prev.notes.map(note => {
          if(note.id !== prev.activeNoteId) return note;

          return noteManager.updateNoteTitle(note, title);
        })
      };
    });
  },

  ensureValidActiveNote() {
    const exists = appState.notes.some(
      (note) => note.id === appState.activeNoteId,
    );

    if (!exists) {
      const newActiveNoteId = appState.notes[0]?.id ?? null;
      setState((prev) => ({ ...prev, activeNoteId: newActiveNoteId }));
      storageManager.saveActiveNoteId(newActiveNoteId);
    }
  },
};


