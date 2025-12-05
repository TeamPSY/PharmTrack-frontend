import React, { useState } from "react";
import "../styles/HomePage.css";
import logo from "../Pharm_logo.png";
import MedicineList from "../pages/medicine/MedicineList";


export default function HomePage() {
  const username = "000";
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="home-container">

      {/* 상단 헤더 */}
      <header className="top-header">
        <img src={logo} alt="logo" className="header-logo" />

        {/* 🔥 가로 탭 메뉴 */}
        <nav className="tab-menu">
          <button
            className={`tab-btn ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            홈
          </button>

          <button
            className={`tab-btn ${activeTab === "list" ? "active" : ""}`}
            onClick={() => setActiveTab("list")}
          >
            약품 내역
          </button>

          <button
            className={`tab-btn ${activeTab === "stock" ? "active" : ""}`}
            onClick={() => setActiveTab("stock")}
          >
            재고 확인
          </button>

          <button
            className={`tab-btn ${activeTab === "sale" ? "active" : ""}`}
            onClick={() => setActiveTab("sale")}
          >
            판매 내역
          </button>

          <button
            className={`tab-btn ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            매출 통계
          </button>
        </nav>

        {/* 오른쪽 기능들 */}
        <div className="header-right">
        
          <p className="welcome-text">
            안녕하세요, <b>{username}</b> 님!
          </p>
        </div>
      </header>

      {/* 메인 내용 */}
      <div className="dashboard">
        {activeTab === "home" && (
          <>
            <h1>HOME 화면입니다</h1>
            <p>약품, 재고, 판매, 매출 기능을 위 탭에서 선택하세요.</p>
          </>
        )}

        {activeTab === "list" && <MedicineList />}
        {activeTab === "stock" && <h1>재고 확인 화면입니다</h1>}
        {activeTab === "sale" && <h1>판매 내역 화면입니다</h1>}
        {activeTab === "stats" && <h1>매출 통계 화면입니다</h1>}
      </div>
    </div>
  );
}
