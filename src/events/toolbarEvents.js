
import {
  activeDraft,
  isEditMode,
  scheduleAutoSave,
  saveToDisk,
  setIsEditMode,
  setNoticeMessage,
  syncActiveDraftFromNotes,
  updateActiveDraftContent,
  updateActiveDraftTitle,
} from "../state/state.js";

import { useCases } from "../use-cases/use-cases.js";

import {
  elements,
  focusEditableAtEnd,
  syncHamburgerMenuState,
  renderAppUI,
} from "../ui/ui.js";

export function registerToolbarEvents() {

  elements.editButton.addEventListener("click", () => {
    if (!activeDraft) return;
    elements.sidebar.classList.remove("is-menu-open");
    syncHamburgerMenuState();
    useCases.startEditing();
    renderAppUI();
    focusEditableAtEnd(elements.noteEditor);
  });

  elements.lock.addEventListener("click", () => {
    elements.sidebar.classList.remove("is-menu-open");
    syncHamburgerMenuState();
    setNoticeMessage("");
    useCases.stopEditing();
    renderAppUI();
  });


  elements.toggleCardButton.addEventListener("click", (e) => {
    e.stopPropagation();

    elements.toggleCardButton.classList.toggle("hide-footer-button");

    if (elements.toggleCardButton.classList.contains("hide-footer-button")) {
      elements.noteCardFooter.classList.add("hide-footer-card");
      // elements.toggleCardButton.textContent = "←";
    } else {
      elements.noteCardFooter.classList.remove("hide-footer-card");
      // elements.toggleCardButton.textContent = "→";
    }

    if(!elements.noteCardFooter.classList.contains("hide-footer-card")) {
      elements.sidebar.classList.remove("is-menu-open");
      syncHamburgerMenuState();
    }
  });

  elements.noteCardFooter.addEventListener("click", (e) => {
    const clickedEditButton = e.target.closest('[data-action="edit-button"]');
    const clickedReadButton = e.target.closest('[data-action="lock-button"]');

    if (clickedEditButton || clickedReadButton) {
      elements.noteCardFooter.classList.add("hide-footer-card");
    }
  });
}

