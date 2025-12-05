import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 인증 페이지
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import FindIdPage from "../pages/FindIdPage";
import HomePage from "../pages/HomePage";

// 약품 관리
import MedicineList from '../pages/medicine/MedicineList';
import MedicineForm from '../pages/medicine/MedicineForm';
import MedicineEdit from "../pages/medicine/MedicineEdit";
import MedicineDelete from '../pages/medicine/MedicineDelete';

// 판매 관리
import SaleMenu from "../pages/sale/SaleMenu";
import SaleCreate from "../pages/sale/SaleCreate";
import SaleList from "../pages/sale/SaleList";
import SaleDetail from "../pages/sale/SaleDetail";

// 재고 관리
import InventoryList from "../pages/inventory/InventoryList";

// 홈
import Home from "../pages/Home";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* 인증 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/findid" element={<FindIdPage />} />
        
        {/* 홈 */}
        <Route path="/home" element={<Home />} />
        
        {/* 약품 관리 */}
        <Route path="/medicine/list" element={<ProtectedRoute><MedicineList /></ProtectedRoute>} />
        <Route path="/medicine/add" element={<ProtectedRoute><MedicineForm /></ProtectedRoute>} />
        <Route path="/medicines/edit/:id" element={<ProtectedRoute><MedicineEdit /></ProtectedRoute>} />
        <Route path="/medicine/delete" element={<ProtectedRoute><MedicineDelete /></ProtectedRoute>} />
        
        {/* 판매 관리 */}
        <Route path="/sale" element={<ProtectedRoute><SaleMenu /></ProtectedRoute>} />
        <Route path="/sale/create" element={<ProtectedRoute><SaleCreate /></ProtectedRoute>} />
        <Route path="/sale/list" element={<ProtectedRoute><SaleList /></ProtectedRoute>} />
        <Route path="/sale/detail/:id" element={<ProtectedRoute><SaleDetail /></ProtectedRoute>} />
        
        {/* 재고 관리 */}
        <Route path="/inventory" element={<ProtectedRoute><InventoryList /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}