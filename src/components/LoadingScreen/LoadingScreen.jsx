import { useEffect, useState } from "react";
import "./LoadingScreen.css";

/*
  Cinematic loading experience:
  - One complete playful sentence at a time
    (blur out → blur in, vertical drift)
  - Progress grows naturally, finishes the final sentence at 100%,
    pauses, then the whole screen fades to reveal the Hero
*/

const PHRASES = [
  "Asking CSS to cooperate today...",
  "npm is doing npm things...",
  "Trying not to anger TypeScript...",
  "Waiting for JavaScript to finish thinking...",
  "Convincing the div to stay where it belongs...",
  "Making 127 console.logs disappear...",
  "Fixing the fix for the previous fix...",
];

const FINAL_PHRASE = "One more commit... probably.";

const ROTATE_EVERY_MS = 1900; // time each phrase stays on screen
const TAIL_OUT_MS = 380; // matches tail-out animation duration
const PAUSE_AT_100_MS = 1500; // let the final sentence breathe
const FADE_OUT_MS = 850; // matches CSS opacity transition

function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Lock scroll while the curtain is up
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Natural progress: bigger steps early, easing near the end
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) return 100;
        const remaining = 100 - current;
        const step = Math.max(0.6, remaining * (0.04 + Math.random() * 0.05));
        const next = current + step;
        return next >= 99.5 ? 100 : next;
      });
    }, 150);

    return () => clearInterval(id);
  }, []);

  // Rotate the tail phrase until loading completes
  useEffect(() => {
    if (done) return;

    const id = setInterval(() => {
      setLeaving(true);
      setTimeout(() => {
        setPhraseIndex((index) => (index + 1) % PHRASES.length);
        setLeaving(false);
      }, TAIL_OUT_MS);
    }, ROTATE_EVERY_MS);

    return () => clearInterval(id);
  }, [done]);

  // Reaching 100%: final sentence → pause → fade → reveal
  useEffect(() => {
    if (progress < 100) return;
    setDone(true);

    setLeaving(true);
    const showFinal = setTimeout(() => {
      setPhraseIndex(-1);
      setLeaving(false);
    }, TAIL_OUT_MS);

    const startFade = setTimeout(() => setHidden(true), PAUSE_AT_100_MS);
    const finish = setTimeout(
      () => onComplete(),
      PAUSE_AT_100_MS + FADE_OUT_MS,
    );

    return () => {
      clearTimeout(showFinal);
      clearTimeout(startFade);
      clearTimeout(finish);
    };
  }, [progress, onComplete]);

  const tail = phraseIndex === -1 ? FINAL_PHRASE : PHRASES[phraseIndex];
  const percent = Math.floor(progress);

  return (
    <div
      className={`loading-screen${hidden ? " loading-screen--hidden" : ""}`}
      role="status"
      aria-label="Loading"
    >
      <p className="loading-screen__sentence">
        <span
          key={tail}
          className={`loading-screen__tail${leaving ? " loading-screen__tail--leaving" : ""}`}
        >
          {tail}
        </span>
      </p>

      <div className="loading-screen__progress">
        <div className="loading-screen__line" aria-hidden="true">
          <div
            className="loading-screen__line-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="loading-screen__percent">
          {String(percent).padStart(2, "0")}%
        </p>
      </div>
    </div>
  );
}

export default LoadingScreen;
