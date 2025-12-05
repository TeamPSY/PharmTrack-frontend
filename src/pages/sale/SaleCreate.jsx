import React, { useEffect, useState } from "react";
import { createSale } from "../../api/saleApi";
import { getMedicineList } from "../../api/medicineApi";
import { useNavigate } from "react-router-dom";

export default function SaleCreate() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [userId] = useState(1); // 로그인 시스템 없으므로 임시 값

  // 약품 목록 로드
  useEffect(() => {
    getMedicineList().then((res) => {
      setMedicines(res.data);
    });
  }, []);

  // 장바구니에 담기
  const addToCart = (m) => {
    const exist = cart.find((item) => item.medicineId === m.medicineId);
    if (exist) {
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

  // 수량 변경
  const updateQty = (id, qty) => {
    setCart(
      cart.map((item) =>
        item.medicineId === id ? { ...item, quantity: qty } : item
      )
    );
  };

  // 판매 등록
  const submitSale = async () => {
    // 🔥 총 금액 계산
    const totalPrice = cart.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    // 🔥 백엔드로 보낼 데이터
    const saleData = {
      userId,
      totalPrice, // ← 필수!
      items: cart.map((c) => ({
        medicineId: c.medicineId,
        quantity: c.quantity,
        unitPrice: c.unitPrice,
      })),
    };

    try {
      const res = await createSale(saleData);
      alert("판매 등록 완료!");
      navigate(`/sale/detail/${res.data}`); // 판매 상세 페이지로 이동
    } catch (e) {
      console.error(e);
      alert("판매 실패!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>판매 등록</h2>

      <h3>약품 목록</h3>
      <ul>
        {medicines.map((m) => (
          <li key={m.medicineId}>
            [{m.categoryName}] {m.name} ({m.price}원)
            <button onClick={() => addToCart(m)}>담기</button>
          </li>

        ))}
      </ul>

      <hr />

      <h3>선택한 상품</h3>
      {cart.length === 0 ? (
        <p>상품을 추가하세요</p>
      ) : (
        <table border="1" cellPadding="10">
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
                <td>{item.unitPrice}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQty(item.medicineId, Number(e.target.value))
                    }
                  />
                </td>
                <td>{item.unitPrice * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={submitSale} style={{ marginTop: "20px" }}>
        판매 완료
      </button>
    </div>
  );
}
