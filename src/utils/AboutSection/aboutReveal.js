/*
  About scroll reveals — timeline cards one-by-one.
*/
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function revealAboutItems(items) {
  if (!items?.length) return () => {};

  if (prefersReducedMotion()) {
    gsap.set(items, { opacity: 1, y: 0 });
    return () => {};
  }

  const tweens = items.map((item) => {
    const order = Number(item.dataset.order || 0);

    return gsap.fromTo(
      item,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        delay: order * 0.06,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
          once: true,
        },
      },
    );
  });

  return () => {
    tweens.forEach((tween) => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });
  };
}
