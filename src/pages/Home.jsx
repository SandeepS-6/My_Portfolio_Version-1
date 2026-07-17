import { useRef } from "react";
import Hero from "../components/Hero/Hero";
import ScrollScene from "../components/ScrollScene/ScrollScene";
import SidebarSlot from "../components/SidebarSlot/SidebarSlot";
import PlaceholderSection from "../components/PlaceholderSection/PlaceholderSection";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { useActiveSection } from "../hooks/useActiveSection";
import mockHero from "../data/mockHero";
import "./Home.css";

/*
  Page architecture:
  1) ScrollScene pins the Hero and opens a left gap on scroll
     (the gap stays EMPTY during the whole hero transition)
  2) SidebarSlot jumps in only once the user enters the 2nd
     section, then stays fixed across all later sections
  3) Placeholder sections wait for future CMS-driven content
*/

const SECTIONS = [
  {
    id: "home",
    menuLabel: "Home",
    label: `${mockHero.firstName} ${mockHero.lastName}`,
    sub: mockHero.role,
  },
  { id: "work", menuLabel: "Selected Work", label: "Selected Work", sub: "01" },
  { id: "experience", menuLabel: "Experience", label: "Experience", sub: "02" },
  {
    id: "capabilities",
    menuLabel: "Capabilities",
    label: "Capabilities",
    sub: "03",
  },
  { id: "contact", menuLabel: "Contact", label: "Contact", sub: "04" },
];

const SECTION_IDS = SECTIONS.map((section) => section.id);

function Home() {
  const sceneRef = useRef(null);
  const progress = useScrollProgress(sceneRef);

  const activeId = useActiveSection(SECTION_IDS);
  const activeSection = SECTIONS.find((section) => section.id === activeId);

  // Rail stays hidden through the whole hero — only the empty gap
  // opens. It jumps in once the 2nd section (work) becomes active.
  const sidebarVisible = activeId !== "home";

  return (
    <div className="home">
      <SidebarSlot
        visible={sidebarVisible}
        activeSection={activeSection}
        menuItems={SECTIONS}
      />

      <div id="home">
        <ScrollScene ref={sceneRef} progress={progress}>
          <Hero />
        </ScrollScene>
      </div>

      <div className="home__content">
        <div id="work">
          <PlaceholderSection code="01" title="Selected Work" />
        </div>
        <div id="experience">
          <PlaceholderSection code="02" title="Experience" />
        </div>
        <div id="capabilities">
          <PlaceholderSection code="03" title="Capabilities" />
        </div>
        <div id="contact">
          <PlaceholderSection code="04" title="Contact" />
        </div>
      </div>
    </div>
  );
}

export default Home;
