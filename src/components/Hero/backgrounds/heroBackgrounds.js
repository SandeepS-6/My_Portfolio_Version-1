/*
  Landing Page references — try one at a time.
  "default" = original hero (copy + skill badges, no 3D).
  "floating-lines" = React Bits lines + recruiter copy (no skill badges).
*/
export const ACTIVE_HERO_BACKGROUND = "floating-lines";

export const HERO_BACKGROUND_IDS = [
  "default",
  "floating-lines",
  "moon",
  "forest",
  "galaxy",
  "drg",
  "matrix",
  "rays",
  "vex",
];

export function isDefaultHeroBackground() {
  return ACTIVE_HERO_BACKGROUND === "default";
}

export function showsHeroCopy() {
  return (
    ACTIVE_HERO_BACKGROUND === "default" ||
    ACTIVE_HERO_BACKGROUND === "floating-lines"
  );
}

export function showsSkillBadges() {
  return ACTIVE_HERO_BACKGROUND === "default";
}

export function isDarkHeroStage() {
  return ACTIVE_HERO_BACKGROUND === "floating-lines";
}
