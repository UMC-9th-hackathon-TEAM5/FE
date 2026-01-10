import { Button } from "@/components/common/Button";
<<<<<<< HEAD
import CheckIcon from "@/assets/check/check.svg?react";

export default function ButtonTestPage() {
  return (
    // 1. h-full: 레이아웃에서 정해준 높이(h-211)를 꽉 채움 (min-h-screen 제거)
    // 2. overflow-y-auto: 내용이 길어지면 이 페이지 안에서 스크롤 생김
    // 3. no-scrollbar: 스크롤바 숨김 (선택 사항, index.css 설정 필요)
    <div className="h-full w-full overflow-y-auto bg-[#111] p-4 text-white">
=======
import CheckIcon from "@/assets/check/check.svg?react"
import LockIcon from "@/assets/lock/lock.svg?react"
import ShareIcon from "@/assets/share/share.svg?react"

export default function ButtonTestPage() {
  return (
    <div className="h-full w-full overflow-y-auto bg-[#111] text-white p-4">
      
>>>>>>> d3488f9 (feat : button들 구현)
      {/* 타이틀 영역 */}
      <div className="mb-8 text-center">
        <h1 className="text-main-dark1 text-xl font-bold">Button System</h1>
        <p className="text-xs text-gray-500">Scroll to see all variants</p>
      </div>
      <div className="flex flex-col gap-10 pb-10">
<<<<<<< HEAD
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
=======

        {/* Default Button */}
        <section className="flex flex-col gap-3">
            <h2 className="text-sm font-bold border-b  border-gray-700 pb-2 text-gray-400">
              Default
            </h2>
            <Button state="active" >Button</Button>
            <Button state="default">Button</Button>
          </section>  

        {/* 도착/미도착 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold border-b  border-gray-700 pb-2 text-gray-400">
            도착 / 미도착
          </h2>
          <Button width="sm" state="arrive" className="text-[14px] pl-2.5 pr-1.5">
            <span className="flex whitespace-nowrap">도착 <CheckIcon /> </span>
          </Button>
          <Button width="sm" state="non_arrive" className="text-[#808080] text-[14px]">미도착</Button>
>>>>>>> d3488f9 (feat : button들 구현)
        </section>

        {/* Confirm Button */}
        <section className="flex flex-col gap-3">
<<<<<<< HEAD
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
=======
          <h2 className="text-sm font-bold border-b border-gray-700 pb-2 text-gray-400">
            Confirm Button
          </h2>
          <div className="flex flex-col items-center gap-3 bg-gray-900/50 p-4 rounded-lg">
            <Button width="xl" state="default">취소하기</Button>
            <Button width="xl" state="active">확인 완료</Button>
          </div>
        </section>

        {/* Role State Button */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold border-b border-gray-700 pb-2 text-gray-400">
            Role State Buttons
          </h2>
          <div className="flex flex-col items-center gap-3 bg-gray-900/50 p-4 rounded-lg">
            <Button width="base" state="escape" className="text-[14px]">
              탈출 성공
            </Button>
            <Button width="base" state="prison">
              <div className="flex gap-2 items-center justify-center text-[14px] tracking-[-0.35px]" >
                <LockIcon/>감옥
              </div>
            </Button>
            <Button width="base" state="arrest">
              <div className="flex gap-2 items-center justify-center text-[14px] tracking-[-0.35px]">
                <LockIcon/>검거
              </div>
            </Button>
          </div>
        </section>

        {/* 모달 버튼*/}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold border-b border-gray-700 pb-2 text-gray-400">
            Modal Button
          </h2>
          <div className="flex flex-col items-center gap-3 bg-gray-900/50 p-4 rounded-lg">
            <Button width="lg" state="active">게임 종료</Button>
            <Button width="lg" state="active">확인</Button>
          </div>
        </section>
        
        {/* 게임 결과 페이지 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold border-b border-gray-700 pb-2 text-gray-400">
            게임종료
          </h2>
          <div className="flex flex-col items-center gap-3 bg-gray-900/50 p-4 rounded-lg">
            <Button width="xl" state="instagram">
              <div className="flex gap-2 items-center">
                <ShareIcon /> Instargram 스토리로 공유하기
              </div>
            </Button>
            <Button width="xl" state="active">메인으로 돌아가기</Button>
>>>>>>> d3488f9 (feat : button들 구현)
          </div>
        </section>
      </div>
    </div>
  );
}
