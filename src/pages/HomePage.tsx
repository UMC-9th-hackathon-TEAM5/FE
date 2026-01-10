import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/common/Button";
import { useNavigate } from "react-router-dom";
import { renderToStaticMarkup } from "react-dom/server";
import CustomMarker from "@/components/map/CustomMarker";

// Window 타입 확장 (TypeScript용)
declare global {
  interface Window {
    naver: any;
  }
}

const HomePage = () => {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<any | null>(null);
  const [locationText, setLocationText] = useState("위치 불러오는 중...");

  const navigate = useNavigate();

  // 📍 (임시) Mock Data: 실제로는 API로 받아올 데이터
  const dummyRooms = [
    { id: 1, lat: 37.5660, lng: 126.9770, title: "광화문 경도팟", current: 12, max: 20 },
    { id: 2, lat: 37.5670, lng: 126.9790, title: "초보 환영", current: 5, max: 10 },
  ];

  useEffect(() => {
    const { naver } = window;
    if (!mapElement.current || !naver) return;

    // 1. 지도 초기화 (기본값: 서울 시청)
    const defaultPosition = new naver.maps.LatLng(37.5665, 126.9780);
    const mapOptions = {
      center: defaultPosition,
      zoom: 15,
      minZoom: 10,
      scaleControl: false,
      mapDataControl: false,
      logoControlOptions: { position: naver.maps.Position.BOTTOM_LEFT },
    };

    const mapInstance = new naver.maps.Map(mapElement.current, mapOptions);
    setMap(mapInstance);

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
        />
      );

      // 2-2. 마커 생성
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(room.lat, room.lng),
        map: mapInstance,
        icon: {
          content: markerHtml,
          // 마커 디자인에 따라 중심점 조정 (x: 중앙, y: 하단)
          anchor: new naver.maps.Point(50, 60), 
        },
      });

      // 2-3. 마커 클릭 이벤트 리스너
      naver.maps.Event.addListener(marker, "click", () => {
        console.log(`방 클릭됨: ID ${room.id}`);
        // 상세 페이지로 이동하며 roomId 전달
        navigate('/party/detail', { state: { roomId: room.id } });
      });
    });

    // =========================================================
    // 3. 내 현재 위치 가져오기 & 주소 변환
    // =========================================================
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentPosition = new naver.maps.LatLng(latitude, longitude);

          // 3-1. 지도 중심을 내 위치로 이동
          mapInstance.setCenter(currentPosition);

          // 3-2. 내 위치 표시 마커 (단순 초록 원)
          new naver.maps.Marker({
            position: currentPosition,
            map: mapInstance,
            zIndex: 100, // 다른 마커보다 위에 표시
            icon: {
                content: '<div style="width: 14px; height: 14px; background: #00FD9E; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>',
                anchor: new naver.maps.Point(7, 7),
            }
          });

          // 3-3. 좌표 -> 주소 변환 (Reverse Geocoding)
          // index.html에 &submodules=geocoder 필수!
          naver.maps.Service.reverseGeocode(
            {
              coords: currentPosition,
              orders: [
                naver.maps.Service.OrderType.ADDR,
                naver.maps.Service.OrderType.ROAD_ADDR,
              ].join(","),
            },
            (status: any, response: any) => {
              if (status !== naver.maps.Service.Status.OK) {
                setLocationText("주소 정보 없음");
                return;
              }

              try {
                const result = response.v2.results?.[0];

                if (!result || !result.region) {
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
            }
          );

        },
        (error) => {
          console.error("Geolocation Error:", error);
          setLocationText("위치 권한 필요");
        }
      );
    } else {
      setLocationText("GPS 미지원");
    }
  }, []); // 마운트 시 1회 실행

  return (
    <div className="w-full h-full flex flex-col relative bg-[#111111]">
      {/* 헤더 */}
      <header className="w-full p-5 flex items-center justify-start bg-[#111] z-10 shrink-0 border-b border-white/10">
        <div className="flex gap-2.5">
          <div className="w-15 h-15 p-2.5 border-4 border-solid border-main flex items-center justify-center bg-main-dark2">
            <div className="w-10 h-10 bg-point-variant flex items-center justify-center text-xl">😎</div>
          </div>
          <div className="flex flex-col justify-center gap-1.5">
            <span className="text-point-variant tracking-[-0.35px] text-[14px] font-medium">
              {locationText}
            </span>
            <span className="text-white tracking-[-0.4px] text-[16px] font-bold">
              사용자 이름
            </span>
          </div>
        </div>
      </header>

      {/* 지도 영역 */}
      <div ref={mapElement} className="flex-1 w-full bg-gray-800 outline-none relative" />
      
      {/* 플로팅 버튼 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center px-4">
        <Button state="active" width="xl" onClick={() => navigate('/party/create')}>
          + 새로운 경도팟 만들기
        </Button>
      </div>
    </div>
  );
};

export default HomePage;