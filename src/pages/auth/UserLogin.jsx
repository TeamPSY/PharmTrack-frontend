import React, { useState } from "react";
import { loginUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import "../../styles/UserLogin.css";

export default function UserLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      const user = res?.data?.user ?? res?.data ?? null;

      if (!user) {
        alert("로그인 실패!");
        return;
      }

      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("userId", user.userId ?? user.id ?? "");

      alert("로그인 성공!");
      navigate("/");
    } catch (err) {
      alert("로그인 실패");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-text">Login</h2>

        <form className="login-form" onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="아이디"
            className="login-input"
            value={form.username}
            onChange={onChange}
          />

          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            className="login-input"
            value={form.password}
            onChange={onChange}
          />

          <button type="submit" className="login-button">
            로그인
          </button>

          <div className="signup-wrapper">
            <span>Don't have an account?</span>
            <button
              type="button"
              className="signup-btn"
              onClick={() => navigate("/register")}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
