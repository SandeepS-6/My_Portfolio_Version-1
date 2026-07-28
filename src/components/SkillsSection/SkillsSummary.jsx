import { SkillsIcon } from "./skillsIcons";

const SERVICE_META = {
  responsive: { icon: "frontend", tone: "sky" },
  "svc-frontend": { icon: "code", tone: "blue" },
  "svc-fullstack": { icon: "backend", tone: "green" },
};

const HOBBY_ICONS = {
  "hob-cricket": "cricket",
  "hob-bgmi": "gaming",
  "hob-books": "books",
  "hob-music": "music",
  "hob-walks": "walks",
  cricket: "cricket",
  gaming: "gaming",
  gamepad: "gaming",
  books: "books",
  book: "books",
  music: "music",
  walks: "walks",
  walk: "walks",
};

function hobbyIcon(item) {
  const raw = item.icon || HOBBY_ICONS[item.id] || "heart";
  return HOBBY_ICONS[raw] || raw;
}

function isPhotographyHobby(item) {
  const text = `${item.id || ""} ${item.title || ""} ${item.detail || ""}`.toLowerCase();
  return /photo|camera|photograph/.test(text);
}

function SummaryCard({ cell, tone, icon, hobbies = false }) {
  const items = hobbies
    ? (cell.items || []).filter((item) => !isPhotographyHobby(item))
    : cell.items || [];

  return (
    <article className={`skills-card skills-card--${tone} skills-summary-card`}>
      <span className="skills-card__icon">
        <SkillsIcon name={icon} size={22} />
      </span>
      <h3 className="skills-card__title">{cell.title}</h3>
      {cell.detail ? <p className="skills-card__detail">{cell.detail}</p> : null}
      {items.length ? (
        <ul className={`skills-summary__list${hobbies ? " skills-summary__list--hobbies" : ""}`}>
          {items.map((item) => (
            <li key={item.id}>
              {hobbies ? (
                <p className="skills-summary__item-title">
                  <span
                    className={`skills-summary__hobby-icon skills-summary__hobby-icon--${hobbyIcon(item)}`}
                  >
                    <SkillsIcon name={hobbyIcon(item)} size={15} />
                  </span>
                  <span>{item.title}</span>
                </p>
              ) : (
                <p className="skills-summary__item-title">{item.title}</p>
              )}
              <p className="skills-summary__item-detail">{item.detail}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function SkillsSummary({ summary = {} }) {
  const grid = summary.grid || [];
  if (!grid.length) return null;

  return (
    <div className="skills__summary" data-skills-summary>
      <div className="skills__summary-grid">
        {grid.map((cell) => {
          if (cell.type === "hobbies") {
            return (
              <SummaryCard
                key={cell.id}
                cell={cell}
                tone="rose"
                icon="heart"
                hobbies
              />
            );
          }

          const meta = SERVICE_META[cell.id] || {
            icon: "sparkles",
            tone: "violet",
          };

          return (
            <SummaryCard
              key={cell.id}
              cell={cell}
              tone={meta.tone}
              icon={meta.icon}
            />
          );
        })}
      </div>
    </div>
  );
}

export default SkillsSummary;
