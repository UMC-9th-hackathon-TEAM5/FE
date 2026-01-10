import "./App.css";

import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import MobileLayout from "@/layouts/MobileLayout";

// 실제 페이지
import PartyDetailPage from "./pages/party/PartyDetailPage";
import LoginPage from "./pages/LoginPage";
import CreatePartyPage from "./pages/party/CreatePartyPage";
<<<<<<< HEAD
import ModalTestPage from "./pages/test/ModalTestPage";
=======
import WaitingPartyPage from "./pages/party/WaitingPartyPage";
>>>>>>> f9efd57 (fix:타입 에러 수정)
import GameStartPage from "./pages/game/GameStartPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* 테스트 페이지에 대한 라우팅 */}
          <Route path="/" element={<MobileLayout />}>
<<<<<<< HEAD
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
=======
>>>>>>> f9efd57 (fix:타입 에러 수정)
            {/* 실제 페이지 */}
            <Route path="login" element={<LoginPage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="party/detail" element={<PartyDetailPage />} />
            <Route path="party/create" element={<CreatePartyPage />} />
<<<<<<< HEAD
            <Route path="game" element={<GameStartPage />} />
=======
            <Route path="party/waiting" element={<WaitingPartyPage />} />
            <Route path="game/start" element={<GameStartPage />} />
            <Route path="game/playing" element={<GamePlayPage />} />
            <Route path="game/result" element={<GameResultPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
