import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import MobileLayout from "@/layouts/MobileLayout";

// 테스트 페이지에 대한 라우팅
import HeaderTestPage from "@/pages/test/HeaderTestPage";
import InputTestPage from "@/pages/test/InputTestPage";
import PartyInfoCardTestPage from "./pages/test/PartyInfoCardTestPage";
import RoleButtonTestPage from "./pages/test/RoleButtonTestPage";
import ButtonTestPage from "./pages/test/ButtonTestPage";
import PlayerBadgeTestPage from "./pages/test/PlayerBadgeTestPage";
import PlayerArrivalCardTestPage from "./pages/test/PlayerArrivalCardTestPage";
import PlayerPlayingCardTestPage from "./pages/test/PlayerPlayingCardTestPage";
import PlayerResultCardTestPage from "./pages/test/PlayerResultCardTestPage";

// 실제 페이지
import PartyDetailPage from "./pages/party/PartyDetailPage";
import LoginPage from "./pages/LoginPage";
import CreatePartyPage from "./pages/party/CreatePartyPage";
import ModalTestPage from "./pages/test/ModalTestPage";
import GameStartPage from "./pages/game/GameStartPage";

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
            <Route path="test/player-badge" element={<PlayerBadgeTestPage />} />
            <Route
              path="test/player-arrival-card"
              element={<PlayerArrivalCardTestPage />}
            />
            <Route path="/test/modal" element={<ModalTestPage />} />
            <Route
              path="/test/player-playing-card"
              element={<PlayerPlayingCardTestPage />}
            />
            <Route
              path="/test/player-result-card"
              element={<PlayerResultCardTestPage />}
            />
            PlayerResultCardTestPage
            {/* 실제 페이지 */}
            <Route path="login" element={<LoginPage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="party/detail" element={<PartyDetailPage />} />
            <Route path="party/create" element={<CreatePartyPage />} />
            <Route path="party/waiting" element={<WaitingPartyPage />} />
            <Route path="game" element={<GameStartPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
