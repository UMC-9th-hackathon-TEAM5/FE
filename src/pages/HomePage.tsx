import { getNearbyRoom, type NearbyRoomItem } from "@/apis/room";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/common/Button";
import { useNavigate } from "react-router-dom";
import { renderToStaticMarkup } from "react-dom/server";
import CustomMarker from "@/components/map/CustomMarker";
import PartyDetailBottomSheet from "@/components/common/BottomSheet/PartyDetailBottomSheet";


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
  
  // [변경 1] 바텀 시트 상태 관리
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // [변경 2] 현재 선택된 방의 데이터를 저장할 state 추가
  const [selectedRoom, setSelectedRoom] = useState<NearbyRoomItem | null>(null);
  
  const [rooms, setRooms] = useState<NearbyRoomItem[]>([]);

  const navigate = useNavigate();

  // ... (로그인 체크 및 fetchRooms useEffect는 기존과 동일) ...
  useEffect(() => {
    const userIdValue = localStorage.getItem("userId");
    if (!userIdValue) {
      navigate("/login");
      return;
    }
    const fetchRooms = async () => {
      try {
        const response = await getNearbyRoom(Number(userIdValue));
        setRooms(response.data.rooms);
      } catch (error) {
        console.error("근처 방 조회 실패:", error);
        setRooms([]);
      }
    };
    fetchRooms();
  }, [navigate]);

  // ... (지도 초기화 및 현재 위치 마커 로직 기존과 동일) ...
  useEffect(() => {
    // (지도 생성 및 내 위치 마커 코드는 위와 동일하여 생략, 필요한 경우 기존 코드 유지)
    const { naver } = window as any;
    const maps = naver.maps as MapsApi;
    if (!mapElement.current || !naver) return;
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
       // ... (내 위치 마커 및 역지오코딩 로직 유지) ...
       navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          const currentPosition = new maps.LatLng(latitude, longitude);
          mapInstance.setCenter(currentPosition);
          
          new maps.Marker({
            position: currentPosition,
            map: mapInstance,
            zIndex: 100,
            icon: {
              content: '<div style="width: 14px; height: 14px; background: #00FD9E; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>',
              anchor: new maps.Point(7, 7),
            },
          });
          
          // ... (Reverse Geocoding 로직 유지) ...
          maps.Service.reverseGeocode({
              coords: currentPosition,
              orders: [maps.Service.OrderType.ADDR, maps.Service.OrderType.ROAD_ADDR].join(","),
          }, (status, response) => {
              // ... (주소 파싱 로직 유지) ...
              if (status === maps.Service.Status.OK) {
                  const result = response.v2?.results?.[0];
                  const si = result?.region?.area1?.name ?? "";
                  const gu = result?.region?.area2?.name ?? "";
                  setLocationText(si && gu ? `${si} ${gu}` : "주소 정보 없음");
              }
          });
       });
    }
  }, [navigate]);


  // [중요] 마커 렌더링 및 클릭 이벤트 수정
  useEffect(() => {
    const mapInstance = mapRef.current;
    const maps = mapsRef.current;

    if (!mapInstance || !maps) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => {
      if (marker && typeof (marker as any).setMap === "function") {
        (marker as any).setMap(null);
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

      // [변경 3] 마커 클릭 시 상태 업데이트
      maps.Event.addListener(marker, "click", () => {
        setSelectedRoom(room); // 1. 선택된 방 정보 저장
        setIsSheetOpen(true);  // 2. 바텀 시트 열기
      });

      markersRef.current.push(marker);
    });
  }, [rooms]); // navigate 의존성 제거 (이벤트 핸들러 내부 로직 변경으로 인해)

  // [변경 4] 참여하기 버튼 핸들러
  const handleConfirmParty = () => {
    if (selectedRoom) {
      navigate("/party/detail", { state: { roomId: selectedRoom.roomId } });
      setIsSheetOpen(false);
    }
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    // 필요 시 선택된 방 정보 초기화 (선택 사항)
    // setSelectedRoom(null); 
  };

  return (
    <div className="relative flex h-full w-full flex-col bg-[#111111]">
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

      <div className="absolute bottom-8 left-1/2 z-50 flex w-full -translate-x-1/2 justify-center px-4 pointer-events-none">
        {/* pointer-events-none을 주어 버튼 영역 외에는 지도를 클릭할 수 있게 함 */}
        
        {/* 플로팅 버튼은 클릭 가능해야 하므로 pointer-events-auto 추가 */}
        {!isSheetOpen && (
             <div className="pointer-events-auto">
                 <Button
                  state="active"
                  width="xl"
                  onClick={() => navigate('/party/create')}
                >
                  + 새로운 경도팟 만들기
                </Button>
             </div>
        )}

        {/* [변경 5] 바텀 시트 연결 */}
        {/* 바텀 시트 내부에서 선택된 방의 정보를 보여주려면 props로 selectedRoom을 전달해야 합니다. */}
        <PartyDetailBottomSheet
          isOpen={isSheetOpen}
          onClose={handleCloseSheet}
          onConfirm={handleConfirmParty}
          summaryData={selectedRoom}
        />
      </div>
    </div>
  );
};

export default HomePage;
