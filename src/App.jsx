import { useCallback, useState } from "react";
import Home from "./pages/Home";
import LetsTalk from "./pages/LetsTalk";
import NotFound from "./pages/NotFound";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SmoothCursor } from "./components/SmoothCursor/SmoothCursor";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import SiteOverlays from "./components/SiteOverlays/SiteOverlays";

function App() {
  const [ready, setReady] = useState(false);
  const [showCursor, setShowCursor] = useState(false);

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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lets-talk" element={<LetsTalk />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <SiteOverlays />
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
