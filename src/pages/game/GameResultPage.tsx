import { useNavigate } from "react-router-dom";

import { PartyInfoCard } from "@/components/common/Card/PartyInfoCard";
import PlayerResultCard from "@/components/common/Card/PlayerResultCard/PlayerResultCard";
import InputLabel from "@/components/common/Input/InputLabel";
import { Button } from "@/components/common/Button";

import ThrophyIcon from "@/assets/throphy/trophy.svg?react";
import ShareIcon from "@/assets/share/share.svg?react";

export interface PartyInfo {
  date: string;
  location: string;
  playTime: string;
  people: {
    police: number;
    thief: number;
  };
}

const mockPartyInfo: PartyInfo = {
  date: "2026-01-11",
  location: "수지구 생태공원 분수대 앞",
  playTime: "60분",
  people: {
    police: 5,
    thief: 6,
  },
};

const mockResults = [
  {
    id: "1",
    name: "사요",
    role: "police" as const,
    catchCount: 2,
  },
  {
    id: "2",
    name: "서리",
    role: "thief" as const,
    result: "survived" as const,
    isHost: true,
  },
  {
    id: "3",
    name: "구디",
    role: "police" as const,
    catchCount: 4,
    isMe: true,
  },
  {
    id: "4",
    name: "이삭",
    role: "thief" as const,
    result: "jailed" as const,
  },
  {
    id: "5",
    name: "미로",
    role: "thief" as const,
    result: "survived" as const,
  },
  {
    id: "6",
    name: "아진",
    role: "police" as const,
    catchCount: 1,
  },
];

export default function GameResultPage() {
  const navigate = useNavigate();
  const sortedResults = [
    ...mockResults.filter((player) => player.role === "thief"),
    ...mockResults.filter((player) => player.role === "police"),
  ];
  return (
    <>
      <main className="relative flex h-full w-full flex-col items-center overflow-y-auto px-7">
        <section className="flex w-full flex-col items-center justify-center py-5">
          <ThrophyIcon className="" />
          <span className="text-main text-[40px] font-bold">도둑팀 승리!</span>
          <span className="text-base font-medium text-white">
            도둑들이 시간 내에 살아남았습니다!
          </span>
        </section>
        <section className="flex w-full flex-col items-center justify-center px-3 py-5">
          <InputLabel label="수지구 경도팟 모임" className="mb-2 text-[20px]" />
          <PartyInfoCard info={mockPartyInfo} />
        </section>
        <section className="flex w-full flex-col items-center justify-center py-5">
          <InputLabel label="참여자 기록" className="mb-2 text-[20px]" />
          <ul className="flex w-full flex-col items-center justify-center gap-3">
            {sortedResults.map((player) => (
              <PlayerResultCard key={player.id} {...player} />
            ))}
          </ul>
        </section>
        <section className="flex w-full flex-col items-center justify-center gap-4 pt-3 pb-10">
          <InputLabel label="공유" className="ml-7 text-[20px]" />
          <div className="ml-7 w-full text-sm font-medium">
            <span>
              <span className="text-main">수지구 경도팟 모임</span>
              <span className="text-white"> 어떠셨나요?</span>
              <br />
            </span>
            <span className="text-white">
              추억을 인스타그램 스토리로 공유해보세요!
            </span>
          </div>
          <Button width="xl" state="instagram">
            <div className="flex items-center gap-2">
              <ShareIcon /> Instargram 스토리로 공유하기
            </div>
          </Button>
          <Button width="xl" state={"active"} onClick={() => navigate("/home")}>
            메인으로 돌아가기
          </Button>
        </section>
      </main>
    </>
  );
}
