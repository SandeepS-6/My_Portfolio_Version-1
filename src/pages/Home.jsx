import { useEffect, useRef, useState, memo, useMemo } from "react";
import Hero from "../components/Hero/Hero";
import ScrollScene from "../components/ScrollScene/ScrollScene";
import SidebarSlot from "../components/SidebarSlot/SidebarSlot";
import MobileSideMenu from "../components/MobileSideMenu/MobileSideMenu";
import AboutSection from "../components/AboutSection/AboutSection";
import WhatIDo from "../components/WhatIDo/WhatIDo";
import SkillsSection from "../components/SkillsSection/SkillsSection";
import ProjectsSection from "../components/ProjectsSection/ProjectsSection";
import ContactSection from "../components/ContactSection/ContactSection";
import { useScrollGap } from "../hooks/useScrollGap";
import { useActiveSection } from "../hooks/useActiveSection";
import { useElementOnScreen } from "../hooks/useElementOnScreen";
import { isDarkHeroStage } from "../utils/Hero/heroBackgrounds";
import { getHero } from "../services/hero";
import { getSettings, peekSettings } from "../services/settings";
import { getFooter, peekFooter } from "../services/footer";
import { mediaUrl } from "../utils/mediaUrl";
import "./Home.css";

const DEFAULT_LOGO = "/brand/sa-mark.svg";

const BASE_SECTIONS = [
  {
    id: "home",
    menuLabel: "Hero",
    label: "Home",
    sub: "",
    flag: "showHero",
  },
  { id: "about", menuLabel: "About", label: "About", sub: "01", flag: "showAbout" },
  {
    id: "capabilities",
    menuLabel: "What I Do",
    label: "What I Do",
    sub: "02",
    flag: "showWhatIDo",
  },
  { id: "skills", menuLabel: "Skills", label: "Skills", sub: "03", flag: "showSkills" },
  {
    id: "projects",
    menuLabel: "Projects",
    label: "Projects",
    sub: "04",
    flag: "showProjects",
  },
  {
    id: "contact",
    menuLabel: "Contact",
    label: "Contact",
    sub: "05",
    flag: "showContact",
  },
];

const DARK_HERO = isDarkHeroStage();

const HeroStage = memo(function HeroStage() {
  return <Hero />;
});

function applyDocumentMeta(settings) {
  if (!settings) return;
  if (settings.siteTitle) document.title = settings.siteTitle;
  if (settings.primaryColor) {
    document.documentElement.style.setProperty(
      "--color-accent",
      settings.primaryColor,
    );
  }
  let description = document.querySelector('meta[name="description"]');
  if (!description) {
    description = document.createElement("meta");
    description.setAttribute("name", "description");
    document.head.appendChild(description);
  }
  if (settings.siteDescription) {
    description.setAttribute("content", settings.siteDescription);
  }
}

function Home() {
  const sceneRef = useRef(null);
  const gapRef = useRef(null);
  useScrollGap(sceneRef, gapRef);

  const [settings, setSettings] = useState(() => peekSettings());
  const [sections, setSections] = useState(BASE_SECTIONS);
  const [logoUrl, setLogoUrl] = useState(() => {
    const footer = peekFooter();
    return mediaUrl(footer?.logo) || DEFAULT_LOGO;
  });

  const visibleSections = useMemo(() => {
    if (!settings) return BASE_SECTIONS;
    return BASE_SECTIONS.filter((section) => settings[section.flag] !== false);
  }, [settings]);

  const sectionIds = useMemo(
    () => visibleSections.map((section) => section.id),
    [visibleSections],
  );

  const activeId = useActiveSection(sectionIds);
  const activeSection =
    visibleSections.find((section) => section.id === activeId) ??
    visibleSections[0] ??
    sections[0];

  const contactOnScreen = useElementOnScreen("contact");
  const homeOnScreen = useElementOnScreen("home", true);
  const showContact = settings?.showContact !== false;
  const showHero = settings?.showHero !== false;
  const sidebarVisible =
    showHero && !homeOnScreen && !(showContact && contactOnScreen);

  useEffect(() => {
    let alive = true;

    getSettings()
      .then((data) => {
        if (!alive || !data) return;
        setSettings(data);
        applyDocumentMeta(data);
      })
      .catch((error) => {
        console.warn("[home] Failed to load settings.", error.message);
      });

    getHero()
      .then((hero) => {
        if (!alive || !hero) return;
        setSections((prev) =>
          prev.map((section) =>
            section.id === "home"
              ? {
                  ...section,
                  label: `${hero.firstName} ${hero.lastName}`.trim(),
                  sub: hero.role || "",
                }
              : section,
          ),
        );
      })
      .catch((error) => {
        console.warn("[home] Failed to load hero for sidebar.", error.message);
      });

    getFooter()
      .then((footer) => {
        if (!alive) return;
        const next = mediaUrl(footer?.logo);
        if (next) setLogoUrl(next);
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, []);

  const menuItems = useMemo(() => {
    const byId = Object.fromEntries(sections.map((s) => [s.id, s]));
    return visibleSections.map((section) => byId[section.id] || section);
  }, [sections, visibleSections]);

  const initials = (() => {
    const home = menuItems.find((section) => section.id === "home");
    const parts = String(home?.label || "Saliganti Sandeep")
      .split(/\s+/)
      .filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
    }
    return (parts[0]?.slice(0, 2) || "SA").toUpperCase();
  })();

  if (settings?.maintenanceMode) {
    return (
      <main className="home home--maintenance" aria-label="Maintenance">
        <div className="home-maintenance">
          <p className="home-maintenance__eyebrow">Maintenance</p>
          <h1 className="home-maintenance__title">
            {settings.siteTitle || "Portfolio"}
          </h1>
          <p className="home-maintenance__lead">
            The site is temporarily unavailable. Please check back soon.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div
      className={`home${contactOnScreen && showContact ? " home--on-contact" : ""}${
        sidebarVisible ? " home--sidebar" : ""
      }`}
    >
      <SidebarSlot
        visible={sidebarVisible}
        activeSection={activeSection}
        menuItems={menuItems}
        logoUrl={logoUrl}
        initials={initials}
      />
      <MobileSideMenu
        visible={sidebarVisible}
        menuItems={menuItems}
        activeSection={activeSection}
        logoUrl={logoUrl}
        initials={initials}
      />

      {showHero ? (
        <div id="home">
          <ScrollScene ref={sceneRef} gapRef={gapRef} dark={DARK_HERO}>
            <HeroStage />
          </ScrollScene>
        </div>
      ) : null}

      <div className="home__content">
        {settings?.showAbout !== false ? (
          <div id="about">
            <AboutSection />
          </div>
        ) : null}
        {settings?.showWhatIDo !== false ? (
          <div id="capabilities">
            <WhatIDo />
          </div>
        ) : null}
        {settings?.showSkills !== false ? (
          <div id="skills">
            <SkillsSection />
          </div>
        ) : null}
        {settings?.showProjects !== false ? (
          <div id="projects">
            <ProjectsSection />
          </div>
        ) : null}
        {showContact ? <ContactSection /> : null}
      </div>
    </div>
  );
}

export default Home;
