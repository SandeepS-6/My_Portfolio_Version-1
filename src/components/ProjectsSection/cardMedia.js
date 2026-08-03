/* Card media helpers — rotate up to 3 images one by one. */

export const CARD_IMAGE_MS = 3400;

export function resolveCardImages(project) {
  if (!project) return [];

  const fromList = Array.isArray(project.images)
    ? project.images
    : Array.isArray(project.gallery)
      ? project.gallery
      : [];

  const list = [];
  const seen = new Set();

  function push(img) {
    const src = img?.src;
    if (!src || seen.has(src)) return;
    seen.add(src);
    list.push({ src, alt: img.alt || "" });
  }

  fromList.forEach(push);
  if (list.length === 0) push(project.image);

  return list.slice(0, 3);
}

export function nextCardImageIndex(current, length) {
  if (length <= 1) return 0;
  return (current + 1) % length;
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
