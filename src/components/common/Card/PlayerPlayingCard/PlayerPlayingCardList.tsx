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
    status: "caught",
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
        player.id === playerId ? { ...player, status: nextStatus } : player,
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
