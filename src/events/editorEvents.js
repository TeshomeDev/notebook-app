
import { stateManager } from "../state/state.js";
import { useCases } from "../use-cases/use-cases.js";
import { insertClipboardData } from "../ui/helpers.js";

const elements = {
  emptyEditorCard: document.querySelector('[data-editor-state="welcome"]'),
  noteEditorCard: document.querySelector('[data-editor-state="note-editor"]'),
  activeNoteTitle: document.querySelector(".editable--title"),
  noteEditor: document.querySelector('[data-action="note-editor"]'),
};


export function registerEditorEvents() {
  elements.activeNoteTitle.addEventListener("input", () => {

    stateManager.dispatch({
      type: "TITLE_UPDATED",
      payload: { title: elements.activeNoteTitle.textContent }
    });
  });


  elements.activeNoteTitle.addEventListener("blur", (e) => {
    e.target.scrollLeft = 0;
  });


  elements.activeNoteTitle.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      elements.activeNoteTitle.blur();
      elements.noteEditor.focus();
    }
  });


  elements.noteEditor.addEventListener("input", (e) => {

    stateManager.dispatch({
      type: "CONTENT_UPDATED",
      payload: { content: elements.noteEditor.innerHTML }
    });
  });


  elements.noteEditor.addEventListener("paste", (e) => {
    e.preventDefault();

    insertClipboardData(e.clipboardData)
    stateManager.dispatch({
      type: "CONTENT_UPDATED",
      payload: { content: elements.noteEditor.innerHTML }
    });
  });


  document.addEventListener("click", (e) => {
    if (!stateManager.getState().isEditMode) return;

    const isInsideTarget = e.target.closest(`
      .editable--title,
      .note-editor,
      .add-note-button,
      .edit-button,
      .hide-footer-button
      `);
    if(isInsideTarget) return;

    useCases.stopEditing();
  });
}