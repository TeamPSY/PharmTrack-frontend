import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import "../../styles/UserRegister.css";

export default function UserRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    phone: "",
    pharmacyName: "", // ⭐ 추가됨
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log("보내는 데이터:", form);

    try {
      await registerUser(form);
      alert("회원가입 완료!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-text">회원가입</h2>

        <form className="register-form" onSubmit={onSubmit}>
          <input
            type="email"
            name="username"
            className="register-input"
            placeholder="아이디(이메일)"
            value={form.username}
            onChange={onChange}
            required
          />

          <input
            type="password"
            name="password"
            className="register-input"
            placeholder="비밀번호"
            value={form.password}
            onChange={onChange}
            required
          />

          <input
            type="text"
            name="name"
            className="register-input"
            placeholder="이름"
            value={form.name}
            onChange={onChange}
            required
          />

          {/* ⭐ 전화번호 입력 */}
          <input
            type="text"
            name="phone"
            className="register-input"
            placeholder="전화번호 (예: 010-1234-5678)"
            value={form.phone}
            onChange={onChange}
            required
          />

          {/* ⭐ 약국명 입력 */}
          <input
            type="text"
            name="pharmacyName"
            className="register-input"
            placeholder="약국명"
            value={form.pharmacyName}
            onChange={onChange}
            required
          />

          <button type="submit" className="register-button">
            회원가입
          </button>

          <div className="register-footer">
            이미 계정이 있으신가요?
            <button
              type="button"
              className="register-footer-btn"
              onClick={() => navigate("/login")}
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
