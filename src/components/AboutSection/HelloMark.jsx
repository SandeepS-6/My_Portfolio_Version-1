import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import "./HelloMark.css";

/*
  Exact HELLO mark from reference:
  tilted stamp text + two orange ticks + orange period dot
*/
function HelloMark({ text = "HELLO.", asBackground = false }) {
  const rootRef = useRef(null);
  const uid = useId().replace(/:/g, "");
  const filterId = `about-hello-stamp-${uid}`;
  const label = String(text).replace(/\.$/, "");

  useEffect(() => {
    if (!asBackground || !rootRef.current) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(rootRef.current, { opacity: 0.18 });
      return undefined;
    }

    const tween = gsap.fromTo(
      rootRef.current,
      { opacity: 0, y: 18 },
      { opacity: 0.18, y: 0, duration: 1.1, ease: "power2.out", delay: 0.15 },
    );

    return () => {
      tween.kill();
    };
  }, [asBackground]);

  return (
    <div
      ref={rootRef}
      className={`about-hello${asBackground ? " about-hello--bg" : ""}`}
      aria-hidden={asBackground ? true : undefined}
      role={asBackground ? undefined : "img"}
      aria-label={asBackground ? undefined : text}
    >
      <svg className="about-hello__filter" aria-hidden="true" focusable="false">
        <filter id={filterId} x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.35"
            numOctaves="2"
            seed="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <span className="about-hello__ticks" aria-hidden="true">
        <i />
        <i />
      </span>

      <p className="about-hello__word">
        <span
          className="about-hello__ink"
          style={{ filter: `url(#${filterId})` }}
        >
          {label}
        </span>
        <span className="about-hello__dot" aria-hidden="true" />
      </p>
    </div>
  );
}

export default HelloMark;
