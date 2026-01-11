import { getRoom } from "@/apis/room";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import PartyInfoCard, {
  PartyInfo,
} from "@/components/common/Card/PartyInfoCard";
import PlayerResultCard from "@/components/common/Card/PlayerResultCard/PlayerResultCard";
import InputLabel from "@/components/common/Input/InputLabel";
import { Button } from "@/components/common/Button";

import ThrophyIcon from "@/assets/throphy/trophy.svg?react";
import ShareIcon from "@/assets/share/share.svg?react";

type ParticipantResult = {
  userId: number;
  nickname: string;
  role: string;
  isAlive?: boolean;
  caughtCount?: number;
};

type GameResultData = {
  startTime: string;
  endTime: string;
  participants: ParticipantResult[];
};

type RoomDetail = {
  roomId: number;
  title: string;
  placeName: string;
  meetingTime: string;
  status: string;
  countdownSeconds: number;
  escapeTime?: number;
  capacity: {
    current: number;
    total: number;
  };
  participants: ParticipantResult[];
};

type LocationState = {
  roomId?: number;
  result?: GameResultData;
  winningTeam?: "POLICE" | "THIEF";
};

export default function GameResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const state = (location.state as LocationState | null) ?? null;
  const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
  const [resultData, setResultData] = useState<GameResultData | null>(null);
  const [winningTeam, setWinningTeam] = useState<"POLICE" | "THIEF" | null>(
    null,
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

  useEffect(() => {
    if (state?.result) {
      setResultData(state.result);
    } else {
      const storedResult = localStorage.getItem("gameResult");
      if (storedResult) {
        try {
          setResultData(JSON.parse(storedResult));
        } catch {
          setResultData(null);
        }
      }
    }

    if (state?.winningTeam) {
      setWinningTeam(state.winningTeam);
    } else {
      const storedTeam = localStorage.getItem("gameResultWinningTeam");
      if (storedTeam === "POLICE" || storedTeam === "THIEF") {
        setWinningTeam(storedTeam);
      }
    }
  }, [state?.result, state?.winningTeam]);

  useEffect(() => {
    if (!roomId) {
      navigate("/home");
      return;
    }

    const fetchRoom = async () => {
      try {
        const response = await getRoom(roomId);
        setRoomDetail(response.data);
      } catch (error) {
        console.error("게임 결과 방 정보 조회 실패:", error);
      }
    };

    fetchRoom();
  }, [roomId, navigate]);

  const participants = useMemo(
    () => resultData?.participants ?? roomDetail?.participants ?? [],
    [resultData, roomDetail],
  );

  const partyInfo: PartyInfo | undefined = useMemo(() => {
    if (!roomDetail) return undefined;
    const formattedTime = roomDetail.meetingTime.replace("T", " ").slice(0, 16);
    const policeCount = participants.filter(
      (participant) => participant.role === "POLICE",
    ).length;
    const thiefCount = participants.filter(
      (participant) => participant.role === "THIEF",
    ).length;
    const playMinutes =
      typeof roomDetail.escapeTime === "number"
        ? Math.max(1, roomDetail.escapeTime)
        : Math.max(1, Math.round(roomDetail.countdownSeconds / 60));

    return {
      date: formattedTime,
      location: roomDetail.placeName,
      playTime: `${playMinutes}분`,
      people: {
        police: policeCount,
        thief: thiefCount,
      },
    };
  }, [roomDetail, participants]);

  const results = useMemo(
    () =>
      participants.map((participant) => {
        const role =
          participant.role === "POLICE" ? ("police" as const) : ("thief" as const);
        if (role === "police") {
          return {
            id: String(participant.userId),
            name: participant.nickname,
            role,
            catchCount: participant.caughtCount ?? 0,
            isHost: hostId !== null && participant.userId === hostId,
            isMe: userId !== null && participant.userId === userId,
          };
        }
        return {
          id: String(participant.userId),
          name: participant.nickname,
          role,
          result:
            participant.isAlive === false
              ? ("jailed" as const)
              : ("survived" as const),
          isHost: hostId !== null && participant.userId === hostId,
          isMe: userId !== null && participant.userId === userId,
        };
      }),
    [participants, hostId, userId],
  );

  const sortedResults = useMemo(
    () => [
      ...results.filter((player) => player.role === "thief"),
      ...results.filter((player) => player.role === "police"),
    ],
    [results],
  );

  const titleText =
    winningTeam === "POLICE" ? "경찰팀 승리!" : "도둑팀 승리!";
  const descriptionText =
    winningTeam === "POLICE"
      ? "도둑들이 모두 잡혔습니다!"
      : "도둑들이 시간 내에 살아남았습니다!";
  return (
    <>
      <main className="relative flex h-full w-full flex-col items-center overflow-y-auto px-7">
        <section className="flex w-full flex-col items-center justify-center py-5">
          <ThrophyIcon className="" />
          <span className="text-main text-[40px] font-bold">{titleText}</span>
          <span className="text-base font-medium text-white">
            {descriptionText}
          </span>
        </section>
        <section className="flex w-full flex-col items-center justify-center px-3 py-5">
          <InputLabel
            label={roomDetail?.title ?? "팟 결과"}
            className="mb-2 text-[20px]"
          />
          <PartyInfoCard info={partyInfo} />
        </section>
        <section className="flex w-full flex-col items-center justify-center py-5">
          <InputLabel label="참여자 기록" className="mb-2 text-[20px]" />
          <ul className="flex w-full flex-col items-center justify-center gap-3">
            {sortedResults.map((player) => (
              <PlayerResultCard key={player.id} {...player} />
            ))}
          </ul>
        </section>
        <section className="flex w-full flex-col items-center justify-center gap-4 pt-3 pb-10">
          <InputLabel label="공유" className="ml-7 text-[20px]" />
          <div className="ml-7 w-full text-sm font-medium">
            <span>
              <span className="text-main">
                {roomDetail?.title ?? "경도팟 모임"}
              </span>
              <span className="text-white"> 어떠셨나요?</span>
              <br />
            </span>
            <span className="text-white">
              추억을 인스타그램 스토리로 공유해보세요!
            </span>
          </div>
          <Button width="xl" state="instagram">
            <div className="flex items-center gap-2">
              <ShareIcon /> Instargram 스토리로 공유하기
            </div>
          </Button>
          <Button width="xl" state={"active"} onClick={() => navigate("/home")}>
            메인으로 돌아가기
          </Button>
        </section>
      </main>
    </>
  );
}
