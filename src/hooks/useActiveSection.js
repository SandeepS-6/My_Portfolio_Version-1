import { useEffect, useState } from "react";

/*
  Tracks which page section is currently in view.
  A section becomes "active" once its top crosses the middle
  of the viewport. Returns the active section id.
*/

export function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    function update() {
      let current = ids[0];

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;

        if (el.getBoundingClientRect().top <= window.innerHeight * 0.5) {
          current = id;
        }
      }

      setActiveId(current);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ids]);

  return activeId;
}
