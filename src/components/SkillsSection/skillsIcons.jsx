import {
  Boxes,
  CodeXml,
  Gamepad2,
  Globe,
  Heart,
  Layers,
  Music,
  Rocket,
  Settings,
  Sparkles,
  Star,
} from "lucide-react";
import { BookIcon } from "./BookIcon";
import { CricketIcon } from "./CricketIcon";
import { WalksIcon } from "./WalksIcon";

const ICONS = {
  code: CodeXml,
  rocket: Rocket,
  star: Star,
  frontend: CodeXml,
  backend: Boxes,
  database: Layers,
  cloud: Globe,
  tools: Settings,
  sparkles: Sparkles,
  heart: Heart,
  cricket: CricketIcon,
  gaming: Gamepad2,
  books: BookIcon,
  music: Music,
  walks: WalksIcon,
};

export function SkillsIcon({ name, size = 22, className = "" }) {
  const Icon = ICONS[name] || CodeXml;

  return (
    <span className={`skills-icon${className ? ` ${className}` : ""}`} aria-hidden="true">
      <Icon size={size} strokeWidth={1.75} />
    </span>
  );
}
