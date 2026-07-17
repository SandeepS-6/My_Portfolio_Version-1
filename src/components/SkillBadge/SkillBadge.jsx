import { forwardRef } from "react";
import "./SkillBadge.css";

/*
  Presentational only.
  Live position / drift / blur are applied by the animation loop.
*/

const SkillBadge = forwardRef(function SkillBadge({ skill }, ref) {
  const {
    title,
    icon,
    color,
    scale = 1,
    blur = 1.2,
    opacity = 0.7,
    zIndex = 1,
  } = skill;

  const iconColor = color.replace("#", "");
  const iconUrl = `https://cdn.simpleicons.org/${icon}/${iconColor}`;

  const style = {
    left: 0,
    top: 0,
    zIndex,
    opacity,
    transform: `translate(-50%, -50%) scale(${scale})`,
    filter: blur > 0 ? `blur(${blur}px)` : undefined,
  };

  return (
    <div className="skill-badge" ref={ref} style={style} title={title}>
      <img
        className="skill-badge__icon"
        src={iconUrl}
        alt=""
        width="16"
        height="16"
        loading="lazy"
      />
      <span className="skill-badge__title">{title}</span>
    </div>
  );
});

export default SkillBadge;
