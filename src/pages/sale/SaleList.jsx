import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getSaleList } from "../../api/saleApi";
import { useNavigate } from "react-router-dom";
import "../../styles/SaleList.css";

export default function SaleList() {
  const [sales, setSales] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [title, setTitle] = useState("");

  const navigate = useNavigate();

  /* 한국시간 날짜 포맷 */
  const formatDate = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const local = new Date(date.getTime() - offset);
    return local.toISOString().slice(0, 10);
  };

  /* 최초 로드: 오늘 판매 내역 */
  useEffect(() => {
    getSaleList()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setSales(data);

        const today = new Date();
        setSelectedDate(today);

        const todayStr = formatDate(today);
        const todaySales = data.filter(
          (s) => s.saleTime.slice(0, 10) === todayStr
        );

        setFiltered(todaySales);
        setTitle(`${todayStr} 판매량`);
      })
      .catch(() => alert("판매 내역 불러오기 실패"));
  }, []);

  /* 기간 조회 */
  const filterByDate = () => {
    if (!startDate || !endDate) {
      alert("기간을 모두 선택해주세요.");
      return;
    }

    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    const result = sales.filter((item) => {
      const saleTime = new Date(item.saleTime);
      return saleTime >= startDate && saleTime <= endOfDay;
    });

    setFiltered(result);
    setSelectedDate(null);
    setTitle("기간 판매량");
  };

  /* 달력 클릭 */
  const handleCalendarClick = (date) => {
    setSelectedDate(date);

    const dateStr = formatDate(date);
    const daily = sales.filter(
      (item) => item.saleTime.slice(0, 10) === dateStr
    );

    setFiltered(daily);
    setTitle(`${dateStr} 판매량`);
  };

  /* 총 수입 */
  const totalIncome = filtered.reduce(
    (acc, cur) => acc + cur.totalPrice,
    0
  );

  return (
    <div className="sale-container">
      {/* ===== 헤더 ===== */}
      <div className="sale-header">
        <h2 className="sale-title">판매 내역 조회</h2>

        <button className="back-btn" onClick={() => navigate(-1)}>
          back
        </button>
      </div>

      {/* ===== 본문 ===== */}
      <div className="sale-content">
        {/* 왼쪽 */}
        <div className="sale-today-box">
          <h3>{title}</h3>

          <ul>
            {filtered.length > 0 ? (
              filtered.map((sale) => (
                <li key={sale.saleId}>
                  <span>{sale.saleTime.slice(0, 10)}</span>
                  <span>{sale.totalPrice.toLocaleString()}원</span>
                </li>
              ))
            ) : (
              <li>판매 기록이 없습니다.</li>
            )}
          </ul>
        </div>

        {/* 오른쪽 */}
        <div className="sale-period-section">
          <div className="date-filter">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="기간 선택"
              className="date-input"
            />

            <span className="wave"> ~ </span>

            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="기간 선택"
              className="date-input"
            />

            <button className="filter-btn" onClick={filterByDate}>
              조회
            </button>
          </div>

          <div className="calendar-real">
            <DatePicker
              inline
              selected={selectedDate}
              onChange={handleCalendarClick}
            />
          </div>
        </div>
      </div>

      {/* ===== KPI ===== */}
      <div className="total-income-box">
        총 수입 : {totalIncome.toLocaleString()}원
      </div>
    </div>
  );
}
