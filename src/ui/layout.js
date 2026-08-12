
import { syncHamburgerMenuState } from "./helpers.js";


const elements = {
  sidebar: document.querySelector(".sidebar"),
  noteList: document.querySelector(".note-list"),
  noteEditorCard: document.querySelector('[data-editor-state="note-editor"]'),
  emptyEditorCard: document.querySelector('[data-editor-state="welcome"]'),
  noteEditor: document.querySelector('[data-action="note-editor"]'),
  noteCardFooter: document.querySelector(".note-card__footer"),
  toggleCardButton: document.querySelector(
    '[data-action="toggle-card-button"]',
  ),
};


export function toggleMobileMenu() {
  const isOpen = elements.sidebar.classList.toggle("is-menu-open");
  syncHamburgerMenuState();

  elements.noteCardFooter.classList.add("hide-footer-card", isOpen);
}


export function closeMobileSidebar() {
  elements.sidebar.classList.remove("is-menu-open");
  syncHamburgerMenuState();
}


export function openDeleteBanner(noteContainer) {
  if(!noteContainer) return;

  const openBanner =
  elements.noteList.querySelector(".delete-banner-hidden:not(.hidden)");
  if (openBanner) {
    openBanner.classList.add("hidden");
  }

  const bannerToOpen = noteContainer.querySelector(".delete-banner-hidden");
  bannerToOpen?.classList.remove("hidden");
}


export function hideAllDeleteBanners() {
  const deleteBanners = document.querySelectorAll(".delete-banner-hidden");

  deleteBanners.forEach((banner) => {
      banner.classList.add("hidden");
  });
}


export function cancelDeletion(noteContainer) {
  if(!noteContainer) return;

  const banner = noteContainer.querySelector(".delete-banner-hidden");
  banner?.classList.add("hidden");
}


export function renderEmptyEditorState() {
  elements.emptyEditorCard.classList.remove("hidden");
  elements.noteEditorCard.classList.add("hidden");
}

export function renderNoteEditorState() {
  elements.noteEditorCard.classList.remove("hidden");
  elements.emptyEditorCard.classList.add("hidden");
}


export function toggleToolbar() {
  elements.toggleCardButton.classList.toggle("hide-footer-button");

  if (elements.toggleCardButton.classList.contains("hide-footer-button")) {
    elements.noteCardFooter.classList.add("hide-footer-card");
  } else {
    elements.noteCardFooter.classList.remove("hide-footer-card");
  }

  if (!elements.noteCardFooter.classList.contains("hide-footer-card")) {
    closeMobileSidebar();
  }
}


export function closeToolbar() {
   elements.noteCardFooter.classList.add("hide-footer-card");
}

export function renderEditorMode(isEditMode) {
  elements.noteEditor.contenteditable = isEditMode ? true : false;
}