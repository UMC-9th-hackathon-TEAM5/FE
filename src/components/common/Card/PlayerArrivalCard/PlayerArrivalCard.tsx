import React from "react";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

import { PlayerAvatar } from "./PlayerAvatar";
import { PlayerNameBadge } from "./PlayerNameBadge";
import { ArrivalStatusButton } from "./ArrivalStatusButton";

import ChangeRoleIcon from "@/assets/change/change.svg?react";

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
  "relative w-77.5 h-16 flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
  {
    variants: {
      arrived: {
        true: "border border-main",
        false: "bg-main-dark1",
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
  const [currentRole, setCurrentRole] = React.useState<Role>(role);
  const [currentArrival, setCurrentArrival] =
    React.useState<ArrivalStatus>(arrivalStatus);
  const isArrived = currentArrival === "arrived";

  const roleLabel = currentRole === "police" ? "경찰" : "도둑";

  const handleToggleRole = () => {
    setCurrentRole((prev) => (prev === "police" ? "thief" : "police"));
  };

  const handleToggleArrival = () => {
    setCurrentArrival((prev) =>
      prev === "arrived" ? "notArrived" : "arrived",
    );
  };

  return (
    <article
      className={twMerge(cardStyles({ arrived: isArrived }), className)}
      role="group"
      aria-label={`참여자 카드: ${name}, 역할 ${roleLabel}, ${isArrived ? "도착" : "미도착"}`}
    >
      <PlayerAvatar role={currentRole} />
      <div className="flex flex-1 flex-col">
        <PlayerNameBadge name={name} isHost={isHost} isMe={isMe} />
        <span className="text-main-variant text-xs font-medium select-none">
          {roleLabel}
        </span>
      </div>
      {(isHost || isMe) && (
        <button
          type="button"
          aria-label={`역할 전환 (현재: ${roleLabel})`}
          className="absolute top-1/2 left-3/5 -translate-x-1/2 -translate-y-1/2 p-2 text-sm"
          onClick={handleToggleRole}
        >
          <ChangeRoleIcon className="text-white" />
        </button>
      )}
      <ArrivalStatusButton
        isArrived={isArrived}
        onClick={handleToggleArrival}
        aria-pressed={isArrived}
      />
    </article>
  );
};
