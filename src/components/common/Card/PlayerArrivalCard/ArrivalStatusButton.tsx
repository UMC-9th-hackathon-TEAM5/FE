import React from "react";
import { twMerge } from "tailwind-merge";
import CheckIcon from "@/assets/check/check.svg?react";

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
        "flex h-9 w-15 items-center justify-center rounded-lg text-sm font-medium transition-colors select-none",
        isArrived
          ? "bg-[#10B981] pl-2 text-white"
          : "bg-[#E3E6EA] text-gray-700",
      )}
      aria-label={isArrived ? "Arrived" : "Not arrived"}
    >
      {isArrived ? "도착" : "미도착"}
      {isArrived && <CheckIcon className="text-[#E3E6EA]" />}
    </button>
  );
};
