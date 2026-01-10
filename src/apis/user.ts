import { axiosInstance } from "./axios";

type RequestUserDto = {
  nickname: string;
  password: string;
  lat: number;
  lng: number;
};
type ResponseUserDto = {
  timestamp: string;
  status: number;
};

export const postUser = async (
  body: RequestUserDto,
): Promise<ResponseUserDto> => {
  const { data } = await axiosInstance.post("/api/v1/user/session", body);
  return data;
};
