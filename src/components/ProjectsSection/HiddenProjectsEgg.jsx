import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import gsap from "gsap";
import TechStack from "./TechStack";
import {
  MOTE_DWELL_MS,
  createDriftPlan,
  firstSpawnDelay,
  nextSpawnDelay,
  prefersReducedMotion,
  randomBetween,
} from "../../utils/ProjectsSection/labMote";
import { lockPageScroll, playLabClose, playLabReveal } from "../../utils/ProjectsSection/labReveal";
import { mediaUrl } from "../../utils/mediaUrl";
import "./HiddenProjectsEgg.css";

function LabCard({ item, etaLabel }) {
  return (
    <article className="project-lab__card">
      <div className="project-lab__media">
        <img
          src={mediaUrl(item.image?.src)}
          alt={item.image?.alt || item.name}
          loading="lazy"
        />
        <span className="project-lab__phase">{item.phase}</span>
        <span className="project-lab__scan" aria-hidden="true" />
      </div>

      <div className="project-lab__body">
        <h4>{item.name}</h4>
        <p>{item.description}</p>

        <div className="project-lab__progress">
          <div
            className="project-lab__track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={item.progress}
            aria-label={`${item.name} progress`}
          >
            <span style={{ width: `${item.progress}%` }} />
          </div>
          <span>{item.progress}%</span>
        </div>

        <p className="project-lab__eta">
          {etaLabel || "Est. completion"} · {item.eta}
        </p>

        {item.features?.length ? (
          <ul className="project-lab__features">
            {item.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        ) : null}

        <TechStack items={item.techStack} />
      </div>
    </article>
  );
}

function HiddenProjectsEgg({ sectionRef, items = [], labels }) {
  const [phase, setPhase] = useState("idle");
  const [moteOn, setMoteOn] = useState(false);

  const moteRef = useRef(null);
  const veilRef = useRef(null);
  const riftRef = useRef(null);
  const panelRef = useRef(null);
  const focusRef = useRef(null);
  const driftTween = useRef(null);
  const spawnTimer = useRef(null);
  const dwellTimer = useRef(null);
  const armed = useRef(false);
  const busy = useRef(false);
  const phaseRef = useRef(phase);
  const firstPass = useRef(true);

  phaseRef.current = phase;
  const isLab = phase === "revealing" || phase === "open" || phase === "closing";

  function clearSpawn() {
    if (spawnTimer.current) {
      clearTimeout(spawnTimer.current);
      spawnTimer.current = null;
    }
  }

  function clearDrift() {
    if (driftTween.current) {
      driftTween.current.kill();
      driftTween.current = null;
    }
    setMoteOn(false);
  }

  function spawnMote() {
    const section = sectionRef?.current;
    const mote = moteRef.current;
    if (!section || !mote || busy.current) return;

    const rect = section.getBoundingClientRect();
    const height = Math.max(rect.height, 360);
    const width = rect.width;

    setMoteOn(true);

    if (prefersReducedMotion()) {
      gsap.set(mote, {
        x: randomBetween(width * 0.2, width * 0.8),
        y: randomBetween(height * 0.2, height * 0.75),
        autoAlpha: 0.5,
      });
      spawnTimer.current = setTimeout(() => {
        setMoteOn(false);
        queueMote(false);
      }, 8000);
      return;
    }

    const plan = createDriftPlan(width, height);
    gsap.set(mote, {
      x: plan.from.x,
      y: plan.from.y,
      autoAlpha: 0.4,
      scale: 1,
    });

    driftTween.current = gsap.to(mote, {
      x: plan.to.x,
      y: plan.to.y,
      duration: plan.duration,
      ease: "none",
      onComplete: () => {
        setMoteOn(false);
        queueMote(false);
      },
    });
  }

  function queueMote(isFirst) {
    clearSpawn();
    if (busy.current || !armed.current) return;

    const delay = isFirst ? firstSpawnDelay() : nextSpawnDelay();
    spawnTimer.current = setTimeout(spawnMote, delay);
  }

  function beginReveal() {
    if (busy.current || phaseRef.current !== "idle") return;
    busy.current = true;
    clearSpawn();
    clearDrift();
    setPhase("revealing");
    lockPageScroll(true);
  }

  function requestClose() {
    if (phaseRef.current !== "open") return;
    setPhase("closing");
  }

  useEffect(() => {
    const section = sectionRef?.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          if (armed.current || dwellTimer.current || busy.current) return;
          dwellTimer.current = setTimeout(() => {
            armed.current = true;
            dwellTimer.current = null;
            queueMote(firstPass.current);
            firstPass.current = false;
          }, MOTE_DWELL_MS);
        } else if (dwellTimer.current) {
          clearTimeout(dwellTimer.current);
          dwellTimer.current = null;
        }
      },
      { threshold: [0.35] },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      if (dwellTimer.current) clearTimeout(dwellTimer.current);
      clearSpawn();
      clearDrift();
    };
  }, [sectionRef]);

  useLayoutEffect(() => {
    if (phase !== "revealing") return undefined;

    return playLabReveal({
      section: sectionRef?.current,
      veil: veilRef.current,
      rift: riftRef.current,
      panel: panelRef.current,
      onDone: () => setPhase("open"),
    });
  }, [phase, sectionRef]);

  useLayoutEffect(() => {
    if (phase !== "closing") return undefined;

    return playLabClose({
      section: sectionRef?.current,
      veil: veilRef.current,
      rift: riftRef.current,
      panel: panelRef.current,
      onDone: () => {
        lockPageScroll(false);
        busy.current = false;
        setPhase("idle");
        armed.current = true;
        queueMote(false);
      },
    });
  }, [phase, sectionRef]);

  useEffect(() => {
    if (phase !== "open") return undefined;

    const previous = document.activeElement;
    focusRef.current?.focus();

    function onKey(event) {
      if (event.key === "Escape") requestClose();
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [phase]);

  useEffect(() => () => lockPageScroll(false), []);

  return (
    <div className="project-lab-root">
      <span
        ref={moteRef}
        className={`lab-mote${moteOn ? " is-on" : ""}`}
        aria-hidden="true"
        onClick={beginReveal}
      >
        <span className="lab-mote__core" />
        <span className="lab-mote__trail" />
      </span>

      {isLab ? (
        <div
          className="project-lab"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-lab-title"
        >
          <div ref={veilRef} className="project-lab__veil" aria-hidden="true">
            <span className="project-lab__noise" />
            <span className="project-lab__glitch project-lab__glitch--a" />
            <span className="project-lab__glitch project-lab__glitch--b" />
          </div>

          <div ref={riftRef} className="project-lab__rift" aria-hidden="true">
            <span className="project-lab__rift-ring" />
            <span className="project-lab__rift-core" />
          </div>

          <button
            type="button"
            className="project-lab__backdrop"
            aria-label={labels.labClose || "Close laboratory"}
            onClick={requestClose}
            tabIndex={phase === "open" ? 0 : -1}
          />

          <div ref={panelRef} className="project-lab__panel">
            <div ref={focusRef} tabIndex={-1} className="project-lab__focus">
              <header className="project-lab__head">
                <div>
                  <p className="project-lab__eyebrow">
                    {labels.labClearance || "Clearance granted"}
                  </p>
                  <h3 id="project-lab-title" className="project-lab__title">
                    {labels.hiddenTitle || "Experimental Lab"}
                  </h3>
                  <p className="project-lab__lead">{labels.hiddenLead}</p>
                </div>
                <button
                  type="button"
                  className="project-lab__close"
                  aria-label="Close"
                  onClick={requestClose}
                >
                  <X size={18} />
                </button>
              </header>

              <div className="project-lab__grid">
                {items.map((item) => (
                  <LabCard
                    key={item.id}
                    item={item}
                    etaLabel={labels.labEta}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default HiddenProjectsEgg;
