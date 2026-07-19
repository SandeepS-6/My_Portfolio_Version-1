import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import "./FloatingActionButton.css";

/*
  Circular badge FAB — rotating "LET'S TALK • SAY HELLO" ring
  around a centered arrow, wrapped by a scroll-progress ring.

  Progress is written straight to a CSS variable from a
  rAF-throttled scroll listener, so scrolling never re-renders React.
  Ring color comes from the shared --color-accent token (CMS-ready).
*/

const RING_TEXT = "LET'S TALK • SAY HELLO • LET'S TALK • SAY HELLO • ";

function FloatingActionButton({
  onClick,
  label = "Let's talk",
  disabled = false,
  offsetBottom = 0,
  showProgress = true,
  className = "",
}) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!showProgress) return undefined;

    const el = buttonRef.current;
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress =
        max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.setProperty("--fab-progress", progress.toFixed(4));
    };

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [showProgress]);

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`fab${className ? ` ${className}` : ""}`}
      style={{ "--fab-offset-bottom": `${offsetBottom}px` }}
      onClick={onClick}
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
