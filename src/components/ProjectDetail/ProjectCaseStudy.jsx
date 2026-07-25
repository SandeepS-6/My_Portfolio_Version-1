import { Link } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
import { kindTone } from "../ProjectsSection/projectFilter";
import TechStack from "../ProjectsSection/TechStack";
import ProjectGallery from "./ProjectGallery";
import ProjectResponsiveShowcase from "./ProjectResponsiveShowcase";
import ProjectComments from "./ProjectComments";
import ProjectRelated from "./ProjectRelated";
import "./ProjectCaseStudy.css";
import "./ProjectResponsiveShowcase.css";

function Section({ id, title, children }) {
  return (
    <section id={id} className="pd-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function ProjectCaseStudy({
  project,
  labels,
  kinds = [],
  related = [],
  comments,
  commentSort,
  onCommentSort,
  commentDraft,
  onCommentDraft,
  onCommentSubmit,
  commentPage,
  onCommentPage,
}) {
  const study = project.caseStudy || {};
  const meta = project.meta || {};
  const primaryKind = project.featured
    ? "featured"
    : (project.kinds || [])[0] || "production";
  const tone = kindTone(primaryKind);
  const kindLabel =
    kinds.find((item) => item.id === primaryKind)?.label || primaryKind;
  const views = meta.views?.toLocaleString?.() || meta.views;

  return (
    <div className="pd-case">
      <Link to="/#projects" className="pd-case__back">
        <ArrowLeft size={15} />
        {labels.back || "Back to projects"}
      </Link>

      <div className="pd-case__cover">
        <img
          src={project.image?.src}
          alt={project.image?.alt || project.name}
          fetchPriority="high"
          decoding="async"
        />
        {views ? (
          <p className="pd-case__views" aria-label={`${views} views`}>
            <Eye size={13} aria-hidden="true" />
            <span>{views}</span>
          </p>
        ) : null}
      </div>

      <TechStack items={project.techStack} label={labels.tech} />

      <header className="pd-case__intro">
        <p className={`pd-case__kind pd-case__kind--${tone}`}>{kindLabel}</p>
        <h1>{project.name}</h1>
        <p className="pd-case__lead">
          {project.shortDescription || project.description}
        </p>
      </header>

      {study.summary ? (
        <p className="pd-case__summary">{study.summary}</p>
      ) : null}

      <Section id="overview" title="Overview">
        <p>{study.overview}</p>
      </Section>

      <Section id="problem" title="Problem">
        <p>{study.problem}</p>
      </Section>

      <Section id="research" title="Research">
        <p>{study.research}</p>
      </Section>

      <Section id="planning" title="Planning">
        <p>{study.planning}</p>
      </Section>

      <Section id="ui-design" title="UI Design">
        <p>{study.uiDesign}</p>
      </Section>

      <Section id="development" title="Development">
        <p>{study.development}</p>
      </Section>

      <Section id="challenges" title="Challenges">
        <ul className="pd-case__bullets">
          {(study.challenges || []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section id="solution" title="Solution">
        <p>{study.solution}</p>
        {(study.learnings || []).length > 0 ? (
          <div className="pd-case__learnings">
            <h3>Key learnings</h3>
            <ul className="pd-case__bullets">
              {study.learnings.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </Section>

      <Section id="results" title="Results">
        <p>{study.results}</p>
        {(project.metrics || []).length > 0 ? (
          <div className="pd-case__metrics">
            {project.metrics.map((metric) => (
              <article key={metric.label}>
                <p className="pd-case__metric-value">{metric.value}</p>
                <p className="pd-case__metric-label">{metric.label}</p>
              </article>
            ))}
          </div>
        ) : null}
      </Section>

      <ProjectResponsiveShowcase showcase={project.showcase} />

      <div id="gallery">
        <ProjectGallery gallery={project.gallery} labels={labels} />
      </div>

      <Section id="future" title="Future Improvements">
        <ul className="pd-case__bullets">
          {(study.future || []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <ProjectRelated projects={related} labels={labels} />

      <ProjectComments
        comments={comments}
        sort={commentSort}
        onSort={onCommentSort}
        draft={commentDraft}
        onDraft={onCommentDraft}
        onSubmit={onCommentSubmit}
        page={commentPage}
        onPage={onCommentPage}
      />
    </div>
  );
}

export default ProjectCaseStudy;
