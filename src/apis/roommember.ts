import { axiosInstance } from "./axios";

export type ApiResponse<T> = {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  path: string;
  data: T;
};

export type EmptyData = null;
export type ReleaseThiefData = {
  thiefUserId: number;
  thiefNickname: string;
  remainingThieves: number;
  message: string;
};
export type CaptureThiefData = {
  thiefUserId: number;
  thiefNickname: string;
  policeUserId: number;
  policeNickname: string;
  remainingThieves: number;
  message: string;
};

// 참가자 정보
export type Member = {
  userId: number;
  nickname: string;
  role: string; // "POLICE" | "THIEF"
  isArrived?: boolean;
  isAlive?: boolean; // 필요 시 사용
  caughtCount?: number;
};

// 사진 업로드

export type RequestRoomPhotoDto = {
  photo: File | Blob;
};

export type RoomPhotoData = {
  imageUrl: string;
};

export const uploadRoomPhoto = async (
  roomId: number,
  body: RequestRoomPhotoDto,
): Promise<ApiResponse<RoomPhotoData>> => {
  const formData = new FormData();
  formData.append("photo", body.photo);
  const { data } = await axiosInstance.post<ApiResponse<RoomPhotoData>>(
    `/api/v1/rooms/${roomId}/photo`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return data;
};

// 방 참가 (기존 코드 유지)
type RequestRoomJoinDto = {
  rolePreference: string;
};

type JoinRoomData = {
  roomId: number;
  userId: number;
  rolePreference: string;
  message: string;
};

export const joinRoom = async (
  roomId: number,
  userId: number,
  body: RequestRoomJoinDto,
): Promise<ApiResponse<JoinRoomData>> => {
  const { data } = await axiosInstance.post<ApiResponse<JoinRoomData>>(
    `/api/v1/rooms/${roomId}/join`,
    body,
    {
      params: { userId },
    },
  );
  return data;
};

// 팀 배정 및 게임 시작 (PATCH)
// Request Body: { "roles": [ { "userId": 1, "role": "POLICE" } ] }
export type RoleAssignment = {
  userId: number;
  role: "POLICE" | "THIEF"; // 구체적인 문자열 타입 권장
};

export type RequestGameStartDto = {
  roles: RoleAssignment[];
};

export type GameStartData = {
  roomId: number;
  stats: {
    totalPolice: number;
    totalThieves: number;
  };
  participants: Member[];
};

export const startGame = async (
  roomId: number,
  hostUserId: number,
  body: RequestGameStartDto,
): Promise<ApiResponse<GameStartData>> => {
  const { data } = await axiosInstance.patch<ApiResponse<GameStartData>>(
    `/api/v1/rooms/${roomId}/roles`,
    body, // Body에 roles 배열을 담아 보냅니다.
    {
      params: { hostUserId },
    },
  );
  return data;
};

// 탈옥 (Thief Release)
export const releaseThief = async (
  roomId: number,
  userId: number,
): Promise<ApiResponse<ReleaseThiefData>> => {
  const { data } = await axiosInstance.patch<ApiResponse<ReleaseThiefData>>(
    `/api/v1/rooms/${roomId}/participants/${userId}/release`,
  );
  return data;
};

// 도둑 검거 (Capture)
export const captureThief = async (
  roomId: number,
  thiefId: number, // 잡힌 도둑의 ID
  currentPoliceId: number,
): Promise<ApiResponse<CaptureThiefData>> => {
  const { data } = await axiosInstance.patch<ApiResponse<CaptureThiefData>>(
    `/api/v1/rooms/${roomId}/participants/${thiefId}/capture`,
    undefined,
    {
      params: { currentPoliceId },
    },
  );
  return data;
};

// 도착 상태 변경 (Arrival)
export const updateArrivalStatus = async (
  roomId: number,
): Promise<ApiResponse<ParticipantsData>> => {
  const { data } = await axiosInstance.patch<ApiResponse<ParticipantsData>>(
    `/api/v1/rooms/${roomId}/participants/arrival`,
  );
  return data;
};

// 도착 여부 조회
export type ParticipantsData = {
  roomId: number;
  participants: Member[];
};

export const getParticipants = async (
  roomId: number,
): Promise<ApiResponse<ParticipantsData>> => {
  const { data } = await axiosInstance.get<ApiResponse<ParticipantsData>>(
    `/api/v1/rooms/${roomId}/participants`,
  );
  return data;
};
