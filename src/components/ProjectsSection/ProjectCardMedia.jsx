import { useEffect, useRef, useState } from "react";
import { mediaUrl } from "../../utils/mediaUrl";
import {
  CARD_IMAGE_MS,
  nextCardImageIndex,
  prefersReducedMotion,
  resolveCardImages,
} from "./cardMedia";

function ProjectCardMedia({ project, name }) {
  const images = resolveCardImages(project);
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const inView = useRef(false);

  useEffect(() => {
    setActive(0);
  }, [project?.id]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || images.length <= 1) return undefined;
    if (prefersReducedMotion()) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting && entry.intersectionRatio >= 0.35;
      },
      { threshold: [0.35] },
    );
    observer.observe(root);

    const timer = window.setInterval(() => {
      if (!inView.current) return;
      setActive((prev) => nextCardImageIndex(prev, images.length));
    }, CARD_IMAGE_MS);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [images.length, project?.id]);

  if (images.length === 0) {
    return <div ref={rootRef} className="project-item__media" aria-hidden="true" />;
  }

  return (
    <div
      ref={rootRef}
      className="project-item__media"
      aria-roledescription={images.length > 1 ? "image carousel" : undefined}
    >
      {images.map((image, index) => (
        <img
          key={image.src}
          className={`project-item__image${index === active ? " is-active" : ""}`}
          src={mediaUrl(image.src)}
          alt={image.alt || name}
          loading={index === 0 ? "lazy" : "lazy"}
          decoding="async"
        />
      ))}

      {images.length > 1 ? (
        <div className="project-item__dots" aria-hidden="true">
          {images.map((image, index) => (
            <span
              key={`dot-${image.src}`}
              className={`project-item__dot${index === active ? " is-active" : ""}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ProjectCardMedia;
