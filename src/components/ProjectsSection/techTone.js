/*
  Tech chip helpers — icon slug + color for Simple Icons CDN.
*/
const TECH_META = {
  React: { icon: "react", color: "61DAFB" },
  TypeScript: { icon: "typescript", color: "3178C6" },
  JavaScript: { icon: "javascript", color: "F7DF1E" },
  Vite: { icon: "vite", color: "646CFF" },
  Tailwind: { icon: "tailwindcss", color: "06B6D4" },
  "Tailwind CSS": { icon: "tailwindcss", color: "06B6D4" },
  "Next.js": { icon: "nextdotjs", color: "E2E8F0" },
  Node: { icon: "nodedotjs", color: "8CC84B" },
  "Node.js": { icon: "nodedotjs", color: "8CC84B" },
  Express: { icon: "express", color: "E2E8F0" },
  "Express.js": { icon: "express", color: "E2E8F0" },
  MongoDB: { icon: "mongodb", color: "47A248" },
  PostgreSQL: { icon: "postgresql", color: "4169E1" },
  Redis: { icon: "redis", color: "DC382D" },
  GSAP: { icon: "greensock", color: "88CE02" },
  MDX: { icon: "mdx", color: "F0ABFC" },
  Algolia: { icon: "algolia", color: "5468FF" },
  Recharts: { icon: "chartdotjs", color: "FF6384" },
  CSS: { icon: "css", color: "1572B6" },
  "CSS Modules": { icon: "cssmodules", color: "E2E8F0" },
  Storybook: { icon: "storybook", color: "FF4785" },
  "Socket.io": { icon: "socketdotio", color: "E2E8F0" },
  Python: { icon: "python", color: "3776AB" },
};

export function normalizeTech(entry) {
  if (typeof entry === "string") {
    const meta = TECH_META[entry] || {};
    return {
      name: entry,
      icon: meta.icon || "",
      color: meta.color || "2a2a32",
      category: "",
    };
  }

  const name = entry?.name || "";
  const meta = TECH_META[name] || {};
  return {
    name,
    icon: entry?.icon || meta.icon || "",
    color: (entry?.color || meta.color || "2a2a32").replace("#", ""),
    category: entry?.category || "",
  };
}

export function techIconUrl(tech, colorOverride) {
  const item = normalizeTech(tech);
  if (!item.icon) return null;
  const color = (colorOverride || item.color).replace("#", "");
  return `https://cdn.simpleicons.org/${item.icon}/${color}`;
}

export function techTone(name) {
  const tones = {
    React: "sky",
    TypeScript: "blue",
    JavaScript: "amber",
    Vite: "violet",
    Tailwind: "teal",
    "Tailwind CSS": "teal",
    "Next.js": "slate",
    Node: "lime",
    "Node.js": "lime",
    Express: "stone",
    "Express.js": "stone",
    MongoDB: "green",
    PostgreSQL: "cyan",
    Redis: "rose",
    GSAP: "orange",
    MDX: "fuchsia",
    Algolia: "blue",
    Recharts: "indigo",
    CSS: "sky",
    "CSS Modules": "sky",
    Storybook: "pink",
    "Socket.io": "stone",
    Python: "amber",
  };
  return tones[name] || "slate";
}
