import "./AboutEducation.css";

function AboutEducation({ about }) {
  const { educationTitle, education = [] } = about;
  if (!education.length) return null;

  return (
    <div className="about-education">
      {educationTitle ? (
        <h3 className="about-education__title">{educationTitle}</h3>
      ) : null}

      <ul className="about-education__list">
        {education.map((entry) => (
          <li key={entry.id} className="about-education__item">
            <header className="about-education__header">
              <div>
                <p className="about-education__degree">{entry.degree}</p>
                <p className="about-education__school">{entry.school}</p>
              </div>
              {entry.period ? (
                <p className="about-education__period">{entry.period}</p>
              ) : null}
            </header>
            {entry.detail ? (
              <p className="about-education__detail">{entry.detail}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AboutEducation;
