

import { putCursorAtEnd } from "./helpers.js";
import { stateManager, subscribe } from "../state/state.js";
import { renderEmptyEditorState, renderNoteEditorState } from "./layout.js";


const elements = {
  emptyEditorCard: document.querySelector('[data-editor-state="welcome"]'),
  noteEditorCard: document.querySelector('[data-editor-state="note-editor"]'),
  activeNoteTitle: document.querySelector(".editable--title"),
  noteEditor: document.querySelector('[data-action="note-editor"]'),
};

export function renderEditor() {
  const activeNoteId = stateManager.getActiveNoteId();
  const currentNote = stateManager.getActiveNote();
  const isEditMode = stateManager.getIsEditMode();

  if (!currentNote) {
    renderEmptyEditorState();
    return;
  } else {
    renderNoteEditorState();
  }

  const { activeNoteTitle, noteEditor } = elements;

  const isEditing = Boolean(isEditMode);

  activeNoteTitle.contentEditable = isEditing ? "true" : "false";
  noteEditor.contentEditable = isEditing ? "true" : "false";

  if (document.activeElement !== activeNoteTitle) {
    activeNoteTitle.textContent = currentNote.title || "";
  }

  if (document.activeElement !== noteEditor) {
    noteEditor.innerHTML = currentNote.content || "";
  }

  if (elements.activeNoteTitle.textContent === "") {
    elements.activeNoteTitle.focus();
  }

  if (isEditing) {
    const isAlreadyEditing =
    document.activeElement !== activeNoteTitle ||
    document.activeElement !== noteEditor;

    if(!isAlreadyEditing) {
      if(activeNoteTitle.textContent === "") {
        activeNoteTitle.focus();
      } else {
        noteEditor.focus();
        putCursorAtEnd(noteEditor);
      }
    }
  }
}


// Subscription
let editorPreviousActiveNoteId = null;
let editorPreviousIsEditMode = null;
let editorPreviousActiveDraft = null;


export function initEditorSubscription() {
  subscribe((state) => {

    const hasNoteChanged = editorPreviousActiveNoteId !== state.activeNoteId;
    const hasEditModeChanged = editorPreviousIsEditMode !== state.isEditMode;
    const hasDraftChanged = editorPreviousActiveDraft !== state.activeDraft;

      if (hasNoteChanged || hasDraftChanged || hasEditModeChanged) {
        editorPreviousActiveNoteId = state.activeNoteId;
        editorPreviousIsEditMode = state.isEditMode;
        editorPreviousActiveDraft = state.activeDraft;
        renderEditor();
      }
  });
}