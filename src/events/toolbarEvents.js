
import { useCases } from "../use-cases/use-cases.js";
import { putCursorAtEnd } from "../ui/helpers.js";
import {
  closeMobileSidebar,
  closeToolbar,
  toggleToolbar,
} from "../ui/layout.js";


const elements = {
  editButton: document.querySelector('[data-action="edit-button"]'),
  lock: document.querySelector('[data-action="lock-button"]'),
  noteEditor: document.querySelector('[data-action="note-editor"]'),
  noteCardFooter: document.querySelector(".note-card__footer"),
  toggleCardButton: document.querySelector(
    '[data-action="toggle-card-button"]',
  ),
};

export function registerToolbarEvents() {

  elements.editButton.addEventListener("click", (e) => {
    // e.stopPropagation();
    closeMobileSidebar();
    useCases.startEditing();
    putCursorAtEnd(elements.noteEditor);
  });

  elements.lock.addEventListener("click", (e) => {
    // e.stopPropagation();
    closeMobileSidebar();
    useCases.stopEditing();
  });


  elements.toggleCardButton.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleToolbar();
  });

  elements.noteCardFooter.addEventListener("click", (e) => {
    const clickedEditButton = e.target.closest('[data-action="edit-button"]');
    const clickedReadButton = e.target.closest('[data-action="lock-button"]');

    if (clickedEditButton || clickedReadButton) {
      closeToolbar();
    }
  });
}



