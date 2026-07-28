import FloatingLines from "./FloatingLines";

/* Brand orange on dark stage — no pure white stops (was washing out copy) */
const THEME_LINES = ["#f17a32", "#e08a4a", "#c4b5a0", "#6a6a76"];
const ENABLED_WAVES = ["top", "middle", "bottom"];
const LINE_COUNT = [3, 5, 6];
const LINE_DISTANCE = [10, 7, 5];

function FloatingLinesBackground() {
  return (
    <div className="hero-bg hero-bg--lines" aria-hidden="true">
      <FloatingLines
        linesGradient={THEME_LINES}
        enabledWaves={ENABLED_WAVES}
        lineCount={LINE_COUNT}
        lineDistance={LINE_DISTANCE}
        bendRadius={5}
        bendStrength={-0.5}
        interactive
        parallax={false}
        animationSpeed={0.85}
        mixBlendMode="screen"
      />
    </div>
  );
}

export default FloatingLinesBackground;
