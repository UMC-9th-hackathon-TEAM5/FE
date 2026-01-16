import { Outlet } from "react-router-dom";

export default function MobileLayout() {
  return (
    <main className="flex min-h-dvh w-full justify-center bg-[#111111]">
      <div className="safe-area scroll-hidden relative flex h-[min(100dvh,840px)] w-full max-w-97.5 flex-col overflow-x-hidden overflow-y-auto bg-[#111111]">
        <Outlet />
      </div>
    </main>
  );
}
