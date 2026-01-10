import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  const tokenType = localStorage.getItem("tokenType") ?? "Bearer";

  if (accessToken) {
    config.headers.Authorization = `${tokenType} ${accessToken}`;
  }

  return config;
});
