import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

function ProjectSwitcher({ project, projects = [], prev, next }) {
  const navigate = useNavigate();

  return (
    <div className="pd-info__switch-block">
      <p className="pd-info__switch-title">Switch project</p>
      <div className="pd-info__nav">
        <Link
          to={prev ? `/projects/${prev.id}` : "#"}
          className="pd-info__arrow"
          aria-label={prev ? `Previous: ${prev.name}` : "Previous project"}
          aria-disabled={!prev}
          onClick={(event) => {
            if (!prev) event.preventDefault();
          }}
        >
          <ChevronLeft size={18} />
        </Link>

        <label className="pd-info__select-wrap">
          <span className="visually-hidden">Switch project</span>
          <select
            className="pd-info__select"
            value={project.id}
            onChange={(event) => navigate(`/projects/${event.target.value}`)}
            aria-label="Select a project"
            title={project.name}
          >
            {projects.map((item) => (
              <option key={item.id} value={item.id} title={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <Link
          to={next ? `/projects/${next.id}` : "#"}
          className="pd-info__arrow"
          aria-label={next ? `Next: ${next.name}` : "Next project"}
          aria-disabled={!next}
          onClick={(event) => {
            if (!next) event.preventDefault();
          }}
        >
          <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
}

export default ProjectSwitcher;
