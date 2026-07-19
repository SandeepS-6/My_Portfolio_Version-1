import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const DESKTOP_POINTER_QUERY = "(any-hover: hover) and (any-pointer: fine)";

function isMousePointer(event) {
  return event.pointerType === "mouse" || event.pointerType === "";
}

function DefaultCursorSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={50}
      height={54}
      viewBox="0 0 50 54"
      fill="none"
      style={{ scale: 0.5 }}
      aria-hidden="true"
    >
      <g filter="url(#filter0_d_91_7928)">
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill="black"
        />
        <path
          d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
          stroke="white"
          strokeWidth={2.25825}
        />
      </g>
      <defs>
        <filter
          id="filter0_d_91_7928"
          x={0.602397}
          y={0.952444}
          width={49.0584}
          height={52.428}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={2.25825} />
          <feGaussianBlur stdDeviation={2.25825} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_91_7928"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_91_7928"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}

function snap(motionValue, value) {
  if (typeof motionValue.jump === "function") {
    motionValue.jump(value);
  } else {
    motionValue.set(value);
  }
}

/*
  Mounted from app start so we always know the real mouse position.
  Paints only when `active` — forced to clientX/clientY (never top-left 0,0).
*/
export function SmoothCursor({
  cursor = <DefaultCursorSVG />,
  active = false,
  springConfig = {
    damping: 45,
    stiffness: 400,
    mass: 1,
    restDelta: 0.001,
  },
}) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [readyToPaint, setReadyToPaint] = useState(false);

  const lastPos = useRef(null);
  const velocity = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);
  const prevAngle = useRef(0);
  const accumulatedRotation = useRef(0);
  const activeRef = useRef(active);
  activeRef.current = active;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  const rotation = useSpring(0, {
    ...springConfig,
    damping: 60,
    stiffness: 300,
  });
  const scale = useSpring(1, {
    ...springConfig,
    stiffness: 500,
    damping: 35,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_POINTER_QUERY);
    const sync = () => setIsDesktop(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  // Track real pointer from the first moment (even while loading / inactive)
  useEffect(() => {
    if (!isDesktop) return undefined;

    let moveRaf = 0;
    let scaleTimeout = null;
    let pending = null;

    function writePosition(x, y, immediate) {
      lastPos.current = { x, y };
      if (immediate) {
        snap(mouseX, x);
        snap(mouseY, y);
        snap(cursorX, x);
        snap(cursorY, y);
      } else {
        mouseX.set(x);
        mouseY.set(y);
      }
    }

    function onPointerMove(event) {
      if (!isMousePointer(event)) return;

      const x = event.clientX;
      const y = event.clientY;
      const now = performance.now();
      const dt = now - lastTime.current;

      if (dt > 0 && lastTime.current > 0 && lastPos.current) {
        velocity.current = {
          x: (x - lastPos.current.x) / dt,
          y: (y - lastPos.current.y) / dt,
        };
      }
      lastTime.current = now;
      pending = { x, y };

      if (moveRaf) return;
      moveRaf = requestAnimationFrame(() => {
        moveRaf = 0;
        if (!pending) return;

        const { x: px, y: py } = pending;
        pending = null;

        // Before visible: hard-snap so we never animate from (0,0)
        writePosition(px, py, !activeRef.current);

        if (!activeRef.current) return;

        const speed = Math.hypot(velocity.current.x, velocity.current.y);
        if (speed > 0.1) {
          const angle =
            Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) +
            90;
          let diff = angle - prevAngle.current;
          if (diff > 180) diff -= 360;
          if (diff < -180) diff += 360;
          accumulatedRotation.current += diff;
          prevAngle.current = angle;
          rotation.set(accumulatedRotation.current);
          scale.set(0.95);
          if (scaleTimeout) clearTimeout(scaleTimeout);
          scaleTimeout = setTimeout(() => scale.set(1), 150);
        }
      });
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (moveRaf) cancelAnimationFrame(moveRaf);
      if (scaleTimeout) clearTimeout(scaleTimeout);
    };
  }, [isDesktop, mouseX, mouseY, cursorX, cursorY, rotation, scale]);

  // Turn custom cursor on/off — always snap to live mouse first, then paint
  useEffect(() => {
    if (!isDesktop) return undefined;

    if (!active) {
      document.documentElement.classList.remove("has-custom-cursor");
      setReadyToPaint(false);
      return undefined;
    }

    const point = lastPos.current ?? {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    snap(mouseX, point.x);
    snap(mouseY, point.y);
    snap(cursorX, point.x);
    snap(cursorY, point.y);
    lastPos.current = point;

    document.documentElement.classList.add("has-custom-cursor");
    setReadyToPaint(true);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      setReadyToPaint(false);
    };
  }, [isDesktop, active, mouseX, mouseY, cursorX, cursorY]);

  if (!isDesktop || !active || !readyToPaint) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        rotate: rotation,
        scale,
        zIndex: 200,
        pointerEvents: "none",
        willChange: "transform",
      }}
    >
      {cursor}
    </motion.div>
  );
}

export default SmoothCursor;
