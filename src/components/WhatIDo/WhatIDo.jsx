import { useEffect, useMemo, useRef, useState } from "react";
import { getWhatIDo } from "../../services/whatIDo";
import { getWhatIDoIcon } from "./whatIDoIcons";
import { bindWhatIDoCinema } from "./whatIDoMotion";
import "./WhatIDo.css";

function RibbonUnit() {
  return (
    <span className="what-i-do__marquee-unit">
      <span className="what-i-do__marquee-word what-i-do__marquee-word--empty">
        WHAT
      </span>
      <span className="what-i-do__marquee-gap" aria-hidden="true">
        {"\u00A0"}
      </span>
      <span className="what-i-do__marquee-word what-i-do__marquee-word--fill">
        I DO
      </span>
      <span className="what-i-do__marquee-sep" aria-hidden="true">
        /
      </span>
    </span>
  );
}

function RibbonTrack({ count = 16 }) {
  const units = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  return (
    <div className="what-i-do__title-track">
      <div className="what-i-do__marquee-drift">
        <span className="what-i-do__marquee-segment">
          {units.map((i) => (
            <RibbonUnit key={`a-${i}`} />
          ))}
        </span>
        <span className="what-i-do__marquee-segment">
          {units.map((i) => (
            <RibbonUnit key={`b-${i}`} />
          ))}
        </span>
      </div>
    </div>
  );
}

function WhatIDo() {
  const sectionRef = useRef(null);
  const [data, setData] = useState(null);

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
    return bindWhatIDoCinema(sectionRef.current);
  }, [data]);

  if (!data) return null;

  const {
    eyebrow,
    title,
    lead,
    items = [],
  } = data;

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
              {eyebrow ? (
                <p className="what-i-do__eyebrow">{eyebrow}</p>
              ) : null}
              {title ? <h2 className="what-i-do__title">{title}</h2> : null}
              {lead ? <p className="what-i-do__lead">{lead}</p> : null}
            </header>

            {items.length > 0 ? (
              <ul className="what-i-do__grid">
                {items.map((item, index) => {
                  const Icon = getWhatIDoIcon(item.icon);
                  return (
                    <li key={item.id} className="what-i-do__card">
                      <div className="what-i-do__card-top">
                        <span className="what-i-do__icon" aria-hidden="true">
                          <Icon size={18} strokeWidth={1.6} />
                        </span>
                        <span className="what-i-do__index" aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="what-i-do__card-title">{item.title}</h3>
                      {item.detail ? (
                        <p className="what-i-do__card-detail">{item.detail}</p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="what-i-do__doors" aria-hidden="true">
          <div className="what-i-do__ribbon what-i-do__ribbon--top">
            <RibbonTrack />
          </div>
          <div className="what-i-do__ribbon what-i-do__ribbon--bottom">
            <RibbonTrack />
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhatIDo;
