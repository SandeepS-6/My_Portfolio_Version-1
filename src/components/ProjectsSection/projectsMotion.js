/*
  GSAP helpers for the projects section.
  First paint uses ScrollTrigger; filter swaps stay immediate.
*/
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function killTween(tween) {
  tween.scrollTrigger?.kill();
  tween.progress(1);
  tween.kill();
}

export function revealCards(cards, trigger) {
  if (!cards?.length) return () => {};

  if (prefersReducedMotion()) {
    gsap.set(cards, { clearProps: "all" });
    return () => {};
  }

  const tween = gsap.fromTo(
    cards,
    { opacity: 0, y: 48 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power2.out",
      overwrite: "auto",
      scrollTrigger: {
        trigger: trigger || cards[0],
        start: "top 82%",
        once: true,
      },
    },
  );

  return () => killTween(tween);
}

export function filterOut(cards) {
  if (!cards?.length) return Promise.resolve();
  if (prefersReducedMotion()) return Promise.resolve();

  return gsap.to(cards, {
    opacity: 0,
    y: 20,
    scale: 0.98,
    duration: 0.35,
    stagger: 0.03,
    ease: "power2.in",
    overwrite: "auto",
  });
}

export function filterIn(cards) {
  if (!cards?.length) return Promise.resolve();
  if (prefersReducedMotion()) {
    gsap.set(cards, { clearProps: "all" });
    return Promise.resolve();
  }

  return gsap.fromTo(
    cards,
    { opacity: 0, y: 28, scale: 0.98 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.65,
      stagger: 0.07,
      ease: "power2.out",
      overwrite: "auto",
    },
  );
}

export function revealProgressBars(bars, { trigger, immediate = false } = {}) {
  if (!bars?.length) return () => {};

  if (prefersReducedMotion()) {
    [...bars].forEach((bar) => {
      gsap.set(bar, {
        scaleX: Number(bar.dataset.progress || 0) / 100,
        transformOrigin: "left center",
      });
    });
    return () => {};
  }

  const tweens = [...bars].map((bar) => {
    const value = Number(bar.dataset.progress || 0) / 100;
    return gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: value,
        duration: 0.9,
        delay: immediate ? 0.1 : 0.25,
        ease: "power2.out",
        transformOrigin: "left center",
        overwrite: "auto",
        ...(immediate
          ? {}
          : {
              scrollTrigger: {
                trigger: trigger || bar.closest("[data-project-card]") || bar,
                start: "top 82%",
                once: true,
              },
            }),
      },
    );
  });

  return () => {
    tweens.forEach(killTween);
  };
}

export function revealSummary(nodes) {
  if (!nodes?.length) return () => {};
  if (prefersReducedMotion()) return () => {};

  gsap.set(nodes, { opacity: 0, y: 32 });

  // Each block plays when it enters — intro and bottom summary stay independent.
  const tweens = [...nodes].map((node) =>
    gsap.to(node, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power2.out",
      overwrite: "auto",
      scrollTrigger: {
        trigger: node,
        start: "top 90%",
        once: true,
      },
    }),
  );

  return () => {
    tweens.forEach(killTween);
  };
}
