import { Link } from "react-router-dom";
import "../../styles/SaleMenu.css";

export default function SaleMenu() {
  return (
    <div className="sale-container">
      <h2 className="sale-title">🛒 판매 관리</h2>

      <div className="menu-wrapper">
        <Link to="/sale/create" className="menu-card">
          <span className="menu-icon">🧾</span>
          <h3>판매 등록</h3>
          <p>약품 판매 내역을 등록합니다</p>
        </Link>

        <Link to="/sale/list" className="menu-card">
          <span className="menu-icon">📋</span>
          <h3>판매 내역 조회</h3>
          <p>기간별 판매 기록을 확인합니다</p>
        </Link>

        <Link to="/sale/Statistic" className="menu-card">
          <span className="menu-icon">📊</span>
          <h3>판매 통계</h3>
          <p>매출 및 판매 현황을 분석합니다</p>
        </Link>
      </div>
    </div>
  );
}
