import React, { useEffect, useState } from "react";
import { getMedicineList } from "../../api/medicineApi";
import { useNavigate } from "react-router-dom";

export default function MedicineList() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMedicineList().then((res) => {
      console.log("🔥 서버 응답:", res.data);

      let data = res.data;

      // 응답 형태 확인
      if (Array.isArray(data)) {
        setList(data);
      } else if (data.data && Array.isArray(data.data)) {
        setList(data.data);
      } else if (data.list && Array.isArray(data.list)) {
        setList(data.list);
      } else {
        console.error("❌ 서버 응답이 배열이 아님:", data);
        setList([]);
      }
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>약품 목록</h2>

      {list.length === 0 ? (
        <p>등록된 약품이 없습니다.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>제조사</th>
              <th>가격</th>
              <th>재고</th>
              <th>바코드</th>
              <th>수정</th> {/* 🔥 수정 버튼 칸 */}
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
                <td>
                  <button
                    onClick={() => navigate(`/medicines/edit/${m.medicineId}`)}
                  >
                    수정
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
