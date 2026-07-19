import { useRef } from "react";
import Hero from "../components/Hero/Hero";
import ScrollScene from "../components/ScrollScene/ScrollScene";
import SidebarSlot from "../components/SidebarSlot/SidebarSlot";
import PlaceholderSection from "../components/PlaceholderSection/PlaceholderSection";
import ContactSection from "../components/ContactSection/ContactSection";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { useActiveSection } from "../hooks/useActiveSection";
import { useElementOnScreen } from "../hooks/useElementOnScreen";
import mockHero from "../data/mockHero";
import "./Home.css";

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
  const activeSection =
    SECTIONS.find((section) => section.id === activeId) ?? SECTIONS[0];

  // Stay hidden until Contact has fully left the viewport (scroll up or down)
  const contactOnScreen = useElementOnScreen("contact");
  const sidebarVisible =
    activeId !== "home" && !contactOnScreen;

  return (
    <div className={`home${contactOnScreen ? " home--on-contact" : ""}`}>
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
        <ContactSection />
      </div>
    </div>
  );
}

export default Home;
