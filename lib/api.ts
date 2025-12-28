import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 4000,
  headers: {
    "Content-Type": "application/json",
  },
});
