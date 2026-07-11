import {
  activeDraft,
  addNoteToState,
  isEditMode,
  saveActiveDraftToNotes,
  deleteNoteFromState,
  scheduleAutoSave,
  saveToDisk,
  setActiveNoteId,
  setIsEditMode,
  setNoticeMessage,
  syncActiveDraftFromNotes,
  updateActiveDraftContent,
  updateActiveDraftTitle,
} from "./state.js";

import {
  elements,
  focusEditableAtEnd,
  renderAppUI,
  renderSidebar,
  syncHamburgerMenuState,
} from "./ui.js";

function setupEventListener() {
  elements.menu.addEventListener("click", () => {
    elements.sidebar.classList.toggle("is-menu-open");
    syncHamburgerMenuState();
  });

  elements.createNoteButton.addEventListener("click", () => {
    addNoteToState();
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
      deleteNoteFromState(noteContainer.dataset.id);
      noteContainer
        .querySelector(".delete-banner-hidden")
        .classList.add("hidden");
      renderAppUI();
      return;
    }

    const clickedButton = e.target.closest(".note");
    if (!clickedButton) return;

    if (activeDraft) {
      saveActiveDraftToNotes({ ensureUniqueTitle: true });
      elements.sidebar.classList.remove("is-menu-open");
      syncHamburgerMenuState();
    }

    const targetNoteId = clickedButton.dataset.id;

    setActiveNoteId(targetNoteId);
    setIsEditMode(false);
    setNoticeMessage("");
    saveToDisk();
    renderAppUI();
  });

  elements.activeNoteTitle.addEventListener("input", () => {
    if(!activeDraft) return;

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
    const clickedInsideSidebar = e.target.closest(".sidebar");
    const clickedInsideHamburgerMenu = e.target.closest(".hamburger-menu");

    if (!clickedInsideSidebar && !clickedInsideHamburgerMenu) {
      elements.sidebar.classList.remove("is-menu-open");
      syncHamburgerMenuState();
    }
  });

  document.addEventListener("click", (e) => {
    if (!isEditMode) return;

    const clickedInsideTitle = e.target.closest(".active-note-title");
    const clickedInsideEditor = e.target.closest(".note-editor");
    const clickedCreateButton = e.target.closest(".add-note-button");
    const clickedEditButton = e.target.closest(".edit-button");

    if (
      clickedInsideTitle ||
      clickedInsideEditor ||
      clickedCreateButton ||
      clickedEditButton
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
    setIsEditMode(true);
    renderAppUI();
    focusEditableAtEnd(elements.noteEditor);
  });

  elements.lock.addEventListener("click", () => {
    elements.sidebar.classList.remove("is-menu-open");
    syncHamburgerMenuState();
    setNoticeMessage("");
    setIsEditMode(false);
    renderAppUI();
  });

  const hideShowFooterCard = elements.noteCard.querySelector(
    ".hide-show-footer-buttons",
  );
  const noteFooter = elements.noteCard.querySelector(".note-card__footer");

  hideShowFooterCard.addEventListener("click", (e) => {
    e.stopPropagation();

    hideShowFooterCard.classList.toggle("hide-footer-button");

    if (hideShowFooterCard.classList.contains("hide-footer-button")) {
      noteFooter.classList.add("hide-footer-card");
      hideShowFooterCard.textContent = "<";
    } else {
      noteFooter.classList.remove("hide-footer-card");
      hideShowFooterCard.textContent = ">";
    }
  });

  window.addEventListener("state-saved", () => {
    renderSidebar();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // removeActiveEmptyNote();
  syncActiveDraftFromNotes();
  setupEventListener();
  renderAppUI();
});
