import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CookieConsent from "../CookieConsent/CookieConsent";
import FloatingActionButton from "../FloatingActionButton/FloatingActionButton";

function SiteOverlays() {
  const [bannerHeight, setBannerHeight] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const onContactPage =
    location.pathname === "/lets-talk" || location.pathname === "/contact";
  const onProjectDetail = location.pathname.startsWith("/projects/");

  const handleBannerVisibility = useCallback((visible, height) => {
    setBannerHeight(visible ? height : 0);
  }, []);

  function handleFabClick(_event, meta = {}) {
    // Only the footer-docked Let's Talk opens the contact page
    if (meta.docked) {
      navigate("/lets-talk");
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <CookieConsent onVisibilityChange={handleBannerVisibility} />
      {!onContactPage && (
        <FloatingActionButton
          key={onProjectDetail ? "fab-project" : "fab-default"}
          onClick={handleFabClick}
          label="Let's talk"
          contactSectionId="contact"
          className={onProjectDetail ? "fab--project-detail" : ""}
          offsetBottom={bannerHeight > 0 ? bannerHeight + 8 : 0}
        />
      )}
    </>
  );
}

export default SiteOverlays;
