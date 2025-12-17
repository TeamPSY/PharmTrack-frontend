import React, { useEffect, useState } from "react";
import { getMedicineById, updateMedicine } from "../../api/medicineApi";
import { getCategoryList } from "../../api/categoryApi";
import "../../styles/MedicineEditModal.css";

export default function MedicineEditModal({ medicineId, onClose, onSuccess }) {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    manufacturer: "",
    price: "",
    stock: "",
    barcode: "",
    expirationDate: "",
    categoryId: "",
  });

  /* 카테고리 */
  useEffect(() => {
    getCategoryList().then((res) => setCategories(res.data));
  }, []);

  /* 약품 정보 */
  useEffect(() => {
    if (!medicineId) return;

    getMedicineById(medicineId).then((res) => {
      const data = res.data.data || res.data;
      setForm({
        ...data,
        expirationDate: (data.expirationDate || "").substring(0, 10),
      });
    });
  }, [medicineId]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMedicine(medicineId, {
        ...form,
        categoryId: Number(form.categoryId),
      });
      alert("약품 수정 완료!");
      onSuccess?.();   // 목록 새로고침
      onClose();       // 모달 닫기
    } catch {
      alert("수정 실패!");
    }
  };

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
        <h2>약품 수정</h2>

        <form onSubmit={onSubmit}>
          <div className="form-row">
            <label>카테고리</label>
            <select name="categoryId" value={form.categoryId || ""} onChange={onChange} required>
              <option value="">선택</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label>이름</label>
            <input name="name" value={form.name || ""} onChange={onChange} />
          </div>

          <div className="form-row">
            <label>제조사</label>
            <input name="manufacturer" value={form.manufacturer || ""} onChange={onChange} />
          </div>

          <div className="form-row">
            <label>가격</label>
            <input type="number" name="price" value={form.price || ""} onChange={onChange} />
          </div>

          <div className="form-row">
            <label>재고</label>
            <input type="number" name="stock" value={form.stock || ""} onChange={onChange} />
          </div>

          <div className="form-row">
            <label>바코드</label>
            <input name="barcode" value={form.barcode || ""} onChange={onChange} />
          </div>

          <div className="form-row">
            <label>유통기한</label>
            <input type="date" name="expirationDate" value={form.expirationDate || ""} onChange={onChange} />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn-save">
              수정하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
