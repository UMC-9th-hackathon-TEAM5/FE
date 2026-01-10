import { useState } from "react";
import { PlayerPlayingCard } from "./PlayerPlayingCard";

type Player = {
  id: string;
  name: string;
  role: "police" | "thief";
  status: "escaped" | "jailed" | "caught" | "none";
  isHost?: boolean;
  isMe?: boolean;
};

const initialPlayers: Player[] = [
  {
    id: "1",
    name: "사요",
    role: "thief",
<<<<<<< HEAD
    status: "caught",
=======
    status: "caught", // 🔴 기본 상태
>>>>>>> 0e5ca16 (feat:PlayingPartyCard 구현 완료)
  },
  {
    id: "2",
    name: "서리",
    role: "thief",
    status: "jailed",
  },
  {
    id: "3",
    name: "구디",
    role: "police",
    status: "none",
  },
];

export const PlayerPlayingCardList = () => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  const handleChangeStatus = (
    playerId: string,
    nextStatus: Player["status"],
  ) => {
    setPlayers((prev) =>
      prev.map((player) =>
<<<<<<< HEAD
        player.id === playerId ? { ...player, status: nextStatus } : player,
=======
        player.id === playerId
          ? { ...player, status: nextStatus } // ⭐ 여기서 상태가 바뀜
          : player,
>>>>>>> 0e5ca16 (feat:PlayingPartyCard 구현 완료)
      ),
    );
  };

  return (
    <ul className="flex flex-col gap-3">
      {players.map((player) => (
        <PlayerPlayingCard
          key={player.id}
          {...player}
          onChangeStatus={(nextStatus) =>
            handleChangeStatus(player.id, nextStatus)
          }
        />
      ))}
    </ul>
  );
};
