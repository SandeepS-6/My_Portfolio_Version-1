/*
  Hint bubble → smooth scroll to Contact, then a short highlight pulse.
*/

export function scrollToContactAndHighlight(contactSectionId = "contact") {
  const contact = document.getElementById(contactSectionId);
  if (!contact) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function pulse() {
    contact.classList.add("contact-section--pulse");
    window.setTimeout(() => {
      contact.classList.remove("contact-section--pulse");
    }, 1600);
  }

  contact.scrollIntoView({
    behavior: reduced ? "auto" : "smooth",
    block: "start",
  });

  if (reduced) {
    pulse();
    return;
  }

  let done = false;
  function finish() {
    if (done) return;
    done = true;
    observer.disconnect();
    window.clearTimeout(fallback);
    pulse();
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.4)) {
        finish();
      }
    },
    { threshold: [0.4, 0.55] },
  );

  observer.observe(contact);
  const fallback = window.setTimeout(finish, 1800);
}
