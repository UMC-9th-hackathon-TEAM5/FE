import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/common/Button";
import { useNavigate } from "react-router-dom";
import { renderToStaticMarkup } from "react-dom/server";
import CustomMarker from "@/components/map/CustomMarker";

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

// Window 타입 확장 (TypeScript용)
declare global {
  interface Window {
    naver: {
      maps: unknown;
    };
  }
}

// 📍 (임시) Mock Data: 실제로는 API로 받아올 데이터
const dummyRooms = [
  {
    id: 1,
    lat: 37.566,
    lng: 126.977,
    title: "광화문 경도팟",
    current: 12,
    max: 20,
  },
  {
    id: 2,
    lat: 37.567,
    lng: 126.979,
    title: "초보 환영",
    current: 5,
    max: 10,
  },
];

const HomePage = () => {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const [locationText, setLocationText] = useState("위치 불러오는 중...");

  const navigate = useNavigate();

  // mock data moved to module scope

  useEffect(() => {
    const { naver } = window as {
      naver: {
        maps: unknown;
      };
    };

    const maps = naver.maps as {
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

    if (!mapElement.current || !naver) return;

    // 1. 지도 초기화 (기본값: 서울 시청)
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

    // =========================================================
    // 2. 방 목록 마커 생성 (CustomMarker -> HTML 변환)
    // =========================================================
    dummyRooms.forEach((room) => {
      // 2-1. 리액트 컴포넌트를 HTML 문자열로 변환
      const markerHtml = renderToStaticMarkup(
        <CustomMarker
          roomId={room.id}
          title={room.title}
          current={room.current}
          max={room.max}
        />,
      );

      // 2-2. 마커 생성
      const marker = new maps.Marker({
        position: new maps.LatLng(room.lat, room.lng),
        map: mapInstance,
        icon: {
          content: markerHtml,
          // 마커 디자인에 따라 중심점 조정 (x: 중앙, y: 하단)
          anchor: new maps.Point(50, 60),
        },
      });

      // 2-3. 마커 클릭 이벤트 리스너
      maps.Event.addListener(marker, "click", () => {
        console.log(`방 클릭됨: ID ${room.id}`);
        // 상세 페이지로 이동하며 roomId 전달
        navigate("/party/detail", { state: { roomId: room.id } });
      });
    });

    // =========================================================
    // 3. 내 현재 위치 가져오기 & 주소 변환
    // =========================================================
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentPosition = new maps.LatLng(latitude, longitude);

          // 3-1. 지도 중심을 내 위치로 이동
          mapInstance.setCenter(currentPosition);

          // 3-2. 내 위치 표시 마커 (단순 초록 원)
          new maps.Marker({
            position: currentPosition,
            map: mapInstance,
            zIndex: 100, // 다른 마커보다 위에 표시
            icon: {
              content:
                '<div style="width: 14px; height: 14px; background: #00FD9E; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>',
              anchor: new maps.Point(7, 7),
            },
          });

          // 3-3. 좌표 -> 주소 변환 (Reverse Geocoding)
          // index.html에 &submodules=geocoder 필수!
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
  }, [navigate]); // 마운트 시 1회 실행

  return (
    <div className="relative flex h-full w-full flex-col bg-[#111111]">
      {/* 헤더 */}
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
              사용자 이름
            </span>
          </div>
        </div>
      </header>

      {/* 지도 영역 */}
      <div
        ref={mapElement}
        className="relative w-full flex-1 bg-gray-800 outline-none"
      />

      {/* 플로팅 버튼 */}
      <div className="absolute bottom-8 left-1/2 z-50 flex w-full -translate-x-1/2 justify-center px-4">
        <Button
          state="active"
          width="xl"
          onClick={() => navigate("/party/create")}
        >
          + 새로운 경도팟 만들기
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
