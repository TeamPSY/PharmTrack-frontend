import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090",
  headers: { "Content-Type": "application/json" }
});

export const getHistoryByMedicine = (medicineId) =>
  API.get(`/api/inventory-history/medicine/${medicineId}`);
