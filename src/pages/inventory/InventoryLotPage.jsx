import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLots, addLot } from "../../api/lotApi"; // ✅ 실제 함수명
import "../../styles/MedicineInventory.css";

export default function InventoryLotPage() {
  const { medicineId } = useParams();
  const navigate = useNavigate();

  const [lots, setLots] = useState([]);
  const [form, setForm] = useState({
    lotNo: "",
    expiryDate: "",
    quantity: "",
  });

  useEffect(() => {
    loadLots();
    // eslint-disable-next-line
  }, []);

  // 🔹 LOT 목록 조회
  const loadLots = async () => {
    try {
      const res = await getLots(medicineId); // ✅ 함수명 수정
      setLots(res.data || []);
    } catch (err) {
      console.error("LOT 조회 실패", err);
      setLots([]);
    }
  };

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 LOT 등록
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await addLot({               // ✅ 함수명 수정
        medicineId: Number(medicineId),
        lotNo: form.lotNo,
        expiryDate: form.expiryDate,
        quantity: Number(form.quantity),
      });

      alert("LOT 등록 완료");
      setForm({ lotNo: "", expiryDate: "", quantity: "" });
      loadLots();
    } catch (err) {
      console.error(err);
      alert("LOT 등록 실패");
    }
  };

  return (
    <div className="inventory-card" style={{ margin: 20 }}>
      <h2>📦 LOT 관리</h2>
      <p>약품 ID: {medicineId}</p>

      {/* 🔹 LOT 목록 */}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>LOT 번호</th>
            <th>유통기한</th>
            <th>수량</th>
            <th>입고일</th>
          </tr>
        </thead>
        <tbody>
          {lots.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                등록된 LOT 정보가 없습니다.
              </td>
            </tr>
          ) : (
            lots.map((lot) => (
              <tr key={lot.lotId}>
                <td>{lot.lotNo}</td>
                <td>{lot.expiryDate}</td>
                <td>{lot.quantity}</td>
                <td>{lot.createdAt || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 🔹 LOT 등록 */}
      <h3 style={{ marginTop: 30 }}>➕ LOT 등록</h3>
      <form onSubmit={onSubmit} style={{ display: "flex", gap: 10 }}>
        <input
          name="lotNo"
          placeholder="LOT 번호"
          value={form.lotNo}
          onChange={onChange}
          required
        />
        <input
          type="date"
          name="expiryDate"
          value={form.expiryDate}
          onChange={onChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="수량"
          value={form.quantity}
          onChange={onChange}
          required
        />
        <button type="submit" className="btn-green">
          등록
        </button>
      </form>

      <button
        onClick={() => navigate(-1)}
        style={{ marginTop: 20 }}
        className="btn-gray"
      >
        ← 뒤로가기
      </button>
    </div>
  );
}
