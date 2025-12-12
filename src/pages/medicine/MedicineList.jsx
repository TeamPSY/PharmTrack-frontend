import React, { useEffect, useState } from "react";
import { getMedicineList } from "../../api/medicineApi";
import { useNavigate } from "react-router-dom";
import SearchPanel from "./SearchPanel";
import "../../styles/MedicineList.css";

const ITEMS_PER_PAGE = 10; // ⭐ 한 페이지당 10개

export default function MedicineList() {
  const [list, setList] = useState([]);          
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ⭐ 페이지 상태
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getMedicineList()
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || res.data?.list || [];

        setList(data);
        setFilteredList(data);
      })
      .catch(() => setError("서버 연결 오류"))
      .finally(() => setLoading(false));
  }, []);

  // ⭐ 페이지네이션 계산
  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredList.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="medicine-page">
      <h2 className="page-title">💊 약품 목록</h2>

      <div className="medicine-layout">
        {/* 왼쪽 */}
        <SearchPanel list={list} setFilteredList={setFilteredList} />

        {/* 오른쪽 */}
        <div className="result-area">
          {loading ? (
            <p className="status-text">불러오는 중...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : (
            <>
              <table className="medicine-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>약품명</th>
                    <th>제조사</th>
                    <th>가격</th>
                    <th>재고</th>
                    <th>바코드</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((m) => (
                    <tr key={m.medicineId}>
                      <td>{m.medicineId}</td>
                      <td className="medicine-name">{m.name}</td>
                      <td>{m.manufacturer}</td>
                      <td>{Number(m.price).toLocaleString()}원</td>
                      <td>{m.stock}</td>
                      <td>{m.barcode}</td>
                      <td>
                        <button
                          className="edit-btn"
                          onClick={() =>
                            navigate(`/medicines/edit/${m.medicineId}`)
                          }
                        >
                          수정
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ⭐ 페이지네이션 */}
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`page-btn ${
                        currentPage === page ? "active" : ""
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
