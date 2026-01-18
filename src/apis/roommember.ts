import { axiosInstance } from "./axios";
import type {
  ApiResponse,
  EmptyObject,
  ParticipantInfo,
  Role,
  RolePreference,
  TeamStats,
} from "./types";

export type ReleaseThiefResponseDto = {
  thiefUserId: number;
  thiefNickname: string;
  remainingThieves: number;
  message: string;
};

export type CaptureThiefResponseDto = {
  thiefUserId: number;
  thiefNickname: string;
  policeUserId: number;
  policeNickname: string;
  remainingThieves: number;
  message: string;
};

export type JoinRoomRequestDto = {
  rolePreference: RolePreference;
};

type JoinRoomResponseDto = {
  roomId: number;
  userId: number;
  rolePreference: RolePreference;
  message: string;
};

export const joinRoom = async (
  roomId: number,
  body: JoinRoomRequestDto,
): Promise<ApiResponse<JoinRoomResponseDto>> => {
  const { data } = await axiosInstance.post<ApiResponse<JoinRoomResponseDto>>(
    `/api/v1/rooms/${roomId}/join`,
    body,
  );
  return data;
};

// 팀 배정 및 게임 시작 (PATCH)
// Request Body: { "roles": [ { "userId": 1, "role": "POLICE" } ] }
export type RoleAssignment = {
  userId: number;
  role: Role;
};

export type AssignRolesRequestDto = {
  roles: RoleAssignment[];
};

type AssignRolesResponseDto = {
  roomId: number;
  stats: TeamStats;
  participants: ParticipantInfo[];
};

export const startGame = async (
  roomId: number,
  body: AssignRolesRequestDto,
): Promise<ApiResponse<AssignRolesResponseDto>> => {
  const { data } = await axiosInstance.patch<ApiResponse<AssignRolesResponseDto>>(
    `/api/v1/rooms/${roomId}/roles`,
    body, // Body에 roles 배열을 담아 보냅니다.
  );
  return data;
};

// 탈옥 (Thief Release)
export const releaseThief = async (
  roomId: number,
): Promise<ApiResponse<ReleaseThiefResponseDto>> => {
  const { data } = await axiosInstance.patch<
    ApiResponse<ReleaseThiefResponseDto>
  >(`/api/v1/rooms/${roomId}/participants/release`);
  return data;
};

// 도착 여부 조회
export type ParticipantsData = {
  roomId: number;
  participants: ParticipantInfo[];
};

// 도둑 검거 (Capture)
export const captureThief = async (
  roomId: number,
  thiefId: number, // 잡힌 도둑의 ID
): Promise<ApiResponse<CaptureThiefResponseDto>> => {
  const { data } = await axiosInstance.patch<
    ApiResponse<CaptureThiefResponseDto>
  >(`/api/v1/rooms/${roomId}/participants/${thiefId}/capture`);
  return data;
};

// 도착 상태 변경 (Arrival)
export const updateArrivalStatus = async (
  roomId: number,
  targetUserId: number,
): Promise<ApiResponse<EmptyObject>> => {
  const { data } = await axiosInstance.patch<ApiResponse<EmptyObject>>(
    `/api/v1/rooms/${roomId}/participants/${targetUserId}/arrival`,
  );
  return data;
};

export const getParticipants = async (
  roomId: number,
): Promise<ApiResponse<ParticipantsData>> => {
  const { data } = await axiosInstance.get<ApiResponse<ParticipantsData>>(
    `/api/v1/rooms/${roomId}/participants`,
  );
  return data;
};

export type LeaveRoomResponseDto = {
  roomId: number;
  userId: number;
  message: string;
};

export const leaveRoom = async (
  roomId: number,
): Promise<ApiResponse<LeaveRoomResponseDto>> => {
  const { data } = await axiosInstance.delete<
    ApiResponse<LeaveRoomResponseDto>
  >(`/api/v1/rooms/${roomId}/leave`);
  return data;
};
