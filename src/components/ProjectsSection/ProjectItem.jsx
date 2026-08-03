import { Link } from "react-router-dom";
import { FileText, MonitorPlay } from "lucide-react";
import { GitHubIcon } from "./GitHubIcon";
import { prefetchProjectDetail } from "../../pages/prefetch";
import { kindTone } from "../../utils/ProjectsSection/projectFilter";
import ProjectCardMedia from "./ProjectCardMedia";
import TechStack from "./TechStack";
import "./ProjectItem.css";

function kindLabel(kindId, kinds = []) {
  return kinds.find((item) => item.id === kindId)?.label || kindId;
}

function ProjectItem({ project, labels, kinds = [] }) {
  const {
    id,
    name,
    description,
    techStack = [],
    kinds: projectKinds = [],
    progress,
    role,
    duration,
    from,
    to,
    githubUrl,
    liveUrl,
    caseStudyUrl,
    docsUrl,
    featured,
  } = project;

  const primaryKind = featured
    ? "featured"
    : projectKinds[0] || "production";
  const tone = kindTone(primaryKind);
  const showProgress =
    typeof progress === "number" && progress >= 0 && progress < 100;

  const timeline =
    from && to ? `${from} → ${to}` : from || to || duration || "";

  const links = [
    liveUrl
      ? {
          href: liveUrl,
          label: labels.live,
          Icon: MonitorPlay,
          tone: "live",
        }
      : null,
    githubUrl
      ? {
          href: githubUrl,
          label: labels.github,
          Icon: GitHubIcon,
          tone: "github",
        }
      : null,
    caseStudyUrl
      ? {
          href: caseStudyUrl,
          label: labels.caseStudy,
          Icon: FileText,
          tone: "case",
        }
      : null,
    docsUrl
      ? {
          href: docsUrl,
          label: labels.docs || "Docs",
          Icon: FileText,
          tone: "docs",
        }
      : null,
  ].filter(Boolean);

  return (
    <article
      className={`project-item${featured ? " project-item--featured" : ""}`}
      data-project-card
    >
      <Link
        to={`/projects/${id}`}
        className="project-item__media-link"
        onMouseEnter={prefetchProjectDetail}
        onFocus={prefetchProjectDetail}
      >
        <ProjectCardMedia project={project} name={name} />
        <p className={`project-item__status project-item__status--${tone}`}>
          <span className="project-item__status-dot" aria-hidden="true" />
          {kindLabel(primaryKind, kinds)}
        </p>
      </Link>

      <div className="project-item__body">
        <h3 className="project-item__name">
          <Link
            to={`/projects/${id}`}
            onMouseEnter={prefetchProjectDetail}
            onFocus={prefetchProjectDetail}
          >
            {name}
          </Link>
        </h3>

        {timeline || role ? (
          <p className="project-item__meta">
            {timeline ? <span>{timeline}</span> : null}
            {timeline && role ? <span aria-hidden="true"> · </span> : null}
            {role ? <span>{role}</span> : null}
          </p>
        ) : null}

        <p className="project-item__desc">{description}</p>

        <TechStack items={techStack} label={labels.tech} />

        {showProgress ? (
          <div className="project-item__progress">
            <div
              className="project-item__progress-track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-label={`${name} progress`}
            >
              <span
                className="project-item__progress-fill"
                data-progress={progress}
              />
            </div>
            <span className="project-item__progress-value">{progress}%</span>
          </div>
        ) : null}

        {links.length > 0 ? (
          <nav className="project-item__links" aria-label={`${name} links`}>
            {links.map((link) => {
              const Icon = link.Icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`project-item__link project-item__link--${link.tone}`}
                >
                  <Icon size={14} />
                  {link.label}
                </a>
              );
            })}
          </nav>
        ) : null}
      </div>
    </article>
  );
}

export default ProjectItem;
