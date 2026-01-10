import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import MobileLayout from "./layouts/MobileLayout";
import HeaderTestPage from "./pages/test/HeaderTestPage";
import RoleButtonTestPage from "./pages/test/RoleButtonTestPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* 테스트 페이지에 대한 라우팅 */}
          <Route path="/" element={<MobileLayout />}>
            <Route path="test/header" element={<HeaderTestPage />} />
            <Route path="test/RoleButton" element={<RoleButtonTestPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
