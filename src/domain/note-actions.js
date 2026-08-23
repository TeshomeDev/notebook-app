
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
      isTitleCustomized: false,
      timeStamp: Date.now(),
    };
  },

  updateNoteContent(notes, activeNote, content) {
    let newTitle = activeNote.isTitleCustomized
      ? activeNote.title : this.generateUniqueAutoTitle(
        notes,
        content,
        activeNote.id)

    return {
      ...activeNote,
      content,
      title: newTitle
    };
  },

  updateNoteTitle(notes, activeNote, title) {
    const isTitleCustomized = title.trim() !== "";
   let newTitle = isTitleCustomized
     ? title
     : this.generateUniqueAutoTitle(
         notes,
         activeNote.content,
         activeNote.id,
       );

    return {
      ...activeNote,
      title: newTitle,
      isTitleCustomized
    }
  },

  generateUniqueAutoTitle(notes, content, noteId) {
    let autoTitle = this.generateAutoTitle(content);
    const uniqueTitle = this.generateUniqueTitle(notes, autoTitle, noteId);
    return uniqueTitle;
  },

  generateUniqueTitle(notes, noteTitle, currentNoteId) {
    let uniqueTitle = noteTitle.trim();
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
    return (
      note.title.replace(/<[^>]*>/g, "") === "" ||
      note.content.replace(/<[^>]*>/g, "") === ""
    );
  },
};

function stripHtml(htmlString) {
  if(!htmlString) return;

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  return doc.body.textContent || "";
}