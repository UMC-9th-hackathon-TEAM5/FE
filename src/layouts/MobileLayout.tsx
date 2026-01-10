import { Outlet } from "react-router-dom";

export default function MobileLayout() {
  return (
    <main className="flex h-screen w-full items-center justify-center bg-[#1f1f1f]">
      <div className="flex h-screen w-93.75 flex-col border border-white px-4 py-6">
        <div className="flex h-8 w-full items-center justify-center bg-white">
          있을지도 모르는 Header 영역
        </div>
        <Outlet />
      </div>
    </main>
  );
}
