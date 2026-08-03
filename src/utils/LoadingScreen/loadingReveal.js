/*
  Circular page reveal after loading (plain JS, no React).

  Same idea as Magic UI’s theme toggler — View Transitions + clip-path —
  but used to uncover the app, not toggle dark/light.
*/

export const REVEAL_DURATION_MS = 600;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* Percentages avoid Windows fractional-scale clip bugs with px values. */
function circleClipPaths(cx, cy, maxRadius, vw, vh) {
  const toX = (x) => `${(x / vw) * 100}%`;
  const toY = (y) => `${(y / vh) * 100}%`;
  const at = `${toX(cx)} ${toY(cy)}`;
  const toRadius = (r) =>
    `${(r / (Math.hypot(vw, vh) / Math.SQRT2)) * 100}%`;

  return [`circle(0% at ${at})`, `circle(${toRadius(maxRadius)} at ${at})`];
}

export function runLoadingReveal(updateDom, duration = REVEAL_DURATION_MS) {
  if (
    prefersReducedMotion() ||
    typeof document.startViewTransition !== "function"
  ) {
    updateDom();
    return Promise.resolve();
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const x = vw / 2;
  const y = vh / 2;
  const maxRadius = Math.hypot(
    Math.max(x, vw - x),
    Math.max(y, vh - y),
  );
  const clipPath = circleClipPaths(x, y, maxRadius, vw, vh);

  const root = document.documentElement;
  root.dataset.loadingVt = "active";
  root.style.setProperty("--loading-vt-duration", `${duration}ms`);
  root.style.setProperty("--loading-vt-clip-from", clipPath[0]);

  const cleanup = () => {
    delete root.dataset.loadingVt;
    root.style.removeProperty("--loading-vt-duration");
    root.style.removeProperty("--loading-vt-clip-from");
  };

  const transition = document.startViewTransition(updateDom);

  if (typeof transition?.finished?.finally === "function") {
    transition.finished.finally(cleanup).catch(() => {});
  } else {
    cleanup();
  }

  const ready = transition?.ready;
  if (!ready || typeof ready.then !== "function") {
    return Promise.resolve();
  }

  return ready
    .then(() => {
      document.documentElement.animate(
        { clipPath },
        {
          duration,
          easing: "ease-in-out",
          fill: "forwards",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {});
}
