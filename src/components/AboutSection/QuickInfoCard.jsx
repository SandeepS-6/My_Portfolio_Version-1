import { FactIcon } from "./AboutIcons";
import "./QuickInfoCard.css";

export function InterestsGroup({ items = [], label = "Interests" }) {
  if (!items.length) return null;

  return (
    <div className="about-meta__group about-meta__group--interests">
      <p className="about-meta__label">{label}</p>
      <ul className="about-meta__tags">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function QuickInfoCard({
  status,
  experienceYears,
  phone,
  phoneHref,
  availability,
  interests,
}) {
  const facts = [
    status && {
      id: "status",
      label: "Status",
      value: status,
      tone: "accent",
    },
    availability && {
      id: "avail",
      label: "Availability",
      value: availability,
      tone: "ok",
    },
    experienceYears && {
      id: "experience",
      label: "Experience",
      value: experienceYears,
      tone: "muted",
    },
    phone && {
      id: "phone",
      label: "Mobile",
      value: phone,
      href: phoneHref,
      tone: "muted",
    },
  ].filter(Boolean);

  if (!facts.length && !interests?.length) return null;

  return (
    <div className="about-meta">
      {facts.length ? (
        <ul className="about-meta__facts" aria-label="Profile facts">
          {facts.map((fact) => (
            <li
              key={fact.id}
              className={`about-meta__fact about-meta__fact--${fact.tone}`}
            >
              <span className="about-meta__fact-top">
                <FactIcon type={fact.id} />
                <span className="about-meta__fact-label">{fact.label}</span>
              </span>
              {fact.href ? (
                <a className="about-meta__fact-value" href={fact.href}>
                  {fact.value}
                </a>
              ) : (
                <span className="about-meta__fact-value">{fact.value}</span>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      <InterestsGroup items={interests} />
    </div>
  );
}

export function StoryBlock({ paragraphs = [] }) {
  if (!paragraphs.length) return null;

  return (
    <div className="about-story">
      {paragraphs.map((text, index) => (
        <p key={`story-${index}`} className="about-story__p">
          {text}
        </p>
      ))}
    </div>
  );
}

export default QuickInfoCard;
