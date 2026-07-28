
import { stateManager } from "../state/state.js";
import { useCases } from "../use-cases/use-cases.js";
import { storageManager } from "../services/storage.js";
import { scheduleAutoSave, saveToDisk } from "../side-effects/sideEffects.js";
import {
  elements,
  focusEditableAtEnd,
  renderAppUI,
  renderSidebar,
  renderEmptyEditorState,
  renderNoteEditorState,
  renderNotice,
} from "../ui/ui.js";


export function registerEditorEvents() {
  elements.activeNoteTitle.addEventListener("input", () => {
    if (!stateManager.getActiveNote()) return;

    stateManager.updateActiveDraftTitle(elements.activeNoteTitle.textContent);
    renderSidebar();
    scheduleAutoSave(() => {
      stateManager.commitDraftToNotes({ ensureUniqueTitle: true });
      saveToDisk(stateManager.getNote());
    }, stateManager.getSaveTimeout());
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
    if (!stateManager.getActiveNote()) return;
    const currentContent = e.target.textContent.trim();
    if (currentContent !== "") {
      elements.noticeBanner.classList.remove("is-visible");
    }

    stateManager.updateActiveDraftContent(elements.noteEditor.innerText);
    renderSidebar();
    scheduleAutoSave( () => {
      stateManager.commitDraftToNotes({ensureUniqueTitle: true});
      saveToDisk(stateManager.getNote());
    },
      stateManager.getSaveTimeout()
    );
  });

  elements.noteEditor.addEventListener("paste", (e) => {
    e.preventDefault();

    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  });


  document.addEventListener("click", (e) => {
    if (!stateManager.getIsEditMode()) return;

    const clickedInsideTitle = e.target.closest(".editable--title");
    const clickedInsideEditor = e.target.closest(".note-editor");
    const clickedCreateButton = e.target.closest(".add-note-button");
    const clickedEditButton = e.target.closest(".edit-button");
    const clickedReadButton = e.target.closest(".hide-footer-button");

    if (
      clickedInsideTitle ||
      clickedInsideEditor ||
      clickedCreateButton ||
      clickedEditButton ||
      clickedReadButton
    ) {
      return;
    }

    if (stateManager.getActiveNote()) {
      stateManager.commitDraftToNotes({ ensureUniqueTitle: true });
      saveToDisk(stateManager.getNote());
    }

    stateManager.setNoticeMessage("");
    stateManager.setIsEditMode(false);
    renderAppUI();
  });
}