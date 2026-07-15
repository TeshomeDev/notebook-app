import { storageManager } from "../services/storage.js";
import { draftManager } from "../domain/draft-actions.js";
import { noteManager } from "../domain/note-actions.js";

export let notes = storageManager.loadNotes();
export let activeNoteId = storageManager.loadActiveNoteId();
export let activeDraft = null;
export let saveTimeout = null;
export let isEditMode = false;
export let noticeMessage = "";

export function ensureValidActiveNote() {
  const exists = notes.some(note => note.id === activeNoteId);

  if(!exists) {
    activeNoteId = notes[0].id || null;
    storageManager.saveActiveNoteId(activeNoteId);
  }
}

export function setActiveNoteId(newId) {
  if (newId === activeNoteId) return;
  activeNoteId = newId;
  syncActiveDraftFromNotes();
  storageManager.saveActiveNoteId(activeNoteId);
}

export function setIsEditMode(bool) {
  if (bool === isEditMode) return;
  const isLeavingEditMode = isEditMode && !bool;
  if (isLeavingEditMode) {
    saveToDisk();
  }
  isEditMode = bool;
}

export function setNoticeMessage(message) {
  if (message === noticeMessage) return;
  noticeMessage = message;
}

export function scheduleAutoSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveToDisk();
    window.dispatchEvent(new CustomEvent("state-saved"));
  }, 1000);
}

export function getNote() {
  return [...notes];
}

export function replaceNotes(currentNotes) {
  notes = currentNotes;
  saveToDisk();
}

export function getActiveNoteId() {
  return activeNoteId;
}

export function syncActiveDraftFromNotes() {
  activeDraft = draftManager.createDraftFromNotes(getActiveNote());
}

export function saveActiveDraftToNotes({ ensureUniqueTitle = false } = {}) {
  if (!activeDraft) return;
  const title = ensureUniqueTitle
    ? noteManager.generateUniqueTitle(notes, activeDraft.title, activeDraft.id)
    : activeDraft.title;
  activeDraft = draftManager.updateDraftTitle(activeDraft, title);

  notes = noteManager.updateNote(notes, activeDraft.id, {
    title: activeDraft.title,
    content: activeDraft.content,
    timeStamp: activeDraft.timeStamp,
  });
}

export function updateActiveDraftTitle(title) {
  if (!activeDraft) return;
  activeDraft = draftManager.updateDraftTitle(activeDraft, title);
}

export function updateActiveDraftContent(content) {
  if (!activeDraft) return;
  activeDraft = draftManager.updateDraftContent(activeDraft, content);
}

export function emptyNote() {
  return notes.find((note) => noteManager.isNoteEmpty(note));
}

export function noticeEmptyState() {
  if (!notes) return;
  const emptyNoteState = emptyNote();
  if (!emptyNoteState) return true;
  if (emptyNoteState.title.trim() === "") {
    setNoticeMessage("Title should not be empty.");
    setActiveNoteId(emptyNoteState.id);
    setIsEditMode(true);
    return false;
  } else if (emptyNoteState.content.trim() === "") {
    setNoticeMessage("Content should not be empty.");
    setActiveNoteId(emptyNoteState.id);
    syncActiveDraftFromNotes();
    setIsEditMode(true);
    return false;
  }
}

export function saveToDisk() {
  saveActiveDraftToNotes();
  storageManager.saveNotes(notes);
}

export function getActiveNote() {
  if (!activeNoteId) return;
  const note = notes.find((note) => note.id === activeNoteId);

  if (!note) return;

  return note;
}
