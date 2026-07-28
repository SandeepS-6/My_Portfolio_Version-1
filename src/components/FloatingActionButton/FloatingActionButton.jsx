import { useEffect, useId, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  DOCKED_THRESHOLD,
  getContactProgress,
  getDockTranslate,
  getPageScrollProgress,
} from "./fabScroll";
import {
  clearEyeTarget,
  createEyeState,
  prefersReducedMotion,
  scheduleBlinks,
  setEyeTarget,
  stepEyes,
} from "./fabEyes";
import "./FloatingActionButton.css";

const RING_TEXT = "LET'S TALK • SAY HELLO • LET'S TALK • SAY HELLO • ";

function FloatingActionButton({
  onClick,
  label = "Let's talk",
  disabled = false,
  offsetBottom = 0,
  showProgress = true,
  contactSectionId = "contact",
  className = "",
}) {
  const buttonRef = useRef(null);
  const faceRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const shellRef = useRef(null);
  const dockedRef = useRef(false);
  const pathId = useId().replace(/:/g, "");

  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return undefined;

    let frame = 0;

    function writeProgress() {
      if (!showProgress) return;
      el.style.setProperty(
        "--fab-progress",
        getPageScrollProgress().toFixed(4),
      );
    }

    function writeDock() {
      const contact = document.getElementById(contactSectionId);
      const shell = shellRef.current;

      if (!contact) {
        dockedRef.current = false;
        el.dataset.contact = "false";
        if (shell) shell.dataset.contact = "false";
        el.style.setProperty("--fab-tx", "0px");
        el.style.setProperty("--fab-ty", "0px");
        el.style.setProperty("--fab-scale", "1");
        el.style.setProperty("--fab-progress-opacity", "1");
        return;
      }

      const dock = getContactProgress(contact);
      dockedRef.current = dock > DOCKED_THRESHOLD;
      const nearContact = dock > 0.35;
      el.dataset.contact = nearContact ? "true" : "false";
      if (shell) shell.dataset.contact = nearContact ? "true" : "false";

      if (dock <= 0) {
        el.dataset.contact = "false";
        if (shell) shell.dataset.contact = "false";
        el.style.setProperty("--fab-tx", "0px");
        el.style.setProperty("--fab-ty", "0px");
        el.style.setProperty("--fab-scale", "1");
        el.style.setProperty("--fab-progress-opacity", "1");
        return;
      }

      const { tx, ty, scale } = getDockTranslate(el, contact, dock, shell);
      el.style.setProperty("--fab-tx", `${tx.toFixed(2)}px`);
      el.style.setProperty("--fab-ty", `${ty.toFixed(2)}px`);
      el.style.setProperty("--fab-scale", scale.toFixed(3));
      el.style.setProperty(
        "--fab-progress-opacity",
        Math.max(0, 1 - dock).toFixed(3),
      );
    }

    function update() {
      frame = 0;
      writeProgress();
      writeDock();
    }

    function requestUpdate() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [showProgress, contactSectionId]);

  useEffect(() => {
    const face = faceRef.current;
    if (!face) return undefined;

    const reduced = prefersReducedMotion();
    const state = createEyeState();
    let frame = 0;
    let running = true;

    function writePupils() {
      const { x, y } = stepEyes(state);
      const move = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      if (leftPupilRef.current) leftPupilRef.current.style.transform = move;
      if (rightPupilRef.current) rightPupilRef.current.style.transform = move;
    }

    function loop() {
      if (!running) return;
      writePupils();
      frame = requestAnimationFrame(loop);
    }

    function onMove(event) {
      if (reduced) return;
      setEyeTarget(
        state,
        event.clientX,
        event.clientY,
        face.getBoundingClientRect(),
      );
    }

    function onLeave() {
      clearEyeTarget(state);
    }

    frame = requestAnimationFrame(loop);
    const stopBlinks = scheduleBlinks(face, state);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      stopBlinks();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  function handleClick(event) {
    if (onClick) onClick(event, { docked: dockedRef.current });
  }

  const ringPathId = `fab-text-circle-${pathId}`;

  return (
    <div
      ref={shellRef}
      className={`fab-shell${className ? ` ${className}` : ""}`}
      style={{ "--fab-offset-bottom": `${offsetBottom}px` }}
    >
      <button
        ref={buttonRef}
        type="button"
        className="fab"
        onClick={handleClick}
        disabled={disabled}
        aria-label={label}
        title={label}
      >
        {showProgress && (
          <svg className="fab__progress" viewBox="0 0 100 100" aria-hidden="true">
            <circle
              className="fab__progress-fill"
              cx="50"
              cy="50"
              r="48"
              fill="none"
              pathLength="1"
            />
          </svg>
        )}

        {/* Text mid-band: face ~58% → path r=47 → disc edge → orange outside */}
        <svg className="fab__ring" viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <path
              id={ringPathId}
              d="M 60,60 m -47,0 a 47,47 0 1,1 94,0 a 47,47 0 1,1 -94,0"
            />
          </defs>
          <text className="fab__ring-text">
            <textPath
              href={`#${ringPathId}`}
              textLength="295"
              lengthAdjust="spacingAndGlyphs"
            >
              {RING_TEXT}
            </textPath>
          </text>
        </svg>

        <span className="fab__face" ref={faceRef} aria-hidden="true">
          <span className="fab__eyes">
            <span className="fab__eye fab__eye--left">
              <span className="fab__pupil" ref={leftPupilRef} />
            </span>
            <span className="fab__eye fab__eye--right">
              <span className="fab__pupil" ref={rightPupilRef} />
            </span>
          </span>
          <span className="fab__arrow">
            <ArrowUpRight size={22} strokeWidth={2.2} />
          </span>
        </span>
      </button>
    </div>
  );
}

export default FloatingActionButton;
