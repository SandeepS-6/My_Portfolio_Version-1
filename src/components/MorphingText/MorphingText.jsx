import { useEffect, useId, useRef, useState } from "react";
import "./MorphingText.css";

const MORPH_TIME = 2.8;
const COOLDOWN_TIME = 2.2;
/* Hold first name (Sandeep) before morphing to the next */
const START_DELAY = 4;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function useMorphingText(texts, startDelay = START_DELAY) {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);
  const timeRef = useRef(new Date());
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const textsRef = useRef(texts);
  textsRef.current = texts;
  const textsKey = texts.join("\0");

  useEffect(() => {
    const list = textsRef.current;
    if (!list.length) return undefined;
    if (prefersReducedMotion()) {
      if (text2Ref.current) text2Ref.current.textContent = list[0];
      if (text1Ref.current) text1Ref.current.textContent = "";
      return undefined;
    }

    textIndexRef.current = 0;
    morphRef.current = 0;
    // Hold on first word before any morph
    cooldownRef.current = Math.max(0, startDelay);
    timeRef.current = new Date();

    const current1 = text1Ref.current;
    const current2 = text2Ref.current;
    if (current1 && current2) {
      // First show texts[0] (Sandeep); next word waits hidden
      current1.textContent = list[0];
      current1.style.filter = "none";
      current1.style.opacity = "100%";
      current2.textContent = list[1 % list.length];
      current2.style.filter = "none";
      current2.style.opacity = "0%";
    }

    const setStyles = (fraction) => {
      const layer1 = text1Ref.current;
      const layer2 = text2Ref.current;
      const words = textsRef.current;
      if (!layer1 || !layer2 || !words.length) return;

      layer2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      layer2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const invertedFraction = 1 - fraction;
      layer1.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`;
      layer1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;

      layer1.textContent = words[textIndexRef.current % words.length];
      layer2.textContent = words[(textIndexRef.current + 1) % words.length];
    };

    const doMorph = () => {
      morphRef.current -= cooldownRef.current;
      cooldownRef.current = 0;

      let fraction = morphRef.current / MORPH_TIME;
      if (fraction > 1) {
        cooldownRef.current = COOLDOWN_TIME;
        fraction = 1;
      }

      setStyles(fraction);

      if (fraction === 1) {
        textIndexRef.current += 1;
      }
    };

    const doCooldown = () => {
      morphRef.current = 0;
      const layer1 = text1Ref.current;
      const layer2 = text2Ref.current;
      if (!layer1 || !layer2) return;

      // Before first morph: keep first name (Sandeep) on layer1
      if (textIndexRef.current === 0) {
        layer1.style.filter = "none";
        layer1.style.opacity = "100%";
        layer2.style.filter = "none";
        layer2.style.opacity = "0%";
        return;
      }

      layer2.style.filter = "none";
      layer2.style.opacity = "100%";
      layer1.style.filter = "none";
      layer1.style.opacity = "0%";
    };

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const now = new Date();
      const dt = (now.getTime() - timeRef.current.getTime()) / 1000;
      timeRef.current = now;
      cooldownRef.current -= dt;
      if (cooldownRef.current <= 0) doMorph();
      else doCooldown();
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [textsKey, startDelay]);

  return { text1Ref, text2Ref };
}

function MorphingText({ texts = [], className = "", startDelay = START_DELAY }) {
  const filterId = useId().replace(/:/g, "");
  const { text1Ref, text2Ref } = useMorphingText(texts, startDelay);
  const [staticOnly, setStaticOnly] = useState(false);
  const longest = texts.reduce((a, b) => (b.length > a.length ? b : a), "");

  useEffect(() => {
    setStaticOnly(prefersReducedMotion());
  }, []);

  if (!texts.length) return null;

  if (staticOnly) {
    return (
      <span className={`morphing-text${className ? ` ${className}` : ""}`}>
        {texts[0]}
      </span>
    );
  }

  return (
    <span
      className={`morphing-text${className ? ` ${className}` : ""}`}
      style={{ filter: `url(#${filterId}) blur(0.6px)` }}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="morphing-text__sizer" aria-hidden="true">
        {longest}
      </span>
      <span className="morphing-text__layer" ref={text1Ref} aria-hidden="true" />
      <span className="morphing-text__layer" ref={text2Ref} />
      <svg className="morphing-text__filters" aria-hidden="true">
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </span>
  );
}

export default MorphingText;
