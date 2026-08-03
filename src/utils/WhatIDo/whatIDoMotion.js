/*
  Scroll-scrubbed cinema (reversible):
  1. Huge middle ribbon enters — already drifting R→L (scroll velocity)
  2. Splits into two rows; bottom flips to L→R
  3. Content reveals between them

  Shrink uses font-size (not CSS scale) so outline text stays sharp.
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
// Start big, scrub down to 1 (final ribbon size)
const ZOOM_BIG = 1.8;

export function bindWhatIDoCinema(section) {
  if (!section) return () => {};

  const ribbonTop = section.querySelector(".what-i-do__ribbon--top");
  const ribbonBottom = section.querySelector(".what-i-do__ribbon--bottom");
  const tracks = section.querySelectorAll(".what-i-do__title-track");
  const driftTop = ribbonTop?.querySelector(".what-i-do__marquee-drift");
  const driftBottom = ribbonBottom?.querySelector(".what-i-do__marquee-drift");
  const units = section.querySelectorAll(".what-i-do__marquee-unit");
  const title = section.querySelector(".what-i-do__title");
  const lead = section.querySelector(".what-i-do__lead");
  const cards = section.querySelectorAll(".what-i-do__card");

  if (!ribbonTop || !ribbonBottom || !tracks.length || !driftTop || !driftBottom) {
    return () => {};
  }

  const reveal = [title, lead].filter(Boolean);

  if (prefersReducedMotion()) {
    gsap.set([...reveal, ...cards], { clearProps: "all" });
    section.classList.add("what-i-do--static");
    return () => {
      section.classList.remove("what-i-do--static");
    };
  }

  section.classList.remove("what-i-do--static");

  // No CSS scale — tween a zoom proxy into --marquee-zoom (GSAP CSS vars can no-op)
  const zoomState = { z: ZOOM_BIG };

  function applyZoom(z) {
    const value = String(Math.max(1, z));
    units.forEach((el) => {
      el.style.setProperty("--marquee-zoom", value);
    });
  }

  applyZoom(ZOOM_BIG);

  gsap.set([ribbonTop, ribbonBottom], {
    top: "50%",
    yPercent: -50,
    transformOrigin: "50% 50%",
    force3D: false,
  });
  gsap.set(tracks, { x: () => window.innerWidth, force3D: false });
  if (reveal.length) gsap.set(reveal, { opacity: 0, y: 24, force3D: false });
  gsap.set(cards, { opacity: 0, y: 34, force3D: false });

  driftTop.style.transform = "translate(0px, 0)";
  driftBottom.style.transform = "translate(0px, 0)";

  const stateTop = createMarqueeState(1);
  const stateBottom = createMarqueeState(1);
  let marqueeOn = false;
  let marqueeFrame = 0;
  let splitAt = 0.45;
  let scaleDoneAt = 0.7;
  let afterSplit = false;
  let ribbonsCrisp = false;
  let refreshTimer = 0;

  function measure() {
    stateTop.segmentWidth = measureSegment(driftTop);
    stateBottom.segmentWidth = measureSegment(driftBottom);
  }

  // Whole pixels — subpixel translate softens stroked glyphs
  function writeDrift(el, offset) {
    const x = Math.round(-offset);
    if (ribbonsCrisp) {
      // No transform on the text tree once settled — keeps stroke as sharp as your screenshot
      el.style.transform = "none";
      el.style.marginLeft = `${x}px`;
    } else {
      el.style.marginLeft = "";
      el.style.transform = `translate(${x}px, 0)`;
    }
  }

  function paintCrisp() {
    gsap.set([ribbonTop, ribbonBottom, ...tracks], {
      clearProps: "transform,yPercent,x",
      force3D: false,
    });
    zoomState.z = 1;
    applyZoom(1);
    [ribbonTop, ribbonBottom, ...tracks, driftTop, driftBottom].forEach((el) => {
      el.style.willChange = "auto";
    });
    writeDrift(driftTop, stateTop.offset);
    writeDrift(driftBottom, stateBottom.offset);
  }

  // After shrink: strip leftover transforms. Force re-paint on scroll-back.
  function setRibbonCrisp(on, forcePaint = false) {
    if (on) {
      const first = !ribbonsCrisp;
      ribbonsCrisp = true;
      section.classList.add("what-i-do--crisp");
      ribbonTop.classList.add("what-i-do__ribbon--crisp");
      ribbonBottom.classList.add("what-i-do__ribbon--crisp");
      if (first || forcePaint) {
        paintCrisp();
        measure();
      }
      return;
    }

    if (!ribbonsCrisp) return;
    ribbonsCrisp = false;
    section.classList.remove("what-i-do--crisp");
    ribbonTop.classList.remove("what-i-do__ribbon--crisp");
    ribbonBottom.classList.remove("what-i-do__ribbon--crisp");
    driftTop.style.marginLeft = "";
    driftBottom.style.marginLeft = "";
    ribbonTop.style.willChange = "top, transform";
    ribbonBottom.style.willChange = "top, transform";
    tracks.forEach((el) => {
      el.style.willChange = "transform";
    });
    driftTop.style.willChange = "transform";
    driftBottom.style.willChange = "transform";
  }

  function syncCrispFromProgress(progress, forcePaint = false) {
    setRibbonCrisp(progress >= scaleDoneAt, forcePaint);
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
      sampleScrollVelocity(stateTop, 0.32, 14);
      sampleScrollVelocity(stateBottom, 0.32, 14);
    } else {
      sampleScrollVelocity(stateTop, 0.12, 6.5);
      sampleScrollVelocity(stateBottom, 0.12, 6.5);
    }
  }

  const grid = section.querySelector(".what-i-do__grid");
  const gridProxy = { p: 0 };
  const cinemaScrollPx = () => window.innerHeight * 3;

  function getGridMax() {
    if (!grid) return 0;
    return Math.max(0, grid.scrollHeight - grid.clientHeight);
  }

  function applyGridScroll() {
    if (!grid) return;
    grid.scrollTop = gridProxy.p * getGridMax();
  }

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      // Cinema (~300vh) + card-list overflow so up/down stay symmetrical
      end: () => `+=${cinemaScrollPx() + getGridMax()}`,
      pin: true,
      // fixed pin avoids a transform on the section (that softens all type)
      pinType: "fixed",
      scrub: true,
      anticipatePin: 0,
      invalidateOnRefresh: true,
      onToggle(self) {
        document.documentElement.classList.toggle(PIN_CLASS, self.isActive);
        syncCrispFromProgress(self.progress, true);
      },
      // Scroll back from below — force the same sharp paint as first settle
      onEnterBack(self) {
        syncCrispFromProgress(self.progress, true);
        applyGridScroll();
      },
      onEnter(self) {
        syncCrispFromProgress(self.progress, true);
      },
      onUpdate(self) {
        if (self.progress > 0.01) startMarquees();
        else stopMarquees();

        afterSplit = self.progress >= splitAt;
        stateBottom.direction = afterSplit ? -1 : 1;
        syncCrispFromProgress(self.progress);
      },
    },
  });

  // 1 — Huge middle ribbon enters from the right
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

  // 2 — Split + shrink big → final size
  tl.to(
    ribbonTop,
    {
      top: 0,
      yPercent: 0,
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
      duration: 4.2,
      ease: "power2.inOut",
    },
    "splitStart",
  );
  tl.to(
    zoomState,
    {
      z: 1,
      duration: 4.2,
      ease: "power2.inOut",
      onUpdate: () => applyZoom(zoomState.z),
    },
    "splitStart",
  );

  // 3 — Content between the rows
  if (reveal.length) {
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
  }

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

  const cinemaDuration = tl.duration();

  function syncProgressMarks() {
    splitAt = tl.labels.splitStart / tl.duration();
    scaleDoneAt = Math.min(
      0.98,
      (tl.labels.splitStart + 4.2) / tl.duration(),
    );
  }

  function gridPhaseDuration() {
    const cinemaPx = cinemaScrollPx();
    const max = getGridMax();
    if (!max || !cinemaPx) return 0.0001;
    // Keep cinema scroll distance at ~300vh; add grid overflow in proportion.
    return (cinemaDuration * max) / cinemaPx;
  }

  // Stage 2 — scrub the card list after the cinema reveal.
  // Down: grid 0 → max, then unpin. Up: grid max → 0, then reverse cinema.
  tl.to(
    gridProxy,
    {
      p: 1,
      duration: gridPhaseDuration,
      ease: "none",
      onUpdate: applyGridScroll,
    },
    ">",
  );

  syncProgressMarks();

  // Native grid scroll fights scrub (especially on the way up) — drive it only via ST.
  let previousOverflowY = "";
  if (grid) {
    previousOverflowY = grid.style.overflowY;
    grid.style.overflowY = "hidden";
    grid.scrollTop = 0;
  }

  function softRefresh() {
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(() => {
      syncProgressMarks();
      measure();
      applyGridScroll();
      ScrollTrigger.refresh();
    }, 120);
  }

  window.addEventListener("scroll", onScrollSample, { passive: true });
  window.addEventListener("resize", softRefresh, { passive: true });
  window.addEventListener("load", softRefresh);
  const settle = window.setTimeout(softRefresh, 400);

  return () => {
    stopMarquees();
    setRibbonCrisp(false);
    document.documentElement.classList.remove(PIN_CLASS);
    window.clearTimeout(settle);
    window.clearTimeout(refreshTimer);
    window.removeEventListener("load", softRefresh);
    window.removeEventListener("scroll", onScrollSample);
    window.removeEventListener("resize", softRefresh);
    if (grid) {
      grid.style.overflowY = previousOverflowY;
      grid.scrollTop = 0;
    }
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}

export function buildMarqueeUnits(text, count = 14) {
  return Array.from({ length: count }, () => String(text || "WHAT I DO").trim());
}
