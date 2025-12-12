import React, { useEffect, useState } from "react";
import { getExpiringSoon } from "../../api/medicineApi";
import { useNavigate } from "react-router-dom";
import "../../styles/MedicineExpiringList.css";

export default function MedicineExpiringList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getExpiringSoon();
      setList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError("유통기한 임박 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expire-container">
      <h2 className="expire-title">⏰ 유통기한 임박 약품</h2>

      {loading ? (
        <p className="status-text">불러오는 중...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : list.length === 0 ? (
        <p className="status-text">유통기한이 임박한 약품이 없습니다.</p>
      ) : (
        <div className="table-wrapper">
          <table className="expire-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>약품명</th>
                <th>제조사</th>
                <th>가격</th>
                <th>재고</th>
                <th>바코드</th>
                <th>유통기한</th>
              </tr>
            </thead>

            <tbody>
              {list.map((m) => (
                <tr key={m.medicineId}>
                  <td>{m.medicineId}</td>
                  <td className="medicine-name">{m.name}</td>
                  <td>{m.manufacturer}</td>
                  <td>{Number(m.price).toLocaleString()}원</td>
                  <td>{m.stock}</td>
                  <td>{m.barcode}</td>
                  <td className="expire-date">{m.expirationDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
