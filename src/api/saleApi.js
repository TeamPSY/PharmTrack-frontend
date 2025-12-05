import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090",
  headers: { "Content-Type": "application/json" }
});

// 판매 등록, 조회, 상세조회 API 함수들
export const getSaleList = () => API.get("/api/sales");
export const getSaleDetail = (id) => API.get(`/api/sales/${id}`);
export const createSale = (data) => API.post("/api/sales", data);
