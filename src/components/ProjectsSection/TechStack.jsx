/*
  Shared tech stack chips — one look everywhere in Projects.

  CMS / API can send either:
    ["React", "TypeScript"]
  or:
    [{ name: "React", icon: "react", color: "61DAFB", category: "UI" }]

  Unknown names still render; icon/color fall back until CMS fills them in.
*/
import { normalizeTech, techIconUrl } from "./techTone";
import "./TechStack.css";

function TechStack({
  items = [],
  label = "Tech stack",
  limit,
  className = "",
}) {
  const list = (Array.isArray(items) ? items : [])
    .map((entry) => normalizeTech(entry))
    .filter((tech) => tech.name);

  const visible = typeof limit === "number" ? list.slice(0, limit) : list;

  if (!visible.length) return null;

  return (
    <ul
      className={`tech-stack${className ? ` ${className}` : ""}`}
      aria-label={label}
    >
      {visible.map((tech) => {
        const iconUrl = techIconUrl(tech, "f5f7fa");
        return (
          <li
            key={tech.name}
            className="tech-stack__chip"
            style={{ "--tech-color": `#${tech.color}` }}
            title={tech.category || tech.name}
          >
            {iconUrl ? (
              <img
                className="tech-stack__icon"
                src={iconUrl}
                alt=""
                width="14"
                height="14"
                loading="lazy"
              />
            ) : null}
            <span className="tech-stack__name">{tech.name}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default TechStack;
