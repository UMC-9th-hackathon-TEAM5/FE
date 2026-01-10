import { PlayerAvatar } from "@/components/common/Card/PlayerArrivalCard/PlayerAvatar";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";

import StatusButton from "./StatusButton";

interface PlayerPlayingCardProps {
  id?: string;
  name: string;
  role: "police" | "thief";
  status: "escaped" | "jailed" | "caught" | "none";
  isHost?: boolean;
  isMe?: boolean;
  onChangeStatus?: (nextStatus: "escaped" | "jailed" | "caught") => void;
}

const playerPlayingCardVariants = cva(
  "w-80.5 h-16.5 relative flex items-center justify-between rounded-xl px-4 py-3 text-white border border-transparent",
  {
    variants: {
      role: {
        police: "",
        thief: "",
      },
      state: {
        thiefRed: "",
        thiefRun: "",
        police: "",
      },
    },
    compoundVariants: [
      {
        role: "thief",
        state: "thiefRed",
        className: "bg-[#EF44444D] border-[#EF4444]",
      },
      {
        role: "thief",
        state: "thiefRun",
        className: "bg-[#1E293B4D] border-[#5576AA]",
      },
      {
        role: "police",
        state: "police",
        className: "bg-[#3B82F64D] border-[#3B82F6]",
      },
    ],
    defaultVariants: {
      role: "thief",
      state: "thiefRun",
    },
  },
);

export const PlayerPlayingCard = ({
  name,
  role,
  status,
  isHost,
  isMe,
  onChangeStatus,
}: PlayerPlayingCardProps) => {
  let state: "thiefRed" | "thiefRun" | "police";

  if (role === "thief") {
    if (status === "jailed" || status === "escaped") {
      state = "thiefRed";
    } else if (status === "caught") {
      state = "thiefRun";
    } else {
      state = "thiefRun";
    }
  } else {
    state = "police";
  }

  return (
    <li
      role="listitem"
      aria-label={`플레이어 ${name} 상태 카드`}
      className={twMerge(playerPlayingCardVariants({ role, state }))}
    >
      <div className="flex items-center gap-3">
        <PlayerAvatar role={role} />
        <div className="flex flex-col">
          <span className="font-medium">
            {name}
            {isHost && (
              <span className="ml-1 text-xs text-emerald-300">HOST</span>
            )}
            {isMe && <span className="ml-1 text-xs text-emerald-300">ME</span>}
          </span>
        </div>
      </div>

      {role === "thief" && status !== "none" && (
        <StatusButton
          status={status}
          onChangeStatus={(nextStatus) => {
            onChangeStatus?.(nextStatus);
          }}
        />
      )}
    </li>
  );
};
<<<<<<< HEAD
<<<<<<< HEAD

export default PlayerPlayingCard;
=======
>>>>>>> 0e5ca16 (feat:PlayingPartyCard 구현 완료)
=======

export default PlayerPlayingCard;
>>>>>>> ec7b49f (feat:PlayerResultCard 구현 완료)
