/*
  Cinematic open / close for the Experimental Lab.
*/
import gsap from "gsap";
import { prefersReducedMotion } from "./labMote";

export function lockPageScroll(lock) {
  document.documentElement.style.overflow = lock ? "hidden" : "";
}

export function playLabReveal({ section, veil, rift, panel, onDone }) {
  if (prefersReducedMotion()) {
    gsap.set(veil, { autoAlpha: 1 });
    gsap.set(rift, { autoAlpha: 1, scale: 1 });
    gsap.set(panel, { autoAlpha: 1, y: 0, scale: 1, filter: "none" });
    if (section) gsap.set(section, { filter: "none", x: 0 });
    onDone?.();
    return () => {};
  }

  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
    onComplete: () => onDone?.(),
  });

  if (section) {
    tl.to(section, { filter: "blur(3px) brightness(0.92)", duration: 0.28 }, 0)
      .to(
        section,
        {
          x: 5,
          duration: 0.045,
          yoyo: true,
          repeat: 7,
          ease: "power1.inOut",
        },
        0.12,
      )
      .set(section, { x: 0 });
  }

  tl.set(veil, { autoAlpha: 0, display: "block" }, 0)
    .to(veil, { autoAlpha: 1, duration: 0.35 }, 0.18)
    .fromTo(
      rift,
      { autoAlpha: 0, scale: 0.15, rotate: -8 },
      { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.7, ease: "power3.out" },
      0.28,
    )
    .fromTo(
      panel,
      { autoAlpha: 0, y: 36, scale: 0.94, filter: "blur(10px)" },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.65,
        ease: "power3.out",
      },
      0.55,
    )
    .to(
      rift,
      { autoAlpha: 0.2, scale: 1.35, duration: 0.55, ease: "power2.out" },
      0.75,
    );

  return () => {
    tl.kill();
  };
}

export function playLabClose({ section, veil, rift, panel, onDone }) {
  if (prefersReducedMotion()) {
    gsap.set([veil, rift, panel], { autoAlpha: 0 });
    if (section) gsap.set(section, { filter: "none", x: 0 });
    onDone?.();
    return () => {};
  }

  const tl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    onComplete: () => {
      gsap.set([veil, rift, panel], { autoAlpha: 0 });
      if (section) gsap.set(section, { filter: "none", x: 0 });
      onDone?.();
    },
  });

  tl.to(panel, { autoAlpha: 0, y: 20, scale: 0.97, duration: 0.35 }, 0)
    .to(rift, { autoAlpha: 0, scale: 1.15, duration: 0.35 }, 0.05)
    .to(veil, { autoAlpha: 0, duration: 0.3 }, 0.12);

  if (section) {
    tl.to(section, { filter: "blur(0px) brightness(1)", duration: 0.4 }, 0.15);
  }

  return () => {
    tl.kill();
  };
}
