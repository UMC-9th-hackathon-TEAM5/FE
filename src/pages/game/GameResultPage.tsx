import { getRoom } from "@/apis/room";
import { getParticipants } from "@/apis/roommember";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  isAlive?: "ALIVE" | "CAUGHT" | boolean;
  caughtCount?: number;
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
  participants: ParticipantResult[];
};

type LocationState = {
  roomId?: number;
};

export default function GameResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const state = (location.state as LocationState | null) ?? null;
  const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
  const [participantsData, setParticipantsData] = useState<
    ParticipantResult[] | null
  >(null);
  const [isCardBusy, setIsCardBusy] = useState(false);

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
    if (!roomId) {
      navigate("/home");
      return;
    }

    const fetchRoom = async () => {
      try {
        const { data } = await getRoom(roomId);
        setRoomDetail(data);
      } catch (error) {
        console.error("게임 결과 방 정보 조회 실패:", error);
      }
    };

    fetchRoom();
  }, [roomId, navigate]);

  useEffect(() => {
    if (!roomId) return;

    const fetchParticipants = async () => {
      try {
        const { data } = await getParticipants(roomId);
        setParticipantsData(data.participants);
      } catch (error) {
        console.error("게임 결과 참여자 조회 실패:", error);
      }
    };

    fetchParticipants();
  }, [roomId]);

  const participants = useMemo(
    () => participantsData ?? roomDetail?.participants ?? [],
    [participantsData, roomDetail],
  );

  const winningTeam = useMemo(() => {
    const thieves = participants.filter(
      (participant) => participant.role === "THIEF",
    );
    if (thieves.length === 0) return null;
    const anyThiefAlive = thieves.some(
      (participant) =>
        participant.isAlive !== "CAUGHT" && participant.isAlive !== false,
    );
    return anyThiefAlive ? "THIEF" : "POLICE";
  }, [participants]);

  const partyInfo: PartyInfo | undefined = useMemo(() => {
    if (!roomDetail) return undefined;
    const formattedTime = roomDetail.meetingTime.replace("T", " ").slice(0, 16);
    const policeCount = participants.filter(
      (participant) => participant.role === "POLICE",
    ).length;
    const thiefCount = participants.filter(
      (participant) => participant.role === "THIEF",
    ).length;
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
  }, [roomDetail, participants]);

  const results = useMemo(
    () =>
      participants.map((participant) => {
        const role =
          participant.role === "POLICE"
            ? ("police" as const)
            : ("thief" as const);
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
            participant.isAlive === "CAUGHT" || participant.isAlive === false
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
    winningTeam === null
      ? "결과 집계 중..."
      : winningTeam === "POLICE"
        ? "경찰팀 승리!"
        : "도둑팀 승리!";
  const descriptionText =
    winningTeam === null
      ? "결과를 불러오는 중입니다."
      : winningTeam === "POLICE"
        ? "도둑들이 모두 잡혔습니다!"
        : "도둑들이 시간 내에 살아남았습니다!";

  const downloadBlob = useCallback((blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "game-result-card.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, []);

  const buildResultCardBlob = useCallback(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const background = ctx.createLinearGradient(0, 0, 0, canvas.height);
    background.addColorStop(0, "#111111");
    background.addColorStop(1, "#0c2620");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const mainColor =
      winningTeam === "POLICE"
        ? "#3B82F6"
        : winningTeam === "THIEF"
          ? "#EF4444"
          : "#00FD9E";

    ctx.fillStyle = "#00FD9E";
    ctx.font = "bold 48px Pretendard, sans-serif";
    ctx.fillText("경도팟", 80, 120);

    ctx.fillStyle = mainColor;
    ctx.font = "bold 96px Pretendard, sans-serif";
    ctx.fillText(titleText, 80, 240, 920);

    ctx.fillStyle = "#ffffff";
    ctx.font = "32px Pretendard, sans-serif";
    ctx.fillText(descriptionText, 80, 320, 920);

    const infoLines = [
      `일시 ${partyInfo?.date ?? "-"}`,
      `장소 ${partyInfo?.location ?? "-"}`,
      `카운트다운 ${partyInfo?.countdownTime ?? "-"}`,
      `플레이 ${partyInfo?.playTime ?? "-"}`,
      `인원 경찰 ${partyInfo?.people.police ?? 0}명 / 도둑 ${partyInfo?.people.thief ?? 0}명`,
    ];

    ctx.font = "bold 36px Pretendard, sans-serif";
    let y = 460;
    infoLines.forEach((line) => {
      ctx.fillText(line, 80, y, 920);
      y += 56;
    });

    return await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  }, [descriptionText, partyInfo, titleText, winningTeam]);

  const handleShareCard = useCallback(async () => {
    if (isCardBusy) return;
    setIsCardBusy(true);
    try {
      const blob = await buildResultCardBlob();
      if (!blob) return;

      const file = new File([blob], "game-result-card.png", {
        type: "image/png",
      });

      const shareTitle = roomDetail?.title ?? "경도팟 모임";
      const shareText = titleText;
      const canShareFiles =
        typeof navigator.canShare === "function"
          ? navigator.canShare({ files: [file] })
          : null;

      const isAbortError = (error: unknown) =>
        error instanceof DOMException && error.name === "AbortError";

      if (navigator.share) {
        if (canShareFiles !== false) {
          try {
            await navigator.share({
              files: [file],
              title: shareTitle,
              text: shareText,
            });
            return;
          } catch (error) {
            if (isAbortError(error)) return;
          }
        }

        try {
          await navigator.share({ title: shareTitle, text: shareText });
          return;
        } catch (error) {
          if (isAbortError(error)) return;
        }
      }

      downloadBlob(blob);
    } catch (error) {
      console.error("결과 카드 공유 실패:", error);
    } finally {
      setIsCardBusy(false);
    }
  }, [buildResultCardBlob, downloadBlob, isCardBusy, roomDetail, titleText]);
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

          <Button
            width="xl"
            state="instagram"
            onClick={handleShareCard}
            disabled={isCardBusy}
          >
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
