import {
  initializeState,
  activeDraft,
  isEditMode,
  saveActiveDraftToNotes,
  scheduleAutoSave,
  saveToDisk,
  setIsEditMode,
  setNoticeMessage,
  syncActiveDraftFromNotes,
  updateActiveDraftContent,
  updateActiveDraftTitle,
} from "./state/state.js";

import { useCases } from "./use-cases/use-cases.js"

import {
  elements,
  focusEditableAtEnd,
  renderAppUI,
  renderSidebar,
  syncHamburgerMenuState,
} from "./ui/ui.js";

function setupEventListener() {
  elements.menu.addEventListener("click", () => {
    elements.sidebar.classList.toggle("is-menu-open");
    syncHamburgerMenuState();
  });

  elements.createNoteButton.addEventListener("click", () => {
    useCases.addNote();
    elements.sidebar.classList.remove("is-menu-open");
    syncHamburgerMenuState();
    renderAppUI();
    focusEditableAtEnd(elements.noteEditor);
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

  elements.activeNoteTitle.addEventListener("input", () => {
    if (!activeDraft) return;

    updateActiveDraftTitle(elements.activeNoteTitle.textContent);
    renderSidebar();
    scheduleAutoSave();
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
    if (!activeDraft) return;

    const currentContent = e.target.textContent.trim();
    if (currentContent !== "") {
      elements.noticeBanner.classList.remove("is-visible");
    }

    updateActiveDraftContent(elements.noteEditor.innerText);
    renderSidebar();
    scheduleAutoSave();
  });

  elements.noteEditor.addEventListener("paste", (e) => {
    e.preventDefault();

    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  });

  document.addEventListener("click", (e) => {
    const deleteBannerClicked = e.target.closest(".delete-banner-hidden");

    if(!deleteBannerClicked) {
      const deleteBanners = document.querySelectorAll(".delete-banner-hidden");

      deleteBanners.forEach(deleteBanner => {
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

  document.addEventListener("click", (e) => {
    if (!isEditMode) return;

    const clickedInsideTitle = e.target.closest(".editable--title");
    const clickedInsideEditor = e.target.closest(".note-editor");
    const clickedCreateButton = e.target.closest(".add-note-button");
    const clickedEditButton = e.target.closest(".edit-button");
    const clickedReadButton = e.target.closest(".hide-footer-button");

    if (
      clickedInsideTitle ||
      clickedInsideEditor ||
      clickedCreateButton ||
      clickedEditButton  ||
      clickedReadButton
    ) {
      return;
    }

    if (activeDraft) {
      saveActiveDraftToNotes({ ensureUniqueTitle: true });
      saveToDisk();
    }

    setNoticeMessage("");
    setIsEditMode(false);
    renderAppUI();
  });

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
  });

  elements.noteCardFooter.addEventListener("click", (e) => {
    const clickedEditButton = e.target.closest('[data-action="edit-button"]');
    const clickedReadButton = e.target.closest('[data-action="lock-button"]');

    if(clickedEditButton || clickedReadButton) {
      elements.noteCardFooter.classList.add("hide-footer-card");
    }
  })

  window.addEventListener("state-saved", () => {
    renderSidebar();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeState();
  setupEventListener();
  renderAppUI();
});
