import React, { useEffect, useState } from "react";
import "../../styles/SaleCreate.css";
import { getMedicineList } from "../../api/medicineApi";
import { createSale } from "../../api/saleApi";
import { useNavigate } from "react-router-dom";

export default function SaleCreate() {
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);

  /* 페이지네이션 */
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  /* 약품 목록 불러오기 */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMedicineList();
        setMedicines(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("약품 목록 불러오기 실패:", e);
        setMedicines([]);
      }
    };
    load();
  }, []);

  /* medicines 변경 시 페이지 초기화 */
  useEffect(() => {
    setCurrentPage(1);
  }, [medicines.length]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMedicines = medicines.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(medicines.length / itemsPerPage);

  /* 장바구니 추가 (재고 초과 방지) */
  const addToCart = (medicine) => {
    if (medicine.stock <= 0) return;

    const exists = cart.find(
      (item) => item.medicineId === medicine.medicineId
    );

    if (exists) {
      if (exists.qty >= medicine.stock) {
        alert("재고 수량을 초과할 수 없습니다.");
        return;
      }

      setCart((prev) =>
        prev.map((item) =>
          item.medicineId === medicine.medicineId
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart((prev) => [...prev, { ...medicine, qty: 1 }]);
    }
  };

  /* 총 금액 */
  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );

  /* ✅ 판매 등록 */
  const submitSale = async () => {
    if (cart.length === 0) {
      alert("선택된 상품이 없습니다.");
      return;
    }

    // ✅ userId 제거 (컨트롤러에서 로그인 사용자 주입)
    const payload = {
      items: cart.map((item) => ({
        medicineId: item.medicineId,
        quantity: item.qty,
        unitPrice: item.price,
      })),
    };

    try {
      const res = await createSale(payload);
      navigate(`/sale/detail/${res.data}`);
    } catch (e) {
      console.error("❌ 판매 등록 실패:", e.response?.data || e);
      alert("판매 등록 실패");
    }
  };

  return (
    <div className="sale-create-container">
      <h2 className="sale-title">🛒 판매 등록</h2>

      <div className="sale-flex-box">
        {/* 왼쪽: 약품 목록 */}
        <div className="left-box">
          <h3 className="section-title">약품 목록</h3>

          {medicines.length === 0 ? (
            <p className="empty-text">약품 데이터가 없습니다.</p>
          ) : (
            <>
              <table className="medicine-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>약품명</th>
                    <th>제조사</th>
                    <th>가격</th>
                    <th>재고</th>
                    <th>추가</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMedicines.map((m, idx) => (
                    <tr key={m.medicineId}>
                      <td>{startIndex + idx + 1}</td>
                      <td className="medicine-name">{m.name}</td>
                      <td>{m.manufacturer}</td>
                      <td>{Number(m.price).toLocaleString()}원</td>
                      <td>{m.stock}</td>
                      <td>
                        <button
                          className="add-btn"
                          disabled={m.stock <= 0}
                          onClick={() => addToCart(m)}
                        >
                          추가
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 페이지네이션 */}
              <div className="pagination">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={`page-btn ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 오른쪽: 선택 상품 */}
        <div className="right-box">
          <h3 className="section-title">선택 상품</h3>

          {cart.length === 0 ? (
            <p className="empty-text">선택된 상품이 없습니다.</p>
          ) : (
            <table className="cart-table">
              <thead>
                <tr>
                  <th>약품명</th>
                  <th>수량</th>
                  <th>금액</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.medicineId}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>
                      {(Number(item.price) * item.qty).toLocaleString()}원
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="summary-box">
            <div className="summary-row">
              <span>총 금액</span>
              <strong>{totalPrice.toLocaleString()}원</strong>
            </div>

            <button className="submit-btn" onClick={submitSale}>
              판매 등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
