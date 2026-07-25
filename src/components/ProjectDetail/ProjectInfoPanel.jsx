import {
  Calendar,
  Clock,
  Eye,
  Monitor,
  RefreshCw,
  UserRound,
} from "lucide-react";
import ProjectActions from "./ProjectActions";
import ProjectSwitcher from "./ProjectSwitcher";
import "./ProjectInfoPanel.css";

function ProjectInfoPanel({
  project,
  labels,
  projects = [],
  prev,
  next,
  liked,
  bookmarked,
  likes,
  comments,
  onLike,
  onBookmark,
  onShare,
  onJumpComments,
}) {
  const meta = project.meta || {};
  const description =
    project.shortDescription || project.description || "";

  const rows = [
    { label: labels.role || "Role", value: project.role },
    { label: labels.duration || "Duration", value: project.duration },
    {
      label: "Timeline",
      value:
        project.from && project.to
          ? `${project.from} → ${project.to}`
          : null,
    },
    { label: "Platform", value: project.platform || "Web", Icon: Monitor },
    {
      label: "Client",
      value: project.clientType || "Personal",
      Icon: UserRound,
    },
    {
      label: "Published",
      value: meta.published,
      Icon: Calendar,
    },
    {
      label: "Updated",
      value: meta.updated,
      Icon: RefreshCw,
    },
  ];

  return (
    <aside className="pd-info" aria-label={labels.info || "Project info"}>
      <p className="pd-info__eyebrow">Project info</p>

      <ProjectSwitcher
        project={project}
        projects={projects}
        prev={prev}
        next={next}
      />

      {description ? (
        <p className="pd-info__desc">{description}</p>
      ) : null}

      <div className="pd-info__engage">
        <ProjectActions
          layout="stack"
          liked={liked}
          bookmarked={bookmarked}
          likes={likes ?? meta.likes}
          comments={comments}
          liveUrl={project.liveUrl}
          liveLabel={labels.live || "Live"}
          onLike={onLike}
          onBookmark={onBookmark}
          onShare={onShare}
          onJumpComments={onJumpComments}
        />
      </div>

      <dl className="pd-info__list">
        {rows.map((row) =>
          row.value ? (
            <div key={row.label} className="pd-info__row">
              <dt>
                {row.Icon ? <row.Icon size={13} aria-hidden="true" /> : null}
                {row.label}
              </dt>
              <dd>{row.value}</dd>
            </div>
          ) : null,
        )}
      </dl>

      <div className="pd-info__cta">
        {project.liveUrl ? (
          <a href={project.liveUrl} target="_blank" rel="noreferrer">
            {labels.live}
          </a>
        ) : null}
        {project.githubUrl ? (
          <a href={project.githubUrl} target="_blank" rel="noreferrer">
            {labels.github}
          </a>
        ) : null}
      </div>

      <div className="pd-info__footer" aria-label="Reading stats">
        <div className="pd-info__stat">
          <Clock size={14} aria-hidden="true" />
          <div>
            <p>Reading time</p>
            <strong>{meta.readingTime || "—"}</strong>
          </div>
        </div>
        <div className="pd-info__stat">
          <Eye size={14} aria-hidden="true" />
          <div>
            <p>Views</p>
            <strong>
              {meta.views?.toLocaleString?.() || meta.views || "—"}
            </strong>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default ProjectInfoPanel;
