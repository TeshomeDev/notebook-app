

export const storageManager = {
  keys: {
    notes: "my-notes-app-data",
    activeNoteId: "my-notes-app-active-note-id",
  },

  loadNotes() {
    try {
      let savedData = localStorage.getItem(this.keys.notes);
      if(!savedData || savedData === "undefined" || savedData === null) {
        return savedData = [];
      }
      return JSON.parse(savedData);
    } catch (error) {
      console.error("Unable to load saved notes.", error);
      return [];
    }
  },

  loadActiveNoteId() {
    try {
      return localStorage.getItem(this.keys.activeNoteId) || null;
    } catch (error) {
      console.error("Unable to load active note id.", error);
      return null;
    }
  },

  saveNotes(notesToSave) {
    localStorage.setItem(this.keys.notes, JSON.stringify(notesToSave));
  },

  saveActiveNoteId(noteId) {
    if (noteId) {
      localStorage.setItem(this.keys.activeNoteId, noteId);
    } else {
      localStorage.removeItem(this.keys.activeNoteId);
    }
  },
};
