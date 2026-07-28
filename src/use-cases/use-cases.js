
import { saveToDisk } from "../side-effects/sideEffects.js";
import { noteManager } from "../domain/note-actions.js";
import { stateManager } from "../state/state.js";
import { storageManager } from "../services/storage.js";

export const useCases = {
  startEditing() {
    stateManager.setIsEditMode(true);
  },

  stopEditing() {
    stateManager.setIsEditMode(false);
  },

  selectNote(noteId) {
    stateManager.setActiveNoteId(noteId);
    stateManager.syncActiveDraftFromNotes();
  },

  addNote() {
    if (!stateManager.noticeEmptyState()) {
      return;
    }

    stateManager.commitDraftToNotes({ ensureUniqueTitle: true });
    stateManager.setNoticeMessage("");
    const currentNotes = stateManager.getNote();
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
    stateManager.replaceNotes(updatedNotes);
    this.selectNote(newNote.id);
    this.startEditing();
    saveToDisk(stateManager.getNote());
  },

  deleteNote(noteId) {
    const currentNotes = stateManager.getNote();
    const updatedNotes = noteManager.removeNote(currentNotes, noteId);

    stateManager.replaceNotes(updatedNotes);
    const currentActiveNoteId = stateManager.getActiveNoteId();
    if (noteId === currentActiveNoteId) {
      const nextActiveNoteId = updatedNotes.length > 0 ? updatedNotes[0].id : null;
      stateManager.setActiveNoteId(nextActiveNoteId);
      stateManager.setNoticeMessage("");
    }
    stateManager.syncActiveDraftFromNotes();
    this.stopEditing();
    saveToDisk(stateManager.getNote());
  }
};
