import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMedicineList, updateMedicine } from "../../api/medicineApi";
import "../../styles/MedicineInventory.css";
import { useExpiringCount } from "../../hooks/useNotification";
import HistoryModal from "./HistoryModal";

export default function InventoryList() {
  const [list, setList] = useState([]);
  const [sortedList, setSortedList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [message, setMessage] = useState(null);

  /* 정렬 */
  const [sortType, setSortType] = useState("number");

  /* 이력 모달 */
  const [showHistory, setShowHistory] = useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState(null);

  const navigate = useNavigate();
  const { expiringCount, loading } = useExpiringCount();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getMedicineList();
      const data = res.data || [];
      setList(data);
      setSortedList(data);
    } catch (err) {
      setMessage("데이터 로드 실패");
      setTimeout(() => setMessage(null), 2000);
    }
  };
  

  /* 정렬 적용 */
  useEffect(() => {
    let sorted = [...list];

    switch (sortType) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "stock":
        sorted.sort((a, b) => b.stock - a.stock);
        break;
      default:
        sorted.sort((a, b) => a.medicineId - b.medicineId);
    }

    setSortedList(sorted);
    setCurrentPage(1);
  }, [sortType, list]);

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

  return (
    <div className="inventory-container">
      <div className="inventory-layout">

        {/* 왼쪽 : 재고 테이블 */}
        <div className="inventory-left">
          <div className="inventory-card">

            {/* 헤더 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h2 className="title-green">재고 관리</h2>

              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
              >
                <option value="number">번호순</option>
                <option value="name">가나다순</option>
                <option value="stock">재고순</option>
              </select>
            </div>

            {message && <div className="message-box">{message}</div>}

            {/* 테이블 */}
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>약품명</th>
                  <th>재고</th>
                  <th>입고/출고</th>
                  <th>직접 입력</th>
                  <th>저장하기</th>
                  <th>LOT 관리</th>
                  <th>이력 보기</th>
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
                        onClick={() =>
                          changeStock(m.medicineId, m.stock + 1)
                        }
                      >
                        +1
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() =>
                          changeStock(m.medicineId, m.stock - 1)
                        }
                      >
                        -1
                      </button>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={m.stock}
                        onChange={(e) =>
                          changeStock(m.medicineId, e.target.value)
                        }
                        className="stock-input"
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
  {/* 맨 처음 */}
  <button
    className="page-btn"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(1)}
  >
    {"<<"}
  </button>

  {/* 이전 */}
  <button
    className="page-btn"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
  >
    {"<"}
  </button>

  {/* 페이지 번호 */}
  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
    <button
      key={num}
      className={`page-btn ${currentPage === num ? "active" : ""}`}
      onClick={() => setCurrentPage(num)}
    >
      {num}
    </button>
  ))}

  {/* 다음 */}
  <button
    className="page-btn"
    disabled={currentPage === totalPages}
    onClick={() =>
      setCurrentPage((p) => Math.min(totalPages, p + 1))
    }
  >
    {">"}
  </button>

  {/* 맨 끝 */}
  <button
    className="page-btn"
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(totalPages)}
  >
    {">>"}
  </button>
</div>


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
