import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import MobileLayout from "@/layouts/MobileLayout";

// 테스트 페이지에 대한 라우팅
import HeaderTestPage from "@/pages/test/HeaderTestPage";
import InputTestPage from "@/pages/test/InputTestPage";
import PartyInfoCardTestPage from "./pages/test/PartyInfoCardTestPage";
import PlayerBadgeTestPage from "./pages/test/PlayerBadgeTestPage";
<<<<<<< HEAD
import PlayerArrivalCardTestPage from "./pages/test/PlayerArrivalCardTestPage";
=======

>>>>>>> b389011 (feat : BaseModal 구현)

// 실제 페이지
import PartyDetailPage from "./pages/party/PartyDetailPage";
import LoginPage from "./pages/LoginPage";
<<<<<<< HEAD
<<<<<<< HEAD
import CreatePartyPage from "./pages/party/CreatePartyPage";
import WaitingPartyPage from "./pages/party/WaitingPartyPage";
=======
>>>>>>> 583fb23 (feat : 로그인 페이지 구현)
=======
import CreatePartyPage from "./pages/party/CreatePartyPage";
import ModalTestPage from "./pages/test/ModalTestPage";
>>>>>>> b389011 (feat : BaseModal 구현)

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

            {/* 실제 페이지 */}
            <Route path="login" element={<LoginPage />} />
            <Route path="party/detail" element={<PartyDetailPage />} />
            <Route path="party/create" element={<CreatePartyPage />} />
<<<<<<< HEAD
            <Route path="party/waiting" element={<WaitingPartyPage />} />
=======
>>>>>>> b389011 (feat : BaseModal 구현)
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
