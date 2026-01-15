import type { ApiResponse } from "@/apis/types";

export const createApiResponse = <T>(data: T): ApiResponse<T> => ({
  timestamp: new Date(0).toISOString(),
  status: 200,
  code: "SUCCESS",
  message: "ok",
  path: "/",
  data,
});
