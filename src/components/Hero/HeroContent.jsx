import { useEffect, useState } from "react";
import Button from "../Button/Button";
import { getHero } from "../../services/hero";
import mockHero from "../../data/mockHero";
import "./HeroContent.css";

function HeroContent() {
  const [hero, setHero] = useState(mockHero);

  useEffect(() => {
    let alive = true;

    getHero().then((data) => {
      if (alive && data) setHero(data);
    });

    return () => {
      alive = false;
    };
  }, []);

  const {
    firstName,
    lastName,
    role,
    quote,
    dateOfBirth,
    dateLabel,
    greeting,
    headline,
    bio,
    primaryCta,
  } = hero;

  return (
    <div className="hero-content">
      <header className="hero-identity">
        <p className="hero-identity__name">
          <span>{firstName}</span>
          <span>{lastName}</span>
        </p>
        <p className="hero-identity__role">{role}</p>

        <div className="hero-rule" aria-hidden="true">
          <span className="hero-rule__bead" />
          <span className="hero-rule__line" />
          <span className="hero-rule__bead" />
        </div>

        <p className="hero-identity__quote">&ldquo;{quote}&rdquo;</p>
        <p className="hero-identity__dates">
          {dateOfBirth}
          <span className="hero-identity__dates-sep">—</span>
          {dateLabel}
        </p>
      </header>

      <div className="hero-pitch">
        <p className="hero-pitch__greeting">{greeting}</p>
        <h1 className="hero-pitch__headline">{headline}</h1>
        <p className="hero-pitch__bio">{bio}</p>

        <div className="hero-pitch__actions">
          <Button variant="primary" asLink href={primaryCta?.href || "#work"}>
            {primaryCta?.label || "View My Work"}
            <span className="btn__icon" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HeroContent;
