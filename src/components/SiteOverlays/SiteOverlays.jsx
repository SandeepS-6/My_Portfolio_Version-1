import { useCallback, useState } from "react";
import CookieConsent from "../CookieConsent/CookieConsent";
import FloatingActionButton from "../FloatingActionButton/FloatingActionButton";

/*
  Coordinates bottom overlays so the FAB never sits under the cookie bar.
*/

function SiteOverlays() {
  const [bannerHeight, setBannerHeight] = useState(0);

  const handleBannerVisibility = useCallback((visible, height) => {
    setBannerHeight(visible ? height : 0);
  }, []);

  function handleFabClick() {
    // Later this may open a Quick Action Menu instead
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <CookieConsent onVisibilityChange={handleBannerVisibility} />
      <FloatingActionButton
        onClick={handleFabClick}
        label="Back to top"
        offsetBottom={bannerHeight > 0 ? bannerHeight + 8 : 0}
      />
    </>
  );
}

export default SiteOverlays;
