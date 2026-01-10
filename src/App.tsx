import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MobileLayout from "./layouts/MobileLayout";

import NaverMapTest from "./pages/test/NaverMapTest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MobileLayout />}>
          <Route path="/navermap" element={<NaverMapTest />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
