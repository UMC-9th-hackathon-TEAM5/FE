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
  avatarClassName?: string;
  canToggleArrival?: boolean;
  onToggleRole?: () => void;
  onToggleArrival?: () => void;
  canEditRole?: boolean;
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
  avatarClassName,
  canToggleArrival = true,
  onToggleRole,
  onToggleArrival,
  canEditRole = false,
}) => {
  const isArrived = arrivalStatus === "arrived";
  const roleLabel = role === "police" ? "경찰" : "도둑";

  return (
    <article
      className={twMerge(cardStyles({ arrived: isArrived }), className)}
      role="group"
      aria-label={`참여자 카드: ${name}, 역할 ${roleLabel}, ${isArrived ? "도착" : "미도착"}`}
    >
      <PlayerAvatar role={role} className={avatarClassName} />
      <div className="flex flex-1 flex-col">
        <PlayerNameBadge name={name} isHost={isHost} isMe={isMe} />
        <span className="text-main-variant text-xs font-medium select-none">
          {roleLabel}
        </span>
      </div>
      {(canEditRole || isHost || isMe) && (
        <button
          type="button"
          aria-label={`역할 전환 (현재: ${roleLabel})`}
          className="absolute top-3/5 left-3/5 -translate-x-1/2 -translate-y-1/2 p-2 text-sm"
          onClick={onToggleRole}
        >
          <ChangeRoleIcon className="text-white" />
        </button>
      )}
      <ArrivalStatusButton
        isArrived={isArrived}
        onClick={onToggleArrival}
        disabled={!canToggleArrival}
        aria-disabled={!canToggleArrival}
        aria-pressed={isArrived}
      />
    </article>
  );
};
