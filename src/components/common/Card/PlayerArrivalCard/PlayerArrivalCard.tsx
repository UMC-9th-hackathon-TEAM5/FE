import React from "react";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { PlayerAvatar } from "./PlayerAvatar";
import { PlayerNameBadge } from "./PlayerNameBadge";
import { ArrivalStatusButton } from "./ArrivalStatusButton";

type Role = "police" | "thief";
type ArrivalStatus = "arrived" | "notArrived";

interface PlayerArrivalCardProps {
  name: string;
  role: Role;
  arrivalStatus: ArrivalStatus;
  isHost?: boolean;
  isMe?: boolean;
  className?: string;
}

const cardStyles = cva(
  "flex items-center gap-4 p-4 rounded-lg border transition-colors",
  {
    variants: {
      arrived: {
        true: "bg-green-50 border-green-400",
        false: "bg-gray-50 border-gray-300",
      },
    },
    defaultVariants: {
      arrived: false,
    },
  },
);

export const PlayerArrivalCard: React.FC<PlayerArrivalCardProps> = ({
  name,
  role,
  arrivalStatus,
  isHost = false,
  isMe = false,
  className,
}) => {
  const isArrived = arrivalStatus === "arrived";

  const roleLabel = role === "police" ? "경찰" : "도둑";

  return (
    <article
      className={twMerge(cardStyles({ arrived: isArrived }), className)}
      aria-live="polite"
    >
      <PlayerAvatar role={role} />
      <div className="flex flex-1 flex-col">
        <PlayerNameBadge name={name} isHost={isHost} isMe={isMe} />
        <span className="text-sm text-gray-600 select-none">{roleLabel}</span>
      </div>
      <ArrivalStatusButton isArrived={isArrived} />
    </article>
  );
};
