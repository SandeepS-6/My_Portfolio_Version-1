import { useState } from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SmoothCursor } from "./components/SmoothCursor/SmoothCursor";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";

function App() {
  const [ready, setReady] = useState(false);

  return (
    <BrowserRouter>
      <SmoothCursor />
      {/* Hero renders behind the curtain; loader fades to reveal it */}
      {!ready && <LoadingScreen onComplete={() => setReady(true)} />}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
