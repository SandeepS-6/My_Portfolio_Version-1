import FloatingLines from "./FloatingLines";

/* Brand orange on dark stage — no pure white stops (was washing out copy) */
const THEME_LINES = ["#f17a32", "#e08a4a", "#c4b5a0", "#6a6a76"];
const ENABLED_WAVES = ["top", "middle", "bottom"];
const LINE_COUNT = [3, 5, 6];
const LINE_DISTANCE = [10, 7, 5];
/* Fewer fragment loops on phones — biggest FPS win for this shader */
const LINE_COUNT_MOBILE = [2, 3, 3];

function isMobileHeroPerf() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
}

function FloatingLinesBackground() {
  const mobile = isMobileHeroPerf();

  return (
    <div className="hero-bg hero-bg--lines" aria-hidden="true">
      <FloatingLines
        linesGradient={THEME_LINES}
        enabledWaves={ENABLED_WAVES}
        lineCount={mobile ? LINE_COUNT_MOBILE : LINE_COUNT}
        lineDistance={LINE_DISTANCE}
        bendRadius={5}
        bendStrength={-0.5}
        interactive={!mobile}
        parallax={false}
        animationSpeed={mobile ? 0.55 : 0.85}
        mixBlendMode={mobile ? "normal" : "screen"}
      />
    </div>
  );
}

export default FloatingLinesBackground;
