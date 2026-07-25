import { useEffect, useState } from "react";

/*
  Docs-style active section tracker.
  Picks the section that owns the primary reading line
  (mid viewport), independent of scroll direction.
*/

const READ_LINE = 0.42; // ~middle of the 35–50% reading band
const EDGE_PX = 2;

function resolveActiveId(ids) {
  if (!ids?.length) return undefined;

  const viewH = window.innerHeight;
  const scrollY = window.scrollY || window.pageYOffset;
  const docH = document.documentElement.scrollHeight;
  const atTop = scrollY <= EDGE_PX;
  const atBottom = scrollY + viewH >= docH - EDGE_PX;

  if (atTop) return ids[0];
  if (atBottom) return ids[ids.length - 1];

  const probeY = viewH * READ_LINE;
  let active = ids[0];

  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;

    const rect = el.getBoundingClientRect();
    // Own the probe once the section top has crossed the reading line.
    if (rect.top <= probeY) active = id;
  }

  return active;
}

export function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(() => ids[0]);

  useEffect(() => {
    if (!ids?.length) return undefined;

    let frame = 0;

    function commit() {
      frame = 0;
      const next = resolveActiveId(ids);
      if (!next) return;
      setActiveId((prev) => (prev === next ? prev : next));
    }

    function requestUpdate() {
      if (frame) return;
      frame = window.requestAnimationFrame(commit);
    }

    commit();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("hashchange", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("hashchange", requestUpdate);
    };
  }, [ids]);

  return activeId;
}
