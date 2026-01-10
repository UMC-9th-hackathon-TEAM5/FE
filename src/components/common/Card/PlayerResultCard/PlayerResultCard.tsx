import { PlayerAvatar } from "@/components/common/Card/PlayerArrivalCard/PlayerAvatar";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";

interface ThiefResult {
  role: "thief";
  result: "survived" | "jailed";
}

interface PoliceResult {
  role: "police";
  catchCount: number;
}

type PlayerResultCardProps = {
  id?: string;
  name: string;
  isHost?: boolean;
  isMe?: boolean;
} & (ThiefResult | PoliceResult);

const PlayerResultCardVariants = cva(
  "w-80.5 h-16.5 relative flex items-center justify-between rounded-xl px-4 py-3 text-white border border-transparent",
  {
    variants: {
      state: {
        thief: "",
        police: "",
      },
    },
    compoundVariants: [
      {
        state: "thief",
        className: "bg-[#1E293B4D] border-[#5576AA]",
      },
      {
        state: "police",
        className: "bg-[#3B82F64D] border-[#3B82F6]",
      },
    ],
    defaultVariants: {
      state: "police",
    },
  },
);

export const PlayerResultCard = ({
  name,
  role,
  isHost,
  isMe,
  ...rest
}: PlayerResultCardProps) => {
  let state: "thief" | "police";
  let resultLabel: string;

  if (role === "thief") {
    const { result } = rest as ThiefResult;

    state = "thief";
    resultLabel = result === "jailed" ? "감옥" : "생존";
  } else {
    const { catchCount } = rest as PoliceResult;
    state = "police";
    resultLabel = `${catchCount}회 검거`;
  }

  return (
    <li
      role="listitem"
      aria-label={`플레이어 ${name} 게임 결과 카드`}
      className={twMerge(PlayerResultCardVariants({ state }))}
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

      <span
        className="text-sm font-semibold"
        aria-label={`게임 결과: ${resultLabel}`}
      >
        {resultLabel}
      </span>
    </li>
  );
};

export default PlayerResultCard;
