import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:9090',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 약품 등록
export const addMedicine = async (medicine) => {
  return await API.post('/api/medicines', medicine);
};

// 약품 목록 조회
export const getMedicineList = async () => {
  return await API.get('/api/medicines');
};

// 🌟 추가할 함수: 유통기한 임박 약 목록 조회
export const getExpiringSoon = async () => {
  // 백엔드 컨트롤러에서 이 경로를 처리해야 합니다.
  // 예시: GET /api/medicines/expiring-soon
  return await API.get('/api/medicines/expiring-soon');
};

// 약품 수정
export const updateMedicine = async (id, medicine) => {
  return await API.put(`/api/medicines/${id}`, medicine);
};

// 약품 상세 조회
export const getMedicineById = async (id) => {
  return await API.get(`/api/medicines/${id}`);
};

// 약품 삭제
export const deleteMedicine = async (id) => {
  return await API.delete(`/api/medicines/${id}`);
};