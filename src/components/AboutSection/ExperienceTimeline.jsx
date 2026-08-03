import { useEffect, useRef } from "react";
import TimelineItem from "./TimelineItem";
import { BriefcaseIcon } from "./AboutIcons";
import { bindTimelineMotion } from "../../utils/AboutSection/timelineMotion";
import "./EducationTimeline.css";

function ExperienceTimeline({ items = [], title = "Work Experience" }) {
  const rootRef = useRef(null);

  useEffect(() => {
    return bindTimelineMotion(rootRef.current);
  }, [items]);

  if (!items.length) return null;

  return (
    <section className="about-panel" aria-labelledby="about-experience-title">
      <div className="about-panel__head">
        <h3 id="about-experience-title" className="about-panel__title">
          {title}
        </h3>
        <p className="about-panel__sub">A focused career journey so far</p>
      </div>

      <ol className="about-tl" ref={rootRef}>
        {items.map((item, index) => (
          <TimelineItem
            key={item.id}
            order={index}
            showLine={index < items.length - 1}
            icon={<BriefcaseIcon />}
            logoText={item.logoText}
            title={item.company}
            subtitle={item.role}
            meta={item.period}
            detail={item.summary}
            tags={item.tech}
          />
        ))}
      </ol>
    </section>
  );
}

export default ExperienceTimeline;
