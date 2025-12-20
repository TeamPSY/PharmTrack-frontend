import React, { useEffect, useState } from "react";
import { getMedicineList } from "../../api/medicineApi";
import MedicineEdit from "./MedicineEditModal";
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
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* 페이지 */
  const [currentPage, setCurrentPage] = useState(1);

  /* 수정 모달 */
  const [showEdit, setShowEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  /* 검색 */
  const [searchText, setSearchText] = useState("");

  /* 초성 */
  const [activeInitial, setActiveInitial] = useState(null);

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

  /* 검색 */
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

  /* 초성 */
  const handleInitial = (ch) => {
    setActiveInitial(ch);
    setSearchText("");
    setCurrentPage(1);

    setFilteredList(
      list.filter((m) =>
        toInitialString(m.name).startsWith(ch)
      )
    );
  };

  const clearInitial = () => {
    setActiveInitial(null);
    setFilteredList(list);
    setCurrentPage(1);
  };

  /* 페이지네이션 */
  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredList.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="medicine-page">

      {/* ✅ 제목 + 약품 등록 버튼 (여기만 추가됨) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h2 className="page-title">💊 약품 목록</h2>

        <button
          onClick={() => (window.location.href = "/medicine/add")}
          style={{
            padding: "8px 14px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + 약품 등록
        </button>
      </div>

      <div className="medicine-layout">
        {/* ===== 왼쪽 검색 패널 ===== */}
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
              <button
                className="initial-clear-btn"
                onClick={clearInitial}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ===== 오른쪽 결과 ===== */}
        <div className="result-area">
          {loading ? (
            <p className="status-text">불러오는 중...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : (
            <>
              <p className="result-count">
                총 {filteredList.length}건
              </p>

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
    </div>
  );
}
