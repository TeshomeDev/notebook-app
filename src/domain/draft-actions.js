

export const draftManager = {

  createDraftFromNotes(note) {
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      timeStamp: note.timeStamp,
      isAutoTitle: note.title === "Untitled Note" || !note.title
    };
  },

  updateDraftTitle(activeDraft, title) {
    return {
      ...activeDraft,
      isAutoTitle: false,
      title,
    };
  },

  updateDraftContent(activeDraft, content) {
    return {
      ...activeDraft,
      content,
    };
  },
};