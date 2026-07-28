import { useEffect, useRef, useState, memo } from "react";
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
import { isDarkHeroStage } from "../components/Hero/backgrounds/heroBackgrounds";
import { getHero } from "../services/hero";
import "./Home.css";

const BASE_SECTIONS = [
  {
    id: "home",
    menuLabel: "Hero",
    label: "Home",
    sub: "",
  },
  { id: "about", menuLabel: "About", label: "About", sub: "01" },
  {
    id: "capabilities",
    menuLabel: "What I Do",
    label: "What I Do",
    sub: "02",
  },
  { id: "skills", menuLabel: "Skills", label: "Skills", sub: "03" },
  { id: "projects", menuLabel: "Projects", label: "Projects", sub: "04" },
  { id: "contact", menuLabel: "Contact", label: "Contact", sub: "05" },
];

const SECTION_IDS = BASE_SECTIONS.map((section) => section.id);
const DARK_HERO = isDarkHeroStage();

const HeroStage = memo(function HeroStage() {
  return <Hero />;
});

function Home() {
  const sceneRef = useRef(null);
  const gapRef = useRef(null);
  useScrollGap(sceneRef, gapRef);
  const [sections, setSections] = useState(BASE_SECTIONS);

  const activeId = useActiveSection(SECTION_IDS);
  const activeSection =
    sections.find((section) => section.id === activeId) ?? sections[0];

  const contactOnScreen = useElementOnScreen("contact");
  // Start true so the rail does not flash before the first measure
  const homeOnScreen = useElementOnScreen("home", true);
  const sidebarVisible = !homeOnScreen && !contactOnScreen;

  useEffect(() => {
    let alive = true;

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

    return () => {
      alive = false;
    };
  }, []);

  const initials = (() => {
    const home = sections.find((section) => section.id === "home");
    const parts = String(home?.label || "S")
      .split(/\s+/)
      .filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
    }
    return (parts[0]?.[0] || "S").toUpperCase();
  })();

  return (
    <div
      className={`home${contactOnScreen ? " home--on-contact" : ""}${
        sidebarVisible ? " home--sidebar" : ""
      }`}
    >
      <SidebarSlot
        visible={sidebarVisible}
        activeSection={activeSection}
        menuItems={sections}
        initials={initials}
      />
      <MobileSideMenu
        visible={sidebarVisible}
        menuItems={sections}
        activeSection={activeSection}
        initials={initials}
      />

      <div id="home">
        <ScrollScene ref={sceneRef} gapRef={gapRef} dark={DARK_HERO}>
          <HeroStage />
        </ScrollScene>
      </div>

      <div className="home__content">
        <div id="about">
          <AboutSection />
        </div>
        <div id="capabilities">
          <WhatIDo />
        </div>
        <div id="skills">
          <SkillsSection />
        </div>
        <div id="projects">
          <ProjectsSection />
        </div>
        <ContactSection />
      </div>
    </div>
  );
}

export default Home;
