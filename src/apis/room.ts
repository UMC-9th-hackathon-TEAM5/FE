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
  description?: string;
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
  description?: string;
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

type RoomMeta = {
  description?: string;
  escapeTime?: number;
};

const canUseStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const roomMetaKey = (roomId: number) => `roomMeta:${roomId}`;

const readRoomMeta = (roomId: number): RoomMeta | null => {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(roomMetaKey(roomId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RoomMeta;
  } catch {
    return null;
  }
};

const writeRoomMeta = (roomId: number, meta: RoomMeta) => {
  if (!canUseStorage()) return;
  const next: RoomMeta = {};

  if (typeof meta.escapeTime === "number" && Number.isFinite(meta.escapeTime)) {
    next.escapeTime = meta.escapeTime;
  }
  if (typeof meta.description === "string" && meta.description.trim().length) {
    next.description = meta.description;
  }
  if (!Object.keys(next).length) return;

  const existing = readRoomMeta(roomId) ?? {};
  const merged = { ...existing, ...next };
  window.localStorage.setItem(roomMetaKey(roomId), JSON.stringify(merged));
};

const readNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const readString = (value: unknown) => {
  if (typeof value !== "string") return null;
  return value.trim().length > 0 ? value : null;
};

const normalizeRoomDetail = (
  room: RoomDetailResponseDto & Record<string, unknown>,
): RoomDetailResponseDto => {
  const stored = readRoomMeta(room.roomId);

  const escapeTime =
    readNumber(room.escapeTime) ??
    readNumber(room.escape_time) ??
    readNumber(room.escapeSeconds) ??
    readNumber(room.escape_seconds) ??
    stored?.escapeTime;

  const description =
    readString(room.description) ??
    readString(room.desc) ??
    readString(room.roomDescription) ??
    readString(room.room_description) ??
    stored?.description;

  const normalized = {
    ...room,
    escapeTime,
    description,
  };

  writeRoomMeta(room.roomId, { escapeTime, description });
  return normalized;
};

// 방 생성
export const postRoom = async (
  body: CreateRoomRequestDto,
): Promise<ApiResponse<CreateRoomResponseDto>> => {
  const { data } = await axiosInstance.post<ApiResponse<CreateRoomResponseDto>>(
    "/api/v1/rooms",
    body,
  );
  writeRoomMeta(data.data.roomId, {
    description: body.description,
    escapeTime: body.escapeTime,
  });
  return data;
};

// 방 상세 조회
export const getRoom = async (
  roomId: number,
): Promise<ApiResponse<RoomDetailResponseDto>> => {
  const { data } = await axiosInstance.get<ApiResponse<RoomDetailResponseDto>>(
    `/api/v1/rooms/${roomId}`,
  );
  return {
    ...data,
    data: normalizeRoomDetail(
      data.data as RoomDetailResponseDto & Record<string, unknown>,
    ),
  };
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
