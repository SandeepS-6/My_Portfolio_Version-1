/*
  Scroll-progress mark: fills with scrub, reverses on scroll up.
*/
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function bindScrollHighlight(root, mark, { enabled = true, action = "highlight" } = {}) {
  if (!root || !mark) return () => {};

  const origin = action === "underline" ? "left center" : "left center";

  gsap.set(mark, {
    scaleX: 0,
    transformOrigin: origin,
    force3D: true,
  });

  if (!enabled || prefersReducedMotion()) {
    gsap.set(mark, { scaleX: 1 });
    return () => {};
  }

  const start = action === "underline" ? "top 78%" : "top 84%";
  const end = action === "underline" ? "center 45%" : "center 50%";

  const tween = gsap.to(mark, {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      trigger: root,
      start,
      end,
      scrub: 0.65,
      invalidateOnRefresh: true,
    },
  });

  const refresh = () => ScrollTrigger.refresh();
  const resizeObserver = new ResizeObserver(refresh);
  resizeObserver.observe(root);
  window.addEventListener("load", refresh);
  const settle = window.setTimeout(refresh, 400);

  return () => {
    window.clearTimeout(settle);
    window.removeEventListener("load", refresh);
    resizeObserver.disconnect();
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}
