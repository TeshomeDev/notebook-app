
import { stateManager } from "../state/state.js";

export function registerNoticeEvents() {
  window.addEventListener("state-saved", () => {
    stateManager.setNoticeMessage("✓ Saved");
  });
}
