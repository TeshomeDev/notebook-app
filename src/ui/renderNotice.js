
import { subscribe } from "../state/state.js";
import { putCursorAtEnd } from "./helpers.js";


const elements = {
  noticeBanner: document.querySelector(".notice-banner"),
  noticeBannerMessage: document.querySelector(".notice-banner-message"),
  noticeTextContent: document.querySelector(".notice-text-content"),
}


export function renderNotice(state) {
  const { noticeBanner, noticeTextContent, noticeBannerMessage } = elements;

  if (!noticeBanner || !noticeTextContent) return;

  const noticeMessage = state.noticeMessage;

  if (noticeMessage) {
    noticeTextContent.textContent = noticeMessage;

    noticeBannerMessage.classList.remove(
      "notice-banner-message-warning",
      "notice-banner-message-success",
    );

  }

    switch (noticeMessage) {
      case "✓ Saved": {
        noticeBanner.classList.add("is-visible");
        noticeBannerMessage.classList.add("notice-banner-message-success");

        return;
      }

      case "You can't create note when empty note exists.": {
        noticeBanner.classList.add("is-visible");
        noticeBannerMessage.classList.add("notice-banner-message-warning");

        requestAnimationFrame(() => {
          if (elements.noteEditor && elements.noteEditor.isContentEditable) {
            elements.noteEditor.focus();
            putCursorAtEnd(elements.noteEditor);
          }
        });

        return;
      }

      case "Note Deleted": {
        noticeBanner.classList.add("is-visible");
        noticeBannerMessage.classList.add("notice-banner-message-success");

        return;
      }

      case "": {
        noticeBanner.classList.remove("is-visible");

        return;
      }
    }
}


// Subscription
export function initNoticeSubscription() {
  subscribe((state) => {
      renderNotice(state);
  });
}