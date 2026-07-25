/*
  GSAP helpers for the projects section.
*/
import gsap from "gsap";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function revealCards(cards) {
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
    },
  );

  return () => {
    if (tween.isActive()) tween.progress(1);
    tween.kill();
  };
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

export function revealProgressBars(bars) {
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
        delay: 0.25,
        ease: "power2.out",
        transformOrigin: "left center",
        overwrite: "auto",
      },
    );
  });

  return () => {
    tweens.forEach((tween) => {
      if (tween.isActive()) tween.progress(1);
      tween.kill();
    });
  };
}

export function revealSummary(nodes) {
  if (!nodes?.length) return () => {};
  if (prefersReducedMotion()) return () => {};

  const tween = gsap.fromTo(
    nodes,
    { opacity: 0, y: 32 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.12,
      delay: 0.2,
      ease: "power2.out",
      overwrite: "auto",
    },
  );

  return () => {
    if (tween.isActive()) tween.progress(1);
    tween.kill();
  };
}
