import { useEffect, useMemo, useRef, useState } from "react";
import { getWhatIDo, peekWhatIDo } from "../../services/whatIDo";
import { WhatIDoIcon } from "./whatIDoIcons";
import { bindCardAutoHover } from "../../utils/WhatIDo/cardAutoHover";
import { bindWhatIDoCinema } from "../../utils/WhatIDo/whatIDoMotion";
import "./WhatIDo.css";

function RibbonUnit({ emptyWord = "WHAT", fillWord = "I DO" }) {
  return (
    <span className="what-i-do__marquee-unit">
      <span className="what-i-do__marquee-word what-i-do__marquee-word--empty">
        {emptyWord}
      </span>
      <span className="what-i-do__marquee-gap" aria-hidden="true">
        {"\u00A0"}
      </span>
      <span className="what-i-do__marquee-word what-i-do__marquee-word--fill">
        {fillWord}
      </span>
      <span className="what-i-do__marquee-gap" aria-hidden="true">
        {"\u00A0\u00A0"}
      </span>
    </span>
  );
}

function splitMarquee(text) {
  const raw = String(text || "WHAT I DO").trim() || "WHAT I DO";
  const parts = raw.split(/\s+/);
  if (parts.length < 2) {
    return { emptyWord: raw, fillWord: raw };
  }
  return {
    emptyWord: parts[0],
    fillWord: parts.slice(1).join(" "),
  };
}

function RibbonTrack({ count = 16, emptyWord, fillWord }) {
  const units = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  return (
    <div className="what-i-do__title-track">
      <div className="what-i-do__marquee-drift">
        <span className="what-i-do__marquee-segment">
          {units.map((i) => (
            <RibbonUnit key={`a-${i}`} emptyWord={emptyWord} fillWord={fillWord} />
          ))}
        </span>
        <span className="what-i-do__marquee-segment">
          {units.map((i) => (
            <RibbonUnit key={`b-${i}`} emptyWord={emptyWord} fillWord={fillWord} />
          ))}
        </span>
      </div>
    </div>
  );
}

function WhatIDoCard({ item, index }) {
  const num = String(index + 1).padStart(2, "0");
  const span = item.span === 2 ? 2 : 1;

  return (
    <li className={`what-i-do__card what-i-do__card--span-${span}`}>
      <span className="what-i-do__card-bg" aria-hidden="true">
        {num}
      </span>

      <div className="what-i-do__card-top">
        <span className="what-i-do__card-meta">
          <WhatIDoIcon name={item.icon} />
          <span className="what-i-do__phase">
            {item.phase || "WORK"}
            <span className="what-i-do__phase-sep" aria-hidden="true">
              ·
            </span>
            {num}
          </span>
        </span>
        {item.accentDot ? (
          <span className="what-i-do__accent-dot" aria-hidden="true" />
        ) : null}
      </div>

      <h3 className="what-i-do__card-title">
        {item.title}
        {item.accentPeriod ? (
          <span className="what-i-do__accent-period" aria-hidden="true">
            .
          </span>
        ) : null}
      </h3>

      {item.detail ? (
        <p className="what-i-do__card-detail">{item.detail}</p>
      ) : null}
    </li>
  );
}

function WhatIDo() {
  const sectionRef = useRef(null);
  const [data, setData] = useState(() => peekWhatIDo());

  useEffect(() => {
    let alive = true;

    getWhatIDo()
      .then((payload) => {
        if (alive) setData(payload);
      })
      .catch((error) => {
        console.warn("[what-i-do] Failed to load.", error.message);
      });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!data || !sectionRef.current) return undefined;

    let cleanupCinema = () => {};
    let cleanupHover = () => {};

    const frame = window.requestAnimationFrame(() => {
      if (!sectionRef.current) return;
      cleanupCinema = bindWhatIDoCinema(sectionRef.current) || (() => {});
      cleanupHover = bindCardAutoHover(sectionRef.current) || (() => {});
    });

    return () => {
      window.cancelAnimationFrame(frame);
      cleanupCinema();
      cleanupHover();
    };
  }, [data]);

  if (!data) return null;

  const { title, lead, items = [], marqueeText, cinemaTitle } = data;
  const ribbon = splitMarquee(marqueeText || cinemaTitle);

  return (
    <section
      ref={sectionRef}
      className="what-i-do"
      aria-label={title || "What I Do"}
    >
      <div className="what-i-do__stage">
        <div className="what-i-do__scene">
          <div className="what-i-do__scene-inner">
            <header className="what-i-do__header">
              {title ? <h2 className="what-i-do__title">{title}</h2> : null}
              {lead ? <p className="what-i-do__lead">{lead}</p> : null}
            </header>

            {items.length > 0 ? (
              <ul className="what-i-do__grid">
                {items.map((item, index) => (
                  <WhatIDoCard key={item.id} item={item} index={index} />
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="what-i-do__doors" aria-hidden="true">
          <div className="what-i-do__ribbon what-i-do__ribbon--top">
            <RibbonTrack emptyWord={ribbon.emptyWord} fillWord={ribbon.fillWord} />
          </div>
          <div className="what-i-do__ribbon what-i-do__ribbon--bottom">
            <RibbonTrack emptyWord={ribbon.emptyWord} fillWord={ribbon.fillWord} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhatIDo;
