import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import MobileLayout from "@/layouts/MobileLayout";

import HeaderTestPage from "@/pages/test/HeaderTestPage";
import InputTestPage from "@/pages/test/InputTestPage";
import PartyInfoCardTestPage from "./pages/test/PartyInfoCardTestPage";
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
            <Route path="test/input" element={<InputTestPage />} />
            <Route
              path="test/party-info-card"
              element={<PartyInfoCardTestPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
