import React, { useEffect, useState } from "react";
import { getSaleList } from "../../api/saleApi";
import { Link } from "react-router-dom";

export default function SaleList() {
  const [list, setList] = useState([]);

  useEffect(() => {
    getSaleList().then((res) => {
      setList(res.data);
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>판매 내역</h2>

      <table border="1" cellPadding="10">
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
              <td>{s.totalPrice}</td>
              <td>{s.saleTime}</td>
              <td>
                <Link to={`/sale/detail/${s.saleId}`}>보기</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
