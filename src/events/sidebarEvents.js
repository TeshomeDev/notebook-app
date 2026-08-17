
import { useCases } from "../use-cases/use-cases.js";
import { putCursorAtEnd, syncHamburgerMenuState, } from "../ui/helpers.js";
import {
  toggleMobileMenu,
  closeMobileSidebar,
  openDeleteBanner,
  hideAllDeleteBanners,
  cancelDeletion
 } from "../ui/layout.js";
import { stateManager } from "../state/state.js";


 const elements = {
   sidebar: document.querySelector(".sidebar"),
   notePreview: document.querySelector(".note-preview"),
   menu: document.querySelector(".hamburger-menu"),
   noteList: document.querySelector(".note-list"),
   createNoteButton: document.querySelector(".add-note-button"),
   noteEditor: document.querySelector('[data-action="note-editor"]'),
 };


export function registerSidebarEvents() {

  elements.menu.addEventListener("click", () => {
    toggleMobileMenu();
  });

  elements.createNoteButton.addEventListener("click", () => {
    useCases.addNote();
    elements.noteEditor.focus();
    closeMobileSidebar();
  });

  elements.noteList.addEventListener("click", (e) => {
    const noteContainer = e.target.closest(".note-container-wrapper");
    if(!noteContainer) return;


    const clickedMenuButton = e.target.closest(".menu-button");
    if(clickedMenuButton) {
      e.stopPropagation();
      openDeleteBanner(noteContainer);
      return;
    }

    const clickedCancelDelete = e.target.closest(".cancel-delete-btn");
    if(clickedCancelDelete) {
      e.stopPropagation();
      cancelDeletion(noteContainer);
      return;
    }


    const clickedConfirmDelete = e.target.closest(".confirm-delete-btn");
    if(clickedConfirmDelete) {
      e.stopPropagation();

      useCases.deleteNote(noteContainer.dataset.id);
      closeMobileSidebar();
      return;
    }


    const clickedButton = e.target.closest(".note");
    if (!clickedButton) return;

    const nextActiveId = clickedButton.dataset.id;
    useCases.selectNote(nextActiveId);
    useCases.stopEditing();
    closeMobileSidebar();
    return;
  });

  document.addEventListener("click", (e) => {
    const isdeleteBannerClicked = e.target.closest(".delete-banner-hidden");
    const isMenuButtonClicked = e.target.closest(".menu-button");

    if (!isdeleteBannerClicked && !isMenuButtonClicked) {
      hideAllDeleteBanners();
    }

    const clickedInsideSidebar = e.target.closest(".sidebar");
    const clickedInsideHamburgerMenu = e.target.closest(".hamburger-menu");

    if (!clickedInsideSidebar && !clickedInsideHamburgerMenu) {
      closeMobileSidebar();
    }
  });
}