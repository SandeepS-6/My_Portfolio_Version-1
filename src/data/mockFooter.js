/*
  Footer / contact-ending copy — later replace with CMS / API.
  Shape matches what ContactSection renders today, plus fields
  the CMS will edit later (not all shown in the UI yet).
*/

const mockFooter = {
  // --- Shown in ContactSection today ---
  backgroundWords: ["HUMAN", "INTEREST"],
  eyebrow: "Have a project in mind?",
  cta: {
    label: "Let's talk",
    href: "mailto:hello@example.com",
  },
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
  backToTopLabel: "Back to top",
  credits: "by Sandeep Saliganti",

  // --- Prepared for CMS (not all rendered yet) ---
  logo: null,
  developerName: "Sandeep Saliganti",
  description:
    "Frontend engineer building clear, fast interfaces with lasting foundations.",
  copyright: "All rights reserved",
  email: "hello@example.com",
  phone: null,
  address: null,
  resumeUrl: null,
  availability: {
    isAvailable: true,
    label: "Available for projects",
  },
  navLinks: [
    { label: "Home", href: "#home" },
    { label: "Selected Work", href: "#work" },
    { label: "Experience", href: "#experience" },
    { label: "Capabilities", href: "#capabilities" },
    { label: "Contact", href: "#contact" },
  ],
};

export default mockFooter;
