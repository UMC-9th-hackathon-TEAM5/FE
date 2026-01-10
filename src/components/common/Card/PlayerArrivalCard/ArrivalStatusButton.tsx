import React from "react";
import { twMerge } from "tailwind-merge";

interface ArrivalStatusButtonProps {
  isArrived: boolean;
}

export const ArrivalStatusButton: React.FC<ArrivalStatusButtonProps> = ({
  isArrived,
}) => {
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
