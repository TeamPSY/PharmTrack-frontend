import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090",
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   🔹 판매 관련 기존 API
========================= */

// 판매 등록
export const createSale = (data) =>
  API.post("/api/sales", data, { withCredentials: true });

// 판매 목록
export const getSaleList = () =>
  API.get("/api/sales");

// 판매 상세
export const getSaleDetail = (saleId) =>
  API.get(`/api/sales/${saleId}`);


/* =========================
   📊 판매 통계 API
========================= */

// 일별 매출 통계
export const getDailySales = (startDate, endDate) =>
  API.get("/api/sales/statistics/daily", {
    params: { startDate, endDate },
  });

// 약품별 판매 통계
export const getMedicineSales = (startDate, endDate) =>
  API.get("/api/sales/statistics/by-medicine", {
    params: { startDate, endDate },
  });
