import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import StaggeredMenu from "../StaggeredMenu/StaggeredMenu";
import { getFooter } from "../../services/footer";
import {
  getProjectQuery,
  setProjectQuery,
  subscribeProjectQuery,
} from "../../utils/ProjectsSection/projectSearchBus";
import "./MobileSideMenu.css";

const LAYER_COLORS = ["#f17a32", "#2a2a32"];

function HeaderSectionLabel({ section }) {
  if (!section || section.id === "home") return null;

  return (
    <p className="mobile-header-label" key={section.id}>
      <span className="mobile-header-label__name">
        {section.menuLabel || section.label}
      </span>
      {section.sub ? (
        <span className="mobile-header-label__sub">{section.sub}</span>
      ) : null}
    </p>
  );
}

function HeaderProjectSearch() {
  const [query, setQuery] = useState(getProjectQuery);

  useEffect(() => subscribeProjectQuery(setQuery), []);

  return (
    <label className="mobile-header-search">
      <Search size={15} aria-hidden="true" />
      <span className="visually-hidden">Search projects</span>
      <input
        type="search"
        value={query}
        onChange={(event) => setProjectQuery(event.target.value)}
        placeholder="Search projects…"
        autoComplete="off"
      />
      {query ? (
        <button
          type="button"
          className="mobile-header-search__clear"
          aria-label="Clear search"
          onClick={() => setProjectQuery("")}
        >
          <X size={14} aria-hidden="true" />
        </button>
      ) : null}
    </label>
  );
}

function MobileSideMenu({
  visible = false,
  menuItems = [],
  activeSection,
  initials = "SA",
  logoUrl = "/brand/sa-mark.svg",
}) {
  const [socialItems, setSocialItems] = useState([]);

  const items = useMemo(
    () =>
      menuItems.map((section) => ({
        label: section.menuLabel || section.label,
        ariaLabel: `Go to ${section.menuLabel || section.label}`,
        link: `#${section.id}`,
      })),
    [menuItems],
  );

  useEffect(() => {
    let alive = true;

    getFooter()
      .then((footer) => {
        if (!alive || !footer?.socials?.length) return;
        setSocialItems(
          footer.socials
            .filter((link) => link?.label && link?.href)
            .map((link) => ({
              label: link.label,
              link: link.href,
            })),
        );
      })
      .catch((error) => {
        console.warn("[mobile-menu] Failed to load socials.", error.message);
      });

    return () => {
      alive = false;
    };
  }, []);

  const sectionId = activeSection?.id;
  const headerCenter =
    sectionId === "projects" ? (
      <HeaderProjectSearch />
    ) : (
      <HeaderSectionLabel section={activeSection} />
    );

  return (
    <div
      className={`mobile-side-menu${visible ? " mobile-side-menu--visible" : ""}`}
      aria-hidden={!visible}
    >
      {visible ? (
        <StaggeredMenu
          position="right"
          isFixed
          items={items}
          socialItems={socialItems}
          displaySocials={socialItems.length > 0}
          displayItemNumbering
          logoUrl={logoUrl}
          logoLabel={initials}
          menuButtonColor="#2a2a32"
          openMenuButtonColor="#2a2a32"
          changeMenuColorOnOpen={false}
          colors={LAYER_COLORS}
          accentColor="#f17a32"
          closeOnClickAway
          headerCenter={headerCenter}
        />
      ) : null}
    </div>
  );
}

export default MobileSideMenu;
