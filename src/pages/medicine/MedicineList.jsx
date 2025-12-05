import React, { useEffect, useState } from "react";
import { getMedicineList } from "../../api/medicineApi";
import { useNavigate } from "react-router-dom";

export default function MedicineList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    // 1. 로딩 시작
    setLoading(true);
    setError(null);
    
    getMedicineList()
      .then((res) => {
        // 서버 응답 로그는 개발 환경에서만 유지하거나 제거합니다.
        console.log("🔥 서버 응답:", res.data);

        let data = res.data;
        let medicineList = [];

        // 2. 서버 응답 데이터 구조 유연하게 처리
        if (Array.isArray(data)) {
          medicineList = data;
        } else if (data && Array.isArray(data.data)) {
          medicineList = data.data;
        } else if (data && Array.isArray(data.list)) {
          medicineList = data.list;
        } else {
          // 배열 형태가 아닌 경우, 에러 처리
          console.error("❌ 서버 응답이 배열 형태가 아닙니다:", data);
          setError("데이터를 불러오는 중 예상치 못한 응답 형식이 감지되었습니다.");
        }

        setList(medicineList);
      })
      .catch((err) => {
        // 3. API 호출 실패 처리
        console.error("API 호출 중 오류 발생:", err);
        setError("약품 목록을 불러오지 못했습니다. 서버 상태를 확인해주세요.");
        setList([]);
      })
      .finally(() => {
        // 4. 로딩 완료
        setLoading(false);
      });
  }, []);

  // 렌더링 시작
  return (
    <div style={{ padding: "20px" }}>
      <h2>약품 목록</h2>
      {/* 5. 로딩 중 UI */}
      {loading ? (
        <p>약품 목록을 불러오는 중입니다...</p>
      ) : error ? (
        // 6. 에러 발생 시 UI
        <p style={{ color: "red" }}>오류 발생: {error}</p>
      ) : list.length === 0 ? (
        // 7. 데이터 없음 UI
        <p>등록된 약품이 없습니다.</p>
      ) : (
        // 8. 데이터 테이블 렌더링
        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            {/* <tr> 내부의 불필요한 공백 제거에 주의합니다. */}
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>제조사</th>
              <th>가격</th>
              <th>재고</th>
              <th>바코드</th>
              <th>수정</th>
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