import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MedicineMenu from '../pages/medicine/MedicineMenu';
import MedicineList from '../pages/medicine/MedicineList';
import MedicineForm from '../pages/medicine/MedicineForm';
<<<<<<< HEAD
import MedicineDelete from '../pages/medicine/MedicineDelete'; // ⭐ 추가
=======
>>>>>>> b73abc13e945d4c8e5a281764237e6a04d2023dc

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/medicine" replace />} />

        <Route path="/medicine" element={<MedicineMenu />} />
        <Route path="/medicine/list" element={<MedicineList />} />

        {/* ⭐ 약품 등록 페이지 */}
        <Route path="/medicine/add" element={<MedicineForm />} />
<<<<<<< HEAD

        {/* ⭐ 약품 삭제 페이지 */}
        <Route path="/medicine/delete" element={<MedicineDelete />} />
=======
>>>>>>> b73abc13e945d4c8e5a281764237e6a04d2023dc
      </Routes>
    </BrowserRouter>
  );
}
