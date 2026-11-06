import { useCases } from "../use-cases/use-cases.js";
import { putCursorAtEnd } from "../ui/helpers.js";
import {
  closeToolbar,
  toggleToolbar,
  addInert,
  updateInertAttributeOnDesktop,
} from "../ui/layout.js";

const elements = {
  editButton: document.querySelector('[data-action="edit-button"]'),
  lock: document.querySelector('[data-action="lock-button"]'),
  noteEditor: document.querySelector('[data-action="note-editor"]'),
  noteCardFooter: document.querySelector(".note-card__footer"),
  toggleCardButton: document.querySelector(
    '[data-action="toggle-card-button"]',
  ),
  hideShowFooterButtons: document.querySelector(".hide-show-footer-buttons"),
  arrowLeft: document.querySelector('[data-icon="arrowLeft"]'),
  arrowRight: document.querySelector('[data-icon="arrowRight"]'),
};

export function registerToolbarEvents() {
  const isOnMobile = window.innerWidth < 768;

  if (isOnMobile) {
    elements.editButton.addEventListener("click", () => {
      useCases.startEditing();
      putCursorAtEnd(elements.noteEditor);
      elements.editButton.setAttribute("inert", "");
      elements.lock.setAttribute("inert", "");

      elements.arrowLeft.style.display = "block";
      elements.arrowRight.style.display = "none";
    });

    elements.lock.addEventListener("click", () => {
      useCases.stopEditing();
      elements.lock.setAttribute("inert", "");
      elements.editButton.setAttribute("inert", "");

      elements.arrowLeft.style.display = "none";
      elements.arrowRight.style.display = "block";
    });
  } else {
    elements.editButton.addEventListener("click", () => {
      useCases.startEditing();
      putCursorAtEnd(elements.noteEditor);
    });

    elements.lock.addEventListener("click", () => {
      useCases.stopEditing();
    });
  }

  elements.toggleCardButton.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleToolbar();
  });

  elements.noteCardFooter.addEventListener("click", (e) => {
    const clickedEditButton = e.target.closest('[data-action="edit-button"]');
    const clickedReadButton = e.target.closest('[data-action="lock-button"]');

    if (clickedEditButton || clickedReadButton) {
      const isOnMobile = window.innerWidth < 768;
      if (isOnMobile) {
        elements.editButton.setAttribute("inert", "");
        elements.lock.setAttribute("inert", "");

        elements.arrowLeft.style.display = "block";
        elements.arrowRight.style.display = "none";
      } else {
        elements.editButton.removeAttribute("inert", "");
        elements.lock.removeAttribute("inert", "");

        elements.arrowLeft.style.display = "block";
        elements.arrowRight.style.display = "none";
      }
      closeToolbar();
    }
  });

  const desktopQuery = window.matchMedia("(min-width: 768px)");

  desktopQuery.addEventListener("change", () => {
    updateInertAttributeOnDesktop(desktopQuery);
  });

  window.addEventListener("DOMContentLoaded", () => {
    const isOnMobile = window.innerWidth < 768;
    if (isOnMobile) {
      addInert();
    }
  });
}
