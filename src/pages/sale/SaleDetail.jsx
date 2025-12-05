import React, { useEffect, useState } from "react";
import { getSaleDetail } from "../../api/saleApi";
import { useParams, useNavigate } from "react-router-dom";

export default function SaleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);

  useEffect(() => {
    getSaleDetail(id).then((res) => setSale(res.data));
  }, [id]);

  if (!sale) return <p>로딩중...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>판매 상세</h2>

      <p>판매 ID: {sale.saleId}</p>
      <p>총 금액: {sale.totalPrice}</p>
      <p>판매 시간: {sale.saleTime}</p>

      <h3>판매 상품</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>상품명</th>
            <th>수량</th>
            <th>단가</th>
            <th>소계</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((i) => (
            <tr key={i.saleItemId}>
              <td>{i.medicineName}</td>
              <td>{i.quantity}</td>
              <td>{i.unitPrice}</td>
              <td>{i.subtotalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 버튼 영역 */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        {/* 🔙 뒤로가기 */}
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          뒤로가기
        </button>

        {/* ➕ 새 판매 등록 */}
        <button
          onClick={() => navigate("/sale/create")}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          새 판매 등록하기
        </button>
      </div>
    </div>
  );
}
