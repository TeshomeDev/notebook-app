import { beforeEach, describe, expect, it } from "vitest";
import { storageManager } from "./storage.js";

describe("storageManager", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Method: loadNotes()", () => {
    describe("When a new notes key exists: ", () => {
      it("returns a parsed notes array", () => {
        const notes = [
          {
            id: "1",
            title: "new note title",
            content: "new note content",
            timeStamp: 1233,
            isTitleCustomized: false,
          },
        ];

        localStorage.setItem(storageManager.keys.notes, JSON.stringify(notes));
        const savedNotes = storageManager.loadNotes();

        expect(savedNotes).toEqual(notes);
      });
    });

    describe("When a new notes key doesn't exist:", () => {
      it("should return a parsed notes array from legacy key and migrate the parsed notes to the new key", () => {
        const note = [
          {
            id: "2",
            title: "legacy title",
            content: "legacy content",
            timeStamp: 1234,
            isTitleCustomized: false,
          },
        ];
        localStorage.setItem(
          storageManager.keys.legacyNotes,
          JSON.stringify(note),
        );

        const noteFromLegacyKey = storageManager.loadNotes();
        const noteFromNewKey = localStorage.getItem(storageManager.keys.notes);
        const parsedNoteFromNewKey = JSON.parse(noteFromNewKey);

        expect(noteFromLegacyKey).toEqual(note);
        expect(noteFromLegacyKey).toEqual(parsedNoteFromNewKey);
      });
    });

    describe("When there is no notes saved", () => {
      it("returns an empty array", () => {
        const emptyNotes = storageManager.loadNotes();

        expect(emptyNotes).toEqual([]);
      });
    });

    describe("When corrupted JSON is saved: ", () => {
      it("returns an empty array", () => {
        localStorage.setItem(storageManager.keys.notes, "[{ corrupted data");

        const corruptedNote = storageManager.loadNotes();

        expect(corruptedNote).toEqual([]);
      });
    });
  });

  describe("Method: loadActiveNoteId()", () => {
    describe("When a new key exists: ", () => {
      it("returns active id from the new key", () => {
        const notes = [
          { id: "1", title: "first title" },
          { id: "2", title: "second title" },
        ];
        localStorage.setItem(storageManager.keys.activeNoteId, "1");

        const activeId = storageManager.loadActiveNoteId(notes);

        expect(activeId).toBe("1");
      });
    });

    describe("When a new key doesn't exist: ", () => {
      it("returns active id fron an old key and migrates the id to the new key", () => {
        const notes = [
          { id: "L-1", title: "first title" },
          { id: "L-2", title: "second title" },
        ];
        localStorage.setItem(storageManager.keys.legacyActiveNoteId, "L-1");

        const activeId = storageManager.loadActiveNoteId(notes);
        const activeIdFromTheNewKey = localStorage.getItem(
          storageManager.keys.activeNoteId,
        );

        expect(activeId).toBe(activeIdFromTheNewKey);
        expect(activeIdFromTheNewKey).toBe("L-1");
      });
    });

    describe("When the active id doesn't exist: ", () => {
      it("returns null", () => {
        const notes = [
          { id: "1", title: "first title" },
          { id: "2", title: "second title" },
        ];
        localStorage.setItem(storageManager.keys.activeNoteId, "L-1");
        const activeId = storageManager.loadActiveNoteId(notes);

        expect(activeId).toBeNull();
      });
    });

    describe("When active id is an empty string: ", () => {
      it("returns null", () => {
        const notes = [
          { id: "1", title: "first title" },
          { id: "2", title: "second title" },
        ];
        localStorage.setItem(storageManager.keys.activeNoteId, "");
        const activeId = storageManager.loadActiveNoteId(notes);

        expect(activeId).toBeNull();
      });
    });

    describe("When encounters error: ", () => {
      it("returns null", () => {
        const activeId = storageManager.loadActiveNoteId();

        expect(activeId).toBeNull();
      });
    });

    describe("When active id isn't stored: ", () => {
      it("returns null", () => {
        const notes = [
          { id: "1", title: "first title" },
          { id: "2", title: "second title" },
        ];
        const activeId = storageManager.loadActiveNoteId(notes);

        expect(activeId).toBeNull();
      });
    });
  });

  describe("Method: saveNotes()", () => {
    describe("When notes exist and its type is object and is an array: ", () => {
      it("saves to localStorage", () => {
        const notes = [
          { id: "1", title: "first title" },
          { id: "2", title: "second title" },
        ];

        storageManager.saveNotes(notes);
        const savedNotes = localStorage.getItem(storageManager.keys.notes);

        expect(savedNotes).toEqual(JSON.stringify(notes));
      });
    });

    describe("When notes doesn't exist: ", () => {
      it("doesn't save to localStorage", () => {
        let notes;

        storageManager.saveNotes(notes);
        const savedNotes = localStorage.getItem(storageManager.keys.notes);

        expect(savedNotes).toBeNull();
      });
    });

    describe("When type of notes isn't an object: ", () => {
      it("does't save", () => {
        const notes = "id: '1', title: 'corrupted note'";

        storageManager.saveNotes(notes);
        const savedNotes = localStorage.getItem(storageManager.keys.notes);

        expect(savedNotes).toBeNull();
      });
    });

    describe("When notes isn't an array: ", () => {
      it("doesn't save", () => {
        const notes = {
          note1: { id: "1", title: "first title" },
          note2: { id: "2", title: "second title" },
        };

        storageManager.saveNotes(notes);
        const savedNotes = localStorage.getItem(storageManager.keys.notes);

        expect(savedNotes).toBeNull();
      });
    });
  });

  describe("Method: saveActiveNoteId()", () => {
    describe("When active id exists and its type is stype is string: ", () => {
      it("saves to localStorage", () => {
        const id = "note-1";

        storageManager.saveActiveNoteId(id);
        const savedId = localStorage.getItem(storageManager.keys.activeNoteId);

        expect(savedId).toBe(id);
      });
    });

    describe("When active id doesn't exist or is empty string or isn't type string: ", () => {
      it("doesn't save to localStorage", () => {
        [null, undefined, "", " ", 123].forEach((invalidId) => {
          storageManager.saveActiveNoteId(invalidId);
          const savedId = localStorage.getItem(
            storageManager.keys.activeNoteId,
          );

          expect(savedId).toBeNull();
        });
      });
    });
  });
});
