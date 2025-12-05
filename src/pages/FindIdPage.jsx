import React, { useState } from "react";
import "../styles/Signup.css";     // 같은 스타일 사용
import logo from "../Pharm_logo.png";
import { useNavigate } from "react-router-dom";

export default function FindIdPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [foundId, setFoundId] = useState(null);

  const handleFindId = (e) => {
    e.preventDefault();

    // localStorage에 저장된 userData 불러오기
    const storedUser = JSON.parse(localStorage.getItem("userData"));

    // 이름(username)으로 아이디 찾기
    if (storedUser && storedUser.name === username) {
      setFoundId(storedUser.id);
    } else {
      alert("해당 이름으로 등록된 계정이 없습니다.");
    }
  };

  return (
    <div className="login-container">

      {/* 오른쪽 박스 */}
      <div className="login-box">
        <img src={logo} alt="logo" className="login-logo" />

        <h2 className="login-text">Find ID</h2>

        {!foundId ? (
          <form className="login-form" onSubmit={handleFindId}>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <button type="submit" className="login-button">
              아이디 찾기
            </button>
          </form>
        ) : (
          <div className="result-box">
            <p>
              ✅ <b>{username}</b> 님의 아이디는  
              <b> {foundId} </b> 입니다.
            </p>
          </div>
        )}

        {/* 하단 버튼들 */}
        <div className="login-links horizontal">
          <button className="text-btn" onClick={() => navigate("/login")}>
            Login으로 이동
          </button>

        </div>
      </div>
    </div>
  );
}
