import React, { useState } from "react";
import "../styles/Signup.css";
import logo from "../Pharm_logo.png";
import { useNavigate } from "react-router-dom";

export default function SignUpPage({ onSignup }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== passwordCheck) {
      alert("비밀번호가 서로 일치하지 않습니다!");
      return;
    }

    onSignup({ name, id, password });
    // 회원가입 완료 후 이동할 페이지
    // navigate("/login");
  };

  return (
    <div className="login-container">
      {/* 왼쪽 슬라이드 메뉴 */}

      {/* 오른쪽 회원가입 박스 */}
      <div className="login-box">
        <img src={logo} alt="logo" className="login-logo" />
        <h2 className="login-text">Sign Up</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          
          {/* 이름 */}
          <input
            type="text"
            placeholder="이름"
            className="login-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* 아이디 */}
          <input
            type="text"
            placeholder="아이디"
            className="login-input"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />

          {/* 비밀번호 */}
          <input
            type="password"
            placeholder="비밀번호"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* 비밀번호 확인 */}
          <input
            type="password"
            placeholder="비밀번호 확인"
            className="login-input"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />

          <button type="submit" className="login-button">
            Sign Up
          </button>
        </form>

        {/* 하단 링크 */}
        <div className="login-links horizontal">
          <button className="text-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
