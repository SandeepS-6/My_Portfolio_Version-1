import "./ScrollScene.css";

/*
  Immersive hero pin:

  - Tall section creates scroll room (hero stays on screen)
  - Sticky stage is always 100vh
  - Left rail WIDTH grows with scroll → hero is pushed right for real
  - Gap width is written by useScrollGap (ref) so scroll stays off React
*/

function ScrollScene({ ref, gapRef, dark = false, children }) {
  return (
    <section
      className={`scroll-scene${dark ? " scroll-scene--dark" : ""}`}
      ref={ref}
      aria-label="Hero introduction scene"
    >
      <div className="scroll-scene__sticky">
        <div
          className="scroll-scene__gap"
          ref={gapRef}
          aria-hidden="true"
        />

        <div className="scroll-scene__hero">{children}</div>
      </div>
    </section>
  );
}

export default ScrollScene;
