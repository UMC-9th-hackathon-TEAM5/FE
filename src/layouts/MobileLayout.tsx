import { Outlet } from "react-router-dom";

export default function MobileLayout() {
  return (
    <main className="flex min-h-screen w-full justify-center bg-[#1f1f1f] pt-10">
      <div className="flex h-211 w-97.5 flex-col border border-white px-4">
        <Outlet />
      </div>
    </main>
  );
}
