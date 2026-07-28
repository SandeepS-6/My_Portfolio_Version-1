import { useEffect } from "react";

/*
  Tracks how far the user has scrolled through a tall "pin" section.
  Writes the left-rail gap width straight to the DOM — no React state,
  so Home / Hero do not re-render on every scroll frame.
*/

const GAP_MAX = 0; // hero stays full-bleed; sidebar only on later sections

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function useScrollGap(sectionRef, gapRef) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    let frame = 0;

    function writeGap() {
      frame = 0;
      const gap = gapRef.current;
      if (!gap) return;

      const range = section.offsetHeight - window.innerHeight;
      const next =
        range <= 0
          ? 0
          : clamp((window.scrollY - section.offsetTop) / range, 0, 1);

      gap.style.width = `${next * GAP_MAX}px`;
    }

    function requestWrite() {
      if (frame) return;
      frame = window.requestAnimationFrame(writeGap);
    }

    writeGap();
    window.addEventListener("scroll", requestWrite, { passive: true });
    window.addEventListener("resize", requestWrite);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestWrite);
      window.removeEventListener("resize", requestWrite);
    };
  }, [sectionRef, gapRef]);
}

export { GAP_MAX };
