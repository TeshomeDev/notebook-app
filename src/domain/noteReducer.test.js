import { describe, it, expect } from "vitest";
import { noteReducer } from "./noteReducer.js";

describe("noteReducer", () => {
  describe("NOTE_CREATED", () => {
    it("adds a new note object to notes array", () => {
      const state = {
        notes: [],
        activeNoteId: null,
        isEditMode: false,
        noticeMessage: "",
      };

      const newNote = {
        id: "1",
        title: "new note",
        content: "new content",
        timeStamp: 123,
        isTitleCustomized: false,
      };
      const action = { type: "NOTE_CREATED", payload: { newNote } };

      const newState = noteReducer(state, action);

      expect(newState.notes).toHaveLength(1);
      expect(newState.notes).not.toHaveLength(0);
      expect(newState.notes[0]).toEqual(newNote);
      expect(newState).not.toBe(state);
      expect(newState.isEditMode).toBe(true);
      expect(newState.activeNoteId).toBe("1");
      expect(newState.noticeMessage).toBe("");
    });
  });

  describe("NOTE_CREATION_BLOCKED", () => {
    it("prevents note creation when a note is empty inside notes array", () => {
      const state = {
        notes: [],
        activeNoteId: null,
        isEditMode: false,
        noticeMessage: "",
      };
      const action = {
        type: "NOTE_CREATION_BLOCKED",
        payload: { activeNoteId: "2" },
      };

      const newState = noteReducer(state, action);

      expect(newState).not.toBe(state);
      expect(newState.activeNoteId).toBe("2");
      expect(newState.isEditMode).toBe(true);
      expect(newState.noticeMessage).toBe(
        "You can't create note when empty note exists.",
      );
    });
  });

  describe("TITLE_UPDATED", () => {
    it("updates active note title", () => {
      const state = {
        notes: [
          {
            id: "1",
            title: "new note",
            content: "new content",
            timeStamp: 123,
            isTitleCustomized: false,
          },
          {
            id: "2",
            title: "old note",
            content: "old content",
            timeStamp: 1234,
            isTitleCustomized: false,
          },
        ],
        activeNoteId: "1",
        isEditMode: false,
        noticeMessage: "",
      };
      const action = {
        type: "TITLE_UPDATED",
        payload: { title: "updated title" },
      };

      const newState = noteReducer(state, action);

      expect(newState).not.toBe(state);
      expect(newState.notes[0].title).toBe("updated title");
      expect(newState.notes[0].title).not.toBe("new note");
      expect(newState.notes[0]).not.toBe(state.notes[0]);
      expect(newState.notes[0].isTitleCustomized).toBe(true);
      expect(newState.notes[1]).toBe(state.notes[1]);
      expect(newState.notes[1].title).toBe("old note");
    });
  });

  describe("CONTENT_UPDATED", () => {
    it("updates active note content", () => {
      const state = {
        notes: [
          {
            id: "1",
            title: "new note",
            content: "new content",
            timeStamp: 123,
            isTitleCustomized: false,
          },
          {
            id: "2",
            title: "old note",
            content: "old content",
            timeStamp: 1234,
            isTitleCustomized: false,
          },
        ],
        activeNoteId: "2",
        isEditMode: false,
        noticeMessage: "",
      };
      const action = {
        type: "CONTENT_UPDATED",
        payload: { content: "updated content" },
      };

      const newState = noteReducer(state, action);

      expect(newState).not.toBe(state);
      expect(newState.notes[1].content).toBe("updated content");
      expect(newState.notes[1].title).not.toBe("old content");
      expect(newState.notes[1]).not.toBe(state.notes[1]);
      expect(newState.notes[0]).toBe(state.notes[0]);
      expect(newState.notes[0].content).toBe("new content");
    });
  });

  describe("NOTE_SELECTED", () => {
    it("selects a note from notes array", () => {
      const state = {
        notes: [
          {
            id: "1",
            title: "new note",
            content: "new content",
            timeStamp: 123,
            isTitleCustomized: false,
          },
          {
            id: "2",
            title: "old note",
            content: "old content",
            timeStamp: 1234,
            isTitleCustomized: false,
          },
        ],
        activeNoteId: "2",
        isEditMode: false,
        noticeMessage: "",
      };
      const action = {
        type: "NOTE_SELECTED",
        payload: { id: "1" },
      };

      const newState = noteReducer(state, action);

      expect(newState).not.toBe(state);
      expect(newState.activeNoteId).toBe("1");
      expect(newState.isEditMode).toBe(false);
      expect(state.activeNoteId).toBe("2");
    });
  });

  describe("NOTE_DELETED", () => {
    describe("When note id exists: ", () => {
      it("deletes the note that matches the note id", () => {
        const state = {
          notes: [
            {
              id: "1",
              title: "new note",
              content: "new content",
              timeStamp: 123,
              isTitleCustomized: false,
            },
            {
              id: "2",
              title: "old note",
              content: "old content",
              timeStamp: 1234,
              isTitleCustomized: false,
            },
          ],
          activeNoteId: "2",
          isEditMode: false,
          noticeMessage: "",
        };
        const action = {
          type: "NOTE_DELETED",
          payload: { id: "1" },
        };

        const newState = noteReducer(state, action);

        expect(newState).not.toBe(state);
        expect(newState.notes).toHaveLength(1);
        expect(newState.activeNoteId).toBe("2");
        expect(newState.isEditMode).toBe(false);
        expect(newState.noticeMessage).toBe("Note Deleted");
      });
    });

    describe("When the note to delete is active note: ", () => {
      it("deletes the note and updates activeNoteId value to the first index's note id", () => {
        const state = {
          notes: [
            {
              id: "1",
              title: "new note",
              content: "new content",
              timeStamp: 123,
              isTitleCustomized: false,
            },
            {
              id: "2",
              title: "old note",
              content: "old content",
              timeStamp: 1234,
              isTitleCustomized: false,
            },
          ],
          activeNoteId: "2",
          isEditMode: false,
          noticeMessage: "",
        };
        const action = {
          type: "NOTE_DELETED",
          payload: { id: "2" },
        };

        const newState = noteReducer(state, action);

        expect(newState).not.toBe(state);
        expect(newState.notes).toHaveLength(1);
        expect(newState.activeNoteId).toBe("1");
        expect(newState.isEditMode).toBe(false);
        expect(newState.noticeMessage).toBe("Note Deleted");
      });
    });

    describe("When the deleted note is the last note: ", () => {
      it("updates activeNoteId value to null", () => {
        const state = {
          notes: [
            {
              id: "2",
              title: "old note",
              content: "old content",
              timeStamp: 1234,
              isTitleCustomized: false,
            },
          ],
          activeNoteId: "2",
          isEditMode: false,
          noticeMessage: "",
        };
        const action = {
          type: "NOTE_DELETED",
          payload: { id: "2" },
        };

        const newState = noteReducer(state, action);

        expect(newState).not.toBe(state);
        expect(newState.notes).toHaveLength(0);
        expect(newState.activeNoteId).toBeNull();
        expect(newState.isEditMode).toBe(false);
        expect(newState.noticeMessage).toBe("Note Deleted");
      });
    });
  });

  describe("EDITING_ENABLED", () => {
    it("updates isEditMode value to true", () => {
      const state = {
        notes: [{ id: "1", title: "enabling edition" }],
        activeNoteId: "1",
        isEditMode: false,
        noticeMessage: "",
      };
      const action = { type: "EDITING_ENABLED" };

      const newState = noteReducer(state, action);

      expect(newState).not.toBe(state);
      expect(newState).not.toEqual(state);
      expect(newState.isEditMode).toBe(true);
    });
  });

  describe("EDITING_DISABLED", () => {
    it("updates isEditMode value to false", () => {
      const state = {
        notes: [{ id: "1", title: "disabling edition" }],
        activeNoteId: "1",
        isEditMode: true,
        noticeMessage: "",
      };
      const action = { type: "EDITING_DISABLED" };

      const newState = noteReducer(state, action);

      expect(newState).not.toBe(state);
      expect(newState).not.toEqual(state);
      expect(newState.isEditMode).toBe(false);
    });
  });

  describe("NOTE_CHANGE_SAVED", () => {
    it("updates noticeMessage's content to Note saved", () => {
      const state = {
        notes: [{ id: "1", title: "notifying change saved" }],
        activeNoteId: "1",
        isEditMode: false,
        noticeMessage: "",
      };
      const action = { type: "NOTE_CHANGE_SAVED" };

      const newState = noteReducer(state, action);

      expect(newState).not.toBe(state);
      expect(newState).not.toEqual(state);
      expect(newState.noticeMessage).toBe("Note Saved");
    });
  });

  describe("NOTICE_HIDDEN", () => {
    it("updates noticeMessage's content to empty string", () => {
      const state = {
        notes: [{ id: "1", title: "hidding notice" }],
        activeNoteId: "1",
        isEditMode: false,
        noticeMessage: "Note Saved",
      };
      const action = { type: "NOTICE_HIDDEN" };

      const newState = noteReducer(state, action);

      expect(newState).not.toBe(state);
      expect(newState).not.toEqual(state);
      expect(newState.noticeMessage).toBe("");
    });
  });
});
