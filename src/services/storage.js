

export const storageManager = {
  keys: {
    notes: "my-notes-app-data",
    activeNoteId: "my-notes-app-active-note-id",
  },

  loadNotes() {
    let savedDataString = localStorage.getItem(this.keys.notes);
    if(!savedDataString) return [];

    try {
      const parsedNotes = JSON.parse(savedDataString);

      if(!parsedNotes || !Array.isArray(parsedNotes)) {
        return [];
      }
      const cleanedNotes = parsedNotes.map(sanitizeNote);
      return cleanedNotes.map(normalizeNote);

    } catch (error) {
      console.error("Unable to load saved notes.", error.message);
      return [];
    }
  },

  loadActiveNoteId(notes) {
    let savedIdString = localStorage.getItem(this.keys.activeNoteId);
    if(!savedIdString) return null;

    try {
      const savedId = savedIdString;
      const ActiveIdExists = notes.some(note => note.id === savedId);
      if(!ActiveIdExists || typeof savedId !== "string" || savedId === "") {
        return null;
      }

      return savedId;

    } catch (error) {
      console.error("Unable to load active note id.", error.message);
      return null;
    }
  },

  saveNotes(notesToSave) {
    if(!notesToSave) return;
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
      title: "Untitled Note",
      content: "",
      timeStamp: Date.now(),
      isTitleCustomized: false
    }
  }

  return {
    id: typeof rawData.id === "string" ? rawData.id : crypto.randomUUID(),
    title: typeof rawData.title === "string" ? rawData.title : "Untitled Note",
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
