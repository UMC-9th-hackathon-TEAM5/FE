import "./App.css";

import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import MobileLayout from "@/layouts/MobileLayout";

import HeaderTestPage from "@/pages/test/HeaderTestPage";
import InputTestPage from "@/pages/test/InputTestPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MobileLayout />}>
            <Route path="test/header" element={<HeaderTestPage />} />
            <Route path="test/input" element={<InputTestPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
