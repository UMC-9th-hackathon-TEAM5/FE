import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const seedMockSession = () => {
  if (import.meta.env.VITE_MOCK_API !== "true") return;
  const url = new URL(window.location.href);
  const roomId = url.searchParams.get("roomId");
  if (roomId !== "65") return;
  localStorage.setItem("userId", "2");
  localStorage.setItem("hostId", "2");
  localStorage.setItem("nickname", "Officer");
};

const startApp = async () => {
  if (import.meta.env.DEV && import.meta.env.VITE_MOCK_API === "true") {
    const { worker } = await import("./mocks/browser");
    await worker.start({
      onUnhandledRequest: "bypass",
    });
  }

  seedMockSession();
  createRoot(document.getElementById("root")!).render(<App />);
};

void startApp();
