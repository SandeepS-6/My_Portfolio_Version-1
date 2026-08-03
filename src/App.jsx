import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { SmoothCursor } from "./components/SmoothCursor/SmoothCursor";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import SiteOverlays from "./components/SiteOverlays/SiteOverlays";
import { prefetchLetsTalk } from "./pages/prefetch";
import { waitHomeReady } from "./services/waitHomeReady";

const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const LetsTalk = lazy(() => import("./pages/LetsTalk"));
const NotFound = lazy(() => import("./pages/NotFound"));

/* Home keeps the reveal curtain; deep links skip it so detail paints immediately. */
function shouldShowLoadingScreen() {
  const path = window.location.pathname;
  return path === "/" || path === "";
}

function App() {
  const skipLoad = !shouldShowLoadingScreen();
  const [ready, setReady] = useState(skipLoad);
  const [showCursor, setShowCursor] = useState(skipLoad);
  const [heroReady, setHeroReady] = useState(skipLoad);

  // Hold the curtain until the API is awake (not soft-fail / mock fallback)
  useEffect(() => {
    if (skipLoad) return undefined;

    const controller = new AbortController();
    waitHomeReady(controller.signal).then((ok) => {
      if (ok && !controller.signal.aborted) setHeroReady(true);
    });

    return () => {
      controller.abort();
    };
  }, [skipLoad]);

  // Warm contact route after home is up (chunk + APIs)
  useEffect(() => {
    if (!ready || skipLoad) return undefined;
    const id = window.setTimeout(() => {
      prefetchLetsTalk();
    }, 1200);
    return () => window.clearTimeout(id);
  }, [ready, skipLoad]);

  const handleLoadProgress = useCallback((progress) => {
    if (progress >= 80) setShowCursor(true);
  }, []);

  const handleLoadComplete = useCallback(() => {
    setReady(true);
  }, []);

  return (
    <BrowserRouter>
      {/* Mount early so we track the real mouse before 80% */}
      <SmoothCursor active={showCursor} />

      {!ready && (
        <LoadingScreen
          contentReady={heroReady}
          onComplete={handleLoadComplete}
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
