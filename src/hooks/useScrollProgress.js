import { useEffect, useState } from "react";

/*
  Tracks how far the user has scrolled through a tall "pin" section.
  Returns progress from 0 → 1.

  progress = 0  → hero full width
  progress = 1  → left gap fully open, transition done
*/

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function useScrollProgress(sectionRef) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    function update() {
      const start = section.offsetTop;
      const range = section.offsetHeight - window.innerHeight;
      if (range <= 0) {
        setProgress(0);
        return;
      }

      const next = clamp((window.scrollY - start) / range, 0, 1);
      setProgress(next);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sectionRef]);

  return progress;
}
