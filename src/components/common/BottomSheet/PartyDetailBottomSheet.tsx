import { useEffect, useState } from "react";
import Arrow from "@/assets/arrow/arrow_back.svg?react";
import { PartyInfoCard, PartyInfo } from "@/components/common/Card/PartyInfoCard";
import { Button } from "../Button";
import { getRoom, type NearbyRoomItem, type Member } from "@/apis/room";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  // 초기 렌더링을 위해 리스트에서 클릭한 요약 정보를 먼저 받습니다.
  summaryData: NearbyRoomItem | null; 
}

// 상세 조회 데이터 타입 (API 응답 기반)
interface RoomDetailState {
  policeCount: number;
  thiefCount: number;
  escapeTime: number;
  description: string;
}

const PartyDetailBottomSheet = ({ isOpen, onClose, onConfirm, summaryData }: BottomSheetProps) => {
  const [detailData, setDetailData] = useState<RoomDetailState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 시트가 열리거나 선택된 방이 바뀌면 상세 정보 호출
  useEffect(() => {
    if (isOpen && summaryData?.roomId) {
      const fetchDetail = async () => {
        setIsLoading(true);
        try {
          const response = await getRoom(summaryData.roomId);
          const data = response.data;

          // participants 배열을 통해 경찰/도둑 인원 계산
          const policeCount = data.participants.filter((p: Member) => p.role === "POLICE").length;
          const thiefCount = data.participants.filter((p: Member) => p.role === "THIEF").length;

          setDetailData({
            policeCount,
            thiefCount,
            // API에 escapeTime이 optional로 되어 있어 없으면 기본값 60분
            escapeTime: data.escapeTime ?? 60,
            // API에 description 필드가 없으므로, title이나 status 등을 조합해 임시 텍스트 생성
            description: `${data.placeName}에서 진행되는 경도 게임입니다! 얼른 참여하세요.`,
          });
        } catch (error) {
          console.error("방 상세 조회 실패:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDetail();
    } else {
        // 시트가 닫히면 데이터 초기화 (선택 사항)
        setDetailData(null);
    }
  }, [isOpen, summaryData]);

  if (!isOpen && typeof document === "undefined") return null;

  // 1. 날짜 포맷팅
  const formatDate = (dateString?: string) => {
    if (!dateString) return "날짜 미정";
    const date = new Date(dateString);
    // 예: 2024-07-20 (토) 18:00
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // 2. 표시할 데이터 준비 (상세 데이터가 로딩 중이면 요약 데이터 사용)
  const displayInfo: PartyInfo = {
    date: formatDate(summaryData?.meetingTime),
    location: summaryData?.placeName || "위치 정보 없음",
    // 상세 데이터가 오기 전에는 '로딩중' 혹은 기본값 표시
    playTime: detailData ? `${detailData.escapeTime}분` : "조회 중...",
    people: {
      police: detailData?.policeCount ?? 0,
      thief: detailData?.thiefCount ?? 0,
    },
  };

  const title = summaryData?.title || "제목 없음";
  const description = detailData?.description || "상세 정보를 불러오는 중입니다...";

  return (
    <div
      className={`
        absolute inset-0 z-50 flex justify-center items-end
        transition-opacity duration-300
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
      `}
    >
      {/* 배경 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* 바텀 시트 */}
      <div
        className={`
          relative w-full max-w-[450px] mx-auto
          bg-main-dark2
          rounded-t-[30px]
          shadow-2xl overflow-hidden
          transform transition-transform duration-300 ease-out
          z-10
          ${isOpen ? "translate-y-0" : "translate-y-full"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1 text-white">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-sm font-medium text-main transition-opacity hover:opacity-80 p-5"
          >
            <Arrow className="-rotate-90 w-5 h-5 fill-current" />
            지도로 돌아가기
          </button>

          <div className="flex flex-col gap-3 pb-9 px-10">
            <h2 className="text-[20px] font-bold text-main">
              {title}
            </h2>
            
            <section className="flex flex-col justify-center">
              {/* isLoading일 때 스켈레톤 UI를 보여주거나 그냥 보여줄 수도 있음 */}
              <PartyInfoCard info={displayInfo} className="!bg-main-dark1" />
            </section>
            
            <p className="text-[12px] leading-[140%] text-white min-h-[40px]">
              {description}
            </p>
            
            <div className="flex justify-center">
              <Button
                state={isLoading ? "inactive" : "active"}
                width="xl"
                onClick={onConfirm}
                disabled={isLoading}
              >
                참여하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyDetailBottomSheet;