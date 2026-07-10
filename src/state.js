import { storageManager } from "./storage.js";

export let notes = storageManager.loadNotes();
export let activeNoteId = storageManager.loadActiveNoteId();

export let activeDraft = null;
export let saveTimeout = null;
export let isEditMode = false;
export let noticeMessage = "";


export function setActiveNoteId(newId) {
  if(newId === activeNoteId) return;

  activeNoteId = newId;
  syncActiveDraftFromNotes();
  storageManager.saveActiveNoteId(activeNoteId);
}

export function setIsEditMode(bool) {
  if(bool === isEditMode) return;

  const isLeavingEditMode = isEditMode && !bool;

  if (isLeavingEditMode) {
    saveToDisk();
  }

  isEditMode = bool;
}


export function setNoticeMessage(message) {
  if(message === noticeMessage) return;
  noticeMessage = message;
}

export function scheduleAutoSave() {
  clearTimeout(saveTimeout);

  saveTimeout = setTimeout(()=> {
    saveToDisk();
    window.dispatchEvent( new CustomEvent("state-saved"));
  }, 1000);
}

export function createDraftFromNote(note) {
  if(!note) return null;

  return {
    id: note.id,
    title: note.title,
    content: note.content,
    timeStamp: note.timeStamp
  };
}

export function syncActiveDraftFromNotes() {
  activeDraft = createDraftFromNote(getActiveNote());
}

export function saveActiveDraftToNotes({ensureUniqueTitle = false} = {}) {
  if(!activeDraft) return;

  const title = ensureUniqueTitle
  ? generateUniqueTitle(activeDraft.title, activeDraft.id)
  : activeDraft.title;

  activeDraft = {
    ...activeDraft,
    title
  }

  notes = notes.map(note => {
    if(note.id !== activeDraft.id) return note;

    return {
      ...note,
      title: activeDraft.title,
      content: activeDraft.content,
      timeStamp: activeDraft.timeStamp
    };
  });
}

export function updateActiveDraftTitle(title) {
  if(!activeDraft) return;

  activeDraft = {
    ...activeDraft,
    title
  }

}

export function updateActiveDraftContent(content) {
  if(!activeDraft) return;

  activeDraft = {
    ...activeDraft,
    content
  }

}

export function createNoteObject(customTitle = "Untitled Note") {
  return {
    id: crypto.randomUUID(),
    title: customTitle,
    content: "",
    timeStamp: Date.now()
  }
}

export function addNoteToState() {

  if(!noticeEmptyState()) {
    return;
  }

  saveActiveDraftToNotes();

  setNoticeMessage("");

  let newNote = createNoteObject();
  let uniqueTitle = generateUniqueTitle(newNote.title, newNote.id);
  newNote = {
    ...newNote,
    title: uniqueTitle
  }
  notes = [...notes, newNote];
  setActiveNoteId(newNote.id);
  setIsEditMode(true);

  saveToDisk();
}

export function emptyNote() {
  return notes.find(
    note => note.title.trim() === "" || note.content.trim() === ""
  );
}

export function noticeEmptyState() {
  if(!notes) return;
const emptyNoteState = emptyNote();
if(!emptyNoteState) return true;

     if (emptyNoteState.title.trim() === "") {
       setNoticeMessage("Title should not be empty.");
       setActiveNoteId(emptyNoteState.id);
       setIsEditMode(true);
       return false;
     } else if(emptyNoteState.content.trim() === "") {
       setNoticeMessage("Content should not be empty.");
       setActiveNoteId(emptyNoteState.id);
       setIsEditMode(true);
       console.log(notes);
       return false;
     }

     return true
  }


export function deleteNoteFromState(noteId) {
  notes = notes.filter(note => note.id !== noteId);

  if(noteId === activeNoteId) {
    const nextNoteId = notes.length > 0
    ? notes[0].id : null;

    setActiveNoteId(nextNoteId);
    setNoticeMessage("");
  }

  syncActiveDraftFromNotes();
  saveToDisk();
}

// export function removeActiveEmptyNote() {
//   const currentNote = activeDraft;

//   if(currentNote
//     && (currentNote.title.trim() === "Untitled Note"
//     || currentNote.title.trim() === ""
//     || currentNote.content.trim() === "")
//   ) {
//     notes = notes.filter(note => note.id !== activeNoteId);
//     syncActiveDraftFromNotes();
//     saveToDisk();
//     return true;
//   }
// return false;
// }

export function saveToDisk() {
  saveActiveDraftToNotes();
  storageManager.saveNotes(notes);
}

export function getActiveNote() {
  if(!activeNoteId) return;

  return notes.find(note => note.id === activeNoteId);
}

export function generateUniqueTitle(noteTitle, currentNoteId) {
  let uniqueTitle = noteTitle.trim();

  if(uniqueTitle === "") {
    uniqueTitle = "Untitled Note";
  }

  let counter = 1;
  const baseTitle = uniqueTitle;

  while(notes.some(note => note.id !== currentNoteId
  && note.title.toLowerCase() === uniqueTitle.toLowerCase())) {

    uniqueTitle = `${baseTitle} (${counter})`;
    counter++;
  }

  return uniqueTitle;
}