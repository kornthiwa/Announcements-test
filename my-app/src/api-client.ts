import axios from "axios";

const apiBaseUrl =
  process.env.REACT_APP_API_BASE_URL ?? "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
