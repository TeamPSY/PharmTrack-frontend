import React, { useEffect, useState } from "react";
import { getSaleDetail } from "../../api/saleApi";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/SaleDetailModal.css";

export default function SaleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);

  useEffect(() => {
    getSaleDetail(id).then((res) => setSale(res.data));
  }, [id]);

  if (!sale) return null;

  return (
    <div className="modal-backdrop" onClick={() => navigate(-1)}>
      <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* 영수증 헤더 */}
        <div className="receipt-header">
          <h2>PHARM TRACK RECEIPT</h2>
          <p>판매 상세 정보</p>
        </div>

        {/* 판매 정보 */}
        <div className="receipt-info">
          <p>🧾 판매 ID: <b>{sale.saleId}</b></p>
          <p>💰 총 금액: <b>{sale.totalPrice.toLocaleString()}원</b></p>
          <p>⏱ 판매 시간: {sale.saleTime}</p>
        </div>

        <div className="receipt-divider" />

        {/* 판매 상품 리스트 */}
        <table className="receipt-table">
          <thead>
            <tr>
              <th>상품명</th>
              <th>수량</th>
              <th>단가</th>
              <th>합계</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((i) => (
              <tr key={i.saleItemId}>
                <td>{i.medicineName}</td>
                <td>{i.quantity}</td>
                <td>{i.unitPrice.toLocaleString()}</td>
                <td>{i.subtotalPrice.toLocaleString()}</td>
              </tr>
            ))}

            {/* 총 합계 */}
            <tr className="receipt-total-row">
              <td colSpan="3">총 합계</td>
              <td>{sale.totalPrice.toLocaleString()}원</td>
            </tr>
          </tbody>
        </table>

        {/* 하단 버튼 */}
        <div className="receipt-footer">
          <button className="close-btn" onClick={() => navigate(-1)}>
            닫기
          </button>
          <button
            className="new-sale-btn"
            onClick={() => navigate("/sale/create")}
          >
            새 판매 등록
          </button>
        </div>

      </div>
    </div>
  );
}
