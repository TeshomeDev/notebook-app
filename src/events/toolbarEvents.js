
import { stateManager } from "../state/state.js";
import { scheduleAutoSave } from "../side-effects/sideEffects.js";
import { useCases } from "../use-cases/use-cases.js";
import {
  elements,
  focusEditableAtEnd,
  syncHamburgerMenuState,
  renderAppUI,
} from "../ui/ui.js";

export function registerToolbarEvents() {

  elements.editButton.addEventListener("click", () => {
    if (!stateManager.getActiveNote()) return;
    elements.sidebar.classList.remove("is-menu-open");
    syncHamburgerMenuState();
    useCases.startEditing();
    renderAppUI();
    focusEditableAtEnd(elements.noteEditor);
  });

  elements.lock.addEventListener("click", () => {
    elements.sidebar.classList.remove("is-menu-open");
    syncHamburgerMenuState();
    stateManager.setNoticeMessage("");
    useCases.stopEditing();
    renderAppUI();
  });


  elements.toggleCardButton.addEventListener("click", (e) => {
    e.stopPropagation();

    elements.toggleCardButton.classList.toggle("hide-footer-button");

    if (elements.toggleCardButton.classList.contains("hide-footer-button")) {
      elements.noteCardFooter.classList.add("hide-footer-card");
    } else {
      elements.noteCardFooter.classList.remove("hide-footer-card");
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

