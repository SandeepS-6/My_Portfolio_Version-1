import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getSkillsSection, peekSkillsSection } from "../../services/skillsSection";
import { mediaUrl } from "../../utils/mediaUrl";
import { SkillsIcon } from "./skillsIcons";
import { bindSkillsMarquee } from "../../utils/SkillsSection/skillsMarquee";
import SkillsSummary from "./SkillsSummary";
import "./SkillsSection.css";

function techIconUrl(tech) {
  if (tech?.src) return mediaUrl(tech.src);
  if (!tech?.icon) return null;
  const color = String(tech.color || "2a2a32").replace("#", "");
  return `https://cdn.simpleicons.org/${tech.icon}/${color}`;
}

function starsFromValue(value, max = 5) {
  if (typeof value === "number" && value <= max) return value;
  const percent = Math.max(0, Math.min(100, Number(value) || 0));
  return Math.round((percent / 100) * max * 2) / 2;
}

function StarRating({ value = 0, max = 5, label = "" }) {
  const rating = starsFromValue(value, max);
  const stars = [];

  for (let i = 1; i <= max; i += 1) {
    let fill = "empty";
    if (rating >= i) fill = "full";
    else if (rating >= i - 0.5) fill = "half";
    stars.push(fill);
  }

  return (
    <span
      className="skills-stars"
      role="img"
      aria-label={label || `${rating} out of ${max} stars`}
    >
      {stars.map((fill, index) => (
        <span
          key={index}
          className={`skills-stars__star skills-stars__star--${fill}`}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </span>
  );
}

function TechLogo({ tech }) {
  const src = techIconUrl(tech);
  if (!src) return null;

  const tint = `#${String(tech.color || "2a2a32").replace("#", "")}`;

  return (
    <span
      className="skills-tech"
      title={tech.name}
      style={{ "--tech-tint": tint }}
    >
      <img src={src} alt="" width="20" height="20" loading="lazy" />
    </span>
  );
}

function StatCard({ stat }) {
  return (
    <li className="skills-stat">
      <span className="skills-stat__icon">
        <SkillsIcon name={stat.icon} size={18} />
      </span>
      <div className="skills-stat__copy">
        <p className="skills-stat__value">{stat.value}</p>
        <p className="skills-stat__label">{stat.label}</p>
      </div>
    </li>
  );
}

function categoryProjectsHref(category) {
  const tokens = [category.title, ...(category.techs || []).map((tech) => tech.name)]
    .filter(Boolean)
    .join(",");
  const params = new URLSearchParams({
    q: tokens,
    status: "all",
  });
  return `/?${params.toString()}#projects`;
}

function CategoryCard({ category }) {
  const count = category.techs?.length || 0;

  return (
    <article className={`skills-card skills-card--${category.tone || "sky"}`}>
      <span className="skills-card__icon">
        <SkillsIcon name={category.icon} size={22} />
      </span>
      <h3 className="skills-card__title">{category.title}</h3>
      {category.detail ? (
        <p className="skills-card__detail">{category.detail}</p>
      ) : null}
      {count > 0 ? (
        <div className="skills-card__techs">
          {category.techs.map((tech) => (
            <TechLogo key={tech.name} tech={tech} />
          ))}
        </div>
      ) : null}
      <p className="skills-card__footer">
        <span>
          {count} technolog{count === 1 ? "y" : "ies"}
        </span>
        <Link
          to={categoryProjectsHref(category)}
          className="skills-card__go"
          aria-label={`View ${category.title} projects`}
        >
          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
        </Link>
      </p>
    </article>
  );
}

function ExpertisePanel({ expertise }) {
  if (!expertise) return null;
  const overall = Math.max(0, Math.min(100, Number(expertise.overall) || 0));
  const ringStyle = {
    background: `conic-gradient(var(--color-accent) ${overall * 3.6}deg, var(--color-ink-a10) 0deg)`,
  };

  return (
    <div className="skills-expertise">
      {expertise.title ? (
        <h3 className="skills-panel__title">{expertise.title}</h3>
      ) : null}

      <div className="skills-expertise__ring-wrap">
        <div className="skills-expertise__ring" style={ringStyle}>
          <div className="skills-expertise__ring-core">
            <p className="skills-expertise__percent">{overall}%</p>
            <p className="skills-expertise__overall-label">
              {expertise.overallLabel || "Overall Proficiency"}
            </p>
          </div>
        </div>
      </div>

      {expertise.bars?.length ? (
        <ul className="skills-bars">
          {expertise.bars.map((bar) => (
            <li key={bar.id} className="skills-bar">
              <div className="skills-bar__meta">
                <span>{bar.label}</span>
                <StarRating
                  value={bar.stars ?? bar.value}
                  label={`${bar.label}: ${bar.stars ?? starsFromValue(bar.value)} stars`}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function FavouritesPanel({ favourites }) {
  if (!favourites?.techs?.length) return null;

  return (
    <div className="skills-favourites">
      <div className="skills-favourites__head">
        <div className="skills-favourites__title">
          <SkillsIcon name="heart" size={18} />
          {favourites.title ? (
            <h3 className="skills-panel__title">{favourites.title}</h3>
          ) : null}
        </div>
        {favourites.note ? (
          <p className="skills-favourites__note">{favourites.note}</p>
        ) : null}
      </div>

      <div className="skills-favourites__techs">
        {favourites.techs.map((tech) => (
          <TechLogo key={tech.name} tech={tech} />
        ))}
      </div>
    </div>
  );
}

function LearningCard({ learning }) {
  if (!learning) return null;
  const percent = Math.max(0, Math.min(100, Number(learning.percent) || 0));
  const logoSrc = techIconUrl(learning.tech);

  return (
    <div className="skills-learning">
      <span className="skills-learning__icon">
        {logoSrc ? (
          <img src={logoSrc} alt="" width="22" height="22" loading="lazy" />
        ) : (
          <SkillsIcon name={learning.icon || "sparkles"} size={22} />
        )}
      </span>
      <div className="skills-learning__copy">
        {learning.title ? (
          <p className="skills-learning__eyebrow">{learning.title}</p>
        ) : null}
        {learning.name ? (
          <h3 className="skills-learning__name">{learning.name}</h3>
        ) : null}
        {learning.detail ? (
          <p className="skills-learning__detail">{learning.detail}</p>
        ) : null}
        <div className="skills-learning__progress">
          <div className="skills-bar__track" aria-hidden="true">
            <span className="skills-bar__fill" style={{ width: `${percent}%` }} />
          </div>
          <span>{percent}%</span>
        </div>
      </div>
    </div>
  );
}

function MarqueeSegment({ techs, moreLabel, keyPrefix }) {
  return (
    <span className="skills-marquee__segment" data-marquee-segment>
      {techs.map((tech) => (
        <span className="skills-marquee__item" key={`${keyPrefix}-${tech.name}`}>
          <img
            src={techIconUrl(tech)}
            alt=""
            width="18"
            height="18"
            loading="lazy"
          />
          <span>{tech.name}</span>
        </span>
      ))}
      {moreLabel ? (
        <span className="skills-marquee__more">… {moreLabel}</span>
      ) : null}
    </span>
  );
}

function MarqueeRow({ techs, moreLabel, dir, rowKey }) {
  return (
    <div className="skills-marquee__viewport" data-marquee-row data-dir={dir}>
      <div className="skills-marquee__track" data-marquee-track>
        <MarqueeSegment
          techs={techs}
          moreLabel={moreLabel}
          keyPrefix={`${rowKey}-a`}
        />
        <MarqueeSegment
          techs={techs}
          moreLabel={moreLabel}
          keyPrefix={`${rowKey}-b`}
        />
      </div>
    </div>
  );
}

function TechMarquee({ marquee }) {
  const rootRef = useRef(null);
  const techs = marquee?.techs || [];

  useEffect(() => {
    if (!techs.length) return undefined;
    return bindSkillsMarquee(rootRef.current);
  }, [techs]);

  if (!techs.length) return null;

  return (
    <div className="skills-marquee" ref={rootRef}>
      {marquee.title ? (
        <h3 className="skills-panel__title">{marquee.title}</h3>
      ) : null}
      <div className="skills-marquee__rows">
        <MarqueeRow
          techs={techs}
          moreLabel={marquee.moreLabel}
          dir="rtl"
          rowKey="top"
        />
        <MarqueeRow
          techs={techs}
          moreLabel={marquee.moreLabel}
          dir="ltr"
          rowKey="bottom"
        />
      </div>
    </div>
  );
}

function SkillsSection() {
  const [data, setData] = useState(() => peekSkillsSection());

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
    eyebrow,
    headline,
    lead,
    stats = [],
    categories = [],
    expertise,
    favourites,
    learning,
    marquee,
    summary = {},
  } = data;

  return (
    <section className="skills" id="skills" aria-label={headline || "Skills"}>
      <div className="skills__inner">
        <header className="skills__header">
          <div className="skills__intro">
            {eyebrow ? <p className="skills__eyebrow">{eyebrow}</p> : null}
            {headline ? <h2 className="skills__title">{headline}</h2> : null}
            {lead ? <p className="skills__lead">{lead}</p> : null}
          </div>

          {stats.length > 0 ? (
            <ul className="skills__stats">
              {stats.map((stat) => (
                <StatCard key={stat.id} stat={stat} />
              ))}
            </ul>
          ) : null}
        </header>

        <div className="skills__body">
          {categories.length > 0 ? (
            <div className="skills__grid">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : null}

          <aside className="skills__side">
            <ExpertisePanel expertise={expertise} />
            <FavouritesPanel favourites={favourites} />
          </aside>
        </div>

        <div className="skills__footer">
          <LearningCard learning={learning} />
          <TechMarquee marquee={marquee} />
        </div>

        <SkillsSummary summary={summary} />
      </div>
    </section>
  );
}

export default SkillsSection;
