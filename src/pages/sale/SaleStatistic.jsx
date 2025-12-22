import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getDailySales, getMedicineSales } from "../../api/saleApi";
import "../../styles/SaleList.css";
import { useNavigate } from "react-router-dom";

const COLORS = ["#4CAF50", "#FFC107", "#FF5722", "#2196F3", "#9C27B0"];

export default function SaleStatistic() {
  const navigate = useNavigate();

  const [dailySales, setDailySales] = useState([]);
  const [medicineSales, setMedicineSales] = useState([]);

  /* ⭐ 날짜 상태 (직접 선택) */
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10)
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  /* 통계 로드 */
  useEffect(() => {
    loadStatistics();
  }, [startDate, endDate]);

  const loadStatistics = async () => {
    try {
      const dailyRes = await getDailySales(startDate, endDate);
      const medicineRes = await getMedicineSales(startDate, endDate);

      setDailySales(dailyRes.data || []);
      setMedicineSales(medicineRes.data || []);
    } catch (err) {
      console.error("통계 로드 실패", err);
    }
  };

  return (
    <div className="statistics-container">
      {/* ===== 헤더 ===== */}
      <div className="sale-header">
        <h2>📊 판매 통계</h2>
        <button className="back-btn" onClick={() => navigate(-1)}>
          back
        </button>
      </div>

      {/* ===== 날짜 선택 ===== */}
      <div className="filter-row">
        <label>
          시작일
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>

        <span style={{ margin: "0 10px" }}>~</span>

        <label>
          종료일
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>

      {/* ===== 일별 매출 ===== */}
      <div className="chart-box">
        <h3>일별 매출</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailySales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="totalAmount"
              stroke="#4CAF50"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ===== 약품별 판매 비중 ===== */}
      <div className="chart-box">
        <h3>약품별 판매 비중</h3>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={medicineSales}
              dataKey="quantity"
              nameKey="medicineName"
              outerRadius={120}
              label
            >
              {medicineSales.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
