import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getProjects } from "../../services/projects";
import ProjectFilters from "./ProjectFilters";
import ProjectItem from "./ProjectItem";
import ProjectsIntro from "./ProjectsIntro";
import ProjectSummary from "./ProjectSummary";
import HiddenProjectsEgg from "./HiddenProjectsEgg";
import { countByStatus, filterAndSortProjects } from "./projectFilter";
import {
  filterIn,
  filterOut,
  revealCards,
  revealProgressBars,
  revealSummary,
} from "./projectsMotion";
import "./ProjectsSection.css";

function ProjectsSection() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("latest");
  const [visible, setVisible] = useState([]);

  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const firstPaint = useRef(true);
  const filterRun = useRef(0);

  useEffect(() => {
    let alive = true;

    getProjects()
      .then((payload) => {
        if (alive) setData(payload);
      })
      .catch((error) => {
        console.warn("[projects] Failed to load projects.", error.message);
        if (alive) setData(null);
      });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!data) return;

    const next = filterAndSortProjects(data.projects || [], {
      status,
      query,
      sort,
    });

    if (firstPaint.current) {
      firstPaint.current = false;
      setVisible(next);
      return;
    }

    const run = ++filterRun.current;
    const cards = gridRef.current?.querySelectorAll("[data-project-card]");

    filterOut(cards).then(() => {
      if (run === filterRun.current) setVisible(next);
    });
  }, [data, status, query, sort]);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || visible.length === 0) return undefined;

    const cards = [...grid.querySelectorAll("[data-project-card]")];
    const bars = [...grid.querySelectorAll("[data-progress]")];
    const summaryNodes = [
      ...(sectionRef.current?.querySelectorAll("[data-summary-block]") || []),
    ];

    const clearCards =
      filterRun.current === 0
        ? revealCards(cards)
        : (() => {
            filterIn(cards);
            return () => {};
          })();
    const clearBars = revealProgressBars(bars);
    const clearSummary = revealSummary(summaryNodes);

    return () => {
      clearCards();
      clearBars();
      clearSummary();
    };
  }, [visible]);

  if (!data) return null;

  const {
    labels = {},
    kinds = [],
    projects = [],
    bottom = {},
    squircle = {},
    intro,
    hiddenProjects = [],
  } = data;

  const statusCounts = countByStatus(projects);
  const squircleOn = squircle.enabled !== false;
  const squircleRadius = squircle.radius || "1.35rem";

  return (
    <section
      ref={sectionRef}
      className="projects"
      aria-label="Projects"
      data-squircle={squircleOn ? "true" : "false"}
      style={{
        "--projects-squircle-radius": squircleRadius,
      }}
    >
      <div className="projects__inner">
        <ProjectsIntro intro={intro} />

        <ProjectFilters
          labels={labels}
          projects={projects}
          statusCounts={statusCounts}
          status={status}
          query={query}
          sort={sort}
          resultCount={visible.length}
          onStatus={setStatus}
          onQuery={setQuery}
          onSort={setSort}
        />

        <div ref={gridRef} className="projects__grid" aria-live="polite">
          {visible.length > 0 ? (
            visible.map((project) => (
              <ProjectItem
                key={project.id}
                project={project}
                labels={labels}
                kinds={kinds}
              />
            ))
          ) : (
            <div className="projects__empty-state">
              <p className="projects__empty">{labels.empty}</p>
              <p className="projects__empty-hint">{labels.emptyHint}</p>
            </div>
          )}
        </div>

        <ProjectSummary bottom={bottom} />
      </div>

      <HiddenProjectsEgg
        sectionRef={sectionRef}
        items={hiddenProjects}
        labels={labels}
      />
    </section>
  );
}

export default ProjectsSection;
