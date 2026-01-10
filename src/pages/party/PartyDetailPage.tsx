import Header from "@/components/common/Header";
import {
  PartyInfoCard,
  PartyInfo,
} from "@/components/common/Card/PartyInfoCard";
import InputLabel from "@/components/common/Input/InputLabel";
import HorizontalBadgeList from "@/components/Badge/HorizontalBadgeList";
import { RoleButton } from "@/components/common/RoleButton";
import { useEffect, useState } from "react";
import { Button } from "@/components/common/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { getRoom } from "@/apis/room";
import { joinRoom } from "@/apis/roommember";


type RoleType = "POLICE" | "THIEF" | "RANDOM" | null;

export default function PartyDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = location.state?.roomId; // HomePage에서 전달받은 ID

  const [selectedRole, setSelectedRole] = useState<RoleType>(null);
  const [roomData, setRoomData] = useState<RoomDetailDto | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. 방 정보 불러오기
  useEffect(() => {
    if (!roomId) {
      alert("잘못된 접근입니다.");
      navigate("/home");
      return;
    }

    const fetchRoomDetail = async () => {
      try {
        const response = await getRoom(roomId);
        console.log("방 상세 정보:", response.data);
        setRoomData(response.data);
      } catch (error) {
        console.error("방 정보 조회 실패:", error);
        alert("방 정보를 불러올 수 없습니다.");
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetail();
  }, [roomId, navigate]);

  // 2. 참여하기 버튼 핸들러
  const handleJoin = async () => {
    if (!roomId || !selectedRole) return;

    try {
      await joinRoom(roomId, { role: selectedRole });
      alert("참여가 완료되었습니다!");
      
      // 대기실(로비)로 이동 - 페이지 경로는 상황에 맞게 수정하세요
      navigate(`/party/lobby/${roomId}`); 
    } catch (error) {
      console.error("참여 실패:", error);
      alert("방 참여에 실패했습니다. (인원 초과 등)");
    }
  };

  // 로딩 중일 때 표시
  if (loading) {
    return <div className="w-full h-full flex items-center justify-center text-white">Loading...</div>;
  }

  // 데이터가 없을 때
  if (!roomData) return null;

  // 3. UI에 맞게 데이터 가공
  // 날짜 포맷팅 (YYYY-MM-DD)
  const dateStr = roomData.createdAt.split("T")[0]; 
  
  const partyInfo: PartyInfo = {
    date: dateStr,
    location: roomData.location || "위치 정보 없음", // API에 location 필드가 있다고 가정
    playTime: `${roomData.gameTime}분`,
    people: {
      police: roomData.maxPolice,
      thief: roomData.maxThief,
    },
  };

  const currentCount = roomData.currentPolice + roomData.currentThief;
  const maxCount = roomData.maxPolice + roomData.maxThief;
  
  // 참여자 목록 (없으면 빈 배열)
  const playerList = roomData.participants || [];

  const getButtonState = (role: RoleType) =>
    selectedRole === role ? "active" : "default";

  const isRoleSelected = selectedRole !== null;

  return (
    <>
      <Header title="팟 상세" />
      <main className="relative h-full w-full px-10 overflow-y-auto pb-24">
        <section className="flex flex-col py-5" aria-label="파티 상세 정보">
          <div className="mb-3 flex w-full flex-col">
            <div className="text-main text-[20px] font-bold">
              {roomData.title}
            </div>
            <div className="text-sm font-medium text-white">
              {`현재 ${currentCount}명 / 최대 ${maxCount}명`}
            </div>
          </div>
          <PartyInfoCard info={partyInfo} />
        </section>

        <section className="flex flex-col py-3" aria-label="파티 설명">
          <InputLabel label="설명" className="mb-2" />
          <div className="px-1 text-xs font-medium text-white whitespace-pre-wrap">
            {roomData.description}
          </div>
        </section>

        <section className="flex flex-col py-3" aria-label="참여자 목록">
          <InputLabel label={`참여자 (${playerList.length}명)`} />
          {/* BadgeList에 실제 참여자 닉네임 전달 */}
          <HorizontalBadgeList items={playerList} />
        </section>

        <section className="flex flex-col py-3" aria-label="역할 선택">
          <InputLabel label="역할 선택" isRequired={true} className="mb-2" />
          <div className="flex justify-center gap-3">
            <RoleButton
              roleType="police"
              state={getButtonState("POLICE")}
              className="w-24"
              onClick={() => setSelectedRole("POLICE")}
            />
            <RoleButton
              roleType="thief"
              className="w-24"
              state={getButtonState("THIEF")}
              onClick={() => setSelectedRole("THIEF")}
            />
            <RoleButton
              roleType="random"
              className="w-24"
              state={getButtonState("RANDOM")}
              onClick={() => setSelectedRole("RANDOM")}
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
          참여 신청하기
        </Button>
      </main>
    </>
  );
}