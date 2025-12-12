import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";   // ← 새로 추가!

export default function Home() {
  const navigate = useNavigate();

  // 로그인 정보 불러오기
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user ? user.name : null;

  return (
    <div className="home-container">

      {/* 좌측 상단 환영 문구 박스 */}
      <div className="welcome-box">
        {userName ? (
          <>환영합니다 {userName}님❗</>
        ) : (
          <>로그인을 해주세요.</>
        )}
      </div>

      {/* 중앙 버튼 목록 */}
      <div className="button-wrapper">
        <button
          onClick={() => navigate("/inventory")}
          className="home-btn"
        >
          📦 재고관리
        </button>

        <button
          onClick={() => navigate("/medicine/list")}
          className="home-btn"
        >
          💊 약품관리
        </button>

        <button
          onClick={() => navigate("/sale")}
          className="home-btn"
        >
          📊 판매관리(통계)
        </button>
        
      </div>
    </div>
  );
}
