import "./AboutSnapshot.css";

function AboutSnapshot({ about }) {
  const { labels = {}, snapshot = {} } = about;
  const { years, status, location, languages = [] } = snapshot;

  const items = [
    { label: labels.years, value: years },
    { label: labels.status, value: status },
    { label: labels.location, value: location },
    {
      label: labels.languages,
      value: languages.length ? languages.join(" · ") : "",
    },
  ].filter((item) => item.value);

  if (!items.length) return null;

  return (
    <dl className="about-snapshot">
      {items.map((item) => (
        <div className="about-snapshot__item" key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default AboutSnapshot;
