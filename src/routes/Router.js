import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

//홈 페이지 임포트
import Home from "../pages/Home"; 

//약품CRUD 페이지들 임포트
import MedicineMenu from '../pages/medicine/MedicineMenu';
import MedicineList from '../pages/medicine/MedicineList';
import MedicineForm from '../pages/medicine/MedicineForm';
import MedicineEdit from "../pages/medicine/MedicineEdit";
import MedicineDelete from '../pages/medicine/MedicineDelete'; // ⭐ 추가

//판매관리 페이지들 임포트
import SaleMenu from "../pages/sale/SaleMenu";
import SaleCreate from "../pages/sale/SaleCreate";
import SaleList from "../pages/sale/SaleList";
import SaleDetail from "../pages/sale/SaleDetail";


//재고관리 페이지 임포트
import InventoryList from "../pages/inventory/InventoryList";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />

        {/* 🔹 판매관리 */}
        <Route path="/sale" element={<SaleMenu />} />
        <Route path="/sale/create" element={<SaleCreate />} />
        <Route path="/sale/list" element={<SaleList />} />
        <Route path="/sale/detail/:id" element={<SaleDetail />} />

        <Route path="/medicine" element={<MedicineMenu />} />

        <Route path="/medicine/list" element={<MedicineList />} />

        {/* ⭐ 약품 등록 페이지 */}
        <Route path="/medicine/add" element={<MedicineForm />} />
        
        {/* ⭐ 약품 수정 페이지 */}
        <Route path="/medicines/edit/:id" element={<MedicineEdit />} />
        
        {/* ⭐ 약품 삭제 페이지 */}
        <Route path="/medicine/delete" element={<MedicineDelete />} />

        {/* 재고관리 페이지 */}
        <Route path="/inventory" element={<InventoryList />} />

      </Routes>
    </BrowserRouter>
  );
}
