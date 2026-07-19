/*
  Local cookie-consent persistence.
  Essential cookies are always allowed; optional ones need Accept All.
*/

export const CONSENT_STORAGE_KEY = "portfolio.cookieConsent.v1";
export const CONSENT_VERSION = 1;
export const CONSENT_TTL_MS = 1000 * 60 * 60 * 24 * 180; // 180 days

export const CONSENT_CHOICE = {
  ACCEPTED: "accepted",
  REJECTED: "rejected",
};

function canUseStorage() {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

export function getStoredConsent() {
  if (!canUseStorage()) return null;

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== CONSENT_VERSION) return null;
    if (!parsed.choice || !parsed.decidedAt) return null;

    if (Date.now() - parsed.decidedAt > CONSENT_TTL_MS) {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function storeConsent(choice) {
  const record = {
    version: CONSENT_VERSION,
    choice,
    decidedAt: Date.now(),
    categories: {
      essential: true,
      optional: choice === CONSENT_CHOICE.ACCEPTED,
    },
  };

  if (canUseStorage()) {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  }

  return record;
}

export function clearConsent() {
  if (canUseStorage()) {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  }
}

export function hasOptionalConsent(consent = getStoredConsent()) {
  return Boolean(consent?.categories?.optional);
}

export function areOptionalCookiesEnabled() {
  return hasOptionalConsent();
}
