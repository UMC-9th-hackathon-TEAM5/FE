import { getRoom, postFinishgame } from "@/apis/room";
import { captureThief, getParticipants, releaseThief } from "@/apis/roommember";
import type { ParticipantInfo } from "@/apis/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import InputLabel from "@/components/common/Input/InputLabel";
import { PlayerPlayingCard } from "@/components/common/Card/PlayerPlayingCard/PlayerPlayingCard";
import { Button } from "@/components/common/Button";
import EndConfirmModal from "@/components/common/Modal/EndConfirmModal";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

type Player = {
  id: number;
  name: string;
  role: "police" | "thief";
  status: "escaped" | "jailed" | "caught" | "none";
  isHost?: boolean;
  isMe?: boolean;
};

type LocationState = {
  roomId?: number;
};

const POLL_INTERVAL_MS = 3000;

export default function GamePlayPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isEndConfirmOpen, setIsEndConfirmOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEnding, setIsEnding] = useState(false);
  const [gameSeconds, setGameSeconds] = useState(0);
  const autoFinishTriggeredRef = useRef(false);
  const prevGameSecondsRef = useRef<number | null>(null);
  const escapedThiefIdsRef = useRef<Set<number>>(new Set());
  const previousCaughtRef = useRef<Map<number, boolean>>(new Map());

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const state = (location.state as LocationState | null) ?? null;

  const roomId = useMemo(() => {
    if (state?.roomId) return state.roomId;
    const queryValue = searchParams.get("roomId");
    if (queryValue) {
      const parsed = Number(queryValue);
      if (!Number.isNaN(parsed)) return parsed;
    }
    const value = localStorage.getItem("roomId");
    if (!value) return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }, [searchParams, state?.roomId]);

  useEffect(() => {
    if (!roomId) return;
    localStorage.setItem("roomId", String(roomId));
  }, [roomId]);

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
  const isHost = userId !== null && hostId !== null && userId === hostId;

  const mapParticipants = useCallback(
    (participants: ParticipantInfo[]): Player[] => {
      const viewerRole = participants.find(
        (participant) => participant.userId === userId,
      )?.role;
      const isViewerPolice = viewerRole === "POLICE";
      const nextEscapedIds = new Set(escapedThiefIdsRef.current);
      const nextPreviousCaught = new Map(previousCaughtRef.current);

      const mapped: Player[] = participants.map((participant): Player => {
        const role: Player["role"] =
          participant.role === "POLICE" ? "police" : "thief";
        const isCaught =
          participant.isAlive === "CAUGHT" || participant.isAlive === false;

        if (role === "thief") {
          const wasCaught = nextPreviousCaught.get(participant.userId) ?? false;
          if (isCaught) {
            nextEscapedIds.delete(participant.userId);
            nextPreviousCaught.set(participant.userId, true);
          } else {
            if (wasCaught) {
              nextEscapedIds.add(participant.userId);
            }
            nextPreviousCaught.set(participant.userId, false);
          }
        }

        const status: Player["status"] =
          role === "thief"
            ? isCaught
              ? "jailed"
              : isViewerPolice
                ? nextEscapedIds.has(participant.userId)
                  ? "escaped"
                  : "caught"
                : "escaped"
            : "none";

        return {
          id: participant.userId,
          name: participant.nickname,
          role,
          status,
          isHost: hostId !== null && participant.userId === hostId,
          isMe: userId !== null && participant.userId === userId,
        };
      });

      escapedThiefIdsRef.current = nextEscapedIds;
      previousCaughtRef.current = nextPreviousCaught;
      return mapped;
    },
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
        const { data: participantsRes } = await getParticipants(roomId);
        setPlayers(mapParticipants(participantsRes.participants));
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
    if (!roomId) {
      setGameSeconds(0);
      return;
    }

    const fetchRoomSeconds = async () => {
      try {
        const { data } = await getRoom(roomId);
        const escapeSeconds =
          typeof data.escapeTime === "number" && data.escapeTime > 0
            ? data.escapeTime
            : 30 * 60;
        setGameSeconds(escapeSeconds);
        localStorage.setItem("gameSeconds", String(escapeSeconds));
      } catch (error) {
        console.error("게임 시간 조회 실패:", error);
        setGameSeconds(0);
      }
    };

    fetchRoomSeconds();
  }, [roomId]);

  useEffect(() => {
    if (gameSeconds <= 0) return;
    const timer = setInterval(() => {
      setGameSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [gameSeconds]);

  const refreshParticipants = useCallback(async () => {
    if (!roomId) return;
    try {
      const { data: participantsRes } = await getParticipants(roomId);
      setPlayers(mapParticipants(participantsRes.participants));
    } catch (error) {
      console.error("참여자 갱신 실패:", error);
    }
  }, [roomId, mapParticipants]);

  useEffect(() => {
    if (!roomId) return;
    const intervalId = window.setInterval(() => {
      void refreshParticipants();
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [roomId, refreshParticipants]);

  const handleChangeThiefStatus = async (
    targetId: number,
    nextStatus: "jailed" | "escaped" | "caught",
  ) => {
    if (!roomId || !userId) return;
    setErrorMessage(null);

    try {
      if (currentUserRole === "police") {
        if (nextStatus === "jailed" || nextStatus === "caught") {
          await captureThief(roomId, targetId);
        } else {
          return;
        }
      } else if (
        currentUserRole === "thief" &&
        nextStatus === "escaped" &&
        targetId === userId
      ) {
        await releaseThief(roomId);
      } else {
        return;
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

  const handleGameEnd = useCallback(async () => {
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
  }, [navigate, roomId, thieves]);

  useEffect(() => {
    if (prevGameSecondsRef.current === null) {
      prevGameSecondsRef.current = gameSeconds;
      return;
    }

    const prevSeconds = prevGameSecondsRef.current;
    prevGameSecondsRef.current = gameSeconds;

    if (prevSeconds <= 0 || gameSeconds !== 0) return;
    if (autoFinishTriggeredRef.current) return;

    autoFinishTriggeredRef.current = true;

    if (isHost) {
      void handleGameEnd();
      return;
    }

    if (roomId) {
      navigate(`/game/result?roomId=${roomId}`, { replace: true });
    }
  }, [gameSeconds, handleGameEnd, isHost, navigate, roomId]);

  useEffect(() => {
    if (thieves.length === 0) return;

    const allThievesJailed = thieves.every(
      (player) => player.status === "jailed",
    );

    if (!allThievesJailed || autoFinishTriggeredRef.current) return;

    autoFinishTriggeredRef.current = true;

    if (isHost) {
      void handleGameEnd();
      return;
    }

    if (roomId) {
      localStorage.setItem("gameResultWinningTeam", "POLICE");
      navigate(`/game/result?roomId=${roomId}`, { replace: true });
    }
  }, [handleGameEnd, isHost, navigate, roomId, thieves]);

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

      <main className="relative flex min-h-full w-full flex-col items-center px-7 pb-32">
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
                statusDisabled={
                  currentUserRole === "police"
                    ? false
                    : currentUserRole === "thief"
                      ? !player.isMe
                      : true
                }
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
          <section className="bg-main-dark2 mt-6 flex w-full items-center justify-center pt-7 pb-10">
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
