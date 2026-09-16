import { describe, vi, it, expect, beforeEach } from "vitest";
import { storageManager } from "../services/storage.js";

vi.mock("../services/storage.js", () => ({
  storageManager: {
    loadNotes: vi.fn(() => []),
    loadActiveNoteId: vi.fn(() => null),
    saveNotes: vi.fn(),
    saveActiveNoteId: vi.fn(),
  },
}));

describe("subscribe and stateManager", () => {
  let stateManager;
  let subscribe;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    const stateModule = await import("./state.js");
    stateManager = stateModule.stateManager;
    subscribe = stateModule.subscribe;

    stateManager.initializeAppState();
  });

  describe("subscribe()", () => {
    it("registers and notifies listeners on dispatch", () => {
      const listenerSpy = vi.fn();
      const unsubscribe = subscribe(listenerSpy);

      stateManager.dispatch({ type: "EDITING_ENABLED" });

      expect(listenerSpy).toHaveBeenCalledOnce();
      expect(listenerSpy).toHaveBeenCalledWith(stateManager.getState(), {
        type: "EDITING_ENABLED",
      });

      unsubscribe();
      stateManager.dispatch({ type: "EDITING_DISABLED" });
      expect(listenerSpy).toHaveBeenCalledOnce();
    });
  });

  describe("initializeAppState()", () => {
    it("calls storageManager to load notes on initialization", () => {
      vi.clearAllMocks();
      stateManager.initializeAppState();

      expect(storageManager.loadNotes).toHaveBeenCalledOnce();
    });

    it("hydrates appState with notes loaded from storageManager", () => {
      vi.clearAllMocks();
      vi.spyOn(storageManager, "loadNotes").mockReturnValueOnce([
        { id: "1", title: "mock title" },
      ]);
      stateManager.initializeAppState();
      const newState = stateManager.getState();

      expect(storageManager.loadNotes).toHaveBeenCalledOnce();
      expect(newState.notes).toEqual([{ id: "1", title: "mock title" }]);
    });
  });

  describe("dispatch()", () => {
    it("delivers action, updates appState immutably and notifies subscribers", () => {
      const previousState = stateManager.getState();
      const newNote = { id: "1", title: "new note" };
      const action = {
        type: "NOTE_CREATED",
        payload: { newNote },
      };
      const listenerSpy = vi.fn();
      const unsubscribe = subscribe(listenerSpy);

      stateManager.dispatch(action);
      const nextState = stateManager.getState();

      expect(nextState).not.toBe(previousState);
      expect(nextState.notes).toHaveLength(1);
      expect(previousState.notes).toHaveLength(0);
      expect(listenerSpy).toHaveBeenCalledWith(nextState, action);
      expect(listenerSpy).toHaveBeenCalledOnce();
      unsubscribe();
    });
  });

  describe("getState()", () => {
    it("hands a deeply frozen state object to a caller", () => {
      vi.clearAllMocks();
      vi.spyOn(storageManager, "loadNotes").mockReturnValueOnce([
        { id: "1", title: "frozen title" },
      ]);

      stateManager.initializeAppState();
      const state = stateManager.getState();

      expect(state.notes).toHaveLength(1);
      expect(storageManager.loadNotes).toHaveBeenCalledOnce();
      expect(state.notes).toEqual([{ id: "1", title: "frozen title" }]);
      expect(() => {
        state.isEditMode = true;
      }).toThrow();
      expect(() => {
        state.notes = [{ id: "1", title: "frozen object" }];
      }).toThrow();
      expect(() => {
        state.notes[0] = {};
      }).toThrow();
    });
  });

  describe("getEmptyNote()", () => {
    it("returns a note object which is either of its title or content is empty in the notes array", () => {
      vi.clearAllMocks();
      vi.spyOn(storageManager, "loadNotes").mockReturnValueOnce([
        { id: "1", title: "empty note", content: "" },
        { id: "2", title: "note not empty", content: "note exists" },
      ]);
      stateManager.initializeAppState();
      const notes = stateManager.getState().notes;

      const emptyNote = stateManager.getEmptyNote();

      expect(storageManager.loadNotes).toHaveBeenCalledOnce();
      expect(notes).toHaveLength(2);
      expect(emptyNote).toEqual(notes[0]);
    });

    it("returns undefined when there is no empty notes in the notes array", () => {
      vi.clearAllMocks();
      vi.spyOn(storageManager, "loadNotes").mockReturnValueOnce([
        { id: "1", title: "new note", content: "new content" },
        { id: "2", title: "note not empty", content: "note exists" },
      ]);
      stateManager.initializeAppState();
      const notes = stateManager.getState().notes;

      const emptyNote = stateManager.getEmptyNote();

      expect(storageManager.loadNotes).toHaveBeenCalledOnce();
      expect(notes).toHaveLength(2);
      expect(emptyNote).toBeUndefined();
    });
  });

  describe("hasEmptyNote()", () => {
    it("returns false if empty note doesn't exist", () => {
      vi.clearAllMocks();
      const notes1 = storageManager.loadNotes.mockReturnValueOnce([
        { id: "1", title: "first note", content: "first content" },
        { id: "2", title: "secont note", content: "second content" },
      ]);
      stateManager.initializeAppState();
      const isEmptyNote = stateManager.hasEmptyNote();

      expect(isEmptyNote).toBe(false);
      expect(storageManager.loadNotes).toHaveBeenCalledOnce();
    });

    it("returns true if empty note exists", () => {
      vi.clearAllMocks();
      const notes2 = storageManager.loadNotes.mockReturnValueOnce([
        { id: "1", title: "first note", content: "first content" },
        { id: "2", title: "secont note", content: "" },
      ]);
      stateManager.initializeAppState();
      const isEmptyNote = stateManager.hasEmptyNote();

      expect(isEmptyNote).toBe(true); 
      expect(storageManager.loadNotes).toHaveBeenCalledOnce();
    });
  });
});
