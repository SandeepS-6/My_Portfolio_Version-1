import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { mediaUrl } from "../../utils/mediaUrl";
import "./ProjectNav.css";

function NavCard({ project, labels, direction }) {
  if (!project) return null;
  const isPrev = direction === "prev";

  return (
    <Link
      to={`/projects/${project.id}`}
      className={`pd-nav__card pd-nav__card--${direction}`}
    >
      <div className="pd-nav__media">
        <img
          src={mediaUrl(project.image?.src)}
          alt={project.image?.alt || project.name}
          loading="lazy"
        />
      </div>
      <div className="pd-nav__body">
        <p className="pd-nav__label">
          {isPrev ? (
            <>
              <ArrowLeft size={14} className="pd-nav__arrow" />
              {labels.prevProject || "Previous project"}
            </>
          ) : (
            <>
              {labels.nextProject || "Next project"}
              <ArrowRight size={14} className="pd-nav__arrow" />
            </>
          )}
        </p>
        <h3>{project.name}</h3>
        <p className="pd-nav__category">{project.category}</p>
        <p className="pd-nav__desc">
          {project.shortDescription || project.description}
        </p>
      </div>
    </Link>
  );
}

function ProjectNav({ prev, next, labels }) {
  return (
    <nav className="pd-nav" aria-label="Project navigation" data-detail-block>
      <NavCard project={prev} labels={labels} direction="prev" />
      <NavCard project={next} labels={labels} direction="next" />
    </nav>
  );
}

export default ProjectNav;
