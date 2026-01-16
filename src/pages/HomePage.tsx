import { getNearbyRoom, getRoom, type NearbyRoomItem } from "@/apis/room";
import { joinRoom } from "@/apis/roommember";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/common/Button";
import { useNavigate } from "react-router-dom";
import { renderToStaticMarkup } from "react-dom/server";
import CustomMarker from "@/components/map/CustomMarker";
import axios from "axios";

type GeocodeStatus = "OK" | string;

interface ReverseGeocodeResponse {
  v2?: {
    results?: Array<{
      region?: {
        area1?: { name?: string };
        area2?: { name?: string };
      };
    }>;
  };
}

type MapsApi = {
  LatLng: new (lat: number, lng: number) => unknown;
  Map: new (
    el: HTMLElement,
    options: {
      center: unknown;
      zoom: number;
      minZoom: number;
      scaleControl: boolean;
      mapDataControl: boolean;
      logoControlOptions: { position: unknown };
    },
  ) => {
    setCenter: (pos: unknown) => void;
  };
  Marker: new (options: {
    position: unknown;
    map: unknown;
    zIndex?: number;
    icon?: {
      content: string;
      anchor?: unknown;
    };
  }) => unknown;
  Point: new (x: number, y: number) => unknown;
  Position: {
    BOTTOM_LEFT: unknown;
  };
  Event: {
    addListener: (
      target: unknown,
      eventName: string,
      handler: () => void,
    ) => void;
  };
  Service: {
    reverseGeocode: (
      options: {
        coords: unknown;
        orders: string;
      },
      callback: (
        status: GeocodeStatus,
        response: ReverseGeocodeResponse,
      ) => void,
    ) => void;
    OrderType: {
      ADDR: string;
      ROAD_ADDR: string;
    };
    Status: {
      OK: GeocodeStatus;
    };
  };
};

type MapInstance = {
  setCenter: (pos: unknown) => void;
};

type RoomDetail = {
  roomId: number;
  title: string;
  placeName: string;
  meetingTime: string;
  status: string;
  countdownSeconds: number;
  escapeTime?: number;
  description?: string;
  capacity: {
    current: number;
    total: number;
  };
};

const parseLocalDateTime = (value: string) => {
  const [datePart, timePart] = value.split("T");
  if (!datePart || !timePart) return null;
  const [year, month, day] = datePart.split("-").map(Number);
  if (!year || !month || !day) return null;
  const [hour, minute, second = "0"] = timePart.split(":");
  const parsedHour = Number(hour);
  const parsedMinute = Number(minute);
  const parsedSecond = Number(second);
  if (
    Number.isNaN(parsedHour) ||
    Number.isNaN(parsedMinute) ||
    Number.isNaN(parsedSecond)
  ) {
    return null;
  }
  return new Date(year, month - 1, day, parsedHour, parsedMinute, parsedSecond);
};

const parseServerDateTime = (value: string) => {
  if (!value) return null;
  const normalized = value.trim().replace(/(\.\d{3})\d+/, "$1");
  if (/^\d+$/.test(normalized)) {
    const numeric = Number(normalized);
    if (!Number.isFinite(numeric)) return null;
    const ms = normalized.length <= 10 ? numeric * 1000 : numeric;
    const parsed = new Date(ms);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  const hasTimeZone = /[zZ]|[+-]\d{2}:\d{2}$/.test(normalized);
  if (hasTimeZone) {
    const parsed = new Date(normalized);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return parseLocalDateTime(normalized);
};

declare global {
  interface Window {
    naver: {
      maps: unknown;
    };
  }
}

const HomePage = () => {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const mapsRef = useRef<MapsApi | null>(null);
  const markersRef = useRef<unknown[]>([]);
  const [locationText, setLocationText] = useState("위치 불러오는 중...");
  const [rooms, setRooms] = useState<NearbyRoomItem[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userIdValue = localStorage.getItem("userId");
    if (!userIdValue) {
      navigate("/login");
      return;
    }

    const userId = Number(userIdValue);
    if (Number.isNaN(userId)) {
      navigate("/login");
      return;
    }

    let isMounted = true;
    let isPollingActive = false;
    let isFetching = false;
    let pollTimeoutId: number | null = null;
    const basePollMs = 10000;
    const maxPollMs = 60000;
    let currentPollMs = basePollMs;
    const fetchRooms = async (): Promise<boolean> => {
      try {
        const response = await getNearbyRoom();
        const now = parseServerDateTime(response.timestamp) ?? new Date();
        const visibleStatuses = new Set(["WAITING", "STARTING", "PLAYING"]);
        const filteredRooms = response.data.rooms.filter((room) => {
          if (!visibleStatuses.has(room.status)) return false;
          const meetingDate = parseServerDateTime(room.meetingTime);
          if (meetingDate && meetingDate.getTime() < now.getTime())
            return false;
          return true;
        });
        if (isMounted) setRooms(filteredRooms);
        return true;
      } catch (error) {
        console.error("근처 방 조회 실패:", error);
        if (isMounted) setRooms([]);
        return false;
      }
    };

    const scheduleNextPoll = () => {
      if (!isPollingActive || pollTimeoutId !== null) return;
      pollTimeoutId = window.setTimeout(() => {
        pollTimeoutId = null;
        void pollRooms();
      }, currentPollMs);
    };

    const pollRooms = async () => {
      if (!isPollingActive || isFetching) return;
      isFetching = true;
      const ok = await fetchRooms();
      if (!isPollingActive) {
        isFetching = false;
        return;
      }
      currentPollMs = ok ? basePollMs : Math.min(currentPollMs * 2, maxPollMs);
      isFetching = false;
      scheduleNextPoll();
    };

    const startPolling = () => {
      if (isPollingActive) return;
      isPollingActive = true;
      void pollRooms();
    };

    const stopPolling = () => {
      isPollingActive = false;
      currentPollMs = basePollMs;
      if (pollTimeoutId !== null) {
        window.clearTimeout(pollTimeoutId);
        pollTimeoutId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startPolling();
      } else {
        stopPolling();
      }
    };

    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      isMounted = false;
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [navigate]);

  const handleSelectRoom = useCallback(async (roomId: number) => {
    setActionError(null);
    try {
      const response = await getRoom(roomId);
      setSelectedRoom(response.data);
      localStorage.setItem("roomId", String(roomId));
    } catch (error) {
      let message = "방 정보를 불러오지 못했습니다.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      }
      setActionError(message);
    }
  }, []);

  const handleQuickJoin = async () => {
    if (!selectedRoom) {
      setActionError("참여할 방을 선택해 주세요.");
      return;
    }
    const userIdValue = localStorage.getItem("userId");
    if (!userIdValue) {
      navigate("/login");
      return;
    }
    const userId = Number(userIdValue);
    if (Number.isNaN(userId)) {
      navigate("/login");
      return;
    }

    setIsJoining(true);
    setActionError(null);

    try {
      await joinRoom(selectedRoom.roomId, {
        rolePreference: "RANDOM",
      });
      navigate(`/party/waiting?roomId=${selectedRoom.roomId}`, {
        state: { roomId: selectedRoom.roomId },
      });
    } catch (error) {
      let message = "참여 신청에 실패했습니다.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      }
      setActionError(message);
    } finally {
      setIsJoining(false);
    }
  };

  useEffect(() => {
    const { naver } = window as {
      naver?: {
        maps: unknown;
      };
    };

    if (!mapElement.current || !naver?.maps) return;
    const maps = naver.maps as MapsApi;
    mapsRef.current = maps;

    const defaultPosition = new maps.LatLng(37.5665, 126.978);
    const mapOptions = {
      center: defaultPosition,
      zoom: 15,
      minZoom: 10,
      scaleControl: false,
      mapDataControl: false,
      logoControlOptions: { position: maps.Position.BOTTOM_LEFT },
    };

    const mapInstance = new maps.Map(mapElement.current, mapOptions);
    mapRef.current = mapInstance;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentPosition = new maps.LatLng(latitude, longitude);

          mapInstance.setCenter(currentPosition);

          new maps.Marker({
            position: currentPosition,
            map: mapInstance,
            zIndex: 100,
            icon: {
              content:
                '<div style="width: 14px; height: 14px; background: #00FD9E; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>',
              anchor: new maps.Point(7, 7),
            },
          });

          maps.Service.reverseGeocode(
            {
              coords: currentPosition,
              orders: [
                maps.Service.OrderType.ADDR,
                maps.Service.OrderType.ROAD_ADDR,
              ].join(","),
            },
            (status: GeocodeStatus, response: ReverseGeocodeResponse) => {
              if (status !== maps.Service.Status.OK) {
                setLocationText("주소 정보 없음");
                return;
              }

              try {
                const result = response.v2?.results?.[0];

                if (!result?.region) {
                  setLocationText("주소 정보 없음");
                  return;
                }

                const si = result.region.area1?.name ?? "";
                const gu = result.region.area2?.name ?? "";

                if (si && gu) {
                  setLocationText(`${si} ${gu}`);
                } else {
                  setLocationText("주소 정보 없음");
                }
              } catch (e) {
                console.error("주소 파싱 에러", e);
                setLocationText("주소 정보 없음");
              }
            },
          );
        },
        (error) => {
          console.error("Geolocation Error:", error);
          setLocationText("위치 권한 필요");
        },
      );
    } else {
      setLocationText("GPS 미지원");
    }
    return () => {
      markersRef.current.forEach((marker) => {
        const typed = marker as { setMap?: (map: unknown) => void };
        if (typed?.setMap) typed.setMap(null);
      });
      markersRef.current = [];
    };
  }, [navigate]);

  useEffect(() => {
    const mapInstance = mapRef.current;
    const maps = mapsRef.current;

    if (!mapInstance || !maps) return;

    markersRef.current.forEach((marker) => {
      if (
        marker &&
        typeof (marker as { setMap?: (map: unknown) => void }).setMap ===
          "function"
      ) {
        (marker as { setMap: (map: unknown) => void }).setMap(null);
      }
    });
    markersRef.current = [];

    rooms.forEach((room) => {
      const markerHtml = renderToStaticMarkup(
        <CustomMarker
          roomId={room.roomId}
          title={room.title}
          current={room.currentParticipants}
          max={room.maxParticipants}
        />,
      );

      const marker = new maps.Marker({
        position: new maps.LatLng(room.lat, room.lng),
        map: mapInstance,
        icon: {
          content: markerHtml,
          anchor: new maps.Point(50, 60),
        },
      });

      maps.Event.addListener(marker, "click", () => {
        handleSelectRoom(room.roomId);
      });

      markersRef.current.push(marker);
    });
  }, [rooms, navigate, handleSelectRoom]);

  return (
    <div className="relative flex min-h-full w-full flex-col bg-[#111111]">
      <header className="z-10 flex w-full shrink-0 items-center justify-start border-b border-white/10 bg-[#111] p-5">
        <div className="flex gap-2.5">
          <div className="border-main bg-main-dark2 flex h-15 w-15 items-center justify-center border-4 border-solid p-2.5">
            <div className="bg-point-variant flex h-10 w-10 items-center justify-center text-xl">
              😎
            </div>
          </div>
          <div className="flex flex-col justify-center gap-1.5">
            <span className="text-point-variant text-[14px] font-medium tracking-[-0.35px]">
              {locationText}
            </span>
            <span className="text-[16px] font-bold tracking-[-0.4px] text-white">
              {localStorage.getItem("nickname") ?? "사용자 이름"}
            </span>
          </div>
        </div>
      </header>

      <div
        ref={mapElement}
        className="relative w-full flex-1 bg-gray-800 outline-none"
      />

      <div className="absolute bottom-8 left-1/2 z-50 flex w-full -translate-x-1/2 flex-col items-center gap-2 px-4">
        {selectedRoom && (
          <div className="w-full max-w-77.5 rounded-lg border border-white/10 bg-[#1a1a1a] px-4 py-3 text-white">
            <div className="text-sm font-medium">{selectedRoom.title}</div>
            <div className="text-xs text-white/70">
              {selectedRoom.placeName}
            </div>
            <div className="mt-2 flex gap-2">
              <Button
                width="md"
                state="default"
                onClick={() =>
                  navigate(`/party/detail?roomId=${selectedRoom.roomId}`, {
                    state: { roomId: selectedRoom.roomId },
                  })
                }
              >
                상세 보기
              </Button>
              <Button
                width="md"
                state="active"
                onClick={handleQuickJoin}
                disabled={isJoining}
              >
                {isJoining ? "신청 중..." : "바로 참여"}
              </Button>
            </div>
          </div>
        )}
        <Button
          state="active"
          width="xl"
          onClick={() => navigate("/party/create")}
        >
          + 새로운 경도팟 만들기
        </Button>
        {actionError && <p className="text-xs text-red-400">* {actionError}</p>}
      </div>
    </div>
  );
};

export default HomePage;
