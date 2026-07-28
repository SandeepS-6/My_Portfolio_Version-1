import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Hand } from "lucide-react";
import { getHero, peekHero } from "../../services/hero";
import { getFooter, peekFooter } from "../../services/footer";
import MorphingText from "../MorphingText/MorphingText";
import { measureLinePlacement } from "./heroRuleInset";
import { playHeroText, showHeroText } from "./heroTextMotion";
import "./HeroContent.css";

function parseHeadline(text) {
  if (!text) return [];
  const parts = [];
  const pattern = /\*\*(.+?)\*\*/g;
  let last = 0;
  let match = pattern.exec(text);

  while (match) {
    if (match.index > last) {
      parts.push({ text: text.slice(last, match.index), accent: false });
    }
    parts.push({ text: match[1], accent: true });
    last = match.index + match[0].length;
    match = pattern.exec(text);
  }

  if (last < text.length) {
    parts.push({ text: text.slice(last), accent: false });
  }

  return parts.length ? parts : [{ text, accent: false }];
}

function plainHeadline(text) {
  return (text || "").replace(/\*\*(.+?)\*\*/g, "$1");
}

function renderHeadlineWords(parts) {
  const nodes = [];

  parts.forEach((part, partIndex) => {
    const chunks = part.text.split(/(\s+)/);
    chunks.forEach((chunk, chunkIndex) => {
      if (!chunk) return;
      if (/^\s+$/.test(chunk)) {
        nodes.push(chunk);
        return;
      }
      nodes.push(
        <span
          key={`${partIndex}-${chunkIndex}`}
          className={
            part.accent ? "hero-pitch__word hero-pitch__accent" : "hero-pitch__word"
          }
        >
          {chunk}
        </span>,
      );
    });
  });

  return nodes;
}

function socialRank(link) {
  const label = String(link?.label || "").toLowerCase();
  const href = String(link?.href || "").toLowerCase();
  if (label.includes("linkedin") || href.includes("linkedin")) return 0;
  if (label.includes("instagram") || href.includes("instagram")) return 1;
  return 2;
}

function orderHeroSocials(links) {
  return [...links].sort((a, b) => socialRank(a) - socialRank(b));
}

function socialsFromFooter(footer) {
  if (!footer?.socials?.length) return [];
  return orderHeroSocials(footer.socials);
}

function HeroContent() {
  const [hero, setHero] = useState(() => peekHero());
  const [socials, setSocials] = useState(() => socialsFromFooter(peekFooter()));
  const [lineLeft, setLineLeft] = useState(0);
  const rootRef = useRef(null);
  const handRef = useRef(null);
  const quoteRef = useRef(null);
  const bandRef = useRef(null);
  const textPlayedRef = useRef(false);

  useEffect(() => {
    let alive = true;

    getHero()
      .then((heroData) => {
        if (alive && heroData) setHero(heroData);
      })
      .catch((error) => {
        console.warn("[hero] Failed to load hero.", error.message);
      });

    getFooter()
      .then((footer) => {
        if (!alive) return;
        const next = socialsFromFooter(footer);
        if (next.length) setSocials(next);
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const node = handRef.current;
    if (!node || !hero) return undefined;

    let cancelled = false;
    let timer = 0;

    const bump = () => {
      if (cancelled) return;
      node.classList.remove("hero-pitch__wave--on");
      void node.offsetWidth;
      node.classList.add("hero-pitch__wave--on");
    };

    const start = window.requestAnimationFrame(() => {
      bump();
      timer = window.setInterval(bump, 2200);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(start);
      window.clearInterval(timer);
    };
  }, [hero]);

  const firstName = hero?.firstName;
  const lastName = hero?.lastName;
  const quote = hero?.quote;
  const headline = hero?.headline;
  const bio = hero?.bio;

  const nameTexts = [firstName, lastName].filter(Boolean);

  const quoteText = headline?.trim() || quote?.trim() || "";
  const quoteParts = useMemo(() => parseHeadline(quoteText), [quoteText]);
  const quotePlain = plainHeadline(quoteText);
  const headlineWords = useMemo(() => renderHeadlineWords(quoteParts), [quoteParts]);

  useLayoutEffect(() => {
    if (!hero || !rootRef.current) return undefined;

    const root = rootRef.current;

    const syncLine = () => {
      const quoteNode = quoteRef.current;
      const band = bandRef.current;
      if (!quoteNode || !band) return;
      setLineLeft(measureLinePlacement(quoteNode, band).left);
    };

    // Already played — keep text visible (do not re-hide)
    if (textPlayedRef.current) {
      showHeroText(root);
      syncLine();
      return undefined;
    }

    return playHeroText(root, {
      onStart: () => {
        textPlayedRef.current = true;
      },
      onReady: syncLine,
    });
  }, [quotePlain]);

  useEffect(() => {
    const quoteNode = quoteRef.current;
    const band = bandRef.current;
    if (!quoteNode || !band || !hero) return undefined;

    let frame = 0;

    function syncPlace() {
      frame = 0;
      setLineLeft(measureLinePlacement(quoteNode, band).left);
    }

    function requestSync() {
      if (frame) return;
      frame = window.requestAnimationFrame(syncPlace);
    }

    requestSync();
    const late = window.setTimeout(requestSync, 100);
    const later = window.setTimeout(requestSync, 400);
    window.addEventListener("resize", requestSync);

    const ro = new ResizeObserver(requestSync);
    ro.observe(quoteNode);
    ro.observe(band);

    return () => {
      window.clearTimeout(late);
      window.clearTimeout(later);
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", requestSync);
      ro.disconnect();
    };
  }, [quotePlain, hero]);

  if (!hero) return null;

  return (
    <div className="hero-content" ref={rootRef}>
      <div className="hero-content__top">
        <span className="hero-content__top-spacer" aria-hidden="true" />
        {socials.length > 0 ? (
          <nav className="hero-socials" aria-label="Social links">
            {socials.map((link) => (
              <a
                key={link.label}
                className="hero-socials__link"
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                <span>{link.label}</span>
                <ArrowUpRight size={14} strokeWidth={2.2} aria-hidden="true" />
              </a>
            ))}
          </nav>
        ) : null}
      </div>

      <div className="hero-content__body">
        <div className="hero-pitch">
          <p className="hero-pitch__greeting">
            <span className="hero-pitch__wave" ref={handRef} aria-hidden="true">
              <Hand size={18} strokeWidth={2} />
            </span>
            <span>Hey I am </span>
            {nameTexts.length ? (
              <MorphingText
                texts={nameTexts}
                className="hero-pitch__morph"
                startDelay={4}
              />
            ) : null}
          </p>
        </div>

        <div className="hero-band" ref={bandRef}>
          {quotePlain ? (
            <h1 ref={quoteRef} className="hero-pitch__quote">
              {headlineWords}
            </h1>
          ) : null}

          <div
            className="hero-rule"
            style={{
              "--hero-line-left": `${lineLeft}px`,
            }}
          >
            <span className="hero-rule__line" aria-hidden="true" />
            {bio ? <p className="hero-pitch__bio">{bio}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroContent;
