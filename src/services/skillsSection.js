import api from "./api";

const CACHE_KEY = "portfolio.skillsSection";

let memory = null;
let inflight = null;

function isSkillsSectionPayload(data) {
  return data && !Array.isArray(data) && Array.isArray(data.categories);
}

function readSession() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return isSkillsSectionPayload(data) ? data : null;
  } catch {
    return null;
  }
}

function remember(data) {
  memory = data;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* private mode / quota */
  }
  return data;
}

export function peekSkillsSection() {
  if (memory) return memory;
  const cached = readSession();
  if (cached) memory = cached;
  return cached;
}

export async function getSkillsSection() {
  if (!inflight) {
    inflight = api
      .get("/api/skills-section")
      .then(({ data }) => {
        if (!isSkillsSectionPayload(data)) {
          throw new Error("Skills section payload missing");
        }
        return remember(data);
      })
      .finally(() => {
        inflight = null;
      });
  }

  try {
    return await inflight;
  } catch (error) {
    const cached = peekSkillsSection();
    if (cached) return cached;
    throw error;
  }
}

export function prefetchSkillsSection() {
  return getSkillsSection().catch(() => peekSkillsSection());
}
