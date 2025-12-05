import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090",
});

// ✔ 전체 카테고리 목록 조회
export const getCategoryList = () => API.get("/api/categories");
