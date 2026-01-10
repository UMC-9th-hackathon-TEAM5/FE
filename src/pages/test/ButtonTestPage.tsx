import { Button } from "@/components/common/Button";
import CheckIcon from "@/assets/check/check.svg?react";

export default function ButtonTestPage() {
  return (
    // 1. h-full: 레이아웃에서 정해준 높이(h-211)를 꽉 채움 (min-h-screen 제거)
    // 2. overflow-y-auto: 내용이 길어지면 이 페이지 안에서 스크롤 생김
    // 3. no-scrollbar: 스크롤바 숨김 (선택 사항, index.css 설정 필요)
    <div className="h-full w-full overflow-y-auto bg-[#111] p-4 text-white">
      {/* 타이틀 영역 */}
      <div className="mb-8 text-center">
        <h1 className="text-main-dark1 text-xl font-bold">Button System</h1>
        <p className="text-xs text-gray-500">Scroll to see all variants</p>
        <h1 className="text-main-dark1 text-xl font-bold">Button System</h1>
        <p className="text-xs text-gray-500">Scroll to see all variants</p>
      </div>
      <div className="flex flex-col gap-10 pb-10">
        {/* 1. Small Buttons */}
        <section className="flex flex-col gap-3">
          <h2 className="border-b border-gray-700 pb-2 text-sm font-bold text-gray-400">
            Small (Compound)
          </h2>
          <div className="flex items-center justify-between rounded-lg bg-gray-900/50 p-3">
            <span className="text-xs text-gray-500">Default</span>
            <Button width="sm" state="default">
              미도착
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-900/50 p-3">
            <span className="text-xs text-gray-500">Active</span>
            <Button width="sm" state="active">
              <span>도착</span>
              <CheckIcon />
            </Button>
          </div>
        </section>

        {/* 2. Default Buttons */}
        <section className="flex flex-col gap-3">
          <h2 className="border-b border-gray-700 pb-2 text-sm font-bold text-gray-400">
            Default (w-18)
          </h2>
          <div className="flex items-center justify-between rounded-lg bg-gray-900/50 p-3">
            <span className="text-xs text-gray-500">Default</span>
            <Button width="default" state="default">
              Button
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-900/50 p-3">
            <span className="text-xs text-gray-500">Active</span>
            <Button width="default" state="active">
              Button
            </Button>
          </div>
        </section>

        {/* 3. Medium Buttons */}
        <section className="flex flex-col gap-3">
          <h2 className="border-b border-gray-700 pb-2 text-sm font-bold text-gray-400">
            Medium
          </h2>
          <div className="flex flex-col items-center gap-3 rounded-lg bg-gray-900/50 p-4">
            <Button width="md" state="default">
              중간 버튼
            </Button>
            <Button width="md" state="active">
              중간 버튼
            </Button>
          </div>
        </section>

        {/* 4. XL Buttons */}
        <section className="flex flex-col gap-3">
          <h2 className="border-b border-gray-700 pb-2 text-sm font-bold text-gray-400">
            XL (Compound)
          </h2>
          <div className="flex flex-col items-center gap-3 rounded-lg bg-gray-900/50 p-4">
            <Button width="xl" state="default">
              취소하기
            </Button>
            <Button width="xl" state="active">
              확인 완료
            </Button>
            <Button width="xl" disabled>
              비활성화 버튼
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
