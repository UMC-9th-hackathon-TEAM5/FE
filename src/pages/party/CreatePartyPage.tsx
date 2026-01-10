import { useState, useMemo } from "react";

import Header from "@/components/common/Header";
import InputLabel from "@/components/common/Input/InputLabel";
import Input from "@/components/common/Input/Input";
import { Button } from "@/components/common/Button";

export default function CreatePartyPage() {
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [policeCount, setPoliceCount] = useState("");
  const [thiefCount, setThiefCount] = useState("");

  function isFutureDateTime(value: string): boolean {
    if (!value) return false;
    const inputDate = new Date(value);
    const now = new Date();
    return inputDate > now;
  }

  const isDateTimeInvalid = dateTime !== "" && !isFutureDateTime(dateTime);

  const isFormValid = useMemo(() => {
    return (
      title.trim().length > 0 &&
      dateTime.trim().length > 0 &&
      isFutureDateTime(dateTime) &&
      location.trim().length > 0 &&
      policeCount.trim().length > 0 &&
      Number(policeCount) >= 0 &&
      thiefCount.trim().length > 0 &&
      Number(thiefCount) >= 0
    );
  }, [title, dateTime, location, policeCount, thiefCount]);

  return (
    <>
      <Header title="팟 만들기" />
      <main className="h-full w-full px-10">
        <section className="flex flex-col py-3" role="파티 제목 입력">
          <InputLabel label="팟 제목" isRequired={true} />
          <Input
            placeholder="예 : 수지구 경도팟 모임"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </section>

        <section className="flex flex-col py-3" role="파티 모임 일정 정하기">
          <InputLabel label="모임 일시" isRequired={true} />
          <Input
            type="datetime-local"
            required
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
          {isDateTimeInvalid && (
            <span className="mt-1 ml-2 text-xs text-red-400">
              모임 일시는 현재 시간 이후여야 합니다.
            </span>
          )}
        </section>

        <section className="flex flex-col pt-3" role="파티 장소 정하기">
          <InputLabel label="모임 장소" isRequired={true} />
          <Input
            placeholder="예 : 수지생태공원 분수대 앞"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </section>

        <section className="mt-2 flex flex-col py-3">
          <InputLabel label="모집 인원" className="mb-2" isRequired={true} />
          <div className="flex justify-center gap-2">
            <div className="flex flex-col">
              <InputLabel label="경찰" className="mb-1" />
              <Input
                placeholder={"0"}
                width="sm"
                type="number"
                min={0}
                value={policeCount}
                onChange={(e) => setPoliceCount(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <InputLabel label="도둑" className="mb-1" />
              <Input
                placeholder={"0"}
                width="sm"
                type="number"
                min={0}
                value={thiefCount}
                onChange={(e) => setThiefCount(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="mt-3 flex flex-col pt-3" role="게임 시간 정하기">
          <InputLabel label="시간 설정" className="mb-2" />

          <InputLabel label="게임 진행 시간 (분)" className="mb-1" />
          <Input defaultValue={60} type="number" className="mb-4" />
          <InputLabel label="도망 갈 시간 (초)" className="mb-1" />
          <Input defaultValue={60} type="number" />
          <span className="text-main-variant mt-1 text-xs">
            게임 시작 직후 도둑들이 숨을 시간입니다
          </span>
        </section>

        <section className="mt-2 flex flex-col pt-3" role="게임 시간 정하기">
          <InputLabel label="설명" className="mb-2" />
          <Input placeholder="경도팟에 대한 설명을 적어주세요" />
        </section>

        <Button
          width="xl"
          state={isFormValid ? "active" : "default"}
          className="mt-6"
          disabled={!isFormValid}
        >
          팟 생성하기
        </Button>
      </main>
      ;
    </>
  );
}
