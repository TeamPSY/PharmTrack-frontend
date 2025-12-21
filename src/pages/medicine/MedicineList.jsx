import React, { useEffect, useState } from "react";
import {
  getMedicineList,
  deleteMedicine,
} from "../../api/medicineApi";
import MedicineEdit from "./MedicineEditModal";
import MedicineAddModal from "./MedicineAddModal";
import "../../styles/MedicineList.css";
import "../../styles/SearchPanel.css";

const ITEMS_PER_PAGE = 10;

/* ====== 초성 검색 유틸 ====== */
const initials = ["ㄱ","ㄴ","ㄷ","ㄹ","ㅁ","ㅂ","ㅅ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];

const CHO = [
  "ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ",
  "ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ",
  "ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"
];

const getInitial = (char) => {
  const code = char.charCodeAt(0) - 44032;
  if (code < 0 || code > 11171) return char;
  return CHO[Math.floor(code / 588)];
};

const toInitialString = (str) =>
  str.split("").map(getInitial).join("");

export default function MedicineList() {
  /* ===== 상태 ===== */
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [activeInitial, setActiveInitial] = useState(null);
  const [sortType, setSortType] = useState("number");

  /* ===== 데이터 로드 ===== */
  useEffect(() => {
    load();
  }, []);

  const load = () => {
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
  };

  /* ===== 검색 ===== */
  const handleSearch = (text) => {
    setSearchText(text);
    setActiveInitial(null);
    setCurrentPage(1);

    if (text.trim() === "") {
      setFilteredList(list);
      return;
    }

    setFilteredList(list.filter((m) => m.name.includes(text)));
  };

  /* ===== 초성 ===== */
  const handleInitial = (ch) => {
    setActiveInitial(ch);
    setSearchText("");
    setCurrentPage(1);

    setFilteredList(
      list.filter((m) => toInitialString(m.name).startsWith(ch))
    );
  };

  const clearInitial = () => {
    setActiveInitial(null);
    setFilteredList(list);
    setCurrentPage(1);
  };

  /* ===== 체크박스 ===== */
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id]
    );
  };

  /* ===== 삭제 ===== */
  const handleDelete = async () => {
    if (selectedIds.length === 0) return;

    const ok = window.confirm(
      `선택한 ${selectedIds.length}개의 약품을 삭제하시겠습니까?\n(복구 불가)`
    );
    if (!ok) return;

    try {
      await Promise.all(
        selectedIds.map((id) => deleteMedicine(id))
      );
      alert("삭제되었습니다.");
      setSelectedIds([]);
      load();
    } catch (e) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  /* ===== 정렬 ===== */
  const sortedList = [...filteredList].sort((a, b) => {
    switch (sortType) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price":
        return a.price - b.price;
      default:
        return a.medicineId - b.medicineId;
    }
  });

  /* ===== 페이지네이션 ===== */
  const totalPages = Math.ceil(sortedList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = sortedList.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="medicine-page">
      {/* 제목 */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
        <h2 className="page-title">💊 약품 목록</h2>
        <button className="add-medicine-btn" onClick={() => setShowAdd(true)}>
          + 약품 등록
        </button>
      </div>

      <div className="medicine-layout">
        {/* 검색 패널 */}
        <div className="search-panel">
          <h3>조회할 약품이 뭔가요?</h3>

          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              placeholder="약품명을 입력하세요"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchText && (
              <button
                className="clear-btn"
                onClick={() => {
                  setSearchText("");
                  setFilteredList(list);
                  setCurrentPage(1);
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div className="initial-grid">
            {initials.map((ch) => (
              <button
                key={ch}
                className={activeInitial === ch ? "active" : ""}
                onClick={() => handleInitial(ch)}
              >
                {ch}
              </button>
            ))}
            {activeInitial && (
              <button className="initial-clear-btn" onClick={clearInitial}>
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 결과 */}
        <div className="result-area">
          {loading ? (
            <p>불러오는 중...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <p>총 {sortedList.length}건</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
                    <option value="number">ID번호순</option>
                    <option value="name">가나다순</option>
                    <option value="price">가격순</option>
                  </select>
                  <button className="delete-btn" disabled={selectedIds.length === 0} onClick={handleDelete}>
                    🗑 선택 삭제
                  </button>
                </div>
              </div>

              <table className="medicine-table">
                <thead>
                  <tr>
                    <th>선택</th>
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
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(m.medicineId)}
                          onChange={() => toggleSelect(m.medicineId)}
                        />
                      </td>
                      <td>{m.medicineId}</td>
                      <td>{m.name}</td>
                      <td>{m.manufacturer}</td>
                      <td>{Number(m.price).toLocaleString()}원</td>
                      <td>{m.stock}</td>
                      <td>{m.barcode}</td>
                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => {
                            setSelectedId(m.medicineId);
                            setShowEdit(true);
                          }}
                        >
                          수정
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 페이지네이션 */}
<div className="pagination">
  <button
    className="page-nav"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(1)}
  >
    ≪
  </button>

  <button
    className="page-nav"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((p) => p - 1)}
  >
    ＜
  </button>

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

  <button
    className="page-nav"
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage((p) => p + 1)}
  >
    ＞
  </button>

  <button
    className="page-nav"
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(totalPages)}
  >
    ≫
  </button>
</div>
            </>
          )}
        </div>
      </div>

      {showEdit && (
        <MedicineEdit
          medicineId={selectedId}
          onClose={() => setShowEdit(false)}
          onSuccess={() => {
            setShowEdit(false);
            load();
          }}
        />
      )}

      {showAdd && (
        <MedicineAddModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            setShowAdd(false);
            load();
          }}
        />
      )}
    </div>
  );
}
