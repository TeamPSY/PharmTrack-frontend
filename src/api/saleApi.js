import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090",
  headers: { "Content-Type": "application/json" }
});

function getUserId() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user).userId : null;
}

// 판매 등록, 조회, 상세조회 API 함수들
export const getSaleList = () => API.get("/api/sales");
export const getSaleDetail = (id) => API.get(`/api/sales/${id}`);
export const createSale = (data) =>
  API.post("/api/sales", {
    ...data,
    userId: getUserId(), // 자동으로 userId 추가
  });


