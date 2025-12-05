import { Link } from "react-router-dom";

export default function SaleMenu() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>판매 관리</h2>

      <button style={{ display: "block", margin: "10px 0" }}>
        <Link to="/sale/create">판매 등록</Link>
      </button>

      <button style={{ display: "block", margin: "10px 0" }}>
        <Link to="/sale/list">판매 내역 조회</Link>
      </button>
    </div>
  );
}
