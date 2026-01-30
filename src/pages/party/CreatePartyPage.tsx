import { postRoom, searchPlaces, type PlaceSearchResult } from "@/apis/room";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "@/components/common/Header";
import InputLabel from "@/components/common/Input/InputLabel";
import Input from "@/components/common/Input/Input";
import { Button } from "@/components/common/Button";


const SEARCH_DEBOUNCE_MS = 350;
const MAX_PLACE_RESULTS = 5;

const normalizeText = (value: string) =>
  value.replace(/\s+/g, "").toLowerCase();

const sortPlaces = (places: PlaceSearchResult[], query: string) => {
  const normalizedQuery = normalizeText(query);
  return [...places].sort((a, b) => {
    const normalizedA = normalizeText(a.name);
    const normalizedB = normalizeText(b.name);

    const aStarts = normalizedQuery
      ? normalizedA.startsWith(normalizedQuery)
      : false;
    const bStarts = normalizedQuery
      ? normalizedB.startsWith(normalizedQuery)
      : false;
    if (aStarts !== bStarts) return aStarts ? -1 : 1;

    const aIncludes = normalizedQuery
      ? normalizedA.includes(normalizedQuery)
      : false;
    const bIncludes = normalizedQuery
      ? normalizedB.includes(normalizedQuery)
      : false;
    if (aIncludes !== bIncludes) return aIncludes ? -1 : 1;

    if (a.name.length !== b.name.length) {
      return a.name.length - b.name.length;
    }
    return a.name.localeCompare(b.name);
  });
};


export default function CreatePartyPage() {
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [address, setAddress] = useState("");
  const [prisonPlaceName, setPrisonPlaceName] = useState("");
  const [prisonAddress, setPrisonAddress] = useState("");
  const [description, setDescription] = useState("");
  const [policeCount, setPoliceCount] = useState("");
  const [thiefCount, setThiefCount] = useState("");
  const [gameMinutes, setGameMinutes] = useState("30");
  const [escapeSeconds, setEscapeSeconds] = useState("60");
  const [placeResults, setPlaceResults] = useState<PlaceSearchResult[]>([]);
  const [prisonResults, setPrisonResults] = useState<PlaceSearchResult[]>([]);
  const [placeError, setPlaceError] = useState<string | null>(null);
  const [prisonError, setPrisonError] = useState<string | null>(null);
  const [isSearchingPlace, setIsSearchingPlace] = useState(false);
  const [isSearchingPrison, setIsSearchingPrison] = useState(false);
  const [placeCoords, setPlaceCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [prisonCoords, setPrisonCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const placeSearchSeqRef = useRef(0);
  const prisonSearchSeqRef = useRef(0);
  const skipNextPlaceSearchRef = useRef(false);
  const skipNextPrisonSearchRef = useRef(false);

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

  const isPeopleEmpty = policeCount.trim() === "" && thiefCount.trim() === "";
  const isPoliceInvalid = policeCount.trim() !== "" && police < 1;
  const isThiefInvalid = thiefCount.trim() !== "" && thief < 1;
  const isPeopleInvalid = !isPeopleEmpty && (isPoliceInvalid || isThiefInvalid);

  const isFormValid = useMemo(() => {
    return (
      title.trim().length > 0 &&
      dateTime.trim().length > 0 &&
      isFutureDateTime(dateTime) &&
      placeName.trim().length > 0 &&
      address.trim().length > 0 &&
      prisonPlaceName.trim().length > 0 &&
      prisonAddress.trim().length > 0 &&
      description.trim().length > 0 &&
      policeCount.trim().length > 0 &&
      Number(policeCount) >= 1 &&
      thiefCount.trim().length > 0 &&
      Number(thiefCount) >= 1 &&
      !isPeopleInvalid &&
      Number(gameMinutes) > 0 &&
      Number(escapeSeconds) > 0
    );
  }, [
    title,
    dateTime,
    placeName,
    address,
    prisonPlaceName,
    prisonAddress,
    description,
    policeCount,
    thiefCount,
    isPeopleInvalid,
    gameMinutes,
    escapeSeconds,
  ]);

  const fetchPlaces = useCallback(async (query: string): Promise<PlaceSearchResult[]> => {
    const trimmed = query.trim();
    if (!trimmed) {
      return [];
    }

    try {
      const response = await searchPlaces(trimmed);
      return response.data.places;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error("SEARCH_FAILED");
      }
      throw error;
    }
  }, []);

  const applySearchResults = useCallback(
    (
      query: string,
      results: PlaceSearchResult[],
      setResults: (next: PlaceSearchResult[]) => void,
      setError: (message: string | null) => void,
    ) => {
      const ordered = sortPlaces(results, query).slice(0, MAX_PLACE_RESULTS);
      if (ordered.length === 0) {
        setError("검색 결과가 없습니다.");
      }
      setResults(ordered);
    },
    [],
  );

  const handleCreate = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await postRoom({
        title: title.trim(),
        description: description.trim(),
        placeName: placeName.trim(),
        address: address.trim(),
        prisonPlaceName: prisonPlaceName.trim(),
        prisonAddress: prisonAddress.trim(),
        meetingTime: normalizeMeetingTime(dateTime),
        police_capacity: Number(policeCount),
        thief_capacity: Number(thiefCount),
        countdownSeconds: Number(escapeSeconds),
        escapeTime: Number(gameMinutes) * 60,
        ...(placeCoords ? { lat: placeCoords.lat, lng: placeCoords.lng } : {}),
        ...(prisonCoords ? { prisonLat: prisonCoords.lat, prisonLng: prisonCoords.lng } : {}),
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

  useEffect(() => {
    const trimmed = placeName.trim();
    if (!trimmed) {
      setPlaceResults([]);
      setPlaceError(null);
      setIsSearchingPlace(false);
      return;
    }

    if (skipNextPlaceSearchRef.current) {
      skipNextPlaceSearchRef.current = false;
      return;
    }

    const seq = ++placeSearchSeqRef.current;
    const timer = window.setTimeout(() => {
      setIsSearchingPlace(true);
      setPlaceError(null);
      setPlaceResults([]);
      fetchPlaces(trimmed)
        .then((results) => {
          if (seq !== placeSearchSeqRef.current) return;
          applySearchResults(trimmed, results, setPlaceResults, setPlaceError);
        })
        .catch((error) => {
          if (seq !== placeSearchSeqRef.current) return;
          if (error instanceof Error && error.message === "SEARCH_FAILED") {
            setPlaceError("장소 검색에 실패했습니다.");
            return;
          }
          setPlaceError("장소 검색에 실패했습니다.");
        })
        .finally(() => {
          if (seq !== placeSearchSeqRef.current) return;
          setIsSearchingPlace(false);
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [applySearchResults, fetchPlaces, placeName]);

  useEffect(() => {
    const trimmed = prisonPlaceName.trim();
    if (!trimmed) {
      setPrisonResults([]);
      setPrisonError(null);
      setIsSearchingPrison(false);
      return;
    }

    if (skipNextPrisonSearchRef.current) {
      skipNextPrisonSearchRef.current = false;
      return;
    }

    const seq = ++prisonSearchSeqRef.current;
    const timer = window.setTimeout(() => {
      setIsSearchingPrison(true);
      setPrisonError(null);
      setPrisonResults([]);
      fetchPlaces(trimmed)
        .then((results) => {
          if (seq !== prisonSearchSeqRef.current) return;
          applySearchResults(trimmed, results, setPrisonResults, setPrisonError);
        })
        .catch((error) => {
          if (seq !== prisonSearchSeqRef.current) return;
          if (error instanceof Error && error.message === "SEARCH_FAILED") {
            setPrisonError("장소 검색에 실패했습니다.");
            return;
          }
          setPrisonError("장소 검색에 실패했습니다.");
        })
        .finally(() => {
          if (seq !== prisonSearchSeqRef.current) return;
          setIsSearchingPrison(false);
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [applySearchResults, fetchPlaces, prisonPlaceName]);

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
          <InputLabel label="모임 장소명" isRequired={true} />
          <Input
            placeholder="예 : 잠실역 2호선"
            required
            value={placeName}
            onChange={(e) => {
              setPlaceName(e.target.value);
              setAddress("");
              setPlaceCoords(null);
              setPlaceResults([]);
              setPlaceError(null);
            }}
          />
          {placeError && (
            <span className="mt-1 ml-2 text-xs text-red-400">{placeError}</span>
          )}
          {placeResults.length > 0 && (
            <div className="mt-2 flex flex-col gap-2">
              {placeResults.map((place, index) => (
                <button
                  key={`${place.name}-${place.address}-${index}`}
                  type="button"
                  onClick={() => {
                    setPlaceName(place.name);
                    setAddress(place.address);
                    if (place.lat && place.lng) {
                      setPlaceCoords({ lat: place.lat, lng: place.lng });
                    }
                    setPlaceResults([]);
                    setPlaceError(null);
                    skipNextPlaceSearchRef.current = true;
                  }}
                  className="border-main-dark1 bg-main-dark2 rounded-lg border px-3 py-2 text-left"
                >
                  <div className="text-sm font-medium text-white">
                    {place.name}
                  </div>
                  {place.address && (
                    <div className="text-gray text-xs">{place.address}</div>
                  )}
                </button>
              ))}
            </div>
          )}
          {isSearchingPlace && (
            <span className="text-gray mt-1 ml-2 text-xs">검색중...</span>
          )}
        </section>
        <section className="flex flex-col pt-3" role="모임 주소 입력">
          <InputLabel label="모임 주소" isRequired={true} />
          <Input
            placeholder="예 : 서울특별시 송파구 올림픽로 265"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </section>
        <section className="flex flex-col pt-3" role="감옥 장소 정하기">
          <InputLabel label="감옥 장소명" isRequired={true} />
          <Input
            placeholder="예 : 잠실역 2호선 (감옥)"
            required
            value={prisonPlaceName}
            onChange={(e) => {
              setPrisonPlaceName(e.target.value);
              setPrisonAddress("");
              setPrisonCoords(null);
              setPrisonResults([]);
              setPrisonError(null);
            }}
          />
          {prisonError && (
            <span className="mt-1 ml-2 text-xs text-red-400">
              {prisonError}
            </span>
          )}
          {prisonResults.length > 0 && (
            <div className="mt-2 flex flex-col gap-2">
              {prisonResults.map((place, index) => (
                <button
                  key={`${place.name}-${place.address}-${index}`}
                  type="button"
                  onClick={() => {
                    setPrisonPlaceName(place.name);
                    setPrisonAddress(place.address);
                    if (place.lat && place.lng) {
                      setPrisonCoords({ lat: place.lat, lng: place.lng });
                    }
                    setPrisonResults([]);
                    setPrisonError(null);
                    skipNextPrisonSearchRef.current = true;
                  }}
                  className="border-main-dark1 bg-main-dark2 rounded-lg border px-3 py-2 text-left"
                >
                  <div className="text-sm font-medium text-white">
                    {place.name}
                  </div>
                  {place.address && (
                    <div className="text-gray text-xs">{place.address}</div>
                  )}
                </button>
              ))}
            </div>
          )}
          {isSearchingPrison && (
            <span className="text-gray mt-1 ml-2 text-xs">검색중...</span>
          )}
        </section>
        <section className="flex flex-col pt-3" role="감옥 주소 입력">
          <InputLabel label="감옥 주소" isRequired={true} />
          <Input
            placeholder="예 : 서울특별시 송파구 올림픽로 265 (감옥)"
            required
            value={prisonAddress}
            onChange={(e) => setPrisonAddress(e.target.value)}
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
                placeholder={"1"}
                width="sm"
                type="number"
                min={1}
                value={policeCount}
                onChange={(e) => setPoliceCount(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <InputLabel label="도둑" className="mb-1" />
              <Input
                placeholder={"1"}
                width="sm"
                type="number"
                min={1}
                value={thiefCount}
                onChange={(e) => setThiefCount(e.target.value)}
              />
            </div>
          </div>
          {isPeopleInvalid && (
            <span className="mt-1 ml-2 text-xs text-red-400">
              경찰과 도둑은 각각 최소 1명 이상이어야 합니다.
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
