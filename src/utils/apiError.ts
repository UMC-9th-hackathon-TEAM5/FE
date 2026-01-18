import axios from "axios";

type ApiErrorPayload = {
  code?: string;
  message?: string;
};

export const isAlreadyJoinedRoomError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return false;
  const data = error.response?.data as ApiErrorPayload | undefined;
  if (!data) return false;
  if (data.code === "BUSINESS_003" || data.code === "ALREADY_JOINED_ROOM") {
    return true;
  }
  return typeof data.message === "string" && data.message.includes("이미 참가");
};
