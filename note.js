
const noteEditor = document.querySelector(".note-editor");
const editButton = document.querySelector(".edit-button");
const lock = document.querySelector(".disable-editor-button");
const sidebar = document.querySelector(".sidebar");
const menu = document.querySelector(".hamburger-menu");
const noteList = document.querySelector(".note-list");
const createNoteButton = document.querySelector(".add-note-button");
let activeNoteTitle = document.querySelector(".active-note-title");
const noticeBanner = document.querySelector(".notice-banner");
const noticeTextContent = document.querySelector(".notice-text-content")


const savedData = localStorage.getItem("my-notes-app-data");
const savedActiveNoteId = localStorage.getItem("my-notes-app-active-note-id");

let notes = savedData ? JSON.parse(savedData) : [];
let activeNoteId = savedActiveNoteId || null;
let isEditMode = false;
let noticeMessage = "";
let saveTimeout = null;


menu.addEventListener("click", ()=> {
  const hamburgerMenuBars = document.querySelectorAll(".hamburger-menu__bar");
  sidebar.classList.toggle("is-menu-open");

  if(sidebar.classList.contains("is-menu-open")) {
    hamburgerMenuBars.forEach(bar => {
      bar.classList.add("menu-open");
    });
  } else {
    hamburgerMenuBars.forEach((bar) => {
      bar.classList.remove("menu-open");
    });
  }
});


// ===========================================
// STATE GUARDS
// ===========================================
function setNotes(updatedNoteArray) {
  notes = updatedNoteArray;

  saveToDisk();

  renderAppUI();
}

function setActiveNoteId(newId) {
  if(activeNoteId === newId) return;

  activeNoteId = newId;

  if(activeNoteId) {
    localStorage.setItem("my-notes-app-active-note-id", activeNoteId);
  } else {
    localStorage.removeItem("my-notes-app-active-note-id");
  }
  renderAppUI();
}

function setIsEditMode(bool) {
  if(isEditMode === bool) return;
  isEditMode = bool;

 saveToDisk();

  renderAppUI();
}

function setNoticeMessage(message) {
  if(noticeMessage === message) return;
  noticeMessage = message;

  renderAppUI();
}


// ===========================================
// MAIN FUNCTIONS
// ===========================================
function createNoteObject(customTitle = "Untitled Note") {
  return {
    id: crypto.randomUUID(),
    title: customTitle,
    content: "",
    timeStamp: Date.now()
  }
}

function addNoteToState() {
  const emptyNote = notes.find(note =>
    note.title.trim() === "Untitled Note" || note.title.trim() === ""
  );



  if(emptyNote) {
    setActiveNoteId(emptyNote.id)
    setIsEditMode(true);

    setNoticeMessage("Please rename the current 'Untitled Note' before creating a new note.");
    return;
  }

  setNoticeMessage("");

  const newNote = createNoteObject();
  notes = [...notes, newNote];
  setActiveNoteId(newNote.id);

  setIsEditMode(true);

  saveToDisk();
  renderAppUI();
}


// ===========================================
// RENDER FUNCTIONS
// ===========================================
function renderWorkspace() {
  const currentNote = getActiveNote();

  if(!currentNote) {
    activeNoteTitle.textContent = "";
    noteEditor.replaceChildren();
    activeNoteTitle.setAttribute("contenteditable", false);
    noteEditor.setAttribute("contenteditable", false);

    return;
  }


  activeNoteTitle.textContent = currentNote.title;
  noteEditor.innerHTML = currentNote.content;

  activeNoteTitle.setAttribute("contenteditable", isEditMode);
  noteEditor.setAttribute("contenteditable", isEditMode);

  if(isEditMode &&
    document.activeElement !== noteEditor) {
    noteEditor.focus();

  }
}


function renderSidebar() {

  if(!notes) return;

  const existingElements = Array.from(noteList.querySelectorAll(".note-container-wrapper"));
  const existingIds = existingElements.map(el => el.dataset.id);
  const currentIds = notes.map(note => note.id);

  existingElements.forEach(el => {


    if(!currentIds.includes(el.dataset.id)) {
      el.remove();
    }
  });

  notes.forEach(note => {
    let container = noteList.querySelector(`.note-container-wrapper[data-id="${note.id}"]`);

    if(!container) {
      container = document.createElement("div");
      container.className = "note-container-wrapper";
      container.dataset.id = note.id;

      container.innerHTML = `
        <div class="note-header-row">
          <button class="note" data-id="${note.id}">
            <h3 class="note-title"></h3>
          </button>
          <button class="menu-button">&#8942</button>
        </div>
        <div class="delete-banner-hidden hidden">
          <p>Delete this note?</p>
          <div class="delete-buttons">
            <button class="confirm-delete-btn">Yes</button>
            <button class="cancel-delete-btn">No</button>
          </div>
        </div>
      `;

      setupNoteCardListener(container, note);
      noteList.appendChild(container);
    }

    const noteTitle = container.querySelector(".note-title");
    if(noteTitle.textContent !== note.title) {
      noteTitle.textContent = note.title;
    }

    const noteButton = container.querySelector(".note");
    const isActive = note.id === activeNoteId;

    if(isActive && !noteButton.classList.contains("active")) {
      noteButton.classList.add("active");
    } else if(!isActive && noteButton.classList.contains("active")) {
      noteButton.classList.remove("active");
    }

  });
}

function setupNoteCardListener(container, note) {

  const menuButton = container.querySelector(".menu-button");
  const deleteBanner = container.querySelector(".delete-banner-hidden");
  const cancelButton = deleteBanner.querySelector(".cancel-delete-btn");
  const confirmDeleteButton = deleteBanner.querySelector(".confirm-delete-btn");

  menuButton.addEventListener("click", (e)=> {
      e.stopPropagation();

      const openBanner = noteList.querySelector(".delete-banner-hidden:not(.hidden)");
      if(openBanner) {

        openBanner.classList.add("hidden");
      }

      deleteBanner.classList.remove("hidden");
    });

    cancelButton.addEventListener("click", (e)=> {
      e.stopPropagation();
      deleteBanner.classList.add("hidden");
    });


    confirmDeleteButton.addEventListener("click", (e)=> {
      e.stopPropagation();

      const updatedNotes = notes.filter(n => n.id !== note.id);

      setNotes(updatedNotes);
      deleteBanner.classList.add("hidden");

      if(note.id === activeNoteId) {
        const nextActiveNoteId = updatedNotes.length > 0 ? updatedNotes[0].id : null;

        setActiveNoteId(nextActiveNoteId);
      }
      deleteBanner.classList.add("hidden");
      saveToDisk();
      renderSidebar();
    });
}

function renderNotice() {
  if(!noticeBanner || !noticeTextContent) return;

  if(noticeMessage) {
    noticeTextContent.textContent = noticeMessage;
    noticeBanner.classList.add("is-visible");
  } else {
    noticeTextContent.textContent = "";
    noticeBanner.classList.remove("is-visible");
  }
}


function renderAppUI() {
  renderSidebar();
  renderWorkspace();
  renderNotice();
}


function saveToDisk() {
  localStorage.setItem("my-notes-app-data", JSON.stringify(notes));
}


// ===========================================
// HELPER FUNCTIONS
// ===========================================

function getActiveNote() {
  if(!activeNoteId) {
    return;
  }

  return notes.find(note => note.id === activeNoteId);
}

function generateUniqueTitle(requestedTitle, currentNoteId) {
  let uniqueTitle = requestedTitle.trim();

  if(uniqueTitle === "") {
    uniqueTitle = "Untitled Note";
  }

  let counter = 1;
  const baseTitle = uniqueTitle;

  while(notes.some(note =>
    note.id !== currentNoteId &&
    note.title.toLowerCase() === uniqueTitle.toLowerCase())) {
      uniqueTitle = `${baseTitle} (${counter})`
      counter++;
    }

    return uniqueTitle;
}


// ===========================================
// Event Listeners
// ===========================================
createNoteButton.addEventListener("click", ()=> {
  addNoteToState();
  sidebar.classList.remove("is-menu-open");
});

noteList.addEventListener("click", (e)=> {
  const clickedButton = e.target.closest(".note");
  if(!clickedButton) return;

  const currentNote = getActiveNote();
  if(
    currentNote &&
    currentNote.title.trim() === "Untitled Note" &&
    currentNote.content.trim() === ""
  ) {
    notes = notes.filter(note => note.id !== activeNoteId);
  } else if(currentNote) {
    currentNote.title = generateUniqueTitle(activeNoteTitle.textContent, currentNote.id);
    currentNote.content = noteEditor.innerHTML;

    sidebar.classList.remove("is-menu-open");

    const hamburgerMenuBars = document.querySelectorAll(".hamburger-menu__bar");

    if (sidebar.classList.contains("is-menu-open")) {
      hamburgerMenuBars.forEach((bar) => {
        bar.classList.add("menu-open");
      });
    } else {
      hamburgerMenuBars.forEach((bar) => {
        bar.classList.remove("menu-open");
      });
    }
  }


  const targetNoteId = clickedButton.dataset.id;

  setActiveNoteId(targetNoteId);
  setIsEditMode(false);
  setNoticeMessage("");
  saveToDisk();
});

activeNoteTitle.addEventListener("input", ()=> {
  const currentNote = notes.find(note => note.id === activeNoteId);

  if(!currentNote) return;

  currentNote.title = activeNoteTitle.textContent;
  renderSidebar();

  if(
    currentNote.title.trim() !== "Untitled Note" &&
    currentNote.title.trim() !== ""
  ) {
    setNoticeMessage("");
  }
});

activeNoteTitle.addEventListener("blur", (e)=> {
  e.target.scrollLeft = 0;
});


noteEditor.addEventListener("input", ()=> {

  clearTimeout(saveTimeout);

  const currentNote = notes.find(note => note.id === activeNoteId);
  if(!currentNote) return;

  currentNote.content = noteEditor.innerHTML;
  renderSidebar();

  saveTimeout = setTimeout(() => {
    saveToDisk();
  }, 1000);
});


document.addEventListener("click", (e)=> {
  if(!isEditMode) return;

  const clickedInsideTitle = e.target.closest(".active-note-title");
  const clickedInsideEditor = e.target.closest(".note-editor");
  const clickedCreateButton = e.target.closest(".add-note-button");
  const clickedEditButton = e.target.closest(".edit-button");

  if(clickedInsideTitle || clickedInsideEditor || clickedCreateButton || clickedEditButton) {
    return;
  }

  const currentNote = notes.find(note => note.id === activeNoteId);
  if(currentNote) {
    const verfiedTitle = generateUniqueTitle(activeNoteTitle.textContent, currentNote.id);

    currentNote.title = verfiedTitle;
    currentNote.content = noteEditor.innerHTML;
    saveToDisk();
  }

  setNoticeMessage("");
  setIsEditMode(false);
});

activeNoteTitle.addEventListener("keydown", (e)=> {
  if(e.key === "Enter") {
    e.preventDefault();
    activeNoteTitle.blur();
  }
});

editButton.addEventListener("click", ()=> {
  setIsEditMode(true);
  noteEditor.focus();
});

// Footer action buttons
const noteCard = document.querySelector(".note-card");
const hideShowFooterButton = noteCard.querySelector(".hide-show-footer-buttons");
const noteFooter = noteCard.querySelector(".note-card__footer");

hideShowFooterButton.addEventListener("click", (e)=> {
  e.stopPropagation();

  hideShowFooterButton.classList.toggle("hide-footer-button");

  if(hideShowFooterButton.classList.contains("hide-footer-button")) {
    noteFooter.classList.add("hide-footer-card");
    hideShowFooterButton.textContent = "<";
  } else {
    noteFooter.classList.remove("hide-footer-card");
    hideShowFooterButton.textContent = ">";
  }
});

renderAppUI();



