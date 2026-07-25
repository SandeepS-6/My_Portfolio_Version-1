import "./AboutProfile.css";

function AboutProfile({ about }) {
  const { photo, name, jobTitle, intro, summary } = about;

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
        {summary ? <p className="about-profile__summary">{summary}</p> : null}
      </div>
    </div>
  );
}

export default AboutProfile;
