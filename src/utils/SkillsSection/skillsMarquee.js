/*
  Dual-row skills marquee — one LTR, one RTL.
  Loops the same tech list (even if only 4 items).
*/
import gsap from "gsap";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function ensureBaseHtml(segment) {
  if (!segment.dataset.baseHtml) {
    segment.dataset.baseHtml = segment.innerHTML;
  }
  segment.innerHTML = segment.dataset.baseHtml;
}

function fillSegment(segment, minWidth) {
  if (!segment) return 0;

  while (segment.scrollWidth < minWidth) {
    const kids = Array.from(segment.children);
    if (!kids.length) break;
    kids.forEach((child) => {
      segment.appendChild(child.cloneNode(true));
    });
    if (segment.children.length > 64) break;
  }

  return segment.scrollWidth;
}

export function bindSkillsMarquee(root) {
  if (!root) return () => {};

  const rows = root.querySelectorAll("[data-marquee-row]");
  if (!rows.length) return () => {};

  if (prefersReducedMotion()) {
    rows.forEach((row) => {
      const track = row.querySelector("[data-marquee-track]");
      if (track) gsap.set(track, { clearProps: "transform" });
    });
    return () => {};
  }

  const tweens = [];

  function setup() {
    tweens.splice(0).forEach((tween) => tween.kill());

    rows.forEach((row) => {
      const track = row.querySelector("[data-marquee-track]");
      const segments = track?.querySelectorAll("[data-marquee-segment]");
      if (!track || !segments?.length) return;

      const first = segments[0];
      ensureBaseHtml(first);

      const viewport = row.clientWidth || root.clientWidth || 400;
      const width = fillSegment(first, viewport + 80);

      for (let i = 1; i < segments.length; i += 1) {
        segments[i].innerHTML = first.innerHTML;
      }

      gsap.set(track, { x: 0 });

      const dir = row.getAttribute("data-dir") === "ltr" ? "ltr" : "rtl";
      const duration = Math.max(18, width / 28);

      if (dir === "rtl") {
        tweens.push(
          gsap.fromTo(
            track,
            { x: 0 },
            { x: -width, duration, ease: "none", repeat: -1 },
          ),
        );
      } else {
        tweens.push(
          gsap.fromTo(
            track,
            { x: -width },
            { x: 0, duration, ease: "none", repeat: -1 },
          ),
        );
      }
    });
  }

  setup();
  window.addEventListener("resize", setup);

  return () => {
    window.removeEventListener("resize", setup);
    tweens.forEach((tween) => tween.kill());
  };
}
