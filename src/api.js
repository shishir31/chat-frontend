// src/api.js
import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Inject token into headers for protected routes
API.interceptors.request.use((config) => {
  const raw = localStorage.getItem("user");
  if (raw) {
    try {
      const user = JSON.parse(raw);
      if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
    } catch {}
  }
  return config;
});