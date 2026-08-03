/* Last letter of the headline → line starts beside it. */

export function measureLinePlacement(quoteEl, bandEl) {
  if (!quoteEl || !bandEl) {
    return { left: 0, top: 0 };
  }

  const words = quoteEl.querySelectorAll(".hero-pitch__word");
  let anchor = words.length ? words[words.length - 1] : null;

  if (!anchor) {
    const chars = quoteEl.querySelectorAll(".hero-pitch__char");
    anchor = chars.length ? chars[chars.length - 1] : quoteEl;
  }

  const bandRect = bandEl.getBoundingClientRect();
  const anchorRect = anchor.getBoundingClientRect();
  const gap = 10;

  const left = Math.max(0, Math.round(anchorRect.right - bandRect.left + gap));
  const top = Math.max(
    0,
    Math.round(anchorRect.top + anchorRect.height / 2 - bandRect.top),
  );

  // Leave room for the connector + bio on the right
  const maxLeft = Math.round(bandRect.width * 0.58);
  return {
    left: Math.min(left, maxLeft),
    top,
  };
}
