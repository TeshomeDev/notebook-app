
import { storageManager } from "../services/storage.js";
import { subscribe, stateManager } from "../state/state.js";

const TIMEOUT_CONSTANTS = Object({
  AUTO_SAVE: 1000,
  NOTICE_HIDE: 2500,
  SAVED_NOTICE_HIDE: 3000
});


export function saveToDisk(notes, id) {
  storageManager.saveNotes(notes);
  storageManager.saveActiveNoteId(id);
}


let saveTimeout = null;
 function scheduleAutoSave(callback) {
    if (saveTimeout) clearTimeout(saveTimeout);

   saveTimeout = setTimeout(() => {
    saveTimeout = null;
      callback();
  }, TIMEOUT_CONSTANTS.AUTO_SAVE);
}


let noticeTimeout = null;
function scheduleNoticeHide() {
  if(noticeTimeout) clearTimeout(noticeTimeout);

  noticeTimeout = setTimeout(() => {
    noticeTimeout = null;

    stateManager.dispatch({
      type: "NOTICE_HIDDEN"
    });
  }, TIMEOUT_CONSTANTS.NOTICE_HIDE);
}

let savedNoticeTimeout = null;
function scheduleNoteSavedNotice() {
  if (savedNoticeTimeout) clearTimeout(savedNoticeTimeout);

  savedNoticeTimeout = setTimeout(() => {
    savedNoticeTimeout = null;

    stateManager.dispatch({
      type: "NOTE_CHANGE_SAVED",
    });
  }, TIMEOUT_CONSTANTS.SAVED_NOTICE_HIDE);
}


let previousContent = null;
let previousTitle = null;
let previousActiveNoteId = null;

export function initSideEffectsSubscription() {
  subscribe((state, action) => {
    const currentActiveNoteId = state.activeNoteId;
    const activeNote = state.notes.find(note => note.id === currentActiveNoteId);

    if (!activeNote) return;

    const isContentChanged = activeNote.content !== previousContent;
    const isTitleChanged = activeNote.title !== previousTitle;
    const isActiveNoteIdChanged = currentActiveNoteId !== previousActiveNoteId;

    if (isContentChanged || isTitleChanged || isActiveNoteIdChanged) {
      previousContent = activeNote.content ?? null;
      previousTitle = activeNote.title ?? null;
      previousActiveNoteId = currentActiveNoteId ?? null;

      scheduleAutoSave(() => {
        saveToDisk(state.notes, state.activeNoteId);
      });


      if(action?.type === "CONTENT_UPDATED" || action?.type === "TITLE_UPDATED") {
        scheduleNoteSavedNotice();
      }
    }
  });
}


export function initNoticeHiddenSubscription() {
  subscribe(
    (state) => {
      if(state.noticeMessage !== "") {
        scheduleNoticeHide();
      }
  });
}

