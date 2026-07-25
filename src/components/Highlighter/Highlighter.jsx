import { useLayoutEffect, useRef } from "react";
import { bindScrollHighlight } from "./highlighterMotion";
import "./Highlighter.css";

/*
  Scroll-progress highlighter — mark fills with scrub.
*/

function Highlighter({
  children,
  action = "highlight",
  color = "#f17a32",
  isView = true,
  className = "",
}) {
  const rootRef = useRef(null);
  const markRef = useRef(null);

  useLayoutEffect(() => {
    return bindScrollHighlight(rootRef.current, markRef.current, {
      enabled: isView,
      action,
    });
  }, [isView, action, color, children]);

  return (
    <span
      ref={rootRef}
      className={`highlighter highlighter--${action}${className ? ` ${className}` : ""}`}
    >
      <span className="highlighter__text">{children}</span>
      <span
        ref={markRef}
        className="highlighter__mark"
        style={{ "--highlighter-color": color }}
        aria-hidden="true"
      />
    </span>
  );
}

export default Highlighter;
