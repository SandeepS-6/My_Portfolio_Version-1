import { useEffect, useRef, useState } from "react";
import Hero from "../components/Hero/Hero";
import ScrollScene from "../components/ScrollScene/ScrollScene";
import SidebarSlot from "../components/SidebarSlot/SidebarSlot";
import PlaceholderSection from "../components/PlaceholderSection/PlaceholderSection";
import WhatIDo from "../components/WhatIDo/WhatIDo";
import ProjectsSection from "../components/ProjectsSection/ProjectsSection";
import ContactSection from "../components/ContactSection/ContactSection";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { useActiveSection } from "../hooks/useActiveSection";
import { useElementOnScreen } from "../hooks/useElementOnScreen";
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

function Home() {
  const sceneRef = useRef(null);
  const progress = useScrollProgress(sceneRef);
  const [sections, setSections] = useState(BASE_SECTIONS);

  const activeId = useActiveSection(SECTION_IDS);
  const activeSection =
    sections.find((section) => section.id === activeId) ?? sections[0];

  const contactOnScreen = useElementOnScreen("contact");
  const sidebarVisible = activeId !== "home" && !contactOnScreen;

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
    <div className={`home${contactOnScreen ? " home--on-contact" : ""}`}>
      <SidebarSlot
        visible={sidebarVisible}
        activeSection={activeSection}
        menuItems={sections}
        initials={initials}
      />

      <div id="home">
        <ScrollScene ref={sceneRef} progress={progress}>
          <Hero />
        </ScrollScene>
      </div>

      <div className="home__content">
        <div id="about">
          <PlaceholderSection code="01" title="About" />
        </div>
        <div id="capabilities">
          <WhatIDo />
        </div>
        <div id="skills">
          <PlaceholderSection code="03" title="Skills" />
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
