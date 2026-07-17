import { useRef } from "react";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import SidebarSlot from "../SidebarSlot/SidebarSlot";
import "./ScrollScene.css";

/*
  Immersive hero pin:

  - Tall section creates scroll room (hero stays on screen)
  - Sticky stage is always 100vh
  - Left rail WIDTH grows with scroll → hero is pushed right for real
  - Sidebar slot fades in only after the gap is mostly open
*/

const GAP_MAX = 220; // px reserved for future sidebar
const SIDEBAR_SHOW_AT = 0.72; // show slot near end of shift

function ScrollScene({ children }) {
  const sectionRef = useRef(null);
  const progress = useScrollProgress(sectionRef);

  const gapWidth = progress * GAP_MAX;
  const sidebarVisible = progress >= SIDEBAR_SHOW_AT;

  return (
    <section
      className="scroll-scene"
      ref={sectionRef}
      aria-label="Hero introduction scene"
    >
      <div className="scroll-scene__sticky">
        <div
          className="scroll-scene__gap"
          style={{ width: `${gapWidth}px` }}
          aria-hidden={!sidebarVisible}
        >
          <SidebarSlot visible={sidebarVisible} />
        </div>

        <div className="scroll-scene__hero">{children}</div>
      </div>
    </section>
  );
}

export default ScrollScene;
