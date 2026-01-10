import { Button } from "../Button";
import BaseModal from "./BaseModal";

interface GameRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GameRuleModal = ({ isOpen, onClose }: GameRuleModalProps) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="w-85 max-w-md rounded-xl bg-main-dark2 p-5 text-white gap-5 flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl">📋</span>
          <h2 className="text-2xl font-bold text-main">게임 규칙</h2>
        </div>  
        {/* 게임 진행 */}
        <div className="">
          <div className="flex items-center gap-1 text-[16px]">
            <span className="w-4 h-5.5 flex items-center justify-center">⏱️</span>
            <h3 className="font-bold text-main">게임 진행</h3>
          </div>
          <div className="flex flex-col pl-5 gap-1 text-sm font-medium">
            <p>도망갈 시간 : 60초</p>
            <p>게임 시간 : 60분</p>
          </div>
        </div>

        {/* 경찰팀 */}
        <div className="">
          <div className="flex items-center gap-1">
            <span className="w-4 h-5.5 flex items-center justify-center">👮🏻</span>
            <h3 className="font-bold text-main">경찰팀</h3>
          </div>
          <div className="flex flex-col pl-5 gap-1 text-sm font-medium">
            <p>도둑을 잡아 감옥에 가둠</p>
            <p>[검거] 버튼으로 처리</p>
            <p>모든 도둑을 감옥에 가두면 승리</p>
          </div>
        </div>

        {/* 도둑팀 */}
        <div className="">
          <div className="flex items-center gap-1">
            <span className="w-4 h-5.5 flex items-center justify-center">🥷🏻</span>
            <h3 className="font-bold text-main">도둑팀</h3>
          </div>
          <div className="flex flex-col pl-5 gap-1 text-sm font-medium">
            <p>경찰에게 잡히지 않고 도망</p>
            <p>감옥의 동료를 터치하여 구출</p>
            <p>구출된 도둑은 [탈출 성공] 클릭</p>
            <p>1명이라도 시간 내 생존하면 승리</p>
          </div>
        </div>

        {/* 팁 */}
        <div className="bg-main-dark1 rounded-lg px-5 py-3">
          <div className="flex items-center gap-1">
            <span className="w-4 h-5.5 flex items-center justify-center">💡</span>
            <h3 className="font-bold text-point">팁</h3>
          </div>
          <div className="flex flex-col pl-5 gap-1 text-sm font-medium">
            <p>갑작은 머리 정해진 장소에 설치</p>
            <p>경찰은 감옥 주변을 지키는 것이 중요</p>
            <p>도둑은 팀워크로 구출 작전 수행</p>
          </div>
        </div>

        {/* 확인 버튼 */}
        <Button width="lg" state="active" onClick={onClose}>
          확인
        </Button>
      </div>
    </BaseModal>
  );
};