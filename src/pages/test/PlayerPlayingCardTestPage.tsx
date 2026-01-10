import { useState } from "react";
import { PlayerPlayingCard } from "@/components/common/Card/PlayerPlayingCard/PlayerPlayingCard";

type Player = {
  id: string;
  name: string;
  role: "police" | "thief";
  status: "escaped" | "jailed" | "caught" | "none";
  isHost?: boolean;
  isMe?: boolean;
};

const mockPlayers: Player[] = [
  // 🔴 도둑 - 탈출 성공
  { id: "1", name: "사요", role: "thief", status: "escaped" },
  { id: "2", name: "서리", role: "thief", status: "escaped", isHost: true },
  { id: "3", name: "구디", role: "thief", status: "escaped", isMe: true },
  {
    id: "4",
    name: "이삭",
    role: "thief",
    status: "escaped",
    isHost: true,
    isMe: true,
  },

  // 🔴 도둑 - 감옥
  { id: "5", name: "사요", role: "thief", status: "jailed" },
  { id: "6", name: "서리", role: "thief", status: "jailed", isHost: true },
  { id: "7", name: "구디", role: "thief", status: "jailed", isMe: true },
  {
    id: "8",
    name: "이삭",
    role: "thief",
    status: "jailed",
    isHost: true,
    isMe: true,
  },

  // 🔵 경찰 - 검거
  { id: "9", name: "사요", role: "police", status: "caught" },
  { id: "10", name: "서리", role: "police", status: "caught", isHost: true },
  { id: "11", name: "구디", role: "police", status: "caught", isMe: true },
  {
    id: "12",
    name: "이삭",
    role: "police",
    status: "caught",
    isHost: true,
    isMe: true,
  },

  {
    id: "16",
    name: "이삭",
    role: "thief",
    status: "none",
    isHost: true,
    isMe: true,
  },

  // 🔵 경찰 기본
  { id: "17", name: "사요", role: "police", status: "none" },
  { id: "18", name: "서리", role: "police", status: "none", isHost: true },
  { id: "19", name: "구디", role: "police", status: "none", isMe: true },
  {
    id: "20",
    name: "이삭",
    role: "police",
    status: "none",
    isHost: true,
    isMe: true,
  },
];

const PlayerPlayingCardTestPage = () => {
  const [players, setPlayers] = useState<Player[]>([...mockPlayers]);

  return (
    <main className="min-h-screen bg-black p-6">
      <h1 className="mb-4 text-lg font-semibold text-white">
        PlayerPlayingCard 테스트
      </h1>

      <ul className="flex flex-col gap-3">
        {players.map((player) => (
          <PlayerPlayingCard
            key={player.id}
            name={player.name}
            role={player.role}
            status={player.status}
            isHost={player.isHost}
            isMe={player.isMe}
            onChangeStatus={(nextStatus) => {
              setPlayers((prev) =>
                prev.map((p) =>
                  p.id === player.id ? { ...p, status: nextStatus } : p,
                ),
              );
            }}
          />
        ))}
      </ul>
    </main>
  );
};

export default PlayerPlayingCardTestPage;
