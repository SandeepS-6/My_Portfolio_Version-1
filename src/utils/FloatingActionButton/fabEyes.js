/*
  FAB eye helpers (plain JS).
  Pupil look-at + blink scheduling. Component owns the rAF loop.
*/

const MAX_LOOK = 4.2;
const LERP = 0.18;
const BLINK_MIN_MS = 2200;
const BLINK_MAX_MS = 5600;
const BLINK_HOLD_MS = 110;

export function createEyeState() {
  return {
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    hasPointer: false,
    blinkTimer: 0,
    blinkClear: 0,
  };
}

export function setEyeTarget(state, pointerX, pointerY, faceRect) {
  if (!faceRect || faceRect.width <= 0) return;

  const cx = faceRect.left + faceRect.width / 2;
  const cy = faceRect.top + faceRect.height / 2;
  const dx = pointerX - cx;
  const dy = pointerY - cy;
  const dist = Math.hypot(dx, dy) || 1;
  const reach = Math.min(1, dist / 280);

  state.hasPointer = true;
  state.targetX = (dx / dist) * MAX_LOOK * reach;
  state.targetY = (dy / dist) * MAX_LOOK * reach;
}

export function clearEyeTarget(state) {
  state.hasPointer = false;
  state.targetX = 0;
  state.targetY = 0;
}

export function stepEyes(state) {
  state.currentX += (state.targetX - state.currentX) * LERP;
  state.currentY += (state.targetY - state.currentY) * LERP;

  if (Math.abs(state.currentX) < 0.02) state.currentX = 0;
  if (Math.abs(state.currentY) < 0.02) state.currentY = 0;

  return { x: state.currentX, y: state.currentY };
}

function nextBlinkDelay() {
  return BLINK_MIN_MS + Math.random() * (BLINK_MAX_MS - BLINK_MIN_MS);
}

export function scheduleBlinks(faceEl, state) {
  if (!faceEl) return () => {};

  function blink() {
    faceEl.dataset.blink = "true";
    state.blinkClear = window.setTimeout(() => {
      faceEl.dataset.blink = "false";
      state.blinkTimer = window.setTimeout(blink, nextBlinkDelay());
    }, BLINK_HOLD_MS);
  }

  state.blinkTimer = window.setTimeout(blink, nextBlinkDelay());

  return () => {
    window.clearTimeout(state.blinkTimer);
    window.clearTimeout(state.blinkClear);
    faceEl.dataset.blink = "false";
  };
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
