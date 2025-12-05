import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090",
  withCredentials: true
});

export const registerUser = (data) =>
  API.post("/api/auth/register", data);

export const loginUser = (data) =>
  API.post("/api/auth/login", data);

export const getLoginUser = () =>
  API.get("/api/auth/me");

export const logoutUser = () =>
  API.post("/api/auth/logout");
