import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API,
  headers: { "Content-Type": "application/json" }
});

// Nicely extract backend/trigger errors
export function getErr(e) {
  return e?.response?.data?.error || e?.message || "Unknown error";
}
