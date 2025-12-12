import { Link } from "react-router-dom";
import "../../styles/SaleMenu.css"; // ⭐ CSS 연결

export default function SaleMenu() {
  return (
    <div className="sale-container">
      <h2 className="sale-title">🛒 판매 관리</h2>

      <div className="menu-wrapper">
        <Link to="/sale/create" className="menu-btn">
          판매 등록
        </Link>

        <Link to="/sale/list" className="menu-btn">
          판매 내역 조회
        </Link>

        <Link to="/sale/Statistic" className="menu-btn">
          판매 통계
        </Link>
      </div>
    </div>
  );
}
