import api from "./api";
import mockProjectsSection from "../data/mockProjectsSection.json";

/*
  UI expects { labels, kinds, projects, intro, bottom, squircle, hiddenProjects }.
  Public GET /api/projects returns that section payload from CMS.
*/

function isSectionPayload(data) {
  return data && !Array.isArray(data) && Array.isArray(data.projects);
}

function buildProjectPayload(data, id) {
  const projects = data.projects || [];
  const index = projects.findIndex((project) => project.id === id);
  if (index < 0) return null;

  const project = projects[index];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const related = (project.relatedIds || [])
    .map((relatedId) => projects.find((item) => item.id === relatedId))
    .filter(Boolean);

  return {
    project,
    prev,
    next,
    related,
    projects: projects.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      image: item.image,
    })),
    labels: data.labels || {},
    kinds: data.kinds || [],
    squircle: data.squircle || {},
    hiddenProjects: data.hiddenProjects || [],
  };
}

export async function getProjects() {
  try {
    const { data } = await api.get("/api/projects");
    if (isSectionPayload(data)) return data;
  } catch (error) {
    console.warn("[projects] API unavailable, using mock.", error.message);
  }

  return mockProjectsSection;
}

export async function getProjectById(id) {
  const data = await getProjects();
  return buildProjectPayload(data, id);
}

export async function likeProject(id, { undo = false } = {}) {
  const { data } = await api.post(`/api/projects/${id}/likes`, { undo });
  return data;
}

export async function recordProjectView(id) {
  const { data } = await api.post(`/api/projects/${id}/views`);
  return data;
}

export async function postProjectComment(id, body) {
  const { data } = await api.post(`/api/projects/${id}/comments`, body);
  return data;
}
