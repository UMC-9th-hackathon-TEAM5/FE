import { useEffect } from "react";

declare global {
  interface Window {
    naver: any;
  }
}

export default function NaverMapTest() {
  useEffect(() => {
    if (!window.naver) return;

    const map = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(37.5665, 126.978), // 서울시청
      zoom: 15,
    });
  }, []);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "400px",
      }}
    />
  );
}
