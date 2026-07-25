import "./SkillItem.css";

function textColorHex() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--color-text")
    .trim()
    .replace("#", "");
}

function SkillItem({ skill }) {
  const { name, category, color, icon, learningPercent, type } = skill;
  const isLearning = type === "learning";
  const iconColor = (color || textColorHex()).replace("#", "");
  const iconUrl = icon
    ? `https://cdn.simpleicons.org/${icon}/${iconColor}`
    : null;

  return (
    <li className="skill-item">
      {iconUrl ? (
        <img
          className="skill-item__icon"
          src={iconUrl}
          alt=""
          width="20"
          height="20"
          loading="lazy"
        />
      ) : (
        <span
          className="skill-item__swatch"
          style={{ background: color || "var(--color-accent)" }}
          aria-hidden="true"
        />
      )}
      <div className="skill-item__copy">
        <p className="skill-item__name">{name}</p>
        {category ? <p className="skill-item__category">{category}</p> : null}
      </div>
      {isLearning && learningPercent != null ? (
        <span className="skill-item__level">{learningPercent}%</span>
      ) : null}
    </li>
  );
}

export default SkillItem;
