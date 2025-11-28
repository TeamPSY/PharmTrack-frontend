import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MedicineMenu from '../pages/medicine/MedicineMenu';
import MedicineList from '../pages/medicine/MedicineList';
import MedicineForm from '../pages/medicine/MedicineForm';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/medicine" replace />} />

        <Route path="/medicine" element={<MedicineMenu />} />
        <Route path="/medicine/list" element={<MedicineList />} />

        {/* ⭐ 약품 등록 페이지 */}
        <Route path="/medicine/add" element={<MedicineForm />} />
      </Routes>
    </BrowserRouter>
  );
}
