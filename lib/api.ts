import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_LINK,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});
