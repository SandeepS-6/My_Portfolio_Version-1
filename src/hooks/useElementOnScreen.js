import { useEffect, useState } from "react";

/* True while any part of the element is on screen. */
export function useElementOnScreen(id, initial = false) {
  const [onScreen, setOnScreen] = useState(initial);

  useEffect(() => {
    let frame = 0;

    function commit() {
      frame = 0;
      const el = document.getElementById(id);
      if (!el) {
        setOnScreen(false);
        return;
      }

      const rect = el.getBoundingClientRect();
      const next = rect.top < window.innerHeight && rect.bottom > 0;
      setOnScreen((prev) => (prev === next ? prev : next));
    }

    function requestUpdate() {
      if (frame) return;
      frame = window.requestAnimationFrame(commit);
    }

    commit();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [id]);

  return onScreen;
}
