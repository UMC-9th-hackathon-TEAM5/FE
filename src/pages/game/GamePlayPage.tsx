import { useEffect, useState } from "react";
import InputLabel from "@/components/common/Input/InputLabel";
import { PlayerPlayingCard } from "@/components/common/Card/PlayerPlayingCard/PlayerPlayingCard";
import { Button } from "@/components/common/Button";
import EndConfirmModal from "@/components/common/Modal/EndConfirmModal";

type Player = {
  id: string;
  name: string;
  role: "police" | "thief";
  status: "escaped" | "jailed" | "caught" | "none";
  isHost?: boolean;
  isMe?: boolean;
};

const mockPlayers: Player[] = [
  { id: "1", name: "사요", role: "thief", status: "caught" },
  { id: "2", name: "서리", role: "thief", status: "jailed" },
  { id: "3", name: "구디", role: "thief", status: "jailed" },

  { id: "4", name: "이삭", role: "police", status: "caught" },
  { id: "5", name: "나호", role: "police", status: "none" },

  { id: "6", name: "미로", role: "thief", status: "jailed" },
  { id: "7", name: "아진", role: "thief", status: "jailed", isHost: true },
  { id: "8", name: "나호", role: "thief", status: "jailed" },

  { id: "9", name: "사요", role: "police", status: "caught" },
  {
    id: "10",
    name: "서리",
    role: "police",
    status: "none",
  },
  { id: "11", name: "구디", role: "police", status: "none" },
  { id: "12", name: "미로", role: "police", status: "caught" },
];

export default function GamePlayPage() {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [isEndConfirmOpen, setIsEndConfirmOpen] = useState(false);

  const isGuest = false;

  const me = players.find((p) => p.isMe);
  const isPoliceHost = me?.role === "police" && me?.isHost;

  const thieves = players.filter((p) => p.role === "thief");
  const police = players.filter((p) => p.role === "police");

  useEffect(() => {
    if (thieves.length === 0) return;

    const allThievesJailed = thieves.every(
      (player) => player.status === "jailed",
    );

    if (allThievesJailed) {
      setIsEndConfirmOpen(true);
    }
  }, [thieves]);

  const handleGameEnd = () => {
    setIsEndConfirmOpen(false);
    console.log("게임 종료 확정");
  };

  return (
    <>
      {/* 상단 타이머 */}
      <section className="bg-main-dark1 h-38 w-full p-4">
        <div className="flex flex-col items-center justify-center">
          <span className="h-7 text-[20px] font-medium text-white">
            남은 시간
          </span>
          <span className="text-main h-21 text-[60px] font-bold">59 : 59</span>
        </div>
      </section>

      <main className="relative flex h-full w-full flex-col items-center px-7">
        {/* 도둑 섹션 */}
        <section className="py-5">
          <InputLabel
            label="도둑"
            className="text-main mb-3 text-[20px] font-medium"
          />

          <ul
            className={`flex flex-col gap-3 overflow-y-auto pr-1 ${
              isPoliceHost
                ? "max-h-[27dvh]"
                : isGuest
                  ? "max-h-[32dvh]"
                  : "max-h-[30vh]"
            }`}
          >
            {thieves.map((player) => (
              <PlayerPlayingCard
                key={player.id}
                name={player.name}
                role={player.role}
                status={player.status}
                isHost={player.isHost}
                isMe={player.isMe}
                onChangeStatus={
                  isGuest
                    ? undefined
                    : (nextStatus) => {
                        setPlayers((prev) =>
                          prev.map((p) =>
                            p.id === player.id
                              ? { ...p, status: nextStatus }
                              : p,
                          ),
                        );
                      }
                }
              />
            ))}
          </ul>
        </section>

        {/* 경찰 섹션 */}
        <section className="py-5">
          <InputLabel
            label="경찰"
            className="text-main mb-3 text-[20px] font-medium"
          />

          <ul
            className={`flex flex-col gap-3 overflow-y-auto pr-1 ${
              isPoliceHost
                ? "max-h-[27dvh]"
                : isGuest
                  ? "max-h-[32dvh]"
                  : "max-h-[30vh]"
            }`}
          >
            {police.map((player) => (
              <PlayerPlayingCard
                key={player.id}
                name={player.name}
                role={player.role}
                status={player.status}
                isHost={player.isHost}
                isMe={player.isMe}
              />
            ))}
          </ul>
        </section>
        {isPoliceHost && (
          <section className="bg-main-dark2 absolute bottom-0 z-10 flex w-full items-center justify-center pt-7 pb-10">
            <Button
              className="bg-main h-11 w-87.5 rounded-none border-none font-bold text-black shadow-[2px_2px_0_0_#008E58]"
              onClick={() => setIsEndConfirmOpen(true)}
            >
              게임 종료하기
            </Button>
          </section>
        )}
      </main>
      <EndConfirmModal
        isOpen={isEndConfirmOpen}
        onClose={() => setIsEndConfirmOpen(false)}
        onConfirm={handleGameEnd}
      />
    </>
  );
}
