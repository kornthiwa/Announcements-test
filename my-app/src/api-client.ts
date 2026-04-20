import axios from "axios";
import { env } from "process";

export const apiClient = axios.create({
  baseURL: env.base_url,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
