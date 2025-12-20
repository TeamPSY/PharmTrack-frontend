import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { getDailySales, getMedicineSales } from "../../api/saleApi";

const COLORS = ["#4CAF50", "#FFC107", "#FF5722", "#2196F3"];

export default function SaleStatistic() {
  const [dailySales, setDailySales] = useState([]);
  const [medicineSales, setMedicineSales] = useState([]);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    const endDate = new Date().toISOString().slice(0, 10);
    const startDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    try {
      const dailyRes = await getDailySales(startDate, endDate);
      const medicineRes = await getMedicineSales(startDate, endDate);

      setDailySales(dailyRes.data);
      setMedicineSales(medicineRes.data);
    } catch (err) {
      console.error("통계 로드 실패", err);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>📊 판매 통계</h2>

      {/* 📈 일별 매출 */}
      <div style={{ width: "100%", height: 300 }}>
        <h3>일별 매출</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailySales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line dataKey="totalAmount" stroke="#4CAF50" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🥧 약품별 판매 비중 */}
      <div style={{ width: "100%", height: 300, marginTop: 50 }}>
        <h3>약품별 판매 비중</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={medicineSales}
              dataKey="quantity"
              nameKey="medicineName"
              outerRadius={100}
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
