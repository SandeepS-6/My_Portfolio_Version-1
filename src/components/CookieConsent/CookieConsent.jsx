import { useEffect, useRef, useState } from "react";
import { Cookie } from "lucide-react";
import {
  CONSENT_CHOICE,
  getStoredConsent,
  storeConsent,
} from "../../utils/consent";
import { syncCookieConsent } from "../../services/cookieConsent";
import "./CookieConsent.css";

function CookieConsent({ onVisibilityChange }) {
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef(null);

  useEffect(() => {
    setVisible(!getStoredConsent());
  }, []);

  useEffect(() => {
    if (!onVisibilityChange) return;

    if (!visible) {
      onVisibilityChange(false, 0);
      return;
    }

    const node = bannerRef.current;
    if (!node) {
      onVisibilityChange(true, 0);
      return;
    }

    const publish = () => {
      onVisibilityChange(true, node.getBoundingClientRect().height);
    };

    publish();

    const observer = new ResizeObserver(publish);
    observer.observe(node);
    window.addEventListener("resize", publish);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", publish);
    };
  }, [visible, onVisibilityChange]);

  function decide(choice) {
    const record = storeConsent(choice);
    setVisible(false);
    void syncCookieConsent(record);
  }

  function openSettings() {
    // Placeholder until the settings panel ships
    console.info("Cookie Settings — coming soon");
  }

  if (!visible) return null;

  return (
    <div
      ref={bannerRef}
      className="cookie-consent"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <div className="cookie-consent__inner">
        <div className="cookie-consent__copy">
          <span className="cookie-consent__icon" aria-hidden="true">
            <Cookie size={22} strokeWidth={2} />
          </span>
          <div>
            <p className="cookie-consent__title">We use cookies</p>
            <p className="cookie-consent__text">
              Essential cookies keep the site working. Optional cookies help us
              improve the experience — only if you allow them.
            </p>
          </div>
        </div>

        <div className="cookie-consent__actions">
          <button
            type="button"
            className="cookie-consent__btn cookie-consent__btn--primary"
            onClick={() => decide(CONSENT_CHOICE.ACCEPTED)}
          >
            Accept All
          </button>
          <button
            type="button"
            className="cookie-consent__btn cookie-consent__btn--secondary"
            onClick={() => decide(CONSENT_CHOICE.REJECTED)}
          >
            Reject All
          </button>
          <button
            type="button"
            className="cookie-consent__btn cookie-consent__btn--ghost"
            onClick={openSettings}
          >
            Cookie Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
