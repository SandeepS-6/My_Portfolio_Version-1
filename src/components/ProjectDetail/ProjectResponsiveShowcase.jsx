import { mediaUrl } from "../../utils/mediaUrl";

function ProjectResponsiveShowcase({ showcase = {} }) {
  const frames = [
    { key: "desktop", label: "Desktop", image: showcase.desktop, ratio: "16 / 10" },
    { key: "tablet", label: "Tablet", image: showcase.tablet, ratio: "4 / 3" },
    { key: "mobile", label: "Mobile", image: showcase.mobile, ratio: "9 / 16" },
  ].filter((frame) => frame.image?.src);

  if (!frames.length) return null;

  return (
    <section
      id="responsive"
      className="pd-showcase"
      aria-label="Responsive showcase"
    >
      <h2>Responsive Design</h2>
      <p className="pd-showcase__lead">
        Desktop, tablet, and mobile — same hierarchy, adapted for each screen.
      </p>
      <div className="pd-showcase__grid">
        {frames.map((frame) => (
          <figure
            key={frame.key}
            className={`pd-showcase__frame pd-showcase__frame--${frame.key}`}
          >
            <div
              className="pd-showcase__screen"
              style={{ aspectRatio: frame.ratio }}
            >
              <img
                src={mediaUrl(frame.image.src)}
                alt={frame.image.alt || frame.label}
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption>{frame.label}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export default ProjectResponsiveShowcase;
