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

// 약품 삭제
export const deleteMedicine = async (id) => {
  return await API.delete(`/api/medicines/${id}`);
};