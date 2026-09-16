import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCases } from "./use-cases.js";
import { stateManager } from "../state/state.js";

vi.mock("../state/state.js", () => ({
  stateManager: {
    dispatch: vi.fn(),
    getState: vi.fn(),
    getEmptyNote: vi.fn(),
    hasEmptyNote: vi.fn(),
  },
}));

describe("useCases", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("Method: startEditing()", () => {
    it("dispatches EDITING_ENABLED", () => {
      useCases.startEditing();

      expect(stateManager.dispatch).toHaveBeenCalledWith({
        type: "EDITING_ENABLED",
      });
    });
  });

  describe("Method: stopEditing()", () => {
    it("dispatches EDITING_DISABLED", () => {
      useCases.stopEditing();

      expect(stateManager.dispatch).toHaveBeenCalledWith({
        type: "EDITING_DISABLED",
      });
    });
  });

  describe("Method: selectNote()", () => {
    it("dispatches NOTE_SELECTED", () => {
      useCases.selectNote("1");

      expect(stateManager.dispatch).toHaveBeenCalledWith({
        type: "NOTE_SELECTED",
        payload: { id: "1" },
      });
    });
  });

  describe("Method: addNote()", () => {
    describe("When empty note exists", () => {
      it("dispatches NOTE_CREATION_BLOCKED", () => {
        stateManager.hasEmptyNote.mockReturnValue(true);
        stateManager.getEmptyNote.mockReturnValue({
          id: "empty-note-id-11",
          title: "",
          content: "",
        });
        useCases.addNote();

        expect(stateManager.dispatch).toHaveBeenCalledOnce();
        expect(stateManager.dispatch).toHaveBeenCalledWith({
          type: "NOTE_CREATION_BLOCKED",
          payload: { activeNoteId: "empty-note-id-11" },
        });
      });
    });

    describe("When there's no empty note object", () => {
      it("creates a default note object and dispatches NOTE_CREATED", () => {
        stateManager.getState.mockReturnValue({
          notes: [],
        });
        stateManager.hasEmptyNote.mockReturnValue(false);

        useCases.addNote();

        expect(stateManager.dispatch).toHaveBeenCalledOnce();
        expect(stateManager.dispatch).toHaveBeenCalledWith({
          type: "NOTE_CREATED",
          payload: {
            newNote: expect.objectContaining({
              title: "Untitled Note",
              content: "",
              isTitleCustomized: false,
            }),
          },
        });
      });
    });
  });

  describe("Method: deleteNote()", () => {
    it("dispatches NOTE_DELETED", () => {
      useCases.deleteNote("1");

      expect(stateManager.dispatch).toHaveBeenCalledOnce();
      expect(stateManager.dispatch).toHaveBeenCalledWith({
        type: "NOTE_DELETED",
        payload: { id: "1" },
      });
    });
  });
});
