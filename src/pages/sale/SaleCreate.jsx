import React, { useEffect, useState } from "react";
import { createSale } from "../../api/saleApi";
import { getMedicineList } from "../../api/medicineApi";
import { useNavigate } from "react-router-dom";
import "../../styles/SaleCreate.css";

export default function SaleCreate() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [userId] = useState(1);

  useEffect(() => {
    getMedicineList().then((res) => setMedicines(res.data));
  }, []);

  const addToCart = (m) => {
    if (cart.find((item) => item.medicineId === m.medicineId)) {
      alert("이미 담겨 있습니다.");
      return;
    }

    setCart([
      ...cart,
      {
        medicineId: m.medicineId,
        name: m.name,
        unitPrice: m.price,
        quantity: 1,
      },
    ]);
  };

  const updateQty = (id, qty) => {
    setCart(
      cart.map((item) =>
        item.medicineId === id ? { ...item, quantity: qty } : item
      )
    );
  };

  const submitSale = async () => {
    const totalPrice = cart.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    const saleData = {
      userId,
      totalPrice,
      items: cart.map((c) => ({
        medicineId: c.medicineId,
        quantity: c.quantity,
        unitPrice: c.unitPrice,
      })),
    };

    try {
      const res = await createSale(saleData);
      alert("판매 등록 완료!");
      navigate(`/sale/detail/${res.data}`);
    } catch (e) {
      console.error(e);
      alert("판매 실패!");
    }
  };

  return (
    <div className="sale-create-container">
      <h2 className="sale-title">📦 판매 등록</h2>

      {/* ⭐ 2-Column 전체 박스 */}
      <div className="sale-flex-box">

        {/* 왼쪽 박스 - 약품 목록 */}
        <div className="left-box">
          <h3>약품 목록</h3>
          <ul className="medicine-list">
            {medicines.map((m) => (
              <li key={m.medicineId} className="medicine-item">
                <span>
                  [{m.categoryName}] {m.name} ({m.price}원)
                </span>
                <button className="add-btn" onClick={() => addToCart(m)}>
                  담기
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 오른쪽 박스 - 장바구니 */}
        <div className="right-box">
          <h3>🛒 선택한 상품</h3>

          {cart.length === 0 ? (
            <p className="empty-text">상품을 추가하세요.</p>
          ) : (
            <table className="cart-table">
              <thead>
                <tr>
                  <th>상품명</th>
                  <th>단가</th>
                  <th>수량</th>
                  <th>소계</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.medicineId}>
                    <td>{item.name}</td>
                    <td>{item.unitPrice.toLocaleString()}원</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        className="qty-input"
                        onChange={(e) =>
                          updateQty(item.medicineId, Number(e.target.value))
                        }
                      />
                    </td>
                    <td>{(item.unitPrice * item.quantity).toLocaleString()}원</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <button className="submit-btn" onClick={submitSale}>
            판매 완료
          </button>

          {/* ⭐ 판매 내역 바로가기 버튼 추가 */}
          <button
            className="goto-list-btn"
            onClick={() => navigate("/sale/list")}
          >
            판매 내역 바로가기
          </button>
        </div>
      </div>
    </div>
  );
}
