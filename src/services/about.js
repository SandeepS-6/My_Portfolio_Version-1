import api from "./api";
import { mockAbout } from "../data/mockAbout";

const CACHE_KEY = "portfolio.about";

let memory = null;
let inflight = null;

function isAboutPayload(data) {
  return (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    typeof data.name === "string" &&
    data.name.trim()
  );
}

function readSession() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return isAboutPayload(data) ? data : null;
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
export function peekAbout() {
  if (memory) return memory;
  const cached = readSession();
  if (cached) memory = cached;
  return cached;
}

export async function getAbout() {
  if (!inflight) {
    inflight = api
      .get("/api/about")
      .then(({ data }) => {
        if (!isAboutPayload(data)) {
          throw new Error("About payload empty — fill via CMS");
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
    const cached = peekAbout();
    if (cached) return cached;
    console.warn("[about] API unavailable or empty, using mock.", error.message);
    return mockAbout;
  }
}

export function prefetchAbout() {
  return getAbout().catch(() => peekAbout() || mockAbout);
}
