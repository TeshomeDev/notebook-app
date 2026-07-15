

export const draftManager = {

  createDraftFromNotes(note) {
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      timeStamp: note.timeStamp,
    };
  },

  updateDraftTitle(activeDraft, title) {
    return {
      ...activeDraft,
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