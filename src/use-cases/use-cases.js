
import { noteManager } from "../domain/note-actions.js";
import { stateManager } from "../state/state.js";


export const useCases = {
  startEditing() {
    stateManager.dispatch({
      type: "EDITING_ENABLED"
    });
  },

  stopEditing() {
    stateManager.dispatch({
      type: "EDITING_DISABLED",
    });
  },

  selectNote(noteId) {
    stateManager.dispatch({
      type: "NOTE_SELECTED",
      payload: { id: noteId }
    });
  },

  addNote() {
    const isNoteStateEmpty = stateManager.noticeEmptyState();
    if (!isNoteStateEmpty) {
      const activeNoteId = stateManager.getEmptyNote().id;
      stateManager.dispatch({
        type: "NOTE_CREATION_BLOCKED",
        payload: { activeNoteId }
      });
      return;
    }

    const currentNotes = stateManager.getState().notes;
    let newNote = noteManager.createNote();
    let uniqueTitle = noteManager.generateUniqueAutoTitle(
      currentNotes,
      newNote.content,
      newNote.id,
    );
    newNote = {
      ...newNote,
      title: uniqueTitle,
    };

    stateManager.dispatch({
      type: "NOTE_CREATED",
      payload: { newNote }
    });
  },

  deleteNote(noteId) {
    stateManager.dispatch({
            type: "NOTE_DELETED",
            payload: { id: noteId }
          });
  },
};

