import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import "./TextReveal.css";

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className="text-reveal__word">
      <span className="text-reveal__ghost" aria-hidden="true">
        {children}
      </span>
      <motion.span className="text-reveal__fill" style={{ opacity }}>
        {children}
      </motion.span>
    </span>
  );
}

function TextReveal({
  children,
  as: ElementTag = "p",
  className = "",
  containerRef,
  offset = ["start 0.9", "start 0.35"],
}) {
  const localRef = useRef(null);
  const targetRef = containerRef || localRef;

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset,
  });

  if (typeof children !== "string") {
    console.warn("[TextReveal] children must be a string.");
    return null;
  }

  const words = children.trim().split(/\s+/).filter(Boolean);

  return (
    <ElementTag
      ref={containerRef ? undefined : localRef}
      className={`text-reveal${className ? ` ${className}` : ""}`}
    >
      <span className="text-reveal__sr">{children}</span>
      <span className="text-reveal__line" aria-hidden="true">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return (
            <Word key={`${word}-${i}`} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
          );
        })}
      </span>
    </ElementTag>
  );
}

export default TextReveal;
