import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../styles/Header.css";

export default function Header() {
  const navigate = useNavigate();
  const user = useAuth();

  const logout = () => {
    localStorage.removeItem("user");
    alert("로그아웃 완료");
    navigate("/");
  };

  return (
    <header className="header">
      {/* 왼쪽: 로고 + 홈 */}
      <div className="header-left">
        <Link to="/" className="logo">
          🏥 PharmTrack
        </Link>
      </div>

      {/* 오른쪽: 유저 영역 */}
      <div className="header-right">
        {user ? (
          <>
            <span className="user-name">{user.name}님</span>

            <button
              className="header-btn"
              onClick={() => navigate("/user/update")}
            >
              회원정보
            </button>

            <button className="header-btn logout" onClick={logout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="header-link">Login</Link>
            <Link to="/register" className="header-link">Sign up</Link>
          </>
        )}
      </div>
    </header>
  );
}
