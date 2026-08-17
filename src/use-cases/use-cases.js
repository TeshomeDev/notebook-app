
import { saveToDisk } from "../side-effects/sideEffects.js";
import { noteManager } from "../domain/note-actions.js";
import { stateManager, subscribe } from "../state/state.js";
import { storageManager } from "../services/storage.js";
import { renderEditorMode } from "../ui/layout.js";
import { putCursorAtEnd } from "../ui/helpers.js";

let isEditing = null;
let isReading = null;

export const useCases = {
  startEditing() {
    stateManager.setIsEditMode(true);
  },

  stopEditing() {
    stateManager.setIsEditMode(false);
  },

  selectNote(noteId) {
    stateManager.setActiveNoteId(noteId);
  },

  addNote() {
    const isNoteStateEmpty = stateManager.noticeEmptyState();
    if (!isNoteStateEmpty) {
      return;
    }

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
    this.stopEditing();
  },

};

