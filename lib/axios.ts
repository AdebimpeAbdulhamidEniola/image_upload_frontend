import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:2004/api",
  timeout: 4000,
  headers: {
    "Content-Type": "application/json",
  },
});
