import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  const tokenType = localStorage.getItem("tokenType") ?? "Bearer";
  const baseURL = config.baseURL ?? "";
  const url = config.url ?? "";

  if (baseURL.endsWith("/api") && url.startsWith("/api/")) {
    config.url = url.slice(4);
  }

  if (accessToken) {
    config.headers.Authorization = `${tokenType} ${accessToken}`;
  }

  return config;
});
