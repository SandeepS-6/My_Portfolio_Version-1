import { useEffect, useRef } from "react";
import TimelineItem from "./TimelineItem";
import { EducationIcon } from "./AboutIcons";
import { bindTimelineMotion } from "../../utils/AboutSection/timelineMotion";
import "./EducationTimeline.css";

function EducationTimeline({ items = [], title = "Education" }) {
  const rootRef = useRef(null);

  useEffect(() => {
    return bindTimelineMotion(rootRef.current);
  }, [items]);

  if (!items.length) return null;

  return (
    <section className="about-panel" aria-labelledby="about-education-title">
      <div className="about-panel__head">
        <h3 id="about-education-title" className="about-panel__title">
          {title}
        </h3>
        <p className="about-panel__sub">Where I learned the craft</p>
      </div>

      <ol className="about-tl" ref={rootRef}>
        {items.map((item, index) => (
          <TimelineItem
            key={item.id}
            order={index}
            showLine={index < items.length - 1}
            icon={<EducationIcon />}
            title={item.institution}
            subtitle={item.degree}
            meta={item.period}
            detail={item.grade}
          />
        ))}
      </ol>
    </section>
  );
}

export default EducationTimeline;
