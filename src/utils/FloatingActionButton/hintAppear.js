/*
  FAB bubble peeks every 10–15 seconds, then hides again.
*/

const HIDDEN_MIN_MS = 10000;
const HIDDEN_MAX_MS = 15000;
const VISIBLE_MS = 3500;
const FIRST_SHOW_MS = 10000;

function nextGap() {
  return HIDDEN_MIN_MS + Math.random() * (HIDDEN_MAX_MS - HIDDEN_MIN_MS);
}

export function scheduleHintAppear(hintEl) {
  if (!hintEl) return () => {};

  let showTimer = 0;
  let hideTimer = 0;

  function setVisible(on) {
    hintEl.dataset.visible = on ? "true" : "false";
    hintEl.setAttribute("aria-hidden", on ? "false" : "true");
    hintEl.tabIndex = on ? 0 : -1;
  }

  function hide() {
    setVisible(false);
    showTimer = window.setTimeout(show, nextGap());
  }

  function show() {
    setVisible(true);
    hideTimer = window.setTimeout(hide, VISIBLE_MS);
  }

  setVisible(false);
  showTimer = window.setTimeout(show, FIRST_SHOW_MS);

  return () => {
    window.clearTimeout(showTimer);
    window.clearTimeout(hideTimer);
    setVisible(false);
  };
}
