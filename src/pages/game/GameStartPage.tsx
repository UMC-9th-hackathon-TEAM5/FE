import { useState, useEffect } from "react";
import { Button } from "@/components/common/Button";
import CheckIcon from "@/assets/check/check_black.svg?react";
import { useNavigate } from "react-router-dom";

// 컴포넌트 외부로 분리 (성능 최적화)
const CheckSquare = () => (
  <div className="rounded-full w-5 h-5 bg-main flex items-center justify-center shrink-0">
    <CheckIcon />
  </div>
);

const GameStartPage = () => {
  const navigate = useNavigate()

  const isHost = true; // 호스트 여부
  const [role, setRole] = useState<'police' | 'thief'>('thief'); // 역할
  
  const [gameStatus, setGameStatus] = useState<'idle' | 'ready' | 'action'>('idle'); // page steps
  const [count, setCount] = useState(3);

  
  useEffect(() => {
    if (gameStatus === 'idle') return;

    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      if (gameStatus === 'ready') {
        setGameStatus('action');
        setCount(3);
      } else if (gameStatus === 'action') {
        navigate('/ongame', { replace: true }); 
      }
    }
  }, [count, gameStatus, navigate]);
  // 게임 시작 버튼 핸들러
  const handleStartGame = () => {
    setGameStatus('ready');
    setCount(3);
  };

  // 준비 화면
  if (gameStatus === 'ready') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black animate-fade-in">
        <span className="text-main text-[100px] font-bold leading-[140%] tracking-[-2.5px]">
          {count}
        </span>
        <p className="text-white text-[24px] font-bold leading-[140%] tracking-[-0.6px]">
          게임이 곧 시작됩니다
        </p>
      </div>
    );
  }

  // 역할별 화면 (빨강/파랑)
  if (gameStatus === 'action') {
    const isPolice = role === 'police';
    const mainColor = isPolice ? "text-[#3B82F6]" : "text-[#EF4444]";
    const title = isPolice ? "대기하세요" : "도망가세요";
    const descRole = isPolice ? "경찰" : "도둑";
    const descText = isPolice 
      ? <>도둑들이 숨을 때까지<br />잠시만 기다려주세요.</> 
      : <>경찰이 쫓아오기 전에<br />빠르게 도망가세요!</>;

    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black animate-pulse-once">
        <div className="flex flex-col items-center gap-3 mb-6.5">
          <h1 className={`${mainColor} text-[60px] font-bold leading-[140%] tracking-[-1.5px]`}>{title}</h1>
          <p className="text-white text-[24px] text-center font-bold leading-[140%]">
            당신은 <span className={mainColor}>{descRole}</span>입니다.
          </p>
          <p className="text-white text-[20px] text-center leading-[140%] tracking-[-0.5px]">
            {descText}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <span className={`${mainColor} text-[100px] font-bold leading-[140%] tracking-[-2.5px]`}>
            {count}
          </span>
          <span className="text-white text-[24px] font-medium leading-[140%] tracking-[-0.6px]">초 남음</span>
        </div>
      </div>
    );
  }

  // 기본 체크리스트 화면 (Idle)
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="text-main font-bold text-[24px]">시작 전 체크리스트</div>
      
      <div className="flex flex-col p-5 gap-2.75 text-white text-[14px] font-normal tracking-[-0.35px] w-full">
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
            className="w-87.5 h-11 rounded-none bg-main text-black shadow-[2px_2px_0_0_#008E58] font-bold border-none"
            onClick={handleStartGame}
          >
            게임 시작하기
          </Button>
        ) : (
          <p className="text-[12px] text-[#808080] font-medium tracking-[-0.3px] text-center">
            호스트가 게임 시작하기 버튼을 누르면<br/>자동으로 창이 닫힙니다
          </p>
        )}
      </div>
    </div>
  )
}

export default GameStartPage;