import { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import EducationTimeline from "./EducationTimeline";
import ExperienceTimeline from "./ExperienceTimeline";
import HelloMark from "./HelloMark";
import { getAbout, peekAbout } from "../../services/about";
import { mockAbout } from "../../data/mockAbout";
import "./AboutSection.css";

function AboutSection() {
  const [data, setData] = useState(() => peekAbout() || mockAbout);

  useEffect(() => {
    let alive = true;

    getAbout()
      .then((next) => {
        if (alive && next) setData(next);
      })
      .catch((error) => {
        console.warn("[about] Failed to load about.", error.message);
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="about" id="about" aria-label={data.eyebrow || "About"}>
      <div className="about__inner">
        <div className="about__stack">
          <ProfileCard data={data} />

          <div className="about__timelines-wrap">
            <HelloMark text={data.hello} asBackground />

            <div className="about__timelines">
              <EducationTimeline items={data.education} />
              <ExperienceTimeline items={data.experience} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
