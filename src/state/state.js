import { storageManager } from "../services/storage.js";
import { draftManager } from "../domain/draft-actions.js";
import { noteManager } from "../domain/note-actions.js";
import { saveToDisk } from "../side-effects/sideEffects.js";

const appState = {
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
    appState.saveTimeout = timeoutId;
  },

  setActiveNoteId(newId) {
    if (newId === appState.activeNoteId) return;
    appState.activeNoteId = newId;
    this.syncActiveDraftFromNotes();
    storageManager.saveActiveNoteId(appState.activeNoteId);
  },

  setIsEditMode(bool) {
    if (bool === appState.isEditMode) return;
    const isLeavingEditMode = appState.isEditMode && !bool;
    if (isLeavingEditMode) {
      saveToDisk(this.getNote());
    }
    appState.isEditMode = bool;
  },

  setNoticeMessage(message) {
    if (message === appState.noticeMessage) return;
    appState.noticeMessage = message;
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
    appState.notes = currentNotes;
    saveToDisk(appState.notes);
  },

  syncActiveDraftFromNotes() {
    const activeNote = this.getActiveNote();
    if (!activeNote) {
      appState.activeDraft = null;
      return;
    }
    appState.activeDraft = draftManager.createDraftFromNotes(activeNote);
  },

  commitDraftToNotes(options = {}) {
    if(!appState.activeDraft) return;

    const updatedNotes = saveActiveDraftToNotes(
      appState.activeDraft,
      appState.notes,
      options
    );
    appState.notes = updatedNotes;
  },

  updateActiveDraftTitle(title) {
    if (!appState.activeDraft) return;
    appState.activeDraft = draftManager.updateDraftTitle(
      appState.activeDraft,
      appState.activeDraft.title = title
    );
  },

  updateActiveDraftContent(content) {
    if (!appState.activeDraft) return;
    appState.activeDraft = draftManager.updateDraftContent(
      appState.activeDraft,
      appState.activeDraft.content = content,
    );
  },

  ensureValidActiveNote() {
    const exists = appState.notes.some(
      (note) => note.id === appState.activeNoteId,
    );

    if (!exists) {
      appState.activeNoteId = appState.notes[0]?.id ?? null;
      storageManager.saveActiveNoteId(appState.activeNoteId);
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

    return noteManager.updateNote(
      notes,
      draft.id,
      {
        title: draft.title,
        content: draft.content,
        timeStamp: draft.timeStamp,
      }
    );
  }

