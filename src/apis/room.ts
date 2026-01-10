import { axiosInstance } from "./axios";

export type ApiResponse<T> = {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  path: string;
  data: T;
};

export type Member = {
  userId: number;
  nickname: string;
  role: string;
  isArrived: boolean;
  isAlive?: boolean;
  caughtCount?: number;
};

export type NearbyRoomItem = {
  roomId: number;
  title: string;
  placeName: string;
  lat: number;
  lng: number;
  meetingTime: string; // "2026-01-10T18:00:00"
  currentParticipants: number; // 상세 조회와 달리 숫자만 옵니다.
  maxParticipants: number;
  distance: number; // 내 위치로부터의 거리
  status: string; // "WAITING"
};

export type NearbyRoomData = {
  rooms: NearbyRoomItem[];
  totalCount: number;
};

export type RequestRoomPostDto = {
  title: string;
  placeName: string;
  lat: number;
  lng: number;
  meetingTime: string;
  police_capacity: number;
  thief_capacity: number;
  countdownSeconds: number;
  escapeTime: number;
};

export type RequestRoomGameDto = {
  finishReason: string;
  winningTeam: string;
};

// 방 생성 후 응답 data
type RoomIdData = {
  roomId: number;
  hostId: number;
};

// 방 상세 조회 응답 data
type RoomDetailData = {
  roomId: number;
  title: string;
  placeName: string;
  meetingTime: string;
  status: string;
  countdownSeconds: number;
  capacity: {
    current: number;
    total: number;
  };
  participants: Member[];
};

// 게임 종료 응답 data
type GameResultData = {
  startTime: string;
  endTime: string;
  participants: Member[];
};

// 방 생성
export const postRoom = async (
  body: RequestRoomPostDto,
): Promise<ApiResponse<RoomIdData>> => {
  const { data } = await axiosInstance.post<ApiResponse<RoomIdData>>(
    "/api/v1/rooms",
    body,
  );
  return data;
};

// 방 상세 조회
export const getRoom = async (
  roomId: number,
): Promise<ApiResponse<RoomDetailData>> => {
  const { data } = await axiosInstance.get<ApiResponse<RoomDetailData>>(
    `/api/v1/rooms/${roomId}`,
  );
  return data;
};

// 근처 방 조회
export const getNearbyRoom = async (): Promise<ApiResponse<NearbyRoomData>> => {
  const { data } = await axiosInstance.get<ApiResponse<NearbyRoomData>>(
    "/api/v1/rooms/nearby",
  );
  return data;
};

// 게임 종료
export const postFinishgame = async (
  roomId: number,
  body: RequestRoomGameDto,
): Promise<ApiResponse<GameResultData>> => {
  const { data } = await axiosInstance.post<ApiResponse<GameResultData>>(
    `/api/v1/rooms/${roomId}/game/finish`,
    body,
  );
  return data;
};
