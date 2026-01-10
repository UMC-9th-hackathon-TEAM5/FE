<<<<<<< HEAD
import { GameRuleModal } from "@/components/common/Modal/GameruleModal";
import EndConfirmModal from "@/components/common/Modal/EndConfirmModal";
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
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-900">컴포넌트 분리 테스트</h1>

      <div className="flex gap-4">
        {/* 버튼 1 */}
        <button
          onClick={() => setIsRuleOpen(true)}
          className="rounded-lg bg-blue-500 px-6 py-3 font-bold text-white shadow-md transition-all hover:bg-blue-600 active:scale-95"
        >
          📜 규칙 보기
        </button>

        {/* 버튼 2 */}
        <button
          onClick={() => setIsEndConfirmOpen(true)}
          className="rounded-lg bg-red-500 px-6 py-3 font-bold text-white shadow-md transition-all hover:bg-red-600 active:scale-95"
        >
          🚨 게임 종료
        </button>
      </div>

      {/* 이제 여기서는 <BaseModal>을 직접 쓰지 않고,
        미리 만들어둔 모달 컴포넌트를 사용합니다.
      */}

      <GameRuleModal isOpen={isRuleOpen} onClose={() => setIsRuleOpen(false)} />

      <EndConfirmModal
        isOpen={isEndConfirmOpen}
        onClose={() => setIsEndConfirmOpen(false)}
        onConfirm={handleGameEnd}
      />
=======
import BaseModal from "@/components/common/Modal/BaseModal";
import { useState } from "react";

const ModalTestPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    // 1. 블러 효과를 확인하기 위해 배경에 패턴이나 글자를 깔아둡니다.
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-4 bg-gray-100 p-10">
      
      <h1 className="text-3xl font-bold text-gray-800">모달 테스트 페이지</h1>
      <p className="text-gray-500 mb-8">
        버튼을 눌러서 모달을 띄워보세요.<br/>
        배경이 흐려지는지 확인해보세요.
      </p>

      {/* 모달 열기 버튼 */}
      <button 
        onClick={handleOpen}
        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors shadow-md"
      >
        모달 열기
      </button>

      {/* ========================================= */}
      {/* 2. BaseModal 사용 */}
      {/* ========================================= */}
      <BaseModal isOpen={isOpen} onClose={handleClose}>
        
        {/* BaseModal은 위치만 잡아주므로, 
          실제 모달 디자인(흰색 박스, 패딩 등)은 여기서 children으로 정의해야 합니다.
        */}
        <div className="w-[300px] bg-white rounded-2xl p-6 shadow-xl flex flex-col gap-4 animate-fade-in-up">
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              🎉
            </div>
            <h2 className="text-xl font-bold text-gray-900">알림</h2>
          </div>

          <p className="text-center text-gray-600 leading-relaxed text-sm">
            모달이 성공적으로 열렸습니다!<br/>
            바깥 검은 배경을 클릭하면 닫힙니다.
          </p>

          <div className="flex gap-2 mt-2">
            <button 
              onClick={handleClose}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              취소
            </button>
            <button 
              onClick={() => alert("확인 동작!")}
              className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
            >
              확인
            </button>
          </div>

        </div>

      </BaseModal>

      {/* 블러 테스트용 더미 텍스트들 */}
      <div className="absolute bottom-10 text-gray-300 select-none -z-10">
        Background Blur Test Background Blur Test Background Blur Test
      </div>
>>>>>>> b389011 (feat : BaseModal 구현)
    </div>
  );
};

<<<<<<< HEAD
export default ModalTestPage;
=======
export default ModalTestPage;
>>>>>>> b389011 (feat : BaseModal 구현)
