import Arrow from "@/assets/arrow/arrow_back.svg?react";
import { PartyInfoCard } from "@/components/common/Card/PartyInfoCard"
import { Button } from '../Button';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PartyDetailBottomSheet = ({ isOpen, onClose, onConfirm }: BottomSheetProps) => {
  if (!isOpen && typeof document === 'undefined') return null;

  const mockPartyInfo = {
    date: "2024-07-20",
    location: "Central Park",
    playTime: "90분",
    people: { police: 5, thief: 6 },
  };

  const mockPartyMeta = {
    title: "수지구 경도팟 모임",
    description: "수지생태공원 경도팟 모집합니다. 저희 그냥 심심한 대학생들입니다. 커몬커몬",
  };

  return (
    <div
      className={`
        /* [수정 1] fixed -> absolute 변경 */
        /* 모바일 레이아웃(부모 relative) 안에서만 꽉 차게 뜸 */
        absolute inset-0 z-50 flex justify-center items-end
        transition-opacity duration-300
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
      `}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />

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
              {mockPartyMeta.title}
            </h2>
            <section className="flex flex-col justify-center">
              <PartyInfoCard info={mockPartyInfo} className="!bg-main-dark1" />
            </section>
            <p className="text-[12px] leading-[140%] text-white">
              {mockPartyMeta.description}
            </p>
            <div className="flex justify-center">
              <Button
                state="active"
                width="xl"
                onClick={onConfirm}
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