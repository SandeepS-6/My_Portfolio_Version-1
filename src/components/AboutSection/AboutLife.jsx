import "./AboutLife.css";

function LifeGroup({ title, items = [], featured = false }) {
  if (!items.length) return null;

  return (
    <div
      className={
        featured ? "about-life__group about-life__group--featured" : "about-life__group"
      }
    >
      {title ? <h4 className="about-life__group-title">{title}</h4> : null}
      <ul className="about-life__cards">
        {items.map((item) => (
          <li
            key={item.id}
            className={
              featured ? "about-life__card about-life__card--featured" : "about-life__card"
            }
          >
            <p className="about-life__card-title">{item.title}</p>
            {item.detail ? (
              <p className="about-life__card-detail">{item.detail}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AboutLife({ about }) {
  const {
    lifeTitle,
    hobbiesTitle,
    hobbies = [],
    interestsTitle,
    interests = [],
    valuesTitle,
    values = [],
  } = about;

  if (![hobbies, interests, values].some((list) => list.length)) return null;

  return (
    <div className="about-life">
      {lifeTitle ? <h3 className="about-life__title">{lifeTitle}</h3> : null}

      <div className="about-life__stack">
        <div className="about-life__row">
          <LifeGroup title={hobbiesTitle} items={hobbies} />
          <LifeGroup title={interestsTitle} items={interests} />
        </div>
        <LifeGroup title={valuesTitle} items={values} featured />
      </div>
    </div>
  );
}

export default AboutLife;
