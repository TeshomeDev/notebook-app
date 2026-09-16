import { describe, vi, it, expect, beforeEach, afterEach } from "vitest";
import { initSideEffectsSubscription } from "./sideEffects.js";
import { storageManager } from "../services/storage.js";
import { stateManager } from "../state/state.js";

vi.mock("../services/storage.js", () => ({
  storageManager: {
    loadNotes: vi.fn(() => []),
    loadActiveNoteId: vi.fn(() => null),
    saveNotes: vi.fn(),
    saveActiveNoteId: vi.fn(),
  },
}));

describe("scheduleAutoSave()", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    stateManager.initializeAppState();
    initSideEffectsSubscription();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  describe("sideEffects.js contract", () => {
    it("schedules auto-save after 1000ms", () => {
      const newNote = { id: "1", title: "", content: "" };
      stateManager.dispatch({ type: "NOTE_CREATED", payload: { newNote } });

      vi.advanceTimersByTime(500);
      expect(storageManager.saveNotes).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500);
      expect(storageManager.saveNotes).toHaveBeenCalledOnce();
    });

    it("debounces auto saving while a user is typing and saves when timeout reaches 1000ms", () => {
      const newNote = { id: "1", title: "", content: "" };
      stateManager.dispatch({ type: "NOTE_CREATED", payload: { newNote } });

      vi.advanceTimersByTime(500);
      expect(storageManager.saveNotes).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500);
      stateManager.dispatch({
        type: "TITLE_UPDATED",
        payload: { title: "updated " },
      });

      expect(storageManager.saveNotes).not.toHaveBeenCalled();

      stateManager.dispatch({
        type: "TITLE_UPDATED",
        payload: { title: "updated title" },
      });
      vi.advanceTimersByTime(500);
      expect(storageManager.saveNotes).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500);
      expect(storageManager.saveNotes).toHaveBeenCalledOnce();
    });
  });
});
