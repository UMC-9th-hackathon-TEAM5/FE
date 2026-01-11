import { postFinishgame } from "@/apis/room";
import { captureThief, getParticipants, releaseThief } from "@/apis/roommember";
import { useCallback, useEffect, useMemo, useState } from "react";
import InputLabel from "@/components/common/Input/InputLabel";
import { PlayerPlayingCard } from "@/components/common/Card/PlayerPlayingCard/PlayerPlayingCard";
import { Button } from "@/components/common/Button";
import EndConfirmModal from "@/components/common/Modal/EndConfirmModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type Player = {
  id: number;
  name: string;
  role: "police" | "thief";
  status: "escaped" | "jailed" | "caught" | "none";
  isHost?: boolean;
  isMe?: boolean;
};

type Participant = {
  userId: number;
  nickname: string;
  role: string;
  isAlive?: boolean;
};

export default function GamePlayPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isEndConfirmOpen, setIsEndConfirmOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEnding, setIsEnding] = useState(false);
  const [gameSeconds, setGameSeconds] = useState(0);

  const navigate = useNavigate();

  const roomId = useMemo(() => {
    const value = localStorage.getItem("roomId");
    if (!value) return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }, []);

  const userId = useMemo(() => {
    const value = localStorage.getItem("userId");
    if (!value) return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }, []);

  const hostId = useMemo(() => {
    const value = localStorage.getItem("hostId");
    if (!value) return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }, []);

  const mapParticipants = useCallback(
    (participants: Participant[]): Player[] =>
      participants.map((participant) => {
        const role = participant.role === "POLICE" ? "police" : "thief";
        const status =
          role === "thief"
            ? participant.isAlive === false
              ? "jailed"
              : "caught"
            : "none";

        return {
          id: participant.userId,
          name: participant.nickname,
          role,
          status,
          isHost: hostId !== null && participant.userId === hostId,
          isMe: userId !== null && participant.userId === userId,
        };
      }),
    [hostId, userId],
  );

  const currentUserRole = useMemo(() => {
    if (userId === null) return null;
    const me = players.find((player) => player.id === userId);
    return me?.role ?? null;
  }, [players, userId]);

  const isGuest = currentUserRole !== "police";

  const hasPoliceHost = players.some((p) => p.role === "police" && p.isHost);

  const thieves = players.filter((p) => p.role === "thief");
  const police = players.filter((p) => p.role === "police");

  useEffect(() => {
    if (!roomId) {
      navigate("/home");
      return;
    }

    const fetchParticipants = async () => {
      try {
        const response = await getParticipants(roomId);
        setPlayers(mapParticipants(response.data.participants));
      } catch (error) {
        console.error("참여자 조회 실패:", error);
        setErrorMessage("참여자 정보를 불러오지 못했습니다.");
      }
    };

    fetchParticipants();
  }, [roomId, navigate, mapParticipants]);

  useEffect(() => {
    const storedSeconds = localStorage.getItem("gameSeconds");
    if (storedSeconds) {
      const parsed = Number(storedSeconds);
      if (!Number.isNaN(parsed)) {
        setGameSeconds(parsed);
        return;
      }
    }
    setGameSeconds(0);
  }, []);

  useEffect(() => {
    if (gameSeconds <= 0) return;
    const timer = setInterval(() => {
      setGameSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [gameSeconds]);

  useEffect(() => {
    if (thieves.length === 0) return;

    const allThievesJailed = thieves.every(
      (player) => player.status === "jailed",
    );

    if (allThievesJailed) {
      setIsEndConfirmOpen(true);
    }
  }, [thieves]);

  const refreshParticipants = async () => {
    if (!roomId) return;
    const response = await getParticipants(roomId);
    setPlayers(mapParticipants(response.data.participants));
  };

  const handleChangeThiefStatus = async (
    targetId: number,
    nextStatus: "jailed" | "escaped" | "caught",
  ) => {
    if (!roomId || !userId) return;
    if (nextStatus === "caught") return;
    setErrorMessage(null);

    try {
      if (currentUserRole === "police" && nextStatus === "jailed") {
        await captureThief(roomId, targetId, userId);
      } else if (
        currentUserRole === "thief" &&
        nextStatus === "escaped" &&
        targetId === userId
      ) {
        await releaseThief(roomId, userId);
      }

      await refreshParticipants();
    } catch (error) {
      let message = "상태 변경에 실패했습니다.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      }
      setErrorMessage(message);
    }
  };

  const handleGameEnd = async () => {
    if (!roomId) return;

    setIsEnding(true);
    setErrorMessage(null);

    const allThievesJailed =
      thieves.length > 0 &&
      thieves.every((player) => player.status === "jailed");
    const winningTeam = allThievesJailed ? "POLICE" : "THIEF";

    try {
      const response = await postFinishgame(roomId, {
        finishReason: "GAME_END",
        winningTeam,
      });
      localStorage.setItem("gameResult", JSON.stringify(response.data));
      localStorage.setItem("gameResultWinningTeam", winningTeam);
      setIsEndConfirmOpen(false);
      navigate(`/game/result?roomId=${roomId}`, {
        state: { roomId, result: response.data, winningTeam },
      });
    } catch (error) {
      let message = "게임 종료에 실패했습니다.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      }
      setErrorMessage(message);
    } finally {
      setIsEnding(false);
    }
  };

  return (
    <>
      {/* 상단 타이머 */}
      <section className="bg-main-dark1 h-38 w-full p-4">
        <div className="flex flex-col items-center justify-center">
          <span className="h-7 text-[20px] font-medium text-white">
            남은 시간
          </span>
          <span className="text-main h-21 text-[60px] font-bold">
            {String(Math.floor(gameSeconds / 60)).padStart(2, "0")} :{" "}
            {String(gameSeconds % 60).padStart(2, "0")}
          </span>
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
              hasPoliceHost
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
                onChangeStatus={(nextStatus) =>
                  handleChangeThiefStatus(player.id, nextStatus)
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
              hasPoliceHost
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
        {hasPoliceHost && (
          <section className="bg-main-dark2 absolute bottom-0 z-10 flex w-full items-center justify-center pt-7 pb-10">
            <Button
              className="bg-main h-11 w-87.5 rounded-none border-none font-bold text-black shadow-[2px_2px_0_0_#008E58]"
              onClick={() => setIsEndConfirmOpen(true)}
              disabled={isEnding}
            >
              {isEnding ? "종료 중..." : "게임 종료하기"}
            </Button>
          </section>
        )}
        {errorMessage && (
          <p className="mt-4 text-xs text-red-400">* {errorMessage}</p>
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
