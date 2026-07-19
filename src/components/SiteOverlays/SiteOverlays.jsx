import { useCallback, useState } from "react";
import CookieConsent from "../CookieConsent/CookieConsent";
import FloatingActionButton from "../FloatingActionButton/FloatingActionButton";

function SiteOverlays() {
  const [bannerHeight, setBannerHeight] = useState(0);

  const handleBannerVisibility = useCallback((visible, height) => {
    setBannerHeight(visible ? height : 0);
  }, []);

  function handleFabClick(_event, meta = {}) {
    if (meta.docked) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <CookieConsent onVisibilityChange={handleBannerVisibility} />
      <FloatingActionButton
        onClick={handleFabClick}
        label="Let's talk"
        contactSectionId="contact"
        offsetBottom={bannerHeight > 0 ? bannerHeight + 8 : 0}
      />
    </>
  );
}

export default SiteOverlays;
