import React, { useState, useEffect } from "react";
import { addMedicine } from "../../api/medicineApi";
import { getCategoryList } from "../../api/categoryApi";
import { useNavigate } from "react-router-dom";

export default function MedicineForm() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    manufacturer: "",
    price: "",
    stock: "",
    barcode: "",
    expirationDate: "",
  });

  // ✔ 카테고리 목록 불러오기
  useEffect(() => {
    getCategoryList().then((res) => {
      setCategories(res.data);
    });
  }, []);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await addMedicine({
        ...form,
        categoryId: Number(form.categoryId),
        price: Number(form.price),
        stock: Number(form.stock),
        status: "NORMAL",
      });

      alert("약품 등록 성공!");
      navigate("/medicine/list"); // ✅ 여기만 수정
    } catch (err) {
      console.error(err);
      alert("등록 실패");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>약품 등록</h2>

      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", width: "300px" }}
      >
        <label>카테고리</label>
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={onChange}
          required
        >
          <option value="">카테고리 선택</option>
          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.categoryName}
            </option>
          ))}
        </select>

        <label>약품명</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={onChange}
          required
        />

        <label>제조사</label>
        <input
          type="text"
          name="manufacturer"
          value={form.manufacturer}
          onChange={onChange}
        />

        <label>가격</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={onChange}
          required
        />

        <label>재고</label>
        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={onChange}
          required
        />

        <label>바코드</label>
        <input
          type="text"
          name="barcode"
          value={form.barcode}
          onChange={onChange}
        />

        <label>유통기한</label>
        <input
          type="date"
          name="expirationDate"
          value={form.expirationDate}
          onChange={onChange}
        />

        <button type="submit" style={{ marginTop: "20px" }}>
          등록
        </button>
      </form>
    </div>
  );
}
