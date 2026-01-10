import React from "react";
import { twMerge } from "tailwind-merge";

type Role = "police" | "thief";

export const PlayerAvatar: React.FC<{ role: Role }> = ({ role }) => {
  const roleColors = {
    police: "bg-[#3B82F6]",
    thief: "bg-[#1E293B]",
  };
  const roleIcons = {
    police: "👮",
    thief: "🥷",
  };
  return (
    <div
      className={twMerge(
        "flex h-12 w-12 items-center justify-center rounded-full text-xl text-white select-none",
        roleColors[role],
      )}
      role="img"
      aria-label={role === "police" ? "Police avatar" : "Thief avatar"}
    >
      {roleIcons[role]}
    </div>
  );
};
