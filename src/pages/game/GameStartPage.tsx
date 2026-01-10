import { useState, useEffect } from "react";
import { Button } from "@/components/common/Button";
import CheckIcon from "@/assets/check/check_black.svg?react";
import { useNavigate } from "react-router-dom";

// 컴포넌트 외부로 분리 (성능 최적화)
const CheckSquare = () => (
  <div className="bg-main flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
    <CheckIcon />
  </div>
);

const GameStartPage = () => {
  const navigate = useNavigate();

  const isHost = true; // 호스트 여부
  const [role, setRole] = useState<"police" | "thief">("thief"); // 역할

  const [gameStatus, setGameStatus] = useState<"idle" | "ready" | "action">(
    "idle",
  ); // page steps
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (gameStatus === "idle") return;

    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      if (gameStatus === "ready") {
        setGameStatus("action");
        setCount(3);
      } else if (gameStatus === "action") {
        navigate("/ongame", { replace: true });
      }
    }
  }, [count, gameStatus, navigate]);
  // 게임 시작 버튼 핸들러
  const handleStartGame = () => {
    setGameStatus("ready");
    setCount(3);
  };

  // 준비 화면
  if (gameStatus === "ready") {
    return (
      <div className="animate-fade-in flex h-full w-full flex-col items-center justify-center bg-black">
        <span className="text-main text-[100px] leading-[140%] font-bold tracking-[-2.5px]">
          {count}
        </span>
        <p className="text-[24px] leading-[140%] font-bold tracking-[-0.6px] text-white">
          게임이 곧 시작됩니다
        </p>
      </div>
    );
  }

  // 역할별 화면 (빨강/파랑)
  if (gameStatus === "action") {
    const isPolice = role === "police";
    const mainColor = isPolice ? "text-[#3B82F6]" : "text-[#EF4444]";
    const title = isPolice ? "대기하세요" : "도망가세요";
    const descRole = isPolice ? "경찰" : "도둑";
    const descText = isPolice ? (
      <>
        도둑들이 숨을 때까지
        <br />
        잠시만 기다려주세요.
      </>
    ) : (
      <>
        경찰이 쫓아오기 전에
        <br />
        빠르게 도망가세요!
      </>
    );

    return (
      <div className="animate-pulse-once flex h-full w-full flex-col items-center justify-center bg-black">
        <div className="mb-6.5 flex flex-col items-center gap-3">
          <h1
            className={`${mainColor} text-[60px] leading-[140%] font-bold tracking-[-1.5px]`}
          >
            {title}
          </h1>
          <p className="text-center text-[24px] leading-[140%] font-bold text-white">
            당신은 <span className={mainColor}>{descRole}</span>입니다.
          </p>
          <p className="text-center text-[20px] leading-[140%] tracking-[-0.5px] text-white">
            {descText}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <span
            className={`${mainColor} text-[100px] leading-[140%] font-bold tracking-[-2.5px]`}
          >
            {count}
          </span>
          <span className="text-[24px] leading-[140%] font-medium tracking-[-0.6px] text-white">
            초 남음
          </span>
        </div>
      </div>
    );
  }

  // 기본 체크리스트 화면 (Idle)
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      <div className="text-main text-[24px] font-bold">시작 전 체크리스트</div>

      <div className="flex w-full flex-col gap-2.75 p-5 text-[14px] font-normal tracking-[-0.35px] text-white">
        <div className="flex items-center gap-2">
          <CheckSquare />
          <p>게임 규칙을 잘 숙지하고 있나요?</p>
        </div>
        <div className="flex items-center gap-2">
          <CheckSquare />
          <p>참가자들의 인상착의를 확인했나요?</p>
        </div>
        <div className="flex items-center gap-2">
          <CheckSquare />
          <p>감옥 위치를 알고 있나요?</p>
        </div>
        <div className="flex items-center gap-2">
          <CheckSquare />
          <p>모두에게 즐거운 경도를 위해서 매너를 지켜주세요!</p>
        </div>
      </div>

      <div className="mt-4">
        {isHost ? (
          <Button
            className="bg-main h-11 w-87.5 rounded-none border-none font-bold text-black shadow-[2px_2px_0_0_#008E58]"
            onClick={handleStartGame}
          >
            게임 시작하기
          </Button>
        ) : (
          <p className="text-center text-[12px] font-medium tracking-[-0.3px] text-[#808080]">
            호스트가 게임 시작하기 버튼을 누르면
            <br />
            자동으로 창이 닫힙니다
          </p>
        )}
      </div>
    </div>
  );
};

export default GameStartPage;
