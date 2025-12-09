
import React, { useEffect, useState } from "react";
import { createSale } from "../../api/saleApi";
import { getMedicineList } from "../../api/medicineApi";
import { useNavigate } from "react-router-dom";

export default function SaleCreate() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const userId = 1; // 임시 로그인

  // 📌 약품 목록 로드
  useEffect(() => {
    getMedicineList().then((res) => {
      setMedicines(res.data);
    });
  }, []);

  // 📌 장바구니 추가
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

  // 📌 수량 변경
  const updateQty = (id, qty) => {
    setCart(
      cart.map((item) =>
        item.medicineId === id ? { ...item, quantity: qty } : item
      )
    );
  };

  // 📌 판매 등록 함수
  const submitSale = async () => {
    if (cart.length === 0) {
      alert("상품을 선택하세요.");
      return;
    }

    // 💡 totalPrice는 프론트에서 계산할 필요 없음 (백엔드에서 자동 계산)
    const saleData = {
      userId,
      items: cart.map((c) => ({
        medicineId: c.medicineId,
        quantity: c.quantity,
        unitPrice: c.unitPrice, // 백엔드가 그대로 subtotal 계산에 사용
      })),
    };

    try {
      const res = await createSale(saleData);
      alert("판매 등록 완료!");
      navigate(`/sale/detail/${res.data}`); // saleId로 이동
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
