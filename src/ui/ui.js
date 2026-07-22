import {
  notes,
  activeNoteId,
  activeDraft,
  isEditMode,
  saveTimeout,
  noticeMessage,
} from "../state/state.js";

export const elements = {
  noteEditor: document.querySelector('[data-action="note-editor"]'),
  editButton: document.querySelector('[data-action="edit-button"]'),
  lock: document.querySelector('[data-action="lock-button"]'),
  sidebar: document.querySelector(".sidebar"),
  notePreview: document.querySelector(".note-preview"),
  menu: document.querySelector(".hamburger-menu"),
  noteList: document.querySelector(".note-list"),
  createNoteButton: document.querySelector(".add-note-button"),
  activeNoteTitle: document.querySelector(".editable--title"),
  noticeBanner: document.querySelector(".notice-banner"),
  noticeTextContent: document.querySelector(".notice-text-content"),
  noteCardFooter: document.querySelector(".note-card__footer"),
  toggleCardButton: document.querySelector('[data-action="toggle-card-button"]')
};


export function renderEditor() {
  const currentNote = activeDraft;

  const { activeNoteTitle, noteEditor } = elements;

  if (!currentNote) {
    activeNoteTitle.textContent = "";
    noteEditor.replaceChildren();
    activeNoteTitle.setAttribute("contenteditable", "false");
    noteEditor.setAttribute("contenteditable", "false");
    return;
  }

  if (activeNoteTitle.textContent !== currentNote.title) {
    activeNoteTitle.textContent = currentNote.title;
  }

  if (noteEditor.innerText !== currentNote.content) {
    noteEditor.innerText = currentNote.content;
  }

  activeNoteTitle.setAttribute("contenteditable", String(isEditMode));
  noteEditor.setAttribute("contenteditable", String(isEditMode));

  if (elements.activeNoteTitle.textContent === "") {
    elements.activeNoteTitle.focus();
  }

  if (
    isEditMode &&
    document.activeElement !== activeNoteTitle &&
    document.activeElement !== noteEditor
  ) {
    noteEditor.focus();
  }
}

export function renderSidebar() {
  const { noteList } = elements;

  if (!notes || !noteList) return;

  const existingElements = Array.from(
    noteList.querySelectorAll(".note-container-wrapper"),
  );
  const currentIds = notes.map((note) => note.id);

  existingElements.forEach((el) => {
    if (!currentIds.includes(el.dataset.id)) {
      el.remove();
    }
  });

  notes.forEach((note) => {
    let container = noteList.querySelector(
      `.note-container-wrapper[data-id="${note.id}"]`,
    );

    if (!container) {
      container = document.createElement("div");
      container.className = "note-container-wrapper";
      container.dataset.id = note.id;

      container.innerHTML = `
      <div role="button" tabindex="0"  class="note note-cards" data-id="${note.id}">
          <h3 class="note-title"></h3>
        <button class="menu-button">&#8942</button>
      </div>
      <div class="delete-banner-hidden hidden">
        <p>Delete this note?</p>
        <div class="delete-buttons">
          <button class="confirm-delete-btn">Yes</button>
          <button class="cancel-delete-btn">No</button>
        </div>
      </div>`;

      noteList.appendChild(container);
    }

    const noteTitle = container.querySelector(".note-title");
    if (noteTitle.textContent !== note.title) {
      noteTitle.textContent = note.title;
    }

    const noteButton = container.querySelector(".note");
    const isActive = note.id === activeNoteId;

    if (isActive && !noteButton.classList.contains("note-cards--active")) {
      noteButton.classList.add("note-cards--active");
    } else if (!isActive && noteButton.classList.contains("note-cards--active")) {
      noteButton.classList.remove("note-cards--active");
    }
  });
}

export function renderNotice() {
  const { noticeBanner, noticeTextContent } = elements;

  if (!noticeBanner || !noticeTextContent) return;

  clearTimeout(saveTimeout);
  if (noticeMessage) {
    noticeTextContent.textContent = noticeMessage;
    noticeBanner.classList.add("is-visible");

    setTimeout(() => {
        noticeBanner.classList.remove("is-visible");
        }, 4000);
  } else {
    noticeTextContent.textContent = "";
    noticeBanner.classList.remove("is-visible");
  }
}

export function renderAppUI() {
  renderSidebar();
  renderEditor();
  renderNotice();
}

export function syncHamburgerMenuState() {
  const hamburgerMenuBars = elements.menu.querySelectorAll(
    ".hamburger-menu__bar",
  );

  if (elements.sidebar.classList.contains("is-menu-open")) {
    hamburgerMenuBars.forEach((bar) => {
      bar.classList.add("menu-open");
    });
    elements.sidebar.scrollTop = 0;
  } else {
    hamburgerMenuBars.forEach((bar) => {
      bar.classList.remove("menu-open");
    });
  }
}

export function focusEditableAtEnd(element) {
  if (!element) return;

  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}
