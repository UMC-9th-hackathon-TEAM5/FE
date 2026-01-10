import React from "react";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

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

const Avatar: React.FC<{ role: Role }> = ({ role }) => {
  const roleColors = {
    police: "bg-blue-500",
    thief: "bg-red-500",
  };
  const roleIcons = {
    police: "👮",
    thief: "🕵️",
  };
  return (
    <div
      className={twMerge(
        "flex h-12 w-12 items-center justify-center rounded-full text-xl text-white select-none",
        roleColors[role],
      )}
      aria-label={role === "police" ? "Police avatar" : "Thief avatar"}
    >
      {roleIcons[role]}
    </div>
  );
};

const NameBadge: React.FC<{
  name: string;
  isHost?: boolean;
  isMe?: boolean;
}> = ({ name, isHost, isMe }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 font-semibold text-gray-900">
        <span>{name}</span>
        {isHost && (
          <span className="rounded bg-yellow-300 px-2 py-0.5 text-xs font-medium text-yellow-900 select-none">
            호스트
          </span>
        )}
        {isMe && (
          <span className="rounded bg-indigo-300 px-2 py-0.5 text-xs font-medium text-indigo-900 select-none">
            나
          </span>
        )}
      </div>
    </div>
  );
};

const ArrivalButton: React.FC<{ isArrived: boolean }> = ({ isArrived }) => {
  return (
    <button
      type="button"
      disabled
      className={twMerge(
        "rounded px-3 py-1 text-sm font-semibold transition-colors select-none",
        isArrived
          ? "cursor-default bg-green-500 text-white"
          : "cursor-default bg-gray-300 text-gray-700",
      )}
      aria-label={isArrived ? "Arrived" : "Not arrived"}
    >
      {isArrived ? "도착" : "미도착"}
    </button>
  );
};

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
      <Avatar role={role} />
      <div className="flex flex-1 flex-col">
        <NameBadge name={name} isHost={isHost} isMe={isMe} />
        <span className="text-sm text-gray-600 select-none">{roleLabel}</span>
      </div>
      <ArrivalButton isArrived={isArrived} />
    </article>
  );
};
