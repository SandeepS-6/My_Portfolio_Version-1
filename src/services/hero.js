import api from "./api";

const CACHE_KEY = "portfolio.hero";

let memory = null;
let inflight = null;

function isHeroPayload(data) {
  return data && !Array.isArray(data) && (data.headline || data.quote || data.firstName);
}

function readSession() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return isHeroPayload(data) ? data : null;
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

/** Sync snapshot for first paint (memory → session). */
export function peekHero() {
  if (memory) return memory;
  const cached = readSession();
  if (cached) memory = cached;
  return cached;
}

export async function getHero() {
  if (!inflight) {
    inflight = api
      .get("/api/hero")
      .then(({ data }) => {
        if (!isHeroPayload(data)) {
          throw new Error("Hero payload missing");
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
    const cached = peekHero();
    if (cached) return cached;
    throw error;
  }
}

/** Kick off early (loading screen) so Home already has data. */
export function prefetchHero() {
  return getHero().catch(() => peekHero());
}
