import React, { useEffect, useState } from "react";
import { getMedicineList, updateMedicine } from "../../api/medicineApi";
import "../../styles/MedicineInventory.css";

export default function InventoryList() {
  const [list, setList] = useState([]);
  const [sortedList, setSortedList] = useState([]);
  const [sortType, setSortType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // ⭐ 한 페이지당 10개 표시

  const [message, setMessage] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getMedicineList();
    setList(res.data);
    setSortedList(res.data);
  };

  const changeStock = (id, value) => {
    setSortedList((prev) =>
      prev.map((m) =>
        m.medicineId === id ? { ...m, stock: Number(value) } : m
      )
    );
  };

  const saveStock = async (item) => {
    try {
      await updateMedicine(item.medicineId, item);
      setMessage("✅ 재고가 정상적으로 수정되었습니다!");
      setTimeout(() => setMessage(null), 2000);
      load();
    } catch (err) {
      console.error(err);
      setMessage("❌ 수정 실패! 값을 다시 확인하세요.");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  // ⭐ 정렬
  const handleSort = (type) => {
    setSortType(type);
    let sorted = [...list];

    if (type === "stockHigh") {
      sorted.sort((a, b) => b.stock - a.stock);
    } else if (type === "stockLow") {
      sorted.sort((a, b) => a.stock - b.stock);
    } else if (type === "nameAsc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    } else if (type === "recent") {
      sorted.sort((a, b) => b.medicineId - a.medicineId);
    }

    setSortedList(sorted);
    setCurrentPage(1);
  };

  // ⭐ 페이지 계산
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = sortedList.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(sortedList.length / itemsPerPage);

  // ⭐ 재고 부족 리스트 (ex: 50 이하)
  const lowStockList = sortedList.filter((m) => m.stock <= 50);

  return (
    <div className="inventory-layout">

      {/* LEFT - 재고 관리 */}
      <div className="inventory-left">
        <div className="inventory-card">

          <h2 className="title-green">재고 관리</h2>

          {/* 정렬 버튼 */}
          <div className="inventory-sort-box">
            <button className="sort-btn" onClick={() => handleSort("stockHigh")}>재고 많은 순</button>
            <button className="sort-btn" onClick={() => handleSort("stockLow")}>재고 적은 순</button>
            <button className="sort-btn" onClick={() => handleSort("nameAsc")}>이름순</button>
            <button className="sort-btn" onClick={() => handleSort("recent")}>최근 등록순</button>
          </div>

          {/* 메시지 */}
          {message && <div className="message-box">{message}</div>}

          {/* 테이블 */}
          <div className="inventory-card overflow-auto">
            <table className="inventory-table w-full">
              <thead>
                <tr>
                  <th>약품명</th>
                  <th>재고</th>
                  <th>입고/출고</th>
                  <th>직접 입력</th>
                  <th>수정</th>
                </tr>
              </thead>

              <tbody>
                {currentItems.map((m) => (
                  <tr key={m.medicineId}>
                    <td>{m.name}</td>
                    <td>{m.stock}</td>

                    <td>
                      <button
                        className="btn-icon btn-sell"
                        onClick={() => changeStock(m.medicineId, m.stock + 1)}
                      >+1</button>

                      <button
                        className="btn-icon btn-delete"
                        onClick={() => changeStock(m.medicineId, m.stock - 1)}
                      >-1</button>
                    </td>

                    <td>
                      <input
                        type="number"
                        value={m.stock}
                        onChange={(e) => changeStock(m.medicineId, e.target.value)}
                        className="stock-input"
                      />
                    </td>

                    <td>
                      <button className="btn-green" onClick={() => saveStock(m)}>저장하기</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ⭐ 페이지네이션 */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`page-btn ${currentPage === num ? "active" : ""}`}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* RIGHT - 재고 부족 알림 */}
      <div className="inventory-right">
        <div className="alert-card">
          <h3 className="alert-title">⚠ 재고 부족 알림</h3>

          {lowStockList.length === 0 ? (
            <p className="no-alert">모든 약품의 재고가 충분합니다 🎉</p>
          ) : (
            lowStockList.map((m) => (
              <div key={m.medicineId} className="alert-item">
                <div>
                  <strong>{m.name}</strong>
                  <div className="alert-category">재고 부족</div>
                </div>
                <span className="alert-stock">{m.stock}개</span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
