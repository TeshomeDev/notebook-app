import { noteManager } from "./note-actions.js";

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
      return {
        ...state,
        notes: state.notes.map((note) => {
          if (note.id !== state.activeNoteId) {
            return note;
          }

          return noteManager.updateNoteTitle(
            state.notes,
            note,
            action.payload.title,
          );
        }),
      };
    }

    case "CONTENT_UPDATED": {
      return {
        ...state,
        notes: state.notes.map((note) => {
          if (note.id !== state.activeNoteId) {
            return note;
          }

          return noteManager.updateNoteContent(
            state.notes,
            note,
            action.payload.content,
          );
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
        noticeMessage: "Note saved",
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
