/*
  Schedule the FAB bubble: hidden most of the time, then a short peek.
*/

const HIDDEN_MIN_MS = 7000;
const HIDDEN_MAX_MS = 16000;
const VISIBLE_MIN_MS = 2600;
const VISIBLE_MAX_MS = 4200;

function nextDelay(min, max) {
  return min + Math.random() * (max - min);
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
    showTimer = window.setTimeout(show, nextDelay(HIDDEN_MIN_MS, HIDDEN_MAX_MS));
  }

  function show() {
    setVisible(true);
    hideTimer = window.setTimeout(hide, nextDelay(VISIBLE_MIN_MS, VISIBLE_MAX_MS));
  }

  setVisible(false);
  showTimer = window.setTimeout(show, nextDelay(4000, 9000));

  return () => {
    window.clearTimeout(showTimer);
    window.clearTimeout(hideTimer);
    setVisible(false);
  };
}
