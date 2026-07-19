import api from "./api";

export function syncCookieConsent(consent) {
  if (!consent) return Promise.resolve(null);

  return api
    .post("/api/cookie-consent", {
      choice: consent.choice,
      categories: consent.categories,
      version: consent.version,
      decidedAt: new Date(consent.decidedAt).toISOString(),
    })
    .then((response) => response.data)
    .catch(() => null);
}
