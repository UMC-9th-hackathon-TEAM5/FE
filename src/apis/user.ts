import { axiosInstance } from "./axios";
import type { ApiResponse } from "./types";

type SessionRequestDto = {
  nickname?: string;
  password?: string;
  lat: number;
  lng: number;
};

type SessionResponseDto = {
  userId: number;
  nickname: string;
  accessToken: string;
  tokenType: string;
};

export const postUser = async (
  body: SessionRequestDto,
): Promise<ApiResponse<SessionResponseDto>> => {
  const { data } = await axiosInstance.post<ApiResponse<SessionResponseDto>>(
    "/api/v1/user/session",
    body,
  );
  return data;
};
