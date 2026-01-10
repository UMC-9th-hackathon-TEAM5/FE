import { axiosInstance } from "./axios";

export type ApiResponse<T> = {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  path: string;
  data: T;
};

type RequestUserDto = {
  nickname: string;
  password: string;
  lat: number;
  lng: number;
};
type ResponseUserData = {
  userId: number;
  nickname: string;
  accessToken: string;
  tokenType: string;
};

export const postUser = async (
  body: RequestUserDto,
): Promise<ApiResponse<ResponseUserData>> => {
  const { data } = await axiosInstance.post<ApiResponse<ResponseUserData>>(
    "/api/v1/user/session",
    body,
  );
  return data;
};
