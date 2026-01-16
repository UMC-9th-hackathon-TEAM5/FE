import { postRoom } from "@/apis/room";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "@/components/common/Header";
import InputLabel from "@/components/common/Input/InputLabel";
import Input from "@/components/common/Input/Input";
import { Button } from "@/components/common/Button";

export default function CreatePartyPage() {
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [policeCount, setPoliceCount] = useState("");
  const [thiefCount, setThiefCount] = useState("");
  const [gameMinutes, setGameMinutes] = useState("30");
  const [escapeSeconds, setEscapeSeconds] = useState("60");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  type Coordinates = {
    lat: number;
    lng: number;
  };

  const getCurrentPosition = (): Promise<Coordinates> =>
    new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ lat: 0, lng: 0 });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => resolve({ lat: 0, lng: 0 }),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    });

  const normalizeMeetingTime = (value: string) =>
    value.includes(":") && value.length === 16 ? `${value}:00` : value;

  function isFutureDateTime(value: string): boolean {
    if (!value) return false;
    const inputDate = new Date(value);
    const now = new Date();
    return inputDate > now;
  }

  const isDateTimeInvalid = dateTime !== "" && !isFutureDateTime(dateTime);

  const police = Number(policeCount);
  const thief = Number(thiefCount);
  const totalPeople = police + thief;

  const isPeopleEmpty = policeCount === "" && thiefCount === "";
  const isPeopleInvalid =
    !isPeopleEmpty &&
    (totalPeople <= 0 ||
      police > thief * 2 ||
      totalPeople > 20 ||
      police > 10 ||
      thief > 10);

  const isFormValid = useMemo(() => {
    return (
      title.trim().length > 0 &&
      dateTime.trim().length > 0 &&
      isFutureDateTime(dateTime) &&
      location.trim().length > 0 &&
      description.trim().length > 0 &&
      policeCount.trim().length > 0 &&
      Number(policeCount) >= 0 &&
      thiefCount.trim().length > 0 &&
      Number(thiefCount) >= 0 &&
      !isPeopleInvalid &&
      Number(gameMinutes) > 0 &&
      Number(escapeSeconds) > 0
    );
  }, [
    title,
    dateTime,
    location,
    description,
    policeCount,
    thiefCount,
    isPeopleInvalid,
    gameMinutes,
    escapeSeconds,
  ]);

  const handleCreate = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const { lat, lng } = await getCurrentPosition();

    try {
      const response = await postRoom({
        title: title.trim(),
        description: description.trim(),
        placeName: location.trim(),
        lat,
        lng,
        meetingTime: normalizeMeetingTime(dateTime),
        police_capacity: Number(policeCount),
        thief_capacity: Number(thiefCount),
        countdownSeconds: Number(escapeSeconds),
        escapeTime: Number(gameMinutes) * 60,
      });

      navigate(`/party/waiting?roomId=${response.data.roomId}`, {
        state: {
          roomId: response.data.roomId,
          hostId: response.data.hostId,
        },
      });
    } catch (error) {
      let message = "팟 생성에 실패했습니다.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      }
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header title="팟 만들기" />
      <main className="mb-14 min-h-full w-full px-10">
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

        <section className="mt-2 flex flex-col pt-3" role="파티 설명 정하기">
          <InputLabel label="설명" className="mb-2" isRequired={true} />
          <Input
            placeholder="경도팟에 대한 설명을 적어주세요"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
                max={10}
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
                max={10}
                value={thiefCount}
                onChange={(e) => setThiefCount(e.target.value)}
              />
            </div>
          </div>
          {totalPeople === 0 && (
            <span className="mt-1 ml-2 text-xs text-red-400">
              모집 인원은 최소 1명 이상이어야 합니다.
            </span>
          )}
          {totalPeople > 20 && (
            <span className="mt-1 ml-2 text-xs text-red-400">
              모집 인원은 최대 20명까지 가능합니다.
            </span>
          )}
          {police > thief * 2 && (
            <span className="mt-1 ml-2 text-xs text-red-400">
              경찰 인원이 너무 많습니다.
            </span>
          )}
          {police > 10 && (
            <span className="mt-1 ml-2 text-xs text-red-400">
              경찰 인원은 최대 10명까지 가능합니다.
            </span>
          )}
          {thief > 10 && (
            <span className="mt-1 ml-2 text-xs text-red-400">
              도둑 인원은 최대 10명까지 가능합니다.
            </span>
          )}
        </section>

        <section className="mt-3 flex flex-col pt-3" role="게임 시간 정하기">
          <InputLabel label="시간 설정" className="mb-2" />

          <InputLabel label="게임 진행 시간 (분)" className="mb-1" />
          <Input
            type="number"
            className="mb-4"
            min={1}
            value={gameMinutes}
            onChange={(e) => setGameMinutes(e.target.value)}
          />
          <InputLabel label="도망갈 시간 (초)" className="mb-1" />
          <Input
            type="number"
            min={1}
            value={escapeSeconds}
            onChange={(e) => setEscapeSeconds(e.target.value)}
          />
          <span className="text-main-variant mt-1 text-xs">
            게임 시작 직후 도둑들이 숨을 시간입니다.
          </span>
        </section>

        <Button
          width="xl"
          state={isFormValid ? "active" : "default"}
          className="mt-6"
          disabled={!isFormValid || isSubmitting}
          onClick={handleCreate}
        >
          {isSubmitting ? "생성 중..." : "팟 생성하기"}
        </Button>
        {errorMessage && (
          <p className="mt-2 text-xs text-red-400">* {errorMessage}</p>
        )}
      </main>
    </>
  );
}
