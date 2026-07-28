import "./AboutProfile.css";

function summaryParts(summary) {
  if (!summary) return [];
  if (Array.isArray(summary)) return summary.map((part) => String(part).trim()).filter(Boolean);
  return String(summary)
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function AboutProfile({ about }) {
  const { photo, name, jobTitle, intro, summary } = about;
  const paragraphs = summaryParts(summary);

  return (
    <div className="about-profile">
      <div className="about-profile__media">
        <img
          className="about-profile__photo"
          src={photo?.src}
          alt={photo?.alt || name}
          loading="lazy"
        />
      </div>

      <div className="about-profile__copy">
        <h3 className="about-profile__name">{name}</h3>
        <p className="about-profile__role">{jobTitle}</p>

        <div className="about-profile__rule" aria-hidden="true">
          <span className="about-profile__bead" />
          <span className="about-profile__line" />
          <span className="about-profile__bead" />
        </div>

        {intro ? <p className="about-profile__intro">{intro}</p> : null}
        {paragraphs.length > 0 ? (
          <div className="about-profile__summary">
            {paragraphs.map((part, index) => (
              <p key={index}>{part}</p>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default AboutProfile;
