import { lazy, Suspense, useCallback, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { SmoothCursor } from "./components/SmoothCursor/SmoothCursor";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import SiteOverlays from "./components/SiteOverlays/SiteOverlays";

const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const LetsTalk = lazy(() => import("./pages/LetsTalk"));
const NotFound = lazy(() => import("./pages/NotFound"));

/* Home keeps the reveal curtain; deep links skip it so detail paints immediately. */
function shouldShowLoadingScreen() {
  const path = window.location.pathname;
  return path === "/" || path === "";
}

function App() {
  const [ready, setReady] = useState(() => !shouldShowLoadingScreen());
  const [showCursor, setShowCursor] = useState(() => !shouldShowLoadingScreen());

  const handleLoadProgress = useCallback((progress) => {
    if (progress >= 80) setShowCursor(true);
  }, []);

  return (
    <BrowserRouter>
      {/* Mount early so we track the real mouse before 80% */}
      <SmoothCursor active={showCursor} />

      {!ready && (
        <LoadingScreen
          onComplete={() => setReady(true)}
          onProgress={handleLoadProgress}
        />
      )}

      {ready && (
        <>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/lets-talk" element={<LetsTalk />} />
              <Route path="/contact" element={<LetsTalk />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <SiteOverlays />
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
