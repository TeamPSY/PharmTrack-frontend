import { Routes, Route, Navigate } from 'react-router-dom';

// 홈
import Home from "../pages/Home"; 

// 약품
import MedicineMenu from '../pages/medicine/MedicineMenu';
import MedicineList from '../pages/medicine/MedicineList';
import MedicineForm from '../pages/medicine/MedicineForm';
import MedicineDelete from '../pages/medicine/MedicineDelete';
import MedicineExpiringList from '../pages/medicine/MedicineExpiringList';

// 판매
import SaleMenu from "../pages/sale/SaleMenu";
import SaleCreate from "../pages/sale/SaleCreate";
import SaleList from "../pages/sale/SaleList";
import SaleDetail from "../pages/sale/SaleDetail";
import SaleStatistic from "../pages/sale/SaleStatistic";

// 재고
import InventoryList from "../pages/inventory/InventoryList";
import InventoryLotPage from "../pages/inventory/InventoryLotPage";

// 인증
import UserRegister from "../pages/auth/UserRegister";
import UserLogin from "../pages/auth/UserLogin";
import UserUpdate from "../pages/auth/UserUpdate";

import ProtectedRoute from "../components/ProtectedRoute";

export default function Router() {
  return (
    <Routes>
      {/* 기본 */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />

      {/* ================= 판매 ================= */}
      <Route path="/sale" element={<ProtectedRoute><SaleMenu /></ProtectedRoute>} />
      <Route path="/sale/create" element={<ProtectedRoute><SaleCreate /></ProtectedRoute>} />
      <Route path="/sale/list" element={<ProtectedRoute><SaleList /></ProtectedRoute>} />
      <Route path="/sale/detail/:id" element={<ProtectedRoute><SaleDetail /></ProtectedRoute>} />
      <Route path="/sale/statistic" element={<ProtectedRoute><SaleStatistic /></ProtectedRoute>} />

      {/* ================= 약품 ================= */}
      <Route path="/medicine" element={<ProtectedRoute><MedicineMenu /></ProtectedRoute>} />
      <Route path="/medicine/list" element={<ProtectedRoute><MedicineList /></ProtectedRoute>} />
      <Route path="/medicine/add" element={<ProtectedRoute><MedicineForm /></ProtectedRoute>} />
      <Route path="/medicine/delete" element={<ProtectedRoute><MedicineDelete /></ProtectedRoute>} />
      <Route path="/medicine/expiring-list" element={<ProtectedRoute><MedicineExpiringList /></ProtectedRoute>} />
      <Route path="/medicine/list" element={<MedicineList />} />

      {/* ================= 재고 ================= */}
      <Route path="/inventory" element={<ProtectedRoute><InventoryList /></ProtectedRoute>} />
      <Route
        path="/inventory/:medicineId/lots"
        element={<ProtectedRoute><InventoryLotPage /></ProtectedRoute>}
      />

      {/* ================= 인증 ================= */}
      <Route path="/register" element={<UserRegister />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/user/update" element={<UserUpdate />} />
    </Routes>
  );
}
