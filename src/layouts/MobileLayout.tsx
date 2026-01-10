import { Outlet } from "react-router-dom";

export default function MobileLayout() {
  return (
    <main className="flex h-[100dvh] w-full flex-col items-center bg-[#111111] overflow-hidden">
      <div className="relative flex h-full w-full flex-col bg-[#111111] md:h-[844px] md:w-[390px] md:border md:border-white">
        <Outlet />
      </div>
    </main>
  );
}