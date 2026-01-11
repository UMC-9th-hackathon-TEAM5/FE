import { getRoom } from "@/apis/room";
import { joinRoom } from "@/apis/roommember";
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
  placeName: string;
  meetingTime: string;
  status: string;
  countdownSeconds: number;
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

  const participants = useMemo(
    () => roomDetail?.participants ?? [],
    [roomDetail?.participants],
  );
  const currentCount = roomDetail?.capacity.current ?? participants.length;
  const maxCount = roomDetail?.capacity.total ?? 0;

  const partyInfo = useMemo<PartyInfo | undefined>(() => {
    if (!roomDetail) return undefined;
    const formattedTime = roomDetail.meetingTime.replace("T", " ").slice(0, 16);
    const policeCount = participants.filter(
      (participant) => participant.role === "POLICE",
    ).length;
    const thiefCount = participants.filter(
      (participant) => participant.role === "THIEF",
    ).length;

    return {
      date: formattedTime,
      location: roomDetail.placeName,
      playTime: `${Math.max(1, Math.round(roomDetail.countdownSeconds / 60))}분`,
      people: {
        police: policeCount,
        thief: thiefCount,
      },
    };
  }, [roomDetail, participants]);

  const getButtonState = (role: RoleType) =>
    selectedRole === role ? "active" : "default";

  const isRoleSelected = selectedRole !== null;
  const rolePreference = selectedRole === "random" ? "ANY" : selectedRole;

  const handleJoin = async () => {
    if (!roomId || !userId || !rolePreference) return;
    setIsJoining(true);
    setErrorMessage(null);

    try {
      await joinRoom(roomId, userId, {
        rolePreference: rolePreference.toUpperCase(),
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
            {roomDetail ? "설명이 없습니다." : "설명을 불러올 수 없습니다."}
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
              onClick={() => setSelectedRole("police")}
            />
            <RoleButton
              roleType="thief"
              className="w-24"
              state={getButtonState("thief")}
              onClick={() => setSelectedRole("thief")}
            />
            <RoleButton
              roleType="random"
              className="w-24"
              state={getButtonState("random")}
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
