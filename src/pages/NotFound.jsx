import { Link } from "react-router-dom";
import "./static-pages.css";

function NotFound() {
  return (
    <main className="static-page" aria-label="Page not found">
      <p className="static-page__eyebrow">Lost in the void</p>
      <h1 className="static-page__title static-page__title--giant">404</h1>
      <p className="static-page__note">
        This page drifted off with the floating skills. Let&apos;s get you back
        somewhere real.
      </p>
      <Link to="/" className="static-page__cta">
        Back to home
      </Link>
    </main>
  );
}

export default NotFound;
