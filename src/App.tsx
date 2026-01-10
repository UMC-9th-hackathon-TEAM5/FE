import "./App.css";

import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import MobileLayout from "@/layouts/MobileLayout";

// 실제 페이지
import PartyDetailPage from "./pages/party/PartyDetailPage";
import LoginPage from "./pages/LoginPage";
import CreatePartyPage from "./pages/party/CreatePartyPage";
import WaitingPartyPage from "./pages/party/WaitingPartyPage";
import GameStartPage from "./pages/game/GameStartPage";
import HomePage from "./pages/HomePage";
import GamePlayPage from "./pages/game/GamePlayPage";
import GameResultPage from "./pages/game/GameResultPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* 테스트 페이지에 대한 라우팅 */}
          <Route path="/" element={<MobileLayout />}>
            {/* 실제 페이지 */}
            <Route path="login" element={<LoginPage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="party/detail" element={<PartyDetailPage />} />
            <Route path="party/create" element={<CreatePartyPage />} />

            <Route path="game" element={<GameStartPage />} />

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
