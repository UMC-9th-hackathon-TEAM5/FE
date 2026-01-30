export type ApiResponse<T> = {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  path: string;
  data: T;
};

export type Role = "POLICE" | "THIEF";
export type RolePreference = Role | "RANDOM";
export type FinishReason = "TIME_OVER" | "GAME_END";
export type WinningTeam = Role | "DRAW";
export type RoomStatus = "WAITING" | "STARTING" | "PLAYING" | "FINISHED";
export type GameParticipantStatus = "ALIVE" | "CAUGHT";
export type GameParticipantAliveState = GameParticipantStatus | boolean;

export type ParticipantInfo = {
  userId: number;
  nickname: string;
  role: Role;
  isArrived: boolean;
  isAlive?: GameParticipantAliveState;
  caughtCount?: number;
  lat?: number;
  lng?: number;
};

export type GameParticipant = {
  userId: number;
  nickname: string;
  role: Role;
  isAlive: GameParticipantAliveState;
  isArrived: boolean;
  caughtCount?: number;
};

export type CapacityInfo = {
  current: number;
  total: number;
};

export type TeamStats = {
  totalPolice: number;
  totalThieves: number;
};

export type EmptyObject = Record<string, never>;
