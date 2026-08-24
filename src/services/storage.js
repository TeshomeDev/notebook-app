
import { NOTE_CONSTANTS } from "../domain/noteConstants.js";

const { DEFAULT_TITLE } = NOTE_CONSTANTS;

export const storageManager = {
  keys: {
    notes: "notes-data",
    legacyNotes: "my-notes-app-data",

    activeNoteId: "active-note-id",
    legacyActiveNoteId: "my-notes-app-active-note-id",
  },

  loadNotes() {
    let savedDataString = localStorage.getItem(this.keys.notes);
    let shouldMigrate = false;

    if(!savedDataString) {
      savedDataString = localStorage.getItem(this.keys.legacyNotes);
      shouldMigrate = Boolean(savedDataString);
    }

    if (!savedDataString) return [];

    try {
      const parsedNotes = JSON.parse(savedDataString);

      if (!parsedNotes || !Array.isArray(parsedNotes)) {
        return [];
      }
      const cleanedNotes = parsedNotes
      .map(sanitizeNote)
      .map(normalizeNote);

      if(shouldMigrate) {
        localStorage.setItem(this.keys.notes, JSON.stringify(cleanedNotes));
      }

      return cleanedNotes;
    } catch (error) {
      console.error("Unable to load saved notes.", error.message);
      return [];
    }
  },

  loadActiveNoteId(notes) {
    let savedIdString = localStorage.getItem(this.keys.activeNoteId);
    let shouldMigrate = false;

    if(!savedIdString) {
      savedIdString = localStorage.getItem(this.keys.legacyActiveNoteId);
      shouldMigrate = Boolean(savedIdString);
    }

    if (!savedIdString) return null;

    try {
      const savedId = savedIdString;
      const activeIdExists = notes.some((note) => note.id === savedId);
      if (!activeIdExists || typeof savedId !== "string" || savedId === "") {
        return null;
      }

      if(shouldMigrate) {
        localStorage.setItem(this.keys.activeNoteId, savedId);
      }

      return savedId;
    } catch (error) {
      console.error("Unable to load active note id.", error.message);
      return null;
    }
  },

  saveNotes(notesToSave) {
    if (!notesToSave) return;
    localStorage.setItem(this.keys.notes, JSON.stringify(notesToSave));
  },

  saveActiveNoteId(noteId) {
    noteId
      ? localStorage.setItem(this.keys.activeNoteId, noteId)
      : localStorage.removeItem(this.keys.activeNoteId);
  },
};


function sanitizeNote(rawData) {
  if(!rawData || typeof rawData !== "object") {
    return {
      id: crypto.randomUUID(),
      title: DEFAULT_TITLE,
      content: "",
      timeStamp: Date.now(),
      isTitleCustomized: false
    }
  }

  return {
    id: typeof rawData.id === "string" ? rawData.id : crypto.randomUUID(),
    title: typeof rawData.title === "string" ? rawData.title : DEFAULT_TITLE,
    content: typeof rawData.content === "string" ? rawData.content : "",
    timeStamp: typeof rawData.timeStamp === "number" ? rawData.timeStamp : Date.now(),
    isTitleCustomized: typeof rawData.isTitleCustomized === "boolean" ? rawData.isTitleCustomized : false
  }
}


  function normalizeNote(note) {
    return {
      ...note,
      isTitleCustomized: note.isTitleCustomized ?? false
    }
  }
