import { storageManager } from "../services/storage.js";
import { draftManager } from "../domain/draft-actions.js";
import { noteManager } from "../domain/note-actions.js";
import { saveToDisk } from "../side-effects/sideEffects.js";

let appState = {
  notes: storageManager.loadNotes(),
  activeNoteId: storageManager.loadActiveNoteId(),
  activeDraft: null,
  saveTimeout: null,
  isEditMode: false,
  noticeMessage: "",
}

export function initializeState() {
  stateManager.ensureValidActiveNote();
  stateManager.syncActiveDraftFromNotes();
}

let listeners = new Set();

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach(listener => listener(appState));
}

function setState(updater) {
  const newState = typeof updater === "function" ? updater(appState) : updater;
  appState = newState;
  notify();
}



export const stateManager = {
  
  // Getters
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
    setState(prev => ({...prev, saveTimeout: timeoutId}));
  },

  setActiveNoteId(newId) {
    if (newId === appState.activeNoteId) return;
    setState(prev => ({...prev, activeNoteId: newId}));
    this.syncActiveDraftFromNotes();
    storageManager.saveActiveNoteId(appState.activeNoteId);
  },

  setIsEditMode(bool) {
    if (bool === appState.isEditMode) return;
    setState(prev => ({...prev, isEditMode: bool}))
  },

  setNoticeMessage(message) {
    if (message === appState.noticeMessage) return;
    setState(prev => ({...prev, noticeMessage: message}));
  },

  clearNoticeMessage() {
    setState(prev => ({...prev, noticeMessage: ""}))
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
      this.setNoticeMessage("You cannot add note when empty note exists.");
      this.setActiveNoteId(emptyNoteState.id);
      this.syncActiveDraftFromNotes();
      this.setIsEditMode(true);
      return false;
    }
  },

  // Mutators
  replaceNotes(currentNotes) {
    const newNotes = [...currentNotes];
    setState(prev => ({...prev, notes: newNotes}))
    saveToDisk(newNotes);
  },

  syncActiveDraftFromNotes() {
    const activeNote = this.getActiveNote();
    const newDraft = activeNote ? draftManager.createDraftFromNotes(activeNote) : null;

    setState(prev => ({...prev, activeDraft: newDraft}));
  },

  commitDraftToNotes(options = {}) {
    if(!appState.activeDraft) return;

    const updatedNotes = saveActiveDraftToNotes(
      appState.activeDraft,
      appState.notes,
      options
    );
    setState(prev => ({...prev, notes: updatedNotes}));
  },

  updateActiveDraftTitle(title) {
    if (!appState.activeDraft) return;

    setState(prev => {
    const updatedDraft = draftManager.updateDraftTitle(prev.activeDraft, title);
    updatedDraft.isAutoTitle = false;
    return {...prev, activeDraft: updatedDraft};
    });
  },

  updateActiveDraftContent(content) {
    if (!appState.activeDraft) return;

    setState(prev => {
    const updatedDraft = draftManager.updateDraftContent( prev.activeDraft, content);

    let newTitle = updatedDraft.title.trim();
    if (prev.activeDraft?.isAutoTitle) {
      newTitle = noteManager.generateAutoTitle(content);
    }

    const finalDraft = {
      ...updatedDraft,
      title: newTitle
    }

    return {
      ...prev,
      activeDraft: finalDraft,
    noticeMessage: ""
      };
    });
  },

  ensureValidActiveNote() {
    const exists = appState.notes.some(
      (note) => note.id === appState.activeNoteId,
    );

    if (!exists) {
      const newActiveNoteId = appState.notes[0]?.id ?? null;
      setState(prev => ({...prev, activeNoteId: newActiveNoteId}));
      storageManager.saveActiveNoteId(newActiveNoteId);
    }
  },
};

function saveActiveDraftToNotes(draft, notes, { ensureUniqueTitle = false } = {}) {

    if (!draft) return;
    const title = ensureUniqueTitle
      ? noteManager.generateUniqueTitle(
          notes,
          draft.title,
          draft.id,
        )
      : draft.title;
    draft = draftManager.updateDraftTitle(
      draft,
      title,
    );

    const {isAutoTitle, ...cleanDraft} = draft;

    return noteManager.updateNote(
      notes,
      cleanDraft.id,
      {
        title: cleanDraft.title,
        content: cleanDraft.content,
        timeStamp: cleanDraft.timeStamp,
      }
    );
  }

