import { NOTE_CONSTANTS } from "./noteConstants.js";

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

  createNote(customTitle = NOTE_CONSTANTS.DEFAULT_TITLE) {
    return {
      id: crypto.randomUUID(),
      title: customTitle,
      content: "",
      isTitleCustomized: false,
      timeStamp: Date.now(),
    };
  },

  updateNoteContent(activeNote, content) {
    const newContent = typeof content === "string" ? content : "";
    return {
      ...activeNote,
      content: newContent,
    };
  },

  updateNoteTitle(activeNote, title, hasUserCustomizedTitle = false) {
    const isTitleEmpty = typeof title === "string" && title.trim() === "";

    if (hasUserCustomizedTitle && isTitleEmpty) {
      return {
        ...activeNote,
        title: "",
        isTitleCustomized: false,
      };
    }

    const shouldUpdateTitle =
      hasUserCustomizedTitle || !activeNote.isTitleCustomized;
    const newTitle = shouldUpdateTitle ? title : activeNote.title;

    return {
      ...activeNote,
      title: newTitle,
      isTitleCustomized: activeNote.isTitleCustomized || hasUserCustomizedTitle,
    };
  },

  isNoteEmpty(note) {
    return (
      note.title.replace(/<[^>]*>/g, "").trim() === "" ||
      note.content.replace(/<[^>]*>/g, "").trim() === ""
    );
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

    while (
      notes.some(
        (note) =>
          note.id !== currentNoteId &&
          note.title.toLowerCase() === uniqueTitle.toLowerCase(),
      )
    ) {
      uniqueTitle = `${baseTitle} (${counter})`;
      counter++;
    }

    return uniqueTitle;
  },

  generateAutoTitle(content, customTitle = NOTE_CONSTANTS.DEFAULT_TITLE) {
    if (!content || !content.trim()) return customTitle;
    const firstLine = content.trim().split("\n")[0];

    let newTitle =
      firstLine.length > NOTE_CONSTANTS.MAX_NOTE_TITLE_LENGTH
        ? firstLine.slice(0, NOTE_CONSTANTS.MAX_NOTE_TITLE_LENGTH)
        : firstLine;

    return newTitle || customTitle;
  },
};
