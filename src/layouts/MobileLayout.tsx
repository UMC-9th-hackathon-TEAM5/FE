import Header from "@/components/common/Header";
import { Outlet } from "react-router-dom";

export default function MobileLayout() {
  return (
<<<<<<< HEAD
    <main className="flex min-h-screen w-full justify-center bg-[#111111] pt-10">
      <div className="relative flex h-211 w-97.5 flex-col border border-white">
=======
    <main className="flex min-h-screen w-full justify-center bg-[#1f1f1f] pt-10">
<<<<<<< HEAD
      <div className="flex h-211 w-97.5 flex-col border border-white px-4 py-6">
        <div className="flex h-8 w-full items-center justify-center bg-white">
          있을지도 모르는 Header 영역
        </div>
>>>>>>> 6acac36 (setting:MoblieLayout width 및 height 수정)
=======
      <div className="flex h-211 w-97.5 flex-col border border-white px-4">
        <Header title="팟 상세" />
        <Outlet />
      </div>
    </main>
  );
}
