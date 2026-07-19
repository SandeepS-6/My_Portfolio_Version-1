import { useEffect, useState } from "react";

/* True while any part of the element is on screen. */
export function useElementOnScreen(id) {
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    function update() {
      const el = document.getElementById(id);
      if (!el) {
        setOnScreen(false);
        return;
      }

      const rect = el.getBoundingClientRect();
      setOnScreen(rect.top < window.innerHeight && rect.bottom > 0);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [id]);

  return onScreen;
}
