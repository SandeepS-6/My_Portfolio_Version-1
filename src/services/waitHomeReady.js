import api from "./api";
import { getFooter } from "./footer";
import { getHero } from "./hero";
import { getSettings } from "./settings";

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const id = window.setTimeout(resolve, ms);

    const onAbort = () => {
      window.clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
    };

    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function isAborted(error, signal) {
  return (
    signal?.aborted ||
    error?.name === "AbortError" ||
    error?.code === "ERR_CANCELED"
  );
}

/**
 * Keep the loading curtain up until the API is actually awake
 * (cold deploy: frontend can paint before the backend finishes booting).
 * Requires live responses — not session-cache soft-fallback — then primes caches.
 */
export async function waitHomeReady(signal) {
  let delay = 900;

  while (!signal?.aborted) {
    try {
      // Live round-trip only — stale session cache must not end the curtain early
      await api.get("/api/health", { signal });
      await Promise.all([
        api.get("/api/hero", { signal }),
        api.get("/api/footer", { signal }),
        api.get("/api/settings", { signal }),
      ]);

      // Prime service caches so Home paints with real data, not mocks
      const [hero, footer, settings] = await Promise.all([
        getHero(),
        getFooter(),
        getSettings(),
      ]);

      if (hero && footer && settings) return true;
    } catch (error) {
      if (isAborted(error, signal)) return false;
      /* backend still waking — stay on the loading screen */
    }

    try {
      await sleep(delay, signal);
    } catch {
      return false;
    }

    delay = Math.min(Math.round(delay * 1.35), 4000);
  }

  return false;
}
