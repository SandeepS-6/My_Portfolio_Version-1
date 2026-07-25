import { Heart, LayoutTemplate, Wrench } from "lucide-react";
import "./ProjectSummary.css";

const SERVICE_ICONS = {
  responsive: LayoutTemplate,
  "svc-frontend": Wrench,
  "svc-fullstack": Wrench,
};

function ProjectSummary({ bottom = {} }) {
  const grid = bottom.grid || [];

  if (!grid.length) return null;

  return (
    <div className="project-summary" data-project-summary>
      <div className="project-summary__grid">
        {grid.map((cell) => {
          if (cell.type === "hobbies") {
            return (
              <article
                key={cell.id}
                className="project-summary__card project-summary__card--hobbies"
                data-summary-block
              >
                <h3 className="project-summary__heading">
                  <Heart size={16} aria-hidden="true" />
                  {cell.title}
                </h3>
                <ul className="project-summary__hobbies">
                  {(cell.items || []).map((item) => (
                    <li key={item.id}>
                      <p className="project-summary__title">{item.title}</p>
                      <p className="project-summary__detail">{item.detail}</p>
                    </li>
                  ))}
                </ul>
              </article>
            );
          }

          const Icon = SERVICE_ICONS[cell.id] || Wrench;

          return (
            <article
              key={cell.id}
              className="project-summary__card project-summary__card--service"
              data-summary-block
            >
              <h3 className="project-summary__heading">
                <Icon size={16} aria-hidden="true" />
                {cell.title}
              </h3>
              <p className="project-summary__detail">{cell.detail}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default ProjectSummary;
