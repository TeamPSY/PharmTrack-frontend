import React, { useEffect, useState } from "react";
import { getSaleList } from "../../api/saleApi";
import { Link } from "react-router-dom";
import "../../styles/SaleList.css"; // ⭐ CSS 연결

export default function SaleList() {
  const [list, setList] = useState([]);

  useEffect(() => {
    getSaleList().then((res) => setList(res.data));
  }, []);

  return (
    <div className="sale-container">
      <h2 className="sale-title">💰 판매 내역</h2>

      <div className="sale-table-wrapper">
        <table className="sale-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>총 금액</th>
              <th>판매 시간</th>
              <th>상세보기</th>
            </tr>
          </thead>

          <tbody>
            {list.map((s) => (
              <tr key={s.saleId}>
                <td>{s.saleId}</td>
                <td>{s.totalPrice?.toLocaleString()} 원</td>
                <td>{s.saleTime}</td>
                <td>
                  <Link className="detail-btn" to={`/sale/detail/${s.saleId}`}>
                    보기
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
