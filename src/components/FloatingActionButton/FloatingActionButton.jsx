import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  DOCKED_THRESHOLD,
  getContactProgress,
  getDockTranslate,
  getPageScrollProgress,
} from "./fabScroll";
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
  const dockedRef = useRef(false);

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
      if (!contact) {
        dockedRef.current = false;
        el.dataset.contact = "false";
        el.style.setProperty("--fab-tx", "0px");
        el.style.setProperty("--fab-ty", "0px");
        el.style.setProperty("--fab-scale", "1");
        el.style.setProperty("--fab-progress-opacity", "1");
        return;
      }

      const dock = getContactProgress(contact);
      dockedRef.current = dock > DOCKED_THRESHOLD;
      el.dataset.contact = dock > 0.35 ? "true" : "false";

      if (dock <= 0) {
        el.dataset.contact = "false";
        el.style.setProperty("--fab-tx", "0px");
        el.style.setProperty("--fab-ty", "0px");
        el.style.setProperty("--fab-scale", "1");
        el.style.setProperty("--fab-progress-opacity", "1");
        return;
      }

      const { tx, ty, scale } = getDockTranslate(el, contact, dock);
      el.style.setProperty("--fab-tx", `${tx.toFixed(2)}px`);
      el.style.setProperty("--fab-ty", `${ty.toFixed(2)}px`);
      el.style.setProperty("--fab-scale", scale.toFixed(3));
      // Fade out orange ring as the button docks into Contact
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

  function handleClick(event) {
    if (onClick) onClick(event, { docked: dockedRef.current });
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`fab${className ? ` ${className}` : ""}`}
      style={{ "--fab-offset-bottom": `${offsetBottom}px` }}
      onClick={handleClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      {showProgress && (
        <svg className="fab__progress" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="fab__progress-track" cx="50" cy="50" r="48" />
          <circle
            className="fab__progress-fill"
            cx="50"
            cy="50"
            r="48"
            pathLength="1"
          />
        </svg>
      )}

      <svg className="fab__ring" viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <path
            id="fab-text-circle"
            d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
          />
        </defs>
        <text className="fab__ring-text">
          <textPath
            href="#fab-text-circle"
            textLength="276"
            lengthAdjust="spacingAndGlyphs"
          >
            {RING_TEXT}
          </textPath>
        </text>
      </svg>

      <span className="fab__arrow" aria-hidden="true">
        <ArrowUpRight size={22} strokeWidth={2.2} />
      </span>
    </button>
  );
}

export default FloatingActionButton;
