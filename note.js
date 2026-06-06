
const noteEditor = document.querySelector(".note-editor");
const editButton = document.querySelector(".edit-button");
const lock = document.querySelector(".disable-editor-button");
const sidebar = document.querySelector(".sidebar");
const menu = document.querySelector(".menu");
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
let noticeMessage = ""


menu.addEventListener("click", ()=> {
  sidebar.classList.toggle("is-menu-open");
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

  isEditMode = true;

  saveToDisk();
  renderAppUI();
}


// ===========================================
// RENDER FUNCTIONS
// ===========================================
function renderWorkspace() {
  const currentNote = getActiveNote();


  activeNoteTitle.textContent = currentNote.title;
  noteEditor.textContent = currentNote.content;

  activeNoteTitle.setAttribute("contenteditable", isEditMode);
  noteEditor.setAttribute("contenteditable", isEditMode);

  if(isEditMode) {
    noteEditor.focus();
    activeNoteTitle.focus();

  }
}


function renderSidebar() {

  if(!notes) return;

  noteList.innerHTML = "";

  notes.forEach(note => {
    const button = document.createElement("button");
    button.className = "note";

    button.dataset.id = note.id;

    if(note.id === activeNoteId) {
      button.classList.add("active");
    }


    const title = document.createElement("h3");
    title.className = "note-title";
    title.textContent = note.title;

    button.appendChild(title);
    noteList.appendChild(button);
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
    notes.filter(note => note.id !== activeNoteId);
  } else if(currentNote) {
    currentNote.title = generateUniqueTitle(activeNoteTitle.textContent, currentNote.id);
    currentNote.content = noteEditor.textContent;
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


noteEditor.addEventListener("input", ()=> {
  const currentNote = notes.find(note => note.id === activeNoteId);
  if(!currentNote) return;

  currentNote.content = noteEditor.textContent;
});


document.addEventListener("click", (e)=> {
  if(!isEditMode) return;

  const clickedInsideTitle = e.target.closest(".active-note-title");
  const clickedInsideEditor = e.target.closest(".note-editor");
  const clickedCreateButton = e.target.closest(".add-note-button");

  if(clickedInsideTitle || clickedInsideEditor || clickedCreateButton) {
    return;
  }

  const currentNote = notes.find(note => note.id === activeNoteId);
  if(currentNote) {
    const verfiedTitle = generateUniqueTitle(activeNoteTitle.textContent, currentNote.id);

    currentNote.title = verfiedTitle;
    currentNote.content = noteEditor.textContent;
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

renderAppUI();


