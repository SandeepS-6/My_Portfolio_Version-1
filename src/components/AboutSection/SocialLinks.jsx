import { SocialIcon } from "./AboutIcons";
import "./SocialLinks.css";

function SocialLinks({ items = [] }) {
  if (!items.length) return null;

  return (
    <ul className="about-socials" aria-label="Social links">
      {items.map((item) => (
        <li key={item.id}>
          <a
            className="about-socials__btn"
            href={item.href || "#"}
            aria-label={item.label}
            onClick={(event) => {
              if (!item.href || item.href === "#") event.preventDefault();
            }}
          >
            <SocialIcon type={item.type} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default SocialLinks;
