
export const noteManager = {
  insertNote(notes, newNote) {
    return [...notes, newNote];
  },

  updateNote(notes, id, changes) {
    return notes.map((note) =>
      note.id === id ? { ...note, ...changes } : note,
    );
  },

  removeNote(notes, id) {
    return notes.filter((note) => note.id !== id);
  },

  createNote(customTitle = "Untitled Note") {
    return {
      id: crypto.randomUUID(),
      title: customTitle,
      content: "",
      timeStamp: Date.now(),
    };
  },

  generateUniqueTitle(notes, noteTitle, currentNoteId) {
    let uniqueTitle = noteTitle.trim();

    if(uniqueTitle === "") {
      uniqueTitle = "Untitled Note";
    }
    let counter = 1;
    const baseTitle = uniqueTitle;

    while(notes.some(note => note.id !== currentNoteId
    && note.title.toLowerCase() === uniqueTitle.toLowerCase())) {
      uniqueTitle = `${baseTitle} (${counter})`;
      counter++;
    }
    return uniqueTitle;
  },

  isNoteEmpty(note) {
    return note.title.trim() === "" || note.content.trim() === "";
  }
};