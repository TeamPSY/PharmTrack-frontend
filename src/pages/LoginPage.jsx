import React, { useState } from "react";
import "../styles/LoginPage.css";
import logo from "../Pharm_logo.png";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(id, password);
  };

  return (
    <div className="login-container">
      

      <div className="login-box">
        <img src={logo} alt="logo" className="login-logo" />
        <h2 className="login-text">Login</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your ID"
            className="login-input"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* ⭐ Find ID 오른쪽 정렬 */}
          <div className="find-id-wrapper">
            <button
              type="button"
              className="find-id-btn"
              onClick={() => navigate("/findid")}
            >
              Forgot id?
            </button>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          {/* ⭐ “Don't have an account?” + signup */}
          <div className="signup-wrapper">
            <span>Don't have an account?</span>
            <button
              type="button"
              className="signup-btn"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
