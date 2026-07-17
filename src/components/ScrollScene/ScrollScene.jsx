import "./ScrollScene.css";

/*
  Immersive hero pin:

  - Tall section creates scroll room (hero stays on screen)
  - Sticky stage is always 100vh
  - Left rail WIDTH grows with scroll → hero is pushed right for real
  - The fixed SidebarSlot (rendered by Home) slides in over the gap
    near the end of the shift and stays for all later sections
*/

const GAP_MAX = 72; // slim rail width (matches --sidebar-rail)

function ScrollScene({ ref, progress, children }) {
  const gapWidth = progress * GAP_MAX;

  return (
    <section
      className="scroll-scene"
      ref={ref}
      aria-label="Hero introduction scene"
    >
      <div className="scroll-scene__sticky">
        <div
          className="scroll-scene__gap"
          style={{ width: `${gapWidth}px` }}
          aria-hidden="true"
        />

        <div className="scroll-scene__hero">{children}</div>
      </div>
    </section>
  );
}

export default ScrollScene;
