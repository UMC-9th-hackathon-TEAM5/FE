import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import MobileLayout from "./layouts/MobileLayout";
import HeaderTestPage from "./pages/test/HeaderTestPage";
import RoleButtonTestPage from "./pages/test/RoleButtonTestPage";

// 실제 페이지
import PartyDetailPage from "./pages/party/PartyDetailPage";
import CreatePartyPage from "./pages/party/CreatePartyPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* 테스트 페이지에 대한 라우팅 */}
          <Route path="/" element={<MobileLayout />}>
            <Route path="test/header" element={<HeaderTestPage />} />
            <Route path="test/input" element={<InputTestPage />} />
            <Route
              path="test/party-info-card"
              element={<PartyInfoCardTestPage />}
            />
            <Route
              path="/test/player-badge"
              element={<PlayerBadgeTestPage />}
            />
            <Route path="/test/roll-button" element={<RoleButtonTestPage />} />

            {/* 실제 페이지 */}
            <Route path="party/detail" element={<PartyDetailPage />} />
            <Route path="party/create" element={<CreatePartyPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
