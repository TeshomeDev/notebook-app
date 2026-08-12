
import { stateManager, subscribe } from "../state/state.js";

const elements = {
  sidebar: document.querySelector(".sidebar"),
  noteList: document.querySelector(".note-list"),
};

export function renderSidebar() {
  const notes = stateManager.getNote();
  const activeNoteId = stateManager.getActiveNoteId();

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
    } else if (
      !isActive &&
      noteButton.classList.contains("note-cards--active")
    ) {
      noteButton.classList.remove("note-cards--active");
    }
  });
}


// Subscription
let sidebarPreviousNotes = null;
let sidebarPreviousActiveNoteId = null;

export function initSidebarSubscription() {
  subscribe((state) => {
    if(state.notes !== sidebarPreviousNotes ||
      state.activeNoteId !== sidebarPreviousActiveNoteId
    ) {
      sidebarPreviousNotes = state.notes;
      sidebarPreviousActiveNoteId = state.activeNoteId
      renderSidebar();
    }
  });
}