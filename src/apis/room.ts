import { axiosInstance } from "./axios";
import type {
  ApiResponse,
  CapacityInfo,
  FinishReason,
  GameParticipant,
  ParticipantInfo,
  RoomStatus,
  WinningTeam,
} from "./types";

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
  status: RoomStatus;
};

export type NearbyRoomData = {
  rooms: NearbyRoomItem[];
  totalCount: number;
};

export type CreateRoomRequestDto = {
  title?: string;
  placeName?: string;
  lat: number;
  lng: number;
  meetingTime: string;
  police_capacity: number;
  thief_capacity: number;
  countdownSeconds: number;
  escapeTime: number;
};

export type FinishGameRequestDto = {
  finishReason: FinishReason;
  winningTeam: WinningTeam;
};

// 방 생성 후 응답 data
type CreateRoomResponseDto = {
  roomId: number;
  hostId: number;
};

// 방 상세 조회 응답 data
type RoomDetailResponseDto = {
  roomId: number;
  title: string;
  placeName: string;
  meetingTime: string;
  status: RoomStatus;
  countdownSeconds: number;
  escapeTime?: number;
  police_capacity?: number;
  thief_capacity?: number;
  capacity: CapacityInfo;
  participants: ParticipantInfo[];
};

// 게임 종료 응답 data
type GameStatusResponseDto = {
  startTime: string;
  endTime: string;
  participants: GameParticipant[];
};

// 방 생성
export const postRoom = async (
  body: CreateRoomRequestDto,
): Promise<ApiResponse<CreateRoomResponseDto>> => {
  const { data } = await axiosInstance.post<ApiResponse<CreateRoomResponseDto>>(
    "/api/v1/rooms",
    body,
  );
  return data;
};

// 방 상세 조회
export const getRoom = async (
  roomId: number,
): Promise<ApiResponse<RoomDetailResponseDto>> => {
  const { data } = await axiosInstance.get<ApiResponse<RoomDetailResponseDto>>(
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
  body: FinishGameRequestDto,
): Promise<ApiResponse<GameStatusResponseDto>> => {
  const { data } = await axiosInstance.post<ApiResponse<GameStatusResponseDto>>(
    `/api/v1/rooms/${roomId}/game/finish`,
    body,
  );
  return data;
};
