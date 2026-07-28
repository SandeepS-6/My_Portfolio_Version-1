import { ACTIVE_HERO_BACKGROUND } from "./heroBackgrounds";
import FloatingLinesBackground from "./FloatingLinesBackground";
import MoonBackground from "./MoonBackground";
import ForestBackground from "./ForestBackground";
import GalaxyBackground from "./GalaxyBackground";
import DrgBackground from "./DrgBackground";
import MatrixBackground from "./MatrixBackground";
import RaysBackground from "./RaysBackground";
import VexBackground from "./VexBackground";
import "./HeroBackground.css";

const BACKGROUNDS = {
  "floating-lines": FloatingLinesBackground,
  moon: MoonBackground,
  forest: ForestBackground,
  galaxy: GalaxyBackground,
  drg: DrgBackground,
  matrix: MatrixBackground,
  rays: RaysBackground,
  vex: VexBackground,
};

function HeroBackground() {
  const Scene = BACKGROUNDS[ACTIVE_HERO_BACKGROUND];
  if (!Scene) return null;
  return <Scene />;
}

export default HeroBackground;
