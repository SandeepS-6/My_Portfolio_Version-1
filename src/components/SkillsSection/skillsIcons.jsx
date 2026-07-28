import {
  Boxes,
  CodeXml,
  Globe,
  Heart,
  Layers,
  Rocket,
  Settings,
  Sparkles,
  Star,
} from "lucide-react";

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
};

export function SkillsIcon({ name, size = 22 }) {
  const Icon = ICONS[name] || CodeXml;

  return (
    <span className="skills-icon" aria-hidden="true">
      <Icon size={size} strokeWidth={1.75} />
    </span>
  );
}
