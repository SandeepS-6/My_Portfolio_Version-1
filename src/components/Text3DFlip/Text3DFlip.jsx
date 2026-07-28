import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useAnimate } from "motion/react";
import "./Text3DFlip.css";

const HAS_SEGMENTER = typeof Intl !== "undefined" && "Segmenter" in Intl;

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

function splitIntoCharacters(text) {
  if (HAS_SEGMENTER) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }
  return Array.from(text);
}

function extractTextFromChildren(children) {
  if (children == null) return "";
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("");
  }
  if (children?.props?.children != null) {
    return extractTextFromChildren(children.props.children);
  }
  return "";
}

const ROTATION_MAP = {
  top: "rotateX(90deg)",
  right: "rotateY(90deg)",
  bottom: "rotateX(-90deg)",
  left: "rotateY(-90deg)",
};

const SECOND_FACE_TRANSFORMS = {
  top: "rotateX(-90deg) translateZ(0.5lh)",
  right:
    "rotateY(90deg) translateX(50%) rotateY(-90deg) translateX(-50%) rotateY(-90deg) translateX(50%)",
  bottom: "rotateX(90deg) translateZ(0.5lh)",
  left: "rotateY(90deg) translateX(50%) rotateY(-90deg) translateX(50%) rotateY(-90deg) translateX(50%)",
};

const FRONT_FACE_TRANSFORMS = {
  top: "translateZ(0.5lh)",
  bottom: "translateZ(0.5lh)",
  left: "rotateY(90deg) translateX(50%) rotateY(-90deg)",
  right: "rotateY(-90deg) translateX(50%) rotateY(90deg)",
};

const CONTAINER_TRANSFORMS = {
  top: "translateZ(-0.5lh)",
  bottom: "translateZ(-0.5lh)",
  left: "rotateY(90deg) translateX(50%) rotateY(-90deg)",
  right: "rotateY(90deg) translateX(50%) rotateY(-90deg)",
};

const DEFAULT_TRANSITION = {
  type: "spring",
  damping: 30,
  stiffness: 300,
};

const CharBox = memo(function CharBox({
  char,
  accent,
  textClassName,
  flipTextClassName,
  rotateDirection,
}) {
  const faceClass = cx(
    "text-3d-flip__face",
    accent ? "text-3d-flip__face--accent" : "",
    textClassName,
  );
  const flipClass = cx(
    "text-3d-flip__face",
    "text-3d-flip__face--flip",
    accent ? "text-3d-flip__face--accent" : "",
    flipTextClassName,
  );

  return (
    <span
      className="text-3d-flip__char"
      style={{ transform: CONTAINER_TRANSFORMS[rotateDirection] }}
    >
      <span
        className={faceClass}
        style={{ transform: FRONT_FACE_TRANSFORMS[rotateDirection] }}
      >
        {char}
      </span>
      <span
        className={flipClass}
        style={{ transform: SECOND_FACE_TRANSFORMS[rotateDirection] }}
      >
        {char}
      </span>
    </span>
  );
});

function Text3DFlip({
  children,
  as: ElementTag = "p",
  className = "",
  textClassName = "",
  flipTextClassName = "",
  staggerDuration = 0.05,
  staggerFrom = "first",
  transition = DEFAULT_TRANSITION,
  rotateDirection = "right",
  accentWords = [],
  ...props
}) {
  const isAnimatingRef = useRef(false);
  const isMountedRef = useRef(false);
  const [scope, animate] = useAnimate();
  const rotationTransform = ROTATION_MAP[rotateDirection];

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      isAnimatingRef.current = false;
    };
  }, []);

  const text = useMemo(() => {
    try {
      return extractTextFromChildren(children);
    } catch {
      return "";
    }
  }, [children]);

  const accentSet = useMemo(
    () => new Set(accentWords.map((w) => String(w).toLowerCase())),
    [accentWords],
  );

  const characters = useMemo(() => {
    const lines = text.split(/\n+/);
    const items = [];

    lines.forEach((line, lineIndex) => {
      const words = line.trim().split(/\s+/).filter(Boolean);
      words.forEach((word, wordIndex) => {
        items.push({
          characters: splitIntoCharacters(word),
          accent: accentSet.has(word.toLowerCase().replace(/[.,!?;:]$/, "")),
          needsSpace: wordIndex !== words.length - 1,
          breakAfter: false,
        });
      });
      if (lineIndex < lines.length - 1 && words.length) {
        items[items.length - 1].breakAfter = true;
      }
    });

    return items;
  }, [text, accentSet]);

  const charOffsets = useMemo(() => {
    const offsets = [0];
    for (const word of characters) {
      offsets.push(offsets[offsets.length - 1] + word.characters.length);
    }
    return offsets;
  }, [characters]);

  const getStaggerDelay = useCallback(
    (index, totalChars) => {
      if (staggerFrom === "first") return index * staggerDuration;
      if (staggerFrom === "last") {
        return (totalChars - 1 - index) * staggerDuration;
      }
      if (staggerFrom === "center") {
        const center = Math.floor(totalChars / 2);
        return Math.abs(center - index) * staggerDuration;
      }
      if (staggerFrom === "random") {
        const randomIndex = Math.floor(Math.random() * totalChars);
        return Math.abs(randomIndex - index) * staggerDuration;
      }
      return Math.abs(staggerFrom - index) * staggerDuration;
    },
    [staggerFrom, staggerDuration],
  );

  const handleHoverStart = useCallback(async () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    try {
      const totalChars = characters.reduce(
        (sum, word) => sum + word.characters.length,
        0,
      );
      const delays = Array.from({ length: totalChars }, (_, i) =>
        getStaggerDelay(i, totalChars),
      );

      await animate(
        ".text-3d-flip__char",
        { transform: rotationTransform },
        {
          ...transition,
          delay: (i) => delays[i],
        },
      );

      if (!isMountedRef.current) return;

      await animate(
        ".text-3d-flip__char",
        { transform: CONTAINER_TRANSFORMS[rotateDirection] },
        { duration: 0 },
      );
    } finally {
      if (isMountedRef.current) {
        isAnimatingRef.current = false;
      }
    }
  }, [
    characters,
    transition,
    getStaggerDelay,
    rotationTransform,
    rotateDirection,
    animate,
  ]);

  return (
    <ElementTag
      className={cx("text-3d-flip", className)}
      onMouseEnter={handleHoverStart}
      ref={scope}
      {...props}
    >
      <span className="text-3d-flip__sr">{text}</span>

      {characters.map((wordObj, wordIndex) => (
        <span key={wordIndex} className="text-3d-flip__chunk">
          <span className="text-3d-flip__word">
            {wordObj.characters.map((char, charIndex) => (
              <CharBox
                key={charOffsets[wordIndex] + charIndex}
                char={char}
                accent={wordObj.accent}
                textClassName={textClassName}
                flipTextClassName={flipTextClassName}
                rotateDirection={rotateDirection}
              />
            ))}
            {wordObj.needsSpace ? (
              <span className="text-3d-flip__space"> </span>
            ) : null}
          </span>
          {wordObj.breakAfter ? (
            <span className="text-3d-flip__break" aria-hidden="true" />
          ) : null}
        </span>
      ))}
    </ElementTag>
  );
}

export default Text3DFlip;
