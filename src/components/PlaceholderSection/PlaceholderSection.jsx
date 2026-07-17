import "./PlaceholderSection.css";

function PlaceholderSection({ code = "404", title, note }) {
  return (
    <section className="placeholder-section" aria-label={title}>
      <p className="placeholder-section__code">{code}</p>
      <h2 className="placeholder-section__title">{title}</h2>
      <p className="placeholder-section__note">
        {note || "Section under development. This will later be replaced with CMS-driven content."}
      </p>
    </section>
  );
}

export default PlaceholderSection;
