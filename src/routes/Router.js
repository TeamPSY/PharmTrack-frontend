import { Routes, Route, Navigate } from 'react-router-dom';

//홈 페이지 임포트
import Home from "../pages/Home"; 

//약품CRUD 페이지들 임포트
import MedicineMenu from '../pages/medicine/MedicineMenu';
import MedicineList from '../pages/medicine/MedicineList';
import MedicineForm from '../pages/medicine/MedicineForm';
import MedicineEdit from "../pages/medicine/MedicineEdit";
import MedicineDelete from '../pages/medicine/MedicineDelete';

// 🌟 유통기한 임박 목록 페이지 임포트
import MedicineExpiringList from '../pages/medicine/MedicineExpiringList';

//판매관리 페이지들 임포트
import SaleMenu from "../pages/sale/SaleMenu";
import SaleCreate from "../pages/sale/SaleCreate";
import SaleList from "../pages/sale/SaleList";
import SaleDetail from "../pages/sale/SaleDetail";

//재고관리 페이지 임포트
import InventoryList from "../pages/inventory/InventoryList";

// 사용자 인증 페이지 임포트
import UserRegister from "../pages/auth/UserRegister";
import UserLogin from "../pages/auth/UserLogin";
import UserUpdate from "../pages/auth/UserUpdate";

import ProtectedRoute from "../components/ProtectedRoute"; // ⭐ 추가

// import SearchPanel from '../components/SearchPanel';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* 홈은 로그인 없이도 접근 가능 */}
      <Route path="/home" element={<Home />} />

      {/* 🔐 판매관리 (로그인 필수) */}
      <Route
        path="/sale"
        element={
          <ProtectedRoute>
            <SaleMenu />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sale/create"
        element={
          <ProtectedRoute>
            <SaleCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sale/list"
        element={
          <ProtectedRoute>
            <SaleList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sale/detail/:id"
        element={
          <ProtectedRoute>
            <SaleDetail />
          </ProtectedRoute>
        }
      />

      {/* 🔐 약품관리 (로그인 필수) */}
      <Route
        path="/medicine"
        element={
          <ProtectedRoute>
            <MedicineMenu />
          </ProtectedRoute>
        }
      />

      {/* 🌟 유통기한 임박 목록 라우트 추가 */}
      <Route
        path="/medicine/expiring-list"
        element={
          <ProtectedRoute>
            <MedicineExpiringList />
          </ProtectedRoute>
      }
      />

      <Route
        path="/medicine/list"
        element={
          <ProtectedRoute>
            <MedicineList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/medicine/add"
        element={
          <ProtectedRoute>
            <MedicineForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/medicines/edit/:id"
        element={
          <ProtectedRoute>
            <MedicineEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/medicine/delete"
        element={
          <ProtectedRoute>
            <MedicineDelete />
          </ProtectedRoute>
        }
      />

      {/* 🔐 재고관리 (로그인 필수) */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <InventoryList />
          </ProtectedRoute>
        }
      />

      {/* 인증 (로그인 필요 없음) */}
      <Route path="/register" element={<UserRegister />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/user/update" element={<UserUpdate />} />

    </Routes>

    
  );
}
