
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

  generateAutoTitle(content, customTitle = "Untitled Note") {
    if(!content || !content.trim()) return customTitle;

    const cleanedContent = stripHtml(content);

    const firstLine = cleanedContent.trim().split("\n")[0];
    const maxChars = 35;

    let newTitle = firstLine.length > maxChars ? firstLine.slice(0, maxChars) : firstLine;
    return newTitle || customTitle;
  },

  isNoteEmpty(note) {
    return note.title === "" || note.content === "";
  }
};

function stripHtml(htmlString) {
  if(!htmlString) return;

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  return doc.body.textContent || "";
}