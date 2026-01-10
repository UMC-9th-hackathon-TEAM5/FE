import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MobileLayout from "./layouts/MobileLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MobileLayout />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
