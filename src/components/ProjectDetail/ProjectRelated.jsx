import { Link } from "react-router-dom";
import TechStack from "../ProjectsSection/TechStack";
import { mediaUrl } from "../../utils/mediaUrl";
import "./ProjectRelated.css";

function ProjectRelated({ projects = [], labels }) {
  if (!projects.length) return null;

  return (
    <section className="pd-related" aria-label={labels.related} data-detail-block>
      <h2>{labels.related || "Related projects"}</h2>
      <div className="pd-related__track">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="pd-related__card"
          >
            <div className="pd-related__media">
              <img
                src={mediaUrl(project.image?.src)}
                alt={project.image?.alt || project.name}
                loading="lazy"
              />
            </div>
            <div className="pd-related__body">
              <h3>{project.name}</h3>
              <p>{project.shortDescription || project.description}</p>
              <TechStack
                items={project.techStack}
                label={labels.tech}
                limit={4}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default ProjectRelated;
