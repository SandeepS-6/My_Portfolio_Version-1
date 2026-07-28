import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProjects } from "../../services/projects";
import ProjectFilters from "./ProjectFilters";
import ProjectItem from "./ProjectItem";
import ProjectsIntro from "./ProjectsIntro";
import HiddenProjectsEgg from "./HiddenProjectsEgg";
import { countByStatus, filterAndSortProjects } from "./projectFilter";
import {
  getProjectQuery,
  setProjectQuery,
  subscribeProjectQuery,
} from "./projectSearchBus";
import {
  filterIn,
  filterOut,
  revealCards,
  revealProgressBars,
} from "./projectsMotion";
import "./ProjectsSection.css";

function ProjectsSection() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState(getProjectQuery);
  const [sort, setSort] = useState("latest");
  const [visible, setVisible] = useState([]);

  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const firstPaint = useRef(true);
  const filterRun = useRef(0);

  useEffect(() => subscribeProjectQuery(setQuery), []);

  function updateQuery(next) {
    setProjectQuery(next);
  }

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

  // Skills category arrows land here with ?q=...&status=all#projects
  useEffect(() => {
    const nextQuery = searchParams.get("q");
    const nextStatus = searchParams.get("status");

    if (nextQuery != null) setProjectQuery(nextQuery);
    if (nextStatus === "all" || nextStatus === "live" || nextStatus === "building") {
      setStatus(nextStatus);
    } else if (nextQuery != null) {
      setStatus("all");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!data) return;
    if (searchParams.get("q") == null && window.location.hash !== "#projects") {
      return;
    }

    const timer = window.setTimeout(() => {
      document.getElementById("projects")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [data, searchParams]);

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

    const clearCards =
      filterRun.current === 0
        ? revealCards(cards, grid)
        : (() => {
            filterIn(cards);
            return () => {};
          })();

    const clearBars =
      filterRun.current === 0
        ? revealProgressBars(bars, { trigger: grid })
        : revealProgressBars(bars, { immediate: true });

    return () => {
      clearCards();
      clearBars();
    };
  }, [visible]);

  if (!data) {
    return (
      <section className="projects" id="projects-panel" aria-label="Projects" aria-busy="true">
        <div className="projects__inner">
          <p className="projects__loading">Loading projects…</p>
        </div>
      </section>
    );
  }

  const {
    labels = {},
    kinds = [],
    projects = [],
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
          onQuery={updateQuery}
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
