import { describe, vi, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import fs from "node:fs";

const htmlPath = path.resolve(__dirname, "../../index.html");

describe("Note Lifecycle", () => {
  let stateManager;
  let storageManager;

  beforeEach(async () => {
    const html = fs.readFileSync(htmlPath, "utf-8");
    document.documentElement.innerHTML = html;

    localStorage.clear();
    vi.useFakeTimers();
    vi.resetModules();

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
    }));

    const stateModule = await import("../../src/state/state.js");
    const storageModule = await import("../../src/services/storage.js");

    stateManager = stateModule.stateManager;
    storageManager = storageModule.storageManager;

    await import("../../src/app.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Create note:", () => {
    it("creates a note when a user clicks Add note button", () => {
      const addNoteButton = document.querySelector('[data-action="add-note"]');
      expect(addNoteButton).not.toBeNull();

      addNoteButton.click();
      const noteItems = document.querySelectorAll(".note-container-wrapper");

      expect(noteItems).toHaveLength(1);
      expect(stateManager.getState().notes).toHaveLength(1);
      expect(stateManager.getState().notes[0].title).toBe("Untitled Note");

      const noteTitle = document.querySelector(".note-title");
      expect(noteTitle).not.toBeNull();
      expect(noteTitle.textContent).toBe("Untitled Note");
    });
  });

  describe("Save note:", () => {
    it("saves the created note to localStorage after debounce", () => {
      vi.spyOn(storageManager, "saveNotes");

      document.querySelector('[data-action="add-note"]').click();
      vi.advanceTimersByTime(1000);

      const notes = JSON.parse(localStorage.getItem(storageManager.keys.notes));
      expect(notes).toHaveLength(1);

      expect(storageManager.saveNotes).toHaveBeenCalledOnce();
    });
  });

  describe("Editing:", () => {
    it("enables editing when a user clicks edit button", () => {
      document.querySelector('[data-action="add-note"]').click();

      document.querySelector('[data-action="lock-button"]').click();
      expect(stateManager.getState().isEditMode).toBe(false);

      const titleEl = document.querySelector(".editable--title");
      const contentEl = document.querySelector(".editable--content");

      document.querySelector('[data-action="edit-button"]').click();

      expect(contentEl.contentEditable).toBe("true");
      expect(titleEl.contentEditable).toBe("true");
      expect(stateManager.getState().isEditMode).toBe(true);
    });

    it("disables editing when a user clicks lock button", () => {
      document.querySelector('[data-action="add-note"]').click();

      expect(stateManager.getState().isEditMode).toBe(true);

      document.querySelector('[data-action="lock-button"]').click();

      const titleEl = document.querySelector(".editable--title");
      const contentEl = document.querySelector(".editable--content");

      expect(contentEl.contentEditable).toBe("false");
      expect(titleEl.contentEditable).toBe("false");
      expect(stateManager.getState().isEditMode).toBe(false);
    });
  });

  describe("Select note", () => {
    it("selects a note when note title is clicked", () => {
      document.querySelector('[data-action="add-note"]').click();
      // Setup: domain rule blocks a second note creation when content is empty.
      // jsdom can't simulate contentEditable tyying reliably,
      // so I dispatch directly however the tested action is still real click.
      stateManager.dispatch({
        type: "CONTENT_UPDATED",
        payload: { content: "content edited" },
      });

      document.querySelector('[data-action="add-note"]').click();

      const activeId = stateManager.getState().activeNoteId;
      expect(activeId).toBe(stateManager.getState().notes[1].id);

      document.querySelector(".note-title").click();

      const activeNote = stateManager
        .getState()
        .notes.find((note) => note.id === stateManager.getState().activeNoteId);

      const titleEl = document.querySelector(".editable--title");
      const contentEl = document.querySelector(".editable--content");

      expect(stateManager.getState().activeNoteId).toBe(
        stateManager.getState().notes[0].id,
      );
      expect(titleEl.textContent).toBe(activeNote.title);
      expect(contentEl.textContent).toBe(activeNote.content);
      expect(stateManager.getState().isEditMode).toBe(false);
    });
  });

  describe("Delete note", () => {
    it("deletes a note when delete button is clicked", () => {
      document.querySelector('[data-action="add-note"]').click();
      // Setup: domain rule blocks a second note creation when content is empty.
      // jsdom can't simulate contentEditable tyying reliably,
      // so I dispatch directly however the tested action is still real click.
      stateManager.dispatch({
        type: "CONTENT_UPDATED",
        payload: { content: "updated content" },
      });
      document.querySelector('[data-action="add-note"]').click();

      const firstId = stateManager.getState().notes[0].id;
      const secondId = stateManager.getState().notes[1].id;

      expect(stateManager.getState().notes).toHaveLength(2);

      document.querySelector(".menu-button").click();
      document.querySelector(".confirm-delete-btn").click();
      const remainingNotes = stateManager.getState().notes;

      expect(stateManager.getState().notes).toHaveLength(1);
      expect(remainingNotes[0].id).toBe(secondId);
      expect(remainingNotes[0].id).not.toBe(firstId);
    });
  });
});
