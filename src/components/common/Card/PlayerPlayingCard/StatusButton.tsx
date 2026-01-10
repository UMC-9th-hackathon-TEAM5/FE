import LockIcon from "@/assets/lock/lock2.svg?react";
import { cva } from "class-variance-authority";

export type ThiefStatus = "caught" | "jailed" | "escaped";

interface StatusButtonProps {
  status: ThiefStatus;
  onChangeStatus: (nextStatus: ThiefStatus) => void;
}

const statusButtonVariants = cva(
  "flex w-[90px] items-center justify-center gap-1 rounded-lg px-2 py-2 text-sm font-medium tracking-[-0.025em] text-white",
  {
    variants: {
      status: {
        jailed: "bg-[#EF44444D] border border-[#EF4444]",
        caught: "bg-[#1E293B4D] border border-[#5576AA]",
        escaped: "bg-[#EF4444] border border-[#EF4444]",
      },
    },
  },
);

const statusLabelMap: Record<ThiefStatus, string> = {
  caught: "검거",
  jailed: "감옥",
  escaped: "탈출 성공",
};

const nextStatusMap: Record<ThiefStatus, ThiefStatus> = {
  caught: "jailed",
  jailed: "escaped",
  escaped: "escaped",
};

const StatusButton = ({ status, onChangeStatus }: StatusButtonProps) => {
  const label = statusLabelMap[status];
  const nextStatus = nextStatusMap[status];

  return (
    <button
      type="button"
      role="status"
      aria-label={`도둑 상태: ${label}`}
      className={statusButtonVariants({ status })}
      disabled={status === "escaped"}
      onClick={() => onChangeStatus(nextStatus)}
    >
      {(status === "caught" || status === "jailed") && (
        <LockIcon className="h-4 w-4" aria-hidden />
      )}
      {label}
    </button>
  );
};

export default StatusButton;
