import { useState } from "react";
import Home from "./pages/Home";
import LetsTalk from "./pages/LetsTalk";
import NotFound from "./pages/NotFound";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SmoothCursor } from "./components/SmoothCursor/SmoothCursor";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import SiteOverlays from "./components/SiteOverlays/SiteOverlays";

function App() {
  const [ready, setReady] = useState(false);

  return (
    <BrowserRouter>
      <SmoothCursor />
      {/* Hero renders behind the curtain; loader fades to reveal it */}
      {!ready && <LoadingScreen onComplete={() => setReady(true)} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lets-talk" element={<LetsTalk />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {ready && <SiteOverlays />}
    </BrowserRouter>
  );
}

export default App;
