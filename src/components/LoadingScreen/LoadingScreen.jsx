import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { runLoadingReveal } from "../../utils/LoadingScreen/loadingReveal";
import "./LoadingScreen.css";

const PHRASES = [
  "Asking CSS to cooperate today...",
  "npm is doing npm things...",
  "Trying not to anger TypeScript...",
  "Waiting for JavaScript to finish thinking...",
  "Convincing the div to stay where it belongs...",
  "Making 127 console.logs disappear...",
  "Fixing the fix for the previous fix...",
];

/* Appended only after the existing list has been shown once */
const EXTRA_PHRASES = [
  "Waking up the servers...",
  "Backend is stretching its legs...",
  "Waiting for the API to say hello...",
  "Almost there — databases hate mornings...",
  "Still fetching the good stuff...",
  "Holding the curtain until everything's real...",
];

const WAIT_PHRASES = [...PHRASES, ...EXTRA_PHRASES];

const FINAL_PHRASE = "One more commit... probably.";

const ROTATE_EVERY_MS = 1900;
const TAIL_OUT_MS = 380;
/* Pause hard climb here until contentReady; then soft-creep toward 99 */
const WAIT_CAP = 90;
const SOFT_CAP = 99;

function LoadingScreen({ onComplete, onProgress, contentReady = false }) {
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);

  // Lock scroll while the curtain is up (html + body)
  useEffect(() => {
    const html = document.documentElement;
    const { body } = document;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  useEffect(() => {
    onProgress?.(progress);
  }, [progress, onProgress]);

  // Climb toward 100 when ready; otherwise ease toward SOFT_CAP so % stays alive
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) return 100;

        if (contentReady) {
          const remaining = 100 - current;
          const step = Math.max(2.2, remaining * 0.18);
          return Math.min(100, current + step);
        }

        if (current < WAIT_CAP) {
          const remaining = WAIT_CAP - current;
          const step = Math.max(1.8, remaining * 0.12);
          return Math.min(WAIT_CAP, current + step);
        }

        // Still waiting on the API — creep slowly so the percent feels alive
        if (current >= SOFT_CAP) return current;
        return Math.min(SOFT_CAP, current + 0.12);
      });
    }, 120);

    return () => clearInterval(id);
  }, [contentReady]);

  useEffect(() => {
    if (done) return;

    const id = setInterval(() => {
      setLeaving(true);
      setTimeout(() => {
        setPhraseIndex((index) => (index + 1) % WAIT_PHRASES.length);
        setLeaving(false);
      }, TAIL_OUT_MS);
    }, ROTATE_EVERY_MS);

    return () => clearInterval(id);
  }, [done]);

  // Hit 100 → final line briefly → circular reveal into the page
  useEffect(() => {
    if (progress < 100) return;
    setDone(true);

    setLeaving(true);
    const showFinal = setTimeout(() => {
      setPhraseIndex(-1);
      setLeaving(false);
    }, TAIL_OUT_MS);

    const startReveal = setTimeout(() => {
      runLoadingReveal(() => {
        flushSync(() => onComplete());
      });
    }, TAIL_OUT_MS + 280);

    return () => {
      clearTimeout(showFinal);
      clearTimeout(startReveal);
    };
  }, [progress, onComplete]);

  const message =
    phraseIndex === -1 ? FINAL_PHRASE : WAIT_PHRASES[phraseIndex];
  const percent = Math.min(100, Math.round(progress));

  return (
    <div className="loading-screen" role="status" aria-label="Loading">
      <p className="loading-screen__message">
        <span
          key={message}
          className={`loading-screen__text${leaving ? " loading-screen__text--leaving" : ""}`}
        >
          {message}
        </span>
      </p>

      <p className="loading-screen__percent" aria-live="polite">
        {percent}%
      </p>
    </div>
  );
}

export default LoadingScreen;
