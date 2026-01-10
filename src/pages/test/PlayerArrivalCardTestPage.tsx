import React from "react";
import { PlayerArrivalCard } from "@/components/common/Card/PlayerArrivalCard/PlayerArrivalCard";

export default function PlayerArrivalCardTestPage() {
  return (
    <main className="flex min-h-screen flex-col gap-4 bg-black p-6 text-white">
      <h1 className="mb-4 text-xl font-bold">
        PlayerArrivalCard 테스트 페이지
      </h1>

      {/* 기본 케이스 */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm text-gray-400">기본 케이스</h2>

        <PlayerArrivalCard
          name="사요"
          role="police"
          arrivalStatus="notArrived"
        />

        <PlayerArrivalCard name="서리" role="thief" arrivalStatus="arrived" />
      </section>

      {/* HOST / ME */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm text-gray-400">HOST / ME 표시</h2>

        <PlayerArrivalCard
          name="구디"
          role="police"
          arrivalStatus="arrived"
          isHost
        />

        <PlayerArrivalCard
          name="이삭"
          role="thief"
          arrivalStatus="notArrived"
          isMe
        />

        <PlayerArrivalCard
          name="미로"
          role="police"
          arrivalStatus="arrived"
          isHost
          isMe
        />
      </section>

      {/* className override */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm text-gray-400">className override</h2>

        <PlayerArrivalCard
          name="아진"
          role="thief"
          arrivalStatus="notArrived"
          className="border-red-500 bg-red-50"
        />
      </section>

      {/* 리스트 테스트 */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm text-gray-400">리스트 렌더링</h2>

        <div className="flex flex-col gap-2">
          {[
            {
              name: "사요",
              role: "police" as const,
              arrivalStatus: "arrived" as const,
              isHost: true,
            },
            {
              name: "서리",
              role: "thief" as const,
              arrivalStatus: "notArrived" as const,
            },
            {
              name: "구디",
              role: "police" as const,
              arrivalStatus: "notArrived" as const,
            },
            {
              name: "이삭",
              role: "thief" as const,
              arrivalStatus: "arrived" as const,
              isMe: true,
            },
          ].map((player) => (
            <PlayerArrivalCard key={player.name} {...player} />
          ))}
        </div>
      </section>
    </main>
  );
}
