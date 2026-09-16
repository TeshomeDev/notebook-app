import { noteManager } from "./note-actions.js";
import { stripHtml } from "../utilities/noteHelpers.js";

export function noteReducer(state, action) {
  switch (action.type) {
    case "NOTE_CREATED": {
      return {
        ...state,
        noticeMessage: "",
        notes: noteManager.insertNote(state.notes, action.payload.newNote),
        activeNoteId: action.payload.newNote.id,
        isEditMode: true,
      };
    }

    case "NOTE_CREATION_BLOCKED": {
      return {
        ...state,
        activeNoteId: action.payload.activeNoteId,
        noticeMessage: "You can't create note when empty note exists.",
        isEditMode: true,
      };
    }

    case "TITLE_UPDATED": {
      let newTitle = action.payload.title;

      return {
        ...state,
        notes: state.notes.map((note) => {
          if (note.id !== state.activeNoteId) {
            return note;
          }

          if (newTitle.trim() !== "") {
            newTitle = noteManager.generateUniqueTitle(
              state.notes,
              newTitle,
              note.id,
            );
          }

          const updatedNote = noteManager.updateNoteTitle(note, newTitle, true);

          if (!updatedNote.isTitleCustomized) {
            const autoTitle = noteManager.generateUniqueAutoTitle(
              state.notes,
              updatedNote.content,
              updatedNote.id,
            );

            return noteManager.updateNoteTitle(updatedNote, autoTitle, false);
          }
          return updatedNote;
        }),
      };
    }

    case "CONTENT_UPDATED": {
      const cleanedContent = stripHtml(action.payload.content);

      return {
        ...state,
        notes: state.notes.map((note) => {
          if (note.id !== state.activeNoteId) {
            return note;
          }

          const autoTitle = noteManager.generateUniqueAutoTitle(
            state.notes,
            cleanedContent,
            note.id,
          );

          const updatedContentNote = noteManager.updateNoteContent(
            note,
            action.payload.content,
          );

          return noteManager.updateNoteTitle(updatedContentNote, autoTitle);
        }),
      };
    }

    case "NOTE_SELECTED": {
      return {
        ...state,
        activeNoteId: action.payload.id,
        isEditMode: false,
      };
    }

    case "NOTE_DELETED": {
      const nextNotes = noteManager.removeNote(state.notes, action.payload.id);

      const wasActiveNoteIdDeleted = state.activeNoteId === action.payload.id;
      const nextActiveNoteId = wasActiveNoteIdDeleted
        ? (nextNotes[0]?.id ?? null)
        : state.activeNoteId;

      return {
        ...state,
        notes: nextNotes,
        activeNoteId: nextActiveNoteId,
        isEditMode: false,
        noticeMessage: "Note Deleted",
      };
    }

    case "EDITING_ENABLED": {
      return {
        ...state,
        isEditMode: true,
      };
    }

    case "EDITING_DISABLED": {
      return {
        ...state,
        isEditMode: false,
      };
    }

    case "NOTE_CHANGE_SAVED": {
      return {
        ...state,
        noticeMessage: "Note Saved",
      };
    }

    case "NOTICE_HIDDEN": {
      return {
        ...state,
        noticeMessage: "",
      };
    }

    default:
      return state;
  }
}
