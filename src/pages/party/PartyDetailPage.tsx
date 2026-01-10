import Header from "@/components/common/Header";
import {
  PartyInfoCard,
  PartyInfo,
} from "@/components/common/Card/PartyInfoCard";
import InputLabel from "@/components/common/Input/InputLabel";
import HorizontalBadgeList from "@/components/Badge/HorizontalBadgeList";
import { RoleButton } from "@/components/common/RoleButton";
import { useState } from "react";
import { Button } from "@/components/common/Button";

type RoleType = "police" | "thief" | "random" | null;

const mockPartyInfo: PartyInfo = {
  date: "2024-07-20",
  location: "Central Park",
  regroup: "Main Gate",
  playTime: "90분",
  people: {
    police: 5,
    thief: 6,
  },
};

const players = [
  "          ",
  "사요",
  "서리",
  "구디",
  "이삭",
  "미로",
  "아진",
  "나호",
  "보리",
  "소방차",
  "",
];

const TOTAL_PLAYERS = 7;

export default function PartyDetailPage() {
  const [selectedRole, setSelectedRole] = useState<RoleType>(null);

  const getButtonState = (role: RoleType) =>
    selectedRole === role ? "active" : "default";

  const isRoleSelected = selectedRole !== null;

  return (
    <>
      <Header title="팟 상세" />
      <main className="relative h-full w-full border border-white px-10">
        <section
          className="flex flex-col border border-white py-5"
          aria-label="파티 상세 정보"
        >
          <div className="mb-3 flex w-full flex-col">
            <div className="text-main text-[20px] font-bold">
              수지구 경도팟 모임
            </div>
            <div className="text-sm font-medium text-white">
              현재 7명 / 최대 10명
            </div>
          </div>
          <PartyInfoCard info={mockPartyInfo} />
        </section>

        <section
          className="flex flex-col border border-white py-3"
          aria-label="파티 설명"
        >
          <InputLabel label="설명" />
          <div className="px-1 text-xs font-medium text-white">
            수지생태공원 경도팟 모집합니다. 저희 그냥 심심한 대학생들입니다.
            커몬커몬
          </div>
        </section>
        <section
          className="flex flex-col border border-white py-3"
          aria-label="파티 설명"
        >
          <InputLabel label={`참여자 (${TOTAL_PLAYERS}명)`} />
          <HorizontalBadgeList items={players} />
        </section>
        <section
          className="flex flex-col border border-white py-3"
          aria-label="파티 설명"
        >
          <InputLabel label="역할 선택" isRequired={true} />
          <div className="flex justify-center gap-3">
            <RoleButton
              roleType="police"
              state={getButtonState("police")}
              className="w-24"
              onClick={() => setSelectedRole("police")}
            />
            <RoleButton
              roleType="thief"
              className="w-24"
              state={getButtonState("thief")}
              onClick={() => setSelectedRole("thief")}
            />
            <RoleButton
              roleType="random"
              className="w-24"
              state={getButtonState("random")}
              onClick={() => setSelectedRole("random")}
            />
          </div>
        </section>
        <Button
          width="xl"
          state={isRoleSelected ? "active" : "default"}
          disabled={!isRoleSelected}
          className="absolute bottom-10"
        >
          참여 신청하기
        </Button>
      </main>
      ;
    </>
  );
}
