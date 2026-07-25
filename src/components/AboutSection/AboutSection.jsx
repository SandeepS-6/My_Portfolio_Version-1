import { useEffect, useState } from "react";
import { getAbout } from "../../services/about";
import AboutProfile from "./AboutProfile";
import AboutSnapshot from "./AboutSnapshot";
import AboutExperience from "./AboutExperience";
import AboutEducation from "./AboutEducation";
import AboutLife from "./AboutLife";
import "./AboutSection.css";

function AboutSection() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    let alive = true;

    getAbout()
      .then((data) => {
        if (alive) setAbout(data);
      })
      .catch((error) => {
        console.warn("[about] Failed to load about data.", error.message);
      });

    return () => {
      alive = false;
    };
  }, []);

  if (!about) return null;

  return (
    <section className="about" id="about" aria-label={about.title || "About"}>
      <div className="about__inner">
        <header className="about__header">
          {about.eyebrow ? (
            <p className="about__eyebrow">{about.eyebrow}</p>
          ) : null}
          {about.title ? <h2 className="about__title">{about.title}</h2> : null}
        </header>

        <div className="about__intro">
          <AboutProfile about={about} />
          <AboutSnapshot about={about} />
        </div>

        <AboutExperience about={about} />
        <AboutEducation about={about} />
        <AboutLife about={about} />
      </div>
    </section>
  );
}

export default AboutSection;
