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
    pharmacyName: "",
  });

  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // 입력 시 에러 제거
  };

  const validate = () => {
    const newErrors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.username)) {
      newErrors.username = "올바른 이메일 형식을 입력하세요.";
    }

    if (form.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다.";
    }

    if (form.name.trim().length < 2) {
      newErrors.name = "이름을 정확히 입력해주세요.";
    }

    if (!/^010-\d{4}-\d{4}$/.test(form.phone)) {
      newErrors.phone = "전화번호 형식은 010-1234-5678 입니다.";
    }

    if (!form.pharmacyName.trim()) {
      newErrors.pharmacyName = "약국명을 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

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
          <div className="field">
            <label>아이디 (이메일)</label>
            <input
              type="email"
              name="username"
              className="register-input"
              placeholder="example@email.com"
              value={form.username}
              onChange={onChange}
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>

          <div className="field">
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              className="register-input"
              placeholder="8자 이상 입력"
              value={form.password}
              onChange={onChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="field">
            <label>이름</label>
            <input
              type="text"
              name="name"
              className="register-input"
              placeholder="이름"
              value={form.name}
              onChange={onChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="field">
            <label>전화번호</label>
            <input
              type="text"
              name="phone"
              className="register-input"
              placeholder="010-1234-5678"
              value={form.phone}
              onChange={onChange}
            />
            {errors.phone && <p className="error">{errors.phone}</p>}
          </div>

          <div className="field">
            <label>약국명</label>
            <input
              type="text"
              name="pharmacyName"
              className="register-input"
              placeholder="약국명을 입력하세요"
              value={form.pharmacyName}
              onChange={onChange}
            />
            {errors.pharmacyName && (
              <p className="error">{errors.pharmacyName}</p>
            )}
          </div>

          <button type="submit" className="register-button">
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
