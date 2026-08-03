import { useState } from "react";
import { Expand, X } from "lucide-react";
import { mediaUrl } from "../../utils/mediaUrl";
import "./ProjectGallery.css";

function ProjectGallery({ gallery = [], labels }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const images = gallery.filter(Boolean);
  if (!images.length) return null;

  const current = images[active] || images[0];
  const currentSrc = mediaUrl(current.src);

  return (
    <section className="pd-gallery" aria-label={labels.gallery}>
      <div className="pd-gallery__head">
        <h2>{labels.gallery || "Gallery"}</h2>
        <button
          type="button"
          className="pd-gallery__lightbox-btn"
          onClick={() => setLightbox(true)}
        >
          <Expand size={15} />
          {labels.lightbox || "Open lightbox"}
        </button>
      </div>

      <div className="pd-gallery__preview">
        <img
          src={currentSrc}
          alt={current.alt || ""}
          loading={active === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      </div>

      <div className="pd-gallery__grid">
        {images.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            className={`pd-gallery__thumb${active === index ? " is-active" : ""}`}
            onClick={() => setActive(index)}
            aria-label={`Show image ${index + 1}`}
          >
            <img src={mediaUrl(image.src)} alt="" loading="lazy" />
          </button>
        ))}
      </div>

      {lightbox ? (
        <div className="pd-gallery__modal" role="dialog" aria-modal="true">
          <button
            type="button"
            className="pd-gallery__modal-backdrop"
            aria-label="Close"
            onClick={() => setLightbox(false)}
          />
          <div className="pd-gallery__modal-panel">
            <button
              type="button"
              className="pd-gallery__modal-close"
              aria-label="Close"
              onClick={() => setLightbox(false)}
            >
              <X size={18} />
            </button>
            <img src={currentSrc} alt={current.alt || ""} />
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default ProjectGallery;
