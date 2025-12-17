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

  /** 🔧 한국시간 날짜 문자열 변환 함수 */
  const formatDate = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const local = new Date(date.getTime() - offset);
    return local.toISOString().slice(0, 10);
  };

  /** 📌 최초 로드시 오늘 날짜 판매량 자동 표시 */
  useEffect(() => {
    getSaleList()
      .then((res) => {
        let data = res.data;
        if (Array.isArray(data)) {
          setSales(data);

          const today = new Date();
          setSelectedDate(today);

          const todayStr = formatDate(today);

          const todaySales = data.filter(
            (s) => s.saleTime.slice(0, 10) === todayStr
          );

          setFiltered(todaySales);

          // 🔥 제목 변경
          setTitle(`${todayStr} 판매량`);
        }
      })
      .catch(() => alert("판매 내역 불러오기 실패"));
  }, []);

  /** 🔍 기간 필터 */
  const filterByDate = () => {
    if (!startDate || !endDate) {
      alert("기간을 모두 선택해주세요.");
      return;
    }

    // endDate 를 하루 끝 23:59:59 로 조정
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    const result = sales.filter((item) => {
      const saleTime = new Date(item.saleTime);
      return saleTime >= startDate && saleTime <= endOfDay;
    });

    setFiltered(result);
    setSelectedDate(null);

    // 🔥 제목을 "기간 판매량"으로 변경
    setTitle("기간 판매량");
  };

  /** 📅 달력 날짜 클릭 시 해당 날짜 매출 표시 */
  const handleCalendarClick = (date) => {
    setSelectedDate(date);

    const dateStr = formatDate(date);

    const daily = sales.filter(
      (item) => item.saleTime.slice(0, 10) === dateStr
    );

    setFiltered(daily);

    // 🔥 제목 변경
    setTitle(`${dateStr} 판매량`);
  };

  /** 💰 총 수입 계산 */
  const totalIncome = filtered.reduce((acc, cur) => acc + cur.totalPrice, 0);

  return (
    <div className="sale-container">
      <div className="sale-header">
        <h2>판매 내역 조회</h2>
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>
      </div>

      <div className="sale-content">
        {/* 왼쪽: 제목 + 특정 날짜/기간 판매량 */}
        <div className="sale-today-box">
          <h3>{title}</h3>

          <ul>
            {filtered.length > 0 ? (
              filtered.map((sale) => (
                <li key={sale.saleId}>
                  {sale.saleTime.slice(0, 10)} :{" "}
                  {sale.totalPrice.toLocaleString()}원
                </li>
              ))
            ) : (
              <li>판매 기록이 없습니다.</li>
            )}
          </ul>
        </div>

        {/* 오른쪽: 기간 선택 + 달력 */}
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

      <div className="total-income-box">
        총 수입 : {totalIncome.toLocaleString()}원
      </div>
    </div>
  );
}
