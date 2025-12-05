import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Header() {
  const navigate = useNavigate();
  const user = useAuth();

  const logout = () => {
    localStorage.removeItem("user");
    alert("로그아웃 완료");
    navigate("/");
  };

  return (
    <header style={{ padding: "10px", background: "#f1f1f1" }}>
      {/* 홈만 표시 */}
      <Link to="/">홈</Link>

      <div style={{ float: "right" }}>
        {user ? (
          <>
            <span>{user.name}님</span>
            <button onClick={logout} style={{ marginLeft: "10px" }}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login">로그인</Link>
            {" | "}
            <Link to="/register">회원가입</Link>
          </>
        )}
      </div>
    </header>
  );
}
