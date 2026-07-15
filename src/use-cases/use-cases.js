import {
  getActiveNoteId,
  saveActiveDraftToNotes,
  setActiveNoteId,
  setIsEditMode,
  syncActiveDraftFromNotes,
  getNote,
  noticeEmptyState,
  setNoticeMessage,
  replaceNotes,
  saveToDisk,
} from "../state/state.js";
import { noteManager } from "../domain/note-actions.js";
import { storageManager } from "../services/storage.js";

export const useCases = {
  startEditing() {
    setIsEditMode(true);
  },

  stopEditing() {
    setIsEditMode(false);
  },

  selectNote(noteId) {
    setActiveNoteId(noteId);
    syncActiveDraftFromNotes();
  },

  addNote() {
    if (!noticeEmptyState()) return;

    saveActiveDraftToNotes({ ensureUniqueTitle: true });
    setNoticeMessage("");
    const currentNotes = getNote();
    let newNote = noteManager.createNote();
    let uniqueTitle = noteManager.generateUniqueTitle(
      currentNotes,
      newNote.title,
      newNote.id,
    );
    newNote = {
      ...newNote,
      title: uniqueTitle,
    };
    const updatedNotes = noteManager.insertNote(currentNotes, newNote);
    replaceNotes(updatedNotes);
    this.selectNote(newNote.id);
    this.startEditing();
    saveToDisk();
  },

  deleteNote(noteId) {
    const currentNotes = getNote();
    const updatedNotes = noteManager.removeNote(currentNotes, noteId);

    replaceNotes(updatedNotes);
    const currentActiveNoteId = getActiveNoteId();
    if (noteId === currentActiveNoteId) {
      const nextActiveNoteId = currentNotes.length > 0 ? currentNotes[0].id : null;
      setActiveNoteId(nextActiveNoteId);
      setNoticeMessage("");
    }
    syncActiveDraftFromNotes();
    this.stopEditing();
    saveToDisk();
  }
};
