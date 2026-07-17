import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SmoothCursor } from "./components/SmoothCursor/SmoothCursor";

function App() {
  return (
    <BrowserRouter>
      <SmoothCursor />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
