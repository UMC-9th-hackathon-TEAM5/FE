import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/common/Button";
import { useNavigate } from "react-router-dom";
import { renderToStaticMarkup } from "react-dom/server";
import CustomMarker from "@/components/map/CustomMarker";
import { getNearbyRoom, NearbyRoomItem } from "@/apis/room"; // API import 경로 확인해주세요

// Window 타입 확장
declare global {
  interface Window {
    naver: any;
  }
}

const HomePage = () => {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const markerInstances = useRef<any[]>([]); // 생성된 마커들을 관리하기 위한 Ref

  const [map, setMap] = useState<any | null>(null);
  const [locationText, setLocationText] = useState("위치 불러오는 중...");
  const [rooms, setRooms] = useState<NearbyRoomItem[]>([]); // API로 받아온 방 목록
  const [nickname, setNickname] = useState("사용자");

  const navigate = useNavigate();

  // 1. 초기화: 닉네임 로드 & 지도 생성 & 내 위치 파악
  useEffect(() => {
    // 1-1. 닉네임 불러오기 (로그인 페이지에서 저장했다면)
    const savedNickname = localStorage.getItem("nickname");
    if (savedNickname) setNickname(savedNickname);

    const { naver } = window;
    if (!mapElement.current || !naver) return;

    // 1-2. 지도 생성 (기본값: 서울 시청)
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

    // 1-3. 내 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentPosition = new naver.maps.LatLng(latitude, longitude);

          // 지도 중심 이동
          mapInstance.setCenter(currentPosition);

          // 내 위치 마커 (초록 원)
          new naver.maps.Marker({
            position: currentPosition,
            map: mapInstance,
            zIndex: 100,
            icon: {
                content: '<div style="width: 14px; height: 14px; background: #00FD9E; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>',
                anchor: new naver.maps.Point(7, 7),
            }
          });

          // 주소 변환 (Reverse Geocoding)
          naver.maps.Service.reverseGeocode(
            {
              coords: currentPosition,
              orders: [naver.maps.Service.OrderType.ADDR, naver.maps.Service.OrderType.ROAD_ADDR].join(","),
            },
            (status: any, response: any) => {
              if (status !== naver.maps.Service.Status.OK) {
                setLocationText("주소 정보 없음");
                return;
              }
              try {
                const result = response.v2.results?.[0];
                const si = result?.region?.area1?.name ?? "";
                const gu = result?.region?.area2?.name ?? "";
                setLocationText(si && gu ? `${si} ${gu}` : "위치 확인 불가");
              } catch (e) {
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
  }, []);

  // 2. 방 목록 API 호출 (지도가 로드된 후 실행)
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getNearbyRoom();
        console.log("주변 방 목록:", response.data.rooms);
        setRooms(response.data.rooms);
      } catch (error) {
        console.error("방 목록 조회 실패:", error);
      }
    };

    fetchRooms();
  }, []);

  // 3. 방 마커 그리기 (map이 있고, rooms 데이터가 변경될 때마다 실행)
  useEffect(() => {
    if (!map || rooms.length === 0) return;
    const { naver } = window;

    // 기존 마커 제거 (새로고침 시 중복 방지)
    markerInstances.current.forEach((marker) => marker.setMap(null));
    markerInstances.current = [];

    rooms.forEach((room) => {
      // API 데이터 매핑 (API 필드명에 맞춤)
      const markerHtml = renderToStaticMarkup(
        <CustomMarker 
          roomId={room.roomId}
          title={room.title} 
          current={room.currentParticipants} // API 필드명 확인 필요
          max={room.maxParticipants}         // API 필드명 확인 필요
        />
      );

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(room.lat, room.lng),
        map: map,
        icon: {
          content: markerHtml,
          anchor: new naver.maps.Point(50, 60), 
        },
      });

      // 클릭 이벤트
      naver.maps.Event.addListener(marker, "click", () => {
        // 상세 페이지로 이동
        navigate('/party/detail', { state: { roomId: room.roomId } });
      });

      // 마커 인스턴스 저장 (삭제용)
      markerInstances.current.push(marker);
    });

  }, [map, rooms, navigate]);

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
              {nickname}
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