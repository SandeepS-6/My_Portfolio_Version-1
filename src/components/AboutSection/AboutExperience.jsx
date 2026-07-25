import "./AboutExperience.css";

function AboutExperience({ about }) {
  const { experienceTitle, experience = [] } = about;
  if (!experience.length) return null;

  return (
    <div className="about-experience">
      {experienceTitle ? (
        <h3 className="about-experience__title">{experienceTitle}</h3>
      ) : null}

      <ol className="about-experience__list">
        {experience.map((entry) => (
          <li key={entry.id} className="about-experience__item">
            <div className="about-experience__body">
              <header className="about-experience__header">
                <div>
                  <p className="about-experience__role">{entry.role}</p>
                  <p className="about-experience__company">{entry.company}</p>
                </div>
                <div className="about-experience__meta">
                  <p className="about-experience__period">{entry.period}</p>
                  {entry.location ? (
                    <p className="about-experience__place">{entry.location}</p>
                  ) : null}
                </div>
              </header>

              {entry.summary ? (
                <p className="about-experience__summary">{entry.summary}</p>
              ) : null}

              {entry.highlights?.length ? (
                <ul className="about-experience__highlights">
                  {entry.highlights.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default AboutExperience;
