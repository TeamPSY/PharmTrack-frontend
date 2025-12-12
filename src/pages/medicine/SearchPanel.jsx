import React, { useState, useEffect } from "react";
import "./MedicineList.css";

const initials = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

// 초성 리스트
const CHO = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ",
  "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ",
  "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"
];

// 한글 초성 추출
function getInitialSound(char) {
  const code = char.charCodeAt(0) - 44032;
  if (code < 0 || code > 11171) return char;
  return CHO[Math.floor(code / 588)];
}

// 문자열 전체 초성 변환
function toInitialString(str) {
  return str.split("").map(getInitialSound).join("");
}

export default function SearchPanel({ list, setFilteredList }) {
  const [searchText, setSearchText] = useState("");

  // 🔍 검색창 자동 필터링
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredList(null);
      return;
    }

    const lower = searchText.toLowerCase();

    const filtered = list.filter((m) => {
      const nameLower = m.name.toLowerCase();

      // 1) 일반 문자열 포함 검색
      const matchNormal = nameLower.includes(lower);

      // 2) 초성 검색: "감기약" -> "ㄱㅁㄱㅇ"
      const nameInitial = toInitialString(m.name);
      const matchInitial = nameInitial.startsWith(searchText);

      return matchNormal || matchInitial;
    });

    setFilteredList(filtered);
  }, [searchText, list, setFilteredList]);

  // 🔤 초성 버튼 클릭 검색
  const handleInitialClick = (initial) => {
    const result = list.filter((m) => {
      const initials = toInitialString(m.name);
      return initials.startsWith(initial);
    });

    setFilteredList(result);
    setSearchText(""); // 검색창 초기화
  };

  return (
    <div className="search-panel">
      <h3>조회할 약품이 뭔가요?</h3>

      {/* 🔍 검색창 */}
      <input
        type="text"
        className="search-input"
        placeholder="약품명을 입력하세요"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {/* 🔤 자음 버튼 */}
      <div className="initial-grid">
        {initials.map((ch) => (
          <button key={ch} onClick={() => handleInitialClick(ch)}>
            {ch}
          </button>
        ))}
      </div>

      {/* 정렬 버튼 */}
      <div className="sort-box">
        <button
          onClick={() =>
            setFilteredList([...list].sort((a, b) => a.name.localeCompare(b.name)))
          }
        >
          이름순
        </button>

        <button
          onClick={() =>
            setFilteredList(
              [...list].sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
              )
            )
          }
        >
          날짜순
        </button>
      </div>
    </div>
  );
}
