import "./App.css";

import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import MobileLayout from "@/layouts/MobileLayout";

<<<<<<< HEAD
// 테스트 페이지에 대한 라우팅
import HeaderTestPage from "@/pages/test/HeaderTestPage";
import InputTestPage from "@/pages/test/InputTestPage";
import PartyInfoCardTestPage from "./pages/test/PartyInfoCardTestPage";
import PlayerBadgeTestPage from "./pages/test/PlayerBadgeTestPage";
import RoleButtonTestPage from "./pages/test/RoleButtonTestPage";

// 실제 페이지
import PartyDetailPage from "./pages/party/PartyDetailPage";
import CreatePartyPage from "./pages/party/CreatePartyPage";
=======
import MobileLayout from "./layouts/MobileLayout";
import HeaderTestPage from "./pages/test/HeaderTestPage";
import RoleButtonTestPage from "./pages/test/RoleButtonTestPage";
>>>>>>> dfa6f9e (feat : RoleButton 컴포넌트 구현)

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* 테스트 페이지에 대한 라우팅 */}
          <Route path="/" element={<MobileLayout />}>
            <Route path="test/header" element={<HeaderTestPage />} />
<<<<<<< HEAD
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
=======
            <Route path="test/RoleButton" element={<RoleButtonTestPage />} />
>>>>>>> dfa6f9e (feat : RoleButton 컴포넌트 구현)
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
