import api from "./api";

const CACHE_KEY = "portfolio.footer";

let memory = null;
let inflight = null;

function isFooterPayload(data) {
  return data && typeof data === "object" && !Array.isArray(data);
}

function readSession() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return isFooterPayload(data) ? data : null;
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
export function peekFooter() {
  if (memory) return memory;
  const cached = readSession();
  if (cached) memory = cached;
  return cached;
}

export async function getFooter() {
  if (!inflight) {
    inflight = api
      .get("/api/footer")
      .then(({ data }) => {
        if (!isFooterPayload(data)) {
          throw new Error("Footer payload missing");
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
    const cached = peekFooter();
    if (cached) return cached;
    throw error;
  }
}

/** Kick off early (loading screen) so LinkedIn / Instagram are ready with hero. */
export function prefetchFooter() {
  return getFooter().catch(() => peekFooter());
}
