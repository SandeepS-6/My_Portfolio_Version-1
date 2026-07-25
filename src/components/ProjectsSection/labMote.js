/*
  Drift path for the rare signal mote on the projects canvas.
*/

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

/** Wait until projects have been in view long enough before first mote. */
export const MOTE_DWELL_MS = 9000;

/** Quiet gap between drift passes. */
export function nextSpawnDelay() {
  return randomBetween(16000, 32000);
}

/** First appearance after the section has been explored. */
export function firstSpawnDelay() {
  return randomBetween(2800, 6500);
}

/** Build a slow diagonal drift across the section box. */
export function createDriftPlan(width, height) {
  const fromLeft = Math.random() > 0.5;
  const yStart = randomBetween(height * 0.12, height * 0.78);
  const yEnd = yStart + randomBetween(-height * 0.18, height * 0.18);

  return {
    from: {
      x: fromLeft ? -12 : width + 12,
      y: yStart,
    },
    to: {
      x: fromLeft ? width + 12 : -12,
      y: Math.min(height - 8, Math.max(8, yEnd)),
    },
    duration: randomBetween(9, 14),
  };
}
