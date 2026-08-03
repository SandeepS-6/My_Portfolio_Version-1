import gsap from "gsap";
import { REVEAL_DURATION_MS } from "../LoadingScreen/loadingReveal";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function heroTargets(root) {
  if (!root) {
    return { socials: [], greeting: null, words: [], rule: null, bio: null };
  }
  return {
    socials: [...root.querySelectorAll(".hero-socials__link")],
    greeting: root.querySelector(".hero-pitch__greeting"),
    words: [...root.querySelectorAll(".hero-pitch__word")],
    rule: root.querySelector(".hero-rule__line"),
    bio: root.querySelector(".hero-pitch__bio"),
  };
}

function allNodes({ socials, greeting, words, rule, bio }) {
  return [greeting, bio, rule, ...socials, ...words].filter(Boolean);
}

/** Make sure copy is visible (recovery if an entrance was cancelled). */
export function showHeroText(root) {
  const targets = heroTargets(root);
  const nodes = allNodes(targets);
  if (nodes.length) gsap.set(nodes, { clearProps: "opacity,transform,y,scaleX" });
}

/** Park copy invisible until entrance runs. */
export function hideHeroText(root) {
  const { socials, greeting, words, rule, bio } = heroTargets(root);
  const fade = [greeting, bio, ...socials, ...words].filter(Boolean);

  if (fade.length) gsap.set(fade, { opacity: 0, y: 0 });
  if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "left center", opacity: 1 });
}

/**
 * Hero copy entrance after the loading reveal.
 * socials → greeting → headline words → rule → bio
 */
export function playHeroText(root, { onReady, onStart, delayMs } = {}) {
  if (!root) return () => {};

  const reduced = prefersReducedMotion();
  const wait = reduced ? 0 : (delayMs ?? REVEAL_DURATION_MS + 120);
  let ctx = null;
  let timer = 0;
  let started = false;

  const run = () => {
    started = true;
    onStart?.();

    const { socials, greeting, words, rule, bio } = heroTargets(root);

    if (reduced) {
      showHeroText(root);
      onReady?.();
      return;
    }

    ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => onReady?.(),
      });

      if (socials.length) {
        tl.fromTo(
          socials,
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.07 },
          0,
        );
      }

      if (greeting) {
        tl.fromTo(
          greeting,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.65 },
          0.08,
        );
      }

      if (words.length) {
        tl.fromTo(
          words,
          { opacity: 0, y: 42 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            stagger: 0.055,
            onComplete: () => onReady?.(),
          },
          0.22,
        );
      } else {
        onReady?.();
      }

      if (rule) {
        tl.fromTo(
          rule,
          { scaleX: 0, opacity: 1 },
          { scaleX: 1, opacity: 1, transformOrigin: "left center", duration: 0.75 },
          0.55,
        );
      }

      if (bio) {
        tl.fromTo(
          bio,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          0.65,
        );
      }
    }, root);
  };

  hideHeroText(root);

  if (wait <= 0) run();
  else timer = window.setTimeout(run, wait);

  return () => {
    if (timer) window.clearTimeout(timer);
    if (ctx) {
      ctx.revert();
    } else if (!started) {
      // Effect re-ran before delay fired — don't leave text stuck at opacity 0
      showHeroText(root);
    }
  };
}
