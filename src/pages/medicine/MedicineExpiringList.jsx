import React, { useEffect, useState } from "react";
import { getExpiringSoon } from "../../api/medicineApi"; 
import { useNavigate } from "react-router-dom";

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
      const res = await getExpiringSoon(); // 🔥 수정 완료
      setList(res.data);
    } catch (err) {
      console.error(err);
      setError("유통기한 임박 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>유통기한 임박 약품 목록</h2>

      {loading ? (
        <p>불러오는 중...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : list.length === 0 ? (
        <p>유통기한이 임박한 약품이 없습니다.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
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
                <td>{m.name}</td>
                <td>{m.manufacturer}</td>
                <td>{m.price}</td>
                <td>{m.stock}</td>
                <td>{m.barcode}</td>
                <td>{m.expirationDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
