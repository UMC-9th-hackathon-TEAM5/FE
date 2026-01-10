import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import MobileLayout from "./layouts/MobileLayout";
import HeaderTestPage from "./pages/test/HeaderTestPage";
import RoleButtonTestPage from "./pages/test/RoleButtonTestPage";
import ButtonTestPage from "./pages/test/ButtonTestPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MobileLayout />}>
            <Route path="test/header" element={<HeaderTestPage />} />
            <Route path="test/RoleButton" element={<RoleButtonTestPage />} />
            <Route path="test/Button" element={<ButtonTestPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
