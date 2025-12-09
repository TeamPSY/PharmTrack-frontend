import React, { useEffect, useState } from "react";
import { getMedicineList } from "../../api/medicineApi";
import { useNavigate } from "react-router-dom";
import SearchPanel from "./../medicine/SearchPanel";

export default function MedicineList() {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);

    getMedicineList()
      .then((res) => {
        let data = res.data;
        let medicineList = [];

        if (Array.isArray(data)) {
          medicineList = data;
        } else if (data && Array.isArray(data.data)) {
          medicineList = data.data;
        } else if (data && Array.isArray(data.list)) {
          medicineList = data.list;
        } else {
          console.error("❌ 서버 응답이 배열이 아님:", data);
          setError("서버 응답 형식 오류");
        }

        setList(medicineList);
      })
      .catch(() => {
        setError("서버 연결 오류");
        setList([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 실제 테이블에 표시할 데이터
  const displayList = filteredList ?? list;

  return (
    <div style={{ padding: "20px" }}>
      <h2>약품 목록</h2>

      <SearchPanel list={list} setFilteredList={setFilteredList} />

      {loading ? (
        <p>약품 목록을 불러오는 중...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : filteredList === null ? (
        // 🔥 최초 화면: 검색 전에는 아무 리스트도 안 보여줌
        <p>검색 또는 초성을 선택해주세요.</p>
      ) : displayList.length === 0 ? (
        <p>검색 결과가 없습니다.</p>
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
              <th>수정</th>
            </tr>
          </thead>

          <tbody>
            {displayList.map((m) => (
              <tr key={m.medicineId}>
                <td>{m.medicineId}</td>
                <td>{m.name}</td>
                <td>{m.manufacturer}</td>
                <td>{m.price}</td>
                <td>{m.stock}</td>
                <td>{m.barcode}</td>
                <td>
                  <button onClick={() => navigate(`/medicines/edit/${m.medicineId}`)}>
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
