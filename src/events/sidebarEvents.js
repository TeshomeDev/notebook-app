import {
  activeDraft,
  saveActiveDraftToNotes,
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
  renderAppUI,
  renderSidebar,
  syncHamburgerMenuState,
} from "../ui/ui.js";

export function registerSidebarEvents() {
  elements.menu.addEventListener("click", () => {
    elements.sidebar.classList.toggle("is-menu-open");
    syncHamburgerMenuState();

    if(!elements.noteCardFooter.classList.contains("hide-footer-card")) {
      elements.noteCardFooter.classList.add("hide-footer-card");
    }
  });

  elements.createNoteButton.addEventListener("click", () => {
    useCases.addNote();
    elements.sidebar.classList.remove("is-menu-open");
    syncHamburgerMenuState();
    renderAppUI();
    // focusEditableAtEnd(elements.noteEditor);
  });

  elements.noteList.addEventListener("click", (e) => {
    const noteContainer = e.target.closest(".note-container-wrapper");
    const clickedMenuButton = e.target.closest(".menu-button");
    const clickedCancelDelete = e.target.closest(".cancel-delete-btn");
    const clickedConfirmDelete = e.target.closest(".confirm-delete-btn");

    if (clickedMenuButton && noteContainer) {
      e.stopPropagation();

      const openBanner = elements.noteList.querySelector(
        ".delete-banner-hidden:not(.hidden)",
      );
      if (openBanner) {
        openBanner.classList.add("hidden");
      }

      noteContainer
        .querySelector(".delete-banner-hidden")
        .classList.remove("hidden");
      return;
    }

    if (clickedCancelDelete && noteContainer) {
      e.stopPropagation();
      noteContainer
        .querySelector(".delete-banner-hidden")
        .classList.add("hidden");
      return;
    }

    if (clickedConfirmDelete && noteContainer) {
      e.stopPropagation();
      useCases.deleteNote(noteContainer.dataset.id);
      noteContainer
        .querySelector(".delete-banner-hidden")
        .classList.add("hidden");
      renderAppUI();
      return;
    }

    const clickedButton = e.target.closest(".note");
    if (!clickedButton) return;

    if (activeDraft) {
      elements.sidebar.classList.remove("is-menu-open");
      syncHamburgerMenuState();
    }
    const nextActiveId = clickedButton.dataset.id;
    useCases.selectNote(nextActiveId);
    useCases.stopEditing();

    setNoticeMessage("");
    saveToDisk();
    renderAppUI();
  });

  document.addEventListener("click", (e) => {
    const deleteBannerClicked = e.target.closest(".delete-banner-hidden");

    if (!deleteBannerClicked) {
      const deleteBanners = document.querySelectorAll(".delete-banner-hidden");

      deleteBanners.forEach((deleteBanner) => {
        if (!deleteBanner.classList.contains("hidden")) {
          deleteBanner.classList.add("hidden");
        }
      });
    }
  });

  document.addEventListener("click", (e) => {
    const clickedInsideSidebar = e.target.closest(".sidebar");
    const clickedInsideHamburgerMenu = e.target.closest(".hamburger-menu");

    if (!clickedInsideSidebar && !clickedInsideHamburgerMenu) {
      elements.sidebar.classList.remove("is-menu-open");
      syncHamburgerMenuState();
    }
  });


}