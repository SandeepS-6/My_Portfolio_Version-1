/*
  Pure filter / sort helpers for the projects grid.
*/

export function filterAndSortProjects(
  projects = [],
  { status = "all", query = "", sort = "latest" } = {},
) {
  const needle = query.trim().toLowerCase();

  let list = projects.filter((project) => {
    if (status === "live" && !project.liveUrl) return false;
    if (status === "building") {
      const progress = project.progress;
      if (progress == null || progress >= 100) return false;
    }

    if (!needle) return true;

    const techNames = (project.techStack || []).map((entry) =>
      typeof entry === "string" ? entry : entry.name,
    );

    const haystack = [
      project.name,
      project.description,
      project.role,
      project.category,
      ...(project.kinds || []),
      ...techNames,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(needle);
  });

  list = [...list];

  if (sort === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "featured") {
    list.sort((a, b) => Number(b.featured) - Number(a.featured));
  } else {
    list.sort((a, b) =>
      String(b.sortDate || "").localeCompare(String(a.sortDate || "")),
    );
  }

  return list;
}

export function searchSuggestions(projects = [], query = "", limit = 6) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];

  return projects
    .filter((project) => {
      const techNames = (project.techStack || []).map((entry) =>
        typeof entry === "string" ? entry : entry.name,
      );
      return [project.name, project.category, ...techNames]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    })
    .slice(0, limit)
    .map((project) => ({
      id: project.id,
      name: project.name,
      category: project.category,
    }));
}

export function kindTone(kind) {
  const value = String(kind || "").toLowerCase();
  if (value.includes("feature")) return "featured";
  if (value.includes("open")) return "opensource";
  if (value.includes("experiment")) return "experiment";
  if (value.includes("concept")) return "concept";
  if (value.includes("research")) return "research";
  if (value.includes("archiv")) return "archived";
  return "production";
}

export function countByStatus(projects = []) {
  return {
    all: projects.length,
    live: projects.filter((project) => Boolean(project.liveUrl)).length,
    building: projects.filter((project) => {
      const progress = project.progress;
      return progress != null && progress < 100;
    }).length,
  };
}
