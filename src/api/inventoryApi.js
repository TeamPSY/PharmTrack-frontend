import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090",
});

// 전체 재고 조회
export const getInventoryList = () => API.get("/api/inventory");

// 직접 수정
export const updateInventory = (id, stock) =>
  API.put(`/api/inventory/${id}`, { stock });

// +1
export const increaseInventory = (id) =>
  API.put(`/api/inventory/${id}/plus`);

// -1
export const decreaseInventory = (id) =>
  API.put(`/api/inventory/${id}/minus`);
