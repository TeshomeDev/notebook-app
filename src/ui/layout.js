import { syncHamburgerMenuState } from "./helpers.js";

const elements = {
  menu: document.querySelector(".hamburger-menu"),
  sidebar: document.querySelector(".sidebar"),
  noteList: document.querySelector(".note-list"),
  activeNoteEditor: document.querySelector(".note-editor"),
  noteEditorCard: document.querySelector('[data-editor-state="note-editor"]'),
  emptyEditorCard: document.querySelector('[data-editor-state="welcome"]'),
  noteEditor: document.querySelector('[data-action="note-editor"]'),
  noteCardFooter: document.querySelector(".note-card__footer"),
  toggleCardButton: document.querySelector(
    '[data-action="toggle-card-button"]',
  ),
  editButton: document.querySelector(".edit-button"),
  readButton: document.querySelector(".read-button"),
  hideShowFooterButtons: document.querySelector(".hide-show-footer-buttons")
};

export function toggleMobileMenu() {
  const isOpen = elements.sidebar.classList.toggle("is-menu-open");
  syncHamburgerMenuState();
  elements.menu.setAttribute("aria-expanded", String(isOpen));
  elements.noteCardFooter.classList.add("hide-footer-card", isOpen);
}

export function closeMobileSidebar() {
  elements.sidebar.classList.remove("is-menu-open");
  syncHamburgerMenuState();
}

export function openDeleteBanner(noteContainer) {
  if (!noteContainer) return;

  const openBanner = elements.noteList.querySelector(
    ".delete-banner-hidden:not(.hidden)",
  );
  if (openBanner) {
    openBanner.classList.add("hidden");
  }

  const deleteMessage = noteContainer.querySelector(".delete-message");
  const bannerToOpen = noteContainer.querySelector(".delete-banner-hidden");
  bannerToOpen?.classList.remove("hidden");
  deleteMessage.textContent = "Delete this note?";
  deleteMessage.setAttribute("tabindex", "-1");
  deleteMessage.focus();
}

export function hideAllDeleteBanners() {
  const deleteBanners = document.querySelectorAll(".delete-banner-hidden");

  deleteBanners.forEach((banner) => {
    banner.classList.add("hidden");
  });
}

export function cancelDeletion(noteContainer) {
  if (!noteContainer) return;

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
    elements.editButton.setAttribute("inert", "");
    elements.readButton.setAttribute("inert", "");
    elements.hideShowFooterButtons.textContent = "←";

  } else {
    elements.noteCardFooter.classList.remove("hide-footer-card");
    elements.editButton.removeAttribute("inert");
    elements.readButton.removeAttribute("inert");
    elements.hideShowFooterButtons.textContent = "→";
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


export function removeInertAttributeOnDesktop(e) {
  if (e.matches) {
    elements.editButton.removeAttribute("inert");
    elements.readButton.removeAttribute("inert");
  } else {
    elements.editButton.setAttribute("inert", "");
    elements.readButton.setAttribute("inert", "");
  }
}


