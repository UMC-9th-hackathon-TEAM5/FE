import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import MobileLayout from "@/layouts/MobileLayout";

// 테스트 페이지에 대한 라우팅
import HeaderTestPage from "@/pages/test/HeaderTestPage";
import InputTestPage from "@/pages/test/InputTestPage";
<<<<<<< HEAD
import PartyInfoCardTestPage from "./pages/test/PartyInfoCardTestPage";
import RoleButtonTestPage from "./pages/test/RoleButtonTestPage";
import ButtonTestPage from "./pages/test/ButtonTestPage";
import PlayerBadgeTestPage from "./pages/test/PlayerBadgeTestPage";
import PlayerArrivalCardTestPage from "./pages/test/PlayerArrivalCardTestPage";

// 실제 페이지
import PartyDetailPage from "./pages/party/PartyDetailPage";
import LoginPage from "./pages/LoginPage";
import CreatePartyPage from "./pages/party/CreatePartyPage";
import WaitingPartyPage from "./pages/party/WaitingPartyPage";
=======
import PartyInfoCardTestPage from "@/pages/test/PartyInfoCardTestPage";
import RoleButtonTestPage from "@/pages/test/RoleButtonTestPage";
import ButtonTestPage from "@/pages/test/ButtonTestPage";
import PlayerBadgeTestPage from "@/pages/test/PlayerBadgeTestPage";
import CreatePartyPage from "@/pages/party/CreatePartyPage";

// 실제 페이지
import PartyDetailPage from "@/pages/party/PartyDetailPage";
import LoginPage from "@/pages/LoginPage";
>>>>>>> 68d9a07 (fix:에러 및 경로 변경)

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* 테스트 페이지에 대한 라우팅 */}
          <Route path="/" element={<MobileLayout />}>
            <Route path="test/header" element={<HeaderTestPage />} />
            <Route path="test/RoleButton" element={<RoleButtonTestPage />} />
            <Route path="test/Button" element={<ButtonTestPage />} />
            <Route path="test/input" element={<InputTestPage />} />
            <Route
              path="test/party-info-card"
              element={<PartyInfoCardTestPage />}
            />
            <Route path="test/player-badge" element={<PlayerBadgeTestPage />} />
            <Route
              path="test/player-arrival-card"
              element={<PlayerArrivalCardTestPage />}
            />
            <Route path="test/Button" element={<ButtonTestPage />} />

            {/* 실제 페이지 */}
            <Route path="login" element={<LoginPage />} />
            <Route path="party/detail" element={<PartyDetailPage />} />
            <Route path="party/create" element={<CreatePartyPage />} />
            <Route path="party/waiting" element={<WaitingPartyPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
