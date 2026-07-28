/*
  Tech chip helpers — icon slug + color for Simple Icons CDN.

  CMS / API usually sends plain names: ["React", "Node"].
  Objects with icon/color still win when provided.
*/
const TECH_META = {
  React: { icon: "react", color: "61DAFB" },
  TypeScript: { icon: "typescript", color: "3178C6" },
  JavaScript: { icon: "javascript", color: "F7DF1E" },
  Vite: { icon: "vite", color: "646CFF" },
  Tailwind: { icon: "tailwindcss", color: "06B6D4" },
  "Tailwind CSS": { icon: "tailwindcss", color: "06B6D4" },
  "Next.js": { icon: "nextdotjs", color: "E2E8F0" },
  Next: { icon: "nextdotjs", color: "E2E8F0" },
  NextJS: { icon: "nextdotjs", color: "E2E8F0" },
  Node: { icon: "nodedotjs", color: "8CC84B" },
  "Node.js": { icon: "nodedotjs", color: "8CC84B" },
  Express: { icon: "express", color: "E2E8F0" },
  "Express.js": { icon: "express", color: "E2E8F0" },
  MongoDB: { icon: "mongodb", color: "47A248" },
  PostgreSQL: { icon: "postgresql", color: "4169E1" },
  Postgres: { icon: "postgresql", color: "4169E1" },
  Redis: { icon: "redis", color: "DC382D" },
  GSAP: { icon: "greensock", color: "88CE02" },
  MDX: { icon: "mdx", color: "F0ABFC" },
  Algolia: { icon: "algolia", color: "5468FF" },
  Recharts: { icon: "chartdotjs", color: "FF6384" },
  CSS: { icon: "css", color: "1572B6" },
  "CSS Modules": { icon: "cssmodules", color: "E2E8F0" },
  Storybook: { icon: "storybook", color: "FF4785" },
  "Socket.io": { icon: "socketdotio", color: "E2E8F0" },
  SocketIO: { icon: "socketdotio", color: "E2E8F0" },
  Python: { icon: "python", color: "3776AB" },
  Prisma: { icon: "prisma", color: "E2E8F0" },
  GraphQL: { icon: "graphql", color: "E10098" },
  Docker: { icon: "docker", color: "2496ED" },
  AWS: { icon: "amazonwebservices", color: "FF9900" },
  Firebase: { icon: "firebase", color: "FFCA28" },
  Supabase: { icon: "supabase", color: "3ECF8E" },
  Figma: { icon: "figma", color: "F24E1E" },
  HTML: { icon: "html5", color: "E34F26" },
  HTML5: { icon: "html5", color: "E34F26" },
  Sass: { icon: "sass", color: "CC6699" },
  SCSS: { icon: "sass", color: "CC6699" },
  Redux: { icon: "redux", color: "764ABC" },
  Zustand: { icon: "react", color: "443E38" },
  Framer: { icon: "framer", color: "0055FF" },
  "Framer Motion": { icon: "framer", color: "0055FF" },
  IndexedDB: { icon: "indexeddb", color: "E2E8F0" },
};

const TECH_META_BY_KEY = Object.fromEntries(
  Object.entries(TECH_META).map(([name, meta]) => [normalizeKey(name), meta]),
);

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s._-]+/g, "");
}

/** Guess a Simple Icons slug when the name is unknown. */
export function guessTechIcon(name) {
  const raw = String(name || "").trim();
  if (!raw) return "";

  const key = normalizeKey(raw);
  const known = TECH_META_BY_KEY[key];
  if (known?.icon) return known.icon;

  return raw
    .trim()
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/#/g, "sharp")
    .replace(/\./g, "dot")
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function lookupTechMeta(name) {
  const key = normalizeKey(name);
  return TECH_META_BY_KEY[key] || null;
}

export function normalizeTech(entry) {
  if (typeof entry === "string") {
    const meta = lookupTechMeta(entry) || {};
    return {
      name: entry,
      icon: meta.icon || guessTechIcon(entry),
      color: meta.color || "2a2a32",
      category: "",
    };
  }

  const name = entry?.name || "";
  const meta = lookupTechMeta(name) || {};
  return {
    name,
    icon: entry?.icon || meta.icon || guessTechIcon(name),
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

export const TECH_SUGGESTIONS = Object.keys(TECH_META);
