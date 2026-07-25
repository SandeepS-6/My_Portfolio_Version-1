/*
  Infinite marquee helpers — base drift + scroll-velocity boost.
*/

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function createMarqueeState(direction = 1) {
  return {
    direction,
    offset: 0,
    boost: 0,
    lastScrollY: typeof window !== "undefined" ? window.scrollY : 0,
    segmentWidth: 0,
  };
}

export function sampleScrollVelocity(state, strength = 0.12, maxBoost = 6.5) {
  const y = window.scrollY;
  const delta = y - state.lastScrollY;
  state.lastScrollY = y;
  state.boost += delta * strength;
  state.boost = Math.max(-maxBoost, Math.min(maxBoost, state.boost));
}

export function measureSegment(trackEl) {
  const first = trackEl?.firstElementChild;
  if (!first) return 0;
  return first.getBoundingClientRect().width;
}

export function stepMarquee(state, baseSpeed = 0.45, friction = 0.88) {
  const speed = (baseSpeed + state.boost) * state.direction;
  state.offset += speed;
  state.boost *= friction;
  if (Math.abs(state.boost) < 0.012) state.boost = 0;

  if (state.segmentWidth > 0) {
    state.offset =
      ((state.offset % state.segmentWidth) + state.segmentWidth) %
      state.segmentWidth;
  }

  return state.offset;
}

export function buildMarqueeUnits(text, count = 12) {
  const label = String(text || "WHAT I DO").trim();
  return Array.from({ length: count }, () => `${label}\u00A0•\u00A0`);
}
