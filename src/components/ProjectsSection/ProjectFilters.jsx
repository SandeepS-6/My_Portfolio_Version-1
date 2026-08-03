import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import Dropdown from "../Dropdown/Dropdown";
import { searchSuggestions } from "../../utils/ProjectsSection/projectFilter";
import "./ProjectFilters.css";

const RECENT_KEY = "portfolio-project-searches";
const MAX_RECENT = 5;

function readRecent() {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function writeRecent(term) {
  const value = term.trim();
  if (!value) return readRecent();
  const next = [value, ...readRecent().filter((item) => item !== value)].slice(
    0,
    MAX_RECENT,
  );
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
  return next;
}

function ProjectFilters({
  labels,
  projects = [],
  statusCounts = {},
  status,
  query,
  sort,
  onStatus,
  onQuery,
  onSort,
  resultCount = 0,
}) {
  const navigate = useNavigate();
  const listId = useId();
  const wrapRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    setRecent(readRecent());
  }, []);

  useEffect(() => {
    function onPointer(event) {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, []);

  const projectOptions = useMemo(
    () =>
      projects.map((project) => ({
        id: project.id,
        label: project.name,
        meta: project.category,
      })),
    [projects],
  );

  const statusOptions = [
    {
      id: "all",
      label: labels.statusAll || "All",
      count: statusCounts.all ?? 0,
    },
    {
      id: "live",
      label: labels.statusLive || "Live demos",
      count: statusCounts.live ?? 0,
    },
    {
      id: "building",
      label: labels.statusBuilding || "In progress",
      count: statusCounts.building ?? 0,
    },
  ];

  const suggestions = useMemo(
    () => searchSuggestions(projects, query),
    [projects, query],
  );

  const showPanel = open && (query.trim() || recent.length > 0);
  const showEmpty =
    open && query.trim().length > 0 && suggestions.length === 0;

  function commitQuery(value) {
    onQuery(value);
    if (value.trim()) setRecent(writeRecent(value));
    setOpen(false);
  }

  function openProjectDetail(id) {
    if (!id) return;
    navigate(`/projects/${id}`);
  }

  return (
    <div className="project-filters">
      <div className="project-filters__primary">
        <Dropdown
          className="project-filters__dropdown"
          value=""
          options={projectOptions}
          onChange={openProjectDetail}
          placeholder={labels.projectDetailJump || "Open project detail"}
        />

        <div
          className="project-filters__status"
          role="group"
          aria-label={labels.statusFilter || "Filter by status"}
        >
          {statusOptions.map((item) => {
            const active = status === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`project-filters__status-btn${active ? " is-active" : ""}`}
                aria-pressed={active}
                onClick={() => onStatus(item.id)}
              >
                <span>{item.label}</span>
                <span className="project-filters__status-count">{item.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="project-filters__tools">
        <div className="project-filters__search-wrap" ref={wrapRef}>
          <label className="project-filters__search">
            <Search size={16} aria-hidden="true" />
            <span className="visually-hidden">{labels.search}</span>
            <input
              type="search"
              value={query}
              role="combobox"
              aria-expanded={showPanel}
              aria-controls={listId}
              aria-autocomplete="list"
              onChange={(event) => {
                onQuery(event.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  commitQuery(query);
                }
                if (event.key === "Escape") setOpen(false);
              }}
              placeholder={labels.searchPlaceholder}
              autoComplete="off"
            />
            {query ? (
              <button
                type="button"
                className="project-filters__search-clear"
                aria-label={labels.searchClear || "Clear search"}
                onClick={() => {
                  onQuery("");
                  setOpen(true);
                }}
              >
                <X size={14} />
              </button>
            ) : null}
          </label>

          {showPanel ? (
            <div
              id={listId}
              className="project-filters__suggest"
              role="listbox"
              aria-label={labels.searchSuggestions}
            >
              {showEmpty ? (
                <p className="project-filters__suggest-empty">
                  {labels.searchEmpty}
                </p>
              ) : null}

              {!query.trim() && recent.length > 0 ? (
                <div className="project-filters__suggest-group">
                  <p className="project-filters__suggest-label">
                    {labels.searchRecent}
                  </p>
                  {recent.map((term) => (
                    <button
                      key={term}
                      type="button"
                      className="project-filters__suggest-item"
                      role="option"
                      onClick={() => commitQuery(term)}
                    >
                      <Search size={14} aria-hidden="true" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              ) : null}

              {suggestions.length > 0 ? (
                <div className="project-filters__suggest-group">
                  <p className="project-filters__suggest-label">
                    {labels.searchSuggestions}
                  </p>
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="project-filters__suggest-item"
                      role="option"
                      onClick={() => commitQuery(item.name)}
                    >
                      <span className="project-filters__suggest-name">
                        {item.name}
                      </span>
                      <span className="project-filters__suggest-meta">
                        {item.category}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <label className="project-filters__select-wrap">
          <span className="visually-hidden">{labels.sort}</span>
          <select
            className="project-filters__select"
            value={sort}
            onChange={(event) => onSort(event.target.value)}
            aria-label={labels.sort}
          >
            <option value="latest">{labels.sortLatest}</option>
            <option value="name">{labels.sortName}</option>
            <option value="featured">{labels.sortFeatured}</option>
          </select>
        </label>

        {query.trim() && resultCount === 0 ? (
          <p className="project-filters__empty-hint" role="status">
            {labels.emptyHint || labels.searchEmpty}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default ProjectFilters;
