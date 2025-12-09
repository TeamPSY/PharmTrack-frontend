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
    <header style={{ 
      padding: "10px", 
      background: "#f1f1f1",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      
      {/* 🏠 홈 아이콘 → 클릭 시 "/" 이동 */}
      <Link to="/">
        <img 
          src="/home.png"   // ⭐ public/home.png 사용법
          alt="home"
          style={{ width: "40px", cursor: "pointer" }}
        />
      </Link>

      <div>
        {user ? (
          <>
            <span>{user.name}님</span>
            <button 
              onClick={logout} 
              style={{ marginLeft: "10px", cursor: "pointer" }}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login">login</Link>
            {" | "}
            <Link to="/register">signup</Link>
          </>
        )}
      </div>
    </header>
  );
}
