import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { runLoadingReveal } from "./loadingReveal";
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

const FINAL_PHRASE = "One more commit... probably.";

const ROTATE_EVERY_MS = 1900;
const TAIL_OUT_MS = 380;
/* Hold here until hero (contentReady) finishes loading */
const WAIT_CAP = 90;

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

  // Climb toward 100, but pause under WAIT_CAP until hero is ready
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) return 100;
        const cap = contentReady ? 100 : WAIT_CAP;
        if (current >= cap) return current;
        const remaining = cap - current;
        const step = Math.max(1.8, remaining * 0.12);
        return Math.min(cap, current + step);
      });
    }, 120);

    return () => clearInterval(id);
  }, [contentReady]);

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

  const tail = phraseIndex === -1 ? FINAL_PHRASE : PHRASES[phraseIndex];
  const percent = Math.min(100, Math.round(progress));

  return (
    <div className="loading-screen" role="status" aria-label="Loading">
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
