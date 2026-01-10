
import { GameRuleModal } from "@/components/common/Modal/GameruleModal";
import EndConfirmModal  from "@/components/common/Modal/EndConfirmModal";
import { useState } from "react";


const ModalTestPage = () => {
  const [isRuleOpen, setIsRuleOpen] = useState(false);
  const [isEndConfirmOpen, setIsEndConfirmOpen] = useState(false);

  // 게임 종료 실제 로직 (예: API 호출, 페이지 이동 등)
  const handleGameEnd = () => {
    alert("게임이 종료되었습니다! 메인으로 이동합니다.");
    setIsEndConfirmOpen(false);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-8 bg-gray-100 p-4">
      
      <h1 className="text-3xl font-bold text-gray-900">컴포넌트 분리 테스트</h1>

      <div className="flex gap-4">
        {/* 버튼 1 */}
        <button 
          onClick={() => setIsRuleOpen(true)}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md transition-all active:scale-95"
        >
          📜 규칙 보기
        </button>

        {/* 버튼 2 */}
        <button 
          onClick={() => setIsEndConfirmOpen(true)}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-md transition-all active:scale-95"
        >
          🚨 게임 종료
        </button>
      </div>

      {/* 이제 여기서는 <BaseModal>을 직접 쓰지 않고,
        미리 만들어둔 모달 컴포넌트를 사용합니다.
      */}
      
      <GameRuleModal
        isOpen={isRuleOpen} 
        onClose={() => setIsRuleOpen(false)} 
      />

      <EndConfirmModal 
        isOpen={isEndConfirmOpen} 
        onClose={() => setIsEndConfirmOpen(false)}
        onConfirm={handleGameEnd} 
      />

    </div>
  );
};

export default ModalTestPage;