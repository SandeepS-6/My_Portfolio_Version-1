import { useEffect, useState } from "react";
import Button from "../Button/Button";
import { getSkillsSection } from "../../services/skillsSection";
import SkillGroup from "./SkillGroup";
import "./SkillsSection.css";

function visibleSkills(skills = []) {
  return skills
    .filter((skill) => skill.isVisible !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
}

function SkillsSection() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;

    getSkillsSection()
      .then((payload) => {
        if (alive) setData(payload);
      })
      .catch((error) => {
        console.warn("[skills-section] Failed to load.", error.message);
      });

    return () => {
      alive = false;
    };
  }, []);

  if (!data) return null;

  const {
    backdrop,
    headline,
    lead,
    servicesTitle,
    services = [],
    capabilitiesTitle,
    capabilities = [],
    skillGroupTitles = {},
    learningTitle,
    cta,
  } = data;

  const skills = visibleSkills(data.skills);
  const groups = [
    {
      key: "technical",
      title: skillGroupTitles.technical,
      items: skills.filter((s) => s.group === "technical"),
    },
    {
      key: "frameworks",
      title: skillGroupTitles.frameworks,
      items: skills.filter((s) => s.group === "frameworks"),
    },
    {
      key: "tools",
      title: skillGroupTitles.tools,
      items: skills.filter((s) => s.group === "tools"),
    },
  ].filter((group) => group.items.length > 0);

  const learning = skills.filter((s) => s.group === "learning");

  return (
    <section className="skills" id="skills" aria-label="Skills">
      <div className="skills__backdrop" aria-hidden="true">
        <span className="skills__backdrop-word">{backdrop}</span>
        <span className="skills__backdrop-glow" />
      </div>

      <div className="skills__inner">
        <header className="skills__header">
          {headline ? <h2 className="skills__title">{headline}</h2> : null}
          {lead ? <p className="skills__lead">{lead}</p> : null}
        </header>

        {services.length > 0 ? (
          <div className="skills__band">
            {servicesTitle ? (
              <h3 className="skills__band-title">{servicesTitle}</h3>
            ) : null}
            <ul className="skills__services">
              {services.map((service) => (
                <li key={service.id} className="skills__service">
                  <p className="skills__service-title">{service.title}</p>
                  <p className="skills__service-detail">{service.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {capabilities.length > 0 ? (
          <div className="skills__band">
            {capabilitiesTitle ? (
              <h3 className="skills__band-title">{capabilitiesTitle}</h3>
            ) : null}
            <ul className="skills__capabilities">
              {capabilities.map((cap) => (
                <li key={cap.id} className="skills__capability">
                  <p className="skills__capability-title">{cap.title}</p>
                  <p className="skills__capability-detail">{cap.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {groups.length > 0 ? (
          <div className="skills__groups">
            {groups.map((group) => (
              <SkillGroup
                key={group.key}
                title={group.title}
                skills={group.items}
              />
            ))}
          </div>
        ) : null}

        {learning.length > 0 ? (
          <div className="skills__band skills__band--learning">
            {learningTitle ? (
              <h3 className="skills__band-title">{learningTitle}</h3>
            ) : null}
            <SkillGroup skills={learning} />
          </div>
        ) : null}

        {cta ? (
          <div className="skills__cta">
            {cta.title ? <p className="skills__cta-title">{cta.title}</p> : null}
            {cta.note ? <p className="skills__cta-note">{cta.note}</p> : null}
            <Button variant="primary" asLink href={cta.href || "/lets-talk"}>
              {cta.label || "Let's talk"}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default SkillsSection;
