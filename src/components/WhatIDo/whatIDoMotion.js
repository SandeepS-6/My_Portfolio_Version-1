/*
  Scroll-scrubbed cinema (reversible):
  1. Huge middle ribbon enters — already drifting R→L (scroll velocity)
  2. Splits into two rows; bottom flips to L→R
  3. Content reveals between them
*/
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createMarqueeState,
  measureSegment,
  prefersReducedMotion,
  sampleScrollVelocity,
  stepMarquee,
} from "./marqueeMotion";

gsap.registerPlugin(ScrollTrigger);

const BASE_SPEED = 0.55;
const BASE_SPEED_SPLIT = 0.72;
const PIN_CLASS = "what-i-do-pinning";

export function bindWhatIDoCinema(section) {
  if (!section) return () => {};

  const ribbonTop = section.querySelector(".what-i-do__ribbon--top");
  const ribbonBottom = section.querySelector(".what-i-do__ribbon--bottom");
  const tracks = section.querySelectorAll(".what-i-do__title-track");
  const driftTop = ribbonTop?.querySelector(".what-i-do__marquee-drift");
  const driftBottom = ribbonBottom?.querySelector(".what-i-do__marquee-drift");
  const eyebrow = section.querySelector(".what-i-do__eyebrow");
  const title = section.querySelector(".what-i-do__title");
  const lead = section.querySelector(".what-i-do__lead");
  const cards = section.querySelectorAll(".what-i-do__card");

  if (!ribbonTop || !ribbonBottom || !tracks.length || !driftTop || !driftBottom) {
    return () => {};
  }

  const reveal = [eyebrow, title, lead].filter(Boolean);

  if (prefersReducedMotion()) {
    gsap.set([...reveal, ...cards], { clearProps: "all" });
    section.classList.add("what-i-do--static");
    return () => {};
  }

  gsap.set([ribbonTop, ribbonBottom], {
    top: "50%",
    yPercent: -50,
    scale: 2.05,
    transformOrigin: "50% 50%",
  });
  gsap.set(tracks, { x: () => window.innerWidth });
  gsap.set(reveal, { opacity: 0, y: 24 });
  gsap.set(cards, { opacity: 0, y: 34 });

  driftTop.style.transform = "translate3d(0, 0, 0)";
  driftBottom.style.transform = "translate3d(0, 0, 0)";

  // Both R→L while stacked; bottom flips after split
  const stateTop = createMarqueeState(1);
  const stateBottom = createMarqueeState(1);
  let marqueeOn = false;
  let marqueeFrame = 0;
  let splitAt = 0.45;
  let afterSplit = false;

  function measure() {
    stateTop.segmentWidth = measureSegment(driftTop);
    stateBottom.segmentWidth = measureSegment(driftBottom);
  }

  function writeDrift(el, offset) {
    el.style.transform = `translate3d(${(-offset).toFixed(2)}px, 0, 0)`;
  }

  function marqueeLoop() {
    if (!marqueeOn) return;
    measure();
    const base = afterSplit ? BASE_SPEED_SPLIT : BASE_SPEED;
    const friction = afterSplit ? 0.9 : 0.88;
    writeDrift(driftTop, stepMarquee(stateTop, base, friction));
    writeDrift(driftBottom, stepMarquee(stateBottom, base, friction));
    marqueeFrame = requestAnimationFrame(marqueeLoop);
  }

  function startMarquees() {
    if (marqueeOn) return;
    marqueeOn = true;
    measure();
    stateTop.lastScrollY = window.scrollY;
    stateBottom.lastScrollY = window.scrollY;
    marqueeFrame = requestAnimationFrame(marqueeLoop);
  }

  function stopMarquees() {
    if (!marqueeOn) return;
    marqueeOn = false;
    cancelAnimationFrame(marqueeFrame);
    marqueeFrame = 0;
    stateTop.offset = 0;
    stateTop.boost = 0;
    stateBottom.offset = 0;
    stateBottom.boost = 0;
    stateBottom.direction = 1;
    afterSplit = false;
    writeDrift(driftTop, 0);
    writeDrift(driftBottom, 0);
  }

  function onScrollSample() {
    if (!marqueeOn) return;
    if (afterSplit) {
      // Stronger scroll coupling once the rows have opened
      sampleScrollVelocity(stateTop, 0.32, 14);
      sampleScrollVelocity(stateBottom, 0.32, 14);
    } else {
      sampleScrollVelocity(stateTop, 0.12, 6.5);
      sampleScrollVelocity(stateBottom, 0.12, 6.5);
    }
  }

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=300%",
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onToggle(self) {
        document.documentElement.classList.toggle(PIN_CLASS, self.isActive);
      },
      onUpdate(self) {
        if (self.progress > 0.01) startMarquees();
        else stopMarquees();

        afterSplit = self.progress >= splitAt;
        stateBottom.direction = afterSplit ? -1 : 1;
      },
    },
  });

  // 1 — Huge middle ribbon enters from the right (already drifting)
  tl.to(
    tracks,
    {
      x: 0,
      duration: 5,
      ease: "power1.inOut",
    },
    0,
  );

  tl.to({}, { duration: 0.7 }, ">");

  tl.addLabel("splitStart");

  // 2 — Split + shrink to final size
  tl.to(
    ribbonTop,
    {
      top: 0,
      yPercent: 0,
      scale: 1,
      duration: 4.2,
      ease: "power2.inOut",
    },
    "splitStart",
  );
  tl.to(
    ribbonBottom,
    {
      top: "100%",
      yPercent: -100,
      scale: 1,
      duration: 4.2,
      ease: "power2.inOut",
    },
    "splitStart",
  );

  // 3 — Content between the rows
  tl.to(
    reveal,
    {
      opacity: 1,
      y: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: "power2.out",
    },
    "-=2.8",
  );

  tl.to(
    cards,
    {
      opacity: 1,
      y: 0,
      duration: 1.55,
      stagger: 0.06,
      ease: "power2.out",
    },
    "-=2.1",
  );

  tl.to({}, { duration: 2.2 }, ">");

  splitAt = tl.labels.splitStart / tl.duration();

  window.addEventListener("scroll", onScrollSample, { passive: true });
  window.addEventListener("resize", measure, { passive: true });

  const refresh = () => {
    splitAt = tl.labels.splitStart / tl.duration();
    measure();
    ScrollTrigger.refresh();
  };
  const resizeObserver = new ResizeObserver(refresh);
  resizeObserver.observe(section);
  window.addEventListener("load", refresh);
  const settle = window.setTimeout(refresh, 400);

  return () => {
    stopMarquees();
    document.documentElement.classList.remove(PIN_CLASS);
    window.clearTimeout(settle);
    window.removeEventListener("load", refresh);
    window.removeEventListener("scroll", onScrollSample);
    window.removeEventListener("resize", measure);
    resizeObserver.disconnect();
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}

export function buildMarqueeUnits(text, count = 14) {
  return Array.from({ length: count }, () => String(text || "WHAT I DO").trim());
}
