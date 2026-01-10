import PartyInfoCard, {
  PartyInfo,
} from "@/components/common/Card/PartyInfoCard";
import Header from "@/components/common/Header";
import InputLabel from "@/components/common/Input/InputLabel";

import { PlayerArrivalCard } from "@/components/common/Card/PlayerArrivalCard/PlayerArrivalCard";
import { Button } from "@/components/common/Button";

import ChangeRoleIcon from "@/assets/change/change.svg?react";
import InfoIcon from "@/assets/info/info.svg?react";

const mockPartyInfo: PartyInfo = {
  date: "2026-01-11",
  location: "수지생태공원 분수대 앞",
  playTime: "60분",
  people: {
    police: 5,
    thief: 6,
  },
};

const mockPlayers = [
  {
    name: "사요",
    role: "police" as const,
    arrivalStatus: "arrived" as const,
    isHost: true,
  },
  {
    name: "서리",
    role: "thief" as const,
    arrivalStatus: "notArrived" as const,
  },
  {
    name: "구디",
    role: "police" as const,
    arrivalStatus: "notArrived" as const,
  },
  {
    name: "이삭",
    role: "thief" as const,
    arrivalStatus: "arrived" as const,
    isMe: true,
  },
  {
    name: "이삭",
    role: "thief" as const,
    arrivalStatus: "arrived" as const,
    isMe: true,
  },
  {
    name: "이삭",
    role: "thief" as const,
    arrivalStatus: "arrived" as const,
    isMe: true,
  },
  {
    name: "이삭",
    role: "thief" as const,
    arrivalStatus: "arrived" as const,
    isMe: true,
  },
  {
    name: "이삭",
    role: "thief" as const,
    arrivalStatus: "arrived" as const,
    isMe: true,
  },
  {
    name: "이삭",
    role: "thief" as const,
    arrivalStatus: "arrived" as const,
    isMe: true,
  },
];

export default function WaitingPartyPage() {
  return (
    <>
      <Header title="대기방" />
      <main className="relative h-full w-full px-9">
        <section className="flex flex-col py-5" role="파티 제목 입력">
          <InputLabel
            label="수지구 경도팟 모임"
            className="text-main mb-2 text-[20px]"
          />
          <InfoIcon />

          <PartyInfoCard info={mockPartyInfo} />
        </section>
        <section className="flex flex-col py-3" role="파티 제목 입력">
          <InputLabel label="설명" className="mb-2" />
          <div className="w-full px-2 text-[12px] font-medium tracking-[-0.025em] whitespace-pre-line text-white">
            수지생태공원 경도팟 모집합니다. 저희 그냥 심심한 대학생들입니다
            커몬커몬
          </div>
        </section>
        <section className="relative flex flex-col py-3" role="파티 제목 입력">
          <InputLabel label="참여자 목록" className="mb-2" />
          <div className="text-gray absolute top-4 right-3 flex items-center gap-2 text-[12px] font-medium">
            <ChangeRoleIcon />
            <span className="tracking-[-0.025em]">클릭하여 역할 변경</span>
          </div>
          <div className="flex max-h-[25vh] flex-col gap-3 overflow-y-auto">
            {mockPlayers.map((player, index) => (
              <PlayerArrivalCard key={`${player.name}-${index}`} {...player} />
            ))}
          </div>
        </section>
        <section className="absolute right-0 bottom-4 left-0 flex flex-col items-center gap-1">
          <button className="text-point flex h-14 w-full items-center justify-center gap-2 bg-[#FAA91633]">
            <InfoIcon className="h-6 w-6" />
            <span>게임 규칙 확인하기</span>
          </button>
          <Button width="xl" state="active" className="my-4" onClick={() => {}}>
            게임시작하기
          </Button>
        </section>
      </main>
    </>
  );
}
