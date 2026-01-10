import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import {
  PartyInfoCard,
  PartyInfo,
} from "@/components/common/Card/PartyInfoCard";
import InputLabel from "@/components/common/Input/InputLabel";
import HorizontalBadgeList from "@/components/Badge/HorizontalBadgeList";
import { RoleButton } from "@/components/common/RoleButton";
import { Button } from "@/components/common/Button";
import { getRoom, type Member } from "@/apis/room"; // RoomDetailData 타입은 api 파일에서 export 필요, 없으면 아래처럼 로컬 정의 혹은 any

// [참고] API 응답 타입 정의 (api/room.ts에 정의된 것과 일치해야 함)
interface RoomDetailData {
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
  participants: Member[];
  description?: string; // API에 없다면 로직에서 처리
}

type RoleType = "POLICE" | "THIEF" | "RANDOM" | null;

export default function PartyDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. HomePage에서 전달받은 roomId 확인
  const roomId = location.state?.roomId;

  const [roomData, setRoomData] = useState<RoomDetailData | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleType>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. API 호출하여 방 상세 정보 가져오기
  useEffect(() => {
    if (!roomId) {
      alert("잘못된 접근입니다.");
      navigate("/");
      return;
    }

    const fetchRoomDetail = async () => {
      try {
        setIsLoading(true);
        const response = await getRoom(roomId);

        setRoomData(response.data);
      } catch (error) {
        console.error("방 상세 조회 실패:", error);
        alert("방 정보를 불러오지 못했습니다.");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomDetail();
  }, [roomId, navigate]);

  // 로딩 중일 때 처리 (스켈레톤 혹은 로딩 스피너 대체 가능)
  if (isLoading || !roomData) {
    return <div className="flex h-full items-center justify-center text-white">Loading...</div>;
  }

  // 3. 데이터 가공

  // 날짜 포맷팅 (YYYY-MM-DD)
  const formattedDate = new Date(roomData.meetingTime).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\./g, "").replace(/ /g, "-");

  // 현재 경찰/도둑 인원 계산
  const policeCount = roomData.participants.filter(p => p.role === "POLICE").length;
  const thiefCount = roomData.participants.filter(p => p.role === "THIEF").length;

  // UI용 정보 객체 생성
  const partyInfo: PartyInfo = {
    date: formattedDate,
    location: roomData.placeName,
    playTime: roomData.escapeTime ? `${roomData.escapeTime}분` : "60분",
    people: {
      police: policeCount,
      thief: thiefCount,
    },
  };

  // 참여자 닉네임 리스트 생성
  // (HorizontalBadgeList가 string[]을 받으므로 변환)
  // 빈 슬롯을 표현하고 싶다면 maxParticipants와 비교하여 빈 문자열을 추가하는 로직 필요
  const playerNames = roomData.participants.map(member => member.nickname);
  
  // 만약 "빈 자리"를 시각적으로 보여주고 싶다면 아래 로직 사용 (선택 사항)
  const emptySlots = roomData.capacity.total - roomData.capacity.current;
  const displayPlayers = [...playerNames, ...Array(Math.max(0, emptySlots)).fill(" ")]

  const getButtonState = (role: RoleType) =>
    selectedRole === role ? "active" : "default";

  const isRoleSelected = selectedRole !== null;

  // 4. 참여하기 핸들러
  const handleJoin = async () => {
    if (!isRoleSelected || !roomId) return;

    // TODO: 실제 방 참여 API 호출 (예: postJoinRoom(roomId, { role: selectedRole }))
    console.log(`방(${roomId})에 ${selectedRole} 역할로 참여 신청`);
    
    // 임시: 성공했다고 가정하고 이동 (혹은 대기방으로 이동)
    // navigate(`/party/waiting/${roomId}`); 
    alert("참여 신청이 완료되었습니다! (API 연결 필요)");
  };

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
              {`현재 ${roomData.capacity.current}명 / 최대 ${roomData.capacity.total}명`}
            </div>
          </div>
          <PartyInfoCard info={partyInfo} />
        </section>

        <section className="flex flex-col py-3" aria-label="파티 설명">
          <InputLabel label="설명" className="mb-2" />
          <div className="px-1 text-xs font-medium text-white whitespace-pre-wrap">
             {/* description이 API에 없다면 임시 텍스트 혹은 title 사용 */}
            {roomData.description || `${roomData.placeName}에서 진행하는 경도 게임입니다. 매너 플레이 부탁드려요!`}
          </div>
        </section>

        <section className="flex flex-col py-3" aria-label="참여자 목록">
          <InputLabel label={`참여자 (${roomData.capacity.current}명)`} />
          <HorizontalBadgeList items={displayPlayers} />
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
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          onClick={handleJoin}
        >
          참여 신청하기
        </Button>
      </main>
    </>
  );
}