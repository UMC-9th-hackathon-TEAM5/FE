import { Outlet } from "react-router-dom";

export default function MobileLayout() {
  return (
    <main className="flex h-[100dvh] w-full justify-center bg-[#111111] overflow-hidden">
      <div className="relative flex h-full w-full max-w-[450px] flex-col bg-[#111111]">
        <Outlet />
      </div>
    </main>
  );
}