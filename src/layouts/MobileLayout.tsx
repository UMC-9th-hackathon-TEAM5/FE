import { Outlet } from "react-router-dom";

export default function MobileLayout() {
  return (
    <main className="flex h-full w-full justify-center bg-[#111111]">
      <div className="safe-area scroll-hidden relative flex h-full w-full max-w-97.5 max-h-[840px] flex-col overflow-x-hidden overflow-y-auto bg-[#111111]">
        <Outlet />
      </div>
    </main>
  );
}
