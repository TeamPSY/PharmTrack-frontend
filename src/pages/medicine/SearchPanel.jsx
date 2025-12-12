import React, { useState } from "react";
import "../../styles/SearchPanel.css";

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

export default function SearchPanel({ list, setFilteredList }) {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim() === "") {
      setFilteredList([]);
      return;
    }

    setFilteredList(
      list.filter((m) => m.name.includes(text))
    );
  };

  const handleInitial = (ch) => {
    setFilteredList(
      list.filter((m) =>
        toInitialString(m.name).startsWith(ch)
      )
    );
    setSearchText("");
  };

  const clearAll = () => {
    setSearchText("");
    setFilteredList([]);
  };

  return (
    <div className="search-panel">
      <h3>조회할 약품이 뭔가요?</h3>

      <div className="search-input-wrapper">
        <input
          placeholder="약품명을 입력하세요"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchText && (
          <button className="clear-btn" onClick={clearAll}>
            ✕
          </button>
        )}
      </div>

      <div className="initial-grid">
        {initials.map((ch) => (
          <button key={ch} onClick={() => handleInitial(ch)}>
            {ch}
          </button>
        ))}
      </div>
    </div>
  );
}
