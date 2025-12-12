import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user ? user.name : null;

  return (
    <div className="home-container">
      {/* 환영 카드 */}
      <div className="welcome-box">
        {userName ? (
          <h2>👋 {userName}님, 환영합니다</h2>
        ) : (
          <h2>로그인 후 이용해주세요</h2>
        )}
        <p>약국 운영을 쉽고 효율적으로 관리하세요</p>
      </div>

      {/* 메뉴 카드 */}
      <div className="button-wrapper">
        <div className="home-card" onClick={() => navigate("/inventory")}>
          📦
          <span>재고 관리</span>
        </div>

        <div className="home-card" onClick={() => navigate("/medicine/list")}>
          💊
          <span>약품 관리</span>
        </div>

        <div className="home-card" onClick={() => navigate("/sale")}>
          📊
          <span>판매 관리</span>
        </div>
      </div>
    </div>
  );
}
