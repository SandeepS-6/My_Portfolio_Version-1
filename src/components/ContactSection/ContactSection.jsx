import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { getFooter } from "../../services/footer";
import "./ContactSection.css";

function MarqueeRow({ word, direction }) {
  const strip = Array.from({ length: 8 }, () => word).join("\u00A0\u00A0");

  return (
    <div
      className={`contact-section__marquee contact-section__marquee--${direction}`}
      aria-hidden="true"
    >
      <div className="contact-section__track">
        <span>{strip}</span>
        <span>{strip}</span>
      </div>
    </div>
  );
}

function isLinkedIn(link) {
  const label = (link.label || "").toLowerCase();
  const href = (link.href || "").toLowerCase();
  return label.includes("linkedin") || href.includes("linkedin.com");
}

function ContactSection() {
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    let alive = true;

    getFooter()
      .then((data) => {
        if (alive && data) setFooter(data);
      })
      .catch((error) => {
        console.warn("[footer] Failed to load footer data.", error.message);
      });

    return () => {
      alive = false;
    };
  }, []);

  const {
    backgroundWords = [],
    eyebrow,
    cta,
    socials = [],
    backToTopLabel,
    credits,
  } = footer || {};

  const linkedIn = socials.find(isLinkedIn);

  return (
    <section className="contact-section" id="contact" aria-label="Contact">
      <div className="contact-section__type" aria-hidden="true">
        {backgroundWords.map((word, index) => (
          <MarqueeRow
            key={word}
            word={word}
            direction={index % 2 === 0 ? "left" : "right"}
          />
        ))}
      </div>

      <div className="contact-section__ui">
        <div className="contact-section__top">
          <div className="contact-section__cluster">
            <p className="contact-section__eyebrow">{eyebrow}</p>
            <Link className="contact-section__cta" to="/lets-talk">
              {cta?.label || "Let's talk"}
            </Link>
          </div>

          {socials.length > 0 ? (
            <nav className="contact-section__socials" aria-label="Social">
              {socials.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          ) : null}

          <button
            type="button"
            className="contact-section__top-link"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {backToTopLabel}
            <span className="contact-section__top-icon" aria-hidden="true">
              <ArrowUp size={14} strokeWidth={2.2} />
            </span>
          </button>
        </div>

        <div className="contact-section__bottom">
          {credits ? (
            <p className="contact-section__credits">{credits}</p>
          ) : null}

          {linkedIn ? (
            <a
              className="contact-section__linkedin"
              href={linkedIn.href}
              target="_blank"
              rel="noreferrer"
            >
              {linkedIn.label || "LinkedIn"}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
