import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL을 지우거나 빈 문자열로 설정합니다.
  // 이렇게 하면 요청이 현재 도메인(localhost:5173/api/...)으로 전송되고,
  // 위에서 설정한 Proxy가 이를 가로채서 백엔드로 보냅니다.
  baseURL: "",

  // 혹은 명시적으로
  // baseURL: "/api/v1", // 이렇게 하고 호출할 때 뒤쪽 경로만 써도 됨

  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키/세션 사용 시 필수
});
