import { describe, it, expect } from "vitest";
import { noteManager } from "./note-actions.js";
import { NOTE_CONSTANTS } from "./noteConstants.js";

describe("noteManager", () => {
  describe("Method: insertNote()", () => {
    it("appends a new note to existing array of notes and ensures immutability", () => {
      const initialNotes = [
        { id: "1", title: "First note", content: "Hello vitest" },
      ];
      const newNote = {
        id: "2",
        title: "Second note",
        content: "Hello vitest result",
      };

      const updatedNotes = noteManager.insertNote(initialNotes, newNote);

      expect(updatedNotes).toHaveLength(2);
      expect(updatedNotes[1]).toEqual(newNote);

      expect(initialNotes).toHaveLength(1);
      expect(initialNotes).not.toBe(updatedNotes);
    });

    it("works correctly when inserting into an empty notes array", () => {
      const initialNotes = [];
      const newNote = { id: "1", title: "Note 1" };

      const updatedNotes = noteManager.insertNote(initialNotes, newNote);

      expect(updatedNotes).toHaveLength(1);
      expect(updatedNotes[0]).toEqual(newNote);
    });
  });

  describe("Method: updateNote()", () => {
    describe("When the target id exists: ", () => {
      it("updates target note properties immutably", () => {
        const notes = [
          { id: "1", title: "Note 1", content: "First note content" },
          { id: "2", title: "Note 2", content: "Second note content" },
        ];
        const changes = { title: "New Title", content: "New content" };

        const updatedNotes = noteManager.updateNote(notes, "2", changes);

        expect(updatedNotes[1]).toEqual({
          id: "2",
          title: "New Title",
          content: "New content",
        });
        expect(updatedNotes[1]).not.toBe(notes[1]);
        expect(updatedNotes[1].id).toBe("2");
        expect(updatedNotes[1]).not.toEqual(notes[1]);
      });

      it("Preserves untouched note reference", () => {
        const notes = [
          { id: "1", title: "Note 1", content: "First note content" },
          { id: "2", title: "Note 2", content: "Second note content" },
        ];
        const changes = { title: "New Title", content: "New content" };

        const updatedNotes = noteManager.updateNote(notes, "2", changes);

        expect(updatedNotes[0]).toBe(notes[0]);
        expect(updatedNotes).not.toBe(notes);
      });
    });

    describe("When target id does't exist: ", () => {
      it("returns a new reference notes array without changes to any note", () => {
        const notes = [
          { id: "1", title: "Note 1", content: "First note content" },
          { id: "2", title: "Note 2", content: "Second note content" },
        ];
        const changes = { title: "New Title", content: "New content" };

        const updatedNotes = noteManager.updateNote(notes, "3", changes);

        expect(updatedNotes).toEqual(notes);
        expect(updatedNotes).toHaveLength(2);
        expect(updatedNotes).not.toBe(notes);
      });
    });
  });

  describe("Method: removeNote()", () => {
    describe("When target id exists: ", () => {
      it("removes the note that matches the target id", () => {
        const notes = [
          { id: "1", title: "old note" },
          { id: "2", title: "new note" },
        ];

        const updatedNotes = noteManager.removeNote(notes, "1");

        expect(updatedNotes).toHaveLength(1);
        expect(updatedNotes[0]).toEqual(notes[1]);
        expect(updatedNotes[0]).toBe(notes[1]);
        expect(updatedNotes).not.toBe(notes);
      });

      it("preseves the remaining note reference", () => {
        const notes = [
          { id: "1", title: "old note" },
          { id: "2", title: "new note" },
        ];

        const updatedNotes = noteManager.removeNote(notes, "1");

        expect(updatedNotes[0]).toBe(notes[1]);
      });
    });

    describe("When target id doesn't exist: ", () => {
      it("returns the existing notes as is with a new reference", () => {
        const notes = [
          { id: "1", title: "old note" },
          { id: "2", title: "new note" },
        ];

        const updatedNotes = noteManager.removeNote(notes, "3");

        expect(updatedNotes).toEqual(notes);
        expect(updatedNotes).toHaveLength(2);
        expect(updatedNotes).not.toBe(notes);
        expect(updatedNotes[0]).toBe(notes[0]);
      });
    });
  });

  describe("Method: createNote()", () => {
    it("returns an object with default domain properties", () => {
      const newNote = noteManager.createNote();

      expect(newNote).toEqual({
        id: expect.any(String),
        title: NOTE_CONSTANTS.DEFAULT_TITLE,
        content: "",
        timeStamp: expect.any(Number),
        isTitleCustomized: false,
      });
    });

    it("generates a unique id when called many times", () => {
      const note1 = noteManager.createNote();
      const note2 = noteManager.createNote();

      expect(note1.id).not.toBe(note2.id);
    });
  });

  describe("Method: updateNoteContent()", () => {
    it("should return a new note object with updated content", () => {
      const note = { id: "1", title: "old note", content: "old content" };

      const updatedNote = noteManager.updateNoteContent(note, "new content");

      expect(updatedNote.content).toBe("new content");
      expect(updatedNote.title).toBe("old note");
    });

    it("should update a note immutably", () => {
      const note = { id: "1", title: "old note", content: "old content" };

      const updatedNote = noteManager.updateNoteContent(note, "new content");

      expect(updatedNote).not.toBe(note);
    });

    it("handles an empty or null or undefined note content", () => {
      const note = { id: "1", title: "old note", content: "old content" };

      const updatedNote1 = noteManager.updateNoteContent(note, "");
      const updatedNote2 = noteManager.updateNoteContent(note, null);
      const updatedNote3 = noteManager.updateNoteContent(note, undefined);

      expect(updatedNote1.content).toBe("");
      expect(updatedNote2.content).toBe("");
      expect(updatedNote3.content).toBe("");
      expect(note.content).toBe("old content");
    });
  });

  describe("Method: updateNoteTitle()", () => {
    describe("When title input is edited: ", () => {
      it("returns a new note with updated title and isTitleCustomized to true", () => {
        const note = {
          id: "1",
          title: "old title",
          content: "old content",
          isTitleCustomized: false,
        };
        const newTitle = "new title";

        const updatedNote = noteManager.updateNoteTitle(note, newTitle, true);

        expect(updatedNote).not.toBe(note);
        expect(updatedNote).not.toEqual(note);
        expect(updatedNote.title).toBe("new title");
        expect(updatedNote.isTitleCustomized).toBe(true);
        expect(note.title).toBe("old title");
      });
    });

    describe("When a user emptied title: ", () => {
      it("returns a new note with empty title and updated isTitleCustomized to false", () => {
        const note = {
          id: "1",
          title: "old title",
          content: "old content",
          isTitleCustomized: true,
        };
        const newTitle = "";

        const updatedNote = noteManager.updateNoteTitle(note, newTitle, true);

        expect(updatedNote).not.toBe(note);
        expect(updatedNote.title).toBe("");
        expect(updatedNote.title).not.toBe(note.title);
        expect(updatedNote.isTitleCustomized).toBe(false);
        expect(updatedNote.content).toBe("old content");
        expect(note.title).toBe("old title");
      });
    });
  });

  describe("Method: isNoteEmpty()", () => {
    it("returns true if title or content is empty or false if they aren't empty", () => {
      const note1 = { id: "1", title: "first title", content: "first content" };
      const note2 = { id: "1", title: "second title", content: "" };
      const note3 = { id: "1", title: "", content: "third content" };
      const note4 = { id: "1", title: "", content: "" };

      const isNote1Empty = noteManager.isNoteEmpty(note1);
      const isNote2Empty = noteManager.isNoteEmpty(note2);
      const isNote3Empty = noteManager.isNoteEmpty(note3);
      const isNote4Empty = noteManager.isNoteEmpty(note4);

      expect(isNote1Empty).toBe(false);
      expect(isNote2Empty).toBe(true);
      expect(isNote3Empty).toBe(true);
      expect(isNote4Empty).toBe(true);
    });
  });

  describe("Method: generateUniqueAutoTitle()", () => {
    const notes = [
      { id: "1", title: "first title", content: "first content" },
      { id: "2", title: "second title", content: "second content" },
    ];

    it("generates a title from content's first line when title isn't customized", () => {
      const note = {
        id: "3",
        title: "Untitled Note",
        content: "third content",
      };

      const uniqueTitle = noteManager.generateUniqueAutoTitle(
        notes,
        note.content,
        note.id,
      );

      expect(uniqueTitle).toBe("third content");
      expect(uniqueTitle).not.toBe(note.title);
    });

    it("generates a title from content's first line when title is empty", () => {
      const note = { id: "3", title: "", content: "third content" };

      const uniqueTitle = noteManager.generateUniqueAutoTitle(
        notes,
        note.content,
        note.id,
      );

      expect(uniqueTitle).toBe("third content");
      expect(uniqueTitle).not.toBe(note.title);
    });

    it("generates a default title when title and content are empty", () => {
      const note = { id: "3", title: "", content: "" };

      const title = noteManager.generateUniqueAutoTitle(
        notes,
        note.content,
        note.id,
      );

      expect(title).toBe("Untitled Note");
    });
  });

  describe("Method: generateUniqueTitle()", () => {
    const notes = [
      { id: "1", title: "first title", content: "first content" },
      { id: "2", title: "second title", content: "second content" },
    ];

    it("generates a unique title and appends suffix number within a parentheses when a match title found", () => {
      const note = { id: "3", title: "second title", content: "second content" };

      const uniqueTitle = noteManager.generateUniqueTitle(
        notes,
        note.title,
        note.id,
      );

      expect(uniqueTitle).toBe("second title (1)");
    });

    it("doesn't compare a title against itself", () => {
      const note = { id: "3", title: "third title", content: "third content" };

      const uniqueTitle = noteManager.generateUniqueTitle(
        notes,
        note.title,
        note.id,
      );

      expect(uniqueTitle).toBe("third title");
      expect(uniqueTitle).not.toBe("third title (1)");
    });
  });

  describe("Method: generateAutoTitle()", () => {
    // generateAutoTitle() takes a note content as an input
    describe("When content isn't empty: ", () => {
      it("returns the first line of the content as a title", () => {
        const content = "first line \n second line";

        const autoTitle = noteManager.generateAutoTitle(content);

        expect(autoTitle.trim()).toBe("first line");
      });
    });

    describe("When content is empty", () => {
      it("returns a default title", () => {
        const content = "";

        const autoTitle = noteManager.generateAutoTitle(content);

        expect(autoTitle).toBe("Untitled Note");
      });
    });
  });
});
