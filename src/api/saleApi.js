import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090",
  headers: { "Content-Type": "application/json" }
});

function getUserId() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user).userId : null;
}

/* ===========================
   판매 기본 API
=========================== */

// 판매 목록
export const getSaleList = () => API.get("/api/sales");

// 판매 상세
export const getSaleDetail = (id) => API.get(`/api/sales/${id}`);

// 판매 등록
export const createSale = (data) =>
  API.post("/api/sales", {
    ...data,
    userId: getUserId(), // 자동 userId
  });

/* ===========================
   ⭐ 판매 통계 API (추가)
=========================== */

// 판매 통계 조회
export const getSaleStatistics = () =>
  API.get("/api/sales/statistics");
