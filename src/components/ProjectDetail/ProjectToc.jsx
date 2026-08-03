import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronDown, List, X } from "lucide-react";
import { CASE_SECTIONS, scrollToSection } from "../../utils/ProjectDetail/caseStudyNav";
import ProjectSwitcher from "./ProjectSwitcher";
import "./ProjectToc.css";
import "./ProjectInfoPanel.css";

function ProjectToc({
  activeId,
  open,
  onToggle,
  project,
  projects = [],
  prev,
  next,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);
  const isOpen = open ?? mobileOpen;
  const setOpen = onToggle || setMobileOpen;
  const activeLabel =
    CASE_SECTIONS.find((section) => section.id === activeId)?.label ||
    "Overview";

  useEffect(() => {
    setSwitchOpen(false);
  }, [project?.id]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setSwitchOpen(false);

    function onKey(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  function onSelect(id) {
    scrollToSection(id);
    setOpen(false);
  }

  function toggleSwitch() {
    setSwitchOpen((value) => !value);
    setOpen(false);
  }

  return (
    <div className="pd-toc-slot">
      <div className={`pd-toc-mobile${switchOpen ? " is-switch-open" : ""}`}>
        <div className="pd-toc-mobile__chrome">
          <div className="pd-toc-mobile__bar">
            <div className="pd-toc-mobile__label">
              <span className="pd-toc-mobile__eyebrow">On this page</span>
              <span className="pd-toc-mobile__current">{activeLabel}</span>
            </div>

            <button
              type="button"
              className="pd-toc-mobile__menu"
              aria-expanded={isOpen}
              aria-controls="pd-toc-drawer"
              aria-label={isOpen ? "Close contents" : "Open contents"}
              onClick={() => {
                setOpen(!isOpen);
                setSwitchOpen(false);
              }}
            >
              {isOpen ? <X size={18} /> : <List size={18} />}
            </button>
          </div>

          {project ? (
            <div
              id="pd-project-switch"
              className={`pd-toc-mobile__sub${switchOpen ? " is-open" : ""}`}
              aria-hidden={!switchOpen}
            >
              <div className="pd-toc-mobile__sub-inner">
                <ProjectSwitcher
                  project={project}
                  projects={projects}
                  prev={prev}
                  next={next}
                />
              </div>
            </div>
          ) : null}

          {project ? (
            <button
              type="button"
              className={`pd-toc-mobile__pull${switchOpen ? " is-open" : ""}`}
              aria-expanded={switchOpen}
              aria-controls="pd-project-switch"
              aria-label={
                switchOpen ? "Close project switcher" : "Switch project"
              }
              onClick={toggleSwitch}
            >
              <span className="pd-toc-mobile__pull-grip" aria-hidden="true" />
              <ChevronDown size={13} strokeWidth={2.6} aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div
          className={`pd-toc-mobile__scrim${isOpen ? " is-open" : ""}`}
          aria-hidden={!isOpen}
          onClick={() => setOpen(false)}
        />

        <aside
          id="pd-toc-drawer"
          className={`pd-toc-mobile__drawer${isOpen ? " is-open" : ""}`}
          aria-label="Table of contents"
          aria-hidden={!isOpen}
        >
          <div className="pd-toc-mobile__drawer-head">
            <p className="pd-toc__eyebrow">Contents</p>
            <button
              type="button"
              className="pd-toc-mobile__close"
              aria-label="Close contents"
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
          <TocList activeId={activeId} onSelect={onSelect} />
        </aside>
      </div>

      <aside className="pd-toc" aria-label="Table of contents">
        <p className="pd-toc__eyebrow">Contents</p>
        <TocList activeId={activeId} onSelect={onSelect} />
      </aside>
    </div>
  );
}

function TocList({ activeId, onSelect }) {
  const listRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector(".pd-toc__link.is-active");
    if (!active) return;
    setOffset(active.offsetTop + active.offsetHeight / 2 - 10);
  }, [activeId]);

  return (
    <ul className="pd-toc__list" ref={listRef}>
      <span
        className="pd-toc__indicator"
        style={{ transform: `translateY(${offset}px)` }}
        aria-hidden="true"
      />
      {CASE_SECTIONS.map((section) => {
        const active = activeId === section.id;
        return (
          <li key={section.id}>
            <button
              type="button"
              className={`pd-toc__link${active ? " is-active" : ""}`}
              aria-current={active ? "true" : undefined}
              onClick={() => onSelect(section.id)}
            >
              {section.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default ProjectToc;
