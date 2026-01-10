import { axiosInstance } from "./axios";

// 공통 응답 타입 (api/roommember.ts와 동일)
export type ApiResponse<T> = {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  path: string;
  data: T;
};

export type RequestUserDto = {
  nickname: string;
  password: string;
  lat: number;
  lng: number;
};

// [수정됨] Swagger 예시를 보면 data가 "string"입니다.
export const postUser = async (
  body: RequestUserDto,
): Promise<ApiResponse<string>> => {
  const { data } = await axiosInstance.post<ApiResponse<string>>(
    "/api/v1/user/session",
    body,
  );
  return data;
};
