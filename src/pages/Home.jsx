import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // 로그인 정보 불러오기
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user ? user.name : null;

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        border: "2px solid #000",
        boxSizing: "border-box",
        padding: "30px",
        position: "relative",
      }}
    >
      {/* 좌측 상단 환영 문구 박스 */}
      <div
        style={{
          border: "2px solid #555",
          padding: "20px",
          width: "250px",
          fontSize: "20px",
          marginBottom: "40px",
        }}
      >
        {userName ? (
          <>환영합니다 {userName}님❗</>
        ) : (
          <>로그인을 해주세요.</>
        )}
      </div>

      {/* 중앙 버튼 목록 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          width: "300px",
        }}
      >
        <button
          onClick={() => navigate("/inventory")}
          style={buttonStyle}
        >
          재고관리
        </button>

        <button
          onClick={() => navigate("/medicine")}
          style={buttonStyle}
        >
          약품관리
        </button>

        <button
          onClick={() => navigate("/sale")}
          style={buttonStyle}
        >
          판매관리
        </button>
      </div>
    </div>
  );
}

// 버튼 공통 스타일
const buttonStyle = {
  padding: "25px",
  fontSize: "22px",
  border: "2px solid #444",
  background: "white",
  cursor: "pointer",
};
