import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { getSaleStatistics } from "../../api/saleApi";

const COLORS = ["#4CAF50", "#FFC107", "#FF5722", "#2196F3"];

export default function SaleStatistic() {
  const [dailySales, setDailySales] = useState([]);
  const [medicineSales, setMedicineSales] = useState([]);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const res = await getSaleStatistics();
      setDailySales(res.data.dailySales || []);
      setMedicineSales(res.data.medicineSales || []);
    } catch (err) {
      console.error("통계 로드 실패", err);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2 style={{ marginBottom: 30 }}>📊 판매 통계</h2>

      {/* 📈 일별 매출 */}
      <div style={{ width: "100%", height: 300, marginBottom: 50 }}>
        <h3>일별 매출</h3>
        <ResponsiveContainer>
          <LineChart data={dailySales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="totalAmount" stroke="#4CAF50" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🥧 약품별 판매 비중 */}
      <div style={{ width: "100%", height: 300 }}>
        <h3>약품별 판매 비중</h3>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={medicineSales}
              dataKey="quantity"
              nameKey="medicineName"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {medicineSales.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
