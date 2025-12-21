import React, { useState } from "react";
import { addMedicine } from "../../api/medicineApi";
import "../../styles/MedicineAddModal.css";

export default function MedicineAddModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    category: "",
    name: "",
    manufacturer: "",
    price: "",
    stock: "",
    barcode: "",
    expirationDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await addMedicine({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });

      alert("약품이 등록되었습니다.");
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("약품 등록에 실패했습니다.");
    }
  };

  return (
    <div className="add-modal-overlay">
      <div className="add-modal">
        <h2>💊 약품 등록</h2>

        <div className="form-row">
          <label>카테고리</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="">선택</option>
            <option value="일반의약품">일반의약품</option>
            <option value="전문의약품">전문의약품</option>
            <option value="의약외품">의약외품</option>
          </select>
        </div>

        <div className="form-row">
          <label>약품명</label>
          <input
            name="name"
            value={form.name}
            placeholder="예: 타이레놀"
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>제조사</label>
          <input
            name="manufacturer"
             placeholder="예: 존슨앤드존슨"
            value={form.manufacturer}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>가격</label>
          <input
            type="number"
            name="price"
            placeholder="예: 50"
            value={form.price}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>재고</label>
          <input
            type="number"
            name="stock"
            placeholder="예: 50"
            value={form.stock}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>바코드</label>
          <input
            name="barcode"
            placeholder="예: 8801234567890"
            value={form.barcode}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>유통기한</label>
          <input
            type="date"
            name="expirationDate"
            value={form.expirationDate}
            onChange={handleChange}
          />
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            취소
          </button>
          <button className="btn-save" onClick={handleSubmit}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
