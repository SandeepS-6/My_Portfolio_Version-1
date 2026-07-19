import { Link } from "react-router-dom";
import "./static-pages.css";

/*
  Destination for the "Let's Talk" floating badge.
  Empty for now — contact form / socials arrive later.
*/

function LetsTalk() {
  return (
    <main className="static-page" aria-label="Let's talk">
      <p className="static-page__eyebrow">Say Hello</p>
      <h1 className="static-page__title">Let&apos;s Talk</h1>
      <p className="static-page__note">
        This space is being prepared — a contact form and ways to reach me are
        on the way.
      </p>
      <Link to="/" className="static-page__cta">
        Back to home
      </Link>
    </main>
  );
}

export default LetsTalk;
