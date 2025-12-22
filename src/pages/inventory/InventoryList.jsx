import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMedicineList, updateMedicine } from "../../api/medicineApi";
import "../../styles/InventoryList.css";
import HistoryModal from "./HistoryModal";

export default function InventoryList() {
  const [list, setList] = useState([]);
  const [sortedList, setSortedList] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [message, setMessage] = useState(null);

  /* 정렬 */
  const [sortType, setSortType] = useState("number");

  /* 이력 모달 */
  const [showHistory, setShowHistory] = useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState(null);

  const navigate = useNavigate();

  /* 데이터 로드 */
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getMedicineList();
      const data = res.data || [];
      setList(data);
    } catch {
      setMessage("데이터 로드 실패");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  /* 🔍 검색 + 정렬 */
  useEffect(() => {
    let result = [...list];

    /* 검색 */
    if (searchText.trim()) {
      result = result.filter((m) =>
        m.name.includes(searchText)
      );
    }

    /* 정렬 */
    switch (sortType) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "stockAsc":
        result.sort((a, b) => a.stock - b.stock);
        break;
      case "stockDesc":
        result.sort((a, b) => b.stock - a.stock);
        break;
      default:
        result.sort((a, b) => a.medicineId - b.medicineId);
    }

    setSortedList(result);
    setCurrentPage(1);
  }, [list, searchText, sortType]);

  /* 재고 수정 */
  const changeStock = (id, value) => {
    const num = Number(value);
    setSortedList((prev) =>
      prev.map((m) =>
        m.medicineId === id ? { ...m, stock: num } : m
      )
    );
  };

  const saveStock = async (item) => {
    try {
      await updateMedicine(item.medicineId, item);
      setMessage("✅ 재고 수정 완료!");
      setTimeout(() => setMessage(null), 2000);
      load();
    } catch {
      setMessage("❌ 수정 실패");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  /* 페이지네이션 */
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = sortedList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(
    1,
    Math.ceil(sortedList.length / itemsPerPage)
  );

  const normalizeDate = (dateStr) => {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  return (
    <div className="inventory-container">
      <div className="inventory-layout">

        {/* ================= 왼쪽 : 재고 테이블 ================= */}
        <div className="inventory-left">
          <div className="inventory-card">

            {/* 헤더 */}
            <div className="inventory-header">
  <div>
    <h2 className="title-green">재고 관리</h2>
    <p className="sub-text">총 {sortedList.length}건</p>
  </div>

  <div className="header-controls">
    <select
      value={sortType}
      onChange={(e) => setSortType(e.target.value)}
    >
      <option value="number">ID 번호순</option>
      <option value="stockAsc">재고 부족순</option>
      <option value="stockDesc">재고 많은순</option>
      <option value="name">가나다순</option>
    </select>

    <input
      className="inventory-search"
      
      placeholder="🔍약품명을 검색하세요"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
    />
  </div>
</div>



            {message && <div className="message-box">{message}</div>}

            {/* 테이블 */}
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>약품명</th>
                  <th>재고</th>
                  <th>입고/출고</th>
                  <th>직접 입력</th>
                  <th>저장</th>
                  <th>LOT</th>
                  <th>이력</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((m) => (
                  <tr key={m.medicineId}>
                    <td>{m.medicineId}</td>
                    <td>{m.name}</td>
                    <td>{m.stock}</td>
                    <td>
                      <button
                        className="btn-icon btn-sell"
                        onClick={() => changeStock(m.medicineId, m.stock + 1)}
                      >
                        +1
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => changeStock(m.medicineId, m.stock - 1)}
                      >
                        -1
                      </button>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={m.stock}
                        className="stock-input"
                        onChange={(e) =>
                          changeStock(m.medicineId, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="btn-green"
                        onClick={() => saveStock(m)}
                      >
                        저장
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn-gray"
                        onClick={() =>
                          navigate(`/inventory/${m.medicineId}/lots`)
                        }
                      >
                        LOT
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn-history"
                        onClick={() => {
                          setSelectedMedicineId(m.medicineId);
                          setShowHistory(true);
                        }}
                      >
                        이력
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 페이지네이션 */}
            <div className="pagination">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
                {"<<"}
              </button>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                {"<"}
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  className={currentPage === num ? "active" : ""}
                  onClick={() => setCurrentPage(num)}
                >
                  {num}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                {">"}
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                {">>"}
              </button>
            </div>
          </div>
        </div>

        {/* ================= 오른쪽 : 사이드 패널 ================= */}
        <div className="inventory-right">

          {/* 재고 부족 */}
          <div className="side-panel warning">
            <h3>재고 부족 약품</h3>
            <ul>
              {sortedList
                .filter((m) => m.stock <= 10)
                .slice(0, 5)
                .map((m) => (
                  <li key={m.medicineId}>
                    <span>💊 {m.name}</span>
                    <strong>{m.stock}개</strong>
                  </li>
                ))}
            </ul>
          </div>

          {/* 유통기한 임박 */}
          <div className="side-panel expire">
            <h3>유통기한 임박</h3>
            <ul>
              {sortedList
                .filter((m) => m.expireDate)
                .map((m) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const expire = normalizeDate(m.expireDate);
                  const daysLeft = Math.ceil(
                    (expire - today) / (1000 * 60 * 60 * 24)
                  );
                  return { ...m, daysLeft };
                })
                .sort((a, b) => a.daysLeft - b.daysLeft)
                .slice(0, 5)
                .map((m) => (
                  <li key={m.medicineId}>
                    <span>⏰ 💊 {m.name}</span>
                    <strong>D-{m.daysLeft}</strong>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 이력 모달 */}
      {showHistory && (
        <HistoryModal
          medicineId={selectedMedicineId}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
