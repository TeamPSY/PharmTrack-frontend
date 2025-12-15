import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090",
  headers: {
    "Content-Type": "application/json",
  },
});

// 약품별 로트 목록 조회
export const getLots = (medicineId) =>
  API.get(`/api/lots/${medicineId}`);

// 로트 등록
export const addLot = (data) =>
  API.post("/api/lots", data);

// FIFO 방식 재고 차감
export const decreaseLotStock = (medicineId, amount) =>
  API.post(`/api/lots/decrease/${medicineId}`, null, {
    params: { amount },
  });
