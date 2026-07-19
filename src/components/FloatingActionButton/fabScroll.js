/*
  FAB scroll helpers (plain JS, no React).

  - Page scroll → progress ring (0 → 1)
  - Contact section enter → diagonal dock toward section center
*/

export const DOCKED_THRESHOLD = 0.92;

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function getPageScrollProgress() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return clamp(window.scrollY / max, 0, 1);
}

/* 0 = still below the fold, 1 = contact top flush with viewport top */
export function getContactProgress(contactEl) {
  const rect = contactEl.getBoundingClientRect();
  const vh = window.innerHeight;
  if (rect.top >= vh) return 0;
  if (rect.top <= 0) return 1;
  return 1 - rect.top / vh;
}

export function getDockTranslate(buttonEl, contactEl, dock) {
  const size = buttonEl.offsetWidth;
  const styles = getComputedStyle(buttonEl);
  const right = parseFloat(styles.right) || 24;
  const bottom = parseFloat(styles.bottom) || 24;

  const startX = window.innerWidth - right - size / 2;
  const startY = window.innerHeight - bottom - size / 2;

  const rect = contactEl.getBoundingClientRect();
  const targetX = rect.left + rect.width / 2;
  const targetY = rect.top + rect.height / 2;

  return {
    tx: (targetX - startX) * dock,
    ty: (targetY - startY) * dock,
    // Grow larger as it docks into the contact center
    scale: 1 + dock * 1.5,
  };
}
