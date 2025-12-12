// ...existing code...
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMedicineList, updateMedicine } from "../../api/medicineApi";
import "../../styles/MedicineInventory.css";
import { useExpiringCount } from "../../hooks/useNotification";

export default function InventoryList() {
  const [list, setList] = useState([]);
  const [sortedList, setSortedList] = useState([]);
  const [sortType, setSortType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const { expiringCount, loading } = useExpiringCount();

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    try {
      const res = await getMedicineList();
      const data = res.data || [];
      setList(data);
      setSortedList(data);
    } catch (err) {
      console.error(err);
      setMessage("데이터 로드 실패");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const changeStock = (id, value) => {
    const num = Number(value);
    setList((prev) => prev.map((m) => (m.medicineId === id ? { ...m, stock: num } : m)));
    setSortedList((prev) => prev.map((m) => (m.medicineId === id ? { ...m, stock: num } : m)));
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

  const handleSort = (type) => {
    setSortType(type);
    let sorted = [...list];
    if (type === "stockHigh") sorted.sort((a, b) => b.stock - a.stock);
    else if (type === "stockLow") sorted.sort((a, b) => a.stock - b.stock);
    else if (type === "nameAsc") sorted.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    else if (type === "recent") sorted.sort((a, b) => b.medicineId - a.medicineId);
    setSortedList(sorted);
    setCurrentPage(1);
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = sortedList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(sortedList.length / itemsPerPage));
  const lowStockList = sortedList.filter((m) => m.stock <= 50);

  const handleCheckExpiration = () => {
    navigate("/medicine/expiring-list");
  };

  return (
    <div className="inventory-layout">
      <div className="inventory-left">
        <div className="inventory-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 className="title-green">재고 관리</h2>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div>
                <button className="sort-btn" onClick={() => handleSort("stockHigh")}>재고 많은 순</button>
                <button className="sort-btn" onClick={() => handleSort("stockLow")}>재고 적은 순</button>
                <button className="sort-btn" onClick={() => handleSort("nameAsc")}>이름순</button>
                <button className="sort-btn" onClick={() => handleSort("recent")}>최근 등록순</button>
              </div>

              <button
                onClick={handleCheckExpiration}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#ffc107",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  position: "relative",
                  fontWeight: "600"
                }}
              >
                유통기한 체크
                {!loading && expiringCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-8px",
                      background: "red",
                      color: "#fff",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: 12,
                      fontWeight: 700
                    }}
                  >
                    {expiringCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {message && <div className="message-box" style={{ marginTop: 12 }}>{message}</div>}

          <div className="inventory-card overflow-auto" style={{ marginTop: 12 }}>
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
                      <button className="btn-icon btn-sell" onClick={() => changeStock(m.medicineId, m.stock + 1)}>+1</button>
                      <button className="btn-icon btn-delete" onClick={() => changeStock(m.medicineId, m.stock - 1)}>-1</button>
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

          <div className="pagination" style={{ marginTop: 12 }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`page-btn ${currentPage === num ? "active" : ""}`}
                onClick={() => setCurrentPage(num)}
                style={{ marginRight: 6 }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

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
// ...existing code...