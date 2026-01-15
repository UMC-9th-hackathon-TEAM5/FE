import { getRoom } from "@/apis/room";
import {
  getParticipants,
  startGame,
  updateArrivalStatus,
} from "@/apis/roommember";
import { useCallback, useEffect, useMemo, useState } from "react";
import PartyInfoCard, {
  PartyInfo,
} from "@/components/common/Card/PartyInfoCard";
import Header from "@/components/common/Header";
import InputLabel from "@/components/common/Input/InputLabel";

import { PlayerArrivalCard } from "@/components/common/Card/PlayerArrivalCard/PlayerArrivalCard";
import { Button } from "@/components/common/Button";

import ChangeRoleIcon from "@/assets/change/change.svg?react";
import InfoIcon from "@/assets/info/info.svg?react";

import { GameRuleModal } from "@/components/common/Modal/GameruleModal";

import { validatePlayers } from "@/utils/validatePartyPlayers";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import clsx from "clsx";

type PlayerRole = "police" | "thief";
type ArrivalStatus = "arrived" | "notArrived";

type PlayerState = {
  userId: number;
  name: string;
  role: PlayerRole;
  arrivalStatus: ArrivalStatus;
  isHost?: boolean;
  isMe?: boolean;
};

type RoomDetail = {
  roomId: number;
  title: string;
  description?: string;
  placeName: string;
  meetingTime: string;
  status: string;
  countdownSeconds: number;
  escapeTime?: number;
  capacity: {
    current: number;
    total: number;
  };
  participants: Participant[];
};

type LocationState = {
  roomId?: number;
  hostId?: number;
};

type Participant = {
  userId: number;
  nickname: string;
  role: string;
  isArrived?: boolean;
};

const POLL_INTERVAL_MS = 3000;

const readStoredNumber = (key: string) => {
  const value = localStorage.getItem(key);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

export default function WaitingPartyPage() {
  const [isRuleOpen, setIsRuleOpen] = useState(false);
  const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const state = (location.state as LocationState | null) ?? null;
  const [userId, setUserId] = useState<number | null>(() =>
    readStoredNumber("userId"),
  );

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
  }, [state?.roomId, searchParams]);

  useEffect(() => {
    if (!searchParams.get("roomId") && roomId) {
      navigate(`/party/waiting?roomId=${roomId}`, { replace: true });
    }
  }, [roomId, navigate, searchParams]);

  const [hostId, setHostId] = useState<number | null>(() => {
    if (state?.hostId) return state.hostId;
    return readStoredNumber("hostId");
  });

  const isHost = userId !== null && hostId !== null && userId === hostId;

  useEffect(() => {
    if (import.meta.env.VITE_MOCK_API !== "true") return;
    const queryRoomId = searchParams.get("roomId");
    if (queryRoomId !== "65") return;
    const mockId = 2;
    localStorage.setItem("userId", String(mockId));
    localStorage.setItem("hostId", String(mockId));
    localStorage.setItem("nickname", "Officer");
    setUserId(mockId);
    setHostId(mockId);
  }, [searchParams]);
  useEffect(() => {
    if (state?.roomId) {
      localStorage.setItem("roomId", String(state.roomId));
    }
    if (state?.hostId) {
      localStorage.setItem("hostId", String(state.hostId));
      setHostId(state.hostId);
    }
  }, [state?.roomId, state?.hostId]);

  const mapParticipants = useCallback(
    (
      participants: Participant[],
      roleOverrides?: Map<number, PlayerRole>,
    ): PlayerState[] =>
      participants.map((participant) => {
        const normalizedRole = participant.role?.trim().toUpperCase();
        let mappedRole: PlayerRole;

        if (normalizedRole === "POLICE") {
          mappedRole = "police";
        } else if (normalizedRole === "THIEF") {
          mappedRole = "thief";
        } else if (roleOverrides?.has(participant.userId)) {
          mappedRole = roleOverrides.get(participant.userId) as PlayerRole;
        } else {
          mappedRole = "thief";
        }

        return {
          userId: participant.userId,
          name: participant.nickname,
          role: mappedRole,
          arrivalStatus:
            (participant.isArrived ?? false) ? "arrived" : "notArrived",
          isHost: hostId !== null && participant.userId === hostId,
          isMe: userId !== null && participant.userId === userId,
        };
      }),
    [hostId, userId],
  );

  useEffect(() => {
    if (!roomId) {
      navigate("/home");
      return;
    }

    const fetchRoom = async () => {
      try {
        const roomRes = await getRoom(roomId);
        const roomData = roomRes.data;
        setRoomDetail(roomData);
        setPlayers(mapParticipants(roomData.participants));

        const { data: participantsRes } = await getParticipants(roomId);
        const overrides = new Map<number, PlayerRole>(
          roomData.participants.map((participant) => [
            participant.userId,
            participant.role === "POLICE" ? "police" : "thief",
          ]),
        );
        setPlayers(mapParticipants(participantsRes.participants, overrides));
      } catch (error) {
        console.error("대기방 조회 실패:", error);
        setErrorMessage("대기방 정보를 불러오지 못했습니다.");
      }
    };

    fetchRoom();
  }, [roomId, navigate, mapParticipants]);

  const refreshParticipants = useCallback(async () => {
    if (!roomId) return;
    try {
      const { data: participantsRes } = await getParticipants(roomId);
      const overrides = new Map<number, PlayerRole>(
        players.map((player) => [player.userId, player.role]),
      );
      setPlayers(mapParticipants(participantsRes.participants, overrides));
    } catch (error) {
      console.error("대기방 참여자 갱신 실패:", error);
    }
  }, [roomId, players, mapParticipants]);

  useEffect(() => {
    if (!roomId) return;
    const intervalId = window.setInterval(() => {
      void refreshParticipants();
    }, POLL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [roomId, refreshParticipants]);

  const partyInfo: PartyInfo | undefined = useMemo(() => {
    if (!roomDetail) return undefined;
    const formattedTime = roomDetail.meetingTime.replace("T", " ").slice(0, 16);
    const countdownSeconds =
      typeof roomDetail.countdownSeconds === "number" &&
      roomDetail.countdownSeconds > 0
        ? roomDetail.countdownSeconds
        : 60;
    const escapeSeconds =
      typeof roomDetail.escapeTime === "number" && roomDetail.escapeTime > 0
        ? roomDetail.escapeTime
        : 30 * 60;
    const playMinutes = Math.max(1, Math.round(escapeSeconds / 60));
    const policeCount = players.filter((p) => p.role === "police").length;
    const thiefCount = players.filter((p) => p.role === "thief").length;

    return {
      date: formattedTime,
      location: roomDetail.placeName,
      countdownTime: `${Math.max(1, Math.round(countdownSeconds))}초`,
      playTime: `${playMinutes}분`,
      people: {
        police: policeCount,
        thief: thiefCount,
      },
    };
  }, [roomDetail, players]);

  const descriptionText = useMemo(() => {
    if (!roomDetail) return "설명을 불러올 수 없습니다.";
    if (roomDetail.description && roomDetail.description.trim().length > 0) {
      return roomDetail.description;
    }
    return "설명이 없습니다.";
  }, [roomDetail]);

  const handleToggleRole = (targetId: number) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.userId === targetId
          ? {
              ...player,
              role: player.role === "police" ? "thief" : "police",
            }
          : player,
      ),
    );
  };

  const handleToggleArrival = async (targetId: number) => {
    if (!roomId || !userId || !isHost) return;
    setErrorMessage(null);

    try {
      await updateArrivalStatus(roomId, targetId);

      const { data: participantsRes } = await getParticipants(roomId);
      const overrides = new Map<number, PlayerRole>(
        players.map((player) => [player.userId, player.role]),
      );
      setPlayers(mapParticipants(participantsRes.participants, overrides));
    } catch (error) {
      let message = "도착 상태 변경에 실패했습니다.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      }
      setErrorMessage(message);
    }
  };

  const handleStartGame = async () => {
    if (!roomId || !hostId) return;

    const validation = validatePlayers(players);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    setIsStarting(true);
    setErrorMessage(null);

    try {
      await startGame(roomId, {
        roles: players.map((player) => ({
          userId: player.userId,
          role: player.role === "police" ? "POLICE" : "THIEF",
        })),
      });
      const currentUserRole =
        players.find((player) => player.isMe)?.role ?? "thief";
      navigate("/game/start", {
        state: { roomId, role: currentUserRole },
      });
    } catch (error) {
      let message = "게임 시작에 실패했습니다.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      }
      setErrorMessage(message);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <>
      <Header title="대기방" onClick={() => navigate("/home")} />
      <main className="relative h-full w-full px-9" role="main">
        <section
          className="flex flex-col py-5"
          role="region"
          aria-label="파티 정보"
        >
          <InputLabel
            label={roomDetail?.title ?? "대기방"}
            className="text-main mb-2 text-[20px]"
          />

          <PartyInfoCard info={partyInfo} />
        </section>
        <section
          className="flex flex-col py-3"
          role="region"
          aria-label="파티 설명"
        >
          <InputLabel label="설명" className="mb-2" />
          <div className="w-full px-2 text-[12px] font-medium tracking-[-0.025em] whitespace-pre-line text-white">
            {descriptionText}
          </div>
        </section>
        <section
          className="relative flex flex-col py-3"
          role="region"
          aria-label="참여자 목록"
        >
          <InputLabel label="참여자 목록" className="mb-2" />
          {isHost && (
            <div className="text-gray absolute top-4 right-3 flex items-center gap-2 text-[12px] font-medium">
              <ChangeRoleIcon aria-hidden="true" />
              <span className="tracking-[-0.025em]">클릭하여 역할 변경</span>
            </div>
          )}
          <div
            className={clsx(
              "flex flex-col gap-3 overflow-y-auto",
              isHost ? "max-h-[25vh]" : "max-h-[35vh]",
            )}
            role="list"
          >
            {players.map((player) => (
              <div role="listitem" key={player.userId}>
                <PlayerArrivalCard
                  name={player.name}
                  role={player.role}
                  arrivalStatus={player.arrivalStatus}
                  isHost={player.isHost}
                  isMe={player.isMe}
                  avatarClassName="mb-2"
                  canEditRole={isHost}
                  canToggleArrival={isHost}
                  onToggleRole={
                    isHost || player.isMe
                      ? () => handleToggleRole(player.userId)
                      : undefined
                  }
                  onToggleArrival={
                    isHost ? () => handleToggleArrival(player.userId) : undefined
                  }
                />
              </div>
            ))}
          </div>
        </section>
        <section
          className="absolute right-0 bottom-4 left-0 flex flex-col items-center gap-1"
          role="region"
          aria-label="대기방 하단 액션"
        >
          <button
            className="text-point flex h-14 w-full items-center justify-center gap-2 bg-[#FAA91633]"
            onClick={() => setIsRuleOpen(true)}
            aria-label="게임 규칙 확인하기"
          >
            <InfoIcon className="h-6 w-6" aria-hidden="true" />
            <span>게임 규칙 확인하기</span>
          </button>
          {isHost && (
            <Button
              width="xl"
              state="active"
              className="my-4"
              onClick={handleStartGame}
              disabled={isStarting}
            >
              {isStarting ? "시작 중..." : "게임시작하기"}
            </Button>
          )}
          {errorMessage && (
            <p className="text-xs text-red-400">* {errorMessage}</p>
          )}
        </section>
      </main>
      <GameRuleModal isOpen={isRuleOpen} onClose={() => setIsRuleOpen(false)} />
    </>
  );
}
