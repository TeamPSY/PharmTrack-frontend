import React, { useEffect, useState } from "react";
import { getMedicineList } from "../../api/medicineApi";
import { useNavigate } from "react-router-dom";
import "../../styles/MedicineList.css";

export default function MedicineList() {
  const [list, setList] = useState([]);
  const [sortedList, setSortedList] = useState([]);
  const [sortType, setSortType] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);

    getMedicineList()
      .then((res) => {
        let data = res.data;
        let medicineList = [];

        if (Array.isArray(data)) medicineList = data;
        else if (data?.data) medicineList = data.data;
        else if (data?.list) medicineList = data.list;

      

        setList(medicineList);
        setSortedList(medicineList);
      })
      .catch(() => setError("약품 목록을 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, []);

  // ⭐ 정렬
  const handleSort = (type) => {
    setSortType(type);

    const sorted = [...list];

     if (type === "priceAsc") sorted.sort((a, b) => a.price - b.price);
  else if (type === "priceDesc") sorted.sort((a, b) => b.price - a.price);
  else if (type === "stockHigh") sorted.sort((a, b) => b.stock - a.stock);
  else if (type === "stockLow") sorted.sort((a, b) => a.stock - b.stock);
  else if (type === "expSoon") sorted.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));
  else if (type === "expLate") sorted.sort((a, b) => new Date(b.expirationDate) - new Date(a.expirationDate));
  

    setSortedList(sorted);
    setCurrentPage(1);
  };

  // ⭐ 페이지네이션
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = sortedList.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(sortedList.length / itemsPerPage);

  // ⭐ 유통기한 임박 리스트 (30일 이하)
  const today = new Date();
  const expiryAlertList = sortedList.filter((m) => {
    if (!m.expiration_date) return false;
    const expiry = new Date(m.expirationDate);
    const diffDays = (expiry - today) / (1000 * 60 * 60 * 24);
    return diffDays <= 30 && diffDays >= 0;
  });

  return (
    <div className="medicine-layout">
      
      {/* 왼쪽: 약품 목록 */}
      <div className="medicine-left">
        <h2 className="list-title">📦 약품 목록</h2>

        <div className="sort-box">
          <button className="sort-btn" onClick={() => handleSort("priceAsc")}>
            가격 ↑
          </button>
          <button className="sort-btn" onClick={() => handleSort("priceDesc")}>
            가격 ↓
          </button>
          <button className="sort-btn" onClick={() => handleSort("stockHigh")}>
            재고 많은 순
          </button>
          <button className="sort-btn" onClick={() => handleSort("stockLow")}>
            재고 적은 순
          </button>
          <button className="sort-btn" onClick={() => handleSort("expSoon")}>
  유통기한 임박 순
</button>

<button className="sort-btn" onClick={() => handleSort("expLate")}>
  유통기한 여유 순
</button>

        </div>

        {loading ? (
          <p className="loading-text">불러오는 중...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="medicine-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>이름</th>
                    <th>제조사</th>
                    <th>가격</th>
                    <th>재고</th>
                    <th>유통기한</th>
                    <th>수정</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((m) => (
                    <tr key={m.medicineId}>
                      <td>{m.medicineId}</td>
                      <td>{m.name}</td>
                      <td>{m.manufacturer}</td>
                      <td>{m.price}</td>
                      <td>{m.stock}</td>
                      <td>{m.expirationDate}</td>
                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => navigate(`/medicine/edit/${m.medicineId}`)}
                        >
                          수정
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  className={`page-btn ${currentPage === number ? "active" : ""}`}
                  onClick={() => setCurrentPage(number)}
                >
                  {number}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 오른쪽: 유통기한 임박 안내 */}
      <div className="medicine-right">
        <div className="expiry-card">
          <h3 className="expiry-title">⏳ 약품 유통기한 임박 안내</h3>

          {expiryAlertList.length === 0 ? (
            <p className="no-expiry">유통기한 임박 약품이 없습니다 😊</p>
          ) : (
            expiryAlertList.map((m) => (
              <div key={m.medicineId} className="expiry-item">
                <div>
                  <strong>{m.name}</strong>
                  <div className="expiry-date">유통기한: {m.expiration_date}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
