/*
  GSAP helpers for the project detail case study.
*/
import gsap from "gsap";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function revealDetail(nodes) {
  if (!nodes?.length) return () => {};
  if (prefersReducedMotion()) return () => {};

  const tween = gsap.fromTo(
    nodes,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: "power2.out",
      overwrite: "auto",
    },
  );

  return () => {
    if (tween.isActive()) tween.progress(1);
    tween.kill();
  };
}

export function bindMagnetic(buttons) {
  if (!buttons?.length || prefersReducedMotion()) return () => {};

  const cleanups = [...buttons].map((button) => {
    function onMove(event) {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      gsap.to(button, {
        x: x * 0.18,
        y: y * 0.18,
        duration: 0.35,
        ease: "power2.out",
      });
    }

    function onLeave() {
      gsap.to(button, { x: 0, y: 0, duration: 0.45, ease: "power3.out" });
    }

    button.addEventListener("pointermove", onMove);
    button.addEventListener("pointerleave", onLeave);
    return () => {
      button.removeEventListener("pointermove", onMove);
      button.removeEventListener("pointerleave", onLeave);
      gsap.set(button, { clearProps: "transform" });
    };
  });

  return () => cleanups.forEach((fn) => fn());
}
