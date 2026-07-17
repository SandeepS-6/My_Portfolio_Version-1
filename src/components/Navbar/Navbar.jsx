import Button from "../Button/Button";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <a className="navbar__brand" href="#home" aria-label="Home">
          <span className="navbar__logo" aria-hidden="true">
            S.
          </span>
        </a>

        <Button variant="primary" asLink href="#contact">
          Let&apos;s Connect
          <span className="btn__icon btn__icon--circle" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
              <path
                d="M4 12L12 4M12 4H6.5M12 4V9.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Button>
      </div>
    </header>
  );
}

export default Navbar;
