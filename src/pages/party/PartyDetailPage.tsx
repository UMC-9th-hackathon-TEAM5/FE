import { getRoom } from "@/apis/room";
import { getParticipants, joinRoom } from "@/apis/roommember";
import type { RolePreference } from "@/apis/types";
import Header from "@/components/common/Header";
import PartyInfoCard, {
  PartyInfo,
} from "@/components/common/Card/PartyInfoCard";
import InputLabel from "@/components/common/Input/InputLabel";
import HorizontalBadgeList from "@/components/Badge/HorizontalBadgeList";
import { RoleButton } from "@/components/common/RoleButton";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/common/Button";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

type RoleType = "police" | "thief" | "random" | null;

type Participant = {
  userId: number;
  nickname: string;
  role: string;
  isArrived?: boolean;
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
  police_capacity?: number;
  thief_capacity?: number;
  capacity: {
    current: number;
    total: number;
  };
  participants: Participant[];
};

type LocationState = {
  roomId?: number;
};

export default function PartyDetailPage() {
  const [selectedRole, setSelectedRole] = useState<RoleType>(null);
  const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
  const [participantsData, setParticipantsData] = useState<Participant[] | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

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
  }, [state?.roomId, searchParams]);

  const userId = useMemo(() => {
    const value = localStorage.getItem("userId");
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
        console.error("팟 상세 조회 실패:", error);
        setErrorMessage("팟 정보를 불러오지 못했습니다.");
      }
    };

    fetchRoom();
  }, [roomId, navigate]);

  useEffect(() => {
    if (!roomId) return;
    setParticipantsData(null);

    const fetchParticipants = async () => {
      try {
        const { data } = await getParticipants(roomId);
        setParticipantsData(data.participants);
      } catch (error) {
        console.error("참여자 조회 실패:", error);
      }
    };

    fetchParticipants();
  }, [roomId]);

  const participants = useMemo(
    () => participantsData ?? roomDetail?.participants ?? [],
    [participantsData, roomDetail?.participants],
  );
  const currentCount = roomDetail?.capacity.current ?? participants.length;
  const maxCount = roomDetail?.capacity.total ?? 0;
  const roleCounts = useMemo(() => {
    let police = 0;
    let thief = 0;
    participants.forEach((participant) => {
      const normalizedRole = participant.role?.trim().toUpperCase();
      if (normalizedRole === "POLICE") {
        police += 1;
      } else if (normalizedRole === "THIEF") {
        thief += 1;
      }
    });
    return { policeCount: police, thiefCount: thief };
  }, [participants]);
  const policeCapacity = roomDetail?.police_capacity;
  const thiefCapacity = roomDetail?.thief_capacity;
  const displayPoliceCount =
    typeof policeCapacity === "number" ? policeCapacity : roleCounts.policeCount;
  const displayThiefCount =
    typeof thiefCapacity === "number" ? thiefCapacity : roleCounts.thiefCount;
  const isPoliceFull =
    typeof policeCapacity === "number"
      ? roleCounts.policeCount >= policeCapacity
      : false;
  const isThiefFull =
    typeof thiefCapacity === "number"
      ? roleCounts.thiefCount >= thiefCapacity
      : false;
  const isTotalFull =
    typeof maxCount === "number" && maxCount > 0
      ? currentCount >= maxCount
      : false;
  const isRandomDisabled = isTotalFull || (isPoliceFull && isThiefFull);

  const partyInfo = useMemo<PartyInfo | undefined>(() => {
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

    return {
      date: formattedTime,
      location: roomDetail.placeName,
      countdownTime: `${Math.max(1, Math.round(countdownSeconds))}초`,
      playTime: `${Math.max(1, Math.round(escapeSeconds / 60))}분`,
      people: {
        police: displayPoliceCount,
        thief: displayThiefCount,
      },
    };
  }, [roomDetail, displayPoliceCount, displayThiefCount]);

  const descriptionText = useMemo(() => {
    if (!roomDetail) return "설명을 불러올 수 없습니다.";
    if (roomDetail.description && roomDetail.description.trim().length > 0) {
      return roomDetail.description;
    }
    return "설명이 없습니다.";
  }, [roomDetail]);

  const getButtonState = (role: RoleType) =>
    selectedRole === role ? "active" : "default";

  const isRoleSelected = selectedRole !== null;
  const rolePreference: RolePreference | null =
    selectedRole === "random"
      ? "RANDOM"
      : selectedRole === "police"
        ? "POLICE"
        : selectedRole === "thief"
          ? "THIEF"
          : null;

  const handleJoin = async () => {
    if (!roomId || !userId || !rolePreference) return;
    setIsJoining(true);
    setErrorMessage(null);

    try {
      await joinRoom(roomId, {
        rolePreference,
      });
      navigate(`/party/waiting?roomId=${roomId}`, { state: { roomId } });
    } catch (error) {
      let message = "참여 신청에 실패했습니다.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      }
      setErrorMessage(message);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <>
      <Header title="팟 상세" />
      <main className="relative h-full w-full px-10">
        <section className="flex flex-col py-5" aria-label="파티 상세 정보">
          <div className="mb-3 flex w-full flex-col">
            <div className="text-main text-[20px] font-bold">
              {roomDetail?.title ?? "팟 상세"}
            </div>
            <div className="text-sm font-medium text-white">
              {`현재 ${currentCount}명 / 최대 ${maxCount}명`}
            </div>
          </div>
          <PartyInfoCard info={partyInfo} />
        </section>

        <section className="flex flex-col py-3" aria-label="파티 설명">
          <InputLabel label="설명" className="mb-2" />
          <div className="px-1 text-xs font-medium text-white">
            {descriptionText}
          </div>
        </section>
        <section className="flex flex-col py-3" aria-label="파티 설명">
          <InputLabel label={`참여자 (${currentCount}명)`} />
          <HorizontalBadgeList
            items={participants.map((participant) => participant.nickname)}
          />
        </section>
        <section className="flex flex-col py-3" aria-label="파티 설명">
          <InputLabel label="역할 선택" isRequired={true} className="mb-2" />
          <div className="flex justify-center gap-3">
            <RoleButton
              roleType="police"
              state={getButtonState("police")}
              className="w-24"
              disabled={isPoliceFull || isTotalFull}
              onClick={() => setSelectedRole("police")}
            />
            <RoleButton
              roleType="thief"
              className="w-24"
              state={getButtonState("thief")}
              disabled={isThiefFull || isTotalFull}
              onClick={() => setSelectedRole("thief")}
            />
            <RoleButton
              roleType="random"
              className="w-24"
              state={getButtonState("random")}
              disabled={isRandomDisabled}
              onClick={() => setSelectedRole("random")}
            />
          </div>
        </section>
        <Button
          width="xl"
          state={isRoleSelected ? "active" : "default"}
          disabled={!isRoleSelected}
          className="absolute bottom-10"
          onClick={handleJoin}
        >
          {isJoining ? "신청 중..." : "참여 신청하기"}
        </Button>
        {errorMessage && (
          <p className="mt-3 text-xs text-red-400">* {errorMessage}</p>
        )}
      </main>
    </>
  );
}
