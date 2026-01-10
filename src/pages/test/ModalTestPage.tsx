import BaseModal from "@/components/common/Modal/BaseModal";
import { useState } from "react";

const ModalTestPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    // 1. 블러 효과를 확인하기 위해 배경에 패턴이나 글자를 깔아둡니다.
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-gray-800">모달 테스트 페이지</h1>
      <p className="mb-8 text-gray-500">
        버튼을 눌러서 모달을 띄워보세요.
        <br />
        배경이 흐려지는지 확인해보세요.
      </p>

      {/* 모달 열기 버튼 */}
      <button
        onClick={handleOpen}
        className="rounded-lg bg-green-500 px-6 py-3 font-bold text-white shadow-md transition-colors hover:bg-green-600"
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
        <div className="animate-fade-in-up flex w-[300px] flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">
              🎉
            </div>
            <h2 className="text-xl font-bold text-gray-900">알림</h2>
          </div>

          <p className="text-center text-sm leading-relaxed text-gray-600">
            모달이 성공적으로 열렸습니다!
            <br />
            바깥 검은 배경을 클릭하면 닫힙니다.
          </p>

          <div className="mt-2 flex gap-2">
            <button
              onClick={handleClose}
              className="flex-1 rounded-lg bg-gray-100 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-200"
            >
              취소
            </button>
            <button
              onClick={() => alert("확인 동작!")}
              className="flex-1 rounded-lg bg-green-500 py-2.5 font-medium text-white transition-colors hover:bg-green-600"
            >
              확인
            </button>
          </div>
        </div>
      </BaseModal>

      {/* 블러 테스트용 더미 텍스트들 */}
      <div className="absolute bottom-10 -z-10 text-gray-300 select-none">
        Background Blur Test Background Blur Test Background Blur Test
      </div>
    </div>
  );
};

export default ModalTestPage;
