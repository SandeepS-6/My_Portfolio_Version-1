import api from "./api";

const CACHE_KEY = "portfolio.settings";

let memory = null;
let inflight = null;

function isSettingsPayload(data) {
  return data && typeof data === "object" && !Array.isArray(data);
}

function readSession() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return isSettingsPayload(data) ? data : null;
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

export function peekSettings() {
  if (memory) return memory;
  const cached = readSession();
  if (cached) memory = cached;
  return cached;
}

export async function getSettings() {
  if (!inflight) {
    inflight = api
      .get("/api/settings")
      .then(({ data }) => {
        if (!isSettingsPayload(data)) {
          throw new Error("Settings payload missing");
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
    const cached = peekSettings();
    if (cached) return cached;
    throw error;
  }
}

export function prefetchSettings() {
  return getSettings().catch(() => peekSettings());
}
