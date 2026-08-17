
import { stateManager, subscribe } from "../state/state.js";
import { putCursorAtEnd } from "./helpers.js";


const elements = {
  noticeBanner: document.querySelector(".notice-banner"),
  noticeBannerMessage: document.querySelector(".notice-banner-message"),
  noticeTextContent: document.querySelector(".notice-text-content"),
}

let timeoutId = null;
let noticePreviousMessage = null;

export function renderNotice(state) {

  noticePreviousMessage = state.noticeMessage;
  const noticeMessage = state.noticeMessage;
  const saveTimeout = state.saveTimeout;

  const { noticeBanner, noticeTextContent, noticeBannerMessage } = elements;

  if (!noticeBanner || !noticeTextContent) return;

  clearTimeout(saveTimeout);
  if (noticeMessage) {
    noticeTextContent.textContent = noticeMessage;

    noticeBannerMessage.classList.remove(
      "notice-banner-message-warning",
      "notice-banner-message-success",
    );

    if (noticeTextContent.textContent === "✓ Saved") {
      noticeBanner.classList.add("is-visible");
      noticeBannerMessage.classList.add("notice-banner-message-success");
    } else {
      noticeBanner.classList.add("is-visible");
      noticeBannerMessage.classList.add("notice-banner-message-warning");

      requestAnimationFrame(() => {
        if (elements.noteEditor && elements.noteEditor.isContentEditable) {
          elements.noteEditor.focus();
          putCursorAtEnd(elements.noteEditor);
        }
      });
    }

    setTimeout(() => {
      noticeBanner.classList.remove("is-visible");
      stateManager.clearNoticeMessage();
    }, 3000);
  } else {
    stateManager.clearNoticeMessage();
    noticeBanner.classList.remove("is-visible");
  }
}


// Subscription

export function initNoticeSubscription() {
  subscribe((state) => {
    if(state.noticeMessage !== noticePreviousMessage) {
      noticePreviousMessage = state.noticeMessage;
      renderNotice(state);
    }
  });
}