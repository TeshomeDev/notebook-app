
import { subscribe } from "../state/state.js";


const elements = {
  noticeBanner: document.querySelector(".notice-banner"),
  noticeBannerMessage: document.querySelector(".notice-banner-message"),
  noticeTextContent: document.querySelector(".notice-text-content"),
}

export function renderNotice(state) {
  const { noticeBanner, noticeTextContent, noticeBannerMessage } = elements;

  if (!noticeBanner || !noticeTextContent) return;

  const noticeMessage = state.noticeMessage;

   announce(state.noticeMessage, noticeTextContent);

    noticeBannerMessage.classList.remove(
      "notice-banner-message-warning",
      "notice-banner-message-success",
    );


    switch (noticeMessage) {
      case "Note saved": {
        noticeBanner.classList.add("is-visible");
        noticeBannerMessage.classList.add("notice-banner-message-success");

        return;
      }

      case "You can't create note when empty note exists.": {
        noticeBanner.classList.add("is-visible");
        noticeBannerMessage.classList.add("notice-banner-message-warning");

        noticeTextContent.removeAttribute("aria-invalid");
        noticeTextContent.setAttribute("aria-invalid", "true");
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

function announce(msg, el) {
  el.removeAttribute("aria-live");
  el.textContent = msg;
  el.setAttribute("aria-live", "polite");

  }


// Subscription
export function initNoticeSubscription() {
  subscribe((state) => {
      renderNotice(state);
  });
}