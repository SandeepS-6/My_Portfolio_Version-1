import "./TimelineItem.css";

function TimelineItem({
  icon,
  title,
  subtitle,
  meta,
  detail,
  tags,
  logoText,
  order = 0,
  showLine = true,
}) {
  return (
    <li className="about-tl__item" data-order={order}>
      <span className="about-tl__rail" aria-hidden="true">
        <span className="about-tl__dot">{icon}</span>
        {showLine ? (
          <span className="about-tl__line">
            <span className="about-tl__line-fill" />
          </span>
        ) : null}
      </span>

      <article className="about-tl__card">
        <header className="about-tl__head">
          {logoText ? (
            <span className="about-tl__logo" aria-hidden="true">
              {logoText}
            </span>
          ) : null}
          <div className="about-tl__titles">
            <h4 className="about-tl__title">{title}</h4>
            {subtitle ? <p className="about-tl__subtitle">{subtitle}</p> : null}
          </div>
          {meta ? <p className="about-tl__meta">{meta}</p> : null}
        </header>

        {detail ? <p className="about-tl__detail">{detail}</p> : null}

        {tags?.length ? (
          <ul className="about-tl__tags">
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
      </article>
    </li>
  );
}

export default TimelineItem;
