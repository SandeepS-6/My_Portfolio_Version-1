import api from "./api";

/* Contact / Let's Talk page copy from CMS contact-info. */
export async function getContactPage() {
  const { data } = await api.get("/api/contact-info");

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
