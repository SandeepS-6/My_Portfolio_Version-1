/*
  Timeline line fill + item reveal when the panel enters view.
*/
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function bindTimelineMotion(root) {
  if (!root) return () => {};

  const items = [...root.querySelectorAll(".about-tl__item")];
  const fills = [...root.querySelectorAll(".about-tl__line-fill")];
  const dots = [...root.querySelectorAll(".about-tl__dot")];

  if (!items.length) return () => {};

  if (prefersReducedMotion()) {
    gsap.set(items, { opacity: 1, y: 0 });
    gsap.set(fills, { scaleY: 1 });
    gsap.set(dots, { scale: 1 });
    return () => {};
  }

  gsap.set(items, { opacity: 0, y: 24 });
  gsap.set(fills, { scaleY: 0, transformOrigin: "top center" });
  gsap.set(dots, { scale: 0.72 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: "top 78%",
      once: true,
    },
  });

  items.forEach((item, index) => {
    const fill = fills[index];
    const dot = dots[index];
    const at = index * 0.18;

    tl.to(
      item,
      { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" },
      at,
    );

    if (dot) {
      tl.to(
        dot,
        { scale: 1, duration: 0.4, ease: "back.out(1.6)" },
        at,
      );
    }

    if (fill) {
      tl.to(
        fill,
        { scaleY: 1, duration: 0.55, ease: "power2.inOut" },
        at + 0.12,
      );
    }
  });

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}
