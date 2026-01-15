import { Button } from "../../components/common/Button";
import CheckIcon from "../../assets/check/check.svg?react";
import LockIcon from "../../assets/lock/lock.svg?react";
import ShareIcon from "../../assets/share/share.svg?react";

export default function ButtonTestPage() {
  return (
    <div className="min-h-full w-full overflow-y-auto bg-[#111] p-4 text-white">
      {/* 타이틀 영역 */}
      <div className="mb-8 text-center">
        <h1 className="text-main-dark1 text-xl font-bold">Button System</h1>
        <p className="text-xs text-gray-500">Scroll to see all variants</p>
      </div>
      <div className="flex flex-col gap-10 pb-10">
        {/* Default Button */}
        <section className="flex flex-col gap-3">
          <h2 className="border-b border-gray-700 pb-2 text-sm font-bold text-gray-400">
            Default
          </h2>
          <Button state="active">Button</Button>
          <Button state="default">Button</Button>
        </section>

        {/* 도착/미도착 */}
        <section className="flex flex-col gap-3">
          <h2 className="border-b border-gray-700 pb-2 text-sm font-bold text-gray-400">
            도착 / 미도착
          </h2>
          <Button
            width="sm"
            state="arrive"
            className="pr-1.5 pl-2.5 text-[14px]"
          >
            <span className="flex whitespace-nowrap">
              도착 <CheckIcon />{" "}
            </span>
          </Button>
          <Button
            width="sm"
            state="non_arrive"
            className="text-[14px] text-[#808080]"
          >
            미도착
          </Button>
        </section>

        {/* Confirm Button */}
        <section className="flex flex-col gap-3">
          <h2 className="border-b border-gray-700 pb-2 text-sm font-bold text-gray-400">
            Confirm Button
          </h2>
          <div className="flex flex-col items-center gap-3 rounded-lg bg-gray-900/50 p-4">
            <Button width="xl" state="default">
              취소하기
            </Button>
            <Button width="xl" state="active">
              확인 완료
            </Button>
          </div>
        </section>

        {/* Role State Button */}
        <section className="flex flex-col gap-3">
          <h2 className="border-b border-gray-700 pb-2 text-sm font-bold text-gray-400">
            Role State Buttons
          </h2>
          <div className="flex flex-col items-center gap-3 rounded-lg bg-gray-900/50 p-4">
            <Button width="base" state="escape" className="text-[14px]">
              탈출 성공
            </Button>
            <Button width="base" state="prison">
              <div className="flex items-center justify-center gap-2 text-[14px] tracking-[-0.35px]">
                <LockIcon />
                감옥
              </div>
            </Button>
            <Button width="base" state="arrest">
              <div className="flex items-center justify-center gap-2 text-[14px] tracking-[-0.35px]">
                <LockIcon />
                검거
              </div>
            </Button>
          </div>
        </section>

        {/* 모달 버튼*/}
        <section className="flex flex-col gap-3">
          <h2 className="border-b border-gray-700 pb-2 text-sm font-bold text-gray-400">
            Modal Button
          </h2>
          <div className="flex flex-col items-center gap-3 rounded-lg bg-gray-900/50 p-4">
            <Button width="lg" state="active">
              게임 종료
            </Button>
            <Button width="lg" state="active">
              확인
            </Button>
          </div>
        </section>

        {/* 게임 결과 페이지 */}
        <section className="flex flex-col gap-3">
          <h2 className="border-b border-gray-700 pb-2 text-sm font-bold text-gray-400">
            게임종료
          </h2>
          <div className="flex flex-col items-center gap-3 rounded-lg bg-gray-900/50 p-4">
            <Button width="xl" state="instagram">
              <div className="flex items-center gap-2">
                <ShareIcon /> Instargram 스토리로 공유하기
              </div>
            </Button>
            <Button width="xl" state="active">
              메인으로 돌아가기
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
