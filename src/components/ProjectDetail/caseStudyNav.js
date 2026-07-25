/*
  TOC sections for the project case study page.
*/

export const CASE_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "research", label: "Research" },
  { id: "planning", label: "Planning" },
  { id: "ui-design", label: "UI Design" },
  { id: "development", label: "Development" },
  { id: "challenges", label: "Challenges" },
  { id: "solution", label: "Solution" },
  { id: "results", label: "Results" },
  { id: "responsive", label: "Responsive Design" },
  { id: "gallery", label: "Gallery" },
  { id: "future", label: "Future Improvements" },
];

export function scrollToSection(id) {
  const node = document.getElementById(id);
  if (!node) return;
  node.scrollIntoView({ behavior: "smooth", block: "start" });
}
