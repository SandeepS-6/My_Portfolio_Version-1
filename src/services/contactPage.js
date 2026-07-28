import api from "./api";

const CACHE_KEY = "portfolio.contactPage";

let memory = null;
let inflight = null;

function mapContactPage(data = {}) {
  return {
    eyebrow: data.eyebrow || "Contact",
    title: data.ctaLabel || "Let's Talk",
    intro: data.description || "",
    detail: data.availability || "",
    meetingNote: data.location
      ? `Calls happen on Google Meet · ${data.location}`
      : "Calls happen on Google Meet.",
    responseLabel: "Usually replies within",
    responseValue: "1–2 business days",
    backLabel: "Back to home",
    fields: {
      name: "Your name",
      email: "Your email",
      subject: "Subject",
      body: "Message",
    },
    successTitle: "Meeting booked",
    successNote: "Thanks — I'll confirm shortly.",
    submitLabel: "Confirm meeting",
    sendingLabel: "Booking…",
  };
}

function isContactPayload(data) {
  return data && typeof data === "object" && !Array.isArray(data);
}

function readSession() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return isContactPayload(data) ? data : null;
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

export function peekContactPage() {
  if (memory) return memory;
  const cached = readSession();
  if (cached) memory = cached;
  return cached;
}

/* Contact / Let's Talk page copy from CMS contact-info. */
export async function getContactPage() {
  if (!inflight) {
    inflight = api
      .get("/api/contact-info")
      .then(({ data }) => remember(mapContactPage(data)))
      .finally(() => {
        inflight = null;
      });
  }

  try {
    return await inflight;
  } catch (error) {
    const cached = peekContactPage();
    if (cached) return cached;
    throw error;
  }
}

export function prefetchContactPage() {
  return getContactPage().catch(() => peekContactPage());
}
