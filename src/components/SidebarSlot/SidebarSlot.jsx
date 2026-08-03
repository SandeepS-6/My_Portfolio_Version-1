import { useEffect, useState } from "react";
import "./SidebarSlot.css";

const DEFAULT_LOGO = "/brand/sa-mark.svg";

function SidebarSlot({
  visible,
  activeSection,
  menuItems,
  logoUrl = DEFAULT_LOGO,
  initials = "SA",
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!visible) setMenuOpen(false);
  }, [visible]);

  return (
    <>
      <aside
        className={`sidebar-slot${visible ? " sidebar-slot--visible" : ""}`}
        aria-hidden={!visible}
      >
        <a className="sidebar-slot__logo" href="#home" aria-label="Saliganti Sandeep — Home">
          {logoUrl ? (
            <img
              className="sidebar-slot__logo-img"
              src={logoUrl}
              alt=""
              width="40"
              height="40"
            />
          ) : (
            initials
          )}
        </a>

        <div className="sidebar-slot__middle">
          <p className="sidebar-slot__name" key={activeSection.label}>
            {activeSection.label}
          </p>
          {activeSection.sub && (
            <p className="sidebar-slot__role" key={activeSection.sub}>
              {activeSection.sub}
            </p>
          )}
        </div>

        <button
          type="button"
          className={`sidebar-slot__burger${menuOpen ? " sidebar-slot__burger--open" : ""}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </aside>

      <div
        className={`sidebar-menu${menuOpen ? " sidebar-menu--open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className="sidebar-menu__nav" aria-label="Site menu">
          {menuItems.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="sidebar-menu__link"
              style={{
                transitionDelay: menuOpen ? `${0.12 + index * 0.06}s` : "0s",
              }}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
            >
              {item.menuLabel}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}

export default SidebarSlot;
